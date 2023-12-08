import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-solhint";
import "hardhat-deploy";
import "solidity-coverage";
import "./tasks"

import { HardhatUserConfig } from "hardhat/config";

const accounts = [process.env.DEPLOYER_KEY || ""];

const config: HardhatUserConfig = {
  namedAccounts: {
    deployer: { default: 0 },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  networks: {
    localhost: {
      chainId: 1337,
      url: 'http://127.0.0.1:7545',
      accounts,
      live: false,
      saveDeployments: true,
    },
    viction: {
      chainId: 88,
      url: "https://rpc.viction.xyz",
      accounts,
      live: true,
      saveDeployments: true,
    }
  },
  solidity: {
    compilers: [{
      version: '0.8.17',
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
        metadata: {
          bytecodeHash: 'none',
        },
      },
    }],
  },
};

export default config;
