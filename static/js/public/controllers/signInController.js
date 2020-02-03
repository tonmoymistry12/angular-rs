'use strict';
angular.module('efrm')

.controller('signInController', ['$scope','$state', '$timeout', 'cfpLoadingBar', 'toastr',  'Util', 'UserService','Msg', 'statusService', 'RolePermissionMatrix', 'Session','Lookup','$rootScope','DataService','commonDataService','RuleService',
    function($scope, $state, $timeout, cfpLoadingBar,  toastr,  Util, UserService,Msg, statusService, RolePermissionMatrix, Session,Lookup,$rootScope,DataService,commonDataService,RuleService){


        localStorage.clear();
       $scope.imagePath = Util.imagePath;
       $scope.login = {};
       $scope.user = {};
       $scope.otpForm = false;
       $scope.otpValidityInMinute = 0;
       $scope.otpValidityInTotalSecond = 0;
       $scope.otpValidityInSecond = 0;
       $scope.resendOTp = false;
       $scope.resetPass = {};
       $scope.email = '';
       $scope.landingPage = '';
       var otp = {};
       $scope.userData = {};
       $scope.csrf ="";

       $scope.loginSubmit = function(){
    	 $scope.rawPassword =   $scope.login.password
           if($scope.login.password != undefined){
    	       $scope.login.password = sha256($scope.login.password);
    		}
              UserService.header($scope.login).login({},function(response, CSRF, status ){
                     var userData = response;
                     $scope.userData = userData;
                     $scope.landingPage = userData.usersAuthoritiesPermissionsDto.authorityLandingPage;
                localStorage.clear();

                localStorage.setItem("userEmail",response.usersAuthoritiesPermissionsDto.email);
                /*localStorage.setItem("orgId",response.usersAuthoritiesPermissionsDto.orgId);
                localStorage.setItem("p2Visibility",response.usersAuthoritiesPermissionsDto.p2Visibility);
                localStorage.setItem("userEmail",response.usersAuthoritiesPermissionsDto.email);
                localStorage.setItem("orgName",response.usersAuthoritiesPermissionsDto.orgName);
                localStorage.setItem("perspective",response.usersAuthoritiesPermissionsDto.perspective)*/
                
                
                var setLocalStorage = {
                	orgId:response.usersAuthoritiesPermissionsDto.orgId,
                	orgName : response.usersAuthoritiesPermissionsDto.orgName,
                	userEmail:response.usersAuthoritiesPermissionsDto.email,
                	perspective:response.usersAuthoritiesPermissionsDto.perspective.toString(),
                	p2Visibility:response.usersAuthoritiesPermissionsDto.p2Visibility
                }
                
                var setDurationForSimulation = {
                		duration:response.configuarationParamMap.duration,
                		message:response.configuarationParamMap.message
                }
                commonDataService.setDurationInfoForSimulation(setDurationForSimulation)
                
                commonDataService.setLocalStorage(setLocalStorage);
                  RuleService.setSelectedChannel(null);
                  RuleService.setSelectedOrgId(null);
                  RuleService.setSelectedStatus(null);
                  RuleService.setPrevPath(null);
                  
                  var session = {userId:response.usersAuthoritiesPermissionsDto.userId};
             	 commonDataService.setSessionStorage(session);
                
                Session.clear();
                Session.setSession(userData);
                Session.setCsrf(CSRF('CSRF-TOKEN'));
                $scope.csrf = CSRF('CSRF-TOKEN');
                Session.setToken(userData.token);
                RolePermissionMatrix.setAuthority(response.usersAuthoritiesPermissionsDto.authPermissionDtos);
                var setLoadDomainSuccess = false;
                var setLoadParameterSuccess = false;
                    //code for email masking start// 
                     var maskid ="";
                     var Email = $scope.login.id;
                     var prefix = Email.substring(0, Email.lastIndexOf("@"));
                     var postfix= Email.substring(Email .lastIndexOf("@"));
                     for(var i=0; i<prefix.length; i++){
                    	    if(i == 0 || i == prefix.length - 1 || i == 1 || i == prefix.length - 2) {
                    	    	
                    	        maskid = maskid + prefix[i].toString();
                    	    }
                    	    else {
                    	        maskid = maskid + "*";
                    	    }
                    	}
                     
                     $scope.email = maskid + postfix;
                   //code for email masking end//
                     
                     $scope.user.email = $scope.login.id;
                    
                     Lookup.header(userData.token).reason({}, function(data){
                           setLoadDomainSuccess = true;
                           DataService.setReasons(data.response);
                           isLoaded();
                     },function(err){                         
                           $state.go('broken');
                     });
                     Lookup.header(userData.token).parameters({}, function(data){
                           setLoadParameterSuccess = true;
                           DataService.setParameters(data.response);
                           isLoaded();
                     },function(err){
                           $state.go('broken');
                     });
                     function isLoaded(){
                           if(setLoadDomainSuccess && setLoadParameterSuccess){
                                  $scope.checkForFirstTimeLogin(userData);
                           }
                     }
                     
              },function(err){ });
        }
       
        $scope.checkForFirstTimeLogin = function(sessionData) {
            $scope.data = {}
            $scope.data.email = sessionData.usersAuthoritiesPermissionsDto.usersUsername;
            $scope.data.tempPasswordFlag = sessionData.usersAuthoritiesPermissionsDto.tempPasswordFlag;
            if($scope.data.tempPasswordFlag == true) {
              statusService.setResponseMessage(sessionData)
                $state.go('resetTempPass')
            } else {
                statusService.setResponseMessage(sessionData);
                UserService.header({}).otpauth({},$scope.user, function(data){
                	 Session.clear();
                	 /*sessionStorage.setItem("userId",data.response.userId);*/
                	 /*var session = {userId:data.response.userId};
                	 commonDataService.setSessionStorage(session);*/
                    $scope.resetPass.userId = data.response.userId;
                          $scope.timer = data.response.otpExpiryInMin;
                          otp = data.response.otpExpiryInMin;
                          $scope.otpForm = true;
                          $scope.showOtpDiv = true;              
                          toastr.success(data.message, Msg.hurrah);
                          setTimeout(function(){document.getElementById('login_otp1').focus()},100);// autofocus 
             },function(err){ 
            	 Session.clear();
                   $state.go('broken');
             });
               
            }
            
        }
        
        $scope.otpFormSubmit = function(){
        	  Session.setSession($scope.userData);
              Session.setCsrf($scope.csrf);
              
              Session.setToken($scope.userData.token);
              
              $scope.resetPass.temporaryPassword = $scope.resetPass.otp1 + $scope.resetPass.otp2 + $scope.resetPass.otp3 + $scope.resetPass.otp4 + $scope.resetPass.otp5 + $scope.resetPass.otp6;
              $scope.resetPass.isForgotPasswordLinkClicked = false;
              $scope.resetPass.email = $scope.login.id;
              UserService.header({}).forgotPass({},$scope.resetPass, function(data){
                     toastr.success("Login Successful", Msg.hurrah);
                     $state.go($scope.landingPage);           
              },function(err){
            	  Session.clear();
                  
              });
        }
        
        $scope.resendOtp = function(){
              $scope.$broadcast('timer-reset',{otp : otp});
              $scope.login.password =  $scope.rawPassword;
              $scope.loginSubmit();
              $scope.hideOtp();
              $scope.resetPass.otp = '';
              $scope.resetPass.password = '';
              $scope.resetPass.reTypePassword = '';
              $scope.resendOTp = false;
              
       }
        
        $scope.timerStopped = function(isStopped){
              //$scope.resetPass.emailId = '';
              toastr.info('Your OTP has expired. Please click on RESEND OTP link to receive new OTP.');
              //$scope.showOtpDiv = false;
              $scope.resendOTp = true;
       }
        
        $scope.chnageEmail = function(){
        	$scope.login.password =  $scope.rawPassword;
        	$scope.resendOTp = false;
        	$scope.otpForm = false;
        	//$scope.hideOtp();
        	$scope.resetPass.otp1='';
        	$scope.resetPass.otp2='';
        	$scope.resetPass.otp3='';
        	$scope.resetPass.otp4='';
        	$scope.resetPass.otp5='';
        	$scope.resetPass.otp6='';
        }
        $scope.hideOtp = function(){
        	$scope.login.password =  $scope.rawPassword;
        	$scope.resendOTp = false;
        	$scope.otpForm = true;
        	$scope.resetPass.otp1='';
        	$scope.resetPass.otp2='';
        	$scope.resetPass.otp3='';
        	$scope.resetPass.otp4='';
        	$scope.resetPass.otp5='';
        	$scope.resetPass.otp6='';
        }

     
}]);

