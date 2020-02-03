/**
 * 
 */

'use strict';
angular.module('efrm.dashboard')
.controller('dashboardController', ['$rootScope', '$scope','$q','Util', 'RolePermissionMatrix', '$location', 'Session', 'UserService','toastr', 'Msg', '$state','RuleService','statusService','SearchCaseService','commonDataService','casesManagement','casesManagement2','AdminService','chargeBack','$ngConfirm',
	function($rootScope, $scope, $q, Util, RolePermissionMatrix, $location, Session, UserService, toastr, Msg, $state, RuleService,statusService, SearchCaseService,commonDataService,casesManagement,casesManagement2,AdminService,chargeBack,$ngConfirm){
	$scope.loggedIn = true;
	$scope.show_flag= false;
	$scope.showBanknameDropdown = false;
	$scope.moment = Util.moment;
	$scope.showOrganisation = false;
	$scope.rolePermission = RolePermissionMatrix;
		$scope.modalShown = false;
		$scope.submitted=false;
		$scope.roles = [];
		var session =  Session.getSession();
	$scope.loggedInUser = session.usersAuthoritiesPermissionsDto.firstName + ' ' + session.usersAuthoritiesPermissionsDto.lastName;
	$scope.organization=session.usersAuthoritiesPermissionsDto.orgName;
	$scope.lastLogin	= session.usersAuthoritiesPermissionsDto.lastLoginDate;
	$scope.chkOrgId = commonDataService.getLocalStorage().orgId;
	$scope.visible=false;
	$scope.init = function(){
		 $('[data-toggle="popover"]').popover();
	}
		$scope.obj={};
	$rootScope.$on('$locationChangeStart', function (event, current, previous) {
        var parser = document.createElement('a');
        parser.href = previous;
        localStorage.setItem("prev_path", parser.pathname);
        parser.href = current;
        localStorage.setItem("current_path", parser.pathname);
       
   });


			/*if($location.path() === "/dashboard/viewRule"){
			RuleService.setPrevPath(null);
		}*/

		$scope.isActive = function (viewLocation) {

			if (viewLocation === $location.path())
			{

				if($location.path() === "/dashboard/frauds")
				{
					localStorage.setItem("prev_path_view", "")
					angular.element("#config-submenu").css('display','none');
					angular.element("#data_chart1").addClass("open");
					angular.element("#frauds2").css('color',"#fff");
					angular.element("#frauds2").css('background',"#1d2961");

				}
				if($location.path() === "/dashboard/operationalDashboard")
				{
					localStorage.setItem("prev_path_view", "")
					angular.element("#config-submenu").css('display','none');
					angular.element("#data_chart2").addClass("open");
					angular.element("#frauds1").css('color',"#fff");
					angular.element("#frauds1").css('background',"#1d2961");

				}


				if($location.path() === "/dashboard/config")
				{
					localStorage.setItem("prev_path_view", "")
					angular.element("#config").addClass("open");
					angular.element("#setup").css('color',"#fff");
					angular.element("#setup").css('background',"#1d2961");
				}
				if($location.path() === "/dashboard/adminCreatePermission" || $location.path() === "/dashboard/adminEditPermission" || $location.path() === "/dashboard/unapprovedRoles" || $location.path() === "/dashboard/resetroleapprove" )
				{

					localStorage.setItem("prev_path_view", "")
					angular.element("#role").addClass("open");
					angular.element("#role-submenu").css('display','block');
					if($location.path() === "/dashboard/adminEditPermission"){
						angular.element("#editPermisson").css('color',"#fff");
						angular.element("#editPermisson").css('background',"#1d2961");
					}
					if($location.path() === "/dashboard/adminCreatePermission"){
						angular.element("#createPermisson").css('color',"#fff");
						angular.element("#createPermisson").css('background',"#1d2961");
					}
					if($location.path() === "/dashboard/unapprovedRoles"){
					angular.element("#unapprovedRole").css('color',"#fff");
					angular.element("#unapprovedRole").css('background',"#1d2961");
					}
					if($location.path() === "/dashboard/resetroleapprove"){
						angular.element("#resetApprove").css('color',"#fff");
						angular.element("#resetApprove").css('background',"#1d2961");
					}
				}
				if($location.path() === "/dashboard/create" || $location.path() === "/dashboard/adminSearch" || $location.path() === "/dashboard/unapprovedList"){
					localStorage.setItem("prev_path_view", "")
					angular.element("#user").addClass("open");
					angular.element("#user-submenu").css('display','block');
					if($location.path() === "/dashboard/create"){
						angular.element("#create-user").css('color',"#fff");
						angular.element("#create-user").css('background',"#1d2961");
					}
					if($location.path() === "/dashboard/adminSearch"){
						angular.element("#search-user").css('color',"#fff");
						angular.element("#search-user").css('background',"#1d2961");
					}
					if($location.path() === "/dashboard/unapprovedList"){
						angular.element("#unapprovedList").css('color',"#fff");
						angular.element("#unapprovedList").css('background',"#1d2961");
					}

				}
				/*queue management */
				if($location.path() === "/dashboard/createqueue" || $location.path() === "/dashboard/approvependingassignment" || $location.path() === "/dashboard/searchqueue" || $location.path() === "/dashboard/approvependingqueue" || $location.path() === "/dashboard/assignqueue" ||  $location.path() === "/dashboard/unassignedQueue"){
					localStorage.setItem("prev_path_view", "")
					angular.element("#case_mangement").addClass("open");
					angular.element("#case_mangement_submenu").css('display','block');

					if($location.path() === "/dashboard/createqueue"){
						angular.element("#create-queue").css('color',"#fff");
						angular.element("#create-queue").css('background',"#1d2961");
					}
					if($location.path() === "/dashboard/searchqueue"){
						angular.element("#searchqueue").css('color',"#fff");
						angular.element("#searchqueue").css('background',"#1d2961");

					}
					if($location.path() === "/dashboard/assignqueue"){
						angular.element("#assignqueue").css('color',"#fff");
						angular.element("#assignqueue").css('background',"#1d2961");

					}

					if($location.path() === "/dashboard/approvependingqueue"){
						angular.element("#approvependingqueue").css('color',"#fff");
						angular.element("#approvependingqueue").css('background',"#1d2961");

					}

					if($location.path() === "/dashboard/approvependingassignment"){
						angular.element("#approvependingassignment").css('color',"#fff");
						angular.element("#approvependingassignment").css('background',"#1d2961");

					}

					if($location.path() === "/dashboard/unassignedQueue"){

						angular.element("#unassignedqueue").css('color',"#fff");
						angular.element("#unassignedqueue").css('background',"#1d2961");
						localStorage.setItem("prev_path_view", "")

					}

				}

				// Reports//
				if($location.path() === "/dashboard/createReports" || $location.path() === "/dashboard/myReports"){
					localStorage.setItem("prev_path_view", "")
					angular.element("#view_reports").addClass("open");
					angular.element("#reports_new-submenu").css('display','block');

					if($location.path() === "/dashboard/createReports"){
						angular.element("#create_reports").css('color',"#fff");
						angular.element("#create_reports").css('background',"#1d2961");

					}
					/*if($location.path() === "/dashboard/myReports"){
                        angular.element("#my_reports").css('color',"#fff");
                        angular.element("#my_reports").css('background',"#1d2961");

                    }*/

				}
				//Charge BAck
				if($location.path() === "/dashboard/createchargeback" || $location.path() === "/dashboard/viewcharegeback" || $location.path() === "/dashboard/checkcharegeback"){
					localStorage.setItem("prev_path_view", "");
					angular.element("#chargeback").addClass("open");
					angular.element("#chargeback-submenu").css('display','block');
					if($location.path() === "/dashboard/createchargeback"){
						angular.element("#createchargeback").css('color',"#fff");
						angular.element("#createchargeback").css('background',"#1d2961");

					}
					if($location.path() === "/dashboard/viewcharegeback"){
                        angular.element("#viewchargeback").css('color',"#fff");
                        angular.element("#viewchargeback").css('background',"#1d2961");

                    }
					
					if($location.path() === "/dashboard/checkcharegeback"){
                        angular.element("#checkchargeback").css('color',"#fff");
                        angular.element("#checkchargeback").css('background',"#1d2961");

                    }

				}

				// Rule Mangement//

				if($location.path() === "/dashboard/createRule" || $location.path() === "/dashboard/viewRule" ||
					$location.path() === "/dashboard/hotlist" || $location.path() === "/dashboard/hotlistinsert" ||
					$location.path() === "/dashboard/createRuleSets"||$location.path() === "/dashboard/viewRuleSets"){
					localStorage.setItem("prev_path_view", "")

					angular.element("#view_rule").addClass("open");
					angular.element("#view_rule-submenu").css('display','block');

					if($location.path() === "/dashboard/createRule"){
						angular.element("#create-rule").css('color',"#fff");
						angular.element("#create-rule").css('background',"#1d2961");

					}
					if($location.path() === "/dashboard/viewRule"){
						angular.element("#view-rule").css('color',"#fff");
						angular.element("#view-rule").css('background',"#1d2961");
					}
					if($location.path() === "/dashboard/hotlist"){
						angular.element("#hotlist").css('color',"#fff");
						angular.element("#hotlist").css('background',"#1d2961");
					}
					if($location.path() === "/dashboard/hotlistinsert"){
						angular.element("#hotlist").css('color',"#fff");
						angular.element("#hotlist").css('background',"#1d2961");
					}
					if($location.path() === "/dashboard/createRuleSets"){
						angular.element("#create-rule-set").css('color',"#fff");
						angular.element("#create-rule-set").css('background',"#1d2961");
					}
					if($location.path() === "/dashboard/viewRuleSets"){
						angular.element("#view-rule-set").css('color',"#fff");
						angular.element("#view-rule-set").css('background',"#1d2961");
					}

				}

				if($location.path() === "/dashboard/configAbnormal" || $location.path() === "/dashboard/viewAbnormal" || $location.path() === "/dashboard/approvependingAbnormal"){
					localStorage.setItem("prev_path_view", "")
					angular.element("#abnormal_hours").addClass("open");
					angular.element("#abnormal_hours-submenu").css('display','block');
					localStorage.setItem("prev_path_view", "")

					if($location.path() === "/dashboard/configAbnormal"){
						angular.element("#configAbnormal").css('color',"#fff");
						angular.element("#configAbnormal").css('background',"#1d2961");
						localStorage.setItem("prev_path_view", "")

					}
					if($location.path() === "/dashboard/approvependingAbnormal"){
						angular.element("#approvependingAbnormal").css('color',"#fff");
						angular.element("#approvependingAbnormal").css('background',"#1d2961");
						localStorage.setItem("prev_path_view", "")

					}
					if($location.path() === "/dashboard/viewAbnormal"){
						angular.element("#viewAbnormal").css('color',"#fff");
						angular.element("#viewAbnormal").css('background',"#1d2961");
						localStorage.setItem("prev_path_view", "")
					}

				}

				/*Case Management*/
				if($location.path() === "/dashboard/mycases" || $location.path() === "/dashboard/reviewcases" || $location.path() === "/dashboard/unassignedcases" || $location.path() === "/dashboard/viewTransactions"
					||  $location.path() === "/dashboard/myAlert" ||  $location.path() === "/dashboard/unassignedAlerts" ||  $location.path() === "/dashboard/reviewcases" || $location.path() === "/dashboard/searchCases" ||  $location.path() === "/dashboard/alertsInQueue"){
					localStorage.setItem("prev_path_view", "");
					angular.element("#case_management_new").addClass("open");
					angular.element("#case_management_new-submenu").css('display','block');
					if($location.path() === "/dashboard/mycases"){
						angular.element("#mycases").css('color',"#fff");
						angular.element("#mycases").css('background',"#1d2961");
						localStorage.setItem("prev_path_view", "")
					}
					if($location.path() === "/dashboard/reviewcases"){
						angular.element("#reviewcases").css('color',"#fff");
						angular.element("#reviewcases").css('background',"#1d2961");
						localStorage.setItem("prev_path_view", "")
					}
					if($location.path() === "/dashboard/unassignedcases"){
						angular.element("#unassigned_cases").css('color',"#fff");
						angular.element("#unassigned_cases").css('background',"#1d2961");
						localStorage.setItem("prev_path_view", "")

					}
					if($location.path() === "/dashboard/viewTransactions"){
						angular.element("#case_transaction").css('color',"#fff");
						angular.element("#case_transaction").css('background',"#1d2961");
						localStorage.setItem("prev_path_view", "")

					}
					if($location.path() === "/dashboard/myAlerts"){
						angular.element("#myAlerts").css('color',"#fff");
						angular.element("#myAlerts").css('background',"#1d2961");
						localStorage.setItem("prev_path_view", "")

					}
					if($location.path() === "/dashboard/unassignedAlerts"){
						angular.element("#unassignedAlerts").css('color',"#fff");
						angular.element("#unassignedAlerts").css('background',"#1d2961");
						localStorage.setItem("prev_path_view", "")

					}

					if($location.path() === "/dashboard/alertsInQueue"){

						angular.element("#alertsInQueue").css('color',"#fff");
						angular.element("#alertsInQueue").css('background',"#1d2961");
						localStorage.setItem("prev_path_view", "")

					}

					if($location.path() === "/dashboard/searchCases"){

						angular.element("#search-case").css('color',"#fff");
						angular.element("#search-case").css('background',"#1d2961");
						localStorage.setItem("prev_path_view", "")

					}

				}


			}

		};
	
	
	
	$scope.init();
	$scope.doLogout = function(){
		var token =  localStorage.getItem("sessionToken");
		UserService.header({token : token }).logout({},function(data){
			toastr.success(data.message, Msg.hurrah);
			$scope.loggedIn = !$scope.loggedIn;
			Session.clear();
			$state.go('signOut');
		}, function(err){
		});
	};


		$scope.changePreferences=function(){
			$scope.enableSelectAll=false;
			$scope.enableRemovetAll=false;
			$scope.modalShown = !$scope.modalShown;
			$scope.obj={};
			$scope.submitted=false;
			var orgId = commonDataService.getLocalStorage().orgId;

			var userId = commonDataService.getSessionStorage().userId;
			$scope.response = statusService.getResponseMessage();

			$scope.selectedMsg=false;
			
			var screen='createManualCase'
			var allColumns={};
			var selectedColumns={};
			$scope.list1 = [];
			$scope.list2 = [];
			var object1=[];
			var object2=[];
			loadChannel();


			var promise1;
			var promise2;

			function loadChannel(){
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


			$scope.changeChannel=function(){
				$scope.submitted=false;
				if($scope.obj.selectedChannel1!=''&& !angular.isUndefined($scope.obj.selectedChannel1)){
					$scope.list1=[];
					$scope.list2=[];
					object1=[];
					object2=[];
					allColumns={};
					selectedColumns={};
					var getAll=getAllList($scope.obj.selectedChannel1);
					var getUsers=getUserList($scope.obj.selectedChannel1);
					$q.all([getAll, getUsers]).then(function(values) {
						if(object2!=null){
							$scope.list1=object1.filter(x=>!object2.includes(x));
							$scope.list2=object2;
							if($scope.list1.length==0){
								$scope.enableSelectAll=false;
							}else{
								$scope.enableSelectAll=true;
							}
							if($scope.list2.length==0){
								$scope.enableRemoveAll=false;
							}else{
								$scope.enableRemoveAll=true;
							}
						}else{
							$scope.list1=object1;
							$scope.list2=object2;
						}

					});

				}else{
					allColumns={};
					selectedColumns={};


				}
			}

			var getAllList=function(selectedChannel){
				promise1 = $q.defer();
				casesManagement.header($scope.response.token).getPreferences({channel : selectedChannel, screen: screen},function(data) {
						if(!angular.isUndefined(data.response)){
							allColumns=data.response.columnPref;
							//object1=Object.values(allColumns);
							data.response.columnPref.filter(x=>{
								object1.push(x.columnName)
							})
							promise1.resolve(object1);
						}else{
							allColumns={};
							object1=[];
							$scope.list1=[];
							promise2.resolve(object1);
						}

				},function(err){
					var allColumns={};
					object1=[];
					promise1.reject();
					toastr.error("No list found", Msg.oops);
				});
				return promise1.promise;
			}

			var getUserList=function(selectedChannel){
				promise2 = $q.defer();
				casesManagement.header($scope.response.token).getPreferencesByUserId({userId:userId,channel : selectedChannel, screen: screen},function(data) {
						if(!angular.isUndefined(data.response)){
							selectedColumns=data.response.columnPref;
							//object2=Object.values(selectedColumns);
							data.response.columnPref.filter(x=>{
								object2.push(x.columnName)
							})
							promise2.resolve(object2);
						} else {
							selectedColumns={};
							object2=[];
							$scope.list2=[];
							promise2.resolve(object2);

						}
				},function(err){
					selectedColumns={};
					object2=[];
					promise2.reject(object2);
					toastr.error("No list found for the user", Msg.oops);
				});
				return promise2.promise;
			}

			$scope.selectAllColumns=function(){
					if($scope.list1.length!=0 && $scope.list2.length==0){
						$scope.list2=$scope.list1;
						$scope.list1=[];
						$scope.enableSelectAll=false;
					}else if($scope.list1.length!=0 && $scope.list2.length!=0){
						$scope.list1.forEach(x=>{
							$scope.list2.push(x);
						})
						$scope.list1=[];
						$scope.enableSelectAll=false;
					}
			}

			$scope.removeAllColumns=function(){
				if($scope.list1.length==0 && $scope.list2.length!=0){
					$scope.list1=$scope.list2;
					$scope.list2=[];
					$scope.enableRemoveAll=false;
				}else if($scope.list1.length!=0 && $scope.list2.length!=0){
					$scope.list2.forEach(x=>{
						$scope.list1.push(x);
					})
					$scope.list2=[];
					$scope.enableRemoveAll=false;
				}
			}

			$scope.sortableOptions = {
				'ui-floating': true,
				placeholder: "app",
				connectWith: ".apps-container",
				update: function (e, ui) {
				},
				stop: function (e, ui) {
					// this callback has the changed model
					
				}
			};
			$scope.updatePreferences=function () {
				$scope.submitted=true;
				var configObj={columnPref:''};
					$scope.selectedMsg=false;
					var columnPref=[]
					for(var i=0;i<$scope.list2.length;i++){
						var obj={
							position:'',
							columnName:'',
							columnId:''
						};
						obj.position=i;
						obj.columnName=$scope.list2[i];
						allColumns.forEach(x=>{
							if(x.columnName==$scope.list2[i]){
								obj.columnId = x.columnId;
							}
						})
						columnPref.push(obj);
					}
					configObj={
						columnPref:columnPref
					};
					
					if(Object.keys(selectedColumns).length!=0){

						updateList(configObj);
					}else{
						createList(configObj);
					}

			}
			function updateList(obj){
				casesManagement.header($scope.response.token).updatePreferencesByUserId({userId:userId,channel : $scope.obj.selectedChannel1, screen: screen},obj,function(data) {
					
					toastr.success("Preferences updated successfully", Msg.hurrah);
					$scope.submitted=false;
					$scope.obj={};
					allColumns={};
					selectedColumns={};
					$scope.list1 = [];
					$scope.list2 = [];
					object1=[];
					object2=[];
					$scope.modalShown = !$scope.modalShown;
				},function(err){
					toastr.error("Preferences update failed", Msg.oops);
					$scope.submitted=false;

				});
			}
			function createList(obj) {
				casesManagement.header($scope.response.token).createPreferencesByUserId({userId:userId,channel : $scope.obj.selectedChannel1, screen: screen},obj,function(data) {
					
					toastr.success("Preferences updated successfully", Msg.hurrah);
					$scope.submitted=false;
					$scope.obj={};
					allColumns={};
					selectedColumns={};
					$scope.list1 = [];
					$scope.list2 = [];
					object1=[];
					object2=[];
					$scope.modalShown = !$scope.modalShown;


				},function(err){
					toastr.error("Preferences update failed", Msg.oops);
					$scope.submitted=false;
				});
			}

		}
	
	$scope.inAccoyntSettings = function(){
		$state.go('dashboard.accountSettings');
	}
	
	$scope.updateSecurityQuestion = function(){
		$state.go('dashboard.updateSecurityQuestion');
	}
	
	$scope.getMyReports = function(){
		$state.go('dashboard.getmyreports');
	}
	$scope.simulateRules = function(){
		$state.go('dashboard.simulateRules');
	}
	$scope.notGeneratedRules = function() {
        RuleService.setPrevPath('rule');
        RuleService.setSelectedChannel($scope.selectedChannel);
        RuleService.setSelectedOrgId($scope.selectedOrgId);
        RuleService.setSelectedStatus($scope.selectedStatus);
        $state.go('dashboard.notGeneratedRules');
        RuleService.setEditFlag(null);
        RuleService.setCopyFlag(null);
    }
	$scope.setFlag = function(selectedRole){
		if(selectedRole){
			$scope.showOrganisation = true;
			$scope.getRoleBaseOrganisation(selectedRole);
			$scope.msg_flag = false;
		}
	}
	
	$scope.setMessageFlag = function(message){
		$scope.notes_msg_flag = false;
		$scope.organisation = message;
	}
	
	$scope.checkcardNumber = function(cardNumber){
		if(typeof cardNumber == "undefined"){
		$scope.cardNoMsg = true;	
		}else{
		$scope.cardNoMsg = false;
		 $scope.lengthMsg = false;
		}
	}
	$scope.getMyActivityReports = function(){
		$state.go('dashboard.getmyactivityreports');
	}
	
	//Start Charge Back
	$scope.checkChargeBack = function(){
		
		$scope.cardNumber = null;
		$scope.cardNumber1 = null
		$scope.cardNoMsg = null;
		 $scope.lengthMsg = false;
		 //$state.go('dashboard.checkchargeback');
		 if($location.path() != "/dashboard/createchargeback" || $location.path() != "/dashboard/viewcharegeback"){
			
			 angular.element(document.querySelector("#chargeback")).removeClass("open");
			angular.element("#chargeback-submenu").css('display','none');
		 }
	    $ngConfirm({
					title : 'Check CHARGE BACK',
					theme : 'Material',
					//icon : 'fa fa-check',
					content: `<span class="alert_text">Enter Card Number:</span><input type="number"  class="cases_status" style="width:100%" ng-model="cardNumber"  ng-change="checkcardNumber(cardNumber)"><span  class="error_user_msg" ng-if="cardNoMsg">Please enter card number</span><span class="error_user_msg" ng-if="lengthMsg">Invalid Length</span>`,
					scope : $scope,
								buttons : {
									Ok : {
										text : 'Enter',
										btnClass : 'btn-red',
										action : function(
												scope,
												button) {
											 if($scope.cardNumber == null || typeof $scope.cardNumber == "undefined"){	
												   $scope.cardNoMsg = true;													  
												   return false;													  
										        }											
											 else{	
												 $scope.cardNumber1 = $scope.cardNumber.toString();
												 if($scope.cardNumber1.length <14){
													 
													 $scope.lengthMsg = true;
													 return false;	
												 }
												 if($scope.cardNumber1.length >19){
													 
													 $scope.lengthMsg = true;
													 return false;	
												 }
												 
												 $scope.cardNoMsg = false;										        											        	
												 chargeBack.header(localStorage.getItem("sessionToken")).checkCardNumber(
										        			{cardnumber:$scope.cardNumber},
															function(data) {
										        				$scope.cardNoMsg = false;
																$scope.cardNumber = null;
																$scope.lengthMsg = false;
																if(data.response == true){
																toastr.success("Chargeback found by specific cardNo", Msg.hurrah);
																}else{
																	toastr.error(data.message, Msg.hurrah);
																}
															},
															function(err) {
																$scope.cardNoMsg = false;
																$scope.cardNumber = null;
																$scope.lengthMsg = false;
																
															});
										        	
										        }
											
											
										}
									},
									
									Cancel : {
										text : 'Cancel',
										action : function(
												scope,
												button) {
											$scope.cardNoMsg = false;
											$scope.cardNumber = null
										}
									},
									
									 
								}
								  
								
							});
						
	}
	//End Charge Bck
	
	 $scope.roleDisplay = function(role){
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
	 
	$scope.resetRole = function(){
		if($location.path() != "/dashboard/createPermission" || $location.path() != "/dashboard/editPermission" || $location.path() != "/dashboard/unapprovedRoleList" || $location.path() != "/dashboard/resetroleapprove"){
			
			 angular.element(document.querySelector("#role")).removeClass("open");
			angular.element("#role-submenu").css('display','none');
		 }
		$scope.getAllRoles();
		$scope.usermodel = null;
		$scope.message = null;
		 $scope.msg_flag = false;
		 $scope.notes_msg_flag = false;
		 $scope.showOrganisation = false;
		 $scope.organisation = null;
		 $scope.resetrolenotes = null;
	    $ngConfirm({
					title : 'Reset Roles',
					theme : 'Material',
					//icon : 'fa fa-check',
					content: `<span class="alert_text">Please select the role:</span><select class="cases_status" style="width:100%" ng-model="usermodel"  ng-change="setFlag(usermodel)"><option style="display:none" value="" selected>-- choose an option --</option><option class="upperCases" ng-repeat="role in roles" value="{{role}}">{{roleDisplay(role)}}</option></select><span  class="error_user_msg" ng-if="msg_flag">Please select a role</span>
						<span class="alert_text" ng-if = "showOrganisation">Please select the organisation:</span><select style="width:100%" ng-if = "showOrganisation" class="cases_status"  ng-model="message"    ng-change="setMessageFlag(message)"><option style="display:none" value="" selected>-- choose an option --</option><option ng-repeat="item in banknNames" value="{{item.orgId}}">{{item.name}}</option></select><span class="error_user_msg" ng-if="notes_msg_flag">Please select a organisation</span>
						<span class="alert_text">Notes:</span><textarea class="admin_input2" ng-model="resetrolenotes"  placeholder="Comments..." name="rolenotes"></textarea>`,
					scope : $scope,
								buttons : {
									Ok : {
										text : 'Reset',
										btnClass : 'btn-red',
										action : function(
												scope,
												button) {
										
											 if($scope.usermodel == null || $scope.organisation == null){
												 
												 if($scope.usermodel == null){
													    $scope.msg_flag = true;
													  } if($scope.showOrganisation && $scope.organisation == null){
														  
														  $scope.notes_msg_flag = true;
													  }
													  return false;
													  
										        }
											
											 else{
												 	
										        	$scope.msg_flag = false;
										        	
										        	$scope.notes_msg_flag = false;
										        	var obj = {}
										        	obj.createdBy = commonDataService.getLocalStorage().userEmail;
										        	obj.creationNotes = $scope.resetrolenotes;
										        	AdminService.header(localStorage.getItem("sessionToken")).resetRoles(
										        			{role:$scope.usermodel,orgId:$scope.organisation},obj,
															function(data) {
																$scope.showOrganisation = false;
																$scope.message = null
																$scope.usermodel = null;
																toastr.success("Request For Resetting The Selected Role Submitted Successfully.", Msg.hurrah);
																if($location.path() == "/dashboard/resetroleapprove"){
																	$rootScope.getUnapprovedResetRole();
																}
																$scope.message='';
															},
															function(err) {

																
															});
										        	
										        }
											
											
										}
									},
									
									Cancel : {
										text : 'Cancel',
										action : function(
												scope,
												button) {
											$scope.usermodel = null;
											$scope.message = null;
											$scope.resetrolenotes = null;
										}
									},
									
									 
								}
								  
								
							});
						
	}
	
	$scope.base64ToArrayBuffer = function (base64) {
	    var binaryString = window.atob(base64);
	    var binaryLen = binaryString.length;
	    var bytes = new Uint8Array(binaryLen);
	    for (var i = 0; i < binaryLen; i++) {
	       var ascii = binaryString.charCodeAt(i);
	       bytes[i] = ascii;
	    }
	    return bytes;
	 }
	
	$scope.saveByteArray = function(reportName, byte) {
	    var blob = new Blob([byte], {type: "application/pdf"});
	    var link = document.createElement('a');
	    link.href = window.URL.createObjectURL(blob);
	    var fileName = reportName;
	    link.download = fileName;
	    link.click();
	};
	
	$scope.downloadRuleWiki = function(){
		casesManagement.header().downloadReports({},function(data) {	
			var sampleArr = $scope.base64ToArrayBuffer(data.response);
			$scope.saveByteArray("Rule Wiki", sampleArr);

		},function(err){
			
		});
	}
	
	$scope.getAllRoles = function(){
		$scope.roles = [
			"ROLE_NPCI_APPLICATION_ADMIN",
		    "ROLE_NPCI_APPLICATION_ANALYSTS",
		    "ROLE_NPCI_APPLICATION_SUPERVISOR",
		    "ROLE_BANK_ADMIN",
		    "ROLE_BANK_ANALYSTS",
		    "ROLE_BANK_SUPERVISOR"
		]
		
		/*AdminService.header({token : localStorage.getItem("sessionToken")}).getRoles({orgId: commonDataService.getLocalStorage().orgId },function(data) {
            $scope.roles=data.response;       
        },function(err){
        	$scope.roles = [];
        });*/
	}
	
	$scope.getRoleBaseOrganisation = function(selectedRole){
		AdminService.header({token: localStorage.getItem("sessionToken")}).bankNames({role:selectedRole}, function (data) {
            $scope.banknNames = [];
            $scope.banknNames = data.response;
            //$scope.showBanknameDropdown = true;
        }, function (err) {
            $scope.banknNames = [];
        });
	}
	
	$scope.openNav2 = function() {
		$scope.visible = false;
	};
	
	$scope.closeMenu = function(){
		$scope.visible = false;
	}
	
	 $scope.isSessionValid = function(){
			UserService.header({}).session({}, function(data){				
			}, function(err){});
		}
	
		$scope.createRule = function(){
			RuleService.setEditFlag(null);
			RuleService.setCopyFlag(null);
		}
}]);
