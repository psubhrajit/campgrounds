var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware/index.js");
// var Comment =require("../models/comment");


router.get("/", function (req, res) {
    Campground.find({}, function (err, Campgrounds) {
        if (err) console.log(err);
        else res.render("index", { Campgrounds: Campgrounds });
    });
});

router.post("/",middleware.isLoggedIn,function (req, res) {
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newob = { name: name,price: price, image: image, description: desc, author: author };
    // console.log(req.user);
    Campground.create(newob, function (err, newCampgrounds) {
        if (err) console.log(err);
        else {
            console.log(newCampgrounds);
            res.redirect("/campgrounds");}
    });
});

router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("new");
});

router.get("/:id", middleware.isLoggedIn, function(req, res) {
    Campground
        .findById(req.params.id)
        .populate("comments")
        .exec(function (err, showCamp) {
            if (err) console.log(err);
            else {
                res.render("show", { Campgrounds: showCamp });
            }
        });
});
//Edit route
   router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req,res){
        Campground.findById(req.params.id,function(err, foundCampground){ 
            if(err) res.redirect('/');
            else
               res.render("edit", {Campgrounds: foundCampground});
    });  
  }); 
//update route
router.put("/:id", middleware.checkCampgroundOwnership , function(req,res){
    Campground.findByIdAndUpdate(req.params.id, req.params.campground,function(err , updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        };
    });
})
//DESTROY Route
router.delete("/:id", middleware.checkCampgroundOwnership , function(req,res){
  Campground.findByIdAndRemove(req.params.id, function(err){
      if(err){
           res.redirect("/campgrounds");
         }
      else{
           res.redirect("/campgrounds");
        }
    });
});

module.exports = router;