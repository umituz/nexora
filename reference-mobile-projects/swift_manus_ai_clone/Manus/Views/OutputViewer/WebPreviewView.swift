import SwiftUI
import WebKit

// MARK: - Web Preview (WKWebView)

struct WebPreviewView: View {
    let output: AgentOutput
    @State private var isLoading = true
    @State private var progress: Double = 0
    @State private var currentURL = "https://example.com"
    @State private var showBrowser = false

    // Simulated live HTML for the landing page demo
    private let sampleHTML = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0a0a0f; color: #fff; }
      .hero { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;
              background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); padding: 40px 24px; text-align: center; }
      .badge { display: inline-block; background: rgba(99,102,241,0.2); border: 1px solid rgba(99,102,241,0.4);
               color: #818cf8; padding: 6px 16px; border-radius: 100px; font-size: 13px; font-weight: 600; margin-bottom: 24px; }
      h1 { font-size: 48px; font-weight: 800; line-height: 1.1; margin-bottom: 20px;
           background: linear-gradient(90deg, #fff 0%, #818cf8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
      p { font-size: 18px; color: rgba(255,255,255,0.65); max-width: 480px; line-height: 1.6; margin-bottom: 36px; }
      .buttons { display: flex; gap: 14px; flex-wrap: wrap; justify-content: center; }
      .btn-primary { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; padding: 14px 28px;
                     border-radius: 12px; font-weight: 700; font-size: 16px; border: none; cursor: pointer; }
      .btn-secondary { background: rgba(255,255,255,0.08); color: #fff; padding: 14px 28px;
                       border-radius: 12px; font-weight: 600; font-size: 16px; border: 1px solid rgba(255,255,255,0.15); cursor: pointer; }
      .features { padding: 80px 24px; max-width: 900px; margin: 0 auto; }
      .section-title { text-align: center; font-size: 32px; font-weight: 700; margin-bottom: 12px; }
      .section-sub { text-align: center; color: rgba(255,255,255,0.5); font-size: 16px; margin-bottom: 48px; }
      .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; }
      .card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 24px; }
      .card-icon { font-size: 28px; margin-bottom: 14px; }
      .card h3 { font-size: 18px; font-weight: 600; margin-bottom: 8px; }
      .card p { font-size: 14px; color: rgba(255,255,255,0.5); line-height: 1.6; }
      .pricing { background: rgba(99,102,241,0.06); border: 1px solid rgba(99,102,241,0.2); border-radius: 24px;
                 padding: 40px 24px; text-align: center; margin: 0 24px 80px; }
      .price { font-size: 56px; font-weight: 800; margin: 16px 0; }
      .price span { font-size: 20px; font-weight: 400; color: rgba(255,255,255,0.5); }
    </style>
    </head>
    <body>
    <div class="hero">
      <div class="badge">✦ AI-Generated Landing Page</div>
      <h1>Automate Everything with Nexus AI</h1>
      <p>Your intelligent agent that builds websites, writes reports, and executes complex tasks — while you focus on what matters.</p>
      <div class="buttons">
        <button class="btn-primary">Get Started Free</button>
        <button class="btn-secondary">Watch Demo →</button>
      </div>
    </div>
    <div class="features">
      <div class="section-title">Why choose Nexus?</div>
      <div class="section-sub">Built for makers, founders, and teams who move fast</div>
      <div class="grid">
        <div class="card"><div class="card-icon">🤖</div><h3>Autonomous Agents</h3><p>Set a goal, walk away. Nexus plans, executes, and delivers complete results.</p></div>
        <div class="card"><div class="card-icon">🔗</div><h3>100+ Integrations</h3><p>GitHub, Figma, Notion, Slack and more. Your tools, supercharged by AI.</p></div>
        <div class="card"><div class="card-icon">⚡</div><h3>Lightning Fast</h3><p>Multi-agent parallelism means complex tasks finish in minutes, not hours.</p></div>
        <div class="card"><div class="card-icon">🔒</div><h3>Enterprise Ready</h3><p>SOC 2 compliant with full audit logs and role-based access control.</p></div>
      </div>
    </div>
    <div class="pricing">
      <div>Starting from</div>
      <div class="price">$29<span>/mo</span></div>
      <button class="btn-primary" style="margin-top:8px">Start Free Trial</button>
    </div>
    </body>
    </html>
    """

    var body: some View {
        VStack(spacing: 0) {
            // Browser chrome bar
            browserBar
            // Progress bar
            if isLoading {
                GeometryReader { geo in
                    Rectangle()
                        .fill(LinearGradient(colors: [.blue, .cyan], startPoint: .leading, endPoint: .trailing))
                        .frame(width: geo.size.width * progress, height: 2)
                        .animation(.easeInOut(duration: 0.3), value: progress)
                }
                .frame(height: 2)
            }
            // Web view
            WebViewRepresentable(html: sampleHTML, isLoading: $isLoading, progress: $progress)
        }
        .background(Color(white: 0.07))
        .onAppear { simulateLoad() }
    }

    private func simulateLoad() {
        isLoading = true
        withAnimation { progress = 0.3 }
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.6) {
            withAnimation { progress = 0.7 }
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.2) {
            withAnimation { progress = 1.0 }
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
                isLoading = false
            }
        }
    }

    @ViewBuilder
    private var browserBar: some View {
        HStack(spacing: 10) {
            HStack(spacing: 8) {
                Image(systemName: "lock.fill")
                    .font(.caption2)
                    .foregroundStyle(.green)
                Text("nexus-landing.vercel.app")
                    .font(.caption)
                    .foregroundStyle(.white.opacity(0.8))
                    .lineLimit(1)
                Spacer()
                if isLoading {
                    ProgressView()
                        .scaleEffect(0.7)
                        .tint(.gray)
                }
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 9)
            .background(Color.white.opacity(0.08))
            .clipShape(RoundedRectangle(cornerRadius: 10))
            Button {
                simulateLoad()
            } label: {
                Image(systemName: "arrow.clockwise")
                    .font(.system(size: 14))
                    .foregroundStyle(.gray)
            }
        }
        .padding(.horizontal, 14)
        .padding(.vertical, 10)
        .background(Color(white: 0.07))
    }
}

// MARK: - WKWebView Representable

struct WebViewRepresentable: UIViewRepresentable {
    let html: String
    @Binding var isLoading: Bool
    @Binding var progress: Double

    func makeUIView(context: Context) -> WKWebView {
        let config = WKWebViewConfiguration()
        let wv = WKWebView(frame: .zero, configuration: config)
        wv.backgroundColor = UIColor(white: 0.05, alpha: 1)
        wv.scrollView.backgroundColor = UIColor(white: 0.05, alpha: 1)
        wv.isOpaque = false
        wv.navigationDelegate = context.coordinator
        wv.loadHTMLString(html, baseURL: nil)
        return wv
    }

    func updateUIView(_ uiView: WKWebView, context: Context) {}

    func makeCoordinator() -> Coordinator { Coordinator(self) }

    class Coordinator: NSObject, WKNavigationDelegate {
        let parent: WebViewRepresentable
        init(_ parent: WebViewRepresentable) { self.parent = parent }

        func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.2) {
                self.parent.isLoading = false
            }
        }
    }
}
