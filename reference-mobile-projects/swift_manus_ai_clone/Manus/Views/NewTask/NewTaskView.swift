import SwiftUI

struct ChatMessage: Identifiable {
    let id = UUID()
    let text: String
    let isUser: Bool
    let timestamp: Date
}

struct NewTaskView: View {
    @State private var inputText = ""
    @State private var messages: [ChatMessage] = [
        ChatMessage(text: "Hi! I'm Nexus, your AI agent. What would you like me to build, research, or automate today?", isUser: false, timestamp: Date()),
    ]
    @State private var isThinking = false
    @State private var selectedSuggestion: String? = nil
    @State private var showAgentRun = false
    @State private var pendingTaskTitle = ""

    private let suggestions = ["Build a landing page", "Create a slide deck", "Research competitors", "Write a newsletter", "Analyze data", "Generate images"]

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                suggestionsRow
                Divider().background(Color.white.opacity(0.1))
                messagesList
                inputBar
            }
            .background(Color.black)
            .navigationTitle("New Task")
            .toolbarColorScheme(.dark, for: .navigationBar)
            .sheet(isPresented: $showAgentRun) {
                AgentRunView(
                    taskTitle: pendingTaskTitle,
                    gradient: [.blue, .purple]
                )
            }
        }
    }

    @ViewBuilder
    private var suggestionsRow: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                ForEach(suggestions, id: \.self) { s in
                    Button {
                        inputText = s
                    } label: {
                        Text(s)
                            .font(.caption)
                            .fontWeight(.medium)
                            .foregroundStyle(.white.opacity(0.8))
                            .padding(.horizontal, 14)
                            .padding(.vertical, 8)
                            .background(Color.white.opacity(0.1))
                            .clipShape(Capsule())
                    }
                }
            }
            .padding(.horizontal, 20)
            .padding(.vertical, 12)
        }
    }

    @ViewBuilder
    private var messagesList: some View {
        ScrollViewReader { proxy in
            ScrollView(showsIndicators: false) {
                LazyVStack(spacing: 16) {
                    ForEach(messages) { msg in
                        MessageBubble(message: msg)
                            .id(msg.id)
                    }
                    if isThinking {
                        ThinkingBubble()
                            .id("thinking")
                    }
                }
                .padding(.horizontal, 20)
                .padding(.top, 16)
                .padding(.bottom, 12)
            }
            .onChange(of: messages.count) { _, _ in
                withAnimation { proxy.scrollTo(messages.last?.id) }
            }
            .onChange(of: isThinking) { _, val in
                if val { withAnimation { proxy.scrollTo("thinking") } }
            }
        }
    }

    @ViewBuilder
    private var inputBar: some View {
        VStack(spacing: 0) {
            Divider().background(Color.white.opacity(0.1))
            HStack(spacing: 12) {
                Button {
                } label: {
                    Image(systemName: "plus.circle.fill")
                        .font(.title2)
                        .foregroundStyle(.gray)
                }
                TextField("Ask Nexus anything…", text: $inputText, axis: .vertical)
                    .lineLimit(1...5)
                    .font(.subheadline)
                    .foregroundStyle(.white)
                    .tint(.blue)
                Button {
                    sendMessage()
                } label: {
                    Image(systemName: inputText.isEmpty ? "arrow.up.circle" : "arrow.up.circle.fill")
                        .font(.title2)
                        .foregroundStyle(inputText.isEmpty ? .gray : .white)
                }
                .disabled(inputText.isEmpty)
            }
            .padding(.horizontal, 20)
            .padding(.vertical, 14)
        }
        .background(Color(white: 0.07))
    }

    private func sendMessage() {
        let text = inputText.trimmingCharacters(in: .whitespaces)
        guard !text.isEmpty else { return }
        let userMsg = ChatMessage(text: text, isUser: true, timestamp: Date())
        withAnimation { messages.append(userMsg) }
        inputText = ""
        isThinking = true
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.8) {
            isThinking = false
            let reply = agentReply(for: text)
            withAnimation { messages.append(ChatMessage(text: reply, isUser: false, timestamp: Date())) }
            // Show run view after agent confirms
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.8) {
                pendingTaskTitle = text
                showAgentRun = true
            }
        }
    }

    private func agentReply(for input: String) -> String {
        let low = input.lowercased()
        if low.contains("page") || low.contains("website") || low.contains("web") {
            return "Great choice! I'll start building your landing page. I'll research best practices, design a responsive layout, and generate the full code. This typically takes 3–5 minutes. Shall I proceed?"
        } else if low.contains("slide") || low.contains("deck") || low.contains("pitch") {
            return "I'll create a professional slide deck for you. I'll structure it with an intro, key points, and a strong close. How many slides would you like, and what's the topic?"
        } else if low.contains("research") || low.contains("analyz") || low.contains("competitor") {
            return "I'll get started on the research! I'll scan relevant sources, compile insights, and deliver a structured report. What industry or topic should I focus on?"
        } else if low.contains("newsletter") || low.contains("email") {
            return "I'll draft your newsletter! I'll write a compelling subject line, engaging sections, and a clear CTA. What's the main topic or theme for this edition?"
        } else if low.contains("image") || low.contains("photo") || low.contains("visual") {
            return "I can generate custom images for you! Describe the style (realistic, illustrated, minimalist…) and what you'd like to see, and I'll create multiple variations."
        } else {
            return "On it! I've queued your task and will begin immediately. I'll keep you updated on progress and notify you when it's complete. You can also check the Projects tab to track status."
        }
    }
}

