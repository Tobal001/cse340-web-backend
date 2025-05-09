const utilities = require(".")
const { body, validationResult } = require("express-validator")
const accountModel = require("../models/account-model")
const validate = {}

const strongPasswordRule = body("account_password")
  .trim()
  .notEmpty()
  .isStrongPassword({
    minLength: 12,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  .withMessage("Password does not meet requirements.");

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.registationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the DB
      body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists){
          throw new Error("Email exists. Please log in or use different email")
        }
      }),
      strongPasswordRule
    ]
  }

  validate.loginRules = () => {
    return [
      body("account_email")
        .trim()
        .isEmail()
        .withMessage("A valid email is required."),
      
      body("account_password")
        .trim()
        .notEmpty()
        .withMessage("Password cannot be empty.")
    ]
  }

  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/registration", {
        errors,
        title: "Registration",
        nav,
        account_firstname,
        account_lastname,
        account_email,
      })
      return
    }
    next()
  }

validate.checkLoginData =  async (req, res, next) => {
  const {account_email, account_password} = req.body
  let errors = []
  errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      req.flash("notice", "Please fix the errors below.")
      res.render("account/login", {
        title: "Login",
        nav,
        errors: errors.array(),
        account_email,
        account_password
      })
      return
    }
    next()
  }


  validate.passwordUpdateRules = () => {
    return [strongPasswordRule];
  };
 
  /* ******************************
 *  Account Update Validation Rules
 * ***************************** */
validate.updateAccountRules = () => {
  return [
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("First name is required."),

    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Last name is required."),

    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
  ];
};

/* ******************************
 * Check update account data
 * ***************************** */
validate.checkUpdateAccountData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    return res.status(400).render("account/update", {
      title: "Update Account",
      nav,
      errors: errors.array(),
      accountData: { account_firstname, account_lastname, account_email }
    });
  }

  next();
};

  
  module.exports = validate