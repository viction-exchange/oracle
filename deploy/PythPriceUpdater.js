module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()
  await deploy("PythPriceUpdater", {
    from: deployer,
    args: ["0xA2aa501b19aff244D90cc15a4Cf739D2725B5729"],
    log: true,
  })
}

module.exports.tags = ["PythPriceUpdater"]