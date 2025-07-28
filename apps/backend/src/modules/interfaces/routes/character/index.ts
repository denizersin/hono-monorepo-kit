import { zValidator } from "@hono/zod-validator"
import { SahredEnums } from "@repo/shared/enums"
import { characterValidator } from "@repo/shared/validators"
import { createSuccessResponse } from "@server/lib/errors"
import { createHonoApp } from "@server/lib/hono/hono-factory"
import { getApiContext } from "@server/lib/hono/utils"
import { EventBus } from "@server/modules/application/event"
import { TGlobalEvents } from "@server/modules/application/event/interface"
import { ENUM_CHARACTER_EVENTS } from "@server/modules/application/event/interface/character"
import { CharacterService } from "@server/modules/application/services/character/Character"
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

            const output = await characterService.createPersonaWithTranslation(data)


            const ctx = getApiContext();


            //suppose we are on service 1
            ctx.updateContextData((curr: TGlobalEvents['CHARACTER_CREATED']['contextData']) => {
                curr.service1 = {
                    moreField1: 'qwe',
                    moreField2: 'asd'
                }
            })

            //!TODO: we may define an zod schema for the context data and validate it before emitting the event (is it overengineering?)

            EventBus.emit('CHARACTER_CREATED', {
                type: ENUM_CHARACTER_EVENTS.CHARACTER_CREATED,
                input: data,
                output: {},
                thisIsCharacterCreated: true,
                ctx: ctx as TGlobalEvents['CHARACTER_CREATED']['props']['ctx'],

            })



            return c.json(createSuccessResponse({
                message: 'Persona created successfully',
                data: {}
            }))
        })





export default characterApp