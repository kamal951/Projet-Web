var express     = require("express"),
app         = express(),
bodyParser  = require("body-parser"),
mongoose    = require("mongoose"),
passport    = require("passport"),
cookieParser = require("cookie-parser"),
LocalStrategy = require("passport-local"),
flash        = require("connect-flash"),
Annonce  = require("./models/annonce"),
Comment     = require("./models/comment"),
User        = require("./models/user"),
session = require("express-session"),
seedDB      = require("./seeds"),
methodOverride = require("method-override");
cookie = require('cookie');   
// configure dotenv
require('dotenv').load();
 
var cookies = cookie.parse('couleur=bleu');

//requiring routes
var commentRoutes    = require("./routes/comments"),
annonceRoutes = require("./routes/annonces"),
indexRoutes      = require("./routes/index")

mongoose.connect("mongodb://localhost/projetweb");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(cookieParser('secret'));
//require moment
app.locals.moment = require('moment');
app.locals.moment.locale('fr');
// seedDB(); //seed the database

// PASSPORT CONFIGURATION
app.use(session({
secret: "Once again Rusty wins cutest dog!",
resave: false,
saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
res.locals.currentUser = req.user;
res.locals.success = req.flash('success');  
res.locals.error = req.flash('error');
next();
});

 
app.use("/", indexRoutes); 
app.use("/annonces", annonceRoutes);
app.use("/annonces/:id/comments", commentRoutes);

var port = 8888;
 
app.listen(port, function(){
console.log("Server open on port "+port);
});       