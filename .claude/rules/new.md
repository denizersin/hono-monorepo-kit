🎯 Amaç
Bu doküman, monorepo yapısında yeni bir entity oluştururken izlenecek standart süreci tanımlar.
Amaç:

Tüm entity'lerde tutarlı mimari yapı
Schema → DTO → Validator → Repository akışının standardizasyonu
Tekrarlanabilir ve ölçeklenebilir yapı

Bu kural, projedeki tüm yeni entity oluşturma süreçlerinde referans alınmalıdır.

📦 1. Shared Paketinde Schema Tanımı
📍 Konum: packages/shared/dto/schema/[entityName].ts
Gerekirse gruplama yapılabilir: packages/shared/dto/schema/[group]/[entityName].ts

⚠️ Önemli: Veritabanı şeması developer tarafından oluşturulur. AI asistan mevcut şemayı okur, relation'ları kontrol eder ve şema üzerinden devam eder — şemayı kendisi oluşturmaz.


1.1 Drizzle Table Tanımı

pgTable kullanılır
id primary key olarak tanımlanır
generatedByDefaultAsIdentity() kullanılır
Timestamps için getDefaultTableFieldsWithDeletedAt() spread edilir
Soft delete desteklenir (deletedAt)
//enum notu ile işaretlenmiş alanlar için enum type uygulanır

Standart Alan Yapısı:
tsexport const tblEntity = pgTable('entity', {
    id: integer().primaryKey().generatedByDefaultAsIdentity(),

    type: varchar({ length: 255 }).notNull().$type<TEnumEntityKey>(), //enum
    // data fields
    ...

    // relation fields
    ...

    // timestamps
    ...getDefaultTableFieldsWithDeletedAt()
})

1.2 Enum Kullanımı
Şemada //enum notu ile işaretlenmiş alanlar shared/enums/index.ts dosyasından import edilerek kullanılır. Bu dosyaya bakılmadan enum tanımı yapılmaz.
tsimport { TEnumDiscountType, TEnumCouponDurationKey } from '#/enums/index'

1.3 Relation Tanımları

relations() her zaman tüm tablolar tanımlandıktan sonra yazılır
one, many kullanımı açık ve net olmalıdır
Circular dependency riskine dikkat edilir
Mevcut şemadaki relation'lar okunarak doğrulanır; eksik veya yanlış relation varsa belirtilir

tsexport const tblEntityRelation = relations(tblEntity, ({ one, many }) => ({
    ...
}))

1.4 Foreign Key Tanımı

Tablo callback parametresi kullanıyorsa foreignKey açık şekilde isimlendirilir
FK isimleri 64 karakteri geçmemelidir
onDelete: 'cascade' gerekiyorsa açık belirtilir


1.5 Translation Tabloları
Translation içeren entity'lerde aşağıdaki standart uygulanır:
Ana tablo normal tanımlanır. Translation tablosu ayrı bir pgTable olarak oluşturulur ve şu özellikleri taşır:

id primary key
Ana tabloya foreignKey ile bağlanır (cascade delete ile)
languageId alanı tblLanguage tablosuna FK ile bağlanır
(planId, languageId) çifti için uniqueIndex tanımlanır
FK isimleri 64 karakter sınırına uygun olmalıdır

tsexport const tblEntityTranslation = pgTable('entity_translation', {
    id: integer().primaryKey().generatedByDefaultAsIdentity(),
    entityId: integer().notNull(),
    languageId: integer().notNull(),
    name: varchar({ length: 255 }).notNull(),
    description: varchar({ length: 255 }).notNull(),
    ...getDefaultTableFieldsWithDeletedAt()
}, (table) => ({
    unique_entity_language: uniqueIndex('unique_entity_language').on(table.entityId, table.languageId),
    fkEntityTranslationEntity: foreignKey({
        columns: [table.entityId],
        foreignColumns: [tblEntity.id],
        name: 'fk_entity_translation_entity',  // max 64 karakter
    }).onDelete('cascade'),
    fkEntityTranslationLanguage: foreignKey({
        columns: [table.languageId],
        foreignColumns: [tblLanguage.id],
        name: 'fk_entity_translation_language',
    }),
}))
Translation Relation Tanımı:
Ana entity'nin relation'ında translation many olarak tanımlanır:
tsexport const tblEntityRelation = relations(tblEntity, ({ many }) => ({
    translations: many(tblEntityTranslation),
}))
Translation tablosunun relation'ında ise one ile ana entity ve language'a bağlanır:
tsexport const tblEntityTranslationRelation = relations(tblEntityTranslation, ({ one }) => ({
    entity: one(tblEntity, {
        fields: [tblEntityTranslation.entityId],
        references: [tblEntity.id],
    }),
    language: one(tblLanguage, {
        fields: [tblEntityTranslation.languageId],
        references: [tblLanguage.id],
    }),
}))
Type Export'ları:
tsexport type TEntityTranslation = typeof tblEntityTranslation.$inferSelect
export type TEntityTranslationInsert = typeof tblEntityTranslation.$inferInsert
Namespace içinde repository create/update tipleri:
tsexport type TCreateEntityWithTranslation = {
    entityData: TEntityInsert
    translations: Omit<TEntityTranslationInsert, 'entityId'>[]  // entityId repository'de set edilir
}

