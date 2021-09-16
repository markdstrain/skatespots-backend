"use strict"

/** Routes for spots */

const jsonschema = require("jsonschema");

const express = require("express");
const { BadRequestError } = require("../expressError");
const { ensureAdmin,ensureLoggedIn } = require("../middleware/auth");
const Spot = require("../models/spot");
// const spotUpdateSchema = require("../schemas/spotUpdate.json");
// const spotSearchSchema = require("../schemas/spotSearch.json");

const router = express.Router({ mergeParams: true });

/** GET / => { spots: [ ]}
 * 
 * Returns list of all spots.
 * 
 * Authorization required: none
 */

 router.get("/", async function (req, res, next) {
    try {
        const spots = await Spot.findAll();
        return res.json({ spots });
    }catch (err) {
        return next(err);
    }
});


router.post("/", ensureLoggedIn, async function (req, res, next) {
    try {
        const {spot_name, spot_type, location_of_spot } = req.body;
        const { creator } = req.locals.user;



    }catch (err) {
        return next(err);
    }
});


module.exports = router;