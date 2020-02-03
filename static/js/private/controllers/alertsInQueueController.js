'use strict';

angular.module('efrm.dashboard')
.controller('alertsInQueueController',  ['$scope', '$state','statusService','UserService','casesManagement','$location','SearchCaseService','QueueService','AlertDataService','MyAlerts','casesManagement2','$ngConfirm','toastr','Msg','commonDataService',  function($scope, $state,statusService,UserService,casesManagement,$location,SearchCaseService,QueueService,AlertDataService,MyAlerts,casesManagement2,$ngConfirm,toastr,Msg,commonDataService) {

	$scope.assignQueueList =[];
	$scope.creationTsSort = true;
	$scope.txnCountSort = true;
	$scope.risk_scoreSort = true;
	$scope.showme = false;
	$scope.isEmpty = false;
	$scope.isShow = false;
	$scope.organisationDisabled = false;
	$scope.prespevtiveMsg = false;
	$scope.SelectedPerspective_val = '';
	$scope.selectedChannel='';
	/*$scope.channelmsg=false;
	$scope.orgMsg=false;*/
	$scope.userEmail = [];
	$scope.perspectiveArray=[];
	$scope.totalItems = 0;
	$scope.myPageNumber = 0;
	$scope.selectedPage = "50"
	$scope.response = statusService.getResponseMessage();
	$scope.comesPrevPath = false;
	var isAnalyist = $scope.response.usersAuthoritiesPermissionsDto.authority;
	
	if(isAnalyist.includes('ANALYSTS')){
		$scope.chkAnalyist = true;
	}else{
		$scope.chkAnalyist = false;
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
    var orgId = commonDataService.getLocalStorage().orgId;
    var perspective=commonDataService.getLocalStorage().perspective;
   // $scope.count = "ALL";
    $scope.count = 50;
    $scope.selectedPage = "50";
    $scope.userId = commonDataService.getSessionStorage().userId;
	$scope.selectedQueue="";
    if(commonDataService.getLocalStorage().p2Visibility == 1){
    	$scope.p2Visibility = true
    }
    if(commonDataService.getLocalStorage().p2Visibility == 0){
    	$scope.p2Visibility = false;
    }
    $scope.isqueueDetailsEmpty = false;
    
    $scope.searchCategory=[
        { type: 'Case ID',  value: 'caseId' }
    ];
    $scope.sarchSelected=function(value){
        $scope.searchBy=value;
    }
    $scope.perspectiveArray=perspective.split(",");
    if($scope.perspectiveArray[0]=='undefined'){
        $scope.perspectiveArray=[];
        //$scope.desableme=true;
        //$scope.noPersMsg='No Perspective Is Present'
    }

    
	/*if($scope.perspectiveArray.length==1){
		$scope.SelectedPerspective=$scope.perspectiveArray[0];
		$scope.SelectedPerspective_val = $scope.SelectedPerspective;
		$scope.desableme=true;
	}*/
	if ($scope.perspectiveArray.length == 1) {
		$scope.SelectedPerspective = $scope.perspectiveArray[0];
		$scope.SelectedPerspective_val = $scope.SelectedPerspective;
		$scope.desableme=true;
	}else if($scope.perspectiveArray.length>1){
		$scope.desableme = false;
		if($scope.perspectiveArray[0]=='ISSUER'){
			$scope.SelectedPerspective = $scope.perspectiveArray[0];
			$scope.SelectedPerspective_val = $scope.SelectedPerspective;
		}else if($scope.perspectiveArray[1]=='ISSUER'){
			$scope.SelectedPerspective = $scope.perspectiveArray[1];
			$scope.SelectedPerspective_val = $scope.SelectedPerspective;
		}

	}
	$scope.shoWPres = false;
    var organisationName  = function(){
    	casesManagement.header().organisations( 
				{ 
					
					organisationID : orgId,
					selectedOrgId:null
				},
				function(response) {
					
	                         $scope.orgarnisations = response.response;
	                         isNpciLogin($scope.orgarnisations);
	                         
					},
				function(err) {
				});
    }

    $scope.changedValueForOrganisation = function(selectedOrgId){
		$scope.selectedOrgId = selectedOrgId;
		if($scope.chkselectedOrgid != selectedOrgId){
			
			$scope.comesPrevPath = false;
		}
		if($scope.comesPrevPath == false){
			
			 $scope.selectedPage = "50"
		     $scope.currentPage = 1;
			 $scope.count = "50";
			 $scope.myPageNumber = 0;
		}
		//Last Changes//
		$scope.queueDetails = [];
		//Last Changes End//
		if($scope.selectedOrgId!='' && $scope.selectedChannel!=''&&
		!angular.isUndefined($scope.selectedOrgId)&& !angular.isUndefined($scope.selectedChannel)){
				/*casesManagement.header($scope.response.token).unCases_dropdown(
					{
						loggedInOrgId:orgId,
						selectedOrgId : $scope.selectedOrgId

					},
					function(response) {

						$scope.userEmail = response.response;

					},
					function(err) {

					});*/
			$scope.isShow = true;
			//$scope.channelMsg=false;
			//$scope.orgMsg=false;
			$scope.selectedQueue='';
			$scope.searchBy='';
			$scope.getAssignQueueList();

		}else{

			$scope.isEmpty = false;
			$scope.assignQueueList = [];
		}
	}

	function loadChannel(){
		casesManagement2.header($scope.response.token).channel( {},
			function(response) {
				$scope.channel_code = response.response;
			},
			function(err) {

			});
	}

    $scope.changeChannel=function(selectedChannel){
		$scope.selectedChannel=selectedChannel;
		if($scope.chkselectedChannel != selectedChannel){
			
			$scope.comesPrevPath = false;
		}
		if($scope.comesPrevPath == false){
			 $scope.selectedPage = "50"
		     $scope.currentPage = 1;
			 $scope.count = "50";
			 $scope.myPageNumber = 0;
		}
		if($scope.selectedOrgId!='' && $scope.selectedChannel!=''&&
			!angular.isUndefined($scope.selectedOrgId) && !angular.isUndefined($scope.selectedChannel) ){
				$scope.isqueueDetailsEmpty = false;
				$scope.isEmpty = false;
				/*casesManagement.header($scope.response.token).unCases_dropdown(
					{
						loggedInOrgId:orgId,
						selectedOrgId : $scope.selectedOrgId

					},
					function(response) {

						$scope.userEmail = response.response;

					},
					function(err) {

					});*/

			$scope.getAssignQueueList();
			$scope.isShow = true;
			/*$scope.channelMsg=false;
			$scope.orgMsg=false;*/
			$scope.selectedQueue='';
			$scope.searchBy='';
		}else{
			
			$scope.isqueueDetailsEmpty = false;
			$scope.isEmpty = false;
			$scope.assignQueueList = [];
		}
	}
    
    $scope.setPrespective = function(SelectedPerspective){
    	if($scope.chkSelectedPerspective != SelectedPerspective){
			
			$scope.comesPrevPath = false;
		}
    	if($scope.comesPrevPath == false){
			 $scope.selectedPage = "50"
		     $scope.currentPage = 1;
			 $scope.count = "50";
			 $scope.myPageNumber = 0;
		}
    	if(SelectedPerspective == undefined){
    		$scope.prespevtiveMsg = true;
    	}else{

			$scope.SelectedPerspective_val =SelectedPerspective;
	    	/*if(SelectedPerspective == "ISSUER"){
	    		$scope.SelectedPerspective_val = "I"
	    	}
	    	if(SelectedPerspective == "ACQUIRER"){
	    	$scope.SelectedPerspective_val = "A";
	    	}
	    	if(SelectedPerspective == "AML"){
		    	$scope.SelectedPerspective_val = "M";
		    }*/
	    	if($scope.selectedOrgid != "" || $scope.selectedOrgid != undefined || $scope.selectedChannel != "" || $scope.selectedChannel != undefined || 
	    			$scope.SelectedPerspective != undefined || $scope.SelectedPerspective != null || $scope.selectedQueue != undefined || $scope.selectedQueue != null){
	    		$scope.changedValue($scope.selectedQueue)
	    	}
    	}
    }

    
    $scope.getAssignQueueList = function(){
		$scope.assignQueueList = [];
		QueueService.header($scope.response.token).assignQueue({email:$scope.userId,selectedOrgId:$scope.selectedOrgId,channel:$scope.selectedChannel,flag:1},function(data) {
        	$scope.assignQueueList = data.response.data;
        	if($scope.assignQueueList.length === 0 ||  $scope.assignQueueList == undefined){
        		$scope.isEmpty = false;
        		$scope.assignQueueList = [];
        	}else{
        		$scope.isEmpty = true;
        	}
        },function(err){
        	$scope.isEmpty = false;
        	$scope.assignQueueList = [];
        });	
	}
    
    var isNpciLogin = function(organisation){
		if(orgId !="NPCI"){
			//$scope.selectedOrgid = orgId;
			$scope.selectedOrgid = organisation[0].orgId;
			$scope.organisationDisabled = true;
			$scope.changedValueForOrganisation($scope.selectedOrgid);
		}else{
			$scope.organisationDisabled = false;
		}
	}
	
	/*$scope.changePrevPath = function(){
		
	}*/
	
    $scope.changedValue = function(selectedQueue){
    	
    	if($scope.SelectedPerspective_val == '' || selectedQueue==null){
			if($scope.SelectedPerspective_val == ''){
				$scope.prespevtiveMsg = true
			}
    	}else{
    		
    		
    		$scope.prespevtiveMsg = false;
		$scope.selectedQueue=selectedQueue;
    	$scope.channelMsg=true;
    	var perspectiveObj = "";
    	$scope.orgMsg=true;
			/*if($scope.SelectedPerspective_val == "ISSUER"){
				perpectiveObj = "I"
			}
			if($scope.SelectedPerspective_val == "ACQUIRER"){
				perpectiveObj = "A";
			}
			if($scope.SelectedPerspective_val == "AML"){
				perpectiveObj = "M";
			}*/
    	
			$scope.selectedQueueId = selectedQueue;
				$scope.queueDetails = [];

				if(selectedQueue == ""){
					$scope.isqueueDetailsEmpty = false;
				}
				if(selectedQueue != ""){
					$scope.isqueueDetailsEmpty = true;
					$scope.selectedQueueDto = {}
					$scope.userInformationDTO = {}
					$scope.selectedQueueDto.queueCode = selectedQueue;
					if(orgId == "NPCI"){
					$scope.selectedQueueDto.orgId = $scope.selectedOrgId;
					}else{
						$scope.selectedQueueDto.orgId = orgId;
					}
					$scope.userInformationDTO.orgId = orgId;
					$scope.userInformationDTO.userId = $scope.userId;
					
					$scope.userInformationDTO.channel=$scope.selectedChannel;
					
					if($scope.userInformationDTO.channel=='AEPS'){
						$scope.userInformationDTO.isPlainText = false;
					}else{
						$scope.userInformationDTO.isPlainText = $scope.p2Visibility;
					}
					
					if ($scope.userInformationDTO.channel=='IMPS'||$scope.userInformationDTO.channel=='UPI') {
						   if($scope.SelectedPerspective_val == "ISSUER"){
						      perspectiveObj = "R"
						   }
						   if ($scope.SelectedPerspective_val == "ACQUIRER") {
						      perspectiveObj = "B";
						   }
						   if ($scope.SelectedPerspective_val == "AML") {
						      perspectiveObj = "M";
						   }

						}
						if ($scope.userInformationDTO.channel=='RuPayPos'||$scope.userInformationDTO.channel=='RuPayAtm'||$scope.userInformationDTO.channel=='AEPS' || $scope.userInformationDTO.channel=='NETC') {
						   if($scope.SelectedPerspective_val == "ISSUER"){
						      perspectiveObj = "I"
						   }
						   if ($scope.SelectedPerspective_val == "ACQUIRER") {
						      perspectiveObj = "A";
						   }
						   if ($scope.SelectedPerspective_val == "AML") {
						      perspectiveObj = "M";
						   }

						}
						
						if($scope.chkselectedQueue != selectedQueue){
							
							$scope.comesPrevPath = false;
						}
						if($scope.comesPrevPath == false){
							 $scope.selectedPage = "50"
						     $scope.currentPage = 1;
							 $scope.count = "50";
							 $scope.myPageNumber = 0;
							 $scope.inChangePage = true;
						}
					$scope.userInformationDTO.perspective = perspectiveObj;
					$scope.selectedQueueDto.userInformationDTO = $scope.userInformationDTO;
					QueueService.header($scope.response.token).alertInQueue({queueCode:null,count:$scope.count,selectedOrgId:null,pageNumber:$scope.myPageNumber},$scope.selectedQueueDto,function(response) {
						$scope.inChangePage = false;
						$scope.queueDetails = response.response.data;
						$scope.totalItems = response.response.count;
						if($scope.queueDetails.length == 0 ||  $scope.queueDetails == undefined){
							//$scope.isqueueDetailsEmpty = false;
							$scope.showme = false;
							$scope.totalItems = response.response.count;
							$scope.queueDetails = [];
						}else{
							$scope.showme = true
							$scope.isqueueDetailsEmpty = true;
						}

					},function(err){
						$scope.totalItems = response.response.count;
						$scope.showme = false;
						//$scope.count = "ALL";
						$scope.count = 50;
					    $scope.selectedPage = "50";
						$scope.queueDetails = [];
					});
				}
    		}
		}
    
    $scope.sort = function(keyname){
    	$scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
        
        if(keyname == 'alert.creationTs'){
        	 $scope.creationTsSort = !$scope.creationTsSort;
         }
        if(keyname == 'caseSearchDetail.txnCount'){
       	 $scope.txnCountSort = !$scope.txnCountSort;
        }
        if(keyname == 'caseSearchDetail.finalRiskScore'){
          	 $scope.risk_scoreSort = !$scope.risk_scoreSort;
        }
       
    }
    $scope.setFlag = function(){
    	$scope.msg_flag = false;
    } 
    $scope.getUserList = function(prespective){
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
    
    $scope.assign = function(alertId,caseId) {
    	var getMyPrespective = commonDataService.getPrespective(caseId);
    	$scope.usermodel = null;
    	$scope.getUserList(getMyPrespective)
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
    											    $scope.msg_flag = true;
    									        	return false;
    									        	
    									             
    									        }
    										
    										 else{
    									        	$scope.msg_flag = false;
    									        	$scope.userInformationDTO = JSON.stringify({
    													userInformationDTO: {
    														 userId : $scope.userId,
    													     orgId : commonDataService.getLocalStorage().orgId, 
    													  },
    													  caseId :caseId, 
    													  alertId:alertId,
    													  assignedTo: $scope.usermodel.userId,
    													}
    													);
    									        	
    									            casesManagement.header($scope.response.token).assignAlerts(
    														{},$scope.userInformationDTO,
    														function(data) {
    															$scope.getQueueList();	
    															$scope.usermodel = null;
    															toastr.success("Case Assigned Successfully", Msg.hurrah);
    															$scope.message='';
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
    										$scope.message = '';
    									}
    								},
    								
    								 
    							}
	
    						});					
    }

    
    $scope.showData=function(caseId,sourceChannel,assignedTo){
        localStorage.setItem("prev_path", "/dashboard/alertsInQueue");
        $scope.assignedTo = assignedTo;
        $scope.sourceChannel_data = sourceChannel;
        $scope.config = {};
		$scope.userInformationDTO = {};
		$scope.config.caseId = caseId;
		$scope.config.locked = true;
        $scope.userInformationDTO.orgId = commonDataService.getLocalStorage().orgId;
        $scope.userInformationDTO.userId = commonDataService.getSessionStorage().userId;
        $scope.userInformationDTO.channel = sourceChannel;
        $scope.config.userInformationDTO = $scope.userInformationDTO;
        SearchCaseService.setSearchCase(caseId,orgId,sourceChannel);
        $scope.autoAlertAssign();	
   
    }
    
    
    $scope.autoAlertAssign = function(){
    	var caseAssignedDto = {};
    	var userInformationDTO = {};
    	userInformationDTO.userId =  commonDataService.getSessionStorage().userId;
    	userInformationDTO.orgId = commonDataService.getLocalStorage().orgId;
    	userInformationDTO.notes = "AUTO ASSIGN";
    	caseAssignedDto.assignedTo = commonDataService.getSessionStorage().userId;
    	caseAssignedDto.caseId = SearchCaseService.getSearchCase().caseId;
    	caseAssignedDto.userInformationDTO = userInformationDTO;
    	//Changes For Back Button//
    	localStorage.setItem("alertsInQueueOrgId",$scope.selectedOrgId);
    	localStorage.setItem("alertsInQueueChannel",$scope.selectedChannel);
    	localStorage.setItem("alertsInQueuePrespective",$scope.SelectedPerspective_val);
    	localStorage.setItem("alertsInQueueSelectedOrgId",$scope.selectedQueue);
		localStorage.setItem("alertSearchBy",$scope.searchBy);
		localStorage.setItem("currentPageForAlert",$scope.currentPage);
		localStorage.setItem("PageNoForAlert",$scope.myPageNumber);
		localStorage.setItem("CountForAlert",$scope.selectedPage);
    	//Changes For Back Button End Here//
    	
    	var config = {};
    	$scope.userInformationDTO = {};
        config.caseId = SearchCaseService.getSearchCase().caseId;
        
        config.locked = true;
        $scope.userInformationDTO.orgId = commonDataService.getLocalStorage().orgId;
        $scope.userInformationDTO.userId = commonDataService.getSessionStorage().userId;
        $scope.userInformationDTO.channel = SearchCaseService.getSearchCase().sourceChannel;
        config.userInformationDTO = $scope.userInformationDTO;
        if($scope.assignedTo == null && $scope.chkAnalyist){
    	casesManagement.header($scope.response.token).assignCases(
    			{},caseAssignedDto,
    			function(data) {
    				toastr.success("Case Assigned Successfully", Msg.hurrah);
    				$scope.message='';
    				casesManagement.header({}).editLock({caseId:null},config, function (data) {
    					if(data.response.status == "SUCCESS"){
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
    					}
    	            }, function (err) {

    	            });
    			},
    			function(err) {

    				
    			});
        }
        if($scope.assignedTo != null || !$scope.chkAnalyist){
    	$state.go('dashboard.viewCase');
        }
   	
    }
    
    $scope.getQueueList = function(){
    	var perspectiveObj = "";
    	
    	
    	if ($scope.selectedQueueDto.userInformationDTO.channel=='IMPS'||$scope.selectedQueueDto.userInformationDTO.channel=='UPI') {
			   if($scope.SelectedPerspective_val == "ISSUER"){
			      perspectiveObj = "R"
			   }
			   if ($scope.SelectedPerspective_val == "ACQUIRER") {
			      perspectiveObj = "B";
			   }
			   if ($scope.SelectedPerspective_val == "AML") {
			      perspectiveObj = "M";
			   }

			}
			if ($scope.selectedQueueDto.userInformationDTO.channel == 'RuPayPos' || $scope.selectedQueueDto.userInformationDTO.channel == 'RuPayAtm' || $scope.selectedQueueDto.userInformationDTO.channel == 'AEPS' || $scope.selectedQueueDto.userInformationDTO.channel=='NETC') {
				if($scope.SelectedPerspective_val == "ISSUER"){
			      perspectiveObj = "I"
			   }
				if ($scope.SelectedPerspective_val == "ACQUIRER") {
			      perspectiveObj = "A";
			   }
			   if ($scope.SelectedPerspective_val == "AML") {
			      perspectiveObj = "M";
			   }

			}
		//$scope.userInformationDTO.perspective = perpectiveObj;
			
    	$scope.selectedQueueDto.userInformationDTO.perspective = perspectiveObj;
    	var pageNumber = ($scope.currentPage - 1)*$scope.selectedPage;
    	//$scope.queueDetails = [];
		QueueService.header($scope.response.token).alertInQueue({queueCode:null,count:$scope.selectedPage,selectedOrgId:null,pageNumber:pageNumber},$scope.selectedQueueDto,function(response) {
					
		        	$scope.queueDetails = response.response.data;
		        	$scope.totalItems = response.response.count;
		        	if($scope.queueDetails.length == 0 ||  $scope.queueDetails == undefined){
		        		//$scope.isqueueDetailsEmpty = false;
		        		$scope.showme = false;
		        		
		        		$scope.queueDetails = [];
		        	}else{
		        		$scope.showme = true
		        		$scope.isqueueDetailsEmpty = true;
		        	}
		        	
		        },function(err){
		        	$scope.showme = false;
		        	$scope.queueDetails = [];
		        });
    }
    
    $scope.changePageSize = function(data){
    	
    	$scope.count = 50;
    	$scope.selectedPage = data;
    	$scope.inChangePage = true;
    	$scope.myPageNumber = 0;
    	$scope.currentPage = 1;
    	//$scope.chckCurrentPage = 1;
    	 //$scope.changedValue($scope.selectedQueueId);
    	QueueService.header($scope.response.token).alertInQueue({queueCode:null,count:$scope.selectedPage,selectedOrgId:null,pageNumber:$scope.myPageNumber},$scope.selectedQueueDto,function(response) {
    		$scope.inChangePage = false;
			$scope.queueDetails = response.response.data;
			$scope.totalItems = response.response.count;
			if($scope.queueDetails.length == 0 ||  $scope.queueDetails == undefined){
				//$scope.isqueueDetailsEmpty = false;
				$scope.showme = false;

				$scope.queueDetails = [];
			}else{
				$scope.showme = true
				
				$scope.isqueueDetailsEmpty = true;
				$scope.currentPage = 1;
				
			}

		},function(err){
			$scope.showme = false;
			//$scope.count = "ALL";
			$scope.count = 50;
		    $scope.selectedPage = "50";
			$scope.queueDetails = [];
		});
    	
    }
    if(localStorage.getItem("prev_path_view") == '/dashboard/viewCases'){
    	 $scope.prespevtiveMsg = false;
    	 $scope.comesPrevPath = true;
        $scope.selectedOrgid = localStorage.getItem("alertsInQueueOrgId");
        $scope.chkselectedOrgid = localStorage.getItem("alertsInQueueOrgId");
        $scope.changedValueForOrganisation( $scope.selectedOrgid);
        $scope.selectedChannel = localStorage.getItem("alertsInQueueChannel");
        $scope.chkselectedChannel = localStorage.getItem("alertsInQueueChannel");
        $scope.changeChannel($scope.selectedChannel);
        $scope.SelectedPerspective = localStorage.getItem("alertsInQueuePrespective");
        $scope.chkSelectedPerspective = localStorage.getItem("alertsInQueuePrespective");
        $scope.SelectedPerspective_val  = localStorage.getItem("alertsInQueuePrespective");
        $scope.selectedQueue = localStorage.getItem("alertsInQueueSelectedOrgId");
        $scope.chkselectedQueue = localStorage.getItem("alertsInQueueSelectedOrgId");
        $scope.currentPage = localStorage.getItem("currentPageForAlert");
        $scope.myPageNumber = localStorage.getItem("PageNoForAlert");
        $scope.count = localStorage.getItem("CountForAlert");
        $scope.selectedPage = localStorage.getItem("CountForAlert");
        $scope.changedValue($scope.selectedQueue);
        $scope.searchBy=localStorage.getItem("alertSearchBy");
       
     }
    
    $scope.init = function(){
    	organisationName();
		loadChannel();
    	UserService.header({}).session({}, function(data){
		}, function(err){});
    	
    	//$scope.getAssignQueueList();
    } 
    
    $scope.prespectiveDisplay = function(prespective){
    	var str = prespective;
    	if(prespective == "ACQUIRER" && ($scope.selectedChannel == "UPI" || $scope.selectedChannel == "IMPS")){
    		return str = "BENEFICIARY"
    	}else if(prespective == "ISSUER" && ($scope.selectedChannel == "UPI" || $scope.selectedChannel == "IMPS")){
    		return str = "REMITTER"
    	}else{
    		return str;
    	}
    	
    }
    
    $scope.searchUserSubmit = function(currentPage){
    	
    	
    	$scope.currentPage = currentPage;
    	var pageNumber = (currentPage - 1)*$scope.selectedPage;
    	$scope.myPageNumber = pageNumber
    	if(!$scope.inChangePage){
    	QueueService.header($scope.response.token).alertInQueue({queueCode:null,count:$scope.selectedPage,selectedOrgId:null,pageNumber:pageNumber},$scope.selectedQueueDto,function(response) {
    		
			$scope.queueDetails = response.response.data;
			$scope.totalItems = response.response.count;
			if($scope.queueDetails.length == 0 ||  $scope.queueDetails == undefined){
				//$scope.isqueueDetailsEmpty = false;
				$scope.showme = false;

				$scope.queueDetails = [];
			}else{
				$scope.showme = true
				$scope.isqueueDetailsEmpty = true;
			}

		},function(err){
			$scope.showme = false;
			//$scope.count = "ALL";
			$scope.count = 50;
		    $scope.selectedPage = "50";
			$scope.queueDetails = [];
		});
    	}
    }
    
    $scope.init();

 }])