export type DispatchCategory = 'urgent' | 'action_required' | 'finance' | 'rfc_review' | 'system'

export interface DraftReply {
  style: 'professional' | 'action_confirm' | 'polite_decline' | 'inquiry'
  label: string
  content: string
}

export interface DispatchMessage {
  id: string
  from: string
  fromEmail: string
  avatar: string
  avatarColor: string
  subject: string
  preview: string
  body: string
  receivedAt: string
  read: boolean
  starred: boolean
  important: boolean
  category: DispatchCategory
  aiAnalysis: {
    summary: string
    urgencyScore: number // 1 to 10
    extractedTasks: string[]
    draftReplies: DraftReply[]
  }
}

export const INITIAL_DISPATCH_MESSAGES: DispatchMessage[] = [
  {
    id: 'msg-sarah-q1',
    from: 'Sarah Chen',
    fromEmail: 'sarah.chen@nexora.internal',
    avatar: 'SC',
    avatarColor: '#3B82F6',
    subject: 'Q1 Architecture Review — Key Action Items & Timeline',
    preview: 'Following up on our architecture sync. Here are the 3 key milestones we need to finalize...',
    body: `Hi Alex,

Following up on today's quarterly architecture review for Nexora. Here are the key action items and decisions we discussed:

1. Finalize the Pgvector chunking and embeddings schema specification by March 15.
2. Complete the multi-agent worker retry policy benchmark across Cloudflare Workers.
3. Review and sign off on Jordan's design tokens for the unified canvas studio.

Can you please confirm you've received this and let me know if the March 15 timeline aligns with the core roadmap?

Best regards,
Sarah Chen
Staff Product Architect`,
    receivedAt: '9:32 AM Today',
    read: false,
    starred: true,
    important: true,
    category: 'action_required',
    aiAnalysis: {
      summary: 'Action required from Product Architecture: Review and confirm March 15 deadline for pgvector spec and retry policy RFC.',
      urgencyScore: 8,
      extractedTasks: [
        'Finalize Pgvector chunking spec by March 15',
        'Benchmark Worker retry policy',
        'Sign off on design tokens with Jordan',
      ],
      draftReplies: [
        {
          style: 'action_confirm',
          label: 'Confirm March 15 Target',
          content: 'Hi Sarah,\n\nReceived and reviewed. The March 15 target for the pgvector embeddings schema aligns with our roadmap. I will have the draft ready for your review by Wednesday.\n\nBest,\nAlex',
        },
        {
          style: 'inquiry',
          label: 'Request 2-Day Buffer',
          content: 'Hi Sarah,\n\nThanks for the summary. The milestones make sense, but due to the current agent queue refactoring, can we shift the pgvector deliverable by 2 business days to March 17?\n\nBest,\nAlex',
        },
        {
          style: 'professional',
          label: 'Delegate to Aria Codex',
          content: 'Hi Sarah,\n\nI have assigned Aria Codex to run the automated benchmark pass for the worker retry policy. We will sync during tomorrow standup with preliminary data.\n\nBest,\nAlex',
        },
      ],
    },
  },
  {
    id: 'msg-amex-billing',
    from: 'Cloud FinOps & AmEx Ledger',
    fromEmail: 'billing@americanexpress.com',
    avatar: 'AX',
    avatarColor: '#EF4444',
    subject: 'Monthly Compute Settlement: $1,247.33 due Mar 5',
    preview: 'Your consolidated inference and edge infrastructure invoice is ready for review...',
    body: `Nexora Cloud Operations Account:

Your consolidated infrastructure billing statement for the period Feb 1 - Feb 28 is ready:

• Neon Serverless Postgres: $420.00 (pgvector queries: 14.8M)
• Groq LPU Fast Inference: $680.00 (tokens: 382M)
• Cloudflare Workers & KV: $147.33 (requests: 48.2M)

Total Amount Due: $1,247.33
Scheduled Auto-Debit Date: March 5, 2026

If you would like to audit token breakdown or query logs, review your telemetry console before the scheduled settlement.`,
    receivedAt: '8:15 AM Today',
    read: true,
    starred: false,
    important: true,
    category: 'finance',
    aiAnalysis: {
      summary: 'FinOps billing notice: $1,247.33 auto-debit scheduled for March 5. Verified against internal quota meter with 0.8% variance.',
      urgencyScore: 9,
      extractedTasks: [
        'Reconcile Groq token usage logs with daily meter',
        'Verify auto-debit balance on primary billing card',
      ],
      draftReplies: [
        {
          style: 'action_confirm',
          label: 'Acknowledge & Schedule',
          content: 'Invoice received and verified against telemetry logs. Payment authorized for March 5.',
        },
        {
          style: 'inquiry',
          label: 'Export Itemized PDF',
          content: 'Please forward the itemized CSV export of Groq token consumption by API key identifier.',
        },
      ],
    },
  },
  {
    id: 'msg-mike-v2-api',
    from: 'Mike Rodriguez',
    fromEmail: 'mike.rodriguez@nexora.internal',
    avatar: 'MR',
    avatarColor: '#06B6D4',
    subject: 'API v2 Planning Document — Needs Product Input',
    preview: 'Hi Alex, I have drafted the API v2 architecture RFC. Would love your perspective on rate limits...',
    body: `Hi Alex,

I have drafted the API v2 architecture document. Would love your product perspective on three key architectural decisions before we lock the schema:

1. Should we support GraphQL alongside our Hono REST endpoints, or double down on OpenAPI/tRPC contracts?
2. Versioning strategy: URL path prefix (/v2/*) vs. custom request headers (Accept-Version: 2.0)?
3. Rate limiting strategy for free-tier background worker agents (10 req/min vs token bucket)?

Draft RFC is available in the knowledge vault under /docs/rfcs/api-v2-spec.md.

Happy to jump on a quick huddle if easier!

Cheers,
Mike`,
    receivedAt: 'Yesterday, 16:40',
    read: false,
    starred: false,
    important: false,
    category: 'rfc_review',
    aiAnalysis: {
      summary: 'Technical RFC feedback requested: REST vs GraphQL, versioning conventions, and agent rate-limiting policy.',
      urgencyScore: 7,
      extractedTasks: [
        'Review API v2 RFC draft',
        'Decide on URL prefix vs header versioning convention',
      ],
      draftReplies: [
        {
          style: 'action_confirm',
          label: 'Recommend REST + URL Path',
          content: 'Hi Mike,\n\nLooked over the RFC. Let us stick with Hono REST + URL path versioning (/v2/*) to stay aligned with fleet standards and maintain edge cacheability. Let us schedule 15m tomorrow to finalize the token bucket numbers.\n\nAlex',
        },
        {
          style: 'inquiry',
          label: 'Request Benchmark Numbers',
          content: 'Hi Mike,\n\nGreat work on the draft. Can you run a quick latency benchmark comparing the header routing overhead vs path routing on Cloudflare edge before we decide?\n\nAlex',
        },
      ],
    },
  },
  {
    id: 'msg-jordan-tokens',
    from: 'Jordan Lee',
    fromEmail: 'jordan.lee@nexora.internal',
    avatar: 'JL',
    avatarColor: '#10B981',
    subject: 'Design System Update: Liquid Glass & Dark Mode Tokens',
    preview: 'Hey! Pushed the updated color palette and spacing scale to web-design-system...',
    body: `Hey Alex!

I have pushed the updated design tokens to @umituz/web-design-system:
- Calibrated background luminance scale for dark mode
- Added frosted glass backdrop blur tokens (liquid glass)
- Revised typography hierarchy for compact dashboard viewports

Please take a look at the storybook preview and approve before we promote to the release channel.

Thanks,
Jordan`,
    receivedAt: '2 days ago',
    read: true,
    starred: true,
    important: false,
    category: 'action_required',
    aiAnalysis: {
      summary: 'Design System approval needed: Liquid glass tokens and dark mode contrast ratios ready for verification.',
      urgencyScore: 5,
      extractedTasks: [
        'Inspect component preview on high-DPI displays',
        'Approve token release pull request',
      ],
      draftReplies: [
        {
          style: 'action_confirm',
          label: 'Approve & Merge',
          content: 'Hi Jordan,\n\nThe dark mode luminance feels crisp and legible across all pages. Token PR approved for release!\n\nAlex',
        },
      ],
    },
  },
]
