'use strict';

angular.module('efrm.dashboard')
.controller('unassignedCases', 
		[
			'$scope', 
			'$state', 
			'casesManagement',
			'casesManagement2',
			'statusService', 
			'UserService', 
			'Session', 
			'$ngConfirm', 
			 'toastr',
			 'Msg',
			'SearchCaseService',
			'RolePermissionMatrix',  
			'commonDataService',
	function (
				$scope, 
				$state, 
				casesManagement, 
				casesManagement2,
				statusService, 
				UserService, 
				Session, 
				$ngConfirm, 
				toastr,
				Msg,
				SearchCaseService,
				RolePermissionMatrix,
				commonDataService
			) 
			 {
				$scope.txnIdSort = true;
				 $scope.caseIdSort = true;
				 $scope.creationTsSort = true;
				 $scope.alertCountsort = true;
				 $scope.fraudScoreSort = true;
				 $scope.showme = true;
				 $scope.second_block = false;
				$scope.orgId = commonDataService.getLocalStorage().orgId;	
				$scope.userId = commonDataService.getSessionStorage().userId;
				$scope.response = statusService.getResponseMessage();
				$scope.authority = $scope.response.usersAuthoritiesPermissionsDto.authority;
				$scope.rolePermission = RolePermissionMatrix;
				$scope.isDisabled = false;
				$scope.message ='';
				$scope.count = "ALL";
				//$scope.selectedPage = "5";
				//changes
				$scope.selectedPage = "50";
				$scope.showMiMaxDateMsg = false;
				$scope.searchUserData = []; 
				$scope.myprespective = null;
				$scope.orgarnisations_temp = [];
				$scope.showdata = false;
				$scope.toDate1 = moment(new Date()).format("DD-MM-YYYY");
				$scope.fromDate1 = moment().subtract(3, 'months').format('DD-MM-YYYY');
				$scope.userEmail = [];
				$scope.isPlainText = localStorage.getItem("p2Visibility");
				if($scope.isPlainText == '1'){
					$scope.isPlainText = true;
				}
				else{
					$scope.isPlainText = false;
				}



$scope.onPageLoad = function() {
	
	if($scope.orgId == 'NPCI'){
		$scope.isDisabled = false;
		//get orgID list
	    casesManagement.header($scope.response.token).organisations( 
				{ 
					//authority : $scope.authority
					organisationID : $scope.orgId
				},
				function(response) {
	                         $scope.orgarnisations = response.response;

					},
				function(err) {
				});
	}
	else{
		$scope.isDisabled = true;
		$scope.case_orgId = {}
		casesManagement.header($scope.response.token).organisations( 
				{ 
					//authority : $scope.authority
					organisationID : $scope.orgId
				},
				function(response) {
	                         $scope.orgarnisations_temp = response.response;
	                         $scope.orgarnisations = $scope.orgarnisations_temp.filter(function(x) {
	               			  return (x.orgId == $scope.orgId);
	               			});        
	                      // $scope.case_orgId.orgId = $scope.orgId;
	                         $scope.case_orgId = $scope.orgarnisations[0]
	                       $scope.organisationID = $scope.orgId;
					},
				function(err) {
				});
		
		
		
		
	}
    
  //get channel list
	casesManagement2.header($scope.response.token).channel( {},
			function(response) {
                         $scope.channel_code = response.response;
				},
			function(err) {
			});
	
	
	if(localStorage.getItem("prev_path_view") == '/dashboard/viewCases'){
		$scope.case_orgId = {}
		$scope.case_channel = {}
		$scope.fromDate1 = sessionStorage.getItem("viewfromDate");
		$scope.toDate1 = sessionStorage.getItem("viewtoDate");
		$scope.case_orgId.orgId = sessionStorage.getItem("viewOrgId");
		$scope.case_channel.channelCode = sessionStorage.getItem("viewchannel");
		$scope.organisationID = $scope.case_orgId.orgId;
		$scope.fromDate1 = sessionStorage.getItem("viewfromDate");
		$scope.toDate1 = sessionStorage.getItem("viewtoDate");
		$scope.dataSize = sessionStorage.getItem("dataSize");
		$scope.case_channel_val = $scope.case_channel.channelCode;
		$scope.unassigned_cases();
	}
	 
	
};

$scope.changePageSize = function(data){
	$scope.count = "ALL";
	$scope.selectedPage = data;
	$scope.unassigned_cases();
}

$scope.unassigned_cases = function(){
	//Get the list of email id's to whom case needs to be assigned
		sessionStorage.setItem("viewOrgId", $scope.organisationID);
		sessionStorage.setItem("viewtoDate", $scope.toDate1);
		sessionStorage.setItem("viewfromDate", $scope.fromDate1);
		sessionStorage.setItem("viewchannel", $scope.case_channel_val);
		sessionStorage.setItem("dataSize", $scope.dataSize);
		if($scope.case_channel_val=='AEPS'){
			$scope.isPlainText = false;
		}
	 casesManagement.header($scope.response.token).unassignedCases(
	 		   {
	 			orgId : $scope.organisationID,
	 			fromDate : $scope.fromDate1,
	 			toDate : $scope.toDate1,
	 			channel : $scope.case_channel_val,
	 			dataSize:'ALL',
	 			isPlainText: $scope.isPlainText
	 			
		 		},
		 		function(response) 
		 		   {
		 			$scope.showme = false;
		 			 $scope.searchUserData = response.response.data;
			 		  if($scope.searchUserData == null){
			 			  
			 			  $scope.showme = true
			 		  }  	
			 		  else{
			 			
			 			 casesManagement.header($scope.response.token).unCases_dropdown(
			 			 		{
			 			 			loggedInOrgId:$scope.orgId,
			 			 			selectedOrgId : $scope.organisationID,
			 			 		},
			 			 		function(response) {

			 			 			$scope.userEmail = response.response;

			 			 		},
			 			 		function(err) {
			 			 			toastr.clear();
			 			 		});
			 			  
			 		  }
		 			
			       },
			 	function(err) 
			 		{
			    	   $scope.searchUserData = [];
						$scope.count = "ALL";
						$scope.selectedPage = "50";
			 	    }
	               );
	
	 
 }   

$scope.getUsers = function(prespective){
	casesManagement.header($scope.response.token).unCases_dropdown1(
		 		{
		 			loggedInOrgId:$scope.orgId,
		 			selectedOrgId : $scope.selectedOrgId,
		 			prespective:prespective
		 			
		 		},
		 		function(response) {

		 			$scope.userEmail = response.response;

		 		},
		 		function(err) {
		 			
		 		});
}
//pass data to mycases.html page
$scope.showData=function(caseId,sourceChannel){

	localStorage.setItem("prev_path", "/dashboard/unassignedcases");
    SearchCaseService.setSearchCase(caseId,$scope.orgId,sourceChannel);
    $scope.autoCaseAssign();
    //$state.go('dashboard.viewCase');

}

$scope.chckRiskScore = function(data){
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

$scope.onCaseSubmit = function(){
	if(!$scope.showMiMaxDateMsg){
	$scope.second_block = true;
	$scope.unassigned_cases();	
	}
}

$scope.setFlag = function(){
	$scope.msg_flag = false;
} 
				
$scope.assign = function(caseID) {
	var getMyPrespective = commonDataService.getPrespective(caseID);
	$scope.getUsers(getMyPrespective);
    $ngConfirm({
				title : 'Assign Case',
				theme : 'Material',
				icon : 'fa fa-check',
				content: '<span class="alert_text">Please select the Email Id:</span><select class="cases_status"  ng-model="usermodel" ng-dropdown  ng-options="option.email for option in userEmail track by option.userId" ng-change="setFlag()"><option style="display:none" value="" selected>-- choose an option --</option></select><span  class="error_user_msg" ng-if="msg_flag">Please select a user</span><textarea class="admin_input2" ng-model="message" name="comment" form="usrform" placeholder="Comments..."></textarea>',
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
													     orgId : $scope.orgId, 
													     notes : $scope.message
													  },
													  caseId :caseID, 
													  assignedTo: $scope.usermodel.userId,
													}
													);
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
										$scope.message = '';
									}
								},
								
								 
							}
							  
							
						});
					
}

