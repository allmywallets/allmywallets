/**
 * A browser notification is a notification which can be sent by the browser.
 */
export default class BrowserNotification {
  /**
   * Creates a new BrowserNotification
   *
   * @param {string} title
   * @param {object} options
   */
  constructor (title, options) {
    this._title = title
    this._options = options
  }

  get title () {
    return this._title
  }

  get options () {
    return this._options
  }
}
