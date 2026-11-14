import Foundation

struct SampleData {
    static let models: [AIModel] = [
        AIModel(name: "GPT-5", provider: "OpenAI", category: "Language", iconSymbol: "brain.head.profile", parameterCount: "1.8T", rating: 4.9, trending: true, color: "10B981", contextWindow: "256K", license: "Proprietary", releaseDate: "2025", inputCost: "$15/M", outputCost: "$60/M"),
        AIModel(name: "Claude 4", provider: "Anthropic", category: "Language", iconSymbol: "text.bubble.fill", parameterCount: "1.2T", rating: 4.8, trending: true, color: "6C5CE7", contextWindow: "200K", license: "Proprietary", releaseDate: "2025", inputCost: "$12/M", outputCost: "$48/M"),
        AIModel(name: "Gemini Ultra 2", provider: "Google", category: "Multimodal", iconSymbol: "sparkles", parameterCount: "2.0T", rating: 4.7, trending: true, color: "0EA5E9", contextWindow: "1M", license: "Proprietary", releaseDate: "2025", inputCost: "$10/M", outputCost: "$40/M"),
        AIModel(name: "Llama 4", provider: "Meta", category: "Language", iconSymbol: "bolt.fill", parameterCount: "405B", rating: 4.5, trending: false, color: "F59E0B", contextWindow: "128K", license: "Open Source", releaseDate: "2025", inputCost: "Free", outputCost: "Free"),
        AIModel(name: "Stable Diffusion 4", provider: "Stability AI", category: "Image", iconSymbol: "photo.artframe", parameterCount: "6B", rating: 4.6, trending: true, color: "EF4444", contextWindow: "N/A", license: "Open Source", releaseDate: "2025", inputCost: "Free", outputCost: "Free"),
        AIModel(name: "Sora Pro", provider: "OpenAI", category: "Video", iconSymbol: "film.fill", parameterCount: "N/A", rating: 4.8, trending: true, color: "A855F7", contextWindow: "N/A", license: "Proprietary", releaseDate: "2025", inputCost: "$0.08/s", outputCost: "N/A"),
        AIModel(name: "Whisper v4", provider: "OpenAI", category: "Audio", iconSymbol: "waveform", parameterCount: "1.5B", rating: 4.4, trending: false, color: "00D2FF", contextWindow: "N/A", license: "Open Source", releaseDate: "2025", inputCost: "$0.006/m", outputCost: "N/A"),
        AIModel(name: "Midjourney v7", provider: "Midjourney", category: "Image", iconSymbol: "paintbrush.fill", parameterCount: "N/A", rating: 4.7, trending: true, color: "EC4899", contextWindow: "N/A", license: "Proprietary", releaseDate: "2025", inputCost: "$10/mo", outputCost: "N/A"),
        AIModel(name: "Mistral Large 3", provider: "Mistral", category: "Language", iconSymbol: "wind", parameterCount: "123B", rating: 4.3, trending: false, color: "F97316", contextWindow: "128K", license: "Open Source", releaseDate: "2025", inputCost: "$3/M", outputCost: "$9/M"),
        AIModel(name: "Flux Pro 2", provider: "Black Forest Labs", category: "Image", iconSymbol: "camera.filters", parameterCount: "12B", rating: 4.5, trending: true, color: "8B5CF6", contextWindow: "N/A", license: "Proprietary", releaseDate: "2025", inputCost: "$0.05/img", outputCost: "N/A"),
    ]

    static let useCases: [UseCase] = [
        UseCase(title: "AI-Powered Code Review", industry: "Engineering", complexity: "Advanced", iconSymbol: "chevron.left.forwardslash.chevron.right", description: "Automated code analysis and suggestions"),
        UseCase(title: "Medical Image Diagnosis", industry: "Healthcare", complexity: "Expert", iconSymbol: "heart.text.square.fill", description: "Radiology scan interpretation with AI"),
        UseCase(title: "Customer Support Bot", industry: "SaaS", complexity: "Intermediate", iconSymbol: "headphones", description: "24/7 intelligent customer assistance"),
        UseCase(title: "Content Generation Pipeline", industry: "Marketing", complexity: "Beginner", iconSymbol: "doc.text.fill", description: "Automated blog and social media content"),
        UseCase(title: "Fraud Detection System", industry: "Finance", complexity: "Advanced", iconSymbol: "shield.lefthalf.filled", description: "Real-time transaction anomaly detection"),
    ]

    static let threads: [DiscussionThread] = [
        DiscussionThread(title: "GPT-5 vs Claude 4: Which handles reasoning better?", author: "AIResearcher42", replies: 234, likes: 891, timeAgo: "2h", tag: "Debate"),
        DiscussionThread(title: "Best practices for RAG in production", author: "MLEngineer", replies: 156, likes: 623, timeAgo: "4h", tag: "Tutorial"),
        DiscussionThread(title: "Sora Pro just dropped — first impressions", author: "CreativeAI", replies: 89, likes: 445, timeAgo: "1h", tag: "News"),
        DiscussionThread(title: "Fine-tuning Llama 4 on custom datasets", author: "OpenSourceFan", replies: 67, likes: 312, timeAgo: "6h", tag: "Guide"),
    ]

