const utilities = require('../utilities');
const bcrypt = require("bcryptjs")
const accountModel = require('../models/account-model')
const jwt = require("jsonwebtoken")

/* ***********************
 * View Engine and Templates
 *************************/
async function buildLogin(req, res, next){
    let nav = await utilities.getNav()
    res.render('account/login', {
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
// Hash the password before storing
let hashedPassword
try {
  // regular password and cost (salt is generated automatically)
  hashedPassword = await bcrypt.hashSync(account_password, 10)
} catch (error) {
  req.flash("notice", 'Sorry, there was an error processing the registration.')
  res.status(500).render("account/register", {
    title: "Registration",
    nav,
    errors: null,
  })
}

// use the database column names for form input names, variables and parameters. 
// This will help you keep the data clear as it moves through the processes of the application.
  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you're registered ${account_firstname}. Please log in.`
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

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)

  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
  }

  try {
    const isMatch = await bcrypt.compare(account_password, accountData.account_password)
    if (isMatch) {
      // Create a minimal payload
      const payload = {
        account_id: accountData.account_id,
        account_email: accountData.account_email,
        account_type: accountData.account_type,
        account_firstname: accountData.account_firstname,
        account_lastname: accountData.account_lastname
      }

      const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })

      res.cookie("jwt", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 3600 * 1000 // 1 hour
      })

      req.session.loggedin = true;
      req.session.accountData = {
        account_id: accountData.account_id,
        account_email: accountData.account_email,
        account_type: accountData.account_type,
        account_firstname: accountData.account_firstname
      };
      
      return res.redirect("/account/")

    } else {
      req.flash("notice", "Please check your credentials and try again.")
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    console.error("Login Error:", error)
    req.flash("notice", "An error occurred. Please try again.")
    res.status(500).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
  }
}

/* ****************************************
 *  Deliver account management view
 * ************************************ */
async function buildAccountManagement(req, res) {
  const nav = await utilities.getNav();

  try {
    const sessionData = res.locals.accountData || req.session.accountData;

    if (!sessionData || !sessionData.account_id) {
      req.flash("notice", "Please log in to access your account.");
      return res.redirect("/account/login");
    }

    const accountData = await accountModel.getAccountById(sessionData.account_id);

    if (!accountData) {
      req.flash("notice", "Account not found.");
      return res.redirect("/account/login");
    }

    const accountName = `${accountData.account_firstname} ${accountData.account_lastname}`;

    res.render("account/management", {
      title: "Account Management",
      welcome: `Welcome, ${accountName}`,
      nav,
      errors: null,
      accountData
    });

  } catch (error) {
    console.error("Error loading account management:", error);
    req.flash("notice", "Something went wrong. Please try again.");
    return res.status(500).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  }
}

/* ***************************
 *  Build Update account view
 * ************************** */
async function updateAccount(req, res) {
  const nav = await utilities.getNav();

  try {
    const sessionData = res.locals.accountData || req.session.accountData;

    if (!sessionData || !sessionData.account_id) {
      req.flash("notice", "Please log in to access your account.");
      return res.redirect("/account/login");
    }

    const accountData = await accountModel.getAccountById(sessionData.account_id);

    if (!accountData) {
      req.flash("notice", "Account not found.");
      return res.redirect("/account/login");
    }

    res.render("account/update", {
      title: "Update Accounnt",
      nav,
      errors: null,
      accountData
    });

  } catch (error) {
    console.error("Error loading account management:", error);
    req.flash("notice", "Something went wrong. Please try again.");
    return res.status(500).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  }
}

/* ****************************************
*  Process update password
* *************************************** */
async function updatePassword(req, res) {
  const nav = await utilities.getNav();
  const account_id = req.session.accountData.account_id;
  const { account_password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(account_password, 10);
    const updateResult = await accountModel.updatePassword(account_id, hashedPassword);

    if (updateResult) {
      req.flash("notice", "Password updated successfully.");
      return res.redirect("/account/");
    } else {
      req.flash("notice", "Failed to update password.");
      return res.status(400).render("account/update", {
        title: "Update Account",
        nav,
        errors: null,
      });
    }
  } catch (error) {
    console.error("Password Update Error:", error);
    req.flash("notice", "There was an error updating your password.");
    return res.status(500).render("account/update", {
      title: "Update Accounnt",
      nav,
      errors: null,
    });
  }
}

/* ****************************************
 *  Process account details update
 * ************************************ */
async function updateAccountDetails(req, res) {
  const nav = await utilities.getNav();
  const account_id = req.session.accountData.account_id;
  const { account_firstname, account_lastname, account_email } = req.body;

  try {
    const updateResult = await accountModel.updateAccountDetails(
      account_id,
      account_firstname,
      account_lastname,
      account_email
    );

    if (updateResult) {
      // Update session data
      req.session.accountData.account_firstname = account_firstname;
      req.session.accountData.account_lastname = account_lastname;
      req.session.accountData.account_email = account_email;

      req.flash("notice", "Account information updated successfully.");
      return res.redirect("/account/");
    } else {
      req.flash("notice", "Failed to update account information.");
      return res.status(400).render("account/update", {
        title: "Update Account",
        nav,
        accountData: req.body,
        errors: null
      });
    }
  } catch (error) {
    console.error("Account Update Error:", error);
    req.flash("notice", "An error occurred while updating your account.");
    return res.status(500).render("account/update", {
      title: "Update Account",
      nav,
      accountData: req.body,
      errors: null
    });
  }
}




module.exports = { 
    buildLogin,
    buildRegister,
    registerAccount,
    accountLogin,
    buildAccountManagement,
    updateAccount,
    updatePassword,
    updateAccountDetails
 }