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
    const [imageInfo, setImageInfo] = useState({ username: "", caption: "" });
    const [caption, setCaption] = useState<string>();

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

    function showDeleteDialog(image: imageData) {
        const deleteDialog = document.getElementById("delete-dialog") as HTMLDialogElement;
        deleteDialog.showModal();
        setSelectedImage({
            savedPhoto: image.savedPhoto,
            userID: image.userID,
            _id: image._id,
        });
    }

    function closeInfoDialog() {
        const infoDialog = document.getElementById("info-dialog") as HTMLDialogElement;
        infoDialog.close();
        getGalleryImages();
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

    async function deleteImage(removeCaption: boolean | null) {
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
        getGalleryImages();
        closeDeleteDialog();
        removeCaption = false;
        setCaption(undefined);
    }

    async function updateImage(isPublicInput: boolean) {
        const sendData = {
            userID: selectedImage.userID,
            imageID: selectedImage._id,
            isPublic: isPublicInput,
        };

        const response = await fetch("http://localhost:5555/api/photodb", {
            method: "PUT",
            body: JSON.stringify(sendData),
            headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
    }

    async function switchPublicState() {
        const newIsPublic = !selectedImage.isPublic;
        setSelectedImage({ ...selectedImage, isPublic: newIsPublic });

        await updateImage(newIsPublic);
    }

    async function sendPhotoInfo() {
        let image = {
            userID: selectedImage.userID,
            _id: selectedImage._id,
            caption: caption,
        };
        const response = await fetch("http://localhost:5555/api/photo-info", {
            method: "POST",
            body: JSON.stringify(image),
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
            sendPhotoInfo();
        }
    }

    // useEffect(() => {
    //   getGalleryImages();
    // }, []);

    // useEffect(() => {
    //   sendPhotoInfo();
    // }, [selectedImage, caption]);

    useEffect(() => {
        getGalleryImages();
    }, []);

    useEffect(() => {
        sendPhotoInfo();
        getGalleryImages();
    }, [selectedImage]);

    return (
        <main>
            <h1>Your Gallery</h1>
            <dialog id="delete-dialog">
                <p>Are you sure you want to delete the photo?</p>
                <button onClick={() => deleteImage(null)}>confirm</button>
                <button onClick={() => closeDeleteDialog()}>cancel</button>
            </dialog>
            <dialog id="info-dialog">
                <img src={selectedImage.savedPhoto} alt="" />
                <p>
                    {selectedImage.dateObj?.date}, kl. {selectedImage.dateObj?.time}
                </p>
                <p className="photo-by">Photo by {imageInfo.username}</p>
                {selectedImage.caption ? (
                    <div className="caption">
                        <p>Caption: {selectedImage.caption}</p>
                        <img onClick={() => deleteImage(true)} src={xMark}></img>
                    </div>
                ) : null}

                {!selectedImage.caption ? (
                    <input type="text" placeholder="add caption" onKeyDown={(e) => addCaption(e)} />
                ) : null}
                <div className="dialog-share-field">
                    Share photo:
                    <button className="share-btn" onClick={() => switchPublicState()}>
                        {selectedImage.isPublic?.toString()}
                    </button>
                </div>
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
