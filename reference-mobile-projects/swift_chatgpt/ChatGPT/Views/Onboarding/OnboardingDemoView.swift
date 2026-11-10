import SwiftUI

// MARK: - App Demo Screen
struct OnboardingDemoView: View {
    @ObservedObject var viewModel: OnboardingViewModel
    private let accentColor = Color(hex: ColorPalette.accent)

    var body: some View {
        VStack(spacing: 20) {
            header
            chatArea
            inputBar
            nextButton
        }
        .padding(.horizontal, 24)
    }

    @ViewBuilder
    private var header: some View {
        VStack(spacing: 6) {
            Text(L10n.Onboarding.Demo.title)
                .font(.system(size: 24, weight: .bold))
                .foregroundColor(.black)

            Text(L10n.Onboarding.Demo.subtitle)
                .font(.system(size: 14))
                .foregroundColor(Color(hex: ColorPalette.textSecondary))
        }
    }

    @ViewBuilder
    private var chatArea: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 12) {
                ForEach(viewModel.demoMessages) { msg in
                    demoBubble(msg)
                }

                if viewModel.isDemoGenerating {
                    HStack(spacing: 4) {
                        ForEach(0..<3, id: \.self) { _ in
                            Circle()
                                .fill(Color.gray.opacity(0.4))
                                .frame(width: 6, height: 6)
                        }
                    }
                    .padding(12)
                    .background(Color(hex: ColorPalette.typingBackground))
                    .clipShape(RoundedRectangle(cornerRadius: 14))
                }
            }
        }
        .frame(maxHeight: 300)
        .scrollIndicators(.hidden)
    }

    private func demoBubble(_ msg: DemoMessage) -> some View {
        HStack {
            if msg.role == .user { Spacer(minLength: 60) }

            Text(msg.content)
                .font(.system(size: 15))
                .foregroundColor(msg.role == .user ? .white : .black)
                .padding(.horizontal, 14)
                .padding(.vertical, 10)
                .background(
                    msg.role == .user
                        ? LinearGradient(colors: ColorPalette.gradient(from: ColorPalette.primary, to: ColorPalette.secondary), startPoint: .leading, endPoint: .trailing)
                        : nil
                )
                .clipShape(RoundedRectangle(cornerRadius: 16))

            if msg.role == .assistant { Spacer(minLength: 60) }
        }
    }

    @ViewBuilder
    private var inputBar: some View {
        HStack(spacing: 10) {
            TextField(L10n.Onboarding.Demo.placeholder, text: $viewModel.demoInput)
                .font(.system(size: 16))
                .padding(.horizontal, 14)
                .frame(height: 44)
                .background(Color(hex: ColorPalette.cardBackground))
                .clipShape(RoundedRectangle(cornerRadius: 22))
                .onSubmit { viewModel.sendDemoMessage() }

            Button { viewModel.sendDemoMessage() } label: {
                Image.asset(ImageAssets.arrowUpCircleFill)
                    .font(.system(size: 32, weight: .medium))
                    .foregroundColor(accentColor)
            }
            .disabled(viewModel.demoInput.trimmingCharacters(in: .whitespaces).isEmpty)
        }
    }

    @ViewBuilder
    private var nextButton: some View {
        Button { viewModel.nextStep() } label: {
            Text(viewModel.demoMessages.count >= 2 ? L10n.Onboarding.Demo.next : L10n.Onboarding.Demo.skip)
                .font(.system(size: 16, weight: .medium))
                .foregroundColor(Color(hex: ColorPalette.textSecondary))
        }
        .padding(.bottom, 16)
    }
}
