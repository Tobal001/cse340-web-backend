const utilities = require('.')
const { body, validationResult } = require("express-validator")
const validate = {}

validate.reviewRules = () => {
  return [
    body("inv_id")
      .trim()
      .notEmpty()
      .isInt().withMessage("Invalid inventory ID."),
    body("review_rating")
      .notEmpty()
      .isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5."),
    body("review_text")
      .trim()
      .notEmpty().withMessage("Review text cannot be empty.")
  ];
};

validate.checkReviewData = async (req, res, next) => {
  const { validationResult } = require("express-validator");
  const errors = validationResult(req);
  const inv_id = parseInt(req.body.inv_id);
  const account_id = req.session.accountData?.account_id;
  const review_rating = req.body.review_rating;
  const review_text = req.body.review_text;
  const nav = await require("./index").getNav();

  if (!errors.isEmpty()) {
    req.flash("notice", "Please fix the errors in the form.");
    return res.status(400).render("review/reviewForm", {
      title: "New Review",
      nav,
      errors: errors.array(),
      inv_id,
      account_id,
      review_rating,
      review_text
    });
  }

  next();
};

module.exports = validate;