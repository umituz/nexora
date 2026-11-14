import SwiftUI

// MARK: - Task Template Gallery

struct TaskTemplateGalleryView: View {
    @Environment(\.dismiss) private var dismiss
    @State private var searchText = ""
    @State private var selectedCategory: String = "All"
    @State private var selectedTemplate: TaskTemplate? = nil
    @State private var showBuilder = false

    private var categories: [String] {
        ["All"] + Array(Set(TaskTemplate.all.map(\.category))).sorted()
    }

    private var filtered: [TaskTemplate] {
        let base = selectedCategory == "All" ? TaskTemplate.all : TaskTemplate.all.filter { $0.category == selectedCategory }
        if searchText.isEmpty { return base }
        return base.filter {
            $0.title.localizedCaseInsensitiveContains(searchText) ||
            $0.description.localizedCaseInsensitiveContains(searchText)
        }
    }

    var body: some View {
        NavigationStack {
            ZStack {
                Color.black.ignoresSafeArea()
                VStack(spacing: 0) {
                    categoryBar
                    Divider().background(Color.white.opacity(0.08))
                    templateList
                }
            }
            .navigationTitle("Templates")
            .navigationBarTitleDisplayMode(.large)
            .toolbarColorScheme(.dark, for: .navigationBar)
            .searchable(text: $searchText, prompt: "Search templates")
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Button { dismiss() } label: {
                        Image(systemName: "xmark")
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundStyle(.gray)
                    }
                }
                ToolbarItem(placement: .topBarTrailing) {
                    Button {
                        selectedTemplate = nil
                        showBuilder = true
                    } label: {
                        HStack(spacing: 5) {
                            Image(systemName: "square.and.pencil").font(.caption)
                            Text("Custom").font(.subheadline).fontWeight(.medium)
                        }
                        .foregroundStyle(.white)
                    }
                }
            }
            .sheet(isPresented: $showBuilder) {
                AgentPromptBuilderView()
            }
        }
    }

    // MARK: - Category Bar

    @ViewBuilder
    private var categoryBar: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                ForEach(categories, id: \.self) { cat in
                    Button {
                        withAnimation(.spring(duration: 0.25)) { selectedCategory = cat }
                    } label: {
                        Text(cat)
                            .font(.subheadline)
                            .fontWeight(selectedCategory == cat ? .semibold : .regular)
                            .foregroundStyle(selectedCategory == cat ? .black : .gray)
                            .padding(.horizontal, 16)
                            .padding(.vertical, 8)
                            .background(selectedCategory == cat ? Color.white : Color.white.opacity(0.08))
                            .clipShape(Capsule())
                    }
                }
            }
            .padding(.horizontal, 20)
            .padding(.vertical, 12)
        }
    }

    // MARK: - Template List

    @ViewBuilder
    private var templateList: some View {
        ScrollView(showsIndicators: false) {
            if filtered.isEmpty {
                emptyState
            } else {
                LazyVStack(spacing: 12) {
                    featuredSection
                    regularSection
                }
                .padding(.horizontal, 20)
                .padding(.top, 4)
                .padding(.bottom, 30)
            }
        }
    }

    @ViewBuilder
    private var featuredSection: some View {
        let featured = filtered.filter(\.isFeatured)
        if !featured.isEmpty {
            VStack(alignment: .leading, spacing: 10) {
                Label("Featured", systemImage: "star.fill")
                    .font(.caption).fontWeight(.semibold).foregroundStyle(.yellow)
                    .padding(.top, 8)
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 12) {
                        ForEach(featured) { t in
                            FeaturedTemplateCard(template: t) {
                                selectTemplate(t)
                            }
                        }
                    }
                    .padding(.horizontal, 1)
                }
            }
        }
    }

    @ViewBuilder
    private var regularSection: some View {
        let regular = filtered.filter { !$0.isFeatured || selectedCategory != "All" }
        if !regular.isEmpty {
            VStack(alignment: .leading, spacing: 10) {
                Text(selectedCategory == "All" ? "All Templates" : selectedCategory)
                    .font(.caption).fontWeight(.semibold).foregroundStyle(.gray)
                    .padding(.top, 4)
                ForEach(regular) { t in
                    TemplateRow(template: t) { selectTemplate(t) }
                }
            }
        }
    }

    private func selectTemplate(_ template: TaskTemplate) {
        selectedTemplate = template
        showBuilder = true
    }

    @ViewBuilder
    private var emptyState: some View {
        VStack(spacing: 16) {
            Image(systemName: "doc.text.magnifyingglass")
                .font(.system(size: 48))
                .foregroundStyle(.gray.opacity(0.3))
            Text("No templates found")
                .font(.headline).foregroundStyle(.white)
            Text("Try searching for something else or start from scratch.")
                .font(.subheadline).foregroundStyle(.gray).multilineTextAlignment(.center)
            Button {
                showBuilder = true
            } label: {
                Label("Custom Task", systemImage: "plus")
                    .font(.subheadline).fontWeight(.semibold)
                    .foregroundStyle(.black)
                    .padding(.horizontal, 24).padding(.vertical, 12)
                    .background(Color.white).clipShape(Capsule())
            }
        }
        .padding(.top, 80)
    }
}

