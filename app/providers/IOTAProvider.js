import Balance from '../model/Balance'
import AbstractProvider from './AbstractProvider'

export default class IOTAProvider extends AbstractProvider {
  constructor (parameters) {
    super()

    this.node = parameters.node
    this.address = parameters.address
  }

  async getWalletData (currencies = []) {
    const headers = new Headers()
    headers.append('X-IOTA-API-Version', '1')

    // Todo: take currencies into account
    return fetch(this.node, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        addresses: [this.address],
        command: 'findAllBalances',
        threshold: 3
      })
    })
      .then(response => response.json())
      .then((data) => {
        const balance = new Balance('Iota', 'IOTA', parseFloat(data.balances[0]), new Date(), [])

        return [balance]
      })
  }

  static getSupportedParameters () {
    return [{
      type: 'input',
      inputType: 'text',
      label: 'IOTA address',
      model: 'address',
      required: true
    }, {
      type: 'select',
      label: 'Node',
      model: 'node',
      values: ['https://iota.thathost.net'],
      required: true
    }]
  }
}
