import Foundation

// MARK: - Result Helper
enum ResultHelper {

    /// Converts throwing closure to AppResult
    static func `catch`<T>(_ closure: () throws -> T) -> AppResult<T> {
        do {
            return .success(try closure())
        } catch {
            return .failure(.storageFailure(reason: error.localizedDescription))
        }
    }

    /// Converts async throwing closure to AppResult
    static func catchAsync<T>(_ closure: () async throws -> T) async -> AppResult<T> {
        do {
            return .success(try await closure())
        } catch {
            return .failure(.storageFailure(reason: error.localizedDescription))
        }
    }

    /// Unwraps optional or returns error
    static func unwrap<T>(_ optional: T?, error: AppError) -> AppResult<T> {
        guard let value = optional else {
            return .failure(error)
        }
        return .success(value)
    }
}
