'use strict';
angular.module('efrm')
.controller('configurationController', ['$scope', 'Configuration', '$ngConfirm', 'Util', 'Session', 'Msg', 'toastr', 'DataService', 'UserService', 'CreditLimit','commonDataService',
function($scope, Configuration, $ngConfirm, Util, Session, Msg, toastr, DataService, UserService, CreditLimit, commonDataService){
	$scope.moment = Util.moment;
	$scope.flag = false;
	$scope.showMsg = false;
	$scope.selectedCofig = 'CLT';
	$scope.records = [];
	$scope.parameters = [];
	$scope.page = {pageNo:1, pageSize: 10};
	$scope.page.timeline = 'past';
	$scope.displayValue = 'Credit Limit';
	$scope.delemeter = '$';
	$scope.parameters = _.filter(DataService.getParameters(),{'parameterType' : 'PRD'});
	$scope.ds = DataService;
	$scope.bfrFrequency ='0';	
	$scope.$watch('selectedCofig', function(oldvalue, newvalue){
		$scope.page = {pageNo:1, pageSize: 10};
		$scope.currentPage = 1;
		$scope.records = [];
	});
	$scope.showErr = function(){
		if(angular.element('#config').get(0).value != undefined || angular.element('#config').get(0).value != ''){
			$scope.showMsg = false;
		}
		
	}
	
	$scope.fetchConfig = function(timeline, pageNo){
		$scope.displayValue = _.filter($scope.parameters,{'parameterType' : 'PRD','parameterName' : $scope.selectedCofig})[0].parameterDescription;
		switch($scope.selectedCofig){
			case 'APR' :
			case 'PAPR':
				$scope.percentage = true;
				$scope.dollar = false;
				$scope.delemeter = '%';
				break;
			default : 
				$scope.percentage = false;
				$scope.dollar = true;
				$scope.delemeter = '$';
		}		
		$scope.page.timeline = timeline;
		Configuration.header().fetch({key : $scope.selectedCofig, pageNo:pageNo, pageSize:$scope.page.pageSize, timeline : $scope.page.timeline},
			function(data){
				$scope.active =  data.response.response;
				$scope.records =  data.response.records;

				$scope.totalItems = data.response.totalRecords;
				$scope.page.timeline = $scope.page.timeline ? $scope.page.timeline : 'past';
		}, function(err){});
	}
	$scope.fetchTimelineConfig = function(){
		$scope.displayValue = _.filter($scope.parameters,{'parameterType' : 'PRD','parameterName' : $scope.selectedCofig})[0].parameterDescription;
		switch($scope.selectedCofig){
			case 'APR' :
			case 'PAPR':
				$scope.percentage = true;
				$scope.dollar = false;
				$scope.delemeter = '%';
				break;
			default : 
				$scope.percentage = false;
				$scope.dollar = true;
				$scope.delemeter = '$';
		}		
		Configuration.header().fetch({key : $scope.selectedCofig, pageNo:$scope.page.pageNo, pageSize:$scope.page.pageSize, timeline : $scope.page.timeline},
			function(data){
				$scope.active =  data.response.response;
				$scope.records =  data.response.records;
				$scope.totalItems = data.response.totalRecords;
				$scope.page.timeline = $scope.page.timeline ? $scope.page.timeline : 'past';
		}, function(err){});
	}
	$scope.setNewConfig = function(){
		UserService.header({}).session({}, function(data){
			var newConfig = $scope.displayValue;
			$scope.modal = $ngConfirm({
				title: 'Setup new ' + newConfig,
				theme: 'Material',
				icon: 'fa fa-cog',
				contentUrl: 'templates/private/newConfig.html',
				scope: $scope,
				onScopeReady: function(scope){
					scope.bfrFrequency='0';
					scope.configValue = '';
					scope.effectiveDate = $scope.moment().add(1, 'days').format();
				},
				buttons: {
					Ok: {
						text: 'Add',
						btnClass: 'btn-red',
						action : function(scope, button){
							var data = {         
								"paramName"     : scope.selectedCofig, 
								"effectiveDate" : scope.effectiveDate,
								"createdBy"		: Session.getLoggedInUser()
							}
							if(scope.selectedCofig != 'BFR'){
								data.paramValue = angular.element('#config').get(0).value;											
							}else{
								data.paramValue = angular.element('#bfrFrequency').get(0).value;
							}
							if(data.paramValue == undefined || data.paramValue == ''){
								scope.showMsg = true;
								return false;
							}
							else{
								scope.showMsg = false;
							}
							Configuration.header().add({}, data, function(data){
								toastr.success(data.message, Msg.hurrah);
								$scope.fetchConfig('past', 1); 
								$scope.configValue = '';	                				
							}, function(err){});
						}
					},
					Cancel: {
						text: 'Cancel',
						action : function(scope, button){
							scope.showMsg = false;
						}
					}
				}
			});
		}, function(err){});
	}
	
	$scope.setRule = function(){
		UserService.header({}).session({}, function(data){
			$scope.cl = {
				
			};
			$scope.modal = $ngConfirm({
				title: 'Credit Limit Approval Rule',
				theme: 'Material',
				icon: 'fa fa-cog',
				contentUrl: 'templates/private/newRule.html',
				scope: $scope,
				onScopeReady: function(scope){
					scope.effectiveDate = scope.moment();
				},
				buttons: {
					Ok: {
						text: 'Submit',
						btnClass: 'btn-red',
						action : function(scope, button){										
							CreditLimit.header().createCLRule({},scope.cl, function(data) {
								toastr.success(data.message, Msg.hurrah);
								$scope.fetchRule();
											
							},function(err){

							});
						}
					},
					Cancel: {
						text: 'Cancel',
						action : function(scope, button){
							scope.showMsg = false;
						}
					}
				}
			});
		}, function(err){});
	}
	$scope.fetchRule = function(){
		UserService.header({}).session({}, function(data){
			CreditLimit.header().fetchCreditLimitRule({}, function(data) {
				$scope.result = data.response.records;
			},function(err){

			});
		}, function(err){});
	}
	//$scope.fetchRule();
	$scope.deleteConfig = function(config){
		UserService.header({}).session({}, function(data){
			$ngConfirm({
				title: 'Are you sure?',
				theme: 'Material',
				icon: 'fa fa-cog',
				content: 'You want to delete the Configuration.',
				scope: $scope,
				buttons: {
					Ok: {
						text: 'Confirm',
						btnClass: 'btn-green',
						action : function(scope, button){
							var data = {         
									"id"       : config, 
									"createdBy": Session.getLoggedInUser()
							}
							Configuration.header().remove({}, data, function(data){
								toastr.success(data.message, Msg.hurrah);
								$scope.fetchConfig($scope.page.timeline, $scope.currentPage);
							}, function(err){});
						}
					},
					Cancel: {
						text: 'Cancel'
					}
				}
			});
		}, function(err){});
	}
	
	$scope.filterBFR = function(val){
		switch(val){
			case "7":
				return 'Weekly (7 Days)';
			case "14":
				return 'Bi-Weekly (14 Days)';
			case "30":
				return 'Monthly (30 Days)';
		}
	}
	
	$scope.loadMoreConfigs = function(){
		$scope.page.pageNo = $scope.currentPage;
		$scope.fetchConfig($scope.page.timeline, $scope.page.pageNo);
	}
	$scope.fetchConfig('past', 1);
	
	$scope.setOption = function(val){
		switch(val){
			case 'p':
				$scope.page.timeline = 'past';
				break;
			case 'f':
				$scope.page.timeline = 'future';
				break;
		}
		$scope.fetchTimelineConfig();
	}
	$scope.page.timeline = 'past';
}]);