// MARK: - Featured Card (horizontal scroll)

struct FeaturedTemplateCard: View {
    let template: TaskTemplate
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(alignment: .leading, spacing: 12) {
                HStack {
                    Image(systemName: template.icon)
                        .font(.title2)
                        .foregroundStyle(.white)
                        .frame(width: 48, height: 48)
                        .background(LinearGradient(colors: template.gradient, startPoint: .topLeading, endPoint: .bottomTrailing))
                        .clipShape(RoundedRectangle(cornerRadius: 14))
                    Spacer()
                    if template.isFeatured {
                        Image(systemName: "star.fill")
                            .font(.caption2)
                            .foregroundStyle(.yellow)
                    }
                }
                Text(template.title)
                    .font(.subheadline).fontWeight(.bold).foregroundStyle(.white)
                    .lineLimit(2).multilineTextAlignment(.leading)
                Text(template.description)
                    .font(.caption).foregroundStyle(.gray).lineLimit(2).multilineTextAlignment(.leading)
                HStack(spacing: 6) {
                    Label(template.duration, systemImage: "timer")
                        .font(.caption2).foregroundStyle(.gray)
                    Spacer()
                    Text(template.category)
                        .font(.caption2).fontWeight(.medium)
                        .foregroundStyle(template.gradient.first ?? .blue)
                        .padding(.horizontal, 8).padding(.vertical, 3)
                        .background((template.gradient.first ?? .blue).opacity(0.15))
                        .clipShape(Capsule())
                }
            }
            .padding(16)
            .frame(width: 210)
            .background(Color.white.opacity(0.06))
            .clipShape(RoundedRectangle(cornerRadius: 20))
        }
    }
}

// MARK: - Template Row (vertical list)

struct TemplateRow: View {
    let template: TaskTemplate
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 14) {
                Image(systemName: template.icon)
                    .font(.system(size: 16))
                    .foregroundStyle(.white)
                    .frame(width: 44, height: 44)
                    .background(LinearGradient(colors: template.gradient, startPoint: .topLeading, endPoint: .bottomTrailing))
                    .clipShape(RoundedRectangle(cornerRadius: 13))
                VStack(alignment: .leading, spacing: 4) {
                    Text(template.title)
                        .font(.subheadline).fontWeight(.semibold).foregroundStyle(.white)
                    Text(template.description)
                        .font(.caption).foregroundStyle(.gray).lineLimit(1)
                }
                Spacer()
                VStack(alignment: .trailing, spacing: 3) {
                    Text(template.duration)
                        .font(.caption2).foregroundStyle(.gray)
                    Image(systemName: "chevron.right")
                        .font(.caption2).foregroundStyle(.gray.opacity(0.5))
                }
            }
            .padding(14)
            .background(Color.white.opacity(0.06))
            .clipShape(RoundedRectangle(cornerRadius: 16))
        }
    }
}

// MARK: - Template Model

struct TaskTemplate: Identifiable {
    let id = UUID()
    let title: String
    let description: String
    let icon: String
    let gradient: [Color]
    let category: String
    let duration: String
    let isFeatured: Bool

