import SwiftUI
import WebKit

// MARK: - Main Output Viewer Router

struct OutputViewerView: View {
    let output: AgentOutput
    @Environment(\.dismiss) private var dismiss
    @State private var shareSheet = false

    var body: some View {
        ZStack(alignment: .top) {
            Color.black.ignoresSafeArea()
            viewerContent
        }
        .navigationBarBackButtonHidden(true)
        .toolbar {
            ToolbarItem(placement: .topBarLeading) {
                Button { dismiss() } label: {
                    Image(systemName: "chevron.left")
                        .font(.system(size: 17, weight: .semibold))
                        .foregroundStyle(.white)
                }
            }
            ToolbarItem(placement: .principal) {
                Text(output.title)
                    .font(.headline)
                    .foregroundStyle(.white)
                    .lineLimit(1)
            }
            ToolbarItem(placement: .topBarTrailing) {
                Button {
                    shareSheet = true
                } label: {
                    Image(systemName: "square.and.arrow.up")
                        .font(.system(size: 16))
                        .foregroundStyle(.white)
                }
            }
        }
        .toolbarColorScheme(.dark, for: .navigationBar)
        .sheet(isPresented: $shareSheet) {
            ShareSheet(text: output.title)
        }
    }

    @ViewBuilder
    private var viewerContent: some View {
        switch output.type {
        case .webpage:
            WebPreviewView(output: output)
        case .code:
            CodeViewerView(output: output)
        case .document:
            DocumentViewerView(output: output)
        case .spreadsheet:
            SpreadsheetViewerView(output: output)
        case .image:
            ImageViewerView(output: output)
        case .research:
            ResearchViewerView(output: output)
        }
    }
}

// MARK: - Share Sheet

struct ShareSheet: UIViewControllerRepresentable {
    let text: String
    func makeUIViewController(context: Context) -> UIActivityViewController {
        UIActivityViewController(activityItems: [text], applicationActivities: nil)
    }
    func updateUIViewController(_ vc: UIActivityViewController, context: Context) {}
}
