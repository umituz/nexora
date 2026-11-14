import SwiftUI

struct NavigationBarView: View {
    @Binding var showSidebar: Bool
    @ObservedObject var viewModel: ChatViewModel
    @State private var showModelPicker = false
    @State private var showPaywall = false
    @ObservedObject private var rc = RevenueCatService.shared
    private let subtitleColor = Color(hex: ColorPalette.textPrimary).opacity(0.6)

    var body: some View {
        HStack {
            menuButton
            Spacer()
            titleSection
            Spacer()
            proOrEditButton
        }
        .padding(.horizontal, 20)
        .frame(height: 44)
        .sheet(isPresented: $showPaywall) { PaywallView() }
    }

    @ViewBuilder
    private var menuButton: some View {
        Button { showSidebar = true } label: {
            VStack(alignment: .leading, spacing: 6) {
                RoundedRectangle(cornerRadius: 1)
                    .frame(width: 18, height: 2.2)
                RoundedRectangle(cornerRadius: 1)
                    .frame(width: 13, height: 2.2)
            }
            .foregroundColor(.black)
        }
        .frame(width: 24, height: 24)
    }

    @ViewBuilder
    private var titleSection: some View {
        Menu {
            ForEach(ChatModel.allCases) { model in
                Button {
                    viewModel.switchModel(to: model)
                } label: {
                    HStack {
                        Text(model.displayName)
                        if viewModel.currentModel == model {
                            Image.asset(ImageAssets.checkmark)
                        }
                    }
                }
            }
        } label: {
            HStack(spacing: 4) {
                Text(L10n.General.chat)
                    .font(.system(size: 17, weight: .semibold))
                    .foregroundColor(.black)
                Text(viewModel.currentModel.subtitle)
                    .font(.system(size: 17, weight: .regular))
                    .foregroundColor(subtitleColor)
                Image.asset(ImageAssets.chevronDown)
                    .font(.system(size: 12, weight: .medium))
                    .foregroundColor(subtitleColor)
            }
        }
    }

    @ViewBuilder
    private var proOrEditButton: some View {
        if rc.isProUser {
            Button {} label: {
                Image.asset(ImageAssets.squareAndPencil)
                    .font(.system(size: 18, weight: .regular))
                    .foregroundColor(Color(hex: ColorPalette.textPrimary))
            }
            .frame(width: 24, height: 24)
        } else {
            Button { showPaywall = true } label: {
                HStack(spacing: 4) {
                    Image.asset(ImageAssets.sparkle)
                        .font(.system(size: 12, weight: .bold))
                    Text(L10n.Paywall.pro)
                        .font(.system(size: 13, weight: .bold))
                }
                .foregroundColor(.white)
                .padding(.horizontal, 10)
                .padding(.vertical, 5)
                .background(
                    LinearGradient(
                        colors: ColorPalette.gradient(from: ColorPalette.primary, to: ColorPalette.secondary),
                        startPoint: .leading,
                        endPoint: .trailing
                    )
                )
                .clipShape(Capsule())
            }
        }
    }
}
