"use strict";

/** Routes for authentication.  */

const jsonschema = require("jsonschema");
const User = require("../models/user");
const express = require("express");
const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");
const router = new express.Router();
const { createToken, createRefreshToken } = require("../helpers/tokens");
const userAuthSchema = require("../schemas/userAuth.json");
const userRegisterSchema = require("../schemas/userRegister.json");
const { BadRequestError, UnauthorizedError } = require("../expressError");


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
        
        return res.json({ token });
    } catch (err) {
    return next(err);
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
        const now = new Date();
        const time = now.getTime();
        const expireTime = time + 1000*60*10
        
        return res.setHeader('Access-Control-Allow-Credentials', "true"),
               res.cookie("expires", expireTime, {maxAge: 1000*60*10}),
               res.json({_skateSpotToken: token}), 
               res.json({_refreshToken: refreshToken });
    }catch (err) {
        return res.status(err.status).json({error: "error", status: err.status, message: err.message}),next(err);
    }
});


/** POST /auth/logout:  { user } => {remove access token from cookie }
 * 
 * Returns a json mesaage "logged out".
 * 
 * Authorization required: none
 */


router.post("/logout", async function (req, res, next) {
    try {
        const { username } = req.body;

        await User.deleteToken(username) ;
        res.clearCookie('expires');
        
        return  res.json("logged Out");
    }catch (err) {
        return next(err);
    }
});

module.exports = router;

