import SwiftUI

// MARK: - Models

struct AgentChatMessage: Identifiable {
    let id = UUID()
    let role: AgentChatRole
    let content: String
    let timestamp: Date
    var attachedOutput: AgentOutput? = nil
}

enum AgentChatRole {
    case user, agent, system
}

struct ChatSession: Identifiable {
    let id = UUID()
    let title: String
    let lastMessage: String
    let timeAgo: String
    let taskCount: Int
    let gradient: [Color]
}

// MARK: - Main Chat View

struct AgentChatView: View {
    @State private var sessions: [ChatSession] = ChatSessionSampleData.sessions
    @State private var activeSession: ChatSession? = nil
    @State private var showNewChat = false

    var body: some View {
        NavigationStack {
            ZStack {
                Color.black.ignoresSafeArea()
                VStack(spacing: 0) {
                    chatBanner
                    sessionsList
                }
            }
            .navigationTitle("Chat")
            .toolbarColorScheme(.dark, for: .navigationBar)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button { showNewChat = true } label: {
                        Image(systemName: "square.and.pencil").foregroundStyle(.white)
                    }
                }
            }
            .sheet(isPresented: $showNewChat) {
                AgentConversationView(session: nil)
            }
            .navigationDestination(item: $activeSession) { session in
                AgentConversationView(session: session)
            }
        }
    }

    @ViewBuilder
    private var chatBanner: some View {
        HStack(spacing: 16) {
            ZStack {
                Circle()
                    .fill(LinearGradient(colors: [.blue, .purple], startPoint: .topLeading, endPoint: .bottomTrailing))
                    .frame(width: 52, height: 52)
                Image(systemName: "cpu.fill").font(.title3).foregroundStyle(.white)
            }
            VStack(alignment: .leading, spacing: 3) {
                Text("Nexus Agent")
                    .font(.headline).fontWeight(.bold).foregroundStyle(.white)
                HStack(spacing: 5) {
                    Circle().fill(Color.green).frame(width: 7, height: 7)
                    Text("Online · Ready to help").font(.caption).foregroundStyle(.gray)
                }
            }
            Spacer()
            VStack(alignment: .trailing, spacing: 3) {
                Text("\(sessions.count)").font(.title2).fontWeight(.bold).foregroundStyle(.white)
                Text("conversations").font(.caption2).foregroundStyle(.gray)
            }
        }
        .padding(.horizontal, 20).padding(.vertical, 16)
        .background(Color(white: 0.07))
    }

    @ViewBuilder
    private var sessionsList: some View {
        ScrollView(showsIndicators: false) {
            VStack(spacing: 0) {
                Button { showNewChat = true } label: {
                    HStack(spacing: 14) {
                        Image(systemName: "plus.message.fill")
                            .font(.body).foregroundStyle(.blue)
                            .frame(width: 44, height: 44)
                            .background(Color.blue.opacity(0.12))
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                        Text("New Conversation")
                            .font(.subheadline).fontWeight(.semibold).foregroundStyle(.white)
                        Spacer()
                        Image(systemName: "chevron.right").font(.caption).foregroundStyle(.gray.opacity(0.4))
                    }
                    .padding(.horizontal, 20).padding(.vertical, 14)
                }
                .buttonStyle(.plain)

                Divider().background(Color.white.opacity(0.07)).padding(.horizontal, 20)

                Text("Recent Conversations")
                    .font(.caption).fontWeight(.semibold).foregroundStyle(.gray)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(.horizontal, 20).padding(.top, 20).padding(.bottom, 10)

                ForEach(sessions) { session in
                    Button { activeSession = session } label: {
                        SessionRowView(session: session)
                    }
                    .buttonStyle(.plain)
                    if session.id != sessions.last?.id {
                        Divider().background(Color.white.opacity(0.07)).padding(.leading, 76)
                    }
                }
            }
        }
    }
}

// MARK: - Session Row

struct SessionRowView: View {
    let session: ChatSession

