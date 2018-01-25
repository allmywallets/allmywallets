import langs from 'langs'
import Configurator from './configurator'

export const locale = () => {
  for (let language of navigator.languages) {
    if (Object.keys(translations).includes(language)) {
      return language
    }
  }

  return 'en-US'
}

export const checkLocale = async () => {
  const config = await Configurator.getConfig()

  if (Object(config.application).hasOwnProperty('language')) {
    return config.application.language
  }

  return false
}

export const getAvailableLanguages = () => {
  const languages = { 'en-US': 'English' }

  for (let language of Object.keys(translations)) {
    const lang = langs.where('1', language.split('-')[0])
    languages[language] = lang.local
  }

  return languages
}

export const translations = require('./translations/translations.json')
