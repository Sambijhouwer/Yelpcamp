var express     = require("express"),
    app         = express(),
    bodyparser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    methodOverride = require("method-override"),
    LocalStrategy = require("passport-local"),
    Campground  = require("./Models/campground"),
    Comment     = require("./Models/comment"),
    User        = require("./Models/user"),
    seedDB      = require("./Seeds");
    
    // Requiring Routes 
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require('./routes/campgrounds'),
    authRoutes = require("./routes/auth");

mongoose.connect('mongodb://localhost:27017/Yelpcamp', { useNewUrlParser: true });
app.use(bodyparser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(flash());
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.locals.moment = require("moment");
// seedDB();

//Passport Confif
app.use(require("express-session")({
    secret: "Kappa",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

app.use(authRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

//====================================

// Starts the server on localhost
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server has started");});
