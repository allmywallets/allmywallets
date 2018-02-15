import langs from 'langs'

export const locale = () => {
  for (let language of navigator.languages) {
    if (Object.keys(translations).includes(language)) {
      return language
    }
  }

  return 'en-US'
}

export const getAvailableLanguages = () => {
  const languages = { 'en-US': 'English' }

  for (let language of Object.keys(translations)) {
    const lang = langs.where('1', language.split('-')[0])
    languages[language] = lang.local
  }

  return languages
}

export const translations = require('../../translations/translations.json')
