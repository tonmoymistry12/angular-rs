'use strict';
angular.module('efrm.dashboard')
.controller('assignQueueController', ['$scope', '$rootScope', 'toastr','$timeout', '$state', '$stateParams', 'statusService', 'UserService','casesManagement','casesManagement2','AdminService','QueueService', 'Msg','Validation','commonDataService',
	function($scope, $rootScope, toastr, $timeout, $state, $stateParams, statusService, UserService,casesManagement,casesManagement2, AdminService,QueueService, Msg, Validation, commonDataService){
	$scope.channel_code = []
	/*$scope.init = function(){
	    	$(function () {
	    		setTimeout(function(){ $('#contact').val($('#contact').val()).trigger('change');}, 10);
	    	});
	    	
	    };*/
		//$scope.assignQ=true;
		var orgId = commonDataService.getLocalStorage().orgId;
		var userId = commonDataService.getSessionStorage().userId;
	$scope.response = statusService.getResponseMessage();	
	$rootScope.welcomeName = $scope.response.usersAuthoritiesPermissionsDto.firstName;
	$scope.assignQueue = {};
	$scope.removeAssignQueue = {};
	$scope.removeFinalusers = [];
	$scope.selectedusers = [];
	$scope.selectedAmlusers = [];
	$scope.selectedIssuerusers = [];
	$scope.selectedAcquirerusers = [];
	$scope.data =[];
	$scope.userId = "";
	$scope.assignQueue.listTaskQueue = [];
	$scope.removeAssignQueue.listTaskQueue = [];
	$scope.orgId = commonDataService.getLocalStorage().orgId;
	$scope.loggedInOrgId = commonDataService.getLocalStorage().orgId;
	$scope.someObject = {};
	$scope.userList = [];
	$scope.aqurierUserList = []; 
	$scope.issuerUserList = []; 
	$scope.queueList = [];
	$scope.viewQueueData = [];
	$scope.queuePrespective = [];
	$scope.amlUserList = []; 
	$scope.updatedUsers='';
	$scope.queueUsers=[];
	$scope.showField = false;
	$scope.show=false;
	$scope.organisationDisabled = false;
	$scope.viewQ = true;
	$scope.queueListShow = false;
	$scope.myrequiredmsg = false;
	$scope.changeOrgChannel = '';

	$scope.showChannel = false;

	var finalusers=[];
	var finalUserArray=[];
		$scope.changeTab=function(queue){
			$scope.selectedTab=queue;

			$scope.showChannel = false;
			$scope.selectedChannel = '';
			$scope.channel = '';
			$scope.changeOrgChannel = '';
			$scope.queueListShow = false;
			$scope.showField = false;
			$scope.show=false;
		if(queue=='assignQ'){
			$scope.assignQ=true
			$scope.viewQ=false;
			 if($scope.loggedInOrgId =="NPCI"){
				 $scope.selectedOrgId='';
				 $scope.organisationDisabled = false;
			 }
			 if($scope.loggedInOrgId !="NPCI"){
				 $scope.changeOrganization($scope.loggedInOrgId)
				 $scope.organisationDisabled = true;
			 }
		}else if(queue=='unAssignQ'){
			$scope.assignQ=false;
			$scope.viewQ=false;
			
			 if($scope.loggedInOrgId =="NPCI"){
				 $scope.selectedOrgId='';
				 $scope.organisationDisabled = false;
			 }
			 if($scope.loggedInOrgId !="NPCI"){
				 $scope.changeOrganization($scope.loggedInOrgId)
				 $scope.organisationDisabled = true;
			 }
		}else if(queue){
			$scope.viewQ=true;
			 if($scope.loggedInOrgId =="NPCI"){
				 $scope.selectedOrgId='';
				 $scope.organisationDisabled = false;
			 }
			 if($scope.loggedInOrgId !="NPCI"){
				 //$scope.changeOrganization($scope.loggedInOrgId)
				 $scope.changedValue($scope.loggedInOrgId,'channel')
				 $scope.organisationDisabled = true;
				 
			 }
		}
			
			/* if($scope.loggedInOrgId =="NPCI"){
				 $scope.selectedOrgId='';
				 $scope.organisationDisabled = false;
			 }
			 if($scope.loggedInOrgId !="NPCI"){
				 $scope.changeOrganization($scope.loggedInOrgId)
				 $scope.changedValue($scope.loggedInOrgId,'channel')
				 $scope.organisationDisabled = true;
				 
			 }*/
		}
	
	
	$scope.changeOrganization = function(changeselectedOrgId){
		$scope.showChannel = true;
		$scope.selectedOrgId = changeselectedOrgId;
		 if(changeselectedOrgId != null && changeselectedOrgId != '' && typeof changeselectedOrgId != 'undefined' && $scope.changeOrgChannel != null && $scope.changeOrgChannel != '' && typeof $scope.changeOrgChannel != 'undefined'){
			 $scope.changedValue(changeselectedOrgId,$scope.changeOrgChannel)
		 }
		
	}
	
	$scope.changedValue = function(selectedOrgId,channel){
		$scope.selectedOrgId = selectedOrgId; 
		$scope.changeOrgChannel = channel;
		$scope.selectedUSer = null;
		$scope.assignSelectedChannel = null;
	  if(selectedOrgId == null || selectedOrgId == '' || typeof selectedOrgId == 'undefined' || channel == null || channel == '' || typeof channel == 'undefined'){

		  $scope.showField = false;
		 
	  }else{
		if($scope.loggedInOrgId !="NPCI"){
			$scope.selectedOrgId = $scope.loggedInOrgId;
		}
		$scope.myChannel = channel;
		$scope.selectedOrgId = selectedOrgId;
		$scope.showField = true;
		$scope.show=true;
		$scope.queueUsers=[];
		$scope.selectedqueue='';
		$scope.selectedChannel='';
		$scope.viewQueueData = [];
		$scope.queueListShow = false;
		finalusers=[];
		$scope.someObject.selectedPerson = [];
		$scope.someObject.issuerSelectedPersion = [];
		$scope.someObject.acquierSelectedPersion = [];
		$scope.someObject.amlSelectedPersion = [];
		
		if($scope.selectedTab=='assignQ'){
			$scope.getUserList();
		}
		
		if($scope.selectedTab!='assignQ' && $scope.selectedTab !='unAssignQ'){
			$scope.selectedViewUser = '';
			$scope.getUserList();

			$scope.channel_code = [];
			$scope.selectedChannel = '';
		 casesManagement2.header($scope.response.token).channel( {},
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
		if($scope.selectedTab=='unAssignQ' || $scope.selectedTab =='assignQ'){
		$scope.getQueueList();
		}
		
	  }
	}
	
	$scope.fetchValueUserID = function(userForfetch){
		
		if(typeof userForfetch == "undefined" || userForfetch == '' || userForfetch == null){
			$scope.showChannel = false;
		}else{
			$scope.showChannel = true;
		}
		$scope.selectedUSer = userForfetch;
		$scope.selectedChannel='';
		$scope.viewQueueData = [];
		$scope.queueListShow = false;
		if($scope.selectedUSer != '' && $scope.selectedUSer != null  && typeof $scope.selectedUSer != 'undefined' && $scope.assignSelectedChannel != '' && $scope.assignSelectedChannel != null  && typeof $scope.assignSelectedChannel != 'undefined'){
			QueueService.header($scope.response.token).assignQueue({email:$scope.selectedUSer,selectedOrgId:$scope.selectedOrgId,channel:$scope.assignSelectedChannel},function(data) {
				
				$scope.viewQueueData = data.response.data;
				$scope.queueListShow = true
	        },function(err){
	        	$scope.viewQueueData = []
	        });
			
			}
		
		$scope.channel_code = [];
		 casesManagement2.header($scope.response.token).channel( {},
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
	
	$scope.fetchValueUserIdchannel = function(userForfetch){
		$scope.viewQueueData = [];

		$scope.assignSelectedChannel = userForfetch;
		if($scope.selectedUSer != '' && $scope.selectedUSer != null  && typeof $scope.selectedUSer != 'undefined' && userForfetch != '' && userForfetch != null  && typeof userForfetch != 'undefined'){

		QueueService.header($scope.response.token).assignQueue({email:$scope.selectedUSer,selectedOrgId:$scope.selectedOrgId,channel:userForfetch},function(data) {
			
			$scope.viewQueueData = data.response.data;
			$scope.queueListShow = true
        },function(err){
        	$scope.viewQueueData = []
        });
		
		}
	}
	
	$scope.getUserList = function(){
		
		$scope.userList = [];
    	QueueService.header($scope.response.token).getUserList({loggedInOrgId:$scope.loggedInOrgId,selectedOrgId:$scope.selectedOrgId},function(data) {
        	$scope.userList = []; 
        	
            if(data.response != undefined){
            	
            	 $scope.userList = data.response;
            	 
            }
        },function(err){
        	toastr.clear();
        	$scope.userList = [];
        });
    	if($scope.assignQ == true && $scope.viewQ == false){
    	QueueService.header($scope.response.token).getAquirerUser({loggedInOrgId:$scope.loggedInOrgId,selectedOrgId:$scope.selectedOrgId},function(data) {
        	$scope.aqurierUserList = []; 
        	
            if(data.response != undefined){
            	
            	 $scope.aqurierUserList = data.response;
            	
            }
        },function(err){
        	toastr.clear();
        	$scope.aqurierUserList = [];
        });
    	
    	QueueService.header($scope.response.token).getIssuerUser({loggedInOrgId:$scope.loggedInOrgId,selectedOrgId:$scope.selectedOrgId},function(data) {
        	$scope.issuerUserList = []; 
        	
            if(data.response != undefined){
            	
            	 $scope.issuerUserList = data.response;
            	 
            }
        },function(err){
        	toastr.clear();
        	$scope.issuerUserList = [];
        });
    	
    	QueueService.header($scope.response.token).getAmlUser({loggedInOrgId:$scope.loggedInOrgId,selectedOrgId:$scope.selectedOrgId},function(data) {
        	$scope.amlUserList = []; 
        	
            if(data.response != undefined){
            	
            	 $scope.amlUserList = data.response;
            	 
            }
        },function(err){
        	toastr.clear();
        	$scope.amlUserList = [];
        });
    	}
	}
	
	 $scope.organisationName  = function(){
	    	casesManagement.header().organisations( 
					{ 
						
						organisationID : $scope.orgId
					},
					function(response) {
		                         $scope.orgarnisations = response.response;

						},
					function(err) {
					});
	    }
	 
	$scope.getQueueList = function(){
		
		$scope.queueList = [];
		QueueService.header($scope.response.token).queueList({selectedOrgId:$scope.selectedOrgId,channel:$scope.myChannel},function(data) {
        	$scope.queueList = []; 
        	$scope.getqueueList = data.response.data;
            $scope.queueList = data.response.data;
			

		},function(err){
        	$scope.queueList = [];
        });
		
	}
	
	
	 
	$scope.selectedUser = function(data){
		$scope.selectedusers = [];
		$scope.selectedusers = data;
		$scope.atleastoneacquirermsg = false;
		  $scope.acquireramlmsg = false;
		  $scope.issuerandamlmsg = false;
		  $scope.issueracquireramlmsg = false;
		  $scope.onlyissuermsg = false;
		  $scope.onlyacquiermsg = false;
		  $scope.onlyamlmsg = false;
		  $scope.anyofmsg = false;
		  $scope.atleastoneissuerrmsg = false;
		if($scope.selectedusers.length == 0 || data == undefined){
			$scope.showMultiSelectMsg = true;
		}else{
			$scope.showMultiSelectMsg = false;
		}
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
		  $scope.anyofmsg = false;
		  $scope.myrequiredmsg = false;
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
		  $scope.onlyamlmsg = false;
		  $scope.anyofmsg = false;
		  $scope.atleastoneissuerrmsg = false;
		  $scope.myrequiredmsg = false;
		if($scope.selectedAcquirerusers.length == 0 || data == undefined){
			$scope.showMultiSelectMsg = true;
		}else{
			$scope.showMultiSelectMsg = false;
		}
	}
	
    $scope.isChecked = function(queueId){
      var match = false;
      for(var i=0 ; i < $scope.data.length; i++) {
    	  
        if($scope.data[i].queueId == queueId){
        	
        	match = true;
        }
      }
      
      return match;
  };

  
  $scope.sync = function(bool, item){
	  $scope.checkBoxMsg = false;
	  $scope.atleastoneacquirermsg = false;
	  $scope.acquireramlmsg = false;
	  $scope.issuerandamlmsg = false;
	  $scope.issueracquireramlmsg = false;
	  $scope.onlyissuermsg = false;
	  $scope.onlyacquiermsg = false;
	  $scope.onlyamlmsg = false;
	  $scope.anyofmsg = false;
	  $scope.atleastoneissuerrmsg = false;
	    if(bool){
	    	
	      // add item
	      $scope.data.push(item);
	     
	      QueueService.header($scope.response.token).getQueuePrespective({selectedOrgId:$scope.selectedOrgId,channel:item.channel,queueCode:item.queueCode},function(data) {
	    	 
	    	  var myData = [];
	    	  myData = data.response.data;
	    	  var myObj = {};
	    	  myObj.queueCode = item.queueCode;
	    	  myObj.isAquirerIsuuer = myData;
	    	 
	    	  $scope.queuePrespective.push(myObj);
	        },function(err){
	        	
	        });
	    } else {
	      // remove item
	    	
	    	for(var i=0 ; i< $scope.queuePrespective.length; i++){
	    		if($scope.queuePrespective[i].queueCode == item.queueCode){
	    			$scope.queuePrespective.splice(i,1);
	    		}
	    	}
	      for(var i=0 ; i < $scope.data.length; i++) {
	        if($scope.data[i].queueId == item.queueId){
	        	
	          $scope.data.splice(i,1);

	        }
	      }      
	    }
	    
	  };
	  
	  $scope.checkboxremove = function(data){
		  
		  for(var i=0 ; i < data.length; i++) {
		          	
		          $scope.data.splice(i);
		      }  
	  }
	  
	  $scope.multiselectremove = function(data){
		  for(var i=0 ; i < data.length; i++) {
		          	
			  $scope.userList.splice(i);
		      }  
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
		 
		  $scope.assignQueue.listTaskQueue = JSON.parse(angular.toJson($scope.data));
		  $scope.assignQueue.users = JSON.parse(angular.toJson( $scope.assignQueue.users));
		  if($scope.assignQueue.users.length == 0){
			  $scope.myrequiredmsg = true;
		  }
		  if($scope.assignQueue.users.length != 0){
			  $scope.myrequiredmsg = false;
		  }
		  $scope.assignQueue.orgId = $scope.selectedOrgId;
		  $scope.assignQueue.assignedBy = userId;
		  $scope.assignQueue.updateddBy = userId;
		  $scope.assignQueue.actionType = 1;
		 
		 /* if($scope.selectedusers == undefined || $scope.selectedusers == undefined || $scope.selectedusers.length == 0){
			  $scope.showMultiSelectMsg = true;
		  }*/
		  if($scope.data == undefined || $scope.data == undefined ||$scope.data == 0){
			  $scope.checkBoxMsg = true;
		  }
		  if($scope.data != undefined &&  $scope.data.length > 0 ){
			  $scope.showMultiSelectMsg = false;
			  $scope.checkBoxMsg = false;
		if(!$scope.issueraccquirermsg && !$scope.atleastoneacquirermsg && !$scope.acquireramlmsg && !$scope.atleasetoneamlmsg && !$scope.issuerandamlmsg && !$scope.issueracquireramlmsg && !$scope.onlyissuermsg
				&&  !$scope.onlyacquiermsg && !$scope.onlyamlmsg && !$scope.anyofmsg && !$scope.atleastoneissuerrmsg && !$scope.atleasetoneamlmsg && !$scope.myrequiredmsg )  
		  QueueService.header($scope.response.token).saveQueue($scope.assignQueue,function(data) {
			  	$scope.thisSession = data;
			  	$scope.checkboxremove($scope.assignQueue.listTaskQueue);
			  	$scope.selectedusers = [];
			  	$scope.selectedAmlusers = [];
				$scope.selectedIssuerusers = [];
				$scope.selectedAcquirerusers = [];
			  	$scope.someObject.selectedPerson = [];
			  	$scope.someObject.issuerSelectedPersion = [];
			  	$scope.someObject.acquierSelectedPersion = [];
			  	$scope.someObject.amlSelectedPersion = [];
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
				  $scope.myrequiredmsg = false;
	        	toastr.success("User Assignment Request For The Selected Queue Submitted Successfully", Msg.hurrah);
	        },function(err){
	        	$scope.myrequiredmsg = false;
	        	$scope.assignQueue.listTaskQueue = [];
	        });
		  }
	  }
	  
    $scope.init = function(){
    	$scope.channel_code = [];
    	UserService.header({}).session({}, function(data){
		}, function(err){});
    	//$scope.getUserList();
    	//$scope.getQueueList();
    	$scope.organisationName();
    	 //$scope.isNpciLogin();
    	 if($scope.loggedInOrgId !="NPCI"){
    		 $scope.selectedOrgId = $scope.loggedInOrgId;
    		 //console.log( $scope.selectedOrgId)
    		 //$scope.changeOrganization($scope.loggedInOrgId);
    		 $scope.changedValue($scope.loggedInOrgId,'channel');
    		 $scope.organisationDisabled = true;
    	 }else{
    		 $scope.organisationDisabled = false;
    	 }
    	 casesManagement2.header($scope.response.token).channel( {},
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
		$scope.fetchUser = function(selectedqueue){
			$scope.selectedqueue=JSON.parse(selectedqueue);
			$scope.channelSelected = selectedqueue.channel;
			
			
			if(!angular.isUndefined($scope.selectedqueue)){
				QueueService.header($scope.response.token).fetchUserByQueueCode({queueCode:$scope.selectedqueue.queueCode,channel:$scope.selectedqueue.channel,queueId:$scope.selectedqueue.queueId,selectedOrgId:$scope.selectedOrgId,loggedInOrgId:$scope.loggedInOrgId,userId:userId},function(data) {
					$scope.queueUsers=data.response;
					if(data.response != undefined){
						$scope.queueUsers=data.response;
						finalusers=$scope.queueUsers;
						
					}
				},function(err){
					$scope.queueUsers=[];
					finalusers=$scope.queueUsers;
				});
			}else{
				$scope.queueUsers=[];
				finalusers=$scope.queueUsers;
			}


		}
   
    
    $scope.uncheckUsers=function(updatedUsers,item){
		
		if(updatedUsers == false){
			$scope.removeFinalusers.push(item);
			
		}else{
			
			$scope.removeFinalusers= $scope.removeFinalusers.filter(function(obj){
				return obj.userId != item.userId;
				
			}) 
			
		}


	}
		$scope.updateQueueUsers=function(){
			
			  $scope.removeAssignQueue.users = [];
			  $scope.removeAssignQueue.listTaskQueue = [];
			  $scope.removeAssignQueue.users = $scope.removeFinalusers;
			  $scope.removeAssignQueue.users = JSON.parse(angular.toJson($scope.removeAssignQueue.users));
			  $scope.removeAssignQueue.listTaskQueue.push($scope.selectedqueue);
			  $scope.removeAssignQueue.orgId = $scope.selectedOrgId;
			  $scope.removeAssignQueue.assignedBy = userId;
			  $scope.removeAssignQueue.updateddBy = userId;
			  $scope.removeAssignQueue.actionType = 2;
			  
			  QueueService.header($scope.response.token).saveQueue($scope.removeAssignQueue, function(data) {
					
					toastr.success("Assignment Removal Request From The Selected Queue Submitted Successfully", Msg.hurrah);
					$scope.queueUsers=finalusers;
					$scope.show=false;
	                $scope.selectedOrgId='';
	                var finalusers=[];
	                $scope.queueUsers=[];
	                $scope.removeFinalusers = [];
				},function(err){
					toastr.error("Changes Made UnSuccessful", Msg.hurrah);
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
    $scope.init();
   
}])