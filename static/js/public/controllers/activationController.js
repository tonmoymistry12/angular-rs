'use strict';
angular.module('efrm')
.controller('activationController', ['$scope', '$rootScope', '$stateParams', '$state', 'toastr', '$timeout',  'statusService', 'UserService', 
	function($scope, $rootScope, $stateParams, $state, toastr, $timeout, statusService, UserService){
        
    $rootScope.title = 'Spectrum Card Activation'; 
	
	$scope.activationForm = false;
    $scope.activationStatus = false;
	$scope.spinner = false;	
	$scope.forceChange = {};
	$scope.token = $stateParams.token;
    
    try{
    	UserService.header({}).activate({token: $scope.token}, function(data) {            
            $scope.thisSession = data;            
            if($scope.thisSession.status == "SUCCESS"){
    			$scope.activationForm = true;
        		$scope.forceChange.email = $scope.thisSession.email;
        	}else{
        		$scope.activationStatus = true;        		
        		$scope.statusText = $scope.thisSession.message;            	   		
        	}
        },function(err){
            throw { message: 'Rest Exception' };
        });
        
        
    }catch(e){
        throw e;
    }
       
    $scope.forceChange = {};
    $scope.activationSubmit = function(){
    	$scope.errorMsg = false;    	
    	
    	if($scope.forceChange.password == $scope.forceChange.reTypePassword){
    		
            $scope.errorMsg = false;
            $scope.spinner = true;
            var userCredential = angular.copy($scope.forceChange); 
            try {
            	UserService.header({}).passwordCreate({},userCredential, function(data) {            	
                $scope.thisSession = data;            
                if($scope.thisSession.status == "SUCCESS"){
                    toastr.success($scope.thisSession.message);                    
                    $timeout(function(){
                        $scope.userLogin();
                    }, 4000)    			     
                }else{ 
                    toastr.error($scope.thisSession.message);
                }
            },function(err){
                throw { message: 'Rest Exception' };
            });
            }catch(e){
                throw e;
            }  		

    	}else{
    		$scope.errorMsg = true;
    	}   	                
                
    }    
    
    $scope.userLogin = function(){
        var userCredential = angular.copy($scope.forceChange);
        try{
        	UserService.header(userCredential).login({},function(data){      
                $scope.thisSession = data;                
                if($scope.thisSession != null){
                	
                    localStorage.setItem("sessionToken", $scope.thisSession.token);
                    $scope.sessionToken = localStorage.getItem("sessionToken");
                    $scope.createVirtualCard($scope.sessionToken);
                }else{ 
                	toastr.error($scope.thisSession.message);
                }
            },function(err){
                throw { message: 'Rest Exception' };
            });
        }catch(e){
            throw e;
        }
    }
   
    $scope.createVirtualCard = function(sessionToken){
    	var userCredential = angular.copy($scope.forceChange);
    	userCredential.createdBy = userCredential.email;
    	try{
    		UserService.header({sessionToken}).generateVirtualCard({},userCredential, function(data) {          
                $scope.thisSession = data;
              
                if($scope.thisSession.status === "SUCCESS"){				
					statusService.setResponseMessage($scope.thisSession);					
					$state.go("congratulations");					
	        	}else{	        		
	        		toastr.error($scope.thisSession.message);        		
	        	}
            },function(err){
                throw { message: 'Rest Exception' };
            });
        }catch(e){
            throw e;
        }        
    	
    };
		
}]);

