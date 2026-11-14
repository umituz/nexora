import Foundation
import Combine

final class RenderService: ObservableObject {
    @Published var isRendering = false
    @Published var progress: Double = 0
    @Published var currentFrame: Int = 0
    @Published var totalFrames: Int = 0
    @Published var renderLog: [String] = []
    @Published var lastOutputURL: URL?
    @Published var renderError: RenderError?

    enum RenderError: LocalizedError {
        case cliNotFound(String)
        case invalidOutputDirectory
        case renderFailed(Int)
        case processNotConfigured

        var errorDescription: String? {
            switch self {
            case .cliNotFound(let path):
                "Remotion CLI not found at: \(path)\nPlease install Remotion CLI: npm install -g @remotion/cli"
            case .invalidOutputDirectory:
                "Output directory is invalid or not writable"
            case .renderFailed(let code):
                "Render failed with exit code: \(code)"
            case .processNotConfigured:
                "Render process is not properly configured"
            }
        }
    }

    private var renderProcess: Process?
    private var outputPipe: Pipe?
    private var errorPipe: Pipe?

    // MARK: - Public

    func startRender(project: VideoProject, settings: RenderSettings) {
        guard !isRendering else { return }

        // Validate preconditions
        guard validateRenderSettings(settings) else {
            return
        }

        isRendering = true
        progress = 0
        currentFrame = 0
        renderError = nil
        renderLog = []
        lastOutputURL = nil

        let fps = settings.defaultFPS.rawValue
        let durationSec = parseDuration(project.duration)
        totalFrames = durationSec * fps > 0 ? durationSec * fps : 900

        addLog(L10n.Render.Log.started(project.name))
        addLog(L10n.Render.Log.folder(project.folderPath))
        addLog(L10n.Render.Log.template(project.template))
        addLog(L10n.Render.Log.resolution(settings.defaultResolution.rawValue))
        addLog(L10n.Render.Log.fps(settings.defaultFPS.label))
        addLog(L10n.Render.Log.projectTitle(project.params.title))

        let outputDir = URL(fileURLWithPath: settings.outputDirectory)
        let safeName = project.name.replacingOccurrences(of: " ", with: "_")
        let outputURL = outputDir.appendingPathComponent("\(safeName)_\(AppConstants.RenderDefaults.defaultOutputFileName)")

        // Validate Remotion CLI
        guard canRunProcess(at: settings.remotionPath) else {
            renderError = .cliNotFound(settings.remotionPath)
            addLog("ERROR: \(RenderError.cliNotFound(settings.remotionPath).errorDescription ?? "Unknown error")")
            isRendering = false
            return
        }

        // Run actual Remotion process
        runRemotionProcess(project: project, settings: settings, outputURL: outputURL)
    }

    func cancelRender() {
        renderProcess?.terminate()
        renderProcess = nil
        isRendering = false
        progress = 0
        addLog("Render cancelled.")
    }

    // MARK: - Validation

    private func validateRenderSettings(_ settings: RenderSettings) -> Bool {
        // Check if CLI exists
        guard canRunProcess(at: settings.remotionPath) else {
            renderError = .cliNotFound(settings.remotionPath)
            return false
        }

        // Check if output directory exists or can be created
        let outputDir = URL(fileURLWithPath: settings.outputDirectory)
        if FileManager.default.fileExists(atPath: settings.outputDirectory) {
            return true
        }

        do {
            try FileManager.default.createDirectory(at: outputDir, withIntermediateDirectories: true)
            return true
        } catch {
            renderError = .invalidOutputDirectory
            addLog("ERROR: Cannot create output directory: \(settings.outputDirectory)")
            return false
        }
    }

    // MARK: - Real Remotion Process

