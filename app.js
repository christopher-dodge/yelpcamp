// =====================
// YELPCAMP APP v1.0 - 6.0
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

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
console.log(__dirname);
seedDB();

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

// TEST: SEED CODE FOR SETUP ONLY
// Campground.create(
// 	{
// 		name: "Antelope Island State Park", 
// 		image: "https://playindavis.com/wp-content/uploads/2018/08/Antelope-Island-Bison-on-Antelope-Island-State-Park-Utah-9-10-SG1191.jpg",
// 		description: "This is a fake description, no bathrooms, no water. $10/night. Open 10:00-18:00."
// 	}, function(err, campground){
// 		if(err){
// 			console.log(err);
// 		} else {
// 			console.log("NEWLY CREATED CAMPGROUND: ");
// 			console.log(campground);
// 		}
// 	});

// var campgrounds = [
// 	{name: "Antelope Island State Park", image: "https://playindavis.com/wp-content/uploads/2018/08/Antelope-Island-Bison-on-Antelope-Island-State-Park-Utah-9-10-SG1191.jpg"},	
// 	{name: "Bear Lake State Park", image: "https://stateparks.utah.gov/wp-content/uploads/sites/13/2019/09/cb1.jpg"},	
// 	{name: "Coral Pink Sand Dunes State Park", image: "https://media.deseretdigital.com/file/2d82442747"},
// 	{name: "Antelope Island State Park", image: "https://playindavis.com/wp-content/uploads/2018/08/Antelope-Island-Bison-on-Antelope-Island-State-Park-Utah-9-10-SG1191.jpg"},	
// 	{name: "Bear Lake State Park", image: "https://stateparks.utah.gov/wp-content/uploads/sites/13/2019/09/cb1.jpg"},	
// 	{name: "Coral Pink Sand Dunes State Park", image: "https://media.deseretdigital.com/file/2d82442747?resize=height:520&crop=top:0|left:162|width:1284|height:1080&order=crop,resize&quality=55&c=14&a=dce1b5cc"},
// 	{name: "Antelope Island State Park", image: "https://playindavis.com/wp-content/uploads/2018/08/Antelope-Island-Bison-on-Antelope-Island-State-Park-Utah-9-10-SG1191.jpg"},	
// 	{name: "Bear Lake State Park", image: "https://stateparks.utah.gov/wp-content/uploads/sites/13/2019/09/cb1.jpg"},	
// 	{name: "Coral Pink Sand Dunes State Park", image: "https://media.deseretdigital.com/file/2d82442747?resize=height:520&crop=top:0|left:162|width:1284|height:1080&order=crop,resize&quality=55&c=14&a=dce1b5cc"}
// ];

// =====================
// ROUTES
// =====================
app.get("/", function(req, res){
	// res.send("Welcome to YelpCamp!");
	res.render("landing");
});

// INDEX Route - show all campgrounds
app.get("/campgrounds", function(req, res){
// 	Get all campgrounds from db
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
		}
	});
});

// CREATE Route - add new campground to DB
app.post("/campgrounds", function(req, res){
	// res.send("You hit the post route");
	
// 	get data from form and add to campgrounds array
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var newCampground = {name: name, image: image, description: desc};
	
// 	Create a new campground and save to db
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else {
			// 	redirect back to /campgrounds page
			res.redirect("/campgrounds");
		}
	});
});

// NEW - show form to create new campground
app.get("/campgrounds/new", function(req, res){
	res.render("campgrounds/new");
});

// SHOW - shows more info about one campground
app.get("/campgrounds/:id", function(req, res){
// 	Find the campground with provided ID
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		} else {
			console.log(foundCampground);
			// 	Render SHOW template with that campground
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

// =====================
// COMMENTS ROUTES
// =====================

app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
	// Find campground by ID
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {campground: campground});
		}
	});
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
	// Look up campground using ID
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
					res.redirect("/campgrounds");
				} else {
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
	// create new comment
	// connect new comment to campground
	// redirect to campground show page
});

// =====================
// AUTH ROUTES
// =====================

app.get('/register', function(req, res){
	res.render('register');
});

app.post('/register', function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render('register');
		}
		passport.authenticate('local')(req, res, function(){
			res.redirect('/campgrounds');
		});
	});
});

// show login form
app.get('/login', function(req, res){
	res.render('login');
});

app.post('/login', passport.authenticate('local',
	{
		successRedirect: '/campgrounds',
		failureRedirect: '/login'
	}), function(req, res){
});

// logout route
app.get('/logout', function(req, res){
	req.logout();
	res.redirect('/campgrounds');
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/login');
}

// =====================
// START SERVER
// =====================
app.listen(3000, () => {
	console.log("YelpCamp server is listening on port 3000");
});