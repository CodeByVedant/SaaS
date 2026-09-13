const asyncHandler =
    require("../utils/asyncHandler");

const authService =
    require("../services/auth.service");

const User =
    require("../models/User");

const register = asyncHandler(
    async (req, res) => {

        const result =
            await authService.registerUser(
                req.body
            );

        res.status(201).json({
            success: true,
            message: "Registration successful",
            data: result
        });
    }
);

const login = asyncHandler(
    async (req, res) => {

        const result =
            await authService.loginUser(
                req.body
            );

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: result
        });
    }
);

const getMe = asyncHandler(
    async (req, res) => {


        const user =
            await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            data: {
                user
            }
        });
    }
);

module.exports = {
    register,
    login,
    getMe
};