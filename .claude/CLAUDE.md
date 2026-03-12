# My Mono Repo - Claude Code Guidelines

## Proje Genel Bakış

Turborepo tabanlı full-stack monorepo. Bun package manager kullanılır.

**Uygulamalar:**
- `apps/backend` - Hono + tRPC API server (Port: 3002)
- `apps/web` - Next.js 16 web uygulaması (Port: 3000)
- `apps/mobile` - React Native Expo mobil uygulama

**Shared Paketler:**
- `packages/shared` - Types, schemas, validators, enums
- `packages/db` - Drizzle ORM + PostgreSQL
- `packages/config` - Environment configuration
- `packages/jobs` - Bull job queue (Redis)
- `packages/logger` - Winston logging
- `packages/email` - Email service

---

## Teknoloji Stack

| Katman | Teknoloji |
|--------|-----------|
| Runtime | Node.js 20, Bun 1.1.42 |
| Backend | Hono, tRPC 11, Drizzle ORM |
| Database | PostgreSQL 16 (port 5433) |
| Cache | Redis 7 (port 6379) |
| Frontend | Next.js 16, React 19, Tailwind CSS 4 |
| Mobile | Expo 54, React Native |
| Validation | Zod |
| Build | Turborepo |

---

## Geliştirme Komutları

```bash
# Tüm uygulamaları başlat
bun dev

# Sadece mobile hariç
bun dev-mobile

# Build
bun build

# Type check
bun check-types

# Lint
bun lint

# Database
bun db:generate    # Migration oluştur
bun db:migrate     # Migration uygula
bun db:studio      # Drizzle Studio aç
```

---

## Dosya Konumları

### Schema & Types
```
packages/shared/dto/schema/[entity].ts     → Drizzle table + types
packages/shared/dto/validators/[entity]/   → Zod validators
packages/shared/enums/index.ts             → Tüm enum tanımları
packages/shared/types/index.ts             → Global type definitions
```

### Backend
```
apps/backend/src/trpc/routers/[entity].ts  → tRPC router
apps/backend/src/modules/infrastructure/repositories/[entity]/  → Repository
apps/backend/src/modules/domain/services/  → Business logic
```

### Frontend
```
apps/web/app/                              → Next.js App Router
apps/web/components/                       → React components
apps/web/hooks/                            → Custom hooks
apps/web/lib/                              → Utilities
```

---

## Type Kullanım Kuralları

### Backend'den gelen veri için type
```typescript
// packages/shared/dto/schema/[entity].ts dosyasından import et
import { TSchemaCharacter } from '@repo/shared/schema'

// Kullanım
type Character = TSchemaCharacter.TCharacter
type CharacterWithRelations = TSchemaCharacter.TCharacterWithRelations
```

### Form validation için
```typescript
// packages/shared/dto/validators/[entity]/index.ts dosyasından import et
import { characterValidator, TCharacterValidator } from '@repo/shared/validators'

// Kullanım
type CreateData = TCharacterValidator.TCreateCharacter
```

---

## Enum Sistemi

### Enum Türleri

| Tür | Açıklama | Örnek | Key Type |
|-----|----------|-------|----------|
| `NumericEnum` | String → Number mapping | `ROLE_MAP: { ADMIN: 2 }` | `TRole` |
| `StringEnum` | String → String (self) mapping | `CURRENCY_KEY: { USD: "USD" }` | `TCurrency` |

##Enum key type'lari da bu dosyada bulunur (packages/shared/enums/index.ts)
export type TRole = keyof typeof ROLE_KEY

### Enum Kullanımı
```typescript
import { SahredEnums } from '@repo/shared/enums'

// ID al
const adminId = SahredEnums.getMapId(SahredEnums.ROLE_MAP, 'ADMIN') // 2

// Key al
const role = SahredEnums.getMapKey(SahredEnums.ROLE_MAP, 2) // 'ADMIN'

// Zod enum için
z.enum(SahredEnums.getRecordKeysForZod(SahredEnums.CURRENCY_KEY))
z.enum(SahredEnums.getMapKeysForZod(SahredEnums.ROLE_MAP))

// Frontend select data
SahredEnums.SelectData.roles  // [{ label, value }]
```

