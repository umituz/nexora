import Foundation

struct FolderAnalyzer {
    static func analyze(url: URL) -> FolderAnalysis {
        let fm = FileManager.default
        let folderName = url.lastPathComponent

        var totalFiles = 0
        var totalBytes: Int64 = 0
        var extensionCounts: [String: Int] = [:]
        var imageCt = 0, videoCt = 0, docCt = 0, codeCt = 0, otherCt = 0
        var maxDepth = 0

        let imageExts = Set(AppConstants.SupportedFormats.imageExtensions)
        let videoExts = Set(AppConstants.SupportedFormats.videoExtensions)
        let docExts = Set(AppConstants.SupportedFormats.documentExtensions)

        if let enumerator = fm.enumerator(at: url, includingPropertiesForKeys: [.fileSizeKey, .isDirectoryKey], options: [.skipsHiddenFiles]) {
            for case let fileURL as URL in enumerator {
                let resourceValues = try? fileURL.resourceValues(forKeys: [.fileSizeKey, .isDirectoryKey])
                if resourceValues?.isDirectory == true {
                    let depth = fileURL.pathComponents.count - url.pathComponents.count
                    maxDepth = max(maxDepth, depth)
                    continue
                }
                totalFiles += 1
                totalBytes += Int64(resourceValues?.fileSize ?? 0)

                let ext = fileURL.pathExtension.lowercased()
                extensionCounts[ext, default: 0] += 1

                if imageExts.contains(ext) { imageCt += 1 }
                else if videoExts.contains(ext) { videoCt += 1 }
                else if docExts.contains(ext) { docCt += 1 }
                else if ["swift","js","ts","py","rb","java","cpp","c","h","html","css","json","xml","yml","yaml","go","rs","kt","dart","php"].contains(ext) { codeCt += 1 }
                else { otherCt += 1 }
            }
        }

        let sizeStr = ByteCountFormatter.string(fromByteCount: totalBytes, countStyle: .file)
        let total = max(totalFiles, 1)

        let topExts = extensionCounts.sorted { $0.value > $1.value }
            .prefix(5)
            .map { FolderAnalysis.ExtensionInfo(ext: ".\($0.key)", count: $0.value, percentage: Double($0.value) / Double(total)) }

        let breakdown = [
            FolderAnalysis.FileCategory(name: "Images", count: imageCt, icon: "photo.fill", color: "blue"),
            FolderAnalysis.FileCategory(name: "Videos", count: videoCt, icon: "video.fill", color: "purple"),
            FolderAnalysis.FileCategory(name: "Documents", count: docCt, icon: "doc.fill", color: "orange"),
            FolderAnalysis.FileCategory(name: "Code", count: codeCt, icon: "chevron.left.forwardslash.chevron.right", color: "green"),
            FolderAnalysis.FileCategory(name: "Other", count: otherCt, icon: "folder.fill", color: "gray")
        ]

        return FolderAnalysis(
            folderName: folderName,
            totalFiles: totalFiles,
            totalSize: sizeStr,
            fileBreakdown: breakdown,
            topExtensions: Array(topExts),
            folderDepth: min(maxDepth, AppConstants.FileSystem.maxRecursionDepth),
            createdDate: Date()
        )
    }
}
