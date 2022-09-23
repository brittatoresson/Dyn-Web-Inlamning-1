import { useEffect, useState } from "react";
import xMark from "../assets/xmark-solid.svg";

function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<any>({
    userID: "",
    _id: "",
  });
  const [galleryImages, setGalleryImages] = useState<Array<object>>([
    { savedPhoto: "", userID: "", _id: "", date: { date: "", time: "" } },
  ]);
  const [userProfile, setUserProfile] = useState({ username: "" });
  const [date, setDate] = useState({ date: "", time: "" });

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
    console.log(data);
    setGalleryImages(await data);
  }

  function showDeleteDialog(image: { userID: string; _id: string }) {
    const deleteDialog = document.getElementById(
      "delete-dialog"
    ) as HTMLDialogElement;
    deleteDialog.showModal();
    setSelectedImage({ userID: image.userID, _id: image._id });
  }

  function closeDialog() {
    const deleteDialog = document.getElementById(
      "delete-dialog"
    ) as HTMLDialogElement;
    deleteDialog.close();
    ///NYTTT
    const infoDialog = document.getElementById(
      "info-dialog"
    ) as HTMLDialogElement;
    infoDialog.close();
  }

  async function removeImage() {
    const sendData = {
      userID: selectedImage.userID,
      imageID: selectedImage._id,
    };

    const response = await fetch("http://localhost:5555/api/photodb", {
      method: "DELETE",
      body: JSON.stringify(sendData),
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();

    getGalleryImages();
    closeDialog();
  }

  useEffect(() => {
    getGalleryImages();
  }, []);

  async function getPhotoInfo(imgData: any) {
    setDate(imgData.dateTime);
    const infoDialog = document.getElementById(
      "info-dialog"
    ) as HTMLDialogElement;
    infoDialog.showModal();
    let userID = { userID: imgData.userID };
    const response = await fetch("http://localhost:5555/api/photoInfo", {
      method: "POST",
      body: JSON.stringify(userID),
      headers: { "Content-Type": "application/json" },
    });
    setUserProfile(await response.json());
  }
  const [caption, setCaption] = useState<any>();
  function addCaption(e: any) {
    if (e.keyCode == 13) {
      console.log(e);
      setCaption(e.target.value);
    }
  }

  const [test, setTest] = useState(false);

  return (
    <main>
      <h1>Gallery</h1>
      <dialog id="delete-dialog">
        <p>Are you sure you want to delete the photo?</p>
        <button onClick={() => removeImage()}>confirm</button>
        <button onClick={() => closeDialog()}>cancel</button>
      </dialog>
      <dialog id="info-dialog">
        <p>Photo by {userProfile.username}</p>
        <p>{date.date}</p>
        <p>{date.time}</p>
        {caption ? <p>{caption}</p> : null}
        <input
          type="text"
          placeholder="add caption"
          onKeyDown={(e) => addCaption(e)}
        />
        <button onClick={() => closeDialog()}>cancel</button>
      </dialog>

      <article className="gallery-grid">
        {galleryImages.map((imgData: any, i: number) => (
          <div className="gallery-img-box" key={i}>
            {test === true ? <PhotoInfo state={{ imgData, setTest }} /> : null}
            <img
              className="gallery-img"
              src={imgData.savedPhoto}
              alt="webcam"
              //   onClick={() => setTest(true)}
              onClick={() => getPhotoInfo(imgData)}
            />

            <img
              className="gallery-img-btn"
              src={xMark}
              onClick={() => showDeleteDialog(imgData)}
            />
          </div>
        ))}
      </article>
    </main>
  );
}

export default GalleryPage;
