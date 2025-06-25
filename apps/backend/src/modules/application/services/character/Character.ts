import { TCharacterValidator } from "@repo/shared/validators";
import { ICharacterRepository } from "@server/modules/domain/repositories/ICharacterRepository";

export class CharacterService {
    constructor(private readonly characterRepository: ICharacterRepository) { }

    async createCharacter(character: TCharacterValidator.TCharacterInsert) {
        await this.characterRepository.createCharacter(character);
    }
    async createCharacterAsAdmin(character: TCharacterValidator.TAdminCreateCharacterSchema) {
        await this.createCharacter(character)
    }
    async createCharacterAsUser(character: TCharacterValidator.TUserCreateCharacterSchema) {
        await this.createCharacter({
            ...character,
            adminInstruction: ''
        })
    }
}