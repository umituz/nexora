import SwiftUI

// MARK: - Preferences Screen
struct OnboardingPreferencesView: View {
    @ObservedObject var viewModel: OnboardingViewModel
    private let accentColor = Color(hex: ColorPalette.accent)

    var body: some View {
        VStack(spacing: 32) {
            header
            modelGrid
            continueButton
        }
        .padding(.horizontal, 24)
    }

    @ViewBuilder
    private var header: some View {
        VStack(spacing: 8) {
            Text(L10n.Onboarding.Preferences.title)
                .font(.system(size: 28, weight: .bold))
                .foregroundColor(.black)

            Text(L10n.Onboarding.Preferences.subtitle)
                .font(.system(size: 16))
                .foregroundColor(Color(hex: ColorPalette.textSecondary))
        }
    }

    @ViewBuilder
    private var modelGrid: some View {
        VStack(spacing: 12) {
            ForEach(ChatModel.allCases) { model in
                modelCard(model)
            }
        }
    }

    private func modelCard(_ model: ChatModel) -> some View {
        let isSelected = viewModel.selectedModel == model

        return Button { viewModel.selectedModel = model } label: {
            HStack(spacing: 16) {
                ZStack {
                    Circle()
                        .fill(accentColor.opacity(isSelected ? 0.15 : 0.06))
                        .frame(width: 48, height: 48)
                    Image(systemName: model.iconName)
                        .font(.system(size: 20, weight: .medium))
                        .foregroundColor(isSelected ? accentColor : Color(hex: ColorPalette.textSecondary))
                }

                VStack(alignment: .leading, spacing: 3) {
                    Text(model.displayName)
                        .font(.system(size: 17, weight: .semibold))
                        .foregroundColor(.black)
                    Text(modelSubtitle(for: model))
                        .font(.system(size: 13))
                        .foregroundColor(Color(hex: ColorPalette.textSecondary))
                }

                Spacer()

                if isSelected {
                    Image.asset(ImageAssets.checkmark)
                        .font(.system(size: 12, weight: .bold))
                        .foregroundColor(.white)
                        .frame(width: 22, height: 22)
                        .background(accentColor)
                        .clipShape(Circle())
                }
            }
            .padding(.horizontal, 16)
            .frame(height: 72)
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

    private func modelSubtitle(for model: ChatModel) -> String {
        switch model {
        case .appleIntelligence: return L10n.Onboarding.Preferences.appleDesc
        case .gpt4o: return L10n.Onboarding.Preferences.gpt4oDesc
        case .gpt4oMini: return L10n.Onboarding.Preferences.gpt4oMiniDesc
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
                    LinearGradient(colors: ColorPalette.gradient(from: ColorPalette.primary, to: ColorPalette.secondary), startPoint: .leading, endPoint: .trailing)
                )
                .clipShape(RoundedRectangle(cornerRadius: 16))
        }
        .padding(.bottom, 24)
    }
}
