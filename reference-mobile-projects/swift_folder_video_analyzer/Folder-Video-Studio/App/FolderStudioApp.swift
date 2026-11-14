import SwiftUI

@main
struct FolderStudioApp: App {
    @StateObject private var appState = AppState()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(appState)
                .frame(minWidth: AppConstants.UI.minimumWindowSize.width, minHeight: AppConstants.UI.minimumWindowSize.height)
        }
        .windowStyle(.titleBar)
        .defaultSize(width: 1100, height: 720)
    }
}
