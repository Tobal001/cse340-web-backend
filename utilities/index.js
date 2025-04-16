/* eslint-disable no-unused-vars */
const invModel = require('../models/inventory-model');
const reviewModel = require('../models/review-model')
const Util = {};
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  console.log(data);
  let list = '<ul class="nav-ul">';
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += '<li>';
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      '</a>';
    list += '</li>';
  });
  list += '</ul>';
  return list;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid = '';
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += '<li>';
      grid += `
        <a href="/inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
          <img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors" />
        </a>
        <div class="namePrice">
          <hr />
          <h2>
            <a href="/inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
              ${vehicle.inv_make} ${vehicle.inv_model}
            </a>
          </h2>
          <span>$${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</span>
        </div>
      `;
      grid += '</li>';
    });
    grid += '</ul>';
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};



/* **************************************
 * Build the vehicle details view HTML
 * ************************************ */

Util.buildInventoryGrid = async function (data) {
  let grid = '';

  if (data) {
    grid = `
      <div class="vehicle-container">
        <img src="${data.inv_image}" alt="Image of ${data.inv_make} ${data.inv_model}" />
        <div class="vehicle-info">
          <h2>Price: $ ${new Intl.NumberFormat().format(data.inv_price)}</h2>
          <h3>${data.inv_make} ${data.inv_model} Details</h3>
          <p><strong>Description:</strong> ${data.inv_description}</p>
          <p><strong>Color:</strong> ${data.inv_color}</p>
          <p><strong>Miles:</strong> ${new Intl.NumberFormat().format(data.inv_miles)}</p>
        </div>
      </div>
    `;
  } else {
    grid += '<p class="notice">Sorry, no vehicle details found.</p>';
  }

  return grid;
};

/* **************************************
 *Classification toggle list
 * ************************************ */

Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

/* ****************************************
get classificationList
**************************************** */
Util.getClassifications = async function () {
  const data = await invModel.getClassifications()
  return data.rows
}


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* ****************************************
* Middleware to check token validity
**************************************** */
// utilities/index.js
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      (err, decoded) => {
        if (err) {
          res.clearCookie("jwt")
          req.flash("notice", "Session expired. Please log in again.")
          return res.redirect("/account/login")
        }

        res.locals.accountData = decoded
        res.locals.loggedin = true

        if (!req.session.accountData) {
          req.session.loggedin = true
          req.session.accountData = decoded
        }

        next()
      }
    )
  } else {
    res.locals.loggedin = false
    next()
  }
}


 /* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

 /* ****************************************
 *  Middleware to check if user is admin
 * ************************************ */
 Util.checkAdmin = (req, res, next) => {
  const accountData = res.locals.accountData || req.session.accountData;

  if (accountData && accountData.account_type === 'Admin') {
    return next();
  } else {
    req.flash('notice', 'Access denied. Admins only.');
    return res.redirect('/account/login');
  }
};

/* ************************
 * Constructs an HTML unordered list of reviews
 ************************** */
Util.getReviewList = async function (inv_id, account_id) {
  try {
    const reviews = await reviewModel.getVehicleReviews(inv_id, account_id);

    let list = `
      <div class="review-list">
        <h2>Customer Reviews</h2>
        <ul class="review-ul">
    `;

    if (reviews.length === 0) {
      list += `
        <li>No reviews yet. Be the first to write one!</li>
        </ul>
        <a href="/review/new/${inv_id}" class="write-review-link">Write Review</a>
      `;
    } else {
      for (const review of reviews) {
        const reviewerName = `${review.account_firstname} ${review.account_lastname}`;
        const isOwner = String(review.account_id) === String(account_id);

        list += `
          <li class="review-item">
            <input type="hidden" name="review_id" value="${review.review_id}" />
            <p><strong>${reviewerName}</strong> (${new Date(review.review_time_stamp).toLocaleDateString()})</p>
            <p>Rating: ${review.review_rating} / 5</p>
            <p>${review.review_text}</p>
        `;

        if (isOwner) {
          list += `
            <div class="review-actions">
              <a href="/review/edit/${review.review_id}">Edit</a> |
              <a href="/review/delete/${review.review_id}">Delete</a>
            </div>
          `;
        }else list += ''

        list += `</li>`;
      }

      list += `</ul>
        <a href="/review/new/${inv_id}" class="write-review-link">Write Review</a>
      `;
    }

    list += `</div>`;
    return list;
  } catch (error) {
    console.error('Error building review list:', error);
    return `
      <div class="review-list">
        <h2>Customer Reviews</h2>
        <ul><li>Unable to load reviews at this time.</li></ul>
      </div>
    `;
  }
};


module.exports = Util;
