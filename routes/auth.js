var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../Models/user");

// Root Route
router.get("/", function(req, res){
    res.render("home");
});

// Register Form Route
router.get("/register", function(req, res) {
    res.render("register", {page: "register"});
});

// Register Form Logic
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    if(req.body.AdminCode === "samgast"){
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to Yelpcamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

// Login Form Route
router.get("/login", function(req, res) {
    res.render("login", {page: "login"});
});

// Login Logic
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    
    }), function(req, res){
});

// Logout Route
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Succesfully Logged Out!")
    res.redirect("/campgrounds");
});


module.exports = router;