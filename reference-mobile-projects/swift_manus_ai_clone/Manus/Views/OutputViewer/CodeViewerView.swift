import SwiftUI

// MARK: - Code Viewer with Syntax Highlighting

struct CodeViewerView: View {
    let output: AgentOutput
    @State private var selectedFile = 0
    @State private var copied = false

    private let files = [
        CodeFile(name: "index.html", language: "HTML", icon: "globe", color: .orange, content: htmlSample),
        CodeFile(name: "styles.css", language: "CSS", icon: "paintbrush.fill", color: .blue, content: cssSample),
        CodeFile(name: "app.js", language: "JavaScript", icon: "bolt.fill", color: .yellow, content: jsSample),
    ]

    var body: some View {
        VStack(spacing: 0) {
            // File tabs
            fileTabBar
            // Stats bar
            statsBar
            // Code content
            ScrollView([.horizontal, .vertical], showsIndicators: true) {
                CodeContentView(file: files[selectedFile])
                    .padding(16)
                    .frame(maxWidth: .infinity, alignment: .leading)
            }
            .background(Color(red: 0.10, green: 0.10, blue: 0.13))
        }
    }

    @ViewBuilder
    private var fileTabBar: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 0) {
                ForEach(files.indices, id: \.self) { i in
                    Button {
                        withAnimation(.spring(duration: 0.2)) { selectedFile = i }
                    } label: {
                        HStack(spacing: 6) {
                            Image(systemName: files[i].icon)
                                .font(.caption2)
                                .foregroundStyle(files[i].color)
                            Text(files[i].name)
                                .font(.caption)
                                .fontWeight(selectedFile == i ? .semibold : .regular)
                                .foregroundStyle(selectedFile == i ? .white : .gray)
                        }
                        .padding(.horizontal, 14)
                        .padding(.vertical, 11)
                        .background(selectedFile == i ? Color.white.opacity(0.08) : Color.clear)
                        .overlay(alignment: .bottom) {
                            if selectedFile == i {
                                Rectangle().fill(files[i].color).frame(height: 2)
                            }
                        }
                    }
                }
            }
        }
        .background(Color(white: 0.07))
    }

    @ViewBuilder
    private var statsBar: some View {
        HStack(spacing: 16) {
            HStack(spacing: 4) {
                Image(systemName: "doc.text").font(.caption2).foregroundStyle(.gray)
                Text("\(files[selectedFile].lineCount) lines").font(.caption).foregroundStyle(.gray)
            }
            HStack(spacing: 4) {
                Image(systemName: "tag").font(.caption2).foregroundStyle(.gray)
                Text(files[selectedFile].language).font(.caption).foregroundStyle(.gray)
            }
            Spacer()
            Button {
                UIPasteboard.general.string = files[selectedFile].content
                withAnimation { copied = true }
                DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
                    withAnimation { copied = false }
                }
            } label: {
                HStack(spacing: 5) {
                    Image(systemName: copied ? "checkmark" : "doc.on.doc")
                        .font(.caption2)
                    Text(copied ? "Copied!" : "Copy")
                        .font(.caption)
                        .fontWeight(.medium)
                }
                .foregroundStyle(copied ? .green : .blue)
                .padding(.horizontal, 12)
                .padding(.vertical, 6)
                .background((copied ? Color.green : Color.blue).opacity(0.12))
                .clipShape(Capsule())
            }
        }
        .padding(.horizontal, 14)
        .padding(.vertical, 8)
        .background(Color(white: 0.09))
    }
}

// MARK: - Code File Model

struct CodeFile {
    let name: String
    let language: String
    let icon: String
    let color: Color
    let content: String
    var lineCount: Int { content.components(separatedBy: "\n").count }
}

// MARK: - Syntax Token

struct SyntaxToken {
    let text: String
    let color: Color
}

// MARK: - Code Content View (Syntax Highlighted)

struct CodeContentView: View {
    let file: CodeFile

    private let lineNumberColor = Color(white: 0.4)
    private let bgColor = Color(red: 0.10, green: 0.10, blue: 0.13)

