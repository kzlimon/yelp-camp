var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds");

// importing all routes from seperate router files
// requiring routes 
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");

// connecting mongoose and create a db - local mongoDB
// mongoose.connect('mongodb://localhost:27017/yelp_camp', {
//     useNewUrlParser: true
// });
// mongoDB atlas connection
// mongoose.connect('mongodb+srv://kzlimon-yelpcamp:oREtnRFhxCu6jzhk@yelpcamp-6winw.mongodb.net/yelp_camp?retryWrites=true', {
//     useNewUrlParser: true
// });

// DATABSE CONNECTION IN BOTH LOCAL AND HEROKU
//LCOAL
var url = process.env.DATABASEURL || "mongodb://localhost:27017/yelp_camp"
mongoose.connect(url, {
    useNewUrlParser: true
});

// db SCHEMA setup


// add a campground to db manually - depricated
// Campground.create({
//     name: "Limon",
//     image: "https://farm6.staticflickr.com/5181/5641024448_04fefbb64d.jpg",
//     description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati quis inventore impedit dignissimos est, vero aperiam natus"
// }, function (err, campground) {
//     if (err) {
//         console.log("error");
//     } else {
//         console.log("added");
//         console.log(campground);

//     }
// });

// initiaiting body parser for POST
app.use(bodyParser.urlencoded({
    extended: true
}));
app.set("view engine", "ejs");
// custom stylesheets connected
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
// connect flash messages
app.use(flash());
// every time we run this server it will remove the campgrounds
// seed the database
// seedDB();

// ==================== PASSPORT/AUTH CONFIGURATION ====================
app.use(require("express-session")({
    secret: "Never limit yourself!!",
    resave: false,
    saveUninitialized: false
}));
app.locals.moment = require('moment');
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// set 'currentUser: req.user' for every routes - login menu item hide/show
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// requiring importing routes from seperate files
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


// =============== SERVER START ====================
// app.listen(3000, function (req, res) {
//     console.log("Started");
// });



// use port 3000 unless there exists a preconfigured port
var port = process.env.PORT || 3000;

app.listen(port);