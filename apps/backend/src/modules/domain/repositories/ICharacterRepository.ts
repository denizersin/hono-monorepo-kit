import TCharacterEntity from "../entities/character/Character";

export interface ICharacterRepository {
    getCharacterById(id: number): Promise<TCharacterEntity.TCharacter | undefined>
    // getAllCharacters(): Promise<TCharacterEntity.TCharacterWithRelations[]>
    createCharacter(character: TCharacterEntity.TCharacterInsert): Promise<void>
    updateCharacter(id: number, character: Partial<TCharacterEntity.TCharacterInsert>): Promise<void>
    deleteCharacter(id: number): Promise<void>
    createCharacterInstruction(characterInstruction: TCharacterEntity.TCharacterInstructionInsert): Promise<void>
    updateCharacterInstruction(id: number, characterInstruction: Partial<TCharacterEntity.TCharacterInstructionInsert>): Promise<void>
    deleteCharacterInstruction(id: number): Promise<void>
    createCharacterImage(characterImage: TCharacterEntity.TCharacterImageInsert): Promise<void>
    updateCharacterImage(id: number, characterImage: Partial<TCharacterEntity.TCharacterImageInsert>): Promise<void>
    deleteCharacterImage(id: number): Promise<void>
    createCharacterPersona(characterPersona: TCharacterEntity.TCharacterPersonaInsert): Promise<void>
    updateCharacterPersona(id: number, characterPersona: Partial<TCharacterEntity.TCharacterPersonaInsert>): Promise<void>
    deleteCharacterPersona(id: number): Promise<void>
} 