'use strict';

angular.module('efrm.dashboard')
.controller('unassignedAlertsController', 
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
			'AlertDataService',
			'alertService',
	        'MyAlerts',
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
				AlertDataService,
				alertService,
		        MyAlerts,
		        commonDataService
			) 
			 {
				$scope.txnIdSort = true;
				 $scope.caseIdSort = true;
				 $scope.creationTsSort = true;
				 $scope.fraudScoreSort = true;
				 $scope.showme = true;
				 $scope.second_block = false;
				$scope.orgId = commonDataService.getLocalStorage().orgId;	
				$scope.userId = commonDataService.getSessionStorage().userId;
				$scope.response = statusService.getResponseMessage();
				$scope.authority = $scope.response.usersAuthoritiesPermissionsDto.authority;
				$scope.rolePermission = RolePermissionMatrix;
				$scope.showMiMaxDateMsg = false;
				$scope.isDisabled = false;
				$scope.onSubmitflag = true;
				$scope.message ='';
				//$scope.selectedPage = "10";

				if($scope.authority.includes('ANALYSTS')){
					 $scope.chkAnalyist = true;
				 }else{
					 $scope.chkAnalyist = false;
				 }
				
				$scope.searchAlertData = []; 
				var d = new Date();
				d.setDate(d.getDate());
				var curr_date = ('0' + d.getDate()).slice(-2); //current system date
				var curr_month = ('0' + d.getMonth()).slice(-2); //current system month
				var prev_month = (d.getMonth() - 2);
				var prev_month_withZero = ('0' + prev_month).slice(-2);
				curr_month++;
				$scope.orgarnisations_temp = [];
				$scope.showdata = false;
				var curr_year = d.getFullYear();
				$scope.toDate1 = moment(new Date()).format("DD-MM-YYYY")
				$scope.fromDate1 = moment().subtract(3, 'months').format('DD-MM-YYYY');
				$scope.mintoDate = $scope.fromDate1;
				$scope.userEmail = [];
				$scope.isPlainText = commonDataService.getLocalStorage().p2Visibility;
				if($scope.isPlainText == '1'){
					$scope.isPlainText = true;
				}
				else{
					$scope.isPlainText = false;
				}

				 $scope.count = "ALL";
				// $scope.selectedPage = "5";
				 //change
				 $scope.selectedPage = "50";



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
	                   //$scope.case_orgId.orgId = $scope.orgId;
	                         $scope.case_orgId = $scope.orgarnisations[0];
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
	
	
	if(localStorage.getItem("prev_path_view") == '/dashboard/viewAlert'){
		$scope.case_orgId = {}
		$scope.case_channel = {}
		$scope.fromDate1 = sessionStorage.getItem("viewfromDate");
		$scope.toDate1 = sessionStorage.getItem("viewtoDate");
		$scope.mintoDate = $scope.fromDate1;
		$scope.case_orgId.orgId = sessionStorage.getItem("viewOrgId");
		$scope.case_channel.channelCode = sessionStorage.getItem("viewchannel");
		$scope.organisationID = $scope.case_orgId.orgId;
		//$scope.fromDate1 = sessionStorage.getItem("viewfromDate");
		//$scope.toDate1 = sessionStorage.getItem("viewtoDate");
		$scope.count = sessionStorage.getItem("count");
		$scope.case_channel_val = $scope.case_channel.channelCode;
		$scope.onSubmit();
	}
	 
	
};

/*$scope.changePageSize = function(data){
	$scope.count = "ALL";
	$scope.selectedPage = data;
	$scope.unassigned_alerts();
}
*/

$scope.changePageSize = function(data){
	$scope.onSubmitflag = false;
	$scope.count = 50;
	$scope.selectedPage = data;
	$scope.inChangePage = true;
	$scope.myPageNumber = 0;
	$scope.currentPage = 1;
	$scope.unassigned_alerts();
	
}


$scope.getUsers = function(prespective){
		
		 casesManagement.header($scope.response.token).unCases_dropdown1(
		 		{
		 			loggedInOrgId:$scope.orgId,
		 			selectedOrgId : $scope.organisationID,
		 			prespective:prespective
		 			
		 		},
		 		function(response) {

		 			$scope.userEmail = response.response;

		 		},
		 		function(err) {
		 			toastr.clear();
		 		});
		 
		 
		 
	 }

$scope.searchUserSubmit = function(currentPage){
	$scope.onSubmitflag = false;
	$scope.currentPage = currentPage;
	var pageNumber = (currentPage - 1)*$scope.selectedPage;
	$scope.myPageNumber = pageNumber
	if(!$scope.inChangePage){
		$scope.unassigned_alerts()
	}
}

