var express 	= require('express'),
	router		= express.Router({mergeParams: true}),
	Campground 	= require('../models/campground'),
	Comment		= require('../models/comment');

// Comments NEW
router.get("/new", isLoggedIn, function(req, res){
	// console.log(req.params.id);
	// Find campground by ID
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {campground: campground});
		}
	});
});

// Comments CREATE
router.post("/", isLoggedIn, function(req, res){
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
					// add username and id comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					// save comment
					comment.save();
					campground.comments.push(comment);
					campground.save();
					console.log(comment);
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
});

// middleware
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/login');
}

module.exports = router;