

backend'den gelen bir veri icin type yazman gerektiginde
packages/shared/dto/schema/[schema].ts dosyasindan export edilen TSchema[SchemaName].T[SchemaName] tipini kullan yoksa tanimla!
referans:packages/shared/dto/schema/character.ts

formlarda validator gerektirignde 
packages/shared/dto/validators altinda tanimla ve kullan. type'i de oradan al!
referans:packages/shared/dto/validators/character.ts