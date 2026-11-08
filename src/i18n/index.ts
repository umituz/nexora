import { setupI18n } from '@umituz/web-localization/setup'
import { useT } from '@umituz/web-localization/react'
import en from '@/locales/en'

export type Catalog = typeof en

export { useT }

export const i18n = setupI18n<'en'>({
  resources: { en: { translation: en } },
  fallbackLanguage: 'en',
  initialLanguage: 'en',
  detection: { order: ['navigator'], caches: [] },
})
