module.exports = {
  apps: [
    {
      name: "soshell-admin",
      script: "node_modules/.bin/next",
      args: "start",
      cwd: "/var/www/admin",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        BACKEND_URL: "http://localhost:3001",
      },
    },
  ],
};
