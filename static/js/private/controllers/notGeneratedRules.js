'use strict';

angular.module('efrm.dashboard')
    .controller('notGeneratedRulesController',  ['$scope', '$state','statusService','$location','RolePermissionMatrix','$ngConfirm','toastr','Msg','Session','ruleEditorManagement','RuleService','commonDataService',function($scope, $state, statusService,$location,RolePermissionMatrix,$ngConfirm,toastr,Msg,Session,ruleEditorManagement,RuleService,commonDataService) {
    
    	 var userId = commonDataService.getSessionStorage().userId
    	
    	 $scope.goBackView=function () {
             $state.go('dashboard.viewRule');
         }
    	 
    	 $scope.getNotGenRules = function(){
    	//	 $scope.notGenRules=ruleEditorManagement.getNotGenRules()
    		 
    		ruleEditorManagement.header().getNotGenRules({userId:userId},function(response){
    			 if(response.response!=undefined){
	                $scope.notGenRules=response.response;
	                $scope.pageSize="50";
    			 }
            },function (err) {

            })
    		 
    	 }
    	
    	 $scope.getNotGenRules();
    	 
    	 $scope.viewRuleDetail=function(rule){
    		 RuleService.setViewRuleComeFrom('Draft')
             //$scope.data=[];
             RuleService.setRules(rule);
             RuleService.setCreateFlag($location.url());
             RuleService.setCopyFlag('false');
             RuleService.setEditFlag(null);
             $state.go('dashboard.ruleByEditor');
           //  $state.go('dashboard.ruleDetail');
         }
    	 
         $scope.editRuleDetail=function(rule){
        	 RuleService.setViewRuleComeFrom('Draft')
            // $scope.data=[];
             RuleService.setRules(rule);
             RuleService.setCreateFlag($location.url());
             RuleService.setEditFlag('true');
             RuleService.setCopyFlag(null);
             $state.go('dashboard.ruleByEditor');
         }
         
    }])
