import SwiftUI

struct ProjectRowCard: View {
    let project: VideoProject

    var body: some View {
        HStack(spacing: 14) {
            thumbnail
            projectInfo
            Spacer()
            statusBadge
        }
        .padding(14)
        .background(Color(NSColor.controlBackgroundColor), in: RoundedRectangle(cornerRadius: 12))
    }

    private var thumbnail: some View {
        RoundedRectangle(cornerRadius: 8)
            .fill(AppTheme.categoryColor(project.thumbnailColor).gradient)
            .frame(width: 48, height: 48)
            .overlay(
                Image(systemName: "film.fill")
                    .foregroundColor(.white.opacity(0.8))
            )
    }

    private var projectInfo: some View {
        VStack(alignment: .leading, spacing: 3) {
            Text(project.name)
                .font(.callout.weight(.semibold))
                .lineLimit(1)
            Text(project.template)
                .font(.caption)
                .foregroundColor(.secondary)
        }
    }

    private var statusBadge: some View {
        HStack(spacing: 4) {
            Image(systemName: project.status.icon)
                .font(.caption)
            Text(project.status.rawValue)
                .font(.caption)
        }
        .foregroundColor(AppTheme.categoryColor(project.status.color))
        .padding(.horizontal, 8)
        .padding(.vertical, 4)
        .background(AppTheme.categoryColor(project.status.color).opacity(0.12), in: RoundedRectangle(cornerRadius: 6))
    }
}
