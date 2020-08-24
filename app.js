// =====================
// YELPCAMP APP v8.0
// =====================
var express 		= require("express"),
	app 			= express(),
	bodyParser 		= require("body-parser"),
	mongoose 		= require("mongoose"),
	passport		= require('passport'),
	LocalStrategy	= require('passport-local'),
	Campground		= require("./models/campground"),
	Comment			= require("./models/comment"),
	User 			= require('./models/user'),
	seedDB			= require("./seeds");

// Requiring routes
var commentRoutes		= require('./routes/comments'),
	campgroundRoutes	= require('./routes/campgrounds'),
	indexRoutes			= require('./routes/index');

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
console.log(__dirname);
// seedDB(); //seed the database

// PASSPORT CONFIGURATION
app.use(require('express-session')({
	secret: 'The force is strong with this one.',
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});

app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

// =====================
// START SERVER
// =====================
app.listen(3000, () => {
	console.log("YelpCamp server is listening on port 3000");
});