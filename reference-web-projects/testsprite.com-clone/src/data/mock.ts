export interface Project {
  id: string;
  name: string;
  url: string;
  status: "active" | "paused" | "archived";
  testCount: number;
  lastRun: string;
  passRate: number;
  createdAt: string;
  description: string;
  framework: string;
  environment: string;
}

export interface TestRun {
  id: string;
  projectId: string;
  projectName: string;
  status: "passed" | "failed" | "running" | "queued";
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: string;
  startedAt: string;
  triggeredBy: string;
  branch: string;
  commit: string;
}

export interface TestCase {
  id: string;
  projectId: string;
  name: string;
  type: "frontend" | "backend" | "integration" | "e2e";
  status: "passed" | "failed" | "skipped" | "pending";
  priority: "critical" | "high" | "medium" | "low";
  lastRun: string;
  duration: string;
  tags: string[];
  description: string;
  steps: string[];
}

export interface BugReport {
  id: string;
  projectId: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low";
  status: "open" | "in-progress" | "resolved" | "closed";
  assignee: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  testCaseId: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "developer" | "viewer";
  avatar: string;
  joinedAt: string;
  lastActive: string;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
  category: "auth" | "project" | "test" | "settings" | "billing";
}

export interface Environment {
  id: string;
  name: string;
  url: string;
  status: "active" | "inactive";
  variables: number;
  lastUsed: string;
}

export interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  status: "active" | "inactive";
  lastTriggered: string;
  successRate: number;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string;
  status: "active" | "revoked";
  scopes: string[];
}

export interface ScheduledTest {
  id: string;
  projectId: string;
  projectName: string;
  cron: string;
  frequency: string;
  nextRun: string;
  lastRun: string;
  status: "active" | "paused";
  testListId: string;
  testListName: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  authorAvatar: string;
  date: string;
  readTime: string;
  slug: string;
  coverImage: string;
  content: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  avatar: string;
}

export interface Variable {
  id: string;
  key: string;
  value: string;
  environmentId: string;
  environmentName: string;
  isSecret: boolean;
  updatedAt: string;
}

export interface CoverageData {
  file: string;
  lines: number;
  covered: number;
  percentage: number;
  branches: number;
  branchesCovered: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: string;
}

// ── Mock Data ──

export const MOCK_PROJECTS: Project[] = [
  {
    id: "proj-1",
    name: "Acme Corp Website",
    url: "https://acme.inc",
    status: "active",
    testCount: 142,
    lastRun: "2026-03-08T10:30:00Z",
    passRate: 94.3,
    createdAt: "2025-11-15T08:00:00Z",
    description: "Main corporate website with e-commerce functionality",
    framework: "Next.js",
    environment: "Production",
  },
  {
    id: "proj-2",
    name: "Dashboard App",
    url: "https://dashboard.acme.inc",
    status: "active",
    testCount: 89,
    lastRun: "2026-03-08T09:15:00Z",
    passRate: 97.8,
    createdAt: "2025-12-01T10:00:00Z",
    description: "Internal analytics dashboard for team performance",
    framework: "React",
    environment: "Staging",
  },
  {
    id: "proj-3",
    name: "Mobile API",
    url: "https://api.acme.inc",
    status: "active",
    testCount: 256,
    lastRun: "2026-03-07T22:45:00Z",
    passRate: 91.0,
    createdAt: "2025-10-20T14:00:00Z",
    description: "RESTful API serving mobile applications",
    framework: "Express.js",
    environment: "Production",
  },
  {
    id: "proj-4",
    name: "Auth Service",
    url: "https://auth.acme.inc",
    status: "paused",
    testCount: 67,
    lastRun: "2026-03-05T16:00:00Z",
    passRate: 100,
    createdAt: "2026-01-10T09:00:00Z",
    description: "Authentication and authorization microservice",
    framework: "Fastify",
    environment: "Development",
  },
  {
    id: "proj-5",
    name: "E-commerce Platform",
    url: "https://shop.acme.inc",
    status: "active",
    testCount: 312,
    lastRun: "2026-03-08T11:00:00Z",
    passRate: 88.5,
    createdAt: "2025-09-05T12:00:00Z",
    description: "Full-featured online shopping platform",
    framework: "Next.js",
    environment: "Production",
  },
];

