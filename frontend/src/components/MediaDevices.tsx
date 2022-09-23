import filterFunction from "./Filter";
import { useState, useEffect, ChangeEvent } from "react";

function MediaDevices() {
    const [savedPhoto, setSavedPhoto] = useState<any>();
    const [viewPhoto, setViewPhoto] = useState<boolean>(false);

    const canvas = document.getElementById("canvas") as HTMLCanvasElement;

    const filterArray = ["grayscale(100%)", "hue-rotate(90deg)", "low_fi", "old"];
    const [filter, setFilter] = useState("");

    function startCamera() {
        const video = document.getElementById("video") as HTMLVideoElement;
        navigator.mediaDevices
            .getUserMedia({ audio: false, video: true })
            .then((MediaStream) => {
                //get video element
                video.srcObject = MediaStream;
                //set aoutplay to true
                video.autoplay = true;
            })
            .catch((error) => {
                console.log(error);
            });
    }

    async function takePicture() {
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;
        const video = document.getElementById("video") as HTMLVideoElement;
        const context: any = canvas.getContext("2d");
        if (context) {
            let findFilter: string | undefined = filterArray.find((f) => f == filter);
            filterFunction(findFilter, context);
        }
        context?.drawImage(video, 0, 0, 340, 260);
        const image = canvas.toDataURL("image/jpeg");
        setSavedPhoto(image);
        setViewPhoto(true);
    }

    async function sendToDb() {
        let userID: string | undefined | null = localStorage.getItem("user-id");
        userID = userID?.substring(1, userID.length - 1);
        let photoObj = { savedPhoto, userID };
        const response = await fetch("http://localhost:5555/api/photodb", {
            method: "POST",
            body: JSON.stringify(photoObj),
            headers: { "Content-Type": "application/json" },
        });
    }

    useEffect(() => {
        startCamera();
    }, []);

    useEffect(() => {
        if (savedPhoto !== undefined) {
            sendToDb();
        }
    }, [savedPhoto]);

    //   function clearphoto() {
    //     const context: CanvasRenderingContext2D | null = canvas.getContext("2d");
    //     if (context) {
    //       context.fillStyle = "#FFF";
    //       context.fillRect(0, 0, canvas.width, canvas.height);
    //     }
    //   }

    return (
        <section>
            <article className={viewPhoto ? "toggle-visibility" : "vid-margin"}>
                <video
                    width="750"
                    height="500"
                    id="video"
                    className={
                        filter === "grayscale(100%)"
                            ? "gray"
                            : filter === "hue-rotate(90deg)"
                            ? "hue"
                            : filter === "old"
                            ? "old"
                            : filter === "low_fi"
                            ? "low_fi"
                            : ""
                    }
                ></video>
                <button id="photoBtn" onClick={takePicture}>
                    Take photo
                </button>
            </article>
            <canvas
                width="340"
                height="260"
                id="canvas"
                className={!viewPhoto ? "toggle-visibility" : ""}
            >
                <img id="photo" />
            </canvas>
            <button
                className={!viewPhoto ? "toggle-visibility" : ""}
                onClick={() => {
                    setViewPhoto(false);
                    //   clearphoto();
                }}
            >
                Fånga ett nytt ögonblick
            </button>

            <select
                id="filter"
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilter(e.target.value)}
            >
                <option value=""> </option>
                <option value="grayscale(100%)"> Grey </option>
                <option value="hue-rotate(90deg)"> Hue </option>
                <option value="low_fi"> Low-fi </option>
                <option value="old"> Old </option>
            </select>
        </section>
    );
}
export default MediaDevices;
