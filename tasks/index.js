const { task } = require("hardhat/config")

const TOKEN_LIST = {
	VIC: {
		erc20: "0xB1f66997A5760428D3a87D68b90BfE0aE64121cC",
		priceId: "0xf80ba6864e3f1b36c873bcb2767079d5fb86cf04855e714b2a0f30d7e0830a24",
		priceDecimals: 8,
		isStrictStable: false,
	},
	C98: {
		erc20: "0x0Fd0288AAAE91eaF935e2eC14b23486f86516c8C",
		priceId: "0x2dd14c7c38aa7066c7a508aac299ebcde5165b07d5d9f2d94dfbfe41f0bc5f2e",
		priceDecimals: 8,
		isStrictStable: false,
	},
	CUSD: {
		erc20: "0xb3008E7156Ae2312b49B5200C3E1C3e80E529feb",
		priceId: "0x8f218655050a1476b780185e89f19d2b1e1f49e9bd629efad6ac547a946bf6ab",
		priceDecimals: 8,
		isStrictStable: true,
	}
}

task("print", "Print list price feeds")
	.setAction(async ({ }, hre) => {
		const pythPriceUpdaterAddress = (await hre.deployments.get("PythPriceUpdater")).address
		const pythPriceUpdater = await hre.ethers.getContractAt('PythPriceUpdater', pythPriceUpdaterAddress)

		for (let token in TOKEN_LIST) {
			const priceFeedAddress = await pythPriceUpdater.priceFeeds(TOKEN_LIST[token].priceId)
			const priceFeed = await hre.ethers.getContractAt('PriceFeed', priceFeedAddress)
			console.log(`${token}PriceFeed deployed at ${priceFeedAddress}. Last price ${await priceFeed.latestAnswer()}, roundId ${await priceFeed.latestRound()}`)
		}
	})

task("deployPriceFeed", "Deploy price feeds")
	.setAction(async ({ }, hre) => {
		const pythPriceUpdaterAddress = (await hre.deployments.get("PythPriceUpdater")).address
		const pythPriceUpdater = await hre.ethers.getContractAt('PythPriceUpdater', pythPriceUpdaterAddress)

		for (let token in TOKEN_LIST) {
			const priceFeedAddress = await pythPriceUpdater.priceFeeds(TOKEN_LIST[token].priceId)
			if (priceFeedAddress != hre.ethers.constants.AddressZero) {
				console.log(`${token}PriceFeed deployed at ${priceFeedAddress}`)
				continue
			}
			const tx = await pythPriceUpdater.deployPriceFeed(TOKEN_LIST[token].erc20, TOKEN_LIST[token].priceId)
			console.log(`Deploy ${token}PriceFeed (tx: ${tx.hash})`)
		}
	})

task("setTokenConfig", "Set vault price feed token config")
	.setAction(async ({ }, hre) => {
		const pythPriceUpdaterAddress = (await hre.deployments.get("PythPriceUpdater")).address
		const pythPriceUpdater = await hre.ethers.getContractAt('PythPriceUpdater', pythPriceUpdaterAddress)
		const vaultPriceFeedAddress = (await hre.deployments.get("VaultPriceFeed")).address
		const vaultPriceFeed = await hre.ethers.getContractAt('VaultPriceFeed', vaultPriceFeedAddress)

		for (let token in TOKEN_LIST) {
			const tx = await vaultPriceFeed.setTokenConfig(
				TOKEN_LIST[token].erc20,
				await pythPriceUpdater.priceFeeds(TOKEN_LIST[token].priceId),
				TOKEN_LIST[token].priceDecimals,
				TOKEN_LIST[token].isStrictStable
			)
			console.log(`Set connfig ${token} (tx: ${tx.hash})`)
		}
	})
