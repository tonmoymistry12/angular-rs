'use strict';

angular.module('efrm.dashboard')
    .controller('unapprovedRulesController', ['$scope', '$state', 'MyCases', 'statusService', 'UserService', '$location', 'SearchCaseService', 'casesManagement2', 'RolePermissionMatrix', '$ngConfirm', 'casesManagement', 'toastr', 'Msg', 'Session', 'alertService', 'editPermission', 'ruleManagement', 'RuleService', 'ngDialog', 'ruleEditorManagement','commonDataService', function($scope, $state, MyCases, statusService, UserService, $location, SearchCaseService, casesManagement2, RolePermissionMatrix, $ngConfirm, casesManagement, toastr, Msg, Session, alertService, editPermission, ruleManagement, RuleService, ngDialog, ruleEditorManagement,commonDataService) {

        var orgId = commonDataService.getLocalStorage().orgId;
       // var userId = sessionStorage.getItem("userId");
        var userId =  commonDataService.getSessionStorage().userId;
      //  console.log('USERID ', userId)
        $scope.loggedInUser = userId;
        //$scope.selectedChannel='';
        $scope.currentDate =new Date();
        $scope.data = [];
        //console.log($scope.data+'  '+$scope.data.length);
        $scope.status = ['PENDING_REVIEW', 'ACTIVE', 'DEACTIVATED', 'REJECTED'];
        $scope.bankList = [];
        loadChannel();
        loadOrganizations();
        $scope.searchRule = function(selectedOrgId, channel, selectedStatus) {

            ruleManagement.header().viewRule({
                orgId: selectedOrgId,
                channel: channel,
                status: selectedStatus
            }, function(response) {
                $scope.data = response.response;
            }, function(err) {

            })
        }
console.log(RuleService.getPrevPath());
        if(RuleService.getPrevPath()=='rule'){
            $scope.selectedOrgId=RuleService.getSelectedOrgId();
            $scope.selectedChannel=RuleService.getSelectedChannel();
            $scope.selectedStatus=RuleService.getSelectedStatus();
            if($scope.selectedOrgId!=null && !angular.isUndefined($scope.selectedOrgId) &&
                $scope.selectedChannel!==null && !angular.isUndefined($scope.selectedChannel) &&
                $scope.selectedStatus!==null && !angular.isUndefined($scope.selectedStatus)){
                $scope.searchRule($scope.selectedOrgId, $scope.selectedChannel, $scope.selectedStatus);


            }

        }

        $scope.isSessionValid = function() {
            UserService.header({}).session({}, function(data) {}, function(err) {});
        }

        function loadOrganizations() {
            editPermission.header({
                token: localStorage.getItem("sessionToken")
            }).bankNamesOrgId({
                orgId: orgId
            }, function(data) {
                $scope.bankList = data.response;
            }, function(err) {
                $scope.bankList = [];
            });
        }

        function loadChannel() {
            casesManagement2.header(localStorage.getItem("sessionToken")).channel({},
                function(response) {
                    $scope.channel_code = response.response;
                },
                function(err) {

                });
        }

        $scope.createRuleByScript = function() {
            RuleService.setPrevPath('rule');
            RuleService.setSelectedChannel($scope.selectedChannel);
            RuleService.setSelectedOrgId($scope.selectedOrgId);
            RuleService.setSelectedStatus($scope.selectedStatus);
            $state.go('dashboard.createRule');
            RuleService.setEditFlag(null);
            RuleService.setCopyFlag(null);
        }

        $scope.createRuleByEditor = function() {
            RuleService.setPrevPath('rule');
            RuleService.setSelectedChannel($scope.selectedChannel);
            RuleService.setSelectedOrgId($scope.selectedOrgId);
            RuleService.setSelectedStatus($scope.selectedStatus);
            $state.go('dashboard.ruleByEditor');
            RuleService.setEditFlag(null);
            RuleService.setCopyFlag(null);
        }

        $scope.notGeneratedRules = function() {
            RuleService.setPrevPath('rule');
            RuleService.setSelectedChannel($scope.selectedChannel);
            RuleService.setSelectedOrgId($scope.selectedOrgId);
            RuleService.setSelectedStatus($scope.selectedStatus);
            $state.go('dashboard.notGeneratedRules');
            RuleService.setEditFlag(null);
            RuleService.setCopyFlag(null);
        }

        $scope.formated = function(data) {

            var finalJson;
            if (data != null || angular.isUndefined(data)) {
                //var newjson = JSON.parse(data);
                finalJson = JSON.stringify(data, undefined, 2);

            }
            return finalJson;
        }
        $scope.validateRuleFn = function(rule) {
            //console.log($scope.selectedStatus);
            $scope.rulemodel = null;
            $scope.simulateSuccess = false;
            $scope.msg = false;
            $scope.simulationData = null;
            if (rule.userInformationDTO.actionType == 'DEACTIVATED') {
                $scope.showDeactivate = false;
            } else {
                $scope.showDeactivate = true;
            }
            $ngConfirm({
                columnClass: 'col-md-6 col-md-offset-3',
                title: 'Validate Rule',
                theme: 'Material',
                icon: 'fa fa-check',
                content: '<span class="alert_text">Please Enter Validatation Data:</span>' +
                    '<div class="form-group"><textarea ng-change="msg = false" ng-model="rulemodel" class="form-control" placeholder="Enter Data"></textarea><div class="text-danger" ng-if="msg"><small>This is a required field</small></div></div></div>' +
                    '<div class="clearfix" ng-show="simulationData!=null"><div class="col-sm-12" id="stip"><strong>Transaction Data :</strong><textarea type="/pre" rows="20" cols="50"  class="form-control ruleTextarea">{{formated(simulationData)}}</textarea></div></div>',
                scope: $scope,
                buttons: {
                    Validate: {
                        text: 'Validate',
                        btnClass: 'btn-red',
                        action: function(
                            scope,
                            buttons) {
                            var self = this;
                            if ($scope.rulemodel == null) {
                                $scope.msg = true;
                                return false;

                            } else {
                                var json = ('{' + $scope.rulemodel + '}').replace(/\s\s+/g, '');
                                //console.log(json);
                                var config = {
                                    userInformationDTO: {
                                        "userId": userId,
                                        "orgId": orgId
                                    },
                                    channel: rule.channel,
                                    txnFields: JSON.parse(json),
                                    expr: rule.ruleExpr

                                };
                                //console.log(config);
                                ruleManagement.header(localStorage.getItem("sessionToken")).validateRule({
                                        channel: null,
                                        orgId: null
                                    }, config, function(data) {
                                        $scope.simulationData = data.response;
                                        //console.log($scope.simulationData);
                                        $scope.simulateSuccess = true;
                                        //toastr.success("Rule Simulated Successfully", Msg.hurrah);

                                        self.buttons.Validate.setDisabled(false);
                                        $scope.simulateSuccess = true;
                                        //console.log($scope.simulateSuccess+' '+rule.userInformationDTO.actionType);
                                        //changeButtonStatus();

                                        if ($scope.simulateSuccess && (rule.userInformationDTO.actionType == 'PENDING_REVIEW' || rule.userInformationDTO.actionType == 'DEACTIVATED')) {
                                            self.buttons.Activate.setDisabled(false);
                                            self.buttons.Reject.setDisabled(false);
                                        }
                                        if (($scope.simulateSuccess && rule.userInformationDTO.actionType == 'ACTIVE')) {
                                            self.buttons.Deactivate.setDisabled(false);
                                            self.buttons.Reject.setDisabled(false);
                                        }
                                    },
                                    function(err) {
                                        return false;
                                    });
                                /* $scope.simulationData={
                                     "errorCode": "00",
                                     "errorDesc": "Eval Result: true",
                                     "status": "SUCCESS",
                                     "data": "SUCCESS [ParseTime: 24 millis | CompileTime: 120 millis | ExecTime: 26 millis]",
                                     "httpStatus": 200
                                 }
                                 button.setDisabled(true);
                                 $scope.simulateSuccess=true;
                                 console.log($scope.simulateSuccess+' '+rule.userInformationDTO.actionType);
                                 if($scope.simulateSuccess && (rule.userInformationDTO.actionType =='PENDING_REVIEW' || rule.userInformationDTO.actionType =='DEACTIVATED')){
                                     this.buttons.Activate.setDisabled(false);
                                     this.buttons.Reject.setDisabled(false);
                                 }
                                 if(($scope.userInformationDTO.simulateSuccess && $scope.userInformationDTO.actionType =='ACTIVE')){
                                     this.buttons.Deactivate.setDisabled(false);
                                     this.buttons.Reject.setDisabled(false);
                                 }
                                 */

                                return false;
                            }


                        }
                    },
                    Activate: {
                        disabled: true,
                        text: 'Activate',
                        btnClass: 'btn-red',
                        action: function(
                            scope,
                            button) {
                            //console.log($scope.simulateSuccess);
                            $scope.changeRuleStatus(rule, 'ACTIVE');

                        }
                    },
                    Deactivate: {
                        show: $scope.showDeactivate,
                        disabled: true,
                        text: 'Deactivate',
                        btnClass: 'btn-red',
                        action: function(
                            scope,
                            button) {
                            //console.log($scope.simulateSuccess);
                            $scope.changeRuleStatus(rule, 'DEACTIVATED');

                        }
                    },
                    Reject: {
                        disabled: true,
                        text: 'Reject',
                        btnClass: 'btn-red',
                        action: function(
                            scope,
                            button) {
                            //console.log($scope.simulateSuccess);
                            $scope.changeRuleStatus(rule, 'REJECTED');

                        }
                    },
                    Cancel: {
                        text: 'Cancel',
                        action: function(
                            scope,
                            button) {
                            //this.buttons.Cancel.setDisabled(!$scope.simulateSuccess);
                            $scope.usermodel = null;
                        }
                    }
                }
            });
            $scope.searchRule($scope.selectedOrgId, $scope.selectedChannel, $scope.selectedStatus);

        }


        $scope.showSimulate = true;
        $scope.showSimulateStatus = false;
        $scope.showSimulateResult = false;

        $scope.simulateRule = function(startDate, endDate) {

            //$scope.count=count
            $scope.startDate = startDate
            $scope.endDate = endDate

            var config = {
                ruleId: $scope.simRuleID,
                userInformationDTO: {
                    "userId": $scope.simRuleDtl.userInformationDTO.userIdOrig,
                    "orgId": $scope.simRuleDtl.userInformationDTO.orgId,
                    "actionType": $scope.simRuleDtl.userInformationDTO.actionType,
                    "notes": $scope.simRuleDtl.userInformationDTO.notes
                },
                txnFields: {
                    "replacefields": "replacefields"
                },

                channel: $scope.simRuleDtl.channel,
                //   txnFields: JSON.parse(json),
                expr: $scope.simRuleExpr

            };
            ruleManagement.header(localStorage.getItem("sessionToken")).simulateRule({

                    startdate: $scope.startDate,
                    enddate: $scope.endDate,
                    channel: null,
                    orgId: null
                }, config, function(data) {
                    console.log('response - ', data);

                    $scope.simulateRuleId = data.message
                    $scope.simulateGetStatus()
                    $scope.count = "";
                },
                function(err) {
                    $scope.isSimulateSubmit = true
                    return false;
                });

        }
        
        
        function getLastSimulate(rule){
            ruleManagement.header(localStorage.getItem("sessionToken")).lastSimulate({
                ruleId: $scope.simRuleID
            }, function(data) {
                console.log('lastSimulate ', data)
                if (data.response != undefined) {

                    $scope.showSimulateResult = true;
                    $scope.executionStatus = data.response.executionStatus
                    $scope.simulateRuleId = data.response.executionId
                    $scope.lastUpdatedOn = data.response.lastUpdatedOn

                    $scope.simulatedCreatedOn = data.response.createdOn
                    //$scope.simulatedIdResult=[]

                    if ($scope.executionStatus !== 'Complited') {
                        $scope.showDate = true
                        $scope.showSimulateStatus = false
                    } else {
                        $scope.showSimulateStatus = true
                        //$scope.showDate=true
                    }
                    if ($scope.executionStatus === 'In-Progress') {
                        $scope.showDate = false
                        $scope.showSimulateStatus = true
                    }
                    $scope.simulatedIdResult = angular.fromJson(data.response.executionResult);
                    console.log($scope.simulatedIdResult)

                }else{
                	 $scope.showDate = true
                }

            },
            function(err) {
                console.log(err);
            });
        }
        
        $scope.simulateRuleFn = function(rule) {

            $scope.simRuleID = rule.ruleId;
            $scope.simRuleExpr = rule.ruleExpr;
            $scope.simRuleDtl = rule;
            $scope.showSimulate = true;
            $scope.showSimulateStatus = false;
            $scope.showSimulateResult = false;
            getLastSimulate($scope.simRuleID);

            ngDialog.open({
                template: 'templateSimulate',
                className: 'ngdialog-theme-default dialogwidth600',
                scope: $scope
            });
        }

        
        

        $scope.simulateGetStatus = function() {
            $scope.showSimulate = false;
            $scope.showSimulateStatus = true;
            $scope.showDate=false
            ruleManagement.header(localStorage.getItem("sessionToken")).simulateRuleGetStatus({
                    simRuleId: $scope.simulateRuleId
                }, function(data) {

                    $scope.simulatedIdStatus = data.message

                    if ($scope.simulatedIdStatus === 'Completed') {

                    	getLastSimulate($scope.simRuleID);
                    	
                        $scope.simulateGetResult()
                    }

                    if ($scope.simulatedIdStatus === 'In-Progress') {
                        $scope.showSimulateResult = false;
                    }
                  //  console.log($scope.simulatedIdStatus)
                },
                function(err) {
                    console.log(err);
                });


        }

        $scope.simulateGetResult = function() {
            $scope.showDate = true
            $scope.showSimulate = true;
            $scope.showSimulateStatus = false;
            $scope.showSimulateResult = true;
            // console.log('rule id for get result', $scope.simulateRuleId)
            ruleManagement.header(localStorage.getItem("sessionToken")).simulateRuleGetResult({
                    simRuleId: $scope.simulateRuleId
                }, function(data) {

                    //  $scope.silumatedResult = true;
                    $scope.simulatedIdResult = angular.fromJson(data.message);
                    // $scope.simulatedIdResult=angular.fromJson(data.message);
                  //  console.log('get result ', data.message)
                },
                function(err) {
                    console.log(err);
                });
        }


        /*        $scope.simulateStatusResult = function() {
                	
                	$scope.simulateGetStatus();
                	
                }*/

        $scope.compareRule = function(rule) {

            $scope.compareRuleId = rule.ruleId
            ruleEditorManagement.header({}).compareRule({
                ruleId: $scope.compareRuleId,
                orgId: orgId
            }, function(response) {
                if (response.response !== undefined) {
                    $scope.previousRule = response.response[1]
                    $scope.currentRule = response.response[0]
                 //   console.log($scope.previousRule)
                    ngDialog.open({
                        template: 'templateId',
                        className: 'ngdialog-theme-default dialogwidth600',
                        scope: $scope
                    });

                  //  console.log('Compare Rule ', response.response)

                }


            }, function(err) {
                //	ngModel.$setValidity('unique', true);
                /*  console.log(err)
                  toastr.error("Rule List Failed", Msg.oops);*/
            });

        };


        $scope.viewRuleDetail = function(rule) {
            $scope.data = [];
            RuleService.setRules(rule);
            RuleService.setPrevPath('rule');
            RuleService.setSelectedChannel($scope.selectedChannel);
            RuleService.setSelectedOrgId($scope.selectedOrgId);
            RuleService.setSelectedStatus($scope.selectedStatus);
            RuleService.setCreateFlag($location.url());
            RuleService.setCopyFlag('false');
            RuleService.setEditFlag(null);
            if (rule.composite == true) {
                $state.go('dashboard.createRule');
            } else {
                $state.go('dashboard.ruleByEditor');
            }

        }
        $scope.editRuleDetail = function(rule) {
            $scope.data = [];
            RuleService.setRules(rule);
            RuleService.setPrevPath('rule');
            RuleService.setSelectedChannel($scope.selectedChannel);
            RuleService.setSelectedOrgId($scope.selectedOrgId);
            RuleService.setSelectedStatus($scope.selectedStatus);
            RuleService.setCreateFlag($location.url());
            RuleService.setEditFlag('true');
            RuleService.setCopyFlag(null);
            if (rule.composite == true) {
                $state.go('dashboard.createRule');
            } else {
                $state.go('dashboard.ruleByEditor');
            }

        }
        $scope.copyRuleDetail = function(rule) {
            $scope.data = [];
            RuleService.setRules(rule);
            RuleService.setPrevPath('rule');
            RuleService.setSelectedChannel($scope.selectedChannel);
            RuleService.setSelectedOrgId($scope.selectedOrgId);
            RuleService.setSelectedStatus($scope.selectedStatus);
            RuleService.setCreateFlag($location.url());
            RuleService.setCopyFlag('true');
            RuleService.setEditFlag(null);
            if (rule.composite == true) {
                $state.go('dashboard.createRule');
            } else {
                $state.go('dashboard.ruleByEditor');
            }
        }

        $scope.changeRuleStatus = function(rule, status) {
            //console.log(rule.effectiveFromTs);
            //console.log(rule.effectiveToTs);

            var fromDateNew = ((rule.effectiveFromTs == null || angular.isUndefined(rule.effectiveFromTs)) ? null : rule.effectiveFromTs);

            var toDateNew = ((rule.effectiveToTs == null || angular.isUndefined(rule.effectiveToTs)) ? null : rule.effectiveToTs);

            //console.log(fromDateNew);
            //console.log(toDateNew);

            if (fromDateNew != null) {
                var date1 = new Date(fromDateNew);
                //console.log(date1);
                var datevalues1 = ('0' + date1.getDate()).slice(-2) + '-' + ('0' + (date1.getMonth() + 1)).slice(-2) + '-' + date1.getFullYear();
                var fromDate1 = datevalues1;
                var hours1 = date1.getHours();
                // Minutes part from the timestamp
                var minutes1 = "0" + date1.getMinutes();
                // Seconds part from the timestamp
                var seconds1 = "0" + date1.getSeconds();
                var formattedTime1 = hours1 + ':' + minutes1.substr(-2) + ':' + seconds1.substr(-2);
                var fromTime1 = formattedTime1;
            }
            if (toDateNew != null) {
                var date = new Date(toDateNew);
                //console.log(date);
                var datevalues = ('0' + date.getDate()).slice(-2) + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear();
                var hours = date.getHours();
                // Minutes part from the timestamp
                var minutes = "0" + date.getMinutes();
                // Seconds part from the timestamp
                var seconds = "0" + date.getSeconds();
                var toDate1 = datevalues;
                var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
                var toTime1 = formattedTime;
            }
            var overridingRules = (rule.overridingRules != null && rule.overridingRules != '' ? rule.overridingRules.split(",") : '');
            //console.log(fromDate1+''+fromTime1+'  '+toDate1+''+fromTime1);
            var config = {
                userInformationDTO: {
                    "userId": userId,
                    "orgId": orgId,
                    "actionType": status,
                    "notes": rule.userInformationDTO.notes
                },
                "composite": rule.composite,
                "id": rule.id,
                "ruleId": rule.ruleId,
                "channel": rule.channel,
                "ruleDesc": rule.ruleDesc,
                "ruleScore": rule.ruleScore,
                "ruleTextJson": rule.ruleExpr,
                "priority": rule.priority,
                "orgId": rule.orgId,
                "alertTypeCd": rule.alertTypeCd,
                "alertRequired": rule.alertRequired,
                "issuer": rule.issuer,
                "acquirer": rule.acquirer,
                "remitter": rule.remitter,
                "beneficiary": rule.beneficiary,
                "npci": rule.npci,
                "autoClosable": rule.autoClosable,
                "excludeCurrentTxn": rule.excludeCurrentTxn,
                "ruleType": rule.ruleType,
                "overridingRules": (overridingRules != null && overridingRules != '') ? overridingRules.join() : '',
                "online": rule.online,
                "aml": rule.aml,
                "declineFlag": rule.declineFlag,
                "effectiveFromTs": fromDate1 + ' ' + fromTime1,
                "effectiveToTs": toDate1 + ' ' + toTime1
            };
            updateRule(config);
        }

        function updateRule(config) {
            ruleManagement.header({}).updateRule({
                channel: null,
                orgId: null
            }, config, function(data) {
                toastr.success("Rule Successfully Updated", Msg.hurrah);
                $scope.searchRule($scope.selectedOrgId, $scope.selectedChannel, $scope.selectedStatus);
            }, function(err) {
                toastr.error("Rule Creation Failed", Msg.oops);
            });
        }


    }])