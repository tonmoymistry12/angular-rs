'use strict';

angular.module('efrm.dashboard')
    .controller('viewBinController', ['$scope', '$state', 'MyCases', 'statusService', 'UserService', '$location', 'SearchCaseService', 'casesManagement2', 'RolePermissionMatrix', '$ngConfirm', 'casesManagement', 'toastr', 'Msg', 'Session', 'alertService', 'editPermission', 'ngDialog','binManagement','BinService', 'commonDataService', function($scope, $state, MyCases, statusService, UserService, $location, SearchCaseService, casesManagement2, RolePermissionMatrix, $ngConfirm, casesManagement, toastr, Msg, Session, alertService, editPermission, ngDialog,binManagement, BinService, commonDataService) {

            var orgId = commonDataService.getLocalStorage().orgId;
            var userId =  commonDataService.getSessionStorage().userId;
            $scope.loggedInUser = userId;
            $scope.loggedInOrgId = orgId;
            //console.log('$scope.loggedInUser - ',$scope.loggedInUser)
            $scope.currentDate =new Date();
            $scope.data = [];
            $scope.selectedObject={
                    orgId:'',
                    status:''
            }

            $scope.page = {
                    pageNo 	 : 1,
                    pageSize : 10
            };
            $scope.currentPage = 1;

        $scope.statusList = [
            { name:"PENDING_REVIEW",val:"PENDING_REVIEW"},
            { name:"ACTIVE",val:"ACTIVE"},
            { name:"REJECT",val:"REJECT"},
            { name:"DEACTIVATED",val:"DEACTIVATED"}
        ];
            $scope.bankList = [];
            //loadChannel();
            loadOrganizations();

            $scope.searchBinSubmit = function(){
                binManagement.header().getBins({ status: $scope.selectedObject.status, orgId: $scope.selectedObject.orgId}, function(data) {
                                    $scope.data = data.response;


                    console.log($scope.data);
                                    /*if back end not working
                                     $scope.totalItems = data.response.records.length;*/
                                    //$scope.totalItems = data.response.totalRecords;
                                    $scope.orgIdMsg=false;
                            },function(err){
                                    $scope.data = [];
                                    $scope.totalItems = 0;
                                    $scope.orgIdMsg=false;
                            });

                /*$scope.data.data=
                    [{
                    "status": 200,
                    "response": [
                        {
                            "bin": "608001",
                            "orgId": "FIN",
                            "binType": "D",
                            "channel": ""
                        },
                        {
                            "bin": "608002",
                            "orgId": "FIN",
                            "binType": "D",
                            "channel": ""
                        },
                        {
                            "bin": "720409",
                            "orgId": "FIN",
                            "binType": "",
                            "channel": "RuPayPos"
                        },
                        {
                            "bin": "810869",
                            "orgId": "FIN",
                            "binType": "",
                            "channel": "RuPayAtm"
                        }
                    ]
                }]*/

            };

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

            $scope.viewBinDetail = function(bin) {
                    $scope.data = [];
                    BinService.setBinDetails(bin);
                    BinService.setBinAction('view');
                    BinService.setSelectedOrgId($scope.selectedOrgId);
                    if (bin.channel) {
                            $state.go('dashboard.acquirerBin');
                    } else {
                            $state.go('dashboard.issuerBin');
                    }
            }
            $scope.editBinDetail = function(bin) {
                    $scope.data = [];
                    BinService.setBinDetails(bin);
                    BinService.setBinAction('edit');
                    BinService.setSelectedOrgId($scope.selectedOrgId);
                    if (bin.channel) {
                        $state.go('dashboard.acquirerBin');
                    } else {
                        $state.go('dashboard.issuerBin');
                    }
            }
            $scope.copyBinDetail = function(bin) {
                    $scope.data = [];
                    BinService.setBinDetails(bin);
                    BinService.setBinAction('copy');
                    BinService.setSelectedOrgId($scope.selectedOrgId);
                    if (bin.channel) {
                        $state.go('dashboard.acquirerBin');
                    } else {
                        $state.go('dashboard.issuerBin');
                    }
            }

            $scope.callActivate=function(bin,status){
            }

            $scope.callDeactivate=function(bin,status){
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

            $scope.callReject=function(bin,status){
                    $ngConfirm({
                            title: 'Are you sure to reject the bin?',
                            theme: 'Material',
                            content: '<div class="form-group"></div>',
                            scope: $scope,
                            buttons: {
                                    Yes: {
                                            text: 'Confirm',
                                            btnClass: 'btn-red',
                                            action: function (scope, button) {
                                                    $scope.changebinStatus(bin,status)
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

            $scope.changeBinStatus = function(bin, status) {
                    var config = {

                    };
                    updateBin(config);
            }

            function updateBin(config) {
                    binManagement.header({}).updateBin({
                            channel: null,
                            orgId: null
                    }, config, function(data) {
                            toastr.success("Bin Successfully Updated", Msg.hurrah);
                            $scope.searchBinSubmit();
                    }, function(err) {
                            toastr.error("Bin Creation Failed", Msg.oops);
                    });
            }

            /*$scope.binAccessForMakerCheckerNPCI=function(bin){

                    if(orgId==='NPCI'){

                            if(bin.orgId==='NPCI'){
                                    return true
                            }else{
                                    return false
                            }

                    }else{
                            if(bin.orgId===orgId){
                                    return true
                            }else{
                                    return false
                            }
                    }

            }*/

           /* $scope.binAccess=function(bin,isEdit){
                    //console.log('orgId ', orgId)
                    //console.log('bin ', bin)
                    var isNpcibin = (bin.orgId==='NPCI')?true:false


                    if(orgId==='NPCI'){
                            if(bin.orgId==='NPCI' && bin.createdByUserId!=$scope.loggedInUser){
                                    return true
                            }else{
                                    if(bin.orgId!='NPCI'){
                                            return true
                                    }else{
                                            return false
                                    }
                            }
                    }else{
                            if(bin.orgId===orgId){
                                    if(bin.createdByUserId!=$scope.loggedInUser){
                                            return true
                                    }else{
                                            return false
                                    }
                            }else{
                                    return false
                            }
                    }

            }*/

            $scope.changePageSize = function(){
                    $scope.currentPage = 1;
                    $scope.page.pageSize = parseInt($scope.selectedPage);
                    $scope.searchBinSubmit();
            }

    }])