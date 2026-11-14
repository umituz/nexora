import SwiftUI

// MARK: - Empty Project List View
struct EmptyProjectListView: View {
    var body: some View {
        VStack(spacing: 20) {
            Image(systemName: "film.stack")
                .font(.system(size: 48))
                .foregroundStyle(AppTheme.accentGradient)
            Text("No Projects Yet")
                .font(.title2.bold())
            Text("Create your first video project by analyzing a folder from the Dashboard.")
                .font(.body)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
                .frame(maxWidth: 320)

            Button(action: {}) {
                Label("Go to Dashboard", systemImage: "square.grid.2x2")
                    .font(.callout.weight(.semibold))
            }
            .buttonStyle(.borderedProminent)
            .tint(AppTheme.accent)
            .disabled(true) // Will be enabled when navigation is implemented
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color(NSColor.underPageBackgroundColor))
    }
}

// MARK: - Template Categories View
struct TemplateCategoriesView: View {
    @State private var selectedCategory: VideoTemplate.Category? = nil

    var body: some View {
        VStack(spacing: 20) {
            Image(systemName: "rectangle.stack.fill")
                .font(.system(size: 48))
                .foregroundStyle(AppTheme.warmGradient)
            Text("Video Templates")
                .font(.title2.bold())
            Text("Choose from our collection of professionally designed video templates.")
                .font(.body)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
                .frame(maxWidth: 320)

            VStack(spacing: 12) {
                ForEach(VideoTemplate.Category.allCases, id: \.self) { category in
                    CategoryRow(category: category, count: VideoTemplate.all.filter { $0.category == category }.count)
                }
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color(NSColor.underPageBackgroundColor))
    }
}

struct CategoryRow: View {
    let category: VideoTemplate.Category
    let count: Int

    var body: some View {
        HStack {
            Image(systemName: category.icon)
                .font(.title3)
                .foregroundStyle(AppTheme.categoryColor(category.color))
                .frame(width: 32)

            VStack(alignment: .leading, spacing: 2) {
                Text(category.rawValue)
                    .font(.system(size: 14, weight: .semibold))
                Text("\(count) templates available")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }

            Spacer()

            Image(systemName: "chevron.right")
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .padding(14)
        .background(Color(NSColor.controlBackgroundColor), in: RoundedRectangle(cornerRadius: 10))
    }
}

// MARK: - Settings Overview View
struct SettingsOverviewView: View {
    var body: some View {
        VStack(spacing: 24) {
            Image(systemName: "gearshape.fill")
                .font(.system(size: 48))
                .foregroundStyle(LinearGradient(colors: [.gray, .secondary], startPoint: .topLeading, endPoint: .bottomTrailing))

            Text("Settings")
                .font(.title2.bold())

            VStack(alignment: .leading, spacing: 16) {
                SettingLink(icon: "terminal.fill", title: "Remotion", subtitle: "CLI configuration and installation")
                SettingLink(icon: "folder.fill", title: "Output", subtitle: "Default output directory and file handling")
                SettingLink(icon: "cpu.fill", title: "Render", subtitle: "Quality, resolution, and performance settings")
                SettingLink(icon: "info.circle.fill", title: "About", subtitle: "App version and information")
            }
            .frame(maxWidth: 320)

            Spacer()

            VStack(spacing: 8) {
                HStack(spacing: 6) {
                    Image(systemName: "checkmark.circle.fill")
                        .foregroundColor(.green)
                    Text("Remotion CLI configured")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                HStack(spacing: 6) {
                    Image(systemName: "checkmark.circle.fill")
                        .foregroundColor(.green)
                    Text("Output directory ready")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color(NSColor.underPageBackgroundColor))
    }
}

struct SettingLink: View {
    let icon: String
    let title: String
    let subtitle: String

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .font(.title3)
                .foregroundStyle(AppTheme.accentGradient)
                .frame(width: 28)

            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.system(size: 13, weight: .medium))
                Text(subtitle)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }

            Spacer()

            Image(systemName: "chevron.right")
                .font(.caption2)
                .foregroundColor(.secondary.opacity(0.5))
        }
        .padding(12)
        .background(Color(NSColor.controlBackgroundColor), in: RoundedRectangle(cornerRadius: 8))
    }
}
