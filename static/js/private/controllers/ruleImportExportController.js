'use strict';

angular.module('efrm.dashboard')
		.config(['$compileProvider', function ($compileProvider) {
		    $compileProvider.aHrefSanitizationWhitelist(/^\s*(|blob|):/);
		}])
	   .controller('ruleImportExportController',['$scope','$state','statusService','$location','RolePermissionMatrix','$ngConfirm','toastr','Msg','Session','ruleSetManagement','RuleService','commonDataService','editPermission','ruleEditorManagement','$window',function($scope, $state, statusService, $location,RolePermissionMatrix, $ngConfirm, toastr, Msg,Session, ruleSetManagement, RuleService,commonDataService, editPermission,ruleEditorManagement,$window) {
			$scope.pageTitle="Rules - Export or Import";
			
			$scope.orgId=commonDataService.getLocalStorage().orgId
			
			function loadOrganizations() {
				editPermission.header({token : localStorage.getItem("sessionToken")}).bankNamesOrgId({
							orgId : $scope.orgId
						}, function(data) {
							$scope.bankList = data.response;
						}, function(err) {
							$scope.bankList = [];
						});

			}
			loadOrganizations();
			
			
			
			$scope.orgChange = function(orgId) {
				//$scope.formParams.srcOrgId=$scope.orgId
				$scope.orgId=orgId
				console.log($scope.orgId)
				if($scope.orgId!=undefined){
					getAvailableRules();
				}else{
					$scope.showAvailableRules = false;
					$scope.availableRules='';
				}
				//getAvailableRules();
			}
			
			function getAvailableRules() {
				//$scope.formParams.ruleIds = [];
			//	$scope.newRuleSet=[];
				if ($scope.orgId!=undefined) {
					
					ruleSetManagement.header({}).getAvailableRules({
										orgId : $scope.orgId,
										isEditorOnly:true
									},
									function(data) {
										$scope.showAvailableRules = true;
										console.log('availableRules - ',data)
														if(data.response!=undefined){
															$scope.availableRules = data.response
														}else{
															$scope.availableRules='';
														}
										
										toastr.success("Rule List Successfully Loaded",Msg.hurrah);
									},
									function(err) {
										// console.log(err)
										toastr.error("Rule List Failed",Msg.oops);
									});
				
				} else {
					$scope.showAvailableRules = false;
					$scope.availableRules = [];
					//$scope.formParams.ruleIds = [];
				}
			}
			getAvailableRules()
		
			$scope.addRule=function(ruleIds){
				$scope.ruleIds=ruleIds
			}
			
			function exportFn(config){
				console.log('before post ',config)
				/*var exportedData =config,
					        blob = new Blob([exportedData], { type: 'application/json' }),
					        url = $window.URL || $window.webkitURL;
					    	$scope.fileUrl = url.createObjectURL(blob);*/
				ruleEditorManagement.header({}).exportRules(
						{
							channel : null,
							orgId : null
						},
						config,
						function(data) {
							//console.log(JSON.stringify(data.response.ruleDetails))
							
						//	toastr.success(data.response.data,Msg.hurrah);
							var exportedData =angular.toJson(data),
					        blob = new Blob([exportedData], { type: 'application/json' }),
					        url = $window.URL || $window.webkitURL;
					    	$scope.fileUrl = url.createObjectURL(blob);
						
						},
						function(err) {
							// console.log(err)
							toastr.error("Rule Export Failed",Msg.oops);
						});
			}
			
			$scope.exportBtn = function(){
				var timestamp = new Date().getTime()
				
				$scope.fileName= $scope.orgId+"_"+timestamp+"_rules.json";
				console.log($scope.fileName)
				var ruleIds = {'ruleIds':$scope.ruleIds};
				//ruleIds.push({'ruleIds':$scope.ruleIds})
				exportFn(ruleIds)
				
				console.log($scope.ruleIds)
				 
			}
			
			
			$scope.showContent = function(content){
				$scope.statusOfRuleCreation=[];
		        $scope.content = content;
		        
		    };
		    
		    function saveRuleFn(config){
				console.log('before save ',config)
				ruleEditorManagement.header({}).importedSaveRules(
						{
							channel : null,
							orgId : null
						},
						config,
						function(data) {
							$scope.statusOfRuleCreation = data.response.importStatusList
							
							/*angular.forEach($scope.statusOfRuleCreation, function (value, key) {
						        $scope.array.push({ 'name': value.name.split(',')[0], 'id': value.name.split(',')[1] });
						    });
							console.log($scope.statusOfRuleCreation.split('FrmResponse')[1])
							console.log('error ',data.response.errorMessages)*/
							 $scope.content ="";
							//toastr.success(data.response.data,Msg.hurrah);
							/*if(data.response.errorMessages.length>0){
								toastr.error(data.response.errorMessages,Msg.oops);
							}*/
							//$scope.content="";
							// $state.go('dashboard.viewRule');
						},
						function(err) {
							// console.log(err)
							toastr.error("Rules are not saved",Msg.oops);
						});
				//$scope.content="";
			}
		    $scope.saveRules = function(){
				//var ruleIds = {'ruleIds':$scope.ruleIds};
				//ruleIds.push({'ruleIds':$scope.ruleIds})
		    	
				saveRuleFn($scope.content)
				
				console.log($scope.content)
				 
			}
}])
.directive('onReadFile', function ($parse,toastr,Msg) {
	return {
		restrict: 'A',
        scope: {
            onReadFile : "&"
        },
		link: function(scope, element, attrs) {
			element.on('change', function(e) {
				console.log(e.target.files[0].name)
				
				var fileName = e.target.files[0].name;
		        var idxDot = fileName.lastIndexOf(".") + 1;
		        var extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
		        if (extFile=="json"){
		        	var reader = new FileReader();
					reader.onload = function(e) {
						console.log(e.target.result)
						scope.$apply(function() {
	                       scope.onReadFile({$content:e.target.result});
						});
					};
					reader.readAsText((e.srcElement || e.target).files[0]);
		        }else{
		        	toastr.error('Only json file is allowed!',Msg.oops);
		          
		        } 
				
				
				
				
			});
		}
	};
})
		