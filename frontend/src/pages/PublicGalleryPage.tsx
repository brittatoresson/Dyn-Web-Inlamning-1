import React, { useEffect, useState } from "react";
import { imageData } from "../interface/interface";

function PublicGalleryPage() {
    const [selectedImage, setSelectedImage] = useState<imageData>({
        savedPhoto: "",
        userID: "",
        _id: "",
    });
    const [galleryImages, setGalleryImages] = useState<Array<imageData>>([
        { savedPhoto: "", userID: "", _id: "" },
    ]);

    function showInfoDialog(image: imageData) {
        const infoDialog = document.getElementById("info-dialog") as HTMLDialogElement;
        infoDialog.showModal();

        setSelectedImage({
            isPublic: image.isPublic,
            dateObj: image.dateObj,
            caption: image.caption,
            savedPhoto: image.savedPhoto,
            userID: image.userID,
            _id: image._id,
        });

        console.log(selectedImage);
    }

    function closeInfoDialog() {
        const infoDialog = document.getElementById("info-dialog") as HTMLDialogElement;
        infoDialog.close();
    }

    async function getPublicGalleryImages() {
        const response = await fetch("http://localhost:5555/api/photodb/public", {
            method: "GET",
        });
        const data = await response.json();
        setGalleryImages(await data);
    }

    useEffect(() => {
        getPublicGalleryImages();
    }, []);

    return (
        <main>
            <h1>Public Gallery</h1>
            <dialog id="info-dialog">
                <img src={selectedImage.savedPhoto} alt="" />
                <p>Photo by {selectedImage.userID}</p>
                <p>{selectedImage.caption}</p>
                <p>
                    {selectedImage.dateObj?.date}, kl. {selectedImage.dateObj?.time}
                </p>
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
                    </div>
                ))}
            </article>
        </main>
    );
}

export default PublicGalleryPage;
