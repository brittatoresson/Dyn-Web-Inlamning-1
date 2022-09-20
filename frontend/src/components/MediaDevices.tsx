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
  const [viewPhoto, setViewPhoto] = useState(false);
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
    //oklart vad som händer här
    const context = canvas.getContext("2d");
    context?.drawImage(video, 0, 0, 100, 100);
    const data = canvas.toDataURL("image/png");

    // sätt src till  "data"
    photo?.setAttribute("src", data);
    setSavedPhoto(data);

    // setTimeout(() => {
    setViewPhoto(true);
    // }, 2000);
    // //kalla på databasfunktionen
    sendToDb();
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
    // const data = await response.json();
  }

  function stopMedia() {
    stream.getTracks().forEach((mediaTrack: { stop: () => void }) => {
      mediaTrack.stop();
    });
  }

  function clearphoto() {
    let canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const context: any = canvas.getContext("2d");
    context.fillStyle = "#FFF";
    context?.fillRect(0, 0, canvas.width, canvas.height);
  }

  return (
    <section>
      <section className={viewPhoto === true ? "toggleVideo" : ""}>
        <video width="750" height="500" controls id="video"></video>
        <button onClick={startcamera}>Start </button>
        <button id="photoBtn" onClick={takePicture}>
          Take photo
        </button>
      </section>
      <canvas id="canvas">
        <img id="photo" />
      </canvas>

      {viewPhoto === true ? (
        <button
          onClick={() => {
            setViewPhoto(false);
            clearphoto();
          }}
        >
          {" "}
          Fånga ett nytt ögonblic
        </button>
      ) : (
        ""
      )}
    </section>
  );
}
export default MediaDevices;
