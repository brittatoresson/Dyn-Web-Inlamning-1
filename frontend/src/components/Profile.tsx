import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [photosArray, setPhotosArray] = useState([]);
  const [user, setUser] = useState({
    userdata: { username: "", email: "", isAdmin: false, photoArray: [] },
  });
  const admin = localStorage.getItem("isAdmin");
  const token: string | null = sessionStorage.getItem("token");
  let navigate = useNavigate();

  async function getUserProfile() {
    const response = await fetch("http://localhost:5555/api/loggedin", {
      headers: {
        authorization: `bearer: ${token}`,
      },
    });
    setUser(await response.json());
  }
  async function getPhotos() {
    let userID: string | undefined | null = localStorage.getItem("user-id");
    userID = userID?.substring(1, userID.length - 1);
    const response = await fetch("http://localhost:5555/api/photodb", {
      method: "GET",
      headers: {
        authorization: `user-id: ${userID}`,
      },
    });
    setPhotosArray(await response.json());
  }

  useEffect(() => {
    getUserProfile();
    getPhotos();
  }, []);

  return (
    <section id="profile">
      <p>Username: {user.userdata.username}</p>
      <p>Email: {user.userdata.email}</p>
      {admin === '"admin"' ? <p>Roll: Admin</p> : <p>Roll: Guest</p>}
      <p onClick={() => navigate("/gallery")}>
        {photosArray.length} saved photos
      </p>
    </section>
  );
}

export default Profile;
