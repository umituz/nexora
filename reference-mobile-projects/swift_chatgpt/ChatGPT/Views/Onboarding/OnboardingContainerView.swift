import SwiftUI

// MARK: - Onboarding Container
struct OnboardingContainerView: View {
    @StateObject private var viewModel = OnboardingViewModel()
    @Environment(\.services) private var services

    var body: some View {
        VStack(spacing: 0) {
            progressBar
            Spacer()
            currentScreen
            Spacer()
        }
        .background(Color.white)
        .animation(.easeInOut(duration: 0.3), value: viewModel.currentStep)
    }

    // MARK: - Progress Bar

    @ViewBuilder
    private var progressBar: some View {
        if viewModel.currentStep != .welcome {
            ProgressView(value: viewModel.currentStep.progress)
                .tint(Color(hex: ColorPalette.primary))
                .padding(.horizontal, 24)
                .padding(.top, 16)
        }
    }

    // MARK: - Screen Router

    @ViewBuilder
    private var currentScreen: some View {
        switch viewModel.currentStep {
        case .welcome:
            OnboardingWelcomeView(viewModel: viewModel)
        case .goal:
            OnboardingGoalView(viewModel: viewModel)
        case .painPoints:
            OnboardingPainPointsView(viewModel: viewModel)
        case .socialProof:
            OnboardingSocialProofView(viewModel: viewModel)
        case .solution:
            OnboardingSolutionView(viewModel: viewModel)
        case .preferences:
            OnboardingPreferencesView(viewModel: viewModel)
        case .processing:
            OnboardingProcessingView(viewModel: viewModel)
        case .demo:
            OnboardingDemoView(viewModel: viewModel)
        case .complete:
            OnboardingCompleteView(viewModel: viewModel)
        }
    }
}
