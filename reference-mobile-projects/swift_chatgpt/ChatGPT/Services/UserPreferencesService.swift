import Foundation
import SwiftUI

// MARK: - User Preferences Model
struct UserPreferences: Codable {
    var defaultModel: ChatModel
    var theme: AppTheme
    var autoCopyResponses: Bool

    init(
        defaultModel: ChatModel = .appleIntelligence,
        theme: AppTheme = .light,
        autoCopyResponses: Bool = false
    ) {
        self.defaultModel = defaultModel
        self.theme = theme
        self.autoCopyResponses = autoCopyResponses
    }
}

// MARK: - App Theme
enum AppTheme: String, CaseIterable, Codable {
    case light
    case dark
    case system

    var displayName: String {
        switch self {
        case .light: return "Light"
        case .dark: return "Dark"
        case .system: return "System"
        }
    }

    var colorScheme: ColorScheme? {
        switch self {
        case .light: return .light
        case .dark: return .dark
        case .system: return nil
        }
    }
}

// MARK: - User Preferences Service
@MainActor
final class UserPreferencesService: ObservableObject {
    static let shared = UserPreferencesService()

    @Published var preferences: UserPreferences {
        didSet {
            savePreferences()
        }
    }

    private init() {
        self.preferences = Self.loadPreferences()
    }

    // MARK: - Private Methods

    private let encoder = JSONEncoder()

    private func savePreferences() {
        let data = ResultHelper.catch { try encoder.encode(preferences) }
        if case .success(let encodedData) = data {
            StorageHelper.set(encodedData, forKey: StorageKeys.userPreferences)
        }
    }

    private static func loadPreferences() -> UserPreferences {
        guard let data = StorageHelper.getData(StorageKeys.userPreferences),
              let prefs = try? JSONDecoder().decode(UserPreferences.self, from: data) else {
            return UserPreferences()
        }
        return prefs
    }
}
