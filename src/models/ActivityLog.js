const mongoose = require("mongoose");

const {
    ACTIVITY_TYPES
} = require("../utils/constants");

const activityLogSchema = new mongoose.Schema(
    {
        workspace: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workspace",
            required: true,
            index: true
        },

        task: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task",
            default: null,
            index: true
        },

        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            default: null
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        action: {
            type: String,
            enum: Object.values(ACTIVITY_TYPES),
            required: true,
            index: true
        },

        description: {
            type: String,
            required: true,
            maxlength: 500
        },

        metadata: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        }
    },
    {
        timestamps: true
    }
);

activityLogSchema.index({
    workspace: 1,
    task: 1,
    createdAt: -1
});

module.exports = mongoose.model(
    "ActivityLog",
    activityLogSchema
);