export const MOCK_TEST_RUNS: TestRun[] = [
  {
    id: "run-1",
    projectId: "proj-1",
    projectName: "Acme Corp Website",
    status: "passed",
    total: 142,
    passed: 134,
    failed: 5,
    skipped: 3,
    duration: "4m 32s",
    startedAt: "2026-03-08T10:30:00Z",
    triggeredBy: "CI/CD Pipeline",
    branch: "main",
    commit: "a3f8c21",
  },
  {
    id: "run-2",
    projectId: "proj-2",
    projectName: "Dashboard App",
    status: "failed",
    total: 89,
    passed: 82,
    failed: 7,
    skipped: 0,
    duration: "2m 15s",
    startedAt: "2026-03-08T09:15:00Z",
    triggeredBy: "Manual",
    branch: "feature/charts",
    commit: "b7e4d12",
  },
  {
    id: "run-3",
    projectId: "proj-3",
    projectName: "Mobile API",
    status: "running",
    total: 256,
    passed: 180,
    failed: 3,
    skipped: 0,
    duration: "6m 45s",
    startedAt: "2026-03-08T11:00:00Z",
    triggeredBy: "Schedule",
    branch: "main",
    commit: "c9f2e45",
  },
  {
    id: "run-4",
    projectId: "proj-1",
    projectName: "Acme Corp Website",
    status: "queued",
    total: 142,
    passed: 0,
    failed: 0,
    skipped: 0,
    duration: "—",
    startedAt: "2026-03-08T11:30:00Z",
    triggeredBy: "PR Merge",
    branch: "develop",
    commit: "d1a3b67",
  },
  {
    id: "run-5",
    projectId: "proj-5",
    projectName: "E-commerce Platform",
    status: "passed",
    total: 312,
    passed: 298,
    failed: 10,
    skipped: 4,
    duration: "12m 08s",
    startedAt: "2026-03-07T22:00:00Z",
    triggeredBy: "CI/CD Pipeline",
    branch: "main",
    commit: "e5g7h89",
  },
];

export const MOCK_TEST_CASES: TestCase[] = [
  {
    id: "tc-1",
    projectId: "proj-1",
    name: "User can sign up with email",
    type: "e2e",
    status: "passed",
    priority: "critical",
    lastRun: "2026-03-08T10:30:00Z",
    duration: "8.2s",
    tags: ["auth", "signup", "smoke"],
    description: "Verify that new users can create an account using email and password",
    steps: ["Navigate to signup page", "Fill in email and password", "Click submit", "Verify redirect to dashboard"],
  },
  {
    id: "tc-2",
    projectId: "proj-1",
    name: "Homepage loads correctly",
    type: "frontend",
    status: "passed",
    priority: "high",
    lastRun: "2026-03-08T10:30:00Z",
    duration: "3.1s",
    tags: ["homepage", "smoke"],
    description: "Ensure the homepage renders all critical elements",
    steps: ["Navigate to homepage", "Verify hero section", "Check navigation links", "Verify footer"],
  },
  {
    id: "tc-3",
    projectId: "proj-3",
    name: "GET /api/users returns 200",
    type: "backend",
    status: "passed",
    priority: "high",
    lastRun: "2026-03-07T22:45:00Z",
    duration: "0.5s",
    tags: ["api", "users"],
    description: "API endpoint returns list of users with correct schema",
    steps: ["Send GET request to /api/users", "Verify 200 status", "Validate JSON schema"],
  },
  {
    id: "tc-4",
    projectId: "proj-2",
    name: "Dashboard chart renders data",
    type: "frontend",
    status: "failed",
    priority: "medium",
    lastRun: "2026-03-08T09:15:00Z",
    duration: "5.7s",
    tags: ["charts", "dashboard"],
    description: "Chart component should render with correct data points",
    steps: ["Navigate to dashboard", "Wait for data load", "Verify chart renders", "Check data accuracy"],
  },
  {
    id: "tc-5",
    projectId: "proj-5",
    name: "Checkout flow completes",
    type: "e2e",
    status: "passed",
    priority: "critical",
    lastRun: "2026-03-07T22:00:00Z",
    duration: "15.3s",
    tags: ["checkout", "e2e", "payment"],
    description: "Full checkout flow from cart to order confirmation",
    steps: ["Add item to cart", "Proceed to checkout", "Fill shipping info", "Enter payment", "Confirm order"],
  },
  {
    id: "tc-6",
    projectId: "proj-3",
    name: "POST /api/orders validates input",
    type: "backend",
    status: "failed",
    priority: "high",
    lastRun: "2026-03-07T22:45:00Z",
    duration: "0.3s",
    tags: ["api", "orders", "validation"],
    description: "API should reject invalid order payloads with 400 status",
    steps: ["Send POST with empty body", "Verify 400 status", "Check error message"],
  },
  {
    id: "tc-7",
    projectId: "proj-1",
    name: "Mobile navigation menu",
    type: "frontend",
    status: "passed",
    priority: "medium",
    lastRun: "2026-03-08T10:30:00Z",
    duration: "2.8s",
    tags: ["mobile", "navigation"],
    description: "Mobile hamburger menu opens and navigates correctly",
    steps: ["Set viewport to mobile", "Click hamburger icon", "Verify menu opens", "Click nav item"],
  },
  {
    id: "tc-8",
    projectId: "proj-2",
    name: "Filter by date range",
    type: "integration",
    status: "skipped",
    priority: "low",
    lastRun: "2026-03-08T09:15:00Z",
    duration: "—",
    tags: ["filters", "date"],
    description: "Date range filter should correctly filter dashboard data",
    steps: ["Open date picker", "Select start date", "Select end date", "Verify filtered results"],
  },
];

