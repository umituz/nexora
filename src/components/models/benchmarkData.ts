import type { PublicModel } from '@shared/ai/contracts'

export interface ModelBenchmarks {
  reasoning: number // 0 - 100
  coding: number // 0 - 100
  math: number // 0 - 100
  language: number // 0 - 100
  speed: number // 0 - 100 (higher = faster tokens/sec)
  safety: number // 0 - 100
  contextScore: number // 0 - 100
  costEfficiency: number // 0 - 100 (higher = cheaper)
}

export interface LeaderboardItem {
  id: string
  rank: number
  modelName: string
  provider: string
  category: 'General' | 'Coding' | 'Reasoning' | 'Vision' | 'Lightweight'
  arenaElo: number
  humanEval: number
  mmlu: number
  mathScore: number
  rankChange: number // +2, -1, 0
  openWeights: boolean
  contextWindow: string
  inputCost: string
  outputCost: string
}

export interface UseCaseDefinition {
  id: string
  title: string
  industry: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  description: string
  recommendedModelId?: string
  alternativeModelId?: string
  keyFeatures: string[]
  temperature: number
  promptTip: string
}

export const LEADERBOARD_DATA: LeaderboardItem[] = [
  {
    id: 'claude-3-7-sonnet',
    rank: 1,
    modelName: 'Claude 3.7 Sonnet',
    provider: 'Anthropic',
    category: 'Reasoning',
    arenaElo: 1368,
    humanEval: 93.8,
    mmlu: 91.2,
    mathScore: 89.4,
    rankChange: 2,
    openWeights: false,
    contextWindow: '200K',
    inputCost: '$3.00/M',
    outputCost: '$15.00/M',
  },
  {
    id: 'gpt-4o',
    rank: 2,
    modelName: 'GPT-4o (Omni)',
    provider: 'OpenAI',
    category: 'Vision',
    arenaElo: 1345,
    humanEval: 90.2,
    mmlu: 88.7,
    mathScore: 84.1,
    rankChange: -1,
    openWeights: false,
    contextWindow: '128K',
    inputCost: '$2.50/M',
    outputCost: '$10.00/M',
  },
  {
    id: 'o3-mini',
    rank: 3,
    modelName: 'o3-mini (High)',
    provider: 'OpenAI',
    category: 'Reasoning',
    arenaElo: 1340,
    humanEval: 92.5,
    mmlu: 89.9,
    mathScore: 94.2,
    rankChange: 1,
    openWeights: false,
    contextWindow: '200K',
    inputCost: '$1.10/M',
    outputCost: '$4.40/M',
  },
  {
    id: 'gemini-2-flash',
    rank: 4,
    modelName: 'Gemini 2.0 Flash',
    provider: 'Google',
    category: 'Lightweight',
    arenaElo: 1324,
    humanEval: 86.4,
    mmlu: 85.3,
    mathScore: 81.0,
    rankChange: 3,
    openWeights: false,
    contextWindow: '1M',
    inputCost: '$0.15/M',
    outputCost: '$0.60/M',
  },
  {
    id: 'deepseek-r1',
    rank: 5,
    modelName: 'DeepSeek R1',
    provider: 'DeepSeek',
    category: 'Reasoning',
    arenaElo: 1335,
    humanEval: 91.0,
    mmlu: 90.8,
    mathScore: 93.1,
    rankChange: 0,
    openWeights: true,
    contextWindow: '128K',
    inputCost: '$0.55/M',
    outputCost: '$2.19/M',
  },
  {
    id: 'llama-3-3-70b',
    rank: 6,
    modelName: 'Llama 3.3 70B Instruct',
    provider: 'Meta',
    category: 'General',
    arenaElo: 1292,
    humanEval: 82.3,
    mmlu: 88.5,
    mathScore: 78.4,
    rankChange: -2,
    openWeights: true,
    contextWindow: '128K',
    inputCost: '$0.59/M',
    outputCost: '$0.79/M',
  },
  {
    id: 'claude-3-5-haiku',
    rank: 7,
    modelName: 'Claude 3.5 Haiku',
    provider: 'Anthropic',
    category: 'Lightweight',
    arenaElo: 1285,
    humanEval: 78.9,
    mmlu: 82.1,
    mathScore: 74.2,
    rankChange: 1,
    openWeights: false,
    contextWindow: '200K',
    inputCost: '$0.80/M',
    outputCost: '$4.00/M',
  },
  {
    id: 'qwen-2-5-coder-32b',
    rank: 8,
    modelName: 'Qwen 2.5 Coder 32B',
    provider: 'Alibaba',
    category: 'Coding',
    arenaElo: 1279,
    humanEval: 88.4,
    mmlu: 83.2,
    mathScore: 80.5,
    rankChange: 0,
    openWeights: true,
    contextWindow: '128K',
    inputCost: '$0.40/M',
    outputCost: '$0.80/M',
  },
]

