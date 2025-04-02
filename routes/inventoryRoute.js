
const express = require('express');
const router = new express.Router();
const invController = require('../controllers/invController');
const utilities = require('../utilities');


// Route to build inventory by classification view
router.get('/type/:classificationId', invController.buildByClassificationId);
router.get('/detail/:inv_id', invController.buildByInventoryByInvId);

router.get('/', invController.buildManagement);
router.get('/add-classification', utilities.handleErrors(invController.buildNewClass));
router.post("/add-classification", utilities.handleErrors(invController.AddNewClass))

module.exports = router;
