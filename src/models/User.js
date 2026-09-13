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

/*
|--------------------------------------------------------------------------
| Password Hash Middleware
|--------------------------------------------------------------------------
| This middleware automatically hashes the password before saving
| the user to MongoDB.
|
| We are using async middleware, so we DO NOT use next().
|--------------------------------------------------------------------------
*/

userSchema.pre("save", async function () {

    // If password was not changed, don't hash it again.
    if (!this.isModified("password")) {
        return;
    }

    // Generate salt
    const salt = await bcrypt.genSalt(12);

    // Hash password
    this.password = await bcrypt.hash(
        this.password,
        salt
    );
});

/*
|--------------------------------------------------------------------------
| Password Comparison Method
|--------------------------------------------------------------------------
| Used during login to compare the plain-text password entered by
| the user with the hashed password stored in MongoDB.
|--------------------------------------------------------------------------
*/

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




