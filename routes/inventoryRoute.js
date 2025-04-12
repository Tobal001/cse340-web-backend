
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
router.get('/getInventory/:classification_id', 
    utilities.handleErrors(invController.getInventoryJSON));

/* ***********************
 * Route to load the inventory management view
 *************************/
router.get('/', 
    utilities.checkJWTToken, 
    utilities.checkAdmin, 
    utilities.handleErrors(invController.buildManagement)
  );
  

/* ***********************
 * Route to load the edit form for a specific vehicle
 * Populates form with existing data to allow updates
 *************************/
router.get('/edit/:inv_id', 
    utilities.handleErrors(invController.buildEditForm));

/* ***********************
 * Route to display the form for adding a new classification
 *************************/
router.get('/add/classification', 
    utilities.handleErrors(invController.buildNewClass));

/* ***********************
 * Route to display the form for adding a new vehicle
 *************************/
router.get('/add/vehicle', 
    utilities.handleErrors(invController.buildNewInventory));

/* ***********************
 * Route to display the form for deleting a vehicle
 *************************/
router.get('/delete/:inv_id', 
    utilities.handleErrors(invController.buildDeleteInventory));



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

router.post('/add/vehicle',
    validate.inventoryItemRules(),
    validate.checkInventoryData,
    utilities.handleErrors(invController.addNewInventory)
)

/* ***********************
 * Route to process update vehicle form submission
 *************************/

router.post("/update", 
    validate.inventoryItemRules(),
    validate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory))

/* ***********************
 * Route to process delete vehicle form submission
 *************************/

router.post("/delete", utilities.handleErrors(invController.deleteInventoryItem))


module.exports = router;
