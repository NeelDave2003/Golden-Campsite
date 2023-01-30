const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const methodOverride = require("method-override");
const { reviewSchema } = require("../schemas");
const Review = require("../models/review");
const Campground = require("../models/campground");
const { validateReview, isLoggedin, isReviewAuthor } = require("../middleware");
const reviewControllers = require("../controllers/reviewsControllers");
router.post(
  "/",
  validateReview,
  isLoggedin,
  catchAsync(reviewControllers.viewReviews)
);
router.delete(
  "/:reviewId",
  isLoggedin,
  isReviewAuthor,
  catchAsync(reviewControllers.deleteReviews)
);

module.exports = router;
