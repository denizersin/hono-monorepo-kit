import { createLogger, format, transports } from 'winston'

// Define custom log levels
const customLevels = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
    db: 4, // Custom level for database operations
    audit: 5, // Custom level for audit logs,
    job: 6 // Custom level for job logs
} as const

export interface LoggerConfig {
    logDir?: string
    enableConsole?: boolean
    enableFile?: boolean
}

/**
 * Creates a logger instance with custom configuration
 * @param config - Logger configuration options
 * @returns Configured logger instance
 */
export function createAppLogger(config: LoggerConfig = {}) {
    const {
        logDir = 'logs',
        enableConsole = true,
        enableFile = true
    } = config

    // Create separate loggers for each level
    const errorLogger = createLogger({
        levels: customLevels,
        level: 'error',
        format: format.combine(
            format.timestamp(),
            format.json()
        ),
        transports: [
            ...(enableConsole ? [new transports.Console()] : []),
            ...(enableFile ? [new transports.File({ filename: `${logDir}/error.log` })] : [])
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
            ...(enableConsole ? [new transports.Console()] : []),
            ...(enableFile ? [new transports.File({ filename: `${logDir}/warn.log` })] : [])
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
            ...(enableConsole ? [new transports.Console()] : []),
            ...(enableFile ? [new transports.File({ filename: `${logDir}/info.log` })] : [])
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
            ...(enableConsole ? [new transports.Console()] : []),
            ...(enableFile ? [new transports.File({ filename: `${logDir}/db.log` })] : [])
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
            ...(enableConsole ? [new transports.Console()] : []),
            ...(enableFile ? [new transports.File({ filename: `${logDir}/audit.log` })] : [])
        ]
    })

    const jobLogger = createLogger({
        levels: customLevels,
        level: 'job',
        format: format.combine(
            format.timestamp(),
            format.json()
        ),
        transports: [
            ...(enableConsole ? [new transports.Console()] : []),
            ...(enableFile ? [new transports.File({ filename: `${logDir}/job.log` })] : [])
        ]
    })
    // Combine loggers
    return {
        error: (msg: string, ...meta: any[]) => errorLogger.error(msg, meta),
        warn: (msg: string, ...meta: any[]) => warnLogger.warn(msg, meta),
        info: (msg: string, ...meta: any[]) => infoLogger.info(msg, meta),
        debug: (msg: string, ...meta: any[]) => infoLogger.debug(msg, meta),
        db: (msg: string, ...meta: any[]) => dbLogger.log('db', msg, meta),
        audit: (msg: string, ...meta: any[]) => auditLogger.log('audit', msg, meta),
        job: (msg: string, ...meta: any[]) => jobLogger.log('job', msg, meta)
    }
}

// Default logger instance
const logger = createAppLogger()

export default logger

// Example usage:
/*
import logger from '@repo/logger'

logger.db('Connected to database');
logger.audit('User login attempt');
logger.info('Server started');
logger.error('Connection failed');
logger.warn('Deprecated function called');
logger.debug('Debug information');

// Or create a custom logger:
import { createAppLogger } from '@repo/logger'

const customLogger = createAppLogger({
    logDir: './custom-logs',
    enableConsole: true,
    enableFile: false
})
*/

