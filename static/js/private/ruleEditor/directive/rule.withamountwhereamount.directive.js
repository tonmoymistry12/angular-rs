(function () {
	'use strict';
	angular.module('rule').
	directive('ruleWithAmountWhereAmount', function factory() {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				metadata: '=',
                ruledata: '=',
				withamountfilter: '=',
				whereamountfilter: '=',
				mandatory:"="

			},
			controller: function ($scope, ruleDataService,$window, $filter) {
            	$window.scrollTo(0, 0);
            	
            	console.log('ruledata ', $scope.ruledata)
            	
            	
            	$scope.$watch('ruledata', function (newValue, oldValue, scope) {
            		console.log('newValue', newValue)
            		console.log('oldValue', oldValue)
            		console.log('scope ',scope)
            		console.log('newValue.withAmount.whereAmount.operator ', newValue.withAmount.whereAmount.operator)
            		if(newValue.withAmount.whereAmount.operator && newValue.withCount.whereCount.operator){
        				$scope.andOrReq=true
        			}else{
        				$scope.andOrReq=false
        			}
                })
            	
				
				$scope.isEmpty=true

				if ($scope.withamountfilter.txnValue === undefined) {
					$scope.withamountfilter.txnValue = false;
				}

				if ($scope.withamountfilter.isTotal === undefined) {
					$scope.withamountfilter.isTotal = false;
				}

				if ($scope.withamountfilter.max === undefined) {
					$scope.withamountfilter.max = false;
				}

				if ($scope.withamountfilter.currentMtd === undefined) {
					$scope.withamountfilter.currentMtd = false;
				}

				/*
	            	$scope.withamountfilter.txnValue=false;
	                $scope.withamountfilter.isTotal=false;
	                $scope.withamountfilter.max=false;
	                $scope.withamountfilter.currentMtd=false;
                */
				
				$scope.isAmount = false;
				$scope.isHistoryValue = false;
				$scope.isDayValue = false;
				$scope.isAnyAmt = false;

				$scope.historyValueAmount = false;
				$scope.historyValueAvg = false;
				$scope.historyValueUCL = false;
				$scope.historyValueLCL = false;

				$scope.dayValueAmount = false;
				$scope.dayValueAvg = false;
				$scope.dayValueUCL = false;
				$scope.dayValueLCL = false;

				$scope.withAmtWhereAmtOperators = ruleDataService.getOperatorsNumeric();
				 //$scope.withAmtWhereAmtOperators = $filter('filter')(ruleDataService.getOperators(), {for: 'amount'});
				
				$scope.whereAmtTypeDatas = ruleDataService.getWhereAmtType();
				
				
				function cleanMultiSelect(){
					if(($scope.dayValueAvg && !$scope.isAnyAmt) || ($scope.historyValueAvg && !$scope.isAnyAmt)){
						$scope.isEmpty=true
					}else{
						$scope.isEmpty=false
					}
				}
				
				$scope.changeOpt = function(){
					
					if($scope.whereamountfilter.operator){
						$scope.isAmount = true
					}else{
						$scope.isAmount = true
					}
				}
				
				$scope.resetHistoryDayValue = function () {
					
					delete $scope.whereamountfilter.dayValue
					delete $scope.whereamountfilter.historyValue
					delete $scope.whereamountfilter.amount

					$scope.valueType=[];
					
					$scope.isAnyAmt=false;
					$scope.whereamountfilter.operator='';
					$scope.historyValueAvg = false;
					$scope.historyValueUCL = false;
					$scope.historyValueLCL = false;


					$scope.dayValueAvg = false;
					$scope.dayValueUCL = false;
					$scope.dayValueLCL = false;
					delete $scope.whereamountfilter.types
					
					cleanMultiSelect()
				}
				
				$scope.resetHistoryDayInputs = function(){
					delete $scope.whereamountfilter.dayValue
					delete $scope.whereamountfilter.historyValue
					delete $scope.whereamountfilter.amount
					delete $scope.whereamountfilter.types
					$scope.isAnyAmt=false
					cleanMultiSelect()
				}
				
				
				if ($scope.whereamountfilter.amount != undefined) {
					$scope.isAmount = true
				}

				$scope.isAnyAmtReset = function () {
					$scope.dayValueType = "";
					$scope.historyValueType = "";
				}
				
				
				$scope.isAnyAmountChange = function(){
					cleanMultiSelect()
					
					if($scope.isAnyAmt){
						$scope.valueType=[];
						$scope.whereamountfilter.types = [];
						$scope.whereamountfilter.types.push("ALL")
					}else{
						if($scope.valueType.length>0){
							$scope.whereamountfilter.types = [];
							$scope.whereamountfilter.types = $scope.valueType
						}else{
							delete $scope.whereamountfilter.types 
						}
						
					}
					
			
				}
				/*$scope.isAnyAmountChange = function (a, b) {

					delete $scope.whereamountfilter.types
					if (a === 'ALL') {
						//  $scope.isAnyAmt=true;
						$scope.dayValueType = "";
						$scope.historyValueType = "";
						$scope.whereamountfilter.types = [];
						$scope.whereamountfilter.types.push(a)
					} else if (a === 'NOTALLFORHISTORYVALUE') {
						$scope.isAnyAmt = false;
						$scope.dayValueType = "";
						$scope.whereamountfilter.types = [];
						$scope.whereamountfilter.types = b
					} else if (a === 'NOTALLFORDAYVALUE') {
						$scope.isAnyAmt = false;
						$scope.historyValueType = "";
						$scope.whereamountfilter.types = [];
						$scope.whereamountfilter.types = b
					} else {
						delete $scope.whereamountfilter.types
					}

				}*/
				if ($scope.whereamountfilter.historyValue != undefined) {
					$scope.isHistoryValue = true;
					if ($scope.whereamountfilter.historyValue.avg != undefined) {
						$scope.historyValueAvg = true
						if($scope.whereamountfilter.types[0]==="ALL"){
							$scope.isAnyAmt=true;
						}else{
							$scope.isAnyAmt=false;
							cleanMultiSelect()
							$scope.valueType=$scope.whereamountfilter.types
						}
					}else if ($scope.whereamountfilter.historyValue.lcl != undefined) {
						$scope.historyValueLCL = true
					} else if ($scope.whereamountfilter.historyValue.ucl != undefined) {
						$scope.historyValueUCL = true
					}else{
						//$scope.historyValueAvg = false
						$scope.historyValueLCL = false
						$scope.historyValueUCL = false
					}
				}
				
				
				if ($scope.whereamountfilter.dayValue != undefined) {
					$scope.isDayValue = true;
					if ($scope.whereamountfilter.dayValue.avg != undefined) {
						$scope.dayValueAvg = true
						if($scope.whereamountfilter.types[0]==="ALL"){
							$scope.isAnyAmt=true;
						}else{
							$scope.isAnyAmt=false;
							cleanMultiSelect()
							$scope.valueType=$scope.whereamountfilter.types
						}
					}else if ($scope.whereamountfilter.dayValue.lcl != undefined) {
						$scope.historyValueLCL = true
					} else if ($scope.whereamountfilter.dayValue.ucl != undefined) {
						$scope.dayValueUCL = true
					}else{
						//$scope.dayValueAvg = false
						$scope.dayValueLCL = false
						$scope.dayValueUCL = false
					}
				}

/*
				if ($scope.whereamountfilter.historyValue != undefined) {
					$scope.isHistoryValue = true;
					if ($scope.whereamountfilter.historyValue.avg != undefined) {
						$scope.historyValueAvg = true

					} else if ($scope.whereamountfilter.historyValue.lcl != undefined) {
						$scope.historyValueLCL = true
					} else if ($scope.whereamountfilter.historyValue.ucl != undefined) {
						$scope.historyValueUCL = true
					}
				}

				if ($scope.whereamountfilter.dayValue != undefined) {
					$scope.isDayValue = true;
					
					if ($scope.whereamountfilter.dayValue.avg != undefined) {
						$scope.dayValueAvg = true
					} else if ($scope.whereamountfilter.types != undefined) {
						$scope.dayValueType = $scope.whereamountfilter.types
					} else if ($scope.whereamountfilter.dayValue.lcl != undefined) {
						$scope.dayValueLCL = true
					} else if ($scope.whereamountfilter.dayValue.ucl != undefined) {
						$scope.dayValueUCL = true
					}
					
				}

				if ($scope.whereamountfilter.types != undefined) {

					if ($scope.whereamountfilter.types[0] === "ALL") {
						$scope.isAnyAmt = true
						$scope.historyValueType = [];
						$scope.dayValueType = [];
					} else {
						$scope.isAnyAmt = false;
						if ($scope.historyValueAvg === true) {
							$scope.historyValueType = $scope.whereamountfilter.types
						} else {
							$scope.historyValueType = []
						}
						if ($scope.dayValueAvg === true) {
							$scope.dayValueType = $scope.whereamountfilter.types
						} else {
							$scope.dayValueType = [];
						}

					}
				}*/
				$scope.amountAndOr = function(){
					if ($scope.amountAnd) {
						$scope.withamountfilter.isOr = false
					} else if ($scope.amountOr) {
						$scope.withamountfilter.isOr = true
					} else {
						delete $scope.withamountfilter.isOr
					}
				}
				/*if($scope.withamountfilter.isOr===undefined){
					$scope.amountAnd=true
				}*/
				if($scope.withamountfilter.isOr!=undefined){
					if($scope.withamountfilter.isOr){
						$scope.amountOr=true
						$scope.amountAnd=false
					}else{
						$scope.amountOr=false
						$scope.amountAnd=true
					}
				}else{
					delete $scope.withamountfilter.isOr
				}

			},
			templateUrl: 'templates/private/ruleEditor/directive/withandwhereamount.html',
			link: function (scope, element, attr) {

			}
		}
	})
})()