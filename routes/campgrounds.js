var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

//INDEX-campground retrieve campgrounds from the db
router.get("/", function (req, res) {
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
router.post("/", middleware.isLoggedIn, function (req, res) {
    //get data from form and add to campground array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {
        name: name,
        image: image,
        description: desc,
        author: author
    }

    // create a new campground and sent to db
    Campground.create(newCampground, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });

});

// NEW -  campground add page
router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("campgrounds/new");
});

// SHOW - more info about one campground
// this should be gone at the last of the routes
router.get("/:id", function (req, res) {
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

// EDIT Campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        // does user own the campground
        res.render("campgrounds/edit", {
            campground: foundCampground
        });
    });
});

// UPDATE Campground route
router.put("/:id", middleware.checkCampgroundOwnership, function (req, res) {
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampground) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
    // redirect to show page
});


// DESTROY/DELETE Campground route
router.delete("/:id", middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});



module.exports = router;