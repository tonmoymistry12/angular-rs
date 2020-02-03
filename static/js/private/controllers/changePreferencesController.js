'use strict';

angular.module('efrm.dashboard')
    .controller('changePreferencesController',  ['$scope','$q', '$state','statusService','UserService','$location','SearchCaseService','commonDataService','casesManagement','casesManagement2',
        function($scope, $q, $state, statusService,UserService,$location,SearchCaseService,commonDataService,casesManagement,casesManagement2) {

            var orgId = commonDataService.getLocalStorage().orgId;

            var userId = commonDataService.getSessionStorage().userId;
            $scope.response = statusService.getResponseMessage();



            $scope.selectedMsg=false;
            console.log(localStorage.getItem('prev_path'));
            console.log(localStorage.getItem('current_path'));

                var screen='createManualCase'
            var allColumns={};
            var selectedColumns={};
            $scope.list1 = [];
            $scope.list2 = [];
            loadChannel();
            var object1=[];
            var object2=[];

            var promise1;
            var promise2;

            function loadChannel(){
                casesManagement2.header($scope.response.token).channel( {},
                    function(response) {
                        $scope.channel_code = response.response;
                    },
                    function(err) {

                    });
            }



            $scope.changeChannel=function(){

                $scope.selectedChannel=selectedChannel;
                if($scope.selectedChannel!=''&& !angular.isUndefined($scope.selectedChannel)){
                   var getAll=getAllList(selectedChannel);
                   var getUsers=getUserList(selectedChannel);
                    $q.all([getAll, getUsers]).then(function(values) {
                        if(!angular.isUndefined(object1) && !angular.isUndefined(object2)) {
                            alert('inside list')
                            $scope.list1=object1.filter(x=>!object2.includes(x));
                            $scope.list2=object2;

                        }
                    });

                }else{
                    var allColumns={};
                    var selectedColumns={};

                }
            }

            var getAllList=function(selectedChannel){

                promise1 = $q.defer();
                casesManagement.header($scope.response.token).getPreferences({channel : selectedChannel, screen: screen},function(data) {
                    allColumns=data.response;
                    object1=Object.values(allColumns);
                    promise1.resolve(object1);
                    console.log(object1);
                },function(err){
                    var allColumns={};
                    promise1.reject();
                });
                return promise1.promise;
            }

            var getUserList=function(selectedChannel){
                promise2 = $q.defer();
                    casesManagement.header($scope.response.token).getPreferencesByUserId({userId:userId,channel : selectedChannel, screen: screen},function(data) {
                    if(!angular.isUndefined(data.response)){
                        selectedColumns=data.response;
                        object2=Object.values(selectedColumns);
                        promise2.resolve(object2);
                        console.log(object2);
                    }
                },function(err){
                    var selectedColumns={};
                    promise2.reject(object2);
                });
                return promise2.promise;
            }


            $scope.sortableOptions = {
                'ui-floating': true,
                placeholder: "app",
                connectWith: ".apps-container",
                update: function (e, ui) {
                    console.log(e, ui);
                    console.log('updated');
                },
                stop: function (e, ui) {
                    // this callback has the changed model
                    console.log('stopped');
                    console.log($scope.list2);
                }
            };
            $scope.updatePreferences=function () {

                if($scope.list2.length==0){
                    $scope.selectedMsg=true;

                }else{
                    $scope.selectedMsg=false;
                    var obj={};

                    for(var i = 0; i < $scope.list2.length; i++) {
                        obj[i] = $scope.list2[i];
                    }
                    obj=JSON.stringify(obj);
                    console.log(obj);
                    if(selectedColumns!=null || !angular.isUndefined(selectedColumns)){
                       updateList(obj);
                    }else{
                        createList(obj);
                    }


                }

            }
            function updateList(obj){
                casesManagement.header($scope.response.token).updatePreferencesByUserId({userId:userId,channel : $scope.selectedChannel, screen: screen},obj,function(data) {
                    console.log(data.response);
                },function(err){

                });
            }

            function createList(obj) {
                casesManagement.header($scope.response.token).createPreferencesByUserId({userId:userId,channel : $scope.selectedChannel, screen: screen},obj,function(data) {
                    console.log(data.response);
                },function(err){

                });
            }

            /*$scope.models = {
                selected: null,
                lists: {"A": [], "B": []}
            };

            // Generate initial model
            for (var i = 1; i <= 3; ++i) {
                $scope.models.lists.A.push({label: "Item A" + i});
                $scope.models.lists.B.push({label: "Item B" + i});
            }

            // Model to JSON for demo purpose
            $scope.$watch('models', function(model) {
                $scope.modelAsJson = angular.toJson(model, true);
            }, true);*/

    }])