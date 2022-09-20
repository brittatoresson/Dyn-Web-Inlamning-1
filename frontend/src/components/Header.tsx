import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

interface userData {
    _id?: "";
    userdata: { _id: "" };
}

function Header() {
    const navigate = useNavigate();
    const location = useLocation();

    const [userLoggedIn, setUserLoggedIn] = useState<boolean>();

    async function isLoggedIn() {
        const token: string | null = sessionStorage.getItem("token");
        const response = await fetch("http://localhost:5555/api/loggedin", {
            headers: {
                authorization: `bearer: ${token}`,
            },
        });
        const data: { loggedIn: boolean; errorMessage: string; userdata: object } =
            await response.json();
        let id = data.userdata._id;
        localStorage.setItem("id", JSON.stringify(id));

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
            <nav className="main-navigation">
                <ul onClick={() => isLoggedIn()}>
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
                {userLoggedIn ? <button onClick={() => logout()}>Log out</button> : <span></span>}
            </nav>
        </header>
    );
}

export default Header;
