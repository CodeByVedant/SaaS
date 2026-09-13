const Joi = require("joi");

const registerSchema = Joi.object({

    body: Joi.object({
        name: Joi.string()
            .trim()
            .min(2)
            .max(100)
            .required(),

        email: Joi.string()
            .email()
            .lowercase()
            .trim()
            .required(),

        password: Joi.string()
            .min(8)
            .max(128)
            .required()
    }).required(),

    params: Joi.object(),

    query: Joi.object()
});

const loginSchema = Joi.object({

    body: Joi.object({

        email: Joi.string()
            .email()
            .lowercase()
            .trim()
            .required(),

        password: Joi.string()
            .required()

    }).required(),

    params: Joi.object(),

    query: Joi.object()
});

module.exports = {
    registerSchema,
    loginSchema
};