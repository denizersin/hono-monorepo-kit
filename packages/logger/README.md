# @repo/logger

Shared logger package for the monorepo using Winston.

## Features

- 📝 Multiple log levels (error, warn, info, debug, db, audit)
- 📁 Separate log files for each level
- ⚙️ Configurable output (console and/or file)
- 🎯 TypeScript support
- 🔧 Easy to use across the monorepo

## Installation

This package is already part of the monorepo. To use it in your app/package:

1. Add to your `package.json` dependencies:

```json
{
  "dependencies": {
    "@repo/logger": "workspace:*"
  }
}
```

2. Run `pnpm install`

## Usage

### Basic Usage

```typescript
import logger from '@repo/logger'

logger.info('Server started on port 3000')
logger.error('Database connection failed', { error: 'Connection timeout' })
logger.warn('API rate limit approaching')
logger.debug('Processing request', { userId: 123 })
logger.db('Query executed', { query: 'SELECT * FROM users' })
logger.audit('User logged in', { userId: 456, ip: '192.168.1.1' })
```

### Custom Logger Configuration

```typescript
import { createAppLogger } from '@repo/logger'

const customLogger = createAppLogger({
  logDir: './my-custom-logs',
  enableConsole: true,
  enableFile: true
})

customLogger.info('Custom logger initialized')
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `logDir` | string | `'logs'` | Directory where log files will be stored |
| `enableConsole` | boolean | `true` | Enable console output |
| `enableFile` | boolean | `true` | Enable file output |

## Log Levels

The logger includes the following log levels (in order of priority):

1. **error** - Error messages that need immediate attention
2. **warn** - Warning messages for potential issues
3. **info** - General informational messages
4. **debug** - Detailed debugging information
5. **db** - Database-specific operations
6. **audit** - Audit trail for security and compliance

## Output

Logs are written to separate files based on their level:

- `logs/error.log` - Error messages
- `logs/warn.log` - Warning messages
- `logs/info.log` - Info and debug messages
- `logs/db.log` - Database operations
- `logs/audit.log` - Audit trail

All logs are formatted as JSON with timestamps for easy parsing and analysis.

## Development

```bash
# Build the package
pnpm build

# Watch mode for development
pnpm dev

# Type checking
pnpm type-check
```








