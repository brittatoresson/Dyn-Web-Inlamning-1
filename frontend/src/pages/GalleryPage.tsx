import React from "react";
import { useEffect, useState } from "react";

function GalleryPage() {
    const [galleryImages, setGalleryImages] = useState<Array<object>>([{}]);

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

    useEffect(() => {
        getGalleryImages();
    }, []);

    return (
        <section>
            <h1>Gallery</h1>
            <article className="gallery-grid">
                {galleryImages.map((imgData: any) => (
                    <div>
                        <p>{imgData.userID}</p>
                        <canvas>
                            <img src={imgData.savedPhoto}></img>
                        </canvas>
                    </div>
                ))}
            </article>
        </section>
    );
}

export default GalleryPage;
