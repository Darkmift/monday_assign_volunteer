import winston, { transports, transport, format, Logger } from 'winston';
const { combine, timestamp, printf } = format;

type ErrorArguments =
    | [message: string, meta?: Record<string, unknown>]
    | [error: Error, meta?: Record<string, unknown>];
type LoggerArgs = [message: string, meta?: Record<string, unknown>];

const myFormat = printf((info) => {
    if (info instanceof Error) {
        return `${info.timestamp} [${info.label}] ${info.level}: ${info.message} ${info.stack}`;
    }
    return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
});

const transportOptions: transport[] = [
    new transports.Console({
        level: 'debug',
        format: combine(timestamp(), winston.format.colorize(), winston.format.simple()),
    }),
];

const isNotProd = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';

if (isNotProd) {
    // File transport for 'info' and above levels (excluding 'error')
    transportOptions.push(
        new transports.File({
            filename: 'logs/app.log',
            level: 'info',
            format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), myFormat),
        }),
    );

    // Separate file transport for 'error' level
    transportOptions.push(
        new transports.File({
            filename: 'logs/app.error',
            level: 'error',
            format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), myFormat),
        }),
    );
}

// Create a Winston logger instance
const winstonLoggerInstance: Logger = winston.createLogger({
    levels: winston.config.npm.levels,
    transports: transportOptions,
});

const logger = {
    info: (...args: LoggerArgs) => winstonLoggerInstance.info(...args),
    log: (...args: LoggerArgs) => winstonLoggerInstance.info(...args),
    debug: (...args: LoggerArgs) => winstonLoggerInstance.debug(...args),
    warn: (...args: LoggerArgs) => winstonLoggerInstance.warn(...args),
    error: (message: string | Error, meta?: Record<string, unknown>): void => {
        if (message instanceof Error) {
            // Log the error message and stack trace, along with any additional metadata
            winstonLoggerInstance.error(message.message, { ...meta, stack: message.stack });
        } else {
            // Log the string message with any additional metadata
            winstonLoggerInstance.error(message, meta);
        }
    },
};

// Export the logger
export default logger;
