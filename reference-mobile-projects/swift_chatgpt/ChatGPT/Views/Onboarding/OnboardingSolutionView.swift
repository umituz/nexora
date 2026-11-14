import SwiftUI

// MARK: - Personalized Solution Screen
struct OnboardingSolutionView: View {
    @ObservedObject var viewModel: OnboardingViewModel
    private let accentColor = Color(hex: ColorPalette.accent)

    var body: some View {
        VStack(spacing: 28) {
            header
            solutionList
            continueButton
        }
        .padding(.horizontal, 24)
    }

    @ViewBuilder
    private var header: some View {
        VStack(spacing: 8) {
            Text(L10n.Onboarding.Solution.title)
                .font(.system(size: 28, weight: .bold))
                .foregroundColor(.black)

            Text(L10n.Onboarding.Solution.subtitle)
                .font(.system(size: 16))
                .foregroundColor(Color(hex: ColorPalette.textSecondary))
        }
    }

    @ViewBuilder
    private var solutionList: some View {
        ScrollView {
            VStack(spacing: 16) {
                ForEach(viewModel.solutions) { item in
                    solutionCard(item)
                }
            }
        }
        .scrollIndicators(.hidden)
    }

    private func solutionCard(_ item: SolutionItem) -> some View {
        HStack(alignment: .top, spacing: 14) {
            ZStack {
                Circle()
                    .fill(accentColor.opacity(0.1))
                    .frame(width: 44, height: 44)
                Image(systemName: item.icon)
                    .font(.system(size: 18, weight: .semibold))
                    .foregroundColor(accentColor)
            }

            VStack(alignment: .leading, spacing: 6) {
                Text(item.pain)
                    .font(.system(size: 13))
                    .foregroundColor(Color(hex: ColorPalette.textSecondary))
                    .strikethrough()

                Text(item.solution)
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(.black)

                Text(item.stat)
                    .font(.system(size: 13, weight: .medium))
                    .foregroundColor(accentColor)
            }

            Spacer()
        }
        .padding(16)
        .background(Color(hex: ColorPalette.cardBackground))
        .clipShape(RoundedRectangle(cornerRadius: 14))
    }

    @ViewBuilder
    private var continueButton: some View {
        Button { viewModel.nextStep() } label: {
            Text(L10n.Onboarding.continueCTA)
                .font(.system(size: 18, weight: .semibold))
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .frame(height: 54)
                .background(
                    LinearGradient(colors: ColorPalette.gradient(from: ColorPalette.primary, to: ColorPalette.secondary), startPoint: .leading, endPoint: .trailing)
                )
                .clipShape(RoundedRectangle(cornerRadius: 16))
        }
        .padding(.bottom, 24)
    }
}
