import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const URL = "http://localhost:3030";

export const Room = ({ name, localVideoTrack, localAudioTrack }) => {
    const socketRef = useRef(null);

    const sendingPcRef = useRef(null);
    const receivingPcRef = useRef(null);

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    const [lobby, setLobby] = useState(true);

    useEffect(() => {
        if (localVideoRef.current && localVideoTrack) {
            const stream = new MediaStream([localVideoTrack]);
            localVideoRef.current.srcObject = stream;
            localVideoRef.current.play();
        }
    }, [localVideoTrack]);


    useEffect(() => {
        const socket = io(URL);
        socketRef.current = socket;

        socket.on("send-offer", async ({ roomId }) => {
            setLobby(false);

            const pc = new RTCPeerConnection();
            sendingPcRef.current = pc;

            if (localVideoTrack) pc.addTrack(localVideoTrack);
            if (localAudioTrack) pc.addTrack(localAudioTrack);

            pc.onicecandidate = (e) => {
                if (e.candidate) {
                    socket.emit("add-ice-candidate", {
                        roomId,
                        type: "sender",
                        candidate: e.candidate
                    });
                }
            };

            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);

            socket.emit("offer", {
                roomId,
                sdp: offer
            });
        });


        socket.on("offer", async ({ roomId, sdp }) => {
            setLobby(false);

            const pc = new RTCPeerConnection();
            receivingPcRef.current = pc;

            const remoteStream = new MediaStream();
            remoteVideoRef.current.srcObject = remoteStream;

            pc.ontrack = (event) => {
                remoteStream.addTrack(event.track);
            };

            pc.onicecandidate = (e) => {
                if (e.candidate) {
                    socket.emit("add-ice-candidate", {
                        roomId,
                        type: "receiver",
                        candidate: e.candidate
                    });
                }
            };

            await pc.setRemoteDescription(sdp);
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);

            socket.emit("answer", {
                roomId,
                sdp: answer
            });
        });

        socket.on("answer", async ({ sdp }) => {
            const pc = sendingPcRef.current;
            if (!pc) return;

            await pc.setRemoteDescription(sdp);
        });


        socket.on("add-ice-candidate", ({ candidate, type }) => {
            if (!candidate) return;

            if (type === "sender") {
                receivingPcRef.current?.addIceCandidate(candidate);
            } else {
                sendingPcRef.current?.addIceCandidate(candidate);
            }
        });

        socket.on("lobby", () => {
            setLobby(true);
        });

        return () => {
            socket.disconnect();
        };
    }, [localVideoTrack, localAudioTrack]);

    return (
        <div>
            <h2>Hi {name}</h2>

            <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                width={601}
            />

            {lobby && <p>Waiting to connect…</p>}

            <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                width={601}
            />
        </div>
    );
};



