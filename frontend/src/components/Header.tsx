import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Start, userData } from "../interface/interface";

function Header(prop: Start) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState({ username: "" });
  const [userLoggedIn, setUserLoggedIn] = useState<boolean>();
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
    if (userLoggedIn === true) {
      navigate("/");
      start.setStart(false);
    }
  }, [userLoggedIn]);

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
      {userLoggedIn === true ? (
        <nav className="main-navigation">
          <ul onClick={() => isLoggedIn()}>
            <li onClick={() => start.setStart(false)}>
              <Link to="/">Start</Link>
            </li>
            {/* {userLoggedIn === false ? (
              <li>
                <Link to="/account">Log In</Link>
              </li>
            ) : null} */}
            <li>
              <Link to="/profile">Profile</Link>
            </li>

            <li>
              <Link to="/gallery">Gallery</Link>
            </li>
            <li> Account: {user.username}</li>
          </ul>
          {userLoggedIn ? (
            <button onClick={() => logout()}>Log out</button>
          ) : (
            <span></span>
          )}
        </nav>
      ) : null}
    </header>
  );
}

export default Header;
