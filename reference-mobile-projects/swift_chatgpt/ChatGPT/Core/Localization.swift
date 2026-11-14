import Foundation

// MARK: - Localization
// Centralized location for all user-facing text strings
// Currently English-only, structured for future multi-language support
enum L10n {

    // MARK: - General
    enum General {
        static let appName = "Andi"
        static let chat = "ChatGPT"
    }

    // MARK: - Chat
    enum Chat {
        static let messagePlaceholder = "Message"
        static let newChat = "New Chat"
        static let clearChat = "Clear Chat"
        static let confirmClear = "Clear all messages?"
    }

    // MARK: - Sidebar
    enum Sidebar {
        static let history = "History"
        static let emptyHistory = "No conversations yet"
        static let newChat = "New Chat"
        static let deleteConversation = "Delete"
        static let confirmDelete = "Delete this conversation?"
    }

    // MARK: - Paywall
    enum Paywall {
        static let upgradeToPro = "Upgrade to Pro"
        static let pro = "Pro"
        static let comingSoon = "Coming soon — unlock unlimited\nAI conversations and premium features"
        static let restorePurchases = "Restore Purchases"

        enum Features {
            static let unlimitedMessages = "Unlimited messages"
            static let allAIModels = "Access to all AI models"
            static let imageGeneration = "Image generation"
            static let prioritySpeed = "Priority response speed"
        }

        enum UpgradeCard {
            static let unlockAllFeatures = "Unlock all features"
        }
    }

    // MARK: - Error
    enum Error {
        static let aiServiceUnavailable = "AI service is not available on this device."
        static let aiProcessingFailed = "Failed to process AI request: %@"
        static let aiStreamInterrupted = "AI stream interrupted: %@"
        static let storageFailure = "Storage error: %@"
        static let networkUnavailable = "Network connection is unavailable."
        static let subscriptionVerificationFailed = "Unable to verify subscription status."
        static let invalidConfiguration = "Application configuration is invalid."

        enum Recovery {
            static let ensureIOS26 = "Ensure you're running iOS 26+ on Apple Silicon."
            static let tryAgain = "Please try again."
            static let restartApp = "Try restarting the app."
            static let checkInternet = "Check your internet connection."
            static let restorePurchase = "Restore your purchase in Settings."
            static let reinstallApp = "Reinstall the application."
        }

        enum Network {
            static let requestFailed = "Request failed: %@"
            static let decodeFailed = "Failed to decode response: %@"
            static let encodeFailed = "Failed to encode request: %@"
            static let httpError = "HTTP error: %d"
            static let rateLimitExceeded = "Rate limit exceeded. Please try again later."
            static let serverError = "Server error. Please try again later."
        }
    }

    // MARK: - Prompt Templates (System-provided starter prompts)
    enum PromptTemplates {
        static let templates = [
            PromptItem(title: "Design a database schema", subtitle: "for an online merch store"),
            PromptItem(title: "Explain airplane", subtitle: "to someone 5 years old"),
            PromptItem(title: "Write a Python script", subtitle: "to automate file renaming")
        ]
    }

    // MARK: - Prompt Template Model
    struct PromptItem: Identifiable {
        let id = UUID()
        let title: String
        let subtitle: String
    }

    // MARK: - AI
    enum AI {
        static let activeStatus = "Apple Intelligence Active"
        static let unavailableStatus = "Apple Intelligence – Requires iOS 26"

        enum Model {
            static let appleIntelligence = "Apple Intelligence"
            static let gpt4o = "GPT-4o"
            static let gpt4oMini = "GPT-4o mini"

            enum Subtitle {
                static let onDevice = "On-Device"
                static let fourOh = "4o"
                static let fourOhMini = "4o mini"
            }
        }
    }

    // MARK: - AI Service Configuration
    enum AIServiceConfig {
        static let systemPrompt = """
        You are Andi, a helpful, concise, and friendly AI assistant.
        Answer questions clearly. Keep responses focused and well-structured.
        """

        static let fallbackResponse = """
        Apple Intelligence requires an iPhone or iPad with Apple Silicon
        running iOS 26 or later. Please update your device to use on-device AI.
        """
    }

    // MARK: - Error Messages (Simple)
    enum ErrorMessages {
        static let aiProcessingFailed = "Sorry, I couldn't process that request. Please try again."
        static let aiStreamFailed = "Sorry, I couldn't process that. Please try again."
        static let emptyResponse = "I couldn't generate a response. Please try again."
    }

