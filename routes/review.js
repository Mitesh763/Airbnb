const express = require("express");
const router = express.Router({ mergeParams: true }); // mergeParam is external option used to reserve the parent value for child route means parent route is merge with child route
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview, isLoggedIn,isReviewOwner } = require("../middleware.js");
const  reviewController  = require("../controllers/reviews.js");

// Review Route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.addReview));
// delete review route
router.delete("/:reviewId", isLoggedIn, isReviewOwner, wrapAsync(reviewController.destroyReview));

module.exports = router;