// Quarter object holding an array of classes

var Quarter = function() {
	this.courses = [];
}

var QUARTER_ENUM = {
	FALL: 'fall',
	WINTER: 'winter',
	SPRING: 'spring',
	SUMMER: 'summer'
};

// Year object with four quarters
var Year = function() {
	this.fall = new Quarter();
	this.winter = new Quarter();
	this.spring = new Quarter();
	this.summer = new Quarter();
}

// Plan object holding an array of years, users can
// choose to add extra years to their SCU carears
// var Plan = function() {
// 	this.years = [
// 		new Year(),
// 		new Year(),
// 		new Year(),
// 		new Year()
// 	];
// }

var Plan = function(obj) {
	if (obj === undefined || obj == null ||
		obj.years === undefined || obj.years == null) {
		
		this.years = [
			new Year(),
			new Year(),
			new Year(),
			new Year()
		];
	}
	else {
		this.years = obj.years;
	}
}

Plan.prototype.removeCourse = function(course, quarter, year) {
	var index = this.years[year][quarter].courses.indexOf(course);
	if (index > -1) {
		this.years[year][quarter].courses.splice(index, 1);
	}
}

Plan.prototype.addCourse = function(course, quarter, year) {
	this.years[year][quarter].courses.push(course);
}