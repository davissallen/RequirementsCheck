// module dependencies
var dbHelper = require('./dbHelper');

onStart();

// mongodb connection url
function onStart() {
	readRequirements(function(data) {
		console.log(data);
	});
}

// reads the requirements files and returns and object
// containing the required classes and core read
function readRequirements(callback) {
	var requirements = {
		requiredClasses: [],
		requiredCore: []
	};
	// lock object to know when to issue callback
	var lock = 2;

	dbHelper.readCSV(dbHelper.requiredClasses, function(data) {
		requirements.requiredClasses = data;
		
		lock--;
		if (lock == 0) {
			return callback(requirements);
		}
	});

	dbHelper.readCSV(dbHelper.requiredCore, function(data) {
		requirements.requiredCore = data;
		
		lock--;
		if (lock == 0) {
			return callback(requirements);
		}
	});
}