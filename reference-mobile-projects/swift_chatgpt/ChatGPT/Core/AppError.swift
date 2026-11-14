import Foundation

// MARK: - Application Errors
enum AppError: Error, LocalizedError {
    case aiServiceUnavailable
    case aiProcessingFailed(underlying: Error)
    case aiStreamFailed(underlying: Error)
    case storageFailure(reason: String)
    case networkUnavailable
    case subscriptionVerificationFailed
    case invalidConfiguration

    var errorDescription: String? {
        switch self {
        case .aiServiceUnavailable:
            return L10n.Error.aiServiceUnavailable
        case .aiProcessingFailed(let error):
            return String(format: L10n.Error.aiProcessingFailed, error.localizedDescription)
        case .aiStreamFailed(let error):
            return String(format: L10n.Error.aiStreamInterrupted, error.localizedDescription)
        case .storageFailure(let reason):
            return String(format: L10n.Error.storageFailure, reason)
        case .networkUnavailable:
            return L10n.Error.networkUnavailable
        case .subscriptionVerificationFailed:
            return L10n.Error.subscriptionVerificationFailed
        case .invalidConfiguration:
            return L10n.Error.invalidConfiguration
        }
    }

    var recoverySuggestion: String? {
        switch self {
        case .aiServiceUnavailable:
            return L10n.Error.Recovery.ensureIOS26
        case .aiProcessingFailed, .aiStreamFailed:
            return L10n.Error.Recovery.tryAgain
        case .storageFailure:
            return L10n.Error.Recovery.restartApp
        case .networkUnavailable:
            return L10n.Error.Recovery.checkInternet
        case .subscriptionVerificationFailed:
            return L10n.Error.Recovery.restorePurchase
        case .invalidConfiguration:
            return L10n.Error.Recovery.reinstallApp
        }
    }
}

// MARK: - Result Type Alias
typealias AppResult<T> = Result<T, AppError>

// MARK: - AI Service Errors
enum AIServiceError: Error {
    case unavailable
    case processingFailed(Error)
    case streamInterrupted(Error)
    case emptyResponse

    var localizedDescription: String {
        switch self {
        case .unavailable:
            return L10n.AIServiceConfig.fallbackResponse
        case .processingFailed, .streamInterrupted:
            return L10n.ErrorMessages.aiProcessingFailed
        case .emptyResponse:
            return L10n.ErrorMessages.emptyResponse
        }
    }
}
