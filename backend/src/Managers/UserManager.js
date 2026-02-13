import { RoomManager } from "./RoomManager.js";

export class UserManager {
    #users;
    #queue;
    #roomManager;

    constructor() {
        this.#users = [];
        this.#queue = [];
        this.#roomManager = new RoomManager();
    }

    addUser(name, socket) {
        this.#users.push({ name, socket });
        this.#queue.push(socket.id);

        socket.emit("lobby");
        this.clearQueue();
        this.initHandlers(socket);
    }

    clearQueue() {
        if(this.#queue.length > 100){
            return;
        }

        if (this.#queue.length < 2) return;

        const id1 = this.#queue.shift();
        const id2 = this.#queue.shift();

        const user1 = this.#users.find(u => u.socket.id === id1);
        const user2 = this.#users.find(u => u.socket.id === id2);

        if (!user1 || !user2) return;

        this.#roomManager.createRoom(user1, user2);
    }

    initHandlers(socket) {
        socket.on("offer", ({ sdp, roomId }) => {
            this.#roomManager.onOffer(roomId, sdp, socket.id);
        });

        socket.on("answer", ({ sdp, roomId }) => {
            this.#roomManager.onAnswer(roomId, sdp, socket.id);
        });

        socket.on("add-ice-candidate", ({ candidate, roomId }) => {
            this.#roomManager.onIceCandidate(
                roomId,
                socket.id,
                candidate
            );
        });

        socket.on("next", () => {
            this.#roomManager.removeUserFromRoom(socket.id);
            this.#queue.push(socket.id);
            socket.emit("lobby");
            this.clearQueue();
        });

    }
}