export type TUpdateEntityWithTranslation = {
    id: number
    data: {
        entityData: Partial<TEntityInsert>
        translations: TEntityTranslationInsert[]
    }
}

⚠️ Kural: translations array'indeki her elemanın entityId alanı client tarafından set edilmez, repository içinde ana kayıt oluşturulduktan sonra elde edilen id ile set edilir.


1.6 Select & Insert Type Export'ları (ZORUNLU)
Her tablo için:
tsexport type TEntity = typeof tblEntity.$inferSelect
export type TEntityInsert = typeof tblEntity.$inferInsert

1.7 Repository Type Namespace Yapısı
Schema dosyasının sonunda:
tsexport namespace TSchemaEntity {

    // step1: table types
    export type TEntity = typeof tblEntity.$inferSelect
    export type TEntityInsert = typeof tblEntity.$inferInsert

    // step2: repository create/update types
    export namespace TEntityRepositoryTypes {
        export type TCreateEntity = ...
        export type TUpdateEntity = ...
    }

    // step3: relation select types — mockDb query üzerinden türetilir
    export type TEntityWithRelations = ReturnTypeOfQuery<typeof getEntityWithRelations>
}
Kurallar:

Create type → Insert tiplerini baz alır
Update type → Partial kullanır
Relation return type → mockDb query üzerinden türetilir
Override gerekiyorsa repository katmanında yapılır


🧪 2. DTO Validator Tanımı
📍 Konum: packages/shared/dto/validators/[entityName]/index.ts

2.1 Base Insert Schema
tsconst entityBaseInsertSchema =
    createInsertSchema(tblEntity).omit(defaultOmitFieldsSchema)
Kurallar:

createInsertSchema kullanılır
defaultOmitFieldsSchema mutlaka uygulanır (id, createdAt, updatedAt, deletedAt dışlanır)


2.2 Enum Alanları için Override (ZORUNLU)
Şemada //enum notu ile işaretlenmiş alanlar createInsertSchema içinde mutlaka z.enum() ile override edilir. Enum değerleri SahredEnums üzerinden alınır:
tsconst couponsBaseInsertSchema = createInsertSchema(tblCoupons, {
    discount_type: z.enum(SahredEnums.getRecordKeysForZod(SahredEnums.Discount_Type)),
    duration: z.enum(SahredEnums.getRecordKeysForZod(SahredEnums.CouponDuration_Type)),
}).omit(defaultOmitFieldsSchema)

⚠️ shared/enums/index.ts dosyasına bakılmadan enum override yapılmaz. Hangi enum key'lerinin mevcut olduğu bu dosyadan doğrulanır.


2.3 CRUD Schema Tanımları
Create:
tsconst createEntitySchema = z.object({
    entityData: entityBaseInsertSchema,
})
Update:
tsconst updateEntitySchema = z.object({
    id: z.number(),
    data: z.object({
        entityData: entityBaseInsertSchema.partial(),
    }),
})

2.4 Translation İçeren Schema Yapısı
Translation içeren entity'lerde translations alanı ayrı bir schema olarak tanımlanır. entityId (foreign key) validator'da omit edilir — bu alan repository'de set edilir.
tsconst entityTranslationBaseSchema = createInsertSchema(tblEntityTranslation, {
    // enum varsa override et
}).omit({ ...defaultOmitFieldsSchema, entityId: true })  // entityId omit!

const createEntityWithTranslationSchema = z.object({
    entityData: entityBaseInsertSchema,
    translations: z.array(entityTranslationBaseSchema),
})

const updateEntityWithTranslationSchema = z.object({
    id: z.number(),
    data: z.object({
        entityData: entityBaseInsertSchema.partial(),
        translations: z.array(entityTranslationBaseSchema),
    }),
})

2.5 Query Schema Standartları
Pagination varsa basePaginationQuerySchema extend edilir:
tsconst paginationQuerySchema = basePaginationQuerySchema.extend({
    sort: z.array(z.object({
        sortBy: z.enum(['asc', 'desc']),
        sortField: z.enum([...]),
    })),
    filter: z.object({
        ...
    }).optional()
})

