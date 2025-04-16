const express = require('express');
const router = new express.Router();
const reviewController = require('../controllers/reviewController');
const utilities = require('../utilities');
// const validate = require('../utilities/review-validation')

/* ***********************************************************
 *	Display form to submit a new review for a specific vehicle
 *************************************************************/
router.get('/new/:inv_id', utilities.handleErrors(reviewController.getReviewForm));

/* ***********************
 *	Submit a new review
 *************************/
router.post('/post', utilities.handleErrors(reviewController.postReview));

/* ********************************
 *	Display form to edit a review
 **********************************/
router.get('/edit/:review_id', utilities.handleErrors(reviewController.getEditReviewForm));

/* ***********************
 * Submit edited review
 *************************/
router.post('/update/:review_id', utilities.handleErrors(reviewController.updateReview));

/* ***********************
 * Delete a review
 *************************/
router.delete('/delete/:review_id', utilities.handleErrors(reviewController.deleteReview));

/* ***********************
 * View all reviews for a vehicle
 *************************/ 
router.get('/review/:inv_id', utilities.handleErrors(reviewController.deleteReview));

module.exports = router


