const express = require("express");
const cors = require("cors");
const app = express();
const nedb = require("nedb-promise");
const jwt = require("jsonwebtoken");

const PORT = process.env.PORT || 5555;

const bcryptFuncs = require("./middleware/bcrypt");
const database = new nedb({ filename: "database/accounts.db", autoload: true });

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
    const usernameExists = await database.find({
        username: credentials.username,
    });
    const emailExists = await database.find({
        email: credentials.email,
    });

    usernameExists.length > 0 ? (resObj.usernameExists = true) : null;
    emailExists.length > 0 ? (resObj.emailExists = true) : null;

    if (resObj.usernameExists || resObj.emailExists) {
        resObj.success = false;
    } else {
        const hashedPassword = await bcryptFuncs.hashPassword(credentials.password);
        credentials.password = hashedPassword;
        database.insert(credentials);
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
    console.log(credentials);
    //set username....
    username = req.body.username;
    const account = await database.find({ username: credentials.username });
    if (account.length > 0) {
        //här kollar vi löenorden mot det i databasen
        const correctPassword = await bcryptFunctions.comparedPassword(
            credentials.password,
            account[0].password
        );
        if (correctPassword) {
            resObj.success = true;
            // Skapa token
            const token = jwt.sign({ username: account[0].username }, "1a1a1a", {
                expiresIn: 6000,
            });
            resObj.token = token;
        }
    }
    res.json(resObj);
});

app.listen(PORT, () => {
    console.log("listen on" + PORT);
});
