'use strict';

angular.module('efrm.dashboard').controller('reviewCases',
				      [ '$scope',
						'$state',
						'casesManagement',
						'casesManagement2',
						'statusService',
						'UserService',
						'Session',
						'toastr',
						 'Msg',
						'$ngConfirm',
						'RolePermissionMatrix',
						'AdminService',
						'SearchCaseService',
						'$timeout',
						'commonDataService',
						
						function($scope, 
								$state, 
								casesManagement, 
								casesManagement2,
								statusService, 
								UserService, 
								Session, 
								toastr,
								Msg,
							    $ngConfirm,
							    RolePermissionMatrix, 
							    AdminService,
							    SearchCaseService,
							    $timeout,
							    commonDataService,
							    ) {
				    	    $scope.submitted=false;
							$scope.perspectiveArray=[];
							$scope.orgId = commonDataService.getLocalStorage().orgId;
							$scope.isPlainText = commonDataService.getLocalStorage().p2Visibility;
							$scope.loggedUserId = commonDataService.getSessionStorage().userId
							var perspective=commonDataService.getLocalStorage().perspective;
							$scope.desableme='false';
							$scope.allowAssignAnalyst=false;
							$scope.response = statusService.getResponseMessage();
							var isAnalyist = $scope.response.usersAuthoritiesPermissionsDto.authority;
							var myperspectiveObj 
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
                            $scope.perspectiveArray=perspective.split(",");
                            if($scope.perspectiveArray[0]=='undefined'){
                                $scope.perspectiveArray=[];
                                //$scope.desableme=true;
                                //$scope.noPersMsg='No Perspective Is Present'
                            }

                            
							/*if($scope.perspectiveArray.length==1){
								$scope.SelectedPerspective_val=$scope.perspectiveArray[0];
								$scope.desableme=true;
							}
							if($scope.perspectiveArray.length>1){
								$scope.SelectedPerspective_val=$scope.perspectiveArray[0];
								$scope.desableme=true;
							}*/
							if ($scope.perspectiveArray.length == 1) {
								$scope.SelectedPerspective_val = $scope.perspectiveArray[0];
								$scope.desableme = true;
							}else if($scope.perspectiveArray.length>1){
								$scope.desableme = false;
								if($scope.perspectiveArray[0]=='ISSUER'){
									$scope.SelectedPerspective_val = $scope.perspectiveArray[0];
								}else if($scope.perspectiveArray[1]=='ISSUER'){
									$scope.SelectedPerspective_val = $scope.perspectiveArray[1];
								}

							}
							$scope.shoWPres = false;
							$scope.txnIdSort = true;
							$scope.caseIdSort = true;
							$scope.creationTsSort = true;
							$scope.alertCountsort = true;
							$scope.fraudScoreSort = true;
							$scope.second_block = false;
							$scope.isDisabled = false;
							$scope.showMiMaxDateMsg = false;
							$scope.userEmail = [];
							if($scope.isPlainText == '1'){
								$scope.isPlainText = true;
							}
							else{
								$scope.isPlainText = false;
							}
							$scope.response = statusService.getResponseMessage();
							
							$scope.rolePermission = RolePermissionMatrix;
							
							$scope.authority = $scope.response.usersAuthoritiesPermissionsDto.authority;
							$scope.uID = commonDataService.getSessionStorage().userId
							var loggedInUser = $scope.response.usersAuthoritiesPermissionsDto;
							$scope.loggedInUserMail = loggedInUser.email;
							$scope.count = "ALL";
							//$scope.selectedPage = "5";
							//change
							$scope.selectedPage = "50";
							$scope.version = '1';
							$scope.toDate1 = moment(new Date()).format("DD-MM-YYYY")
							$scope.fromDate1 = moment().subtract(3, 'months').format('DD-MM-YYYY');
							$scope.data = {};
							$scope.userInformationDTO = {};
							$scope.userInformationDTO.userId = $scope.uID;
							$scope.userInformationDTO.orgId = $scope.orgId;
							$scope.userInformationDTO.actionType = '';
							$scope.userInformationDTO.notes = '';
							$scope.data.userInformationDTO = $scope.userInformationDTO;
							$scope.searchUserData = [];
							$scope.channel_code = [];
							$scope.orgarnisations = []
							$scope.value = true;
							$scope.disable_prespective='';
							$scope.options = [
						       // { status: 'PENDING REVIEW', value: 'PENDING_REVIEW' },
						        { status: 'AUTO CREATED',  value: 'AUTO_CREATED' },
						        { status: 'AUTO CLOSED', value: 'AUTO_CLOSED' },
						        { status: 'MANUAL CREATE', value: 'MANUAL_CREATE' },
						        { status: 'MANUAL CLOSE', value: 'MANUAL_CLOSE' },
						        { status: 'CASE ASSIGNED', value: 'CASE_ASSIGNED' },
						        { status: 'LOCKED', value: 'LOCKED' }
						        //{ status: 'REJECTED', value: 'REJECTED' }
						    ];

							$scope.selectedStatus=$scope.options[0];
							$scope.selectedStatus_val=$scope.options[0].value;
							
							
							$scope.aml =[
								{status:'YES', value:'true'},
								{status:'NO', value:'false'}
							]
							
				
$scope.setChannel = function (selectedChannel){
		$scope.selectedChannel_val = selectedChannel.channelCode;							
							}	
$scope.setStatus = function (selectedStatus){
	$scope.selectedStatus_val = selectedStatus.value;
}
$scope.setPrespective = function(SelectedPerspective){
	$scope.SelectedPerspective_val = SelectedPerspective;
}
$scope.setOrgid = function(SelectedOrdid){
	
	/*if(sessionStorage.getItem("reviewSelectedPrespectiveval") == 'NPCI'){
		if(!angular.isUndefined($scope.SelectedPerspective)){
			//$scope.SelectedPerspective_val = $scope.perspectiveArray[0];
		}
	}*/
	if(SelectedOrdid){
		$scope.SelectedOrdid_val = SelectedOrdid.orgId;
		//$scope.SelectedOrdid_val = SelectedOrdid;
	}
	//npci
	/*if($scope.SelectedOrdid_val === 'NPCI'){
		$scope.shoWPres = true;
		//$scope.desableme = true;
		$scope.SelectedPerspective_val = $scope.perspectiveArray;
		//$scope.SelectedPerspective_val = 'NPCI';
	}
	else{
		$scope.SelectedPerspective_val = $scope.bankPerspective;
		$scope.shoWPres = false;
		//$scope.desableme = false;
	}*/

	
	
}							
$scope.onPageLoad = function() {
	
	if($scope.orgId != "NPCI"){
	 $scope.isDisabled = true;
   	 $scope.SelectedOrdid = {};
   	 $scope.SelectedOrdid_val = $scope.orgId;
   	 //$scope.SelectedOrdid.orgId = $scope.orgId;
   	 $scope.SelectedOrdid = $scope.orgarnisations[0]
   	 console.log($scope.SelectedOrdid)
    }else{
    	$scope.isDisabled = false;
    }
	
};

							/*$scope.changePageSize = function(data){
								$scope.count = "ALL";
								$scope.selectedPage = data;
								//$scope.changedValue($scope.selectedQueueId);
							}*/

$scope.changePageSize = function(data){
	
	$scope.count = 50;
	$scope.selectedPage = data;
	$scope.inChangePage = true;
	$scope.myPageNumber = 0;
	$scope.currentPage = 1;
	//$scope.chckCurrentPage = 1;
	 //$scope.changedValue($scope.selectedQueueId);
	casesManagement.header($scope.response.token).reviewcases({organisationID : $scope.SelectedOrdid_val, 
			 status : $scope.selectedStatus_val, 
			 prespective :myperspectiveObj ,
			 value : null, 
			 fromDate : $scope.fromDate1, 
			 toDate : $scope.toDate1,
			 channel: $scope.selectedChannel_val, 
			 isPlainText: $scope.isPlainText,
			 count:$scope.selectedPage,
			 pageNumber:$scope.myPageNumber,
             selectedOrgId:null},function(response) {
            	 $scope.inChangePage = false;
		$scope.queueDetails = response.response.data;
		$scope.totalItems = response.response.count;
		$scope.currentPage = 1;

	},function(err){
		$scope.showme = false;
		//$scope.count = "ALL";
		$scope.count = 50;
	    $scope.selectedPage = "50";
		$scope.searchUserData = [];
	});
	
}

$scope.searchUserSubmit = function(currentPage){
	
	$scope.currentPage = currentPage;
	var pageNumber = (currentPage - 1)*$scope.selectedPage;
	$scope.myPageNumber = pageNumber
	if(!$scope.inChangePage){
		casesManagement.header($scope.response.token).reviewcases({organisationID : $scope.SelectedOrdid_val, 
		 status : $scope.selectedStatus_val, 
		 prespective :myperspectiveObj ,
		 value : null, 
		 fromDate : $scope.fromDate1, 
		 toDate : $scope.toDate1,
		 channel: $scope.selectedChannel_val, 
		 isPlainText: $scope.isPlainText,
		 count:$scope.selectedPage,
		 pageNumber:pageNumber,
         selectedOrgId:null},function(response) {
		
        	 $scope.searchUserData = response.response.data;
     		$scope.totalItems = response.response.count;
		

	},function(err){
		$scope.showme = false;
		//$scope.count = "ALL";
		$scope.count = 50;
	    $scope.selectedPage = "50";
		$scope.searchUserData = [];
	});
	}
}


$scope.getUsers = function(prespective){
	casesManagement.header($scope.response.token).unCases_dropdown1(
		 		{
		 			loggedInOrgId:$scope.orgId,
		 			selectedOrgId : $scope.SelectedOrdid_val,
		 			prespective:prespective
		 			
		 		},
		 		function(response) {

		 			$scope.userEmail = response.response;

		 		},
		 		function(err) {
		 			
		 		});
}

//on button submit method
$scope.onCaseSubmit = function(){
	if(!$scope.showMiMaxDateMsg){
	$scope.onPageLoad();
	
	     if($scope.SelectedOrdid_val == "NPCI"){
	    	 $scope.value = true;
	     }else{
	    	 $scope.value = false;
	     }
	     
	     	sessionStorage.setItem("reviewOrgId", $scope.SelectedOrdid_val);
			sessionStorage.setItem("reviewSelectedStatus", $scope.selectedStatus_val);
			sessionStorage.setItem("reviewSelectedPrespectiveval", $scope.SelectedPerspective_val);
			sessionStorage.setItem("reviewfromDate", $scope.fromDate1);
			sessionStorage.setItem("reviewtodate", $scope.toDate1);
			sessionStorage.setItem("reviewchannel", $scope.selectedChannel_val);

				var perspectiveObj;
				if ($scope.selectedChannel_val=='IMPS'||$scope.selectedChannel_val=='UPI') {
					if($scope.SelectedPerspective_val == "ISSUER"){
						perspectiveObj = "REMITTER"
					}
					if ($scope.SelectedPerspective_val == "ACQUIRER") {
						perspectiveObj = "BENEFICIARY";
					}
					if ($scope.SelectedPerspective_val == "AML") {
						perspectiveObj = "NPCI";
					}

				}
		if ($scope.selectedChannel_val=='RuPayPos'||$scope.selectedChannel_val=='RuPayAtm' || $scope.selectedChannel_val=='AEPS' || $scope.selectedChannel == "NETC") {
			if($scope.SelectedPerspective_val == "ISSUER"){
				perspectiveObj = "ISSUER"
			}
			if ($scope.SelectedPerspective_val == "ACQUIRER") {
				perspectiveObj = "ACQUIRER";
			}
			if ($scope.SelectedPerspective_val == "AML") {
				perspectiveObj = "NPCI";
			}

		}
		if($scope.selectedChannel_val == 'AEPS'){
			$scope.isPlainText = false
		}else{
			$scope.isPlainText = commonDataService.getLocalStorage().p2Visibility;
			if($scope.isPlainText == '1'){
				$scope.isPlainText = true;
			}
			else{
				$scope.isPlainText = false;
			}
		}
		myperspectiveObj = perspectiveObj;
		 casesManagement.header($scope.response.token).reviewcases( { 
			 organisationID : $scope.SelectedOrdid_val, 
			 status : $scope.selectedStatus_val, 
			 prespective :perspectiveObj ,
			 value : null, 
			 fromDate : $scope.fromDate1, 
			 toDate : $scope.toDate1,
			 channel: $scope.selectedChannel_val, 
			 isPlainText: $scope.isPlainText,
			 count:$scope.selectedPage,
			 pageNumber:0,
             selectedOrgId:null},
			  function(response) {
                                 $scope.searchUserData = response.response.data;
                                 $scope.totalItems = response.response.count;
                                 $scope.inChangePage = false
						},
					function(err) {
							$scope.searchUserData = [];
						$scope.count = "ALL";
						$scope.selectedPage = "50";
					});
		
		 $scope.second_block = true;
	}
}
$scope.setFlag = function(){
	$scope.msg_flag = false;
} 

$scope.setMessageFlag = function(){
	$scope.notes_msg_flag = false;
}

//for view back button//
if(localStorage.getItem("prev_path_view") == '/dashboard/viewCases'){
	$scope.SelectedOrdid = {}
	//$scope.SelectedPerspective = {}
	$scope.selectedStatus = {}
	$scope.selectedChannel = {}
	$scope.fromDate1 = sessionStorage.getItem("reviewfromDate");
	$scope.toDate1 = sessionStorage.getItem("reviewtodate");
	//$scope.SelectedOrdid.orgId = sessionStorage.getItem("reviewOrgId");
	$scope.SelectedOrdid = sessionStorage.getItem("reviewOrgId");
	$scope.selectedStatus.value = sessionStorage.getItem("reviewSelectedStatus");
	$scope.selectedChannel.channelCode = sessionStorage.getItem("reviewchannel");
	$scope.SelectedOrdid_val = sessionStorage.getItem("reviewOrgId");
	$scope.selectedStatus_val =  sessionStorage.getItem("reviewSelectedStatus");
	$scope.SelectedPerspective_val = sessionStorage.getItem("reviewSelectedPrespectiveval");
	$scope.selectedChannel_val = sessionStorage.getItem("reviewchannel");
	$scope.setOrgid($scope.SelectedOrdid);
	$scope.onCaseSubmit();
}

$scope.chckRiskScore = function(data){
	 if(data.caseId.startsWith("I")){
		 if(data.sourceChannel=='RuPayPos' || data.sourceChannel=='RuPayAtm' ||  data.sourceChannel=='AEPS' || data.sourceChannel == 'NETC'){
				
			 return data.finalRiskScore = data.issuerScore.riskScore;
			}
		
	}
	 
	 if(data.caseId.startsWith("A")){
		 if(data.sourceChannel=='RuPayPos' || data.sourceChannel=='RuPayAtm' ||  data.sourceChannel=='AEPS' || data.sourceChannel == 'NETC'){
			 return data.finalRiskScore = data.aquirerScore.riskScore;
			}
		
	}
	 if(data.caseId.startsWith("B"))
	 {
			if(data.sourceChannel == 'IMPS' || data.sourceChannel == 'UPI'  ){
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
							
//on approve case method							
$scope.approve = function(row) {
								
							    $scope.userInformationDTO.actionType = 'MANUAL_CREATE';
								UserService.header($scope.response.token).session({},
									function(data) {
                                                    $scope.modal = null;
													$scope.approveUser = row; // capturing case id
													if (Session.isSameLoggedInUser(row.email)) {
														toastr.error('You cann\'t unlock yourself.',Msg.oops);
														return false;
													}
													$ngConfirm({
														title : 'Approve Case',
														theme : 'Material',
														icon : 'fa fa-check',
														content: '<span class="alert_text">Are you sure to approve the case?</span><textarea class="admin_input" ng-model="message" name="comment" form="usrform" placeholder="Comments..." ng-change="setFlag()"></textarea><span  class="error_user_msg" ng-if="msg_flag">Please provide your input.</span>',
														scope : $scope,
														buttons : {
															Ok : {
																text : 'Approve',
																btnClass : 'btn-red',
																action : function(
																		scope,
																		button) {
																	
																	if($scope.message == null ||$scope.message == '')
																	  {
																		$scope.msg_flag = true;
																		$scope.message = null;
																		return false;
																	   }
																	
																	else{
																		$scope.msg_flag = false;
//																		$scope.userInformationDTO.actionType = 'MANUAL_CREATE';
																		casesManagement.header(localStorage.getItem("sessionToken")).approvecases(
																						{
																							caseId : $scope.approveUser
																						},
																						$scope.data,
																						function(data) {
																							
																							$scope.onCaseSubmit();
																						},
																						function(
																								err) {

																						});
																	
																		$scope.message = '';	
																		$scope.message = null;
																	}
																
																}
															},
															Cancel : {
																text : 'Cancel',
																action : function(
																		scope,
																		button) {
																	$scope.message = '';	
																	$scope.message = null;
																}
																
															}
														},
														onAction: function (scope) {
															
															$scope.userInformationDTO.notes = $scope.message;
													        
													    },
													    onDestroy: function () {
													    	$scope.msg_flag = false;
													    }
													});
												}, function(err) {
												});
}

//on reject case method
$scope.reject = function(row) {
								
								$scope.userInformationDTO.actionType = 'REJECTED';
								UserService.header($scope.response.token).session({},
												function(data) {
                                                                $scope.modal = null;
													            $scope.rejectUser = row; // capturing case id
																				
													if (Session.isSameLoggedInUser(row.email)) {
														toastr.error('You cann\'t unlock yourself.', Msg.oops);
														return false;
													}
													$ngConfirm({
														title : 'Reject Case',
														theme : 'Material',
														icon : 'fa fa-ban',
														content: '<span class="alert_text">Are you sure to reject the case?</span><textarea id ="reject_area" class="admin_input" ng-model="message_rej" name="comment" form="usrform" placeholder="Comments..." ng-change="setFlag()"></textarea><span  class="error_user_msg" ng-if="msg_flag">Please provide your input.</span>',
														scope : $scope,
														buttons : {
															Ok : {
																text : 'Reject',
																btnClass : 'btn-red',
																action : function(
																		scope,
																		button) {
																	if($scope.message_rej == null ||$scope.message_rej == '')
																	  {
																		$scope.msg_flag = true;
																		$scope.message_rej = null;
																		return false;
																	   }
																	
																	else {
																		$scope.msg_flag = false;
																		casesManagement.header(localStorage.getItem("sessionToken")).rejectcases(
																				{
																					caseId : $scope.rejectUser
																				},
																				$scope.data,
																				function(data) {

																					$scope.onCaseSubmit();
																				},
																				function(err) {
																				});
																		
																	}
																
																
																}
															},
															
															Cancel : {
																text : 'Cancel'
															}
														},
														onAction: function (scope) {
															
															$scope.userInformationDTO.notes = $scope.message;
													        
													    }
													});
												}, function(err) {
												});
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
    if(keyname == 'finalRiskScore'){
      	 $scope.fraudScoreSort = !$scope.fraudScoreSort;
    }
    if(keyname == 'txnCount'){
      	 $scope.alertCountsort = !$scope.alertCountsort;
    }
}		

//pass data to mycases.html page
$scope.showData=function(caseId,sourceChannel,assignedTo){
	$scope.assignedTo = assignedTo;
	localStorage.setItem("prev_path", "/dashboard/reviewcases");
    SearchCaseService.setSearchCase(caseId,$scope.orgId,sourceChannel);
    $scope.autoCaseAssign();
   // $state.go('dashboard.viewCase',{value:$scope.selectedStatus.value});

}

$scope.autoCaseAssign = function(){
	
	
	var caseAssignedDto = {};
	var userInformationDTO = {};
	userInformationDTO.userId =  commonDataService.getSessionStorage().userId
	userInformationDTO.orgId = commonDataService.getLocalStorage().orgId;
	userInformationDTO.notes = "AUTO ASSIGN";
	caseAssignedDto.assignedTo = commonDataService.getSessionStorage().userId
	caseAssignedDto.caseId = SearchCaseService.getSearchCase().caseId;
	caseAssignedDto.userInformationDTO = userInformationDTO;
	var config = {};
	$scope.userInformationDTO = {};
    config.caseId = SearchCaseService.getSearchCase().caseId;
    
    config.locked = true;
    $scope.userInformationDTO.orgId = commonDataService.getLocalStorage().orgId;
    $scope.userInformationDTO.userId = commonDataService.getSessionStorage().userId
    $scope.userInformationDTO.channel = SearchCaseService.getSearchCase().sourceChannel;
    config.userInformationDTO = $scope.userInformationDTO;
    if($scope.assignedTo == null && $scope.chkAnalyist){
	casesManagement.header(localStorage.getItem("sessionToken")).assignCases(
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
							$scope.userInformationDTO.userId = commonDataService.getSessionStorage().userId
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

$scope.channelDisplay = function(channel){
	if($scope.channel_code != null && typeof $scope.channel_code !== "undefined" && channel != null && typeof channel !== "undefined"){
	for(var i=0;i<$scope.channel_code.length;i++){
		if($scope.channel_code[i].channelCode == channel){
			return $scope.channel_code[i].channelDesc;
		}
	}
	}
	/*if(channel == 'UPI'){
		return 'UPI'
	}if(channel == 'IMPS'){
		return 'IMPS'
	}if(channel == 'RuPayAtm'){
		return 'NFS';
	}if(channel == 'RuPayPos'){
		return 'RUPAY';
	}*/
}

//runs after main  controller		 
$scope.init = function(){
	        UserService.header({}).session({}, function(data){}, function(err){});
	       
	        
	        casesManagement.header($scope.response.token).organisations( 
	    			{ 
	    				organisationID : $scope.orgId
	    			},
	    			function(response) {
	                             $scope.orgarnisations = response.response;
	                             $scope.onPageLoad();

	    				},
	    			function(err) {
	    			});
	        
	    	casesManagement2.header($scope.response.token).channel( {},
	    			function(response) {
	                             $scope.channel_code = response.response;

	    				},
	    			function(err) {
	    			});

		    }

$scope.assign = function(caseID,caseStatus) {
	var getMyPrespective = commonDataService.getPrespective(caseID);
	$scope.getUsers(getMyPrespective);
	$scope.usermodel = null;
	$scope.message = null;
	 $scope.msg_flag = false;
	 $scope.notes_msg_flag = false;
    $ngConfirm({
				title : 'Assign Case',
				theme : 'Material',
				icon : 'fa fa-check',
				content: '<span class="alert_text">Please select the Email Id:</span><select class="cases_status"  ng-model="usermodel" ng-dropdown  ng-options="option.email for option in userEmail track by option.userId" ng-change="setFlag()"><option style="display:none" value="" selected>-- choose an option --</option></select><span  class="error_user_msg" ng-if="msg_flag">Please select a user</span><textarea class="admin_input2" ng-change="setMessageFlag()" ng-model="message" name="comment" form="usrform" placeholder="Comments..."></textarea><span class="error_user_msg" ng-if="notes_msg_flag">This Field Is Required</span>',
				scope : $scope,
							buttons : {
								Ok : {
									text : 'Assign',
									btnClass : 'btn-red',
									action : function(
											scope,
											button) {
									
										 if($scope.usermodel == null || $scope.message == null){
											 if($scope.usermodel == null){
												    $scope.msg_flag = true;
												  }  if($scope.message == null){
												    $scope.notes_msg_flag = true;
												  }
												  return false;
												  
									        }
										
										 else{
											 	
									        	$scope.msg_flag = false;
									        	
									        	$scope.notes_msg_flag = false;
									        	if(!(caseStatus =='MANUAL_CREATE' || caseStatus =='AUTO_CREATED')){
									        		
									        	$scope.userInformationDTO = JSON.stringify({
													userInformationDTO: {
														 userId : commonDataService.getSessionStorage().userId,
													     orgId : $scope.orgId, 
													     notes : $scope.message,
													     reassign : true
													  },
													  caseId :caseID, 
													  assignedTo: $scope.usermodel.userId,
													}
													);
									        	}else{
									        		$scope.userInformationDTO = JSON.stringify({
														userInformationDTO: {
															 userId : commonDataService.getSessionStorage().userId,
														     orgId : $scope.orgId, 
														     notes : $scope.message
														    
														  },
														  caseId :caseID, 
														  assignedTo: $scope.usermodel.userId,
														}
														);
									        	}
									            casesManagement.header(localStorage.getItem("sessionToken")).assignCases(
														{},$scope.userInformationDTO,
														function(data) {
															$scope.onCaseSubmit();	
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
										$scope.message = null;
									}
								},
								
								 
							}
							  
							
						});
					
}

$scope.chnageDate = function(){
	var partscheck = $scope.fromDate1.split('-');
	var mydatecheck = new Date(partscheck[2], partscheck[1] - 1,partscheck[0] ); 
	var datecheck = new Date( Date.parse( mydatecheck ) ); 
	
	var topartscheck = $scope.toDate1.split('-');
	var tomydatecheck = new Date(topartscheck[2], topartscheck[1] - 1,topartscheck[0] ); 
	var todatecheck = new Date( Date.parse( tomydatecheck ) ); 
	if(new Date(todatecheck) < new Date(datecheck)){
		
		$scope.showMiMaxDateMsg = true;
	}else{
		$scope.showMiMaxDateMsg = false;
	}
	var parts = $scope.fromDate1.split('-');
	var mydate = new Date(parts[2], parts[1] - 1,parts[0] ); 
var date = new Date( Date.parse( mydate ) ); 
//date.setDate( date.getDate() + 1 );
date.setDate( date.getDate());
var mintoDate = date.toDateString(); 
$scope.mintoDate = new Date( Date.parse( mintoDate ) );
}

$scope.toDate = function(){
	
	var partscheck = $scope.fromDate1.split('-');
	var mydatecheck = new Date(partscheck[2], partscheck[1] - 1,partscheck[0] ); 
	var datecheck = new Date( Date.parse( mydatecheck ) ); 
	
	var topartscheck = $scope.toDate1.split('-');
	var tomydatecheck = new Date(topartscheck[2], topartscheck[1] - 1,topartscheck[0] ); 
	var todatecheck = new Date( Date.parse( tomydatecheck ) ); 
	if(new Date(todatecheck) < new Date(datecheck)){
		
		$scope.showMiMaxDateMsg = true;
	}else{
		$scope.showMiMaxDateMsg = false;
	}
}

$scope.prespectiveDisplay = function(prespective){
	var str = prespective;
	if(prespective == "ACQUIRER" && ($scope.selectedChannel_val == "UPI" || $scope.selectedChannel_val == "IMPS")){
		return str = "BENEFICIARY"
	}else if(prespective == "ISSUER" && ($scope.selectedChannel_val == "UPI" || $scope.selectedChannel_val == "IMPS")){
		return str = "REMITTER"
	}else{
		return str;
	}
	
}
		    
$scope.init();
		 

} ]);