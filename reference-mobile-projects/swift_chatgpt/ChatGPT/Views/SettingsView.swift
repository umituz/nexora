import SwiftUI

// MARK: - Settings View
struct SettingsView: View {
    @Environment(\.dismiss) private var dismiss
    @StateObject private var apiKeyService = APIKeyService.shared
    @StateObject private var preferencesService = UserPreferencesService.shared

    @State private var showOpenAIKeyInput = false
    @State private var showClaudeKeyInput = false
    @State private var tempOpenAIKey = ""
    @State private var tempClaudeKey = ""
    @State private var showSuccessToast = false
    @State private var toastMessage = ""

    var body: some View {
        NavigationStack {
            Form {
                apiKeysSection
                preferencesSection
                aboutSection
            }
            .navigationTitle(L10n.Settings.title)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button {
                        dismiss()
                    } label: {
                        Text(L10n.Settings.done)
                            .font(.system(size: 17, weight: .semibold))
                    }
                }
            }
            .overlay(toastOverlay)
        }
    }

    @ViewBuilder
    private var apiKeysSection: some View {
        Section(L10n.Settings.apiKeys) {
            // OpenAI API Key
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text(L10n.Settings.openAIKey)
                        .font(.system(size: 16))
                    if !apiKeyService.openAIAPIKey.isEmpty {
                        Text(StringUtils.mask(apiKeyService.openAIAPIKey))
                            .font(.system(size: 12))
                            .foregroundColor(.gray)
                    }
                }
                Spacer()
                if apiKeyService.openAIAPIKey.isEmpty {
                    Button(L10n.Settings.add) {
                        tempOpenAIKey = ""
                        showOpenAIKeyInput = true
                    }
                } else {
                    Button(L10n.Settings.clearKey) {
                        apiKeyService.clearOpenAIKey()
                        showToast(L10n.Settings.saved)
                    }
                    .foregroundColor(.red)
                }
            }
            .sheet(isPresented: $showOpenAIKeyInput) {
                APIKeyInputSheet(
                    title: L10n.Settings.openAIKey,
                    key: $tempOpenAIKey,
                    onSave: {
                        apiKeyService.openAIAPIKey = tempOpenAIKey
                        showOpenAIKeyInput = false
                        showToast(L10n.Settings.saved)
                    },
                    validator: { _ in true } // OpenAI key format varies
                )
            }

            // Claude API Key
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text(L10n.Settings.claudeKey)
                        .font(.system(size: 16))
                    if !apiKeyService.claudeAPIKey.isEmpty {
                        Text(StringUtils.mask(apiKeyService.claudeAPIKey))
                            .font(.system(size: 12))
                            .foregroundColor(.gray)
                    }
                }
                Spacer()
                if apiKeyService.claudeAPIKey.isEmpty {
                    Button(L10n.Settings.add) {
                        tempClaudeKey = ""
                        showClaudeKeyInput = true
                    }
                } else {
                    Button(L10n.Settings.clearKey) {
                        apiKeyService.clearClaudeKey()
                        showToast(L10n.Settings.saved)
                    }
                    .foregroundColor(.red)
                }
            }
            .sheet(isPresented: $showClaudeKeyInput) {
                APIKeyInputSheet(
                    title: L10n.Settings.claudeKey,
                    key: $tempClaudeKey,
                    onSave: {
                        apiKeyService.claudeAPIKey = tempClaudeKey
                        showClaudeKeyInput = false
                        showToast(L10n.Settings.saved)
                    },
                    validator: { _ in true }
                )
            }
        }
    }

    @ViewBuilder
    private var preferencesSection: some View {
        Section(L10n.Settings.preferences) {
            // Default Model
            HStack {
                Text(L10n.Settings.defaultModel)
                    .font(.system(size: 16))
                Spacer()
                Picker("", selection: $preferencesService.preferences.defaultModel) {
                    ForEach(ChatModel.allCases) { model in
                        Text(model.displayName).tag(model)
                    }
                }
                .pickerStyle(.menu)
            }

            // Theme
            HStack {
                Text(L10n.Settings.theme)
                    .font(.system(size: 16))
                Spacer()
                Picker("", selection: $preferencesService.preferences.theme) {
                    ForEach(AppTheme.allCases, id: \.self) { theme in
                        Text(theme.displayName).tag(theme)
                    }
                }
                .pickerStyle(.menu)
            }
        }
    }

    @ViewBuilder
    private var aboutSection: some View {
        Section(L10n.Settings.about) {
            HStack {
                Text(L10n.Settings.version)
                    .font(.system(size: 16))
                Spacer()
                Text(Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "1.0.0")
                    .font(.system(size: 16))
                    .foregroundColor(.gray)
            }
        }
    }

    @ViewBuilder
    private var toastOverlay: some View {
        VStack {
            Spacer()
            if showSuccessToast {
                Text(toastMessage)
                    .font(.system(size: 16, weight: .medium))
                    .foregroundColor(.white)
                    .padding(.horizontal, 20)
                    .padding(.vertical, 12)
                    .background(Color.black)
                    .cornerRadius(25)
                    .padding(.bottom, 40)
                    .transition(.move(edge: .bottom))
            }
        }
        .animation(.easeInOut, value: showSuccessToast)
    }

    private func showToast(_ message: String) {
        toastMessage = message
        withAnimation {
            showSuccessToast = true
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
            withAnimation {
                showSuccessToast = false
            }
        }
    }
}

// MARK: - API Key Input Sheet
struct APIKeyInputSheet: View {
    let title: String
    @Binding var key: String
    let onSave: () -> Void
    let validator: (String) -> Bool

    @Environment(\.dismiss) private var dismiss
    @FocusState private var isFocused: Bool
    @State private var showError = false

    var body: some View {
        NavigationStack {
            Form {
                Section {
                    SecureField("sk-...", text: $key)
                        .focused($isFocused)
                        .onChange(of: key) { _, _ in
                            showError = false
                        }
                } header: {
                    Text(title)
                } footer: {
                    VStack(alignment: .leading, spacing: 8) {
                        Text(L10n.Settings.yourAPIKey)
                            .font(.system(size: 12))
                        if showError && !validator(key) {
                            Text(L10n.Settings.invalidKey)
                                .font(.system(size: 12))
                                .foregroundColor(.red)
                        }
                    }
                }
            }
            .navigationTitle(L10n.Settings.apiKeys)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button(L10n.Settings.cancel) {
                        dismiss()
                    }
                }
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(L10n.Settings.save) {
                        if validator(key) {
                            onSave()
                        } else {
                            showError = true
                        }
                    }
                    .disabled(key.isEmpty)
                }
            }
        }
        .onAppear {
            isFocused = true
        }
    }
}

#Preview {
    SettingsView()
}
