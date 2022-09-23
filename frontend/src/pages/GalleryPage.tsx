import { useEffect, useState } from "react";
import xMark from "../assets/xmark-solid.svg";

function GalleryPage() {
    const [selectedImage, setSelectedImage] = useState<imageData>({
        savedPhoto: "",
        userID: "",
        _id: "",
    });
    const [galleryImages, setGalleryImages] = useState<Array<imageData>>([
        { savedPhoto: "", userID: "", _id: "" },
    ]);

    interface imageData {
        savedPhoto: string;
        userID: string;
        _id: string;
    }

    function showInfoDialog(image: imageData) {
        const infoDialog = document.getElementById("info-dialog") as HTMLDialogElement;
        infoDialog.showModal();
        setSelectedImage({ savedPhoto: image.savedPhoto, userID: image.userID, _id: image._id });
    }

    function closeInfoDialog() {
        const infoDialog = document.getElementById("info-dialog") as HTMLDialogElement;
        infoDialog.close();
    }

    function showDeleteDialog(image: imageData) {
        const deleteDialog = document.getElementById("delete-dialog") as HTMLDialogElement;
        deleteDialog.showModal();
        setSelectedImage({ savedPhoto: image.savedPhoto, userID: image.userID, _id: image._id });
    }

    function closeDeleteDialog() {
        const deleteDialog = document.getElementById("delete-dialog") as HTMLDialogElement;
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
        console.log(data);
        setGalleryImages(await data);
    }
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
        console.log(data);

        getGalleryImages();
        closeDeleteDialog();
    }

    useEffect(() => {
        getGalleryImages();
    }, []);

    return (
        <main>
            <h1>Gallery</h1>
            <dialog id="delete-dialog">
                <p>Are you sure you want to delete the photo?</p>
                <button onClick={() => removeImage()}>confirm</button>
                <button onClick={() => closeDeleteDialog()}>cancel</button>
            </dialog>
            <dialog id="info-dialog">
                <img src={selectedImage.savedPhoto} alt="" />
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
