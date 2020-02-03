'use strict';
angular.module('efrm.dashboard')
.controller('resetroleapproveController', ['$scope','$rootScope','$state', '$timeout', 'toastr','statusService', 'UserService','AdminService', '$ngConfirm', 'RolePermissionMatrix','Util', 'Session', 'Msg', 'DataService','Validation','commonDataService',
function($scope, $rootScope, $state, $timeout, toastr, statusService, UserService, AdminService, $ngConfirm, RolePermissionMatrix, Util, Session, Msg, DataService,Validation,commonDataService){
	$scope.moment = Util.moment;
	$scope.showMsg = false;
    $scope.response = statusService.getResponseMessage();
    var loggedInUser = $scope.response.usersAuthoritiesPermissionsDto;    
    $scope.authority = $scope.response.usersAuthoritiesPermissionsDto.authority;
    $scope.loggedInUserMail = loggedInUser.email;
    $scope.type = '';
    $scope.modalTitle = '';
    $scope.modelContent = '';
    var loggedInUser = commonDataService.getLocalStorage().userEmail;
    var orgId = commonDataService.getLocalStorage().orgId;
   
    
  
   
   $scope.decisionModel= function(row,type){
	   $scope.type = type;
	   $scope.obj = {};
		   if($scope.type == "approve"){
			   $scope.obj.approvedBy = loggedInUser;
			   $scope.obj.approvedNote = "";
		   }else{
			   $scope.obj.rejectedBy = loggedInUser;
			   $scope.obj.rejectedNotes = "";
		   }
		  
	   
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
						if($scope.type == "approve"){
						AdminService.header($scope.response.token).resetRoleApprove({roleName:row.permission,orgId:row.orgId},$scope.obj, function(data) {
							   
								toastr.success(data.message, Msg.hurrah);
							
							AdminService.header($scope.response.token).unparroveResetRole( function(data) {
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
						if($scope.type == "reject"){
							AdminService.header($scope.response.token).resetRoleReject({roleName:row.permission,orgId:row.orgId},$scope.obj, function(data) {
								   																
									toastr.success(data.message, Msg.hurrah);
								
								AdminService.header($scope.response.token).unparroveResetRole(function(data) {
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
   
   
  
   $rootScope.getUnapprovedResetRole = function(){
	   AdminService.header($scope.response.token).unparroveResetRole( function(data) {
       	$scope.unapprovedList = [];
       	if(data.response != undefined){
	           	 $scope.unapprovedList = data.response; 	           	 
	           }
       },function(err){
       	$scope.unapprovedList = [];          
       });
   }
    $scope.init = function(){
    	
    	AdminService.header($scope.response.token).unparroveResetRole( function(data) {
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
