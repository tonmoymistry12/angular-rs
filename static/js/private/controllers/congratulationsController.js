'use strict';
angular.module('efrm')
.controller('congratulationsController', ['$scope', '$rootScope', 'cfpLoadingBar', 'toastr', '$state', 'Util', 'statusService', 'ProfileService',
	function($scope, $rootScope, cfpLoadingBar, toastr, $state, Util, statusService, ProfileService){
		$scope.imagePath = Util.imagePath;
		
		$rootScope.response = statusService.getResponseMessage();
		$scope.congratulationsMsg = $scope.response.message;
		
		$scope.viewAccount = function(){	
			var header = {}
			header.sessionToken = localStorage.getItem("sessionToken");
			header.email = $rootScope.response.email
			try{
	    		ProfileService.header(header).getAccountDetails({}, function(data) {
	    			$scope.thisSession = data;
	    			statusService.setResponseMessage($scope.thisSession);
	    			$state.go('dashboard.myProfile')                
	            },function(err){
	                throw { message: 'Rest Exception' };
	            });
	        }catch(e){
	            throw e;
	        } 
			
		}
}]);