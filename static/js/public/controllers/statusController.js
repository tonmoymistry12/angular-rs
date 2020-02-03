'use strict';
angular.module('efrm')
.controller('statusController', ['$scope', '$rootScope', '$state', 'statusService',
	function($scope, $rootScope, $state, statusService){   
		
        // $rootScope.title = 'Spectrum Application Status';
		$scope.response = statusService.getResponseMessage();
                                 
		if($scope.response == null && $scope.response == undefined) {
			$state.go("signup");
		}else{
			$scope.applicationStatusMsg = $scope.response.message;
			$scope.flag = $scope.response.status === 'FAILURE' ? false : true ;
		}
        
}]);
