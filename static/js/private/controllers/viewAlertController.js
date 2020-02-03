'use strict';

angular.module('efrm.dashboard')
    .controller('viewAlertController',  [
        '$scope',
        '$state',
        'UserService',
        'AlertDataService',
        'statusService',
        'RolePermissionMatrix',
        '$location',
        'toastr',
        'Msg',
        'Session',
        'alertService',
        'MyAlerts',
        'MyCases',
        'casesManagement',
        'casesManagement2',
        '$ngConfirm',
        '$compile',
        'commonDataService',
        function($scope,
                 $state,
                 UserService,
                 AlertDataService,
                 statusService,
                 RolePermissionMatrix,
                 $location,
                 toastr,
                 Msg,
                 Session,
                 alertService,
                 MyAlerts,
                 MyCases,
                 casesManagement,
                 casesManagement2,
                 $ngConfirm,
                 $compile,
                 commonDataService
        ) {
            $scope.orgidcheck = commonDataService.getLocalStorage().orgId;
            $scope.showBoxOne = false;
            $scope.rolePermission = RolePermissionMatrix;
            $scope.prev_url = localStorage.getItem("prev_path");
            $scope.loggdUserid = commonDataService.getSessionStorage().userId;
            $scope.alertNotes='';
            $scope.hideAction = true;
            $scope.showAml = false;
            $scope.txnActionDisabled=false;
            $scope.closeAlertDisable=false;
            $scope.response = statusService.getResponseMessage();
            var myprvPath = localStorage.getItem("prev_path");
            $scope.channel_code = [];
            $scope.jsonDataforalert=[];
            $scope.perspective=commonDataService.getLocalStorage().perspective;
            $scope.newDataList = [];
            $scope.data = AlertDataService.getAlertDataDetails();
            if($scope.data.alert.assignedTo == null){
                $scope.hideAction = false;
            }else{
                if($scope.loggdUserid == $scope.data.alert.assignedTo){
                    $scope.hideAction = false;
                }else{
                    $scope.hideAction = true;
                }
            }
            casesManagement2.header($scope.response.token).channel( {},
                    function(response) {
                        $scope.channel_code = response.response;
                       
                    },
                    function(err) {
                    });
            
            var clearTable = function () {
                var checkTable = $( "#example-table" ).hasClass( "tabulator" )
                if (checkTable)
                {
                    $("#example-table").tabulator("destroy");
                }
            }

            //alert new changes for tag AML/Fraud
            if($scope.data!=null){
            	
                var fraudAmlArray=[];
                $scope.storeallData=[]
                $scope.alertActionType = $scope.data.alert.userInformationDTO.actionType;
                $scope.newJsonData = JSON.parse($scope.data.caseTransactionDetail.txnjson);
                $scope.newDataList.push($scope.data.caseTransactionDetail);
                $scope.jsonDataforalert.push($scope.newJsonData);
                
                $scope.offline = false;

                var object={}
                object=Object.entries($scope.newDataList).forEach(([key,value])=>{
                    object[key]=value;
                })

                for (var i = 0; i < $scope.newDataList.length; i++) {
                    fraudAmlArray.push({
                        caseTypeDesc: $scope.newDataList[i].caseTypeDesc,
                        caseTypeCode: $scope.newDataList[i].caseTypeCode,
                        amlTypeDesc: $scope.newDataList[i].amlTypeDesc,
                        tagType:$scope.newDataList[i].tagType,
                        cardNumber1:$scope.newDataList[i].cardNumber1,
                    });
                }
                $scope.storeallData.push($scope.newJsonData);
                // $scope.newJsonData1 =[];
                //var objs = $scope.storeallData.map(JSON.parse);
                var combined = [];
                $scope.storeallData.forEach((itm, i) => {
                    combined.push(Object.assign({}, itm, fraudAmlArray[i]))
                });
                $scope.jsonDataforalert = combined;

                //ends here
            }


            if($scope.data.alert.userInformationDTO.actionType == 'MANUAL_CLOSE' || $scope.data.alert.userInformationDTO.actionType == 'AUTO_EXPIRED'){
                $scope.closeAlertDisable=true;
            }
            checkStatus();



           /* $scope.formated = function(data)
            {

                var finalJson;
                if(data != undefined)
                {
                    var newjson = JSON.parse(data);
                    finalJson =  JSON.stringify(newjson,undefined,2);
                }
                return finalJson;
            }*/

            $scope.addAlertNotesModal= function()
            {
                $ngConfirm({
                    title : 'Add Alert Notes',
                    theme : 'Material',
                    icon : 'fa fa-plus',
                    content: '<div class="form-group"><textarea class="form-control" ng-model="alertNotes" name="alertNotes"  placeholder="Add alert notes" ng-init="required=false" ng-change="required=false" maxlength="256" required >' +
                        '</textarea>'+
                        '<div class="text-danger" id="selectedHold_required_msg" ng-show="required"><small>This is a required field.</small></div></div>',
                    scope : $scope,
                    buttons : {
                        Ok : {
                            text : 'Submit',
                            btnClass : 'btn-red',
                            action : function(scope,button) {
                                if ($scope.alertNotes.length==0) {
                                    $scope.required = true;
                                    return false;
                                } else {
                                    var config = {};
                                    config.alertId = $scope.data.alert.alertId;
                                    config.notes = $scope.alertNotes;
                                    $scope.userInformationDTO.orgId = commonDataService.getLocalStorage().orgId;
                                    $scope.userInformationDTO.userId = commonDataService.getSessionStorage().userId;
                                    $scope.userInformationDTO.channel = $scope.data.alert.txnChannelList;
                                    $scope.userInformationDTO.notes = $scope.alertNotes;
                                    config.userInformationDTO = $scope.userInformationDTO;
                                    MyAlerts.header({}).addAlertNotes(config, function (data) {
                                        //initialize();
                                        toastr.success("Alert Note Added Successfully", Msg.hurrah);
                                        $scope.alertNotes="";
                                        myAlerts($scope.data.alert.userInformationDTO.actionType);
                                    }, function (err) {
                                        $scope.alertNotes="";
                                    });
                                }
                            }
                        },
                        Cancel : {
                            text : 'Cancel',
                            action : function(scope,button) {
                                $scope.alertNotes="";
                            }

                        }
                    },
                });
            }

            $scope.closeAlertModel=function(alertId){
                $scope.updateAlert = {};
                $scope.userInformationDTO = {};
                $scope.alertReason = "";
                $scope.showMsg = false;

                $ngConfirm({
                    title : 'Close Alert',
                    theme : 'Material',
                    icon : 'fa fa-times',
                    content: '<div class="form-group"><textarea ng-change="showMsg = false" ng-model="alertReason" class="form-control" placeholder="Close Alert Reason"></textarea><div class="text-danger" ng-if="showMsg"><small>This is a required field</small></div></div>\n',
                    scope : $scope,
                    buttons : {
                        Ok : {
                            text : 'Submit',
                            btnClass : 'btn-red',
                            action : function(scope,button) {

                                if($scope.alertReason == ""){
                                    if($scope.alertReason == ""){
                                        $scope.alertReason = "";
                                        $scope.showMsg = true;
                                    }

                                    return false;
                                }else{
                                    $scope.actionType = 'MANUAL_CLOSE';
                                    $scope.updateAlert.alertId = alertId;
                                    $scope.updateAlert.caseId = $scope.data.alert.caseId;
                                    $scope.userInformationDTO.userId = commonDataService.getSessionStorage().userId;
                                    $scope.userInformationDTO.orgId = commonDataService.getLocalStorage().orgId;
                                    $scope.userInformationDTO.actionType = $scope.actionType;
                                    $scope.userInformationDTO.notes = $scope.alertReason;
                                    $scope.updateAlert.userInformationDTO = $scope.userInformationDTO;

                                    alertService.header({}).updateAlert($scope.updateAlert,function(data) {
                                        toastr.success("Alert Closed Successfully", Msg.hurrah);
                                        $scope.closeAlertDisable = true;
                                        myAlerts('MANUAL_CLOSE');
                                    },function(err){

                                    });
                                }
                            }
                        },
                        Cancel : {
                            text : 'Cancel',
                            action : function(scope,button) {
                                $scope.updateAlert = {};
                                $scope.userInformationDTO = {};
                                $scope.alertReason = "";
                                $scope.showMsg = false;
                                //$scope.actionType = 'MANUAL_CLOSE';

                            }

                        }
                    },
                });
            }

            function checkStatus(){
                var config = {};
                $scope.userInformationDTO = {};
                config.caseId = $scope.data.alert.caseId;
                config.locked = true;
                $scope.userInformationDTO.orgId = $scope.orgidcheck;
                $scope.userInformationDTO.userId = $scope.loggdUserid;
                $scope.userInformationDTO.channel = $scope.data.alert.txnChannelList;
                config.userInformationDTO = $scope.userInformationDTO;
                if(myprvPath == '/dashboard/myAlerts'){
                    MyAlerts.header({}).lockStatus({alertId:$scope.data.alert.alertId}, config, function (data) {

                    }, function (err) {

                    });
                }
            }

            $scope.goBackAlert = function(){
                localStorage.setItem("prev_path_view", "/dashboard/viewAlert");
                // change for back button//
                if($scope.prev_url == '/dashboard/myAlerts'){
                    $state.go('dashboard.myAlerts');
                }if($scope.prev_url == '/dashboard/unassignedAlerts'){
                    $state.go('dashboard.unassignedAlerts');
                }if($scope.prev_url == '/dashboard/alertsInQueue'){
                    $state.go('dashboard.alertsInQueue');
                }
            }


            var myAlerts = function(status){
            	
                
                let alertId=$scope.data.alert.alertId;
                let caseId=$scope.data.alert.caseId;
                let channel = $scope.data.caseTransactionDetail.channel;
                var config = {
                    "searchMap" : {
                        "caseId" : caseId,
                        "channel" : channel
                    },
                    "userInformationDTO" : {
                        "orgId" : commonDataService.getLocalStorage().orgId,
                        "channel" : channel,
                        "userId" : commonDataService.getSessionStorage().userId,
                        "isPlainText" : commonDataService.getLocalStorage().p2Visibility == 1 ? true
                            : false
                    }
                }
                if(config.searchMap.channel == 'AEPS'){
                	config.userInformationDTO.isPlainText = false
                }
                MyCases.header($scope.response.token).searchcase(config, function(data) {
                    let alertList = [];
                    
                    alertList = data.response.data[0].alerts;
                    
                    if(alertList!=null || alertList!= undefined){
                        if(alertList.length >0){
                            var alertDetails=alertList.filter( (x) => {
                                return (x.alertId ==alertId);


                            })
                           
                            $scope.data.alert = alertDetails[0];
                            
                            var transactionList =  data.response.data[0].caseTransactions;
                            if(transactionList.length >0){
                                var finalTransactionList=transactionList.filter( (x) => {
                                    return (x.txnId ==$scope.data.alert.txnId);


                                })
                                
                                $scope.data.caseTransactionDetail = finalTransactionList[0];
                               
                               
                                	
                                    var fraudAmlArray=[];
                                    $scope.storeallData=[]
                                    /*$scope.alertActionType = $scope.data.alert.userInformationDTO.actionType;
                                    $scope.newJsonData = JSON.parse($scope.data.caseTransactionDetail.txnjson);
                                    $scope.newDataList.push($scope.data.caseTransactionDetail);
                                    $scope.jsonDataforalert.push($scope.newJsonData);
                                    
                                    $scope.offline = false;*/
                                    $scope.newDataList = finalTransactionList;
                                    var object={}
                                    object=Object.entries($scope.newDataList).forEach(([key,value])=>{
                                        object[key]=value;
                                    })

                                    for (var i = 0; i < $scope.newDataList.length; i++) {
                                        fraudAmlArray.push({
                                            caseTypeDesc: $scope.newDataList[i].caseTypeDesc,
                                            caseTypeCode: $scope.newDataList[i].caseTypeCode,
                                            amlTypeDesc: $scope.newDataList[i].amlTypeDesc,
                                            tagType:$scope.newDataList[i].tagType,
                                            cardNumber1:$scope.newDataList[i].cardNumber1,
                                        });
                                    }
                                    $scope.storeallData.push($scope.data.caseTransactionDetail);
                                    // $scope.newJsonData1 =[];
                                    //var objs = $scope.storeallData.map(JSON.parse);
                                    var combined = [];
                                    $scope.storeallData.forEach((itm, i) => {
                                        combined.push(Object.assign({}, itm, fraudAmlArray[i]))
                                    });

                                    $scope.jsonDataforalert = combined;

                                    
                                    
                            }

                        }
                    }
                },function(err){
                    $scope.showme = false;
                });

            }

            $scope.channelDisplay = function(channel){
                if($scope.channel_code != null && typeof $scope.channel_code !== "undefined" && channel != null && typeof channel !== "undefined"){
                    for(var i=0;i<$scope.channel_code.length;i++){
                        if($scope.channel_code[i].channelCode == channel){
                            return $scope.channel_code[i].channelDesc;
                        }
                    }
                }
            }

           



        }])
