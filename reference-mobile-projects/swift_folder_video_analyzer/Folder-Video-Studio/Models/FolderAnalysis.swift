import Foundation

struct FolderAnalysis: Identifiable {
    let id = UUID()
    let folderName: String
    let totalFiles: Int
    let totalSize: String
    let fileBreakdown: [FileCategory]
    let topExtensions: [ExtensionInfo]
    let folderDepth: Int
    let createdDate: Date

    struct FileCategory: Identifiable {
        let id = UUID()
        let name: String
        let count: Int
        let icon: String
        let color: String
    }

    struct ExtensionInfo: Identifiable {
        let id = UUID()
        let ext: String
        let count: Int
        let percentage: Double
    }
}
