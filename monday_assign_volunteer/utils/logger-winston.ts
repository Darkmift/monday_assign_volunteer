import winston, { transports, format, Logger } from 'winston';
const { combine, timestamp, printf } = format;

type Meta = { meta?: Record<string, unknown> };
type LoggerArgs = [message: string, meta?: Meta];

const myFormat = printf((info) => {
    const { timestamp, level, message } = info;
    return `${timestamp} [${level}]: ${message}\n${JSON.stringify(info, null, 2)}`;
});
const myErrorFormat = printf((info) => {
    const { timestamp, level, message, stack } = info;
    return `${timestamp} [${level}]: ${message} ${stack}\n${JSON.stringify(info, null, 2)}`;
});

const isNotProd = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';

// Logger instance for general logs
const winstonLoggerInstance: Logger = winston.createLogger({
    levels: winston.config.npm.levels,
    transports: isNotProd
        ? [
              new transports.File({
                  filename: 'logs/app.log',
                  level: 'info',
                  format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), myFormat),
              }),
          ]
        : [],
});

// Separate logger instance for error logs
const winstonErrorLoggerInstance: Logger = winston.createLogger({
    levels: winston.config.npm.levels,
    transports: isNotProd
        ? [
              new transports.File({
                  filename: 'logs/app.error.log',
                  level: 'error',
                  format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), myErrorFormat),
              }),
          ]
        : [],
});

const logger = {
    info: (message: string, meta?: unknown) => winstonLoggerInstance.info(message, meta),
    log: (message: string, meta?: unknown) => winstonLoggerInstance.info(message, meta),
    debug: (message: string, meta?: unknown) => winstonLoggerInstance.debug(message, meta),
    warn: (message: string, meta?: unknown) => winstonLoggerInstance.warn(message, meta),
    error: (message: string | Error, meta?: Error | Record<string, unknown>) => {
        if (message instanceof Error) {
            winstonErrorLoggerInstance.error(message.message, { ...meta, stack: message.stack });
        } else {
            winstonErrorLoggerInstance.error(message, meta);
        }
    },
};

// Export the logger
export default logger;