export const USE_CASES_DATA: UseCaseDefinition[] = [
  {
    id: 'fullstack-dev',
    title: 'Full-Stack Software Architecture & Coding',
    industry: 'Engineering',
    difficulty: 'Expert',
    description:
      'Designing complex multi-file TypeScript/React/Node architectures, refactoring legacy components, and writing end-to-end Vitest & Playwright test suites.',
    keyFeatures: ['Superior HumanEval score', 'Context awareness > 128K', 'Strict JSON/TypeScript schema conformity'],
    temperature: 0.2,
    promptTip: 'Specify explicit file structure, type definitions, and test boundary requirements before asking for code.',
  },
  {
    id: 'deep-research',
    title: 'Deep Research & Financial Synthesis',
    industry: 'Research & Strategy',
    difficulty: 'Advanced',
    description:
      'Synthesizing dozens of SEC filings, market reports, and scientific papers with verified inline citations and counter-argument analysis.',
    keyFeatures: ['Chain-of-thought reasoning', 'Large context window (>200K)', 'High hallucination resistance'],
    temperature: 0.3,
    promptTip: 'Instruct the model to cite exact sources and actively outline contradictory evidence.',
  },
  {
    id: 'low-latency-agent',
    title: 'Real-Time Voice & Customer Agent Loop',
    industry: 'Customer Experience',
    difficulty: 'Intermediate',
    description:
      'Sub-500ms time-to-first-token execution loops with tool invocation for conversational CRM queries, scheduling, and live support routing.',
    keyFeatures: ['Time to first token < 300ms', 'High tool calling reliability', 'Ultra-low cost per turn'],
    temperature: 0.5,
    promptTip: 'Keep system prompt tightly bounded with single-turn tool execution instructions.',
  },
  {
    id: 'multimodal-doc-ocr',
    title: 'Multimodal Document & Diagram Extraction',
    industry: 'Operations',
    difficulty: 'Intermediate',
    description:
      'Extracting tables, flowcharts, receipts, and system diagrams from PDFs and high-res images into structured Postgres/JSON formats.',
    keyFeatures: ['High-res vision resolution', 'Spatial reasoning', 'Structured table parsing'],
    temperature: 0.1,
    promptTip: 'Ask the model to return data in a validated Zod JSON schema with zero explanatory markdown.',
  },
  {
    id: 'content-creative',
    title: 'Technical Writing, Release Notes & Marketing',
    industry: 'Product & Marketing',
    difficulty: 'Beginner',
    description:
      'Generating developer-friendly release notes, changelogs, customer newsletters, and engaging technical blog posts with tailored tone.',
    keyFeatures: ['Tone adaptability', 'High linguistic nuance', 'Fast creative brainstorming'],
    temperature: 0.7,
    promptTip: 'Provide examples of previous brand voice and specific target audience persona.',
  },
]

export function estimateModelBenchmarks(model: PublicModel): ModelBenchmarks {
  const name = model.displayName.toLowerCase()
  const hasReasoning = model.capabilities.reasoning
  const context = model.contextWindow

  // Calculate synthetic yet realistic metrics based on model capabilities & pricing
  let reasoning = hasReasoning ? 94 : 82
  let coding = 80
  let math = hasReasoning ? 92 : 78
  let language = 88
  let speed = 75
  let safety = 90

  if (name.includes('sonnet') || name.includes('3.7') || name.includes('3-7')) {
    reasoning = 97
    coding = 96
    math = 92
    language = 96
    speed = 82
    safety = 95
  } else if (name.includes('gpt-4o') || name.includes('omni')) {
    reasoning = 90
    coding = 91
    math = 86
    language = 94
    speed = 88
    safety = 92
  } else if (name.includes('o3') || name.includes('o1') || name.includes('r1')) {
    reasoning = 98
    coding = 94
    math = 97
    language = 90
    speed = 65
    safety = 91
  } else if (name.includes('flash') || name.includes('haiku') || name.includes('mini')) {
    reasoning = 84
    coding = 82
    math = 80
    language = 86
    speed = 98
    safety = 90
  } else if (name.includes('llama') || name.includes('deepseek')) {
    reasoning = 88
    coding = 89
    math = 85
    language = 87
    speed = 86
    safety = 86
  }

  const contextScore = Math.min(100, Math.round((context / 200_000) * 100))
  // Cost efficiency: higher score for lower prices
  const totalCost = (model.pricing.inputPerMTok + model.pricing.outputPerMTok) / 2
  const costEfficiency = totalCost <= 0 ? 100 : Math.max(10, Math.min(100, Math.round(100 - (totalCost / 20) * 80)))

  return {
    reasoning,
    coding,
    math,
    language,
    speed,
    safety,
    contextScore,
    costEfficiency,
  }
}
