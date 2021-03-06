// =====================
// YELPCAMP APP v13.0
// =====================
var express 		= require("express"),
	app 			= express(),
	bodyParser 		= require("body-parser"),
	dotenv			= require('dotenv').config(),
	mongoose 		= require("mongoose"),
	flash			= require('connect-flash'),
	passport		= require('passport'),
	LocalStrategy	= require('passport-local'),
	Campground		= require("./models/campground"),
	Comment			= require("./models/comment"),
	User 			= require('./models/user'),
	seedDB			= require("./seeds"),
	methodOverride	= require("method-override");

const port	= process.env.PORT || 3000,
	  url	= process.env.DATABASEURL || "mongodb://localhost/yelp_camp_v12";

// Requiring routes
var commentRoutes		= require('./routes/comments'),
	campgroundRoutes	= require('./routes/campgrounds'),
	indexRoutes			= require('./routes/index');

// Connect to DB
mongoose.connect(url, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true
}).then(() => {
	console.log('Connected to DB!');
}).catch(err => {
	console.log('ERROR: ', err.message);
});

// Package Config
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
// console.log(__dirname);
// seedDB(); //seed the database
app.use(methodOverride("_method"));
app.use(flash());

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
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

// =====================
// START SERVER
// =====================
app.listen(port, () => {
	console.log("YelpCamp server is listening!");
});