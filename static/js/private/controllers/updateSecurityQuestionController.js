'use strict';

angular.module('efrm.dashboard')
.controller('updateSecurityQuestionController',  ['$scope', '$state','statusService','UserService','toastr','Msg','Session','commonDataService', function($scope, $state, statusService,UserService,toastr,Msg,Session,commonDataService) {
	 
	  $scope.userDetails = {};
	  $scope.secQuesDetails = {};
	  $scope.secQues = [];
	  $scope.showSecondQuestion = function(primaryQuestion){
	  $scope.secoundQues = true;
	  if(primaryQuestion == undefined || primaryQuestion == ''){
	         $scope.secoundQues = false;
	         $scope.showSecAnswer = false;
	  }
	  $scope.questionIdToHide = primaryQuestion;
	  $scope.question = {};
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
	
	$scope.init = function(){
		var email = commonDataService.getLocalStorage().userEmail;
	    /*UserService.header({email:email}).securityQues({},function(data){
	    $scope.questions = [];
	    $scope.questions = data.response;
	  },function(err){
	     console.log(err);
	  });*/
		UserService.header({email:'all'}).securityQues({},function(data){
		    $scope.questions = [];
		    $scope.questions = data.response;
		  },function(err){
		     console.log(err);
		  });
	}
	
	$scope.questionForm = function(){
	
	    $scope.userDetails.email = commonDataService.getLocalStorage().userEmail;
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
		
		$scope.userDetails.securityQuestions = [];
		$scope.question.questionId = $scope.userSelection.primaryQuestion;
		if($scope.userSelection.primaryAnswer != undefined){
			$scope.userSelection.primaryAnswer = sha256($scope.userSelection.primaryAnswer);
 		}
		$scope.question.answer = $scope.userSelection.primaryAnswer;
		
		$scope.userDetails.securityQuestions.push($scope.question);
		
		$scope.question = {};
		if($scope.userSelection.secondryAnswer != undefined){
			$scope.userSelection.secondryAnswer = sha256($scope.userSelection.secondryAnswer);
 		}
		$scope.question.questionId = $scope.userSelection.secondryQuestion;
		$scope.question.answer = $scope.userSelection.secondryAnswer;
		$scope.userDetails.securityQuestions.push($scope.question);
				
		UserService.header({}).updateSeqQues({},$scope.userDetails, function(data){
			toastr.success(data.message, Msg.hurrah);
			$scope.userSelection = {};
			$scope.emailForm.$setPristine();
			$scope.emailForm.$setUntouched(true);
			$scope.submitted = false;
		},function(err){
			
		});
		
		
	}
	
	 $scope.init();
		
}])