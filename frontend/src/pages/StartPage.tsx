import React, { useState } from "react";
import MediaDevices from "../components/MediaDevices";
import logo from "../img/169261106-90952bfe-04f0-45c0-bfbe-dd805c6b7cd0.png";
import { Start } from "../interface/interface";

function StartPage(prop: Start) {
  let start = prop.state;

  return (
    <section id="start-page">
      {start.start === false ? (
        <img src={logo} alt="" onClick={() => start.setStart(true)} />
      ) : (
        <MediaDevices />
      )}
    </section>
  );
}

export default StartPage;
