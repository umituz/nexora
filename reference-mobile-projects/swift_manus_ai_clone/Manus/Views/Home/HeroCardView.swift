import SwiftUI

struct HeroCardView: View {
    @State private var animatePulse = false
    @State private var showBuilder = false
    @State private var showTemplates = false

    var body: some View {
        VStack(spacing: 16) {
            agentStatusIndicator
            titleBlock
            inputField
            quickButtons
        }
        .padding(24)
        .background(heroBackground)
        .clipShape(RoundedRectangle(cornerRadius: 24))
        .onAppear { animatePulse = true }
        .sheet(isPresented: $showBuilder) {
            AgentPromptBuilderView()
        }
        .sheet(isPresented: $showTemplates) {
            TaskTemplateGalleryView()
        }
    }

    @ViewBuilder
    private var agentStatusIndicator: some View {
        HStack(spacing: 8) {
            Circle()
                .fill(.green)
                .frame(width: 8, height: 8)
                .scaleEffect(animatePulse ? 1.2 : 1.0)
                .animation(.easeInOut(duration: 1.2).repeatForever(), value: animatePulse)
            Text("Agent Online")
                .font(.caption)
                .fontWeight(.semibold)
                .foregroundStyle(.green)
            Spacer()
            Text("2 tasks active")
                .font(.caption)
                .foregroundStyle(.gray)
        }
    }

    @ViewBuilder
    private var titleBlock: some View {
        VStack(spacing: 8) {
            Text("Leave it to Nexus,\nYour AI Agent")
                .font(.title2)
                .fontWeight(.bold)
                .foregroundStyle(.white)
                .multilineTextAlignment(.center)
            Text("Assign a task or ask anything")
                .font(.subheadline)
                .foregroundStyle(.gray)
        }
    }

    @ViewBuilder
    private var inputField: some View {
        Button { showBuilder = true } label: {
            HStack(spacing: 12) {
                Image(systemName: "plus.circle.fill")
                    .font(.title3)
                    .foregroundStyle(.gray)
                Text("What would you like me to do?")
                    .font(.subheadline)
                    .foregroundStyle(.gray.opacity(0.7))
                Spacer()
                Image(systemName: "arrow.up.circle.fill")
                    .font(.title2)
                    .foregroundStyle(.white.opacity(0.5))
            }
            .padding(14)
            .background(Color.white.opacity(0.08))
            .clipShape(RoundedRectangle(cornerRadius: 16))
        }
    }

    @ViewBuilder
    private var quickButtons: some View {
        HStack(spacing: 10) {
            Button { showTemplates = true } label: {
                HStack(spacing: 6) {
                    Image(systemName: "doc.on.doc.fill").font(.caption)
                    Text("Templates").font(.caption).fontWeight(.medium)
                }
                .foregroundStyle(.white.opacity(0.8))
                .padding(.horizontal, 14)
                .padding(.vertical, 8)
                .background(Color.white.opacity(0.1))
                .clipShape(Capsule())
            }
            Button { showBuilder = true } label: {
                HStack(spacing: 6) {
                    Image(systemName: "sparkles").font(.caption)
                    Text("Custom Task").font(.caption).fontWeight(.medium)
                }
                .foregroundStyle(.white.opacity(0.8))
                .padding(.horizontal, 14)
                .padding(.vertical, 8)
                .background(Color.white.opacity(0.1))
                .clipShape(Capsule())
            }
            Spacer()
        }
    }

    private var heroBackground: some ShapeStyle {
        LinearGradient(
            colors: [Color(white: 0.12), Color(white: 0.06)],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )
    }
}
