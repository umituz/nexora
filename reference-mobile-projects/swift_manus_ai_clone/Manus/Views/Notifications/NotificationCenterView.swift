import SwiftUI

// MARK: - Notification Model

struct AgentNotification: Identifiable {
    let id = UUID()
    let type: NotificationType
    let title: String
    let body: String
    let timeAgo: String
    var isRead: Bool
    let taskGradient: [Color]
    let taskIcon: String
}

enum NotificationType {
    case completed, failed, started, warning, info

    var color: Color {
        switch self {
        case .completed: return .green
        case .failed: return .red
        case .started: return .blue
        case .warning: return .orange
        case .info: return .purple
        }
    }

    var icon: String {
        switch self {
        case .completed: return "checkmark.circle.fill"
        case .failed: return "xmark.circle.fill"
        case .started: return "play.circle.fill"
        case .warning: return "exclamationmark.triangle.fill"
        case .info: return "info.circle.fill"
        }
    }

    var label: String {
        switch self {
        case .completed: return "Completed"
        case .failed: return "Failed"
        case .started: return "Started"
        case .warning: return "Warning"
        case .info: return "Info"
        }
    }
}

// MARK: - Notification Center View

struct NotificationCenterView: View {
    @Environment(\.dismiss) private var dismiss
    @State private var notifications: [AgentNotification] = NotificationSampleData.notifications
    @State private var selectedFilter: NotificationType? = nil

    private var filtered: [AgentNotification] {
        guard let f = selectedFilter else { return notifications }
        return notifications.filter { $0.type == f }
    }

    private var unreadCount: Int { notifications.filter { !$0.isRead }.count }

    var body: some View {
        NavigationStack {
            ZStack {
                Color.black.ignoresSafeArea()
                VStack(spacing: 0) {
                    filterBar
                    Divider().background(Color.white.opacity(0.08))
                    notificationList
                }
            }
            .navigationTitle("Notifications")
            .navigationBarTitleDisplayMode(.inline)
            .toolbarColorScheme(.dark, for: .navigationBar)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Button { dismiss() } label: {
                        Image(systemName: "xmark.circle.fill").foregroundStyle(.gray)
                    }
                }
                ToolbarItem(placement: .topBarTrailing) {
                    if unreadCount > 0 {
                        Button { markAllRead() } label: {
                            Text("Mark All Read")
                                .font(.caption)
                                .fontWeight(.semibold)
                                .foregroundStyle(.blue)
                        }
                    }
                }
            }
        }
    }

    @ViewBuilder
    private var filterBar: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                FilterChip(title: "All (\(notifications.count))", isSelected: selectedFilter == nil) {
                    selectedFilter = nil
                }
                ForEach([NotificationType.completed, .failed, .started, .warning], id: \.label) { type in
                    FilterChip(title: type.label, isSelected: selectedFilter?.label == type.label) {
                        selectedFilter = type
                    }
                }
            }
            .padding(.horizontal, 20)
            .padding(.vertical, 12)
        }
    }

    @ViewBuilder
    private var notificationList: some View {
        if filtered.isEmpty {
            emptyState
        } else {
            ScrollView(showsIndicators: false) {
                LazyVStack(spacing: 0) {
                    ForEach(filtered) { notif in
                        NotificationRow(notification: notif) {
                            markRead(notif)
                        }
                        if notif.id != filtered.last?.id {
                            Divider()
                                .background(Color.white.opacity(0.07))
                                .padding(.leading, 76)
                        }
                    }
                }
                .padding(.bottom, 30)
            }
        }
    }

    @ViewBuilder
    private var emptyState: some View {
        VStack(spacing: 16) {
            Image(systemName: "bell.slash.fill")
                .font(.system(size: 52))
                .foregroundStyle(.gray.opacity(0.3))
            Text("No Notifications")
                .font(.headline).foregroundStyle(.white)
            Text("Agent updates and alerts will appear here.")
                .font(.subheadline).foregroundStyle(.gray)
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .padding(.top, 80)
    }

    private func markRead(_ notif: AgentNotification) {
        if let idx = notifications.firstIndex(where: { $0.id == notif.id }) {
            notifications[idx].isRead = true
        }
    }

    private func markAllRead() {
        withAnimation {
            for i in notifications.indices { notifications[i].isRead = true }
        }
    }
}

// MARK: - Notification Row

struct NotificationRow: View {
    let notification: AgentNotification
    let onTap: () -> Void

