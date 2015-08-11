var tweetBank = require('../models/index.js');

module.exports = function (io) {
	var router = require('express').Router();

	router.get('/', function (req, res) {
		// will trigger res.send of the index.html file
		// after rendering with swig.renderFile
		tweetBank.Tweet.findAll({include: [ tweetBank.User ] }).then(function(tweets){
			res.render('index', {
			showForm: true,
			tweets: tweets,
			heading: "Look at some Awesome tweets.",
			picture: tweets.User
		});
	});
});

	router.get('/users/:name', function (req, res) {
		tweetBank.User.findOne({where: {
			name: req.params.name
		}}).then(function (user) {
			return user.getTweets();
		}).then(function(results){
			res.render('index', {
				showForm: true,
				heading: "These are " + req.params.name + "'s tweets",
				title: req.params.name,
				tweets: results,
				theName: req.params.name,
			});
		});
	});

	router.get('/users/:name/tweets/:id', function (req, res) {
		var id = parseInt(req.params.id);
		tweetBank.Tweet.findAll({ where: {
			id: id
		}}).then(function(tweets){

			res.render('index', {title: req.params.name, tweets: tweets});

		});

	});

	router.post('/submit', function (req, res) {
		tweetBank.User.findOne({where: {name: req.body.shenanigans}}).then(function(user){

			if(user === null){

				tweetBank.User.create({name: req.body.shenanigans, pictureUrl: 'http://lorempixel.com/400/200/'})
				.then(function(createdUser){


						return createdUser.get("id");
				}).then(function(id){
						return tweetBank.Tweet.create({UserId: id, tweet: req.body.text});
				}).then(function(tweet){

					io.emit("new_tweet", {pictureUrl: 'http://lorempixel.com/400/200/', tweet: tweet.tweet, id: tweet.id , userName: req.body.shenanigans });
					res.redirect('/');

				});


			}else{

				tweetBank.User.findOne({where: {name: req.body.shenanigans}}).then(function(user){

					return tweetBank.Tweet.create({UserId: user.id, tweet: req.body.text});

				}).then(function(tweet){

					io.emit("new_tweet", {pictureUrl: 'http://lorempixel.com/400/200/', tweet: tweet.tweet, id: tweet.id , userName: req.body.shenanigans });
					res.redirect('/');

				});

			}




		});
	});
	return router;
};
