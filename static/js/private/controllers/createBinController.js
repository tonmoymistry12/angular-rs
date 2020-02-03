'use strict';

angular.module('efrm.dashboard')
    .directive('ngSpace', function() {
        return function(scope, element, attrs) {
            element.bind("keydown", function(event) {
                if (event.keyCode == 32) event.preventDefault();
            });
        };
    })
    /*.directive('uniqueBinIdScript', function(binManagement,commonDataService){
        return{
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ngModel) {
                element.bind('blur', function (e) {
                    if (!ngModel || !element.val()) return;
                    //  var keyProperty = scope.$eval(attrs.uniqueRuleName);
                    var orgId = commonDataService.getLocalStorage().orgId;
                    var currentValue = element.val();

                    ruleEditorManagement.header({}).checkUniqueBinId({
                        ruleId:element.val(),
                        orgId:orgId
                    }, function(unique) {
                        //	console.log('duplicate rule id ',unique.response)
                        if (unique.response===false && element.val().length>0) {
                            ngModel.$setValidity('unique', true);
                        }else{
                            ngModel.$setValidity('unique', false);
                        }
                    }, function(err) {
                        //	ngModel.$setValidity('unique', true);
                        /!*  console.log(err)
                          toastr.error("Rule List Failed", Msg.oops);*!/
                    });


                    /!*ruleEditorManagement.checkUniqueRuleName(keyProperty.key, keyProperty.property, currentValue)
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
                        });*!/
                });
            }
        }
    })*/
    .controller('createBinController',  ['$scope', '$state','MyCases','statusService','UserService','$location','SearchCaseService','casesManagement2','RolePermissionMatrix','$ngConfirm','casesManagement','toastr','Msg','Session','alertService','editPermission','binManagement','BinService','Validation','commonDataService',function($scope,$state, MyCases, statusService,UserService,$location,SearchCaseService,casesManagement2,RolePermissionMatrix,$ngConfirm,casesManagement,toastr,Msg,Session,alertService,editPermission,binManagement,BinService,Validation,commonDataService) {


        $scope.formData = {
            "binMetaData": {
                "org_id":'',
                "channel":'',
                "bin_id":'',
                "bin_type":'',
                "is_international":'',
                "userInformationDTO": {
                    "status": "PENDING_REVIEW",
                    "userId": ''
                }
            }
        }
        console.log($scope.formData);

        $scope.submitted={
            acq:false,
            iss:false
        }
        $scope.resetAccqBinTab=function(){
        console.log('inside resetAccqBinTab')
            $scope.submitted.acq=false
            //console.log($scope.acqSubmitted);
            $scope.formData = {
                "binMetaData": {
                    "org_id":'',
                    "channel":'',
                    "bin_id":'',
                    "bin_type":'',
                    "is_international":'',
                    "userInformationDTO": {
                        "status": "PENDING_REVIEW",
                        "userId": userId
                    }
                }
            }
        }

        $scope.resetIssBinTab=function(){
            console.log('inside bin')
            console.log($scope.issSubmitted);
            $scope.submitted.iss=false;
            $scope.formData = {
                "binMetaData": {
                    "org_id":'',
                    "channel":'',
                    "bin_id":'',
                    "bin_type":'',
                    "is_international":'',
                    "userInformationDTO": {
                        "status": "PENDING_REVIEW",
                        "userId": userId
                    }
                }
            }
        }

        $scope.isView=BinService.getBinAction()==='view'?true:false;
        $scope.isEdit=BinService.getBinAction()==='edit'?true:false;
        $scope.isCopy=BinService.getBinAction()==='copy'?true:false;

        $scope.bankList = [];
        $scope.binName="Create Bin"

        if(BinService.getBinAction()==='view'){
            $scope.binName="View Bin"
        }else if(BinService.getBinAction()==='edit'){
            $scope.binName="Edit Bin"
        }


        $scope.binTypeList=[
            {name:'Credit Card', value:'C'},
            {name:'Debit Card', value:'D'},
            {name:'Prepaid Card', value:'P'}
        ]

        var orgId = commonDataService.getLocalStorage().orgId;
        var userId = commonDataService.getSessionStorage().userId;

        function loadOrganizations(){
            editPermission.header().bankNamesOrgId({orgId : orgId},function(data) {
                $scope.bankList = data.response;
            },function(err){
                $scope.bankList = [];
            });
        }

        function loadChannel(){
            $scope.channel_code=[];
            casesManagement2.header().channel( {},
                function(response) {
                    $scope.channel_code = response.response;
                    /*var channelComb=[{channelCode: "RuPayAtm,RuPayPos", channelDesc: "ATM, POS and ECOM"} ]
                    $scope.channel_code.push(...channelComb);*/
                },
                function(err) {

                });
        }
        loadChannel();
        loadOrganizations();
        $scope.goBackView=function () {
            $state.go('dashboard.viewBin');
        }

        $scope.updateBin=function () {


                $scope.formData.binMetaData.userInformationDTO = {
                    "status": "PENDING_REVIEW",
                    "user_id": userId
                }
                if($scope.isCopy!=true || $scope.isEdit!=true) {
                createNewBin();
            }else {
                updateOldBin();
            }
        }

        var createNewBin=function(){
            binManagement.header({}).manageBinCreate({channel:null,orgId:null},$scope.formData.binMetaData,function(data) {
                toastr.success("Bin Created Successfully", Msg.hurrah);
            },function (err) {
                toastr.error("Bin Creation Failed", Msg.oops);
            })
        }

        var updateOldBin=function(){
            binManagement.header({}).manageBinUpdate({channel:null,orgId:null},$scope.formData.binMetaData,function(data) {
                toastr.success("Bin Created Successfully", Msg.hurrah);
            },function (err) {
                toastr.error("Bin Creation Failed", Msg.oops);
            })
        }

    }])
