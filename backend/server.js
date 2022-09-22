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

app.post("/api/photodb", async (req, res) => {
    const photoObj = req.body;
    if (photoObj) {
        photosDB.insert(photoObj);
    }
});

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

app.delete("/api/photodb", async (req, res) => {
    const imageData = req.body;
    const resObj = {
        imageRemoved: false,
    };

    let photo = await photosDB.find({ _id: imageData.imageID });

    if (photo.length > 0) {
        resObj.imageRemoved = true;
        photosDB.remove({ _id: imageData.imageID });
    }

    res.json(resObj);
});

app.listen(PORT, () => {
    console.log(`server is running on post ${PORT}`);
});
