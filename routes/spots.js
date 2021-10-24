"use strict"
const jsonschema = require("jsonschema");
const express = require("express");
const { BadRequestError } = require("../expressError");
const { ensureAdmin,ensureLoggedIn } = require("../middleware/auth");
const Spot = require("../models/spot");
const spotCreation = require("../schemas/spotCreation.json");
const spotDetailCreation = require("../schemas/spotDetailCreation.json");


const router = express.Router({ mergeParams: true });

/** GET / => { spots: [ ]}
 * 
 * Returns list of all spots.
 * 
 * Authorization required: none
 */

 router.get("/", async function (req, res, next) {
          try {
                    const spots = await Spot.getAll();
                    return res.json({ spots });
          }catch (err) {
                    return next(err);
          }     
});


router.post("/",ensureLoggedIn, async function (req, res, next) {
          try {
                    const validator = jsonschema.validate(req.body, spotCreation);
                    if (!validator.valid) {
                              const errs = validator.errors.map(e => e.stack);
                              throw new BadRequestError(errs);
                    }
                    
                    const spot = await Spot.create(req.body);
                    return res.status(201).json({ spot });
          }catch (err) {
                    return next(err);
          }
});




module.exports = router;