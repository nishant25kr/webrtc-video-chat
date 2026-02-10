import { useEffect } from "react";
import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Socket, io } from 'socket.io-client';

const URL = "http://localhost:3030"
export const Room = () => {
    const [socket, setSocket] = useState(null)
    const [searchParam, setSearchParam] = useSearchParams();
    const name = searchParam.get("name")
    const [isconnect, setIsconnected] = useState(false)
    const [lobby,setLobby] = useState(true);



    useEffect(() => {
        //write join loggic here 
        const socket = io(URL);

        socket.on("send-offer", ({ roomId }) => {
            setLobby(false)
            alert("send offer plz")
            socket.emit("offer", {
                roomId,
                sdp: ""
            })
        })
        socket.on("offer", ({ roomId, offer }) => {
            alert("send answer plz")
            // socket.emit("answer", {
            //     roomId,
            //     sdp: ""
            // })
        })
        socket.on("answer", ({ roomId, answer }) => {

            setLobby(false)
            alert("connnection done")

        })

        socket.on("lobby",()=>{
            setLobby(true);
        })


        setSocket(socket)
        setIsconnected(true)
    }, [name])

    if(lobby){
        return(
            <>
            inlobby

            waiting to connect to someone
            
            </>
        )
    }




    return (
        <div>
            helo{name}
            <video width={400} height={400}/>
            <video width={400} height={400}/>

        </div>
    )
}