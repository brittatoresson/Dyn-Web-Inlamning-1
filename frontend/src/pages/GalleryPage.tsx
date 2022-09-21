import { useEffect, useState } from "react";
import xMark from "../assets/xmark-solid.svg";

function GalleryPage() {
  const [galleryImages, setGalleryImages] = useState<Array<object>>([
    { savedPhoto: "", userID: "", _id: "" },
  ]);

  async function getGalleryImages() {
    let userID: string | undefined | null = localStorage.getItem("user-id");
    userID = userID?.substring(1, userID.length - 1);

    const response = await fetch("http://localhost:5555/api/photodb", {
      method: "GET",
      headers: {
        authorization: `user-id: ${userID}`,
      },
    });
    const data = await response.json();
    setGalleryImages(await data);
  }

  async function removeImage(image: { userID: ""; _id: "" }) {
    console.log(image);

    const sendData = {
      userID: image.userID,
      imageID: image._id,
    };

    const response = await fetch("http://localhost:5555/api/photodb", {
      method: "DELETE",
      body: JSON.stringify(sendData),
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    console.log(data);
    getGalleryImages();
  }

  return (
    <section>
      <h1>Gallery</h1>
      <article className="gallery-grid">
        {galleryImages.map((imgData: any, i: number) => (
          <div className="gallery-img-box" key={i}>
            <img
              className="gallery-img"
              src={imgData?.savedPhoto}
              alt="webcam"
            />
            <img
              className="gallery-img-btn"
              src={xMark}
              onClick={() => removeImage(imgData)}
            />
          </div>
        ))}
      </article>
    </section>
  );
}

export default GalleryPage;
