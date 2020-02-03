'use strict';

angular.module('efrm.dashboard')
    .controller('viewAbnormalController',  ['$scope', '$state','$stateParams','UserService','$location','toastr','Msg','Session','alertService','AbnormalHoursService','abnormalHour','$ngConfirm','commonDataService'
        ,function($scope, $state,$stateParams,UserService,$location,toastr,Msg,Session,alertService,AbnormalHoursService,abnormalHour,$ngConfirm,commonDataService) {

        var orgId = commonDataService.getLocalStorage().orgId;
        var userId = commonDataService.getSessionStorage().userId
        $scope.makerId = commonDataService.getSessionStorage().userId
        $scope.data='';
        $scope.status=['ACTIVE','DEACTIVATED'];
        $scope.selectedStatus='PENDING_REVIEW'
        if($stateParams.viewable == 'N'){
        	$scope.isApprovePending = false;
        }else{
        	$scope.isApprovePending = true;
        	$scope.selectedStatus='ACTIVE'
        }
        $scope.isSessionValid = function(){
            UserService.header({}).session({}, function(data){
            }, function(err){});
        }
        $scope.abnormalHoursList=function() {
            abnormalHour.header().viewAbnormalHour({status: $scope.selectedStatus}, function (response) {
                $scope.data = response.response;
                
            }, function (err) {
                $scope.data = '';

            })
        }
        $scope.abnormalHoursList();

        $scope.viewAbnormalHoursDetails=function(row){
            $scope.data={};
            AbnormalHoursService.setAbnormalHoursDetails(row);
            AbnormalHoursService.setCreateFlag($location.url());
            $state.go('dashboard.configAbnormal');


        }

        $scope.changeHoursStatus=function (row,status) {
            if(status=='ACTIVE'){
                $ngConfirm({
                    title : 'Approve Abnormal Hours',
                    theme : 'Material',
                    icon : 'fa fa-check',
                    content: '<span class="alert_text">Are you sure to approve the abnormal hours?</span>',
                    buttons : {
                        Ok : {
                            text : 'Approve',
                            btnClass : 'btn-red',
                            action : function (scope, button) {
                                confirmAbnormalStatusUpdate(row,status)
                            }
                        },
                        Cancel : {
                            text : 'Cancel',
                            action : function(
                                scope,
                                button) {
                            }

                        }
                    }
                });

            }else if(status=='DEACTIVATED'){
                $ngConfirm({
                    title : '<div class="ng-confirm-title-c widthMaxContent"><span class="fa fa-check"></span>Deactivate Abnormal Hours</div>',
                    theme : 'Material',
                    /*icon : 'fa fa-check',*/
                    content: '<span class="alert_text">Are you sure to reject(deactivate) the abnormal hours?</span>',
                    buttons : {
                        Ok : {
                            text : 'Confirm',
                            btnClass : 'btn-red',
                            action : function (scope, button) {
                                confirmAbnormalStatusUpdate(row,status)
                            }
                        },
                        Cancel : {
                            text : 'Cancel',
                            action : function(
                                scope,
                                button) {
                            }

                        }
                    }
                });

            }

        }

        function confirmAbnormalStatusUpdate(row,status){

            var config={
                "id":row.id,
                "mcc":row.mcc,
                "startTime":row.startTime,
                "endTime":row.endTime,
                userInformationDTO:{
                    "userId": userId,
                    "orgId": orgId,
                    "actionType": status,
                }
            };

            abnormalHour.header({}).updateAbnormalHour({channel:null,orgId:null},config,function(data) {
                toastr.success("Abnormal Hours Updated Successfully", Msg.hurrah);
                $scope.abnormalHoursList();
            },function(err){
                $scope.abnormalHoursList();
            });

        }


    }])
