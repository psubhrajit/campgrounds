// all the middleware
var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {};


middlewareObj.checkCampgroundOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id,function(err, foundCampground){
            if(err){
                res.redirect("back");
            } else {
               // console.log(foundCampground.author.id);
               // console.log(req.user._id);
               if(foundCampground.author.id.equals(req.user._id)){
                   // res.render("edit",{Campgrounds : foundCampground});
                    next();
                } else {
                   // res.send("You do not have permission to do that");
                   req.flash("error", "Permission Denied");
                   res.redirect("back");
                }
            }
        });
     }  else{
             // console.log("you need to be logged in");
             // res.send("You need to be logged in");
             req.flash("error", "You need to be Logged In");
             res.redirect("back");
       } 
}
middlewareObj.checkCommentOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err, foundComment){
            if(err){
                res.redirect("back");
            } else {
               if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                   req.flash("error", "Permission Denied");
                   res.redirect("back");
                }
            }
        });
     }  else{
         req.flash("error", "You need to be Logged In");
             res.redirect("back");
       } 
}
middlewareObj.isLoggedIn = function(req, res, next){
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Please Login First");
    res.redirect("/login");
}

module.exports = middlewareObj;