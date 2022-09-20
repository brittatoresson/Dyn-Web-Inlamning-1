import { useState } from "react";

interface Stream {
    active: boolean;
    id: string;
    onactive?: null | {};
    onaddtrack: null | {};
    oninactive?: null | {};
    onremovetrack: null | {};
}

function MediaDevices() {
    const [stream, setStream] = useState<any>();
    const [savedPhoto, setSavedPhoto] = useState<any>();
    const constraints = {
        audio: false,
        video: true,
    };

    function startcamera() {
        let video = document.getElementById("video") as HTMLVideoElement;
        navigator.mediaDevices
            .getUserMedia(constraints)
            .then((MediaStream) => {
                setStream(MediaStream);
                //get video element
                video.srcObject = MediaStream;
                //set aoutplay to true
                video.autoplay = true;
            })
            .catch((error) => {
                console.log(error);
            });
    }

    function takePicture() {
        let video = document.getElementById("video") as HTMLVideoElement;
        let photo = document.getElementById("photo");
        let canvas = document.getElementById("canvas") as HTMLCanvasElement;
        // hämta URL:en?
        const data = canvas.toDataURL("image/png");
        //oklart vad som händer här
        const context = canvas.getContext("2d");
        context?.drawImage(video, 0, 0, 100, 100);
        // sätt src till  "data"
        photo?.setAttribute("src", data);
        setSavedPhoto(data);
    }

    async function sendToDb() {
        let userID: string | undefined | null = localStorage.getItem("user-id");
        userID = userID?.substring(1, userID.length - 1);
        let photoObj = { savedPhoto, userID };
        console.log(userID);
        const response = await fetch("http://localhost:5555/api/photodb", {
            method: "POST",
            body: JSON.stringify(photoObj),
            headers: { "Content-Type": "application/json" },
        });
        // const data = await response.json();
    }

    function stopMedia() {
        stream.getTracks().forEach((mediaTrack: { stop: () => void }) => {
            mediaTrack.stop();
        });
    }

    return (
        <section>
            <video width="750" height="500" controls id="video"></video>
            <source src={stream} type="video/mp4" />
            <button onClick={startcamera}>Start </button>
            <button id="photoBtn" onClick={takePicture}>
                Take photo
            </button>
            <button onClick={sendToDb}>Save photo</button>
            <button onClick={stopMedia}>Close</button>
            <div id="photo"></div>
            <canvas id="canvas">
                <img id="photo" />
            </canvas>
        </section>
    );
}
export default MediaDevices;
