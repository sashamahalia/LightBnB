const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');
const { password } = require('pg/lib/defaults');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});


/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 * 
**/
const getUserWithEmail = function(email) {
  return Promise.resolve(pool.query(`
  SELECT * FROM users
  WHERE email = $1;
  `, [email])
  .then(res => {
    if (res.rows.length === 0) {
      return null;
    }
    return res.rows[0];
  }))
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
 const getUserWithId = function(id) {
  return Promise.resolve(pool.query(`
  SELECT * FROM users
  WHERE id = $1;
  `, [id])
  .then(res => {
    if (res.rows.length === 0) {
      return null;
    }
    return res.rows[0];
  }))
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */

const addUser = function(id) {
  return Promise.resolve(pool.query(`
  INSERT INTO users(name, password, email)
  VALUES($1, $2, $3) RETURNING *;
  `, [id.name, id.password, id.email])
  .then(res => {
    if (res.rows.length === 0) {
      return null;
    }
    return res.rows[0];
  }))
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return getAllProperties(null, 2);
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
 const getAllProperties = function(options, limit = 10) {
  return Promise.resolve(pool.query(`
  SELECT * FROM properties
  LIMIT $1
  `, [limit])
  .then(res => res.rows));
}

//  

// pool.query(queryString, values)
// .then(res => {
//   const limitedProperties = {};
//   for (let i = 1; i <= limit; i++) {
//     limitedProperties[i] = properties[i];
//   }
//   return Promise.resolve(limitedProperties);
// }).catch(err => console.error('query error', err.stack));

// const getAllProperties = function(options, limit = 10) {
//   const queryString = `
//   SELECT * FROM properties;
//   LIMIT $1
//   `;
//   const limitedProperties = {};
//   for (let i = 1; i <= limit; i++) {
//     limitedProperties[i] = properties[i];
//   }
//   return Promise.resolve(pool.query(queryString, [limit])
//   .then(res => res.rows)
//   .catch(err => console.error('query error', err.stack)))
// }
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
