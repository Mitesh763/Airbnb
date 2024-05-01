const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressionError = require("./utils/ExpressionError.js");
const { listingSchema } = require("./schema.js");
const { reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // console.log(req.originalUrl);
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "Log-in Must required");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectURL = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You don't have Permisson! create own listing..");
    return res.redirect(`/listing/${id}`);
  }
  next();
};

// listing validation (server side validation)
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let erMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressionError(400, erMsg);
  } else {
    next();
  }
};

// review validation
module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let erMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressionError(400, erMsg);
  } else {
    next();
  }
};

module.exports.isReviewOwner = async (req, res, next) => {
  let { id,reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.commentBy._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You don't have Permisson!");
    return res.redirect(`/listing/${id}`);
  }
  next();
};
