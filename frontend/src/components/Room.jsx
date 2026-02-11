import { useEffect, useRef } from "react";
import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Socket, io } from 'socket.io-client';

const URL = "http://localhost:3030"

export const Room = ({ name, localAudioTrack, localVideoTrack }) => {

    const [socket, setSocket] = useState(null)
    const [lobby, setLobby] = useState(true);
    const sendingPc = useRef(null);
const recivingPc = useRef(null);

    const [remoteVideoTrack, setRemoteVideoTrack] = useState()
    const [remoteAudioTrack, setRemoteAudioTrack] = useState()
    const [remoteMediaStream, setRemoteMediaStream] = useState(null)
    const [isconnected, setIsconnected] = useState(true);
    const remoteVideoRef = useRef();
    const localVideoRef = useRef()

    useEffect(() => {
        //write join loggic here 
        const socket = io(URL);

        socket.on("send-offer", ({ roomId }) => {
            setLobby(false)

            const pc = new RTCPeerConnection();
            // sendingPc = pc
            sendingPc.current = pc;
            if (localVideoTrack) {
                pc.addTrack(localVideoTrack)
            }

            if (localAudioTrack) {
                pc.addTrack(localAudioTrack)
            }

            pc.onicecandidate = (e) => {
                socket.emit("add-ice-candidate", {
                    candidate: e.candidate,
                    roomId,
                    type: "sender"
                });
            }

            pc.onnegotiationneeded = async () => {
                alert("inside nego")
                const sdp = await pc.createOffer()
                pc.setLocalDescription(sdp)

                socket.emit("offer", {
                    sdp,
                    roomId,
                })
            }

        })

        socket.on("offer", async ({ roomId, remoteSdp }) => {
            setLobby(false)

            const pc = new RTCPeerConnection();
            await pc.setRemoteDescription(remoteSdp)
            const sdp = await pc.createAnswer();

            await pc.setLocalDescription(sdp)

            const stream = new MediaStream()

            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = stream
            }
            setRemoteMediaStream(stream);
            // setRecivingPc(pc)
            recivingPc.current = pc;


            pc.ontrack = (event) => {
    if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
    }
};


            socket.emit("answer", {
                roomId,
                sdp: sdp
            })
        })

        socket.on("answer", ({ roomId, remoteSdp }) => {
            setLobby(false)
            sendingPc(pc => {
                pc?.setRemoteDescription(remoteSdp)
            })
        })
        socket.on("add-ice-candidate", ({ candidate, type }) => {
            if (type == 'sender') {
                recivingPc(pc => {
                    pc?.addIceCandidate(candidate)
                    return pc;

                })
            } else {
                recivingPc(pc => {
                    pc?.addIceCandidate(candidate)
                    return pc;
                })
            }


        })

        socket.on("lobby", () => {
            setLobby(true);
        })


        setSocket(socket)
        setIsconnected(true)

        return () => {
            socket.disconnect();
        };

    }, [name])

    useEffect(() => {
        if (localVideoRef.current && localVideoTrack) {
            const stream = new MediaStream([localVideoTrack]);
            localVideoRef.current.srcObject = stream;
            localVideoRef.current.play();
        }
    }, [localVideoTrack]);




    return (
        <div>
            HI {name}
            <video autoPlay width={400} height={400} ref={localVideoRef} />
            {lobby ? "waiting to connect to someone" : null}
<video autoPlay playsInline ref={remoteVideoRef} />


        </div>
    )
}