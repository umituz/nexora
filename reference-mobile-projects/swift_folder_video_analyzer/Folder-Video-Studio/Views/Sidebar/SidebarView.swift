import SwiftUI

struct SidebarView: View {
    @EnvironmentObject var appState: AppState

    var body: some View {
        VStack(spacing: 0) {
            brandHeader
            Divider()
            tabList
            Spacer()
            folderButton
        }
        .background(Color(NSColor.windowBackgroundColor))
    }

    private var brandHeader: some View {
        HStack(spacing: 10) {
            Image(systemName: "film.fill")
                .font(.title2)
                .foregroundStyle(AppTheme.accentGradient)
            Text(L10n.App.name)
                .font(.headline)
                .fontWeight(.bold)
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 14)
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    private var tabList: some View {
        VStack(spacing: 2) {
            ForEach(SidebarTab.allCases) { tab in
                SidebarItem(tab: tab, isSelected: appState.selectedTab == tab) {
                    appState.selectedTab = tab
                }
            }
        }
        .padding(.horizontal, 10)
        .padding(.top, 10)
    }

    private var folderButton: some View {
        Button(action: { appState.selectFolder() }) {
            Label(L10n.Sidebar.openFolder, systemImage: "folder.badge.plus")
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(.horizontal, 12)
                .padding(.vertical, 8)
                .background(AppTheme.accent.opacity(0.12), in: RoundedRectangle(cornerRadius: 8))
        }
        .buttonStyle(.plain)
        .padding(.horizontal, 10)
        .padding(.bottom, 12)
    }
}

struct SidebarItem: View {
    let tab: SidebarTab
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Label(tab.rawValue, systemImage: tab.icon)
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(.horizontal, 12)
                .padding(.vertical, 7)
                .background(isSelected ? AppTheme.accent.opacity(0.15) : Color.clear, in: RoundedRectangle(cornerRadius: 8))
                .foregroundColor(isSelected ? AppTheme.accent : .primary)
        }
        .buttonStyle(.plain)
    }
}