    // MARK: - Settings
    enum Settings {
        static let title = "Settings"
        static let apiKeys = "API Keys"
        static let openAIKey = "OpenAI API Key"
        static let claudeKey = "Claude API Key"
        static let preferences = "Preferences"
        static let defaultModel = "Default Model"
        static let theme = "Theme"
        static let about = "About"
        static let version = "Version"
        static let save = "Save"
        static let saved = "Saved"
        static let add = "Add"
        static let cancel = "Cancel"
        static let apiKeyRequired = "API Key Required"
        static let enterAPIKey = "Enter your API key to continue"
        static let invalidKey = "Invalid API Key"
        static let clearKey = "Clear Key"
        static let yourAPIKey = "Your API key is stored locally on your device."
        static let done = "Done"
    }

    // MARK: - Message
    enum Message {
        static let copy = "Copy"
        static let copied = "Copied!"
        static let delete = "Delete"
        static let regenerate = "Regenerate"
    }

    // MARK: - Conversation
    enum Conversation {
        static let newTitle = "New Chat"
    }

    // MARK: - Onboarding
    enum Onboarding {
        static let continueCTA = "Continue"

        enum Welcome {
            static let title = "Meet Andi"
            static let subtitle = "Your AI-powered thinking partner.\nSmarter answers, zero friction."
            static let cta = "Get Started"
            static let fast = "Instant"
            static let smart = "Multi-AI"
            static let isPrivate = "Private"
        }

        enum Goals {
            static let creative = "Creative ideas"
            static let coding = "Writing code"
            static let writing = "Writing & editing"
            static let learning = "Learning & research"
            static let analysis = "Analyzing data"
            static let brainstorm = "Brainstorming"
        }

        enum Goal {
            static let title = "What do you need help with?"
            static let subtitle = "Pick the one that fits you best"
        }

        enum Pains {
            static let slow = "Takes too long to find answers"
            static let stuck = "Getting stuck starting things"
            static let overload = "Too much info to process"
            static let ideas = "Losing good ideas before I capture them"
            static let opinions = "Need quick second opinions"
        }

        enum Pain {
            static let title = "What gets in your way?"
            static let subtitle = "Choose all that apply"
        }

        enum Social {
            static let title = "People love Andi"
            static let subtitle = "Join thousands who think smarter every day"
            static let tagProfessional = "Busy professional"
            static let tagDeveloper = "Software developer"
            static let tagStudent = "Grad student"
            static let review1 = "Andi replaced 3 apps for me. I brainstorm, write, and research all in one place now."
            static let review2 = "The multi-model approach is genius. I switch between GPT-4o and on-device depending on the task."
            static let review3 = "Finally an AI assistant that doesn't require a subscription just to try it out."
        }

        enum Solution {
            static let title = "Here's how Andi helps"
            static let subtitle = "Your frustrations, solved"
            static let speed = "Get answers in seconds, not minutes"
            static let speedStat = "93% of users find their answer on the first try"
            static let unblock = "Break through creative blocks instantly"
            static let unblockStat = "Users report 4x faster starts on projects"
            static let clarity = "Complex topics explained simply"
            static let clarityStat = "Summarizes in 1/10th the reading time"
            static let capture = "Never lose a thought again"
            static let captureStat = "Instant capture and expansion of ideas"
            static let sounding = "Get honest, instant feedback"
            static let soundingStat = "Available 24/7, zero judgment"
        }

        enum Preferences {
            static let title = "Choose your AI brain"
            static let subtitle = "You can always switch later"
            static let appleDesc = "On-device, private, fast"
            static let gpt4oDesc = "Most capable, requires API key"
            static let gpt4oMiniDesc = "Fast & affordable, requires API key"
        }

        enum Processing {
            static let title = "Setting up your Andi..."
            static let subtitle = "Personalizing your experience"
        }

        enum Demo {
            static let title = "Try asking Andi anything"
            static let subtitle = "This is a live demo — type your first question"
            static let placeholder = "Ask me anything..."
            static let next = "Looks great! Continue"
            static let skip = "Skip for now"
            static let response = "Great question! I'm Andi, your AI thinking partner. I can help you brainstorm ideas, write content, explain complex topics, and much more. In the full app, you'll get detailed, personalized responses powered by the AI model of your choice. What would you like to explore?"
        }

        enum Complete {
            static let title = "You're all set!"
            static let subtitle = "Andi is ready to help you think smarter"
            static let cta = "Start Chatting"
        }
    }
}

// MARK: - Prompt Example Model
struct PromptExample {
    let title: String
    let subtitle: String
}
