/**
 * NotSupportedCurrencyError is thrown when the currency selected
 * is not supported by the Explorer
 */
class NotSupportedCurrencyError extends Error {
  constructor (...parameters) {
    super(...parameters)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotSupportedCurrencyError)
    }
  }
}

module.exports = NotSupportedCurrencyError
