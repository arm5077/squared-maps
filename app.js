app = angular.module("mapApp", []);

app.controller("mapController", ["$scope", "$http", function($scope, $http){
	$scope.mapURL = getParameterByName("map").replace(/\/$/, "") || "map-data.csv";
	$scope.stylesURL = getParameterByName("styles").replace(/\/$/, "") || "styles.css";
}]);

app.directive("map", ['$http', function($http) {
	return {
		restrict: 'E',
		link: function(scope, element, attr) {
			$http.get(scope.mapURL).error(function(err){ throw err; })
			.success(function(data){
				// Check format of CSV 
				if( data.indexOf("name,x,y") != -1 ){
					// If traditional CSV, parse
					scope.mapData = Papa.parse(data, {header: true}).data;	
				} else {
					// If matrix CSV, create map object
					scope.mapData = [];
					data=data.replace(/[\n\r]/g, '\n');
					console.log(data);
					data.split("\n").forEach(function(row, y){
						row.split(",").forEach(function(rowItem, x){
							if( rowItem != "") scope.mapData.push({ name: rowItem, x: x, y: y });
						});
					});
				}

				scope.element = element;
				scope.height = Math.max.apply(null, scope.mapData.map(function(d){ return +d.y }) ) + 1;
				scope.width = Math.max.apply(null, scope.mapData.map(function(d){ return +d.x }) ) + 1;
			});
		}
	};	
}]);

app.directive("state", function() {
	return {
		restrict: 'E',
		link: function(scope, element, attr) {
			
			var timer = setInterval(function(){
				if(scope.$parent.element[0].clientWidth / scope.$parent.element[0].clientHeight <= scope.$parent.width / scope.$parent.height) {
					scope.padding = scope.$parent.element[0].clientWidth / (scope.$parent.width) * .1;
					scope.dimension = scope.$parent.element[0].clientWidth / (scope.$parent.width) - scope.padding;
				}
				else {
					scope.padding = scope.$parent.element[0].clientHeight / (scope.$parent.height) * .1;
					scope.dimension = scope.$parent.element[0].clientHeight / (scope.$parent.height) - scope.padding;
				}

				element[0].style.width = scope.dimension + "px";
				element[0].style.height = scope.dimension + "px";
				element[0].style.left = (scope.state.x) * (scope.dimension + scope.padding) + "px";
				element[0].style.top = (scope.state.y) * (scope.dimension + scope.padding) + "px";
				element[0].style.lineHeight = scope.dimension + "px";
				
				
				if( scope.dimension > 0 ) {
					clearInterval(timer);
					document.getElementsByTagName("body")[0].style.opacity = 1;
				}
				
			}, 250); 
		}
	};	
});

// Thanks to http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript for this
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}