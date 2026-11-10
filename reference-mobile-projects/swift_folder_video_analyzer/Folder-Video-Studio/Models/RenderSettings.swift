import Foundation

struct RenderSettings: Codable {
    var remotionPath: String
    var outputDirectory: String
    var defaultResolution: Resolution
    var defaultFPS: FPS
    var defaultQuality: Quality
    var codec: Codec
    var openAfterRender: Bool
    var concurrentRenders: Int

    enum Resolution: String, CaseIterable, Codable {
        case hd = "1280x720"
        case fullHD = "1920x1080"
        case twoK = "2560x1440"
        case fourK = "3840x2160"

        var label: String {
            switch self {
            case .hd: return "HD (720p)"
            case .fullHD: return "Full HD (1080p)"
            case .twoK: return "2K (1440p)"
            case .fourK: return "4K (2160p)"
            }
        }
        var width: Int {
            switch self {
            case .hd: return 1280
            case .fullHD: return 1920
            case .twoK: return 2560
            case .fourK: return 3840
            }
        }
        var height: Int {
            switch self {
            case .hd: return 720
            case .fullHD: return 1080
            case .twoK: return 1440
            case .fourK: return 2160
            }
        }
    }

    enum FPS: Int, CaseIterable, Codable {
        case fps24 = 24
        case fps30 = 30
        case fps60 = 60

        var label: String { "\(rawValue) FPS" }
    }

    enum Quality: String, CaseIterable, Codable {
        case low = "Low"
        case medium = "Medium"
        case high = "High"
        case lossless = "Lossless"

        var crf: Int {
            switch self {
            case .low: return 35
            case .medium: return 25
            case .high: return 18
            case .lossless: return 0
            }
        }
    }

    enum Codec: String, CaseIterable, Codable {
        case h264 = "H.264"
        case h265 = "H.265"
        case vp9 = "VP9"
        case prores = "ProRes"
    }

    init(
        remotionPath: String = AppConstants.Paths.defaultRemotionCLI,
        outputDirectory: String = AppConstants.Paths.defaultOutputDirectory,
        defaultResolution: Resolution = .fullHD,
        defaultFPS: FPS = .fps30,
        defaultQuality: Quality = .high,
        codec: Codec = .h264,
        openAfterRender: Bool = true,
        concurrentRenders: Int = AppConstants.RenderDefaults.defaultConcurrentRenders
    ) {
        self.remotionPath = remotionPath
        self.outputDirectory = outputDirectory
        self.defaultResolution = defaultResolution
        self.defaultFPS = defaultFPS
        self.defaultQuality = defaultQuality
        self.codec = codec
        self.openAfterRender = openAfterRender
        self.concurrentRenders = concurrentRenders
    }
}
