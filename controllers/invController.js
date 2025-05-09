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
      reviewList: "",
      errors: null,
    });
  } catch (error) {
    console.error("getclassificationsbyid error", error);
    next(error);
  }
};

invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  const account_id = req.session.accountData?.account_id || null;

  try {
    const vehicleData = await invModel.getVehicleById(inv_id);
    const grid = await utilities.buildInventoryGrid(vehicleData);
    const reviewList = await utilities.getReviewList(inv_id, account_id);
    const nav = await utilities.getNav();

    res.render('inventory/inventory', {
      title: `${vehicleData.inv_make} ${vehicleData.inv_model}`,
      nav,
      grid,
      reviewList,
      errors: null
    });
  } catch (error) {
    console.error("Error building vehicle detail page:", error);
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
      title: 'Inventory Management',
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
  const { classification_name } = req.body

  const regResult = await invModel.postNewClass(classification_name);

  if (regResult) {
    req.flash("notice", `You successfully added"${classification_name}" classification.`);
    res.render('./inventory/management', {
      title: 'Management',
      nav,
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
    classification_id,
    inv_make, inv_model, inv_description,
    inv_image, inv_thumbnail, inv_price,
    inv_year, inv_miles, inv_color
  } = req.body;

  // Validate classification_id
  const parsedClassificationId = parseInt(classification_id, 10);
  if (isNaN(parsedClassificationId)) {
    req.flash("notice", "Invalid classification selected.");
    const classifications = await invModel.getClassifications();
    return res.render("./inventory/new-vehicle", {
      title: "Add New Vehicle",
      nav: await utilities.getNav(),
      classifications,
      formData: req.body,
      errors: { classification_id: "Please select a valid classification." }
    });
  }

  try {
    const regResult = await invModel.postNewInventoryItem(
      parsedClassificationId,
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
      req.flash("notice", `You successfully added "${inv_year} ${inv_make} ${inv_model}".`);
      return res.redirect(`/inv/type/${classification_id}`);
    } else {
      throw new Error("Database insertion failed.");
    }
  } catch (error) {
    console.error("Error adding new inventory:", error);
    req.flash("notice", "Sorry, the new Inventory Item could not be added.");

    const classifications = await invModel.getClassifications();

    res.render("./inventory/new-vehicle", {
      title: "Add New Vehicle",
      nav: await utilities.getNav(),
      classifications,
      formData: req.body,
      errors: { general: "An error occurred while saving data. Please try again." }
    });
  }
};


/* ***************************
 *  Get Inventory in JSON format
 * ************************** */
invCont.getInventoryJSON = async function (req, res) {
  const classification_id = parseInt(req.params.classification_id);
  const inventoryData = await invModel.getInventoryByClassificationId(classification_id);
  if (inventoryData.length > 0) {
    return res.json(inventoryData);
  } else {
    return res.json([]);
  }
};

/* ***************************
 *  Update Inventory form
 * ************************** */
invCont.buildEditForm = async function (req, res) {
  const inv_id = req.params.inv_id;
  const nav = await utilities.getNav();
  const itemData = await invModel.getInventoryByInvId(inv_id);
  const classifications = (await invModel.getClassifications()).rows;

  res.render("inventory/edit-inventory", {
    title: `Edit ${itemData.inv_make} ${itemData.inv_model}`,
    nav,
    itemData,
    classifications,
    classification_id: itemData.classification_id,
    errors: null
  });
}

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

/* ***************************
 * Build Delete inventory View
 * ************************** */
invCont.buildDeleteInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  const nav = await utilities.getNav();
  const itemData = await invModel.getInventoryByInvId(inv_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render('./inventory/delete-confirm', {
    title: 'Delete ' + itemName,
    nav,
    classification_id: itemData.classification_id,
    errors: null,
    itemData
  })
};

/* ***************************
 *  Delete Inventory Data
 * ************************** */
invCont.deleteInventoryItem = async function (req, res, next) {
  let nav = await utilities.getNav();
  const { inv_id } = req.body;

  // Attempt to delete by inv_id only
  const deleteResult = await invModel.deleteInventoryItem(inv_id);

  if (deleteResult.rowCount > 0) {
    req.flash("notice", "The item was successfully deleted.");
    res.redirect("/inv/");
  } else {
    req.flash("notice", "Sorry, the attempt to delete failed.");
    res.status(500).render("inventory/delete-confirm", {
      title: "Delete Inventory Item",
      nav,
      errors: null,
      inv_id,
    });
  }
};
module.exports = invCont
