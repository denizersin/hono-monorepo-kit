# @repo/config

Merkezi environment configuration paketi. Tüm uygulamalar ve paketler env değişkenlerini bu paket üzerinden yükler ve validate eder.

## Package → Env Bağımlılıkları

### apps/backend

| Env Variable | Zorunlu | Default | Açıklama |
|-------------|---------|---------|----------|
| `NODE_ENV` | ✅ | `development` | Node environment |
| `PORT` | ❌ | `3002` | Server port |
| `DATABASE_URL` | ✅ | - | PostgreSQL connection URL |
| `DATABASE_NAME` | ✅ | - | PostgreSQL database name |
| `WEB_URL` | ✅ | - | CORS için web URL |
| `JWT_SECRET` | ✅ | - | JWT signing secret |
| `ADMIN_EMAIL` | ✅ | - | Initial admin email |
| `ADMIN_PASSWORD` | ✅ | - | Initial admin password |
| `WP_CLIENT_API_KEY` | ✅ | - | WordPress API key |
| `WP_CLIENT_URL` | ✅ | - | WordPress client URL |
| `BULL_BOARD_BASE_PATH` | ✅ | - | Bull Board UI path |
| `REDIS_HOST` | ✅ | - | Redis host |
| `REDIS_PORT` | ✅ | - | Redis port |
| `REDIS_PASSWORD` | ✅ | - | Redis password |
| `REDIS_DB` | ✅ | - | Redis database |

**Computed Values:**
- `IS_DEV` - boolean (NODE_ENV === 'development')
- `IS_PROD` - boolean (NODE_ENV === 'production')

---

### packages/jobs (Workers)

Workers hem Redis (queue) hem Database (processor) kullanır.

| Env Variable | Zorunlu | Default | Açıklama |
|-------------|---------|---------|----------|
| `NODE_ENV` | ✅ | `development` | Node environment |
| `DATABASE_URL` | ✅ | - | PostgreSQL connection URL |
| `REDIS_HOST` | ❌ | `localhost` | Redis host |
| `REDIS_PORT` | ❌ | `6379` | Redis port |
| `REDIS_PASSWORD` | ❌ | - | Redis password |
| `REDIS_DB` | ❌ | `0` | Redis database |

**Computed Values:**
- `IS_DEV` - boolean
- `IS_PROD` - boolean
- `REDIS_URL` - Built Redis URL from components

---

### apps/web (Next.js)

| Env Variable | Zorunlu | Default | Açıklama |
|-------------|---------|---------|----------|
| `NODE_ENV` | ✅ | `development` | Node environment |
| `NEXT_PUBLIC_API_URL` | ✅ | - | Backend API URL |
| `NEXT_PUBLIC_WS_URL` | ❌ | - | WebSocket URL |

**Computed Values:**
- `IS_DEV` - boolean
- `IS_PROD` - boolean

---

### apps/mobile (Expo)

| Env Variable | Zorunlu | Default | Açıklama |
|-------------|---------|---------|----------|
| `NODE_ENV` | ✅ | `development` | Node environment |
| `API_URL` | ✅ | - | Backend API URL |
| `WS_URL` | ✅ | - | WebSocket URL |

**Computed Values:**
- `IS_DEV` - boolean
- `IS_PROD` - boolean

---

## Kullanım

### Backend
```typescript
// apps/backend/src/env.ts
import { validateBackendEnv } from "@repo/config/backend";
import { initializeDb } from "@repo/db";
import { initializeJobs } from "@repo/jobs";

export const ENV = validateBackendEnv();

// Database init
initializeDb({
  connectionString: ENV.DATABASE_URL,
  ssl: ENV.IS_DEV ? false : { rejectUnauthorized: false },
});

// Jobs init (Redis only - db already initialized)
initializeJobs({
  redis: {
    host: ENV.REDIS_HOST,
    port: parseInt(ENV.REDIS_PORT, 10),
    password: ENV.REDIS_PASSWORD || undefined,
    db: parseInt(ENV.REDIS_DB, 10),
  },
});
```

### Standalone Worker (Redis + DB birlikte init)
```typescript
// packages/jobs/src/start.ts
import { validateJobsEnv } from "@repo/config/jobs";
import { initializeJobs } from "./config/redis.config";

const env = validateJobsEnv();

// Redis + Database birlikte init
initializeJobs({
  redis: {
    host: env.REDIS_HOST,
    port: parseInt(env.REDIS_PORT, 10),
    password: env.REDIS_PASSWORD,
    db: parseInt(env.REDIS_DB, 10),
  },
  database: {
    connectionString: env.DATABASE_URL,
    ssl: env.IS_DEV ? false : { rejectUnauthorized: false },
  },
});
```

### Web (Next.js)
```typescript
// apps/web/lib/env.ts
import { validateWebEnv } from "@repo/config/web";

export const ENV = validateWebEnv({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL,
});
```

### Mobile (Expo)
```typescript
// apps/mobile/lib/env.ts
import { validateMobileEnv } from "@repo/config/mobile";

export const ENV = validateMobileEnv();
```

---

## Jobs Initialization Pattern

```
┌─────────────────────────────────────────────────────────┐
│                    apps/backend                          │
│  ┌──────────────┐     ┌──────────────────────────────┐  │
│  │ initializeDb │     │ initializeJobs({ redis })    │  │
│  │  (separate)  │     │ (database already init)      │  │
│  └──────────────┘     └──────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│               Standalone Worker                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │ initializeJobs({ redis, database })              │   │
│  │ (both initialized together)                       │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```
