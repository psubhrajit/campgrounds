var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    // Campground = require("./models/campground"),
    // Comment = require("./models/comment"),
    methodOverride = require('method-override'),
    User = require("./models/user"),
    passport = require("passport"),
    flash = require("connect-flash"),
    localStrategy = require("passport-local");
seedDB = require("./seed");
//  seedDB();



var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");
var commentRoutes = require("./routes/comments");


mongoose.connect("mongodb+srv://sibun:sibun@cluster0.p1pv2.mongodb.net/test", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(require("express-session")({
    secret: "Secrets shall not be disclosed",
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set("view engine", "ejs");

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT);