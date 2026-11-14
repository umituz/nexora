import Foundation

// MARK: - Network Service Protocol
protocol NetworkServiceProtocol {
    func fetch<T: Decodable>(
        _ endpoint: String,
        method: HTTPMethod,
        body: Data?
    ) async -> AppResult<T>

    func stream(
        _ endpoint: String,
        method: HTTPMethod,
        body: Data?
    ) -> AsyncStream<AppResult<Data>>
}

// MARK: - HTTP Method
enum HTTPMethod: String {
    case get = "GET"
    case post = "POST"
    case put = "PUT"
    case delete = "DELETE"
    case patch = "PATCH"
}

// MARK: - Network Error
enum NetworkError: Error {
    case invalidURL
    case requestFailed(Error)
    case decodingFailed(Error)
    case encodingFailed(Error)
    case invalidResponse
    case httpError(statusCode: Int)
    case noData
    case unauthorized
    case rateLimited
    case serverError

    var localizedDescription: String {
        switch self {
        case .invalidURL:
            return "Invalid URL"
        case .requestFailed(let error):
            return String(format: L10n.Error.Network.requestFailed, error.localizedDescription)
        case .decodingFailed(let error):
            return String(format: L10n.Error.Network.decodeFailed, error.localizedDescription)
        case .encodingFailed(let error):
            return String(format: L10n.Error.Network.encodeFailed, error.localizedDescription)
        case .invalidResponse:
            return "Invalid response from server"
        case .httpError(let statusCode):
            return String(format: L10n.Error.Network.httpError, statusCode)
        case .noData:
            return "No data received"
        case .unauthorized:
            return "Unauthorized access"
        case .rateLimited:
            return L10n.Error.Network.rateLimitExceeded
        case .serverError:
            return L10n.Error.Network.serverError
        }
    }
}
