'use strict';
angular.module('efrm.service')
.controller('resetTempPassController', ['$scope', '$rootScope', '$timeout', '$state', '$stateParams', 'statusService', 'UserService', 'toastr', 'Msg', 'RolePermissionMatrix', 'Session',
	function($scope, $rootScope, $timeout, $state, $stateParams, statusService, UserService, toastr, Msg, RolePermissionMatrix, Session){
    
    $scope.question = {};
	$scope.userSelection = {};
	$scope.resetTempPassForm = true;
    $scope.activationStatus = false;
	$scope.loading = false;
	$scope.spinner = false;
	
	$scope.forceChange = {};
	
	$scope.token = $stateParams.token;
	$scope.sessionData = statusService.getResponseMessage();
    $scope.forceChange.id = $scope.sessionData.usersAuthoritiesPermissionsDto.email;
    
    $scope.init = function(){
    	var email = $scope.forceChange.id;
	    UserService.header({email:email}).securityQues({},function(data){
	    $scope.questions = [];
	    $scope.questions = data.response;
	  },function(err){
	     console.log(err);
	  });
	}
	
	$scope.secQues = [];
	  $scope.showSecondQuestion = function(primaryQuestion){
	  $scope.secoundQues = true;
	   if(primaryQuestion == undefined || primaryQuestion == ''){
	         $scope.secoundQues = false;
	         $scope.showSecAnswer = false;
	  }
	  $scope.questionIdToHide = primaryQuestion;
	   $scope.secQues = [];
	  angular.forEach($scope.questions, function(value, key) {
		  if (value.questionId != primaryQuestion) {
		    $scope.secQues.push(value);
		  }
		})
	    
	}
	
	$scope.showSecondryAnswer = function(secondryQuestion){
	  $scope.showSecAnswer = true;
	  if(secondryQuestion == '' || secondryQuestion == undefined)
	  	{
		  	$scope.showSecAnswer = false;
		  	$scope.userSelection.secondryAnswer = '';
		}
	}
	

	$scope.resetTempSubmit = function(isValid) {
		if($scope.forceChange.password == $scope.forceChange.reTypePassword){
			$scope.userDetails = {};
			$scope.userDetails.email = $scope.forceChange.id;
			$scope.userDetails.id = $scope.forceChange.id;
			$scope.userDetails.password = sha256($scope.forceChange.password);
			$scope.userDetails.isForgotPasswordLinkClicked = true;
			$scope.spinner = true;
			
			$scope.userDetails.securityQuestions = [];
			$scope.question.questionId = $scope.userSelection.primaryQuestion;
			$scope.question.answer = sha256($scope.userSelection.primaryAnswer);
			$scope.userDetails.securityQuestions.push($scope.question);
			
			$scope.question = {};
			$scope.question.questionId = $scope.userSelection.secondryQuestion;
			$scope.question.answer = sha256($scope.userSelection.secondryAnswer);
			$scope.userDetails.securityQuestions.push($scope.question);
			
			var pQuestion = $scope.userSelection.primaryQuestion;
				if(pQuestion == undefined || pQuestion == ''){
				   $scope.selectEmpty = true;
				    return;
				}
				
				var pAnswer =  $scope.userSelection.primaryAnswer;
				if(pAnswer == undefined || pAnswer == ''){
				   $scope.primaryAnswerEmpty = true;
				    return;
				}
				
				var sQuestion = $scope.userSelection.secondryQuestion;
				if(sQuestion == undefined || sQuestion == ''){
				   $scope.secoundryQuestion = true;
				    return;
				}
				
				var sAnswer =  $scope.userSelection.secondryAnswer;
				if(sAnswer == undefined || sAnswer == ''){
				   $scope.secondryAnswer = true;
				    return;
				}
			UserService.header({token : localStorage.getItem("sessionToken")}).resetFirstPass({},$scope.userDetails,function(data){
				toastr.success(data.message, Msg.hurrah);
				var userData = Session.getSession();
				if(userData.usersAuthoritiesPermissionsDto.authority !== "ROLE_CARDHOLDER") {
                	$state.go(userData.usersAuthoritiesPermissionsDto.authorityLandingPage)
                }
				
			},function(err){
				
			});
		} else {
			$scope.errorMsg = true;
		}
	}
	
	$scope.init();
	
	
}]);