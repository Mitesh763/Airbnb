require("dotenv").config();
const express = require("express");
const app = express();
const passport = require("passport");
const cookieSession = require("cookie-session");
const cors = require("cors");
const passportSetup = require('./passport.js');

app.use(
  cookieSession({
    name: "session",
    keys: ["mit"],
    maxAge: 24 * 60 * 60 * 100,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

const port = process.env.PORT || 8080;
app.listen(port , ()=> console.log(`server stated at http://localhost:8080`));