    private func runRemotionProcess(project: VideoProject, settings: RenderSettings, outputURL: URL) {
        let outputDir = outputURL.deletingLastPathComponent()

        do {
            try FileManager.default.createDirectory(at: outputDir, withIntermediateDirectories: true)
        } catch {
            renderError = .invalidOutputDirectory
            addLog("ERROR: Cannot create output directory: \(outputDir.path)")
            isRendering = false
            return
        }

        let process = Process()
        process.executableURL = URL(fileURLWithPath: settings.remotionPath)

        let crfFlag = "--crf=\(settings.defaultQuality.crf)"
        let width = settings.defaultResolution.width
        let height = settings.defaultResolution.height
        let fps = settings.defaultFPS.rawValue
        let propsJSON = buildPropsJSON(project: project)

        process.arguments = [
            "render",
            "--composition=\(compositionId(for: project.template))",
            "--output=\(outputURL.path)",
            "--width=\(width)",
            "--height=\(height)",
            "--fps=\(fps)",
            crfFlag,
            "--log=verbose",
            "--props=\(propsJSON)"
        ]

        process.environment = ProcessInfo.processInfo.environment

        let outPipe = Pipe()
        let errPipe = Pipe()
        process.standardOutput = outPipe
        process.standardError = errPipe
        outputPipe = outPipe
        errorPipe = errPipe
        renderProcess = process

        outPipe.fileHandleForReading.readabilityHandler = { [weak self] handle in
            let data = handle.availableData
            guard !data.isEmpty, let line = String(data: data, encoding: .utf8) else { return }
            self?.handleRemotionOutput(line, outputURL: outputURL)
        }

        errPipe.fileHandleForReading.readabilityHandler = { [weak self] handle in
            let data = handle.availableData
            guard !data.isEmpty, let line = String(data: data, encoding: .utf8) else { return }
            self?.handleRemotionOutput(line, outputURL: outputURL)
        }

        process.terminationHandler = { [weak self] proc in
            DispatchQueue.main.async {
                self?.outputPipe?.fileHandleForReading.readabilityHandler = nil
                self?.errorPipe?.fileHandleForReading.readabilityHandler = nil
                if proc.terminationStatus == 0 {
                    self?.finishRender(outputURL: outputURL)
                } else {
                    let code = proc.terminationStatus
                    self?.renderError = .renderFailed(Int(code))
                    self?.addLog("ERROR: Render terminated with error code: \(code)")
                    self?.isRendering = false
                }
            }
        }

        do {
            try process.run()
            addLog("Remotion process started (PID: \(process.processIdentifier))")
        } catch {
            renderError = .processNotConfigured
            addLog("ERROR: Failed to start Remotion process: \(error.localizedDescription)")
            isRendering = false
        }
    }

    private func handleRemotionOutput(_ line: String, outputURL: URL) {
        let trimmed = line.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return }

        DispatchQueue.main.async { [weak self] in
            guard let self else { return }
            self.addLog(trimmed)
            // Match "Rendering frame 42/900"
            if let match = trimmed.range(of: #"Rendering frame (\d+)/(\d+)"#, options: .regularExpression) {
                let sub = String(trimmed[match])
                let nums = sub.components(separatedBy: CharacterSet.decimalDigits.inverted).filter { !$0.isEmpty }
                if nums.count >= 2, let cur = Int(nums[0]), let total = Int(nums[1]) {
                    self.currentFrame = cur
                    self.totalFrames = total
                    self.progress = total > 0 ? Double(cur) / Double(total) : 0
                }
            }
        }
    }

    // MARK: - Helpers

    private func finishRender(outputURL: URL) {
        lastOutputURL = outputURL
        addLog("Render completed successfully!")
        addLog(L10n.Render.Log.output(outputURL.path))
        isRendering = false
        progress = 1.0
    }

    private func addLog(_ message: String) {
        let ts = DateFormatter.localizedString(from: Date(), dateStyle: .none, timeStyle: .medium)
        DispatchQueue.main.async { [weak self] in
            self?.renderLog.append("[\(ts)] \(message)")
        }
    }

    private func parseDuration(_ duration: String) -> Int {
        guard duration != "—" else { return 30 }
        let parts = duration.split(separator: ":").compactMap { Int($0) }
        guard parts.count == 2 else { return 30 }
        return parts[0] * 60 + parts[1]
    }

    private func canRunProcess(at path: String) -> Bool {
        FileManager.default.isExecutableFile(atPath: path)
    }

    private func compositionId(for template: String) -> String {
        switch template {
        case "Tech Showcase": return "TechShowcase"
        case "Creative Flow": return "CreativeFlow"
        case "Developer Reel": return "DeveloperReel"
        case "Business Report": return "BusinessReport"
        case "Minimal Showcase": return "MinimalShowcase"
        case "Vertical Story": return "VerticalStory"
        default: return template.replacingOccurrences(of: " ", with: "")
        }
    }

    private func buildPropsJSON(project: VideoProject) -> String {
        let p = project.params
        let dict: [String: Any] = [
            "folderPath": project.folderPath,
            "title": p.title,
            "subtitle": p.subtitle,
            "accentColor": p.accentColorHex,
            "backgroundColor": p.backgroundColor,
            "showFileCount": p.showFileCount,
            "showFolderTree": p.showFolderTree,
            "animationStyle": p.animationStyle.rawValue,
            "fontStyle": p.fontStyle.rawValue,
            "logoText": p.logoText
        ]
        if let data = try? JSONSerialization.data(withJSONObject: dict),
           let str = String(data: data, encoding: .utf8) {
            return str
        }
        return "{}"
    }
}

// MARK: - LocalizedError Protocol

extension RenderService.RenderError {
    var recoverySuggestion: String? {
        switch self {
        case .cliNotFound:
            "Install Remotion CLI: npm install -g @remotion/cli"
        case .invalidOutputDirectory:
            "Choose a different output directory in Settings"
        case .renderFailed:
            "Check Remotion logs and ensure template is compatible"
        case .processNotConfigured:
            "Verify Remotion installation and restart the app"
        }
    }
}
