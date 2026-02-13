let GLOBAL_ROOMID = 1;

export class RoomManager {
    #rooms;

    constructor() {
        this.#rooms = new Map();
    }

    createRoom(user1, user2) {
        const roomId = this.generate_roomId().toString();

        this.#rooms.set(roomId, {
            user1,
            user2
        });

        user1.socket.emit("send-offer", { roomId });
    }

    onOffer(roomId, sdp, senderSocketId) {
        const room = this.#rooms.get(roomId);
        if (!room) return;

        const receiver =
            room.user1.socket.id === senderSocketId
                ? room.user2
                : room.user1;

        receiver.socket.emit("offer", { roomId, sdp });
    }

    onAnswer(roomId, sdp, senderSocketId) {
        const room = this.#rooms.get(roomId);
        if (!room) return;

        const receiver =
            room.user1.socket.id === senderSocketId
                ? room.user2
                : room.user1;

        receiver.socket.emit("answer", { roomId, sdp });
    }

    onIceCandidate(roomId, senderSocketId, candidate) {
        const room = this.#rooms.get(roomId);
        if (!room || !candidate) return;

        const receiver =
            room.user1.socket.id === senderSocketId
                ? room.user2
                : room.user1;

        receiver.socket.emit("add-ice-candidate", {
            candidate
        });
    }

    removeUserFromRoom(socketId) {
        for (const [roomId, room] of this.#rooms.entries()) {
            if (
                room.user1.socket.id === socketId ||
                room.user2.socket.id === socketId
            ) {
                const otherUser =
                    room.user1.socket.id === socketId
                        ? room.user2
                        : room.user1;

                otherUser.socket.emit("lobby");

                this.#rooms.delete(roomId);
                return;
            }
        }
    }


    generate_roomId() {
        return GLOBAL_ROOMID++;
    }
}
