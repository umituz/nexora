import SwiftUI

struct EmptyAnalysisCard: View {
    let onSelect: () -> Void

    var body: some View {
        VStack(spacing: 16) {
            Image(systemName: "folder.badge.questionmark")
                .font(.system(size: 40))
                .foregroundStyle(AppTheme.accentGradient)
            Text(L10n.FolderAnalysis.noFolderSelected)
                .font(.callout.weight(.medium))
            Text(L10n.FolderAnalysis.selectFolderHint)
                .font(.caption)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
            Button(action: onSelect) {
                Label(L10n.FolderAnalysis.selectFolder, systemImage: "folder.badge.plus")
                    .padding(.horizontal, 14)
                    .padding(.vertical, 6)
            }
            .buttonStyle(.borderedProminent)
            .tint(AppTheme.accent)
        }
        .padding(28)
        .frame(maxWidth: .infinity)
        .background(Color(NSColor.controlBackgroundColor), in: RoundedRectangle(cornerRadius: 14))
    }
}
