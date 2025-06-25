import { ICharacterRepository } from "@server/modules/domain/repositories/ICharacterRepository";
import TCharacterEntity from "@server/modules/domain/entities/character/Character";
import db from "../../database";
import { eq } from "drizzle-orm";
import { tblCharacter } from "@repo/shared/schema";

export class CharacterRepositoryImpl implements ICharacterRepository {
    async getCharacterById(id: number): Promise<TCharacterEntity.TCharacter | undefined> {
        const character = await db.query.tblCharacter.findFirst({
            where: eq(tblCharacter.id, id)
        });
        return character;
    }

    async getAllCharacters(): Promise<TCharacterEntity.TCharacter[]> {
        const characters = await db.query.tblCharacter.findMany();
        return characters;
    }

    async createCharacter(character: TCharacterEntity.TCharacterInsert): Promise<void> {
        const result = await db.insert(tblCharacter).values(character);
        return 
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
} 