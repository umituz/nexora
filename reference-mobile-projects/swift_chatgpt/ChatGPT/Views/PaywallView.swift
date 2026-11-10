import SwiftUI

struct PaywallView: View {
    @Environment(\.dismiss) private var dismiss
    @ObservedObject private var rc = RevenueCatService.shared
    @State private var isRestoring = false
    @State private var showError = false
    @State private var showSuccess = false

    var body: some View {
        ZStack {
            LinearGradient(
                colors: ColorUtils.gradient(from: ColorPalette.paywallTop, to: ColorPalette.paywallBottom),
                startPoint: .top, endPoint: .bottom
            )
            .ignoresSafeArea()

            VStack(spacing: 24) {
                HStack {
                    Spacer()
                    Button { dismiss() } label: {
                        Image.asset(ImageAssets.xmarkCircleFill)
                            .font(.system(size: 28))
                            .foregroundStyle(.white.opacity(0.5))
                    }
                }
                .padding(.top, 8)

                headerSection
                featuresSection
                Spacer()

                Button {
                    Task { await restorePurchases() }
                } label: {
                    if isRestoring {
                        ProgressView()
                            .progressViewStyle(CircularProgressViewStyle(tint: .white.opacity(0.5)))
                    } else {
                        Text(L10n.Paywall.restorePurchases)
                            .font(.system(size: 14))
                            .foregroundColor(.white.opacity(0.5))
                    }
                }
                .disabled(isRestoring)
            }
            .padding(.horizontal, 24)
            .padding(.bottom, 40)
            .alert("Success", isPresented: $showSuccess) {
                Button("OK") { dismiss() }
            } message: {
                Text("Your purchases have been restored.")
            }
            .alert("Error", isPresented: $showError) {
                Button("OK") {}
            } message: {
                Text("Unable to restore purchases. Please try again.")
            }
        }
    }

    private func restorePurchases() async {
        isRestoring = true
        let result = await rc.restorePurchases()
        isRestoring = false

        switch result {
        case .success:
            showSuccess = true
        case .failure:
            showError = true
        }
    }

    @ViewBuilder private var headerSection: some View {
        VStack(spacing: 12) {
            Image.asset(ImageAssets.sparkle)
                .font(.system(size: 48))
                .foregroundStyle(proGradient)
            Text(L10n.Paywall.upgradeToPro)
                .font(.system(size: 32, weight: .bold))
                .foregroundColor(.white)
            Text(L10n.Paywall.comingSoon)
                .font(.system(size: 16))
                .foregroundColor(.white.opacity(0.7))
                .multilineTextAlignment(.center)
        }
    }

    @ViewBuilder private var featuresSection: some View {
        VStack(alignment: .leading, spacing: 14) {
            featureRow(icon: ImageAssets.infinity, text: L10n.Paywall.Features.unlimitedMessages)
            featureRow(icon: ImageAssets.boltFill, text: L10n.Paywall.Features.allAIModels)
            featureRow(icon: ImageAssets.photoStack, text: L10n.Paywall.Features.imageGeneration)
            featureRow(icon: ImageAssets.clockArrowCirclepath, text: L10n.Paywall.Features.prioritySpeed)
        }
        .padding(20)
        .background(Color.white.opacity(0.08))
        .clipShape(RoundedRectangle(cornerRadius: 16))
    }

    private var proGradient: LinearGradient {
        LinearGradient(
            colors: ColorPalette.gradient(from: ColorPalette.primary, to: ColorPalette.secondary),
            startPoint: .leading,
            endPoint: .trailing
        )
    }

    private func featureRow(icon: String, text: String) -> some View {
        HStack(spacing: 14) {
            Image.asset(icon)
                .font(.system(size: 16, weight: .semibold))
                .foregroundStyle(proGradient)
                .frame(width: 24)
            Text(text)
                .font(.system(size: 16))
                .foregroundColor(.white)
        }
    }
}

