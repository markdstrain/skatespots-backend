const { BadRequestError } = require("../expressError");

/**
 * Helper for making selective update queries.
 * 
 * The calling function can use it to make the SET clause of an SQL UPDATE
 * statement
 * 
 * @param dataToUpdate {Object} {field1: newVal, fieldd2: newVal, ...}
 * @param jsToSql {Object} maps js-style data fields to database column names, 
 *      like { firstName: "first_name", lastName: "last_name"}
 * 
 * @returns {Object} {sqlSetCols, dataToUpdate}
 * 
 * @example {firstName: "Mark", lastName: "Strain"} =>
 *      { setCols: '"first_name"=$1, "last_name"=$2',
 *         vlaues: ['Mark', 'Strain']}
 */

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
    const keys = Object.keys(dataToUpdate);
    if (keys.length === 0) throw new BadRequestError("No data");

    // {firstName: 'Mark', lastName: 'Strain'} => ['"first_name"=$1, '"last_name"=$2']
    const cols = keys.map((colName, idx) =>
        `"${jsToSql[colName] || colName}"=$${idx + 1}`,
    );

    return {
        setCols: cols.join(", "),
        values: Object.values(dataToUpdate),
    };

}

function sqlForDetailEntry(dataToUpdate, jsToSql) {
          const keys = Object.keys(dataToUpdate);
          if (keys.length === 0) throw new BadRequestError("No Data");
          
          const cols = keys.map((colName) =>
                    `"${jsToSql[colName] || colName}"`,
          );

          const indexes = keys.map((colName, idx) =>
                    `$${idx + 3}`
          );
          
          return {
                    setCols: cols.join(","),
                    values: Object.values(dataToUpdate),
                    indexes: indexes.join(",")
          }
}

module.exports = { sqlForPartialUpdate, sqlForDetailEntry};