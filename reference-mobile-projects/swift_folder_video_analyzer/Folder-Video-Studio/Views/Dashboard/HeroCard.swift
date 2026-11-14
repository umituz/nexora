import SwiftUI

struct HeroCard: View {
    let hasAnalysis: Bool
    let isAnalyzing: Bool
    let folderName: String?
    let onSelectFolder: () -> Void

    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 18)
                .fill(AppTheme.accentGradient)
                .frame(height: 160)
            heroContent
        }
    }

    private var heroContent: some View {
        HStack {
            textColumn
            Spacer()
            iconColumn
        }
        .padding(28)
    }

    private var textColumn: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text(heroTitle)
                .font(.title.bold())
                .foregroundColor(.white)
            Text(heroSubtitle)
                .font(.body)
                .foregroundColor(.white.opacity(0.85))
            if !hasAnalysis && !isAnalyzing {
                selectButton
            }
        }
    }

    private var heroTitle: String {
        if isAnalyzing { return L10n.Dashboard.Hero.titleAnalyzing }
        if let name = folderName { return name }
        return L10n.Dashboard.Hero.titleDefault
    }

    private var heroSubtitle: String {
        if isAnalyzing { return L10n.Dashboard.Hero.subtitleAnalyzing }
        if hasAnalysis { return L10n.Dashboard.Hero.subtitleReady }
        return L10n.Dashboard.Hero.subtitleDefault
    }

    private var selectButton: some View {
        Button(action: onSelectFolder) {
            HStack(spacing: 8) {
                Text(L10n.Dashboard.Hero.selectFolder)
                    .font(.callout.weight(.semibold))
                Image(systemName: "folder.badge.plus")
            }
            .padding(.horizontal, 18)
            .padding(.vertical, 8)
            .background(.white.opacity(0.2), in: RoundedRectangle(cornerRadius: 10))
            .foregroundColor(.white)
        }
        .buttonStyle(.plain)
        .padding(.top, 4)
    }

    private var iconColumn: some View {
        ZStack {
            Image(systemName: isAnalyzing ? "arrow.triangle.2.circlepath" : "video.badge.waveform.fill")
                .font(.system(size: 56))
                .foregroundColor(.white.opacity(0.3))
                .rotationEffect(isAnalyzing ? .degrees(360) : .zero)
                .animation(isAnalyzing ? .linear(duration: 1.5).repeatForever(autoreverses: false) : .default, value: isAnalyzing)

            if !isAnalyzing, folderName != nil {
                Image(systemName: "folder.fill")
                    .font(.system(size: 24))
                    .foregroundColor(.white.opacity(0.4))
                    .offset(x: -20, y: -20)
            }
        }
    }
}
