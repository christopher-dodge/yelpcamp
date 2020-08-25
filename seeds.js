var mongoose 		= require("mongoose"),
	Campground 		= require("./models/campground"),
	Comment			= require("./models/comment");

var seeds = [
	{
		name: "Antelope Island State Park",
		image: "https://playindavis.com/wp-content/uploads/2018/08/Antelope-Island-Bison-on-Antelope-Island-State-Park-Utah-9-10-SG1191.jpg",
		description: "This is a fake description, no bathrooms, no water. $10/night. Open 10:00-18:00. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five cent",
		author:{
			id: "588c2e092403d111454fff76",
			username: "Jack"
		}
	},
	{
		name: "Bear Lake State Park",
		image: "https://stateparks.utah.gov/wp-content/uploads/sites/13/2019/09/cb1.jpg",
		description: "This is a fake description, no bathrooms, no water. $10/night. Open 10:00-18:00. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five cent",
		author:{
			id: "588c2e092403d111454fff71",
			username: "Jill"
		}
	},
	{
		name: "Coral Pink Sand Dunes State Park",
		image: "https://media.deseretdigital.com/file/2d82442747",
		description: "This is a fake description, no bathrooms, no water. $10/night. Open 10:00-18:00. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five cent",
		author:{
			id: "588c2e092403d111454fff77",
			username: "Jane"
		}
	}
]

function seedDB(){
	// console.log("I'm running the seeds function");
	// Remove all campgrounds
	Campground.deleteMany({}, function(err){
		if(err){
			console.log(err);
		}
		console.log("removed campgrounds!");
		Comment.deleteMany({}, function(err){
			if(err){
				console.log(err);
			}
			console.log("removed comments!");
			// add a few campgrounds
			seeds.forEach(function(seed){
				Campground.create(seed, function(err, campground){
					if(err){
						console.log(err);
					} else {
						console.log("added a campground");
						// create a comment
						Comment.create(
							{
								text: "This place is great, but wish there was wifi",
								author: {
									id: "588c2e092403d111454fff76",
									username: "Jack"
								}
							}, function(err, comment){
								if(err){
									console.log(err);
								} else {
									// Associate comment with a campground
									campground.comments.push(comment);
									campground.save();
									console.log("Created new comment");
								}
							});
					}
				});
			});
		});
		
	});
}

// function seedDB(){
// 	console.log("It's a A L I V E !");
// }

module.exports = seedDB;