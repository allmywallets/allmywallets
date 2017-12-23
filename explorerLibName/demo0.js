const Explorer = require('./explorers/BitcoinBlockExplorer0')
const explorer = new Explorer();

(async function () {
  const res = await explorer
      .address('15jdxjFhXUsp2xuycmKnjw8yk1WsVon69c')
      .currency('BTC')
      .fetch(['balances', 'transactions'])
      .exec()

  console.log(res)
}()).catch(console.log)
