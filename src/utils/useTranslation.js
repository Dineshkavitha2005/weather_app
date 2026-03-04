import { useLanguage } from './LanguageContext'
import { translations } from './translations'

export const useTranslation = () => {
  const { currentLanguage } = useLanguage()

  const t = (key) => {
    const keys = key.split('.')
    let value = translations[currentLanguage] || translations.en

    for (const k of keys) {
      value = value?.[k]
    }

    return value || key
  }

  return { t, currentLanguage }
}
