import SwiftUI

struct SidebarOverlay: View {
    @Binding var showSidebar: Bool
    @StateObject private var storage = LocalStorageService.shared
    @State private var showPaywall = false
    @ObservedObject private var rc = RevenueCatService.shared

    // For conversation switching
    @Environment(\.services) private var services
    @State private var viewModel: ChatViewModel?
    @State private var showSettings = false

    var body: some View {
        if showSidebar {
            ZStack(alignment: .leading) {
                dimBackground
                sidebarContent
            }
            .transition(.opacity)
            .onAppear {
                storage.loadConversations()
                viewModel = services.resolveChat()
            }
        }
    }

    @ViewBuilder
    private var dimBackground: some View {
        Color.black.opacity(0.3)
            .ignoresSafeArea()
            .onTapGesture {
                withAnimation(.easeInOut(duration: LayoutMetrics.Animation.sidebarTransition)) {
                    showSidebar = false
                }
            }
    }

    @ViewBuilder
    private var sidebarContent: some View {
        VStack(alignment: .leading, spacing: 0) {
            sidebarHeader
            Divider()
            newChatButton
            Divider()
            conversationList
            Spacer()
            if !rc.isProUser { UpgradeCardComponent(showPaywall: $showPaywall) }
            UserFooterComponent(
                userName: storage.currentUser.displayName,
                onTapSettings: { showSettings = true }
            )
        }
        .frame(width: LayoutMetrics.Sidebar.width)
        .background(Color.white)
        .ignoresSafeArea()
        .transition(.move(edge: .leading))
        .sheet(isPresented: $showPaywall) { PaywallView() }
        .sheet(isPresented: $showSettings) { SettingsView() }
    }

    @ViewBuilder
    private var sidebarHeader: some View {
        HStack {
            Text(L10n.Sidebar.history)
                .font(.system(size: Typography.FontSize.xxlarge, weight: .bold))

            Spacer()

            Button {
                withAnimation { showSidebar = false }
            } label: {
                Image.asset(ImageAssets.close)
                    .font(.system(size: Typography.FontSize.regular, weight: .semibold))
                    .foregroundColor(.black)
            }
        }
        .padding(.horizontal, LayoutMetrics.Spacing.xl)
        .padding(.top, 70)
        .padding(.bottom, LayoutMetrics.Spacing.xl)
    }

    @ViewBuilder
    private var newChatButton: some View {
        Button {
            viewModel?.startNewConversation()
            withAnimation { showSidebar = false }
        } label: {
            HStack {
                Image.asset(ImageAssets.plus)
                    .font(.system(size: Typography.FontSize.medium, weight: .semibold))
                Text(L10n.Sidebar.newChat)
                    .font(.system(size: Typography.FontSize.regular, weight: .medium))
                Spacer()
            }
            .foregroundColor(.black)
            .padding(.horizontal, LayoutMetrics.Spacing.xl)
            .padding(.vertical, LayoutMetrics.Spacing.md)
        }
    }

    @ViewBuilder
    private var conversationList: some View {
        if storage.conversations.isEmpty {
            EmptyHistoryComponent()
        } else {
            List {
                ForEach(storage.conversations) { conv in
                    conversationRow(conv)
                        .contentShape(Rectangle())
                        .onTapGesture {
                            loadConversation(conv)
                        }
                        .swipeActions(edge: .trailing, allowsFullSwipe: true) {
                            Button(role: .destructive) {
                                deleteConversation(conv)
                            } label: {
                                Label(L10n.Sidebar.deleteConversation, systemImage: "trash")
                            }
                        }
                }
            }
            .listStyle(.plain)
        }
    }

    private func conversationRow(_ conv: Conversation) -> some View {
        HStack {
            VStack(alignment: .leading, spacing: LayoutMetrics.Spacing.xs) {
                Text(conv.title)
                    .font(.system(size: Typography.FontSize.large))
                    .foregroundColor(.black)
                    .lineLimit(1)

                Text(conv.model)
                    .font(.system(size: Typography.FontSize.small))
                    .foregroundColor(.gray)
            }
            Spacer()
        }
        .padding(.vertical, LayoutMetrics.Spacing.xs)
    }

    private func loadConversation(_ conversation: Conversation) {
        viewModel?.loadConversation(conversation)
        withAnimation { showSidebar = false }
    }

    private func deleteConversation(_ conversation: Conversation) {
        withAnimation {
            viewModel?.deleteConversation(conversation)
        }
    }
}
