const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
    {
        workspace: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workspace",
            required: true
        },

        key: {
            type: String,
            required: true,
            trim: true,
            uppercase: true,
            minlength: 2,
            maxlength: 20
        },

        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 150
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
            default: false
        },

        isActive: {
            type: Boolean,
            default: true
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

/*
|--------------------------------------------------------------------------
| INDEXES
|--------------------------------------------------------------------------
*/

/*
 * Project key must be unique inside an active workspace.
 *
 * Partial index allows a deleted project key to be reused later.
 */
projectSchema.index(
    { workspace: 1, key: 1 },
    {
        unique: true,
        partialFilterExpression: {
            isActive: true,
            deletedAt: null
        }
    }
);

/*
 * Useful for filtering active / archived projects.
 */
projectSchema.index({
    workspace: 1,
    isActive: 1,
    isArchived: 1
});

/*
 * Useful for project name searches/sorting.
 */
projectSchema.index({
    workspace: 1,
    name: 1
});

/*
 * Useful for newest-project sorting.
 */
projectSchema.index({
    workspace: 1,
    createdAt: -1
});

/*
 * Useful for finding projects by creator.
 */
projectSchema.index({
    createdBy: 1
});

module.exports = mongoose.model("Project", projectSchema);
