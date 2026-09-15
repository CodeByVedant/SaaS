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
            required: true,
            default: USER_ROLES.MEMBER
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

/*
|--------------------------------------------------------------------------
| Compound Unique Index
|--------------------------------------------------------------------------
|
| One user can belong to a workspace only once.
|
*/

workspaceMemberSchema.index(
    {
        workspace: 1,
        user: 1
    },
    {
        unique: true
    }
);

/*
|--------------------------------------------------------------------------
| Useful Query Index
|--------------------------------------------------------------------------
*/

workspaceMemberSchema.index({
    user: 1,
    role: 1
});

module.exports = mongoose.model(
    "WorkspaceMember",
    workspaceMemberSchema
);

