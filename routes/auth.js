"use strict";

/** Routes for authentication.  */

const jsonschema = require("jsonschema");

const User = require("../models/user");
const express = require("express");
const router = new express.Router();
const { createToken, createRefreshToken } = require("../helpers/tokens");
const userAuthSchema = require("../schemas/userAuth.json");
const userRegisterSchema = require("../schemas/userRegister.json");
const { BadRequestError } = require("../expressError");





/** POST /auth/token:  { refreshToken } => { accessToken} 
 * 
 * Return a new access Token when sending the refreshToken.
 * 
 * Authorization: must have a refreshToken.
*/

router.post("/token", async function (req, res, next) {
    try{

    }catch{

    }
});



/** POST /auth/login:   { username, password } => { accessToken, refreshToken }
 * 
 * Returns JWT tokens which can be used to authenticate further requests.
 * 
 * Authorization required: none
 */

router.post("/login", async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, userAuthSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const { username, password } = req.body;
        const user = await User.authenticate(username, password);
        const token = createToken(user);
        const refreshToken = createRefreshToken(user)
        await User.storeToken(user, refreshToken);

        return res.setHeader('Access-Control-Allow-Credentials', "true"),
               res.cookie('_skateSpotToken', token, {httpOnly: true, maxAge: 60000}),
               res.json({_refreshToken: refreshToken });
    }catch (err) {
        return res.status(err.status).json({error: "error", status: err.status, message: err.message}),next(err);
    }
});

/** POST /auth/register:  { user } => { token }
 * 
 * user must include { username, password, firstName, lastName, email }
 * 
 * Returns JWT token which can be used to authenticate further requests.
 * 
 * Authorization required: none
 */

router.post("/register", async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, userRegisterSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const newUser = await User.register({ ...req.body, isAdmin: false });
        const token = createToken(newUser);
        const refreshToken = createRefreshToken(newUser)
        await User.storeToken(newUser, refreshToken);
        
        return res.cookie("_skateSpotToken", token, {httpOnly: true, maxAge: 60000}), 
               res.json({_refreshToken: refreshToken });
    }catch (err) {
        return res.status(err.status).json({error: "error", status: err.status, message: err.message}),next(err);
    }
});

module.exports = router;

