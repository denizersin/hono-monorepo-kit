Aşağıda, herhangi bir spesifik entity ismi kullanmadan, monorepo içinde yeni bir entity oluştururken izlenecek standart akışı tanımlayan create-entity-rule.md dokümanı yer almaktadır.

create-entity-rule.md
🎯 Amaç
Bu doküman, monorepo yapısında yeni bir entity oluştururken izlenecek standart süreci tanımlar.
Amaç:


Tüm entity’lerde tutarlı mimari yapı


Schema → DTO → Validator → Repository akışının standardizasyonu


Tekrarlanabilir ve ölçeklenebilir yapı


Bu kural, projedeki tüm yeni entity oluşturma süreçlerinde referans alınmalıdır.

📦 1. Shared Paketinde Schema Tanımı
📍 Konum
packages/shared/dto/schema/[entityName].ts

Gerekirse gruplama yapılabilir:
packages/shared/dto/schema/[group]/[entityName].ts


1.1 Drizzle Table Tanımı


pgTable kullanılır


id primary key olarak tanımlanır


generatedByDefaultAsIdentity() kullanılır


timestamps için getDefaultTableFieldsWithDeletedAt() spread edilir


Soft delete desteklenir (deletedAt)


Standart Alan Yapısı
export const tblEntity = pgTable('entity', {
    id: integer().primaryKey().generatedByDefaultAsIdentity(),

    type: varchar({ length: 255 }).notNull().$type<TEnumEntityKey>(), //enum
    // data fields
    ...

    // relation fields
    ...

    // timestamps
    ...getDefaultTableFieldsWithDeletedAt()
})


1.2 Relation Tanımları


relations() her zaman tüm tablolar tanımlandıktan sonra yazılır.


one, many kullanımı açık ve net olmalıdır.


Circular dependency riskine dikkat edilir.


export const tblEntityRelation = relations(tblEntity, ({ one, many }) => ({
    ...
}))


1.3 Foreign Key Tanımı


Eğer tablo callback parametresi kullanıyorsa, foreignKey açık şekilde isimlendirilir.


FK isimleri 64 karakteri geçmemelidir.


onDelete: 'cascade' gerekiyorsa açık belirtilmelidir.



1.4 Select & Insert Type Exportları (ZORUNLU)
Her tablo için:
export type TEntity = typeof tblEntity.$inferSelect
export type TEntityInsert = typeof tblEntity.$inferInsert


1.5 Repository Type Namespace Yapısı
Schema dosyasının sonunda:
export namespace TSchemaEntity {

    // step1: table types
    export type TEntity = ...
    export type TEntityInsert = ...

    // step2: repository create/update types
    export namespace TEntityRepositoryTypes {
        export type TCreateEntity = ...
        export type TUpdateEntity = ...
    }

    // step3: relation select types
    export type TEntityWithRelations = ReturnTypeOfQuery<typeof getEntityWithRelations>
}

Kurallar:


Create type → Insert tiplerini baz alır


Update type → Partial kullanır


Relation return type → mockDb query üzerinden türetilir


Override gerekiyorsa repository katmanında yapılır



🧪 2. DTO Validator Tanımı
📍 Konum
packages/shared/dto/validators/[entityName]/index.ts


2.1 Base Insert Schema
Her tablo için:
const entityBaseInsertSchema =
    createInsertSchema(tblEntity).omit(defaultOmitFieldsSchema)

Kurallar:


createInsertSchema kullanılır


defaultOmitFieldsSchema mutlaka uygulanır


id, createdAt, updatedAt, deletedAt dışlanmalıdır

eger enum varsa z.enum() ile type alanına enum type eklenmeli

2.2 CRUD Schema Tanımları
Create:
const createEntitySchema = z.object({
    entityData: entityBaseInsertSchema,
})

Update:
const updateEntitySchema = z.object({
    id: z.number(),
    data: z.object({
        entityData: entityBaseInsertSchema.partial(),
    }),
})


