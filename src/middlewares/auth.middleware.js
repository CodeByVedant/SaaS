const ApiError = require("../utils/ApiError");
const {
    verifyAccessToken
} = require("../utils/jwt");

const protect = async (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;

        if (
            !authHeader ||
            !authHeader.startsWith("Bearer ")
        ) {
            return next(
                new ApiError(
                    401,
                    "Authentication required"
                )
            );
        }

        const token =
            authHeader.split(" ")[1];

        const decoded =
            verifyAccessToken(token);

        req.user = decoded;

        next();

    } catch (error) {

        return next(
            new ApiError(
                401,
                "Invalid or expired token"
            )
        );
    }
};

module.exports = protect;