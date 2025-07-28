import honoFactory, { createHonoApp } from "@server/lib/hono/hono-factory"
import { WebSocketService } from "@server/modules/application/services/websocket/WebSocket"

import { UpgradeWebSocket } from "hono/ws"




export const createWebSocketRoute = (ws: UpgradeWebSocket) => createHonoApp()
    .get('/panel-events',

        ws((c) => {
            const webSocket = new WebSocketService(ws)
            return webSocket.createWebSocket()
        })

    )
