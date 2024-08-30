const Listing = require("../models/listing.js");

module.exports.Index = async (req, res) => {
  console.log(req.query.cat);
  let cat = req.query.cat;
  let allListing = await Listing.find({ listingType: cat });
  console.log(allListing);
  res.render("./listings/index.ejs", { allListing });
};

module.exports.Render = (req, res) => {
  res.render("./listings/new.ejs");
};

module.exports.searchListing = async (req, res) => {
  let search = req.body.search;
  // console.log(search);
  if (search === "") {
    req.flash("error", "Input Your Destination");
    res.redirect("/listing?cat=All");
  } else {
    let allListing = await Listing.find({ location: search });
    console.log(allListing);
    if (allListing && allListing.length) {
      req.flash("success", "Your searched Listing");
      // console.log(allListing);
      res.render("./listings/index.ejs", { allListing });
    } else {
      req.flash("error", "Search Listing doesn't exist");
      res.redirect("/listing?cat=All");
    }
  }
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "commentBy" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Requested Listing doesn't exist!");
    res.redirect("/listing?cat=All");
  }
  res.render("./listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
  // let { title,description, image, price, country, location } = req.body;
  // if(!req.body.listing){
  //     throw new ExpressionError(400,"Send valid data for listing");
  // }  // only check data are available or not.
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  let added = await newListing.save();
  console.log(added);
  req.flash("success", "New listing Added successfully");
  res.redirect("/listing?cat=All");
  // nextTick(err);
};

module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Requested listing doesn't exist");
    res.redirect("/listing?cat=All");
  }

  let originalImage = listing.image.url;
  console.log(originalImage);

  originalImage = originalImage.replace("upload", "/upload/w_250");
  console.log(originalImage);
  res.render("./listings/edit.ejs", { listing, originalImage });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  // let listing = await Listing.findById(id);
  // if(!listing.owner._id.equals(res.locals.currUser._id)){
  //   req.flash("error","You don't have Permissoon!");
  //   return res.redirect(`/listing/${id}`);
  // }
  const listing = await Listing.findByIdAndUpdate(id, {
    ...req.body.listing,
  });
  console.log(listing);

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  // console.log(updatedListing);
  // if (!listing) {
  //   req.flash("error", "Requested Listing doesn't exist!");
  //   res.redirect("/listing?cat=All");
  // } else {
  // }
  req.flash("success", "listing Updated successfully");
  res.redirect(`/listing/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "listing Deleted successfully");
  res.redirect("/listing?cat=All");
};
