 
  require("dotenv").config();
 

const express = require("express");
const path = require("path");
const Joi = require("joi");
const flash = require("connect-flash");
const session = require("express-session");
const { campgroundSchema, reviewSchema } = require("./schemas.js");
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const methodOverride = require("method-override");
const morgan = require("morgan");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const ejsMate = require("ejs-mate");
const Review = require("./models/review");
const { findByIdAndDelete } = require("./models/campground");
const campgroundsRoutes = require("./routes/campgrounds");
const reviewsRoutes = require("./routes/reviews");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const mongoSanitize = require("express-mongo-sanitize");
const userRoutes = require("./routes/users");
const dbUrl = "mongodb://0.0.0.0:27017/yelp-camp";
 
mongoose.connect(dbUrl, {
  useNewUrlParser: true,

  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("DataBase Connected");
});
const app = express();

app.engine("ejs", ejsMate);

app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(mongoSanitize());

const sessionConfing = {
  secret: "Temp",
  resave: false,
  saveUnitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfing));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.Success = req.flash("Success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", userRoutes);
app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/reviews", reviewsRoutes);

app.get("/", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page not Found :( ", 404));
});
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something Went Wrong :( ";
  res.status(statusCode).render("error", { err });
});
app.listen(3000, () => {
  console.log("Serving on Port 3000 ");
});
