
const express = require('express');
const router = new express.Router();
const invController = require('../controllers/invController');
const utilities = require('../utilities');
const validate = require('../utilities/inventory-validation')


/* ***********************
 * // Route to build inventory by classification view
 *************************/

router.get('/type/:classificationId', invController.buildByClassificationId);
router.get('/detail/:inv_id', invController.buildByInventoryByInvId);

router.get('/', invController.buildManagement);
router.get('/add-classification', utilities.handleErrors(invController.buildNewClass));
router.get('/add-inventory', utilities.handleErrors(invController.buildNewInventory));



/* ***********************
 * // Process the Inventory requests
 *************************/
router.post("/add-classification", 
    validate.classificationRules(),
    validate.checkClassificationData,
    utilities.handleErrors(invController.addNewClass)
)

router.post('/add-inventory',
    validate.inventoryItemRules(),
    validate.checkInventoryData,
    utilities.handleErrors(invController.addNewInventory)
)


module.exports = router;
