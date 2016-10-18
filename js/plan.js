// Quarter object holding an array of classes
var Quarter = function() {
	this.classes = [];
}

// Year object with four quarters
var Year = function() {
	this.fall = new Quarter();
	this.winter = new Quarter();
	this.spring = new Quarter();
	this.summer = new Quarter();
}

// Plan object holding an array of years, users can
// choose to add extra years to their SCU carears
var Plan = function() {
	this.years = [
		new Year(),
		new Year(),
		new Year(),
		new Year()
	];
}