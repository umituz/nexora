import SwiftUI

// MARK: - Value Delivery / Complete Screen
struct OnboardingCompleteView: View {
    @ObservedObject var viewModel: OnboardingViewModel
    @State private var showCheckmark = false
    private let accentColor = Color(hex: ColorPalette.accent)
    private let accentGradient = LinearGradient(
        colors: ColorPalette.gradient(from: ColorPalette.primary, to: ColorPalette.secondary),
        startPoint: .leading, endPoint: .trailing
    )

    var body: some View {
        VStack(spacing: 28) {
            Spacer()

            ZStack {
                Circle()
                    .fill(accentColor.opacity(0.1))
                    .frame(width: 120, height: 120)

                Image(systemName: AppIcons.Action.checkmarkCircle)
                    .font(.system(size: 64))
                    .foregroundStyle(accentGradient)
                    .scaleEffect(showCheckmark ? 1 : 0.5)
                    .opacity(showCheckmark ? 1 : 0)
            }

            VStack(spacing: 8) {
                Text(L10n.Onboarding.Complete.title)
                    .font(.system(size: 28, weight: .bold))
                    .foregroundColor(.black)

                Text(L10n.Onboarding.Complete.subtitle)
                    .font(.system(size: 16))
                    .foregroundColor(Color(hex: ColorPalette.textSecondary))
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 32)
            }

            summaryCard

            Spacer()

            Button {
                viewModel.completeOnboarding()
            } label: {
                Text(L10n.Onboarding.Complete.cta)
                    .font(.system(size: 18, weight: .semibold))
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .frame(height: 54)
                    .background(accentGradient)
                    .clipShape(RoundedRectangle(cornerRadius: 16))
            }
            .padding(.horizontal, 24)
            .padding(.bottom, 40)
        }
        .onAppear {
            withAnimation(.spring(response: 0.6, dampingFraction: 0.7)) {
                showCheckmark = true
            }
        }
    }

    @ViewBuilder
    private var summaryCard: some View {
        VStack(spacing: 12) {
            if let goal = viewModel.selectedGoal {
                summaryRow(emoji: goal.emoji, text: goal.title)
            }
            summaryRow(
                emoji: "🤖",
                text: viewModel.selectedModel.displayName
            )
        }
        .padding(16)
        .frame(maxWidth: .infinity)
        .background(Color(hex: ColorPalette.cardBackground))
        .clipShape(RoundedRectangle(cornerRadius: 14))
        .padding(.horizontal, 24)
    }

    private func summaryRow(emoji: String, text: String) -> some View {
        HStack(spacing: 12) {
            Text(emoji)
                .font(.system(size: 20))
            Text(text)
                .font(.system(size: 16, weight: .medium))
                .foregroundColor(.black)
            Spacer()
        }
    }
}
