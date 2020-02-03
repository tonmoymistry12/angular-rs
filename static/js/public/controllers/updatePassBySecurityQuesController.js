'use strict';
angular.module('efrm').controller('updatePassBySecurityQuesController', ['$scope', '$rootScope', 'Util', 'UserService','EmailIdForSecurityQues', 'toastr', '$state', 'Msg','$interval', 
	function($scope, $rootScope, Util, UserService,EmailIdForSecurityQues, toastr, $state, Msg, $interval){
	
	$scope.changePassDiv = true;
	$scope.imagePath = Util.imagePath;
	$scope.readOnlyEmail = EmailIdForSecurityQues.getEmail();
	
	$scope.submitPassword = function(){
	  $scope.resetPass.isForgotPasswordLinkClicked = true;
		$scope.resetPass.password = sha256($scope.resetPass.password);
		$scope.resetPass.reTypePassword = sha256($scope.resetPass.reTypePassword);
		$scope.resetPass.email = $scope.readOnlyEmail;
		$scope.resetPass.isForgotPasswordBySecurtiyQuestion = true;
		UserService.header({}).forgotPass({},$scope.resetPass, function(data){
			toastr.success(data.message, Msg.hurrah);
			$state.go("signIn");		
		},function(err){
			
		});
	}
	
	
	}])