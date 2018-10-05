var Comment = require("../Models/comment");
var Campground = require("../Models/campground");

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        } else {
            req.flash("error", "You must be logged in to do that!");
            res.redirect("/login");
        }
    };
    
middlewareObj.CheckCommentOwnership = function(req, res, next){
        if(req.isAuthenticated()){
            Comment.findById(req.params.comment_id, function(err, comment){
            if(err || !comment){
                req.flash("error", "Comment not found!");
                res.redirect("back");
            } else{
                if(comment.author.id.equals(req.user._id) || req.user.isAdmin){
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that!");
                    res.redirect("back");
                }
                
            }
         });
        } else {
            req.flash("error", "You need to be logged in to do that!");
            res.redirect("back");
        }
    };

middlewareObj.CheckCampOwnership = function(req, res, next){
        if(req.isAuthenticated()){
            Campground.findById(req.params.id, function(err, foundcampground){
            if(err || !foundcampground){
                req.flash("error", "Campground not found")
                res.redirect("back");
            } else{
                if(foundcampground.author.id.equals(req.user._id) || req.user.isAdmin){
                    next();
                } else {
                    req.flash("You don't have permission to do that!")
                    res.redirect("back");
                }
                
            }
         });
        } else {
            req.flash("error", "You must be logged in to do that!")
            res.redirect("back");
        }
    };
    
module.exports = middlewareObj;