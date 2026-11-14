import SwiftUI

// MARK: - Main App Entry Point
@main
struct BasedPeakApp: App {
    @StateObject private var services = ServiceContainer.shared
    @State private var showSidebar = false
    @State private var showOnboarding = !OnboardingViewModel.isCompleted

    init() {
        Task { await ServiceContainer.shared.subscription.configure() }
    }

    var body: some Scene {
        WindowGroup {
            ZStack {
                if showOnboarding {
                    OnboardingContainerView()
                        .onDisappear {
                            showOnboarding = false
                        }
                } else {
                    MainChatView(showSidebar: $showSidebar)
                        .environmentObject(services.subscription)
                    SidebarOverlay(showSidebar: $showSidebar)
                        .environmentObject(services.subscription)
                }
            }
            .environment(\.services, services)
        }
    }
}
