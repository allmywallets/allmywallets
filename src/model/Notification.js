/**
 * A notification is a temporary message sent to the user.
 */
export default class Notification {
  /**
   * Creates a new Notification
   *
   * @param {string} level ('INFO', 'ERROR')
   * @param {string} title
   * @param {string} content
   * @param {Date} date
   */
  constructor (level, title, content, date) {
    this._level = level
    this._title = title
    this._content = content
    this._date = date
  }

  get level () {
    return this._level
  }

  get title () {
    return this._title
  }

  get content () {
    return this._content
  }

  get date () {
    return this._date
  }

  set walletId (walletId) {
    this._walletId = walletId
  }

  get walletId () {
    return this._walletId
  }

  static fromObject (object) {
    const notification = new Notification(
      object._level,
      object._title,
      object._content,
      object._date
    )

    notification.walletId = object._walletId

    return notification
  }
}
