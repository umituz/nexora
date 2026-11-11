import SwiftUI

// MARK: - Tool Detail View

struct ToolDetailView: View {
    let tool: Tool
    @Environment(\.dismiss) private var dismiss
    @State private var isConnected: Bool
    @State private var showConnectFlow = false
    @State private var selectedPermissions: Set<String> = []

    init(tool: Tool) {
        self.tool = tool
        _isConnected = State(initialValue: tool.connected)
    }

    var body: some View {
        ZStack {
            Color.black.ignoresSafeArea()
            ScrollView(showsIndicators: false) {
                VStack(spacing: 24) {
                    toolHeader
                    if isConnected { usageStatsSection }
                    capabilitiesSection
                    permissionsSection
                    if isConnected { recentActivitySection }
                    actionButton
                    Spacer(minLength: 40)
                }
                .padding(.horizontal, 20)
                .padding(.top, 8)
            }
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
            ToolbarItem(placement: .topBarTrailing) {
                if isConnected {
                    Menu {
                        Button(action: {}) { Label("Refresh Token", systemImage: "arrow.clockwise") }
                        Button(action: {}) { Label("View Logs", systemImage: "doc.text") }
                        Divider()
                        Button(role: .destructive, action: { withAnimation { isConnected = false }}) {
                            Label("Disconnect", systemImage: "minus.circle")
                        }
                    } label: {
                        Image(systemName: "ellipsis.circle").foregroundStyle(.white)
                    }
                }
            }
        }
        .toolbarColorScheme(.dark, for: .navigationBar)
        .sheet(isPresented: $showConnectFlow) {
            ToolConnectSheet(tool: tool, onConnect: { isConnected = true })
        }
    }

    // MARK: - Header

    @ViewBuilder
    private var toolHeader: some View {
        VStack(spacing: 16) {
            // Icon
            ZStack {
                RoundedRectangle(cornerRadius: 24)
                    .fill(isConnected ? tool.color.opacity(0.15) : Color.white.opacity(0.06))
                    .frame(width: 88, height: 88)
                Image(systemName: tool.icon)
                    .font(.system(size: 36))
                    .foregroundStyle(isConnected ? tool.color : .gray)
            }

            VStack(spacing: 6) {
                Text(tool.name)
                    .font(.title2).fontWeight(.bold).foregroundStyle(.white)
                Text(tool.description)
                    .font(.subheadline).foregroundStyle(.gray).multilineTextAlignment(.center)
            }

            // Status pill
            HStack(spacing: 6) {
                Circle()
                    .fill(isConnected ? Color.green : Color.gray)
                    .frame(width: 7, height: 7)
                Text(isConnected ? "Connected" : "Not Connected")
                    .font(.subheadline).fontWeight(.semibold)
                    .foregroundStyle(isConnected ? .green : .gray)
            }
            .padding(.horizontal, 14).padding(.vertical, 7)
            .background((isConnected ? Color.green : Color.gray).opacity(0.12))
            .clipShape(Capsule())
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 20)
        .padding(.horizontal, 16)
        .background(Color(white: 0.07))
        .clipShape(RoundedRectangle(cornerRadius: 24))
    }

    // MARK: - Usage Stats

    @ViewBuilder
    private var usageStatsSection: some View {
        let stats = ToolDetailSampleData.stats(for: tool.name)
        VStack(alignment: .leading, spacing: 12) {
            Text("Usage This Month")
                .font(.headline).fontWeight(.bold).foregroundStyle(.white)
            HStack(spacing: 10) {
                ForEach(stats, id: \.label) { stat in
                    VStack(spacing: 5) {
                        Text(stat.value).font(.title3).fontWeight(.bold).foregroundStyle(tool.color)
                        Text(stat.label).font(.caption2).foregroundStyle(.gray).multilineTextAlignment(.center)
                    }
                    .frame(maxWidth: .infinity).padding(.vertical, 14)
                    .background(tool.color.opacity(0.08))
                    .clipShape(RoundedRectangle(cornerRadius: 14))
                }
            }
        }
    }

