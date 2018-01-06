import BrowserNotification from '../model/BrowserNotification'
import { format } from '../helpers/string'

export const shouldNotify = (oldBalance, newBalance) => {
  return oldBalance !== undefined && newBalance !== undefined && oldBalance.amount !== newBalance.amount
}

export const getNotification = (oldBalance, newBalance, walletName) => {
  const title = 'You {action} {amount} {ticker}'
  const description = ' {direction} your wallet {walletName}.'

  const received = oldBalance.amount < newBalance.amount
  const replace = {
    action: received ? 'received' : 'sent',
    amount: Math.abs(oldBalance.amount - newBalance.amount),
    ticker: newBalance.ticker,
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
