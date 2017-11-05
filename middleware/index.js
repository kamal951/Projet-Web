var Comment = require("../models/comment");
var Annonce = require("../models/annonce");
module.exports = {
    isLoggedIn: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error", "Vous devez être connecté pour exécuter cette action !");
        res.redirect("/login");
    },
    checkUser : function(req, res, next){
        if(req.isAuthenticated()){
            if(req.user.id === req.params.id){
                next();
                console.log("Same ids");
            }else{
                console.log("Not same ids");
                req.flash("error", "Vous devez être connecté pour exécuter cette action !");
                res.redirect("/users/" + req.params.id);
            }
        }
    }
    ,
    checkUserAnnonce: function(req, res, next){
        if(req.isAuthenticated()){
            Annonce.findById(req.params.id, function(err, annonce){
               if(annonce.author.id.equals(req.user._id) || req.user.isAdmin){
                   next();
               } else {
                   req.flash("error", "Vous n'avez pas les droits nécessaire pour exécuter cette action !");
                   console.log("BADD!!!");
                   res.redirect("/annonces/" + req.params.id);
               }
            });
        } else {
            req.flash("error", "Vous devez être connecté pour exécuter cette action !");
            res.redirect("/login");
        }
    },
    checkUserComment: function(req, res, next){
        console.log("YOU MADE IT!");
        if(req.isAuthenticated()){
            Comment.findById(req.params.commentId, function(err, comment){
               if(comment.author.id.equals(req.user._id) || req.user.isAdmin){
                   next();
               } else {
                   req.flash("error", "Vous devez être connecté pour exécuter cette action !");
                   res.redirect("/annonces/" + req.params.id);
               }
            });
        } else {
            req.flash("error", "Vous devez être connecté pour exécuter cette action !");
            res.redirect("login");
        }
    }
}