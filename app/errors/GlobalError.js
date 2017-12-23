export default class GlobalError extends Error {
  constructor (...params) {
    super(params)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GlobalError)
    }
  }
}
