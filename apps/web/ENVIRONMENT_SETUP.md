# Environment Configuration for Next.js Web App

This Next.js application uses a centralized environment configuration system with Zod validation, similar to the backend implementation.

## Features

- 🔒 **Type-safe environment variables** with Zod validation
- 🌍 **Runtime environment detection** (development, production, client, server)
- ⚡ **Early validation** with helpful error messages
- 🔧 **Helper methods** for common environment checks
- 🛡️ **Client-safe variable access** (only NEXT_PUBLIC_ variables on client)

## Quick Setup

1. Create a `.env.local` file in the web app root:

```bash
# Required
NEXT_PUBLIC_API_URL=http://localhost:3002

# Optional
NEXT_PUBLIC_WS_URL=ws://localhost:3002
NEXT_PUBLIC_APP_NAME="My App"
NEXT_PUBLIC_APP_VERSION="1.0.0"
ANALYZE=false
```

2. The environment configuration is automatically validated on app startup.

## Usage

```typescript
import { env } from './env';

// Access environment variables
const apiUrl = env.NEXT_PUBLIC_API_URL;
const isDevMode = env.isDevelopment();

// Client-safe access (only NEXT_PUBLIC_ variables)
const clientEnv = env.getClientSafe();

// Validate API configuration
env.validateApiConfig();

// Runtime checks
if (env._runtime.IS_CLIENT) {
  // Client-side only code
}
```

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:3002` |

### Optional Variables

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `NEXT_PUBLIC_WS_URL` | WebSocket URL | - | `ws://localhost:3002` |
| `NEXT_PUBLIC_APP_NAME` | Application name | `"My App"` | `"My Hono App"` |
| `NEXT_PUBLIC_APP_VERSION` | App version | `"1.0.0"` | `"2.1.0"` |
| `ANALYZE` | Bundle analyzer | - | `"true"` |

### Runtime Variables

The `env._runtime` object provides computed environment information:

- `IS_DEV`: Development mode
- `IS_PROD`: Production mode  
- `IS_CLIENT`: Running on client
- `IS_SERVER`: Running on server
- `API_URL`: Resolved API URL
- `WS_URL`: Resolved WebSocket URL

## Error Handling

If environment validation fails, the app will:

1. Log detailed error messages
2. Show missing/invalid variables
3. Provide setup instructions in development
4. Exit the process to prevent broken deployments

## Integration

The environment configuration is automatically integrated with:

- **API Client**: Uses `env.NEXT_PUBLIC_API_URL` for backend communication
- **tRPC Provider**: Uses environment variables for API and logging configuration
- **Build Tools**: Supports bundle analyzer via `ANALYZE` variable

## Best Practices

1. **Never commit `.env.local`** - it contains sensitive values
2. **Restart dev server** after changing environment variables
3. **Use `NEXT_PUBLIC_` prefix** for client-accessible variables
4. **Validate early** - environment validation happens at startup
5. **Use helper methods** - `env.isDevelopment()` vs manual checks
