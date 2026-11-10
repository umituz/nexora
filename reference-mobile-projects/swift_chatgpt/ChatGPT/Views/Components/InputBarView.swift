import SwiftUI

struct InputBarView: View {
    @Binding var text: String
    var isLoading: Bool = false
    var onSend: () -> Void
    private let borderColor = Color(hex: ColorPalette.border)
    private let placeholderColor = Color(hex: ColorPalette.textPrimary).opacity(0.3)
    private let micColor = Color(hex: ColorPalette.textPrimary).opacity(0.6)

    var body: some View {
        HStack(spacing: 12) {
            addButton
            inputField
            sendOrHeadphonesButton
        }
        .padding(.horizontal, 20)
    }

    @ViewBuilder
    private var addButton: some View {
        Button {} label: {
            Image.asset(ImageAssets.plusCircleFill)
                .font(.system(size: 24, weight: .medium))
                .foregroundColor(.black)
        }
        .frame(width: 24, height: 24)
    }

    @ViewBuilder
    private var inputField: some View {
        HStack(spacing: 8) {
            TextField(L10n.Chat.messagePlaceholder, text: $text)
                .font(.system(size: 17))
                .foregroundColor(.black)
                .submitLabel(.send)
                .onSubmit { if !isLoading { onSend() } }
                .disabled(isLoading)
            Button {} label: {
                Image.asset(ImageAssets.micFill)
                    .font(.system(size: 16))
                    .foregroundColor(micColor)
            }
        }
        .padding(.horizontal, 16)
        .frame(height: 38)
        .background(Color.white)
        .overlay(
            RoundedRectangle(cornerRadius: 32)
                .stroke(borderColor, lineWidth: 1)
        )
    }

    @ViewBuilder
    private var sendOrHeadphonesButton: some View {
        let hasText = !text.trimmingCharacters(in: .whitespaces).isEmpty
        if hasText && !isLoading {
            Button { onSend() } label: {
                Image.asset(ImageAssets.arrowUpCircleFill)
                    .font(.system(size: 28, weight: .medium))
                    .foregroundColor(.black)
            }
            .frame(width: 28, height: 28)
        } else if isLoading {
            ProgressView()
                .frame(width: 24, height: 24)
        } else {
            Button {} label: {
                Image.asset(ImageAssets.headphones)
                    .font(.system(size: 20, weight: .medium))
                    .foregroundColor(.black)
            }
            .frame(width: 24, height: 24)
        }
    }
}