### Mevcut Enumlar
- `ROLE_MAP/KEY` - User roles
- `LANGUAGE_MAP/KEY` - Dil seçenekleri
- `THEME_MAP/KEY` - Tema (light/dark)
- `SUBSCRIPTION_STATUS_MAP/KEY` - Abonelik durumu
- `CURRENCY_KEY` - Para birimi
- `PLAN_INTERVAL_KEY` - Plan periyodu
- `DISCOUNT_TYPE_KEY` - İndirim tipi
- `COUPON_DURATION_TYPE_KEY` - Kupon süresi
- `CAMPAIGN_TARGET_TYPE_KEY` - Kampanya hedefi



---

## Entity Oluşturma Akışı

### 1. Schema Tanımı
`packages/shared/dto/schema/[entity].ts`

```typescript
import { pgTable, integer, varchar } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { getDefaultTableFieldsWithDeletedAt } from './helpers'

// Table
export const tblEntity = pgTable('entity', {
    id: integer().primaryKey().generatedByDefaultAsIdentity(),
    type: varchar({ length: 255 }).notNull().$type<TEnumEntityType>(), //enum
    // ... fields
    ...getDefaultTableFieldsWithDeletedAt()
})

// Relations
export const tblEntityRelation = relations(tblEntity, ({ one, many }) => ({
    // relations
}))

// Types
export type TEntity = typeof tblEntity.$inferSelect
export type TEntityInsert = typeof tblEntity.$inferInsert

// Namespace
export namespace TSchemaEntity {
    export type TEntity = typeof tblEntity.$inferSelect
    export type TEntityInsert = typeof tblEntity.$inferInsert

    export namespace TEntityRepository {
        export type TCreate = { entityData: TEntityInsert }
        export type TUpdate = { id: number, data: { entityData: Partial<TEntityInsert> } }
    }

    export type TEntityWithRelations = ReturnTypeOfQuery<typeof getEntityQuery>
}
```

### 2. Validator Tanımı
`packages/shared/dto/validators/[entity]/index.ts`

```typescript
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'
import { SahredEnums } from '#/enums/index'
import { tblEntity } from '#/dto/schema/entity'
import { defaultOmitFieldsSchema } from '../base'

// Base schema - enum override ZORUNLU!
const entityBaseInsertSchema = createInsertSchema(tblEntity, {
    type: z.enum(SahredEnums.getRecordKeysForZod(SahredEnums.ENTITY_TYPE_KEY)),
}).omit(defaultOmitFieldsSchema)

// CRUD schemas
const createEntitySchema = z.object({
    entityData: entityBaseInsertSchema,
})

const updateEntitySchema = z.object({
    id: z.number(),
    data: z.object({
        entityData: entityBaseInsertSchema.partial(),
    }),
})

export const entityValidator = {
    createEntitySchema,
    updateEntitySchema,
}

export namespace TEntityValidator {
    export type TCreateEntity = z.infer<typeof createEntitySchema>
    export type TUpdateEntity = z.infer<typeof updateEntitySchema>
}
```

### 3. Repository Implementasyonu
`apps/backend/src/modules/infrastructure/repositories/[entity]/EntityRepositoryImpl.ts`

```typescript
import { db } from '@repo/db'
import { tblEntity } from '@repo/shared/schema'
import { eq, isNull } from 'drizzle-orm'

export class EntityRepositoryImpl {
    async getById(id: number) {
        return db.query.tblEntity.findFirst({
            where: eq(tblEntity.id, id),
            with: { /* relations */ }
        })
    }

    async create(data: TEntityInsert) {
        const [entity] = await db.insert(tblEntity).values(data).returning()
        return entity
    }

    async update(id: number, data: Partial<TEntityInsert>) {
        await db.update(tblEntity).set(data).where(eq(tblEntity.id, id))
    }

    async delete(id: number) {
        await db.update(tblEntity)
            .set({ deletedAt: new Date() })
            .where(eq(tblEntity.id, id))
    }
}
```

