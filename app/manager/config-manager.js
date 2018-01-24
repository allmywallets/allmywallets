import { createPatch } from 'rfc6902'

const getReplaceActionForPath = (path, value) => {
  switch (path) {
    case '/application/language':
      return {
        action: 'changeLanguage',
        value: { language: value }
      }
    default:
      return false
  }
}

export const findConfigChangeActions = (oldConfig, newConfig) => {
  const diffs = createPatch(oldConfig, newConfig)
  const actions = {}

  for (const diff in diffs) {
    switch (diffs[diff].op) {
      case 'replace':
        const action = getReplaceActionForPath(diffs[diff].path, diffs[diff].value, newConfig)

        if (!action) {
          return false
        }

        actions[action.action] = action.value
        break
      default:
        return false
    }
  }

  return actions
}
