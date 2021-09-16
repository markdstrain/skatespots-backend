"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for companies */

class Spot {
    /** Create a skate spot (from data), update db, return new job data.
     * 
     * data should be {}
     */
    
}