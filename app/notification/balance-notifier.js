import BrowserNotification from '../model/BrowserNotification'
import { format } from '../helper/string'

export const getNotification = (diff, walletName) => {
  const title = 'You {action} {amount} {ticker}'
  const description = ' {direction} your wallet {walletName}.'

  const received = diff.amount > 0
  const replace = {
    action: received ? 'received' : 'sent',
    amount: Math.abs(diff.amount),
    ticker: diff.balance.ticker,
    direction: received ? 'to' : 'from',
    walletName: walletName
  }

  return new BrowserNotification(
    format(title, replace),
    {
      body: format(title, replace) + format(description, replace),
      requireInteraction: true
    }
  )
}