    var body: some View {
        HStack(spacing: 14) {
            ZStack {
                RoundedRectangle(cornerRadius: 12)
                    .fill(LinearGradient(colors: session.gradient, startPoint: .topLeading, endPoint: .bottomTrailing))
                    .frame(width: 44, height: 44)
                Image(systemName: "cpu.fill").font(.caption).foregroundStyle(.white)
            }
            VStack(alignment: .leading, spacing: 3) {
                HStack {
                    Text(session.title)
                        .font(.subheadline).fontWeight(.semibold).foregroundStyle(.white)
                    Spacer()
                    Text(session.timeAgo).font(.caption2).foregroundStyle(.gray)
                }
                Text(session.lastMessage).font(.caption).foregroundStyle(.gray).lineLimit(1)
                Text("\(session.taskCount) tasks created").font(.caption2).foregroundStyle(.blue.opacity(0.8))
            }
        }
        .padding(.horizontal, 20).padding(.vertical, 14)
    }
}

// MARK: - Conversation View

struct AgentConversationView: View {
    let session: ChatSession?
    @Environment(\.dismiss) private var dismiss
    @State private var messages: [AgentChatMessage] = ChatSessionSampleData.messages
    @State private var inputText = ""
    @State private var isTyping = false
    @FocusState private var inputFocused: Bool

    var body: some View {
        ZStack {
            Color.black.ignoresSafeArea()
            VStack(spacing: 0) {
                convoHeader
                messagesList
                chatInputBar
            }
        }
        .navigationBarHidden(true)
    }

    @ViewBuilder
    private var convoHeader: some View {
        HStack(spacing: 12) {
            Button { dismiss() } label: {
                Image(systemName: "chevron.left")
                    .font(.system(size: 17, weight: .semibold)).foregroundStyle(.white)
            }
            ZStack {
                Circle()
                    .fill(LinearGradient(colors: [.blue, .purple], startPoint: .topLeading, endPoint: .bottomTrailing))
                    .frame(width: 36, height: 36)
                Image(systemName: "cpu.fill").font(.caption).foregroundStyle(.white)
            }
            VStack(alignment: .leading, spacing: 1) {
                Text(session?.title ?? "New Conversation")
                    .font(.subheadline).fontWeight(.semibold).foregroundStyle(.white)
                HStack(spacing: 4) {
                    Circle().fill(Color.green).frame(width: 6, height: 6)
                    Text("Nexus Agent · Active").font(.caption2).foregroundStyle(.gray)
                }
            }
            Spacer()
            Menu {
                Button(action: {}) { Label("Export Chat", systemImage: "square.and.arrow.up") }
                Button(action: {}) { Label("New Task from Chat", systemImage: "plus.circle") }
                Divider()
                Button(role: .destructive, action: {}) { Label("Clear History", systemImage: "trash") }
            } label: {
                Image(systemName: "ellipsis.circle").font(.body).foregroundStyle(.white)
            }
        }
        .padding(.horizontal, 20).padding(.vertical, 14)
        .background(Color(white: 0.07))
    }

    @ViewBuilder
    private var messagesList: some View {
        ScrollViewReader { proxy in
            ScrollView(showsIndicators: false) {
                LazyVStack(spacing: 16) {
                    dateDivider("Today")
                    ForEach(messages) { msg in
                        AgentBubble(message: msg).id(msg.id)
                    }
                    if isTyping { typingDots }
                }
                .padding(.horizontal, 16).padding(.vertical, 16)
            }
            .onChange(of: messages.count) { _, _ in
                if let last = messages.last {
                    withAnimation { proxy.scrollTo(last.id, anchor: .bottom) }
                }
            }
        }
    }

    @ViewBuilder
    private func dateDivider(_ label: String) -> some View {
        HStack {
            Rectangle().fill(Color.white.opacity(0.08)).frame(height: 1)
            Text(label).font(.caption2).foregroundStyle(.gray).padding(.horizontal, 10)
            Rectangle().fill(Color.white.opacity(0.08)).frame(height: 1)
        }
    }

