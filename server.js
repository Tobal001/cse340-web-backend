 
/* eslint-disable no-unused-vars */
/* ******************************************
 * This server.js file is the primary file of the
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require('express');
const session = require('express-session');
const pool = require('./database/');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const static = require('./routes/static');
const baseController = require('./controllers/baseController');
const inventoryRoute = require('./routes/inventoryRoute');
const utilities = require('./utilities/index');
const accountRoute = require('./routes/accountRoute')

/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

/* ***********************
 * View Engine and Templates
 *************************/
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', './layouts/layout'); // not at view root

/* ***********************
 * Routes
 *************************/
app.use(static);
//Index route
app.get('/', utilities.handleErrors(baseController.buildHome));
//Inventory Route
app.use('/inv', inventoryRoute);
//Account Login Route
app.use('/account', accountRoute);
// File Not Found Route - must be last route in list
app.get('/error-505', (req, res, next) => {
  next({
    status: 505,
    message: 'HTTP Version Not Supported - simulated from footer link'
  });
});
app.use(async (req, res, next) => {
  next({ status: 404, message: 'Sorry, we appear to have lost that page.' });
});

/* ***********************
 * Express Error Handler
 * Place after all other middleware
 *************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);

  let message;
  let image;

  if (err.status === 404 || err.status === 500) {
    message = err.message;
  } else if (err.status === 505) {
    // Instead of a message, show an image
    image = '/images/site/crash.png'; 
  } else {
    message = 'Oh no! There was a crash. Maybe try a different route?';
  }

  res.status(err.status || 500).render('errors/error', {
    title: err.status || 'Server Error',
    message,
    image,
    nav,
  });
});
/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT;
const host = process.env.HOST;

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});
