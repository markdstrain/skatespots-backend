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
                    const response = await Spot.getSpots();
                    const spots = response.rows
                    return res.json({spots});
          }catch (err) {
                    return next(err);
          }     
});

router.get("/:id", async function (req, res, next) {
          try {
            const spot= await Spot.getASpot(req.params.id);
            return res.json({ spot });
          } catch (err) {
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