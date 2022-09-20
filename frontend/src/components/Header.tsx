import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

interface userData {
  _id?: "";
  userdata: { _id: "" };
}

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

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
    // Save ID to lacal storage
    let id = data.userdata._id;
    localStorage.setItem("id", JSON.stringify(id));

    if (data.loggedIn === false) {
      navigate("/account");
    }
  }

  async function logout() {
    let response = await fetch("http://localhost:5555/api/logout");
    let data: { success: boolean } = await response.json();

    if (data.success) {
      sessionStorage.clear();
      navigate("/account");
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
        <button onClick={() => logout()}>Log out</button>
      </nav>
    </header>
  );
}

export default Header;
