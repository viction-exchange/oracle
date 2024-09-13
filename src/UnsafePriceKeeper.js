const ethers = require('ethers')
const { EvmPriceServiceConnection } = require('./EvmPriceServiceConnection')
const { AutoNonceWallet } = require('./AutoNonceWallet')
const UnsafePriceUpdater = require('../deployments/victionTestnet/UnsafePriceUpdater.json')

const hermes = new EvmPriceServiceConnection('https://hermes.pyth.network')
const provider = new ethers.providers.JsonRpcProvider({
  url: process.env.RPC_URL,
  timeout: 10000,
})
let signer = new AutoNonceWallet(process.env.DEPLOYER_KEY, provider)
const updater = new ethers.Contract(UnsafePriceUpdater.address, UnsafePriceUpdater.abi, provider)

const priceIds = [
  '0xf80ba6864e3f1b36c873bcb2767079d5fb86cf04855e714b2a0f30d7e0830a24', // VIC
  '0x2dd14c7c38aa7066c7a508aac299ebcde5165b07d5d9f2d94dfbfe41f0bc5f2e', // C98
  '0x8f218655050a1476b780185e89f19d2b1e1f49e9bd629efad6ac547a946bf6ab', // CUSD
  '0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43', // WBTC
  '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace', // WETH
  '0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d', // WSOL
  '0x8963217838ab4cf5cadc172203c1f0b763fbaa45f346d8ee50ba994bbcac3026', // WTON
  '0x93da3352f9f1d105fdfe4971cfa80e9dd777bfc5d0f683ebb6e1294b92137bb7', // WAVAX
  '0x67aed5a24fdad045475e7195c98a98aea119c763f272d4523f5bac93a4f33c2b', // WTRX
  '0xdcef50dd0a4cd2dcc17e45df1676dcb336a11a61c69df7a0299b0150c672d25c', // DOGE
  '0x8ac0c70fff57e9aefdf5edf44b51d62c2d433653cbb2cf5cc06bb115af04d221', // LINK
  '0x78d185a741d07edb3412b09008b7c5cfb9bbbd7d568bf00ba737b456ba171501', // UNI
  '0x2b89b9dc8fdf9f34709a5b106b472f0f39bb6ca9ce04b0fd7f2e971688e2e53b', // USDT
]

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function run() {
  const priceFeeds = await hermes.getLatestPriceFeeds(priceIds)
  const prices = priceFeeds.map((feed) => feed.price.price)
  const tx = await updater.connect(signer).update(prices, priceIds)
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
    await sleep(10000)
  }
}

loop()
