// on the web page load:
// 1: retrieve the saved plan in the browser cookies
// 2: load required coen classes, core classes, and their satisfied requirements
// 3: run requirements checking algorithm against the plan object

// global plan and requirements object
var plan;
var requirements;

// on initial load
$(document).ready(function() {
	plan = new Plan();
	requirements = getClassesSimple();
	console.log(requirements);
});

// function getRequiredClasses() {
// 	$.ajax({
// 		type: 'GET',
// 		url: 'requirements/required_classes.csv',
// 		dataType: 'text',
// 		success: function(data) {
// 			console.log(data);
// 			//return processCSVData(data);
// 		},
// 		error: function(error) {
// 			console.log(error);
// 		}
// 	});
// }

function getClassesSimple() {
	return {
		'requiredClasses': requiredClasses,
		'requiredCore': requiredCore,
		'courseCredits': courseCredits
	};
}

// draws the initial plan on the screen
function drawInitialView() {
	$.each(plan.years, function(index, year) {
		$('#plan').html(drawYear(index, year));
	});
}

function drawYear(index, year) {
	var resultHTML = '<div id="year' + index + '">';
	
}