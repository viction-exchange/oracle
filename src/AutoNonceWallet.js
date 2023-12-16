const ethers = require('ethers')

class AutoNonceWallet extends ethers.Wallet {
  AutoNonceWallet() {
    this._noncePromise = null
  }

  sendTransaction(transaction) {
    if (transaction.nonce == null) {
      if (this._noncePromise == null) {
        this._noncePromise = this.provider.getTransactionCount(this.address)
      }
      transaction.nonce = this._noncePromise
      this._noncePromise = this._noncePromise.then((nonce) => nonce + 1)
    }
    return super.sendTransaction(transaction)
  }
}

module.exports = { AutoNonceWallet }
