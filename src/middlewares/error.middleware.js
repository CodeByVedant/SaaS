const errorHandler = (
    err,
    req,
    res,
    next
) => {

    let statusCode =
        err.statusCode || 500;

    let message =
        err.message || "Internal server error";

    if (err.name === "CastError") {
        statusCode = 400;
        message = "Invalid resource ID";
    }

    if (err.code === 11000) {
        statusCode = 409;

        const field =
            Object.keys(err.keyValue)[0];

        message =
            `${field} already exists`;
    }

    if (err.name === "ValidationError") {
        statusCode = 400;

        message = Object.values(
            err.errors
        )
            .map((error) => error.message)
            .join(", ");
    }

    res.status(statusCode).json({
        success: false,
        message,
        errors: err.errors || [],
        ...(process.env.NODE_ENV === "development" && {
            stack: err.stack
        })
    });
};

module.exports = errorHandler;