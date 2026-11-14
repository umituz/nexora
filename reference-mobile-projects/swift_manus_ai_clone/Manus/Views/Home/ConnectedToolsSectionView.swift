import SwiftUI

struct ConnectedToolsSectionView: View {
    private let tools = SampleData.connectedTools
    private let columns = Array(repeating: GridItem(.flexible(), spacing: 12), count: 3)

    var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            headerRow
            LazyVGrid(columns: columns, spacing: 12) {
                ForEach(tools) { tool in
                    ToolCell(tool: tool)
                }
            }
        }
    }

    @ViewBuilder
    private var headerRow: some View {
        HStack {
            Text("Connected Tools")
                .font(.headline)
                .foregroundStyle(.white)
            Spacer()
            Text("\(tools.filter(\.connected).count) active")
                .font(.caption)
                .foregroundStyle(.gray)
        }
    }
}

struct ToolCell: View {
    let tool: ToolItem

    var body: some View {
        VStack(spacing: 8) {
            ZStack(alignment: .topTrailing) {
                Image(systemName: tool.icon)
                    .font(.title2)
                    .foregroundStyle(tool.color.opacity(tool.connected ? 1 : 0.4))
                    .frame(width: 44, height: 44)
                if tool.connected {
                    Circle()
                        .fill(.green)
                        .frame(width: 8, height: 8)
                        .offset(x: 2, y: -2)
                }
            }
            Text(tool.name)
                .font(.caption)
                .fontWeight(.medium)
                .foregroundStyle(tool.connected ? .white : .gray)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 12)
        .background(Color.white.opacity(tool.connected ? 0.06 : 0.03))
        .clipShape(RoundedRectangle(cornerRadius: 14))
        .overlay(
            RoundedRectangle(cornerRadius: 14)
                .stroke(tool.connected ? Color.white.opacity(0.1) : .clear, lineWidth: 1)
        )
    }
}
