const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
    {
        workspace: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workspace",
            required: true,
            index: true
        },

        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 150
        },

        key: {
            type: String,
            required: true,
            uppercase: true,
            trim: true,
            maxlength: 10
        },

        description: {
            type: String,
            trim: true,
            maxlength: 1000,
            default: ""
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        isArchived: {
            type: Boolean,
            default: false,
            index: true
        },

        deletedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

projectSchema.index({
    workspace: 1,
    key: 1
}, {
    unique: true
});

module.exports = mongoose.model(
    "Project",
    projectSchema
);