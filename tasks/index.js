const { task } = require("hardhat/config")

const sleep = ms => new Promise(r => setTimeout(r, ms));

const TOKEN_LIST = {
	VIC: {
		erc20: {
			88: "0xB1f66997A5760428D3a87D68b90BfE0aE64121cC",
			89: "0x0629BC4415560a4994bF3e77dfc9075799f60bE5"
		},
		priceId: "0xf80ba6864e3f1b36c873bcb2767079d5fb86cf04855e714b2a0f30d7e0830a24",
		priceDecimals: 8,
		isStrictStable: false,
	},
	C98: {
		erc20: {
			88: "0x0Fd0288AAAE91eaF935e2eC14b23486f86516c8C",
			89: "0xeE63687645ce6aaE47e6D20Db2b9FD089D2bdf4c"
		},
		priceId: "0x2dd14c7c38aa7066c7a508aac299ebcde5165b07d5d9f2d94dfbfe41f0bc5f2e",
		priceDecimals: 8,
		isStrictStable: false,
	},
	CUSD: {
		erc20: {
			88: "0xb3008E7156Ae2312b49B5200C3E1C3e80E529feb",
			89: "0xE2d9d45921BCfCCf0894B1D532b3F6Afe591F748"
		},
		priceId: "0x8f218655050a1476b780185e89f19d2b1e1f49e9bd629efad6ac547a946bf6ab",
		priceDecimals: 8,
		isStrictStable: true,
	},
	WBTC: {
		erc20: {
			89: "0xc0CF9cE564b2E5BE343296BfeC4f0Be1092bc4Ed"
		},
		priceId: "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43",
		priceDecimals: 8,
		isStrictStable: false,
	},
	WETH: {
		erc20: {
			89: "0x396Cfc29BAD6A23706a95C11B468C5b8e3891DE2"
		},
		priceId: "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace",
		priceDecimals: 8,
		isStrictStable: false,
	},
	WSOL: {
		erc20: {
			89: "0x380Be1F14ad2d8cC6DC86d56f3478296a5285DC9"
		},
		priceId: "0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d",
		priceDecimals: 8,
		isStrictStable: false,
	},
	WTON: {
		erc20: {
			89: "0x1C1c4C7Fb72998186339a82E5085f63d9309388f"
		},
		priceId: "0x8963217838ab4cf5cadc172203c1f0b763fbaa45f346d8ee50ba994bbcac3026",
		priceDecimals: 8,
		isStrictStable: false,
	},
	WAVAX: {
		erc20: {
			89: "0xA5a08a32a0028939CF7DB25322c287291d3C43dD"
		},
		priceId: "0x93da3352f9f1d105fdfe4971cfa80e9dd777bfc5d0f683ebb6e1294b92137bb7",
		priceDecimals: 8,
		isStrictStable: false,
	},
	WTRX: {
		erc20: {
			89: "0xBA30D14a8Fb2D2e3F63Ea98bf53F0BD464245E7e"
		},
		priceId: "0x67aed5a24fdad045475e7195c98a98aea119c763f272d4523f5bac93a4f33c2b",
		priceDecimals: 8,
		isStrictStable: false,
	},
	DOGE: {
		erc20: {
			89: "0xf433acc8B6E969553154c8859D4EBaC7F31E4C33"
		},
		priceId: "0xdcef50dd0a4cd2dcc17e45df1676dcb336a11a61c69df7a0299b0150c672d25c",
		priceDecimals: 8,
		isStrictStable: false,
	},
	LINK: {
		erc20: {
			89: "0xde9F092Bce3a3c5B46fB49F82484271fC38E308E"
		},
		priceId: "0x8ac0c70fff57e9aefdf5edf44b51d62c2d433653cbb2cf5cc06bb115af04d221",
		priceDecimals: 8,
		isStrictStable: false,
	},
	UNI: {
		erc20: {
			89: "0xD00fE2a927fC02Cdeb0E7d3912b6C0D0044Ab2ac"
		},
		priceId: "0x78d185a741d07edb3412b09008b7c5cfb9bbbd7d568bf00ba737b456ba171501",
		priceDecimals: 8,
		isStrictStable: false,
	},
	USDT: {
		erc20: {
			89: "0xfFC52ACb0da9d740333BD65e3cB58Abe790a4F2d"
		},
		priceId: "0x2b89b9dc8fdf9f34709a5b106b472f0f39bb6ca9ce04b0fd7f2e971688e2e53b",
		priceDecimals: 8,
		isStrictStable: true,
	}
}

