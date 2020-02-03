'use strict';
angular.module('efrm.dashboard')
.controller('searchController', ['$scope','$rootScope','$state', '$timeout', 'toastr','statusService', 'UserService','AdminService', 'casesManagement', '$ngConfirm', 'RolePermissionMatrix','Util', 'Session', 'Msg', 'DataService','Validation','commonDataService',
function($scope, $rootScope, $state, $timeout, toastr, statusService, UserService, AdminService, casesManagement, $ngConfirm, RolePermissionMatrix, Util, Session, Msg, DataService,Validation,commonDataService){
	var orgId = commonDataService.getLocalStorage().orgId;
	$scope.isNpciOrgId = commonDataService.getLocalStorage().orgId;
	$scope.orgIdMsg=false;
	$scope.selectedOrgID='';
	$scope.moment = Util.moment;
	$scope.reasonCode = "-1";
	$scope.showMsg = false;
	$scope.emailError = false;
	$scope.acv = true;
	$scope.rolePermission = RolePermissionMatrix;
    $scope.response = statusService.getResponseMessage();
	$rootScope.welcomeName = $scope.response.usersAuthoritiesPermissionsDto.firstName;
    $scope.sortKey = 'fname'; // set the default sort type
    $scope.Reverse = false;  // set the default sort order
    $scope.searchUserFn   = '';     // set the default search/filter term
    $scope.searchUserLn   = '';     // set the default search/filter term
    $scope.userSearch = false;
    var loggedInUser = $scope.response.usersAuthoritiesPermissionsDto;    
    $scope.authority = $scope.response.usersAuthoritiesPermissionsDto.authority;
    $scope.loggedInUserMail = loggedInUser.email;
    $scope.modal =  null;
    $scope.sorter = "";
    $scope.reasonList = DataService.getReasons(); 
    //$scope.totalItems = 10;
    //change
    $scope.totalItems = 50;
    $scope.bankDisabled = false;
	$scope.searchUserData = [];
    var userRole,userFN,userLN;
   /* $scope.page = {
    		pageNo 	 : 1,
    		pageSize : 10
    };*/
    //change
    $scope.page = {
    		pageNo 	 : 1,
    		pageSize : 50
    };
    $scope.currentPage = 1;
    $scope.sortFN = true;
    $scope.sortLN = true;
   // $scope.selectedPage = "10";
    //change
    $scope.selectedPage = "50";
   	var organisationName  = function(){
		casesManagement.header().organisations(
			{

				organisationID : orgId,
				selectedOrgId:null
			},
			function(response) {
				//$scope.orgarnisations = response.response;
				
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
	organisationName();
    $scope.$watch('userRole', function(newvalue, oldvalue){
    	$scope.oldVal = oldvalue;
    	$scope.newVal = newvalue;
    	//changes made for back button
    	//$scope.searchData = {};
	});
   
    if(orgId != 'NPCI'){
    	$scope.selectedOrgID = commonDataService.getLocalStorage().orgId;
    	$scope.bankDisabled = true;
    }
    
	$scope.changeOrgId = function(selectedOrgID){
		$scope.selectedOrgID = selectedOrgID;
		if(typeof selectedOrgID == "undefined" || selectedOrgID == ""){
			$scope.orgIdMsg = true;
		}else{
			$scope.orgIdMsg = false;
		}
	}

    $scope.userRole =  "ROLE_ALL";
    $scope.newSearchUserSubmit = function(){
    	$scope.currentPage =  1;
    	userRole = $scope.userRole;
    	userFN = $scope.searchData.fname;
    	userLN = $scope.searchData.lname;
    	$scope.searchUserSubmit();
    }
 
    $scope.searchData = {};
    $scope.searchUserPaginationSubmit = function(){
    	$scope.searchData.role = userRole;
    	$scope.searchData.fname = userFN;
    	$scope.searchData.lname = userLN;
    	$scope.searchData.selectedOrgId = $scope.selectedOrgID;
    	$scope.searchData.loggedInOrgId = orgId;
    	$scope.searchUserSubmit();
    }
    $scope.searchUserSubmit = function(){
    	if($scope.selectedOrgID==''||angular.isUndefined($scope.selectedOrgID)){
			$scope.orgIdMsg=true;
			return false;
		}else{
		    var userMail = $scope.searchData.email;
		    const expression = /^[_a-z-A-Z-0-9]+(\.[_a-z-A-Z0-9]+)*@[a-z-A-Z0-9-]+(\.[a-z-A-Z0-9-]+)*(\.[a-z-A-Z]{2,4})$/
            if(userMail != '' && !angular.isUndefined(userMail) && !expression.test(String(userMail).toLowerCase())){
                $scope.emailError = true;
                return false;
              }
            $scope.emailError = false;
			$scope.selectedOrgIdForBack = $scope.selectedOrgID;
			$scope.searchData = {
				role 	 : userRole,
				pageSize : $scope.page.pageSize,
				pageNo	 : $scope.currentPage,
				sorter	 : $scope.sorter,
				fname    : userFN,
				lname 	 : userLN,
				email    : $scope.searchData.email,
				selectedOrgId : commonDataService.getEnncryptData($scope.selectedOrgID),
				loggedInOrgId:commonDataService.getEnncryptData(orgId)
			}
			$scope.userRole =  userRole;

			AdminService.header($scope.response.token).search($scope.searchData, function(data) {
				$scope.searchUserData = data.response.records;
				/*if back end not working
                 $scope.totalItems = data.response.records.length;*/
				$scope.totalItems = data.response.totalRecords;
				$scope.orgIdMsg=false;
			},function(err){
				$scope.searchUserData = [];
				$scope.totalItems = 0;
				$scope.orgIdMsg=false;
			});

		}

    };
    $scope.isMiddleNamePresent = function(middleName){
    	return Validation.doNullCheck(middleName);
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
    $scope.sort = function(keyname){
    	switch(keyname){
    		case 'FIRST_NAME' :
    			$scope.sorter = keyname + '_' + ($scope.sortFN ? 'ASC' : 'DESC');
    			break;
    		case 'LAST_NAME' :
    			$scope.sorter = keyname + '_' + ($scope.sortLN ? 'ASC' : 'DESC');
    			break;
    		case 'ORGANISATION' :
    			$scope.sorter = keyname + '_' + ($scope.sortOrgName ? 'ASC' : 'DESC');
    			break;
    	}
    	$scope.page.pageNo = 1;
		$scope.searchUserSubmit();
    }
    
    $scope.edit = function(row){
    	 		localStorage.setItem("seacrhuserrole", $scope.searchData.role);
    	 		localStorage.setItem("seacrhUserselectedOrgId", $scope.selectedOrgIdForBack);
    	 		localStorage.setItem("loggedInOrgIdSerachUser", orgId);
    	 		if(typeof $scope.searchData.fname != undefined){
    	 			localStorage.setItem("searchUserFname", $scope.searchData.fname);
    	 		}
    	 		if(typeof $scope.searchData.lname != undefined){
    	 			localStorage.setItem("searchUserLname", $scope.searchData.lname);
    	 		}
    	 		
    	 		
    	    	$state.go('dashboard.update',{editable:'Y', value: row});
    	    
    }    
    $scope.unlock = function(row){
    	UserService.header({}).session({}, function(data){
    		var unlockReason = _.filter($scope.reasonList, {domain : 'USER_UNLOCK'});
    		$scope.reasons = unlockReason;
    		$scope.modal = null;
    		$scope.unlockUser = JSON.parse(angular.toJson(row));
    		if(Session.isSameLoggedInUser(row.email)){
    			toastr.error('You cann\'t unlock yourself.', Msg.oops);    			
    			return false;
    		}
    		$ngConfirm({
    			title: 'Unlock user',
    			theme: 'Material',
    			icon: 'fa fa-unlock',
    			content: 'Are you sure to unlock the user?',
    			scope: $scope,
    			buttons: {
    				Ok: {
    					text: 'Unlock',
    					btnClass: 'btn-red',
    					action: function(scope, button){                    	
    						scope.unlockUser.locked = 0;
    						var user = {};
    						
    						user = scope.unlockUser;
    						AdminService.header(localStorage.getItem("sessionToken")).unlock({}, user, function(data) {
    							toastr.success(data.message, Msg.hurrah);
    							scope.reason = "";
    							$scope.searchUserSubmit();
    						},function(err){

    						});
    					}
    				},
    				Cancel: {
    					text: 'Cancel'
    				}
    			}
    		});
    	}, function(err){});
    }
    	
    $scope.showErr = function(){
    	if($scope.reasonCode!='0'){                    		
    		$scope.showMsg = false;
    	}
    }
    
    $scope.deactivate = function(row){
    	
   
    	UserService.header({}).session({}, function(data){
    		var deactivateReason = {};
    		if(Session.getLoggedInUserRole() == 'ROLE_CSR_MGR'){
    			deactivateReason = _.filter($scope.reasonList, {domain : 'USER_DEACTIVE_CSR_MGR'});
    		}else{
    			deactivateReason = _.filter($scope.reasonList, {domain : 'USER_DEACTIVE'});
    		}
    		$scope.reasons = deactivateReason;
    		$scope.modal = null;
    		var deactive = angular.copy(row);
    	
    		if(Session.isSameLoggedInUser(row.email)){
    			toastr.error('You cann\'t Deactivate yourself.', Msg.oops);
    			return false;
    		}    		
    		$scope.modal = $ngConfirm({
    			title: 'Deactivate User',
    			theme: 'Material',
    			icon: 'fa fa-lock',
    			contentUrl: 'templates/private/reason.html',
    			scope: $scope,
    			onScopeReady: function(scope){
    				scope.reasonCode = '0';
    				scope.reason = '';
    			},
    			buttons: {
    				Ok: {
    					text: 'Deactivate',
    					btnClass: 'btn-red',
    					action: function(scope, button){
    						/*if(typeof deactive.createdByNotes == 'undefined'){
    							deactive.createdByNotes = null;
    						}else{
    						deactive.createdByNotes = deactive.createdByNotes;
    						}*/
    						deactive.deactivatedNotes = scope.reason;
    						deactive.status = 2;
    						deactive.deactivatedReason = scope.reasonCode;
    						var userStatus = {};
    						deactive.email = commonDataService.getEnncryptData(deactive.email);
    						deactive.orgId = commonDataService.getEnncryptData(deactive.orgId);
    						deactive.createdBy = commonDataService.getEnncryptData(deactive.createdBy);
    						//deactive.lastUpdatedBy = commonDataService.getEnncryptData(deactive.lastUpdatedBy);
    						deactive.lastDeactivatedBy = $scope.loggedInUserMail;
    						userStatus = deactive;
    						
    						if(scope.reasonCode=='0'){                    		
    							scope.showMsg = true;
    							deactive.status = 1;
    							return false;
    						}                    	
    						AdminService.header(localStorage.getItem("sessionToken")).deactive({email:null,orgId:null,status:null}, userStatus, function(data) {
    							toastr.success(data.message, Msg.hurrah);
    							scope.reason = "";
    							$scope.searchUserSubmit();
    							scope.deactive = {};
    						},function(err){
    							reasonForm.$validate();
    						});
    					}
    				},
    				Cancel: {
    					text: 'Cancel'
    				}
    			}
    		});
    	}, function(err){});
      
    }
    
    $scope.reactivate = function(row){
    	UserService.header({}).session({}, function(data){
    		var reactivateReason = _.filter($scope.reasonList, {domain : 'USER_REACTIVE'});
    		$scope.reasons = reactivateReason;
    		$scope.modal = null;
    		var reactive = angular.copy(row);
    		if(Session.isSameLoggedInUser(row.email)){
    			toastr.error('You cann\'t Reactivate yourself.', Msg.oops);
    			return false;
    		}
    		$scope.modal = $ngConfirm({
    			title: 'Reactivate User',
    			theme: 'Material',
    			icon: 'fa fa-unlock',
    			contentUrl: 'templates/private/reason.html',
    			scope: $scope,
    			onScopeReady: function(scope){
    				scope.reasonCode = '0';
    				scope.reason = '';
    			},
    			buttons: {
    				Ok: {
    					text: 'Reactivate',
    					btnClass: 'btn-red',
    					action: function(scope, button){
    						reactive.reactivatedNotes = scope.reason;
    						reactive.reactivatedReason = scope.reasonCode;
    						reactive.status = 1;
    						var user = {};
    						reactive.email = commonDataService.getEnncryptData(reactive.email);
    						reactive.orgId = commonDataService.getEnncryptData(reactive.orgId);
    						reactive.createdBy = commonDataService.getEnncryptData(reactive.createdBy);
    						//reactive.lastUpdatedBy = commonDataService.getEnncryptData(reactive.lastUpdatedBy);
    						reactive.lastReactivatedBy = $scope.loggedInUserMail;
    						user = reactive;
    						if(scope.reasonCode=='0'){                    		
    							scope.showMsg = true;
    							reactive.status = 2;
    							return false;
    						} 
    						AdminService.header(localStorage.getItem("sessionToken")).reactive({}, user, function(data) {
    							toastr.success(data.message, Msg.hurrah);
    							scope.reason = "";
    							$scope.searchUserSubmit();
    							scope.deactive = {};
    						},function(err){
    							reasonForm.$validate();
    						});
    					}
    				},
    				Cancel: {
    					text: 'Cancel'
    				}
    			}
    		});
    	}, function(err){});
    }
    
    $scope.init = function(){
    	//$scope.newSearchUserSubmit();
    	$scope.loggedUserOrgId = commonDataService.getLocalStorage().orgId;
    	AdminService.header($scope.response.token).getRoles({orgId : $scope.loggedUserOrgId},function(data) {
        	$scope.items = [];                    
            $scope.items = data.response;  

        },function(err){
        	$scope.items = []; 
        });
    	
    	if(localStorage.getItem("prev_path_view") == "seacrhUserDetails"){
        	
        	$scope.userRole = localStorage.getItem("seacrhuserrole");
        	$scope.selectedOrgID = localStorage.getItem("seacrhUserselectedOrgId");
        	orgId = localStorage.getItem("loggedInOrgIdSerachUser");
        	if(localStorage.getItem("searchUserFname") != 'undefined'){
        		$scope.searchData.fname = localStorage.getItem("searchUserFname");
        	}
        	
        	if(localStorage.getItem("searchUserLname") != 'undefined'){
        		$scope.searchData.lname = localStorage.getItem("searchUserLname");
        	}
        	$scope.newSearchUserSubmit();
        }
    }
    
    $scope.changePageSize = function(){
    	$scope.currentPage = 1;
    	$scope.page.pageSize = parseInt($scope.selectedPage);
    	$scope.searchUserSubmit();
    }
    $scope.isSessionValid = function(){
		UserService.header({}).session({}, function(data){
		}, function(err){});
	}
    $scope.init();

    $scope.Export = function () {
        $("#user_table").table2excel({
        	exclude: ".noExport",
            filename: "User_List.xls"
        });
    }

}])
