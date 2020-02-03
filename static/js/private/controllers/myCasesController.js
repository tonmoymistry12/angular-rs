'use strict';

angular.module('efrm.dashboard')
.controller('myCasesController',  ['$scope', '$state','MyCases','statusService','UserService','$location','SearchCaseService','casesManagement','casesManagement2','commonDataService','archive', function($scope, $state, MyCases, statusService,UserService,$location,SearchCaseService,casesManagement,casesManagement2,commonDataService,archive) {
	
	$scope.creationTsSort = true;
	$scope.alertCountsort = true;
	$scope.fraudScore = true;
    var orgId = commonDataService.getLocalStorage().orgId;
    var userId = commonDataService.getSessionStorage().userId
    var data=[];
    var isPlainText=true;
    $scope.showme = false;
    //$scope.selectedPage = "5"
    //change
    $scope.selectedPage = "50"
	$scope.count = "ALL";
    $scope.response = statusService.getResponseMessage();
    archive.setArchive("false");
    $scope.mycases = function(){
	    	MyCases.header($scope.response.token).mycases({orgId:orgId,userId:userId,isPlainText:isPlainText,count:"ALL",status:'ALL'},function(response){
	    	
	        $scope.data=response.response.data;

                if($scope.data !=null || $scope.data != undefined){
	        	if($scope.data.length >0){
	        	$scope.showme = true;
	        	}
	        }
	    },function(err){
	    	$scope.showme = false;
				$scope.count = "ALL";
				$scope.selectedPage = "5";
	    });
	    	
	    	casesManagement2.header($scope.response.token).channel( {},
	    			function(response) {
	                             $scope.channel_code = response.response;
	    				},
	    			function(err) {
	    			});
    }
    $scope.mycases();
    
    $scope.changePageSize = function(data){
		$scope.count = "ALL";
    	$scope.selectedPage = data;
    	//$scope.mycases();
    }

    $scope.isSessionValid = function(){
        UserService.header({}).session({}, function(data){
        }, function(err){});
    }
    
    $scope.chckRiskScore = function(data){
    	if(typeof data !== 'undefined'){
    		
   	 if(data.caseId.startsWith("I")){
   		 if(data.sourceChannel=='RuPayPos' || data.sourceChannel=='RuPayAtm' || data.sourceChannel=='AEPS' || data.sourceChannel == 'NETC' ){
   				
   			 return data.finalRiskScore = data.issuerScore.riskScore;
   			}
   		
   	}
   	 
   	 if(data.caseId.startsWith("A")){
   		 if(data.sourceChannel=='RuPayPos' || data.sourceChannel=='RuPayAtm' || data.sourceChannel=='AEPS' || data.sourceChannel == 'NETC' ){
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
   		  if(data.sourceChannel == 'IMPS' || data.sourceChannel == 'UPI')
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
        if(keyname == 'creationTs'){
        	 $scope.creationTsSort = !$scope.creationTsSort;
         }
        if(keyname == 'txnCount'){
       	 $scope.alertCountsort = !$scope.alertCountsort;
        }
        if(keyname == 'finalRiskScore'){
          	 $scope.fraudScore = !$scope.fraudScore;
           }
       
    }

    $scope.showData=function(caseId,sourceChannel,isLocked,caseStatus){
    	//change for back button//
		//caseStatus
    	localStorage.setItem("prev_path", "/dashboard/myCase");
    	//End Here//
    	if(isLocked == true){
			SearchCaseService.setSearchCase(caseId,orgId,sourceChannel);
        	$state.go('dashboard.viewCase');
    	}
    	if(isLocked == false){
    		if(caseStatus!='MANUAL_CLOSE'||caseStatus!='AUTO_CLOSE'){
				var config = {};
				$scope.userInformationDTO = {};
				config.caseId = caseId;
				config.locked = true;
				$scope.userInformationDTO.orgId = commonDataService.getLocalStorage().orgId;
				$scope.userInformationDTO.userId = commonDataService.getSessionStorage().userId
				$scope.userInformationDTO.channel = sourceChannel;
				config.userInformationDTO = $scope.userInformationDTO;
				casesManagement.header({}).editLock({caseId:null},config, function (data) {
//console.log(SearchCaseService.getSearchCase().caseId);
					if(data.response.status == "SUCCESS"){
						{
							var config = {};

							config.caseId = caseId;
							config.hold = true;
							$scope.userInformationDTO.orgId = commonDataService.getLocalStorage().orgId;
							$scope.userInformationDTO.userId = commonDataService.getSessionStorage().userId
							$scope.userInformationDTO.channel = SearchCaseService.getSearchCase().sourceChannel;
							$scope.userInformationDTO.notes ='Case Hold';
							config.userInformationDTO = $scope.userInformationDTO;
							casesManagement
								.header({})
								.editHold(
									config,
									function(data) {
										SearchCaseService.setSearchCase(caseId,orgId,sourceChannel);
										$state.go('dashboard.viewCase');
									},
									function(err) {

									});

						}
					}


				}, function (err) {

				});
			}
    		

    	}
    }

    $scope.channelDisplay = function(channel){
    	if(typeof $scope.channel_code !== "undefined" &&  $scope.channel_code != null && typeof channel !== "undefined" && channel != null){
    	for(var i=0;i<$scope.channel_code.length;i++){
    		if($scope.channel_code[i].channelCode == channel){
    			return $scope.channel_code[i].channelDesc;
    		}
    	}	
    	}
    }

 }])