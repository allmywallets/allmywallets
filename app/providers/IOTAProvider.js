import Balance from '../model/Balance'
import AbstractProvider from './AbstractProvider'

export default class IOTAProvider extends AbstractProvider {
  constructor (parameters) {
    super()

    this.node = parameters.node
    this.address = parameters.address
  }

  async getWalletData () {
    const headers = new Headers()
    headers.append('X-IOTA-API-Version', '1')

    return fetch(this.node, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        addresses: [this.address],
        command: 'getBalances',
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
