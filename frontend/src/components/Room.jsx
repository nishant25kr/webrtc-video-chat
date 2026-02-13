import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const URL = import.meta.env.VITE_API_URL;

const pcConfig = {
    iceServers: [
        { urls: "stun:stun.l.google.com:19302" }
    ]
};

export const Room = ({ name, localVideoTrack, localAudioTrack }) => {
    const socketRef = useRef(null);
    const sendingPcRef = useRef(null);
    const receivingPcRef = useRef(null);

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    const [lobby, setLobby] = useState(true);
    const [connectionStatus, setConnectionStatus] = useState("connecting");

    const cleanupConnection = () => {
        sendingPcRef.current?.close();
        receivingPcRef.current?.close();

        sendingPcRef.current = null;
        receivingPcRef.current = null;

        if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = null;
        }

        setLobby(true);
        setConnectionStatus("searching");
    };

    const handleNext = () => {
        cleanupConnection();
        socketRef.current.emit("next");
    };

    useEffect(() => {
        if (localVideoRef.current && localVideoTrack) {
            const stream = new MediaStream([localVideoTrack]);
            localVideoRef.current.srcObject = stream;
            localVideoRef.current.play().catch(() => { });
        }
    }, [localVideoTrack]);

    useEffect(() => {
        const socket = io(URL);
        socketRef.current = socket;

        socket.on("send-offer", async ({ roomId }) => {
            setLobby(false);
            setConnectionStatus("connected");

            const pc = new RTCPeerConnection(pcConfig);
            sendingPcRef.current = pc;

            const remoteStream = new MediaStream();
            remoteVideoRef.current.srcObject = remoteStream;

            pc.ontrack = (event) => {
                remoteStream.addTrack(event.track);
                remoteVideoRef.current?.play().catch(() => { });
            };

            if (localVideoTrack) pc.addTrack(localVideoTrack);
            if (localAudioTrack) pc.addTrack(localAudioTrack);

            pc.onicecandidate = (e) => {
                if (!e.candidate) return;
                socket.emit("add-ice-candidate", {
                    roomId,
                    candidate: e.candidate
                });
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
            setConnectionStatus("connected");

            const pc = new RTCPeerConnection(pcConfig);
            receivingPcRef.current = pc;

            if (localVideoTrack) pc.addTrack(localVideoTrack);
            if (localAudioTrack) pc.addTrack(localAudioTrack);

            const remoteStream = new MediaStream();
            remoteVideoRef.current.srcObject = remoteStream;

            pc.ontrack = (event) => {
                remoteStream.addTrack(event.track);
                remoteVideoRef.current?.play().catch(() => { });
            };

            pc.onicecandidate = (e) => {
                if (!e.candidate) return;
                socket.emit("add-ice-candidate", {
                    roomId,
                    type: "receiver",
                    candidate: e.candidate
                });
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

            try {
                if (type === "sender") {
                    receivingPcRef.current?.addIceCandidate(candidate);
                } else {
                    sendingPcRef.current?.addIceCandidate(candidate);
                }
            } catch (err) {
                console.error("ICE error", err);
            }
        });

        socket.on("lobby", () => {
            setLobby(true);
            setConnectionStatus("searching");
        });

        return () => {
            socket.disconnect();
        };
    }, [localVideoTrack, localAudioTrack]);

    return (
        <div className="min-h-screen bg-black flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-900 to-blue-900 px-6 py-4 shadow-lg">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                        <h1 className="text-white font-semibold text-lg">
                            ChatRoulette
                        </h1>
                        <span className="text-white/60 text-sm">• {name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        {connectionStatus === "connected" && (
                            <span className="text-green-400 text-sm flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                Connected
                            </span>
                        )}
                        {connectionStatus === "searching" && (
                            <span className="text-yellow-400 text-sm flex items-center gap-2">
                                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                                Searching...
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Video Container */}
            <div className="flex-1 flex flex-col lg:flex-row">
                {/* Stranger Video */}
                <div className="flex-1 relative bg-gray-900 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-gray-800">
                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                    />

                    {lobby && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-sm">
                            <div className="text-center">
                                <div className="mb-6">
                                    <div className="relative">
                                        <div className="w-20 h-20 mx-auto border-4 border-blue-500/30 rounded-full"></div>
                                        <div className="w-20 h-20 mx-auto border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0 left-1/2 -translate-x-1/2"></div>
                                    </div>
                                </div>
                                <h3 className="text-white text-2xl font-semibold mb-2">
                                    Looking for someone...
                                </h3>
                                <p className="text-white/60 text-sm">
                                    We're connecting you with a random stranger
                                </p>
                            </div>
                        </div>
                    )}

                    {!lobby && (
                        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-2 rounded-lg">
                            <p className="text-white text-sm font-medium">Stranger</p>
                        </div>
                    )}
                </div>

                {/* Your Video */}
                <div className="flex-1 relative bg-gray-900 flex items-center justify-center">
                    <video
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                    />

                    <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-2 rounded-lg">
                        <p className="text-white text-sm font-medium">You ({name})</p>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-gray-900 border-t border-gray-800 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-center gap-4">
                    <button
                        onClick={handleNext}
                        className="group relative px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transition-all transform hover:scale-105 active:scale-95"
                    >
                        <span className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                            </svg>
                            Next Stranger
                        </span>
                    </button>

                    <button
                        className="px-6 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-medium rounded-xl transition-all hover:border-red-500/50"
                        onClick={() => window.location.reload()}
                    >
                        End Chat
                    </button>
                </div>

                <p className="text-center text-white/40 text-xs mt-3">
                    Press "Next" to connect with a new stranger • Be respectful
                </p>
            </div>
        </div>
    );
};