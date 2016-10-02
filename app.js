// module dependencies
var mongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var Converter = require('csvtojson').Converter;
var converter = new Converter({});

onStart();

// mongodb connection url
function onStart() {
	var url = 'mongodb://localhost:27017/plans';

	// connect to the server
	mongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		console.log("mongodb connection successful");
		insertClasses("./required_core.csv", db, function(result) {
			console.log(result);
		});
	});
}

var getRequiredClasses = function(db, callback) {
	var collection = db.collection('required_classes');
	collection.find({}).toArray(function(err, docs) {
		console.log(docs);
		callback(docs);
	});
}

var deleteRequiredClasses = function(db, callback) {
	var collection = db.collection('required_classes');
	collection.remove({});
	callback();
}

var dropCollection = function(db, callback) {
	var collection = db.collection('required_classes');
	collection.drop();
	callback();
}

function readCSV(fileName, callback) {
	converter.fromFile(fileName, function(err, result) {
		assert.equal(err, null);
		callback(result);
	});
}

var insertClasses = function(fileName, db, callback) {
	readCSV(fileName, function(data) {
		var collection = db.collection('required_classes');
		collection.insertMany(data, function(err, result) {
			callback(result);
		});
	});	
}