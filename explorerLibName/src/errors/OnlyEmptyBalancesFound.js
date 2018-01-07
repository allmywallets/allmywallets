/**
 * OnlyEmptyBalancesFound is thrown when there is no balance greater than
 * zero for the Exchange requested account
 */
class OnlyEmptyBalancesFound extends Error {
  constructor (...parameters) {
    super(...parameters)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, OnlyEmptyBalancesFound)
    }
  }
}

module.exports = OnlyEmptyBalancesFound
