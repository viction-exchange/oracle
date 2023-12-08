const { task } = require("hardhat/config")

const TOKEN_LIST = {
	VIC: {
		erc20: "0xB1f66997A5760428D3a87D68b90BfE0aE64121cC",
		priceId: "0xf80ba6864e3f1b36c873bcb2767079d5fb86cf04855e714b2a0f30d7e0830a24"
	},
	C98: {
		erc20: "0x0Fd0288AAAE91eaF935e2eC14b23486f86516c8C",
		priceId: "0x2dd14c7c38aa7066c7a508aac299ebcde5165b07d5d9f2d94dfbfe41f0bc5f2e"
	},
}

task("print", "Print list price feeds")
	.setAction(async ({ }, hre) => {
		const updaterAddress = (await hre.deployments.get("PythPriceUpdater")).address
		const updater = await hre.ethers.getContractAt('PythPriceUpdater', updaterAddress)

		for (let token in TOKEN_LIST) {
			const priceFeedAddress = await updater.priceFeeds(TOKEN_LIST[token].priceId)
			const priceFeed = await hre.ethers.getContractAt('PriceFeed', priceFeedAddress)
			console.log(token, priceFeedAddress, await priceFeed.latestAnswer(), await priceFeed.latestRound())
		}
	})

task("deployVIC", "Deploy VIC price feed")
	.setAction(async ({ }, hre) => {
		const updaterAddress = (await hre.deployments.get("PythPriceUpdater")).address
		const updater = await hre.ethers.getContractAt('PythPriceUpdater', updaterAddress)
		await updater.deployPriceFeed(TOKEN_LIST.VIC.erc20, TOKEN_LIST.VIC.priceId)
	})

task("deployC98", "Deploy C98 price feed")
	.setAction(async ({ }, hre) => {
		const updaterAddress = (await hre.deployments.get("PythPriceUpdater")).address
		const updater = await hre.ethers.getContractAt('PythPriceUpdater', updaterAddress)
		await updater.deployPriceFeed(TOKEN_LIST.C98.erc20, TOKEN_LIST.C98.priceId)

	})
