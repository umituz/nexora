import type { ReactNode } from 'react'
import { Braces, Brain, ChevronDown, Eye, Wrench } from 'lucide-react'
import { NativeSelect } from '@umituz/web-design-system'
import type { NativeSelectOption } from '@umituz/web-design-system'
import type { PublicModel } from '@shared/ai/contracts'
import { useT } from '@/i18n'

const CAP_BADGES = [
  { key: 'reasoning', icon: Brain, labelKey: 'chat.caps.reasoning' },
  { key: 'vision', icon: Eye, labelKey: 'chat.caps.vision' },
  { key: 'tools', icon: Wrench, labelKey: 'chat.caps.tools' },
  { key: 'structured', icon: Braces, labelKey: 'chat.caps.structured' },
] as const

interface ModelPickerProps {
  models: PublicModel[]
  value: string | null
  onChange: (modelId: string | null) => void
  disabled?: boolean
}

export function ModelPicker({ models, value, onChange, disabled }: ModelPickerProps): ReactNode {
  const t = useT()

  const chatModels = models.filter((model) => model.outputTypes.includes('text') && model.capabilities.streaming)
  const options: NativeSelectOption[] = chatModels.map((model) => ({
    value: model.id,
    label: model.displayName,
  }))

  const selected = chatModels.find((model) => model.id === value)
  const hint = selected
    ? `${selected.providerName} · ${Math.round(selected.contextWindow / 1024)}K ${t('chat.contextLabel')} · $${selected.pricing.inputPerMTok}/$${selected.pricing.outputPerMTok} per MTok`
    : null

  return (
    <div className="flex flex-col gap-1">
      <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <ChevronDown size={12} aria-hidden="true" />
        {t('chat.model')}
      </label>
      <NativeSelect
        options={options}
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value || null)}
        disabled={disabled || chatModels.length === 0}
        aria-label={t('chat.model')}
      />
      {hint && <span className="text-[11px] text-muted-foreground">{hint}</span>}
      {selected && (
        <div className="flex flex-wrap gap-1">
          {CAP_BADGES.filter((badge) => selected.capabilities[badge.key]).map((badge) => (
            <span
              key={badge.key}
              className="inline-flex items-center gap-1 rounded-full border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground"
            >
              <badge.icon size={10} aria-hidden="true" />
              {t(badge.labelKey)}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
