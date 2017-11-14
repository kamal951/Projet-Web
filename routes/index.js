var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Annonce = require("../models/annonce");
var middleware = require("../middleware");
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
    var imageProfile = req.body.avatar;
    if(imageProfile == ""){
        imageProfile = '../images/profile-default.png';
    }
    var newUser = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        avatar: imageProfile,
        description: req.body.description,
        status: true
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
        failureFlash: "Identifiants incorrects",
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

router.get("/users/:id/edit", middleware.checkUser , middleware.checkUserStatus, function(req, res){
  //find the annonce with provided ID
  User.findById(req.params.id, function(err, foundUser){
      if(err){
          console.log(err);
      } else {
          //render show template with that annonce
          res.render("users/edit", {user: foundUser});
      }
  });
});

router.put("/users/:id", function (req, res) {
    var imageProfile = req.body.avatar;
    if(imageProfile == ""){
        imageProfile = '../images/profile-default.png';
    }
    var newData = {
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        avatar: imageProfile,
        description: req.body.description
      };

    if(req.body.adminCode === 'TajineChorbaYassa') {
        newData.isAdmin = true;
    }
    
    User.findByIdAndUpdate(req.params.id, { $set: newData }, function (err, user) {
        if (err) {
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success", "Profil utilisateur modifié avec succès");
            res.redirect("/users/" + user._id);
        }
    });
});

router.get("/admin", middleware.checkUserAdmin, function(req, res){
    User.find({}).exec(function(err, users) {   
        if (err) throw err;
        res.render("admin", { "users": users });
    });
});

router.post("/admin", function(req, res){
    User.findByIdAndUpdate(req.body.id, {status: req.body.status}, function (err, user) {
        if (err) {
            console.log("Erreur modif user : "+err);
        } else {
            console.log("Status utilisateur"+" "+req.body.id+" modifié avec succès");
        }
    })
});

module.exports = router;