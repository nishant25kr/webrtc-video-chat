import express from "express"
import http from "http"
import { Server } from "socket.io"

const PORT = 3030

const app = express()

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "*"
    }
})

io.on("connection", (socket) => {
    console.log("User connected:", socket.id)
})

server.listen(PORT, () => {
    console.log("Server running on", PORT)
})