    static let news: [NewsItem] = [
        NewsItem(title: "OpenAI announces GPT-5 Turbo with 10x inference speed", source: "TechCrunch", timeAgo: "30m", iconSymbol: "newspaper.fill", category: "Releases", readTime: "4 min", summary: "OpenAI's latest optimization brings GPT-5 Turbo to production with dramatic latency reductions and a new tiered pricing model for enterprise customers."),
        NewsItem(title: "EU AI Act enforcement begins — what it means for developers", source: "Reuters", timeAgo: "2h", iconSymbol: "building.columns.fill", category: "Policy", readTime: "6 min", summary: "The European Union's landmark AI regulation enters its first enforcement phase. Developers and enterprises must now comply with transparency and safety requirements."),
        NewsItem(title: "Google DeepMind claims AGI milestone in reasoning tasks", source: "Wired", timeAgo: "5h", iconSymbol: "star.fill", category: "Research", readTime: "8 min", summary: "A new benchmark published by DeepMind suggests their latest model surpasses human performance across a diverse set of reasoning and planning challenges."),
        NewsItem(title: "Anthropic raises $8B Series E at $61B valuation", source: "Bloomberg", timeAgo: "1d", iconSymbol: "chart.line.uptrend.xyaxis", category: "Business", readTime: "3 min", summary: "Anthropic's latest funding round cements its position as one of the most valuable AI startups, with plans to scale Claude's infrastructure globally."),
        NewsItem(title: "Meta open-sources Llama 4 Scout with 10M context", source: "VentureBeat", timeAgo: "3h", iconSymbol: "lock.open.fill", category: "Open Source", readTime: "5 min", summary: "Meta's Llama 4 Scout variant supports an unprecedented 10 million token context window, setting a new standard for open-source long-context models."),
        NewsItem(title: "Midjourney v7 introduces native video generation", source: "The Verge", timeAgo: "7h", iconSymbol: "film.fill", category: "Releases", readTime: "4 min", summary: "Midjourney's version 7 brings seamless video generation into its creative suite, directly challenging Runway and Sora in the generative video space."),
        NewsItem(title: "Stanford AI Index 2026: Key findings on model proliferation", source: "Stanford HAI", timeAgo: "2d", iconSymbol: "chart.bar.doc.horizontal.fill", category: "Research", readTime: "12 min", summary: "The annual Stanford AI Index reports 1,400+ new foundation models released in 2025, with open-source models closing the capability gap with proprietary systems."),
        NewsItem(title: "Mistral releases new code-specialized model Le Chat Pro", source: "InfoQ", timeAgo: "4h", iconSymbol: "chevron.left.forwardslash.chevron.right", category: "Releases", readTime: "3 min", summary: "Mistral AI's latest offering targets software developers with superior code generation, debugging, and multi-language support capabilities."),
    ]

    static let trendingTopics: [TrendingTopic] = [
        TrendingTopic(title: "Reasoning Models", count: 4821, icon: "brain.fill", color: "6C5CE7"),
        TrendingTopic(title: "Multimodal AI", count: 3654, icon: "sparkles", color: "0EA5E9"),
        TrendingTopic(title: "Open Source LLMs", count: 2987, icon: "lock.open.fill", color: "10B981"),
        TrendingTopic(title: "AI Agents", count: 2341, icon: "arrow.triangle.2.circlepath.circle.fill", color: "F59E0B"),
        TrendingTopic(title: "RAG Systems", count: 1876, icon: "magnifyingglass.circle.fill", color: "EC4899"),
        TrendingTopic(title: "Video Generation", count: 1543, icon: "film.fill", color: "A855F7"),
    ]

    static let leaderboard: [LeaderboardEntry] = [
        LeaderboardEntry(rank: 1, modelName: "GPT-5", provider: "OpenAI", score: 94.2, change: 0),
        LeaderboardEntry(rank: 2, modelName: "Claude 4", provider: "Anthropic", score: 93.8, change: 1),
        LeaderboardEntry(rank: 3, modelName: "Gemini Ultra 2", provider: "Google", score: 92.5, change: -1),
        LeaderboardEntry(rank: 4, modelName: "Llama 4", provider: "Meta", score: 89.1, change: 2),
        LeaderboardEntry(rank: 5, modelName: "Mistral Large 3", provider: "Mistral", score: 88.4, change: 0),
    ]

    static let weeklyScores: [Double] = [82, 85, 84, 88, 91, 93, 94.2]
    static let weekLabels: [String] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
}
