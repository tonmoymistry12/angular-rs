'use strict';

angular.module('efrm.dashboard')
.controller('viewRuleSetsController', ['$scope', '$state', 'statusService', '$location', 'RolePermissionMatrix', '$ngConfirm', 'toastr', 'Msg', 'Session', 'ruleSetManagement', 'RuleService', 'commonDataService', 'editPermission', function($scope, $state, statusService, $location, RolePermissionMatrix, $ngConfirm, toastr, Msg, Session, ruleSetManagement, RuleService, commonDataService, editPermission) {
	var userId =  commonDataService.getSessionStorage().userId;
	$scope.loggedInUser = userId;
	console.log('$scope.loggedInUser - ',$scope.loggedInUser)
    	 function loadOrganizations() {
             editPermission.header({
                 token: localStorage.getItem("sessionToken")
             }).bankNamesOrgId({
                 orgId: commonDataService.getLocalStorage().orgId
             }, function(data) {
                 $scope.bankList = data.response;
             }, function(err) {
                 $scope.bankList = [];
             });

         }
         loadOrganizations();
        $scope.orgId=commonDataService.getLocalStorage().orgId
        $scope.showPagination = false;
    	$scope.getRuleSets=function() {
           
            if ($scope.orgId.length > 0) {
                ruleSetManagement.header({}).getRuleSets({
                    orgId: $scope.orgId
                }, function(data) {
                    console.log('availableRuleSET - ', data)
                    if(data.response!=undefined){
                    	$scope.ruleSets = data.response
                    	if($scope.ruleSets.length>0){
                    		$scope.showPagination = true
                    	}else{
                    		$scope.showPagination = false
                    	}
                    }else{
                    	$scope.ruleSets ="";
                    	$scope.showPagination = false
                    }
                    
                    toastr.success("Rule Set List Successfully Loaded", Msg.hurrah);
                }, function(err) {
                    //  console.log(err)
                    toastr.error("Rule Set List Failed", Msg.oops);
                });
            } else {
                $scope.showAvailableRuleSet = false;
                $scope.availableRuleSet = [];
            }
        }
    	
        $scope.getRuleSets()
        
        
    	 $scope.editRuleSetDetail=function(ruleSet){
             // $scope.data=[];
              RuleService.setRuleSet(ruleSet);
            //  RuleService.setCreateFlag($location.url());
              RuleService.setEditFlagForRuleSet('true');
              RuleService.setViewFlagForRuleSet(null);
              $state.go('dashboard.createRuleSets');
          }
    	 $scope.viewRuleSetDetail=function(ruleSet){
             // $scope.data=[];
              RuleService.setRuleSet(ruleSet);
            //  RuleService.setCreateFlag($location.url());
              RuleService.setEditFlagForRuleSet(null);
              RuleService.setViewFlagForRuleSet('true');
              $state.go('dashboard.viewRuleSet');
          }
    	 
    	 
    	 function updateRuleSet(config) {
    		 config = JSON.parse(angular.toJson(config));
    		 console.log('EDIT Ruleset ', config)
				ruleSetManagement.header({}).UpdateRuleSetsStatus({
						channel: null,
						orgId: null
					},
					config,
					function (data) {

					toastr.success(data.response.data,Msg.hurrah);
					
					RuleService.setViewFlagForRuleSet(null)
					$scope.getRuleSets()
					},
					function (err) {
						// console.log(err)
						toastr.error(
							"Ruleset Edit Failed",
							Msg.oops);
					});

			}
    	 
    	 $scope.decisionModel = function(ruleSet, type) {
    		 $scope.ruleSetForStatusUpdate=ruleSet
    		 
             $scope.type = type;
    		 
             console.log('$scope.ruleSetForStatusUpdate - ',$scope.ruleSetForStatusUpdate)
            // $scope.modelContent = '';
             if ($scope.type === "ACTIVE") {
                 $scope.modalTitle = 'ACTIVE';
                 $scope.modelContent = 'Do You Want To Active?';
             }

             if ($scope.type === "DEACTIVATE") {
                 $scope.modalTitle = 'DEACTIVATE';
                 $scope.modelContent = 'Do You Want To De-Active?';
             }
             
             if ($scope.type === "REJECTED") {
                 $scope.modalTitle = 'REJECTED';
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
                         text: 'OK',
                         btnClass: 'btn-red',
                         action: function(scope, button) {
                        	 $scope.ruleSetForStatusUpdate.status=$scope.type;
                        	// console.log('$scope.ruleSetForStatusUpdate rrr - ',$scope.ruleSetForStatusUpdate)
                        	 updateRuleSet($scope.ruleSetForStatusUpdate)
                         }
                     },
                     Cancel: {
                         text: 'Cancel'
                     }
                 }
             });
         }
    }])