$scope.unassigned_alerts = function(){
	if($scope.onSubmitflag){
		$scope.count = 50;
		//$scope.selectedPage = data;
		$scope.inChangePage = true;
		$scope.myPageNumber = 0;
		$scope.currentPage = 1;
	}
	//Get the list of email id's to whom case needs to be assigned
		sessionStorage.setItem("viewOrgId", $scope.organisationID);
		sessionStorage.setItem("viewtoDate", $scope.toDate1);
		sessionStorage.setItem("viewfromDate", $scope.fromDate1);
		sessionStorage.setItem("viewchannel", $scope.case_channel_val);
		sessionStorage.setItem("count", $scope.count);
	 if($scope.case_channel_val == 'AEPS'){
		 $scope.isPlainText = false;
	 }else{
		 $scope.isPlainText = commonDataService.getLocalStorage().p2Visibility;
			if($scope.isPlainText == '1'){
				$scope.isPlainText = true;
			}
			else{
				$scope.isPlainText = false;
			}
	 }
	 casesManagement.header($scope.response.token).unassignedAlerts(
	 		   {
	 			orgId : $scope.organisationID,
	 			fromDate : $scope.fromDate1,
	 			toDate : $scope.toDate1,
	 			channel : $scope.case_channel_val,
	 			count:$scope.selectedPage,
				pageNumber:$scope.myPageNumber,
	 			isPlainText: $scope.isPlainText,
	 			selectedOrgId:null,
	 			isAlertNoteRequired:true
		 		},
		 		function(response) 
		 		   {
		 			$scope.showme = false;
		 			$scope.inChangePage = false;
		 			 $scope.searchAlertData = response.response.data;
		 			$scope.totalItems = response.response.count;
			 		 /* if($scope.searchAlertData == null){
						  $scope.count = "ALL";
						  $scope.selectedPage = "50";
			 			  $scope.showme = true
			 		  }*/  	
			 		  
		 			
			       },
			 	function(err) 
			 		{
			    	   $scope.searchAlertData = [];
			 	    }
	               );
	
	 
 }   

$scope.onSubmit = function(){
	if(!$scope.showMiMaxDateMsg){
	$scope.second_block = true;
	$scope.onSubmitflag = true;
	$scope.unassigned_alerts();	
	}
}

$scope.setFlag = function(){
	$scope.msg_flag = false;
} 
				
$scope.assign = function(alertId,caseId) {
	var getMyPrespective = commonDataService.getPrespective(caseId);
	$scope.getUsers(getMyPrespective);
	$scope.usermodel = null;
    $ngConfirm({
				title : 'Assign Alerts',
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
													     orgId : $scope.orgId, 
													  },
													  caseId :caseId, 
													  alertId:alertId,
													  assignedTo: $scope.usermodel.userId,
													}
													);
									            casesManagement.header(localStorage.getItem("sessionToken")).assignAlerts(
														{},$scope.userInformationDTO,
														function(data) {
															$scope.onSubmit();	
															$scope.usermodel = null;
															toastr.success("Alert Assigned Successfully", Msg.hurrah);
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
    if(keyname == 'alert.caseId'){
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
    if(keyname == 'alert.riskScoreDetails'){
        $scope.fraudScoreSort = !$scope.fraudScoreSort;
    }
    if(keyname == 'alertType'){
        $scope.alertTypeSort = !$scope.alertTypeSort;
    }

}


$scope.showData=function(alert){
    //localStorage.setItem("prev_path", "/dashboard/viewCase");
    //change for back button//
    localStorage.setItem("prev_path", "/dashboard/unassignedAlerts");
    AlertDataService.setAlertDataDetails(alert);
    $scope.alertcaseId = alert.alert.caseId;
    $scope.selectedalertId = alert.alert.alertId;
    $scope.autoAlertAssign();


}

$scope.autoAlertAssign = function(){
	var alertAssignedDto = {};
	var userInformationDTO = {};
	userInformationDTO.userId =  commonDataService.getSessionStorage().userId;
	userInformationDTO.orgId = commonDataService.getLocalStorage().orgId;
	
	alertAssignedDto.assignedTo = commonDataService.getSessionStorage().userId;;
	alertAssignedDto.caseId = $scope.alertcaseId;
	alertAssignedDto.alertId = $scope.selectedalertId;
	alertAssignedDto.userInformationDTO = userInformationDTO;
	if($scope.assignedTo == null && $scope.chkAnalyist){
		casesManagement.header(localStorage.getItem("sessionToken")).assignAlerts(
			{},alertAssignedDto,
			function(data) {


				var config = {};
				$scope.userInformationDTO = {};
				config.caseId =  $scope.selectedalertId;
				config.locked = true;
				$scope.userInformationDTO.orgId = commonDataService.getLocalStorage().orgId;
				$scope.userInformationDTO.userId = commonDataService.getSessionStorage().userId;
				$scope.userInformationDTO.channel = sessionStorage.getItem("viewchannel");
				config.userInformationDTO = $scope.userInformationDTO;
				MyAlerts.header({}).lockStatus({alertId:$scope.selectedalertId}, config, function (data) {
					toastr.success("Alert Assigned Successfully", Msg.hurrah);
					$state.go('dashboard.viewAlert');
				}, function (err) {

				});

			},
			function(err) {


			});
	}
	if($scope.assignedTo != null || !$scope.chkAnalyist){
		$state.go('dashboard.viewAlert');
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

/*$scope.chnageDate = function(){
	var parts = $scope.fromDate1.split('-');
	var mydate = new Date(parts[2], parts[1] - 1,parts[0] ); 
var date = new Date( Date.parse( mydate ) ); 
date.setDate( date.getDate());
var mintoDate = date.toDateString(); 
$scope.mintoDate = new Date( Date.parse( mintoDate ) );

}*/

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