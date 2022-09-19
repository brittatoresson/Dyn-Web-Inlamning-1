const express = require("express");
const cors = require("cors");
const app = express();
const nedb = require("nedb-promise");
const PORT = 5555;
const database = new nedb({ filename: "accounts.db", autoload: true });
const jwt = require("jsonwebtoken");

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

  if (usernameExists.length > 0) {
    resObj.usernameExists = true;
  }
  if (emailExists.length > 0) {
    resObj.emailExists = true;
  }
  if (resObj.usernameExists || resObj.emailExists) {
    resObj.success = false;
  } else {
    const hashedPassowrd = await bcryptFunctions.hashPassword(
      credentials.password
    );
    credentials.password = hashedPassowrd;
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
