
const express = require('express');
const router = new express.Router();
const invController = require('../controllers/invController');
const utilities = require('../utilities');
const validate = require('../utilities/inventory-validation')

/* ***********************
 * Route to view inventory by classification (e.g., /inv/type/1)
 *************************/
router.get('/type/:classificationId', invController.buildByClassificationId);

/* ***********************
 * Route to view a single vehicle's detail page (e.g., /inv/detail/101)
 *************************/
router.get('/detail/:inv_id', invController.buildByInventoryByInvId);

/* ***********************
 * API route to fetch inventory data in JSON format by classification ID
 * Used for dynamic front-end features (e.g., dropdown filtering)
 *************************/
router.get('/getInventory/:classification_id', utilities.handleErrors(invController.getInventoryJSON));

/* ***********************
 * Route to load the inventory management view
 * Main inventory control panel for admin/staff
 *************************/
router.get('/', invController.buildManagement);

/* ***********************
 * Route to load the edit form for a specific vehicle
 * Populates form with existing data to allow updates
 *************************/
router.get('/edit/:inv_id', utilities.handleErrors(invController.buildEditInventory));

/* ***********************
 * Route to display the form for adding a new classification
 *************************/
router.get('/add/classification', utilities.handleErrors(invController.buildNewClass));

/* ***********************
 * Route to display the form for adding a new vehicle
 *************************/
router.get('/add/vehicle', utilities.handleErrors(invController.buildNewInventory));



/* ***********************
 * Route to process new classification form submission
 * Applies validation rules and error handling middleware
 *************************/
router.post("/add-classification", 
    validate.classificationRules(),
    validate.checkClassificationData,
    utilities.handleErrors(invController.addNewClass)
)

/* ***********************
 * Route to process new vehicle form submission
 * Applies validation rules and error handling middleware
 *************************/

router.post('/add-inventory',
    validate.inventoryItemRules(),
    validate.checkInventoryData,
    utilities.handleErrors(invController.addNewInventory)
)

/* ***********************
 * Route to update vehicle form submission
 *************************/

router.post("/update", 
    validate.inventoryItemRules(),
    validate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory))


module.exports = router;
