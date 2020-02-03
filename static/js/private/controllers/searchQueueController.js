'use strict';
angular.module('efrm.dashboard')
.controller('searchQueueController', ['$scope','$rootScope','$state', '$timeout', 'toastr','statusService', 'UserService','AdminService','QueueService','casesManagement','casesManagement2', '$ngConfirm', 'RolePermissionMatrix','Util', 'Session', 'Msg', 'DataService','Validation','commonDataService',
function($scope, $rootScope, $state, $timeout, toastr, statusService, UserService, AdminService,QueueService,casesManagement,casesManagement2, $ngConfirm, RolePermissionMatrix, Util, Session, Msg, DataService,Validation,commonDataService){
	$scope.moment = Util.moment;
	$scope.reasonCode = "-1";
	$scope.showMsg = false;
	$scope.rolePermission = RolePermissionMatrix;
    $scope.response = statusService.getResponseMessage();
	$rootScope.welcomeName = $scope.response.usersAuthoritiesPermissionsDto.firstName;
    var loggedInUser = $scope.response.usersAuthoritiesPermissionsDto;    
    $scope.authority = $scope.response.usersAuthoritiesPermissionsDto.authority;
    $scope.loggedInUserMail = loggedInUser.email;
    $scope.loggedInUserId = commonDataService.getSessionStorage().userId
    $scope.channelSort = true;
    $scope.queueDto = {};
    $scope.type = '';
    $scope.modalTitle = '';
    $scope.modelContent = '';
    $scope.userInformationDTO = {};
    //$scope.selectedPage = '5';
    $scope.selectedPage = '50';
    $scope.queueCodeSort = true;
    $scope.queueNameSort = true;
    $scope.createdDateSort = true;
    $scope.updatedDateSort = true;
   $scope.showErrMsg = false;
   $scope.queueActionType = "ACTIVE"
   

	var orgId = commonDataService.getLocalStorage().orgId;
	$scope.loggedInOrgID = "";
	 $scope.loggedInOrgID = commonDataService.getLocalStorage().orgId;
	 $scope.myselectedOrgid = $scope.loggedInOrgID;
	 $scope.selectedOrgid =  $scope.loggedInOrgID;
	var userId = commonDataService.getSessionStorage().userId
    
    $scope.edit = function(row){
    	localStorage.setItem("Queue_OrgId", $scope.storeSelectedOrgid);
    	//$scope.myselectedOrgid;
    	
    	localStorage.setItem("Queue_Selected_Status", $scope.storeSelectedStatus);
    	localStorage.setItem("prev_path_Queue", "viewQueue");
    	$state.go('dashboard.updatequeue',{editable:'Y', value: row});
    } 
    
    $scope.view = function(row){
    	localStorage.setItem("Queue_OrgId", $scope.storeSelectedOrgid);
    	//$scope.myselectedOrgid;
    	
    	localStorage.setItem("Queue_Selected_Status", $scope.storeSelectedStatus);
    	localStorage.setItem("prev_path_Queue", "viewQueue");
    	$state.go('dashboard.updatequeue',{editable:'Y',viewable:'Y', value: row});
    } 
    
    $scope.check =  function(row){
    	if(row.userInformationDTO.updatedByUserIdOrig == null){
	    	if(row.userInformationDTO.actionType == 'PENDING_REVIEW' &&  $scope.loggedInUserId == row.userInformationDTO.userIdOrig){
	    		$scope.isEditPermisson = true;
	    	}else{
	    		$scope.isEditPermisson = false
	    	}
    	}
    	if(row.userInformationDTO.updatedByUserIdOrig != null){
    		if(row.userInformationDTO.actionType == 'PENDING_REVIEW' &&  $scope.loggedInUserId == row.userInformationDTO.updatedByUserIdOrig){
	    		$scope.isEditPermisson = true;
	    	}else{
	    		$scope.isEditPermisson = false
	    	}
    	}
    }
   
    
   $scope.queueModel= function(row,type){
	   
	   $scope.type = type;
	   $scope.queueDto.queueId = row.queueId;
	   $scope.queueDto.queueCode = row.queueCode;
	   $scope.queueDto.queueName = row.queueName;
	   $scope.queueDto.description = row.description;
	   $scope.queueDto.condition = row.condition;
	   $scope.queueDto.orgId = row.orgId;
	   $scope.queueDto.queueTypeCd = row.queueTypeCd;
	   $scope.queueDto.isAutoExpire = row.isAutoExpire;
	   $scope.queueDto.expireTime = row.expireTime;
	   $scope.queueDto.isAutoEscalate = row.isAutoEscalate;
	   $scope.queueDto.escalateTime = row.escalateTime;
	   $scope.queueDto.priority = row.priority;
	   $scope.queueDto.queueAlert = row.queueAlert;
	   $scope.userInformationDTO.orgId = row.userInformationDTO.orgId;
	   $scope.userInformationDTO.userId = $scope.userId;
	  /* $scope.userInformationDTO.updatedByUserId = $scope.userId;
	   $scope.userInformationDTO.updatedByOrgId = $scope.updatedByOrgId;
	   $scope.userInformationDTO.updatedByUserIdOrig = $scope.userId;*/
	   $scope.userInformationDTO.channel = row.userInformationDTO.channel
	   if($scope.type == "reactive"){
		   	$scope.userInformationDTO.actionType = "PENDING_REACTIVATION"; //ACTIVE//
		   	$scope.modalTitle = 'Reactive Queue';
		    $scope.modelContent = 'Do You Want To Reactive The Queue?';
	   }
	   if($scope.type == "approvequeue"){
		$scope.userInformationDTO.actionType = "ACTIVE"; //ACTIVE//
	   	$scope.modalTitle = 'Approve Queue';
	    $scope.modelContent = 'Do You Want To Approve The Queue?';
	   }
	   if($scope.type=="deactivete"){
	   $scope.userInformationDTO.actionType = "PENDING_DEACTIVATION";
	   $scope.modalTitle = 'Deactivate Queue';
	   $scope.modelContent = 'Do You Want To Deactivated The Queue?';
	   }
	   if($scope.type=="decativateApprove"){
		   $scope.userInformationDTO.actionType = "DEACTIVATED";
		   $scope.modalTitle = 'Approve';
		   $scope.modelContent = 'Do You Want To Approve?';
		}
	   if($scope.type=="decativateReject"){
		   $scope.userInformationDTO.actionType = "REJECTED";
		   $scope.modalTitle = 'Reject';
		   $scope.modelContent = 'Do You Want To Reject?';
		}
	   if($scope.type == "rejectqueue"){
		$scope.userInformationDTO.actionType = "REJECTED";
		$scope.modalTitle = 'Reject Queue';
		$scope.modelContent = 'Do You Want To Reject The Queue?';
		}
	   $scope.showMsg = false;
	   $scope.reason = "";
	   //$scope.queueDto.userInformationDTO = $scope.userInformationDTO;
	   $ngConfirm({
			title: $scope.modalTitle,
			theme: 'Material',
			//icon: 'fa fa-unlock',
			 content: '<div class="form-group"><textarea ng-change="showMsg = false" ng-model="reason" class="form-control" placeholder="Notes"></textarea><div class="text-danger" ng-if="showMsg"><small>This is a required field</small></div></div>',
			scope: $scope,
			buttons: {
				Ok: {
					text: 'Confirm',
					btnClass: 'btn-red',
					action: function(scope, button){                    	
						$scope.userInformationDTO.notes = $scope.reason;
						$scope.queueDto.userInformationDTO = $scope.userInformationDTO;
						
                             if($scope.alertReason == ""){
                                 $scope.reason = "";
                                 $scope.showMsg = true;
                                 return false;
                             }else{

                            
						QueueService.header($scope.response.token).manageQueue({queueCode:null},$scope.queueDto, function(data) {
							   
					           $scope.thisSession = data;
					           if($scope.myselectedOrgid ==''){
					        	   $scope.myselectedOrgid = $scope.loggedInOrgID;
					           }
					           QueueService.header($scope.response.token).viewQueue({orgId:$scope.myselectedOrgid,queueActionType:$scope.queueActionType}, function(data) {
					           	$scope.viewQueueData = [];                    
					              
					               if(typeof data.response.data != "undefined"){
					               	 $scope.viewQueueData = data.response.data; 
					               	 if($scope.type == 'deactivete'){
					               		toastr.success("Deactivation Request Submitted Successfully", Msg.hurrah);
					               	 }
					               	if($scope.type == 'reactive'){
					               		toastr.success("Reactivation Request Submitted Successfully", Msg.hurrah);
					               	 }
					               	
					               }
								   var config={ "userInformationDTO": { "userId": userId, "orgId": orgId } }
								   QueueService.header($scope.response.token).refreshQueue({selectedOrgId:null},config, function(data) {


								   },function(err){

								   });

					        
					           },function(err){
					           	$scope.viewQueueData = [];
					               $scope.totalItems = 0;
					           });
					           
					       },function(err){
					    	   //toastr.error("Changes Made UnSuccessful", Msg.hurrah);
					       });
					}
				  }
				},
				Cancel : {
                    text : 'Cancel',
                    action : function(scope,button) {
                    	$scope.queueDto = {};
                        $scope.userInformationDTO = {};
                        $scope.reason = "";
                        $scope.showMsg = false;

                    }

                }
			}
		});
   }
   

   $scope.sort = function(keyname){
       $scope.sortKey = keyname;   //set the sortKey to the param passed
       $scope.reverse = !$scope.reverse; //if true make it false and vice versa
       if(keyname == 'queueCode'){
    	   $scope.queueCodeSort = !$scope.queueCodeSort;
       }
       if(keyname == 'queueName'){
    	   $scope.queueNameSort = !$scope.queueNameSort;
       }
       if(keyname == 'orgId'){
    	   $scope.createdDateSort = !$scope.createdDateSort;
       }
       if(keyname == 'updatedDate'){
    	   $scope.updatedDateSort = !$scope.updatedDateSort;
       }
       if(keyname == 'channelDesc'){
    	   $scope.channelSort = !$scope.channelSort;
       }
   }
  
    
    $scope.init = function(){
    	$scope.myCases = [];
    	if(localStorage.getItem("prev_path_Queue_view") == 'createEditQueue'){
    		$scope.selectedOrgid = localStorage.getItem("Queue_OrgId");
    		$scope.myselectedOrgid = localStorage.getItem("Queue_OrgId");
    		$scope.queueActionType = localStorage.getItem("Queue_Selected_Status");
    		$scope.orgId = localStorage.getItem("Queue_OrgId");
    		$scope.queueActionType = localStorage.getItem("Queue_Selected_Status");
    	}else{
    	$scope.orgId = commonDataService.getLocalStorage().orgId;
    	}
    	$scope.updatedByOrgId = commonDataService.getLocalStorage().orgId;
    	$scope.userId = commonDataService.getSessionStorage().userId
    	$scope.storeSelectedOrgid = $scope.orgId;
    	$scope.storeSelectedStatus = $scope.queueActionType;
    	var version = 1;
    	var status = "ACTIVE"
    	
    	QueueService.header($scope.response.token).viewQueue({orgId:$scope.orgId,queueActionType:$scope.queueActionType}, function(data) {
        	$scope.viewQueueData = [];                    
           
            if(typeof data.response.data != "undefined"){
            	 $scope.viewQueueData = data.response.data; 
            	 $scope.totalItems = $scope.viewQueueData.length;
            }
           
            
           
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
    
    $scope.removeDoller = function(condition){
    	var mystring = condition;
    	var afterRemovingDoller =  mystring.replace(/[^a-z><!A-Z=0-9,.*#() +&@!%]/g, '');
    	if(afterRemovingDoller.includes('finalRiskScore')){
    		var changeScore = afterRemovingDoller.replace('finalRiskScore', 'Model Score');
    		return changeScore;
    	
    	}else{
    	/*var finalTxt = afterRemovingRole.replace(/_/g," ");*/
    	return afterRemovingDoller;
    	}
    }
   
    $scope.isSessionValid = function(){
		UserService.header({}).session({}, function(data){
		}, function(err){});
	}
    
    $scope.organisationName  = function(){
    	casesManagement.header().organisations( 
				{ 
					
					organisationID : orgId
				},
				function(response) {
	                         $scope.orgarnisations = response.response;
	                        // var myArray  = $scope.orgarnisations.filter((x)=>(x.orgId == $scope.orgId))
		                     //   $scope.selectedOrgid = myArray[0];
	                        // console.log($scope.selectedOrgid)

					},
				function(err) {
				});
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
    
   /* $scope.organisationName  = function(){
    	casesManagement.header().organisations( 
				{ 
					
					organisationID : orgId
				},
				function(response) {
	                         $scope.orgarnisations = response.response;

					},
				function(err) {
				});
    }*/
    
    
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
    	
    	$scope.changeStatus = function(selectedStatus){
    		
        	$scope.storeSelectedStatus = selectedStatus;
        	if( $scope.myselectedOrgid == '' || typeof $scope.myselectedOrgid == "undefined"){
        		$scope.showErrMsg = true;
        	}else{
        		
        		$scope.showErrMsg = false;
    	    	QueueService.header($scope.response.token).viewQueue({orgId:$scope.myselectedOrgid,queueActionType:selectedStatus}, function(data) {
    	        	$scope.viewQueueData = [];                    
    	           
    	            if(typeof data.response.data != "undefined"){
    	            	 $scope.viewQueueData = data.response.data; 
    	            	 $scope.totalItems = $scope.viewQueueData.length;
    	            }
    	           
    	            
    	           
    	        },function(err){
    	        	$scope.viewQueueData = [];
    	            $scope.totalItems = 0;
    	        });
        	}
        }
    
    $scope.changeOrgaisation = function(selectedOrgid){
    	
    	if(selectedOrgid == undefined){
    		$scope.showErrMsg = true;
    	}else{
    		$scope.myselectedOrgid = selectedOrgid;
    		$scope.storeSelectedOrgid = selectedOrgid;
    		$scope.showErrMsg = false;
	    	QueueService.header($scope.response.token).viewQueue({orgId:selectedOrgid,queueActionType:$scope.queueActionType}, function(data) {
	        	$scope.viewQueueData = [];                    
	           
	            if(typeof data.response.data != "undefined"){
	            	 $scope.viewQueueData = data.response.data; 
	            	 $scope.totalItems = $scope.viewQueueData.length;
	            }
	           
	            
	           
	        },function(err){
	        	$scope.viewQueueData = [];
	            $scope.totalItems = 0;
	        });
    	}
    }
    $scope.init();
}])
