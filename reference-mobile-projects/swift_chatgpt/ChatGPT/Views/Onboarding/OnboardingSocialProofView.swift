import SwiftUI

// MARK: - Social Proof Screen
struct OnboardingSocialProofView: View {
    @ObservedObject var viewModel: OnboardingViewModel

    var body: some View {
        VStack(spacing: 32) {
            header
            testimonialsList
            continueButton
        }
        .padding(.horizontal, 24)
    }

    @ViewBuilder
    private var header: some View {
        VStack(spacing: 8) {
            Text(L10n.Onboarding.Social.title)
                .font(.system(size: 28, weight: .bold))
                .foregroundColor(.black)

            Text(L10n.Onboarding.Social.subtitle)
                .font(.system(size: 16))
                .foregroundColor(Color(hex: ColorPalette.textSecondary))
        }
    }

    @ViewBuilder
    private var testimonialsList: some View {
        VStack(spacing: 16) {
            ForEach(viewModel.testimonials) { testimonial in
                testimonialCard(testimonial)
            }
        }
    }

    private func testimonialCard(_ t: Testimonial) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack(spacing: 12) {
                Circle()
                    .fill(
                        LinearGradient(
                            colors: ColorPalette.gradient(from: ColorPalette.primary, to: ColorPalette.secondary),
                            startPoint: .leading, endPoint: .trailing
                        )
                    )
                    .frame(width: 40, height: 40)
                    .overlay(
                        Text(t.initials)
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(.white)
                    )

                VStack(alignment: .leading, spacing: 2) {
                    Text(t.name)
                        .font(.system(size: 15, weight: .semibold))
                        .foregroundColor(.black)
                    Text(t.tag)
                        .font(.system(size: 12))
                        .foregroundColor(Color(hex: ColorPalette.textSecondary))
                }

                Spacer()

                HStack(spacing: 2) {
                    ForEach(0..<5, id: \.self) { _ in
                        Image(systemName: AppIcons.Action.starFill)
                            .font(.system(size: 10))
                            .foregroundColor(.orange)
                    }
                }
            }

            Text("\"\(t.text)\"")
                .font(.system(size: 14))
                .foregroundColor(Color(hex: ColorPalette.textPrimary))
                .lineLimit(3)
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