2.6 Export Yapısı
tsexport const entityValidator = {
    createEntitySchema,
    updateEntitySchema,
    paginationQuerySchema,
}

2.7 Type Export'ları
tsexport namespace TEntityValidator {
    export type TCreateEntity = z.infer<typeof createEntitySchema>
    export type TUpdateEntity = z.infer<typeof updateEntitySchema>
}

🏗 3. Infrastructure Repository Implementasyonu
📍 Konum: apps/backend/src/modules/infrastructure/repositories/[entityName]/[EntityRepositoryImpl].ts

3.1 Import Kuralları

db → @repo/db
schema → @repo/shared/schema
validators → @repo/shared/validators
drizzle operators → drizzle-orm


3.2 Basic CRUD Metotları
Get by id:
tsasync getById(id: number): Promise<TEntityWithRelations | undefined>
// findFirst, with relations, soft delete kontrolü
Get all:
tsasync getAll(): Promise<TEntityWithRelations[]>
Create:
tsasync create(data: TEntityInsert): Promise<void>
Update:
tsasync update(id: number, data: Partial<TEntityInsert>): Promise<void>
Delete:
tsasync delete(id: number): Promise<void>

3.3 Translation İçeren Create
Translation içeren entity'lerde create işlemi şu sırayla yapılır:

Ana kayıt insert edilir, returning() ile yeni id alınır
Her translation için entityId bu id ile set edilir
Translation'lar loop ile insert edilir

tsasync createWithTranslations(data: TCreateEntityWithTranslation): Promise<void> {
    const [entity] = await db.insert(tblEntity).values(data.entityData).returning()

    for (const translation of data.translations) {
        await db.insert(tblEntityTranslation).values({
            ...translation,
            entityId: entity.id,  // foreign key burada set edilir
        })
    }
}

⚠️ entityId client'tan gelmez, returning() ile alınan id kullanılır.


3.4 Translation İçeren Update

Base data update edilir
Mevcut translation'lar silinir
Yeni translation'lar loop ile insert edilir (entityId yeniden set edilir)

tsasync updateWithTranslations(id: number, data: TUpdateEntityWithTranslation['data']): Promise<void> {
    await db.update(tblEntity).set(data.entityData).where(eq(tblEntity.id, id))

    await db.delete(tblEntityTranslation).where(eq(tblEntityTranslation.entityId, id))

    for (const translation of data.translations) {
        await db.insert(tblEntityTranslation).values({
            ...translation,
            entityId: id,
        })
    }
}

3.5 Relation İçeren Create (Genel)
Standart sıralama:

Ana kayıt oluşturulur
many-to-many ilişkiler oluşturulur
one-to-many ilişkiler oluşturulur
Nested translation kayıtları oluşturulur

Kurallar: returning() kullanılmalı, yeni id alınmalı, FK repository içinde set edilmeli, child kayıtlar loop ile insert edilmeli.

3.6 Relation İçeren Update (Genel)
Standart sıralama:

Base data update edilir
Many-to-many ilişkiler → önce silinir, sonra yeniden insert edilir
Nested update → id varsa update, yoksa ignore veya insert (karar entity'ye göre)


3.7 Pagination Query Pattern

andConditions array'e toplanır
global_search eklenir
Soft delete filtreleri eklenir
orderBy dynamic oluşturulur
countDistinct ile total hesaplanır

Return format:
ts{
    data,
    pagination: {
        page,
        limit,
        total,
        totalPages
    }
}

📐 Genel Mimari Kurallar
✅ Zorunlu:

Soft delete desteklenmeli
Tüm tablolar için select/insert type export edilmeli
Validator → Schema'dan türetilmeli
Repository → Schema types kullanmalı
Foreign key set işlemi repository'de yapılmalı
Relation query type'ları mockDb üzerinden türetilmeli
Enum alanları validator'da SahredEnums ile override edilmeli
Enum tanımları shared/enums/index.ts dosyasından doğrulanmalı

❌ Yasak:

Repository içinde any kullanımı
Validator içinde manuel type yazımı
Schema dışı tip üretimi
Foreign key'in client tarafından set edilmesi
Entity bazlı hard-coded magic string kullanımı
shared/enums/index.ts dosyasına bakmadan enum kullanımı


🔁 Entity Oluşturma Özet Akışı
1️⃣ Mevcut şema okunur, relation'lar doğrulanır
2️⃣ Select & Insert type export edilir
3️⃣ Repository types namespace oluşturulur
4️⃣ Validator base insert schema oluşturulur (enum override dahil)
5️⃣ CRUD schema'ları yazılır (translation schema'ları dahil)
6️⃣ Infrastructure repository implementasyonu yapılır
7️⃣ Relation'lar ve translation akışı test edilir