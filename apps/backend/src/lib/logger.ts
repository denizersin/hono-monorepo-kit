import { createLogger, format, transports } from 'winston'

// Define custom log levels
const customLevels = {
    error: 0,
    warn: 1, 
    info: 2,
    debug: 3,
    db: 4, // Custom level for database operations
    audit: 5 // Custom level for audit logs
}

// Create separate loggers for each level
const errorLogger = createLogger({
    levels: customLevels,
    level: 'error',
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'logs/error.log' })
    ]
})

const warnLogger = createLogger({
    levels: customLevels, 
    level: 'warn',
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'logs/warn.log' })
    ]
})

const infoLogger = createLogger({
    levels: customLevels,
    level: 'info', 
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'logs/info.log' })
    ]
})

const dbLogger = createLogger({
    levels: customLevels,
    level: 'db',
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'logs/db.log' })
    ]
})

const auditLogger = createLogger({
    levels: customLevels,
    level: 'audit',
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'logs/audit.log' })
    ]
})

// Combine loggers
const logger = {
    error: (msg: string, ...meta: any[]) => errorLogger.error(msg, meta),
    warn: (msg: string, ...meta: any[]) => warnLogger.warn(msg, meta),
    info: (msg: string, ...meta: any[]) => infoLogger.info(msg, meta),
    debug: (msg: string, ...meta: any[]) => infoLogger.debug(msg, meta),
    db: (msg: string, ...meta: any[]) => dbLogger.log('db', msg, meta),
    audit: (msg: string, ...meta: any[]) => auditLogger.log('audit', msg, meta)
}

// Example usage:
/*
logger.db('Connected to database');
logger.audit('User login attempt'); 
logger.info('Server started');
logger.error('Connection failed');
logger.warn('Deprecated function called');
logger.debug('Debug information');
*/

export default logger
