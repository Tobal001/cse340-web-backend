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

/* ***********************
 * Deliver registration View
 *************************/
router.get("/", utilities.handleErrors(accountController.buildAccountManagement))

/* ***********************
 * Deliver update account View
 *************************/
router.get("/update", utilities.handleErrors(accountController.updateAccount))

/* ***********************
 * process the registration View
 *************************/
router.post('/register',
    regValidate.registationRules(),
    regValidate.checkRegData, 
    utilities.handleErrors(accountController.registerAccount)
)

/* ***********************
 * Process the login attempt
 *************************/
router.post(
    "/login",
      regValidate.loginRules(),
      regValidate.checkLoginData,
      utilities.handleErrors(accountController.accountLogin)

)

/* ***********************
 * Process logout process
 *************************/
router.get("/logout", (req, res) => {
    res.clearCookie("jwt");
    req.session.destroy(() => {
        res.redirect("/");
    });
});

/* ***********************
 * Process update Password
 *************************/
router.post(
    "/update/password",
    regValidate.passwordUpdateRules(),
    utilities.handleErrors(accountController.updatePassword)
  );

  /* *******************************
 * Process account update
 * ****************************** */
  router.post(
    "/update",
    regValidate.updateAccountRules(),
    regValidate.checkUpdateAccountData,
    utilities.handleErrors(accountController.updateAccountDetails)
  );

module.exports = router;