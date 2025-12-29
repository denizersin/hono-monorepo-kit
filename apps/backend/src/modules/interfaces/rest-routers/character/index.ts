import { zValidator } from "@hono/zod-validator"
import { SahredEnums } from "@repo/shared/enums"
import { characterValidator } from "@repo/shared/validators"
import { createSuccessResponse } from "@server/lib/errors"
import { createHonoApp } from "@server/lib/hono/hono-factory"
import { getApiContext } from "@server/lib/context"
import { EventBus } from "@server/modules/application/event"
import { TGlobalEvents } from "@server/modules/application/event/interface"
import { ENUM_CHARACTER_EVENTS } from "@server/modules/application/event/interface/character"
import { CharacterService } from "@server/modules/application/services/character/CharacterService"
import { CharacterRepositoryImpl } from "@server/modules/infrastructure/repositories/character/CharacterRepositoryImpl"
import { honoPublicCompanyMiddleware } from "@server/modules/shared/middlewares/auth"
import { honoRoleMiddleware } from "@server/modules/shared/middlewares/role"


const characterService = new CharacterService(new CharacterRepositoryImpl())

const characterApp = createHonoApp()
    .post('/persona/create',
        honoRoleMiddleware([SahredEnums.Role.OWNER, SahredEnums.Role.ADMIN]),
        honoPublicCompanyMiddleware,
        zValidator('json', characterValidator.createPersonaWithTranslationSchema),
        async (c) => {
            const data = c.req.valid('json')


            return c.json(createSuccessResponse({
                message: 'Persona created successfully',
                data: await characterService.createPersonaWithTranslation(data)
            }))
        })





export default characterApp