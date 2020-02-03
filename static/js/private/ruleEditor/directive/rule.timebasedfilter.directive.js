(function() {
    'use strict';
    angular.module('rule').
    directive('ruleTimeBasedTxnFilter', function factory() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                timebasedfilter: '=',
                timebasedwithtotalfilter: '=',
                metadata: '=',
                ruledata: '=',
                mandatory: "="
            },
            controller: function($scope, ruleDataService, $filter, $window) {
                $window.scrollTo(0, 0);

                console.log('ruledata ', $scope.ruledata)
                //$scope.forisIntraDay = '';

                $scope.hour = 23;
                $scope.miniute = 59;
                $scope.second = 59;
                $scope.day = 31;

                $scope.getNumber = function(num) {
                    return new Array(num);
                }

                $scope.timebasedfilterOperators = ruleDataService.getOperatorsNumeric();
                // $scope.timebasedfilterOperators = $filter('filter')(ruleDataService.getOperators(), {for: 'timeBased'});


                var getDataForSource = ruleDataService.getSources()
                if ($scope.metadata.channel === 'RuPayAtm,RuPayPos') {

                    var RuPayAtm = $filter('filter')(getDataForSource, {
                        for: 'RuPayAtm'
                    });
                    var RuPayPos = $filter('filter')(getDataForSource, {
                        for: 'RuPayPos'
                    });

                    //console.log('RuPayAtm - ', RuPayAtm)
                    //console.log('RuPayPos - ',  RuPayPos)
                    $scope.getSources = RuPayAtm.concat(RuPayPos);
                    // console.log('RuPayAtm, RuPayPos - ',  $scope.subChannel)
                } else {
                    $scope.getSources = $filter('filter')(getDataForSource, {
                        for: $scope.metadata.channel
                    });
                }

                var getDataForAcceptances = ruleDataService.getAcceptances()
                if ($scope.metadata.channel === 'RuPayAtm,RuPayPos') {

                    var RuPayAtm = $filter('filter')(getDataForAcceptances, {
                        for: 'RuPayAtm'
                    });
                    
                    var RuPayPos = $filter('filter')(getDataForAcceptances, {
                        for: 'RuPayPos'
                    });

                    // console.log('RuPayAtm - ', RuPayAtm)
                    //console.log('RuPayPos - ',  RuPayPos)
                    $scope.getAcceptances = RuPayAtm.concat(RuPayPos);
                    // console.log('RuPayAtm, RuPayPos - ',  $scope.subChannel)
                } else {
                    $scope.getAcceptances = $filter('filter')(getDataForAcceptances, {
                        for: $scope.metadata.channel
                    });
                }

                if ($scope.timebasedwithtotalfilter.sources != undefined && $scope.timebasedwithtotalfilter.sources.length > 0) {
                    $scope.sources = $scope.timebasedwithtotalfilter.sources[0]
                }
                
                if ($scope.timebasedwithtotalfilter.acceptances != undefined && $scope.timebasedwithtotalfilter.acceptances.length > 0) {
                    $scope.acceptances = $scope.timebasedwithtotalfilter.acceptances[0]
                }

                $scope.sourcesChange = function() {

                    if ($scope.sources === '') {
                        delete $scope.timebasedwithtotalfilter.sources;
                    } else {
                        $scope.timebasedwithtotalfilter.sources = [];
                        $scope.timebasedwithtotalfilter.sources.push($scope.sources);
                    }

                    /*if($scope.ruledata.withTotalOn.sources===undefined){
                    	$scope.sources=""
                    }else{
                    	if($scope.ruledata.withTotalOn.sources[0]==="Payer IFSC Account No."){
                    		$scope.sources="Payer IFSC Account No."
                    	}else if($scope.ruledata.withTotalOn.sources[0]==="Card"){
                    		$scope.sources="Card"
                    	}else{
                    		$scope.sources=""
                    	}
                    }*/
                    //	$scope.getDays=ruleDataService.getDays();
                }
                $scope.acceptancesChange = function() {
                    if ($scope.acceptances === '') {
                        delete $scope.timebasedwithtotalfilter.acceptances;
                    } else {
                        $scope.timebasedwithtotalfilter.acceptances = [];
                        $scope.timebasedwithtotalfilter.acceptances.push($scope.acceptances);
                    }


                    /*if($scope.ruledata.withTotalOn.acceptances===undefined){
                    	$scope.acceptances=""
                    }else{
                    	if($scope.ruledata.withTotalOn.acceptances[0]==="TID"){
                    		$scope.acceptances="TID"
                    	}else{
                    		$scope.acceptances=""
                    	}
                    }*/
                    //$scope.getDays=ruleDataService.getDays();
                }


                $scope.changeOverUnit = function() {
                    $scope.timebasedfilter.over.duration = "";
                    if ($scope.timebasedfilter.over.unit.length === 0) {
                        delete $scope.timebasedfilter.over
                    }

                }



                $scope.forTimebasedDateTileChange = function() {

                    $scope.forTimebasedWeek = false;
                    $scope.forTimebasedOver = false;
                    $scope.forisIntraDay = false;

                    delete $scope.timebasedfilter.week;
                    delete $scope.timebasedfilter.over;
                    delete $scope.timebasedfilter.intraOrIntraday;
                }

                $scope.forTimebasedWeekChange = function() {

                    $scope.forTimebasedDateTime = false;
                    $scope.forTimebasedOver = false;
                    $scope.forisIntraDay = false;

                    delete $scope.timebasedfilter.hourBetween;
                    delete $scope.timebasedfilter.over;
                    delete $scope.timebasedfilter.intraOrIntraday;

                }

                $scope.forTimebasedOverChange = function() {
                    $scope.forTimebasedDateTime = false;
                    $scope.forTimebasedWeek = false;

                    delete $scope.timebasedfilter.hourBetween;
                    delete $scope.timebasedfilter.week;
                    delete $scope.timebasedfilter.intraOrIntraday;
                }


                $scope.forIntraDayChange = function() {
                    $scope.forTimebasedDateTime = false;
                    $scope.forTimebasedWeek = false;
                    $scope.forTimebasedOver = false;
                    $scope.forisIntrDay = false;

                    delete $scope.timebasedfilter.hourBetween;
                    delete $scope.timebasedfilter.over;
                    delete $scope.timebasedfilter.week;
                }


                if ($scope.metadata.channel === "UPI") {
                    $scope.channel = "UPI"
                } else {
                    $scope.channel = ""
                }

                /*if($scope.ruledata.payerFilter.jurisdiction===undefined){
                	$scope.jurisdiction=""
                }else{
                	if($scope.ruledata.payerFilter.jurisdiction!= undefined){
                		if($scope.ruledata.payerFilter.jurisdiction==="International"){
                			$scope.jurisdiction="International"
                		}
                	}
                }*/


                if ($scope.ruledata.txnFilter.status === undefined) {
                    $scope.status = ""
                } else {
                    if ($scope.ruledata.txnFilter.status.indexOf("Decline") !== -1) {
                        $scope.status = "Decline"

                    } else {
                        $scope.status = ""
                    }
                }


                if ($scope.ruledata.payeeFilter.mccIn === undefined) {
                    $scope.mccin = ""
                } else {
                    if ($scope.ruledata.payeeFilter.mccIn.indexOf("5944") !== -1) {
                        $scope.mccin = "5944"
                    } else {
                        $scope.mccin = ""
                    }
                }


                if ($scope.ruledata.txnFilter.types === undefined) {
                    $scope.txnType = ""
                } else {
                    if ($scope.ruledata.txnFilter.types.indexOf("Withdrawal") !== -1) {

                        $scope.txnType = "Withdrawal"
                    } else if ($scope.ruledata.txnFilter.types.indexOf("Purchase") !== -1) {
                        $scope.txnType = "Purchase"
                    } else if ($scope.ruledata.txnFilter.types.indexOf("All Financial") !== -1) {
                        $scope.txnType = "All Financial"
                    } else {
                        $scope.txnType = ""
                    }
                }

                /*if($scope.ruledata.txnFilter.isHighRiskLocation===undefined){
                	$scope.isHighRiskLocation=""
                }else{
                	if($scope.ruledata.txnFilter.isHighRiskLocation!==undefined){
                		$scope.isHighRiskLocation=true
                	}else{
                		$scope.isHighRiskLocation=""
                	}
                }*/

                /*if($scope.ruledata.payerFilter.usageAcrossDistinctEndpoint===undefined){
                	$scope.endpoint=""
                }else{
                	if($scope.ruledata.payerFilter.usageAcrossDistinctEndpoint.endPointType!==undefined){
                		if($scope.ruledata.payerFilter.usageAcrossDistinctEndpoint.endPointType==="Mobile"){
                			$scope.endpoint="Mobile"
                		}
                		
                	}else{
                		$scope.endpoint=""
                	}
                }*/


                if ($scope.ruledata.timeBasedTxnFilter.over != undefined) {
                    if ($scope.ruledata.timeBasedTxnFilter.over.unit != undefined) {
                        if ($scope.ruledata.timeBasedTxnFilter.over.unit === 'Days') {
                            //	alert( $scope.ruledata.timeBasedTxnFilter.over.duration)
                            $scope.timebasedfilter.over.duration = $scope.ruledata.timeBasedTxnFilter.over.duration.toString()
                        }
                    }
                }


                $scope.getDays = ruleDataService.getDays();


                $scope.intraOrIntradayChange = function() {
                    if ($scope.timebasedfilter.intraOrIntraday.operator.length > 0) {
                        $scope.timebasedfilter.intraOrIntraday.isIntraDay = true
                    } else {
                        delete $scope.timebasedfilter.intraOrIntraday.isIntraDay
                    }
                    delete $scope.timebasedfilter.intraOrIntraday.duration
                    delete $scope.timebasedfilter.intraOrIntraday.unit
                }

                $scope.timeDifferenceWithLastTxnChange = function() {
                    delete $scope.timebasedfilter.timeDifferenceWithLastTxn.duration
                    delete $scope.timebasedfilter.timeDifferenceWithLastTxn.unit
                }
            },

            templateUrl: 'templates/private/ruleEditor/directive/timeBasedTxnFilter.html',
            link: function(scope, element, attr) {

            }
        }
    })

})()