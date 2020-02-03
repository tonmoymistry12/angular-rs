'use strict';

angular.module('efrm.dashboard')
.controller('accountSettingsController',  ['$scope', '$state','statusService','UserService','toastr','Msg','Session','commonDataService', function($scope, $state, statusService,UserService,toastr,Msg,Session,commonDataService) {
		
    $scope.isSessionValid = function(){
        UserService.header({}).session({}, function(data){
        }, function(err){});
    }
    $scope.oldPasswordMsg = false;
    $scope.cnfrmPasswordMsg = false;
	$scope.newPassword = '';
    $scope.tick = false;
    $scope.changePasswordSubmit = function(){
    	if($scope.oldPasswordMsg ==false && $scope.cnfrmPasswordMsg == false){
	    	$scope.changePasswordDto = {}
	    	$scope.changePasswordDto.email = commonDataService.getLocalStorage().userEmail;
	    	
	    	$scope.changePasswordDto.oldPassword = sha256($scope.oldPassword);
	    	$scope.changePasswordDto.newPassword = sha256($scope.newPassword);
	    	UserService.header({}).changePass($scope.changePasswordDto, function(data) {	            
	            toastr.success(data.message, Msg.hurrah);	
	            $scope.oldPasswordMsg = false;
	    		$scope.cnfrmPasswordMsg = false;
	            $scope.submitted = false;
	            Session.clear();
	    		$state.go('signOut');
	        },function(err){
	        	toastr.error(data.message, Msg.hurrah);	
	        });
    	}
    }

    $scope.changeNewPassword = function(newPassword){
		$scope.newPassword=newPassword;
		chckPassword();
	}
	$scope.changeOldPassword=function(oldPassword){
		$scope.oldPassword=oldPassword;
		chckPassword();
	}
	$scope.ChangeReTypePassword=function(reTypePassword){
		$scope.reTypePassword=reTypePassword;
		chckPassword();
	}

    
    var chckPassword = function(){
		if(!angular.isUndefined($scope.oldPassword)&& !angular.isUndefined($scope.newPassword)){
    	if($scope.oldPassword == $scope.newPassword){
    		$scope.oldPasswordMsg = true;
    		$scope.cnfrmPasswordMsg = false;
    		
    	}else if($scope.newPassword != $scope.reTypePassword){
    		$scope.oldPasswordMsg = false;
    		$scope.tick = false;
    		if($scope.reTypePassword != undefined){
    			$scope.cnfrmPasswordMsg = true;
    		}  		
    	}else{
    		$scope.oldPasswordMsg = false;
    		$scope.cnfrmPasswordMsg = false;
    		if($scope.reTypePassword != undefined && $scope.newPassword != undefined){
    			$scope.tick = true;
    		}
    	}
		}
    }
          	   
 }])
