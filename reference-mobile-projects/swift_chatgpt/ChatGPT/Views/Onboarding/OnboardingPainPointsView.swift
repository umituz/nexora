import SwiftUI

// MARK: - Pain Points Screen
struct OnboardingPainPointsView: View {
    @ObservedObject var viewModel: OnboardingViewModel
    private let accentColor = Color(hex: ColorPalette.accent)

    var body: some View {
        VStack(spacing: 28) {
            header
            painPointList
            continueButton
        }
        .padding(.horizontal, 24)
    }

    @ViewBuilder
    private var header: some View {
        VStack(spacing: 8) {
            Text(L10n.Onboarding.Pain.title)
                .font(.system(size: 28, weight: .bold))
                .foregroundColor(.black)

            Text(L10n.Onboarding.Pain.subtitle)
                .font(.system(size: 16))
                .foregroundColor(Color(hex: ColorPalette.textSecondary))
        }
    }

    @ViewBuilder
    private var painPointList: some View {
        VStack(spacing: 12) {
            ForEach(viewModel.painPoints) { point in
                painPointRow(point)
            }
        }
    }

    private func painPointRow(_ point: PainPoint) -> some View {
        let isSelected = viewModel.selectedPainPoints.contains(point.id)

        return Button {
            withAnimation(.easeInOut(duration: 0.15)) {
                if isSelected {
                    viewModel.selectedPainPoints.remove(point.id)
                } else {
                    viewModel.selectedPainPoints.insert(point.id)
                }
            }
        } label: {
            HStack(spacing: 14) {
                ZStack {
                    RoundedRectangle(cornerRadius: 6)
                        .stroke(isSelected ? accentColor : Color(hex: ColorPalette.border), lineWidth: isSelected ? 2 : 1)
                        .frame(width: 24, height: 24)
                    if isSelected {
                        Image.asset(ImageAssets.checkmark)
                            .font(.system(size: 11, weight: .bold))
                            .foregroundColor(accentColor)
                    }
                }

                Text(point.title)
                    .font(.system(size: 16, weight: isSelected ? .medium : .regular))
                    .foregroundColor(.black)

                Spacer()
            }
            .padding(.horizontal, 16)
            .frame(height: 56)
            .background(
                isSelected
                    ? accentColor.opacity(0.05)
                    : Color(hex: ColorPalette.cardBackground)
            )
            .clipShape(RoundedRectangle(cornerRadius: 14))
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
