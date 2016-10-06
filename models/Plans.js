// module dependencies
var mongoose = require('mongoose');

// quarter schema with an array of strings
// representing the classes to be taken
var QuarterSchema = new mongoose.Schema({
	classes: [String]
});

// year schema with four quarters
var YearSchema = new mongoose.Schema({
	fall: QuarterSchema,
	winter: QuarterSchema,
	spring: QuarterSchema,
	summer: QuarterSchema
});

// plan schema which will be saved to MongoDB
var PlanSchema = new mongoose.Schema({
	years: [YearSchema]
});

mongoose.model('Plan', PlanSchema);