var app = angular.module('degreeAuditReport', []);

app.factory('plan', ['$http', function($http) {
	var o = { plan: null };

	o.get = function(id, callback) {
		return $http.get('/plans/' + id).success(function(data) {
			o.plan = data;
			callback(data);
		});
	}

	o.create = function(plan, callback) {
		return $http.post('/plans', plan).success(function(data) {
			o.plan = data;
			callback(data);
		});
	}

	return o;
}]);

app.factory('user', ['$http', function($http) {
	var o = { user: null };

	o.findOne = function(obj, callback) {
		return $http.post('/users/retrieve', obj).success(function(data) {
			o.user = data;
			callback(data);
		});
	}

	o.get = function(id, callback) {
		return $http.get('/users/' + id).success(function(data) {
			o.user = data;
			callback(data);
		});
	}

	o.create = function(user, callback) {
		return $http.post('/users', user).success(function(data) {
			o.user = data;
			callback(data);
		});
	}

	return o;
}]);

app.controller('MainCtrl', [
	'$scope',
	'user',
	'plan',
	function($scope, user, plan) {
		$scope.user = user.user;
		$scope.plan = plan.plan;

		$scope.addUser = function() {
			user.create({
				email: 'nrinaldi@SCu.edu',
				password: 'mySCU'
			});
		}

		$scope.addPlan = function() {
			// plan.create({
			// 	years: [
			// 		{
			// 			fall: []
			// 		}
			// 	]
			// });
		}

		$scope.findUser = function() {
			user.findOne({
				email: 'nrinaldi@scu.edu',
				password: 'mySCU'
			}, function(data) {
				$scope.user = data;
			});
		}

		$scope.findUser();
	}
]);