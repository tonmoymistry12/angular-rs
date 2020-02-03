'use strict';

angular.module('efrm.dashboard')
    .controller('searchCases',  ['$scope', '$state','statusService','toastr','Msg','$ngConfirm','MyCases','UserService','$location','SearchCaseService','casesManagement','casesManagement2','commonDataService','archive',function($scope, $state,statusService, toastr,Msg,$ngConfirm,MyCases,UserService,$location,SearchCaseService,casesManagement,casesManagement2,commonDataService,archive) {

    	var orgId = commonDataService.getLocalStorage().orgId;
		var userId = commonDataService.getSessionStorage().userId;
		$scope.loggedUserId = commonDataService.getSessionStorage().userId;
		var perspective = commonDataService.getLocalStorage().perspective;
		$scope.caseIdSort = true;
		$scope.alertCountsort = true;
		$scope.creationTsSort = true;
		$scope.fraudScoreSort = true;
		var data = [];
		$scope.showArchiveBtn = false;
		$scope.userEmail = [];
		$scope.showDatatable = false;
		$scope.showDatatable2 = false;
		$scope.response = statusService.getResponseMessage();
		//loadChannel();
		$scope.prespevtiveMsg = false;
		$scope.someObject = {};
		//$scope.SelectedPerspective_val = '';
		$scope.channel_code = [];
		$scope.response = statusService.getResponseMessage();
		$scope.response = statusService.getResponseMessage();
		$scope.allowAssignAnalyst=false;
		var isAnalyist = $scope.response.usersAuthoritiesPermissionsDto.authority;
		$scope.loggedInOrgId = commonDataService.getLocalStorage().orgId;
		$scope.count = "ALL";
		//$scope.selectedPage = "5";
		//chNGE
		$scope.selectedPage = "50";
		$scope.selectedPage2 = "50";
		$scope.prespectiveDisabled = true;
		$scope.disabledSearchCriteria = true;
		$scope.disabledValue = true;
		$scope.isArchive = '';
		$scope.makeArchivetrue = true;
		$scope.makeArchivefalse = false;
		var checkOrgId;
		if(isAnalyist.includes('ANALYSTS')){
			$scope.chkAnalyist = true;
		}else{
			$scope.chkAnalyist = false;
		}
		if($scope.chkAnalyist==true && $scope.loggedInOrgId=='NPCI'){
			$scope.allowAssignAnalyst=true;
		}else if($scope.chkAnalyist==true && $scope.loggedInOrgId!='NPCI'){
			$scope.allowAssignAnalyst=false;
		}
		/* $scope.isSessionValid = function(){
             UserService.header({}).session({}, function(data){
             }, function(err){});
         }*/

		$scope.perspectiveArray = perspective.split(",");
		if ($scope.perspectiveArray[0] == 'undefined') {
			$scope.perspectiveArray = [];
		}

		if ($scope.perspectiveArray.length == 1) {
			$scope.SelectedPerspective = $scope.perspectiveArray[0];
			$scope.desableme = true;
		}else if($scope.perspectiveArray.length>1){
			$scope.desableme = false;
			if($scope.perspectiveArray[0]=='ISSUER'){
				$scope.SelectedPerspective = $scope.perspectiveArray[0];
			}else if($scope.perspectiveArray[1]=='ISSUER'){
				$scope.SelectedPerspective = $scope.perspectiveArray[1];
			}

		}
		
		$scope.archive_onChange = function(value){
			 archive.setArchive(value.value);
			
		    }
		
		$scope.setPrespective = function(SelectedPerspective){
			    
			    $scope.showArchiveBtn = false;
				$scope.SelectedPerspective = SelectedPerspective;
				$scope.maxNo = null;	
				$scope.minNo = null;
				$scope.pattern = null;
				$scope.disabledSearchCriteria = false;
				
			}
        
        $scope.searchCriterias =[
        	{ name:"CASE ID",value:"caseId"},
        	{ name:"MID",value:"mid"},
        	{ name:"PAN",value:"cardNumber"},
        	{ name:"MCC",value:"mcc"},
        	{ name:"RRN",value:"rrn"},
        	{ name:"Payer VPA",value:"payerVpa"},
        	{ name:"Payee VPA",value:"payeeVpa"},
        	{ name:"REMITTER ACCOUNT NUMBER",value:"remitterAccNumber"},
        	{ name:"BENEFICIARY ACCOUNT NUMBER",value:"beneficiaryAccNumber"}
        ]
     
       $scope.archive_value = [
    	   {
    		   name:"FALSE", value:"false"
    	   },
    	   {
    		   name:"TRUE", value:"true"
    	   }
    	   
       ]
        $scope.archived_value_mdl =  $scope.archive_value.filter((x)=>{
        	return x.value == archive.getArchive()
        });
        $scope.archived_value_mdl = $scope.archived_value_mdl[0];
       $scope.loadChannel = function(){
            $scope.channels = [];
            casesManagement2.header(localStorage.getItem("sessionToken")).channel( {},
                function(response) {
                    $scope.channel_code = response.response;
                    $scope.channels = data.response;

		$scope.perspectiveArray = perspective.split(",");
		if ($scope.perspectiveArray[0] == 'undefined') {
			$scope.perspectiveArray = [];
		}

                },
                function(err) {
                    $scope.channels = [];
                });
        }

		$scope.changePageSize = function(data){
			$scope.count = "ALL";
			$scope.selectedPage = data;
			$scope.selectedPage2 = data;
			//$scope.changedValue($scope.selectedQueueId);
		}
       
      
		$scope.searchAllCase = function (caseId, channel,SelectedPerspective) {
			$scope.showArchiveBtn = true;
			$scope.showDatatable2= false
			 	$scope.selectedChannel = channel;
	    	   sessionStorage.setItem("searchCaseCriteria", $scope.selectedCriteria);
	    	   sessionStorage.setItem("searchCaseChannel", channel);
	    	   sessionStorage.setItem("searchCaseValue", caseId);
			if(SelectedPerspective == ''){
					$scope.prespevtiveMsg = true
			}
			else 
			{
				$scope.prespevtiveMsg = false;
				var perspectiveObj;
				$scope.orgMsg = true;
				if (channel=='IMPS'||channel=='UPI') {
					if(SelectedPerspective == "ISSUER"){
						perspectiveObj = "R"
					}
					if (SelectedPerspective == "ACQUIRER") {
						perspectiveObj = "B";
					}
					if (SelectedPerspective == "AML") {
						perspectiveObj = "M";
					}

				}
				if (channel=='RuPayPos'||channel=='RuPayAtm'||channel=='AEPS'||channel=='NETC') {
					if(SelectedPerspective == "ISSUER"){
						perspectiveObj = "I"
					}
					if (SelectedPerspective == "ACQUIRER") {
						perspectiveObj = "A";
					}
					if (SelectedPerspective == "AML") {
						perspectiveObj = "M";
					}

				}
			$scope.selectedChannel = channel;
			sessionStorage.setItem("searchCaseCriteria", $scope.selectedCriteria);
			sessionStorage.setItem("searchCaseChannel", channel);
			sessionStorage.setItem("searchCaseValue", caseId);
				sessionStorage.setItem("perspective", SelectedPerspective);
			if (caseId.charAt(0) == 'M') {
				$scope.selectedOrgId = 'NPCI';

			} else {
				$scope.selectedOrgId = caseId.substring(1, 4);
				if(caseId == '%'){
				checkOrgId = caseId;
				}
			}
			$scope.caseList = [];
			if ($scope.selectedCriteria == 'caseId') {
				var config = {
					"searchMap": {
						"caseId": caseId,
						"channel": channel
					},
					"userInformationDTO": {
						"orgId": orgId,
						"channel": channel,
						"perspective":perspectiveObj,
						"userId": commonDataService.getSessionStorage().userId,
						"isPlainText": commonDataService.getLocalStorage().p2Visibility == 1 ? true : false,
						"fetchFromArchive": $scope.isArchive
								
					}
				}
			}
			
			 if($scope.selectedCriteria == 'payerVpa'){
	    		   var config = {
	   					"searchMap" : {
	   						"payerVpa" : caseId,
	   						"channel" : channel
	   					},
	   					"userInformationDTO" : {
	   						"orgId" : orgId,
	   						"channel" : channel,
	   						"userId" : commonDataService.getSessionStorage().userId,
	   						"isPlainText" : commonDataService.getLocalStorage().p2Visibility == 1 ? true : false,
	   						"fetchFromArchive": $scope.isArchive
	   					}
	   				}
	    	   }
			 
			 if($scope.selectedCriteria == 'payeeVpa'){
	    		   var config = {
	   					"searchMap" : {
	   						"payeeVpa" : caseId,
	   						"channel" : channel
	   					},
	   					"userInformationDTO" : {
	   						"orgId" : orgId,
	   						"channel" : channel,
	   						"userId" : commonDataService.getSessionStorage().userId,
	   						"isPlainText" : commonDataService.getLocalStorage().p2Visibility == 1 ? true : false,
	   						"fetchFromArchive": $scope.isArchive
	   					}
	   				}
	    	   }

			if ($scope.selectedCriteria == 'transactionId') {
				var config = {
					"searchMap": {
						"transactionId": caseId,
						"channel": channel
					},
					"userInformationDTO": {
						"orgId": orgId,
						"channel": channel,
						"perspective":perspectiveObj,
						"userId": commonDataService.getSessionStorage().userId,
						"isPlainText": commonDataService.getLocalStorage().p2Visibility == 1 ? true : false,
						"fetchFromArchive": $scope.isArchive
					}
				}
			}

			if ($scope.selectedCriteria == 'mid') {
				var config = {
					"searchMap": {
						"mid": caseId,
						"channel": channel
					},
					"userInformationDTO": {
						"orgId": orgId,
						"channel": channel,
						"perspective":perspectiveObj,
						"userId": commonDataService.getSessionStorage().userId,
						"isPlainText": commonDataService.getLocalStorage().p2Visibility == 1 ? true : false,
						"fetchFromArchive": $scope.isArchive
					}
				}
			}

			if ($scope.selectedCriteria == 'cardNumber') {
				var config = {
					"searchMap": {
						"cardNumber": caseId,
						"channel": channel
					},
					"userInformationDTO": {
						"orgId": orgId,
						"channel": channel,
						"perspective":perspectiveObj,
						"userId": commonDataService.getSessionStorage().userId,
						"isPlainText": commonDataService.getLocalStorage().p2Visibility == 1 ? true : false,
						"fetchFromArchive": $scope.isArchive
					}
				}
			}

			if ($scope.selectedCriteria == 'mcc') {
				var config = {
					"searchMap": {
						"mcc": caseId,
						"channel": channel
					},
					"userInformationDTO": {
						"orgId": orgId,
						"channel": channel,
						"perspective":perspectiveObj,
						"userId": commonDataService.getSessionStorage().userId,
						"isPlainText": commonDataService.getLocalStorage().p2Visibility == 1 ? true : false,
						"fetchFromArchive": $scope.isArchive
					}
				}
			}

			if ($scope.selectedCriteria == 'rrn') {
				var config = {
					"searchMap": {
						"rrn": caseId,
						"channel": channel
					},
					"userInformationDTO": {
						"orgId": orgId,
						"channel": channel,
						"perspective":perspectiveObj,
						"userId": commonDataService.getSessionStorage().userId,
						"isPlainText": commonDataService.getLocalStorage().p2Visibility == 1 ? true : false,
						"fetchFromArchive": $scope.isArchive
					}
				}
			}

			if ($scope.selectedCriteria == 'remitterAccNumber') {
				var config = {
					"searchMap": {
						"remitterAccNumber": caseId,
						"channel": channel
					},
					"userInformationDTO": {
						"orgId": orgId,
						"channel": channel,
						"perspective":perspectiveObj,
						"userId": commonDataService.getSessionStorage().userId,
						"isPlainText": commonDataService.getLocalStorage().p2Visibility == 1 ? true : false,
						"fetchFromArchive": $scope.isArchive
					}
				}
			}

			if ($scope.selectedCriteria == 'beneficiaryAccNumber') {
				var config = {
					"searchMap": {
						"beneficiaryAccNumber": caseId,
						"channel": channel
					},
					"userInformationDTO": {
						"orgId": orgId,
						"channel": channel,
						"perspective":perspectiveObj,
						"userId": commonDataService.getSessionStorage().userId,
						"isPlainText": commonDataService.getLocalStorage().p2Visibility == 1 ? true : false,
						"fetchFromArchive": $scope.isArchive				
					}
				}
			}
			
			if ($scope.selectedCriteria == 'vehicleTagId') {
				var config = {
					"searchMap": {
						"vehicleTagId": caseId,
						"channel": channel
					},
					"userInformationDTO": {
						"orgId": orgId,
						"channel": channel,
						"perspective":perspectiveObj,
						"userId": commonDataService.getSessionStorage().userId,
						"isPlainText": commonDataService.getLocalStorage().p2Visibility == 1 ? true : false,
						"fetchFromArchive": $scope.isArchive				
					}
				}
			}
			
			if ($scope.selectedCriteria == 'vehicleDetailRegNo') {
				var config = {
					"searchMap": {
						"vehicleDetailRegNo": caseId,
						"channel": channel
					},
					"userInformationDTO": {
						"orgId": orgId,
						"channel": channel,
						"perspective":perspectiveObj,
						"userId": commonDataService.getSessionStorage().userId,
						"isPlainText": commonDataService.getLocalStorage().p2Visibility == 1 ? true : false,
						"fetchFromArchive": $scope.isArchive				
					}
				}
			}
			 if(config.userInformationDTO.channel == 'AEPS'){
				 config.userInformationDTO.isPlainText = false;
			 }
			 

				$scope.caseListCall = function(data){  
					
					$scope.caseList = data.response.data.filter(function (data) {
						if(data.caseId.startsWith("I")){
			          		 if(data.sourceChannel=='RuPayPos' || data.sourceChannel=='RuPayAtm' || data.sourceChannel=='AEPS' || data.sourceChannel == 'NETC'){
			          				
			          			  data.calculateRiskScore = data.issuerScore.riskScore;
			          			return true;
			          			}
			          		
			          	}
			          	 
						else if(data.caseId.startsWith("A")){
			          		 if(data.sourceChannel=='RuPayPos' || data.sourceChannel=='RuPayAtm' || data.sourceChannel=='AEPS' || data.sourceChannel == 'NETC'){
			          			  data.calculateScore = data.aquirerScore.riskScore;
			          			return true;
			          			}
			          		
			          	}
						else if(data.caseId.startsWith("B"))
			          	 {
			          			if(data.sourceChannel == 'IMPS' || data.sourceChannel == 'UPI'  ){
			          				 data.calculateRiskScore = data.beneficiaryScores.riskScore;
			          				return true;
			          			}
			          			
			          		}
						else if(data.caseId.startsWith("R"))
			          	  {
			          		  if(data.sourceChannel == 'IMPS' || data.sourceChannel == 'UPI')
			          		  {
			          		    data.calculateRiskScore = data.remitterScore.riskScore;
			          		  return true;
			          		  }
			          	  }
						else if(data.caseId.startsWith("M"))
			         	  {
			         		 
			         		    data.calculateRiskScore = data.npciRiskScore;
			         		    return true;
			         		  
			         	  }
			          	  //for AML 
			          	  else{
			          		   data.calculateRiskScore = data.finalRiskScore;
			          		return true;
			          	  }
					});
					
				}
				
				$scope.caseListwithArchive = function(data){
  
					
					$scope.caseListArchive = data.response.data.filter(function (data) {
						if(data.caseId.startsWith("I")){
			          		 if(data.sourceChannel=='RuPayPos' || data.sourceChannel=='RuPayAtm' || data.sourceChannel=='AEPS' || data.sourceChannel == 'NETC'){
			          				
			          			  data.calculateRiskScore = data.issuerScore.riskScore;
			          			return true;
			          			}
			          		
			          	}
			          	 
						else if(data.caseId.startsWith("A")){
			          		 if(data.sourceChannel=='RuPayPos' || data.sourceChannel=='RuPayAtm' || data.sourceChannel=='AEPS' || data.sourceChannel == 'NETC'){
			          			  data.calculateScore = data.aquirerScore.riskScore;
			          			return true;
			          			}
			          		
			          	}
						else if(data.caseId.startsWith("B"))
			          	 {
			          			if(data.sourceChannel == 'IMPS' || data.sourceChannel == 'UPI'){
			          				 data.calculateRiskScore = data.beneficiaryScores.riskScore;
			          				return true;
			          			}
			          			
			          		}
						else if(data.caseId.startsWith("R"))
			          	  {
			          		  if(data.sourceChannel == 'IMPS' || data.sourceChannel == 'UPI')
			          		  {
			          		    data.calculateRiskScore = data.remitterScore.riskScore;
			          		  return true;
			          		  }
			          	  }
						else if(data.caseId.startsWith("M"))
			         	  {
			         		 
			         		    data.calculateRiskScore = data.npciRiskScore;
			         		    return true;
			         		  
			         	  }
			          	  //for AML 
			          	  else{
			          		   data.calculateRiskScore = data.finalRiskScore;
			          		return true;
			          	  }
					});
					
				
				}

			  $scope.fetchWithoutArchive = function(){
            	$scope.isArchive = false;
            	config.userInformationDTO.fetchFromArchive = $scope.isArchive;
            	MyCases.header($scope.response.token).searchcase(config, function (data) {
    				$scope.caseList = data.response.data;
    				if(data.response.data != null){
    					$scope.caseListCall(data);
    				}
    				$scope.showDatatable = true;
    				
    			}, function (err) {
    				$scope.showDatatable = false;
    				$scope.count = "ALL";
    				$scope.selectedPage = "50";
    			});
			}
            $scope.fetchWithoutArchive();
			$scope.fetchWithArchive = function(){
				
					$scope.isArchive = true;
					config.userInformationDTO.fetchFromArchive = $scope.isArchive;
					MyCases.header($scope.response.token).searchcase(config, function (data) {
						
						if(data.response.data != null){
							$scope.caseListwithArchive(data);
						}
						$scope.showDatatable2 = true;
						
					}, function (err) {
						$scope.showDatatable2 = false;
						$scope.count = "ALL";
						$scope.selectedPage2 = "50";
					});
					
				
				
				
				
			}
			
			
			

		}
	}
        $scope.searchCaseByCaseId=function(caseId,channel,assignedTo,SelectedPerspective, isArchivedata,caseStatus){
        	archive.setArchive(isArchivedata) 
        	$scope.chkCaseStatus = caseStatus;
        	$scope.assignedTo = assignedTo;
            SearchCaseService.setSearchCase(caseId,orgId,channel,SelectedPerspective);
            localStorage.setItem("prev_path", "/dashboard/searchCases");
            //$state.go('dashboard.viewCase');
            $scope.autoCaseAssign();
        }
        
        $scope.getUsers = function(prespective){
        	casesManagement.header($scope.response.token).unCases_dropdown1(
        		 		{
        		 			loggedInOrgId:orgId,
        		 			selectedOrgId : $scope.selectedOrgId,
        		 			prespective:prespective
        		 			
        		 		},
        		 		function(response) {

        		 			$scope.userEmail = response.response;

        		 		},
        		 		function(err) {
        		 			
        		 		});
        }

		$scope.sort = function(keyname){
			$scope.sortKey = keyname;   //set the sortKey to the param passed
			$scope.reverse = !$scope.reverse; //if true make it false and vice versa
			if(keyname == 'creationTs'){
				$scope.creationTsSort = !$scope.creationTsSort;
			}

			if(keyname == 'caseId'){
				$scope.caseIdSort = !$scope.caseIdSort;
			}
			
			if(keyname == 'txnCount'){
				$scope.alertCountsort = !$scope.alertCountsort;
			}
			
			if(keyname == 'calculateRiskScore'){
				$scope.fraudScoreSort = !$scope.fraudScoreSort;
			}

		}

        $scope.chckRiskScore = function(data){

          	 if(data.caseId.startsWith("I")){
          		 if(data.sourceChannel=='RuPayPos' || data.sourceChannel=='RuPayAtm' || data.sourceChannel=='AEPS' || data.sourceChannel == 'NETC'){
          				
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
          			if(data.sourceChannel == 'IMPS' || data.sourceChannel == 'UPI'){
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
        
        $scope.autoCaseAssign = function(){
        	
        	var caseAssignedDto = {};
        	var userInformationDTO = {};
        	userInformationDTO.userId =  commonDataService.getSessionStorage().userId
        	userInformationDTO.orgId = commonDataService.getLocalStorage().orgId;
        	userInformationDTO.notes = "AUTO ASSIGN";
        	caseAssignedDto.assignedTo = commonDataService.getSessionStorage().userId
        	//caseAssignedDto.fetchFromArchive = archive.getArchive();
        	caseAssignedDto.caseId = SearchCaseService.getSearchCase().caseId;
        	caseAssignedDto.userInformationDTO = userInformationDTO;
        	var config = {};
        	$scope.userInformationDTO = {};
            config.caseId = SearchCaseService.getSearchCase().caseId;
            
            config.locked = true;
            $scope.userInformationDTO.orgId = commonDataService.getLocalStorage().orgId;
            $scope.userInformationDTO.userId = commonDataService.getSessionStorage().userId
            $scope.userInformationDTO.channel = SearchCaseService.getSearchCase().sourceChannel;
            //$scope.userInformationDTO.fetchFromArchive = archive.getArchive();
            config.userInformationDTO = $scope.userInformationDTO;
            if(($scope.assignedTo == null && $scope.chkAnalyist) ||($scope.assignedTo == $scope.userInformationDTO.userId && $scope.chkCaseStatus != 'LOCKED' && $scope.chkCaseStatus != 'AUTO_CLOSE' && $scope.chkCaseStatus != 'MANUAL_CLOSE' && $scope.chkCaseStatus != 'AUTO_EXPIRED')){
        	  if($scope.assignedTo == null && $scope.chkAnalyist){
            	casesManagement.header(localStorage.getItem("sessionToken")).assignCases(
        			{},caseAssignedDto,
        			function(data) {
        				toastr.success("Case Assigned Successfully", Msg.hurrah);
        				$scope.message='';
        				casesManagement.header({}).editLock({caseId:null},config, function (data) {
        					if(data.response.status == "SUCCESS")
        					{
								var config = {};

								config.caseId = SearchCaseService.getSearchCase().caseId;
								config.hold = true;
								$scope.userInformationDTO.orgId = commonDataService.getLocalStorage().orgId;
								$scope.userInformationDTO.userId = commonDataService.getSessionStorage().userId;
								$scope.userInformationDTO.channel = SearchCaseService.getSearchCase().sourceChannel;
								$scope.userInformationDTO.notes ='Case Hold';
								config.userInformationDTO = $scope.userInformationDTO;
								casesManagement
									.header({})
									.editHold(
										config,
										function(data) {
											$state.go('dashboard.viewCase');
										},
										function(err) {

										});
        						

        							
        					
        					}
        	            }, function (err) {

        	            });
        			},
        			function(err) {

        				
        			});
              }if($scope.assignedTo == $scope.userInformationDTO.userId && $scope.chkCaseStatus != 'LOCKED' && $scope.chkCaseStatus != 'AUTO_CLOSE' && $scope.chkCaseStatus != 'MANUAL_CLOSE' && $scope.chkCaseStatus != 'AUTO_EXPIRED'){
            	  casesManagement.header({}).editLock({caseId:null},config, function (data) {
  					if(data.response.status == "SUCCESS")
  					{
							var config = {};

							config.caseId = SearchCaseService.getSearchCase().caseId;
							config.hold = true;
							$scope.userInformationDTO.orgId = commonDataService.getLocalStorage().orgId;
							$scope.userInformationDTO.userId = commonDataService.getSessionStorage().userId;
							$scope.userInformationDTO.channel = SearchCaseService.getSearchCase().sourceChannel;
							$scope.userInformationDTO.notes ='Case Hold';
							config.userInformationDTO = $scope.userInformationDTO;
							casesManagement
								.header({})
								.editHold(
									config,
									function(data) {
										if(data.response.status == "SUCCESS"){
										$state.go('dashboard.viewCase');
										}
									},
									function(err) {

									});
  						

  							
  					
  					}
  	            })
              }
            }
           /* if($scope.assignedTo != null || !$scope.chkAnalyist){
            	console.log("Inside View")
        	$state.go('dashboard.viewCase');
            }*/else{
            	$state.go('dashboard.viewCase');
            }
        	
        }
       
        
        $scope.setFlag = function(){
        	$scope.msg_flag = false;
        } 
        
        $scope.assign = function(caseID,caseStatus) {
        	if($scope.selectedOrgId.includes("%")){
        		$scope.selectedOrgId = caseID.substring(1, 4);
        	}
        	if(checkOrgId == '%'){
        		$scope.selectedOrgId = caseID.substring(1, 4);
        	}
        	var getMyPrespective = commonDataService.getPrespective(caseID);
        	$scope.getUsers(getMyPrespective);
        	$scope.usermodel = null;
        	$scope.message = null;
        	 $scope.msg_flag = false;
            $ngConfirm({
        				title : 'Assign Case',
        				theme : 'Material',
        				icon : 'fa fa-check',
        				content: '<span class="alert_text">Please select the Email Id:</span><select class="cases_status"  ng-model="usermodel" ng-dropdown  ng-options="option.email for option in userEmail track by option.userId" ng-change="setFlag()"><option style="display:none" value="" selected>-- choose an option --</option></select><span  class="error_user_msg" ng-if="msg_flag">Please select a user</span>',
        				scope : $scope,
        							buttons : {
        								Ok : {
        									text : 'Assign',
        									btnClass : 'btn-red',
        									action : function(
        											scope,
        											button) {
        									
        										 if($scope.usermodel == null){
        											 if($scope.usermodel == null){
        												    $scope.msg_flag = true;
        												  }  
        												  return false;
        												  
        									        }
        										
        										 else{
        									        	$scope.msg_flag = false;
        									        	if(!(caseStatus =='MANUAL_CREATE' || caseStatus =='AUTO_CREATED')){
        									        	$scope.userInformationDTO = JSON.stringify({
        													userInformationDTO: {
        														 userId : commonDataService.getSessionStorage().userId ,
        													     orgId : orgId, 
        													     reassign : true
        													  },
        													  caseId :caseID, 
        													  assignedTo: $scope.usermodel.userId,
        													}
        													);
        									        	}else{
        									        		$scope.userInformationDTO = JSON.stringify({
            													userInformationDTO: {
            														 userId : commonDataService.getSessionStorage().userId ,
            													     orgId : orgId, 
            													   
            													  },
            													  caseId :caseID, 
            													  assignedTo: $scope.usermodel.userId,
            													}
            													);
        									        	}
        									            casesManagement.header(localStorage.getItem("sessionToken")).assignCases(
        														{},$scope.userInformationDTO,
        														function(data) {
        															 $scope.searchAllCase($scope.caseId,$scope.selectedChannel);	
        															$scope.usermodel = null;
        															toastr.success("Case Assigned Successfully", Msg.hurrah);
        														},
        														function(err) {

        															
        														});
        									        	
        									        }
        										
        										
        									}
        								},
        								
        								Cancel : {
        									text : 'Cancel',
        									action : function(
        											scope,
        											button) {
        										$scope.usermodel = null;
        										//$scope.message = null;
        									}
        								},
        								
        								 
        							}
        							  
        							
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
        
        $scope.changeCriteria = function(){    	
        	$scope.showArchiveBtn = false;
        	$scope.caseId = null;
        	$scope.disabledValue = false;
        }
        
        $scope.changeChanel = function(){
        	$scope.someObject.msgFlg = false;
        	$scope.showArchiveBtn = false;
        	$scope.selectedCriteria = null
        	$scope.caseId = null;
        	$scope.maxNo = null;	
			$scope.minNo = null;
			$scope.pattern = null;
			$scope.prespectiveDisabled = false;
			$scope.disabledSearchCriteria = false;
			if($scope.selectedChannel == 'IMPS'){
			 
			 $scope.searchCriterias =[
				 	{ name:"CASE ID",value:"caseId"},
				 	{ name:"PAN",value:"cardNumber"},
				 	{ name:"RRN",value:"rrn"},       	
		        	{ name:"MCC",value:"mcc"},
		        	{ name:"REMITTER ACCOUNT NUMBER",value:"remitterAccNumber"},
		        	{ name:"BENEFICIARY ACCOUNT NUMBER",value:"beneficiaryAccNumber"}
		        ]
			}else if($scope.selectedChannel == 'UPI'){
				 
				 $scope.searchCriterias =[
			        	{ name:"CASE ID",value:"caseId"},
			        	{ name:"PAN",value:"cardNumber"},
			        	{ name:"RRN",value:"rrn"},
			        	{ name:"MCC",value:"mcc"},
			        	{ name:"Payer VPA",value:"payerVpa"},
			        	{ name:"Payee VPA",value:"payeeVpa"}
			        ]
			}else if($scope.selectedChannel == 'NETC'){
				
					$scope.searchCriterias =[
			        	{ name:"CASE ID",value:"caseId"},
			        	{ name:"Vehicle Tag Id",value:"vehicleTagId"},
			        	{ name:"Vehicle Registration Number",value:"vehicleDetailRegNo"}
			        ]
				
			}else if($scope.selectedChannel == 'RuPayAtm' || $scope.selectedChannel == 'RuPayPos' || $scope.selectedChannel == 'AEPS'){
				 $scope.searchCriterias =[
			        	{ name:"CASE ID",value:"caseId"},
			        	{ name:"PAN",value:"cardNumber"},
			        	{ name:"RRN",value:"rrn"},
			        	{ name:"MCC",value:"mcc"},
			        	{ name:"MID",value:"mid"}
			        ]
			}
			
			
        }
        $scope.validateSearchInput = function(){
        	if( $scope.valueForValidation == 'caseId'){
        		if($scope.selectedChannel == 'UPI' && $scope.caseId){
            		$scope.input_length = 14;
            		check_string($scope.caseId, $scope.input_length)
            	}
            	if($scope.selectedChannel == 'IMPS' && $scope.caseId){
            		$scope.input_length = 14;
            		check_string($scope.caseId, $scope.input_length)
            	}
            	if($scope.selectedChannel == 'NETC' && $scope.caseId){
            		$scope.input_length = 14;
            		check_string($scope.caseId, $scope.input_length)
            	}
            	if($scope.selectedChannel == 'RuPayAtm' && $scope.caseId){
            		$scope.input_length = 13;
            		check_string($scope.caseId, $scope.input_length)
            	} 
    	        if($scope.selectedChannel == 'RuPayPos' && $scope.caseId){
    	        	$scope.input_length = 13;
    	        	check_string($scope.caseId, $scope.input_length)
    	        }
    	        if($scope.selectedChannel == 'AEPS' && $scope.caseId){
    	        	$scope.input_length = 14;
    	        	check_string($scope.caseId, $scope.input_length)
    	        }
    	        if(!$scope.caseId){
    	        	$scope.someObject.msgFlg = false;
    	        }
        		
        	}
        		   
        }
        
        function check_string(value, length)
        {
		    $scope.someObject.msgFlg = false;
		    let index = value.indexOf("%");
		    //alert(index);
		    if(index == -1){
		    	
		       $scope.someObject.msgFlg = false;
		    }
		    if(index == 0){
		       
		       $scope.someObject.msgFlg = true;
		    }
		    if(index > 0 && index < length){
		    	
		       $scope.someObject.msgFlg = true;
		       
		    }
        
        }  
        
        //localStorage.getItem("prev_path_view") == '/dashboard/viewCases';
       
        if(localStorage.getItem("prev_path_view") == '/dashboard/viewCases'){
        	$scope.selectedChannel =  sessionStorage.getItem("searchCaseChannel");
        	$scope.selectedCriteria =  sessionStorage.getItem("searchCaseCriteria");
        	$scope.caseId =  sessionStorage.getItem("searchCaseValue");
        	$scope.SelectedPerspective=sessionStorage.getItem("perspective");
        	$scope.prespectiveDisabled = false;
        	$scope.disabledSearchCriteria = false;
        	$scope.disabledValue = false;
        	if($scope.selectedChannel == 'IMPS'){
   			 $scope.searchCriterias =[
   				 	{ name:"CASE ID",value:"caseId"},
   				 	{ name:"PAN",value:"cardNumber"},
   				 	{ name:"RRN",value:"rrn"},       	
   		        	{ name:"MCC",value:"mcc"},
   		        	{ name:"REMITTER ACCOUNT NUMBER",value:"remitterAccNumber"},
   		        	{ name:"BENEFICIARY ACCOUNT NUMBER",value:"beneficiaryAccNumber"}
   		        ]
   			}else if($scope.selectedChannel == 'UPI'){
   				 $scope.searchCriterias =[
   			        	{ name:"CASE ID",value:"caseId"},
   			        	{ name:"PAN",value:"cardNumber"},
   			        	{ name:"RRN",value:"rrn"},
   			        	{ name:"MCC",value:"mcc"},
   			        	{ name:"Payer VPA",value:"payerVpa"},
   			        	{ name:"Payee VPA",value:"payeeVpa"}
   			        ]
   			}else if($scope.selectedChannel == 'NETC'){
   				
   					$scope.searchCriterias =[
   			        	{ name:"CASE ID",value:"caseId"},
   			        	{ name:"Vehicle Tag Id",value:"vehicleTagId"},
   			        	{ name:"Vehicle Registration Number",value:"vehicleDetailRegNo"}
   			        ]
   				
   			}else if($scope.selectedChannel == 'RuPayAtm' || $scope.selectedChannel == 'RuPayPos' || $scope.selectedChannel == 'AEPS'){
   				 $scope.searchCriterias =[
   			        	{ name:"CASE ID",value:"caseId"},
   			        	{ name:"PAN",value:"cardNumber"},
   			        	{ name:"RRN",value:"rrn"},
   			        	{ name:"MCC",value:"mcc"},
   			        	{ name:"MID",value:"mid"}
   			        ]
   			}
        	$scope.searchAllCase($scope.caseId,$scope.selectedChannel,$scope.SelectedPerspective);
        }
        
        $scope.chckValidation = function(selectedValue){
          $scope.someObject.msgFlg = false;
      	  $scope.valueForValidation = selectedValue
      	
      	 
      	  if(typeof selectedValue != "undefined"){
      		 
      		  $scope.isEntitySelected = false;
      		   if(selectedValue == 'mcc' ){
      				$scope.maxNo = 4;	
      				$scope.minNo = 4;
      				$scope.pattern = "^[0-9]*$"
      				$scope.isMobile = false;
      			}
      		   
      		 if(selectedValue == 'rrn'){
 				
 				$scope.maxNo = 100000000000;
 				$scope.minNo = null;
 				$scope.pattern = "^[0-9]*$";
 				$scope.isMobile = false;
 			}
      			
      			if(selectedValue == 'remitterAccNumber' || selectedValue == 'beneficiaryAccNumber'){
      				
      				$scope.maxNo = 1000;	
      				$scope.minNo = null;
      				$scope.pattern = "^[0-9]*$"
      				$scope.isMobile = false;
      			}
      			
      			if(selectedValue == 'cardNumber'){
      				
      				$scope.maxNo = 19;	
      				$scope.minNo = 14;
      				$scope.pattern = "^[0-9]*$"
      				$scope.isMobile = false;
      			}
      			
      			
      			/*if(selectedAttribute == 'assignedTo'){
      				
      				$scope.maxNo = 1000;	
      				$scope.pattern = "/^[_a-zA-Z0-9]+(\.[_a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,4}),$/"
      			}*/
      			if(selectedValue == 'caseId' || selectedValue == 'transactionId' ){
      				$scope.maxNo = 100;
      				$scope.minNo = null;
      				
      				$scope.pattern = null
      				$scope.isMobile = false;
      				
      			}
      			
      			
      			/*if(selectedValue =='payerVpa' || selectedValue == 'payeeVpa'){
      				$scope.maxNo = 100;
      				$scope.minNo = null;
      				$scope.pattern = "^[0-9a-zA-Z.-]*[@][a-zA-Z]*$";
      				$scope.isMobile = false;
      			}*/
      			if(selectedValue == 'mid'){
      				$scope.maxNo = 15
      				$scope.minNo = 15;
      				$scope.pattern = "^[0-9a-zA-Z]*$";
      				$scope.isMobile = false;
      			}
      			
      	  	 }
      	  }
        
        $scope.prespectiveDisplay = function(prespective){
        	var str = prespective;
        	if(prespective == "ACQUIRER" && ($scope.selectedChannel == "UPI" || $scope.selectedChannel == "IMPS" )){
        		return str = "BENEFICIARY"
        	}else if(prespective == "ISSUER" && ($scope.selectedChannel == "UPI" || $scope.selectedChannel == "IMPS")){
        		return str = "REMITTER"
        	}else{
        		return str;
        	}
        	
        }
        
        $scope.init = function(){
            UserService.header({}).session({}, function(data){}, function(err){});
            $scope.loadChannel();
            }
        $scope.init();
    }])