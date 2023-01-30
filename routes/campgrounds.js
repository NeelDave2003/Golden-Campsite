const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const methodOverride = require("method-override");
const { campgroundSchema } = require("../schemas");
const Review = require("../models/review");
const Campground = require("../models/campground");
const { isLoggedin, validateCampground, isAuthor } = require("../middleware");
const campgroundsControllers = require("../controllers/campgroundsControllers");
const multer = require("multer");

const { storage } = require("../cloudinary");
const upload = multer({ storage });
router
  .route("/")
  .get(catchAsync(campgroundsControllers.index))
  // .post(upload.array("image"), (req, res) => {
  //   console.log(req.body, req.files);
  //   res.send("WOW");
  // })
  .post(
    isLoggedin,

    upload.array("image"),
    validateCampground,
    catchAsync(campgroundsControllers.createCampground)
  );

router.get("/new", isLoggedin, campgroundsControllers.newForm);

router
  .route("/:id")
  .get(catchAsync(campgroundsControllers.showCampground))
  .put(
    isLoggedin,
    isAuthor,
    upload.array("image"),
    validateCampground,
    catchAsync(campgroundsControllers.editCampgroundpostrequest)
  )
  .delete(
    isLoggedin,
    isAuthor,
    catchAsync(campgroundsControllers.deleteCampground)
  );
router.get(
  "/:id/edit",
  isLoggedin,
  isAuthor,
  catchAsync(campgroundsControllers.editCampgroundgetrequest)
);

module.exports = router;
