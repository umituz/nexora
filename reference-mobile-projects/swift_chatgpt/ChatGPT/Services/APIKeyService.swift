import Foundation

// MARK: - API Key Service
@MainActor
final class APIKeyService: ObservableObject {
    static let shared = APIKeyService()

    @Published var openAIAPIKey: String {
        didSet {
            saveKey(key: openAIAPIKey, forKey: StorageKeys.openAIAPIKey)
        }
    }

    @Published var claudeAPIKey: String {
        didSet {
            saveKey(key: claudeAPIKey, forKey: StorageKeys.claudeAPIKey)
        }
    }

    private init() {
        let openAI = StorageHelper.getString(StorageKeys.openAIAPIKey) ?? ""
        let claude = StorageHelper.getString(StorageKeys.claudeAPIKey) ?? ""
        self.openAIAPIKey = openAI
        self.claudeAPIKey = claude
    }

    // MARK: - Public Methods

    func hasOpenAIKey() -> Bool {
        ValidationUtils.isValidContent(openAIAPIKey)
    }

    func hasClaudeKey() -> Bool {
        ValidationUtils.isValidContent(claudeAPIKey)
    }

    func clearOpenAIKey() {
        openAIAPIKey = ""
    }

    func clearClaudeKey() {
        claudeAPIKey = ""
    }

    // MARK: - Private Methods

    private func loadKey(forKey key: String) -> String {
        StorageHelper.getString(key) ?? ""
    }

    private func saveKey(key: String, forKey: String) {
        StorageHelper.set(key, forKey: forKey)
    }
}
