import Foundation
import SwiftUI

// MARK: - Revenue Cat Service
@MainActor
final class RevenueCatService: SubscriptionServiceProtocol {
    static let shared = RevenueCatService()

    @Published var isProUser = false
    @Published var subscriptionStatus: SubscriptionStatus = .unknown

    private init() {}

    // MARK: - SubscriptionServiceProtocol

    func configure() async {
        // RevenueCat SDK not integrated - using local subscription state
        Logger.shared.info("Subscription service: local mode")
        subscriptionStatus = .notSubscribed
    }

    func checkSubscriptionStatus() async -> AppResult<SubscriptionStatus> {
        return .success(subscriptionStatus)
    }

    func restorePurchases() async -> AppResult<Void> {
        return .success(())
    }
}
