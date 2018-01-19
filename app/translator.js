const requireLanguage = (language) => {
  try {
    return require(`./translations/messages.${language}.json`)
  } catch (e) {
    return {}
  }
}

export const locale = () => {
  for (let language of navigator.languages) {
    if (Object.keys(messages).includes(language)) {
      return language
    }
  }

  return 'en'
}

export const messages = {
  en: requireLanguage('en'),
  fr: requireLanguage('fr')
}
