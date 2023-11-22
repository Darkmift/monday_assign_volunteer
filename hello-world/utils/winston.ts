import winston from 'winston';

// Create a Winston logger instance
const logger = winston.createLogger({
    // Define the log levels
    levels: winston.config.npm.levels,

    // Define the format of your logs
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
    ),

    // Define transports
    transports: [
        // Console transport
        new winston.transports.Console({
            level: 'debug', // Log only if info.level less than or equal to this level
            format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
        }),

        // File transport
        new winston.transports.File({
            filename: 'logs/app.log',
            level: 'info',
        }),
    ],
});

// Export the logger
export default logger;
