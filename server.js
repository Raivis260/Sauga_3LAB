//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");
const bcrypt = require("bcrypt");
const session = require("express-session");
const { User } = require("./models/user");
const passport = require("passport");
const { ensureAuthenticated } = require("./config/auth");

const app = express();

require("./config/passport")(passport);

app.use(expressLayouts);
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

const db = require("./config/database").database;
mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);
// Connect to DB
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.log(err));

// async function createUser(email, password) {
//   let user = new User({
//     email: email,
//     password: password,
//   });
//   const salt = await bcrypt.genSalt(10);
//   user.password = await bcrypt.hash(user.password, salt);
//   await user.save();
// }

// app.get("/createUser", async (req, res) => {
//   try {
//     await createUser("raivydas@gmail.com", "VGTU2016");
//   } catch {
//     console.log("error");
//   }
// });

app.get("/", async (req, res) => {
  res.render("index");
});

app.post("/users/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/welcome",
    failureRedirect: "/",
  })(req, res, next);
});

app.get("/welcome", ensureAuthenticated, (req, res) => {
  try {
    res.render("logedIn");
  } catch {
    res.send("Something went wrong.");
  }
});

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

app.listen(3000, function () {
  console.log("Listening on port 3000..");
});
