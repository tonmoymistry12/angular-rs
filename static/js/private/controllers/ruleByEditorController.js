'use strict';

angular.module('efrm.dashboard')
    .controller('ruleByEditorController',  ['$scope', '$state','statusService','$location','RolePermissionMatrix','$ngConfirm','toastr','Msg','Session','ruleManagement','RuleService','ruleEditorManagement',function($scope, $state, statusService,$location,RolePermissionMatrix,$ngConfirm,toastr,Msg,Session,ruleManagement,RuleService,ruleEditorManagement) {
    
    	 $scope.goBackView=function () {
    		 if(RuleService.getViewRuleComeFrom()!='Draft'){
    			 $state.go('dashboard.viewRule');
    		 }else{
    			 $state.go('dashboard.notGeneratedRules');
    		 }
         }
    	
    	 var isEdit = RuleService.getEditFlag()||null
    	 var isView = RuleService.getCopyFlag()
    	// alert(isView)
    	 $scope.pageLabel = function(){
    		 
    		 if(isEdit=='true'){
    			 return "Edit Rule"
    		 }else if(isView=='true'){
    			 return "Copy Rule"
    		 }else if(isView=='false'){
    			 return "View Rule"
    		 }else{
    			 return "Create Rule" 
    		 }
    		 
    	 }
    	 
    	//  console.log(RuleService.getRules().ruleName)
    	  $scope.getRule = function() {
                	
                 //   $scope.formParams.ruleName = RuleService.getRules().ruleName
                   
                    ruleEditorManagement.header({}).getRule({
                        ruleId: RuleService.getRules().ruleName,
                        orgId:RuleService.getRules().orgId
                    }, function(data) {
                        //var viewservice = RuleService.getCopyFlag()
                    	$scope.ruledata = data.response
                   
                        toastr.success("Rule Successfully Loaded", Msg.hurrah);
                    	
                    }, function(err) {
                      //  console.log(err)
                        toastr.error("Rule List Failed", Msg.oops);
                    });
                    
                }
    	//  $scope.getRule()
    	 
    }])
