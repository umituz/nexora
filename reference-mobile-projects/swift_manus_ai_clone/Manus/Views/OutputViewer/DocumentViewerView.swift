import SwiftUI

// MARK: - Document Viewer (PDF-style rendered document)

struct DocumentViewerView: View {
    let output: AgentOutput
    @State private var currentPage = 1
    @State private var totalPages = 12
    @State private var zoomScale: CGFloat = 1.0
    @State private var showThumbnails = false

    var body: some View {
        VStack(spacing: 0) {
            // Toolbar
            docToolbar
            // Content
            ZStack {
                Color(white: 0.15).ignoresSafeArea()
                if showThumbnails {
                    thumbnailGrid
                } else {
                    documentPages
                }
            }
            // Page navigation bar
            pageNavBar
        }
    }

    @ViewBuilder
    private var docToolbar: some View {
        HStack(spacing: 14) {
            Button {
                withAnimation { showThumbnails.toggle() }
            } label: {
                Image(systemName: showThumbnails ? "doc.text.fill" : "square.grid.2x2")
                    .font(.system(size: 15))
                    .foregroundStyle(showThumbnails ? .blue : .gray)
            }
            Divider().frame(height: 20)
            Text("Page \(currentPage) of \(totalPages)")
                .font(.caption)
                .foregroundStyle(.gray)
            Spacer()
            HStack(spacing: 16) {
                Button {
                    withAnimation { zoomScale = max(0.5, zoomScale - 0.25) }
                } label: {
                    Image(systemName: "minus.magnifyingglass").font(.system(size: 16)).foregroundStyle(.gray)
                }
                Text("\(Int(zoomScale * 100))%")
                    .font(.caption)
                    .foregroundStyle(.gray)
                    .frame(width: 42)
                Button {
                    withAnimation { zoomScale = min(2.0, zoomScale + 0.25) }
                } label: {
                    Image(systemName: "plus.magnifyingglass").font(.system(size: 16)).foregroundStyle(.gray)
                }
            }
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 10)
        .background(Color(white: 0.09))
    }

    @ViewBuilder
    private var documentPages: some View {
        ScrollView(showsIndicators: false) {
            VStack(spacing: 20) {
                ForEach(1...totalPages, id: \.self) { page in
                    PitchSlideView(slideNumber: page, zoomScale: zoomScale)
                        .id(page)
                        .shadow(color: .black.opacity(0.5), radius: 12, y: 6)
                }
            }
            .padding(.vertical, 24)
            .padding(.horizontal, 20)
        }
    }

    @ViewBuilder
    private var thumbnailGrid: some View {
        ScrollView {
            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                ForEach(1...totalPages, id: \.self) { page in
                    Button {
                        currentPage = page
                        withAnimation { showThumbnails = false }
                    } label: {
                        ZStack(alignment: .bottomTrailing) {
                            PitchSlideView(slideNumber: page, zoomScale: 0.3)
                                .frame(height: 80)
                                .clipShape(RoundedRectangle(cornerRadius: 8))
                                .overlay(
                                    RoundedRectangle(cornerRadius: 8)
                                        .stroke(currentPage == page ? Color.blue : Color.white.opacity(0.1), lineWidth: currentPage == page ? 2 : 1)
                                )
                            Text("\(page)")
                                .font(.system(size: 9, weight: .bold))
                                .foregroundStyle(.white)
                                .padding(4)
                                .background(Color.black.opacity(0.7))
                                .clipShape(RoundedRectangle(cornerRadius: 4))
                                .padding(4)
                        }
                    }
                }
            }
            .padding(16)
        }
    }

    @ViewBuilder
    private var pageNavBar: some View {
        HStack(spacing: 24) {
            Button {
                withAnimation { if currentPage > 1 { currentPage -= 1 } }
            } label: {
                Image(systemName: "chevron.left")
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundStyle(currentPage > 1 ? .white : .gray.opacity(0.4))
            }
            .disabled(currentPage == 1)

            // Page dots
            HStack(spacing: 6) {
                ForEach(pageDotsRange, id: \.self) { i in
                    Circle()
                        .fill(i == currentPage ? Color.white : Color.white.opacity(0.3))
                        .frame(width: i == currentPage ? 8 : 5, height: i == currentPage ? 8 : 5)
                        .animation(.spring(duration: 0.2), value: currentPage)
                }
            }

            Button {
                withAnimation { if currentPage < totalPages { currentPage += 1 } }
            } label: {
                Image(systemName: "chevron.right")
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundStyle(currentPage < totalPages ? .white : .gray.opacity(0.4))
            }
            .disabled(currentPage == totalPages)
        }
        .padding(.vertical, 14)
        .background(Color(white: 0.07))
    }

    private var pageDotsRange: [Int] {
        let half = 4
        let start = max(1, min(currentPage - half, totalPages - 2 * half))
        let end = min(totalPages, start + 2 * half)
        return Array(start...end)
    }
}