### 4. tRPC Router
`apps/backend/src/trpc/routers/[entity].ts`

```typescript
import { createTRPCRouter, protectedProcedure } from '../init'
import { roleMiddleware } from '../middlewares/role'
import { entityValidator } from '@repo/shared/validators'
import { SahredEnums } from '@repo/shared/enums'

export const entityRouter = createTRPCRouter({
    create: protectedProcedure
        .use(roleMiddleware([SahredEnums.ROLE_MAP.ADMIN]))
        .input(entityValidator.createEntitySchema)
        .mutation(async ({ input, ctx }) => {
            return ctx.entityRepository.create(input.entityData)
        }),
})
```

---

## Translation Desteği

Translation içeren entity'ler için:

### Schema
```typescript
export const tblEntityTranslation = pgTable('entity_translation', {
    id: integer().primaryKey().generatedByDefaultAsIdentity(),
    entityId: integer().notNull(),
    languageId: integer().notNull(),
    name: varchar({ length: 255 }).notNull(),
    ...getDefaultTableFieldsWithDeletedAt()
}, (table) => ({
    unique_entity_language: uniqueIndex().on(table.entityId, table.languageId),
    fk_entity: foreignKey({
        columns: [table.entityId],
        foreignColumns: [tblEntity.id],
        name: 'fk_entity_trans_entity',  // max 64 karakter!
    }).onDelete('cascade'),
}))
```

### Validator
```typescript
// entityId omit edilir - repository'de set edilecek
const translationSchema = createInsertSchema(tblEntityTranslation)
    .omit({ ...defaultOmitFieldsSchema, entityId: true })

const createWithTranslationSchema = z.object({
    entityData: entityBaseInsertSchema,
    translations: z.array(translationSchema),
})
```

### Repository
```typescript
async createWithTranslations(data: TCreateWithTranslation) {
    const [entity] = await db.insert(tblEntity).values(data.entityData).returning()

    for (const translation of data.translations) {
        await db.insert(tblEntityTranslation).values({
            ...translation,
            entityId: entity.id,  // FK burada set edilir!
        })
    }
}
```

---

## Lookup Tables (Kritik Statü Enum'ları)

Kritik statü değerleri (role, status, permission vb.) hem enum olarak tanımlanır hem de DB'ye lookup table olarak kaydedilir. Bu sayede codebase'de enum kullanılırken DB'de de referans bütünlüğü sağlanır.

### Akış

**1. Enum Tanımla**
`packages/shared/enums/index.ts`
```typescript
export type TEnumMyStatusKey = "active" | "pending" | "cancelled"

const MY_STATUS_MAP: TEnumMapRecord<TEnumMyStatusKey> = {
    active: 1,
    pending: 2,
    cancelled: 3,
} as const;

// SahredEnums'a ekle
export const SahredEnums = {
    // ...existing
    MY_STATUS_MAP,
}
```

**2. Lookup Table Oluştur**
`packages/shared/dto/schema/[entity].ts`
```typescript
// Basit lookup table: sadece id ve name
export const tblMyStatus = pgTable('my_status', {
    id: integer().primaryKey(),  // NOT auto-increment!
    name: varchar({ length: 255 }).notNull(),
})
```

**3. LookUpRecords'a Ekle**
`apps/backend/src/modules/infrastructure/database/helpers/validate-lookup.ts`
```typescript
import { tblMyStatus } from "@repo/shared/schema"

const LookUpRecords = {
    // ...existing
    tblMyStatus: {
        LookupEnum: SahredEnums.MY_STATUS_MAP,
        dbTable: tblMyStatus,
        dbName: 'tblMyStatus',
    },
}
```

**4. Validate & Seed**
```bash
cd apps/backend
bun run validate-lookups
```

