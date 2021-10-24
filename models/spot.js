"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate, sqlForDetailEntry } = require("../helpers/sql");
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');


/** Related functions for companies */

class Spot {
    //Create a skate spot (from data), update db, return new job data.

//create makes our new spots takes in infor creates spot table and joined detail table
          static async create({ title, coordinates, user, details, ranking=0 }) {
                    console.log(title);
                    //gettting time of creation
                    const ts = moment().format('YYYY-MM-DD HH:mm:ss');
                    console.log(ts);
                    //set up the spot table
                    const result = await db.query(
                            `INSERT INTO spots
                              (spot_id,
                               spot_Name,
                               latitude,
                               longitude,
                               creator,
                               created,
                               ranking)
                            VALUES ($1, $2, $3, $4, $5, $6, $7)
                            RETURNING   spot_id as id, spot_name as title, latitude, longitude, creator, created, ranking`,
                        [
                              uuidv4(),
                              title,
                              coordinates[0],
                              coordinates[1],
                              user,
                              ts,
                              ranking
                        ]);    
                    const spot = result.rows[0];
                    // the details are defaulted false so we'll take in a partial update for details
                    //by getting the keys and values and use our helper to set partial Update the details
                    const { setCols, values, indexes } = sqlForDetailEntry(
                              details,
                              {
                                public : 'public',
                                privateSpot: 'private_spot',
                                skatePark: 'skate_park',
                                stairs: 'stairs',
                                handrails: 'handrails',
                                curbs: 'curbs',
                                flatRail: 'flat_rail',
                                hubbas: 'hubbas',
                                transition: 'transition',
                                street: 'street',
                                poolSpot: 'pool_spot',
                                bowl: 'bowl',
                                vert: 'vert',
                                diy: 'diy',
                                mini: 'mini',
                                manny: 'manny',
                                pGrag: 'p_grag',
                                pLot: 'p_lot' 
                              });
                  
                   
                    // Now we make our query string for spot_details table
                    console.log(setCols)
                    console.log(indexes)
                    const querySql =
                              `INSERT INTO spot_details (
                                        detail_id,         
                                        id,
                                        ${setCols}
                                        )
                              VALUES($1, $2, ${indexes} )
                               RETURNING *`;
                               
                    // we make the call to our database with values setup. with a new uuid #
                    const detail = await db.query(querySql, [uuidv4(), spot.id, ...values]);
                    
                    // delet redundant info 
                    delete detail.rows[0].detail_id;
                    delete detail.rows[0].id;
                    spot.details = detail.rows[0];
                    
                    // send back our new object.
                    return spot;
      }
      
}
module.exports = Spot;