import Foundation

/// Application-wide constants
/// All static values that should never appear as hardcoded strings in the code
enum AppConstants {
    // MARK: - App Information
    static let name = "Folder Studio"
    static let bundleIdentifier = "com.umituz.Folder-Video-Studio"
    static let version = "1.0.0"
    static let buildNumber = "1"

    // MARK: - External Links
    enum Links {
        static let website = "https://github.com/umituz/Folder-Video-Studio"
        static let documentation = "https://github.com/umituz/Folder-Video-Studio#readme"
        static let issues = "https://github.com/umituz/Folder-Video-Studio/issues"
        static let remotionDocs = "https://www.remotion.dev/docs"
        static let remotionCLIInstallation = "https://www.remotion.dev/docs/cli/installation"
    }

    // MARK: - Third-Party Versions
    enum ThirdPartyVersions {
        static let remotion = "v4.0.0"
        static let nodeJS = "Node.js 20.x"
    }

    // MARK: - Default Paths & Commands
    enum Paths {
        static let defaultRemotionCLI = "/usr/local/bin/remotion"
        static let defaultOutputDirectory = NSSearchPathForDirectoriesInDomains(.moviesDirectory, .userDomainMask, true).first ?? FileManager.default.homeDirectoryForCurrentUser.path
    }

    // MARK: - Render Defaults
    enum RenderDefaults {
        static let minConcurrentRenders = 1
        static let maxConcurrentRenders = 8
        static let defaultConcurrentRenders = 2

        static let minFPS = 24
        static let maxFPS = 60

        static let defaultOutputFileName = "output.mp4"
        static let outputFileExtension = ".mp4"
    }

    // MARK: - File Extensions
    enum FileExtensions {
        static let video = "mp4"
        static let project = "fsp" // Folder Studio Project
        static let remotion = "tsx"
    }

    // MARK: - Animation Durations
    enum Animation {
        static let heroIconRotationDuration: TimeInterval = 1.5
        static let sheetFadeInDuration: TimeInterval = 0.25
        static let listRowHighlightDuration: TimeInterval = 0.2
    }

    // MARK: - UI Constants
    enum UI {
        static let minimumWindowSize = NSSize(width: 900, height: 600)
        static let sidebarWidth: CGFloat = 220
        static let renderSheetSize = NSSize(width: 520, height: 600)
        static let templatePickerSheetSize = NSSize(width: 580, height: 500)

        enum Spacing {
            static let xs: CGFloat = 4
            static let sm: CGFloat = 8
            static let md: CGFloat = 16
            static let lg: CGFloat = 24
            static let xl: CGFloat = 32
        }

        enum CornerRadius {
            static let sm: CGFloat = 6
            static let md: CGFloat = 10
            static let lg: CGFloat = 14
            static let xl: CGFloat = 18
        }
    }

    // MARK: - File System
    enum FileSystem {
        static let maxRecursionDepth = 10
        static let maxFileCountForAnalysis = 10000
    }

    // MARK: - Performance
    enum Performance {
        static let maxLogEntries = 50
        static let analysisDebounceMilliseconds = 300
    }

    // MARK: - Supported Formats
    enum SupportedFormats {
        static let imageExtensions = ["png", "jpg", "jpeg", "gif", "webp", "bmp", "tiff"]
        static let videoExtensions = ["mp4", "mov", "avi", "mkv", "webm"]
        static let documentExtensions = ["pdf", "doc", "docx", "txt", "md"]
    }
}
