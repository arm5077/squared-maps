// Map is 11 x 8

app = angular.module("mapApp", []);

app.controller("mapController", ["$scope", "$http", function($scope, $http){
	
	
	
	
}]);

app.directive("map", ['$http', function($http) {
	return {
		restrict: 'E',
		link: function(scope, element, attr) {
			$http.get(attr.url).error(function(err){ throw err; })
			.success(function(data){
				scope.data = data;
				scope.element = element;
			});
		}
	};	
}]);

app.directive("state", function() {
	return {
		restrict: 'E',
		link: function(scope, element, attr) {
			if( scope.$parent.element[0].clientWidth > scope.$parent.element[0].clientHeight ){
				scope.padding = scope.$parent.element[0].clientHeight / 8 * .1;
				scope.dimension = scope.$parent.element[0].clientHeight / 8 - scope.padding;
			} else {
				scope.padding = scope.$parent.element[0].clientWidth / 11 * .1;
				scope.dimension = scope.$parent.element[0].clientWidth / 11 - scope.padding;				
			}
			console.log(element[0].style.left);
			element[0].style.width = scope.dimension + "px";
			element[0].style.height = scope.dimension + "px";
			element[0].style.left = (scope.state.x) * (scope.dimension + scope.padding) + "px";
			element[0].style.top = (scope.state.y) * (scope.dimension + scope.padding) + "px";
			element[0].style.lineHeight = scope.dimension + "px";
		}
	};	
});