import { useEffect, useRef, useState } from "react";
import { Room } from "./Room";

const Landing = () => {
    const [name, setName] = useState("");
    const [joined, setJoined] = useState(false);
    const [localVideoTrack, setLocalVideoTrack] = useState(null);
    const [localAudioTrack, setLocalAudioTrack] = useState(null);

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

            if (videoRef.current) {
                videoRef.current.srcObject = new MediaStream([videoTrack]);
                await videoRef.current.play();
            }
        } catch (err) {
            console.error("Error accessing camera/mic:", err);
            alert("Please allow camera and microphone access");
        }
    };

    // Get camera on mount
    useEffect(() => {
        getCam();

        return () => {
            if (localVideoTrack) localVideoTrack.stop();
            if (localAudioTrack) localAudioTrack.stop();
        };

    }, []);


    if (!joined) {
        return (
            <div style={{ padding: "20px" }}>
                <h2>Join Room</h2>

                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{ width: "300px", borderRadius: "8px" }}
                />

                <div style={{ marginTop: "10px" }}>
                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <button
                    style={{ marginTop: "10px" }}
                    disabled={!name || !localVideoTrack || !localAudioTrack}
                    onClick={() => setJoined(true)}
                >
                    JOIN
                </button>
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
