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
const getAllReservations = function(guest_id) {
  return Promise.resolve(pool.query(`
  SELECT properties.*, reservations.*, avg(rating) as average_rating
  FROM reservations
  JOIN properties ON reservations.property_id = properties.id
  JOIN property_reviews ON properties.id = property_reviews.property_id 
  WHERE reservations.guest_id = $1
  AND reservations.end_date < now()::date
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date
  LIMIT 10;
  `, [guest_id])
  .then(res => {
    if (res.rows.length === 0) {
      return null;
    }
    return res.rows;
  }))
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
  const queryParams = [];

  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length}\n`;
  }
  if (options.minimum_price_per_night && options.maximum_price_per_night) {
    queryParams.push(`${options.minimum_price_per_night}`);
    queryString += ` AND cost_per_night >= $${queryParams.length} * 100\n`;
    queryParams.push(`${options.maximum_price_per_night}`);
    queryString += ` AND cost_per_night <= $${queryParams.length} * 100 \n`;
  }
  if (options.minimum_rating) {
    queryParams.push(`${options.minimum_rating}`);
    queryString += `AND property_reviews.rating >= $${queryParams.length} `;

  }
  if (options.owner_id) {
    queryParams.push(`${options.owner_id}`);
    queryString += `AND owner_id = $${queryParams.length} `;
  }

  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  return Promise.resolve(pool.query(queryString, queryParams)
  .then(res => res.rows ))
  .catch(err => console.log(err));
}
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
// const addProperty = function(property) {
//   const propertyId = Object.keys(properties).length + 1;
//   property.id = propertyId;
//   properties[propertyId] = property;
//   return Promise.resolve(property);
// }

const addProperty = function(property) {
  console.log('property:', property);
  return Promise.resolve(pool.query(`
  INSERT INTO properties(title, description, number_of_bathrooms, number_of_bedrooms, parking_spaces, cost_per_night, thumbnail_photo_url, cover_photo_url, street, country, city, province, post_code, owner_id)
  VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *;
  `, [property.title, property.description, property.number_of_bathrooms, property.number_of_bedrooms, property.parking_spaces, property.cost_per_night, property.thumbnail_photo_url, property.cover_photo_url, property.street, property.country, property.city, property.province, property.post_code, property.owner_id])
  .then(res => {
    if (res.rows.length === 0) {
      return null;
    }
    return res.rows[0];
  }))
}
exports.addProperty = addProperty;
