// on the web page load:
// 1: retrieve the saved plan in the browser cookies
// 2: load required coen classes, core classes, and their satisfied requirements
// 3: run requirements checking algorithm against the plan object

// global plan and requirements object
var plan;
var requirements;

// on initial load
$(document).ready(function() {
	// load the plan from cookies if it exists
	plan = new Plan();

	// get the requirements object
	requirements = getCoursesSimple();
	// draw the initial view
	drawInitialView();

	// set the add year click event functionality
	$('#btnAddYear').click(function() {
		addYear();
	});

	// set the remove last year click event functionality
	$('#btnRemoveYear').click(function() {
		removeYear();
	});
});

// get JSON object of requirements
function getCoursesSimple() {
	return {
		'requiredCredits': requiredCredits,
		'courseCredits': courseCredits
	};
}

// draws the initial plan on the screen
function drawInitialView() {
	// draw plan view
	for (var i = 0; i < plan.years.length; i++) {
		drawYear(i);
	}

	// initialize remove course event
	initRemoveCourseEvent();

	// draw requirements view
	drawRequirementsView();

	// check off the requirements fulfilled
	checkRequirements();

}

function drawRequirementsView() {
	$('#requiredCreditsList').html('');

	for (var i = 0; i < requirements.requiredCredits.length; i++) {
		var html = '<li class="requirementsLI"><div class="credit">' +
			requirements.requiredCredits[i] + '</div>' +
			'<div class="fulfilledBy"></div></li>';

		$('#requiredCreditsList').append(html);
	}
}

// draw a whole year by drawing quarters
function drawYear(index) {
	var html = '<div id="year' + index + '" class="year"></div>';
	$('#plan').append(html);

	drawQuarter(QUARTER_ENUM.FALL, index);
	drawQuarter(QUARTER_ENUM.WINTER, index);
	drawQuarter(QUARTER_ENUM.SPRING, index);
	drawQuarter(QUARTER_ENUM.SUMMER, index);
}

// draws a quarter on the view for the given year and quarter
function drawQuarter(quarter, year) {
	// html string of each quarter
	var html = '<div id="year' + year + quarter + '" class="quarter">' +
		'<div class="quarterHeader">' + sentenceCase(quarter) + '</div>' +
		'<ul id="year' + year + quarter +'courselist" class="courselist">' +
		createRemovableCourseList(plan.years[year][quarter].courses, 'course') +
		'</ul>' +
		'<div><div id="btnAddCourseToYear' + year + quarter + '" class="btnAddCourse">+</div></div>' +
		'</div>';

	// add the drawn quarter to the corresponding year
	$('#year' + year).append(html);

	// attach quarter and year data to each element for removal functionality
	var courseElements = $('#year' + year + quarter + 'courselist > li');

	for (var i = 0; i < courseElements.length; i++) {
		// add year and quarter to corresponding dom element
		jQuery.data(courseElements[i], 'year', year);
		jQuery.data(courseElements[i], 'quarter', quarter);
	}

	// set the on click listener for adding a course
	$('#btnAddCourseToYear' + year + quarter).click(addCourseBtnEvent(quarter, year));
}

// capitalize the first character of the string
function sentenceCase(string) {
	// return empty string if the string is null or empty
	if (string == null || string.length < 1) {
		return '';
	}

	return string.charAt(0).toUpperCase() + string.slice(1);
}

// loops through all classes in the specified quarter, generating list elements with removability
function createRemovableCourseList(courses, htmlClass) {
	var resultHTML = '';
	$.each(courses, function(index, course) {
		resultHTML += '<li class="' + htmlClass + '">' +
		'<div class="removeCourse">&#x2715;</div>' +
		'<div class="courseName">' + course + '</div></li>';
	});

	return resultHTML;
}

// loops through all classes in the specified quarter, generating list elements
function buildCourseList(courses, htmlClass) {
	var resultHTML = '';
	$.each(courses, function(index, course) {
		resultHTML += '<li class="' + htmlClass + '">' + course + '</li>';
	});

	return resultHTML;
}

// set the on click listener for removing a course
function initRemoveCourseEvent() {
	$('.removeCourse').click(function() {
		removeCourse($(this));
	});	
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
			'" type="text" size="5" placeholder="course"></div>';
			$(html).insertAfter('#year' + year + quarter +'courselist');

			// change the '+' to '-' and set the toggle
			$('#btnAddCourseToYear' + year + quarter).html('-');
			txtBoxToggle = true;

			// bind focus handler for when user enters or exists scope
			bindFocusHandler(quarter, year);
			// bind input handler for when user searches for classes
			bindInputHandler(quarter, year);
		}
		else {
			$('#year' + year + quarter).children('.searchClass').remove();
			$('#btnAddCourseToYear' + year + quarter).html('+');
			txtBoxToggle = false;
		}
	}
}

// binds the focus handler of the textBox and List of classes
function bindFocusHandler(quarter, year) {
	var courseListVisible = false;
	// when user clicks on the textbox
	$('#txtBoxYear' + year + quarter).focusin(function() {
		// list may potentially be there, remove it
		$('#dropdownYear' + year + quarter).remove();
		// add the list of classes
		var html = '<ul id="dropdownYear' + year + quarter + '" class="dropdown"></ul>';
		$(html).insertAfter('#txtBoxYear' + year + quarter);

		// get the user input and update the dropdown list
		var value = $('#txtBoxYear' + year + quarter).val();
		var filteredClasses = filterCourses(value);
		// update the dropdown
		createFilteredListItems(filteredClasses, quarter, year);

		courseListVisible = true;

	});

	// when the user clicks out of the scope of the textbox and dropdown list
	$('html').click(function(e) {
		var target = $(e.target);
		// remove the dropdown list if it's visible and the user clicks out of the seach scope
		if (courseListVisible &&
			(!target.is('#txtBoxYear' + year + quarter) && !target.is('.addCourse'))) {
			$('#dropdownYear' + year + quarter).remove();
			courseListVisible = false;
			$('#txtBoxYear' + year + quarter).val('');
		}
	});
}

