import SwiftUI

// MARK: - Goal Question Screen
struct OnboardingGoalView: View {
    @ObservedObject var viewModel: OnboardingViewModel
    private let accentColor = Color(hex: ColorPalette.accent)

    var body: some View {
        VStack(spacing: 32) {
            header
            goalList
            continueButton
        }
        .padding(.horizontal, 24)
    }

    @ViewBuilder
    private var header: some View {
        VStack(spacing: 8) {
            Text(L10n.Onboarding.Goal.title)
                .font(.system(size: 28, weight: .bold))
                .foregroundColor(.black)

            Text(L10n.Onboarding.Goal.subtitle)
                .font(.system(size: 16))
                .foregroundColor(Color(hex: ColorPalette.textSecondary))
        }
    }

    @ViewBuilder
    private var goalList: some View {
        VStack(spacing: 12) {
            ForEach(viewModel.goals) { goal in
                goalRow(goal)
            }
        }
    }

    private func goalRow(_ goal: OnboardingGoal) -> some View {
        let isSelected = viewModel.selectedGoal?.id == goal.id

        return Button { viewModel.selectedGoal = goal } label: {
            HStack(spacing: 16) {
                Text(goal.emoji)
                    .font(.system(size: 24))
                    .frame(width: 44, height: 44)
                    .background(
                        isSelected
                            ? accentColor.opacity(0.12)
                            : Color(hex: ColorPalette.cardBackground)
                    )
                    .clipShape(RoundedRectangle(cornerRadius: 12))

                Text(goal.title)
                    .font(.system(size: 17, weight: isSelected ? .semibold : .regular))
                    .foregroundColor(.black)

                Spacer()

                if isSelected {
                    Image.asset(ImageAssets.checkmark)
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(.white)
                        .frame(width: 24, height: 24)
                        .background(accentColor)
                        .clipShape(Circle())
                }
            }
            .padding(.horizontal, 16)
            .frame(height: 64)
            .background(
                isSelected
                    ? accentColor.opacity(0.06)
                    : Color(hex: ColorPalette.cardBackground)
            )
            .clipShape(RoundedRectangle(cornerRadius: 14))
            .overlay(
                RoundedRectangle(cornerRadius: 14)
                    .stroke(accentColor.opacity(isSelected ? 1 : 0), lineWidth: 2)
            )
        }
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
                    viewModel.canProceed
                        ? LinearGradient(colors: ColorPalette.gradient(from: ColorPalette.primary, to: ColorPalette.secondary), startPoint: .leading, endPoint: .trailing)
                        : LinearGradient(colors: [Color.gray.opacity(0.3)], startPoint: .leading, endPoint: .trailing)
                )
                .clipShape(RoundedRectangle(cornerRadius: 16))
        }
        .disabled(!viewModel.canProceed)
        .padding(.bottom, 24)
    }
}
