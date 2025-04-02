/* eslint-disable no-unused-vars */
const invModel = require('../models/inventory-model');
const Util = {};
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
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += '<li>';
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        ' ' +
        vehicle.inv_model +
        'details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        ' ' +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += '<hr />';
      grid += '<h2>';
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        ' ' +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        ' ' +
        vehicle.inv_model +
        '</a>';
      grid += '</h2>';
      grid +=
        '<span>$' +
        new Intl.NumberFormat('en-US').format(vehicle.inv_price) +
        '</span>';
      grid += '</div>';
      grid += '</li>';
    });
    grid += '</ul>';
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
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
 * Build Inventory Management Menu view HTML
 * ************************************ */
Util.buildInventoryManagementGrid = function () {
  let grid = '';
  grid += `
    <ul>
      <a href="/inv/add-classification"><li>Add New Classification</li></a>
      <a href="/new-vehicle"><li>Add New Vehicle</li></a>
    </ul>
  `;

  return grid;
};

/* **************************************
 * Build New Classification view
 * ************************************ */
Util.buildNewClassGrid = async function () {
  let grid = '';
  grid += `
   <div>
    <p>Field is Required.</p>
    <form id="class-form" action="/inv/inventory" method="post">
        <label for="classification_name">Classification Name:</label>
        <p>Name Must Be Alphabetic characters Only*</p>
        <input type="text" id="classificationName" name="classification_name"
            pattern="^[A-Za-z]+$" title="Only letters A–Z allowed. No spaces, numbers, or special characters."
            required
        >
        <br>
        <input type="submit" value="Submit">
    </form>
</div>

  `;
  
return grid;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;
