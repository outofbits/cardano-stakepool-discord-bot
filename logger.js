const path = require('path');
const winston = require('winston');

const logDirectory = process.env.LOG_DIR ? process.env.LOG_DIR : path.join('./', 'log');

const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({filename: path.join(logDirectory, 'error.log'), level: 'error'}),
        new winston.transports.File({filename: path.join(logDirectory, 'combined.log')})
    ]
});

/**
 * If we're not in production then log to the `console` with the format:
 * `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
 */
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
    logger.level = 'info';
}

module.exports = logger;