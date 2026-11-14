import SwiftUI

struct HomeView: View {
    @State private var showQueue = false
    @State private var showNotifications = false

    var body: some View {
        NavigationStack {
            ScrollView(showsIndicators: false) {
                VStack(spacing: 24) {
                    heroSection
                    quickActionsSection
                    agentActivitySection
                    connectedToolsSection
                    Spacer(minLength: 20)
                }
                .padding(.horizontal, 20)
                .padding(.top, 8)
            }
            .background(Color.black)
            .navigationTitle("Nexus AI")
            .toolbarColorScheme(.dark, for: .navigationBar)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Button { showQueue = true } label: {
                        ZStack(alignment: .topTrailing) {
                            Image(systemName: "list.number")
                                .font(.system(size: 17))
                                .foregroundStyle(.white)
                            Circle()
                                .fill(Color.orange)
                                .frame(width: 9, height: 9)
                                .offset(x: 4, y: -4)
                        }
                    }
                }
                ToolbarItem(placement: .topBarTrailing) {
                    Button { showNotifications = true } label: {
                        ZStack(alignment: .topTrailing) {
                            Image(systemName: "bell.fill")
                                .font(.system(size: 17))
                                .foregroundStyle(.white)
                            Circle()
                                .fill(Color.red)
                                .frame(width: 9, height: 9)
                                .offset(x: 4, y: -4)
                        }
                    }
                }
            }
        }
        .sheet(isPresented: $showQueue) {
            TaskQueueView()
        }
        .sheet(isPresented: $showNotifications) {
            NotificationCenterView()
        }
    }

    @ViewBuilder private var heroSection: some View { HeroCardView() }
    @ViewBuilder private var quickActionsSection: some View { QuickActionsSectionView() }
    @ViewBuilder private var agentActivitySection: some View { AgentActivitySectionView() }
    @ViewBuilder private var connectedToolsSection: some View { ConnectedToolsSectionView() }
}
