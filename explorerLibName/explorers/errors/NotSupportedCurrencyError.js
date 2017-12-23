class NotSupportedCurrencyError extends Error {
  constructor (...params) {
    super(...params)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotSupportedCurrencyError)
    }
  }
}

module.exports = NotSupportedCurrencyError