2.3 Relation İçeren Schema Yapısı
Nested create varsa:


Omit<..., 'foreignKeyField'>


foreign key repository içinde set edilir



2.4 Query Schema Standartları
Pagination varsa:


basePaginationQuerySchema extend edilir


sort alanları açık enum ile tanımlanır


filter optional olmalıdır


const paginationQuerySchema = basePaginationQuerySchema.extend({
    sort: z.array(z.object({
        sortBy: z.enum(['asc', 'desc']),
        sortField: z.enum([...]),
    })),
    filter: z.object({
        ...
    })
})


2.5 Export Yapısı
export const entityValidator = {
    createEntitySchema,
    updateEntitySchema,
    paginationQuerySchema,
}


2.6 Type Exportları
export namespace TEntityValidator {
    export type TCreateEntity = z.infer<typeof createEntitySchema>
    export type TUpdateEntity = z.infer<typeof updateEntitySchema>
}


🏗 3. Infrastructure Repository Implementasyonu
📍 Konum
apps/backend/src/modules/infrastructure/repositories/[entityName]/[EntityRepositoryImpl].ts


3.1 Import Kuralları


db → @repo/db


schema → @repo/shared/schema


validators → @repo/shared/validators


drizzle operators → drizzle-orm



3.2 Basic CRUD Metotları
Get by id
async getById(id: number): Promise<TEntityWithRelations | undefined>



findFirst


with relations


soft delete kontrolü gerekiyorsa where içine eklenir



Get all
async getAll(): Promise<TEntityWithRelations[]>


Create
async create(data: TEntityInsert): Promise<void>


Update
async update(id: number, data: Partial<TEntityInsert>): Promise<void>


Delete
async delete(id: number): Promise<void>


3.3 Relation İçeren Create
Standart sıralama:


Ana kayıt oluşturulur


many-to-many ilişkiler oluşturulur


one-to-many ilişkiler oluşturulur


nested translation kayıtları oluşturulur


⚠️ Kurallar:


returning() kullanılmalı


yeni id alınmalı


foreign key repository içinde set edilmeli


child kayıtlar loop ile insert edilmeli



3.4 Relation İçeren Update
Standart sıralama:


Base data update edilir


many-to-many ilişkiler:


önce silinir


sonra yeniden insert edilir




nested update varsa:


id varsa update


yoksa ignore veya insert (karar entity’ye göre)





3.5 Pagination Query Pattern


andConditions array toplanır


global_search eklenir


soft delete filtreleri eklenir


orderBy dynamic oluşturulur


countDistinct ile total hesaplanır


Return format:
{
    data,
    pagination: {
        page,
        limit,
        total,
        totalPages
    }
}


📐 Genel Mimari Kurallar
✅ Zorunlu


Soft delete desteklenmeli


Tüm tablolar için select/insert type export edilmeli


Validator → Schema'dan türetilmeli


Repository → Schema types kullanmalı


Foreign key set işlemi repository’de yapılmalı


Relation query type'ları mockDb üzerinden türetilmeli



❌ Yasak


Repository içinde any kullanımı


Validator içinde manuel type yazımı


Schema dışı tip üretimi


Foreign key client tarafından set edilmesi


Entity bazlı hard-coded magic string kullanımı



🔁 Entity Oluşturma Özet Akışı
1️⃣ Schema yazılır
2️⃣ Select & Insert type export edilir
3️⃣ Repository types namespace oluşturulur
4️⃣ Validator base insert schema oluşturulur
5️⃣ CRUD schema’ları yazılır
6️⃣ Infrastructure repository implementasyonu yapılır
7️⃣ Relation’lar test edilir

🏁 Sonuç
Bu kurallar takip edildiğinde:


Tüm entity’ler aynı mimariyi takip eder


Tip güvenliği uçtan uca korunur


Repository ve validator katmanları senkron çalışır


Yeni entity eklemek öngörülebilir ve hızlı hale gelir