    var body: some View {
        let lines = file.content.components(separatedBy: "\n")
        VStack(alignment: .leading, spacing: 0) {
            ForEach(lines.indices, id: \.self) { i in
                HStack(alignment: .top, spacing: 12) {
                    Text("\(i + 1)")
                        .font(.system(size: 12, design: .monospaced))
                        .foregroundStyle(lineNumberColor)
                        .frame(minWidth: 28, alignment: .trailing)
                    tokenizedLine(lines[i], language: file.language)
                        .frame(maxWidth: .infinity, alignment: .leading)
                }
                .padding(.vertical, 1.5)
            }
        }
    }

    @ViewBuilder
    private func tokenizedLine(_ line: String, language: String) -> some View {
        let tokens = tokenize(line, language: language)
        tokens.reduce(Text("")) { result, token in
            result + Text(token.text)
                .foregroundColor(token.color)
                .font(.system(size: 13, design: .monospaced))
        }
    }

    private func tokenize(_ line: String, language: String) -> [SyntaxToken] {
        let trimmed = line.trimmingCharacters(in: .whitespaces)
        let indent = String(line.prefix(line.count - line.drop(while: { $0 == " " }).count))
        var tokens: [SyntaxToken] = []
        if !indent.isEmpty { tokens.append(SyntaxToken(text: indent, color: .white)) }

        switch language {
        case "HTML":
            tokens += tokenizeHTML(trimmed)
        case "CSS":
            tokens += tokenizeCSS(trimmed)
        default:
            tokens += tokenizeJS(trimmed)
        }
        return tokens
    }

    // Simplified HTML tokenizer
    private func tokenizeHTML(_ s: String) -> [SyntaxToken] {
        if s.hasPrefix("<!--") { return [SyntaxToken(text: s, color: Color(white: 0.45))] }
        if s.hasPrefix("<") && s.hasSuffix(">") {
            let tagColor = Color(red: 0.58, green: 0.78, blue: 0.98)
            let attrColor = Color(red: 0.98, green: 0.74, blue: 0.56)
            let strColor = Color(red: 0.70, green: 0.90, blue: 0.62)
            var result: [SyntaxToken] = []
            // Simple split: opening/closing bracket, tag name, attributes
            let inner = String(s.dropFirst().dropLast())
            let parts = inner.components(separatedBy: " ")
            result.append(SyntaxToken(text: "<", color: Color(white: 0.6)))
            if let first = parts.first {
                let isClose = first.hasPrefix("/")
                result.append(SyntaxToken(text: first, color: tagColor))
            }
            for part in parts.dropFirst() {
                if part.contains("=") {
                    let kv = part.components(separatedBy: "=")
                    result.append(SyntaxToken(text: " " + (kv.first ?? ""), color: attrColor))
                    result.append(SyntaxToken(text: "=" + (kv.dropFirst().joined(separator: "=")), color: strColor))
                } else {
                    result.append(SyntaxToken(text: " " + part, color: attrColor))
                }
            }
            result.append(SyntaxToken(text: ">", color: Color(white: 0.6)))
            return result
        }
        return [SyntaxToken(text: s, color: .white)]
    }

    // Simplified CSS tokenizer
    private func tokenizeCSS(_ s: String) -> [SyntaxToken] {
        if s.hasPrefix("/*") { return [SyntaxToken(text: s, color: Color(white: 0.45))] }
        if s.hasSuffix("{") || s == "}" {
            return [SyntaxToken(text: s, color: Color(red: 0.88, green: 0.65, blue: 0.99))]
        }
        if s.contains(":") {
            let parts = s.components(separatedBy: ":")
            let prop = parts.first ?? ""
            let val = parts.dropFirst().joined(separator: ":")
            return [
                SyntaxToken(text: prop, color: Color(red: 0.58, green: 0.78, blue: 0.98)),
                SyntaxToken(text: ":", color: Color(white: 0.6)),
                SyntaxToken(text: val, color: Color(red: 0.70, green: 0.90, blue: 0.62)),
            ]
        }
        return [SyntaxToken(text: s, color: .white)]
    }

