var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

// an array of 3 data
var data = [{
    name: "Limon",
    image: "https://cdn.pixabay.com/photo/2018/03/11/14/09/eggs-3216879__340.jpg",
    description: "asdsa asdsadas das asd asd"
}, {
    name: "Limon 2",
    image: "https://cdn.pixabay.com/photo/2018/03/11/14/09/eggs-3216879__340.jpg",
    description: "asdsa asdsadas das asd asd"
}, {
    name: "Limon 3",
    image: "https://cdn.pixabay.com/photo/2018/03/11/14/09/eggs-3216879__340.jpg",
    description: "asdsa asdsadas das asd asd"
}]

function seedDB() {
    // remove all campgropund
    Campground.remove({}, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("removed campgrounds!");
            // add a few campgrounds
            data.forEach(function (seed) {
                Campground.create(seed, function (err, campground) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("added a campground");
                        // add a few comments
                        Comment.create({
                            text: "This place is great!",
                            author: "Limon"
                        }, function (err, comment) {
                            if (err) {
                                console.log(err);
                            } else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log("new comment created");
                            }
                        });
                    }
                });

            });
        }
    });


}

module.exports = seedDB;