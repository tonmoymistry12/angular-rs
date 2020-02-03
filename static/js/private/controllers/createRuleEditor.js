'use strict';

angular.module('efrm.dashboard')
    .controller('createRuleEditor',  ['$scope', '$state','statusService','$location','RolePermissionMatrix','$ngConfirm','toastr','Msg','Session','ruleManagement','RuleService',function($scope, $state, statusService,$location,RolePermissionMatrix,$ngConfirm,toastr,Msg,Session,ruleManagement,RuleService) {
    	$scope.pageLabel="Rule by editor";
    	
    	$scope.ruleDetail ={
    			mode:"editt",
    			ruleId:"12345678"
    	};
    	
    }])
