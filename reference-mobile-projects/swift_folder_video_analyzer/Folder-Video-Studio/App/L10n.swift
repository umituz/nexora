import Foundation

// MARK: - Localization Helper
/// Provides type-safe access to localized strings
enum L10n {
    // MARK: App
    enum App {
        static var name: String { AppConstants.name }
        static var version: String { "Version \(AppConstants.version)" }
        static let tagline = NSLocalizedString("L10n.App.Tagline", bundle: .main, comment: "Application tagline shown in About section")
    }

    // MARK: Sidebar
    enum Sidebar {
        static let dashboard = NSLocalizedString("L10n.Sidebar.Dashboard", bundle: .main, comment: "Sidebar tab: Dashboard")
        static let projects = NSLocalizedString("L10n.Sidebar.Projects", bundle: .main, comment: "Sidebar tab: Projects")
        static let templates = NSLocalizedString("L10n.Sidebar.Templates", bundle: .main, comment: "Sidebar tab: Templates")
        static let settings = NSLocalizedString("L10n.Sidebar.Settings", bundle: .main, comment: "Sidebar tab: Settings")
        static let openFolder = NSLocalizedString("L10n.Sidebar.OpenFolder", bundle: .main, comment: "Button: Open Folder")
    }

    // MARK: Dashboard
    enum Dashboard {
        enum Hero {
            static let titleDefault = NSLocalizedString("L10n.Dashboard.Hero.TitleDefault", bundle: .main, comment: "Default hero title when no folder selected")
            static let titleAnalyzing = NSLocalizedString("L10n.Dashboard.Hero.TitleAnalyzing", bundle: .main, comment: "Hero title during analysis")
            static let subtitleDefault = NSLocalizedString("L10n.Dashboard.Hero.SubtitleDefault", bundle: .main, comment: "Default hero subtitle")
            static let subtitleAnalyzing = NSLocalizedString("L10n.Dashboard.Hero.SubtitleAnalyzing", bundle: .main, comment: "Subtitle during analysis")
            static let subtitleReady = NSLocalizedString("L10n.Dashboard.Hero.SubtitleReady", bundle: .main, comment: "Subtitle when analysis is complete")
            static let selectFolder = NSLocalizedString("L10n.Dashboard.Hero.SelectFolder", bundle: .main, comment: "Button: Select Folder")

            static func folderName(_ name: String) -> String {
                return String(format: NSLocalizedString("L10n.Dashboard.Hero.FolderName", bundle: .main, comment: "Folder name with icon placeholder"), name)
            }
        }

        enum Stats {
            static let totalProjects = NSLocalizedString("L10n.Dashboard.Stats.TotalProjects", bundle: .main, comment: "Stat: Total Projects")
            static let completed = NSLocalizedString("L10n.Dashboard.Stats.Completed", bundle: .main, comment: "Stat: Completed")
            static let processing = NSLocalizedString("L10n.Dashboard.Stats.Processing", bundle: .main, comment: "Stat: Processing")
            static let drafts = NSLocalizedString("L10n.Dashboard.Stats.Drafts", bundle: .main, comment: "Stat: Drafts")
        }

        enum Sections {
            static let recentProjects = NSLocalizedString("L10n.Dashboard.Sections.RecentProjects", bundle: .main, comment: "Section header: Recent Projects")
            static let folderAnalysis = NSLocalizedString("L10n.Dashboard.Sections.FolderAnalysis", bundle: .main, comment: "Section header: Folder Analysis")
        }
    }

    // MARK: Folder Analysis
    enum FolderAnalysis {
        static let noFolderSelected = NSLocalizedString("L10n.FolderAnalysis.NoFolderSelected", bundle: .main, comment: "Message when no folder is selected")
        static let selectFolderHint = NSLocalizedString("L10n.FolderAnalysis.SelectFolderHint", bundle: .main, comment: "Hint text for folder selection")
        static let selectFolder = NSLocalizedString("L10n.FolderAnalysis.SelectFolder", bundle: .main, comment: "Button: Select Folder")

        enum Stats {
            static let files = NSLocalizedString("L10n.FolderAnalysis.Stats.Files", bundle: .main, comment: "Stat label: Files")
            static let size = NSLocalizedString("L10n.FolderAnalysis.Stats.Size", bundle: .main, comment: "Stat label: Size")
            static let depth = NSLocalizedString("L10n.FolderAnalysis.Stats.Depth", bundle: .main, comment: "Stat label: Depth")
        }

