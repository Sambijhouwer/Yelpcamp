var express = require("express");
var router = express.Router();
var Campground = require("../Models/campground");
var middleware = require("../middleware");

// Campground Index Route
router.get("/", function(req, res){
    
    Campground.find({}, function(err, campgroundsDB){
    if(err){
        console.log(err);
    } else{
        res.render("campgrounds/index", {campgrounds: campgroundsDB, page: "campgrounds"});
    }
    });
});

// Form post route to create new campground
router.post("/", middleware.isLoggedIn, function(req, res){
    var camp_name = req.body.name;
    var camp_price = req.body.price;
    var camp_image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var new_campground = {name: camp_name, price:camp_price, image: camp_image, description: desc, author: author};
    
    Campground.create(new_campground, function(err, add_CG){
        if(err){
            console.log(err);
        } else{
            res.redirect("/campgrounds");
        }
    });
});

// New Campground Form Route
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

// Shows campground with provided ID
// Render show template with provided campground
router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, Found_campground){
        if(err || !Found_campground){
            req.flash("error", "Campground not found!");
            res.redirect("back");
        } else {res.render("campgrounds/Campground_template", {campground: Found_campground});
            
        }
    });
    
    
});

// Edit Campground Route
router.get("/:id/edit", middleware.CheckCampOwnership,function(req, res) {
        Campground.findById(req.params.id, function(err, foundcampground){
            res.render("campgrounds/edit",{campground: foundcampground});
        });
});
// Update Campground Route
router.put("/:id", middleware.CheckCampOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, Updatedcamp){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// Destroy Route
router.delete("/:id", middleware.CheckCampOwnership, function(req, res){
    Campground.findByIdAndDelete(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;