// filter the class list with the input
function bindInputHandler(quarter, year) {
	// on key up event, filter the class list
	$('#txtBoxYear' + year + quarter).keypress(function(e) {
		var value = $('#txtBoxYear' + year + quarter).val();

		// add class on enter key
		if (e.which == 13) {
			value = value.replace(/\s/g, "");
			value = value.toUpperCase();

			// if invalid input
			if (value.search(/^[A-Z]{4}[0-9]{1,3}$/) < 0) {
				alert('please enter a valid format such as coen12');
				return;
			}
			
			// addCourse
			addCourse(quarter, year, value);
		}

		// on another key press, filter the dropdown
		var filteredClasses = filterCourses(value);
		// filter the class list
		createFilteredListItems(filteredClasses, quarter, year);
	});
}

function filterCourses(substring) {
	var filteredCourses = jQuery.grep(Object.keys(requirements.courseCredits),
		function(element, index) {
			return element.indexOf(substring.toUpperCase()) >= 0;
	});

	return filteredCourses;
}

// sets the html for the filtered list
function createFilteredListItems(courses, quarter, year) {
	var html = buildCourseList(courses, 'addCourse');
	$('#dropdownYear' + year + quarter).html(html);
	// bind the onclick listeners for the list item
	bindListItemClick(quarter, year);
}

// sets the onclick listener for the filtered classes in the dropdown
function bindListItemClick(quarter, year) {
	$('.addCourse').click(function() {
		var course = $(this).html();
		addCourse(quarter, year, course);
	});
}

// add course event
function addCourse(quarter, year, course) {
	$('#year' + year + quarter + 'courselist').append('<li class="course">' +
			'<div class="removeCourse">&#x2715;</div><div class="courseName">' + course + '</div></li>');
	plan.addCourse(course, quarter, year);

	// initialize remove class event
	// attach quarter and year data to each element for removal functionality
	var courseElements = $('#year' + year + quarter + 'courselist > li');
	for (var i = 0; i < courseElements.length; i++) {
		jQuery.data(courseElements[i], 'year', year);
		jQuery.data(courseElements[i], 'quarter', quarter);
	}
	$('#year' + year + quarter + 'courselist > li > .removeCourse').unbind('click');
	$('#year' + year + quarter + 'courselist > li > .removeCourse').click(function() {
		removeCourse($(this));
	});

	// update sidebar requirements
	drawRequirementsView();
	checkRequirements();
}

// removes a course from the plan
function removeCourse(element) {
	// get the course name
	var parent = element.parent();
	var course = parent.children('.courseName').html();
	var year = jQuery.data(parent[0], 'year');
	var quarter = jQuery.data(parent[0], 'quarter');

	// remove the list item from the ul
	parent.remove();
	// remove the class from the plan object
	plan.removeCourse(course, quarter, year);

	// update sidebar requirements
	drawRequirementsView();
	checkRequirements();
}

// adds a year to the plan and layout
function addYear() {
	var index = plan.years.length;
	plan.years.push(new Year());
	drawYear(index);
}

// removes the last year from the plan
function removeYear() {
	var index = plan.years.length - 1;
	$('#year' + index).remove();
	plan.years.pop();
	
	// update sidebar requirements
	drawRequirementsView();
	checkRequirements();
}




// loops through all classes in the schedule and checks off the sidebar requirements
function checkRequirements() {

	$('.courseName').each(function(index) {
		var credits = requirements.courseCredits[$(this).html()];
		if (credits === undefined) {
			// check for coen elective
			checkCoenElective($(this));
		}
		else {
			checkOffRequiredCredit($(this), credits);
		}
	
	});

}

// loop through the requirements, checking them off if that requirement
// is unsatisfied
function checkOffRequiredCredit(course, credits) {
	var children = $('#requiredCreditsList').children();
	var used = false;

	for (var i = 0; i < children.length; i++) {
		var element = $(children[i]).children('.fulfilledBy');
		var credit = $(children[i]).children('.credit').html();
		// if the credit isn't fulfilled yet
		if (element.html() == '' && credits.indexOf(credit) >= 0) {
			// fulfill the credit
			used = true;
			element.html(course.html());
		}

	}

	if (used) {
		course.parent().css('background-color', 'white');
	}
	else {
		course.parent().css('background-color', 'yellow');
	}
}

// see if the course is eligible to be used for a coen elective
function checkCoenElective(course) {
	// make sure the course is an upper div coen course
	if (course.html().search(/^COEN[1-9]{1}[0-9]{2}$/) < 0) {
		course.parent().css('background-color', 'yellow');
		return;
	}

	// course is an upper div coen class, can be used as coen elective
	var children = $('#requiredCreditsList').children();
	var used = false;

	for (var i = 0; i < children.length; i++) {
		var element = $(children[i]).children('.fulfilledBy');
		var credit = $(children[i]).children('.credit').html();
		// if the credit is a coen elective
		if (credit.indexOf('COEN ELECTIVE') >= 0) {
			// check if the user is trying to retake a class for another coen elective
			if (element.html() == course.html()) {
				course.parent().css('background-color', 'yellow');
				return;
			}
			else if (element.html() == '') {
				// fulfill the credit
				used = true;
				element.html(course.html());
				course.parent().css('background-color', 'white');
				return;
			}
		}

	}

}