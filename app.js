var express     = require('express'),
app         = express(),
server = require('http').Server(app), 
io = require('socket.io')(server),
ent = require('ent'), 
fs = require('fs'),
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
methodOverride = require("method-override"),
cookie = require('cookie');   
// configure dotenv
require('dotenv').load();

io.configure('production', function(){
    console.log(doodlr + " set config for production");
    io.enable('browser client minification');  // send minified client
    io.enable('browser client etag');          // apply etag caching logic based on version number
    io.enable('browser client gzip');          // gzip the file
    io.set('log level', 1);                    // reduce logging
    io.set('transports', [                     // enable all transports (optional if you want flashsocket)
        'websocket'
      , 'flashsocket'
      , 'htmlfile'
      , 'xhr-polling'
      , 'jsonp-polling'
    ]);
  });

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

res.header("Access-Control-Allow-Origin", "*");
res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
next();
});

 
app.use("/", indexRoutes); 
app.use("/annonces", annonceRoutes);
app.use("/annonces/:id/comments", commentRoutes);


var port = 8888;

var html = require('fs').readFileSync('./views/conv.ejs');
//var server = require('http').createServer(app);
//var io = require("socket.io")(server);

server.listen(port, function(){
    console.log("Server open on port "+port);
    });      

/*io.of('/'+).on('connection',function(socket){
    
});

}*/
 


server.listen(3000);

io.sockets.on('connection', function (socket, pseudo) {

    // Dès qu'on nous donne un pseudo, on le stocke en variable de session et on informe les autres personnes

    socket.on('nouveau_client', function(pseudo) {

        pseudo = ent.encode(pseudo);

        socket.pseudo = pseudo;

        socket.broadcast.emit('nouveau_client', pseudo);

    });


    // Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes

    socket.on('message', function (message) {

        message = ent.encode(message);

        socket.broadcast.emit('message', {pseudo: socket.pseudo, message: message});

    }); 

});
            

//app.listen(port);

 