const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");

const authRoutes =
    require("./routes/auth.routes");

const notFound =
    require("./middlewares/notFound.middleware");

const errorHandler =
    require("./middlewares/error.middleware");

const app = express();

app.use(helmet());

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true
    })
);

app.use(
    express.json({
        limit: "1mb"
    })
);

app.use(
    express.urlencoded({
        extended: true,
        limit: "1mb"
    })
);

app.use(morgan("dev"));

const apiLimiter =
    rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 200,
        standardHeaders: true,
        legacyHeaders: false,
        message: {
            success: false,
            message:
                "Too many requests. Please try again later."
        }
    });

app.use("/api", apiLimiter);

app.get(
    "/",
    (req, res) => {
        res.status(200).json({
            success: true,
            message:
                "Task Management API is running"
        });
    }
);

app.use(
    "/api/v1/auth",
    authRoutes
);

app.use(notFound);

app.use(errorHandler);

module.exports = app;