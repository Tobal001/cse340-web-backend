const pool = require('../database/');

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  return await pool.query(
    'SELECT * FROM public.classification ORDER BY classification_name'
  );
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error('getclassificationsbyid error ' + error);
  }
}

/* ***************************
 *  Get all inventory items
 * ************************** */
async function getInventoryByInvId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory 
      WHERE inv_id = $1`,
      [inv_id]
    );
    return data.rows;
  } catch (error) {
    console.error('getinventorybyid error ' + error);
  }
}

/* ***************************
 *  Post New Classification 
 * ************************** */
async function postNewClass(classification_name) {
  try {
    const sql = "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING classification_id";
    const result = await pool.query(sql, [classification_name]);
    console.log("Insert result:", result.rows[0]);
    return result.rows[0]; // return the inserted row
  } catch (error) {
    console.error("Error adding classification:", error);
    return null;
  }
}

/* ***************************
 *  Post New Inventory Item
 * ************************** */
async function postNewInventoryItem(classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color) {
  try {
    const sql = `
  INSERT INTO public.inventory 
  (classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color) 
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
  RETURNING *
`;
    const result = await pool.query(sql, [
  classification_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,         
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color
]);
    console.log("Insert result:", result.rows[0]);
    return result.rows[0]; // return the inserted row
  } catch (error) {
    console.error("Error adding Inventory item:", error);
    return null;
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryByInvId,
  postNewClass,
  postNewInventoryItem
};
