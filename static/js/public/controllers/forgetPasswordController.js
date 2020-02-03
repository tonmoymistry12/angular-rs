'use strict';
angular.module('efrm').controller('forgotPasswordController', ['$scope', '$window', '$rootScope', 'Util', 'UserService','EmailIdForSecurityQues', 'toastr', '$state', 'Msg','$interval', 
	function($scope, $window, $rootScope, Util, UserService, EmailIdForSecurityQues,toastr, $state, Msg, $interval){
	$scope.otpValidityInMinute = 0;
	$scope.otpValidityInTotalSecond = 0;
	$scope.otpValidityInSecond = 0;
	$scope.imagePath = Util.imagePath;
	$scope.showOtpDiv = false;
	$scope.resetPass = {};
	$scope.resendOTp = false;
	$scope.question = {};
	$scope.userSelection = {};
	$scope.radioSelection = '';
	$scope.radioSelectionEmptyCheck = false;
	$scope.primaryAnswerhide = false;
	
	 $scope.checkValidation = function(email){
		 if(!email){
			 $scope.radioSelectionEmptyCheck = false;
		 }
	 }
	 
	 
	 $scope.selectedRadioButton = function(radioSelection){
	       $scope.radioSelection = radioSelection;
	      var userMail =  $scope.resetPass.email;
	      if(radioSelection != null && userMail != ''){
	    	  $scope.radioSelectionEmptyCheck = false;
	      }
	       if(radioSelection == 'securityQuestion'){
	          if(userMail == '' || userMail == undefined){
	        	  $scope.radioSelectionEmptyCheck = true;
	          }
	          else{
	        	  $scope.showSecurityQues = true;
	        	  $scope.getSecurityQuestions();
	          }
	       }
	       else{
	    	   console.log('came to otp radio')
	          $scope.secoundQues = false;
	    	  $scope.primaryAnswerhide = false;
	    	  $scope.showSecAnswer = false;
	    	  $scope.showSecurityQues = false;
	    	  //emailForm.reset();
	    	  $scope.userSelection.primaryQuestion = null;
	    	  $scope.userSelection.primaryAnswer = '';
	    	  $scope.userSelection.secondryQuestion = null;
	    	  $scope.userSelection.secondryAnswer = '';
	    	  
	    	//  $scope.submitted = false;
	    	  
	    	 // console.log($scope.emailForm);
	    	 // $scope.emailForm.$setUntouched(true);
	    	  //$scope.emailForm.$setPrestine(true);
	    	  //$scope.emailForm.$setUntouched(true);
	       }
	 
	 }
	var otp = {};
	$scope.emailFormSubmit = function(){
	
				$scope.resetPass.createdBy = $scope.resetPass.email;
				var email = $scope.resetPass.email;
				if(email==undefined || email == ''){
					return;
				}
	 if($scope.radioSelection == 'securityQuestion'){
				
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
				$scope.resetPass.securityQuestions = [];
				$scope.question.questionId = $scope.userSelection.primaryQuestion;
				$scope.question.answer = sha256($scope.userSelection.primaryAnswer);
				
				$scope.resetPass.securityQuestions.push($scope.question);
				
				$scope.question = {};
				$scope.question.questionId = $scope.userSelection.secondryQuestion;
				$scope.question.answer = sha256($scope.userSelection.secondryAnswer);
				$scope.resetPass.securityQuestions.push($scope.question);
				console.log($scope.resetPass);
				UserService.header({}).validateSecQues({},$scope.resetPass, function(data){
					$scope.resetPass.userId = data.response.userId;
					$scope.timer = data.response.otpExpiryInMin;
					otp = data.response.otpExpiryInMin;
					toastr.success(data.message, Msg.hurrah);
					setTimeout(function(){document.getElementById('frg_otp1').focus()},100);// autofocus
					EmailIdForSecurityQues.setEmail($scope.resetPass.createdBy);
					$state.go('updatePassBySecurityQues')
				},function(err){
					
				});
		}
		else if($scope.radioSelection == 'email'){
				UserService.header({}).otp({},$scope.resetPass, function(data){
					$scope.resetPass.userId = data.response.userId;
					$scope.timer = data.response.otpExpiryInMin;
					otp = data.response.otpExpiryInMin;
					$scope.showOtpDiv = true;			
					toastr.success(data.message, Msg.hurrah);
					setTimeout(function(){document.getElementById('frg_otp1').focus()},100);// autofocus
				},function(err){
					
				});
		}
	}
	
	$scope.getSecurityQuestions = function(){
		var email = $scope.resetPass.email;
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
	  $scope.primaryAnswerhide = true;
	  setTimeout(function(){document.getElementById('primaryAnswer').focus()},100);
	 
	  $scope.questionIdToHide = primaryQuestion;
	   if(primaryQuestion == undefined || primaryQuestion == ''){
	         $scope.secoundQues = false;
	         $scope.showSecAnswer = false;
	  }
	   $scope.secQues = [];
	  angular.forEach($scope.questions, function(value, key) {
		  if (value.questionId != primaryQuestion) {
		    $scope.secQues.push(value);
		  }
		})
	    
	}
	
	$scope.showSecondryAnswer = function(secondryQuestion){
	  $scope.showSecAnswer = true;
	  setTimeout(function(){document.getElementById('secondryAnswer').focus()},100);
	   if(secondryQuestion == '' || secondryQuestion == undefined)
	  	{
		  	$scope.showSecAnswer = false;
		  	$scope.userSelection.secondryAnswer = '';
		}
	}
	
	
	
	$scope.otpFormSubmit = function(){
		$scope.resetPass.temporaryPassword = $scope.resetPass.otp1 + $scope.resetPass.otp2 + $scope.resetPass.otp3 + $scope.resetPass.otp4 + $scope.resetPass.otp5 + $scope.resetPass.otp6;
		$scope.resetPass.isForgotPasswordLinkClicked = true;
		$scope.resetPass.password = sha256($scope.resetPass.password);
		$scope.resetPass.reTypePassword = sha256($scope.resetPass.reTypePassword);
		UserService.header({}).forgotPass({},$scope.resetPass, function(data){
			toastr.success(data.message, Msg.hurrah);
			$state.go("signIn");		
		},function(err){
			
		});
	}
	
	$scope.resendOtp = function(){
		$scope.$broadcast('timer-reset',{otp : otp});
		$scope.emailFormSubmit();
		$scope.resetPass.otp = '';
		$scope.resetPass.password = '';
		$scope.resetPass.reTypePassword = '';
		$scope.resendOTp = false;
	}
	
	$scope.timerStopped = function(isStopped){
		toastr.info('Your OTP has expired. Please click on Re-send new OTP button to receive new OTP.');
		$scope.resendOTp = true;
	}
	
	  $scope.hideOtp = function(){
		$scope.showOtpDiv = false;
      	$scope.resetPass.otp1='';
      	$scope.resetPass.otp2='';
      	$scope.resetPass.otp3='';
      	$scope.resetPass.otp4='';
      	$scope.resetPass.otp5='';
      	$scope.resetPass.otp6='';
      }
	  
	 //$scope.init();
}])