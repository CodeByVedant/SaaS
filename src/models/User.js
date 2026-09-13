const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 100
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },

        password: {
            type: String,
            required: true,
            minlength: 8,
            select: false
        },

        avatar: {
            type: String,
            default: null
        },

        isActive: {
            type: Boolean,
            default: true,
            index: true
        },

        lastLoginAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

userSchema.pre("save", async function (next) {

    if (!this.isModified("password")) {
        return next();
    }

    const salt = await bcrypt.genSalt(12);

    this.password = await bcrypt.hash(
        this.password,
        salt
    );

    next();
});

userSchema.methods.comparePassword = async function (
    plainPassword
) {
    return bcrypt.compare(
        plainPassword,
        this.password
    );
};

module.exports = mongoose.model(
    "User",
    userSchema
);