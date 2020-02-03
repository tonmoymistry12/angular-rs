'use strict';

angular
		.module('efrm.dashboard')
		.controller(
				'createRuleSetsController',
				[
						'$scope',
						'$state',
						'statusService',
						'$location',
						'RolePermissionMatrix',
						'$ngConfirm',
						'toastr',
						'Msg',
						'Session',
						'ruleSetManagement',
						'RuleService',
						'commonDataService',
						'editPermission',
						function($scope, $state, statusService, $location,
								RolePermissionMatrix, $ngConfirm, toastr, Msg,
								Session, ruleSetManagement, RuleService,
								commonDataService, editPermission) {

							console.log('VIEW ', RuleService
									.getViewFlagForRuleSet())
							console.log('EDIT ', RuleService
									.getEditFlagForRuleSet())
							console.log('ruleset detail ', RuleService
									.getRuleSet())
								//alert(RuleService.getEditFlagForRuleSet())	
								$scope.isEdit=(RuleService.getEditFlagForRuleSet()!=null)?true:false
									//	alert($scope.isEdit)
								//	$scope.isEdit=true

							function loadOrganizations() {
								editPermission.header(
										{
											token : localStorage
													.getItem("sessionToken")
										}).bankNamesOrgId(
										{
											orgId : commonDataService
													.getLocalStorage().orgId
										}, function(data) {
											$scope.bankList = data.response;
										}, function(err) {
											$scope.bankList = [];
										});

							}
							loadOrganizations();

							$scope.newRuleSet = [];
							$scope.showAvailableRules = false;

							function getAvailableRules() {
								$scope.formParams.ruleIds = [];
							//	$scope.newRuleSet=[];
								if ($scope.formParams.parentRuleSet.orgId!=undefined) {
									
									ruleSetManagement
											.header({})
											.getAvailableRules(
													{
														orgId : $scope.formParams.parentRuleSet.orgId
													},
													function(data) {
														$scope.showAvailableRules = true;
														console.log('availableRules - ',data)
																		if(data.response!=undefined){
																			$scope.availableRules = data.response
																		}else{
																			$scope.availableRules='';
																		}
														
														toastr
																.success(
																		"Rule List Successfully Loaded",
																		Msg.hurrah);
													},
													function(err) {
														// console.log(err)
														toastr
																.error(
																		"Rule List Failed",
																		Msg.oops);
													});
								
								} else {
									$scope.showAvailableRules = false;
									$scope.availableRules = [];
									$scope.formParams.ruleIds = [];
								}
							}

							$scope.showAvailableRuleSet = false;

							function getAvailableRuleSets() {
								$scope.showAvailableRulefromSet = false;
								$scope.availableRulesFromSet=[];
								
								$scope.formParams.parentRuleSet.ruleIds=[];
								
								$scope.formParams.parentRuleSet.rulesetName='';
								// console.log('orgId - ', $scope.orgId);
								if ($scope.formParams.parentRuleSet.orgId!=undefined) {
									ruleSetManagement
											.header({})
											.getRuleSets(
													{
														orgId : $scope.formParams.parentRuleSet.orgId,
														status : 'ACTIVE'
													},
													function(data) {
														$scope.showAvailableRuleSet = true;
														console
																.log(
																		'availableRuleSET - ',
																		data)
														$scope.availableRuleSet = data.response
														toastr
																.success(
																		"Rule Set List Successfully Loaded",
																		Msg.hurrah);
													},
													function(err) {
														// console.log(err)
														toastr
																.error(
																		"Rule Set List Failed",
																		Msg.oops);
													});
								} else {
									$scope.showAvailableRuleSet = false;
									
									
									
								}
								
							}

							$scope.orgChange = function() {
								$scope.formParams.srcOrgId=$scope.formParams.parentRuleSet.orgId
								getAvailableRules();
								getAvailableRuleSets();
							}

							$scope.ruleSetName = function(a) {
								console.log(a)
							}
							$scope.showAvailableRulefromSet = false;
							$scope.getRulesFromSet = function() {
								$scope.formParams.parentRuleSet.ruleIds=[]
								
								if($scope.formParams.parentRuleSet.rulesetName!=undefined){
									if ($scope.formParams.parentRuleSet.rulesetName.length>0) {
										
										console.log('ruleSetId - ',$scope.formParams.parentRuleSet.rulesetName);
										ruleSetManagement
												.header({})
												.getRulesFromSet(
														{
															ruleSetName : $scope.formParams.parentRuleSet.rulesetName,
															orgId : $scope.formParams.parentRuleSet.orgId,
															actionType:(RuleService.getEditFlagForRuleSet()!=null)?"edit":"create"
														},
														function(data) {
															$scope.showAvailableRulefromSet = true;
															console
																	.log('availableRulesFromSet - ',data)
															$scope.availableRulesFromSet = data.response
															toastr
																	.success(
																			"Rules List Successfully Loaded",
																			Msg.hurrah);
														},
														function(err) {
															// console.log(err)
															toastr
																	.error(
																			"Rules List Failed",
																			Msg.oops);
														});
									} else {
										$scope.showAvailableRulefromSet = false;
										$scope.availableRulesFromSet = [];
									//	$scope.newRuleSet=[];
										$scope.formParams.parentRuleSet.ruleIds=[];
										
									}
								}
								

							}

							function filter_array(test_array) {
								var index = -1, arr_length = test_array ? test_array.length
										: 0, resIndex = -1, result = [];

								while (++index < arr_length) {
									var value = test_array[index];

									if (value) {
										result[++resIndex] = value;
									}
								}

								return result;
							}

							$scope.addRule = function(a, b) {

								var selectedAvailableRules, selectedRulesFrmSet, selectedRules;
								if (b === 'AR') {
									$scope.formParams.ruleIds = a

								} else if (b === 'AS') {
									$scope.formParams.parentRuleSet.ruleIds = a

								}
								selectedAvailableRules = $scope.formParams.ruleIds
										|| null

								selectedRulesFrmSet = $scope.formParams.parentRuleSet.ruleIds
										|| null

								if (selectedAvailableRules === null) {
									selectedRules = $scope.formParams.parentRuleSet.ruleIds
								} else {
									selectedRules = selectedAvailableRules
											.concat(selectedRulesFrmSet);
								}

								// console.log(filter_array(selectedRules));
								$scope.newRuleSet = filter_array(selectedRules)
								// $scope.newRuleSet=a

							}

							$scope.removeRule = function(rule) {

								// console.log(rule)
								if ($scope.formParams.ruleIds.indexOf(rule) != -1) {
									// console.log('has')
									$scope.formParams.ruleIds.splice(
											$scope.formParams.ruleIds
													.indexOf(rule), 1);
								} else if ($scope.formParams.parentRuleSet.ruleIds
										.indexOf(rule) != -1) {
									$scope.formParams.parentRuleSet.ruleIds
											.splice(
													$scope.formParams.parentRuleSet.ruleIds
															.indexOf(rule), 1)
								} else {

								}
								$scope.newRuleSet.splice($scope.newRuleSet
										.indexOf(rule), 1)

							}

							var orgId = commonDataService.getLocalStorage().orgId;
							
							var userId = commonDataService.getSessionStorage().userId;

							$scope.formParams = {
								"createdBy" : userId,
								// "orgId": $scope.formParams.orgId,
								"parentRuleSet" : {
								// "orgId": orgId,
								// "ruleIds":
								// $scope.formParams.parentRuleSet.ruleIds,
								// "rulesetName": $scope.ruleSets
								},
								// "ruleIds": $scope.newRuleSet,
								// "rulesetName":$scope.formParams.rulesetName,
							//	"srcOrgId":$scope.formParams.parentRuleSet.srcOrgId,
								//"orgId" : orgId,
								"status" : "PENDING_REVIEW"
							}
							$scope.formParams.orgId = orgId
							$scope.getRuleSet = function() {

								// $scope.formParams.parentRuleSet.orgId=RuleService.getRuleSet().orgId
								$scope.formParams.parentRuleSet.rulesetName = RuleService
										.getRuleSet().rulesetName

								/*
								 * getAvailableRules(); getAvailableRuleSets();
								 * $scope.getRulesFromSet()
								 */

								// $scope.showAvailableRulefromSet=true;
								ruleSetManagement
										.header({})
										.getRuleSet(
												{
													ruleSetName : RuleService
															.getRuleSet().rulesetName,
													orgId : RuleService
															.getRuleSet().orgId
												},
												function(data) {
													console.log('rule set view/edit response data ',data.response)
													var mergedObject = angular
															.merge(
																	$scope.formParams,
																	data.response);
													$scope.formParams = mergedObject

													getAvailableRules();
													getAvailableRuleSets();
													
													$scope.formParams.parentRuleSet.rulesetName=data.response.parentRuleSet.rulesetName
													$scope.getRulesFromSet()
													$scope.formParams.ruleIds=data.response.ruleIds
													$scope.formParams.parentRuleSet.ruleIds=data.response.parentRuleSet.ruleIds
													$scope.addRule();
													
													console.log('rule set view/edit ',$scope.formParams)
													RuleService.setEditFlagForRuleSet(null)
													
												},
												function(err) {
													// console.log(err)
													toastr.error(
															"Rule set Failed",
															Msg.oops);
												});

							}

							if (RuleService.getViewFlagForRuleSet() === 'true'
									|| RuleService.getEditFlagForRuleSet() === 'true') {
								$scope.getRuleSet()
							}

							if (RuleService.getEditFlagForRuleSet() === 'true') {
								$scope.pageTitle = "Edit Rule Set"
							} else {
								$scope.pageTitle = "Create Rule Set"
							}

							function createRuleSet(config) {

								if ($scope.isEdit) {
									console.log('EDIT Ruleset ', config)
									ruleSetManagement.header({}).editRuleSet(
											{
												channel : null,
												orgId : null
											},
											config,
											function(data) {
												RuleService.setEditFlagForRuleSet(null)
												toastr.success(data.response.data,Msg.hurrah);
												$state.go('dashboard.viewRuleSets');
											},
											function(err) {
												// console.log(err)
												toastr.error("Ruleset Edit Failed",Msg.oops);
											});

								} else {
									console.log('Create Ruleset ', config)
									ruleSetManagement
											.header({})
											.createRuleSet(
													{
														channel : null,
														orgId : null
													},
													config,
													function(data) {
														toastr.success(data.response.data,Msg.hurrah);
														$state.go('dashboard.viewRuleSets');
													},
													function(err) {
														// console.log(err)
														toastr
																.error(
																		"Ruleset Creation Failed",
																		Msg.oops);
													});
								}

							}
							$scope.submitForm = function() {

								createRuleSet($scope.formParams)
							}

						} ])
		.directive('ngSpace', function() {
			return function(scope, element, attrs) {
				element.bind("keydown", function(event) {
					if (event.keyCode == 32)
						event.preventDefault();
				});
			};
		})
		.directive(
				'uniqueRuleSetName',
				function(ruleSetManagement, commonDataService) {
					return {
						restrict : 'A',
						require : 'ngModel',
						link : function(scope, element, attrs, ngModel) {
							element
									.bind(
											'blur',
											function(e) {

												if (!ngModel || !element.val())
													return;
												// var keyProperty =
												// scope.$eval(attrs.uniqueRuleName);
												var orgId = commonDataService
														.getLocalStorage().orgId;
												var currentValue = element
														.val();

												ruleSetManagement
														.header({})
														.checkUniqueRuleSetName(
																{
																	ruleSetName : element
																			.val(),
																	orgId : orgId
																},
																function(unique) {
																	 console.log('duplicaterule id ',unique.response)
																	if (unique.response === false && element.val().length > 0) {
																		ngModel.$setValidity('unique',true);
																	} else {
																		ngModel.$setValidity('unique',false);
																	}
																},
																function(err) {

																});

											});
						}
					}
				})