$scope.change_orgID = function(case_orgId){
	
	$scope.organisationID = case_orgId;
}


$scope.change_channel = function(case_channel){
	
	$scope.case_channel_val = case_channel.channelCode;
	
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
    if(keyname == 'riskScore'){
     	 $scope.fraudScoreSort = !$scope.fraudScoreSort;
   }
   if(keyname == 'txnCount'){
     	 $scope.alertCountsort = !$scope.alertCountsort;
   }
   
}

$scope.autoCaseAssign = function(){
	
	var caseAssignedDto = {};
	var userInformationDTO = {};
	userInformationDTO.userId =  commonDataService.getSessionStorage().userId;
	userInformationDTO.orgId = commonDataService.getLocalStorage().orgId;
	userInformationDTO.notes = "AUTO ASSIGN";
	caseAssignedDto.assignedTo = commonDataService.getSessionStorage().userId;
	caseAssignedDto.caseId = SearchCaseService.getSearchCase().caseId;
	caseAssignedDto.userInformationDTO = userInformationDTO;
	var config = {};
	$scope.userInformationDTO = {};
    config.caseId = SearchCaseService.getSearchCase().caseId;
    
    config.locked = true;
    $scope.userInformationDTO.orgId = commonDataService.getLocalStorage().orgId;
    $scope.userInformationDTO.userId = commonDataService.getSessionStorage().userId;
    $scope.userInformationDTO.channel = SearchCaseService.getSearchCase().sourceChannel;
    config.userInformationDTO = $scope.userInformationDTO;
    if($scope.assignedTo == null){
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
    if($scope.assignedTo != null){
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
}
$scope.init = function(){
    UserService.header({}).session({}, function(data){}, function(err){});
    $scope.onPageLoad();

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
	
    
$scope.init();

 }])