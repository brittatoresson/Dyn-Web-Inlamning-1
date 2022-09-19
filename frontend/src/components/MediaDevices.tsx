import { useEffect, useState } from "react";

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
  const constraints = {
    audio: false,
    video: true,
  };

  useEffect(() => {
    let video = document.getElementById("video") as HTMLVideoElement;
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((MediaStream) => {
        //Get veiod element
        setStream(MediaStream);
        video.srcObject = MediaStream;
        //Set aoutplay to true
        video.autoplay = true;
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function takePicture() {
    let video = document.getElementById("video") as HTMLVideoElement;
    let photo = document.getElementById("photo");
    let canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const data = canvas.toDataURL("image/png");
    const context = canvas.getContext("2d");

    context?.drawImage(video, 0, 0, 100, 100);
    photo?.setAttribute("src", data);
  }

  return (
    <section>
      Media
      <video width="750" height="500" controls id="video"></video>
      <source src={stream} type="video/mp4" />
      <button id="photoBtn" onClick={takePicture}>
        Take photo
      </button>
      <div id="photo"></div>
      <canvas id="canvas">
        <img
          id="photo"
          alt="The screen capture will appear in this box."
          src=""
        />
      </canvas>
    </section>
  );
}
export default MediaDevices;
