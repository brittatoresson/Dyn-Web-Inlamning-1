import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
    const [photosArray, setPhotosArray] = useState<Array<object>>([]);
    const [userlist, setUserlist] = useState<any>();
    const [user, setUser] = useState({
        userdata: { username: "", email: "", isAdmin: false, photoArray: [] },
    });

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

    async function getUserlist() {
        const response = await fetch("http://localhost:5555/api/userlist", {
            method: "GET",
            headers: { authorization: `user: ${user.userdata.username}` },
        });
        const data = await response.json();
        setUserlist(data);
    }

    useEffect(() => {
        getUserProfile();
        getPhotos();
    }, []);

    useEffect(() => {
        if (user.userdata.isAdmin) {
            getUserlist();
        }
    }, [user]);

    return (
        <section id="profile">
            <table>
                <tbody>
                    <tr>
                        <td>Username:</td>
                        <td>{user.userdata.username}</td>
                    </tr>
                    <tr>
                        <td>Email: </td>
                        <td>{user.userdata.email}</td>
                    </tr>
                    <tr>
                        <td>Role:</td>
                        {user.userdata.isAdmin ? <td>Admin</td> : <td>Guest</td>}
                    </tr>
                    <tr className="clickable" onClick={() => navigate("/gallery")}>
                        <td>Saved content:</td>
                        <td>{photosArray.length} photos</td>
                    </tr>
                </tbody>
            </table>
            <h2 className={user.userdata.isAdmin ? "" : "toggle-visibility"}>Registrated users</h2>
            <table className={user.userdata.isAdmin ? "" : "toggle-visibility"}>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {userlist?.map((user: any) => (
                        <tr>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
}

export default Profile;
