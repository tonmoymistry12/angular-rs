'use strict';

angular.module('efrm.dashboard')
    .controller('myAlertsController',  ['$scope',
        '$state',
        'UserService',
        'statusService',
        'AlertDataService',
        '$location',
        'toastr',
        'Msg',
        'Session',
        'alertService',
        'MyAlerts',
        'commonDataService'
        ,function($scope,
                  $state,
                  UserService,
                  statusService,
                  AlertDataService,
                  $location,
                  toastr,
                  Msg,
                  Session,
                  alertService,
                  MyAlerts,
                  commonDataService) {


            $scope.creationTsSort = true;
            $scope.lastUpdateTsSort=true;
            $scope.alertIdSort = true;
            $scope.caseIdSort = true;
            $scope.txnIdSort = true;
            
            $scope.searchCategory=[
                { type: 'Alert ID',  value: 'alertId' },
                { type: 'Case ID', value: 'caseId' },
                {type: 'Transaction ID', value: 'txnId' }
            ];
            $scope.sarchSelected=function(value){
                $scope.searchBy=value;
                $scope.searchType = null;
            }

            var orgId = commonDataService.getLocalStorage().orgId;
            var userId = commonDataService.getSessionStorage().userId;
            var data=[];
            var isPlainText=true;
            $scope.showme = false;
            $scope.selectedPage = "10"
            $scope.response = statusService.getResponseMessage();

            $scope.status=[
                { type: 'OPEN',  value: 'AUTO_CREATED' },
                {type: 'CLOSE', value: 'MANUAL_CLOSE' }
            ];

             //   ['AUTO_CREATED','AUTO_EXPIRE','MANUAL_CLOSE'];
            $scope.selectedStatus='AUTO_CREATED'
            $scope.myAlerts= function(){
                MyAlerts.header($scope.response.token).myAlerts({orgId:orgId,userId:userId,status:$scope.selectedStatus,isPlainText:isPlainText,count:$scope.selectedPage},function(response){

                    $scope.data=response.response.data;
                    if($scope.data !=null || $scope.data != undefined){
                        if($scope.data.length >0){
                            $scope.showme = true;
                        }
                    }
                },function(err){
                    $scope.showme = false;
                });

            }
            $scope.myAlerts();
           
            $scope.changePageSize = function(data){
                $scope.selectedPage = data;
                $scope.myAlerts();
            }


            $scope.isSessionValid = function(){
                UserService.header({}).session({}, function(data){
                }, function(err){});
            }

            $scope.chckRiskScore = function(data){
           	 if(data.caseId.startsWith("I")){
        		 if(data.sourceChannel=='RuPayPos' || data.sourceChannel=='RuPayAtm' ){
        				
        			 return data.finalRiskScore = data.issuerScore.riskScore;
        			}
        		
        	}
        	 
        	 if(data.caseId.startsWith("A")){
        		 if(data.sourceChannel=='RuPayPos' || data.sourceChannel=='RuPayAtm' ){
        			 return data.finalRiskScore = data.aquirerScore.riskScore;
        			}
        		
        	}
        	 if(data.caseId.startsWith("B"))
        	 {
        			if(data.sourceChannel == 'IMPS' || data.sourceChannel == 'UPI' ){
        				return data.finalRiskScore = data.beneficiaryScores.riskScore;
        			}
        			
        		}
        	  if(data.caseId.startsWith("R"))
        	  {
        		  if(data.sourceChannel == 'IMPS' || data.sourceChannel == 'UPI' )
        		  {
        		   return data.finalRiskScore = data.remitterScore.riskScore;
        		  }
        	  }
        	  if(data.caseId.startsWith("M"))
        	  {
        		 
        		   return data.finalRiskScore = data.npciRiskScore;
        		  
        	  }
        	  //for AML 
        	  else{
        		  return data.finalRiskScore = data.finalRiskScore;
        	  }
}

            $scope.sort = function(keyname){
                $scope.sortKey = keyname;   //set the sortKey to the param passed
                $scope.reverse = !$scope.reverse; //if true make it false and vice versa

                if(keyname == 'txnId'){
                    $scope.txnIdSort = !$scope.txnIdSort;
                }
                if(keyname == 'caseId'){
                    $scope.caseIdSort = !$scope.caseIdSort;
                }
                if(keyname == 'alertId'){
                    $scope.alertIdSort = !$scope.alertIdSort;
                }
                if(keyname == 'creationTs'){
                    $scope.creationTsSort = !$scope.creationTsSort;
                }
                if(keyname == 'lastUpdateTs'){
                    $scope.lastUpdateTsSort = !$scope.lastUpdateTsSort;
                }
                if(keyname == 'alertType'){
                    $scope.alertTypeSort = !$scope.alertTypeSort;
                }

            }

            $scope.showData=function(alert){
                //change for back button//
                localStorage.setItem("prev_path", "/dashboard/myAlerts");
                AlertDataService.setAlertDataDetails(alert);
                $state.go('dashboard.viewAlert');


            }

        }]);
