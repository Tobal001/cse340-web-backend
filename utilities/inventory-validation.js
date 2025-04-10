const utilities = require('.')
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
  *  Classification Data Validation Rules
  * ********************************* */
validate.classificationRules = () => {
    return [
        body('classification_name')
          .notEmpty().withMessage('Classification name is required')
          .matches(/^[A-Za-z]+$/).withMessage('Classification name must contain only letters with no spaces or special characters')
          .isLength({ min: 3 }).withMessage('Classification name must be at least 3 characters long'),
    ]
};

/* ******************************
 * Check data and return errors or continue 
 * ***************************** */

validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      let grid = await utilities.buildNewClassGrid()

      res.render("./inventory/new-classification", {
        errors: errors.array(),
        title: "Add New Classification",
        nav,
        grid,
        classification_name
      })
      return
    }
    next()
  }
  
/* ******************************
 * Inventory Data Validation Rules
 * ***************************** */

  validate.inventoryItemRules = () => {
      return [
      
  body('classification_id')
    .notEmpty().withMessage('Classification is required')
    .isInt().withMessage('Classification must be a number'),

  body('inv_make')
    .notEmpty().withMessage('Make is required')
    .isAlpha().withMessage('Make must contain only letters'),

  body('inv_model')
    .notEmpty().withMessage('Model is required')
    .isAlphanumeric().withMessage('Model must contain only letters and numbers'),

  body('inv_description')
    .notEmpty().withMessage('Description is required'),

  body('inv_image')
    .notEmpty().withMessage('Image path is required')
    .isString().withMessage('Image path must be a string'),

  body('inv_thumbnail')
    .notEmpty().withMessage('Thumbnail path is required')
    .isString().withMessage('Thumbnail path must be a string'),

  body('inv_price')
    .notEmpty().withMessage('Price is required')
    .isInt({ min: 0 }).withMessage('Price must be a non-negative integer'),

  body('inv_year')
    .notEmpty().withMessage('Year is required')
    .isInt({ min: 1886, max: new Date().getFullYear() + 1 }).withMessage('Year must be a valid car production year'),

  body('inv_miles')
    .notEmpty().withMessage('Miles is required')
    .isInt({ min: 0 }).withMessage('Miles must be a non-negative integer'),

  body('inv_color')
    .notEmpty().withMessage('Color is required')
    .isAlpha().withMessage('Color must contain only letters'),
      ]
    }

/* ******************************
 * Check inventory data and return errors or continue 
 * ***************************** */

validate.checkInventoryData = async (req, res, next) => {
  const {
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
  } = req.body;

  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();

    res.render("./inventory/new-vehicle", {
      errors: errors.array(),
      title: "Add New Classification",
      nav,
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
    });
    return;
  }

  next();
};

/* ******************************
 * Check inventory data and return errors to edit view
 * ***************************** */

validate.checkUpdateData = async (req, res, next) => {
  const {
    inv_id,
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
  } = req.body;

  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();

    res.render("./inventory/edit-inventory", {
      errors: errors.array(),
      title: 'Modify' + inv_make + inv_model,
      nav,
      inv_id,
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
    });
    return;
  }

  next();
};

module.exports = validate;