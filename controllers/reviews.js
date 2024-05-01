const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.addReview = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);

  newReview.commentBy = req.user;
  listing.reviews.push(newReview);
  console.log(newReview);

  await newReview.save();
  await listing.save();

  req.flash("success", "New Review added successfully");
  res.redirect(`/listing/${listing._id}`);
};

module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);

  req.flash("success", "review deleted successfully");
  res.redirect(`/listing/${id}`);
};
