module.exports = {
  apps: [
    {
      name: "custom-activity-template",
      script: "app.js",
      instances: "max", // Use all available CPU cores
      exec_mode: "cluster", // Enable cluster mode
      env: {
        NODE_ENV: "development",
        PORT: 8080,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 8080,
      },
    },
  ],
};
