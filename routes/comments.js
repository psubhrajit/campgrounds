var express = require("express");
var router = express.Router({mergeParams : true});
var Campground = require("../models/campground");
var Comment =require("../models/comment");
var middleware = require("../middleware/index.js");



router.get("/new", function (req, res) {
    console.log(req.params.id);
    Campground.findById(req.params.id, function (err, comment) {
        if (err) console.log(err);
        else res.render("../routes/ncom", { Campgrounds: comment });
    });
});

router.post("/", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, camp) => {
        if (err) {
            req.flash("error", "Permission Denied");
            console.log(err);
        }
        else
            Comment.create(req.body.comment, (err, comment) => {
                if (err) console.log(err);
                else comment.author.id = req.user._id;
                comment.author.username = req.user.username;
                comment.save();
                camp.comments.push(comment);
                camp.save();
                req.flash("success", "Comment Posted");
                res.redirect("/campgrounds/" + camp._id);
            });
    });
});
//edit comment
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            req.flash("error", "Permission Denied");
            res.redirect("back");
        }else{
            res.render("cedit",{Campgrounds_id : req.params.id, comment: foundComment});
        }
    });
}); 
//update comment
router.put("/:comment_id",middleware.checkCommentOwnership, function(req, res){
      Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
                 if(err){
                     res.redirect("back");
                 }else{
                     req.flash("success","Comment Updated");
                     res.redirect("/campgrounds/" + req.params.id );
                 }
      });
});
// comment delete
router.delete("/:comment_id",middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        }else{
            req.flash("success", "Comment Deleted");
            res.redirect("/campgrounds/" + req.params.id );
        }
     });
});


module.exports = router;