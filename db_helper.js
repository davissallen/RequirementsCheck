// module dependencies
var mongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var Converter = require('csvtojson').Converter;
var converter = new Converter({});

// required classes collection: required_classes


var readCSV = function(fileName, callback) {
	converter.fromFile(fileName, function(err, result) {
		assert.equal(err, null);
		callback(result);
	});
}
module.exports = readCSV;


var getClasses = function(collName, db, callback) {
	var collection = db.collection(collName);
	collection.find({}).toArray(function(err, docs) {
		console.log(docs);
		callback(docs);
	});
}
module.exports = getClasses;


var deleteClasses = function(collName, db, callback) {
	var collection = db.collection(collName);
	collection.remove({});
	callback();
}
module.exports = deleteClasses;


var dropCollection = function(collName, db, callback) {
	var collection = db.collection(collName);
	collection.drop();
	callback();
}
module.exports = dropCollection;


var insertClasses = function(fileName, collName, db, callback) {
	readCSV(fileName, function(data) {
		var collection = db.collection(collName);
		collection.insertMany(data, function(err, result) {
			callback(result);
		});
	});
}
module.exports = insertClasses