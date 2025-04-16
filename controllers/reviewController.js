const reviewModel = require('../models/review-model');
const invModel = require('../models/inventory-model')
const utilities = require('../utilities')

const reviewCont = {};

/* *******************************************
 *    GET: render form to create a new review
 * ****************************************** */
reviewCont.getReviewForm = async function (req, res) {
    try {
      const inv_id = parseInt(req.params.inv_id);
      const nav = await utilities.getNav();
      res.render('review/reviewForm', {
        title: 'New Review',
        nav,
        inv_id,
        account_id: req.body?.account_id || null,
        review_rating: req.body?.review_rating || '',
        review_text: req.body?.review_text || '',
        review_id: req.body?.review_id || '',
        error: null
      });
    } catch (error) {
      console.error('Error rendering review form:', error);
      res.status(500).render('error', {
        message: 'There was a problem loading the review form.'
      });
    }
  };

/* ***************************
 *  POST: Submit new review
 * ************************** */
reviewCont.postReview = async function(req, res) {
  const inv_id = parseInt(req.body.inv_id);
  const account_id = parseInt(req.session.accountData?.account_id);
  const review_rating = parseInt(req.body.review_rating);
  const review_text = req.body.review_text;
  const review_id = parseInt(req.body.review_id);

  try {
    await reviewModel.postReview(inv_id, account_id, review_rating, review_text);
    req.flash("notice", "Your review was posted!");
    res.redirect(`/inv/detail/${inv_id}`); 
  } catch (error) {
    console.error("Error posting review:", error);
    const nav = await utilities.getNav();
    req.flash("notice", "Sorry, your review did not post.");
    res.status(500).render('review/reviewForm', {
      title: 'New Review',
      nav,
      inv_id,
      account_id,
      review_rating,
      review_text,
      review_id,
      error: "There was an error submitting your review. Please try again."
    });
  }
};
  
/* ***************************
 *  GET: Render form to edit review
 * ************************** */
reviewCont.getEditReviewForm = async function (req, res) {
  try {
    const review_id = req.params.review_id;
    const nav = await utilities.getNav();
    const review = await reviewModel.getReviewById(review_id);

    if (!review) {
      req.flash("notice", "Review not found.");
      return res.redirect("/"); 
    }

    res.render("review/reviewForm", {
      title: "Edit Your Review",
      nav,
      review_id,
      inv_id: review.inv_id,
      account_id: review.account_id,
      review_rating: review.review_rating,
      review_text: review.review_text,
      error: null
    });
  } catch (error) {
    console.error("Error loading review for editing:", error);
    res.status(500).render("error", {
      message: "Could not load review for editing."
    });
  }
};

  
  /* ***************************
 *     POST: Submit updated review
 * ************************** */
  reviewCont.editReview = async function(req, res) {
    const review_id = req.params.review_id;
    const { review_text, review_rating } = req.body;
    try {
      await reviewModel.editReview(review_id, review_text, review_rating);
      res.redirect('back');
    } catch (error) {
      console.error('Error editing review:', error);
      res.status(500).render('error', { message: 'Could not update review.' });
    }
  }
  
/* ***************************
 *     POST: Delete a review
 * ************************** */
reviewCont.deleteReview = async function(req, res) {
    const review_id = req.params.review_id;
    try {
      await reviewModel.deleteReview(review_id);
      res.redirect('back');
    } catch (error) {
      console.error('Error deleting review:', error);
      res.status(500).render('error', { message: 'Could not delete review.' });
    }
  }


  
  
  module.exports = reviewCont;