export const MOCK_BUG_REPORTS: BugReport[] = [
  {
    id: "bug-1",
    projectId: "proj-2",
    title: "Chart tooltip shows wrong date format",
    severity: "medium",
    status: "open",
    assignee: "Sarah Chen",
    createdAt: "2026-03-08T09:20:00Z",
    updatedAt: "2026-03-08T09:20:00Z",
    description: "The tooltip on the analytics chart displays dates in UTC instead of local timezone",
    testCaseId: "tc-4",
  },
  {
    id: "bug-2",
    projectId: "proj-3",
    title: "API returns 500 on concurrent requests",
    severity: "critical",
    status: "in-progress",
    assignee: "Mike Johnson",
    createdAt: "2026-03-07T14:00:00Z",
    updatedAt: "2026-03-08T08:00:00Z",
    description: "When multiple orders are submitted simultaneously, the API intermittently returns 500 errors",
    testCaseId: "tc-6",
  },
  {
    id: "bug-3",
    projectId: "proj-5",
    title: "Cart total miscalculated with discount",
    severity: "high",
    status: "open",
    assignee: "Lisa Park",
    createdAt: "2026-03-06T11:00:00Z",
    updatedAt: "2026-03-07T16:00:00Z",
    description: "When a percentage discount is applied, the cart total doesn't account for tax correctly",
    testCaseId: "tc-5",
  },
  {
    id: "bug-4",
    projectId: "proj-1",
    title: "Login button unresponsive on Safari",
    severity: "high",
    status: "resolved",
    assignee: "Tom Wilson",
    createdAt: "2026-03-04T09:00:00Z",
    updatedAt: "2026-03-06T14:00:00Z",
    description: "The login button does not respond to clicks on Safari 17+ browsers",
    testCaseId: "tc-1",
  },
];

export const MOCK_TEAM_MEMBERS: TeamMember[] = [
  { id: "tm-1", name: "Alex Rivera", email: "alex@acme.inc", role: "owner", avatar: "", joinedAt: "2025-09-01T00:00:00Z", lastActive: "2026-03-08T11:00:00Z" },
  { id: "tm-2", name: "Sarah Chen", email: "sarah@acme.inc", role: "admin", avatar: "", joinedAt: "2025-10-15T00:00:00Z", lastActive: "2026-03-08T10:30:00Z" },
  { id: "tm-3", name: "Mike Johnson", email: "mike@acme.inc", role: "developer", avatar: "", joinedAt: "2025-11-20T00:00:00Z", lastActive: "2026-03-08T09:00:00Z" },
  { id: "tm-4", name: "Lisa Park", email: "lisa@acme.inc", role: "developer", avatar: "", joinedAt: "2026-01-05T00:00:00Z", lastActive: "2026-03-07T18:00:00Z" },
  { id: "tm-5", name: "Tom Wilson", email: "tom@acme.inc", role: "viewer", avatar: "", joinedAt: "2026-02-10T00:00:00Z", lastActive: "2026-03-06T12:00:00Z" },
];