    @ViewBuilder
    private var typingDots: some View {
        HStack(alignment: .bottom, spacing: 8) {
            Circle()
                .fill(LinearGradient(colors: [.blue, .purple], startPoint: .topLeading, endPoint: .bottomTrailing))
                .frame(width: 30, height: 30)
                .overlay(Image(systemName: "cpu.fill").font(.caption2).foregroundStyle(.white))
            HStack(spacing: 4) {
                ForEach(0..<3, id: \.self) { _ in
                    Circle().fill(Color.gray).frame(width: 7, height: 7).opacity(0.6)
                }
            }
            .padding(.horizontal, 14).padding(.vertical, 12)
            .background(Color.white.opacity(0.08))
            .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
            Spacer()
        }
    }

    @ViewBuilder
    private var chatInputBar: some View {
        VStack(spacing: 0) {
            Divider().background(Color.white.opacity(0.08))
            HStack(spacing: 12) {
                Button(action: {}) {
                    Image(systemName: "paperclip").font(.body).foregroundStyle(.gray)
                }
                HStack(spacing: 8) {
                    TextField("Ask agent to do anything...", text: $inputText, axis: .vertical)
                        .font(.subheadline).foregroundStyle(.white).lineLimit(4).focused($inputFocused)
                    if !inputText.isEmpty {
                        Button { sendMessage() } label: {
                            Image(systemName: "arrow.up.circle.fill")
                                .font(.title3)
                                .foregroundStyle(LinearGradient(colors: [.blue, .purple], startPoint: .topLeading, endPoint: .bottomTrailing))
                        }
                    }
                }
                .padding(.horizontal, 14).padding(.vertical, 10)
                .background(Color.white.opacity(0.08))
                .clipShape(RoundedRectangle(cornerRadius: 22))
            }
            .padding(.horizontal, 16).padding(.vertical, 12)
        }
        .background(Color.black)
    }

    private func sendMessage() {
        let text = inputText.trimmingCharacters(in: .whitespaces)
        guard !text.isEmpty else { return }
        inputText = ""
        messages.append(AgentChatMessage(role: .user, content: text, timestamp: Date()))
        isTyping = true
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
            isTyping = false
            messages.append(AgentChatMessage(
                role: .agent,
                content: "Got it! I'll start working on \"\(text)\" right away. I'll break this into steps and let you know when each part is complete.",
                timestamp: Date()
            ))
        }
    }
}

// MARK: - Agent Bubble

struct AgentBubble: View {
    let message: AgentChatMessage

    var body: some View {
        HStack(alignment: .bottom, spacing: 8) {
            if message.role == .user { Spacer(minLength: 60) }
            if message.role == .agent { agentAvatar }
            VStack(alignment: message.role == .user ? .trailing : .leading, spacing: 4) {
                bubbleBody
                Text(timeStr).font(.caption2).foregroundStyle(.gray.opacity(0.6))
            }
            if message.role == .agent { Spacer(minLength: 60) }
        }
    }

    @ViewBuilder
    private var agentAvatar: some View {
        Circle()
            .fill(LinearGradient(colors: [.blue, .purple], startPoint: .topLeading, endPoint: .bottomTrailing))
            .frame(width: 30, height: 30)
            .overlay(Image(systemName: "cpu.fill").font(.caption2).foregroundStyle(.white))
    }

    @ViewBuilder
    private var bubbleBody: some View {
        if let output = message.attachedOutput {
            outputCard(output)
        } else {
            textBubble
        }
    }

    @ViewBuilder
    private var textBubble: some View {
        Text(message.content)
            .font(.subheadline).foregroundStyle(.white)
            .padding(.horizontal, 14).padding(.vertical, 10)
            .background(bubbleBg)
            .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
    }

