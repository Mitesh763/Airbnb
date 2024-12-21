if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
// console.log(process.env.CLOUD_NAME);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressionError = require("./utils/ExpressionError.js");
const session = require("express-session");
const mongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");
const listingRoute = require("./routes/listing.js");
const reviewRoute = require("./routes/review.js");
const userRoute = require("./routes/user.js");
// const IP = "192.168.35.231";
// const user = require("./models/user.js");

// const db_URL = "mongodb://127.0.0.1:27017/wanderlust";
const db_URL = process.env.ATLAS_URL;
main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(db_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.redirect("/listing?cat=All");
});

const store = mongoStore.create({
  mongoUrl: db_URL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("err", () => {
  console.log(err);
});

const sessionOption = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session()); //series of request and response associated with same user
passport.use(new localStrategy(User.authenticate())); //authenticate satic method that use login signup
passport.serializeUser(User.serializeUser()); // store user data when log-in or session
passport.deserializeUser(User.deserializeUser()); // remove user data when log-out  also say destroy session

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.use("/listing", listingRoute);
app.use("/listing/:id/review", reviewRoute);
app.use("/", userRoute);

// this is first check all route , * is all incoming request
app.all("*", (req, res, next) => {
  next(new ExpressionError(404, "Page not Found"));
});

// middleware
app.use((err, req, res, next) => {
  let { statusCode, message } = err;
  res.render("error.ejs", { message });
  // res.status(statusCode).send(message);
});

app.listen(8080, () => {
  console.log("Server Started at  http://localhost:8080");
});
