import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import AccountPage from "./pages/AccountPage";
import GalleryPage from "./pages/GalleryPage";
import ProfilePage from "./pages/ProfilePage";
import PublicGalleryPage from "./pages/PublicGalleryPage";
import StartPage from "./pages/StartPage";

function App() {
    const [start, setStart] = useState(false);

    useEffect(() => {
        setStart(false);
    }, []);

    return (
        <Router>
            <div className="App">
                <Header state={{ start, setStart }} />
                <Routes>
                    <Route path="/" element={<StartPage state={{ start, setStart }} />} />
                    <Route path="/account" element={<AccountPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/gallery" element={<GalleryPage />} />
                    <Route path="/public-gallery" element={<PublicGalleryPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
