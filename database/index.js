const { Pool } = require('pg');
require('dotenv').config();
/* ***************
 * Connection Pool
 * SSL Object needed for local testing of app
 * But will cause problems in production environment
 * If - else will make determination which to use
 * *************** */
let pool;

if (process.env.NODE_ENV === "development") {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
} else {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Configure SSL as needed for your production provider
    ssl: {
      // For some providers like Render, you might still need:
      rejectUnauthorized: false,
      // Or if using a trusted certificate:
      // rejectUnauthorized: true,
    },
  });
}

module.exports = {
  async query(text, params) {
    try {
      const res = await pool.query(text, params);
      if (process.env.NODE_ENV === "development") {
        console.log("executed query", { text });
      }
      return res;
    } catch (error) {
      console.error("error in query", { text });
      throw error;
    }
  },
};
