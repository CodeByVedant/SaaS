
const mongoose = require("mongoose");

const workspaceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 100
        },

        slug: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            minlength: 2,
            maxlength: 120
        },

        description: {
            type: String,
            trim: true,
            maxlength: 500,
            default: ""
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        isActive: {
            type: Boolean,
            default: true,
            index: true
        },

        deletedAt: {
            type: Date,
            default: null,
            index: true
        }
    },
    {
        timestamps: true
    }
);

/*
|--------------------------------------------------------------------------
| Indexes
|--------------------------------------------------------------------------
*/

// Quickly find workspaces owned by a user.
workspaceSchema.index({
    owner: 1,
    isActive: 1
});

// Prevent duplicate workspace slugs for the same owner.
workspaceSchema.index(
    {
        owner: 1,
        slug: 1
    },
    {
        unique: true
    }
);

module.exports = mongoose.model(
    "Workspace",
    workspaceSchema
);






