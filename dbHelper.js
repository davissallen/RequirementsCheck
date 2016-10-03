// module dependencies
var mongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var Converter = require('csvtojson').Converter;

// required classes collection: required_classes

// reads the specified CSV file and executes
// the callback on the resulting JSON data
var readCSV = function(fileName, callback) {
	var converter = new Converter({});
	converter.fromFile(fileName, function(err, result) {
		assert.equal(err, null);
		callback(result);
	});
}
module.exports.readCSV = readCSV;

// read classes from the specified collection,
// executes the callback on the resulting data
// IF READ CLASSES FROM STATIC CSV FILE, CAN REMOVE THIS FUNCTION
var getClasses = function(collName, db, callback) {
	var collection = db.collection(collName);
	collection.find({}).toArray(function(err, docs) {
		console.log(docs);
		callback(docs);
	});
}
module.exports.getClasses = getClasses;

// clears the specified collection in the database
var deleteClasses = function(collName, db, callback) {
	var collection = db.collection(collName);
	collection.remove({});
	callback();
}
module.exports.deleteClasses = deleteClasses;

// drops the specified collection in the database
var dropCollection = function(collName, db, callback) {
	var collection = db.collection(collName);
	collection.drop();
	callback();
}
module.exports.dropCollection = dropCollection;

// inserts classes from CSV into database
// IF READ CLASSES FROM STATIC CSV FILE, CAN REMOVE THIS FUNCTION
var insertClasses = function(fileName, collName, db, callback) {
	readCSV(fileName, function(data) {
		var collection = db.collection(collName);
		collection.insertMany(data, function(err, result) {
			callback(result);
		});
	});
}
module.exports.insertClasses = insertClasses;

// csv file names
module.exports.requiredClasses = "./required_classes.csv";
module.exports.requiredCore = "./required_core.csv";