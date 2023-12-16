const ethers = require('ethers')
const { EvmPriceServiceConnection } = require('./EvmPriceServiceConnection')
const { AutoNonceWallet } = require('./AutoNonceWallet')
const PythPriceUpdater = require('../deployments/viction/PythPriceUpdater.json')

const hermes = new EvmPriceServiceConnection('https://hermes.pyth.network')
const provider = new ethers.providers.JsonRpcProvider(
  {
    url: 'https://rpc.viction.xyz',
    timeout: 10000,
  },
  88
)
let signer = new AutoNonceWallet(process.env.DEPLOYER_KEY, provider)
const updater = new ethers.Contract(PythPriceUpdater.address, PythPriceUpdater.abi, provider)

const priceIds = [
  '0xf80ba6864e3f1b36c873bcb2767079d5fb86cf04855e714b2a0f30d7e0830a24', // VIC
  '0x2dd14c7c38aa7066c7a508aac299ebcde5165b07d5d9f2d94dfbfe41f0bc5f2e', // C98
  '0x2b89b9dc8fdf9f34709a5b106b472f0f39bb6ca9ce04b0fd7f2e971688e2e53b', // USDT
]

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function run() {
  const priceFeeds = await hermes.getLatestPriceFeeds(priceIds)
  const priceFeedUpdateData = await hermes.getPriceFeedsUpdateData(priceIds)
  const tx = await updater.connect(signer).update(priceFeedUpdateData, priceIds)
  console.log(tx.hash, JSON.stringify(priceFeeds))
  await tx.wait()
}

async function loop() {
  while (true) {
    try {
      await run()
    } catch (err) {
      console.error('Error', err)
      signer = new AutoNonceWallet(process.env.DEPLOYER_KEY, provider)
    }
    await sleep(3000)
  }
}

loop()
