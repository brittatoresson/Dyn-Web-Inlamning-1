import filterFunction from "./Filter";
import { useState, useEffect, ChangeEvent } from "react";

function MediaDevices() {
    const [savedPhoto, setSavedPhoto] = useState<any>();
    const [viewPhoto, setViewPhoto] = useState<boolean>(false);
    const [filter, setFilter] = useState("");
    const filterArray = ["gray", "blur", "low_fi", "sepia", "contrast"];
    const [isPublic] = useState<boolean>(false);

    let dateObj = {
        date: "",
        time: "",
    };

    function getDateAndTime() {
        let date: any = new Date().toString().slice(0, 16);
        let time: any = new Date().toString().slice(16, 21);
        dateObj = {
            date,
            time,
        };
        return dateObj;
    }

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
        getDateAndTime();
        let userID: string | undefined | null = localStorage.getItem("user-id");
        userID = userID?.substring(1, userID.length - 1);

        let photoObj = { savedPhoto, userID, dateObj, isPublic };

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

    return (
        <section>
            <article className={viewPhoto ? "toggle-visibility" : "vid-margin"}>
                <video
                    width="750"
                    height="500"
                    id="video"
                    className={
                        filter === "gray"
                            ? "gray"
                            : filter === "blur"
                            ? "blur"
                            : filter === "sepia"
                            ? "sepia"
                            : filter === "low_fi"
                            ? "low_fi"
                            : filter === "contrast"
                            ? "contrast"
                            : ""
                    }
                ></video>
                <button id="photoBtn" onClick={takePicture}>
                    Take photo
                </button>
            </article>
            <section id="frame" className={!viewPhoto ? "toggle-visibility" : ""}>
                <canvas
                    width="340"
                    height="260"
                    id="canvas"
                    className={!viewPhoto ? "toggle-visibility" : ""}
                >
                    <img id="photo" />
                </canvas>
            </section>
            <button
                className={!viewPhoto ? "toggle-visibility" : ""}
                onClick={() => {
                    setViewPhoto(false);
                }}
            >
                Fånga ett nytt ögonblick
            </button>
            <section className={viewPhoto ? "toggle-visibility" : "filter"}>
                <label htmlFor="filter"> Add filter</label>
                <select
                    id="filter"
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilter(e.target.value)}
                >
                    <option value=""> </option>
                    <option value="gray"> Grey </option>
                    <option value="blur"> Blur </option>
                    <option value="low_fi"> Low-fi </option>
                    <option value="sepia"> Sepia </option>
                    <option value="contrast"> Contrast </option>
                </select>
            </section>
        </section>
    );
}
export default MediaDevices;
