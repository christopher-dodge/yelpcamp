var express 	= require('express'),
	router		= express.Router({mergeParams: true}),
	Campground 	= require('../models/campground'),
	Comment		= require('../models/comment'),
	middleware	= require('../middleware');

// Comment NEW
router.get("/new", middleware.isLoggedIn, function(req, res){
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

// Comment CREATE
router.post("/", middleware.isLoggedIn, function(req, res){
	// Look up campground using ID
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					req.flash('error', 'Something went wrong');
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
					req.flash('success', 'successfully added comment');
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
});

// Comment EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			console.log(err);
			res.redirect("back");
		} else {
			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
		}
	});
});

// Comment UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	// 	find comment and update
	
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			console.log(err);
			res.redirect("back");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});


// Comment DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	// find comment and delete
	// res.send("THIS IS THE DELETE ROUTE AHHHHHHH!");
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		} else {
			req.flash('success', "Comment deleted");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});


// middleware


module.exports = router;