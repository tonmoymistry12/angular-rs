(function() {
    'use strict';
    angular.module('rule').
    directive('ruleTransaction', function factory() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                txnfilter: '=',
                metadata: '=',
                mandatory: "=",
                actiondisable:"="
            },
            controller: function($scope, $sce, ruleDataService, $filter, ruleEditorManagement, $window,RuleService) {
                $window.scrollTo(0, 0);

                
                
                var isView = RuleService.getCopyFlag()

                if (isView === 'true' || isView === null) {

                    $scope.isView = false;


                } else {
                    $scope.isView = true;
                }
                
                $scope.isEmptyFinancial = true
                $scope.isEmptyNonFinancial = true
                $scope.channels = ruleDataService.getChannel();

               
                
             if($scope.metadata.channel==='RuPayAtm,RuPayPos'){
            	var RuPayAtm = $filter('filter')($scope.channels, {
                     for: 'RuPayAtm'
                 });
            	var RuPayPos = $filter('filter')($scope.channels, {
                    for: 'RuPayPos'
                });
            
            	 //console.log('RuPayAtm - ', RuPayAtm)
            	 //console.log('RuPayPos - ',  RuPayPos)
            	 $scope.subChannel = RuPayAtm.concat(RuPayPos);
                // console.log('RuPayAtm, RuPayPos - ',  $scope.subChannel)
             }else{
            	 $scope.subChannel = $filter('filter')($scope.channels, {
                     for: $scope.metadata.channel
                 }); 
             }


                if ($scope.txnfilter.channels != undefined) {

                    var channelForView = $scope.txnfilter.channels[0].name.split(",");
                    var channelForViewArr = [];
                    for (var i = 0; i < channelForView.length; i++) {

                        channelForViewArr.push({
                            "name": channelForView[i],
                            "value": channelForView[i],
                            "for": $scope.metadata.channel
                        })
                    }
                    $scope.channelName = channelForViewArr;
                    $scope.allChannels = $scope.txnfilter.channels[0].txnFields
                    $scope.forCurrentTxnOnly = $scope.txnfilter.channels[0].forCurrentTxnOnly;
                }else{
                      $scope.forCurrentTxnOnly =false;
                }

                $scope.countryList = function(a) {
                    var temp = a.split(',')
                    var countryList = [];
                    angular.forEach(temp, function(value, key) {

                        angular.forEach(ruleDataService.getCountry(), function(country, countrykey) {

                            if (parseInt(country.NumericCode) === parseInt(value)) {

                                countryList.push(country.CountryName)

                            }

                        })
                    })
                    temp = countryList.toString()
                    return temp

                }

             //   $scope.financialDatas = ruleDataService.getFinancial();
                /*$scope.financialDatas = $filter('filter')(ruleDataService.getFinancial(), {
                    for: $scope.metadata.channel
                });*/
                var getFinancialData = ruleDataService.getFinancial()
                if($scope.metadata.channel==='RuPayAtm,RuPayPos'){
                	var RuPayAtm = $filter('filter')(getFinancialData, {
                         for: 'RuPayAtm'
                     });
                	var RuPayPos = $filter('filter')(getFinancialData, {
                        for: 'RuPayPos'
                    });
                
                	// console.log('RuPayAtm - ', RuPayAtm)
                	 //console.log('RuPayPos - ',  RuPayPos)
                	 $scope.financialDatas = RuPayAtm.concat(RuPayPos);
                    // console.log('RuPayAtm, RuPayPos - ',  $scope.subChannel)
                 }else{
                	 $scope.financialDatas = $filter('filter')(getFinancialData, {
                         for: $scope.metadata.channel
                     }); 
                 }
                
                
                
               // $scope.nonFinancialDatas = ruleDataService.getNonFinancial();
              /*  $scope.nonFinancialDatas = $filter('filter')(ruleDataService.getNonFinancial(), {
                    for: $scope.metadata.channel
                });*/
                
                var getNonFinancialData = ruleDataService.getNonFinancial()
                if($scope.metadata.channel==='RuPayAtm,RuPayPos'){
                	var RuPayAtm = $filter('filter')(getNonFinancialData, {
                         for: 'RuPayAtm'
                     });
                	var RuPayPos = $filter('filter')(getNonFinancialData, {
                        for: 'RuPayPos'
                    });
                
                	// console.log('RuPayAtm - ', RuPayAtm)
                	 //console.log('RuPayPos - ',  RuPayPos)
                	 $scope.nonFinancialDatas = RuPayAtm.concat(RuPayPos);
                    // console.log('RuPayAtm, RuPayPos - ',  $scope.subChannel)
                 }else{
                	 $scope.nonFinancialDatas = $filter('filter')(getNonFinancialData, {
                         for: $scope.metadata.channel
                     }); 
                 }
                
                

               /* $scope.txnFieldDatas = ruleDataService.getTransactionFields();*/
                var getTransactionFieldData = ruleDataService.getTransactionFields()
                if($scope.metadata.channel==='RuPayAtm,RuPayPos'){
                	var RuPayAtm = $filter('filter')(getTransactionFieldData, {
                         for: 'RuPayAtm'
                     });
                	var RuPayPos = $filter('filter')(getTransactionFieldData, {
                        for: 'RuPayPos'
                    });
                
                	// console.log('RuPayAtm - ', RuPayAtm)
                	 //console.log('RuPayPos - ',  RuPayPos)
                	 $scope.txnFieldDatas = RuPayAtm.concat(RuPayPos);
                    // console.log('RuPayAtm, RuPayPos - ',  $scope.subChannel)
                 }else{
                	 $scope.txnFieldDatas = $filter('filter')(getTransactionFieldData, {
                         for: $scope.metadata.channel
                     }); 
                 }
                
                $scope.txnOperators = ruleDataService.getOperators();

                $scope.txnFilterStatus = ruleDataService.getStatus();

                $scope.getCountry = ruleDataService.getCountry();

                $scope.isOptDisabled = true;
                $scope.isValueList = true;
                $scope.isList = false;

                /*$scope.transfiledChange = function() {

                    $scope.trans.operator = "";
                    $scope.isList = false;
                    $scope.isValue = false;
                    $scope.trans.list = "";
                    $scope.trans.value1 = "";
                    $scope.trans.value2 = "";
                    $scope.txnList = "";
                    if ($scope.trans.txnFieldName.length > 0) {
                    	
                    	
                    	 $scope.txnOperators = $filter('filter')($scope.txnFieldDatas, {
                             name: $scope.trans.txnFieldName
                         })[0].operetor;
                    	
                    	 $scope.validationItems=$filter('filter')($scope.txnFieldDatas, {
                             name: $scope.trans.txnFieldName
                         }, true)[0]
                    	
                    	
                    	
                    	
                        $scope.isOptDisabled = false;
                        if ($scope.trans.txnFieldName === "txnType") {
                            //$scope.financialDatas = ruleDataService.getFinancial();
                            $scope.txnList = ruleDataService.getTxnTypes();
                            $scope.listIsDisable = false
                        } else if ($scope.trans.txnFieldName === "txnSubType") {
                            if ($scope.metadata.channel === "UPI") {
                                $scope.txnList = ruleDataService.getTxnSubTypesUPI();
                            } else {
                                $scope.txnList = ruleDataService.getTxnSubTypes();
                            }
                            $scope.listIsDisable = false
                        } else if ($scope.trans.txnFieldName === "txnTime") {
                            $scope.txnList = ruleDataService.getTxnTimes();
                            $scope.listIsDisable = false
                        } else if ($scope.trans.txnFieldName === "AcquiringinstitutionCountrycode") {
                            var countryList = [];
                            for (var i = 0; i < ruleDataService.getCountry().length; i++) {
                                countryList.push(ruleDataService.getCountry()[i].CountryName + ' - ' + ruleDataService.getCountry()[i].NumericCode);
                            }
                            $scope.txnList = [...new Set(countryList)];
                            $scope.listIsDisable = false
                        } else if ($scope.trans.txnFieldName === "responseCode") {
                            $scope.txnList = ruleDataService.getResponseCode();
                            $scope.listIsDisable = false
                        }else if ($scope.trans.txnFieldName === "mcc") {
                            $scope.txnList = ruleDataService.getMccHT();
                            $scope.listIsDisable = false
                        }else if ($scope.trans.txnFieldName === "IPaddressforRuPay") {
                            $scope.txnList = ruleDataService.getIPaddressforRuPay();
                            $scope.listIsDisable = false
                        }else {
                            ruleEditorManagement.header({}).getHotList({
                                channel: $scope.metadata.channel,
                                orgId: $scope.metadata.orgId,
                                listType: $scope.trans.txnFieldName,
                                hotListTypeCode: 'H'
                            }, function(data) {
                                //  console.log('GOT LIST - ', data)
                                if (data.response !== undefined) {
                                    $scope.txnList = data.response;
                                    //  console.log('GOT LIST - ', data)
                                    $scope.listIsDisable = false
                                } else {
                                    $scope.listIsDisable = true
                                }

                                // toastr.success("Rule List Successfully Loaded", Msg.hurrah);
                            }, function(err) {
                                console.log(err)
                                //  toastr.error("Rule List Failed", Msg.oops);
                            });
                        }

                    } else {
                        $scope.isOptDisabled = true;
                        $scope.txnList = "";
                    }
                }*/

                
                
                
                $scope.transfiledChange = function() {

                    $scope.trans.operator = "";
                    $scope.isList = false;
                    $scope.isValue = false;
                    $scope.trans.list = "";
                    $scope.trans.value1 = "";
                    $scope.trans.value2 = "";
                    $scope.txnList = "";
                    if ($scope.trans.txnFieldName.length > 0) {
                    	
                    	
                    	 $scope.txnOperators = $filter('filter')($scope.txnFieldDatas, {
                             name: $scope.trans.txnFieldName
                         })[0].operetor;
                    	
                    	 $scope.validationItems=$filter('filter')($scope.txnFieldDatas, {
                             name: $scope.trans.txnFieldName
                         }, true)[0]
                    	
                    	
                    	
                    	
                        $scope.isOptDisabled = false;
                    	 $scope.getTxnFld = false
                            ruleEditorManagement.header({}).getHotList({
                                channel: $scope.metadata.channel,
                                orgId: $scope.metadata.orgId,
                                listType: $scope.trans.txnFieldName,
                                hotListTypeCode: 'H'
                            }, function(data) {
                                //  console.log('GOT LIST - ', data)
                                if (data.response !== undefined) {
                                	$scope.getTxnFld = true
                                    $scope.txnList = data.response;
                                    //  console.log('GOT LIST - ', data)
                                    $scope.listIsDisable = false
                                } else {
                                	$scope.getTxnFld = false
                                	if ($scope.trans.txnFieldName === "txnType") {
                                        //$scope.financialDatas = ruleDataService.getFinancial();
                                        $scope.txnList = ruleDataService.getTxnTypes();
                                        $scope.listIsDisable = false
                                    } else if ($scope.trans.txnFieldName === "txnSubType") {
                                        if ($scope.metadata.channel === "UPI") {
                                            $scope.txnList = ruleDataService.getTxnSubTypesUPI();
                                        } else {
                                            $scope.txnList = ruleDataService.getTxnSubTypes();
                                        }
                                        $scope.listIsDisable = false
                                    } else if ($scope.trans.txnFieldName === "txnTime") {
                                        $scope.txnList = ruleDataService.getTxnTimes();
                                        $scope.listIsDisable = false
                                    } else if ($scope.trans.txnFieldName === "AcquiringinstitutionCountrycode") {
                                        var countryList = [];
                                        for (var i = 0; i < ruleDataService.getCountry().length; i++) {
                                            countryList.push(ruleDataService.getCountry()[i].CountryName + ' - ' + ruleDataService.getCountry()[i].NumericCode);
                                        }
                                        $scope.txnList = [...new Set(countryList)];
                                        $scope.listIsDisable = false
                                    } else if ($scope.trans.txnFieldName === "responseCode") {
                                        $scope.txnList = ruleDataService.getResponseCode();
                                        $scope.listIsDisable = false
                                    }else if ($scope.trans.txnFieldName === "mcc") {
                                        $scope.txnList = ruleDataService.getMccHT();
                                        $scope.listIsDisable = false
                                    }else if ($scope.trans.txnFieldName === "IPaddressforRuPay") {
                                        $scope.txnList = ruleDataService.getIPaddressforRuPay();
                                        $scope.listIsDisable = false
                                    }else if ($scope.trans.txnFieldName === "txnApiName") {
                                        $scope.txnList = ruleDataService.getTxnApiName();
                                        $scope.listIsDisable = false
                                    }else{
                                    	$scope.listIsDisable = true
                                    }
                                    
                                }

                                // toastr.success("Rule List Successfully Loaded", Msg.hurrah);
                            }, function(err) {
                                console.log(err)
                                //  toastr.error("Rule List Failed", Msg.oops);
                            });
                    

                    } else {
                        $scope.isOptDisabled = true;
                        $scope.txnList = "";
                    }
                }
                $scope.transListChange = function() {
                    if ($scope.trans.list.length > 0) {
                        $scope.isValueList = false
                    } else {
                        $scope.isValueList = true
                    }
                }

                $scope.operatorChange = function() {
                    $scope.trans.list = "";
                    $scope.trans.value1 = "";
                    $scope.trans.value2 = "";
                    $scope.isView = false
                    if ($scope.trans.operator.length > 0) {
                        $scope.isValueList = false;
                    } else {
                        $scope.isValueList = true;
                        $scope.isList = false;
                        $scope.isValue = false;
                    }
                }


                $scope.cleanMultiSelect = function() {

                    if ($scope.anyTxn === true) {
                        $scope.txnfilter.types = ['ALL']
                        return false
                        //   $scope.isEmptyFinancial = false
                        //   $scope.isEmptyNonFinancial = false
                    } else {
                        return true
                        //    $scope.isEmptyFinancial = true
                        //   $scope.isEmptyNonFinancial = true
                    }
                }

                //  cleanMultiSelect()

                function filter_array(test_array) {
                    var index = -1,
                        arr_length = test_array ? test_array.length : 0,
                        resIndex = -1,
                        result = [];

                    while (++index < arr_length) {
                    	
                        var value = test_array[index];

                        if (value) {
                            result[++resIndex] = value.value;
                            //console.log('Value' , value.name)
                        }
                        
                    }

                    return result;
                }

                $scope.anyTxnChange = function(a) {
                    // cleanMultiSelect()
                    $scope.financial = [];
                    $scope.nonFinancial = [];
                    if ($scope.anyTxn) {

                        $scope.txnfilter.types = ['ALL']


                    } else {
                        //cleanMultiSelect()
                        delete $scope.txnfilter.types
                    }
                }
                function getTypes(item) {
                	
                }
                
                $scope.typeChange = function(a) {

                	
                
                    var financial, nonFinancial, types;


                    financial = $scope.financial || null

                    nonFinancial = $scope.nonFinancial || null


                    if (financial === null) {
                        types = nonFinancial
                    } else {
                        types = financial.concat(nonFinancial);
                    }


                    //  console.log(filter_array(types));
                    $scope.txnfilter.types = filter_array(types)

                    
                }

                if ($scope.txnfilter.types != undefined) {
                    if ($scope.txnfilter.types[0] !== 'ALL') {

                        $scope.financial = [];
                        $scope.nonFinancial = [];

                        angular.forEach($scope.txnfilter.types, function(value, key) {
                        	
                        	var tmpFinType = $filter('filter')(ruleDataService.getFinancial(), {
			                    value: value, for: $scope.metadata.channel
			                });
                        	
                        	if(tmpFinType[0]!=undefined){
                        		$scope.financial.push(tmpFinType[0])
                        	}
                        	
                        	var tmpNotFinType = $filter('filter')(ruleDataService.getNonFinancial(), {
			                    value: value, for: $scope.metadata.channel
			                });
                        	
                        	if(tmpNotFinType[0]!=undefined){
                        		$scope.nonFinancial.push(tmpNotFinType[0])
                        	}
                        	
                        	
                        	
                        	
                        	
                        //	console.log('tmpFinType', tmpFinType[0])
                        //	$scope.financial.push(tmpFinType[0])
                          /*  if ($scope.financialDatas.indexOf(value) !== -1) {
                                $scope.financial.push(value)
                            }*/
/*
                            if ($scope.nonFinancialDatas.indexOf(value) !== -1) {
                                $scope.nonFinancial.push(value)
                            }*/
                           
                        })
                         console.log('FINANCIAL --- ',$scope.financial)
                         console.log('NON FINANCIAL --- ',$scope.nonFinancial)
                    } else {
                        $scope.anyTxn = true;
                        $scope.txnfilter.types = ['ALL'];
                    }


                }



                if ($scope.txnfilter.status != undefined) {
                    $scope.status = $scope.txnfilter.status
                }

                $scope.statusChange = function() {
                    $scope.txnfilter.status = $scope.status
                }
                
                $scope.changeCurrentTxn=function(){
                	if($scope.txnfilter.channels !=undefined){
                		$scope.txnfilter.channels[0].forCurrentTxnOnly=$scope.forCurrentTxnOnly
                	}
                }

                $scope.addChannelChange = function() {

                    //   console.log('Change channnel', $scope.channelName)
                    $scope.allChannels = []
                    var subChannelArray = [];

                    for (var i = 0; i < $scope.channelName.length; i++) {
                        subChannelArray.push($scope.channelName[i].name);
                    }

                    $scope.txnfilter.channels = [];
                    $scope.txnfilter.channels.push({
                        "name": subChannelArray.toString()
                    })

                }
              //  $scope.forCurrentTxnOnly = false;
                $scope.addChannel = function() {
                    if ($scope.allChannels === undefined) {
                        $scope.allChannels = []

                    }

                    $scope.isValue = false;
                    $scope.isList = false;
                    $scope.txnfilter.channels = [];

                    var transList = $scope.trans.list;
                    if ($scope.trans.txnFieldName === 'AcquiringinstitutionCountrycode' && $scope.getTxnFld ===false) {
                        var tempList = []
                        angular.forEach(transList, function(value, key) {
                            tempList.push(value.split(' - ')[1])
                        })
                        //    console.log(tempList.toString())
                        $scope.trans.list = tempList.toString()
                    } else {
                        $scope.trans.list = transList.toString()
                    }

                    $scope.trans.isOr = false;
                    $scope.allChannels.push(angular.copy($scope.trans))

                    var subChannelArray = [];

                    for (var i = 0; i < $scope.channelName.length; i++) {
                        subChannelArray.push($scope.channelName[i].name);
                    }


                    $scope.txnfilter.channels.push({
                        "name": subChannelArray.toString(),
                        "txnFields": $scope.allChannels,
                        "forCurrentTxnOnly": $scope.forCurrentTxnOnly
                    })

                    $scope.trans = {}
                }

                $scope.removeTransField = function(channel) {

                    var index = $scope.allChannels.indexOf(channel);
                    $scope.allChannels.splice(index, 1);

                }

            },
            templateUrl: 'templates/private/ruleEditor/directive/transaction.html',
            link: function(scope, element, attr) {

            }
        }
    })
})()