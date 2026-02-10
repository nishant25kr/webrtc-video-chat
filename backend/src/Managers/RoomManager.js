let GLOBAL_ROOMID = 1;

export class RoomManager{
    #rooms;
    constructor(){
        this.#rooms = new Map();
    }

    createRoom(user1, user2){
        console.log("inside creating room ")

        const roomId = this.generate_roomId().toString();
        
        this.#rooms.set(roomId,{
            user1,
            user2
        })

        user1?.socket.emit("send-offer",{
            roomId
        })


    }

    deleteRoom(roomId){
        const room = this.#rooms.find(x=> x.roomId === roomId)
        console.log("user left from this room ",room)

        // if()
    }
    onOffer(roomId,sdp){
        const user2 = this.#rooms.get(roomId).user2 
        user2.socket.emit("offer",{
            sdp,
            roomId
        })


    }

    onAnswer(roomId,sdp){
        const user1 = this.#rooms.get(roomId).user1
        user1.socket.emit("answer",{
            sdp,
            roomId
        })
    }

    generate_roomId(){
        return GLOBAL_ROOMID++;
    }




}