    private var bubbleBg: some View {
        Group {
            if message.role == .user {
                LinearGradient(colors: [.blue, .purple], startPoint: .topLeading, endPoint: .bottomTrailing)
            } else {
                LinearGradient(colors: [Color.white.opacity(0.1), Color.white.opacity(0.1)], startPoint: .top, endPoint: .bottom)
            }
        }
    }

    @ViewBuilder
    private func outputCard(_ output: AgentOutput) -> some View {
        HStack(spacing: 10) {
            Image(systemName: output.icon)
                .font(.body).foregroundStyle(output.color)
                .frame(width: 36, height: 36).background(output.color.opacity(0.12))
                .clipShape(RoundedRectangle(cornerRadius: 10))
            VStack(alignment: .leading, spacing: 2) {
                Text(output.title).font(.caption).fontWeight(.semibold).foregroundStyle(.white)
                Text(output.preview).font(.caption2).foregroundStyle(.gray)
            }
            Spacer()
            Image(systemName: "arrow.down.circle.fill").font(.title3).foregroundStyle(.blue)
        }
        .padding(12)
        .background(Color.white.opacity(0.08))
        .clipShape(RoundedRectangle(cornerRadius: 16))
        .frame(maxWidth: 280)
    }

    private var timeStr: String {
        let f = DateFormatter(); f.timeStyle = .short
        return f.string(from: message.timestamp)
    }
}

// MARK: - Sample Data

enum ChatSessionSampleData {
    static let sessions: [ChatSession] = [
        ChatSession(title: "Landing Page Build", lastMessage: "Your landing page is live! Check the preview link.", timeAgo: "2m", taskCount: 3, gradient: [.blue, .cyan]),
        ChatSession(title: "Market Research", lastMessage: "I've collected data from 8 competitors...", timeAgo: "8m", taskCount: 2, gradient: [.orange, .yellow]),
        ChatSession(title: "Pitch Deck Design", lastMessage: "All 12 slides are ready. Exporting PDF now.", timeAgo: "1h", taskCount: 5, gradient: [.purple, .pink]),
        ChatSession(title: "Content Calendar Q2", lastMessage: "Generated 30 post ideas across 4 channels.", timeAgo: "3h", taskCount: 4, gradient: [.green, .teal]),
        ChatSession(title: "SEO Audit Report", lastMessage: "Found 23 issues. Here's the priority fix list.", timeAgo: "Yesterday", taskCount: 1, gradient: [.red, .orange]),
    ]

    static let messages: [AgentChatMessage] = [
        AgentChatMessage(role: .user, content: "Build me a landing page for my SaaS product, Nexus AI. It should have a hero, features, pricing, and CTA.", timestamp: Date().addingTimeInterval(-3500)),
        AgentChatMessage(role: .agent, content: "On it! I'll create a full responsive landing page for Nexus AI. I'll start with the hero section and work through each part. This should take about 4–5 minutes.", timestamp: Date().addingTimeInterval(-3490)),
        AgentChatMessage(role: .agent, content: "I've researched 12 top SaaS landing pages for best practices. Now building your HTML/CSS with Tailwind framework. The hero section is looking great — bold headline with an animated gradient.", timestamp: Date().addingTimeInterval(-3200)),
        AgentChatMessage(role: .user, content: "Can you make the color scheme dark with blue accents?", timestamp: Date().addingTimeInterval(-3100)),
        AgentChatMessage(role: .agent, content: "Perfect choice! Switching to a dark theme with electric blue (#3B82F6) as the primary accent. The hero gradient will go from deep navy to black with glowing blue elements.", timestamp: Date().addingTimeInterval(-3090)),
        AgentChatMessage(role: .agent, content: "Landing page complete! Here's your preview:", timestamp: Date().addingTimeInterval(-1800),
                         attachedOutput: AgentOutput(type: .webpage, title: "Landing Page Preview", preview: "nexus-landing.vercel.app · Live", icon: "globe", color: .blue)),
    ]
}
