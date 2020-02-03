'use strict';

angular.module('efrm.dashboard')
    .controller('viewSimulationController',  ['$scope', '$state','statusService','$location','RolePermissionMatrix','$ngConfirm','toastr','Msg','Session','ruleManagement','RuleService','commonDataService','ngDialog',function($scope, $state, statusService,$location,RolePermissionMatrix,$ngConfirm,toastr,Msg,Session,ruleManagement,RuleService,commonDataService,ngDialog) {
    
    	 var userId = commonDataService.getSessionStorage().userId
    	
    	 $scope.goBackView=function () {
             $state.go('dashboard.viewRule');
         }
    	 
    	 $scope.getSimulateRules = function(){
    	//	 $scope.notGenRules=ruleEditorManagement.getNotGenRules()
    		 
    		ruleManagement.header().simulateRuleGetResult({userId:userId},function(response){
    			// console.log('Simulate ', response)
    			 if(response.response!=undefined){
    				 $scope.simulations=response.response;
        			 $scope.pageSize="50";
    			 }
                
            },function (err) {

            })
    		 
    	 }
    	 
    	 $scope.ruleIdFromList = function(rule){
    		 if(rule.split("_").pop()==='NPCI'){
    			 return rule.split("_"+rule.split("_").pop())[0]
    		 }else{
    			 return rule
    		 }
    	 }
    	
    	 $scope.getSimulateRules();
    	 
    	 $scope.viewDetail = function(rule){
    		 

    		 $scope.ruleInfo = rule
    		 $scope.hasChampion = rule.chamapion!=null?true:false;
    		 var dataSource = [{
    			    state: "Alert Count",
    			    Champion: $scope.hasChampion?rule.chamapion.alertCount:'',
    			    Challenger:rule.challenger.alertCount
    			}, {
    			    state: "Average Time",
    			    Champion: $scope.hasChampion?rule.chamapion.avgExecTime:'',
    			    Challenger:rule.challenger.avgExecTime
    			},{
    			    state: "Max. Time",
    			    Champion: $scope.hasChampion?rule.chamapion.maxExecTime:'',
    			    Challenger:rule.challenger.maxExecTime
    			}];
    		 
	    		 ngDialog.open({
	                 template: 'templateId',
	                 className: 'ngdialog-theme-default dialogwidth600',
	                 scope: $scope
	             });
	    		 
	        	 $scope.chartOptions = {
	     		        palette: "soft",
	     		        dataSource: dataSource,
	     		        commonSeriesSettings: {
	     		            ignoreEmptyPoints: false,
	     		            argumentField: "state",
	     		            type: "bar"
	     		        },
	     		        series: [
	     		            { valueField: "Challenger", name: rule.challenger.ruleName },
	     		            { valueField: "Champion", name: $scope.hasChampion?rule.chamapion.ruleName:'' }
	     		        ],
	     		        legend: {
	     		            verticalAlignment: "bottom",
	     		            horizontalAlignment: "center"
	     		        },
	     		        "export": {
	     		            enabled: false
	     		        },
	     		        title: "Simulation Report"
	     		    };
    		 
    	 }
    	 
    	 

    }])
    .filter('milliSecondsToTimeCode', function () {
    return function msToTime(duration) {
        var milliseconds = parseInt((duration % 1000) / 100)
            , seconds = parseInt((duration / 1000) % 60)
            , minutes = parseInt((duration / (1000 * 60)) % 60)
            , hours = parseInt((duration / (1000 * 60 * 60)) % 24);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        return hours + ":" + minutes + ":" + seconds;
    };
});
    
