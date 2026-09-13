const mongoose = require("mongoose");
const {
    USER_ROLES
} = require("../utils/constants");

const workspaceMemberSchema = new mongoose.Schema(
    {
        workspace: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workspace",
            required: true,
            index: true
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        role: {
            type: String,
            enum: Object.values(USER_ROLES),
            default: USER_ROLES.MEMBER,
            required: true
        },

        joinedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

workspaceMemberSchema.index(
    {
        workspace: 1,
        user: 1
    },
    {
        unique: true
    }
);

module.exports = mongoose.model(
    "WorkspaceMember",
    workspaceMemberSchema
);