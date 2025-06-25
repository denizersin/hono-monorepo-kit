import TCharacterEntity from "../entities/character/Character";

export interface ICharacterRepository {
    getCharacterById(id: number): Promise<TCharacterEntity.TCharacter | undefined>
    getAllCharacters(): Promise<TCharacterEntity.TCharacter[]>
    createCharacter(character: TCharacterEntity.TCharacterInsert): Promise<void>
    updateCharacter(id: number, character: Partial<TCharacterEntity.TCharacterInsert>): Promise<void>
    deleteCharacter(id: number): Promise<void>
} 