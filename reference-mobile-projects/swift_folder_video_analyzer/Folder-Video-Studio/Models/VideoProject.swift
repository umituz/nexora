import Foundation
import SwiftUI

struct TemplateParams: Codable, Equatable {
    var title: String
    var subtitle: String
    var accentColorHex: String
    var backgroundColor: String
    var showFileCount: Bool
    var showFolderTree: Bool
    var animationStyle: AnimationStyle
    var fontStyle: FontStyle
    var logoText: String

    enum AnimationStyle: String, CaseIterable, Codable {
        case smooth = "Smooth"
        case dynamic = "Dynamic"
        case minimal = "Minimal"
        case cinematic = "Cinematic"
    }

    enum FontStyle: String, CaseIterable, Codable {
        case modern = "Modern"
        case classic = "Classic"
        case bold = "Bold"
        case light = "Light"
    }

    init(
        title: String,
        subtitle: String,
        accentColorHex: String = "#5B72FF",
        backgroundColor: String = "dark",
        showFileCount: Bool = true,
        showFolderTree: Bool = true,
        animationStyle: AnimationStyle = .smooth,
        fontStyle: FontStyle = .modern,
        logoText: String = ""
    ) {
        self.title = title
        self.subtitle = subtitle
        self.accentColorHex = accentColorHex
        self.backgroundColor = backgroundColor
        self.showFileCount = showFileCount
        self.showFolderTree = showFolderTree
        self.animationStyle = animationStyle
        self.fontStyle = fontStyle
        self.logoText = logoText
    }
}

struct VideoProject: Identifiable, Codable {
    let id: UUID
    var name: String
    let folderPath: String
    var status: Status
    let createdAt: Date
    var duration: String
    let template: String
    var thumbnailColor: String
    var params: TemplateParams
    var outputVideoURL: String?

    init(
        id: UUID = UUID(),
        name: String,
        folderPath: String,
        status: Status,
        createdAt: Date,
        duration: String,
        template: String,
        thumbnailColor: String,
        params: TemplateParams,
        outputVideoURL: String? = nil
    ) {
        self.id = id
        self.name = name
        self.folderPath = folderPath
        self.status = status
        self.createdAt = createdAt
        self.duration = duration
        self.template = template
        self.thumbnailColor = thumbnailColor
        self.params = params
        self.outputVideoURL = outputVideoURL
    }

        enum Status: String, Codable {
        case draft = "Draft"
        case rendering = "Rendering"
        case completed = "Completed"
        case failed = "Failed"

        var icon: String {
            switch self {
            case .draft: return "pencil.circle.fill"
            case .rendering: return "arrow.triangle.2.circlepath.circle.fill"
            case .completed: return "checkmark.circle.fill"
            case .failed: return "xmark.circle.fill"
            }
        }

        var color: String {
            switch self {
            case .draft: return "gray"
            case .rendering: return "blue"
            case .completed: return "green"
            case .failed: return "red"
            }
        }
    }

    // Validation
    func validate() -> Bool {
        !name.isEmpty && !folderPath.isEmpty && !template.isEmpty
    }
}
