import { UpgradeWebSocket, WSEvents } from "hono/ws"

export class WebSocketService {
    private ws: UpgradeWebSocket

    constructor(ws: UpgradeWebSocket) {
        this.ws = ws
    }

    public createWebSocket(): WSEvents {
        let intervalId: NodeJS.Timeout
        return {
            onOpen(_event, ws) {
                console.log('WebSocket opened')
                intervalId = setInterval(() => {
                    ws.send('12321321' + new Date().toString())
                }, 2000)
            },
            onClose(_event, ws) {
                console.log('WebSocket closed')
                // clearInterval(intervalId)
            },
            onMessage(_event, ws) {
                console.log('WebSocket message', _event)
            },
            onError(_event, ws) {
                console.log('WebSocket error', _event)
            }
        }

    }
}