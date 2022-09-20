import { useState, useEffect } from "react";

function MediaDevices() {
  // const [stream, setStream] = useState<any>();
  const [savedPhoto, setSavedPhoto] = useState<any>();
  const [viewPhoto, setViewPhoto] = useState(false);

  const canvas = document.getElementById("canvas") as HTMLCanvasElement;

  function startCamera() {
    const video = document.getElementById("video") as HTMLVideoElement;
    navigator.mediaDevices
      .getUserMedia({ audio: false, video: true })
      .then((MediaStream) => {
        // setStream(MediaStream);
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
    // const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const video = document.getElementById("video") as HTMLVideoElement;
    const context = canvas.getContext("2d");
    context?.drawImage(video, 0, 0, 300, 250);
    const image = canvas.toDataURL("image/jpeg");
    setSavedPhoto(image);
    setViewPhoto(true);
    sendToDb();
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
    console.log(response);
  }

  // function stopMedia() {
  //     stream.getTracks().forEach((mediaTrack: { stop: () => void }) => {
  //         mediaTrack.stop();
  //     });
  // }

  useEffect(() => {
    startCamera();
  }, []);

  function clearphoto() {
    const context: any = canvas.getContext("2d");
    context.fillStyle = "#FFF";
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  return (
    // <section>
    //   <video width="750" height="500" id="video"></video>
    //   {/* <button onClick={startcamera}>Start </button> */}
    //   <button id="photoBtn" onClick={takePicture}>
    //     Take photo
    //   </button>
    //   <button onClick={sendToDb}>Save photo</button>
    //   {/* <button onClick={stopMedia}>Close</button> */}
    //   <canvas width="300" height="250" id="canvas">
    //     <img id="photo" />
    //   </canvas>

    // </section>
    <section>
      <section className={viewPhoto === true ? "toggleVideo" : ""}>
        <video width="750" height="500" controls id="video"></video>
        <button onClick={startCamera}>Start </button>
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
