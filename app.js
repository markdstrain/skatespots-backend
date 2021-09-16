"use strict";

/** Express app for skatespots */

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require('cors');

const { NotFoundError } = require("./expressError");


const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const spotRoutes = require("./routes/spots");


const morgan = require("morgan");

const app = express();

app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:3000', credentials: true}));
app.use(express.json()); // We're asking express to look for JSON to send and recieve messages.
app.use(morgan("tiny"));


app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/spots", spotRoutes);



/** Generic error handler: anything unhanled goes here. */
app.use(function (err, req, res, next) {
    if (process.env.NODE_ENV !== "test") console.error(err.stack);
    const status = err.status || 500;
    const message = err.message;

    return res.status(status).json({
        error: { message, status },
    });
});

module.exports = app;