import Foundation

struct AppUser: Identifiable, Codable {
    let id: UUID
    var displayName: String
    var avatarUrl: String?
    let createdAt: Date

    enum CodingKeys: String, CodingKey {
        case id
        case displayName = "display_name"
        case avatarUrl = "avatar_url"
        case createdAt = "created_at"
    }

    init(id: UUID, displayName: String, avatarUrl: String? = nil, createdAt: Date = Date()) {
        self.id = id
        self.displayName = displayName
        self.avatarUrl = avatarUrl
        self.createdAt = createdAt
    }
}