        enum Sections {
            static let fileTypes = NSLocalizedString("L10n.FolderAnalysis.Sections.FileTypes", bundle: .main, comment: "Section header: File Types")
            static let topExtensions = NSLocalizedString("L10n.FolderAnalysis.Sections.TopExtensions", bundle: .main, comment: "Section header: Top Extensions")
        }

        enum Actions {
            static let selectTemplate = NSLocalizedString("L10n.FolderAnalysis.Actions.SelectTemplate", bundle: .main, comment: "Button: Select Template & Generate Video")
        }

        enum TemplatePicker {
            static let title = NSLocalizedString("L10n.FolderAnalysis.TemplatePicker.Title", bundle: .main, comment: "Template picker sheet title")
            static let subtitle = NSLocalizedString("L10n.FolderAnalysis.TemplatePicker.Subtitle", bundle: .main, comment: "Template picker sheet subtitle")
            static func subtitleForFolder(_ name: String) -> String {
                return String(format: NSLocalizedString("L10n.FolderAnalysis.TemplatePicker.SubtitleForFolder", bundle: .main, comment: "Template picker subtitle with folder name"), name)
            }
        }
    }

    // MARK: Projects
    enum Projects {
        static let title = NSLocalizedString("L10n.Projects.Title", bundle: .main, comment: "Projects section title")
        static let noProjects = NSLocalizedString("L10n.Projects.NoProjects", bundle: .main, comment: "Message when no projects exist")
        static let noProjectsHint = NSLocalizedString("L10n.Projects.NoProjectsHint", bundle: .main, comment: "Hint text for creating projects")
        static let delete = NSLocalizedString("L10n.Projects.Delete", bundle: .main, comment: "Button: Delete project")
        static let selectProject = NSLocalizedString("L10n.Projects.SelectProject", bundle: .main, comment: "Empty state: Select a project")
        static let selectProjectHint = NSLocalizedString("L10n.Projects.SelectProjectHint", bundle: .main, comment: "Hint text for project selection")

        enum Detail {
            enum Hero {
                static let render = NSLocalizedString("L10n.Projects.Detail.Hero.Render", bundle: .main, comment: "Button: Render")
                static let rendering = NSLocalizedString("L10n.Projects.Detail.Hero.Rendering", bundle: .main, comment: "Button text: Rendering...")
                static let edit = NSLocalizedString("L10n.Projects.Detail.Hero.Edit", bundle: .main, comment: "Button: Edit")
                static let play = NSLocalizedString("L10n.Projects.Detail.Hero.Play", bundle: .main, comment: "Button: Play")
            }

            enum Info {
                static let folder = NSLocalizedString("L10n.Projects.Detail.Info.Folder", bundle: .main, comment: "Info label: Folder")
                static let created = NSLocalizedString("L10n.Projects.Detail.Info.Created", bundle: .main, comment: "Info label: Created")
                static let duration = NSLocalizedString("L10n.Projects.Detail.Info.Duration", bundle: .main, comment: "Info label: Duration")
                static let template = NSLocalizedString("L10n.Projects.Detail.Info.Template", bundle: .main, comment: "Info label: Template")
            }

            enum Params {
                static let title = NSLocalizedString("L10n.Projects.Detail.Params.Title", bundle: .main, comment: "Section header: Template Parameters")
                static let edit = NSLocalizedString("L10n.Projects.Detail.Params.Edit", bundle: .main, comment: "Button: Edit parameters")
                static let titleLabel = NSLocalizedString("L10n.Projects.Detail.Params.TitleLabel", bundle: .main, comment: "Param label: Title")
                static let subtitleLabel = NSLocalizedString("L10n.Projects.Detail.Params.SubtitleLabel", bundle: .main, comment: "Param label: Subtitle")
                static let animation = NSLocalizedString("L10n.Projects.Detail.Params.Animation", bundle: .main, comment: "Param label: Animation")
                static let font = NSLocalizedString("L10n.Projects.Detail.Params.Font", bundle: .main, comment: "Param label: Font")
                static let background = NSLocalizedString("L10n.Projects.Detail.Params.Background", bundle: .main, comment: "Param label: Background")
                static let accent = NSLocalizedString("L10n.Projects.Detail.Params.Accent", bundle: .main, comment: "Param label: Accent")
                static let empty = NSLocalizedString("L10n.Projects.Detail.Params.Empty", bundle: .main, comment: "Empty value placeholder")

