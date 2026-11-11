// Mock data for the OpenClaw Dashboard

export const mockSessions = [
  { id: "sess_a1b2c3", model: "claude-sonnet-4-20250514", status: "active", tokens: 45230, cost: 0.18, startedAt: "2026-03-27T10:15:00Z", messages: 34 },
  { id: "sess_d4e5f6", model: "claude-sonnet-4-20250514", status: "completed", tokens: 128400, cost: 0.52, startedAt: "2026-03-27T09:00:00Z", messages: 89 },
  { id: "sess_g7h8i9", model: "gemini-2.5-pro", status: "completed", tokens: 67800, cost: 0.14, startedAt: "2026-03-27T08:30:00Z", messages: 42 },
  { id: "sess_j0k1l2", model: "claude-sonnet-4-20250514", status: "error", tokens: 12300, cost: 0.05, startedAt: "2026-03-26T22:10:00Z", messages: 8 },
  { id: "sess_m3n4o5", model: "gemini-2.5-flash", status: "completed", tokens: 234100, cost: 0.47, startedAt: "2026-03-26T18:45:00Z", messages: 156 },
  { id: "sess_p6q7r8", model: "claude-sonnet-4-20250514", status: "completed", tokens: 89200, cost: 0.36, startedAt: "2026-03-26T14:20:00Z", messages: 67 },
  { id: "sess_s9t0u1", model: "gemini-2.5-pro", status: "completed", tokens: 156700, cost: 0.31, startedAt: "2026-03-26T11:00:00Z", messages: 112 },
  { id: "sess_v2w3x4", model: "claude-sonnet-4-20250514", status: "completed", tokens: 43200, cost: 0.17, startedAt: "2026-03-25T20:30:00Z", messages: 28 },
];

export const mockFeedMessages = [
  { id: 1, type: "agent" as const, content: "Refactored authentication module with PBKDF2 hashing", timestamp: "2026-03-27T10:20:15Z", session: "sess_a1b2c3" },
  { id: 2, type: "system" as const, content: "Session sess_d4e5f6 completed — 128.4K tokens used", timestamp: "2026-03-27T09:58:00Z", session: "sess_d4e5f6" },
  { id: 3, type: "agent" as const, content: "Implementing rate limiter middleware for API endpoints", timestamp: "2026-03-27T10:18:30Z", session: "sess_a1b2c3" },
  { id: 4, type: "warning" as const, content: "CPU usage exceeded 85% threshold", timestamp: "2026-03-27T10:15:00Z", session: "system" },
  { id: 5, type: "agent" as const, content: "Writing unit tests for cron scheduler", timestamp: "2026-03-27T10:12:45Z", session: "sess_a1b2c3" },
  { id: 6, type: "system" as const, content: "Gemini session sess_g7h8i9 completed — 67.8K tokens", timestamp: "2026-03-27T08:55:00Z", session: "sess_g7h8i9" },
  { id: 7, type: "agent" as const, content: "Optimizing database query performance with indexing", timestamp: "2026-03-27T10:10:00Z", session: "sess_a1b2c3" },
  { id: 8, type: "warning" as const, content: "Disk usage at 78% — consider cleanup", timestamp: "2026-03-27T09:45:00Z", session: "system" },
];

export const mockSystemHealth = {
  cpu: { current: 42, history: [35, 38, 45, 52, 48, 42, 39, 44, 50, 46, 42, 38, 41, 43, 47, 42, 40, 38, 36, 42] },
  ram: { current: 67, total: 16, used: 10.7, history: [62, 64, 65, 67, 68, 67, 65, 66, 67, 68, 69, 67, 66, 65, 67, 68, 67, 66, 67, 67] },
  disk: { current: 54, total: 512, used: 276, history: [52, 52, 53, 53, 53, 54, 54, 54, 54, 54, 54, 54, 54, 54, 54, 54, 54, 54, 54, 54] },
  temp: { current: 58, history: [55, 56, 58, 62, 60, 58, 57, 59, 61, 59, 58, 56, 57, 58, 60, 58, 57, 56, 55, 58] },
};

export const mockHeatmapData = (() => {
  const data: { day: number; hour: number; value: number }[] = [];
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      const isWorkHours = hour >= 9 && hour <= 22;
      const base = isWorkHours ? 3 : 0;
      const value = Math.min(5, base + Math.floor(Math.random() * 3));
      data.push({ day, hour, value });
    }
  }
  return data;
})();

export const mockOverviewStats = {
  totalSessions: 847,
  totalTokens: 12_450_000,
  totalCost: 49.82,
  activeStreak: 23,
  todaySessions: 8,
  todayTokens: 576_830,
  todayCost: 2.20,
  provider: "Claude" as "Claude" | "Gemini",
};

export const mockCronJobs = [
  { id: "cron_1", name: "Heartbeat Check", schedule: "*/5 * * * *", enabled: true, lastRun: "2026-03-27T10:20:00Z", nextRun: "2026-03-27T10:25:00Z" },
  { id: "cron_2", name: "Memory Cleanup", schedule: "0 */6 * * *", enabled: true, lastRun: "2026-03-27T06:00:00Z", nextRun: "2026-03-27T12:00:00Z" },
  { id: "cron_3", name: "Usage Scraper", schedule: "0 * * * *", enabled: true, lastRun: "2026-03-27T10:00:00Z", nextRun: "2026-03-27T11:00:00Z" },
  { id: "cron_4", name: "Log Rotation", schedule: "0 0 * * *", enabled: false, lastRun: "2026-03-27T00:00:00Z", nextRun: "2026-03-28T00:00:00Z" },
];

export const mockGitCommits = [
  { hash: "a3f2c1d", message: "feat: add rate limiting to API endpoints", repo: "openclaw", time: "2 hours ago" },
  { hash: "b7e4f9a", message: "fix: memory leak in session handler", repo: "openclaw", time: "5 hours ago" },
  { hash: "c1d8e3b", message: "docs: update README with Docker instructions", repo: "openclaw-dashboard", time: "8 hours ago" },
  { hash: "d5f2a7c", message: "refactor: simplify auth middleware", repo: "openclaw", time: "1 day ago" },
];
