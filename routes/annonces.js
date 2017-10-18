var express = require("express");
var router  = express.Router();
var Annonce = require("../models/annonce");
var Comment = require("../models/comment");
var middleware = require("../middleware");
var geocoder = require('geocoder');

// Define escapeRegex function for search feature
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

//INDEX - show all annonces
router.get("/", function(req, res){
  if(req.query.search && req.xhr) {
      const regex = new RegExp(escapeRegex(req.query.search), 'gi');
      // Get all annonces from DB
      Annonce.find({name: regex}, function(err, allAnnonces){
         if(err){
            console.log(err);
         } else {
            res.status(200).json(allAnnonces);
         }
      });
  } else {
      // Get all annonces from DB
      Annonce.find({}, function(err, allAnnonces){
         if(err){
             console.log(err);
         } else {
            if(req.xhr) {
              res.json(allAnnonces);
            } else {
              res.render("annonces/index",{annonces: allAnnonces, page: 'annonces'});
            }
         }
      });
  }
});

//CREATE - add new annonce to DB
router.post("/", middleware.isLoggedIn, function(req, res){
  // get data from form and add to annonces array
  var name = req.body.name;
  var image = req.body.image;
  if(image == ""){
      image = '../images/default-annonce.jpg';
  }
  var desc = req.body.description;
  var author = {
      id: req.user._id,
      username: req.user.username
  }
  var cost = req.body.cost;
  geocoder.geocode(req.body.location, function (err, data) {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newAnnonce = {name: name, image: image, description: desc, cost: cost, author:author, location: location, lat: lat, lng: lng};
    // Create a new annonce and save to DB
    Annonce.create(newAnnonce, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to annonces page
            console.log(newlyCreated);
            res.redirect("/annonces");
        }
    });
  });
});

//NEW - show form to create new annonce
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("annonces/new"); 
});

// SHOW - shows more info about one annonce
router.get("/:id", function(req, res){
    //find the annonce with provided ID
    Annonce.findById(req.params.id).populate("comments").exec(function(err, foundAnnonce){
        if(err){
          console.log(err);
        } else {
          console.log(foundAnnonce)
          //render show template with that annonce
          res.render("annonces/show", {annonce: foundAnnonce});
        }
    });
});

router.get("/:id/edit", middleware.checkUserAnnonce, function(req, res){
    //find the annonce with provided ID
    Annonce.findById(req.params.id, function(err, foundAnnonce){
        if(err){
            console.log(err);
        } else {
            //render show template with that annonce
            res.render("annonces/edit", {annonce: foundAnnonce});
        }
    });
});

router.put("/:id", function(req, res){
  geocoder.geocode(req.body.location, function (err, data) {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newData = {name: req.body.name, image: req.body.image, description: req.body.description, cost: req.body.cost, location: location, lat: lat, lng: lng};
    Annonce.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, annonce){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/annonces/" + annonce._id);
        }
    });
  });
});

router.delete("/:id", function(req, res) {
  Annonce.findByIdAndRemove(req.params.id, function(err, annonce) {
    Comment.remove({
      _id: {
        $in: annonce.comments
      }
    }, function(err, comments) {
      req.flash('error', annonce.name + ' deleted!');
      res.redirect('/annonces');
    })
  });
});

module.exports = router;

