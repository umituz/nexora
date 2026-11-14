import Foundation

// MARK: - Network Service
final class NetworkService: NetworkServiceProtocol {
    static let shared = NetworkService()

    private let session: URLSession
    private let decoder: JSONDecoder
    private let encoder: JSONEncoder

    private let baseURL: String = "https://api.openai.com"

    private init() {
        let configuration = URLSessionConfiguration.default
        configuration.timeoutIntervalForRequest = 30
        configuration.timeoutIntervalForResource = 300
        self.session = URLSession(configuration: configuration)

        self.decoder = JSONDecoder()
        self.decoder.dateDecodingStrategy = .iso8601

        self.encoder = JSONEncoder()
        self.encoder.dateEncodingStrategy = .iso8601
    }

    // MARK: - NetworkServiceProtocol

    func fetch<T: Decodable>(
        _ endpoint: String,
        method: HTTPMethod,
        body: Data? = nil
    ) async -> AppResult<T> {
        guard let url = URL(string: baseURL + endpoint) else {
            return .failure(.invalidConfiguration)
        }

        var request = URLRequest(url: url)
        request.httpMethod = method.rawValue
        request.httpBody = body
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("application/json", forHTTPHeaderField: "Accept")

        do {
            let (data, response) = try await session.data(for: request)

            guard let httpResponse = response as? HTTPURLResponse else {
                return .failure(.invalidConfiguration)
            }

            return handleResponse(httpResponse, data: data)
        } catch {
            return .failure(.networkUnavailable)
        }
    }

    private func handleResponse<T: Decodable>(_ response: HTTPURLResponse, data: Data) -> AppResult<T> {
        switch response.statusCode {
        case 200..<300:
            do {
                let decoded = try decoder.decode(T.self, from: data)
                return .success(decoded)
            } catch {
                return .failure(.invalidConfiguration)
            }

        case 401:
            return .failure(.subscriptionVerificationFailed)

        case 429:
            return .failure(.networkUnavailable)

        case 500..<600:
            return .failure(.networkUnavailable)

        default:
            return .failure(.networkUnavailable)
        }
    }

    func stream(
        _ endpoint: String,
        method: HTTPMethod,
        body: Data? = nil
    ) -> AsyncStream<AppResult<Data>> {
        AsyncStream { continuation in
            Task {
                guard let url = URL(string: baseURL + endpoint) else {
                    continuation.yield(.failure(.invalidConfiguration))
                    continuation.finish()
                    return
                }

                var request = URLRequest(url: url)
                request.httpMethod = method.rawValue
                request.httpBody = body
                request.setValue("application/json", forHTTPHeaderField: "Content-Type")

                do {
                    let (bytes, response) = try await session.bytes(for: request)

                    guard let httpResponse = response as? HTTPURLResponse,
                          httpResponse.statusCode == 200 else {
                        continuation.yield(.failure(.networkUnavailable))
                        continuation.finish()
                        return
                    }

                    for try await line in bytes.lines {
                        guard let data = line.data(using: .utf8) else { continue }
                        continuation.yield(.success(data))
                    }

                    continuation.finish()
                } catch {
                    continuation.yield(.failure(.networkUnavailable))
                    continuation.finish()
                }
            }
        }
    }
}