export const MOCK_AUDIT_LOG: AuditLogEntry[] = [
  { id: "al-1", action: "Test run triggered", user: "Alex Rivera", timestamp: "2026-03-08T11:30:00Z", details: "Manual test run for Acme Corp Website", category: "test" },
  { id: "al-2", action: "Project created", user: "Sarah Chen", timestamp: "2026-03-07T14:00:00Z", details: "New project: Payment Gateway", category: "project" },
  { id: "al-3", action: "Team member invited", user: "Alex Rivera", timestamp: "2026-03-07T10:00:00Z", details: "Invited tom@acme.inc as viewer", category: "settings" },
  { id: "al-4", action: "Billing plan upgraded", user: "Alex Rivera", timestamp: "2026-03-06T09:00:00Z", details: "Upgraded from Starter to Standard", category: "billing" },
  { id: "al-5", action: "API key created", user: "Mike Johnson", timestamp: "2026-03-05T16:00:00Z", details: "New API key: CI Pipeline Key", category: "settings" },
  { id: "al-6", action: "User logged in", user: "Lisa Park", timestamp: "2026-03-05T08:30:00Z", details: "Login from 192.168.1.1", category: "auth" },
  { id: "al-7", action: "Test cases generated", user: "System", timestamp: "2026-03-04T22:00:00Z", details: "AI generated 24 test cases for E-commerce Platform", category: "test" },
  { id: "al-8", action: "Environment updated", user: "Sarah Chen", timestamp: "2026-03-04T15:00:00Z", details: "Updated staging environment variables", category: "project" },
];

export const MOCK_ENVIRONMENTS: Environment[] = [
  { id: "env-1", name: "Production", url: "https://acme.inc", status: "active", variables: 12, lastUsed: "2026-03-08T10:30:00Z" },
  { id: "env-2", name: "Staging", url: "https://staging.acme.inc", status: "active", variables: 15, lastUsed: "2026-03-08T09:15:00Z" },
  { id: "env-3", name: "Development", url: "https://dev.acme.inc", status: "active", variables: 18, lastUsed: "2026-03-07T16:00:00Z" },
  { id: "env-4", name: "QA", url: "https://qa.acme.inc", status: "inactive", variables: 10, lastUsed: "2026-03-05T12:00:00Z" },
];

export const MOCK_WEBHOOKS: Webhook[] = [
  { id: "wh-1", name: "Slack Notifications", url: "https://hooks.slack.com/services/xxx", events: ["test.completed", "test.failed"], status: "active", lastTriggered: "2026-03-08T10:35:00Z", successRate: 99.2 },
  { id: "wh-2", name: "GitHub Status", url: "https://api.github.com/repos/acme/webhook", events: ["test.completed"], status: "active", lastTriggered: "2026-03-08T10:35:00Z", successRate: 100 },
  { id: "wh-3", name: "PagerDuty Alert", url: "https://events.pagerduty.com/v2/enqueue", events: ["test.failed"], status: "inactive", lastTriggered: "2026-03-01T08:00:00Z", successRate: 95.5 },
];

export const MOCK_API_KEYS: ApiKey[] = [
  { id: "ak-1", name: "CI Pipeline Key", key: "ts_live_xxxxxxxxxxxx1234", createdAt: "2026-02-15T10:00:00Z", lastUsed: "2026-03-08T10:30:00Z", status: "active", scopes: ["test:run", "test:read", "project:read"] },
  { id: "ak-2", name: "Development Key", key: "ts_dev_xxxxxxxxxxxx5678", createdAt: "2026-01-20T14:00:00Z", lastUsed: "2026-03-07T16:00:00Z", status: "active", scopes: ["test:run", "test:read", "test:write", "project:read", "project:write"] },
  { id: "ak-3", name: "Old Integration Key", key: "ts_live_xxxxxxxxxxxx9012", createdAt: "2025-11-01T09:00:00Z", lastUsed: "2026-01-15T12:00:00Z", status: "revoked", scopes: ["test:read"] },
];

export const MOCK_SCHEDULED_TESTS: ScheduledTest[] = [
  { id: "st-1", projectId: "proj-1", projectName: "Acme Corp Website", cron: "0 */6 * * *", frequency: "Every 6 hours", nextRun: "2026-03-08T18:00:00Z", lastRun: "2026-03-08T12:00:00Z", status: "active", testListId: "tl-1", testListName: "Smoke Tests" },
  { id: "st-2", projectId: "proj-3", projectName: "Mobile API", cron: "0 0 * * *", frequency: "Daily at midnight", nextRun: "2026-03-09T00:00:00Z", lastRun: "2026-03-08T00:00:00Z", status: "active", testListId: "tl-2", testListName: "Full API Suite" },
  { id: "st-3", projectId: "proj-5", projectName: "E-commerce Platform", cron: "0 8 * * 1", frequency: "Weekly on Monday", nextRun: "2026-03-09T08:00:00Z", lastRun: "2026-03-03T08:00:00Z", status: "paused", testListId: "tl-3", testListName: "Regression Suite" },
];

