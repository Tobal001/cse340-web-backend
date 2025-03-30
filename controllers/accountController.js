const utilities = require('../utilities');
const accountModel = require('../models/account-model')

/* ***********************
 * View Engine and Templates
 *************************/
async function buildLogin(req, res, next){
    let nav = await utilities.getNav()
    res.render('./account/login', {
        title: 'Login',
        nav,
    })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/registration", {
      title: "Register",
      nav,
      errors: null
    })
  }

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body
// use the database column names for form input names, variables and parameters. 
// This will help you keep the data clear as it moves through the processes of the application.
  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}

module.exports = { 
    buildLogin,
    buildRegister,
    registerAccount
 }