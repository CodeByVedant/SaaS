const Joi = require("joi");

const objectIdPattern =
    /^[0-9a-fA-F]{24}$/;   // regeX = regular expression for mongoDB objectID

/*
|--------------------------------------------------------------------------
| Create Workspace
|--------------------------------------------------------------------------
*/

const createWorkspaceSchema = Joi.object({

    body: Joi.object({

        name: Joi.string()
            .trim()
            .min(2)
            .max(100)
            .required(),

        slug: Joi.string()
            .trim()
            .lowercase()
            .min(2)
            .max(120)
            .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
            .required(),

        description: Joi.string()
            .trim()
            .max(500)
            .allow("")
            .default("")

    }).required(),

    params: Joi.object(),

    query: Joi.object()
});

/*
|--------------------------------------------------------------------------
| Workspace ID
|--------------------------------------------------------------------------
*/

const workspaceIdSchema = Joi.object({

    body: Joi.object(),

    params: Joi.object({
        workspaceId: Joi.string()
            .pattern(objectIdPattern)
            .required()
    }).required(),

    query: Joi.object()
});

/*
|--------------------------------------------------------------------------
| Update Workspace
|--------------------------------------------------------------------------
*/

const updateWorkspaceSchema = Joi.object({

    body: Joi.object({

        name: Joi.string()
            .trim()
            .min(2)
            .max(100),

        description: Joi.string()
            .trim()
            .max(500)
            .allow(""),

        slug: Joi.string()
            .trim()
            .lowercase()
            .min(2)
            .max(120)
            .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)

    })
        .min(1)
        .required(),

    params: Joi.object({
        workspaceId: Joi.string()
            .pattern(objectIdPattern)
            .required()
    }).required(),

    query: Joi.object()
});

module.exports = {
    createWorkspaceSchema,
    workspaceIdSchema,
    updateWorkspaceSchema
};

