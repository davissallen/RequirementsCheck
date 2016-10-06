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

// save the user object
router.post('/:user', function(req, res, next, id) {
	// query for the user
	var query = User.findById(id);

	query.exec(function(err, user) {
		if (err) {
			return next(err);
		}
		if (!user) {
			return next(new Error('can\'t find user'));
		}
		// update the user then save it
		user = req.user;
		user.save(function(err, savedUser) {
			if (err) {
				return next(err);
			}
			res.json(user);
		});
	});
});

module.exports = router;
