var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Annonce = require("../models/annonce");

//root route
router.get("/", function(req, res){
    res.render("landing");
});

// show register form
router.get("/register", function(req, res){
   res.render("register", {page: 'register'}); 
});

//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        avatar: req.body.avatar
      });

    if(req.body.adminCode === 'TajineChorbaYassa') {
      newUser.isAdmin = true;
    }

    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Inscription réussi ! Bienvenue " + req.body.username);
           res.redirect("/annonces"); 
        });
    });
});

//show login form
router.get("/login", function(req, res){
   res.render("login", {page: 'login'}); 
});

//handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/annonces",
        failureRedirect: "/login",
        failureFlash: true,
        successFlash: 'Bienvenue sur MonBonAppart.com!'
    }), function(req, res){
});

// logout route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Déconnexion réussie !");
   res.redirect("/annonces");
});

// USER PROFILE
router.get("/users/:id", function(req, res) {
  User.findById(req.params.id, function(err, foundUser) {
    if(err) {
      req.flash("error", "Quelque chose c'est mal passé.");
      res.redirect("/");
    }
    Annonce.find().where('author.id').equals(foundUser._id).exec(function(err, annonces) {
      if(err) {
        req.flash("error", "Quelque chose c'est mal passé.");
        res.redirect("/");
      }
      res.render("users/show", {user: foundUser, annonces: annonces});
    })
  });
});


module.exports = router;