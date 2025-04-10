/* eslint-disable no-unused-vars */
const invModel = require('../models/inventory-model');
const utilities = require('../utilities');

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = parseInt(req.params.classificationId);

  // Reject invalid IDs early
  if (isNaN(classification_id)) {
    return res.status(400).send("Invalid classification ID");
  }

  try {
    const data = await invModel.getInventoryByClassificationId(classification_id);
    const grid = await utilities.buildClassificationGrid(data);
    const nav = await utilities.getNav();
    const className = data[0]?.classification_name || "Unknown";

    res.render('./inventory/inventory', {
      title: `${className} vehicles`,
      nav,
      grid,
      errors: null,
    });
  } catch (error) {
    console.error("getclassificationsbyid error", error);
    next(error);
  }
};

/* ***************************
 *  Build inventory
 * ************************** */
invCont.buildByInventoryByInvId = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);

  if (isNaN(inv_id)) {
    console.error("Invalid inv_id:", req.params.inv_id);
    const nav = await utilities.getNav();
    req.flash("notice", "Invalid vehicle ID.");
    return res.status(400).render('./inventory/inventory', {
      title: "Vehicle Not Found",
      nav,
      grid: "<p>No details available.</p>",
      errors: null
    });
  }

  try {
    const data = await invModel.getInventoryByInvId(inv_id);

    if (!data || data.length === 0) {
      const nav = await utilities.getNav();
      req.flash("notice", "Vehicle not found.");
      return res.status(404).render('./inventory/inventory', {
        title: "Vehicle Not Found",
        nav,
        grid: "<p>No details available for this vehicle.</p>",
        errors: null
      });
    }

    const vehicle = data[0];

    const grid = await utilities.buildInventoryGrid(vehicle);
    const nav = await utilities.getNav();

    res.render('./inventory/inventory', {
      title: `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      grid,
      errors: null
    });

  } catch (error) {
    console.error("getInventoryByInvId error", error);
    next(error);
  }
};

/* ***************************
 *  Build Management menu 
 * ************************** */
invCont.buildManagement = async function (req, res, next){
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()
  res.render('./inventory/management', {
      title: 'management',
      nav,
      classificationSelect,
      errors: null,
  })
}

/* ***************************
 *  Build New Classification View
 * ************************** */
invCont.buildNewClass = async function (req, res, next) {
  const nav = await utilities.getNav();
  res.render('./inventory/new-classification', {
    title: 'Add New Classification',
    nav,
    errors: null,   
  });
};

/* ***************************
 *  Build New vehicle View
 * ************************** */
invCont.buildNewInventory = async function (req, res, next) {
  const nav = await utilities.getNav();
  const classifications = await utilities.getClassifications()
  const formData = {
    classification_id: '',
    inv_make: '',
    inv_model: '',
    inv_description: '',
    inv_image: '',
    inv_thumbnail: '',
    inv_price: '',
    inv_year: '',
    inv_miles: '',
    inv_color: ''
  }
  res.render('./inventory/new-vehicle', {
    title: 'Add New vehicle',
    nav,
    classifications,
    formData,
    errors: null  
  });
};

/* ***************************
 *  Process New Classification
 * ************************** */
invCont.addNewClass = async function (req, res) {
  let nav = await utilities.getNav()
  let grid = await utilities.buildNewClassGrid();
  const { classification_name } = req.body

  const regResult = await invModel.postNewClass(classification_name);

  if (regResult) {
    req.flash("notice", `You successfully added"${classification_name}" classification.`);
    res.render('./inventory/inventory', {
      title: 'Management',
      nav,
      grid,
      errors: null,
      });
  } else {
    req.flash("notice", "Sorry, the new classification could not be added.");
    res.redirect("/inv/add-classification");
  }
}

/* ***************************
 *  Process New Inventory Item
 * ************************** */
invCont.addNewInventory = async function (req, res) {
  const {
    inv_make, inv_model, inv_description,
    inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color
  } = req.body;

  const classification_id = parseInt(req.body.classification_id);

  const regResult = await invModel.postNewInventoryItem(
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color
  );

  if (regResult) {
    req.flash("notice", `You successfully added "${inv_year} ${inv_make} ${inv_model}"`);
    return res.redirect(`/inv/type/${classification_id}`);
  } else {
    req.flash("notice", "Sorry, the new Inventory Item could not be added.");
    res.redirect("/inv/add/vehicle");
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 * Build edit inventory View
 * ************************** */
invCont.buildEditInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  const nav = await utilities.getNav();
  const classifications = await utilities.getClassifications()
  const itemData = await invModel.getInventoryByInvId(inv_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render('./inventory/edit-inventory', {
    title: 'Modify ' + itemName,
    nav,
    classifications,
    classification_id: itemData.classification_id,
    errors: null,
    itemData
  })
  console.log(itemData)
};

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classifications = await utilities.getClassifications()
  const {
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
    inv_id
  } = req.body

  const updateResult = await invModel.updateInventory(
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
    inv_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classifications,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

module.exports = invCont
