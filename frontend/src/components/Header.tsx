import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Start } from "../interface/interface";
import menuIcon from "../assets/menu.svg";

interface userData {
    _id?: "";
    userdata: { _id: ""; username: "" };
    username: "";
}

function Header(prop: Start) {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState({ username: "" });
    const [userLoggedIn, setUserLoggedIn] = useState<boolean>();
    const [toggleNavigation, setToggleNavigation] = useState<boolean>(false);
    let start = prop.state;

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

        let id = data.userdata._id;

        localStorage.setItem("user-id", JSON.stringify(id));
        localStorage.setItem("isAdmin", JSON.stringify(data.userdata.username));

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
            ></img>
            <nav className={toggleNavigation ? "main-nav" : "main-nav toggle-visibility"}>
                <ul onClick={() => setToggleNavigation(!toggleNavigation)}>
                    <li onClick={() => start.setStart(false)}>
                        <Link to="/">Start</Link>
                    </li>
                    <li>
                        <Link to="/account">Log In</Link>
                    </li>
                    <li>
                        <Link to="/profile">Profile</Link>
                    </li>
                    <li>
                        <Link to="/gallery">Gallery</Link>
                    </li>
                </ul>
                <p> Account: {user.username}</p>
                {userLoggedIn ? <button onClick={() => logout()}>Log out</button> : <span></span>}
            </nav>
        </header>
    );
}

export default Header;
