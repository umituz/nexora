import Foundation
import os

// MARK: - App Logger
final class Logger {
    static let shared = Logger()

    private let subsystem = "com.andi.chat"
    private lazy var logger = OSLog(subsystem: subsystem, category: "App")

    private init() {}

    // MARK: - Log Levels

    enum Level {
        case debug
        case info
        case warning
        case error
        case critical
    }

    // MARK: - Public Methods

    func debug(_ message: String, function: String = #function, file: String = #file) {
        log(message, level: .debug, function: function, file: file)
    }

    func info(_ message: String, function: String = #function, file: String = #file) {
        log(message, level: .info, function: function, file: file)
    }

    func warning(_ message: String, function: String = #function, file: String = #file) {
        log(message, level: .warning, function: function, file: file)
    }

    func error(_ message: String, function: String = #function, file: String = #file) {
        log(message, level: .error, function: function, file: file)
    }

    func critical(_ message: String, function: String = #function, file: String = #file) {
        log(message, level: .critical, function: function, file: file)
    }

    // MARK: - Error Logging

    func logError(_ error: Error, message: String? = nil, function: String = #function, file: String = #file) {
        let errorMessage = message.map { "\($0): " } ?? ""
        let fullMessage = "\(errorMessage)\(error.localizedDescription)"
        log(fullMessage, level: .error, function: function, file: file)
    }

    // MARK: - Private Methods

    private func log(_ message: String, level: Level, function: String, file: String) {
        let filename = (file as NSString).lastPathComponent
        let logMessage = "[\(filename):\(function)] \(message)"

        switch level {
        case .debug:
            os_log("%{public}@", log: logger, type: .debug, logMessage)
        case .info:
            os_log("%{public}@", log: logger, type: .info, logMessage)
        case .warning:
            os_log("%{public}@", log: logger, type: .default, logMessage)
        case .error:
            os_log("%{public}@", log: logger, type: .error, logMessage)
        case .critical:
            os_log("%{public}@", log: logger, type: .fault, logMessage)
        }
    }
}

// MARK: - Convenience Extensions

extension Logger {
    func logAIError(_ appError: AppError, function: String = #function, file: String = #file) {
        error("AI Error: \(appError.errorDescription ?? "Unknown error")", function: function, file: file)
    }

    func logStorageError(_ appError: AppError, function: String = #function, file: String = #file) {
        error("Storage Error: \(appError.errorDescription ?? "Unknown error")", function: function, file: file)
    }

    func logNetworkError(_ appError: AppError, function: String = #function, file: String = #file) {
        error("Network Error: \(appError.errorDescription ?? "Unknown error")", function: function, file: file)
    }
}
