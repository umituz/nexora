import SwiftUI
import AVKit

struct VideoPlayerView: View {
    let videoURL: URL
    @State private var player: AVPlayer?
    @State private var isPlaying = false
    @State private var duration: Double = 0
    @State private var currentTime: Double = 0
    @State private var timeObserver: Any?
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        VStack(spacing: 0) {
            // Toolbar
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text("Video Preview")
                        .font(.title3.bold())
                    Text(videoURL.lastPathComponent)
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                Spacer()
                Button { dismiss() } label: {
                    Image(systemName: "xmark.circle.fill")
                        .font(.title3).foregroundStyle(.secondary)
                }
                .buttonStyle(.plain)
            }
            .padding(.horizontal, 20).padding(.vertical, 14)

            Divider()

            // Player
            ZStack {
                Color.black
                if let player {
                    AVPlayerViewRepresentable(player: player)
                } else {
                    VStack(spacing: 12) {
                        ProgressView()
                            .scaleEffect(1.3)
                        Text("Loading video...")
                            .foregroundColor(.white.opacity(0.6))
                            .font(.subheadline)
                    }
                }
            }
            .frame(maxWidth: .infinity)
            .aspectRatio(16/9, contentMode: .fit)

            Divider()

            // Controls
            VStack(spacing: 10) {
                // Seek bar
                Slider(value: $currentTime, in: 0...max(duration, 1)) { editing in
                    if !editing { player?.seek(to: CMTime(seconds: currentTime, preferredTimescale: 600)) }
                }
                .tint(AppTheme.accent)

                HStack {
                    Text(formatTime(currentTime))
                        .font(.system(.caption, design: .monospaced))
                        .foregroundColor(.secondary)
                    Spacer()

                    HStack(spacing: 20) {
                        Button {
                            let t = max(currentTime - 10, 0)
                            player?.seek(to: CMTime(seconds: t, preferredTimescale: 600))
                        } label: {
                            Image(systemName: "gobackward.10")
                                .font(.title3)
                        }
                        .buttonStyle(.plain)

                        Button {
                            togglePlayback()
                        } label: {
                            Image(systemName: isPlaying ? "pause.circle.fill" : "play.circle.fill")
                                .font(.system(size: 36))
                                .foregroundStyle(AppTheme.accentGradient)
                        }
                        .buttonStyle(.plain)

                        Button {
                            let t = min(currentTime + 10, duration)
                            player?.seek(to: CMTime(seconds: t, preferredTimescale: 600))
                        } label: {
                            Image(systemName: "goforward.10")
                                .font(.title3)
                        }
                        .buttonStyle(.plain)
                    }

                    Spacer()
                    Text(formatTime(duration))
                        .font(.system(.caption, design: .monospaced))
                        .foregroundColor(.secondary)
                }

                HStack(spacing: 10) {
                    Spacer()
                    Button {
                        NSWorkspace.shared.activateFileViewerSelecting([videoURL])
                    } label: {
                        Label("Show in Finder", systemImage: "folder")
                    }
                    .buttonStyle(.bordered)

                    Button {
                        let sharing = NSSharingServicePicker(items: [videoURL])
                        if let view = NSApp.keyWindow?.contentView {
                            sharing.show(relativeTo: .zero, of: view, preferredEdge: .minY)
                        }
                    } label: {
                        Label("Share", systemImage: "square.and.arrow.up")
                    }
                    .buttonStyle(.bordered)
                }
            }
            .padding(.horizontal, 20).padding(.vertical, 14)
        }
        .frame(width: 720, height: 540)
        .onAppear { setupPlayer() }
        .onDisappear { teardown() }
    }

    private func setupPlayer() {
        let avPlayer = AVPlayer(url: videoURL)
        self.player = avPlayer

        // Duration
        let asset = AVAsset(url: videoURL)
        Task {
            let dur = try? await asset.load(.duration)
            await MainActor.run {
                self.duration = dur?.seconds ?? 0
            }
        }

        // Time observer
        let interval = CMTime(seconds: 0.5, preferredTimescale: 600)
        timeObserver = avPlayer.addPeriodicTimeObserver(forInterval: interval, queue: .main) { [weak avPlayer] time in
            currentTime = time.seconds
            isPlaying = avPlayer?.rate != 0
        }

        // Loop
        NotificationCenter.default.addObserver(
            forName: .AVPlayerItemDidPlayToEndTime,
            object: avPlayer.currentItem,
            queue: .main
        ) { _ in
            avPlayer.seek(to: .zero)
            isPlaying = false
        }
    }

    private func teardown() {
        if let observer = timeObserver {
            player?.removeTimeObserver(observer)
        }
        player?.pause()
        player = nil
    }

    private func togglePlayback() {
        guard let player else { return }
        if isPlaying { player.pause() } else { player.play() }
        isPlaying.toggle()
    }

    private func formatTime(_ seconds: Double) -> String {
        guard !seconds.isNaN && !seconds.isInfinite else { return "0:00" }
        let s = Int(seconds)
        return String(format: "%d:%02d", s / 60, s % 60)
    }
}

// MARK: - AVPlayerView wrapper

struct AVPlayerViewRepresentable: NSViewRepresentable {
    let player: AVPlayer

    func makeNSView(context: Context) -> AVPlayerView {
        let view = AVPlayerView()
        view.player = player
        view.controlsStyle = .none
        view.videoGravity = .resizeAspect
        return view
    }

    func updateNSView(_ nsView: AVPlayerView, context: Context) {
        nsView.player = player
    }
}
