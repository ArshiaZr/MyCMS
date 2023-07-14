const winston = require("winston");
const { MongoDB } = require("winston-mongodb");

let DATABASE_URI =
  process.env.NODE_ENV !== "production"
    ? process.env.DB_STRING
    : process.env.DB_STRING_PROD;

const logger = winston.createLogger({
  format: winston.format.combine(winston.format.errors({ stack: true })),
  transports: [
    new winston.transports.Console({
      level: "silly",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
    new winston.transports.File({
      level: "info",
      filename: "logs/app.log",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
    new MongoDB({
      level: "info",
      db: DATABASE_URI,
      options: { useUnifiedTopology: true },
      collection: "logs",
      storeHost: true,
      format: winston.format.combine(
        winston.format.metadata(),
        winston.format.json()
      ),
    }),
  ],
});

module.exports = logger;