// MARK: - Pitch Slide View

struct PitchSlideView: View {
    let slideNumber: Int
    let zoomScale: CGFloat

    private var slideContent: (title: String, subtitle: String, icon: String, accent: Color, bg: [Color]) {
        switch slideNumber {
        case 1:  return ("Nexus AI", "The Autonomous Agent Platform", "sparkles", .indigo, [Color(red:0.08,green:0.08,blue:0.18), Color(red:0.12,green:0.08,blue:0.25)])
        case 2:  return ("The Problem", "Teams waste 60% of time on repetitive work", "exclamationmark.triangle.fill", .orange, [Color(red:0.18,green:0.10,blue:0.05), Color(red:0.12,green:0.08,blue:0.04)])
        case 3:  return ("Our Solution", "AI agents that do the work for you", "cpu.fill", .cyan, [Color(red:0.05,green:0.14,blue:0.20), Color(red:0.04,green:0.10,blue:0.16)])
        case 4:  return ("Market Size", "$420B TAM by 2028", "chart.pie.fill", .green, [Color(red:0.05,green:0.16,blue:0.09), Color(red:0.04,green:0.12,blue:0.07)])
        case 5:  return ("Product Demo", "See Nexus in action", "play.circle.fill", .blue, [Color(red:0.05,green:0.10,blue:0.22), Color(red:0.04,green:0.08,blue:0.18)])
        case 6:  return ("Traction", "10K users · $240K ARR", "arrow.up.right.circle.fill", .yellow, [Color(red:0.18,green:0.16,blue:0.04), Color(red:0.14,green:0.12,blue:0.03)])
        case 7:  return ("Business Model", "SaaS + Usage-based pricing", "creditcard.fill", .purple, [Color(red:0.14,green:0.06,blue:0.22), Color(red:0.10,green:0.05,blue:0.18)])
        case 8:  return ("Competitive Edge", "10x faster than existing tools", "bolt.circle.fill", .red, [Color(red:0.20,green:0.06,blue:0.06), Color(red:0.16,green:0.05,blue:0.05)])
        case 9:  return ("Team", "Ex-Google, OpenAI, Stripe", "person.3.fill", .teal, [Color(red:0.04,green:0.14,blue:0.14), Color(red:0.03,green:0.10,blue:0.11)])
        case 10: return ("Roadmap", "Q1: Mobile · Q2: Enterprise · Q3: API", "map.fill", .mint, [Color(red:0.04,green:0.16,blue:0.13), Color(red:0.03,green:0.12,blue:0.10)])
        case 11: return ("Financials", "Break-even at Month 18", "chart.line.uptrend.xyaxis", .indigo, [Color(red:0.06,green:0.06,blue:0.20), Color(red:0.05,green:0.05,blue:0.16)])
        default: return ("The Ask", "Raising $3M Seed Round", "star.circle.fill", .yellow, [Color(red:0.16,green:0.14,blue:0.04), Color(red:0.12,green:0.10,blue:0.03)])
        }
    }

    var body: some View {
        let c = slideContent
        ZStack {
            LinearGradient(colors: c.bg, startPoint: .topLeading, endPoint: .bottomTrailing)
            // Decorative circle
            Circle()
                .fill(c.accent.opacity(0.08))
                .frame(width: 200, height: 200)
                .offset(x: 80, y: -60)
            Circle()
                .fill(c.accent.opacity(0.05))
                .frame(width: 120, height: 120)
                .offset(x: -60, y: 60)
            VStack(spacing: 12 * zoomScale) {
                Image(systemName: c.icon)
                    .font(.system(size: 36 * zoomScale))
                    .foregroundStyle(c.accent)
                Text(c.title)
                    .font(.system(size: 22 * zoomScale, weight: .bold))
                    .foregroundStyle(.white)
                    .multilineTextAlignment(.center)
                Text(c.subtitle)
                    .font(.system(size: 13 * zoomScale))
                    .foregroundStyle(.white.opacity(0.6))
                    .multilineTextAlignment(.center)
                // Slide number pill
                Text("0\(slideNumber < 10 ? "0" : "")\(slideNumber)")
                    .font(.system(size: 10 * zoomScale, weight: .semibold, design: .monospaced))
                    .foregroundStyle(c.accent.opacity(0.7))
                    .padding(.top, 6 * zoomScale)
            }
            .padding(24 * zoomScale)
        }
        .frame(maxWidth: .infinity)
        .aspectRatio(16/9, contentMode: .fit)
        .clipShape(RoundedRectangle(cornerRadius: 12))
    }
}
