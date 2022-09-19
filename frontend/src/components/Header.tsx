import React from "react";
import { Link } from "react-router-dom";

function Header() {
    return (
        <header>
            <nav className="main-navigation">
                <ul>
                    <li>
                        <Link to="/">Start</Link>
                    </li>
                    <li>
                        <Link to="/account">Log In</Link>
                    </li>
                    <li>
                        <Link to="/profile">Profile</Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;
