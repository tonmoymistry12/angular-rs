'use strict';
angular.module('efrm.dashboard')
.controller('unapprovedListController', ['$scope','$rootScope','$state', '$timeout', 'toastr','statusService', 'UserService','AdminService','casesManagement', '$ngConfirm', 'RolePermissionMatrix','Util', 'Session', 'Msg', 'DataService','Validation','commonDataService',
function($scope, $rootScope, $state, $timeout, toastr, statusService, UserService, AdminService,casesManagement, $ngConfirm, RolePermissionMatrix, Util, Session, Msg, DataService,Validation,commonDataService){
	$scope.moment = Util.moment;
	$scope.showMsg = false;
	$scope.rolePermission = RolePermissionMatrix;
    $scope.response = statusService.getResponseMessage();
	$rootScope.welcomeName = $scope.response.usersAuthoritiesPermissionsDto.firstName;
    var loggedInUser = $scope.response.usersAuthoritiesPermissionsDto;    
    $scope.authority = $scope.response.usersAuthoritiesPermissionsDto.authority;
    $scope.loggedInUserMail = loggedInUser.email;
    $scope.userDto = {};
    $scope.type = '';
    $scope.modalTitle = '';
    $scope.modelContent = '';
    $scope.userInformationDTO = {};
    $scope.firstNameSort = true;
    $scope.lastNameSort = true;
    $scope.currentPage=1;
    //$scope.selectedPage = "5";
    //change In selecetd page
    $scope.selectedPage = "50";
    //$scope.isSubmit = false;
    var loggedInUser = commonDataService.getLocalStorage().userEmail;
    var orgId = commonDataService.getLocalStorage().orgId;
    $scope.isNpciOrgId = orgId;
    $scope.checkStatus = "users";
    if(orgId == 'NPCI'){
    	$scope.filter = 'ALL'; 
    }else{
    	$scope.filter = orgId;
    }
    
    $scope.userRole =  "users";
    $scope.status = "users"
    $scope.items = [
    	{ name:"REQUEST FOR NEWLY CREATED USERS",val:"users"},
    	{ name:"REQUEST FOR EDITED USERS",val:"editUser"},
    	{ name:"REQUEST TO DEACTIVE USERS",val:"deactive"},
    	{ name:"REQUEST TO REACTIVE USERS",val:"active"}
    	
    ];
    
    /*$scope.changeCriteria = function(status){
    	if(status == "users"){
    		$scope.status = "Users"
    	}
    }*/
   
   $scope.decisionModel= function(row,type){
	   $scope.type = type;
	   $scope.unapproveDto = {}
	   $scope.user = {};
	   $scope.authority = {};
	   $scope.userDto = [];
	   if($scope.status == "users"){
		   $scope.user.status = 0;
		   $scope.user.action = "new";
	   }else if($scope.status == "active" || $scope.status == "editUser"){
		   $scope.user.status = 1
		   if($scope.status == "active"){
			   $scope.user.action = "reactive";   
		   }else{
			   $scope.user.action = "edit"; 
		   }
	   }else{
		   $scope.user.status = 2;
		   $scope.user.action = "deactive"; 
	   }
		   
		   $scope.user.userId = row.userId;
		   commonDataService.getEnncryptData(row.email);
		   //$scope.user.email = row.email;
		   $scope.user.email = commonDataService.getEnncryptData(row.email);
		   $scope.user.orgId = commonDataService.getEnncryptData(row.orgId);
		   //$scope.user.orgId = row.orgId;
		   $scope.user.firstName = row.firstName;
		   $scope.user.lastName = row.lastName;
		  
		   //$scope.user.lastUpdatedBy = commonDataService.getEnncryptData(loggedInUser);
		   if(row.middleName != undefined){
			   $scope.user.middleName = row.middleName;
		   }
		   if($scope.type == "approve"){
			   $scope.user.userMakerChecker = 0;
				$scope.modalTitle = 'Approve';
			    $scope.modelContent = 'Do You Want To Approve ?';
			    $scope.user.lastApprovedBy = loggedInUser;
			    $scope.user.approvedNotes = null;
				$scope.user.approvedReason = null;
		   }else{
			   $scope.user.userMakerChecker = 2;
			   $scope.modalTitle = 'Reject';
			   $scope.modelContent = 'Do You Want To Reject?';
			   $scope.user.lastRejectedBy = loggedInUser;
			   $scope.user.rejectedNotes = null;
			   $scope.user.rejectedReason = null;
		   }
		
		   $scope.userDto.push($scope.user);
		   $scope.unapproveDto.userDto = $scope.userDto;
		   $scope.unapproveDto.roleName = row.loginUserRole;
	  
	  
	   $ngConfirm({
			title: $scope.modalTitle,
			theme: 'Material',
			//icon: 'fa fa-unlock',
			content: $scope.modelContent,
			scope: $scope,
			buttons: {
				Ok: {
					text: 'Confirm',
					btnClass: 'btn-red',
					action: function(scope, button){                    	
						
						AdminService.header($scope.response.token).updateUnapprovedList($scope.unapproveDto, function(data) {
							if(type == "approve"){
			            	 toastr.success("Request Approved Successfully", Msg.hurrah);
			            	 }
			            	 if(type == "reject"){
			            		 toastr.success("Request Rejected Successfully", Msg.hurrah);
			            	 }
					           
							 if($scope.status == "users" || $scope.status == "editUser"){								   
								   AdminService.header($scope.response.token).getUnapprovedList({criteria:$scope.status,filter:$scope.filter}, function(data) {
							        	$scope.unapprovedList = [];
							        	
							            if(data.response[0].userDto != undefined){
							            	 $scope.unapprovedList = data.response[0].userDto; 							            	 
							            }
							        },function(err){
							        	$scope.unapprovedList = [];
							           
							        });
								   
							   }else{
									   AdminService.header($scope.response.token).activeDecativeUnapprovedList({status:$scope.status,criteria:"users",filter:$scope.filter}, function(data) {
										   $scope.unapprovedList = [];
								           if(data.response[0].userDto != undefined){
								           	 $scope.unapprovedList = data.response[0].userDto; 								           	
								           }
								       },function(err){
								       	$scope.unapprovedList = [];		          
								       });
							   }
					           
					       },function(err){
					    	   //toastr.error("Changes Made UnSuccessful", Msg.hurrah);
					       });
					}
				},
				Cancel: {
					text: 'Cancel'
				}
			}
		});
   }
   
    $scope.isMiddleNamePresent = function(middleName){
    	return Validation.doNullCheck(middleName);
    }
    
   $scope.getList = function(){
	   console.log($scope.filter)
	   $scope.checkStatus = $scope.status;
	   var status = $scope.status;
	   var filter = $scope.filter;
	   $scope.unapprovedList = [];  
	  // $scope.isSubmit = true;
	   if($scope.status == "users" || $scope.status == "editUser"){
		   
		   AdminService.header($scope.response.token).getUnapprovedList({criteria:$scope.status,filter:filter}, function(data) {
	        	$scope.unapprovedList = [];
	        	
	            if(data.response[0].userDto != undefined){
	            	 $scope.unapprovedList = data.response[0].userDto;
					$scope.pagination={
						current:1
					};

	            }
	        },function(err){
	        	$scope.unapprovedList = [];
	           
	        });
		   
	   }else{
			   AdminService.header($scope.response.token).activeDecativeUnapprovedList({status:status,criteria:"users",filter:filter}, function(data) {
		       
		       	
		           if(data.response[0].userDto != undefined){
		           	 $scope.unapprovedList = data.response[0].userDto; 
		           }
		       },function(err){
		       	$scope.unapprovedList = [];		          
		       });
	   }
   }
   
   $scope.changedValueForOrganisation = function(organisation){
	   $scope.filter = organisation;
   }
   
   $scope.roleDisplay = function(authorityRole){
   	var str = authorityRole;
   	var afterRemovingRole = str.replace("ROLE","");
   	var finalTxt = afterRemovingRole.replace(/_/g," ");
   	if(finalTxt.includes("APPLICATION")){
   		finalTxt = finalTxt.replace(/APPLICATION/g,'');
   	}
   	return finalTxt;
   	
   	
   }
   
   $scope.isEncripted = function(visibility){
   		if(visibility == '0'){
   			return "Encrypted";
   		}if(visibility == '1'){
   			return "Plain Text";
   		}
   }
   
   $scope.sort = function(keyname){
       $scope.sortKey = keyname;  
       $scope.reverse = !$scope.reverse; 
       if(keyname == 'firstName'){
    	   $scope.firstNameSort = !$scope.firstNameSort;
       }
       if(keyname == 'lastName'){
    	   $scope.lastNameSort = !$scope.lastNameSort;
       }
   }
  
   
   $scope.organisationName  = function(){
   	casesManagement.header().organisations( 
				{ 
					
					organisationID : orgId
				},
				function(response) {
							if($scope.isNpciOrgId == 'NPCI'){
								var organisationList = [];
								organisationList = response.response;
								var allOrg = {}
								allOrg.orgId = "ALL";
								allOrg.name = "All ORGANISATION"
								organisationList.unshift(allOrg);
								$scope.orgarnisations = organisationList;
							}else{
	                         $scope.orgarnisations = response.response;
							}
					},
				function(err) {
				});
   }
    
    $scope.init = function(){
    	$scope.organisationName();
    	AdminService.header($scope.response.token).getUnapprovedList({criteria:"users",filter:$scope.filter}, function(data) {
        	$scope.unapprovedList = [];
            if(data.response[0].userDto != undefined){
            	 $scope.unapprovedList = data.response[0].userDto;
				$scope.pagination={
					current:1
				};
            }
        },function(err){
        	$scope.unapprovedList = [];
           
        });
    	
    	
    }

    $scope.pageChanged=function(current){
   	
   		$scope.pagination={
			current:current
		}

	}

	/*$scope.$watch('pagination.current', function(val) {
		$scope.pageChanged(val);
	});*/
    $scope.isSessionValid = function(){
		UserService.header({}).session({}, function(data){
		}, function(err){});
	}
    
   /* $scope.changeStatus = function(){
    	$scope.isSubmit = false;
    }*/
    $scope.init();
}])
