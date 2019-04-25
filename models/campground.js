var mongoose = require("mongoose");

// db schema setup
var campgroundScheme = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    //comment association
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
});
// db model
module.exports = mongoose.model("Campground", campgroundScheme);