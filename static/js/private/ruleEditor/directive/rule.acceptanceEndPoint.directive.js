(function() {
    'use strict';
    angular.module('rule').
    directive('ruleAcceptanceEndPoint', function() {
        return {
            restrict: 'E',
            scope: {
                acceptancepointfilter: '=',
                metadata: '=',
                mandatory: "="
            },
            controller: function($scope, ruleDataService, $filter, $window) {
                $window.scrollTo(0, 0);

                $scope.channels = ruleDataService.getChannel();

               var getAcceptanceEndPointData = ruleDataService.getAcceptanceEndPoint()
                if($scope.metadata.channel==='RuPayAtm,RuPayPos'){
                	var RuPayAtm = $filter('filter')(getAcceptanceEndPointData, {
                         for: 'RuPayAtm'
                     });
                	var RuPayPos = $filter('filter')(getAcceptanceEndPointData, {
                        for: 'RuPayPos'
                    });
                
                	// console.log('RuPayAtm - ', RuPayAtm)
                	 //console.log('RuPayPos - ',  RuPayPos)
                	 $scope.getAcceptanceEndPoint = RuPayAtm.concat(RuPayPos);
                    // console.log('RuPayAtm, RuPayPos - ',  $scope.subChannel)
                 }else{
                	 $scope.getAcceptanceEndPoint = $filter('filter')(getAcceptanceEndPointData, {
                         for: $scope.metadata.channel
                     }); 
                 }

               
                var getUsageAcrossEndpointsForAcceptanceData = ruleDataService.getUsageAcrossEndpointsForAcceptance()
                if($scope.metadata.channel==='RuPayAtm,RuPayPos'){
                	var RuPayAtm = $filter('filter')(getUsageAcrossEndpointsForAcceptanceData, {
                         for: 'RuPayAtm'
                     });
                	var RuPayPos = $filter('filter')(getUsageAcrossEndpointsForAcceptanceData, {
                        for: 'RuPayPos'
                    });
                
                	// console.log('RuPayAtm - ', RuPayAtm)
                	 //console.log('RuPayPos - ',  RuPayPos)
                	 $scope.getUsageAcrossEndpoints = RuPayAtm.concat(RuPayPos);
                    // console.log('RuPayAtm, RuPayPos - ',  $scope.subChannel)
                 }else{
                	 $scope.getUsageAcrossEndpoints = $filter('filter')(getUsageAcrossEndpointsForAcceptanceData, {
                         for: $scope.metadata.channel
                     }); 
                 }

                /* $scope.subChannel = $filter('filter')($scope.channels, {
                     for: $scope.metadata.channel
                 });*/

                $scope.getFraudaysForCount = ruleDataService.getFraudaysForCount()
                $scope.getFraudaysForAmount = ruleDataService.getFraudaysForAmount()

                $scope.jurisdictionInternational = false;
                $scope.jurisdictionDomistic = false;

               // $scope.acceptancepointfilterOperators = ruleDataService.getOperators();
                $scope.acceptancepointfilterOperators = $filter('filter')(ruleDataService.getOperators(), {
                    for: 'acceptance'
                });

                $scope.juridictionChange = function(juridiction) {

                    if ($scope.jurisdictionInternational) {
                        $scope.acceptancepointfilter.jurisdiction = juridiction
                    } else if ($scope.jurisdictionDomistic) {
                        $scope.acceptancepointfilter.jurisdiction = juridiction
                    } else {
                        delete $scope.acceptancepointfilter.jurisdiction
                    }
                }


                $scope.EMVCompliantYes = false;
                $scope.EMVCompliantNo = false;



                $scope.isChannel = true;

                $scope.channelChange = function() {
                    $scope.favouriteChannel = '';
                    $scope.recentlyUsedChannel = '';
                    if ($scope.channelName.length > 0) {
                        $scope.isChannel = false;
                        $scope.acceptancepointfilter.channels = [];
                        $scope.channelCriteria = []

                        $scope.acceptancepointfilter.channels.push({
                            "channelName": $scope.channelName,
                            "channelCriteria": []
                        })

                    } else {
                        $scope.isChannel = true;
                        delete $scope.acceptancepointfilter.channels
                    }

                }

                $scope.favouriteChange = function() {

                    if ($scope.acceptancepointfilter.channels[0].channelCriteria != undefined) {
                        $scope.favouriteDataChk = $scope.acceptancepointfilter.channels[0].channelCriteria.find(ob => ob['channelCriterionName'] === 'favourite');
                    }

                    if ($scope.acceptancepointfilter.channels[0].channelCriteria === undefined) {
                        $scope.channelCriteria = []
                    }


                    if ($scope.favouriteChannel.length > 0) {


                        if ($scope.favouriteDataChk != undefined) {
                            $scope.acceptancepointfilter.channels[0].channelCriteria.splice($scope.acceptancepointfilter.channels[0].channelCriteria.indexOf($scope.favouriteDataChk), 1)
                        }

                        $scope.channelCriteria.push({
                            "channelCriterionName": "favourite",
                            "operator": $scope.favouriteChannel
                        })
                        $scope.acceptancepointfilter.channels[0].channelCriteria = $scope.channelCriteria
                    } else {

                        // $scope.acceptancepointfilter.channels[0].channelCriteria=[]

                        $scope.acceptancepointfilter.channels[0].channelCriteria.splice(
                            $scope.acceptancepointfilter.channels[0].channelCriteria.indexOf(
                                $scope.acceptancepointfilter.channels[0].channelCriteria.find(function(e) {
                                    return e.channelCriterionName == "favourite";
                                })), 1);
                    }

                }
                $scope.recentlyUsedChange = function() {


                    if ($scope.acceptancepointfilter.channels[0].channelCriteria != undefined) {
                        $scope.recentlyUsedDataChk = $scope.acceptancepointfilter.channels[0].channelCriteria.find(ob => ob['channelCriterionName'] === 'recentlyUsed');
                    }

                    if ($scope.acceptancepointfilter.channels[0].channelCriteria === undefined) {
                        $scope.channelCriteria = []
                    }


                    if ($scope.recentlyUsedChannel.length > 0) {


                        if ($scope.recentlyUsedDataChk != undefined) {
                            $scope.acceptancepointfilter.channels[0].channelCriteria.splice($scope.acceptancepointfilter.channels[0].channelCriteria.indexOf($scope.recentlyUsedDataChk), 1)
                        }
                        $scope.channelCriteria.push({
                            "channelCriterionName": "recentlyUsed",
                            "operator": $scope.recentlyUsedChannel
                        })
                        $scope.acceptancepointfilter.channels[0].channelCriteria = $scope.channelCriteria



                    } else {
                        $scope.acceptancepointfilter.channels[0].channelCriteria.splice(
                            $scope.acceptancepointfilter.channels[0].channelCriteria.indexOf(
                                $scope.acceptancepointfilter.channels[0].channelCriteria.find(function(e) {
                                    return e.channelCriterionName == "recentlyUsed";
                                })), 1);
                    }

                }


                if ($scope.acceptancepointfilter.channels != undefined) {




                    $scope.channelName = $scope.acceptancepointfilter.channels[0].channelName
                    $scope.isChannel = false;
                    //   console.log($scope.acceptancepointfilter.channels[0].channelCriteria)

                    if ($scope.acceptancepointfilter.channels[0].channelCriteria != undefined) {

                        if ($scope.acceptancepointfilter.channels[0].channelCriteria.length > 0) {

                            $scope.channelCriteria = $scope.acceptancepointfilter.channels[0].channelCriteria;

                            var favouriteChannel = $filter('filter')($scope.acceptancepointfilter.channels[0].channelCriteria, {
                                channelCriterionName: "favourite"
                            });

                            if (favouriteChannel.length > 0) {
                                $scope.favouriteChannel = favouriteChannel[0].operator
                                console.log('favouriteChannel ', favouriteChannel[0].operator)
                            }

                            var recentlyUsedChannel = $filter('filter')($scope.acceptancepointfilter.channels[0].channelCriteria, {
                                channelCriterionName: "recentlyUsed"
                            });

                            if (recentlyUsedChannel.length > 0) {
                                $scope.recentlyUsedChannel = recentlyUsedChannel[0].operator
                                console.log('recentlyUsedChannel ', recentlyUsedChannel[0].operator)
                            }

                        }
                    }
                }



                $scope.EMVCompliantChange = function(EMVCompliant) {

                    if ($scope.EMVCompliantYes) {
                        $scope.acceptancepointfilter.isEMVCompliant = EMVCompliant
                    } else if ($scope.EMVCompliantNo) {
                        $scope.acceptancepointfilter.isEMVCompliant = EMVCompliant
                    } else {
                        delete $scope.acceptancepointfilter.isEMVCompliant
                    }
                }


                if ($scope.acceptancepointfilter.isEMVCompliant != undefined) {
                    if ($scope.acceptancepointfilter.isEMVCompliant === 'Yes') {
                        $scope.EMVCompliantYes = true;
                    } else {
                        $scope.EMVCompliantNo = true;
                    }
                }



                if ($scope.acceptancepointfilter.jurisdiction != undefined) {
                    if ($scope.acceptancepointfilter.jurisdiction === 'Domestic') {
                        $scope.jurisdictionDomistic = true;
                    } else {
                        $scope.jurisdictionInternational = true;
                    }
                }

                if ($scope.acceptancepointfilter.reportedFrauds != undefined) {
                    if ($scope.acceptancepointfilter.reportedFrauds.count != undefined) {
                    	if($scope.acceptancepointfilter.reportedFrauds.count){
                    		$scope.isReportedFraud = true
                    	}else{
                    		$scope.isReportedFraud = false
                    		delete $scope.acceptancepointfilter.reportedFrauds.count
                    		delete $scope.acceptancepointfilter.reportedFrauds.durationInDaysCount
                    	}
                    	if($scope.acceptancepointfilter.reportedFrauds.durationInDaysCount != undefined && $scope.acceptancepointfilter.reportedFrauds.durationInDaysCount){
                    		var day = $scope.acceptancepointfilter.reportedFrauds.durationInDaysCount
                            $scope.acceptancepointfilter.reportedFrauds.durationInDaysCount = day.toString()
                    	}
                        

                    } 
                }
                if ($scope.acceptancepointfilter.reportedFrauds != undefined) {
                    if ($scope.acceptancepointfilter.reportedFrauds.volume != undefined) {
                    	if($scope.acceptancepointfilter.reportedFrauds.volume){
                    		$scope.isReportedFraudVolume = true
                    	}else{
                    		$scope.isReportedFraudVolume = false
                    		delete $scope.acceptancepointfilter.reportedFrauds.volume
                    		delete  $scope.acceptancepointfilter.reportedFrauds.durationInDaysAmount
                    	}
                    	if($scope.acceptancepointfilter.reportedFrauds.durationInDaysAmount != undefined && $scope.acceptancepointfilter.reportedFrauds.durationInDaysAmount){
                        var day = $scope.acceptancepointfilter.reportedFrauds.durationInDaysAmount
                        $scope.acceptancepointfilter.reportedFrauds.durationInDaysAmount = day.toString()
                    	}
                    } 
                }
                
                $scope.resetReportedFraudCount = function() {
                    if ($scope.acceptancepointfilter.reportedFrauds != undefined) {
                        if ($scope.acceptancepointfilter.reportedFrauds.count != undefined) {
                            delete $scope.acceptancepointfilter.reportedFrauds.count
                        }

                        if ($scope.acceptancepointfilter.reportedFrauds.durationInDaysCount != undefined) {
                            delete $scope.acceptancepointfilter.reportedFrauds.durationInDaysCount
                        }
                    }
                }
                $scope.resetReportedFraudAmount = function() {
                    if ($scope.acceptancepointfilter.reportedFrauds != undefined) {
                        if ($scope.acceptancepointfilter.reportedFrauds.volume != undefined) {
                            delete $scope.acceptancepointfilter.reportedFrauds.volume
                        }

                        if ($scope.acceptancepointfilter.reportedFrauds.durationInDaysAmount != undefined) {
                            delete $scope.acceptancepointfilter.reportedFrauds.durationInDaysAmount
                        }
                    }

                }

                if ($scope.acceptancepointfilter.FTS != undefined) {

                    if ($scope.acceptancepointfilter.FTS.count != undefined) {
                        if ($scope.acceptancepointfilter.FTS.count ) {
                            $scope.isFTS = true
                        } else {
                            $scope.isFTS = false
                            delete $scope.acceptancepointfilter.FTS
                        }
                    }
                    
                
                   /* if ($scope.acceptancepointfilter.FTS.durationInDays != undefined) {
                        if ($scope.acceptancepointfilter.FTS.durationInDays.length > 0 ) {
                            $scope.isFTS = true
                        } else {
                            $scope.isFTS = false
                            delete $scope.acceptancepointfilter.FTS
                        }
                    }*/

                }

                if ($scope.acceptancepointfilter.disputedInfo != undefined) {
                	
                	if($scope.acceptancepointfilter.disputedInfo.count!= undefined){
                		if($scope.acceptancepointfilter.disputedInfo.count){
                			$scope.isDisputed = true
                		}else{
                			$scope.isDisputed = false
                		}
                	}
                	
                	if($scope.acceptancepointfilter.disputedInfo.duration!= undefined){
                		if($scope.acceptancepointfilter.disputedInfo.duration){
                			$scope.isDisputed = true
                		}else{
                			$scope.isDisputed = false
                		}
                	}
                	
                	
                	
                   
                }
                /* $scope.resetReportedFraud=function(){
                 	delete $scope.acceptancepointfilter.reportedFrauds
                 }*/
                $scope.resetFTS = function() {

                    delete $scope.acceptancepointfilter.FTS


                }

                $scope.resetDisputed = function() {
                    delete $scope.acceptancepointfilter.disputedInfo
                }
                $scope.resetUsageAcc = function() {
                    delete $scope.acceptancepointfilter.usageAcrossDistinctEndpoint.operator
                    delete $scope.acceptancepointfilter.usageAcrossDistinctEndpoint.value
                }
            },
            templateUrl: 'templates/private/ruleEditor/directive/acceptanceEndPoint.html',
            link: function(scope, element, attr) {

            }
        }
    })
})()