    var body: some View {
        Button(action: onTap) {
            HStack(alignment: .top, spacing: 14) {
                // Task icon with type badge
                ZStack(alignment: .bottomTrailing) {
                    Image(systemName: notification.taskIcon)
                        .font(.body)
                        .foregroundStyle(.white)
                        .frame(width: 46, height: 46)
                        .background(LinearGradient(colors: notification.taskGradient, startPoint: .topLeading, endPoint: .bottomTrailing))
                        .clipShape(RoundedRectangle(cornerRadius: 13))

                    Image(systemName: notification.type.icon)
                        .font(.system(size: 12))
                        .foregroundStyle(notification.type.color)
                        .frame(width: 18, height: 18)
                        .background(Color.black)
                        .clipShape(Circle())
                        .offset(x: 4, y: 4)
                }

                VStack(alignment: .leading, spacing: 4) {
                    HStack(alignment: .top) {
                        VStack(alignment: .leading, spacing: 2) {
                            Text(notification.title)
                                .font(.subheadline)
                                .fontWeight(notification.isRead ? .regular : .semibold)
                                .foregroundStyle(.white)
                            Text(notification.body)
                                .font(.caption)
                                .foregroundStyle(.gray)
                                .lineLimit(2)
                        }
                        Spacer()
                        VStack(alignment: .trailing, spacing: 4) {
                            Text(notification.timeAgo)
                                .font(.caption2)
                                .foregroundStyle(.gray)
                            if !notification.isRead {
                                Circle()
                                    .fill(Color.blue)
                                    .frame(width: 8, height: 8)
                            }
                        }
                    }

                    typePill
                }
            }
            .padding(.horizontal, 20)
            .padding(.vertical, 14)
            .background(notification.isRead ? Color.clear : Color.white.opacity(0.03))
        }
        .buttonStyle(.plain)
    }

    @ViewBuilder
    private var typePill: some View {
        HStack(spacing: 4) {
            Image(systemName: notification.type.icon).font(.caption2)
            Text(notification.type.label).font(.caption2).fontWeight(.semibold)
        }
        .foregroundStyle(notification.type.color)
        .padding(.horizontal, 8)
        .padding(.vertical, 3)
        .background(notification.type.color.opacity(0.12))
        .clipShape(Capsule())
    }
}

// MARK: - Sample Data

enum NotificationSampleData {
    static let notifications: [AgentNotification] = [
        AgentNotification(type: .completed, title: "Pitch Deck Ready", body: "Your 12-slide investor presentation is complete. PDF and PPTX are ready to download.", timeAgo: "1 min", isRead: false, taskGradient: [.purple, .pink], taskIcon: "rectangle.stack.fill"),
        AgentNotification(type: .started, title: "Landing Page started", body: "Agent started building your responsive marketing site.", timeAgo: "3 min", isRead: false, taskGradient: [.blue, .cyan], taskIcon: "globe"),
        AgentNotification(type: .warning, title: "Rate limit approaching", body: "Market Research task is using high API credits. Consider pausing.", timeAgo: "12 min", isRead: false, taskGradient: [.orange, .yellow], taskIcon: "chart.bar.fill"),
        AgentNotification(type: .completed, title: "Social Kit exported", body: "10 posts for Instagram & LinkedIn have been uploaded to Google Drive.", timeAgo: "2h", isRead: true, taskGradient: [.pink, .purple], taskIcon: "photo.stack.fill"),
        AgentNotification(type: .failed, title: "Podcast Transcript failed", body: "Transcription failed due to audio quality issues. Try re-uploading the file.", timeAgo: "3h", isRead: true, taskGradient: [.gray, .gray], taskIcon: "waveform"),
        AgentNotification(type: .info, title: "New agent available", body: "VideoEditor Pro agent is now available in your plan. Try it for video tasks.", timeAgo: "5h", isRead: true, taskGradient: [.red, .orange], taskIcon: "video.fill"),
        AgentNotification(type: .completed, title: "Email Campaign done", body: "5-email nurture sequence written and staged in your Gmail drafts.", timeAgo: "Yesterday", isRead: true, taskGradient: [.red, .orange], taskIcon: "envelope.fill"),
        AgentNotification(type: .info, title: "Weekly digest ready", body: "Your agent ran 14 tasks this week and saved approximately 9 hours.", timeAgo: "2 days", isRead: true, taskGradient: [.blue, .purple], taskIcon: "sparkles"),
    ]
}

// MARK: - Notification Badge Count Helper

extension NotificationSampleData {
    static var unreadCount: Int { notifications.filter { !$0.isRead }.count }
}
