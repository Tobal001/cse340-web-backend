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
 * Build Inventory Management Menu view HTML
 * ************************************ */
Util.buildInventoryManagementGrid = function () {
  let grid = '';
  grid += `
    <ul>
      <a href="/inv/add-classification"><li>Add New Classification</li></a>
      <a href="/inv/add-inventory"><li>Add New Vehicle</li></a>
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
    <form id="class-form" action="/inv/add-classification" method="post">
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

/* **************************************
 * Build New Inventory view
 * ************************************ */
Util.buildNewInventoryGrid = async function (formData = {}) {
  let {
    classification_id ='',
    inv_make = '',
    inv_model = '',
    inv_description = '',
    inv_image = '',
    inv_thumbnail = '',
    inv_price = '',
    inv_year = '',
    inv_miles = '',
    inv_color = ''
  } = formData;

  const classificationList = await Util.buildClassificationList(classification_id);

  let grid = '';
  grid += `
   <div>
    <p>Field is Required.</p>
    <form action="/inv/add-inventory" method="post">
      <label for="classification_id">Classification</label>
      ${classificationList}
      <br><br>

      <label for="inv_make">Make</label>
      <input type="text" id="inv_make" name="inv_make" value="${inv_make}" required><br><br>

      <label for="inv_model">Model</label>
      <input type="text" id="inv_model" name="inv_model" value="${inv_model}" required><br><br>

      <label for="inv_description">Description</label>
      <textarea id="inv_description" name="inv_description" rows="3" required>${inv_description}</textarea><br><br>

      <label for="inv_image">Image Path</label>
      <input type="text" id="inv_image" name="inv_image" placeholder="/images/vehicles/no-image.png" value="${inv_image}" required><br><br>

      <label for="inv_thumbnail">Thumbnail Path</label>
      <input type="text" id="inv_thumbnail" name="inv_thumbnail" placeholder="/images/vehicles/no-image.png" value="${inv_thumbnail}" required><br><br>

      <label for="inv_price">Price</label>
      <input type="number" id="inv_price" name="inv_price" value="${inv_price}" required><br><br>

      <label for="inv_year">Year</label>
      <input type="number" id="inv_year" name="inv_year" value="${inv_year}" required><br><br>

      <label for="inv_miles">Miles</label>
      <input type="number" id="inv_miles" name="inv_miles" value="${inv_miles}" required><br><br>

      <label for="inv_color">Color</label>
      <input type="text" id="inv_color" name="inv_color" value="${inv_color}" required><br><br>

      <button type="submit">Add Vehicle</button>
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
