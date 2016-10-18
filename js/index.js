// on the web page load:
// 1: retrieve the saved plan in the browser cookies
// 2: load required coen classes, core classes, and their satisfied requirements
// 3: run requirements checking algorithm against the plan object
$(document).ready(function() {
	var plan = new Plan();
	getRequiredClasses();
	console.log(plan);
});

function getRequiredClasses() {
	$.ajax({
		type: 'GET',
		url: 'requirements/required_classes.csv',
		dataType: 'text',
		success: function(data) {
			console.log(data);
			//return processCSVData(data);
		},
		error: function(error) {
			console.log(error);
		}
	});
}

function getClassesSimple() {
	
}