import { useEffect, useState } from "react";
import xMark from "../assets/xmark-solid.svg";
import { imageData } from "../interface/interface";

function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<imageData>({
    savedPhoto: "",
    userID: "",
    _id: "",
  });
  const [galleryImages, setGalleryImages] = useState<Array<imageData>>([
    { savedPhoto: "", userID: "", _id: "" },
  ]);
  const [caption, setCaption] = useState();
  const [imageInfo, setImageInfo] = useState({ username: "", caption: "" });

  function showInfoDialog(image: imageData) {
    const infoDialog = document.getElementById(
      "info-dialog"
    ) as HTMLDialogElement;
    infoDialog.showModal();

    setSelectedImage({
      savedPhoto: image.savedPhoto,
      userID: image.userID,
      _id: image._id,
      dateObj: image.dateObj,
      caption: image.caption,
    });
  }

  function closeInfoDialog() {
    const infoDialog = document.getElementById(
      "info-dialog"
    ) as HTMLDialogElement;

    infoDialog.close();
  }

  function showDeleteDialog(image: imageData) {
    const deleteDialog = document.getElementById(
      "delete-dialog"
    ) as HTMLDialogElement;
    deleteDialog.showModal();
    setSelectedImage({
      savedPhoto: image.savedPhoto,
      userID: image.userID,
      _id: image._id,
    });
  }

  function closeDeleteDialog() {
    const deleteDialog = document.getElementById(
      "delete-dialog"
    ) as HTMLDialogElement;
    deleteDialog.close();
  }

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
  async function removeImage(removeCaption: boolean | null) {
    if (removeCaption === true) {
      setSelectedImage({
        ...selectedImage,
        caption: "",
      });
    }

    const sendData = {
      userID: selectedImage.userID,
      imageID: selectedImage._id,
      removeCaption: removeCaption,
    };

    const response = await fetch("http://localhost:5555/api/photodb", {
      method: "DELETE",
      body: JSON.stringify(sendData),
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    closeDeleteDialog();
    removeCaption = false;
    setCaption(undefined);
    getGalleryImages();
  }

  async function getPhotoInfo() {
    let userID = {
      userID: selectedImage.userID,
      _id: selectedImage._id,
      caption: caption,
    };
    const response = await fetch("http://localhost:5555/api/photoInfo", {
      method: "POST",
      body: JSON.stringify(userID),
      headers: { "Content-Type": "application/json" },
    });
    setImageInfo(await response.json());
  }

  function addCaption(e: any) {
    if (e.keyCode == 13) {
      setCaption(e.target.value);
      setSelectedImage({
        ...selectedImage,
        caption: e.target.value,
      });
      getPhotoInfo();
    }
  }

  useEffect(() => {
    getGalleryImages();
  }, []);

  useEffect(() => {
    getPhotoInfo();
    getGalleryImages();
  }, [selectedImage]);

  return (
    <main>
      <h1>Gallery</h1>
      <dialog id="delete-dialog">
        <p>Are you sure you want to delete the photo?</p>
        <button onClick={() => removeImage(null)}>confirm</button>
        <button onClick={() => closeDeleteDialog()}>cancel</button>
      </dialog>
      <dialog id="info-dialog">
        <img src={selectedImage.savedPhoto} alt="" />
        <p>Photo by {imageInfo.username}</p>

        {selectedImage.caption ? (
          <div className="caption">
            <p> {selectedImage.caption}</p>
            <img onClick={() => removeImage(true)} src={xMark}></img>
          </div>
        ) : null}
        <p>
          {selectedImage.dateObj?.date}, kl. {selectedImage.dateObj?.time}
        </p>
        {!selectedImage.caption ? (
          <input
            type="text"
            placeholder="add caption"
            onKeyDown={(e) => addCaption(e)}
          />
        ) : null}
        <button onClick={() => closeInfoDialog()}>back</button>
      </dialog>
      <article className="gallery-grid">
        {galleryImages.map((imgData, i: number) => (
          <div className="gallery-img-box" key={i}>
            <img
              className="gallery-img"
              src={imgData.savedPhoto}
              alt=""
              onClick={() => showInfoDialog(imgData)}
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
