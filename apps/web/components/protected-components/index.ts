import { clientWithType } from "@web/lib/api-client"
import { cookies } from "next/headers"

export async function getSessionOnServerComponent() {
    try {
        const tokenCookie = (await cookies()).get('token')?.value || ""
        const sessionResponse = await clientWithType.auth["get-session-with-token"].$post({
            json: {
            token: tokenCookie
        }
        })
        return await sessionResponse.json()
    } catch (error) {
        console.log('error', error)
        return null
    }
}