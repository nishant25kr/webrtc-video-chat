let GLOBAL_ROOMID = 1;

export class RoomManager{
    #rooms;
    constructor(){
        this.#rooms = new Map();
    }

    createRoom(user1, user2){
        const roomId = this.generate_roomId();
        
        this.#rooms.set(roomId,{
            user1,
            user2
        })

        user1?.socket.emit("send-offer",{
            roomId
        })


    }
    onOffer(roomId,sdp){
        const user2 = this.#rooms.get(roomId).user1
        user2.socket.emit("offer",{
            sdp
        })


    }

    onAnswer(roomId,sdp){
        const user1 = this.#rooms.get(roomId).user1
        user1.socket.emit("offer",{
            sdp
        })
    }

    generate_roomId(){
        return GLOBAL_ROOMID++;
    }
}