const PYTH_ADDRESSES = {
  88: "0xA2aa501b19aff244D90cc15a4Cf739D2725B5729",
  89: "0x5D289Ad1CE59fCC25b6892e7A303dfFf3a9f7167",
}

module.exports = async function ({ getNamedAccounts, deployments, getChainId }) {
  const { deploy } = deployments
  const chainId = await getChainId()

  const { deployer } = await getNamedAccounts()
  await deploy("PythPriceUpdater", {
    from: deployer,
    args: [PYTH_ADDRESSES[chainId]],
    log: true,
  })
}

module.exports.tags = ["PythPriceUpdater"]