    // MARK: - Capabilities

    @ViewBuilder
    private var capabilitiesSection: some View {
        let caps = ToolDetailSampleData.capabilities(for: tool.name)
        VStack(alignment: .leading, spacing: 12) {
            Text("Capabilities")
                .font(.headline).fontWeight(.bold).foregroundStyle(.white)
            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 10) {
                ForEach(caps, id: \.title) { cap in
                    CapabilityCard(cap: cap, toolColor: tool.color)
                }
            }
        }
    }

    // MARK: - Permissions

    @ViewBuilder
    private var permissionsSection: some View {
        let perms = ToolDetailSampleData.permissions(for: tool.name)
        VStack(alignment: .leading, spacing: 12) {
            Text("Permissions")
                .font(.headline).fontWeight(.bold).foregroundStyle(.white)
            VStack(spacing: 1) {
                ForEach(perms, id: \.self) { perm in
                    HStack(spacing: 12) {
                        Image(systemName: "checkmark.shield.fill")
                            .font(.caption).foregroundStyle(isConnected ? .green : .gray)
                        Text(perm).font(.subheadline).foregroundStyle(.white)
                        Spacer()
                        Image(systemName: "lock.fill").font(.caption2).foregroundStyle(.gray.opacity(0.4))
                    }
                    .padding(.horizontal, 16).padding(.vertical, 12)
                    .background(Color.white.opacity(0.05))
                    if perm != perms.last {
                        Divider().background(Color.white.opacity(0.07)).padding(.leading, 50)
                    }
                }
            }
            .clipShape(RoundedRectangle(cornerRadius: 16))
        }
    }

    // MARK: - Recent Activity

    @ViewBuilder
    private var recentActivitySection: some View {
        let acts = ToolDetailSampleData.activities(for: tool.name)
        VStack(alignment: .leading, spacing: 12) {
            Text("Recent Activity")
                .font(.headline).fontWeight(.bold).foregroundStyle(.white)
            VStack(spacing: 10) {
                ForEach(acts, id: \.action) { act in
                    HStack(spacing: 12) {
                        Image(systemName: act.icon)
                            .font(.caption)
                            .foregroundStyle(tool.color)
                            .frame(width: 32, height: 32)
                            .background(tool.color.opacity(0.1))
                            .clipShape(Circle())
                        VStack(alignment: .leading, spacing: 2) {
                            Text(act.action).font(.subheadline).foregroundStyle(.white)
                            Text(act.task).font(.caption).foregroundStyle(.gray)
                        }
                        Spacer()
                        Text(act.time).font(.caption2).foregroundStyle(.gray)
                    }
                }
            }
            .padding(14)
            .background(Color.white.opacity(0.05))
            .clipShape(RoundedRectangle(cornerRadius: 16))
        }
    }

    // MARK: - Action Button

    @ViewBuilder
    private var actionButton: some View {
        if isConnected {
            Button(action: { withAnimation { isConnected = false }}) {
                HStack(spacing: 8) {
                    Image(systemName: "minus.circle.fill")
                    Text("Disconnect \(tool.name)")
                }
                .font(.subheadline).fontWeight(.semibold)
                .foregroundStyle(.red)
                .frame(maxWidth: .infinity).padding(.vertical, 16)
                .background(Color.red.opacity(0.1))
                .clipShape(RoundedRectangle(cornerRadius: 16))
                .overlay(RoundedRectangle(cornerRadius: 16).stroke(Color.red.opacity(0.2), lineWidth: 1))
            }
        } else {
            Button(action: { showConnectFlow = true }) {
                HStack(spacing: 8) {
                    Image(systemName: "link.circle.fill")
                    Text("Connect \(tool.name)")
                }
                .font(.subheadline).fontWeight(.semibold)
                .foregroundStyle(.white)
                .frame(maxWidth: .infinity).padding(.vertical, 16)
                .background(LinearGradient(colors: [.blue, .purple], startPoint: .leading, endPoint: .trailing))
                .clipShape(RoundedRectangle(cornerRadius: 16))
            }
        }
    }
}