struct MessageBubble: View {
    let message: ChatMessage

    var body: some View {
        HStack(alignment: .bottom, spacing: 10) {
            if message.isUser { Spacer() }
            if !message.isUser {
                agentAvatar
            }
            VStack(alignment: message.isUser ? .trailing : .leading, spacing: 4) {
                Text(message.text)
                    .font(.subheadline)
                    .foregroundStyle(message.isUser ? .black : .white)
                    .padding(.horizontal, 14)
                    .padding(.vertical, 10)
                    .background(message.isUser ? Color.white : Color.white.opacity(0.1))
                    .clipShape(RoundedRectangle(cornerRadius: 18))
                Text(timeString(message.timestamp))
                    .font(.caption2)
                    .foregroundStyle(.gray.opacity(0.6))
            }
            if !message.isUser { Spacer() }
        }
    }

    @ViewBuilder
    private var agentAvatar: some View {
        Image(systemName: "sparkles")
            .font(.caption)
            .foregroundStyle(.white)
            .frame(width: 28, height: 28)
            .background(LinearGradient(colors: [.blue, .purple], startPoint: .topLeading, endPoint: .bottomTrailing))
            .clipShape(Circle())
    }

    private func timeString(_ date: Date) -> String {
        let f = DateFormatter()
        f.dateFormat = "HH:mm"
        return f.string(from: date)
    }
}

struct ThinkingBubble: View {
    @State private var dot1 = false
    @State private var dot2 = false
    @State private var dot3 = false

    var body: some View {
        HStack(alignment: .bottom, spacing: 10) {
            Image(systemName: "sparkles")
                .font(.caption)
                .foregroundStyle(.white)
                .frame(width: 28, height: 28)
                .background(LinearGradient(colors: [.blue, .purple], startPoint: .topLeading, endPoint: .bottomTrailing))
                .clipShape(Circle())
            HStack(spacing: 4) {
                dotView(active: dot1, delay: 0)
                dotView(active: dot2, delay: 0.2)
                dotView(active: dot3, delay: 0.4)
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 14)
            .background(Color.white.opacity(0.1))
            .clipShape(RoundedRectangle(cornerRadius: 18))
            Spacer()
        }
        .onAppear {
            animate()
        }
    }

    @ViewBuilder
    private func dotView(active: Bool, delay: Double) -> some View {
        Circle()
            .fill(Color.gray.opacity(active ? 1 : 0.3))
            .frame(width: 7, height: 7)
            .offset(y: active ? -3 : 0)
    }

    private func animate() {
        let duration = 0.4
        withAnimation(.easeInOut(duration: duration).delay(0).repeatForever()) { dot1 = true }
        withAnimation(.easeInOut(duration: duration).delay(0.2).repeatForever()) { dot2 = true }
        withAnimation(.easeInOut(duration: duration).delay(0.4).repeatForever()) { dot3 = true }
    }
}
