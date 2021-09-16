const jwt = require("jsonwebtoken");
const { SECRET_KEY, REFRESH_TOKEN_SECRET} = require("../config");

/** return signed JWt from user data. */

function createToken(user) {
    console.assert(user.isAdmin !== undefined,
        "createToken passed user without isAdmin property");

    let payload = {
        username: user.username,
        isAdmin: user.isAdmin || false,
    };

    return jwt.sign(payload, SECRET_KEY, { expiresIn: '1m' });
}
function createRefreshToken(user) {
    console.assert(user.isAdmin !== undefined,
        "createToken passed user without isAdmin property");
    console.log
    let payload = {
        username: user.username,
        isAdmin: user.isAdmin || false,
    };
    let refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET);
    
    return refreshToken;
    
}

module.exports = { createToken, createRefreshToken };