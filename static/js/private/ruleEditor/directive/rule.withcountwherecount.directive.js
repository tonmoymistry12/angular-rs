(function() {
    'use strict';
    angular.module('rule').
    directive('ruleWithCountWhereCount',  function factory()  {
        return {
            restrict: 'E',
            replace: true,
            scope: {
            	withcountfilter: '=',
                wherecountfilter: '=',
                metadata: '=',
                ruledata: '=',
                mandatory:"="
            },
            controller:function($scope,ruleDataService,$window, $filter) {
            	$window.scrollTo(0, 0);
            	 console.log('ruledata ', $scope.ruledata)
            	$scope.withAmtWhereCountOperators= ruleDataService.getOperatorsNumeric();
            //	$scope.withAmtWhereCountOperators = $filter('filter')(ruleDataService.getOperators(), {for: 'count'});
            	
            	if($scope.withcountfilter.isWithSameAmount === undefined) {
                $scope.withcountfilter.isWithSameAmount=false;
            	}
            	if($scope.withcountfilter.isTotalOnly === undefined) {
                $scope.withcountfilter.isTotalOnly=false;
            	}
            	if($scope.withcountfilter.max === undefined) {
                $scope.withcountfilter.max=false;
            	}
            	if($scope.withcountfilter.currentMtd === undefined) {
                $scope.withcountfilter.currentMtd=false;
            	}
                
                $scope.withCountTotalReset=function(){
                    if(!$scope.withcountfilterForTotal){
                       delete $scope.withcountfilter.total
                       }
                   
                }
                
                $scope.isHistoryValue=false;
                $scope.isDayValue=false;
                $scope.isAnyCount=false;
               /* $scope.resetHistoryDayValue = function(){
                     delete $scope.wherecountfilter.dayValue
                     delete $scope.wherecountfilter.historyValue
                     delete $scope.wherecountfilter.count
                }*/
                
                $scope.historyValueCount=false;
                $scope.historyValueAvg=false;
                $scope.historyValueLCL=false;
                
                $scope.dayValueCount=false;
                $scope.dayValueAvg=false;
                $scope.dayValueLCL=false;
                                
                $scope.withAmtWhereAmtOperators= ruleDataService.getOperators();
                
                $scope.whereCountTypeDatas=ruleDataService.getWhereCountType();
                
                
                function cleanMultiSelect(){
					if(($scope.historyValueAvg && !$scope.isAnyCount) || ($scope.dayValueAvg && !$scope.isAnyCount)){
						$scope.isEmpty=true
					}else{
						$scope.isEmpty=false
					}
				}
                
                $scope.resetHistoryDayValue = function(){
                    $scope.historyValueCount=false;
                    $scope.historyValueAvg=false;
                    $scope.historyValueLCL=false;

                    $scope.dayValueCount=false;
                    $scope.dayValueAvg=false;
                    $scope.dayValueLCL=false;
                    $scope.wherecountfilter.operator='';
                     delete $scope.wherecountfilter.dayValue
                     delete $scope.wherecountfilter.historyValue
                     delete $scope.wherecountfilter.types
                     delete $scope.wherecountfilter.count
                     
                     $scope.countType=[];
 					
 					$scope.isAnyCount=false;
 					cleanMultiSelect()
                                       
                }
                
                $scope.resetHistoryDayInputs = function(){
					delete $scope.wherecountfilter.dayValue
					delete $scope.wherecountfilter.historyValue
					delete $scope.wherecountfilter.count
					delete $scope.wherecountfilter.types
					$scope.isAnyCount=false
					cleanMultiSelect()
				}
                
                $scope.changeOpt = function(){
					if($scope.wherecountfilter.operator){
						$scope.isCount = true
					}else{
						$scope.isCount = true
					}
				}
                
                
                $scope.isAnyCountChange = function(){
					
                	cleanMultiSelect()
					if($scope.isAnyCount){
						$scope.countType=[];
						$scope.wherecountfilter.types = [];
						$scope.wherecountfilter.types.push("ALL")
					}else{
						if($scope.countType.length>0){
							$scope.wherecountfilter.types = [];
							$scope.wherecountfilter.types = $scope.countType
						}else{
							delete $scope.wherecountfilter.types
						}
						
					}
					
					
				}
                
                if($scope.withcountfilter.total!=undefined){
                    $scope.withcountfilterForTotal=true
                }
                
                if($scope.wherecountfilter.count!=undefined){
                    $scope.isCount=true
                }
                
               /* if($scope.wherecountfilter.historyValue!=undefined){
                     $scope.isHistoryValue=true;
                    if($scope.wherecountfilter.historyValue.avg!=undefined){
                             $scope.historyValueAvg=true
                       
                    }else if($scope.wherecountfilter.historyValue.lcl!=undefined){
                           $scope.historyValueLCL=true   
                    }
                }*/
                
                
                /* if($scope.wherecountfilter.dayValue!=undefined){
                     $scope.isDayValue=true;
                    if($scope.wherecountfilter.dayValue.avg!=undefined){
                             $scope.dayValueAvg=true
                       
                    }else if($scope.wherecountfilter.dayValue.lcl!=undefined){
                           $scope.dayValueLCL=true   
                    }
                }*/
                
 				/*if ($scope.wherecountfilter.types != undefined) {

					if ($scope.wherecountfilter.types[0] === "ALL") {
						$scope.isAnyCount = true
						$scope.countType=[];
					} else {
						$scope.isAnyCount = false;
						if ($scope.historyValueAvg === true) {
							$scope.historyCountType = $scope.wherecountfilter.types
						} else {
							$scope.historyCountType = []
						}
						if ($scope.dayValueAvg === true) {
							$scope.dayCountType = $scope.wherecountfilter.types
						} else {
							$scope.dayCountType = [];
						}

					}
				}*/
                
                if ($scope.wherecountfilter.historyValue != undefined) {
					$scope.isHistoryValue = true;
					if ($scope.wherecountfilter.historyValue.avg != undefined) {
						$scope.historyValueAvg = true
						if($scope.wherecountfilter.types[0]==="ALL"){
							$scope.isAnyCount=true;
						}else{
							$scope.isAnyCount=false;
							cleanMultiSelect()
							$scope.countType=$scope.wherecountfilter.types
						}
					}else if ($scope.wherecountfilter.historyValue.lcl != undefined) {
						$scope.historyValueLCL = true
					}else{
						//$scope.historyValueAvg = false
						$scope.historyValueLCL = false
						//$scope.historyValueUCL = false
					}
				}
                
                if ($scope.wherecountfilter.dayValue != undefined) {
					$scope.isDayValue = true;
					if ($scope.wherecountfilter.dayValue.avg != undefined) {
						$scope.dayValueAvg = true
						if($scope.wherecountfilter.types[0]==="ALL"){
							$scope.isAnyCount=true;
						}else{
							$scope.isAnyCount=false;
							cleanMultiSelect()
							$scope.countType=$scope.wherecountfilter.types
						}
					}else if ($scope.wherecountfilter.dayValue.lcl != undefined) {
						$scope.historyValueLCL = true
					} else{
						//$scope.dayValueAvg = false
						$scope.dayValueLCL = false
						//$scope.dayValueUCL = false
					}
				}
            	
            },
            templateUrl: 'templates/private/ruleEditor/directive/withandwherecount.html',
            link: function(scope, element, attr) {
            	
            }
        }
    })
})()