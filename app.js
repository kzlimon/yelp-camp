var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");

// connecting mongoose and create a db
mongoose.connect('mongodb://localhost:27017/yelp_camp', {
    useNewUrlParser: true
});

// db schema setup
var campgroundScheme = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});
// db model
var Campground = mongoose.model("Campground", campgroundScheme);

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
            res.render("index", {
                campgrounds: allCampgrounds
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
    res.render("new.ejs");
});

// SHOW - more info about one campground
// this should be gone at the last of the routes
app.get("/campgrounds/:id", function (req, res) {
    // find the campgroubnd with provided id
    Campground.findById(req.params.id, function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            // render show template with that campground
            res.render("show", {
                campground: foundCampground
            });
        }
    });
});


// server port set
app.listen(3000, function (req, res) {
    console.log("Started");
});