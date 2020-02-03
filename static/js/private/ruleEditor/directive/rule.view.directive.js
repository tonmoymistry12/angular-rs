(function () {
	'use strict';
	angular.module('rule').
	directive('ruleView', function () {
		return {
			restrict: 'E',
			scope: {
				
				ruledata: '='
			},
			controller: function ($scope,$window) {
				$window.scrollTo(0, 0);
				console.log('View Rule - ',$scope.ruledata)
				$scope.countryList = function(a) {
                    var temp = a.split(',')
                    var countryList = [];
                    angular.forEach(temp, function(value, key) {
                        angular.forEach(ruleDataService.getCountry(), function(country, countrykey) {
                            if (parseInt(country.NumericCode) === parseInt(value)) {
                                countryList.push(country.CountryName)
                            }
                        })
                    })
                    temp = countryList.toString()
                    
                    return temp
                }
			},
			templateUrl: 'templates/private/ruleEditor/directive/view.html',
			link: function (scope, element, attr) {
				
			}
		}
	})
})()