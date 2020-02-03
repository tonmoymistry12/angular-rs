(function() {
    'use strict';
    angular.module('rule')
        .component('rule', {
            templateUrl: "templates/private/ruleEditor/rule.component.html",
            controller: function(Idle, Keepalive, $scope, $ngConfirm, $window, $state, $location, $http, ruleEditorManagement, toastr, Msg, casesManagement2, editPermission, RuleService, ruleManagement, ruleDataService, commonDataService, ngDialog, $timeout, $filter) {
                Idle.watch();

                $scope.$on('IdleStart', function() {
                    $scope.countDown = 10;
                    var timer = setInterval(function() {
                        $scope.countDown--;
                        $scope.$apply();
                        //   console.log($scope.countDown);
                    }, 1000);
                    ngDialog.open({
                        template: 'sessionTimeOut',
                        scope: $scope
                    });
                });

                $scope.$on('IdleEnd', function() {
                    $scope.countDown = 10;
                    ngDialog.close({
                        template: 'sessionTimeOut',
                        scope: $scope
                    });
                });

                $scope.$on('IdleTimeout', function() {

                });


                $scope.dateFormatChk = function(date) {

                    if ($scope.formParams.ruleMetaData.effectiveFromTs != undefined) {
                        var getFromDate = $scope.formParams.ruleMetaData.effectiveFromTs.split(' ')[0]
                        var getFromTime = $scope.formParams.ruleMetaData.effectiveFromTs.split(' ')[1]
                        if (getFromTime.length > 5) {
                            getFromTime = getFromTime.substring(0, getFromTime.length - 3);
                        }
                        $scope.formParams.ruleMetaData.effectiveFromTs = getFromDate + ' ' + getFromTime
                    }

                    if ($scope.formParams.ruleMetaData.effectiveToTs != undefined) {
                        var getToDate = $scope.formParams.ruleMetaData.effectiveToTs.split(' ')[0]
                        var getToTime = $scope.formParams.ruleMetaData.effectiveToTs.split(' ')[1]
                        //  console.log(getToDate+'----'+getToTime)
                        if (getToTime.length > 5) {
                            getToTime = getToTime.substring(0, getToTime.length - 3);
                        }
                        $scope.formParams.ruleMetaData.effectiveToTs = getToDate + ' ' + getToTime
                    }

                }


                //  console.log('LOCAL STORAGE OrgID',commonDataService.getLocalStorage().orgId)
                //  console.log('LOCAL STORAGE perspective',commonDataService.getLocalStorage().perspective[0])
                $window.scrollTo(0, 0);
                $scope.mandatoryField = "Red border fields are mandatory fields";

                $scope.channels = ruleDataService.getChannel();
                $scope.showMsg = false;

                var isView = RuleService.getCopyFlag()

                if (isView === 'true' || isView === null) {
                    $scope.isView = false;
                } else {
                    $scope.isView = true;
                }
                //alert(isView)
                function loadChannel() {
                    casesManagement2.header(localStorage.getItem("sessionToken")).channel({},
                        function(response) {
                            $scope.channel_code = response.response;
                            var channelComb = [{
                                channelCode: "RuPayAtm,RuPayPos",
                                channelDesc: "ATM, POS and ECOM"
                            }]
                            $scope.channel_code.push(...channelComb);
                        },
                        function(err) {

                        });
                }

                loadChannel()
                $scope.showBankList = false

                function loadOrganizations() {
                    editPermission.header({
                        token: localStorage.getItem("sessionToken")
                    }).bankNamesOrgId({
                        orgId: commonDataService.getLocalStorage().orgId
                    }, function(data) {
                        $scope.bankList = data.response;

                        configureBank()
                    }, function(err) {
                        $scope.bankList = [];
                    });

                }

                loadOrganizations()

                $scope.onlineList = [{
                        name: "Online",
                        text: "True",
                        value: true
                    },
                    {
                        name: "Offline",
                        text: "False",
                        value: false
                    }
                ]
                $scope.ruleTypeList = [{
                        name: "Activity Rule",
                        value: "A",
                        title: "Activity Rule"
                    },
                    {
                        name: "Hotlist Rule",
                        value: "H",
                        title: "Rules which access hotlist rules"
                    }
                ]
                //	$scope.isView=RuleService.getCopyFlag();
                $scope.isEdit = RuleService.getEditFlag() || null;

                var orgId = commonDataService.getLocalStorage().orgId;
                //  var userId = sessionStorage.getItem("userId");
                var userId = commonDataService.getSessionStorage().userId;
                // console.log('USERID ', userId)
                //   var perspective = localStorage.getItem("perspective");

                var perspective = commonDataService.getLocalStorage().perspective;

                $scope.perspective = perspective
                //  $scope.perspective=['ISSUER','ACQUIRER']
                $scope.orgId = orgId
                $scope.currentDate = new Date();

                $scope.hasACQUIRER = ($scope.perspective.indexOf('ACQUIRER') !== -1) ? true : false
                $scope.hasAML = ($scope.orgId === 'NPCI' && ($scope.perspective.indexOf('AML') !== -1)) ? true : false
                $scope.hasISSUER = ($scope.perspective.indexOf('ISSUER') !== -1) ? true : false


                $scope.getRuleData = '';
                $scope.formParams = {
                    "ruleMetaData": {
                        "acquirer": ($scope.perspective.indexOf('ACQUIRER') !== -1) ? true : false,
                        "alertRequired": true,
                        "alertTypeCd": "NPCI",
                        "aml": ($scope.orgId === 'NPCI' && ($scope.perspective.indexOf('AML') !== -1)) ? true : false,
                        "autoClosable": true,
                        "beneficiary": false,
                        "declineFlag": false,
                        "excludeCurrentTxn": false,
                        "issuer": ($scope.perspective.indexOf('ISSUER') !== -1) ? true : false,
                        "npci": false,
                        "online": true,
                        "remitter": false,
                        "supressOnModelScore": false,
                        // "ruleScore": "000",
                        "ruleType": "A",
                        //"effectiveFromTs":$scope.currentDate,
                        "userInformationDTO": {
                            //  "actionType": "PENDING_REVIEW",
                            "notes": "",
                            "orgId": orgId,
                            "userId": userId
                        },

                    },

                    //  "ruleId": "",
                    "txnFilter": {

                    },
                    "payerFilter": {

                    },
                    "payeeFilter": {

                    },
                    "acceptancePointFilter": {

                    },
                    "timeBasedTxnFilter": {

                    },
                    "withTotalOn": {

                    },
                    "withAmount": {
                        "whereAmount": {

                        }
                    },
                    "withCount": {
                        "whereCount": {

                        }
                    }
                };
                var initialData = $scope.formParams;


                //  $scope.intAcquirer =($scope.formParams.ruleMetaData.channel=='RuPayPos') || ($scope.perspective==='ACQUIRER')?true:false;
                $scope.intBeneficiary = ($scope.formParams.ruleMetaData.channel == 'RuPayAtm' || $scope.formParams.ruleMetaData.channel == 'UPI') ? true : false;
                //  $scope.intIssuer = ($scope.formParams.ruleMetaData.channel==='RuPayPos') || ($scope.perspective==='ISSUER')?true:false;
                $scope.intRemitter = ($scope.formParams.ruleMetaData.channel == 'RuPayAtm' || $scope.formParams.ruleMetaData.channel == 'UPI') ? true : false

                $scope.ruleData = $scope.formParams;
                $scope.ruleMetaData = $scope.formParams.ruleMetaData;
                $scope.ruleDataTxnFilter = $scope.formParams.txnFilter;
                $scope.ruleDataPayerFilter = $scope.formParams.payerFilter;
                $scope.ruleDataPayeeFilter = $scope.formParams.payeeFilter;
                $scope.ruleDataAcceptancePointFilter = $scope.formParams.acceptancePointFilter;

                $scope.ruleDataTimeBasedFilter = $scope.formParams.timeBasedTxnFilter;
                $scope.ruleDataTimeBasedTotalFilter = $scope.formParams.withTotalOn;

                $scope.ruleDataWithAmountFilter = $scope.formParams.withAmount;
                $scope.ruleDataWhereAmountFilter = $scope.formParams.withAmount.whereAmount;
                $scope.ruleDataWithCountFilter = $scope.formParams.withCount;
                $scope.ruleDataWhereCountFilter = $scope.formParams.withCount.whereCount;

                $scope.stage = "";
                $scope.formValidation = false;
                $scope.toggleJSONView = false;
                $scope.toggleFormErrorsView = false;

                $scope.addBank = function(bank) {
                    $scope.bankModel = bank
                    var bnkList = [];
                    if (bank.length > 0) {
                        for (var i = 0; i < bank.length; i++) {
                            bnkList.push(bank[i].orgId);
                        }
                        $scope.formParams.ruleMetaData.orgId = [...new Set(bnkList)].toString();
                        RuleService.setOrgForUnique($scope.formParams.ruleMetaData.orgId)
                        //  console.log('overridingRulesList - ', $scope.overridingRulesList)
                        //  if(isView===null && $scope.isEdit===null ){
                        $scope.uniqueChk()
                        //  }

                    }

                }
                $scope.getOrgIdTxt = function(bank) {

                    var bnkList = [];
                    if (bank != undefined && bank.length > 0) {
                        for (var i = 0; i < bank.length; i++) {
                            bnkList.push(bank[i].orgId);
                        }
                        $scope.forOrg = [...new Set(bnkList)].toString()

                        return [...new Set(bnkList)].toString()
                        // $scope.formParams.ruleMetaData.orgId =$scope.forOrg;
                    }
                    $scope.forOrg = ""
                    if (!$scope.forOrg) {
                        delete $scope.formParams.ruleMetaData.orgId
                    }
                    //delete $scope.formParams.ruleMetaData.orgId

                }

                function configureBank() {



                    $scope.showBankList = true
                    var orgs

                    if ($scope.formParams.ruleMetaData.orgId == 'NPCI' && $scope.formParams.ruleMetaData.userInformationDTO.orgId == 'NPCI') {
                        orgs = [{
                            name: "NPCI [NPCI]",
                            orgId: "NPCI"
                        }]
                    } else {
                        orgs = $scope.bankList
                    }
                    //console.log('** orgs ** ',orgs)
                    //	console.log('** isView ** ',isView)
                    var setOrgId
                    if (isView === null && $scope.isEdit === null) {
                        $scope.formParams.ruleMetaData.orgId = orgId
                        $scope.bankModel = $filter('filter')(orgs, {
                            orgId: orgId
                        });
                        setOrgId = orgId
                        //	console.log('bankModel for NEW- ',$scope.bankModel);

                    } else {
                        if ($scope.formParams.ruleMetaData.orgId != undefined) {
                            $scope.bankModel = $filter('filter')(orgs, {
                                orgId: $scope.formParams.ruleMetaData.orgId
                            });
                            setOrgId = $scope.formParams.ruleMetaData.orgId
                            //	console.log('bankModel for EDIT/COPY/VIEW- ',$scope.bankModel);
                        }

                        $window.document.getElementById('ruleId').focus()
                    }
                    //console.log('**setOrgId** ',setOrgId)

                    RuleService.setOrgForUnique(setOrgId)


                }

                //  $scope.formParams.ruleMetaData.orgId=$scope.formParams.ruleMetaData.userInformationDTO.orgId
                //  $scope.formParams.ruleMetaData.userInformationDTO.orgId=orgId;




                /* FOR DATE PICKER START */
                $scope.dateRequired = true
                /* $scope.dateChange=function(date){
                 	
                 	if(date.length>0){
                 		$scope.visitedRuleEffectiveFromTs=true
                 		$scope.startDate=date
                 	}else{
                 		$scope.visitedRuleEffectiveFromTs=false
                 		$scope.startDate="";
                 	}
                 }*/

                /* FOR DATE PICKER END */


                /* FOR OVER RIDING RULES START */

                $scope.disableSubmit = true;
                $scope.isOvrriding = false;
                $scope.getRulesForOverriding = function(orgId, channel, status) {

                    if (channel != undefined) {

                        $scope.isOvrriding = true;

                        ruleManagement.header().viewRule({
                            orgId: orgId,
                            channel: channel,
                            status: status
                        }, function(response) {
                            var arrayList = [];
                            if (response.response.data != null && !angular.isUndefined(response.response.data)) {
                                for (var i = 0; i < response.response.data.length; i++) {
                                    arrayList.push(response.response.data[i].ruleId);
                                }
                                $scope.overridingRuleList = [...new Set(arrayList)];
                                //  console.log('overridingRulesList - ', $scope.overridingRulesList)
                            }
                        }, function(err) {

                        })
                    } else {
                        $scope.isOvrriding = false;
                        $scope.overridingRuleList = '';
                    }


                }
                $scope.onChannelChange = function(channel) {

                    /*if(channel==='IMPS'||channel==='UPI'){
                    	$scope.formParams.ruleMetaData.beneficiary=true
                    	$scope.formParams.ruleMetaData.remitter=true
                    }else{
                    	$scope.formParams.ruleMetaData.beneficiary=false
                    	$scope.formParams.ruleMetaData.remitter=false
                    }*/
                    if ($scope.formParams.ruleMetaData.channel === 'AEPS') {
                        delete $scope.formParams.withTotalOn.sources
                        delete $scope.formParams.withTotalOn.acceptances
                    }
                    if ($scope.hasAML !== true) {
                        if ((channel.startsWith('IMPS') && $scope.hasISSUER && $scope.hasACQUIRER) ||
                            (channel.startsWith('AEPS') && $scope.hasISSUER && $scope.hasACQUIRER) ||
                            (channel == 'UPI' && $scope.hasISSUER && $scope.hasACQUIRER)) {
                            $scope.formParams.ruleMetaData.remitter = true;
                            $scope.formParams.ruleMetaData.beneficiary = true;
                            $scope.formParams.ruleMetaData.issuer = false;
                            $scope.formParams.ruleMetaData.acquirer = false;
                            $scope.disableSubmit = true;
                        } else if (channel.startsWith('IMPS') && $scope.hasISSUER || channel.startsWith('AEPS') && $scope.hasISSUER || channel == 'UPI' && $scope.hasISSUER) {
                            $scope.formParams.ruleMetaData.remitter = true;
                            $scope.formParams.ruleMetaData.beneficiary = false;
                            $scope.formParams.ruleMetaData.issuer = false;
                            $scope.formParams.ruleMetaData.acquirer = false;
                            $scope.disableSubmit = false;
                        } else if (channel.startsWith('IMPS') && $scope.hasACQUIRER || channel.startsWith('AEPS') && $scope.hasACQUIRER || channel == 'UPI' && $scope.hasACQUIRER) {
                            $scope.formParams.ruleMetaData.remitter = false;
                            $scope.formParams.ruleMetaData.beneficiary = true;
                            $scope.formParams.ruleMetaData.issuer = false;
                            $scope.formParams.ruleMetaData.acquirer = false;
                            $scope.disableSubmit = false;
                        } else if ((channel == 'RuPayPos' && $scope.hasISSUER && $scope.hasACQUIRER) ||
                            (channel.startsWith('RuPayAtm') && $scope.hasISSUER && $scope.hasACQUIRER)) {
                            $scope.formParams.ruleMetaData.remitter = false;
                            $scope.formParams.ruleMetaData.beneficiary = false;
                            $scope.formParams.ruleMetaData.issuer = true;
                            $scope.formParams.ruleMetaData.acquirer = true;
                            $scope.disableSubmit = true;
                        } else if (channel == 'RuPayPos' && $scope.hasISSUER || channel.startsWith('RuPayAtm') && $scope.hasISSUER) {
                            $scope.formParams.ruleMetaData.remitter = false;
                            $scope.formParams.ruleMetaData.beneficiary = false;
                            $scope.formParams.ruleMetaData.issuer = true;
                            $scope.formParams.ruleMetaData.acquirer = false;
                            $scope.disableSubmit = false;
                        } else if (channel == 'RuPayPos' && $scope.hasACQUIRER || channel.startsWith('RuPayAtm') && $scope.hasACQUIRER) {
                            $scope.formParams.ruleMetaData.remitter = true;
                            $scope.formParams.ruleMetaData.beneficiary = false;
                            $scope.formParams.ruleMetaData.issuer = true;
                            $scope.formParams.ruleMetaData.acquirer = false;
                            $scope.disableSubmit = false;
                        }
                    } else {
                        $scope.disableSubmit = false;
                    }

                    //  $scope.intAcquirer =($scope.formParams.ruleMetaData.channel=='RuPayPos') || ($scope.perspective==='ACQUIRER')?true:false;
                    //  $scope.intBeneficiary = ($scope.formParams.ruleMetaData.channel=='RuPayAtm'||$scope.formParams.ruleMetaData.channel=='UPI')?true:false;
                    //  $scope.intIssuer = ($scope.formParams.ruleMetaData.channel==='RuPayPos') || ($scope.perspective==='ISSUER')?true:false;
                    //   $scope.intRemitter =  ($scope.formParams.ruleMetaData.channel=='RuPayAtm'||$scope.formParams.ruleMetaData.channel=='UPI')?true:false

                    $scope.getRulesForOverriding(orgId, channel.replace(',', '_'), "ACTIVE")

                    if ($scope.ruleDataTxnFilter.channels != undefined) {
                        delete $scope.ruleDataTxnFilter.channels
                    }

                }

                $scope.issuerAcqr = false;
                $scope.beneficiaryRemtr = false;


                /* function dateFormat(d){
                	if(d){
                	//	d.split(' ')
                    	//console.log('____===',d.split(" ")[0])
                    	var date = d.split(" ")[0]
                    	var time = d.split(" ")[1]
                    	var dd =d.split(" ")[0].split("-")[0]
                    	var mm=d.split(" ")[0].split("-")[1]
                    	var yyyy=d.split(" ")[0].split("-")[2]
                    	return yyyy+","+mm+","+dd+" "+time
                	}
                	
                }
                $scope.simTimeRange=false;
                $scope.$watch('formParams.ruleMetaData.effectiveToTs', function (newValue, oldValue, scope) {
                //	console.log('formParams.ruleMetaData.effectiveToTs ',$scope.formParams.ruleMetaData.effectiveToTs)
                	
                	
                	if(!$scope.formParams.ruleMetaData.effectiveToTs){
                		delete $scope.formParams.ruleMetaData.effectiveToTs
                		delete $scope.formParams.ruleMetaData.effectiveToTs_detail
                	}
                	
                	
                	
                	
                	var rule = $scope.formParams.ruleMetaData.ruleName
                	if (rule && fmDt!='Invalid Date' && toDt!='Invalid Date') {
                		
                		var fmDt = new Date(dateFormat($scope.formParams.ruleMetaData.effectiveFromTs))
                    	var toDt = new Date(dateFormat($scope.formParams.ruleMetaData.effectiveToTs))
            
                		if (rule.toLowerCase().contains("simulated")) {
                			//console.log('its simulated rule'+fmDt+toDt)
                			if (toDt && fmDt) {
                				var diff = (toDt.getTime() - fmDt.getTime()) / 1000;
                				diff /= 60;
                				//console.log(Math.round(diff * 60))
                				//console.log(Math.abs(Math.round(diff * 60)))
                				if (Math.round(diff * 60) <= 21600 && Math.round(diff * 60)>0) {
                					//console.log('OK')
                					$scope.simTimeRange=false;
                				} else {
                					//console.log('NO')
                					$scope.simTimeRange=true;
                				}
                			}

                		}

                	}


                })*/

                $scope.$watch('formParams.ruleMetaData.issuer', function(newValue, oldValue, scope) {
                    if (($scope.formParams.ruleMetaData.issuer === false && $scope.formParams.ruleMetaData.acquirer === false && $scope.hasACQUIRER && $scope.hasISSUER) ||
                        ($scope.formParams.ruleMetaData.issuer === true && $scope.formParams.ruleMetaData.acquirer === true && $scope.hasACQUIRER && $scope.hasISSUER)) {
                        $scope.issuerAcqr = true;
                        $scope.disableSubmit = true;
                    } else {
                        $scope.issuerAcqr = false;
                        $scope.disableSubmit = false;
                    }
                })

                $scope.$watch('formParams.ruleMetaData.acquirer', function(newValue, oldValue, scope) {
                    if (($scope.formParams.ruleMetaData.issuer === false && $scope.formParams.ruleMetaData.acquirer === false && $scope.hasACQUIRER && $scope.hasISSUER) ||
                        ($scope.formParams.ruleMetaData.issuer === true && $scope.formParams.ruleMetaData.acquirer === true) && $scope.hasACQUIRER && $scope.hasISSUER) {
                        $scope.issuerAcqr = true;
                        $scope.disableSubmit = true;
                    } else {
                        $scope.issuerAcqr = false;
                        $scope.disableSubmit = false;
                    }
                })

                $scope.$watch('formParams.ruleMetaData.beneficiary', function(newValue, oldValue, scope) {
                    if (($scope.formParams.ruleMetaData.beneficiary === false && $scope.formParams.ruleMetaData.remitter === false && $scope.hasACQUIRER && $scope.hasISSUER) ||
                        ($scope.formParams.ruleMetaData.beneficiary === true && $scope.formParams.ruleMetaData.remitter === true && $scope.hasACQUIRER && $scope.hasISSUER)) {
                        $scope.beneficiaryRemtr = true;
                        $scope.disableSubmit = true;
                    } else {
                        $scope.beneficiaryRemtr = false;
                        $scope.disableSubmit = false;
                    }
                })

                $scope.$watch('formParams.ruleMetaData.remitter', function(newValue, oldValue, scope) {
                    if (($scope.formParams.ruleMetaData.beneficiary === false && $scope.formParams.ruleMetaData.remitter === false && $scope.hasACQUIRER && $scope.hasISSUER) ||
                        ($scope.formParams.ruleMetaData.beneficiary === true && $scope.formParams.ruleMetaData.remitter === true && $scope.hasACQUIRER && $scope.hasISSUER)) {
                        $scope.beneficiaryRemtr = true;
                        $scope.disableSubmit = true;
                    } else {
                        $scope.beneficiaryRemtr = false;
                        $scope.disableSubmit = false;
                    }
                })

                $scope.scoreChange = function(v) {
                    //	console.log('SCORE ', v)
                    if (v >= 900) {
                        $scope.formParams.ruleMetaData.alertRequired = true;
                    }
                }
                /* FOR OVER RIDING RULES END */

                $scope.changeNpci = function() {
                    $scope.formParams.ruleMetaData.npci = ($scope.hasAML == true) ? true : false
                    $scope.formParams.ruleMetaData.aml = ($scope.hasAML == true) ? true : false
                }

                // Navigation functions
                $scope.next = function(stage) {
                    //$scope.direction = 1;
                    //$scope.stage = stage;

                    $scope.formValidation = true;

                    if ($scope.createRule.$valid) {
                        $scope.direction = 1;
                        $scope.stage = stage;
                        $scope.formValidation = false;
                    }
                };

                $scope.back = function(stage) {
                    $scope.direction = 0;
                    $scope.stage = stage;
                };

                $scope.getRuleLoad = function(ruleDatas) {


                    //var viewservice = RuleService.getCopyFlag()

                    $scope.getRuleData = ruleDatas

                    var mergedObject = angular.merge($scope.formParams, $scope.getRuleData);

                    $scope.formParams = mergedObject;

                    var tmpStartDate = $scope.getRuleData.ruleMetaData.effectiveFromTs
                    var startDate = tmpStartDate.slice(0, -3)
                    $scope.getRuleData.ruleMetaData.effectiveFromTs = startDate;

                    if ($scope.getRuleData.ruleMetaData.effectiveToTs != undefined) {
                        var tmpToDate = $scope.getRuleData.ruleMetaData.effectiveToTs
                        var toDate = tmpToDate.slice(0, -3)
                        $scope.getRuleData.ruleMetaData.effectiveToTs = toDate;
                    }


                    if (RuleService.getCopyFlag() === 'true') {
                        delete $scope.getRuleData.ruleMetaData.userInformationDTO.orgId
                        delete $scope.getRuleData.ruleMetaData.userInformationDTO.userId
                        delete $scope.getRuleData.ruleMetaData.userInformationDTO.userId
                        //delete $scope.getRuleData.ruleMetaData.id
                        delete $scope.getRuleData.ruleMetaData.effectiveFromTs
                        delete $scope.getRuleData.ruleMetaData.effectiveToTs

                        delete $scope.getRuleData.ruleMetaData.userInformationDTO.userIdOrig

                        delete $scope.getRuleData.ruleMetaData.userInformationDTO.rejectedByOrgId;
                        delete $scope.getRuleData.ruleMetaData.userInformationDTO.rejectedByUserId
                        delete $scope.getRuleData.ruleMetaData.userInformationDTO.rejectedByUserIdOrig;

                        delete $scope.getRuleData.ruleMetaData.userInformationDTO.updatedByOrgId;
                        delete $scope.getRuleData.ruleMetaData.userInformationDTO.updatedByUserId;
                        delete $scope.getRuleData.ruleMetaData.userInformationDTO.updatedByUserIdOrig;

                        delete $scope.getRuleData.ruleMetaData.userInformationDTO.approvedByUserId
                        delete $scope.getRuleData.ruleMetaData.userInformationDTO.approvedByOrgId
                        delete $scope.getRuleData.ruleMetaData.userInformationDTO.approvedByUserIdOrig

                        delete $scope.getRuleData.ruleMetaData.userInformationDTO.deactivatedByOrgId
                        delete $scope.getRuleData.ruleMetaData.userInformationDTO.deactivatedByUserId
                        delete $scope.getRuleData.ruleMetaData.userInformationDTO.deactivatedByUserIdOrig


                        //delete $scope.getRuleData.ruleMetaData.ruleId
                    }

                    if (RuleService.getEditFlag() === 'true') {
                        /*if(orgId!='NPCI'){
                    		delete $scope.getRuleData.ruleMetaData.userInformationDTO.orgId
                        	delete $scope.getRuleData.ruleMetaData.userInformationDTO.userId
                    	}else{
                    		delete $scope.getRuleData.ruleMetaData.userInformationDTO.userId
                    	}*/
                        delete $scope.getRuleData.ruleMetaData.userInformationDTO.orgId
                        delete $scope.getRuleData.ruleMetaData.userInformationDTO.userId
                    }

                    //	console.log('GET - ',$scope.getRuleData)




                    configureBank()

                    $scope.ruleMetaData = $scope.formParams.ruleMetaData;
                    $scope.ruleDataTxnFilter = $scope.formParams.txnFilter;
                    $scope.ruleDataPayerFilter = $scope.formParams.payerFilter;
                    $scope.ruleDataPayeeFilter = $scope.formParams.payeeFilter;
                    $scope.ruleDataAcceptancePointFilter = $scope.formParams.acceptancePointFilter;

                    $scope.ruleDataTimeBasedFilter = $scope.formParams.timeBasedTxnFilter;
                    $scope.ruleDataTimeBasedTotalFilter = $scope.formParams.withTotalOn;

                    $scope.ruleDataWithAmountFilter = $scope.formParams.withAmount;
                    $scope.ruleDataWhereAmountFilter = $scope.formParams.withAmount.whereAmount;
                    $scope.ruleDataWithCountFilter = $scope.formParams.withCount;
                    $scope.ruleDataWhereCountFilter = $scope.formParams.withCount.whereCount;

                    /*if($scope.getRuleData.ruleMetaData.remitter||$scope.getRuleData.ruleMetaData.acquirer||
                        $scope.getRuleData.ruleMetaData.issuer||$scope.getRuleData.ruleMetaData.beneficiary||$scope.hasAML){
                        $scope.disableSubmit=false;
                    }*/
                    //  configureBank($scope.formParams.ruleMetaData.orgId)

                    if (($scope.getRuleData.ruleMetaData.issuer === false && $scope.getRuleData.ruleMetaData.acquirer === false && $scope.hasACQUIRER && $scope.hasISSUER) ||
                        ($scope.getRuleData.ruleMetaData.issuer === true && $scope.getRuleData.ruleMetaData.acquirer === true && $scope.hasACQUIRER && $scope.hasISSUER)) {
                        $scope.issuerAcqr = false;
                        $scope.disableSubmit = false;
                    } else if (($scope.getRuleData.ruleMetaData.beneficiary === false && $scope.getRuleData.ruleMetaData.remitter === false && $scope.hasACQUIRER && $scope.hasISSUER) ||
                        ($scope.getRuleData.ruleMetaData.beneficiary === true && $scope.getRuleData.ruleMetaData.remitter === true && $scope.hasACQUIRER && $scope.hasISSUER)) {
                        $scope.beneficiaryRemtr = false;
                        $scope.disableSubmit = false;
                    }
                }


                $scope.getRule = function() {
                    //console.log('get rule - ',RuleService.getRules())
                    /*console.log('get rule api RuleId - ',RuleService.getRules().ruleId)
                    console.log('get rule api RuleName - ',RuleService.getRules().ruleName)*/
                    $scope.formParams.ruleName = RuleService.getRules().ruleName
                    // alert(RuleService.getRules().ruleDetailsId)
                    var ruleDetailsId = (RuleService.getRules().ruleDetailsId) != null ? RuleService.getRules().ruleDetailsId : 0;
                    ruleEditorManagement.header({}).getRule({
                        ruleId: RuleService.getRules().ruleName,
                        id: (RuleService.getRules().userInformationDTO === undefined) ? ruleDetailsId : RuleService.getRules().id,
                        orgId: RuleService.getRules().orgId
                    }, function(data) {
                        $scope.getRuleLoad(data.response)
                        toastr.success("Rule List Successfully Loaded", Msg.hurrah);
                    }, function(err) {
                        //  console.log(err)
                        toastr.error("Rule List Failed", Msg.oops);
                    });
                }

                if (RuleService.getCopyFlag() || RuleService.getEditFlag()) {
                    $scope.copyFlag = RuleService.getCopyFlag();
                    $scope.editFlag = RuleService.getEditFlag();

                    $scope.getRule();

                }


                // $scope.formParams.ruleMetaData.effectiveFromTs = $filter('date')($scope.currentDate, "dd-mm-yyyy")+" "+$filter('date')($scope.currentDate, "hh:mm")
                // Post to desired exposed web service.
                $scope.submitForm = function() {
                    var today = $filter('date')($scope.currentDate, "dd-MM-yyyy")
                    var startDate
                    var getDate = $scope.formParams.ruleMetaData.effectiveFromTs.split(' ')[0]

                    if (getDate === today) {
                        var getTime = $scope.formParams.ruleMetaData.effectiveFromTs.split(' ')[1]
                        startDate = getDate + " " + $filter('date')($scope.currentDate, "hh:mm") + ":00"
                    } else {
                        startDate = $scope.formParams.ruleMetaData.effectiveFromTs + ":00"
                    }

                    //console.log($scope.formParams.ruleMetaData.effectiveFromTs.split(' '))

                    $scope.formParams.ruleMetaData.effectiveFromTs = startDate;

                    if ($scope.formParams.ruleMetaData.effectiveToTs != undefined) {
                        var toDate = $scope.formParams.ruleMetaData.effectiveToTs + ":00"
                        $scope.formParams.ruleMetaData.effectiveToTs = toDate;
                    }

                    //console.log('CREATE - ',$scope.formParams)
                    createRule($scope.formParams)
                };



                $scope.parse = function() {

                    if ($scope.formParams.payeeFilter.mccIn != undefined || $scope.formParams.payeeFilter.mccNotIn != undefined) {
                        if ($scope.formParams.payeeFilter.mccIn.length <= 0) {
                            delete $scope.formParams.payeeFilter.mccIn
                        }
                        if ($scope.formParams.payeeFilter.mccNotIn.length <= 0) {
                            delete $scope.formParams.payeeFilter.mccNotIn
                        }
                    }
                    /*$window.scrollTo(0, 0);*/
                    var today = $filter('date')($scope.currentDate, "dd-MM-yyyy")
                    var startDate
                    var getDate = $scope.formParams.ruleMetaData.effectiveFromTs.split(' ')[0]

                    if (getDate === today) {
                        var getTime = $scope.formParams.ruleMetaData.effectiveFromTs.split(' ')[1]
                        startDate = getDate + " " + $filter('date')($scope.currentDate, "hh:mm") + ":00"
                    } else {
                        startDate = $scope.formParams.ruleMetaData.effectiveFromTs + ":00"
                    }
                    $scope.formParams.ruleMetaData.effectiveFromTs = startDate;
                    if ($scope.formParams.ruleMetaData.effectiveToTs != undefined) {

                        //	console.log($scope.formParams.ruleMetaData.effectiveToTs.length)
                        if ($scope.formParams.ruleMetaData.effectiveToTs.length === 0) {
                            delete $scope.formParams.ruleMetaData.effectiveToTs
                        } else {
                            var toDate = $scope.formParams.ruleMetaData.effectiveToTs + ":00"
                            $scope.formParams.ruleMetaData.effectiveToTs = toDate;
                        }
                    }

                    //console.log('PARSE - ',$scope.formParams)
                    parseRule($scope.formParams)
                };

                function parseRule(config) {

                    delete $scope.parseMsg;
                    delete $scope.ruleExpression;
                    ruleEditorManagement.header({}).parseRule({
                        channel: null,
                        orgId: null
                    }, config, function(data) {
                        //  console.log('PARSE  ', data)

                        if (data.response.success === false) {
                            $scope.msgColor = "alert alert-danger"
                            $scope.parseMsg = data.response.parseResult
                            $scope.ruleExpression = data.response.ruleExpression
                        } else {
                            $scope.msgColor = "alert alert-success"
                            $scope.parseMsg = data.response.parseResult
                            $scope.ruleExpression = data.response.ruleExpression
                        }
                        console.log('Parse :: Rule Expression - ', $scope.ruleExpression)
                        $scope.showMsg = true;
                        /*$ngConfirm({
                   			title:$scope.formParams.ruleId,
                   			theme: 'Material',
                   			//icon: 'fa fa-unlock',
                   			 content: '<div><div class="'+$scope.msgColor+'">'+$scope.parseMsg+'</div><div class="alert alert-info">'+$scope.ruleExpression+'</div></div>',
                   			scope: $scope,
                   			buttons: {
                   				Cancel : {
                                       text : 'Cancel',
                                       action : function(scope,button) {

                                           $scope.showMsg = false;

                                       }

                                   }
                   			}
                   		});*/
                    }, function(err) {
                        //  console.log(err)
                        toastr.error("Rule Creation Failed", Msg.oops);
                    });
                }


                $scope.hideParse = function() {
                    $scope.showMsg = false;
                }

                function createRule(config) {

                    if (RuleService.getCopyFlag() === 'true') {
                        delete $scope.formParams.ruleMetaData.id
                    }



                    if ($scope.formParams.payeeFilter.mccIn != undefined || $scope.formParams.payeeFilter.mccNotIn != undefined) {
                        if ($scope.formParams.payeeFilter.mccIn.length <= 0) {
                            delete $scope.formParams.payeeFilter.mccIn
                        }
                        if ($scope.formParams.payeeFilter.mccNotIn.length <= 0) {
                            delete $scope.formParams.payeeFilter.mccNotIn
                        }
                    }
                    if ($scope.formParams.ruleMetaData.effectiveToTs != undefined) {
                        if ($scope.formParams.ruleMetaData.effectiveToTs.length === 0) {
                            delete $scope.formParams.ruleMetaData.effectiveToTs
                        }
                        delete $scope.formParams.ruleMetaData.effectiveToTs
                    }
                    //  console.log('rule data to be saves - ', config)

                    if (RuleService.getEditFlag() === 'true') {

                        ruleEditorManagement.header({}).editRule({
                            channel: null,
                            orgId: null
                        }, config, function(data) {
                            //   console.log('EDIT@ = ', data)
                            /*if (data.response.errorCode === "00") {
                            	toastr.success(data.response.data, Msg.hurrah);
                            	if(data.response.warnings!==undefined){
                            	    toastr.warning(data.response.warning, Msg.hurrah);
                                   }
                                $state.go('dashboard.viewRule');
                                
                            } else {
                                toastr.error(data.response.data, Msg.oops);
                            }*/
                            if (data.response.errorCode === "00") {
                                toastr.success(data.response.data.toString(), Msg.hurrah);
                            }
                            if (data.response.errorCode === "99") {
                                toastr.warning(data.response.data.toString(), Msg.oops);
                            }
                            if (data.response.errorDesc) {
                                toastr.error(data.response.errorDesc.toString(), Msg.oops);
                            }
                            $state.go('dashboard.viewRule');
                        }, function(err) {
                            //   console.log(err)
                            toastr.error("Rule Creation Failed", Msg.oops);
                        });
                    } else {

                        ruleEditorManagement.header({}).createRule({
                            channel: null,
                            orgId: null
                        }, config, function(data) {
                            //  console.log('CREATE@ = ', data)


                            /* if (data.response.errorCode === "00") {
                             	 toastr.success(data.response.data, Msg.hurrah);
                             	// toastr.warning("War", Msg.hurrah);
                             	 if(data.response.warnings!==undefined){
                             	    toastr.warning(data.response.warning, Msg.hurrah);
                                     }
                                  $state.go('dashboard.viewRule');
                                    
                             } else {
                                 toastr.error(data.response.data, Msg.oops);
                             }*/
                            if (data.response.errorCode === "00") {
                                toastr.success(data.response.data.toString(), Msg.hurrah);

                            } else {
                                //if(Array.isArray(data.response.data)){
                                toastr.error(data.response.data.toString(), Msg.oops);
                                /*}else{
                                	toastr.error(data.response.data, Msg.oops);
                                }*/

                            }
                            if (data.response.errorDesc) {
                                toastr.error(data.response.errorDesc.toString(), Msg.oops);
                            }
                            $state.go('dashboard.viewRule');
                        }, function(err) {
                            // console.log(err)
                            toastr.error("Rule Creation Failed", Msg.oops);
                        });
                    }
                }


                $scope.reset = function() {
                    // Clean up scope before destorying
                    $scope.formParams = initialData;
                    $scope.stage = "";
                }

                $scope.reset()
                /*       $scope.isSimulatedd=false
                       $scope.isSimulated=function(rule){
                       	if(rule){
                       		if(rule.toLowerCase().contains("simulated")){
                           		$scope.formParams.ruleMetaData.alertRequired=false
                           		$scope.formParams.ruleMetaData.ruleScore='0'
                           		
                           		$scope.isSimulatedd=true
                           	}else{
                           		$scope.formParams.ruleMetaData.alertRequired=true
                           		$scope.formParams.ruleMetaData.ruleScore='';
                           		$scope.formParams.ruleMetaData.priority='';
                           		delete $scope.formParams.ruleMetaData.effectiveToTs
                           		$scope.isSimulatedd=false
                           	}
                       	}
                       	
                       }*/


                /* $scope.priorityValid=function(priority){
                 	
                 	if($scope.isSimulatedd){
                 		if(priority<9999){
                 			$scope.disableSubmit=true;
                 			return true
                 		}else{
                 			$scope.disableSubmit=false;
                 			return false
                 		}
                 		
                 	}
                 	//return false
                 }*/



                $scope.uniqueChk = function() {

                    var orgId = RuleService.getOrgForUnique();
                    //	console.log('orgId===== ',orgId.replace(/,/g, "_"))
                    var currentValue = $scope.formParams.ruleMetaData.ruleName;
                    //    console.log('RULE NAME ',$scope.formParams.ruleMetaData.ruleName)
                    ruleEditorManagement.header({}).checkUniqueRuleName({
                        ruleId: currentValue,
                        orgId: orgId.replace(/,/g, "_")
                    }, function(unique) {
                        /*console.log('message ',unique)
                        console.log('duplicate rule id ',unique.response)*/
                        if (unique.response === false && currentValue.length > 0) {
                            $scope.createRule.ruleId.$setValidity('unique', true);
                        } else {
                            $scope.createRule.ruleId.$setValidity('unique', false);
                            toastr.error(unique.message, Msg.oops);
                        }
                    }, function(err) {
                        //	ngModel.$setValidity('unique', true);
                        /*  console.log(err)
                          toastr.error("Rule List Failed", Msg.oops);*/
                    });
                }


            }
        })
        .directive('number', function() {
            return {
                require: 'ngModel',
                restrict: 'A',
                link: function(scope, element, attrs, ctrl) {
                    ctrl.$parsers.push(function(input) {
                        if (input == undefined) return ''
                        var inputNumber = input.toString().replace(/[^0-9]/g, '');
                        if (inputNumber != input) {
                            ctrl.$setViewValue(inputNumber);
                            ctrl.$render();
                        }
                        return inputNumber;
                    });
                }
            };
        })
        .directive('ngSpace', function() {
            return function(scope, element, attrs) {
                element.bind("keydown", function(event) {
                    if (event.keyCode == 32) event.preventDefault();
                });
            };
        })
        .directive('uniqueRuleName', function(ruleEditorManagement, commonDataService, RuleService, toastr, Msg) {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function(scope, element, attrs, ngModel) {
                    element.bind('blur', function(e) {



                        if (!ngModel || !element.val()) return;

                        var orgId = RuleService.getOrgForUnique();
                        var currentValue = element.val();

                        ruleEditorManagement.header({}).checkUniqueRuleName({
                            ruleId: element.val(),
                            orgId: orgId.replace(/,/g, "_")
                        }, function(unique) {
                            //	console.log('duplicate rule id ',unique.response)
                            if (unique.response === false && element.val().length > 0) {
                                ngModel.$setValidity('unique', true);
                            } else {
                                ngModel.$setValidity('unique', false);
                                toastr.error(unique.message, Msg.oops);
                            }
                        }, function(err) {
                            //	ngModel.$setValidity('unique', true);
                            /*  console.log(err)
                              toastr.error("Rule List Failed", Msg.oops);*/
                        });


                        /*ruleEditorManagement.checkUniqueRuleName(keyProperty.key, keyProperty.property, currentValue)
                            .then(function (unique) {
                                //Ensure value that being checked hasn't changed
                                //since the Ajax call was made
                                if (currentValue == element.val()) { 
                                    ngModel.$setValidity('unique', unique);
                                }
                            }, function () {
                                //Probably want a more robust way to handle an error
                                //For this demo we'll set unique to true though
                                ngModel.$setValidity('unique', true);
                            });*/
                    });
                }
            }
        })
        .directive('toggle', function() {
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {
                    if (attrs.toggle == "tooltip") {
                        $(element).tooltip();
                    }
                    if (attrs.toggle == "popover") {
                        $(element).popover();
                    }
                }
            };
        })
        .directive("progressbarsessiontimeout", function() {
            return {
                restrict: "A",
                scope: {
                    total: "=",
                    current: "="
                },
                link: function(scope, element) {

                    scope.$watch("current", function(value) {
                        element.css("width", scope.current / scope.total * 100 + "%");
                    });
                    scope.$watch("total", function(value) {
                        element.css("width", scope.current / scope.total * 100 + "%");
                    })
                }
            };
        })
        .filter('formatArray', ['OptionalInjection', function(OptionalInjection) {
            return function(value) {
                if (!angular.isArray(value)) return '';
                return value.map(OptionalInjection.formatter).join(', '); // or just return value.join(', ');
            };
        }])
        .config(['KeepaliveProvider', 'IdleProvider', function(KeepaliveProvider, IdleProvider) {

            var userEmail = localStorage.getItem("userEmail");
            //console.log('call',userEmail)
            IdleProvider.idle(13 * 60);
            IdleProvider.timeout(13 * 60);
            KeepaliveProvider.interval(60);
            KeepaliveProvider.http('/session/update?userEmail=' + userEmail);
        }]);
})()