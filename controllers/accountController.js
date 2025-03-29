const utilities = require('../utilities');

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

module.exports = { buildLogin }