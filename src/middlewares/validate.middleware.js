const ApiError = require("../utils/ApiError");

const validate = (schema) => {
    return async (req, res, next) => {
        try {
            const data = {
                body: req.body,
                params: req.params,
                query: req.query
            };

            const validated = await schema.validateAsync(
                data,
                {
                    abortEarly: false,
                    stripUnknown: true
                }
            );

            req.body = validated.body;
            req.params = validated.params;
            req.query = validated.query;

            next();

        } catch (error) {

            if (error.isJoi) {
                return next(
                    new ApiError(
                        400,
                        "Validation failed",
                        error.details.map((detail) => ({
                            field: detail.path.join("."),
                            message: detail.message
                        }))
                    )
                );
            }

            next(error);
        }
    };
};

module.exports = validate;