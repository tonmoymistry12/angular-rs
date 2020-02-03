'use strict';
angular.module('efrm.dashboard')
.controller('createnamedhotlistController', ['$scope', '$rootScope', 'toastr','$timeout', '$state', '$stateParams', 'statusService', 'UserService','AdminService','casesManagement', 'Msg','Validation','commonDataService',
	function($scope, $rootScope, toastr, $timeout, $state, $stateParams, statusService, UserService, AdminService,casesManagement, Msg, Validation, commonDataService){
	 $scope.init = function(){
	    	$(function () {
	    		setTimeout(function(){ $('#contact').val($('#contact').val()).trigger('change');}, 10);
	    	});
	    };
		
	
	$scope.hotlist = {};
	$scope.userInformationDTO = {};
	 var orgId = commonDataService.getLocalStorage().orgId;
	 $scope.userId = commonDataService.getSessionStorage().userId;	
	$scope.response = statusService.getResponseMessage();
	$scope.desableme = true;
	$rootScope.welcomeName = $scope.response.usersAuthoritiesPermissionsDto.firstName;
	var useremail = commonDataService.getLocalStorage().userEmail;	
	
    
    
    
    //Get Organization//
    $scope.organisationName  = function(){
    	casesManagement.header().organisations( 
				{ 
					
					organisationID : orgId
				},
				function(response) {
	                         $scope.orgarnisations = response.response;

					},
				function(err) {
				});
    }
    
  //Get Channel//
    $scope.channelName  = function(){
		    casesManagement.header().channel( {},
					function(response) {
		                         //$scope.channel_code = response.response;
		    	var array = response.response;
                for(var i = array.length - 1; i >= 0; i--) {
                    if(array[i].channelCode === 'AEPS' || array[i].channelCode === 'NETC') {
                       array.splice(i, 1);
                    }
                }
                $scope.channel_code = array;
						},
					function(err) {
					});
    }
	
	$scope.getHotListEntity = function(selectedChannel){
    	if(selectedChannel == "" || selectedChannel == undefined){
    		$scope.desableme = true;
    	}else{
    		$scope.desableme = false;
    		 casesManagement.header().hotListEntity(
    	  	 		   {
    	  	 			channel : selectedChannel
    	  		 		},
    	  		 		function(response) 
    	  		 		   {
    	  		 			$scope.hotlistEntityList = response.response.data;
    	  		 			
    	  			       },
    	  			 	function(err) 
    	  			 		{
    	  			 	    }
    	  	               );
    		
    	}
    }
	
    
    
	$scope.hotlistFormSubmit = function(){
			$scope.hotlist.createdByUserId = useremail;
			$scope.hotlist.createdByOrgId = $scope.response.usersAuthoritiesPermissionsDto.orgId;
			$scope.hotlist.status = "ACTIVE" 
			/*$scope.userInformationDTO.orgId = $scope.response.usersAuthoritiesPermissionsDto.orgId;
			$scope.userInformationDTO.userId = $scope.userId;
			$scope.userInformationDTO.actionType = "PENDING_REVIEW"
			$scope.hotlist.userInformationDTO = $scope.userInformationDTO;*/
    		
			casesManagement.header().customHotListAdd($scope.hotlist, function(data) {
	            $scope.thisSession = data;
	            toastr.success("Named List Added Successfully", Msg.hurrah);	           
	            $scope.hotlistForm.$setUntouched(true);
	            $scope.hotlistForm.$setPristine(true);
	            $scope.hotlist = {};	   
	            $scope.submitted = false;
	            $scope.desableme = true;
	        },function(err){
	        });
    	
		
	}
	
    $scope.init = function(){
    	UserService.header({}).session({}, function(data){
		}, function(err){});
    	$scope.organisationName();
    	$scope.channelName();

    }
    
    
    $scope.backToList = function(){
    	$state.go('dashboard.hotlist');
    }
    $scope.init();
    
  
   
}])