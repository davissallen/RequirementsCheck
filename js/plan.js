var Quarter = function() {
	this.classes = [];
}

var Year = function() {
	this.fall = new Quarter();
	this.winter = new Quarter();
	this.spring = new Quarter();
	this.summer = new Quarter();
}

var Plan = function() {
	this.years = [
		new Year(),
		new Year(),
		new Year(),
		new Year()
	];
}