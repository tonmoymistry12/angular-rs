'use strict';
angular.module('efrm.dashboard')
.controller('approvependingassignmentController', ['$scope','$rootScope','$state', '$timeout', 'toastr','statusService', 'UserService','AdminService','QueueService','casesManagement','casesManagement2', '$ngConfirm', 'RolePermissionMatrix','Util', 'Session', 'Msg', 'DataService','Validation','commonDataService',
function($scope, $rootScope, $state, $timeout, toastr, statusService, UserService, AdminService,QueueService,casesManagement,casesManagement2, $ngConfirm, RolePermissionMatrix, Util, Session, Msg, DataService,Validation, commonDataService){
	$scope.moment = Util.moment;
	$scope.reasonCode = "-1";
	$scope.showMsg = false;
	$scope.rolePermission = RolePermissionMatrix;
    $scope.response = statusService.getResponseMessage();
	$rootScope.welcomeName = $scope.response.usersAuthoritiesPermissionsDto.firstName;
    var loggedInUser = $scope.response.usersAuthoritiesPermissionsDto;    
    $scope.authority = $scope.response.usersAuthoritiesPermissionsDto.authority;
    $scope.loggedInUserMail = loggedInUser.email;
    $scope.loggedInUserId = commonDataService.getSessionStorage().userId;
    $scope.channelSort = true;
    $scope.queueDto = {};
    $scope.type = '';
    $scope.modalTitle = '';
    $scope.modelContent = '';
    $scope.userInformationDTO = {};
    //$scope.selectedPage = "5";
    //changes made
    $scope.selectedPage = "50";
    $scope.queueCodeSort = true;
    $scope.queueNameSort = true;
    $scope.createdDateSort = true;
    $scope.updatedDateSort = true;
    $scope.createdBySort = true;
    $scope.assignedToSort = true;
    $scope.statusSort = true;
    
   $scope.showErrMsg = false;
   $scope.myselectedOrgid = '';
 
	var orgId = commonDataService.getLocalStorage().orgId;
	$scope.loggedInOrgID = "";
	 $scope.loggedInOrgID = commonDataService.getLocalStorage().orgId;
	$scope.selectedOrgid =  $scope.loggedInOrgID;
	 $scope.myselectedOrgid = $scope.loggedInOrgID;
	var userId = commonDataService.getSessionStorage().userId;
    
   
    
   
    
   $scope.queueModel= function(row,type){
	  
	   $scope.type = type;
	   $scope.assignQueue = {};
	 
	   	  $scope.assignQueue.users = [];
		  $scope.assignQueue.listTaskQueue = [];
		  $scope.assignQueue.users = row.users;
		  $scope.assignQueue.listTaskQueue = row.listTaskQueue;
		  $scope.assignQueue.orgId = row.listTaskQueue[0].orgId;
		  $scope.assignQueue.assignedBy = $scope.loggedInUserId;
		  $scope.assignQueue.updatedBy = $scope.loggedInUserId;
		 
	 
	  
	   if($scope.type == "approvequeue"){
		
	   	$scope.modalTitle = 'Approve';
	    $scope.modelContent = 'Do You Want To Continue ?';
	    if(row.actionType == 1){
	    	//$scope.modalTitle = 'Assignment Request - Approval';
	    	$scope.assignQueue.action =1;
		    $scope.assignQueue.actionType = 1;
	    }
	    if(row.actionType == 2){
	    	//$scope.modalTitle = 'Assignment Removal Request - Approval';
	    	$scope.assignQueue.action =1;
		    $scope.assignQueue.actionType = 3;
	    }
	    
	   }
	  
	   if($scope.type == "rejectqueue"){
		
		$scope.modalTitle = 'Reject';
		$scope.modelContent = 'Do You Want To Continue ?';
		if(row.actionType == 1){
			//$scope.modalTitle = 'Assignment Request - Rejection';
	    	$scope.assignQueue.action =2;
		    $scope.assignQueue.actionType = 1;
	    }
		if(row.actionType == 2){
			//$scope.modalTitle = 'Assignment Removal Request - Rejection';
	    	$scope.assignQueue.action =2;
		    $scope.assignQueue.actionType = 3;
	    }
		
		}
	   $scope.showMsg = false;
	   $scope.reason = "";
	   //$scope.queueDto.userInformationDTO = $scope.userInformationDTO;
	   $ngConfirm({
			title: $scope.modalTitle,
			theme: 'Material',
			content:$scope.modelContent,
			//icon: 'fa fa-unlock',
			 //content: '<div class="form-group"><textarea ng-change="showMsg = false" ng-model="reason" class="form-control" placeholder="Notes"></textarea><div class="text-danger" ng-if="showMsg"><small>This is a required field</small></div></div>',
			scope: $scope,
			buttons: {
				Ok: {
					text: 'Confirm',
					btnClass: 'btn-red',
					action: function(scope, button){                    	
						/*$scope.userInformationDTO.notes = $scope.reason;
						$scope.queueDto.userInformationDTO = $scope.userInformationDTO;*/
						
                             /*if($scope.alertReason == ""){
                                 $scope.reason = "";
                                 $scope.showMsg = true;
                                 return false;
                             }else{*/

                            
						QueueService.header($scope.response.token).assignQueueMakerChackerApproveReject({queueCode:null},$scope.assignQueue, function(data) {
							   
					           $scope.thisSession = data;
					           toastr.success(data.message, Msg.hurrah);
					           if($scope.myselectedOrgid ==''){
					        	   $scope.myselectedOrgid = $scope.loggedInOrgID;
					           }
					           
					           QueueService.header($scope.response.token).assignQueueMakerChacker({selectedOrgId:$scope.myselectedOrgid}, function(data) {
					           	$scope.viewQueueData = [];                    
					              
					           	$scope.viewQueueData = data.response.data;
					               	/* $scope.viewQueueData = data.response.data; 
					               	 $scope.totalItems = $scope.viewQueueData.length;*/
					           /*	if($scope.type == 'rejectqueue'){
			    	        		toastr.success("Request Rejected Successfully", Msg.hurrah);
			    	        	}else{
			    	        		toastr.success("Request Approved Successfully", Msg.hurrah);
			    	        	}*/
					           	$scope.assignQueue = {}
					           	$scope.assignQueue.users = [];
					  		  $scope.assignQueue.listTaskQueue = [];
					               
					              
					           },function(err){
					           	$scope.viewQueueData = [];
					               $scope.totalItems = 0;
					           });
					            
					       },function(err){
					    		$scope.assignQueue = {}
					           	$scope.assignQueue.users = [];
					  		  $scope.assignQueue.listTaskQueue = [];
					    	   toastr.error(data.message, Msg.hurrah);
					       });
					//}
				  }
				},
				Cancel : {
                    text : 'Cancel',
                    action : function(scope,button) {
                    	/*$scope.queueDto = {};
                        $scope.userInformationDTO = {};*/
                        $scope.reason = "";
                        $scope.showMsg = false;
                        $scope.assignQueue = {}
			           	$scope.assignQueue.users = [];
			  		  $scope.assignQueue.listTaskQueue = [];

                    }

                }
			}
		});
   }
   

   $scope.sort = function(keyname){
       $scope.sortKey = keyname;   //set the sortKey to the param passed
       $scope.reverse = !$scope.reverse; //if true make it false and vice versa
       if(keyname == 'listTaskQueue[0].queueCode'){
    	   $scope.queueCodeSort = !$scope.queueCodeSort;
       }
       if(keyname == 'queueName'){
    	   $scope.queueNameSort = !$scope.queueNameSort;
       }
       if(keyname == 'assignedTime'){
    	   $scope.createdDateSort = !$scope.createdDateSort;
       }
       if(keyname == 'updatedDate'){
    	   $scope.updatedDateSort = !$scope.updatedDateSort;
       }
       if(keyname == 'channel'){
    	   $scope.channelSort = !$scope.channelSort;
       }
       if(keyname == 'assignedBy'){
    	   $scope.createdBySort = !$scope.createdBySort;
       }
       if(keyname == 'users[0].firstName'){
    	   $scope.assignedToSort = !$scope.assignedToSort;
       }
       if(keyname == 'actionType'){
    	   $scope.statusSort = !$scope.statusSort;
       }
   }
  
    
    $scope.init = function(){
    	$scope.myCases = [];
    	$scope.orgId = commonDataService.getLocalStorage().orgId;
    	$scope.updatedByOrgId = commonDataService.getLocalStorage().orgId;
    	$scope.userId = commonDataService.getSessionStorage().userId;
    	var version = 1;
    	var status = "ALL"
    	
    	QueueService.header($scope.response.token).assignQueueMakerChacker({selectedOrgId:$scope.myselectedOrgid}, function(data) {
        	$scope.viewQueueData = [];                    
           
        	$scope.viewQueueData = data.response.data;
            	/* $scope.viewQueueData = data.response.data; 
            	 $scope.totalItems = $scope.viewQueueData.length;*/
            
           
            
           
        },function(err){
        	$scope.viewQueueData = [];
            $scope.totalItems = 0;
        });
    	
    	casesManagement2.header($scope.response.token).channel( {},
    			function(response) {
                             $scope.channel_code = response.response;
    				},
    			function(err) {
    			});
    }
    
   
   
    $scope.isSessionValid = function(){
		UserService.header({}).session({}, function(data){
		}, function(err){});
	}
    
   
    
    $scope.channelDisplay = function(channel){
    	
    	if($scope.channel_code != null && typeof $scope.channel_code !== "undefined" && channel != null && typeof channel !== "undefined"){
    	for(var i=0;i<$scope.channel_code.length;i++){
    		if($scope.channel_code[i].channelCode == channel){
    			return $scope.channel_code[i].channelDesc;
    		}
    	}	
    }
    }
    
    $scope.organisationName  = function(){
    	casesManagement.header().organisations( 
				{ 
					
					organisationID : orgId
				},
				function(response) {
	                         $scope.orgarnisations = response.response;
	                         
	                        // var myArray  = $scope.orgarnisations.filter((x)=>(x.orgId == $scope.loggedInOrgID))
		                     //   $scope.selectedOrgid = myArray[0];

					},
				function(err) {
				});
    }
    
    
    	$scope.organisationName();
    	
    	$scope.organisationDisplay = function(organisation){
    		if($scope.orgarnisations != null && typeof $scope.orgarnisations !== "undefined" && organisation != null && typeof organisation !== "undefined"){
    	    	for(var i=0;i<$scope.orgarnisations.length;i++){
    	    		if($scope.orgarnisations[i].orgId == organisation){
    	    			return $scope.orgarnisations[i].name;
    	    		}
    	    	}	
    	    }
    		
    	}
   
    
    	$scope.changeOrgaisation = function(selectedOrgid){
        	
        	if(typeof selectedOrgid == "undefined"){
        		$scope.showErrMsg = true;
        	}else{
        		$scope.myselectedOrgid = selectedOrgid;
        		$scope.showErrMsg = false;
    	    	QueueService.header($scope.response.token).assignQueueMakerChacker({selectedOrgId:selectedOrgid}, function(data) {
    	    		$scope.viewQueueData = data.response.data;
    	        },function(err){
    	        	$scope.viewQueueData = [];
    	            $scope.totalItems = 0;
    	        });
        	}
        }
    

    
    $scope.init();
}])
