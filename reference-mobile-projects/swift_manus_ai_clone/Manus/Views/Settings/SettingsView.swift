import SwiftUI

struct SettingsView: View {
    @State private var notificationsOn = true
    @State private var autoExecuteOn = false
    @State private var showClearConfirm = false

    var body: some View {
        NavigationStack {
            ScrollView(showsIndicators: false) {
                VStack(spacing: 24) {
                    profileCard
                    usageCard
                    settingsSections
                    versionFooter
                    Spacer(minLength: 20)
                }
                .padding(.horizontal, 20)
                .padding(.top, 4)
            }
            .background(Color.black)
            .navigationTitle("Settings")
            .toolbarColorScheme(.dark, for: .navigationBar)
            .alert("Clear All History?", isPresented: $showClearConfirm) {
                Button("Clear", role: .destructive) {}
                Button("Cancel", role: .cancel) {}
            } message: {
                Text("This will permanently remove all your task history. This action cannot be undone.")
            }
        }
    }

    @ViewBuilder
    private var profileCard: some View {
        HStack(spacing: 16) {
            ZStack {
                LinearGradient(colors: [.blue, .purple], startPoint: .topLeading, endPoint: .bottomTrailing)
                Text("A")
                    .font(.title)
                    .fontWeight(.bold)
                    .foregroundStyle(.white)
            }
            .frame(width: 64, height: 64)
            .clipShape(Circle())
            VStack(alignment: .leading, spacing: 4) {
                Text("Alex Johnson")
                    .font(.headline)
                    .foregroundStyle(.white)
                Text("alex@nexus.ai")
                    .font(.subheadline)
                    .foregroundStyle(.gray)
                ProBadge()
            }
            Spacer()
            Image(systemName: "chevron.right")
                .font(.caption)
                .foregroundStyle(.gray)
        }
        .padding(18)
        .background(Color.white.opacity(0.07))
        .clipShape(RoundedRectangle(cornerRadius: 20))
    }

    @ViewBuilder
    private var usageCard: some View {
        VStack(alignment: .leading, spacing: 14) {
            HStack {
                Text("Monthly Usage")
                    .font(.headline)
                    .foregroundStyle(.white)
                Spacer()
                Text("Resets in 8 days")
                    .font(.caption)
                    .foregroundStyle(.gray)
            }
            ProgressView(value: 2340, total: 5000)
                .tint(LinearGradient(colors: [.blue, .purple], startPoint: .leading, endPoint: .trailing))
            HStack {
                Text("2,340 credits used")
                    .font(.caption)
                    .foregroundStyle(.gray)
                Spacer()
                Text("5,000 total")
                    .font(.caption)
                    .foregroundStyle(.gray)
            }
            HStack(spacing: 16) {
                UsageStat(label: "Tasks Done", value: "42", icon: "checkmark.circle.fill", color: .green)
                UsageStat(label: "Running", value: "2", icon: "circle.dotted", color: .blue)
                UsageStat(label: "This Month", value: "18", icon: "calendar", color: .purple)
            }
        }
        .padding(18)
        .background(Color.white.opacity(0.07))
        .clipShape(RoundedRectangle(cornerRadius: 20))
    }

    @ViewBuilder
    private var settingsSections: some View {
        VStack(spacing: 16) {
            agentSection
            accountSection
            preferencesSection
            dataSection
        }
    }

    @ViewBuilder
    private var agentSection: some View {
        SettingsGroup(title: "Agent") {
            SettingsNavRow(icon: "cpu.fill", color: .blue, title: "Agent Mode", value: "Full Autonomy")
            Divider().background(Color.white.opacity(0.08)).padding(.leading, 56)
            SettingsToggleRow(icon: "bell.fill", color: .red, title: "Task Notifications", isOn: $notificationsOn)
            Divider().background(Color.white.opacity(0.08)).padding(.leading, 56)
            SettingsToggleRow(icon: "bolt.fill", color: .yellow, title: "Auto-Execute", isOn: $autoExecuteOn)
        }
    }

    @ViewBuilder
    private var accountSection: some View {
        SettingsGroup(title: "Account") {
            SettingsNavRow(icon: "person.fill", color: .purple, title: "Profile", value: "Alex Johnson")
            Divider().background(Color.white.opacity(0.08)).padding(.leading, 56)
            SettingsNavRow(icon: "star.fill", color: .orange, title: "Subscription", value: "Pro")
        }
    }

