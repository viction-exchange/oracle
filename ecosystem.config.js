module.exports = {
  apps: [
    {
      name: "price-keeper-88",
      script: "src/PriceKeeper.js",
      instances: 1,
      autorestart: true,
      max_memory_restart: "1000M",
      watch: false,
      time: true,
      env: {
        RPC_URL: "https://rpc.viction.xyz",
        CHAIN_ID: 88,
      }
    },
    {
      name: "price-keeper-89",
      script: "src/UnsafePriceKeeper.js",
      instances: 1,
      autorestart: true,
      max_memory_restart: "1000M",
      watch: false,
      time: true,
      env: {
        RPC_URL: "https://rpc-testnet.viction.xyz",
        CHAIN_ID: 89,
      }
    }
  ]
};