task("print", "Print list price feeds")
	.setAction(async ({ }, hre) => {
		const chainId = hre.network.config.chainId
		const priceUpdaterName = chainId == 88 ? "PythPriceUpdater" : "UnsafePriceUpdater"
		const priceUpdaterAddress = (await hre.deployments.get(priceUpdaterName)).address
		const priceUpdater = await hre.ethers.getContractAt(priceUpdaterName, priceUpdaterAddress)

		for (let token in TOKEN_LIST) {
			if (!TOKEN_LIST[token].erc20[chainId]) continue;
			const priceFeedAddress = await priceUpdater.priceFeeds(TOKEN_LIST[token].priceId)
			const priceFeed = await hre.ethers.getContractAt('PriceFeed', priceFeedAddress)
			console.log(`${token}PriceFeed deployed at ${priceFeedAddress}. Last price ${await priceFeed.latestAnswer()}, roundId ${await priceFeed.latestRound()}`)
		}
	})

task("deployPriceFeed", "Deploy price feeds")
	.setAction(async ({ }, hre) => {
		const chainId = hre.network.config.chainId
		const priceUpdaterName = chainId == 88 ? "PythPriceUpdater" : "UnsafePriceUpdater"
		const priceUpdaterAddress = (await hre.deployments.get(priceUpdaterName)).address
		const priceUpdater = await hre.ethers.getContractAt(priceUpdaterName, priceUpdaterAddress)

		for (let token in TOKEN_LIST) {
			if (!TOKEN_LIST[token].erc20[chainId]) continue;
			const priceFeedAddress = await priceUpdater.priceFeeds(TOKEN_LIST[token].priceId)
			if (priceFeedAddress != hre.ethers.constants.AddressZero) {
				console.log(`${token}PriceFeed deployed at ${priceFeedAddress}`)
				continue
			}
			const tx = await priceUpdater.deployPriceFeed(TOKEN_LIST[token].erc20[chainId], TOKEN_LIST[token].priceId)
			console.log(`Deploy ${token}PriceFeed (tx: ${tx.hash})`)
			await sleep(5000)
		}
	})

task("setTokenConfig", "Set vault price feed token config")
	.setAction(async ({ }, hre) => {
		const chainId = hre.network.config.chainId
		const priceUpdaterName = chainId == 88 ? "PythPriceUpdater" : "UnsafePriceUpdater"
		const priceUpdaterAddress = (await hre.deployments.get(priceUpdaterName)).address
		const priceUpdater = await hre.ethers.getContractAt(priceUpdaterName, priceUpdaterAddress)
		const vaultPriceFeedAddress = (await hre.deployments.get("VaultPriceFeed")).address
		const vaultPriceFeed = await hre.ethers.getContractAt('VaultPriceFeed', vaultPriceFeedAddress)

		for (let token in TOKEN_LIST) {
			if (!TOKEN_LIST[token].erc20[chainId]) continue;
			const tx = await vaultPriceFeed.setTokenConfig(
				TOKEN_LIST[token].erc20[chainId],
				await priceUpdater.priceFeeds(TOKEN_LIST[token].priceId),
				TOKEN_LIST[token].priceDecimals,
				TOKEN_LIST[token].isStrictStable
			)
			console.log(`Set config ${token} (tx: ${tx.hash})`)
			await sleep(5000)
		}
	})