    // Simplified JS tokenizer
    private func tokenizeJS(_ s: String) -> [SyntaxToken] {
        if s.hasPrefix("//") { return [SyntaxToken(text: s, color: Color(white: 0.45))] }
        let keywords = ["const", "let", "var", "function", "return", "if", "else", "for", "of", "async", "await", "new", "import", "export", "default", "class", "this"]
        var result: [SyntaxToken] = []
        let words = s.components(separatedBy: " ")
        for (i, word) in words.enumerated() {
            let clean = word.trimmingCharacters(in: CharacterSet(charactersIn: "(),;{}[]"))
            let color: Color
            if keywords.contains(clean) {
                color = Color(red: 0.88, green: 0.65, blue: 0.99)
            } else if word.hasPrefix("\"") || word.hasPrefix("'") || word.hasPrefix("`") {
                color = Color(red: 0.70, green: 0.90, blue: 0.62)
            } else if Double(clean) != nil {
                color = Color(red: 0.98, green: 0.74, blue: 0.56)
            } else {
                color = .white
            }
            result.append(SyntaxToken(text: (i > 0 ? " " : "") + word, color: color))
        }
        return result
    }
}

// MARK: - Sample Code Content

private let htmlSample = """
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Nexus AI - Automate Everything</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <nav class="navbar">
    <div class="logo">✦ Nexus</div>
    <div class="nav-links">
      <a href="#features">Features</a>
      <a href="#pricing">Pricing</a>
      <button class="btn-primary">Get Started</button>
    </div>
  </nav>

  <section class="hero">
    <span class="badge">AI Agent Platform</span>
    <h1>Automate Everything<br>with Nexus AI</h1>
    <p>Your intelligent agent that builds, researches,
       and executes complex tasks autonomously.</p>
    <div class="hero-buttons">
      <button class="btn-primary">Start for Free</button>
      <button class="btn-secondary">Watch Demo →</button>
    </div>
  </section>

  <section id="features" class="features">
    <h2>Built for makers who move fast</h2>
    <div class="feature-grid">
      <div class="feature-card">
        <span class="icon">🤖</span>
        <h3>Autonomous Agents</h3>
        <p>Set a goal, walk away. Nexus delivers.</p>
      </div>
      <div class="feature-card">
        <span class="icon">🔗</span>
        <h3>100+ Integrations</h3>
        <p>GitHub, Figma, Notion, Slack and more.</p>
      </div>
    </div>
  </section>

  <script src="app.js"></script>
</body>
</html>
"""

private let cssSample = """
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --color-bg: #0a0a0f;
  --color-primary: #6366f1;
  --color-text: #ffffff;
  --color-muted: rgba(255, 255, 255, 0.5);
  --radius-lg: 16px;
  --radius-full: 100px;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: var(--color-bg);
  color: var(--color-text);
  line-height: 1.6;
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 40px;
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.hero {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 80px 24px;
  background: radial-gradient(ellipse at top, #1a1a2e, #0a0a0f);
}

h1 {
  font-size: clamp(40px, 8vw, 72px);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 20px;
  background: linear-gradient(90deg, #fff 0%, #818cf8 60%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.btn-primary {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff;
  padding: 14px 28px;
  border-radius: var(--radius-lg);
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(99, 102, 241, 0.4);
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
  margin-top: 48px;
}

.feature-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-lg);
  padding: 28px;
  transition: border-color 0.2s;
}

.feature-card:hover {
  border-color: rgba(99, 102, 241, 0.4);
}
"""

private let jsSample = """
// Nexus Landing Page — Interactive Logic

const CONFIG = {
  apiUrl: "https://api.nexus.ai",
  animationDuration: 300,
  particleCount: 60
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute('href'))
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
})

// Intersection Observer for scroll animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible')
      observer.unobserve(entry.target)
    }
  })
}, { threshold: 0.1 })

document.querySelectorAll('.feature-card').forEach(card => {
  observer.observe(card)
})

// CTA button — start free trial
async function handleSignup(email) {
  const response = await fetch(`${CONFIG.apiUrl}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, plan: 'free' })
  })
  const data = await response.json()
  if (data.success) {
    window.location.href = '/dashboard'
  }
}

// Particle background animation
class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.particles = []
    this.init()
  }

  init() {
    for (let i = 0; i < CONFIG.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.1
      })
    }
    this.animate()
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.particles.forEach(p => {
      p.x += p.vx
      p.y += p.vy
      if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1
      if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1
      this.ctx.beginPath()
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
      this.ctx.fillStyle = `rgba(99, 102, 241, ${p.opacity})`
      this.ctx.fill()
    })
    requestAnimationFrame(() => this.animate())
  }
}

const canvas = document.getElementById('particles')
if (canvas) new ParticleSystem(canvas)
"""
