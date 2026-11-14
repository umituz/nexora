import SwiftUI

struct MainTabView: View {
    @State private var selectedTab = 0
    @State private var showTemplates = false

    var body: some View {
        TabView(selection: $selectedTab) {
            HomeView()
                .tabItem { Label("Home", systemImage: "house.fill") }
                .tag(0)

            ProjectsView()
                .tabItem { Label("Projects", systemImage: "folder.fill") }
                .tag(1)

            // Center create tab — intercept tap
            Color.clear
                .tabItem { Label("Create", systemImage: "plus.circle.fill") }
                .tag(2)

            AgentMarketplaceView()
                .tabItem { Label("Agents", systemImage: "cpu.fill") }
                .tag(3)

            AgentChatView()
                .tabItem { Label("Chat", systemImage: "bubble.left.and.bubble.right.fill") }
                .tag(4)
        }
        .tint(.white)
        .onChange(of: selectedTab) { _, val in
            if val == 2 {
                showTemplates = true
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.05) {
                    selectedTab = 0
                }
            }
        }
        .sheet(isPresented: $showTemplates) {
            TaskTemplateGalleryView()
        }
    }
}
