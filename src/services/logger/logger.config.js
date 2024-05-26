import winston from 'winston';

const logLevels = {
    levels: {
        fatal: 0,
        error: 1,
        warn: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: 'red',
        error: 'red',
        warn: 'yellow',
        info: 'green',
        http: 'magenta',
        debug: 'white'
    }
};

winston.addColors(logLevels.colors);

const logFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.align(),
    winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
);

export const devLogger = winston.createLogger({
    levels: logLevels.levels,
    format: logFormat,
    transports: [
        new winston.transports.Console({ level: 'debug' })
    ]
});

export const prodLogger = winston.createLogger({
    levels: logLevels.levels,
    format: logFormat,
    transports: [
        new winston.transports.Console({ level: 'info' }),
        new winston.transports.File({ filename: './src/services/logger/errors.log', level: 'error' })
    ]
});