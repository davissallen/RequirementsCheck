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