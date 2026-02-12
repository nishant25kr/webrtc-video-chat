let GLOBAL_ROOMID = 1;

export class RoomManager {
    #rooms;
    constructor() {
        this.#rooms = new Map();
    }

    createRoom(user1, user2) {
        // console.log("inside creating room ")

        const roomId = this.generate_roomId().toString();

        this.#rooms.set(roomId, {
            user1,
            user2
        })

        user1?.socket.emit("send-offer", {
            roomId
        })
    }

    deleteRoom(roomId) {
        const room = this.#rooms.find(x => x.roomId === roomId)
        console.log("user left from this room ", room)


    }

    onOffer(roomId, sdp, senderSocketId) {

        const room = this.#rooms.get(roomId)

        if(!room){return ;}

        const receivingUser = room.user1.socket.id === senderSocketId ? room.user2: room.user1;

        receivingUser.socket.emit("offer", {
            roomId,
            sdp
        })
    }

    onAnswer(roomId, sdp, senderSocketId) {
        const room = this.#rooms.get(roomId)

        const receivingUser = room.user1.socket.id === senderSocketId ? room.user2: room.user1;
        receivingUser.socket.emit("answer", {
            sdp,
            roomId
        })
    }

    onIceCandidate(roomId, socketId, candidate, type) {

        const room = this.#rooms.get(roomId)
        if (!room) {
            return;
        }

        const receivingUser = room.user1.socket.id === socketId ? room.user2 : room.user1;
        receivingUser.socket.emit("add-ice-candidate", ({candidate, type }))

    }

    generate_roomId() {
        return GLOBAL_ROOMID++;
    }

}