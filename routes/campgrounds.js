var express 	= require('express'),
	router		= express.Router(),
	Campground	= require('../models/campground');

// INDEX Route - show all campgrounds
router.get("/", function(req, res){
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
router.post("/", function(req, res){
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
router.get("/new", function(req, res){
	res.render("campgrounds/new");
});

// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
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

module.exports = router;