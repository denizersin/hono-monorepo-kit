import { ENV } from "@server/env"

export class WhatsappService {


    constructor() { }
    sendMessage: ({
        message,
        id
    }: {
        message: string,
        id: string
    }) => Promise<void> = async ({ message, id }) => {
        await fetch(`${ENV.WP_CLIENT_URL}/send-plaintext`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ENV.WP_CLIENT_API_KEY}`
            },
            body: JSON.stringify({
                message,
                id,
            })
        })
    }

    getWhatsappPhoneId: ({
        phoneCode,
        phoneNumber
    }: {
        phoneCode: string,
        phoneNumber: string
    }) => string = ({ phoneCode, phoneNumber }) => {
        return `${phoneCode}${phoneNumber}@c.us`
    }

}