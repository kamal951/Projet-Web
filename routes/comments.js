var express = require("express");
var router  = express.Router({mergeParams: true});
var Annonce = require("../models/annonce");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//Comments New
router.get("/new", middleware.isLoggedIn, middleware.checkUserStatus, function(req, res){
    // find annonce by id
    console.log(req.params.id);
    Annonce.findById(req.params.id, function(err, annonce){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {annonce: annonce});
        }
    })
});

//Comments Create
router.post("/",middleware.isLoggedIn, middleware.checkUserStatus, function(req, res){
   //lookup annonce using ID
   Annonce.findById(req.params.id, function(err, annonce){
       if(err){
           console.log(err);
           res.redirect("/annonces");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
               //add username and id to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               //save comment
               comment.save();
               annonce.comments.push(comment);
               annonce.save();
               console.log(comment);
               req.flash('success', 'Commentaire ajouté avec succès !');
               res.redirect('/annonces/' + annonce._id);
           }
        });
       }
   });
});

router.get("/:commentId/edit", middleware.isLoggedIn, middleware.checkUserStatus, function(req, res){
    // find annonce by id
    Comment.findById(req.params.commentId, function(err, comment){
        if(err){
            console.log(err);
        } else {
             res.render("comments/edit", {annonce_id: req.params.id, comment: comment});
        }
    })
});

router.put("/:commentId", function(req, res){
   Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, function(err, comment){
       if(err){
          console.log(err);
           res.render("edit");
       } else {
           res.redirect("/annonces/" + req.params.id);
       }
   }); 
});

router.delete("/:commentId",middleware.checkUserComment, middleware.checkUserStatus, function(req, res){
    Comment.findByIdAndRemove(req.params.commentId, function(err, comment){
        if(err){
            console.log(err);
        } else {
            Annonce.findByIdAndUpdate(req.params.id, {
              $pull: {
                comments: comment.id
              }
            }, function(err) {
              if(err){ 
                console.log(err)
              } else {
                req.flash('error', 'Commentaire supprimé !');
                res.redirect("/annonces/" + req.params.id);
              }
            });
        }
    });
});

module.exports = router;