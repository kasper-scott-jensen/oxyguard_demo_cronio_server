import WebSocket, { WebSocketServer } from 'ws'

export const wss = new WebSocketServer({ port: process.env.SOCKET })

wss.on('connection', (ws) => {
    ws.on('message', (msg) => {
        console.log(msg)
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(msg)
            }
        })
    })
})