    @ViewBuilder
    private var preferencesSection: some View {
        SettingsGroup(title: "Preferences") {
            SettingsNavRow(icon: "moon.fill", color: .indigo, title: "Appearance", value: "Dark")
            Divider().background(Color.white.opacity(0.08)).padding(.leading, 56)
            SettingsNavRow(icon: "globe", color: .cyan, title: "Language", value: "English")
        }
    }

    @ViewBuilder
    private var dataSection: some View {
        SettingsGroup(title: "Data") {
            SettingsNavRow(icon: "square.and.arrow.up.fill", color: .teal, title: "Export Data", value: "")
            Divider().background(Color.white.opacity(0.08)).padding(.leading, 56)
            Button {
                showClearConfirm = true
            } label: {
                HStack(spacing: 14) {
                    Image(systemName: "trash.fill")
                        .font(.subheadline)
                        .foregroundStyle(.red)
                        .frame(width: 34, height: 34)
                        .background(Color.red.opacity(0.15))
                        .clipShape(RoundedRectangle(cornerRadius: 10))
                    Text("Clear History")
                        .font(.subheadline)
                        .foregroundStyle(.red)
                    Spacer()
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 12)
            }
        }
    }

    @ViewBuilder
    private var versionFooter: some View {
        VStack(spacing: 4) {
            Text("Nexus AI")
                .font(.caption)
                .fontWeight(.semibold)
                .foregroundStyle(.gray)
            Text("Version 1.0.0 · Build 42")
                .font(.caption2)
                .foregroundStyle(.gray.opacity(0.5))
        }
        .padding(.top, 8)
    }
}

struct ProBadge: View {
    var body: some View {
        Text("PRO")
            .font(.caption2)
            .fontWeight(.bold)
            .foregroundStyle(.black)
            .padding(.horizontal, 8)
            .padding(.vertical, 3)
            .background(LinearGradient(colors: [.yellow, .orange], startPoint: .leading, endPoint: .trailing))
            .clipShape(Capsule())
    }
}

struct UsageStat: View {
    let label: String
    let value: String
    let icon: String
    let color: Color

    var body: some View {
        VStack(spacing: 4) {
            Image(systemName: icon)
                .font(.caption)
                .foregroundStyle(color)
            Text(value)
                .font(.title3)
                .fontWeight(.bold)
                .foregroundStyle(.white)
            Text(label)
                .font(.caption2)
                .foregroundStyle(.gray)
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 10)
        .background(Color.white.opacity(0.05))
        .clipShape(RoundedRectangle(cornerRadius: 12))
    }
}

struct SettingsGroup<Content: View>: View {
    let title: String
    @ViewBuilder let content: Content

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text(title)
                .font(.headline)
                .foregroundStyle(.white)
            VStack(spacing: 0) {
                content
            }
            .background(Color.white.opacity(0.06))
            .clipShape(RoundedRectangle(cornerRadius: 18))
        }
    }
}

struct SettingsNavRow: View {
    let icon: String
    let color: Color
    let title: String
    let value: String

    var body: some View {
        Button {} label: {
            HStack(spacing: 14) {
                Image(systemName: icon)
                    .font(.subheadline)
                    .foregroundStyle(color)
                    .frame(width: 34, height: 34)
                    .background(color.opacity(0.15))
                    .clipShape(RoundedRectangle(cornerRadius: 10))
                Text(title)
                    .font(.subheadline)
                    .foregroundStyle(.white)
                Spacer()
                if !value.isEmpty {
                    Text(value)
                        .font(.subheadline)
                        .foregroundStyle(.gray)
                }
                Image(systemName: "chevron.right")
                    .font(.caption2)
                    .foregroundStyle(.gray.opacity(0.6))
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
        }
    }
}

struct SettingsToggleRow: View {
    let icon: String
    let color: Color
    let title: String
    @Binding var isOn: Bool

    var body: some View {
        HStack(spacing: 14) {
            Image(systemName: icon)
                .font(.subheadline)
                .foregroundStyle(color)
                .frame(width: 34, height: 34)
                .background(color.opacity(0.15))
                .clipShape(RoundedRectangle(cornerRadius: 10))
            Text(title)
                .font(.subheadline)
                .foregroundStyle(.white)
            Spacer()
            Toggle("", isOn: $isOn)
                .labelsHidden()
                .tint(.blue)
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
    }
}