                enum Background {
                    static let dark = NSLocalizedString("L10n.Projects.Detail.Params.Background.Dark", bundle: .main, comment: "Background style: Dark")
                    static let light = NSLocalizedString("L10n.Projects.Detail.Params.Background.Light", bundle: .main, comment: "Background style: Light")
                    static let gradient = NSLocalizedString("L10n.Projects.Detail.Params.Background.Gradient", bundle: .main, comment: "Background style: Gradient")
                    static let glass = NSLocalizedString("L10n.Projects.Detail.Params.Background.Glass", bundle: .main, comment: "Background style: Glass Effect")
                }
            }

            enum Render {
                static let progress = NSLocalizedString("L10n.Projects.Detail.Render.Progress", bundle: .main, comment: "Section header: Render Progress")
                static let log = NSLocalizedString("L10n.Projects.Detail.Render.Log", bundle: .main, comment: "Section header: Render Log")
                static func frameProgress(_ current: Int, _ total: Int) -> String {
                    return String(format: NSLocalizedString("L10n.Projects.Detail.Render.FrameProgress", bundle: .main, comment: "Frame progress display"), current, total)
                }
                static let openInFinder = NSLocalizedString("L10n.Projects.Detail.Render.OpenInFinder", bundle: .main, comment: "Button: Open in Finder")
            }
        }
    }

    // MARK: Render
    enum Render {
        static let start = NSLocalizedString("L10n.Render.Start", bundle: .main, comment: "Button: Start Render")
        static let starting = NSLocalizedString("L10n.Render.Starting", bundle: .main, comment: "Button text: Starting...")
        static let cancel = NSLocalizedString("L10n.Render.Cancel", bundle: .main, comment: "Button: Cancel render")
        static let showInFinder = NSLocalizedString("L10n.Render.ShowInFinder", bundle: .main, comment: "Button: Show in Finder")
        static let play = NSLocalizedString("L10n.Render.Play", bundle: .main, comment: "Button: Play video")

        enum Sheet {
            static let title = NSLocalizedString("L10n.Render.Sheet.Title", bundle: .main, comment: "Render sheet title")
            static let settings = NSLocalizedString("L10n.Render.Sheet.Settings", bundle: .main, comment: "Section header: Render Settings")
            static let progress = NSLocalizedString("L10n.Render.Sheet.Progress", bundle: .main, comment: "Section header: Progress")
            static let log = NSLocalizedString("L10n.Render.Sheet.Log", bundle: .main, comment: "Section header: Render Log")
            static let completed = NSLocalizedString("L10n.Render.Sheet.Completed", bundle: .main, comment: "Status: Completed")
            static let processing = NSLocalizedString("L10n.Render.Sheet.Processing", bundle: .main, comment: "Status: Processing...")
        }

        enum Settings {
            static let resolution = NSLocalizedString("L10n.Render.Settings.Resolution", bundle: .main, comment: "Setting label: Resolution")
            static let fps = NSLocalizedString("L10n.Render.Settings.FPS", bundle: .main, comment: "Setting label: FPS")
            static let quality = NSLocalizedString("L10n.Render.Settings.Quality", bundle: .main, comment: "Setting label: Quality")
            static let codec = NSLocalizedString("L10n.Render.Settings.Codec", bundle: .main, comment: "Setting label: Codec")
        }

        enum Log {
            static func started(_ project: String) -> String {
                return String(format: NSLocalizedString("L10n.Render.Log.Started", bundle: .main, comment: "Log: Render started"), project)
            }
            static func folder(_ path: String) -> String {
                return String(format: NSLocalizedString("L10n.Render.Log.Folder", bundle: .main, comment: "Log: Folder path"), path)
            }
            static func template(_ name: String) -> String {
                return String(format: NSLocalizedString("L10n.Render.Log.Template", bundle: .main, comment: "Log: Template name"), name)
            }
            static func resolution(_ value: String) -> String {
                return String(format: NSLocalizedString("L10n.Render.Log.Resolution", bundle: .main, comment: "Log: Resolution value"), value)
            }
            static func fps(_ value: String) -> String {
                return String(format: NSLocalizedString("L10n.Render.Log.FPS", bundle: .main, comment: "Log: FPS value"), value)
            }
            static func frameProgress(_ frame: Int, _ total: Int, _ percent: Int) -> String {
                return String(format: NSLocalizedString("L10n.Render.Log.FrameProgress", bundle: .main, comment: "Log: Frame progress"), frame, total, percent)
            }
            static func output(_ path: String) -> String {
                return String(format: NSLocalizedString("L10n.Render.Log.Output", bundle: .main, comment: "Log: Output path"), path)
            }
            static func projectTitle(_ title: String) -> String {
                return String(format: NSLocalizedString("L10n.Render.Log.ProjectTitle", bundle: .main, comment: "Log: Project title"), title)
            }
        }
    }

