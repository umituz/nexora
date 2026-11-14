import Foundation

// MARK: - Date Utilities
enum DateUtils {

    // MARK: - Formatting

    /// Formats date as relative time (e.g., "2 hours ago")
    static func relativeTime(from date: Date) -> String {
        let now = Date()
        let interval = now.timeIntervalSince(date)

        if interval < 60 {
            return "just now"
        } else if interval < 3600 {
            let minutes = Int(interval / 60)
            return "\(minutes)m ago"
        } else if interval < 86400 {
            let hours = Int(interval / 3600)
            return "\(hours)h ago"
        } else if interval < 604800 {
            let days = Int(interval / 86400)
            return "\(days)d ago"
        } else {
            let formatter = DateFormatter()
            formatter.dateStyle = .short
            return formatter.string(from: date)
        }
    }

    /// Checks if date is within last N seconds
    static func isRecent(_ date: Date, withinSeconds: TimeInterval) -> Bool {
        Date().timeIntervalSince(date) <= withinSeconds
    }

    /// Checks if date is today
    static func isToday(_ date: Date) -> Bool {
        Calendar.current.isDateInToday(date)
    }
}