    static let all: [TaskTemplate] = [
        // Marketing
        TaskTemplate(title: "SaaS Landing Page", description: "Hero, features, pricing, and CTA sections with modern design", icon: "globe", gradient: [.blue, .cyan], category: "Marketing", duration: "~5 min", isFeatured: true),
        TaskTemplate(title: "Investor Pitch Deck", description: "12-slide presentation with market data and financials", icon: "rectangle.stack.fill", gradient: [.purple, .pink], category: "Marketing", duration: "~8 min", isFeatured: true),
        TaskTemplate(title: "Product Launch Email", description: "Announcement email with features and social proof", icon: "envelope.fill", gradient: [.orange, .red], category: "Marketing", duration: "~2 min", isFeatured: false),
        TaskTemplate(title: "Social Media Pack", description: "5 posts for LinkedIn, Twitter, and Instagram", icon: "photo.on.rectangle", gradient: [.pink, .purple], category: "Marketing", duration: "~3 min", isFeatured: false),
        TaskTemplate(title: "Weekly Newsletter", description: "Curated content with intro, main story, and links", icon: "newspaper.fill", gradient: [.green, .teal], category: "Marketing", duration: "~4 min", isFeatured: false),

        // Research
        TaskTemplate(title: "Competitor Analysis", description: "Deep-dive on 8 competitors with pricing & feature matrix", icon: "chart.bar.fill", gradient: [.orange, .yellow], category: "Research", duration: "~15 min", isFeatured: true),
        TaskTemplate(title: "Market Size Report", description: "TAM/SAM/SOM analysis with growth projections", icon: "chart.pie.fill", gradient: [.teal, .cyan], category: "Research", duration: "~12 min", isFeatured: false),
        TaskTemplate(title: "User Research Summary", description: "Synthesize 50+ reviews into key themes and pain points", icon: "person.2.fill", gradient: [.indigo, .blue], category: "Research", duration: "~10 min", isFeatured: false),
        TaskTemplate(title: "Tech Stack Audit", description: "Evaluate tools and suggest optimizations", icon: "cpu", gradient: [.gray, .blue], category: "Research", duration: "~8 min", isFeatured: false),

        // Development
        TaskTemplate(title: "REST API Boilerplate", description: "Node.js API with auth, rate limiting, and database", icon: "chevron.left.forwardslash.chevron.right", gradient: [.cyan, .blue], category: "Development", duration: "~7 min", isFeatured: true),
        TaskTemplate(title: "CI/CD Pipeline", description: "GitHub Actions workflow with testing and deployment", icon: "arrow.triangle.2.circlepath", gradient: [.green, .cyan], category: "Development", duration: "~4 min", isFeatured: false),
        TaskTemplate(title: "Data Scraper", description: "Python script to extract and clean web data", icon: "arrow.down.circle.fill", gradient: [.yellow, .orange], category: "Development", duration: "~5 min", isFeatured: false),
        TaskTemplate(title: "Dashboard UI", description: "React dashboard with charts and data tables", icon: "macwindow", gradient: [.purple, .blue], category: "Development", duration: "~10 min", isFeatured: false),

        // Finance
        TaskTemplate(title: "5-Year Financial Model", description: "Revenue projections with 3 scenarios in spreadsheet", icon: "chart.line.uptrend.xyaxis", gradient: [.green, .mint], category: "Finance", duration: "~10 min", isFeatured: false),
        TaskTemplate(title: "Unit Economics Report", description: "CAC, LTV, payback period, and margin analysis", icon: "dollarsign.circle.fill", gradient: [.yellow, .green], category: "Finance", duration: "~8 min", isFeatured: false),
        TaskTemplate(title: "Fundraising Memo", description: "Investor update memo with key metrics and milestones", icon: "doc.richtext.fill", gradient: [.indigo, .purple], category: "Finance", duration: "~6 min", isFeatured: false),

        // Content
        TaskTemplate(title: "Blog Post (Long-form)", description: "2,000-word SEO-optimized article on any topic", icon: "doc.text.fill", gradient: [.green, .blue], category: "Content", duration: "~6 min", isFeatured: false),
        TaskTemplate(title: "Video Script", description: "YouTube or ad script with hook, body, and CTA", icon: "video.fill", gradient: [.red, .orange], category: "Content", duration: "~4 min", isFeatured: false),
        TaskTemplate(title: "Product Descriptions", description: "5 compelling product descriptions for e-commerce", icon: "tag.fill", gradient: [.teal, .blue], category: "Content", duration: "~3 min", isFeatured: false),
    ]
}
