'use strict';
angular.module('efrm.dashboard')
    .controller('unassignedQueueController',  ['$scope','$rootScope','$state', '$timeout', 'toastr','statusService', 'UserService','AdminService','QueueService','casesManagement','casesManagement2', '$ngConfirm', 'RolePermissionMatrix','Util', 'Session', 'Msg', 'DataService','Validation','commonDataService',
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
            $scope.loggedInUserId = commonDataService.getSessionStorage().userId;
            $scope.channelSort = true;
            $scope.queueDto = {};
            $scope.type = '';
            $scope.modalTitle = '';
            $scope.modelContent = '';
            $scope.userInformationDTO = {};
            $scope.queueCodeSort = true;
            $scope.queueNameSort = true;
            $scope.orgIdSort = true;
            $scope.expireTimeSort = true;
            $scope.escalateTimeSort = true;
            $scope.showErrMsg = false;
            $scope.myrequiredmsg = false;
            $scope.queueActionType = "ACTIVE"
            $scope.isAssignSelected = true;
            $scope.queuePrespective = [];
            $scope.aqurierUserList = []; 
        	$scope.issuerUserList = []; 
        	$scope.amlUserList = []; 
        	$scope.someObject = {};
    		$scope.someObject.selectedPerson = [];
    		$scope.someObject.issuerSelectedPersion = [];
    		$scope.someObject.acquierSelectedPersion = [];
    		$scope.someObject.amlSelectedPersion = [];
    		$scope.selectedAmlusers = [];
    		$scope.selectedIssuerusers = [];
    		$scope.selectedAcquirerusers = [];
    		 $scope.assignQueue = {};
    		 $scope.data = [];
    		 //$scope.selectedPage = "5";
    		 //changes made
    		 $scope.selectedPage = "50";
            var orgId = commonDataService.getLocalStorage().orgId;
            
            $scope.loggedInOrgID = "";
            $scope.loggedInOrgID = commonDataService.getLocalStorage().orgId;
            $scope.loggedInOrgId = commonDataService.getLocalStorage().orgId;
            $scope.myselectedOrgid = $scope.loggedInOrgID;
            $scope.selectedOrgid =  $scope.loggedInOrgID;
            var userId = commonDataService.getSessionStorage().userId;
           
            $scope.getUserList = function(queueselectedOrgId){
        		
        		/*$scope.userList = [];
            	QueueService.header($scope.response.token).getUserList({loggedInOrgId:$scope.loggedInOrgId,selectedOrgId:queueselectedOrgId},function(data) {
                	$scope.userList = []; 
                	
                    if(data.response != undefined){
                    	
                    	 $scope.userList = data.response;
                    	 
                    }
                },function(err){
                	toastr.clear();
                	$scope.userList = [];
                });*/
            	
            	QueueService.header($scope.response.token).getAquirerUser({loggedInOrgId:$scope.loggedInOrgId,selectedOrgId:queueselectedOrgId},function(data) {
                	$scope.aqurierUserList = []; 
                	
                    if(data.response != undefined){
                    	
                    	 $scope.aqurierUserList = data.response;
                    	
                    }
                },function(err){
                	toastr.clear();
                	$scope.aqurierUserList = [];
                });
            	
            	QueueService.header($scope.response.token).getIssuerUser({loggedInOrgId:$scope.loggedInOrgId,selectedOrgId:queueselectedOrgId},function(data) {
                	$scope.issuerUserList = []; 
                	
                    if(data.response != undefined){
                    	
                    	 $scope.issuerUserList = data.response;
                    	 
                    }
                },function(err){
                	toastr.clear();
                	$scope.issuerUserList = [];
                });
            	
            	QueueService.header($scope.response.token).getAmlUser({loggedInOrgId:$scope.loggedInOrgId,selectedOrgId:queueselectedOrgId},function(data) {
                	$scope.amlUserList = []; 
                	
                    if(data.response != undefined){
                    	
                    	 $scope.amlUserList = data.response;
                    	 
                    }
                },function(err){
                	toastr.clear();
                	$scope.amlUserList = [];
                });
            	
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

            $scope.sort = function(keyname){
                $scope.sortKey = keyname;   //set the sortKey to the param passed
                $scope.reverse = !$scope.reverse; //if true make it false and vice versa
                if(keyname == 'queueCode'){
                    $scope.queueCodeSort = !$scope.queueCodeSort;
                }
                if(keyname == 'organizationName'){
                    $scope.orgIdSort = !$scope.orgIdSort;
                }
                if(keyname == 'queueName'){
                    $scope.queueNameSort = !$scope.queueNameSort;
                }
                if(keyname == 'createdDate'){
                    $scope.createdDateSort = !$scope.createdDateSort;
                }
                if(keyname == 'updatedDate'){
                    $scope.updatedDateSort = !$scope.updatedDateSort;
                }
                if(keyname == 'channel'){
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
                $scope.userId = commonDataService.getSessionStorage().userId;
                $scope.storeSelectedOrgid = $scope.orgId;
                $scope.storeSelectedStatus = $scope.queueActionType;
                var version = 1;
                var status = "ACTIVE"

                QueueService.header($scope.response.token).fetchAllApprovedUnassignedQueues({orgId:$scope.orgId,selectedOrgId:null}, function(data) {
                    $scope.viewQueueData = [];
                    if(typeof data.response != "undefined"){
                        //$scope.viewQueueData = data.response;
                    	$scope.viewQueueData = data.response.filter(function (el) {
	            			  if( el.channel == "RuPayAtm"){
	            				  return el.channel = "ATM";
	            			  }
	            			  if( el.channel == "RuPayPos"){
	            				  return el.channel = "POS and ECOM";
	            			  }
	            			  if( el.channel == "IMPS"){
	            				  return el.channel = "IMPS";
	            			  }
	            			  if( el.channel == "UPI"){
	            				  return el.channel = "UPI";
	            			  }
	            			  if( el.channel == "AEPS"){
	            				  return el.channel = "AEPS";
	            			  }
	            			  if( el.channel == "NETC"){
	            				  return el.channel = "NETC";
	            			  }
	            		});
                        $scope.totalItems = $scope.viewQueueData.length;
                    }



                },function(err){
                    $scope.viewQueueData = [];
                    $scope.totalItems = 0;
                });

            }
            
            $scope.selectedIssuerUser = function(data){
        		$scope.selectedIssuerusers = [];
        		$scope.selectedIssuerusers = data;
        		$scope.atleastoneacquirermsg = false;
        		  $scope.acquireramlmsg = false;
        		  $scope.issuerandamlmsg = false;
        		  $scope.issueracquireramlmsg = false;
        		  $scope.onlyissuermsg = false;
        		  $scope.onlyacquiermsg = false;
        		  $scope.onlyamlmsg = false;
        		  $scope.anyofmsg = false;
        		  $scope.myrequiredmsg = false;
        		  $scope.atleastoneissuerrmsg = false;
        		if($scope.selectedIssuerusers.length == 0 || data == undefined){
        			$scope.showMultiSelectMsg = true;
        		}else{
        			$scope.showMultiSelectMsg = false;
        		}
        	}
        	
        	$scope.selectedAmlUser = function(data){
        		$scope.selectedAmlusers = [];
        		$scope.selectedAmlusers = data;
        		$scope.atleastoneacquirermsg = false;
        		  $scope.acquireramlmsg = false;
        		  $scope.issuerandamlmsg = false;
        		  $scope.issueracquireramlmsg = false;
        		  $scope.onlyissuermsg = false;
        		  $scope.onlyacquiermsg = false;
        		  $scope.onlyamlmsg = false;
        		  $scope.myrequiredmsg = false;
        		  $scope.anyofmsg = false;
        		  $scope.atleastoneissuerrmsg = false;
        		if($scope.selectedAmlusers.length == 0 || data == undefined){
        			$scope.showMultiSelectMsg = true;
        		}else{
        			$scope.showMultiSelectMsg = false;
        		}
        	}
        	
        	$scope.selectedAcquierUser = function(data){
        		$scope.selectedAcquirerusers = [];
        		$scope.selectedAcquirerusers = data;
        		$scope.atleastoneacquirermsg = false;
        		  $scope.acquireramlmsg = false;
        		  $scope.issuerandamlmsg = false;
        		  $scope.issueracquireramlmsg = false;
        		  $scope.onlyissuermsg = false;
        		  $scope.onlyacquiermsg = false;
        		  $scope.myrequiredmsg = false;
        		  $scope.onlyamlmsg = false;
        		  $scope.anyofmsg = false;
        		  $scope.atleastoneissuerrmsg = false;
        		if($scope.selectedAcquirerusers.length == 0 || data == undefined){
        			$scope.showMultiSelectMsg = true;
        		}else{
        			$scope.showMultiSelectMsg = false;
        		}
        	}
        	
            $scope.setassignQueue = function(queue){
            	 if(queue.channel == "ATM"){
            		 queue.channel = "RuPayAtm"
            	   	}
            	   	if(queue.channel == "POS and ECOM"){
            	   		queue.channel = "RuPayPos"
            	   	}
		            	$scope.isAssignSelected = false;
		            	$scope.myassignQueue = [];
		            	$scope.myassignQueue.push(queue);
		              $scope.issueraccquirermsg = false;
		       		  $scope.atleastoneacquirermsg = false;
		       		  $scope.acquireramlmsg = false;
		       		  $scope.issuerandamlmsg = false;
		       		  $scope.issueracquireramlmsg = false;
		       		  $scope.onlyissuermsg = false;
		       		  $scope.onlyacquiermsg = false;
		       		  $scope.onlyamlmsg = false;
		       		  $scope.anyofmsg = false;
		       		  $scope.atleastoneissuerrmsg = false;
		       		  $scope.atleasetoneamlmsg = false;
		       		$scope.myselectedOrgId = queue.orgId;
		       		$scope.getUserList(queue.orgId);
		       		$scope.data.push(queue);
		       		
		       		QueueService.header($scope.response.token).getQueuePrespective({selectedOrgId:queue.orgId,channel:queue.channel,queueCode:queue.queueCode},function(data) {
		   	    	 
		  	    	  var myData = [];
		  	    	  myData = data.response.data;
		  	    	  var myObj = {};
		  	    	  myObj.queueCode = queue.queueCode;
		  	    	  myObj.isAquirerIsuuer = myData;
		  	    	  /*for(var i=0 ; i < myData.length; i++){
		  	    		  myObj.rule = []
		  	    		 myObj.rule = myData[i];
		  	    		  if(myData.length > 1){
		  	    			  myObj.isAquirerIsuuer = "both"  
		  	    		  }else{
		  	    			  myObj.isAquirerIsuuer =  myData[i];
		  	    		  }
		  	    		 
		  	    	  }*/
		  	    	  $scope.queuePrespective.push(myObj);
		  	    	  //$scope.queuePrespective.push()
		  	        },function(err){
		  	        	
		  	        });
       		 
            }
            
            $scope.assignQueueSubmit = function(){
      		  
      		  //$scope.assignQueue.userId = $scope.userId;
      		  $scope.assignQueue.users = [];
      		  $scope.assignQueue.listTaskQueue = [];
      		  //$scope.assignQueue.users = $scope.selectedusers;
      		  
      		  var myArray = [];
      		  myArray = $scope.queuePrespective.map((x)=>{return x.isAquirerIsuuer});
      		  var  myfinalArray = [];
      		  myfinalArray = Array.prototype.concat(...myArray)
      		  myfinalArray = [... new Set(myfinalArray)];
      		  $scope.issueraccquirermsg = false;
      		  $scope.atleastoneacquirermsg = false;
      		  $scope.acquireramlmsg = false;
      		  $scope.issuerandamlmsg = false;
      		  $scope.issueracquireramlmsg = false;
      		  $scope.onlyissuermsg = false;
      		  $scope.onlyacquiermsg = false;
      		  $scope.onlyamlmsg = false;
      		  $scope.anyofmsg = false;
      		  $scope.atleastoneissuerrmsg = false;
      		  $scope.atleasetoneamlmsg = false;
      			  var checkIssuerAcquirerAml = myfinalArray.toString();
      			  
      			  if(myfinalArray.length ==4 && myfinalArray.includes("I") && myfinalArray.includes("A") &&  myfinalArray.includes("N") &&  myfinalArray.includes("U")){
      				  if($scope.selectedIssuerusers.length == 0 || $scope.selectedAmlusers.length == 0 || $scope.selectedAcquirerusers.length == 0 ){
      					  $scope.issueraccquirermsg = false;
      					  $scope.atleastoneacquirermsg = false;
      					  $scope.atleastoneissuerrmsg = false;
      					  $scope.acquireramlmsg = false;
      					  $scope.issuerandamlmsg = false;
      					  $scope.issueracquireramlmsg = true;
      					  $scope.onlyissuermsg = false;
      					  $scope.onlyacquiermsg = false;
      					  $scope.onlyamlmsg = false;
      					  $scope.anyofmsg = false;
      					  $scope.atleasetoneamlmsg = false;
      				  }
      				  
      			  }
      			  
      			  if(myfinalArray.length ==3 && myfinalArray.includes("I") && myfinalArray.includes("A") &&  myfinalArray.includes("N")){
      				  if($scope.selectedIssuerusers.length == 0 || $scope.selectedAmlusers.length == 0 || $scope.selectedAcquirerusers.length == 0 ){
      					  $scope.issueraccquirermsg = false;
      					  $scope.atleastoneacquirermsg = false;
      					  $scope.atleastoneissuerrmsg = false;
      					  $scope.acquireramlmsg = false;
      					  $scope.issuerandamlmsg = false;
      					  $scope.issueracquireramlmsg = true;
      					  $scope.onlyissuermsg = false;
      					  $scope.onlyacquiermsg = false;
      					  $scope.onlyamlmsg = false;
      					  $scope.anyofmsg = false;
      					  $scope.atleasetoneamlmsg = false;
      				  }
      			  }
      			  
      			  if(myfinalArray.length ==3 && myfinalArray.includes("I") && myfinalArray.includes("A") &&  myfinalArray.includes("U")){
      				  if($scope.selectedIssuerusers.length == 0 || $scope.selectedAcquirerusers.length == 0 ){
      					  $scope.issueraccquirermsg = true;
      					  $scope.atleastoneacquirermsg = false;
      					  $scope.atleastoneissuerrmsg = false;
      					  $scope.acquireramlmsg = false;
      					  $scope.issuerandamlmsg = false;
      					  $scope.issueracquireramlmsg = false;
      					  $scope.onlyissuermsg = false;
      					  $scope.onlyacquiermsg = false;
      					  $scope.onlyamlmsg = false;
      					  $scope.anyofmsg = false;
      					  $scope.atleasetoneamlmsg = false;
      				  }
      			  }
      			  
      			  if(myfinalArray.length ==3 && myfinalArray.includes("A") && myfinalArray.includes("U") &&  myfinalArray.includes("N")){
      				  if($scope.selectedAmlusers.length == 0 || $scope.selectedAcquirerusers.length == 0 ){
      					  $scope.issueraccquirermsg = false;
      					  $scope.atleastoneacquirermsg = false;
      					  $scope.atleastoneissuerrmsg = false;
      					  $scope.acquireramlmsg = true;
      					  $scope.issuerandamlmsg = false;
      					  $scope.issueracquireramlmsg = false;
      					  $scope.onlyissuermsg = false;
      					  $scope.onlyacquiermsg = false;
      					  $scope.onlyamlmsg = false;
      					  $scope.anyofmsg = false;
      					  $scope.atleasetoneamlmsg = false;
      				  }
      			  }
      			  
      			  if(myfinalArray.length ==2 && myfinalArray.includes("I") && myfinalArray.includes("A")){
      				  if($scope.selectedIssuerusers.length == 0 || $scope.selectedAcquirerusers.length == 0 ){
      					  $scope.issueraccquirermsg = true;
      					  $scope.atleastoneacquirermsg = false;
      					  $scope.atleastoneissuerrmsg = false;
      					  $scope.acquireramlmsg = false;
      					  $scope.issuerandamlmsg = false;
      					  $scope.issueracquireramlmsg = false;
      					  $scope.onlyissuermsg = false;
      					  $scope.onlyacquiermsg = false;
      					  $scope.onlyamlmsg = false;
      					  $scope.anyofmsg = false;
      					  $scope.atleasetoneamlmsg = false;
      				  }
      			  }
      			  
      			  if(myfinalArray.length ==2 && myfinalArray.includes("I") && myfinalArray.includes("U")){
      				  if($scope.selectedIssuerusers.length == 0 ){
      					  $scope.issueraccquirermsg = false;
      					  $scope.atleastoneacquirermsg = false;
      					  $scope.atleastoneissuerrmsg = true;
      					  $scope.acquireramlmsg = false;
      					  $scope.issuerandamlmsg = false;
      					  $scope.issueracquireramlmsg = false;
      					  $scope.onlyissuermsg = false;
      					  $scope.onlyacquiermsg = false;
      					  $scope.onlyamlmsg = false;
      					  $scope.anyofmsg = false;
      					  $scope.atleasetoneamlmsg = false;
      				  }
      			  }
      			  
      			  if(myfinalArray.length ==2 && myfinalArray.includes("I") && myfinalArray.includes("N")){
      				  if($scope.selectedIssuerusers.length == 0 || $scope.selectedAmlusers.length == 0){
      					  $scope.issueraccquirermsg = false;
      					  $scope.atleastoneacquirermsg = false;
      					  $scope.atleastoneissuerrmsg = false;
      					  $scope.acquireramlmsg = false;
      					  $scope.issuerandamlmsg = true;
      					  $scope.issueracquireramlmsg = false;
      					  $scope.onlyissuermsg = false;
      					  $scope.onlyacquiermsg = false;
      					  $scope.onlyamlmsg = false;
      					  $scope.anyofmsg = false;
      					  $scope.atleasetoneamlmsg = false;
      				  }
      			  }
      			  
      			  if(myfinalArray.length ==2 && myfinalArray.includes("A") && myfinalArray.includes("N")){
      				  if($scope.selectedAcquirerusers.length == 0 || $scope.selectedAmlusers.length == 0){
      					  $scope.issueraccquirermsg = false;
      					  $scope.atleastoneacquirermsg = false;
      					  $scope.atleastoneissuerrmsg = false;
      					  $scope.acquireramlmsg = true;
      					  $scope.issuerandamlmsg = false;
      					  $scope.issueracquireramlmsg = false;
      					  $scope.onlyissuermsg = false;
      					  $scope.onlyacquiermsg = false;
      					  $scope.onlyamlmsg = false;
      					  $scope.anyofmsg = false;
      					  $scope.atleasetoneamlmsg = false;
      				  }
      			  }
      			  
      			  if(myfinalArray.length ==2 && myfinalArray.includes("A") && myfinalArray.includes("U")){
      				  if($scope.selectedAcquirerusers.length == 0){
      					  $scope.issueraccquirermsg = false;
      					  $scope.atleastoneacquirermsg = true;
      					  $scope.atleastoneissuerrmsg = false;
      					  $scope.acquireramlmsg = false;
      					  $scope.issuerandamlmsg = false;
      					  $scope.issueracquireramlmsg = false;
      					  $scope.onlyissuermsg = false;
      					  $scope.onlyacquiermsg = false;
      					  $scope.onlyamlmsg = false;
      					  $scope.anyofmsg = false;
      					  $scope.atleasetoneamlmsg = false;
      				  }
      			  }
      			  
      			  if(myfinalArray.length ==2 && myfinalArray.includes("N") && myfinalArray.includes("U")){
      				  if($scope.selectedAmlusers.length == 0){
      					  $scope.issueraccquirermsg = false;
      					  $scope.atleasetoneamlmsg = true;
      					  $scope.atleastoneacquirermsg = false;
      					  $scope.atleastoneissuerrmsg = false;
      					  $scope.acquireramlmsg = false;
      					  $scope.issuerandamlmsg = false;
      					  $scope.issueracquireramlmsg = false;
      					  $scope.onlyissuermsg = false;
      					  $scope.onlyacquiermsg = false;
      					  $scope.onlyamlmsg = false;
      					  $scope.anyofmsg = false;
      				  }
      			  }
      			  
      				  if(myfinalArray.length ==1 && myfinalArray.includes("I")){
      					  if($scope.selectedIssuerusers.length != 0 && $scope.selectedAcquirerusers.length == 0 && $scope.selectedAmlusers.length == 0){
      						  $scope.issueraccquirermsg = false;
      						  $scope.atleastoneacquirermsg = false;
      						  $scope.acquireramlmsg = false;
      						  $scope.issuerandamlmsg = false;
      						  $scope.issueracquireramlmsg = false;
      						  $scope.onlyissuermsg = false;
      						  $scope.onlyacquiermsg = false;
      						  $scope.onlyamlmsg = false;
      						  $scope.anyofmsg = false;
      						  $scope.atleastoneissuerrmsg = false;
      						  $scope.atleasetoneamlmsg = false;
      					  }else{
      						  $scope.issueraccquirermsg = false;
      						  $scope.atleastoneacquirermsg = false;
      						  $scope.acquireramlmsg = false;
      						  $scope.issuerandamlmsg = false;
      						  $scope.issueracquireramlmsg = false;
      						  $scope.onlyissuermsg = true;
      						  $scope.onlyacquiermsg = false;
      						  $scope.onlyamlmsg = false;
      						  $scope.anyofmsg = false;
      						  $scope.atleastoneissuerrmsg = false;
      						  $scope.atleasetoneamlmsg = false;
      					  }
      					  
      				  }
      				  if(myfinalArray.length ==1 && myfinalArray.includes("A")){
      					  if($scope.selectedIssuerusers.length == 0 && $scope.selectedAcquirerusers.length != 0 && $scope.selectedAmlusers.length == 0){
      						  $scope.issueraccquirermsg = false;
      						  $scope.atleastoneacquirermsg = false;
      						  $scope.acquireramlmsg = false;
      						  $scope.issuerandamlmsg = false;
      						  $scope.issueracquireramlmsg = false;
      						  $scope.onlyissuermsg = false;
      						  $scope.onlyacquiermsg = false;
      						  $scope.onlyamlmsg = false;
      						  $scope.anyofmsg = false;
      						  $scope.atleastoneissuerrmsg = false;
      						  $scope.atleasetoneamlmsg = false;
      					  }else{
      						  $scope.issueraccquirermsg = false;
      						  $scope.atleastoneacquirermsg = false;
      						  $scope.acquireramlmsg = false;
      						  $scope.issuerandamlmsg = false;
      						  $scope.issueracquireramlmsg = false;
      						  $scope.onlyissuermsg = false;
      						  $scope.onlyacquiermsg = true;
      						  $scope.onlyamlmsg = false;
      						  $scope.anyofmsg = false;
      						  $scope.atleastoneissuerrmsg = false;
      						  $scope.atleasetoneamlmsg = false;
      					  }
      					  
      				  }
      				  if(myfinalArray.length ==1 && myfinalArray.includes("N")){
      					  if($scope.selectedIssuerusers.length == 0 && $scope.selectedAcquirerusers.length == 0 && $scope.selectedAmlusers.length != 0){
      						  $scope.issueraccquirermsg = false;
      						  $scope.atleastoneacquirermsg = false;
      						  $scope.acquireramlmsg = false;
      						  $scope.issuerandamlmsg = false;
      						  $scope.issueracquireramlmsg = false;
      						  $scope.onlyissuermsg = false;
      						  $scope.onlyacquiermsg = false;
      						  $scope.onlyamlmsg = false;
      						  $scope.anyofmsg = false;
      						  $scope.atleastoneissuerrmsg = false;
      						  $scope.atleasetoneamlmsg = false;
      					  }else{
      						  $scope.issueraccquirermsg = false;
      						  $scope.atleastoneacquirermsg = false;
      						  $scope.acquireramlmsg = false;
      						  $scope.issuerandamlmsg = false;
      						  $scope.issueracquireramlmsg = false;
      						  $scope.onlyissuermsg = false;
      						  $scope.onlyacquiermsg = false;
      						  $scope.onlyamlmsg = true;
      						  $scope.anyofmsg = false;
      						  $scope.atleastoneissuerrmsg = false;
      						  $scope.atleasetoneamlmsg = false;
      					  }
      					  
      				  }
      				  if(myfinalArray.length ==1 && myfinalArray.includes("U")){
      					  if($scope.selectedIssuerusers.length != 0 || $scope.selectedAcquirerusers.length != 0 || $scope.selectedAmlusers.length != 0){
      						  $scope.issueraccquirermsg = false;
      						  $scope.atleastoneacquirermsg = false;
      						  $scope.acquireramlmsg = false;
      						  $scope.issuerandamlmsg = false;
      						  $scope.issueracquireramlmsg = false;
      						  $scope.onlyissuermsg = false;
      						  $scope.onlyacquiermsg = false;
      						  $scope.onlyamlmsg = false;
      						  $scope.anyofmsg = false;
      						  $scope.atleastoneissuerrmsg = false;
      						  $scope.atleasetoneamlmsg = false;
      					  }else{
      						  $scope.issueraccquirermsg = false;
      						  $scope.atleastoneacquirermsg = false;
      						  $scope.acquireramlmsg = false;
      						  $scope.issuerandamlmsg = false;
      						  $scope.issueracquireramlmsg = false;
      						  $scope.onlyissuermsg = false;
      						  $scope.onlyacquiermsg = false;
      						  $scope.onlyamlmsg = false;
      						  $scope.anyofmsg = true;
      						  $scope.atleastoneissuerrmsg = false;
      						  $scope.atleasetoneamlmsg = false;
      					  }
      					  
      				  }
      				  
      		  
      		  $scope.assignQueue.users = Array.prototype.concat($scope.selectedAmlusers, $scope.selectedIssuerusers, $scope.selectedAcquirerusers);
      		$scope.assignQueue.users = JSON.parse(angular.toJson( $scope.assignQueue.users));
      		  //$scope.assignQueue.listTaskQueue = $scope.data;
      		$scope.assignQueue.listTaskQueue = JSON.parse(angular.toJson($scope.data));
      		  $scope.assignQueue.orgId = $scope.myselectedOrgId;
      		  $scope.assignQueue.assignedBy = userId;
      		  $scope.assignQueue.updateddBy = userId;
      		  $scope.assignQueue.actionType = 1;
      		 
      		if($scope.assignQueue.users.length == 0){
  			  $scope.myrequiredmsg = true;
  		  }
  		  if($scope.assignQueue.users.length != 0){
  			  $scope.myrequiredmsg = false;
  		  }
      		 
      		 
      		if(!$scope.issueraccquirermsg && !$scope.atleastoneacquirermsg && !$scope.acquireramlmsg && !$scope.atleasetoneamlmsg && !$scope.issuerandamlmsg && !$scope.issueracquireramlmsg && !$scope.onlyissuermsg
      				&&  !$scope.onlyacquiermsg && !$scope.onlyamlmsg && !$scope.anyofmsg && !$scope.atleastoneissuerrmsg && !$scope.atleasetoneamlmsg && !$scope.myrequiredmsg)  
      			QueueService.header($scope.response.token).saveQueue($scope.assignQueue,function(data) {
      			  	$scope.thisSession = data;
      			  	$scope.selectedusers = [];
      			  	$scope.selectedAmlusers = [];
      				$scope.selectedIssuerusers = [];
      				$scope.selectedAcquirerusers = [];
      			  	$scope.someObject.selectedPerson = [];
      			  	$scope.someObject.issuerSelectedPersion = [];
      			  	$scope.someObject.acquierSelectedPersion = [];
      			  	$scope.someObject.amlSelectedPersion = [];
      			  	$scope.data = [];
      			  	 $scope.issueraccquirermsg = false;
      				  $scope.atleastoneacquirermsg = false;
      				  $scope.acquireramlmsg = false;
      				  $scope.issuerandamlmsg = false;
      				  $scope.issueracquireramlmsg = false;
      				  $scope.onlyissuermsg = false;
      				  $scope.onlyacquiermsg = false;
      				  $scope.onlyamlmsg = false;
      				  $scope.anyofmsg = false;
      				  $scope.atleastoneissuerrmsg = false;
      				  $scope.atleasetoneamlmsg = false;
      				
      				QueueService.header($scope.response.token).fetchAllApprovedUnassignedQueues({orgId:$scope.orgId,selectedOrgId:null}, function(data) {
                        $scope.viewQueueData = [];
                        if(typeof data.response != "undefined"){
                          //  $scope.viewQueueData = data.response;
                        	$scope.viewQueueData = data.response.filter(function (el) {
  	            			  if( el.channel == "RuPayAtm"){
  	            				  return el.channel = "ATM";
  	            			  }
  	            			  if( el.channel == "RuPayPos"){
  	            				  return el.channel = "POS and ECOM";
  	            			  }
  	            			  if( el.channel == "IMPS"){
  	            				  return el.channel = "IMPS";
  	            			  }
  	            			  if( el.channel == "UPI"){
  	            				  return el.channel = "UPI";
  	            			  }
  	            			if( el.channel == "AEPS"){
	            				  return el.channel = "AEPS";
	            			  }
  	            			if( el.channel == "NETC"){
	            				  return el.channel = "NETC";
	            			  }
                        	})
                            $scope.totalItems = $scope.viewQueueData.length;
                            $scope.isAssignSelected = true;
                        }
                    },function(err){
                        $scope.viewQueueData = [];
                        $scope.totalItems = 0;
                    });
      	        	toastr.success("User Assignment Request For The Selected Queue Submitted Successfully", Msg.hurrah);
      	        },function(err){
      	        	$scope.assignQueue.listTaskQueue = [];
      	        });
      		  
      	  }
            
            $scope.back = function(){
            	$scope.isAssignSelected = true;
            	$scope.selectedusers = [];
  			  	$scope.selectedAmlusers = [];
  				$scope.selectedIssuerusers = [];
  				$scope.selectedAcquirerusers = [];
  			  	$scope.someObject.selectedPerson = [];
  			  	$scope.someObject.issuerSelectedPersion = [];
  			  	$scope.someObject.acquierSelectedPersion = [];
  			  	$scope.someObject.amlSelectedPersion = [];
  			  $scope.assignQueue.listTaskQueue = [];
  			  	$scope.data = [];
  			  	 $scope.issueraccquirermsg = false;
  				  $scope.atleastoneacquirermsg = false;
  				  $scope.acquireramlmsg = false;
  				  $scope.issuerandamlmsg = false;
  				  $scope.issueracquireramlmsg = false;
  				  $scope.onlyissuermsg = false;
  				  $scope.onlyacquiermsg = false;
  				  $scope.onlyamlmsg = false;
  				  $scope.anyofmsg = false;
  				  $scope.atleastoneissuerrmsg = false;
  				  $scope.atleasetoneamlmsg = false;
            }
            
            $scope.isSessionValid = function(){
                UserService.header({}).session({}, function(data){
                }, function(err){});
            }
            $scope.init();
        }])
