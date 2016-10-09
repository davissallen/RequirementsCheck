// module dependencies
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');

// GET Users
router.get('/', function(req, res, next) {
	// find the requested plan
	User.find(function(err, users) {
		if (err) {
			return next(err);
		}
		res.json(users);
	});
});

// get user object matching email and password
router.post('/retrieve', function(req, res, next) {
	console.log(req.body);
	var query = User.where({ 'email': req.email, 'password': req.password });

	query.findOne(function(err, user) {
		if (err) {
			return next(err);
		}
		res.json(user);
	});
});

// POST user: saves user in db
router.post('/', function(req, res, next) {
	var user = new User(req.body);

	user.save(function(err, user) {
		if (err) {
			return next(err);
		}
		res.json(user);
	});
});

// GET User corresponding to the id given by :user
router.get('/:user', function(req, res, next) {
	res.json(req.user);
});

// save the user object
router.post('/:user', function(req, res, next, id) {
	req.user.save(function(err, user) {
		if (err) {
			return next(err);
		}
		res.json(req.user);
	});
});

// preloading user object using middleware function
router.param('user', function(req, res, next, id) {
	var query = User.findById(id);

	query.exec(function(err, user) {
		// return callback with error
		if (err) {
			return next(err);
		}
		// create error to pass to callback
		if (!user) {
			return next(new Error('can\'t find user'));
		}

		req.user = user;
		return next();
	});
});

module.exports = router;
