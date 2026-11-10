import SwiftUI

struct PromptExamplesRow: View {
    var onTap: (String) -> Void
    private let templates = L10n.PromptTemplates.templates

    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 12) {
                ForEach(Array(templates.enumerated()), id: \.element.id) { _, template in
                    PromptCard(template: template, onTap: onTap)
                }
            }
            .padding(.horizontal, 20)
        }
    }
}

private struct PromptCard: View {
    let template: L10n.PromptItem
    let onTap: (String) -> Void
    private let cardBg = Color(hex: ColorPalette.cardBackground)
    private let subtitleColor = Color(hex: ColorPalette.textPrimary).opacity(0.6)

    var body: some View {
        Button { onTap("\(template.title) \(template.subtitle)") } label: {
            VStack(alignment: .leading, spacing: 1) {
                Text(template.title)
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(.black)
                Text(template.subtitle)
                    .font(.system(size: 16, weight: .regular))
                    .foregroundColor(subtitleColor)
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 13)
            .frame(height: 69)
            .background(cardBg)
            .cornerRadius(14)
        }
    }
}
