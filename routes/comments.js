var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../Models/campground")
var Comment = require("../Models/comment")
var middleware = require("../middleware")

// Comments New
router.get("/new", middleware.isLoggedIn ,function(req, res) {
    Campground.findById(req.params.id, function(err, campground){
        if(err || !campground){
            req.flash("error", "Campground not found!");
            res.redirect("back")
        } else {
            res.render("comments/new", {campground: campground});
        }
    });

    
});

// Comments Create
router.post("/", middleware.isLoggedIn,function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong!");
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Added comment to campground");
                    res.redirect("/campgrounds/" + campground._id)
                }
            })
        }
    })
});
// Edit Comment Route
router.get("/:comment_id/edit", middleware.CheckCommentOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, found_campground){
        if(err || !found_campground){
            req.flash("error", "No campground found!");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, function(err, foundcomment) {
            if(err){
                res.redirect("back");
            } else {
                res.render("comments/edit", {campground_id: req.params.id, comment: foundcomment});
            }
        });
    });
});
    

// Update Comment Route
router.put("/:comment_id", middleware.CheckCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatecomment){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success","Changed comment succesfully");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// Destroy Comment route

router.delete("/:comment_id", middleware.CheckCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else{
            req.flash("success","Comment deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;