import SwiftUI

// MARK: - Main Chat View
struct MainChatView: View {
    @Binding var showSidebar: Bool
    @Environment(\.services) private var services
    @StateObject private var viewModel = ChatViewModel.make()

    @State private var messageText = ""

    var body: some View {
        VStack(spacing: 0) {
            NavigationBarView(showSidebar: $showSidebar, viewModel: viewModel)
            content
            inputBarSection
        }
        .background(Color.white)
    }

    @ViewBuilder
    private var content: some View {
        if viewModel.messages.isEmpty {
            emptyStateContent
        } else {
            messagesList
        }
    }

    @ViewBuilder
    private var emptyStateContent: some View {
        VStack(spacing: 0) {
            Spacer()
            LogoAnimation().padding(.bottom, LayoutMetrics.Spacing.md)
            AIBadgeComponent(isAvailable: viewModel.aiService.isAvailable && !viewModel.isGenerating)
                .padding(.bottom, LayoutMetrics.Spacing.xxl)
            PromptExamplesRow { prompt in viewModel.sendMessage(prompt) }
            Spacer()
        }
    }

    @ViewBuilder
    private var messagesList: some View {
        ScrollViewReader { proxy in
            ScrollView {
                LazyVStack(spacing: LayoutMetrics.Spacing.lg) {
                    ForEach(viewModel.messages) { msg in
                        MessageBubble(
                            message: msg,
                            onCopy: { viewModel.copyMessage(msg) },
                            onDelete: { viewModel.deleteMessage(msg) }
                        )
                        .id(msg.id)
                    }

                    if viewModel.isGenerating {
                        TypingDots()
                    }
                }
                .padding(.horizontal, LayoutMetrics.Spacing.xl)
                .padding(.top, LayoutMetrics.Spacing.lg)
                .padding(.bottom, LayoutMetrics.Spacing.sm)
            }
            .onChange(of: viewModel.messages.count) { _, _ in
                guard let last = viewModel.messages.last?.id else { return }
                withAnimation(.easeOut(duration: LayoutMetrics.Animation.scrollDuration)) {
                    proxy.scrollTo(last, anchor: .bottom)
                }
            }
        }
    }

    @ViewBuilder
    private var inputBarSection: some View {
        InputBarView(
            text: $messageText,
            isLoading: viewModel.isGenerating
        ) {
            guard MessageUtils.canSend(messageText) else { return }
            viewModel.sendMessage(messageText)
            messageText = ""
        }
        .padding(.bottom, LayoutMetrics.Spacing.sm)
    }
}
