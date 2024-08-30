const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { validateListing, isLoggedIn, isOwner } = require("../middleware.js");
const multer = require("multer");
const listingController = require("../controllers/listing.js");

const { storage } = require("../cloudConfig.js");

const upload = multer({ storage });

router
  .route("/")
  .get(wrapAsync(listingController.Index)) // Index route
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    // validateListing,
    wrapAsync(listingController.createListing)
  ); // create route
// .post(, (req,res)=>{
//   res.send(req.file)
// })

// new route
router.get("/new", isLoggedIn, listingController.Render);

// search route
router.post("/search", wrapAsync(listingController.searchListing));

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing)) //Show route
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    // validakteListing,
    wrapAsync(listingController.updateListing)
  ) //Updae route
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing)); // Delete route

//Edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editListing)
);

module.exports = router;
