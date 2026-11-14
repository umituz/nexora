import SwiftUI

// MARK: - Image Viewer

struct ImageViewerView: View {
    let output: AgentOutput
    @State private var selectedIndex = 0
    @State private var scale: CGFloat = 1.0
    @State private var offset: CGSize = .zero
    @State private var showInfo = false
    @GestureState private var dragOffset: CGSize = .zero

    private let images = ImageViewerData.sampleImages

    var body: some View {
        VStack(spacing: 0) {
            mainImageArea
            thumbnailStrip
            infoPanel
        }
        .background(Color.black)
    }

    // MARK: - Main Image

    @ViewBuilder
    private var mainImageArea: some View {
        ZStack(alignment: .topTrailing) {
            Color.black
            GeometryReader { geo in
                ZStack {
                    generatedImageView(images[selectedIndex], size: geo.size)
                        .scaleEffect(scale)
                        .offset(x: offset.width + dragOffset.width,
                                y: offset.height + dragOffset.height)
                        .gesture(
                            DragGesture()
                                .updating($dragOffset) { value, state, _ in state = value.translation }
                                .onEnded { v in offset.width += v.translation.width; offset.height += v.translation.height }
                        )
                        .gesture(
                            MagnificationGesture()
                                .onChanged { v in scale = max(0.5, min(4.0, v)) }
                                .onEnded { _ in withAnimation(.spring()) { if scale < 1 { scale = 1; offset = .zero } } }
                        )
                        .onTapGesture(count: 2) {
                            withAnimation(.spring(duration: 0.3)) {
                                if scale > 1 { scale = 1; offset = .zero } else { scale = 2 }
                            }
                        }
                }
            }

            // Controls overlay
            VStack(spacing: 0) {
                imageTopBar
                Spacer()
                imageBottomOverlay
            }
        }
        .frame(maxHeight: .infinity)
        .clipped()
    }

    @ViewBuilder
    private var imageTopBar: some View {
        HStack {
            Text("\(selectedIndex + 1) / \(images.count)")
                .font(.caption)
                .fontWeight(.semibold)
                .foregroundStyle(.white)
                .padding(.horizontal, 12)
                .padding(.vertical, 6)
                .background(Color.black.opacity(0.5))
                .clipShape(Capsule())
            Spacer()
            HStack(spacing: 12) {
                Button {
                    withAnimation(.spring()) { scale = 1; offset = .zero }
                } label: {
                    Image(systemName: "arrow.up.left.and.arrow.down.right")
                        .font(.system(size: 14))
                        .foregroundStyle(.white)
                        .padding(8)
                        .background(Color.black.opacity(0.5))
                        .clipShape(Circle())
                }
                Button {
                    withAnimation { showInfo.toggle() }
                } label: {
                    Image(systemName: "info.circle")
                        .font(.system(size: 14))
                        .foregroundStyle(.white)
                        .padding(8)
                        .background(Color.black.opacity(0.5))
                        .clipShape(Circle())
                }
            }
        }
        .padding(16)
    }

    @ViewBuilder
    private var imageBottomOverlay: some View {
        if showInfo {
            let img = images[selectedIndex]
            VStack(alignment: .leading, spacing: 8) {
                Text(img.title)
                    .font(.subheadline).fontWeight(.semibold).foregroundStyle(.white)
                Text(img.prompt)
                    .font(.caption).foregroundStyle(.white.opacity(0.7)).lineLimit(2)
                HStack(spacing: 16) {
                    infoChip(img.style, icon: "paintbrush.fill")
                    infoChip(img.resolution, icon: "aspectratio.fill")
                    infoChip(img.model, icon: "cpu")
                }
            }
            .padding(16)
            .background(
                LinearGradient(colors: [.clear, .black.opacity(0.9)], startPoint: .top, endPoint: .bottom)
            )
            .transition(.move(edge: .bottom).combined(with: .opacity))
        }
    }

    @ViewBuilder
    private func infoChip(_ text: String, icon: String) -> some View {
        HStack(spacing: 4) {
            Image(systemName: icon).font(.caption2).foregroundStyle(.gray)
            Text(text).font(.caption2).foregroundStyle(.gray)
        }
    }

    // MARK: - Thumbnail Strip

