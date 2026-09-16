
const Joi = require("joi");

const objectIdPattern =
    /^[0-9a-fA-F]{24}$/;

/*
|--------------------------------------------------------------------------
| Add Member
|--------------------------------------------------------------------------
*/

const addMemberSchema = Joi.object({

    body: Joi.object({

        email: Joi.string()
            .email()
            .lowercase()
            .trim()
            .required(),

        role: Joi.string()
            .valid(
                "admin",
                "member",
                "viewer"
            )
            .default("member")

    }).required(),

    params: Joi.object({
        workspaceId: Joi.string()
            .pattern(objectIdPattern)
            .required()
    }).required(),

    query: Joi.object()
});

/*
|--------------------------------------------------------------------------
| Workspace Member ID
|--------------------------------------------------------------------------
*/

const memberIdSchema = Joi.object({

    body: Joi.object(),

    params: Joi.object({

        workspaceId: Joi.string()
            .pattern(objectIdPattern)
            .required(),

        memberId: Joi.string()
            .pattern(objectIdPattern)
            .required()

    }).required(),

    query: Joi.object()
});

/*
|--------------------------------------------------------------------------
| Update Member Role
|--------------------------------------------------------------------------
*/

const updateMemberRoleSchema = Joi.object({

    body: Joi.object({

        role: Joi.string()
            .valid(
                "admin",
                "member",
                "viewer"
            )
            .required()

    }).required(),

    params: Joi.object({

        workspaceId: Joi.string()
            .pattern(objectIdPattern)
            .required(),

        memberId: Joi.string()
            .pattern(objectIdPattern)
            .required()

    }).required(),

    query: Joi.object()
});

const workspaceMembersSchema = Joi.object({

    body: Joi.object(),

    params: Joi.object({
        workspaceId: Joi.string()
            .pattern(objectIdPattern)
            .required()
    }).required(),

    query: Joi.object()
});

module.exports = {
    addMemberSchema,
    memberIdSchema,
    updateMemberRoleSchema,
    workspaceMembersSchema
};


