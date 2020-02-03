'use strict';

angular.module('efrm.dashboard')
	   .controller('viewRuleSetController',['$scope','$state','statusService','$location','RolePermissionMatrix','$ngConfirm','toastr','Msg','Session','ruleSetManagement','RuleService','commonDataService','editPermission',function($scope, $state, statusService, $location,RolePermissionMatrix, $ngConfirm, toastr, Msg,Session, ruleSetManagement, RuleService,commonDataService, editPermission) {
			$scope.pageTitle="View Ruleset";
			$scope.goBackView=function () {
	             $state.go('dashboard.viewRuleSets');
	         }
			
			$scope.getRuleSet = function() {

				// $scope.formParams.parentRuleSet.orgId=RuleService.getRuleSet().orgId
				$scope.rulesetName = RuleService.getRuleSet().rulesetName

				ruleSetManagement.header({}).getRuleSetDtl({
									ruleSetName : RuleService.getRuleSet().rulesetName,
									orgId : RuleService.getRuleSet().orgId
								},
								function(data) {
									console.log('rule set view ',data)
									$scope.rulesetDtl = data.response;
									RuleService.setEditFlagForRuleSet(null)
									RuleService.setViewFlagForRuleSet(null)
								//	toastr.success("Ruleset Loaded Successfully",Msg.oops);
								},
								function(err) {
									// console.log(err)
									toastr.error("Failed to load Ruleset",Msg.oops);
								});

			}
			
			$scope.getRuleSet()
			
			
		}])
		