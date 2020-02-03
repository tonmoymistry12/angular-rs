'use strict';

angular.module('efrm.dashboard')

    .controller('configAbnormalController',  ['$scope', '$state','UserService','$location','toastr','Msg','Session','AbnormalHoursService','abnormalHour','commonDataService'
        ,function($scope,
                  $state,
                  UserService,
                  $location,
                  toastr,
                  Msg,
                  Session,
                  AbnormalHoursService,
                  abnormalHour,
                  commonDataService) {
        var orgId = commonDataService.getLocalStorage().orgId;
        var userId = commonDataService.getSessionStorage().userId;
        var fromTime1;
        var toTime1;
        $scope.createFlag=true;
        $scope.mcc='';
        $scope.fromTime='';
        $scope.toTime='';
        $scope.title='Create Abnormal Hours';
        if(AbnormalHoursService.getCreateFlag()=='/dashboard/viewAbnormal'){
            $scope.createFlag = false;
            $scope.mcc=AbnormalHoursService.getAbnormalHoursDetails().mcc;
            let today = new Date();
            let dd = today.getDate();
            let mm = today.getMonth() + 1; //January is 0!
            let yyyy = today.getFullYear();
            //start time
            let time1= AbnormalHoursService.getAbnormalHoursDetails().startTime.split(':');
            let hour1='',minute1='',second1='';
            if(time1.length === 3) {
                hour1 = parseInt(time1[0], 10);
                minute1 = parseInt(time1[1], 10);
                second1 = parseInt(time1[2], 10);
            }
            let startTime1=new Date(yyyy, mm, dd,hour1,minute1,second1);
            $scope.fromTime=startTime1
            fromTime1=AbnormalHoursService.getAbnormalHoursDetails().startTime;
            //endtime
            let time2= AbnormalHoursService.getAbnormalHoursDetails().endTime.split(':');
            let hour2='',minute2='',second2='';

            if(time2.length === 3) {
                hour2 = parseInt(time2[0], 10);
                minute2 = parseInt(time2[1], 10);
                second2 = parseInt(time2[2], 10);
            }
            let startTime2=new Date(yyyy, mm, dd,hour2,minute2,second2);
            $scope.toTime=startTime2;
            toTime1=AbnormalHoursService.getAbnormalHoursDetails().endTime;
            AbnormalHoursService.setCreateFlag($location.url());

        }

        if($scope.createFlag==true){
            $scope.title='Configure Abnormal Hours';
        }else if($scope.createFlag==false){
            $scope.title='Edit Abnormal Hours';

        }
        $scope.invaliDate=false;

        $scope.isSessionValid = function(){
            UserService.header({}).session({}, function(data){
            }, function(err){});
        }

        $scope.changeFromTime=function(fromTime){
            //alert("im in changeform time")
            fromTime1=fromTime;
        }
        $scope.changeToTime=function(toTime){
            //alert("im in to time")
            toTime1=toTime;
        }
        $scope.configAbnormalHours=function(){
                var config={
                    "mcc":$scope.mcc,
                    "startTime":fromTime1,
                    "endTime":toTime1,
                    userInformationDTO:{
                        "userId": userId,
                        "orgId": orgId,
                        "actionType": "PENDING_REVIEW",
                    }
                };
                if($scope.createFlag==true){

                    abnormalHour.header({}).createAbnormalHour({channel:null,orgId:null},config,function(data) {
                        toastr.success("Abnormal Hours Created Successfully", Msg.hurrah);
                        $scope.mcc='';
                        $scope.fromTime='';
                        $scope.toTime='';
                        $scope.submitted=false;
                    },function(err){
                        //toastr.error("Abnormal Hours Creation Failed", Msg.oops);
                    });
                }else{
                    abnormalHour.header({}).updateAbnormalHour({channel:null,orgId:null},config,function(data) {
                        toastr.success("Abnormal Hours Created Successfully", Msg.hurrah);
                        $scope.mcc='';
                        $scope.fromTime='';
                        $scope.toTime='';
                        $scope.submitted=false;
                        $scope.createFlag=true;
                        $scope.title='Configure Abnormal Hours';
                    },function(err){
                       // toastr.error("Abnormal Hours Creation Failed", Msg.oops);
                    });
                }

        }

            $scope.goBack = function() {
                $state.go('dashboard.viewAbnormal');
            }



    }])
