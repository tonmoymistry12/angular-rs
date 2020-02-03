'use strict';

angular.module('efrm.dashboard')
.controller('myReportsDetailsController',  ['$scope', '$state','statusService','UserService','$ngConfirm','toastr','Msg','Session','commonDataService','efrmReports',  function($scope, $state, statusService,UserService,$ngConfirm,toastr,Msg,Session,commonDataService,efrmReports) {
	
	$scope.searchData ={}
	$scope.customReportRequestList = [];
	$scope.fixedReportRequestList = [];
	$scope.fixedReport = false;
	$scope.showcustomReport = false;
	$scope.reportNamesort = true;
	$scope.reportOrgsort = true;
	$scope.sourceChannelsort = true;
	$scope.reportStatussort = true;
	$scope.reportMimeTypesort = true;
	$scope.requestTimeInsort = true;
	
	$scope.fixedreportNamesort = true;
	$scope.fixedreportOrgsort = true;
	$scope.fixedreportChannelsort = true;
	$scope.fixedreportstatussort = true;
	$scope.fixedreportTypesort = true;
	$scope.fixedreportTimeIn = true;
	$scope.fixedScheduleTimesort = true;
	var reportDetailsDto = {}
	
	var storeData = [];
	 
    $scope.isSessionValid = function(){
        UserService.header({}).session({}, function(data){
        }, function(err){});
    }
    
    $scope.stopProcess = function(reportDetails){
    	reportDetailsDto = {}
    	reportDetailsDto.email = commonDataService.getLocalStorage().userEmail;
    	$ngConfirm({
 			title: 'Stop Process',
 			theme: 'Material',
 			//icon: 'fa fa-unlock',
 			content: 'Do You Want To Stop The Process ?',
 			scope: $scope,
 			buttons: {
 				Ok: {
 					text: 'Confirm',
 					btnClass: 'btn-red',
 					action: function(scope, button){                    	
 						
 						efrmReports.header().stopReports({reportRequestId:reportDetails.reportReqId},reportDetailsDto,function(data) {
 							toastr.success("Report Generated Request Terminated", Msg.hurrah);
 							$scope.init();
 					       },function(err){
 					    	   toastr.error("Report termination request is not successful – Please contact administrator", Msg.hurrah);
 					       });
 					}
 				},
 				Cancel: {
 					text: 'Cancel'
 				}
 			}
 		});
    }
	
    $scope.init = function(){
    	$scope.searchData.orgId = commonDataService.getLocalStorage().orgId;
    	$scope.searchData.requesterName = $scope.userId = commonDataService.getSessionStorage().userId;
    	efrmReports.header({}).myReports($scope.searchData,function(data) {
    		
            $scope.customReportRequestList = data.response.customReportRequestList;
            $scope.fixedReportRequestList = data.response.fixedReportRequestList;
            storeData = data.response.fixedReportRequestList
            if( $scope.customReportRequestList.length > 0){
            	$scope.showcustomReport = true;
            }
            
            if( $scope.fixedReportRequestList.length > 0){
            	$scope.showfixedReport = true;
            }
           
        },function(err){
        	$scope.customReportRequestList = []; 
        	 $scope.fixedReportRequestList = [];
        });
    }
    
    $scope.filterCaseId = function(organisation){
    	var matched_terms = [];
    	
    	if(organisation){
    		if(!organisation.includes(",")){
    			$scope.fixedReportRequestList = [];
    			organisation  = organisation.toLowerCase();
    		storeData.forEach(item => {
                if(item.reportForOrg.toLowerCase().indexOf(organisation) !== -1 ){
                	$scope.fixedReportRequestList.push(item); 
                }
    		})
    		
    		}else{
    			var stringArray = [];
    			$scope.fixedReportRequestList = [];
    			
        		stringArray = organisation.split(",");
        		for(var j = 0; j<stringArray.length;j++){
        			if(stringArray[j]){
	        		storeData.forEach(item => {
	        			
	                    if(item.reportForOrg.toLowerCase().indexOf(stringArray[j].toLowerCase()) !== -1 ){
	                    	
	                    	
	                    	$scope.fixedReportRequestList.push(item); 
	                    }
	        		})
        		}
        		}
    		}
    	}else{
    		$scope.fixedReportRequestList = storeData;
    	}
    	
    }
    $scope.sort = function(keyname){
    	
    	$scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
        
        if(keyname == 'reportName'){
        	$scope.reportNamesort = !$scope.reportNamesort;
        }
        if(keyname == 'reportForOrg'){
     	   $scope.reportOrgsort = !$scope.reportOrgsort;
        }
        if(keyname == 'sourceChannel'){
        	 $scope.sourceChannelsort = !$scope.sourceChannelsort;
         }
        if(keyname == 'reportStatus'){
       	 $scope.reportStatussort = !$scope.reportStatussort;
        }
        if(keyname == 'reportMimeType'){
          	 $scope.reportMimeTypesort = !$scope.reportMimeTypesort;
         }
        if(keyname == 'requestTimeIn'){
         	 $scope.requestTimeInsort = !$scope.requestTimeInsort;
          }    
    }
    
 $scope.sort1 = function(keyname){
    	
    	$scope.sortKey1 = keyname;   //set the sortKey to the param passed
        $scope.reverse1 = !$scope.reverse1; //if true make it false and vice versa
        
        if(keyname == 'reportName'){
        	$scope.fixedreportNamesort = !$scope.fixedreportNamesort;
        }
        if(keyname == 'reportForOrg'){
     	   $scope.fixedreportOrgsort = !$scope.fixedreportOrgsort;
        }
        if(keyname == 'sourceChannel'){
        	 $scope.fixedreportChannelsort = !$scope.fixedreportChannelsort;
         }
        if(keyname == 'reportStatus'){
       	 $scope.fixedreportstatussort = !$scope.fixedreportstatussort;
        }
        if(keyname == 'reportMimeType'){
          	 $scope.fixedreportTypesort = !$scope.fixedreportTypesort;
         }
        if(keyname == 'requestTimeIn'){
         	 $scope.fixedreportTimeIn = !$scope.fixedreportTimeIn;
          }
        if(keyname == 'nextScheduleTime'){
        	 $scope.fixedScheduleTimesort = !$scope.fixedScheduleTimesort;
         }
      
       
    }
 
	$scope.init()    	   
 }])