// MARK: - Capability Card

struct CapabilityCard: View {
    let cap: ToolCapability
    let toolColor: Color

    var body: some View {
        HStack(spacing: 10) {
            Image(systemName: cap.icon)
                .font(.body).foregroundStyle(toolColor)
                .frame(width: 36, height: 36)
                .background(toolColor.opacity(0.1))
                .clipShape(RoundedRectangle(cornerRadius: 10))
            VStack(alignment: .leading, spacing: 2) {
                Text(cap.title).font(.caption).fontWeight(.semibold).foregroundStyle(.white)
                Text(cap.detail).font(.caption2).foregroundStyle(.gray).lineLimit(2)
            }
            Spacer()
        }
        .padding(12)
        .background(Color.white.opacity(0.06))
        .clipShape(RoundedRectangle(cornerRadius: 14))
    }
}

// MARK: - Connect Sheet

struct ToolConnectSheet: View {
    let tool: Tool
    let onConnect: () -> Void
    @Environment(\.dismiss) private var dismiss
    @State private var apiKey = ""
    @State private var accountEmail = ""
    @State private var connecting = false
    @State private var connected = false

    var body: some View {
        NavigationStack {
            ZStack {
                Color.black.ignoresSafeArea()
                VStack(spacing: 28) {
                    // Icon
                    ZStack {
                        RoundedRectangle(cornerRadius: 20)
                            .fill(tool.color.opacity(0.15))
                            .frame(width: 72, height: 72)
                        Image(systemName: tool.icon)
                            .font(.system(size: 28)).foregroundStyle(tool.color)
                    }
                    .padding(.top, 20)

                    VStack(spacing: 8) {
                        Text("Connect \(tool.name)")
                            .font(.title2).fontWeight(.bold).foregroundStyle(.white)
                        Text("Nexus will access \(tool.name) to read and write data on your behalf.")
                            .font(.subheadline).foregroundStyle(.gray).multilineTextAlignment(.center)
                    }

                    if !connected {
                        formSection
                    } else {
                        successView
                    }

                    Spacer()
                }
                .padding(.horizontal, 24)
            }
            .navigationTitle("")
            .toolbarColorScheme(.dark, for: .navigationBar)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button { dismiss() } label: {
                        Image(systemName: "xmark.circle.fill").foregroundStyle(.gray)
                    }
                }
            }
        }
    }

    @ViewBuilder
    private var formSection: some View {
        VStack(spacing: 14) {
            VStack(alignment: .leading, spacing: 6) {
                Text("Account Email").font(.caption).foregroundStyle(.gray)
                TextField("you@example.com", text: $accountEmail)
                    .font(.subheadline).foregroundStyle(.white)
                    .padding(14).background(Color.white.opacity(0.07))
                    .clipShape(RoundedRectangle(cornerRadius: 12))
                    .keyboardType(.emailAddress).autocapitalization(.none)
            }
            VStack(alignment: .leading, spacing: 6) {
                Text("API Key or Token").font(.caption).foregroundStyle(.gray)
                SecureField("Enter your \(tool.name) API key", text: $apiKey)
                    .font(.subheadline).foregroundStyle(.white)
                    .padding(14).background(Color.white.opacity(0.07))
                    .clipShape(RoundedRectangle(cornerRadius: 12))
            }

            Button(action: simulateConnect) {
                HStack(spacing: 8) {
                    if connecting {
                        ProgressView().tint(.white).scaleEffect(0.8)
                    } else {
                        Image(systemName: "link.circle.fill")
                    }
                    Text(connecting ? "Connecting..." : "Connect")
                }
                .font(.subheadline).fontWeight(.semibold).foregroundStyle(.white)
                .frame(maxWidth: .infinity).padding(.vertical, 16)
                .background(LinearGradient(colors: [.blue, .purple], startPoint: .leading, endPoint: .trailing))
                .clipShape(RoundedRectangle(cornerRadius: 16))
            }
            .disabled(connecting)
        }
    }

    @ViewBuilder
    private var successView: some View {
        VStack(spacing: 16) {
            Image(systemName: "checkmark.circle.fill")
                .font(.system(size: 56)).foregroundStyle(.green)
            Text("Successfully Connected!")
                .font(.headline).fontWeight(.bold).foregroundStyle(.white)
            Text("\(tool.name) is now ready to use with Nexus agents.")
                .font(.subheadline).foregroundStyle(.gray).multilineTextAlignment(.center)
            Button(action: { onConnect(); dismiss() }) {
                Text("Done")
                    .font(.subheadline).fontWeight(.semibold).foregroundStyle(.black)
                    .frame(maxWidth: .infinity).padding(.vertical, 16)
                    .background(Color.green)
                    .clipShape(RoundedRectangle(cornerRadius: 16))
            }
        }
    }

    private func simulateConnect() {
        connecting = true
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
            connecting = false
            connected = true
        }
    }
}

