import {
    tblCharacter,
    tblCharacterImage,
    tblCharacterInstruction,
    tblCharacterInstructionTranslation,
    tblCharacterPersona,
    tblPersona,
    tblPersonaTranslation,
    TSchemaCharacter,
} from "@repo/shared/schema";
import TCharacterEntity from "@server/modules/domain/entities/character/Character";
import { eq } from "drizzle-orm";
import db from "../../database";

export class CharacterRepositoryImpl {
    async getCharacterById(id: number): Promise<TSchemaCharacter.TCharacterWithRelations | undefined> {
        const character = await db.query.tblCharacter.findFirst({
            where: eq(tblCharacter.id, id),
            with: {
                personas: {
                    with: {
                        persona: {
                            with: {
                                translations: true
                            }
                        }
                    },
                },
                instructions: {
                    with: {
                        translations: true,
                    },
                },
                images: true,

            },
        });
        return character
    }

    async getAllCharacters(): Promise<TSchemaCharacter.TCharacterWithRelations[]> {
        const characters = await db.query.tblCharacter.findMany({
            with: {
                personas: {
                    with: {
                        persona: {
                            with: {
                                translations: true
                            }
                        }
                    },
                },
                instructions: {
                    with: {
                        translations: true,
                    },
                },
                images: true,

            },
        });
        return characters
    }

    async createCharacter(character: TCharacterEntity.TCharacterInsert): Promise<void> {
        await db.insert(tblCharacter).values(character);
        return;
    }

    async updateCharacter(id: number, character: Partial<TCharacterEntity.TCharacterInsert>): Promise<void> {
        await db.update(tblCharacter)
            .set(character)
            .where(eq(tblCharacter.id, id));
    }

    async deleteCharacter(id: number): Promise<void> {
        await db.delete(tblCharacter)
            .where(eq(tblCharacter.id, id));
    }

    async createCharacterInstruction(characterInstruction: TCharacterEntity.TCharacterInstructionInsert): Promise<void> {
        await db.insert(tblCharacterInstruction).values(characterInstruction);
    }

    async updateCharacterInstruction(id: number, characterInstruction: Partial<TCharacterEntity.TCharacterInstructionInsert>): Promise<void> {
        await db.update(tblCharacterInstruction)
            .set(characterInstruction)
            .where(eq(tblCharacterInstruction.id, id));
    }

    async deleteCharacterInstruction(id: number): Promise<void> {
        await db.delete(tblCharacterInstruction)
            .where(eq(tblCharacterInstruction.id, id));
    }

    async createCharacterImage(characterImage: TCharacterEntity.TCharacterImageInsert): Promise<void> {
        await db.insert(tblCharacterImage).values(characterImage);
    }

    async updateCharacterImage(id: number, characterImage: Partial<TCharacterEntity.TCharacterImageInsert>): Promise<void> {
        await db.update(tblCharacterImage)
            .set(characterImage)
            .where(eq(tblCharacterImage.id, id));
    }

    async deleteCharacterImage(id: number): Promise<void> {
        await db.delete(tblCharacterImage)
            .where(eq(tblCharacterImage.id, id));
    }

    async createCharacterPersona(characterPersona: TCharacterEntity.TCharacterPersonaInsert): Promise<void> {
        await db.insert(tblCharacterPersona).values(characterPersona);
    }

    async updateCharacterPersona(id: number, characterPersona: Partial<TCharacterEntity.TCharacterPersonaInsert>): Promise<void> {
        await db.update(tblCharacterPersona)
            .set(characterPersona)
            .where(eq(tblCharacterPersona.id, id));
    }

    async deleteCharacterPersona(id: number): Promise<void> {
        await db.delete(tblCharacterPersona)
            .where(eq(tblCharacterPersona.id, id));
    }

    /**
     * Create a new character together with all optional nested relations (personas, instructions, images)
     * according to `TSchemaCharacter.TCreateCharacter` definition.
     * Returns the id of the newly-created character so that callers can work with it later on.
     */
    async createCharacterWithRelations({ characterData, personaIds, instructions, images }: TSchemaCharacter.TCreateCharacter): Promise<number> {
        // 1. create main character record
        const [newCharacter] = await db
            .insert(tblCharacter)
            .values(characterData)
            .returning();

        if (!newCharacter) {
            throw new Error("Character not created");
        }

        const characterId = newCharacter.id;


        // 2. attach personas (many-to-many)
        const personaIdsWithMainPersona = [characterData.mainPersonaId, ...(personaIds || [])];
        const characterPersonas = personaIdsWithMainPersona.map((personaId) => ({ characterId, personaId: personaId! }));
        await db.insert(tblCharacterPersona).values(characterPersonas);

        // 3. create instructions (+ translations) (one-to-many)
        if (instructions && instructions.length > 0) {
            for (const instruction of instructions) {
                const [newInstruction] = await db
                    .insert(tblCharacterInstruction)
                    .values({ characterId, ...instruction.characterInstructionData })
                    .returning();

                if (!newInstruction) continue;

                if (instruction.translations && instruction.translations.length > 0) {
                    const translations = instruction.translations.map((t) => ({ ...t, characterInstructionId: newInstruction.id }));
                    await db.insert(tblCharacterInstructionTranslation).values(translations);
                }
            }
        }

        // 4. create images (one-to-many)
        if (images && images.length > 0) {
            const imgRecords = images.map((img) => ({ characterId, ...img.characterImageData }));
            await db.insert(tblCharacterImage).values(imgRecords);
        }

        return characterId;
    }

