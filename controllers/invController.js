/* eslint-disable no-unused-vars */
const invModel = require('../models/inventory-model');
const utilities = require('../utilities');

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

/* ***************************
 *  Build Management menu 
 * ************************** */
invCont.buildManagement = async function (req, res, next){
  const grid = utilities.buildInventoryManagementGrid();
    let nav = await utilities.getNav()
    res.render('./inventory/inventory', {
        title: 'Management',
        nav,
        grid,
    })
}

/* ***************************
 *  Build New Classification View
 * ************************** */
invCont.buildNewClass = async function (req, res, next) {
  const nav = await utilities.getNav();
  const grid = await utilities.buildNewClassGrid();
  res.render('./inventory/inventory', {
    title: 'Add New Classification',
    nav,
    grid
    //error,
  });
};

/* ***************************
 *  Process New Classification
 * ************************** */
invCont.AddNewClass = async function (req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const regResult = await invModel.insertNewClass(classification_name);

  if (regResult && regResult.classification_id) {
    req.flash("notice", `You added "${classification_name}" classification.`);
    res.redirect("/inv");
  } else {
    req.flash("notice", "Sorry, the new classification could not be added.");
    res.status(500).render("./inventory/inventory", {
      title: "Add New Classification",
      nav,
      classification_name
    });
  }
}



module.exports = invCont;
