(function () {
	'use strict';
	angular.module('rule').
	directive('rulePayee', function () {
		return {
			restrict: 'E',
			scope: {
				payeefilter: '=',
				metadata: '=',
				mandatory:"="
			},
			controller: function ($scope, ruleDataService, $filter,toastr, Msg,$window) {
            	$window.scrollTo(0, 0);
			
				$scope.jurisdictionInternational = false;
				$scope.jurisdictionDomistic = false;

				$scope.payeeJuridictionChange = function (juridiction) {

					if ($scope.jurisdictionInternational) {
						$scope.payeefilter.jurisdiction = juridiction
					} else if ($scope.jurisdictionDomistic) {
						$scope.payeefilter.jurisdiction = juridiction
					} else {
						delete $scope.payeefilter.jurisdiction
					}
				}


				$scope.mccType = "normal"
					
				$scope.mccTypeChange = function () {
					$scope.mccList = $filter('filter')(ruleDataService.getMcc(), {
						type: $scope.mccType
					});
				}
				
				$scope.mccDesc=function(mcc){
					
					var desc = ruleDataService.getMccDesc().filter(function (mcclist) {
					    return (mcclist.name == mcc);
					});
					return desc[0].desc;
				}
				
				$scope.mccList = $filter('filter')(ruleDataService.getMcc(), {
					type: $scope.mccType
				});

				$scope.businessCriterionChange = function () {
					if ($scope.businessCriterion) {
						$scope.payeefilter.businessCriterion = {}
					} else {
						delete $scope.payeefilter.businessCriterion;
					}
				}

				if ($scope.payeefilter.businessCriterion != undefined) {
					$scope.businessCriterion = true
				}
				$scope.mccTypeIn=false
				$scope.mccTypeNotIn=false
				
				if($scope.payeefilter.mccIn===undefined){
					$scope.payeefilter.mccIn=[]
				}
				
				if($scope.payeefilter.mccNotIn===undefined){
					$scope.payeefilter.mccNotIn=[]
				}
				
				$scope.mccTypeAction = function () {
					var temp=[];
					var inNotIn
					if ($scope.mccTypeIn === true) {
						angular.forEach($scope.selectedMcc, function (value, key) {
							if($scope.payeefilter.mccIn.indexOf(value.split('~')[0])===-1){
								//$scope.payeefilter.mccIn.push(value)
								if($scope.payeefilter.mccNotIn.indexOf(value.split('~')[0])===-1){
									$scope.payeefilter.mccIn.push(parseInt(value.split('~')[0]))	
								}else{
									
									temp.push(value.split('~')[0])
									inNotIn="MccNotIn"
									//toastr.warning(temp +" already added in MccNotIn.", Msg.hurrah);
									//$scope.mccInNotinAlert = temp +" already added in MccNotIn."
								}
							}
							
						})
					} 
					if($scope.mccTypeNotIn === true) {
						angular.forEach($scope.selectedMcc, function (value, key) {
							if($scope.payeefilter.mccNotIn.indexOf(value.split('~')[0])===-1){
								
								if($scope.payeefilter.mccIn.indexOf(value.split('~')[0])===-1){
									$scope.payeefilter.mccNotIn.push(parseInt(value.split('~')[0]))	
								}else{
								//	var temp=[];
									temp.push(value.split('~')[0])	
									inNotIn="MccIn"
								//	toastr.warning(temp +" already added in MccIn.", Msg.hurrah);
									//$scope.mccInNotinAlert = temp +" already added in MccIn."
								}
							}
						})
					}
					if(temp.length>0){
						toastr.warning(temp +" already added in "+inNotIn+".", Msg.hurrah);
					}
					
					$scope.selectedMcc = '';
					$scope.mccTypeIn=false
					$scope.mccTypeNotIn=false
				}

				
				$scope.removeFrmMccIn = function(index) {
					$scope.payeefilter.mccIn.splice(index, 1)
                }
				
				$scope.removeFrmMccNotIn = function(index) {
					$scope.payeefilter.mccNotIn.splice(index, 1)
                }
				
				
				if ($scope.payeefilter.jurisdiction != undefined) {
					if ($scope.payeefilter.jurisdiction === 'Domestic') {
						$scope.jurisdictionDomistic = true;
					} else {
						$scope.jurisdictionInternational = true;
					}
				}
				
				$scope.showMccDesc = function(a){
					console.log(a)
				}
				
				/* dual list box search option  Start*/
				$scope.searchOptionForDualList = {
					selectableHeader: "<input type='text' class='form-control search-input' autocomplete='off' placeholder='search...' style='margin-bottom:10px;'>",
					selectionHeader: "<input type='text' class='form-control search-input' autocomplete='off' placeholder='search...' style='margin-bottom:10px;'>",
					afterInit: function (ms) {
						var that = this,
							$selectableSearch = that.$selectableUl.prev(),
							$selectionSearch = that.$selectionUl.prev(),
							selectableSearchString = '#' + that.$container.attr('id') + ' .ms-elem-selectable:not(.ms-selected)',
							selectionSearchString = '#' + that.$container.attr('id') + ' .ms-elem-selection.ms-selected';

						
						
						
						that.qs1 = $selectableSearch.quicksearch(selectableSearchString)
							.on('keydown', function (e) {
								if (e.which === 40) {
									that.$selectableUl.focus();
									return false;
								}
							});

						that.qs2 = $selectionSearch.quicksearch(selectionSearchString)
							.on('keydown', function (e) {
								if (e.which == 40) {
									that.$selectionUl.focus();
									return false;
								}
							});

						that.$element.data('multiSelect', that);
					},
					afterSelect: function () {
						this.qs1.cache();
						this.qs2.cache();
					},
					afterDeselect: function () {
						this.qs1.cache();
						this.qs2.cache();
					}
				};
				/* dual list box search option  Start*/
			},
			templateUrl: 'templates/private/ruleEditor/directive/payee.html',
			link: function (scope, element, attr) {


				
				
			}
		}
	})
})()