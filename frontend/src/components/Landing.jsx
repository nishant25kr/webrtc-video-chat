import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Room } from "./Room";

const Landing = () => {

    const navigate = useNavigate()
    const [name, setName] = useState("")
    const [joined, setJoined] = useState(false)
    const [localVideoTrack, setLocalVideoTrack] = useState()
    const [localAudioTrack, setLocalAudioTrack] = useState()
    const videoRef = useRef(null)

    const getCam = async () => {

        const stream = await window.navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        })

        const audioTrack = stream.getAudioTracks()[0]
        const videoTrack = stream.getVideoTracks()[0]

        setLocalAudioTrack(audioTrack)
        setLocalVideoTrack(videoTrack)

        if (!videoRef.current) {
            return;
        }

        videoRef.current.srcObject = new MediaStream([videoTrack])
        videoRef.current.play();

    }

    useEffect(() => {
        if (videoRef && videoRef.current) {
            getCam()
        }
    }, [videoRef])

    if(!joined){

    return (
        <div>
            <video autoPlay ref={videoRef}></video>
            name <br />
            <input type="text" onChange={(e) => setName(e.target.value)} />

            <button onClick={() => {
                setJoined(true)
            }}>
                JOIN
            </button>

        </div>
    )        
    }


    return(
        <Room name={name} localVideoTrack={localVideoTrack} localAudioTrack={localAudioTrack}/>
    )
}

export default Landing;