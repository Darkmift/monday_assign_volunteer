import winston, { transport } from 'winston';

const transportOptions: transport[] = [
    // Console transport
    new winston.transports.Console({
        level: 'debug', // Log only if info.level less than or equal to this level
        format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    }),
];

const isNotProd = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';

if (isNotProd) {
    transportOptions.push(
        new winston.transports.File({
            filename: 'logs/app.log',
            level: 'info',
        }),
    );
}

// Create a Winston logger instance
const winstonLoggerInstance = winston.createLogger({
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
    transports: transportOptions,
});

const logger = {
    info: (...args: unknown[]): void => {
        console.info('info', ...args);
    },
    log: (...args: unknown[]): void => {
        console.log('log', ...args);
    },
    debug: (...args: unknown[]): void => {
        console.debug('debug', ...args);
    },
    warn: (...args: unknown[]): void => {
        console.warn('warn', ...args);
    },
    error: (...args: unknown[]): void => {
        console.debug('error', ...args);
    },
};

const prettyLog = (key: string, ...data: unknown[]) => JSON.stringify({ [key]: data }, null, 2);

if (isNotProd) {
    logger.info = (...args) => {
        winstonLoggerInstance.info(prettyLog('info', ...args));
    };
    logger.log = (...args) => {
        winstonLoggerInstance.info(prettyLog('log', ...args));
    };
    logger.debug = (...args) => {
        winstonLoggerInstance.debug('debug', prettyLog('debug', ...args));
    };
    logger.warn = (...args) => {
        winstonLoggerInstance.warn('warn', prettyLog('warn', ...args));
    };
    logger.error = (...args) => {
        winstonLoggerInstance.error('error', prettyLog('error', ...args));
    };
}

// Export the logger
export default logger;
