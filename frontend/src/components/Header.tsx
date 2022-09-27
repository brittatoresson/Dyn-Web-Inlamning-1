import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Start, userData } from "../interface/interface";
import menuIcon from "../assets/menu.svg";

function Header(prop: Start) {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState({ username: "" });
    const [userLoggedIn, setUserLoggedIn] = useState<boolean>();
    const [toggleNavigation, setToggleNavigation] = useState<boolean>(false);
    const start = prop.state;

    async function isLoggedIn() {
        const token: string | null = sessionStorage.getItem("token");
        const response = await fetch("http://localhost:5555/api/loggedin", {
            headers: {
                authorization: `bearer: ${token}`,
            },
        });
        const data: {
            loggedIn: boolean;
            errorMessage: string;
            userdata: userData;
        } = await response.json();

        localStorage.setItem("user-id", JSON.stringify(data.userdata._id));
        localStorage.setItem("isAdmin", JSON.stringify(data.userdata.isAdmin));

        setUser(data.userdata);

        if (data.loggedIn === false) {
            setUserLoggedIn(false);
        } else {
            setUserLoggedIn(true);
        }
    }

    useEffect(() => {
        isLoggedIn();
        if (!userLoggedIn) {
            navigate("/account");
        }
    }, [location.pathname]);

    useEffect(() => {
        if (userLoggedIn) {
            navigate("/");
            start.setStart(false);
        }
    }, [userLoggedIn]);

    async function logout() {
        let response = await fetch("http://localhost:5555/api/logout");
        let data: { success: boolean } = await response.json();

        if (data.success) {
            sessionStorage.clear();
            navigate("/account");
            setUserLoggedIn(false);
        }
    }

    return (
        <header>
            <img
                src={menuIcon}
                className="header-btn"
                onClick={() => setToggleNavigation(!toggleNavigation)}
            />
            <nav className={toggleNavigation ? "main-nav" : "main-nav toggle-visibility"}>
                <ul onClick={() => setToggleNavigation(!toggleNavigation)}>
                    <li onClick={() => start.setStart(false)}>
                        <Link to="/">Start</Link>
                    </li>
                    {!userLoggedIn ? (
                        <li>
                            <Link to="/account">Log In</Link>
                        </li>
                    ) : null}
                    <li>
                        <Link to="/profile">Profile</Link>
                    </li>
                    <li>
                        <Link to="/gallery">Your Gallery</Link>
                    </li>
                    <li>
                        <Link to="/public-gallery">Public Gallery</Link>
                    </li>
                </ul>
                {userLoggedIn ? (
                    <span className="username-info-field">Logged in: {user.username}</span>
                ) : null}
                {userLoggedIn ? <button onClick={() => logout()}>Log out</button> : null}
            </nav>
        </header>
    );
}

export default Header;
