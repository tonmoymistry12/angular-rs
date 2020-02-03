'use strict';

angular.module('efrm.dashboard')
    .controller('viewRuleController', ['$scope', '$filter','$state', 'MyCases', 'statusService', 'UserService', '$location', 'SearchCaseService', 'casesManagement2', 'RolePermissionMatrix', '$ngConfirm', 'casesManagement', 'toastr', 'Msg', 'Session', 'alertService', 'editPermission', 'ruleManagement', 'RuleService', 'ngDialog', 'ruleEditorManagement','commonDataService', function($scope, $filter, $state, MyCases, statusService, UserService, $location, SearchCaseService, casesManagement2, RolePermissionMatrix, $ngConfirm, casesManagement, toastr, Msg, Session, alertService, editPermission, ruleManagement, RuleService, ngDialog, ruleEditorManagement,commonDataService) {
    	
        var orgId = commonDataService.getLocalStorage().orgId;
        var userId =  commonDataService.getSessionStorage().userId;
        $scope.loggedInUser = userId;
        $scope.loggedInOrgId = orgId
        //console.log('$scope.loggedInUser - ',$scope.loggedInUser)
        $scope.currentDate = new Date();
        $scope.data = [];
        
        $scope.selectedStatus={
            value:''
        }

        $scope.pageSize="50";
        //$scope.status = ['PENDING_REVIEW', 'PENDING_REACTIVATION','ACTIVE', 'DEACTIVATED','PENDING_DEACTIVATION', 'REJECTED'];
        $scope.status = ['PENDING_REVIEW', 'ACTIVE', 'DEACTIVATED', 'REJECTED'];
        $scope.bankList = [];
        
        loadChannel();
        loadOrganizations();
        $scope.showRuleData=true;
        $scope.forSimulate=false;
        $scope.searchRule = function(selectedOrgId, channel, selectedStatus) {
        	//$scope.data='';
        	if(selectedStatus==='PENDING_REVIEW'){
        		$scope.getActiveRulesForSimulate(selectedOrgId, channel)
        		$scope.forSimulate=true;
        	}else{
        		$scope.forSimulate=false;
        	}
        	
        	$scope.showRuleData=false;
            ruleManagement.header().viewRule({
                orgId: selectedOrgId,
                channel: channel.replace(',','_'),
                status: selectedStatus
                
            }, function(response) {
            	$scope.showRuleData=true;
                $scope.data = response.response;
                $scope.selectedStatuss=selectedStatus
            }, function(err) {

            })
        }
        
        $scope.getActiveRulesForSimulate = function(selectedOrgId, channel) {
        	$scope.showRuleData=false;
            ruleManagement.header().viewRule({
                orgId: selectedOrgId,
                channel: channel.replace(',','_'),
                status: 'ACTIVE'
            }, function(response) {
            	//$scope.showRuleData=true;
                $scope.simRuleData = response.response;
            }, function(err) {

            })
        }
        
        
        $scope.refreshGrid = function(selectedOrgId, channel, selectedStatus){
        	$scope.searchRule(selectedOrgId, channel, selectedStatus)
        //	$scope.showRuleData=true;
        }
        
        if(RuleService.getPrevPath()=='rule'){
            $scope.selectedOrgId=RuleService.getSelectedOrgId();
            $scope.selectedChannel=RuleService.getSelectedChannel();
            $scope.selectedStatus.value=RuleService.getSelectedStatus();
            if($scope.selectedOrgId!=null && !angular.isUndefined($scope.selectedOrgId) &&
                $scope.selectedChannel!==null && !angular.isUndefined($scope.selectedChannel) &&
                $scope.selectedStatus.value!==null && !angular.isUndefined($scope.selectedStatus.value)){
                $scope.searchRule($scope.selectedOrgId, $scope.selectedChannel, $scope.selectedStatus.value);


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
                    var channelComb=[{channelCode: "RuPayAtm_RuPayPos", channelDesc: "ATM, POS and ECOM"} ]
                    $scope.channel_code.push(...channelComb);
                },
                function(err) {

                });
        }
        $scope.onlyActive=false;
        $scope.changOrganization=function(selectedOrgId){
            $scope.selectedOrgId=selectedOrgId
            if($scope.selectedOrgId==='NPCI' && $scope.bankList.length===1){
                $scope.onlyActive=true;
                $scope.selectedStatus.value='ACTIVE';
            }else{
                $scope.onlyActive=false;
                $scope.selectedStatus.value='';
            }
        }
        /*$scope.changeSelectedStatus=function(selectedStatus){
            $scope.selectedStatus=selectedStatus;
        }*/
        $scope.createRuleByScript = function() {
            RuleService.setPrevPath('rule');
            RuleService.setSelectedChannel($scope.selectedChannel);
            RuleService.setSelectedOrgId($scope.selectedOrgId);
            RuleService.setSelectedStatus($scope.selectedStatus.value);
            $state.go('dashboard.createRule');
            RuleService.setEditFlag(null);
            RuleService.setCopyFlag(null);
        }

        $scope.createRuleByEditor = function() {
            RuleService.setPrevPath('rule');
            RuleService.setSelectedChannel($scope.selectedChannel);
            RuleService.setSelectedOrgId($scope.selectedOrgId);
            RuleService.setSelectedStatus($scope.selectedStatus.value);
            $state.go('dashboard.ruleByEditor');
            RuleService.setEditFlag(null);
            RuleService.setCopyFlag(null);
        }

        $scope.notGeneratedRules = function() {
            RuleService.setPrevPath('rule');
            RuleService.setSelectedChannel($scope.selectedChannel);
            RuleService.setSelectedOrgId($scope.selectedOrgId);
            RuleService.setSelectedStatus($scope.selectedStatus.value);
            $state.go('dashboard.notGeneratedRules');
            RuleService.setEditFlag(null);
            RuleService.setCopyFlag(null);
        }
        
        $scope.mySimulatedRules = function() {
            RuleService.setPrevPath('rule');
            RuleService.setSelectedChannel($scope.selectedChannel);
            RuleService.setSelectedOrgId($scope.selectedOrgId);
            RuleService.setSelectedStatus($scope.selectedStatus.value);
            $state.go('dashboard.simulateRules');
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
        //	alert(rule.ruleId)
        	ruleEditorManagement.header({}).getValidateData({
                ruleId: rule.ruleId
            }, function(data) {
            	
            	
            	$scope.rulemodel = data.response.data;
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
                        '<div class="form-group"><textarea ng-change="msg = false" ng-model="rulemodel" class="form-control" placeholder="Enter Data" style="height:100px;"></textarea><div class="text-danger" ng-if="msg"><small>This is a required field</small></div></div></div>' +
                        '<div class="clearfix" ng-show="simulationData!=null"><div class="col-sm-12" id="stip"><strong>Transaction Data :</strong><textarea type="/pre" rows="20" cols="50"  class="form-control" style="height:100px;">{{formated(simulationData)}}</textarea></div></div>',
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
                                   // var json = ('{' + $scope.rulemodel + '}').replace(/\s\s+/g, '');
                                    var json =$scope.rulemodel;
                                    var config = {
                                        userInformationDTO: {
                                            "userId": userId,
                                            "orgId": orgId
                                        },
                                        channel: rule.channel,
                                        txnFields: JSON.parse(json),
                                        expr: rule.ruleExpr

                                    };
                                    ruleManagement.header(localStorage.getItem("sessionToken")).validateRule({
                                            channel: null,
                                            orgId: null
                                        }, config, function(data) {
                                            $scope.simulationData = data.response;
                                            $scope.simulateSuccess = true;
                                            //toastr.success("Rule Simulated Successfully", Msg.hurrah);

                                            self.buttons.Validate.setDisabled(false);
                                            $scope.simulateSuccess = true;
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
                $scope.searchRule($scope.selectedOrgId, $scope.selectedChannel, $scope.selectedStatus.value);
            	
            }, function(err) {
                //  console.log(err)
                toastr.error(err, Msg.oops);
            });
        	
        	
            /*$scope.rulemodel = null;
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
                                var config = {
                                    userInformationDTO: {
                                        "userId": userId,
                                        "orgId": orgId
                                    },
                                    channel: rule.channel,
                                    txnFields: JSON.parse(json),
                                    expr: rule.ruleExpr

                                };
                                ruleManagement.header(localStorage.getItem("sessionToken")).validateRule({
                                        channel: null,
                                        orgId: null
                                    }, config, function(data) {
                                        $scope.simulationData = data.response;
                                        $scope.simulateSuccess = true;
                                        //toastr.success("Rule Simulated Successfully", Msg.hurrah);

                                        self.buttons.Validate.setDisabled(false);
                                        $scope.simulateSuccess = true;
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
                                 $scope.simulationData={
                                     "errorCode": "00",
                                     "errorDesc": "Eval Result: true",
                                     "status": "SUCCESS",
                                     "data": "SUCCESS [ParseTime: 24 millis | CompileTime: 120 millis | ExecTime: 26 millis]",
                                     "httpStatus": 200
                                 }
                                 button.setDisabled(true);
                                 $scope.simulateSuccess=true;
                                 if($scope.simulateSuccess && (rule.userInformationDTO.actionType =='PENDING_REVIEW' || rule.userInformationDTO.actionType =='DEACTIVATED')){
                                     this.buttons.Activate.setDisabled(false);
                                     this.buttons.Reject.setDisabled(false);
                                 }
                                 if(($scope.userInformationDTO.simulateSuccess && $scope.userInformationDTO.actionType =='ACTIVE')){
                                     this.buttons.Deactivate.setDisabled(false);
                                     this.buttons.Reject.setDisabled(false);
                                 }
                                 

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
            $scope.searchRule($scope.selectedOrgId, $scope.selectedChannel, $scope.selectedStatus.value);*/

        }


        $scope.showSimulate = true;
        $scope.showSimulateStatus = false;
        $scope.showSimulateResult = false;
        
        $scope.getCompareExpr=function(rulName){
        	var ruleC = rulName||null
        	if(ruleC!=null){
        		$scope.comExpr = $filter('filter')($scope.simRuleData.data, {ruleId: rulName})[0].ruleExpr;
        		$scope.ruleIdCompare=$filter('filter')($scope.simRuleData.data, {ruleId: rulName})[0].ruleId
                $scope.exprCompare=$scope.comExpr
        	}else{
        		delete $scope.comExpr
        		delete $scope.ruleIdCompare
        		delete $scope.exprCompare
        	}
        }
        
        function dateFormat(d){
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
       
        $scope.stTxnDate=$filter('date')($scope.currentDate, "dd-MM-yyyy HH:mm")

        $scope.timevalid=function(data){
        	
        	var toDt = new Date(dateFormat(data))
        	var fmDt= new Date(dateFormat($filter('date')($scope.currentDate, "dd-MM-yyyy HH:mm")))
        	//console.log(fmDt.getTime())
        	var diff = (toDt.getTime() - fmDt.getTime()) / 1000;
			diff /= 60;
			//console.log('diff',Math.round(diff * 60))
					//if (Math.round(diff * 60) < 21600) { //21600(6x60x60) mean 6 hrs
			//console.log('DURATION - ',commonDataService.getDurationInfoForSimulation().duration)
			$scope.simulationDuration = commonDataService.getDurationInfoForSimulation().duration;
			$scope.simulationDurationMsg = commonDataService.getDurationInfoForSimulation().message;
						if (Math.round(diff * 60) < parseInt($scope.simulationDuration)) { //10mins
                					//console.log('N OK')
                				$scope.timeValidAlert=true;
                				} else {
                					//console.log('OK')
                					$scope.timeValidAlert=false;
                				}
        }
        
        $scope.ruleCompareChange=function(ruleCompare){
        	$scope.ruleForCompare = $filter('filter')($scope.data.data, {ruleName:ruleCompare});
        	console.log('$scope.ruleForCompare', $scope.ruleForCompare)
        }
        
        $scope.simulateRule = function(startDate, duration) {

        	
        	$scope.showSimulateStatus=false

            
            $scope.startDate = startDate
            $scope.duration = duration
          
          /*  ruleName:rule.ruleName,
			orgId:$scope.simRuleOrgId,
			scheduledByUserId:rule.userInformationDTO.userId,
			scheduledByOrgId:rule.userInformationDTO.orgId*/
            	
            var config = {
                ruleId: $scope.simRuleDtl.ruleName+"_SIMULATED_"+$scope.simRuleDtl.orgId,
                ruleOrgId: $scope.simRuleDtl.orgId,
         
    			simulateRuleBase:{
    					id: $scope.simRuleDtl.id,
    				 	ruleName: $scope.simRuleDtl.ruleName,
    	                orgId: $scope.simRuleDtl.orgId,
    	               // scheduledByUserId:$scope.simRuleDtl.userInformationDTO.userId,
    	                scheduledByUserId:userId,
    	    			scheduledByOrgId:orgId,
    			},
                userInformationDTO: {
                    
                	"userId": userId,
                	"orgId": orgId,
                    "actionType": $scope.simRuleDtl.userInformationDTO.actionType,
                    "notes": $scope.simRuleDtl.userInformationDTO.notes
                },
                txnFields: {
                    "replacefields": "replacefields"
                },

                channel: $scope.simRuleDtl.channel,
                //   txnFields: JSON.parse(json),
                expr: $scope.simRuleExpr,
                ruleIdCompare: $scope.ruleIdCompare,
                exprCompare: $scope.exprCompare,
                startDate:$scope.startDate.trim()+":00",
                duration:$scope.duration,

            };
        	//console.log(config)
        	$scope.showErrMsg=false
            ruleManagement.header({}).simulateRule({

                    channel: null,
                    orgId: null
                }, config, function(data) {

                	$scope.searchRule($scope.selectedOrgId,$scope.selectedChannel,$scope.selectedStatus.value)
                    if(data.response.errorCode==='99'){
                    	$scope.showErrMsg=true
                    	$scope.qErrMsg=data.response.errorDesc
                    	
                    	
                    }else{
                    	$scope.showErrMsg=false
                    	
                    //	getLastSimulate($scope.simRuleID)
                    	ngDialog.close()
                    }
                    
                   
                    
                  //  $scope.simulateGetStatus()
                  //  $scope.count = "";
                  //   alert()
                    /*$scope.count=""
                    $scope.stTxnDate = ""
                    $scope.enTxnDate = ""*/
                    
                },
                function(err) {
                    $scope.isSimulateSubmit = true
                    return false;
                });

        }
        
        
        function getLastSimulate(rule){
        	$scope.showSimulateStatus = false
        	 $scope.comExpr="";
        	 $scope.ruleCompare="";
        	$scope.count="";
        	$scope.showDate = true
       	    $scope.showSimulateStatus = false
            ruleManagement.header(localStorage.getItem("sessionToken")).lastSimulate({
                ruleId: $scope.simRuleID,
                orgId: $scope.simRuleOrgId
            }, function(data) {
            	
            //	console.log('Last Simulate', data)
            	
                if (data.response != undefined) {
                	$scope.showSimulateStatus = true
                	$scope.simulatedIdResult=data.response
                	if(data.response.ruleIdCompare){
                		$scope.ruleCompare=data.response.ruleIdCompare
                    	$scope.comExpr=data.response.exprCompare
                	}else{
                		delete $scope.ruleCompare
                		delete $scope.comExpr
                	}
                	
                }else{
                	
                	 $scope.showSimulateStatus = false
                }

            },
            function(err) {
            });
        }
        
        
        
        $scope.simulateRuleFn = function(rule) {
        	
        	$scope.ruleCompare='';
        	$scope.simRuleExpr='';
        	$scope.duration='';
        	
        	$scope.simRuleID = rule.ruleName;
        	$scope.simRuleOrgId=rule.orgId;
        	$scope.simRuleName = rule.ruleName;
            $scope.simRuleExpr = rule.ruleExpr;
            $scope.simRuleDtl = rule;
              
        	 ruleManagement.header({}).simulateRuleGetStatus({
                 simRuleId: $scope.simRuleID,
                 simRuleOrgId: $scope.simRuleOrgId,
             }, function(data) {
            	 
            	 
            	 $scope.simulationTrackStatus=data.response	
            	 
            	 
            	// $scope.showDate=data.response
            	 if($scope.simulationTrackStatus){
            	//	 $scope.showDate = false
            		 $scope.simulationTrackMsg=data.message
            		getLastSimulate($scope.simRuleID)
            	 }
            	 
            	 
            	 ngDialog.open({
                     template: 'templateSimulate',
                     className: 'ngdialog-theme-default dialogwidth600',
                     scope: $scope
                 });
            	 
             },function(err) {
            	 
             });
        	
  
        }

        
  

/*        $scope.simulateGetStatus = function() {
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
                },
                function(err) {
                });


        }*/

/*        $scope.simulateGetResult = function() {
            $scope.showDate = true
            $scope.showSimulate = true;
            $scope.showSimulateStatus = false;
            $scope.showSimulateResult = true;
            ruleManagement.header(localStorage.getItem("sessionToken")).simulateRuleGetResult({
                    simRuleId: $scope.simulateRuleId
                }, function(data) {

                    //  $scope.silumatedResult = true;
                    $scope.simulatedIdResult = angular.fromJson(data.message);
                    // $scope.simulatedIdResult=angular.fromJson(data.message);
                },
                function(err) {
                });
        }*/


        /*        $scope.simulateStatusResult = function() {
                	
                	$scope.simulateGetStatus();
                	
                }*/

        $scope.compareRule = function(rule) {

            $scope.compareRuleId = rule.ruleId
            ruleEditorManagement.header({}).compareRule({
                ruleId: $scope.compareRuleId,
                orgId: rule.orgId
            }, function(response) {
                if (response.response !== undefined) {
                    $scope.previousRule = response.response[1]
                    $scope.currentRule = response.response[0]
                    ngDialog.open({
                        template: 'templateId',
                        className: 'ngdialog-theme-default dialogwidth600',
                        scope: $scope
                    });


                }


            }, function(err) {
                //	ngModel.$setValidity('unique', true);
                /* 
                  toastr.error("Rule List Failed", Msg.oops);*/
            });

        };

        $scope.refreshRules = function() {

        	
        	 ngDialog.open({
                 template: 'templateRefresh',
                 className: 'ngdialog-theme-default dialogwidth400',
                 scope: $scope,
              //   closeByDocument:false,
              //   closeByEscape:false,
               //  showClose:false
             });
        	 
        };
        $scope.refreshFN=function(refreshOrg,refreshChannel){
        	//alert(refreshOrg+"===="+$scope.refreshChannel)
        	var config ={
        		orgId:refreshOrg,
        		channel:refreshChannel
        	}
        	ruleEditorManagement.header({}).refreshRules({
                channel: null,
                orgId: null
            }, config, function(data) {
            	if(data.response.errorCode==='00'){
            		toastr.success(data.response.data, Msg.hurrah);
            	}else{
            		toastr.error(data.response.data, Msg.hurrah);
            	}
            	
            	ngDialog.closeAll()
            }, function(err) {
            	
                toastr.error(data.response.data, Msg.oops);
            });
        }
        
        $scope.viewRuleDetail = function(rule) {
        	RuleService.setViewRuleComeFrom('NotDraft')
            $scope.data = [];
            RuleService.setRules(rule);
            RuleService.setPrevPath('rule');
            RuleService.setSelectedChannel($scope.selectedChannel);
            RuleService.setSelectedOrgId($scope.selectedOrgId);
            RuleService.setSelectedStatus($scope.selectedStatus.value);
            RuleService.setCreateFlag($location.url());
            RuleService.setCopyFlag('false');
            RuleService.setEditFlag(null);
            if (rule.composite == true) {
                $state.go('dashboard.ruleByScript');
            } else {
                $state.go('dashboard.ruleByEditor');
               // $state.go('dashboard.ruleDetail');
            }
        }
        
        $scope.editRuleDetail = function(rule) {
        	RuleService.setViewRuleComeFrom('NotDraft')
            $scope.data = [];
            RuleService.setRules(rule);
            RuleService.setPrevPath('rule');
            RuleService.setSelectedChannel($scope.selectedChannel);
            RuleService.setSelectedOrgId($scope.selectedOrgId);
            RuleService.setSelectedStatus($scope.selectedStatus.value);
            RuleService.setCreateFlag($location.url());
            RuleService.setEditFlag('true');
          //  console.log('list page get edit flag ',RuleService.getEditFlag())
            RuleService.setCopyFlag(null);
            if (rule.composite == true) {
              //  $state.go('dashboard.createRule');
                $state.go('dashboard.ruleByScript');
            } else {
                $state.go('dashboard.ruleByEditor');
              //  $state.go('dashboard.ruleByEditor');
            }

        }
        
        $scope.copyRuleDetail = function(rule) {
            $scope.data = [];
            RuleService.setRules(rule);
            RuleService.setPrevPath('rule');
            RuleService.setSelectedChannel($scope.selectedChannel);
            RuleService.setSelectedOrgId($scope.selectedOrgId);
            RuleService.setSelectedStatus($scope.selectedStatus.value);
            RuleService.setCreateFlag($location.url());
            RuleService.setCopyFlag('true');
           // console.log('list page get copy flag ',RuleService.getCopyFlag())
            RuleService.setEditFlag(null);
            if (rule.composite == true) {
             //   $state.go('dashboard.createRule');
                $state.go('dashboard.ruleByScript');
            } else {
             //   $state.go('dashboard.ruleByEditor');
                $state.go('dashboard.ruleByEditor');
            }
        }

        $scope.callActivate=function(rule,status){
            $scope.ruleIdList=[];
            ruleManagement.header(localStorage.getItem("sessionToken")).rulePriority({
                    orgId: $scope.selectedOrgId,
                    currentRulePriority:rule.priority,
                    channel:$scope.selectedChannel
                }, function(data) {
                    //console.log(data.response.data);
                    $scope.ruleIdList=data.response.data;
                    if($scope.ruleIdList.length!=0){
                        $ngConfirm({
                            title: 'Priority of the following rules will be impacted due to activation!',
                            theme: 'Material',
                            boxWidth: '500px',
                            useBootstrap: false,
                            /* icon: 'fa fa-warning',*/
                            content:
                               /* '<div class="form-group rolePriorityBox"> <ul><li ng-repeat="i in ruleIdList">{{i.ruleId}}</li></ul></div>',*/
                                '<div style="height:200px; overflow-y:scroll;"><table class="table table-strip"><tr><th>Rule Name</th><th>Priority</th></tr><tr ng-repeat="i in ruleIdList"><td>{{i.ruleId}}</td><td>{{i.priority}}</td></tr></table></div>',
                            scope: $scope,
                            buttons: {
                                Yes: {
                                    text: 'Okay',
                                    btnClass: 'btn-red',
                                    action: function (scope, button) {
                                        $scope.ruleIdList=[];
                                        $scope.changeRuleStatus(rule,status)
                                    }
                                },
                                Cancel: {
                                    text: 'Cancel',
                                    action: function (scope, button) {
                                        $scope.ruleIdList=[];

                                    }

                                }
                            },
                        });
                    }else{
                        $ngConfirm({
                            title: 'There is no rule to be impacted! Are you sure to activate the rule?',
                            theme: 'Material',
                            content: '<div class="form-group"></div>',
                           scope: $scope,
                            buttons: {
                                Yes: {
                                    text: 'Okay',
                                    btnClass: 'btn-red',
                                    action: function (scope, button) {
                                        $scope.ruleIdList=[];
                                        $scope.changeRuleStatus(rule,status)
                                    }
                                },
                                Cancel: {
                                    text: 'Cancel',
                                    action: function (scope, button) {
                                        $scope.ruleIdList=[];

                                    }

                                }
                            },
                        });
                    }


                },
                function(err) {
                });
        }

        $scope.callDeactivate=function(rule,status){
            $ngConfirm({
                title: 'Are you sure to deactivate the rule?',
                theme: 'Material',
                content: '<div class="form-group"></div>',
                scope: $scope,
                buttons: {
                    Yes: {
                        text: 'Confirm',
                        btnClass: 'btn-red',
                        action: function (scope, button) {
                            $scope.changeRuleStatus(rule,status)
                        }
                    },
                    Cancel: {
                        text: 'Cancel',
                        action: function (scope, button) {

                        }

                    }
                },
            });
        }

        $scope.callReject=function(rule,status){
            $ngConfirm({
                title: 'Are you sure to reject the rule?',
                theme: 'Material',
                content: '<div class="form-group"></div>',
                scope: $scope,
                buttons: {
                    Yes: {
                        text: 'Confirm',
                        btnClass: 'btn-red',
                        action: function (scope, button) {
                            $scope.changeRuleStatus(rule,status)
                        }
                    },
                    Cancel: {
                        text: 'Cancel',
                        action: function (scope, button) {

                        }

                    }
                },
            });
        }

        $scope.changeRuleStatus = function(rule, status) {
            
            var fromDateNew = ((rule.effectiveFromTs == null || angular.isUndefined(rule.effectiveFromTs)) ? null : rule.effectiveFromTs);

            var toDateNew = ((rule.effectiveToTs == null || angular.isUndefined(rule.effectiveToTs)) ? null : rule.effectiveToTs);

            

            if (fromDateNew != null) {
                var date1 = new Date(fromDateNew);
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
            var config = {
                userInformationDTO: {
                    "userId": userId,
                    "orgId": orgId,
                    "actionType": status,
                    "notes": rule.userInformationDTO.notes
                },
                "composite": rule.composite,
                "id": rule.id,
                "ruleName":rule.ruleName,
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
                $scope.searchRule($scope.selectedOrgId, $scope.selectedChannel, $scope.selectedStatus.value);
            }, function(err) {
                toastr.error("Rule Creation Failed", Msg.oops);
            });
        }
        
        
        
        $scope.ruleTitle = function(rule){
        	/*if(rule.orgId==='NPCI' && rule.userInformationDTO.orgId==='NPCI'){
        		return 'Global'
        	}else if(rule.orgId!='NPCI' && rule.userInformationDTO.orgId==='NPCI'){
        		return 'Default'
        	}else if(rule.userInformationDTO.orgId===rule.orgId && rule.userInformationDTO.orgId!='NPCI'){
        		return 'Custom'
        	}*/
        	var Effective_org_id
    		
    		if(rule.userInformationDTO.updatedByOrgId== null){
    			Effective_org_id=rule.userInformationDTO.orgId
    		}else{
    			Effective_org_id=rule.userInformationDTO.updatedByOrgId
    		}
        	if(rule.orgId==='NPCI'){
        		return 'Global'
        	}else if(Effective_org_id==='NPCI'){
        		return 'Default'
        	}else{
        		return 'Custom'
        	}
        }
        
        
        
        
/*        $scope.rulsAccessFn = function(rule){
        	
            var globalRule = (rule.orgId==='NPCI' && rule.userInformationDTO.orgId==='NPCI')?true:false
            var defaultRule = (rule.orgId!='NPCI' && rule.userInformationDTO.orgId==='NPCI')?true:false
            var customRule = (rule.userInformationDTO.orgId===rule.orgId && rule.userInformationDTO.orgId!='NPCI')?true:false
            		
            var globalRule = rule.orgId==='NPCI'? true:false
            		
    		var Effective_org_id
    		
    		if(rule.userInformationDTO.updatedByOrgId== null){
    			Effective_org_id=rule.userInformationDTO.orgId
    		}else{
    			Effective_org_id=rule.userInformationDTO.updatedByOrgId
    		}
           
          //  var Effective_org_id  = rule.userInformationDTO.updatedByOrgId== null ? rule.userInformationDTO.orgId: rule.userInformationDTO.updatedByOrgId
            var defaultRule=(Effective_org_id==='NPCI')?true:false
            var customRule=(Effective_org_id!='NPCI')?true:false
            
            if((defaultRule || globalRule) && orgId=="NPCI"){
                   return true
            } else if((customRule || defaultRule) && (orgId==rule.orgId || orgId=='NPCI')){
                   return true
            }else{
                   return false
            }
      }*/

	    $scope.rulsAccessFn = function(rule){
	    	
	    	if(orgId=='NPCI'){
	    		return true
	    	}
	    	
	    	return rule.orgId != 'NPCI' 
	    	
	    }
  
      $scope.ruleAccessFnForADR = function(rule){
    	  
    	  if(rule.userInformationDTO.updatedByUserId===null || rule.userInformationDTO.updatedByUserId===undefined){
    		  if(rule.userInformationDTO.userIdOrig!=$scope.loggedInUser){
                  return true
    		  }else{
    			  return false 
    		  }
    	  }else{
    		  if(rule.userInformationDTO.updatedByUserIdOrig!=$scope.loggedInUser){
              		return true
              }else{
                    return false
              }
    	  }

      }

      
      $scope.viewSimulationDetail = function(rule){
 		 
      	//	 console.log('****',rule)
      		 $scope.ruleInfo = rule
      		 $scope.hasChampion = rule.chamapion!=null?true:false;
      		 var dataSource = [{
      			    state: "Alert Count",
      			    Champion: $scope.hasChampion?rule.chamapion.alertCount:'',
      			    Challenger:rule.challenger.alertCount
      			}, {
      			    state: "Average Time",
      			    Champion: $scope.hasChampion?rule.chamapion.avgExecTime:'',
      			    Challenger:rule.challenger.avgExecTime
      			},{
      			    state: "Max. Time",
      			    Champion: $scope.hasChampion?rule.chamapion.maxExecTime:'',
      			    Challenger:rule.challenger.maxExecTime
      			}];
      		 
  	    		 ngDialog.open({
  	                 template: 'templateSimulateRslt',
  	                 className: 'ngdialog-theme-default dialogwidth600',
  	                 scope: $scope
  	             });
  	    		 
  	        	 $scope.chartOptions = {
  	     		        palette: "soft",
  	     		        dataSource: dataSource,
  	     		        commonSeriesSettings: {
  	     		            ignoreEmptyPoints: false,
  	     		            argumentField: "state",
  	     		            type: "bar"
  	     		        },
  	     		        series: [
  	     		            { valueField: "Challenger", name: rule.challenger.ruleName },
  	     		            { valueField: "Champion", name: $scope.hasChampion?rule.chamapion.ruleName:'' }
  	     		        ],
  	     		        legend: {
  	     		            verticalAlignment: "bottom",
  	     		            horizontalAlignment: "center"
  	     		        },
  	     		        "export": {
  	     		            enabled: false
  	     		        },
  	     		        title: "Simulation Report"
  	     		    };
      		 
      	 }
      
        
    }])