import { useEffect, useState } from "react";

function Profile() {
  const [iaAdmin, setIsAdmin] = useState();
  const [user, setUser] = useState({
    userdata: { username: "", email: "", isAdmin: false, photoArray: [] },
  });

  async function getUserProfile() {
    const token: string | null = sessionStorage.getItem("token");
    const response = await fetch("http://localhost:5555/api/loggedin", {
      headers: {
        authorization: `bearer: ${token}`,
      },
    });
    const data = await response.json();
    console.log(data);
    setUser(data);
  }

  useEffect(() => {
    getUserProfile();
  }, []);

  return (
    <section>
      <p>Username: {user.userdata.username}</p>
      <p>Email: {user.userdata.email}</p>
      {/* {user.userdata.isAdmin === true ? <p> Admin</p> : "Guest"} */}
      {/* <p>{user.userdata.photoArray.length}</p> */}
    </section>
  );
}

export default Profile;
