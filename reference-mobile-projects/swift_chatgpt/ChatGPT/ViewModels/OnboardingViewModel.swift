import SwiftUI

// MARK: - Onboarding View Model
@MainActor
final class OnboardingViewModel: ObservableObject {
    @Published var currentStep: OnboardingStep = .welcome
    @Published var selectedGoal: OnboardingGoal?
    @Published var selectedPainPoints: Set<String> = []
    @Published var selectedModel: ChatModel = .appleIntelligence
    @Published var demoMessages: [DemoMessage] = []
    @Published var demoInput: String = ""
    @Published var isDemoGenerating = false

    // MARK: - Data

    let goals: [OnboardingGoal] = [
        OnboardingGoal(id: "creative", emoji: "💡", title: L10n.Onboarding.Goals.creative),
        OnboardingGoal(id: "coding", emoji: "💻", title: L10n.Onboarding.Goals.coding),
        OnboardingGoal(id: "writing", emoji: "📝", title: L10n.Onboarding.Goals.writing),
        OnboardingGoal(id: "learning", emoji: "🎓", title: L10n.Onboarding.Goals.learning),
        OnboardingGoal(id: "analysis", emoji: "📊", title: L10n.Onboarding.Goals.analysis),
        OnboardingGoal(id: "brainstorm", emoji: "🗣️", title: L10n.Onboarding.Goals.brainstorm)
    ]

    let painPoints: [PainPoint] = [
        PainPoint(id: "slow", title: L10n.Onboarding.Pains.slow),
        PainPoint(id: "stuck", title: L10n.Onboarding.Pains.stuck),
        PainPoint(id: "overload", title: L10n.Onboarding.Pains.overload),
        PainPoint(id: "ideas", title: L10n.Onboarding.Pains.ideas),
        PainPoint(id: "opinions", title: L10n.Onboarding.Pains.opinions)
    ]

    let testimonials: [Testimonial] = [
        Testimonial(id: "t1", initials: "SK", name: "Sarah K.", tag: L10n.Onboarding.Social.tagProfessional, text: L10n.Onboarding.Social.review1),
        Testimonial(id: "t2", initials: "MR", name: "Mike R.", tag: L10n.Onboarding.Social.tagDeveloper, text: L10n.Onboarding.Social.review2),
        Testimonial(id: "t3", initials: "JL", name: "Jamie L.", tag: L10n.Onboarding.Social.tagStudent, text: L10n.Onboarding.Social.review3)
    ]

    // MARK: - Navigation

    var canProceed: Bool {
        switch currentStep {
        case .goal: return selectedGoal != nil
        case .painPoints: return !selectedPainPoints.isEmpty
        default: return true
        }
    }

    func nextStep() {
        guard let next = OnboardingStep(rawValue: currentStep.rawValue + 1) else { return }
        withAnimation(.easeInOut(duration: 0.3)) { currentStep = next }
    }

    func completeOnboarding() {
        StorageHelper.set(true, forKey: StorageKeys.onboardingCompleted)
    }

    static var isCompleted: Bool {
        StorageHelper.getBool(StorageKeys.onboardingCompleted)
    }

    // MARK: - Demo

    func sendDemoMessage() {
        let text = demoInput.trimmingCharacters(in: .whitespaces)
        guard !text.isEmpty else { return }
        demoMessages.append(DemoMessage(role: .user, content: text))
        demoInput = ""
        isDemoGenerating = true

        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) { [weak self] in
            self?.demoMessages.append(DemoMessage(role: .assistant, content: L10n.Onboarding.Demo.response))
            self?.isDemoGenerating = false
        }
    }

    // MARK: - Solutions (computed from selections)

    var solutions: [SolutionItem] {
        let all: [SolutionItem] = [
            SolutionItem(id: "slow", icon: "bolt.fill", pain: L10n.Onboarding.Pains.slow, solution: L10n.Onboarding.Solution.speed, stat: L10n.Onboarding.Solution.speedStat),
            SolutionItem(id: "stuck", icon: "lightbulb.fill", pain: L10n.Onboarding.Pains.stuck, solution: L10n.Onboarding.Solution.unblock, stat: L10n.Onboarding.Solution.unblockStat),
            SolutionItem(id: "overload", icon: "doc.text.fill", pain: L10n.Onboarding.Pains.overload, solution: L10n.Onboarding.Solution.clarity, stat: L10n.Onboarding.Solution.clarityStat),
            SolutionItem(id: "ideas", icon: "sparkles", pain: L10n.Onboarding.Pains.ideas, solution: L10n.Onboarding.Solution.capture, stat: L10n.Onboarding.Solution.captureStat),
            SolutionItem(id: "opinions", icon: "bubble.left.and.bubble.right.fill", pain: L10n.Onboarding.Pains.opinions, solution: L10n.Onboarding.Solution.sounding, stat: L10n.Onboarding.Solution.soundingStat)
        ]
        if selectedPainPoints.isEmpty { return Array(all.prefix(3)) }
        return all.filter { selectedPainPoints.contains($0.id) }
    }
}

// MARK: - Demo Message
struct DemoMessage: Identifiable {
    let id = UUID()
    let role: MessageRole
    let content: String
}
