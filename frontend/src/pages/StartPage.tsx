import React from "react";
import MediaDevices from "../components/MediaDevices";
import logo from "../assets/169261106-90952bfe-04f0-45c0-bfbe-dd805c6b7cd0.png";
import { Start } from "../interface/interface";

function StartPage(prop: Start) {
    const start = prop.state;

    return (
        <main id="start-page">
            {!start.start ? (
                <div className="logo">
                    <img src={logo} alt="" onClick={() => start.setStart(true)} />
                </div>
            ) : (
                <MediaDevices />
            )}
        </main>
    );
}

export default StartPage;
