import type { ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import { NativeSelect } from '@umituz/web-design-system'
import type { NativeSelectOption } from '@umituz/web-design-system'
import type { PublicModel } from '@shared/ai/contracts'
import { useT } from '@/i18n'

interface ModelPickerProps {
  models: PublicModel[]
  value: string | null
  onChange: (modelId: string | null) => void
  disabled?: boolean
}

export function ModelPicker({ models, value, onChange, disabled }: ModelPickerProps): ReactNode {
  const t = useT()

  const options: NativeSelectOption[] = models.map((model) => ({
    value: model.id,
    label: model.displayName,
  }))

  const selected = models.find((model) => model.id === value)
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
        disabled={disabled || models.length === 0}
        aria-label={t('chat.model')}
      />
      {hint && <span className="text-[11px] text-muted-foreground">{hint}</span>}
    </div>
  )
}
