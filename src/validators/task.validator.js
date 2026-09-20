const Joi = require("joi");

const {
    TASK_STATUS,
    TASK_PRIORITY
} = require("../utils/constants");


const objectIdPattern =
    /^[0-9a-fA-F]{24}$/;


/*
 * CREATE TASK
 */
const createTaskSchema = {
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
    }),

    body: Joi.object({
        title: Joi.string()
            .trim()
            .min(2)
            .max(200)
            .required(),

        description: Joi.string()
            .trim()
            .max(5000)
            .allow("")
            .optional(),

        status: Joi.string()
            .valid(
                ...Object.values(TASK_STATUS)
            )
            .default(TASK_STATUS.BACKLOG),

        priority: Joi.string()
            .valid(
                ...Object.values(TASK_PRIORITY)
            )
            .default(TASK_PRIORITY.MEDIUM),

        assignee: Joi.string()
            .pattern(objectIdPattern)
            .allow(null)
            .optional()
            .messages({
                "string.pattern.base":
                    "Invalid assignee ID"
            }),

        dueDate: Joi.date()
            .iso()
            .allow(null)
            .optional()
            .messages({
                "date.format":
                    "Due date must be a valid ISO date"
            }),

        tags: Joi.array()
            .items(
                Joi.string()
                    .trim()
                    .lowercase()
                    .min(1)
                    .max(50)
            )
            .max(20)
            .default([])
    })
};


/*
 * LIST TASKS
 */
const listTasksSchema = {
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
            .default(20),

        search: Joi.string()
            .trim()
            .max(100)
            .allow("")
            .optional(),

        status: Joi.string()
            .valid(
                ...Object.values(TASK_STATUS)
            )
            .optional(),

        priority: Joi.string()
            .valid(
                ...Object.values(TASK_PRIORITY)
            )
            .optional(),

        assignee: Joi.string()
            .pattern(objectIdPattern)
            .optional()
            .messages({
                "string.pattern.base":
                    "Invalid assignee ID"
            }),

        tag: Joi.string()
            .trim()
            .lowercase()
            .max(50)
            .optional(),

        sortBy: Joi.string()
            .valid(
                "createdAt",
                "updatedAt",
                "title",
                "priority",
                "status",
                "dueDate"
            )
            .default("createdAt"),

        sortOrder: Joi.string()
            .valid("asc", "desc")
            .default("desc")
    })
};


/*
 * TASK ID
 */
const taskIdSchema = {
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
            }),

        taskId: Joi.string()
            .pattern(objectIdPattern)
            .required()
            .messages({
                "string.pattern.base":
                    "Invalid task ID"
            })
    })
};


/*
 * UPDATE TASK
 */
const updateTaskSchema = {
    params: Joi.object({
        workspaceId: Joi.string()
            .pattern(objectIdPattern)
            .required(),

        projectId: Joi.string()
            .pattern(objectIdPattern)
            .required(),

        taskId: Joi.string()
            .pattern(objectIdPattern)
            .required()
    }),

    body: Joi.object({
        title: Joi.string()
            .trim()
            .min(2)
            .max(200)
            .optional(),

        description: Joi.string()
            .trim()
            .max(5000)
            .allow("")
            .optional(),

        status: Joi.string()
            .valid(
                ...Object.values(TASK_STATUS)
            )
            .optional(),

        priority: Joi.string()
            .valid(
                ...Object.values(TASK_PRIORITY)
            )
            .optional(),

        assignee: Joi.string()
            .pattern(objectIdPattern)
            .allow(null)
            .optional()
            .messages({
                "string.pattern.base":
                    "Invalid assignee ID"
            }),

        dueDate: Joi.date()
            .iso()
            .allow(null)
            .optional(),

        tags: Joi.array()
            .items(
                Joi.string()
                    .trim()
                    .lowercase()
                    .min(1)
                    .max(50)
            )
            .max(20)
            .optional()
    }).min(1)
};


module.exports = {
    createTaskSchema,
    listTasksSchema,
    taskIdSchema,
    updateTaskSchema
};

