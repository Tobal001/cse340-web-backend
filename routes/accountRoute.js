const express = require('express');
const router = new express.Router();
const accountController = require('../controllers/accountController');
const utilities = require('../utilities');

/* ***********************
 * Deliver Login View
 *************************/
router.get('/login', utilities.handleErrors(accountController.buildLogin));

/* ***********************
 * Deliver registration View
 *************************/
router.get('/registration', utilities.handleErrors(accountController.buildRegister));

/* ***********************
 * Deliver register View
 *************************/
router.post('/register', utilities.handleErrors(accountController.registerAccount))


module.exports = router;