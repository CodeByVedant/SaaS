const jwt = require("jsonwebtoken");

const generateAccessToken = (payload) => {
    return jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "900d"
        }
    );
};

const verifyAccessToken = (token) => {
    return jwt.verify(
        token,
        process.env.JWT_SECRET
    );
};

module.exports = {
    generateAccessToken,
    verifyAccessToken
};