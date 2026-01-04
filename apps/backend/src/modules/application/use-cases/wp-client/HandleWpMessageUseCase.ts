import { WhatsappService } from "@server/modules/application/services/whatsapp"
// import TWpClientValidator from "node_modules/@repo/shared/dist/dto/validators/wp-client"

export class HandleWpMessageUseCase {
    constructor(private readonly whatsappService: WhatsappService) { }

    // async execute(data: TWpClientValidator.THandleMessage) {
    //     // if (data.body.includes(APP_CONSTANTS.APP_BUNDLE_ID)) {
    //     // }
    //     return this.handleMessage(data)

    // }



    // async handleMessage(data: TWpClientValidator.THandleMessage) {
    //     return
    // }

}