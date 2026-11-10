import SwiftUI

struct ProjectListRow: View {
    let project: VideoProject
    let isSelected: Bool

    var body: some View {
        HStack(spacing: 12) {
            thumbnail
            info
            Spacer()
            statusBadge
        }
        .padding(10)
        .background(
            RoundedRectangle(cornerRadius: 10)
                .fill(isSelected ? AppTheme.accent.opacity(0.12) : Color.clear)
                .overlay(
                    RoundedRectangle(cornerRadius: 10)
                        .stroke(isSelected ? AppTheme.accent.opacity(0.4) : Color.clear, lineWidth: 1)
                )
        )
        .contentShape(Rectangle())
    }

    private var thumbnail: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 8)
                .fill(AppTheme.categoryColor(project.thumbnailColor).opacity(0.2))
                .frame(width: 44, height: 44)
            Image(systemName: "film.fill")
                .foregroundColor(AppTheme.categoryColor(project.thumbnailColor))
                .font(.system(size: 18))
        }
    }

    private var info: some View {
        VStack(alignment: .leading, spacing: 3) {
            Text(project.name)
                .font(.system(size: 13, weight: .medium))
                .lineLimit(2)
            Text(project.template)
                .font(.caption)
                .foregroundColor(.secondary)
        }
    }

    private var statusBadge: some View {
        Image(systemName: project.status.icon)
            .foregroundColor(AppTheme.categoryColor(project.status.color))
            .font(.system(size: 14))
    }
}
