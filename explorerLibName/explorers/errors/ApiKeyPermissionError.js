/**
 * ApiKeyPermissionError is thrown when the provided api key has not read
 * only permission. For security purpose, we do not accept api key with
 * trade and withdrawal permission.
 */
class ApiKeyPermissionError extends Error {
  constructor (...params) {
    super(...params)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiKeyPermissionError)
    }
  }
}

module.exports = ApiKeyPermissionError
