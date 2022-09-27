const express = require("express");
const cors = require("cors");
const nedb = require("nedb-promise");
const jwt = require("jsonwebtoken");
const app = express();

require("dotenv").config();

const PORT = process.env.PORT || 5555;
const bcryptFuncs = require("./middleware/bcrypt");

const accountsDB = new nedb({
    filename: "database/accounts.db",
    autoload: true,
});
const photosDB = new nedb({
    filename: "database/photos.db",
    autoload: true,
});

app.use(express.json());
app.use(cors({ origin: "*" }));

//SIGN UP
app.post("/api/signup", async (req, res) => {
    const credentials = req.body;
    const resObj = {
        success: true,
        usernameExists: false,
        emailExists: false,
    };

    //kolla igenom db om namn redan finns
    const usernameExists = await accountsDB.find({
        username: credentials.username,
    });
    const emailExists = await accountsDB.find({
        email: credentials.email,
    });

    usernameExists.length > 0 ? (resObj.usernameExists = true) : null;
    emailExists.length > 0 ? (resObj.emailExists = true) : null;

    if (resObj.usernameExists || resObj.emailExists) {
        resObj.success = false;
    } else {
        const hashedPassword = await bcryptFuncs.hashPassword(credentials.password);
        credentials.password = hashedPassword;
        accountsDB.insert(credentials);
    }
    res.json(resObj);
});

//LOGIN
app.post("/api/login", async (req, res) => {
    const credentials = req.body;
    const resObj = {
        success: false,
        token: "",
    };

    const account = await accountsDB.find({ username: credentials.username });

    if (account.length > 0) {
        //här kollar vi lösenorden mot det i databasen
        const passwordMatch = await bcryptFuncs.comparePassword(
            credentials.password,
            account[0].password
        );

        if (passwordMatch) {
            resObj.success = true;
            // JSON Web Token (blir hashad/krypterad) värdet för expiresIn är i sekunder.
            const token = jwt.sign({ username: account[0].username }, process.env.JWT_SECRET, {
                expiresIn: 6000,
            });
            resObj.token = token;
        }
    }
    res.json(resObj);
});

// LOGIN CHECK
app.get("/api/loggedin", async (req, res) => {
    const resObj = {
        loggedIn: false,
        errorMessage: "",
        userdata: {},
    };
    const token = req.headers.authorization?.replace("bearer: ", "");
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        if (data) {
            resObj.loggedIn = true;
            let userdataArr = await accountsDB.find({ username: data.username });
            resObj.userdata = {
                username: userdataArr[0].username,
                email: userdataArr[0].email,
                isAdmin: userdataArr[0].isAdmin,
                _id: userdataArr[0]._id,
            };
        }
    } catch {
        resObj.errorMessage = "Token expired";
    }
    res.json(resObj);
});

// LOGOUT
app.get("/api/logout", async (request, response) => {
    const resObj = {
        success: true,
    };
    response.json(resObj);
});

//GET PUBLIC PHOTOS
app.get("/api/photodb/public", async (req, res) => {
    const userPhotos = await photosDB.find({ isPublic: true });
    res.json(userPhotos);
});

// GET USER PHOTOS
app.get("/api/photodb", async (req, res) => {
    const user = req.headers.authorization;
    const userID = user.replace("user-id: ", "");
    let userPhotos = await photosDB.find({ userID: userID });

    /// ADMIN ACCESS
    const adminUsersArray = await accountsDB.find({ isAdmin: true });
    let findAdminUser = adminUsersArray.find((user) => user._id === userID);
    findAdminUser ? (userPhotos = await photosDB.find({})) : null;
    res.json(userPhotos);
});

//ADD NEW PHOTO
app.post("/api/photodb", async (req, res) => {
    const photoObj = req.body;
    if (photoObj) {
        photosDB.insert(photoObj);
    }
});

//CHANGE IMAGE OBJECT STATE
app.put("/api/photodb", async (req, res) => {
    const imageData = req.body;

    await photosDB.update({ _id: imageData.imageID }, { $set: { isPublic: imageData.isPublic } });
    res.json("switched");
});

//DELETE SELECTED PHOTO
app.delete("/api/photodb", async (req, res) => {
    const imageData = req.body;
    const resObj = {
        imageRemoved: false,
        captionRemoved: false,
    };

    let photo = await photosDB.find({ _id: imageData.imageID });

    if (photo.length > 0 && imageData.removeCaption !== true) {
        resObj.imageRemoved = true;
        photosDB.remove({ _id: imageData.imageID });
    } else if (photo.length > 0 && imageData.removeCaption === true) {
        photosDB.update({ _id: imageData.imageID }, { $set: { caption: "" } });
        resObj.captionRemoved = true;
    }
    res.json(resObj);
});

//GET ALL USERS
app.get("/api/userlist", async (req, res) => {
    let allUsers = await accountsDB.find({});
    allUsers = allUsers.map((user) => {
        return { username: user.username, email: user.email };
    });
    res.json(allUsers);
});

//GET SPECIFIC USER
app.get("/api/user", async (req, res) => {
    const resObj = {
        username: "",
        email: "",
    };

    const user = req.headers.authorization;
    const userID = user.replace("user-id: ", "");

    let userInfo = await accountsDB.find({ _id: userID });

    if (userInfo !== null) {
        resObj.username = userInfo[0].username;
        resObj.email = userInfo[0].email;
    }

    res.json(resObj);
});

//UPDATE CAPTION ON IMAGE
app.post("/api/photo-info", async (req, res) => {
    const userID = req.body.userID;
    const _id = req.body._id;
    const caption = req.body.caption;

    const resObj = {
        username: "",
        caption: caption,
    };

    let users = await accountsDB.find({ _id: userID });
    users.map((user) => {
        resObj.username = user.username;
    });

    caption ? photosDB.update({ _id: _id }, { $set: { caption: caption } }) : null;

    res.json(resObj);
});

app.listen(PORT, () => {
    console.log(`server is running on post ${PORT}`);
});
