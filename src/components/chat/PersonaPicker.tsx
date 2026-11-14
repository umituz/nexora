import type { ReactNode } from 'react'
import { Brain, Code2, DollarSign, Lightbulb, ShieldCheck } from 'lucide-react'
import { NativeSelect } from '@umituz/web-design-system'

export interface PersonaOption {
  id: string
  label: string
  shortLabel: string
  icon: typeof Lightbulb
  systemHint: string
}

export const PERSONAS: PersonaOption[] = [
  {
    id: 'general',
    label: '💡 General Assistant',
    shortLabel: 'General',
    icon: Lightbulb,
    systemHint: 'Provide concise, accurate, and direct responses.',
  },
  {
    id: 'architect',
    label: '🚀 Staff Software Architect',
    shortLabel: 'Architect',
    icon: Code2,
    systemHint:
      'Adopt the role of a Principal Software Architect. Emphasize modular clean architecture, strict TypeScript typing, edge-case resilience, and high-concurrency performance.',
  },
  {
    id: 'scientist',
    label: '🔬 AI Research Scientist',
    shortLabel: 'Researcher',
    icon: Brain,
    systemHint:
      'Adopt the role of an AI Research Scientist. Formulate answers with academic rigor, reference empirical benchmarks, and evaluate tradeoffs deeply.',
  },
  {
    id: 'security',
    label: '🛡️ Security & Zero-Trust Auditor',
    shortLabel: 'Security',
    icon: ShieldCheck,
    systemHint:
      'Adopt the role of a Principal Security Engineer. Scrutinize potential vulnerabilities, sanitization boundaries, authorization models, and compliance posture.',
  },
  {
    id: 'finance',
    label: '📊 Cost & SaaS Telemetry Analyst',
    shortLabel: 'FinOps',
    icon: DollarSign,
    systemHint:
      'Adopt the role of a Cloud FinOps Specialist. Prioritize token cost optimization, infrastructure ROI, caching efficiency, and throughput budgeting.',
  },
]

interface PersonaPickerProps {
  value: string
  onChange: (personaId: string) => void
  disabled?: boolean
}

export function PersonaPicker({ value, onChange, disabled }: PersonaPickerProps): ReactNode {
  return (
    <div className="flex items-center">
      <NativeSelect
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        options={PERSONAS.map((p) => ({ value: p.id, label: p.label }))}
        aria-label="AI Persona Selector"
        className="h-9 max-w-48 text-xs font-medium"
      />
    </div>
  )
}
