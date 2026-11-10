import SwiftUI

struct ThreadDetailView: View {
    let thread: DiscussionThread
    @State private var isLiked = false
    @State private var replyText = ""

    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                originalPost
                repliesSection
            }
            .padding(.bottom, 100)
        }
        .background(AppTheme.secondaryBackground.ignoresSafeArea())
        .navigationTitle("Thread")
        .navigationBarTitleDisplayMode(.inline)
        .safeAreaInset(edge: .bottom) { replyBar }
    }

    private var originalPost: some View {
        VStack(alignment: .leading, spacing: 14) {
            HStack {
                TagBadge(text: thread.tag)
                Spacer()
                Text(thread.timeAgo + " ago")
                    .font(.caption2)
                    .foregroundStyle(AppTheme.textTertiary)
            }
            Text(thread.title)
                .font(.headline.bold())
                .foregroundStyle(AppTheme.textPrimary)
                .lineSpacing(4)
            Text(bodyText())
                .font(.subheadline)
                .foregroundStyle(AppTheme.textSecondary)
                .lineSpacing(5)
            Divider()
            HStack(spacing: 20) {
                Label("@\(thread.author)", systemImage: "person.circle.fill")
                    .font(.caption)
                    .foregroundStyle(AppTheme.textSecondary)
                Spacer()
                Button {
                    withAnimation(.spring()) { isLiked.toggle() }
                } label: {
                    Label("\(thread.likes + (isLiked ? 1 : 0))", systemImage: isLiked ? "heart.fill" : "heart")
                        .font(.caption.weight(.medium))
                        .foregroundStyle(isLiked ? AppTheme.destructive : AppTheme.textSecondary)
                }
                Label("\(thread.replies)", systemImage: "bubble.right.fill")
                    .font(.caption)
                    .foregroundStyle(AppTheme.textSecondary)
            }
        }
        .padding(16)
        .background(AppTheme.cardBackground)
        .clipShape(RoundedRectangle(cornerRadius: 16))
        .shadow(color: .black.opacity(0.05), radius: 8, y: 3)
        .padding(.horizontal, 16)
        .padding(.top, 8)
    }

    private var repliesSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("\(thread.replies) Replies")
                .font(.headline.bold())
                .foregroundStyle(AppTheme.textPrimary)
                .padding(.horizontal, 16)
            ForEach(sampleReplies()) { reply in
                ReplyCard(reply: reply)
            }
        }
    }

    private var replyBar: some View {
        HStack(spacing: 12) {
            TextField("Add a reply...", text: $replyText)
                .font(.subheadline)
                .padding(.horizontal, 14)
                .padding(.vertical, 10)
                .background(AppTheme.tertiaryBackground)
                .clipShape(Capsule())
            Button {
                replyText = ""
            } label: {
                Image(systemName: "arrow.up.circle.fill")
                    .font(.title2)
                    .foregroundStyle(
                        replyText.isEmpty ? AppTheme.textTertiary : AppTheme.primaryGradientStart
                    )
            }
            .disabled(replyText.isEmpty)
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
        .background(.regularMaterial)
    }

    private func bodyText() -> String {
        switch thread.tag {
        case "Debate":
            return "I've been running both GPT-5 and Claude 4 on a battery of multi-step reasoning tasks. My initial findings show GPT-5 edges ahead on formal logic chains, but Claude 4 demonstrates superior contextual nuance in open-ended scenarios. What has your experience been?"
        case "Tutorial":
            return "RAG (Retrieval-Augmented Generation) in production requires more than just plugging in a vector store. After running this in prod for 6 months, here are the key lessons: chunking strategy matters more than embedding model choice, and reranking is a must-have."
        case "News":
            return "Sora Pro just dropped and the jump in quality over v1 is significant. Frame consistency is dramatically improved, motion physics feel more grounded, and the 4K output at 60fps is genuinely impressive. Full breakdown in the thread below."
        case "Guide":
            return "Fine-tuning Llama 4 on custom datasets is now more accessible than ever with QLoRA. In this guide I walk through dataset preparation, adapter training config, and evaluation. You can run this on a single A100 in under 4 hours."
        default:
            return "Join the discussion and share your thoughts on this topic with the community."
        }
    }

    private func sampleReplies() -> [ReplyItem] {
        [
            ReplyItem(author: "TechWatcher", timeAgo: "1h", text: "Great analysis! I'd add that the context window handling also plays a big role here."),
            ReplyItem(author: "MLPractitioner", timeAgo: "45m", text: "Completely agree with your assessment. We ran similar benchmarks internally and got comparable results."),
            ReplyItem(author: "AISkeptic", timeAgo: "30m", text: "Interesting, but I'd push back on the reasoning benchmarks — those are often gameable by training on similar data."),
            ReplyItem(author: "ResearchBot", timeAgo: "15m", text: "There's a paper from Stanford that corroborates this. I'll drop the link in a follow-up comment."),
        ]
    }
}

struct ReplyItem: Identifiable {
    let id = UUID()
    let author: String
    let timeAgo: String
    let text: String
}

struct ReplyCard: View {
    let reply: ReplyItem

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Image(systemName: "person.circle.fill")
                    .font(.title3)
                    .foregroundStyle(AppTheme.primaryGradientStart)
                Text("@\(reply.author)")
                    .font(.subheadline.bold())
                    .foregroundStyle(AppTheme.textPrimary)
                Spacer()
                Text(reply.timeAgo + " ago")
                    .font(.caption2)
                    .foregroundStyle(AppTheme.textTertiary)
            }
            Text(reply.text)
                .font(.subheadline)
                .foregroundStyle(AppTheme.textSecondary)
                .lineSpacing(4)
        }
        .padding(14)
        .background(AppTheme.cardBackground)
        .clipShape(RoundedRectangle(cornerRadius: 14))
        .shadow(color: .black.opacity(0.04), radius: 6, y: 2)
        .padding(.horizontal, 16)
    }
}
