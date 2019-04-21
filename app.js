var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds");




// connecting mongoose and create a db
mongoose.connect('mongodb://localhost:27017/yelp_camp', {
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
// every time we run this server it will remove the campgrounds
seedDB();

// ==================== PASSPORT/AUTH CONFIGURATION ====================
app.use(require("express-session")({
    secret: "Never limit yourself!!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// set 'currentUser: req.user' for every routes - login menu item hide/show
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
});
// ============= ROUTES ====================
// route for homepage
app.get("/", function (req, res) {
    res.render("landing");
});

//INDEX-campground retrieve campgrounds from the db
app.get("/campgrounds", function (req, res) {
    // get all campgrounds from db
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {
                campgrounds: allCampgrounds,
                currentUser: req.user
            });
        }
    });
    // render them
});

// CREATE - add new campground to db
app.post("/campgrounds", function (req, res) {
    //get data from form and add to campground array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {
        name: name,
        image: image,
        description: desc
    }
    // create a new campground and sent to db
    Campground.create(newCampground, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });

});

// NEW -  campground add page
app.get("/campgrounds/new", function (req, res) {
    res.render("campgrounds/new");
});

// SHOW - more info about one campground
// this should be gone at the last of the routes
app.get("/campgrounds/:id", function (req, res) {
    // find the campground with provided id
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            console.log(foundCampground);
            // render show template with that campground
            res.render("campgrounds/show", {
                campground: foundCampground
            });
        }
    });
});


// ========= COMMENTS - ROUTES ================

app.get("/campgrounds/:id/comments/new", isLoggedIn, function (req, res) {
    //finmd campground by id
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {
                campground: campground
            });
        }
    });
});

// post comments to the campgrounds
app.post("/campgrounds/:id/comments", isLoggedIn, function (req, res) {
    //lookup campground using ID
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    });
});


// ============== AUTH ROUTES =====================
// show register form
app.get("/register", function (req, res) {
    res.render("register");
});
// handle sign up logic
app.post("/register", function (req, res) {
    var newUser = new User({
        username: req.body.username
    });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function () {
            res.redirect("/campgrounds");
        });
    });
});

// show login form
app.get("/login", function (req, res) {
    res.render("login");
});
// handle login logic
//by using a middleware
app.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function (rq, res) {

});

// handle logout logic
app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/campgrounds");
});

// is logged in function
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}


// =============== SERVER START ====================
app.listen(3000, function (req, res) {
    console.log("Started");
});