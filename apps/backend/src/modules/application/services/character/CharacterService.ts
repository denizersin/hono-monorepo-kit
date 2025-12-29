import { TCharacterValidator } from "@repo/shared/validators";
import { getApiContext } from "@server/lib/context";
import TCharacterEntity from "@server/modules/domain/entities/character/Character";
import { ICharacterRepository } from "@server/modules/domain/repositories/ICharacterRepository";
import { CharacterRepositoryImpl } from "@server/modules/infrastructure/repositories/character/CharacterRepositoryImpl";
import { ENUM_CHARACTER_EVENTS } from "../../event/interface/character";
import { EventBus } from "../../event";

export class CharacterService {
    constructor(private readonly characterRepository: CharacterRepositoryImpl) { }

    async createCharacter(character: TCharacterValidator.TCharacterInsert) {
        await this.characterRepository.createCharacter(character);
    }

    async getCharacterById(id: number) {
        return this.characterRepository.getCharacterById(id);
    }

    async getAllCharacters() {
        return this.characterRepository.getAllCharacters();
    }

    async updateCharacter(id: number, character: Partial<TCharacterValidator.TCharacterInsert>) {
        await this.characterRepository.updateCharacter(id, character);
    }

    async deleteCharacter(id: number) {
        await this.characterRepository.deleteCharacter(id);
    }

    async createCharacterInstruction(characterInstruction: TCharacterEntity.TCharacterInstructionInsert) {
        await this.characterRepository.createCharacterInstruction(characterInstruction);
    }

    async updateCharacterInstruction(id: number, characterInstruction: Partial<TCharacterEntity.TCharacterInstructionInsert>) {
        await this.characterRepository.updateCharacterInstruction(id, characterInstruction);
    }

    async deleteCharacterInstruction(id: number) {
        await this.characterRepository.deleteCharacterInstruction(id);
    }

    async createCharacterImage(characterImage: TCharacterEntity.TCharacterImageInsert) {
        await this.characterRepository.createCharacterImage(characterImage);
    }

    async updateCharacterImage(id: number, characterImage: Partial<TCharacterEntity.TCharacterImageInsert>) {
        await this.characterRepository.updateCharacterImage(id, characterImage);
    }

    async deleteCharacterImage(id: number) {
        await this.characterRepository.deleteCharacterImage(id);
    }

    async createCharacterPersona(characterPersona: TCharacterEntity.TCharacterPersonaInsert) {
        await this.characterRepository.createCharacterPersona(characterPersona);
    }

    async updateCharacterPersona(id: number, characterPersona: Partial<TCharacterEntity.TCharacterPersonaInsert>) {
        await this.characterRepository.updateCharacterPersona(id, characterPersona);
    }

    async deleteCharacterPersona(id: number) {
        await this.characterRepository.deleteCharacterPersona(id);
    }

    async createCharacterWithRelations(data: TCharacterValidator.TCreateCharacterWithRelations) {
        return this.characterRepository.createCharacterWithRelations(data);
    }

    async updateCharacterWithRelations(data: TCharacterValidator.TUpdateCharacterWithRelations) {
        await this.characterRepository.updateCharacterWithRelations(data);
    }


    async createPersonaWithTranslation(persona: TCharacterValidator.TCreatePersonaWithTranslation) {
        const output = await this.characterRepository.createPersonaWithTranslation(persona)

        EventBus.emit(ENUM_CHARACTER_EVENTS.CHARACTER_CREATED, {
            type: ENUM_CHARACTER_EVENTS.CHARACTER_CREATED,
            input: persona,
            output,
            data: output
        })

        return output;

    }


    async updatePersonaWithTranslation(data: TCharacterValidator.TUpdatePersonaForm) {
        await this.characterRepository.updatePersonaWithTranslation(data)
    }

    async createCharacterInstructionWithTranslations(data: TCharacterValidator.TCreateCharacterInstructionWithTranslation) {
        return this.characterRepository.createCharacterInstructionWithTranslations(data);
    }

    async updateCharacterInstructionWithTranslations(data: TCharacterValidator.TUpdateCharacterInstructionWithTranslation) {
        await this.characterRepository.updateCharacterInstructionWithTranslations(data);
    }

    async updateCharacterImageWithData(data: TCharacterValidator.TUpdateCharacterImage) {
        await this.characterRepository.updateCharacterImageWithData(data);
    }
}