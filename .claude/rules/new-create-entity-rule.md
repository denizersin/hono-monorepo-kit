# Entity Creation Pipeline Rule

This rule defines the standard operational procedure for creating a new entity or feature across the monorepo. It outlines the 5 explicit steps to take in order to ensure schema definition, type safety, database interaction, validation, and API routing align symmetrically.

## Overview
1. Database Schema & Relations Definition
2. Types & Namespace Definition
3. Repository Implementation
4. Zod Validators Definition (Frontend & API)
5. tRPC Router Implementation

---

## Step 1: Database Schema & Relations
**Location:** `packages/shared/dto/schema/<entity>.ts`

1. **Table Definition:** Define your table using `pgTable('table_name', { ... })`.
   - Start with an integer auto-incrementing ID: `id: integer().primaryKey().generatedByDefaultAsIdentity()`.
   - Always spread the default metadata fields: `...getDefaultTableFieldsWithDeletedAt()`.
2. **Relations:** Define relations using Drizzle's `relations()`. If the entity implies translations, join `tblLanguage` securely. 
3. **Enums Handling (Crucial Warning):**
   - When a column requires an enum, suffix the type explicitly using `$type<TYourEnum>()` and leave a `//enum` comment.
   - **`TEnumMapRecord` vs `TKeyRecord` Difference:**
     - **`TEnumMapRecord<K>` (Map Record):** Maps a string identifier to a `number`. Used primarily for numeric IDs or states (e.g., `ROLE_MAP: { ADMIN: 1 }`). Useful when storing a numeric value in the DB but utilizing string representations in code.
     - **`TKeyRecord<K>` (Key Record):** Maps a string key exact to itself (e.g., `CURRENCY_KEY: { USD: "USD" }`). Used when the database column explicitly saves the `varchar`/string label.
   - If UI components require Select data generated from these Enums, use `packages/shared/enums/enum-data.ts`. Here, we parse `SahredEnums.getMapEntries()` or `SahredEnums.getRecordKeys()` into standardized `{ label, value }` arrays strictly intended for the frontend logic.

## Step 2: Namespace Definitions and Type Inference
**Location:** `packages/shared/dto/schema/<entity>.ts` (Bottom of the file)

1. **Namespace:** Wrap the inferencing under `export namespace TSchema<Entity> {}`.
2. **Standard Interfaces:** Export generic selections `typeof tblEntity.$inferSelect` and inserts `typeof tblEntity.$inferInsert`.
3. **Translation Handling:** If the entity has a translation table (e.g., `tblEntityTranslation`):
   - Export its generic typings as well: `export type T<Entity>Translation = typeof tblEntityTranslation.$inferSelect` and `T<Entity>TranslationInsert`.
   - Include the translations array in relational typing: `export type T<Entity>WithRelation = TEntity & { translations: T<Entity>Translation[] }`.
4. **Relational Inference:** Create `export type T<Entity>WithRelation = TEntity & { relation1: TRelation }`.
5. **Repository Namespace:** Provide `export namespace T<Entity>Repository {}`
   - Define custom complex `TCreate`, `TUpdate` properties.
   - For entities with translations, explicitly declare composite types such as `TCreate<Entity>WithTranslation` which combines the base `entityData` with `translations: Omit<T<Entity>TranslationInsert, 'entityId'>[]`.
   - Use `ReturnTypeOfQuery<typeof getEntityWithRelationQuery>` to lock down relation types that Drizzle builds naturally. Declare Mock queries functionally below the namespace for type extraction only!

## Step 3: Repository Implementation
**Location:** `apps/backend/src/modules/infrastructure/repositories/<entity>/<Entity>RepositoryImpl.ts`

1. **Base CRUD:** Implement methods for `getById`, `getAll`, `create`, `update`, and `delete`. Soft deletion must be implemented by executing `.set({ deletedAt: new Date() })`. Look out for filtering via `isNull(tblEntity.deletedAt)` in all generic lookup methods.
2. **Complex Queries (Pagination & Filtering):**
   - Receive the typed Input (from Validators Step 4).
   - Construct robust `andConditions: SQL<unknown>[]`. Push exact matching for IDs or enums, and `like()` expressions for string filters. Use global search intelligently.
   - Keep dynamic order binding with a lookup map (e.g., `asc`, `desc`) connecting to a defined `columnMapper`.
   - The returned payload strictly conforms to `TBaseValidators.TPagination<EntityPayload>`.

## Step 4: Validators (Frontend & API)
**Location:** `packages/shared/dto/validators/<entity>/index.ts`

1. **Insert Schemas:** Rely on `createInsertSchema` from `drizzle-zod`.
2. **Important Validation Warning for Enums:** You MUST manually override enum fields in the Zod object to reference `SahredEnums` otherwise validation will crash.
   - Example: `myEnumCol: z.enum(SahredEnums.getRecordKeysForZod(SahredEnums.MY_ENUM_KEY))`
3. **Composite Operations:** Build specific CRUD Schemas wrapping the initial schemas (e.g., `createEntityWithTranslationSchema`) wrapping both core data `.partial()` omissions alongside array inputs for things like translations. 
4. **Pagination Setup:** 
   - Extend `basePaginationQuerySchema`. 
   - Define exact tuples for allowable Sort Keys inside your `filter` sub-schema. 
5. Emmit output as a single constant bundle `export const <entity>Validator = {}` and type variants as `export namespace T<Entity>Validator {}`. 

## Step 5: tRPC Router Implementation
**Location:** `apps/backend/src/trpc/routers/<entity>.ts`

1. Spin up a new sub-router employing `createTRPCRouter()`.
2. Secure procedures utilizing `protectedProcedure.use(roleMiddleware([...roles]))`. Ensure roles refer back to `SahredEnums.ROLE_MAP`.
3. Wrap mutations and queries with `.input(...)` referring exclusively to the bindings written in Step 4.  
4. Relay operations structurally to `entityRepository` or `entityService` as per the layered application design.
