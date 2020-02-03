'use strict';
angular.module('efrm.dashboard')
.controller('unapprovedRoleController', ['$scope','$rootScope','$state', '$timeout', 'toastr','statusService', 'UserService','AdminService', '$ngConfirm', 'RolePermissionMatrix','Util', 'Session', 'Msg', 'DataService','Validation','commonDataService',
function($scope, $rootScope, $state, $timeout, toastr, statusService, UserService, AdminService, $ngConfirm, RolePermissionMatrix, Util, Session, Msg, DataService,Validation,commonDataService){
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
   // $scope.selectedPage = '5';
    // change in selcted page
    $scope.selectedPage = '50';
    var loggedInUser = commonDataService.getLocalStorage().userEmail;
    var orgId = commonDataService.getLocalStorage().orgId;
   
    if(orgId == 'NPCI'){
    	$scope.filter = 'ALL'; 
    }else{
    	$scope.filter = orgId;
    }
    
    $scope.userRole =  "roles";
   
   $scope.decisionModel= function(row,type){
	   $scope.type = type;
	   $scope.unapproveDto = {}
	   $scope.user = {};
	   $scope.authority = {};
	   $scope.userDto = [];
		   $scope.authorityTypeDTO = [];
		   $scope.authority.authorityTypeId = row.authorityTypeId;
		   $scope.authority.orgId = commonDataService.getEnncryptData(row.orgId)
		   //$scope.authority.orgId = row.orgId;
		   $scope.authority.authorityType = row.roleName;
		   if($scope.type == "approve"){
			   $scope.authority.authorityTypeMakerChecker = 0;
			   $scope.authority.lastApprovedBy = loggedInUser;
		   }else{
			   $scope.authority.authorityTypeMakerChecker = 2;
			   $scope.authority.lastRejectedBy = loggedInUser;
		   }
		   $scope.authorityTypeDTO.push($scope.authority);
		  
		   $scope.unapproveDto.lastUpdatedBy = commonDataService.getEnncryptData(loggedInUser);
		   //$scope.unapproveDto.lastUpdatedBy = loggedInUser;
		   $scope.unapproveDto.authorityTypeDTO = $scope.authorityTypeDTO;
	   
	   if($scope.type == "approve"){
	   	$scope.modalTitle = 'Approve';
	    $scope.modelContent = 'Do You Want To Approve ?';
	   }
	   
	   if($scope.type == "reject"){
		$scope.modalTitle = 'Reject';
		$scope.modelContent = 'Do You Want To Reject?';
		}
	   
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
							   
							 //toastr.success("Changes Made Successfully", Msg.hurrah);
							if($scope.type == "approve"){
								toastr.success("Request Approved Successfully", Msg.hurrah);
							}
							if($scope.type == "reject"){
								toastr.success("Request Rejected Successfully", Msg.hurrah);
							}
							AdminService.header($scope.response.token).getUnapprovedList({criteria:$scope.userRole,filter:$scope.filter}, function(data) {
					           		$scope.unapprovedList = [];     
					           
					           		if(data.response != undefined){
							           	 $scope.unapprovedList = data.response;
					           		}
					           	
					           },function(err){
					           	$scope.unapprovedList = [];
					           });
					           
					       },function(err){
					    	  // toastr.error("Changes Made UnSuccessful", Msg.hurrah);
					       });
					}
				},
				Cancel: {
					text: 'Cancel'
				}
			}
		});
   }
   
   
  
   $scope.roleDisplay = function(authorityRole){
   	var str = authorityRole;
   	var afterRemovingRole = str.replace("ROLE","");
   	var finalTxt = afterRemovingRole.replace(/_/g," ");
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
  
    
    $scope.init = function(){
    	
    	AdminService.header($scope.response.token).getUnapprovedList({criteria:"roles",filter:$scope.filter}, function(data) {
        	$scope.unapprovedList = [];
        	if(data.response != undefined){
	           	 $scope.unapprovedList = data.response; 	           	 
	           }
        },function(err){
        	$scope.unapprovedList = [];
           
        });
    }
    
    $scope.listroleDisplay = function(role){
    	var res1;
    	var res;
    	if(typeof role != 'undefined'){
    		if(role.includes("ROLE") && role.includes("_")){
    			res1 = role.replace("ROLE", "");
    		
    			res = res1.replace(/_/g, " ");
    		}else if(role.includes("ROLE") && !role.includes("_")){
    			res = role.replace("ROLE", "");
    		}else if(!role.includes("ROLE") && role.includes("_")){
    			res = role.replace("/_/g", " ");
    		}}else if(!role.includes("ROLE") && !role.includes("_")){
    			res = role;
    		}
    	if(res.includes("APPLICATION")){
    		res = res.replace(/APPLICATION/g,'');
    	}
    	  return res;
    	}
   
    $scope.isSessionValid = function(){
		UserService.header({}).session({}, function(data){
		}, function(err){});
	}
    $scope.init();
}])