    @ViewBuilder
    private var thumbnailStrip: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                ForEach(images.indices, id: \.self) { i in
                    Button {
                        withAnimation(.spring(duration: 0.25)) {
                            selectedIndex = i
                            scale = 1
                            offset = .zero
                        }
                    } label: {
                        generatedImageView(images[i], size: CGSize(width: 60, height: 60))
                            .frame(width: 60, height: 60)
                            .clipShape(RoundedRectangle(cornerRadius: 10))
                            .overlay(
                                RoundedRectangle(cornerRadius: 10)
                                    .stroke(selectedIndex == i ? Color.white : Color.clear, lineWidth: 2.5)
                            )
                            .scaleEffect(selectedIndex == i ? 1.0 : 0.92)
                    }
                }
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
        }
        .background(Color(white: 0.07))
    }

    // MARK: - Info Panel (collapsed)

    @ViewBuilder
    private var infoPanel: some View {
        HStack(spacing: 16) {
            VStack(alignment: .leading, spacing: 2) {
                Text(images[selectedIndex].title)
                    .font(.subheadline).fontWeight(.semibold).foregroundStyle(.white)
                Text(images[selectedIndex].style + " · " + images[selectedIndex].resolution)
                    .font(.caption).foregroundStyle(.gray)
            }
            Spacer()
            HStack(spacing: 12) {
                actionButton(icon: "square.and.arrow.down", label: "Save")
                actionButton(icon: "square.and.arrow.up", label: "Share")
            }
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
        .background(Color(white: 0.07))
    }

    @ViewBuilder
    private func actionButton(icon: String, label: String) -> some View {
        VStack(spacing: 3) {
            Image(systemName: icon).font(.system(size: 16)).foregroundStyle(.white)
            Text(label).font(.caption2).foregroundStyle(.gray)
        }
    }

    // MARK: - Generated Image Placeholder

    @ViewBuilder
    private func generatedImageView(_ img: GeneratedImage, size: CGSize) -> some View {
        ZStack {
            LinearGradient(
                colors: img.gradientColors,
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            VStack(spacing: 8) {
                Image(systemName: img.previewIcon)
                    .font(.system(size: min(size.width, size.height) * 0.25))
                    .foregroundStyle(.white.opacity(0.85))
                if size.width > 120 {
                    Text(img.title)
                        .font(.system(size: 11, weight: .medium))
                        .foregroundStyle(.white.opacity(0.6))
                        .multilineTextAlignment(.center)
                        .padding(.horizontal, 8)
                }
            }
            // Noise overlay
            Rectangle()
                .fill(.white.opacity(0.03))
                .blendMode(.overlay)
        }
    }
}

// MARK: - Data Models

struct GeneratedImage: Identifiable {
    let id = UUID()
    let title: String
    let prompt: String
    let style: String
    let resolution: String
    let model: String
    let gradientColors: [Color]
    let previewIcon: String
}

enum ImageViewerData {
    static let sampleImages: [GeneratedImage] = [
        GeneratedImage(
            title: "Hero Product Shot",
            prompt: "Futuristic AI dashboard interface, dark theme, glowing blue accents, ultra realistic 3D render",
            style: "Photorealistic",
            resolution: "1920×1080",
            model: "DALL·E 3",
            gradientColors: [Color(red: 0.05, green: 0.08, blue: 0.25), Color(red: 0.10, green: 0.20, blue: 0.45)],
            previewIcon: "macwindow"
        ),
        GeneratedImage(
            title: "Brand Logo Concept",
            prompt: "Minimal logo for AI company, geometric hexagon with neural network pattern, deep purple",
            style: "Minimalist",
            resolution: "1024×1024",
            model: "DALL·E 3",
            gradientColors: [Color(red: 0.22, green: 0.08, blue: 0.35), Color(red: 0.38, green: 0.12, blue: 0.55)],
            previewIcon: "hexagon.fill"
        ),
        GeneratedImage(
            title: "Social Banner",
            prompt: "Abstract data visualization, flowing particles and lines, vibrant purple to cyan gradient",
            style: "Abstract",
            resolution: "1200×628",
            model: "Midjourney",
            gradientColors: [Color(red: 0.08, green: 0.18, blue: 0.35), Color(red: 0.20, green: 0.35, blue: 0.50)],
            previewIcon: "waveform.path"
        ),
        GeneratedImage(
            title: "Team Photo Style",
            prompt: "Professional team at modern office, natural lighting, editorial photography style",
            style: "Editorial",
            resolution: "1600×900",
            model: "Stable Diffusion",
            gradientColors: [Color(red: 0.15, green: 0.18, blue: 0.12), Color(red: 0.28, green: 0.32, blue: 0.20)],
            previewIcon: "person.3.fill"
        ),
        GeneratedImage(
            title: "App Icon",
            prompt: "iOS app icon, gradient background indigo to blue, sparkle constellation symbol",
            style: "iOS Design",
            resolution: "1024×1024",
            model: "DALL·E 3",
            gradientColors: [Color(red: 0.24, green: 0.26, blue: 0.60), Color(red: 0.36, green: 0.42, blue: 0.85)],
            previewIcon: "sparkles"
        ),
        GeneratedImage(
            title: "Blog Cover",
            prompt: "Cyberpunk city skyline at night, neon reflections in rain puddles, cinematic composition",
            style: "Cinematic",
            resolution: "1400×788",
            model: "Midjourney",
            gradientColors: [Color(red: 0.05, green: 0.05, blue: 0.18), Color(red: 0.15, green: 0.05, blue: 0.22)],
            previewIcon: "building.2.fill"
        ),
    ]
}
