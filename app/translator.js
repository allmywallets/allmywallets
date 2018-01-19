export const locale = () => {
  for (let language of navigator.languages) {
    if (Object.keys(available).includes(language)) {
      return language
    }
  }

  return 'en-US'
}

export const translations = require('./translations/translations.json')
export const available = require('./translations/available.json')
