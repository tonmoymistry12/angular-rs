'use strict';
angular.module('efrm.dashboard')
.controller('adminSearchController', ['$scope','$state','toastr','statusService', 'UserService','AdminService', 
function($scope, $state, toastr, statusService, UserService, AdminService){
    $scope.response = statusService.getResponseMessage();
    $scope.sortKey = 'fname'; // set the default sort type
    $scope.Reverse = false;  // set the default sort order
    $scope.searchUserFn   = '';     // set the default search/filter term
    $scope.searchUserLn   = '';     // set the default search/filter term
    $scope.userSearch = false;
    var loggedInUser = $scope.response.usersAuthoritiesPermissionsDto;
    $scope.userRole =  "ROLE_NPCI_APPLICATION_ADMIN";
    
    $scope.items = [
    	{ name:"NPCI Admin",val:"ROLE_NPCI_APPLICATION_ADMIN"},
    	{ name:"NPCI Supervisor",val:"ROLE_NPCI_APPLICATION_SUPERVISOR"},
    	{ name:"NPCI Analysts",val:"ROLE_NPCI_APPLICATION_ANALYSTS"},
    	{ name:"Bank  Admin",val:"ROLE_BANK_ADMIN"},
    	{ name:"Bank Supervisor",val:"ROLE_BANK_SUPERVISOR"},
    	{ name:"Bank Analysts",val:"ROLE_BANK_ANALYSTS"}
    ];
    $scope.searchData = {};     
    $scope.searchUserSubmit = function(){
    	$scope.searchData.role = $scope.userRole;
    	$scope.spinner = true;
    	$scope.strData = "?fname";
    	if($scope.searchData.hasOwnProperty('fname')) {
    		$scope.strData += "=" + $scope.searchData.fname;
    	}
    	$scope.strData += "&lname";
    	if($scope.searchData.hasOwnProperty('lname')) {
    		$scope.strData += "=" + $scope.searchData.lname;
    	}
    	$scope.strData += "&role";
    	if($scope.searchData.hasOwnProperty('role')) {
    		$scope.strData += "=" + $scope.searchData.role;
    	}
    	$scope.strData += "&phone";
		if($scope.searchData.hasOwnProperty('phone')) {
			$scope.strData += "=" + $scope.searchData.phone;
		}
		$scope.strData += "&email";
		if($scope.searchData.hasOwnProperty('email')) {
			$scope.strData += "=" + $scope.searchData.email;
		}
		$scope.strData += "&ssn";
		if($scope.searchData.hasOwnProperty('ssn')) {
			$scope.strData += "=" + $scope.searchData.ssn;
		}
		AdminService.header($scope.response.token).search($scope.searchData, function(data) {
        	$scope.searchUserData = [];                    
            $scope.searchUserData = data.response;
        },function(err){
            throw { message: 'Rest Exception' };
        });
    };
    $scope.sort = function(keyname){
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }
}])