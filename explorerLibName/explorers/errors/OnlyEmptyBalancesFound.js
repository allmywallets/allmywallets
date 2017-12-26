/**
 * OnlyEmptyBalancesFound is thrown when there is no balance greater than
 * zero for the Exchange requested account
 */
class OnlyEmptyBalancesFound extends Error {
  constructor (...params) {
    super(...params)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, OnlyEmptyBalancesFound)
    }
  }
}

module.exports = OnlyEmptyBalancesFound