    /**
     * Update an existing character together with its persona connections according to `TUpdateCharacter`.
     */
    async updateCharacterWithRelations({ id, data }: TSchemaCharacter.TUpdateCharacter): Promise<void> {
        const { characterData, personaIds } = data;

        // 1. update character base data
        if (characterData && Object.keys(characterData).length > 0) {
            await db.update(tblCharacter).set(characterData).where(eq(tblCharacter.id, id));
        }

        // 2. sync personas (many-to-many)
        if (personaIds) {
            // delete current links
            await db.delete(tblCharacterPersona).where(eq(tblCharacterPersona.characterId, id));

            if (personaIds.length > 0) {
                const newLinks = personaIds.map((personaId) => ({ characterId: id, personaId }));
                await db.insert(tblCharacterPersona).values(newLinks);
            }
        }
    }

    /**
     * Create a new persona with its translations.
     */
    async createPersonaWithTranslation({ personaData, translations }: TSchemaCharacter.TCreatePersonaWithTranslation): Promise<number> {
        const [newPersona] = await db.insert(tblPersona).values(personaData).returning();

        if (!newPersona) {
            throw new Error("Persona not created");
        }

        const personaId = newPersona.id;

        if (translations && translations.length > 0) {
            const translationRecords = translations.map((t) => ({ personaId, ...t }));
            await db.insert(tblPersonaTranslation).values(translationRecords);
        }

        return personaId;
    }

    /**
     * Update persona data together with its translations.
     */
    async updatePersonaWithTranslation({ id, data }: TSchemaCharacter.TUpdatePersonaWithTranslation): Promise<void> {
        const { personaData, translations } = data;

        // 1. update persona base row
        if (personaData && Object.keys(personaData).length > 0) {
            await db.update(tblPersona).set(personaData).where(eq(tblPersona.id, id));
        }

        // 2. update / upsert translations if provided
        if (translations && translations.length > 0) {
            for (const tr of translations) {
                if (!tr.id) continue; // we need id to update existing translation
                await db.update(tblPersonaTranslation).set(tr).where(eq(tblPersonaTranslation.id, tr.id));
            }
        }
    }

    /**
     * Create a new character instruction with translations.
     */
    async createCharacterInstructionWithTranslations({ characterInstructionData, translations }: TSchemaCharacter.TCreateCharacterInstruction): Promise<number> {
        const [newInstruction] = await db
            .insert(tblCharacterInstruction)
            .values(characterInstructionData)
            .returning();

        if (!newInstruction) {
            throw new Error("Character instruction not created");
        }

        const instructionId = newInstruction.id;

        if (translations && translations.length > 0) {
            const translationRecords = translations.map((t) => ({ ...t, characterInstructionId: instructionId }));
            await db.insert(tblCharacterInstructionTranslation).values(translationRecords);
        }

        return instructionId;
    }

    /**
     * Update a character instruction together with its translations.
     */
    async updateCharacterInstructionWithTranslations({ id, data }: TSchemaCharacter.TUpdateCharacterInstruction): Promise<void> {
        const { characterInstructionData, translations } = data;

        if (characterInstructionData && Object.keys(characterInstructionData).length > 0) {
            await db.update(tblCharacterInstruction).set(characterInstructionData).where(eq(tblCharacterInstruction.id, id));
        }

        if (translations && translations.length > 0) {
            for (const tr of translations) {
                if (!tr.id) continue;
                await db.update(tblCharacterInstructionTranslation).set(tr).where(eq(tblCharacterInstructionTranslation.id, tr.id));
            }
        }
    }

    /**
     * Update a character image according to `TUpdateCharacterImage` definition.
     */
    async updateCharacterImageWithData({ id, data }: TSchemaCharacter.TUpdateCharacterImage): Promise<void> {
        await db.update(tblCharacterImage).set(data.characterImageData).where(eq(tblCharacterImage.id, id));
    }
}

