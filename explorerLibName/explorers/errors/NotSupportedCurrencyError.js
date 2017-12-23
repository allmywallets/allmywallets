/**
 * NotSupportedCurrencyError is thrown when the currency selected
 * is not supported by the Explorer
 */
class NotSupportedCurrencyError extends Error {
  constructor (...params) {
    super(...params)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotSupportedCurrencyError)
    }
  }
}

module.exports = NotSupportedCurrencyError