export const MOCK_BLOG_POSTS: BlogPost[] = [
  {
    id: "bp-1",
    title: "Building the Testing Backbone: Announcing Our Seed Round",
    excerpt: "We just announced $6.7 million in seed funding to expand our AI-powered testing platform.",
    category: "News",
    author: "Yunhao Jiao",
    authorAvatar: "",
    date: "2025-10-30",
    readTime: "5 min read",
    slug: "seed-round-announcement",
    coverImage: "",
    content: "We are thrilled to announce that TestSprite has raised $6.7 million in seed funding. This investment will help us expand our autonomous AI testing platform and continue building the missing verification layer for AI-native development workflows. Our mission is to transform how software teams validate their code, making it faster, more reliable, and completely autonomous.",
  },
  {
    id: "bp-2",
    title: "Introducing TestSprite 2.0 — AI That Tests, Fixes, and Delivers",
    excerpt: "Our biggest update yet brings autonomous self-repair, unified batch generation, and more.",
    category: "Platform Update",
    author: "Yunhao Jiao",
    authorAvatar: "",
    date: "2025-07-15",
    readTime: "8 min read",
    slug: "testsprite-2-0",
    coverImage: "",
    content: "TestSprite 2.0 represents a fundamental leap in AI-powered testing. With autonomous self-repair capabilities, our platform doesn't just find bugs — it fixes them. The new unified batch generation feature allows you to create comprehensive test suites across your entire stack with a single click.",
  },
  {
    id: "bp-3",
    title: "Why AI-Generated Code Needs AI-Powered Testing",
    excerpt: "As AI coding tools become mainstream, the gap between code generation and verification grows.",
    category: "Software Testing",
    author: "Engineering Team",
    authorAvatar: "",
    date: "2025-06-20",
    readTime: "6 min read",
    slug: "ai-code-needs-ai-testing",
    coverImage: "",
    content: "The rise of AI coding assistants has dramatically accelerated development speed. But there's a growing problem: the verification bottleneck. When AI can generate code 10x faster, traditional manual testing becomes the critical bottleneck. This is where autonomous AI testing becomes essential.",
  },
  {
    id: "bp-4",
    title: "Best Practices for MCP Server Integration",
    excerpt: "Learn how to set up TestSprite's MCP server for seamless IDE integration.",
    category: "Tutorial",
    author: "Engineering Team",
    authorAvatar: "",
    date: "2025-05-10",
    readTime: "10 min read",
    slug: "mcp-integration-guide",
    coverImage: "",
    content: "Model Context Protocol (MCP) enables direct integration between your IDE and TestSprite. This guide walks you through setting up the MCP server with Cursor, VS Code, and Claude Code for a seamless testing workflow.",
  },
  {
    id: "bp-5",
    title: "How We Achieved 93% Feature Delivery Accuracy",
    excerpt: "A deep dive into our autonomous verification loop and how it improves code quality.",
    category: "Engineering",
    author: "Engineering Team",
    authorAvatar: "",
    date: "2025-04-05",
    readTime: "7 min read",
    slug: "93-percent-accuracy",
    coverImage: "",
    content: "Moving from 42% to 93% feature delivery accuracy required rethinking the entire testing paradigm. Instead of writing tests after code, our autonomous feedback loop continuously verifies functionality as code is generated.",
  },
  {
    id: "bp-6",
    title: "TestSprite Ranks #1 on Product Hunt",
    excerpt: "Thanks to our incredible community, TestSprite is now the No.1 Product of the Day.",
    category: "News",
    author: "Yunhao Jiao",
    authorAvatar: "",
    date: "2025-01-28",
    readTime: "3 min read",
    slug: "product-hunt-number-one",
    coverImage: "",
    content: "We're honored and humbled to announce that TestSprite has achieved the #1 Product of the Day on Product Hunt. This recognition is a testament to our incredible community of over 100,000 developers who believe in the future of autonomous AI testing.",
  },
];

