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
	console.log(plan);
	requirements = getCoursesSimple();
	drawInitialView();
});

// get JSON object of requirements
function getCoursesSimple() {
	return {
		'requiredCourses': requiredCourses,
		'requiredCore': requiredCore,
		'courseCredits': courseCredits
	};
}

// draws the initial plan on the screen
function drawInitialView() {
	for (var i = 0; i < plan.years.length; i++) {
		var html = '<div id="year' + i + '" class="year"></div>';
		$('#plan').append(html);
		drawYear(i);
	}
}

// returns HTML string to draw the year
function drawYear(index) {
	// create the html string
	var html = '';
	html += drawQuarter(QUARTER_ENUM.FALL, index);
	html += drawQuarter(QUARTER_ENUM.WINTER, index);
	html += drawQuarter(QUARTER_ENUM.SPRING, index);
	html += drawQuarter(QUARTER_ENUM.SUMMER, index);
	// append the html string to the corresponding year
	$('#year' + index).append(html);

	// set the add course button event for each quarter
	$('#btnAddCourseToYear' + index + QUARTER_ENUM.FALL).click(
		addCourseBtnEvent(QUARTER_ENUM.FALL, index));
	$('#btnAddCourseToYear' + index + QUARTER_ENUM.WINTER).click(
		addCourseBtnEvent(QUARTER_ENUM.WINTER, index));
	$('#btnAddCourseToYear' + index + QUARTER_ENUM.SPRING).click(
		addCourseBtnEvent(QUARTER_ENUM.SPRING, index));
	$('#btnAddCourseToYear' + index + QUARTER_ENUM.SUMMER).click(
		addCourseBtnEvent(QUARTER_ENUM.SUMMER, index));
}

// return html string of quarter
function drawQuarter(quarter, year) {
	var resultHTML = '<div id="year' + year + quarter + '" class="quarter">' +
		'<div class="quarterHeader">' + sentenceCase(quarter) + '</div>' +
		'<ul id="year' + year + quarter +'courselist" class="courselist">' +
		buildCourseList(quarter, year) +
		'</ul>' +
		'<div><div id="btnAddCourseToYear' + year + quarter + '" class="btnAddCourse">+</div></div>' +
		'</div>';

	return resultHTML;
}

// capitalize the first character of the string
function sentenceCase(string) {
	// return empty string if the string is null or empty
	if (string == null || string.length < 1) {
		return '';
	}

	return string.charAt(0).toUpperCase() + string.slice(1);
}

// loops through all classes in the specified quarter, generating list elements
function buildCourseList(quarter, year) {
	var resultHTML = '';
	$.each(plan.years[year][quarter].courses, function(index, course) {
		resultHTML += '<li class="course">' + course + '</li>';
	});

	return resultHTML;
}

// function to fire when the add course button is pressed
function addCourseBtnEvent(quarter, year) {
	// toggle variable
	var txtBoxToggle = false;
	// function closure to protect the toggle variable
	return function() {
		// textbox not visible, add it, and update the variable
		if (!txtBoxToggle) {
			var html = '<div class="searchClass">' +
			'<input id="txtBoxYear' + year + quarter +
			'" type="text" size="4" placeholder="course"></div>';
			//$('#year' + year + quarter).append(html);
			$(html).insertAfter('#year' + year + quarter +'courselist');
			bindFocusHandler(quarter, year);
			bindInputHandler(quarter, year);
			$('#btnAddCourseToYear' + year + quarter).html('-');
			txtBoxToggle = true;
		}
		else {
			$('#year' + year + quarter).children('.searchClass').remove();
			$('#btnAddCourseToYear' + year + quarter).html('+');
			txtBoxToggle = false;
		}
	}
}

function bindFocusHandler(quarter, year) {
	$('#txtBoxYear' + year + quarter).focusin(function() {
		var html = '<ul id="dropdownYear' + year + quarter + '" class="dropdown">' +
			'</ul>';

		var value = $('#txtBoxYear' + year + quarter).val();
		var filteredClasses = jQuery.grep(requirements.requiredCourses,
			function(element, index) {
				return element.indexOf(value.toUpperCase()) >= 0;
		});

		$(html).insertAfter('#txtBoxYear' + year + quarter);
		$('#dropdownYear' + year + quarter).html(createFilteredListItems(filteredClasses));
		
	});

	$('#txtBoxYear' + year + quarter).focusout(function() {
		$('#dropdownYear' + year + quarter).remove();
	});
}

// filter the class list with the input
function bindInputHandler(quarter, year) {
	// on key up event, filter the class list
	$('#txtBoxYear' + year + quarter).keyup(function() {
		var value = $('#txtBoxYear' + year + quarter).val();
		var filteredClasses = jQuery.grep(requirements.requiredCourses,
			function(element, index) {
				return element.indexOf(value.toUpperCase()) >= 0;
		});
		
		$('#dropdownYear' + year + quarter).html(createFilteredListItems(filteredClasses));

	});
}

function createFilteredListItems(courses) {
	var html = '';
	for (var i = 0; i < courses.length; i++) {
		html += '<li>' + courses[i] + '</li>';
	}
	return html;
}