// MARK: - Helper Models & Sample Data

struct ToolCapability: Identifiable {
    let id = UUID()
    let title: String
    let detail: String
    let icon: String
}

struct ToolActivity {
    let action: String
    let task: String
    let time: String
    let icon: String
}

struct ToolStat {
    let value: String
    let label: String
}

enum ToolDetailSampleData {
    static func capabilities(for name: String) -> [ToolCapability] {
        switch name {
        case "GitHub":
            return [
                ToolCapability(title: "Read Repos", detail: "Browse code and files", icon: "folder"),
                ToolCapability(title: "Create PRs", detail: "Open pull requests", icon: "arrow.triangle.branch"),
                ToolCapability(title: "Write Code", detail: "Push code changes", icon: "chevron.left.forwardslash.chevron.right"),
                ToolCapability(title: "Issues", detail: "Create & manage issues", icon: "exclamationmark.bubble"),
            ]
        case "Notion":
            return [
                ToolCapability(title: "Read Pages", detail: "Access your workspace", icon: "doc.text"),
                ToolCapability(title: "Write Notes", detail: "Create & update pages", icon: "pencil"),
                ToolCapability(title: "Databases", detail: "Query & update tables", icon: "tablecells"),
                ToolCapability(title: "Templates", detail: "Use existing templates", icon: "doc.on.doc"),
            ]
        case "Gmail":
            return [
                ToolCapability(title: "Read Email", detail: "Access inbox messages", icon: "envelope.open"),
                ToolCapability(title: "Send Email", detail: "Compose & send", icon: "paperplane"),
                ToolCapability(title: "Labels", detail: "Manage email labels", icon: "tag"),
                ToolCapability(title: "Drafts", detail: "Save email drafts", icon: "doc.badge.clock"),
            ]
        default:
            return [
                ToolCapability(title: "Read Data", detail: "Access workspace data", icon: "eye"),
                ToolCapability(title: "Write Data", detail: "Create & modify content", icon: "pencil"),
                ToolCapability(title: "Automate", detail: "Run automated flows", icon: "bolt"),
                ToolCapability(title: "Sync", detail: "Keep data in sync", icon: "arrow.clockwise"),
            ]
        }
    }

    static func permissions(for name: String) -> [String] {
        ["Read access to workspaces", "Write access to create content", "Access to file storage", "OAuth 2.0 secure authentication"]
    }

    static func activities(for name: String) -> [ToolActivity] {
        [
            ToolActivity(action: "Pushed 3 files", task: "Landing Page Build", time: "2m ago", icon: "arrow.up.circle"),
            ToolActivity(action: "Created PR #42", task: "API Integration", time: "1h ago", icon: "arrow.triangle.branch"),
            ToolActivity(action: "Read repository", task: "Code Review", time: "3h ago", icon: "doc.text"),
        ]
    }

    static func stats(for name: String) -> [ToolStat] {
        [
            ToolStat(value: "47", label: "Actions"),
            ToolStat(value: "12", label: "Tasks"),
            ToolStat(value: "99.9%", label: "Uptime"),
        ]
    }
}
