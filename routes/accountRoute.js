const express = require('express');
const router = new express.Router();
const accountController = require('../controllers/accountController');
const utilities = require('../utilities');
const regValidate = require('../utilities/account-validation')

/* ***********************
 * Deliver Login View
 *************************/
router.get('/login', utilities.handleErrors(accountController.buildLogin));

/* ***********************
 * Deliver registration View
 *************************/
router.get('/registration', utilities.handleErrors(accountController.buildRegister));

router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement))

/* ***********************
 * process the registration View
 *************************/
router.post('/register',
    regValidate.registationRules(),
    regValidate.checkRegData, 
    utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
    "/login",
      regValidate.loginRules(),
      regValidate.checkLoginData,
      utilities.handleErrors(accountController.accountLogin)

)

    

module.exports = router;