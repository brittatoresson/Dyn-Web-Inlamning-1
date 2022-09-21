const bcrypt = require("bcryptjs");
const saltRounds = 10;

// hasha ett lösenord vid registrering
async function hashPassword(password) {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log(hashedPassword);
    return hashedPassword;
}

// kontrollera att lösenord överensstämmer med databasens data
async function comparePassword(password, hash) {
    const passwordMatch = await bcrypt.compare(password, hash);
    return passwordMatch;
}

module.exports = { hashPassword, comparePassword };
