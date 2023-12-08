module.exports = {
  apps: [
    {
      name: "price-keeper",
      script: "src/PriceKeeper.js",
      instances: 1,
      autorestart: true,
      max_memory_restart: "1000M",
      watch: false,
      time: true,
      env: {}
    }
  ]
};