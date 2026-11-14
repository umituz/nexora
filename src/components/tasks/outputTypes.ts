export type OutputType = 'webpage' | 'code' | 'spreadsheet' | 'document' | 'research'

export interface AgentOutputData {
  id: string
  title: string
  type: OutputType
  createdAt: string
  sizeBytes: number
  webContent?: {
    html: string
    title: string
  }
  codeContent?: {
    language: string
    filename: string
    code: string
  }
  spreadsheetContent?: {
    filename: string
    columns: string[]
    rows: (string | number)[][]
  }
  documentContent?: {
    title: string
    readingTimeMinutes: number
    markdown: string
    citations?: {
      id: string
      title: string
      url: string
      domain: string
      reliabilityScore: number
    }[]
  }
}

export const SAMPLE_OUTPUTS: Record<string, AgentOutputData> = {
  landingPage: {
    id: 'out-1',
    title: 'Nexora Cloud Analytics Landing Page',
    type: 'webpage',
    createdAt: new Date().toISOString(),
    sizeBytes: 14200,
    webContent: {
      title: 'Nexora Cloud Analytics',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; background: #0f172a; color: #f8fafc; padding: 40px; border-radius: 12px; max-width: 720px; margin: 0 auto;">
          <div style="display: inline-block; padding: 4px 12px; background: rgba(59, 130, 246, 0.2); border: 1px solid rgba(59, 130, 246, 0.4); border-radius: 9999px; font-size: 12px; font-weight: 600; color: #60a5fa; margin-bottom: 16px;">
            ✦ Autonomous Manus Agent Output
          </div>
          <h1 style="font-size: 28px; font-weight: 800; line-height: 1.2; margin-bottom: 12px; background: linear-gradient(135deg, #ffffff 0%, #94a3b8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
            Next-Gen Autonomous AI Operations
          </h1>
          <p style="font-size: 15px; color: #94a3b8; line-height: 1.6; margin-bottom: 24px;">
            Deploy self-healing cloud microservices, automate architectural benchmarks, and synthesize complex multi-source research in seconds.
          </p>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 24px;">
            <div style="background: rgba(255, 255, 255, 0.05); padding: 16px; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.1);">
              <div style="font-size: 20px; font-weight: 700; color: #38bdf8;">99.98%</div>
              <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Uptime SLA</div>
            </div>
            <div style="background: rgba(255, 255, 255, 0.05); padding: 16px; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.1);">
              <div style="font-size: 20px; font-weight: 700; color: #4ade80;">&lt; 140ms</div>
              <div style="font-size: 11px; color: #64748b; margin-top: 4px;">P99 Latency</div>
            </div>
            <div style="background: rgba(255, 255, 255, 0.05); padding: 16px; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.1);">
              <div style="font-size: 20px; font-weight: 700; color: #c084fc;">4.8x</div>
              <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Cost Reduction</div>
            </div>
          </div>
          <button style="background: #2563eb; color: #ffffff; padding: 10px 20px; border-radius: 8px; font-weight: 600; font-size: 13px; border: none; cursor: pointer;">
            Explore Live Sandbox →
          </button>
        </div>
      `,
    },
  },
  codeRefactor: {
    id: 'out-2',
    title: 'Distributed Rate Limiter Implementation',
    type: 'code',
    createdAt: new Date().toISOString(),
    sizeBytes: 8900,
    codeContent: {
      filename: 'tokenBucketRateLimiter.ts',
      language: 'typescript',
      code: `import { Redis } from '@upstash/redis'

export interface RateLimitConfig {
  capacity: number
  refillRatePerSec: number
  keyPrefix: string
}

export class DistributedTokenBucket {
  constructor(
    private readonly redis: Redis,
    private readonly config: RateLimitConfig
  ) {}

  async consume(key: string, tokens: number = 1): Promise<{ allowed: boolean; remaining: number }> {
    const bucketKey = \`\${this.config.keyPrefix}:\${key}\`
    const now = Date.now() / 1000

    // Lua script executing atomic sliding token bucket logic
    const luaScript = \`
      local key = KEYS[1]
      local capacity = tonumber(ARGV[1])
      local refillRate = tonumber(ARGV[2])
      local requested = tonumber(ARGV[3])
      local now = tonumber(ARGV[4])

      local data = redis.call('HMGET', key, 'tokens', 'lastRefill')
      local currentTokens = tonumber(data[1])
      local lastRefill = tonumber(data[2])

      if not currentTokens then
        currentTokens = capacity
        lastRefill = now
      else
        local delta = math.max(0, now - lastRefill)
        currentTokens = math.min(capacity, currentTokens + (delta * refillRate))
        lastRefill = now
      end

      if currentTokens >= requested then
        currentTokens = currentTokens - requested
        redis.call('HMSET', key, 'tokens', currentTokens, 'lastRefill', lastRefill)
        redis.call('EXPIRE', key, math.ceil(capacity / refillRate) * 2)
        return {1, math.floor(currentTokens)}
      else
        return {0, math.floor(currentTokens)}
      end
    \`

    const [allowed, remaining] = (await this.redis.eval(
      luaScript,
      [bucketKey],
      [this.config.capacity, this.config.refillRatePerSec, tokens, now]
    )) as [number, number]

    return { allowed: allowed === 1, remaining }
  }
}`,
    },
  },
  spreadsheetData: {
    id: 'out-3',
    title: 'Q1 AI Model Cost & Token Telemetry Analysis',
    type: 'spreadsheet',
    createdAt: new Date().toISOString(),
    sizeBytes: 18400,
    spreadsheetContent: {
      filename: 'ai_models_financial_analysis_q1.csv',
      columns: ['Model Tier', 'Requests', 'Avg Input Tokens', 'Avg Output Tokens', 'Avg Latency (ms)', 'Cost / 1K Req ($)', 'Quality Score / 100'],
      rows: [
        ['Claude 3.7 Sonnet', 12450, 4820, 1140, 1280, 24.12, 98.4],
        ['GPT-4o (Omni)', 28900, 3120, 920, 940, 16.98, 93.6],
        ['o3-mini (High Reasoning)', 9150, 6200, 2400, 3400, 17.38, 96.2],
        ['Gemini 2.0 Flash', 84200, 2980, 680, 280, 0.85, 88.5],
        ['DeepSeek R1', 19400, 4100, 1650, 2100, 5.86, 94.1],
        ['Llama 3.3 70B Instruct', 31200, 2400, 590, 490, 1.88, 86.8],
      ],
    },
  },
  researchReport: {
    id: 'out-4',
    title: 'Autonomous Multi-Agent Orchestration & Memory Systems: 2026 Architectural Synthesis',
    type: 'research',
    createdAt: new Date().toISOString(),
    sizeBytes: 29500,
    documentContent: {
      title: 'Autonomous Multi-Agent Orchestration & Memory Systems: 2026 Architectural Synthesis',
      readingTimeMinutes: 6,
      markdown: `## Executive Summary

Autonomous agent architectures have shifted fundamentally from single-prompt reactive generation to **multi-turn planning pipelines with deterministic feedback loops**. Key frontier production benchmarks reveal that breaking complex tasks into decoupled sub-stages (Planning → Context Retrieval → Atomic Tool Execution → Self-Refinement) increases task completion fidelity from **54.2% to 89.7%** on SWE-bench and GAIA benchmarks.

### Key Architectural Takeaways

1. **State Isolation**: Long-running subagents operating in isolated execution sandboxes prevent context drift and hallucination compounding.
2. **Deterministic Tool Gates**: User-in-the-loop approval gates for destructive operations (file mutations, shell execution, database transactions) are mandatory in enterprise deployments.
3. **Hybrid Memory Retrieval**: Combining pgvector cosine distance KNN with BM25 keyword search yields a 34% higher precision at top-3 retrieved knowledge chunks.

### Benchmarks & Cost Tradeoffs

| Architecture Pattern | SWE-bench Verified | P95 Latency | Operational Cost |
| :--- | :--- | :--- | :--- |
| Zero-shot Prompting | 24.3% | 1.8s | $0.03 / task |
| Chain-of-Thought Single Agent | 52.1% | 6.4s | $0.18 / task |
| Multi-Agent Pipeline (Manus Pattern) | **84.6%** | 28.2s | $0.46 / task |
`,
      citations: [
        {
          id: 'cit-1',
          title: 'SWE-bench: Can Language Models Resolve Real-World GitHub Issues?',
          url: 'https://arxiv.org/abs/2310.06770',
          domain: 'arxiv.org',
          reliabilityScore: 99,
        },
        {
          id: 'cit-2',
          title: 'Anthropic: Building Effective AI Agents and Tool Loops',
          url: 'https://anthropic.com/research/building-effective-agents',
          domain: 'anthropic.com',
          reliabilityScore: 98,
        },
        {
          id: 'cit-3',
          title: 'DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning',
          url: 'https://arxiv.org/abs/2501.12948',
          domain: 'arxiv.org',
          reliabilityScore: 97,
        },
      ],
    },
  },
}
