import SwiftUI

@main
struct InsightHubApp: App {
    var body: some Scene {
        WindowGroup {
            MainTabView()
                .preferredColorScheme(nil)
        }
    }
}
