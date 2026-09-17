const Joi = require("joi");


const objectIdPattern =
    /^[0-9a-fA-F]{24}$/;


/*
 * =========================================================
 * CREATE PROJECT
 * =========================================================
 */
const createProjectSchema = {

    params: Joi.object({
        workspaceId: Joi.string()
            .pattern(objectIdPattern)
            .required()
            .messages({
                "string.pattern.base":
                    "Invalid workspace ID"
            })
    }),

    body: Joi.object({

        key: Joi.string()
            .trim()
            .uppercase()
            .pattern(/^[A-Z][A-Z0-9_-]*$/)
            .min(2)
            .max(20)
            .required()
            .messages({
                "string.pattern.base":
                    "Project key must start with a letter and contain only uppercase letters, numbers, underscores or hyphens"
            }),

        name: Joi.string()
            .trim()
            .min(2)
            .max(150)
            .required(),

        description: Joi.string()
            .trim()
            .max(1000)
            .allow("")
            .optional()
    })
};


/*
 * =========================================================
 * LIST PROJECTS
 * =========================================================
 */
const listProjectsSchema = {

    params: Joi.object({
        workspaceId: Joi.string()
            .pattern(objectIdPattern)
            .required()
            .messages({
                "string.pattern.base":
                    "Invalid workspace ID"
            })
    }),

    query: Joi.object({

        page: Joi.number()
            .integer()
            .min(1)
            .default(1),

        limit: Joi.number()
            .integer()
            .min(1)
            .max(100)
            .default(10),

        search: Joi.string()
            .trim()
            .max(100)
            .allow("")
            .optional(),

        archived: Joi.boolean()
            .optional(),

        sortBy: Joi.string()
            .valid(
                "createdAt",
                "updatedAt",
                "name",
                "key"
            )
            .default("createdAt"),

        sortOrder: Joi.string()
            .valid("asc", "desc")
            .default("desc")
    })
};


/*
 * =========================================================
 * GET SINGLE PROJECT
 * =========================================================
 */
const projectIdSchema = {

    params: Joi.object({

        workspaceId: Joi.string()
            .pattern(objectIdPattern)
            .required()
            .messages({
                "string.pattern.base":
                    "Invalid workspace ID"
            }),

        projectId: Joi.string()
            .pattern(objectIdPattern)
            .required()
            .messages({
                "string.pattern.base":
                    "Invalid project ID"
            })
    })
};


/*
 * =========================================================
 * UPDATE PROJECT
 * =========================================================
 */
const updateProjectSchema = {

    params: Joi.object({

        workspaceId: Joi.string()
            .pattern(objectIdPattern)
            .required(),

        projectId: Joi.string()
            .pattern(objectIdPattern)
            .required()
    }),

    body: Joi.object({

        key: Joi.string()
            .trim()
            .uppercase()
            .pattern(/^[A-Z][A-Z0-9_-]*$/)
            .min(2)
            .max(20)
            .optional(),

        name: Joi.string()
            .trim()
            .min(2)
            .max(150)
            .optional(),

        description: Joi.string()
            .trim()
            .max(1000)
            .allow("")
            .optional(),

        isArchived: Joi.boolean()
            .optional()

    }).min(1)
};


module.exports = {
    createProjectSchema,
    listProjectsSchema,
    projectIdSchema,
    updateProjectSchema
};


// const Joi = require("joi");

// const objectIdPattern = /^[0-9a-fA-F]{24}$/;

// /*
//  * CREATE PROJECT
//  */
// const createProjectSchema = {
//     body: Joi.object({
//         key: Joi.string()
//             .trim()
//             .uppercase()
//             .pattern(/^[A-Z][A-Z0-9_-]*$/)
//             .min(2)
//             .max(20)
//             .required()
//             .messages({
//                 "string.pattern.base":
//                     "Project key must start with a letter and contain only uppercase letters, numbers, underscores or hyphens"
//             }),

//         name: Joi.string()
//             .trim()
//             .min(2)
//             .max(150)
//             .required(),

//         description: Joi.string()
//             .trim()
//             .max(1000)
//             .allow("")
//             .optional()
//     }),

//     params: Joi.object({
//         workspaceId: Joi.string()
//             .pattern(objectIdPattern)
//             .required()
//             .messages({
//                 "string.pattern.base": "Invalid workspace ID"
//             })
//     })
// };


// /*
//  * LIST PROJECTS
//  */
// const listProjectsSchema = {
//     params: Joi.object({
//         workspaceId: Joi.string()
//             .pattern(objectIdPattern)
//             .required()
//             .messages({
//                 "string.pattern.base": "Invalid workspace ID"
//             })
//     }),

//     query: Joi.object({
//         page: Joi.number()
//             .integer()
//             .min(1)
//             .default(1),

//         limit: Joi.number()
//             .integer()
//             .min(1)
//             .max(100)
//             .default(10),

//         search: Joi.string()
//             .trim()
//             .max(100)
//             .allow("")
//             .optional(),

//         archived: Joi.boolean()
//             .optional(),

//         sortBy: Joi.string()
//             .valid(
//                 "createdAt",
//                 "updatedAt",
//                 "name",
//                 "key"
//             )
//             .default("createdAt"),

//         sortOrder: Joi.string()
//             .valid("asc", "desc")
//             .default("desc")
//     })
// };


// /*
//  * GET SINGLE PROJECT
//  */
// const projectIdSchema = {
//     params: Joi.object({
//         workspaceId: Joi.string()
//             .pattern(objectIdPattern)
//             .required(),

//         projectId: Joi.string()
//             .pattern(objectIdPattern)
//             .required()
//             .messages({
//                 "string.pattern.base": "Invalid project ID"
//             })
//     })
// };


// /*
//  * UPDATE PROJECT
//  */
// const updateProjectSchema = {
//     params: Joi.object({
//         workspaceId: Joi.string()
//             .pattern(objectIdPattern)
//             .required(),

//         projectId: Joi.string()
//             .pattern(objectIdPattern)
//             .required()
//     }),

//     body: Joi.object({
//         key: Joi.string()
//             .trim()
//             .uppercase()
//             .pattern(/^[A-Z][A-Z0-9_-]*$/)
//             .min(2)
//             .max(20)
//             .optional(),

//         name: Joi.string()
//             .trim()
//             .min(2)
//             .max(150)
//             .optional(),

//         description: Joi.string()
//             .trim()
//             .max(1000)
//             .allow("")
//             .optional(),

//         isArchived: Joi.boolean()
//             .optional()
//     }).min(1)
// };


// module.exports = {
//     createProjectSchema,
//     listProjectsSchema,
//     projectIdSchema,
//     updateProjectSchema
// };

