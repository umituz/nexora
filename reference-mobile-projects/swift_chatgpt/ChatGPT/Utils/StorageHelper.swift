import Foundation

// MARK: - Storage Helper
enum StorageHelper {

    // MARK: - Get

    static func getString(_ key: String) -> String? {
        UserDefaults.standard.string(forKey: key)
    }

    static func getData(_ key: String) -> Data? {
        UserDefaults.standard.data(forKey: key)
    }

    static func getBool(_ key: String) -> Bool {
        UserDefaults.standard.bool(forKey: key)
    }

    // MARK: - Set

    static func set(_ value: String?, forKey key: String) {
        if let value = value {
            UserDefaults.standard.set(value, forKey: key)
        } else {
            remove(key)
        }
    }

    static func set(_ value: Data?, forKey key: String) {
        if let value = value {
            UserDefaults.standard.set(value, forKey: key)
        } else {
            remove(key)
        }
    }

    static func set(_ value: Bool, forKey key: String) {
        UserDefaults.standard.set(value, forKey: key)
    }

    // MARK: - Remove

    static func remove(_ key: String) {
        UserDefaults.standard.removeObject(forKey: key)
    }

    // MARK: - Exists

    static func exists(_ key: String) -> Bool {
        UserDefaults.standard.object(forKey: key) != nil
    }
}