export const MOCK_TESTIMONIALS: Testimonial[] = [
  { id: "t-1", name: "Trae Team", role: "AI Platform", company: "ByteDance", quote: "Great MCP from the TestSprite team! AI coding + AI testing helps you build better software easily!", avatar: "" },
  { id: "t-2", name: "Malcolm Y.", role: "Co-founder", company: "Genrex", quote: "TestSprite's automation has been invaluable in detecting hard-to-find issues. API testing is crucial to our product. Its comprehensive coverage gives us confidence to release updates.", avatar: "" },
  { id: "t-3", name: "Jeffery Z.", role: "Managing Partner", company: "Princeton Pharmatech", quote: "TestSprite's user-friendly interface made it easy to set everything up. The simplicity of the onboarding process really sets TestSprite apart from other tools we've used.", avatar: "" },
  { id: "t-4", name: "Michel F.", role: "Founder", company: "Astronuts", quote: "TestSprite saves us time and money. Our engineering team can now automate QA and get real-time results, enabling our team to ship faster.", avatar: "" },
  { id: "t-5", name: "Jakub K.", role: "Founder", company: "Parcel AI", quote: "TestSprite's automation capabilities save us hours of manual work. The detailed reports help us catch and resolve issues earlier in the development process.", avatar: "" },
  { id: "t-6", name: "Bo L.", role: "QA Engineer", company: "Luckin Coffee", quote: "TestSprite offers rich test case generation, clear structure, and easy-to-read code. It also supports simple online debugging with the ability to quickly expand.", avatar: "" },
];

export const MOCK_VARIABLES: Variable[] = [
  { id: "var-1", key: "API_BASE_URL", value: "https://api.acme.inc/v1", environmentId: "env-1", environmentName: "Production", isSecret: false, updatedAt: "2026-03-01T10:00:00Z" },
  { id: "var-2", key: "API_KEY", value: "••••••••••••", environmentId: "env-1", environmentName: "Production", isSecret: true, updatedAt: "2026-02-15T10:00:00Z" },
  { id: "var-3", key: "DATABASE_URL", value: "••••••••••••", environmentId: "env-1", environmentName: "Production", isSecret: true, updatedAt: "2026-01-20T10:00:00Z" },
  { id: "var-4", key: "API_BASE_URL", value: "https://staging-api.acme.inc/v1", environmentId: "env-2", environmentName: "Staging", isSecret: false, updatedAt: "2026-03-05T14:00:00Z" },
  { id: "var-5", key: "DEBUG_MODE", value: "true", environmentId: "env-3", environmentName: "Development", isSecret: false, updatedAt: "2026-03-07T09:00:00Z" },
];

export const MOCK_COVERAGE: CoverageData[] = [
  { file: "src/components/Auth.tsx", lines: 120, covered: 108, percentage: 90, branches: 24, branchesCovered: 20 },
  { file: "src/components/Dashboard.tsx", lines: 250, covered: 200, percentage: 80, branches: 40, branchesCovered: 28 },
  { file: "src/api/users.ts", lines: 85, covered: 82, percentage: 96.5, branches: 16, branchesCovered: 15 },
  { file: "src/api/orders.ts", lines: 140, covered: 98, percentage: 70, branches: 30, branchesCovered: 18 },
  { file: "src/utils/helpers.ts", lines: 60, covered: 58, percentage: 96.7, branches: 10, branchesCovered: 10 },
  { file: "src/pages/Checkout.tsx", lines: 180, covered: 126, percentage: 70, branches: 36, branchesCovered: 22 },
  { file: "src/hooks/useCart.ts", lines: 45, covered: 45, percentage: 100, branches: 8, branchesCovered: 8 },
  { file: "src/services/payment.ts", lines: 95, covered: 57, percentage: 60, branches: 20, branchesCovered: 10 },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "n-1", title: "Test Run Completed", message: "Acme Corp Website: 134/142 tests passed", type: "success", read: false, createdAt: "2026-03-08T10:35:00Z" },
  { id: "n-2", title: "Test Failed", message: "Dashboard App: 7 tests failed in feature/charts", type: "error", read: false, createdAt: "2026-03-08T09:20:00Z" },
  { id: "n-3", title: "New Bug Report", message: "Critical bug found in Mobile API", type: "warning", read: true, createdAt: "2026-03-07T14:00:00Z" },
  { id: "n-4", title: "Plan Upgraded", message: "Your plan has been upgraded to Standard", type: "info", read: true, createdAt: "2026-03-06T09:00:00Z" },
];

export const DASHBOARD_STATS = {
  totalTests: 866,
  passRate: 92.4,
  activeProjects: 4,
  creditsUsed: 847,
  creditsTotal: 1600,
  testsToday: 45,
  bugsFound: 22,
  avgDuration: "5.2m",
} as const;