### Mevcut Lookup Tables
- `tblRole` ↔ `ROLE_MAP`
- `tblPermission` ↔ `PERMISSION_MAP`
- `tblMailConfirmationStatus` ↔ `MAIL_CONFIRMATION_MAP`
- `tblLogStatus` ↔ `ENUM_ALL_EVENT_IDS`
- `tblSubscriptionStatus` ↔ `SUBSCRIPTION_STATUS_MAP`

### Kullanım
```typescript
// Foreign key olarak kullan
statusId: integer().notNull().references(() => tblMyStatus.id)

// Enum ile query
const activeId = SahredEnums.getMapId(SahredEnums.MY_STATUS_MAP, 'active')
await db.query.tblEntity.findMany({
    where: eq(tblEntity.statusId, activeId)
})
```

---

## Frontend Select Data (Dropdown/Select için Enum Verileri)

Enum değerlerini frontend'de dropdown, select, radio group gibi componentlerde kullanmak için `SelectData` kullanılır.

**Konum:** `packages/shared/enums/enum-data.ts`

### İki Pattern

| Pattern | Enum Türü | Value Tipi | Kullanım |
|---------|-----------|------------|----------|
| Numeric | `TEnumMapRecord` | `id.toString()` | DB'de numeric ID saklanan enumlar |
| String | `TKeyRecord` | `key` | DB'de string saklanan enumlar |

### Yeni SelectData Ekleme

**Numeric Enum için (TEnumMapRecord):**
```typescript
// enum-data.ts
get MyStatusNumericData() {
    return SahredEnums.getMapEntries(SahredEnums.MY_STATUS_MAP).map(({ key, id }) => ({
        label: key,
        value: id.toString()
    }))
}
// Çıktı: [{ label: 'active', value: '1' }, { label: 'pending', value: '2' }]
```

**String Enum için (TKeyRecord):**
```typescript
// enum-data.ts
get CurrencyData() {
    return SahredEnums.getRecordKeys(SahredEnums.CURRENCY_KEY).map((key) => ({
        label: key,
        value: key
    }))
}
// Çıktı: [{ label: 'USD', value: 'USD' }, { label: 'EUR', value: 'EUR' }]
```

### Frontend'de Kullanım
```typescript
import { SahredEnums } from '@repo/shared/enums'

// Select component
<Select options={SahredEnums.SelectData.CurrencyData} />
<Select options={SahredEnums.SelectData.RoleNumericData} />

// Mevcut SelectData'lar
SahredEnums.SelectData.RoleNumericData
SahredEnums.SelectData.LanguageNumericData
SahredEnums.SelectData.ThemeNumericData
SahredEnums.SelectData.PermissionNumericData
SahredEnums.SelectData.SubscriptionStatusNumericData
SahredEnums.SelectData.CurrencyData
SahredEnums.SelectData.Plan_IntervalData
SahredEnums.SelectData.Discount_TypeData
SahredEnums.SelectData.CouponDuration_TypeData
SahredEnums.SelectData.Campaign_Target_TypeData
```

---

## Kurallar

### Zorunlu
- Soft delete kullan (`deletedAt` field)
- Tüm tablolar için `$inferSelect` ve `$inferInsert` export et
- Enum alanları validator'da `SahredEnums` ile override et
- Foreign key repository'de set et, client'tan alma
- FK isimleri max 64 karakter

### Yasak
- Repository'de `any` kullanma
- Validator'da manuel type yazma
- Schema dışı tip üretme
- Hard-coded magic string kullanma
- `shared/enums/index.ts` kontrol etmeden enum kullanma

---

## Referans Dosyalar

- Schema örneği: `packages/shared/dto/schema/character.ts`
- Validator örneği: `packages/shared/dto/validators/character/index.ts`
- Repository örneği: `apps/backend/src/modules/infrastructure/repositories/character/`
- Router örneği: `apps/backend/src/trpc/routers/character.ts`
