/* eslint-disable no-unused-vars */
const invModel = require('../models/inventory-model');
const utilities = require('../utilities/');

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render('./inventory/inventory', {
    title: className + ' vehicles',
    nav,
    grid,
  });
};

/* ***************************
 *  Build inventory
 * ************************** */
invCont.buildByInventoryByInvId = async function (req, res, next) {
  const inv_id = req.params.inv_id;
  const data = await invModel.getInventoryByInvId(inv_id);
  
  const vehicle = data[0];
  const grid = await utilities.buildInventoryGrid(vehicle);
  const nav = await utilities.getNav();

  res.render('./inventory/inventory', {
    title: `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`,
    nav,
    grid
  });
};

module.exports = invCont;
