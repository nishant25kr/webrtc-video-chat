import express from "express"
import http from "http"
import { Server } from "socket.io"
import {UserManager} from "./Managers/UserManager.js"
const PORT = 3030

const app = express()

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "*"
    }
})
const userManager = new UserManager()

io.on("connection", (socket) => {
    console.log("User connected:", socket.id)
    userManager.addUser("nishant", socket)
})

server.listen(PORT, () => {
    console.log("Server running on", PORT)
})
