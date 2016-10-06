// module dependencies
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Plan = mongoose.model('Plan');

// GET Plan corresponding to the id given by :post
router.get('/:plan', function(req, res, next) {
	res.json(req.plan);
});

//POST Plan
router.post('/', function(req, res, next) {
	var plan = new Plan(req.body);

	plan.save(function(err, plan) {
		if (err) {
			return next(err);
		}
		res.json(plan);
	});
});

// update plan
router.post('/:plan', function(req, res, next) {
	req.plan.save(function(err, plan) {
		if (err) {
			return next(err);
		}
		res.json(req.plan);
	});
});

// preloading plan object using middleware function
router.param('plan', function(req, res, next, id) {
	var query = Plan.findById(id);

	query.exec(function(err, plan) {
		// return callback with error
		if (err) {
			return next(err);
		}
		// create error to pass to callback
		if (!plan) {
			return next(new Error('can\'t find plan'));
		}

		req.plan = plan;
		return next();
	});
});

module.exports = router;