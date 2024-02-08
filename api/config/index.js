const { config } = require("dotenv");

config();

const ServerConfig = {
  EXPRESS_PORT: encodeURIComponent(process.env.EXPRESS_PORT),
  JWT_SECRET: encodeURIComponent(process.env.JWT_SECRET),
};

const DatabaseConfig = {
  DB_USER: encodeURIComponent(process.env.DB_USER),
  DB_PASSWORD: encodeURIComponent(process.env.DB_PASSWORD),
  DB_NAME: encodeURIComponent(process.env.DB_NAME),
  DB_PORT: encodeURIComponent(process.env.DB_PORT),
  DB_HOST: encodeURIComponent(process.env.DB_HOST),
};

module.exports = {
  ServerConfig,
  DatabaseConfig,
};
