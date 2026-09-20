const Joi = require("joi");

const validate = (schema) => {
    return async (req, res, next) => {
        try {
            // Validate request params
            if (schema.params) {
                const validatedParams =
                    await schema.params.validateAsync(
                        req.params,
                        {
                            abortEarly: false,
                            stripUnknown: true
                        }
                    );

                req.params = validatedParams;
            }

            // Validate request query
            if (schema.query) {
                const validatedQuery =
                    await schema.query.validateAsync(
                        req.query,
                        {
                            abortEarly: false,
                            stripUnknown: true
                        }
                    );

                req.query = validatedQuery;
            }

            // Validate request body
            if (schema.body) {
                const validatedBody =
                    await schema.body.validateAsync(
                        req.body,
                        {
                            abortEarly: false,
                            stripUnknown: true
                        }
                    );

                req.body = validatedBody;
            }

            next();

        } catch (error) {
            if (error instanceof Joi.ValidationError) {
                return res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: error.details.map((detail) => ({
                        field: detail.path.join("."),
                        message: detail.message
                    }))
                });
            }

            next(error);
        }
    };
};

module.exports = validate;








// const ApiError = require("../utils/ApiError");

// const validate = (schema) => {
//     return async (req, res, next) => {
//         try {
//             const data = {
//                 body: req.body,
//                 params: req.params,
//                 query: req.query
//             };

//             const validated = await schema.validateAsync(
//                 data,
//                 {
//                     abortEarly: false,
//                     stripUnknown: true
//                 }
//             );

//             req.body = validated.body;
//             req.params = validated.params;
//             req.query = validated.query;

//             next();

//         } catch (error) {

//             if (error.isJoi) {
//                 return next(
//                     new ApiError(
//                         400,
//                         "Validation failed",
//                         error.details.map((detail) => ({
//                             field: detail.path.join("."),
//                             message: detail.message
//                         }))
//                     )
//                 );
//             }

//             next(error);
//         }
//     };
// };

// module.exports = validate;