module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()
  await deploy("UnsafePriceUpdater", {
    from: deployer,
    args: [],
    log: true,
  })
}

module.exports.skip = ({ getChainId }) =>
  new Promise(async (resolve, reject) => {
    try {
      const chainId = await getChainId()
      resolve(chainId === 88)
    } catch (error) {
      reject(error)
    }
  })

module.exports.tags = ["UnsafePriceUpdater"]