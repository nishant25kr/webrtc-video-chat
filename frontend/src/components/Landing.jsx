import { useEffect, useRef, useState } from "react";
import { Room } from "./Room";

const Landing = () => {
    const [name, setName] = useState("");
    const [joined, setJoined] = useState(false);
    const [localVideoTrack, setLocalVideoTrack] = useState(null);
    const [localAudioTrack, setLocalAudioTrack] = useState(null);
    const [permissionError, setPermissionError] = useState(false);
    const videoRef = useRef(null);

    const getCam = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });

            const videoTrack = stream.getVideoTracks()[0];
            const audioTrack = stream.getAudioTracks()[0];

            setLocalVideoTrack(videoTrack);
            setLocalAudioTrack(audioTrack);
            setPermissionError(false);

            if (videoRef.current) {
                videoRef.current.srcObject = new MediaStream([videoTrack]);
                await videoRef.current.play();
            }
        } catch (err) {
            console.error("Error accessing camera/mic:", err);
            setPermissionError(true);
        }
    };

    useEffect(() => {
        getCam();

        return () => {
            if (localVideoTrack) localVideoTrack.stop();
            if (localAudioTrack) localAudioTrack.stop();
        };
    }, []);

    if (!joined) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
                <div className="max-w-md w-full">
                    {/* Logo/Title */}
                    <div className="text-center mb-8">
                        <h1 className="text-5xl font-bold text-white mb-2">
                            ChatRoulette
                        </h1>
                        <p className="text-blue-200 text-sm">
                            Connect with strangers around the world
                        </p>
                    </div>

                    {/* Video Preview Card */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
                        <div className="relative mb-6 rounded-xl overflow-hidden bg-gray-900 aspect-video">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover"
                            />
                            
                            {permissionError && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/90 text-white p-4">
                                    <svg className="w-16 h-16 mb-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                                    </svg>
                                    <p className="text-center text-sm mb-3">
                                        Camera access is required
                                    </p>
                                    <button
                                        onClick={getCam}
                                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm transition-colors"
                                    >
                                        Grant Permission
                                    </button>
                                </div>
                            )}

                            {!permissionError && !localVideoTrack && (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-900/90">
                                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                                </div>
                            )}
                        </div>

                        {/* Name Input */}
                        <div className="mb-6">
                            <label className="block text-white text-sm font-medium mb-2">
                                What should we call you?
                            </label>
                            <input
                                type="text"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                                maxLength={20}
                            />
                        </div>

                        {/* Join Button */}
                        <button
                            disabled={!name.trim() || !localVideoTrack || !localAudioTrack}
                            onClick={() => setJoined(true)}
                            className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg transition-all transform hover:scale-[1.02] disabled:scale-100 disabled:opacity-50"
                        >
                            {!localVideoTrack || !localAudioTrack ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Setting up camera...
                                </span>
                            ) : (
                                "Start Chatting"
                            )}
                        </button>
                    </div>

                    {/* Info Text */}
                    <p className="text-center text-white/60 text-xs mt-6">
                        By joining, you agree to be respectful and follow community guidelines
                    </p>
                </div>
            </div>
        );
    }

    return (
        <Room
            name={name}
            localVideoTrack={localVideoTrack}
            localAudioTrack={localAudioTrack}
        />
    );
};

export default Landing;