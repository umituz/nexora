import SwiftUI

struct QuickActionsSectionView: View {
    private let actions = SampleData.quickActions
    private let columns = Array(repeating: GridItem(.flexible(), spacing: 12), count: 3)
    @State private var showBuilder = false
    @State private var showTemplates = false

    var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            HStack {
                Text("Quick Actions")
                    .font(.headline)
                    .foregroundStyle(.white)
                Spacer()
                Button { showTemplates = true } label: {
                    Text("Templates")
                        .font(.caption)
                        .fontWeight(.medium)
                        .foregroundStyle(.gray)
                }
            }
            LazyVGrid(columns: columns, spacing: 12) {
                ForEach(actions) { action in
                    QuickActionCell(action: action) { showBuilder = true }
                }
            }
        }
        .sheet(isPresented: $showBuilder) { AgentPromptBuilderView() }
        .sheet(isPresented: $showTemplates) { TaskTemplateGalleryView() }
    }
}

struct QuickActionCell: View {
    let action: QuickAction
    let onTap: () -> Void

    var body: some View {
        Button(action: onTap) {
            VStack(spacing: 10) {
                Image(systemName: action.icon)
                    .font(.title2)
                    .foregroundStyle(.white)
                    .frame(width: 48, height: 48)
                    .background(gradient)
                    .clipShape(RoundedRectangle(cornerRadius: 14))
                Text(action.title)
                    .font(.caption)
                    .fontWeight(.medium)
                    .foregroundStyle(.white)
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 14)
            .background(Color.white.opacity(0.06))
            .clipShape(RoundedRectangle(cornerRadius: 16))
        }
    }

    private var gradient: LinearGradient {
        LinearGradient(colors: action.gradient, startPoint: .topLeading, endPoint: .bottomTrailing)
    }
}
