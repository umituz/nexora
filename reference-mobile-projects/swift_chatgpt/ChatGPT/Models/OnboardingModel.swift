import Foundation

// MARK: - Onboarding Goal
struct OnboardingGoal: Identifiable {
    let id: String
    let emoji: String
    let title: String
}

// MARK: - Pain Point
struct PainPoint: Identifiable {
    let id: String
    let title: String
    let isSelected: Bool = false
}

// MARK: - Testimonial
struct Testimonial: Identifiable {
    let id: String
    let initials: String
    let name: String
    let tag: String
    let text: String
}

// MARK: - Solution Item
struct SolutionItem: Identifiable {
    let id: String
    let icon: String
    let pain: String
    let solution: String
    let stat: String
}

// MARK: - Onboarding State
enum OnboardingStep: Int, CaseIterable {
    case welcome = 0
    case goal = 1
    case painPoints = 2
    case socialProof = 3
    case solution = 4
    case preferences = 5
    case processing = 6
    case demo = 7
    case complete = 8

    var isLast: Bool { self == .complete }
    var progress: Double { Double(rawValue + 1) / Double(OnboardingStep.allCases.count) }
}
