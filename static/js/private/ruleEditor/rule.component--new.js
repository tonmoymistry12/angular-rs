(function() {
    'use strict';
    angular.module('rule')
        .component('rule', {
            templateUrl: "templates/private/ruleEditor/rule.component.html",
            controller: function(Idle, Keepalive, $scope, $ngConfirm, $window, $state, $location, $http, ruleEditorManagement, toastr, Msg, casesManagement2, editPermission, RuleService, ruleManagement, ruleDataService, commonDataService, ngDialog, $timeout, $filter) {
            	
            	$window.scrollTo(0, 0);
            	
            	// FOR IDLE CHECK START
            	
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
            	
            	// FOR IDLE CHECK END
            	
            	// DATE FORMAT CHECK START
            	
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
            	        
            	        if (getToTime.length > 5) {
            	            getToTime = getToTime.substring(0, getToTime.length - 3);
            	        }
            	        $scope.formParams.ruleMetaData.effectiveToTs = getToDate + ' ' + getToTime
            	    }

            	}
            	
            	// DATE FORMAT CHECK END
            	
            	// CHANNEL LOAD START
            	
            	 $scope.channels = ruleDataService.getChannel();
            	 
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

            		loadChannel();
            		
            	// CHANNEL LOAD END
            		
            	// ORGANIZATION LOAD START
            		
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

            		loadOrganizations();
            		
            	// ORGANIZATION LOAD END
            		
            	// ONLINE LIST START
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
            	];
            	// ONLINE LIST END
            		
            	// RULE TYPE LIST START
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
            	// RULE TYPE LIST END
            	 
            	 
            }
        })
})