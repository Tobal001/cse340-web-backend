const pool = require('../database/')

/* ***************************
 *  Get Vehicle Reviews by inv_id 
 * ************************** */
async function getVehicleReviews(inventory_id) {
  try {
    const data = await pool.query(
      `SELECT 
         r.review_id,
         r.review_text,
         r.review_rating,
         r.review_time_stamp,
         r.account_id,
         a.account_firstname,
         a.account_lastname
       FROM public.review AS r
       JOIN public.inventory AS i ON r.inv_id = i.inv_id
       JOIN public.account AS a ON r.account_id = a.account_id
       WHERE r.inv_id = $1
       ORDER BY r.review_time_stamp DESC`,
      [inventory_id]
    );
    return data.rows;
  } catch (error) {
    console.error('Get all vehicle reviews error: ' + error);
    throw error;
  }
}

/* ***************************
 *  Post Review data 
 * ************************** */
async function postReview(inv_id, account_id, review_rating, review_text) {
  try {
    const sql = `INSERT INTO public.review 
    (inv_id, account_id, review_rating, review_text)
    VALUES ($1, $2, $3, $4)
    RETURNING *`;
    const results = await pool.query(sql, [
        inv_id, 
        account_id, 
        review_rating, 
        review_text,    
    ]);
        return results.rows[0];
  }catch (error) {
    console.error('Error posting review:', error);
    throw error; 
  }
};

/* ***************************
 *  Post Edited Review data 
 * ************************** */
async function updatedReview(review_id, review_text, review_rating) {
    try {
        const sql = `
            UPDATE public.review
            SET review_text = $1,
                review_rating = $2,
            WHERE review_id = $3
            RETURN *`;
        
        const data = await pool.query(sql, [
            review_text,
            review_rating,
            review_id
        ]);
    return data.rows[0]
    }catch (error) {
        console.error("Error editing review: " + error);
    throw error;
    } 
};

/* ***************************
 *  Delete Review data 
 * ************************** */
async function deleteReview(review_id) {
    try {
        const sql = `DELETE FROM public.review WHERE inv_id = $1`
        const data = await pool.query(sql, [review_id])
        return data``
    }catch (error) {
        console.error('Error deleting review:', error);
    throw error;
    }
};


module.exports = {
    getVehicleReviews,
    postReview,
    deleteReview,
    updatedReview,
  };