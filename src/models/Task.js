const mongoose = require("mongoose");

const {
    TASK_STATUS,
    TASK_PRIORITY
} = require("../utils/constants");

const taskSchema = new mongoose.Schema(
    {
        workspace: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workspace",
            required: true,
            index: true
        },

        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true,
            index: true
        },

        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 200
        },

        description: {
            type: String,
            trim: true,
            maxlength: 5000,
            default: ""
        },

        status: {
            type: String,
            enum: Object.values(TASK_STATUS),
            default: TASK_STATUS.BACKLOG,
            index: true
        },

        priority: {
            type: String,
            enum: Object.values(TASK_PRIORITY),
            default: TASK_PRIORITY.MEDIUM,
            index: true
        },

        assignee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
            index: true
        },

        reporter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        tags: [
            {
                type: String,
                trim: true,
                lowercase: true
            }
        ],

        dueDate: {
            type: Date,
            default: null,
            index: true
        },

        parentTask: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task",
            default: null,
            index: true
        },

        isDeleted: {
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

taskSchema.index({
    workspace: 1,
    project: 1,
    status: 1
});

taskSchema.index({
    workspace: 1,
    assignee: 1,
    priority: 1
});

taskSchema.index({
    workspace: 1,
    tags: 1
});

module.exports = mongoose.model(
    "Task",
    taskSchema
);