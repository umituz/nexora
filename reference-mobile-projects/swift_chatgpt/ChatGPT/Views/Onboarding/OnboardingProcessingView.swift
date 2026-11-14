import SwiftUI

// MARK: - Processing Screen
struct OnboardingProcessingView: View {
    @ObservedObject var viewModel: OnboardingViewModel
    @State private var isAnimating = false
    @State private var dotCount = 0
    private let accentColor = Color(hex: ColorPalette.accent)

    var body: some View {
        VStack(spacing: 24) {
            Spacer()

            ZStack {
                Circle()
                    .stroke(accentColor.opacity(0.15), lineWidth: 4)
                    .frame(width: 80, height: 80)

                Circle()
                    .trim(from: 0, to: 0.7)
                    .stroke(
                        LinearGradient(colors: ColorPalette.gradient(from: ColorPalette.primary, to: ColorPalette.secondary), startPoint: .leading, endPoint: .trailing),
                        style: StrokeStyle(lineWidth: 4, lineCap: .round)
                    )
                    .frame(width: 80, height: 80)
                    .rotationEffect(.degrees(isAnimating ? 360 : 0))
                    .animation(.linear(duration: 1).repeatForever(autoreverses: false), value: isAnimating)
            }

            VStack(spacing: 8) {
                Text(L10n.Onboarding.Processing.title)
                    .font(.system(size: 22, weight: .bold))
                    .foregroundColor(.black)

                Text(L10n.Onboarding.Processing.subtitle)
                    .font(.system(size: 16))
                    .foregroundColor(Color(hex: ColorPalette.textSecondary))
            }

            Spacer()
        }
        .onAppear {
            isAnimating = true
            DispatchQueue.main.asyncAfter(deadline: .now() + 2.5) {
                viewModel.nextStep()
            }
        }
    }
}
