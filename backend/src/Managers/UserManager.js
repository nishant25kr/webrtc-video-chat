import { RoomManager } from "./RoomManager.js";

export class UserManager {
    #users;
    #queue
    #roomManager

    constructor() {
        this.#users = [];
        this.#queue = [];
        this.#roomManager = new RoomManager();
    }

    addUser(name, socket) {
        this.#users.push(
            { name, socket }
        )
        this.#queue.push(socket.id);
        socket.send("lobby")
        this.clearQueue(socket)
        this.initHandlers(socket)
    }

    removeUser(socketId) {
        const user = this.#users.find(x => x.socket.id === socketId)
        if(!user){

        }
        this.#users = this.#users.filter(x => x.socket.id !== socketId)
        this.#queue.filter(x => x.id === socketId)
    }

    clearQueue(socket) {
        // console.log("inside clear")
        // console.log(this.#queue.length)        
        
        if (this.#queue.length < 2) return;
        // console.log(this.#queue.length)
        
        const id1 = this.#queue.pop()
        const id2 = this.#queue.pop()
        const user1 = this.#users.find(x => x.socket.id === id1)
        const user2 = this.#users.find(x => x.socket.id === id2)

        // console.log(user1)
        // console.log(user2)

        if (!user1 || !user2) {
            return;
        }


        const room = this.#roomManager.createRoom(user1, user2);

        this.clearQueue(socket)

    }

    initHandlers(socket) {
        socket.on("offer", ({ sdp, roomId }) => {
            console.log("inside offer")
            this.#roomManager.onOffer(roomId, sdp, socket.id);
        })
        socket.on("answer", ({ sdp, roomId }) => {
            console.log("inside offer answer")
            this.#roomManager.onAnswer(roomId, sdp, socket.id);
        })
        socket.on("add-ice-candidate",({candidate, roomId, type})=>{
            this.#roomManager.onIceCandidate(roomId, socket.id, candidate, type) 
        })
    }



}