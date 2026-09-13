const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const {
    generateAccessToken
} = require("../utils/jwt");

const registerUser = async ({
    name,
    email,
    password
}) => {

    const existingUser =
        await User.findOne({ email });

    if (existingUser) {
        throw new ApiError(
            409,
            "User with this email already exists"
        );
    }

    const user =
        await User.create({
            name,
            email,
            password
        });

    const token =
        generateAccessToken({
            id: user._id.toString(),
            email: user.email
        });

    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        },
        token
    };
};

const loginUser = async ({
    email,
    password
}) => {

    const user =
        await User.findOne({ email })
            .select("+password");

    if (!user) {
        throw new ApiError(
            401,
            "Invalid email or password"
        );
    }

    if (!user.isActive) {
        throw new ApiError(
            403,
            "Account is inactive"
        );
    }

    const passwordMatched =
        await user.comparePassword(password);

    if (!passwordMatched) {
        throw new ApiError(
            401,
            "Invalid email or password"
        );
    }

    user.lastLoginAt = new Date();

    await user.save({
        validateBeforeSave: false
    });

    const token =
        generateAccessToken({
            id: user._id.toString(),
            email: user.email
        });

    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        },
        token
    };
};

module.exports = {
    registerUser,
    loginUser
};