    // MARK: Settings
    enum Settings {
        static let title = NSLocalizedString("L10n.Settings.Title", bundle: .main, comment: "Settings section title")

        enum Sections {
            static let remotion = NSLocalizedString("L10n.Settings.Sections.Remotion", bundle: .main, comment: "Settings section: Remotion")
            static let output = NSLocalizedString("L10n.Settings.Sections.Output", bundle: .main, comment: "Settings section: Output")
            static let render = NSLocalizedString("L10n.Settings.Sections.Render", bundle: .main, comment: "Settings section: Render")
            static let about = NSLocalizedString("L10n.Settings.Sections.About", bundle: .main, comment: "Settings section: About")
        }

        enum Remotion {
            static let title = NSLocalizedString("L10n.Settings.Remotion.Title", bundle: .main, comment: "Section title: Remotion Configuration")
            static let cliPath = NSLocalizedString("L10n.Settings.Remotion.CliPath", bundle: .main, comment: "Setting label: Remotion CLI Path")
            static let statusReady = NSLocalizedString("L10n.Settings.Remotion.StatusReady", bundle: .main, comment: "Status: Remotion Ready")
            static let verifyPath = NSLocalizedString("L10n.Settings.Remotion.VerifyPath", bundle: .main, comment: "Button: Verify Path")
            static let installGuide = NSLocalizedString("L10n.Settings.Remotion.InstallGuide", bundle: .main, comment: "Section: Installation Guide")
            static let installHint = NSLocalizedString("L10n.Settings.Remotion.InstallHint", bundle: .main, comment: "Installation hint text")
        }

        enum Output {
            static let title = NSLocalizedString("L10n.Settings.Output.Title", bundle: .main, comment: "Section title: Output Settings")
            static let folder = NSLocalizedString("L10n.Settings.Output.Folder", bundle: .main, comment: "Setting label: Output Folder")
            static let change = NSLocalizedString("L10n.Settings.Output.Change", bundle: .main, comment: "Button: Change")
            static let openAfterRender = NSLocalizedString("L10n.Settings.Output.OpenAfterRender", bundle: .main, comment: "Setting label: Open After Render")
            static let concurrentRenders = NSLocalizedString("L10n.Settings.Output.ConcurrentRenders", bundle: .main, comment: "Setting label: Concurrent Renders")
        }

        enum Render {
            static let title = NSLocalizedString("L10n.Settings.Render.Title", bundle: .main, comment: "Section title: Render Settings")
            static let defaultResolution = NSLocalizedString("L10n.Settings.Render.DefaultResolution", bundle: .main, comment: "Setting label: Default Resolution")
            static let defaultFps = NSLocalizedString("L10n.Settings.Render.DefaultFps", bundle: .main, comment: "Setting label: Default FPS")
        }

        enum About {
            static let title = NSLocalizedString("L10n.Settings.About.Title", bundle: .main, comment: "About section title")
            static let description = NSLocalizedString("L10n.Settings.About.Description", bundle: .main, comment: "App description in About section")
        }
    }

    // MARK: File Picker
    enum FilePicker {
        static let selectFolder = NSLocalizedString("L10n.FilePicker.SelectFolder", bundle: .main, comment: "File picker prompt: Select folder to analyze")
        static let choose = NSLocalizedString("L10n.FilePicker.Choose", bundle: .main, comment: "File picker button: Choose")
    }

    // MARK: Icons
    /// SF Symbols icon names - kept separate from text
    enum Icons {
        static let folder = "folder.fill"
        static let folderBadge = "folder.badge.plus"
        static let film = "film.fill"
        static let filmStack = "film.stack.fill"
        static let checkmark = "checkmark.circle.fill"
        static let processing = "arrow.triangle.2.circlepath"
        static let pencil = "pencil.circle.fill"
        static let play = "play.fill"
        static let settings = "gearshape"
        static let dashboard = "square.grid.2x2"
        static let projects = "film.stack"
        static let templates = "rectangle.stack"
    }
}
