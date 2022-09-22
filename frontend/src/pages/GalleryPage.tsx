import { useEffect, useState } from "react";
import xMark from "../assets/xmark-solid.svg";

function GalleryPage() {
    const [selectedImage, setSelectedImage] = useState<any>({ userID: "", _id: "" });
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

    function showDeleteDialog(image: { userID: string; _id: string }) {
        const deleteDialog = document.getElementById("delete-dialog") as HTMLDialogElement;
        deleteDialog.showModal();
        setSelectedImage({ userID: image.userID, _id: image._id });
    }

    function closeDeleteDialog() {
        const deleteDialog = document.getElementById("delete-dialog") as HTMLDialogElement;
        deleteDialog.close();
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
        <section>
            <h1>Gallery</h1>
            <dialog id="delete-dialog">
                <p>Are you sure you want to delete the photo?</p>
                <button onClick={() => removeImage()}>confirm</button>
                <button onClick={() => closeDeleteDialog()}>cancel</button>
            </dialog>
            <article className="gallery-grid">
                {galleryImages.map((imgData: any, i: number) => (
                    <div className="gallery-img-box" key={i}>
                        <img className="gallery-img" src={imgData.savedPhoto} alt="webcam" />
                        <img
                            className="gallery-img-btn"
                            src={xMark}
                            onClick={() => showDeleteDialog(imgData)}
                        />
                    </div>
                ))}
            </article>
        </section>
    );
}

export default GalleryPage;
