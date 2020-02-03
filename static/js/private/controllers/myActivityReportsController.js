'use strict';

angular.module('efrm.dashboard')
.controller('myActivityReportsController',  ['$scope', '$state','statusService','UserService','$ngConfirm','toastr','Msg','Session','commonDataService','efrmReports',  function($scope, $state, statusService,UserService,$ngConfirm,toastr,Msg,Session,commonDataService,efrmReports) {
	
	var response = statusService.getResponseMessage();
	$scope.toDate = moment(new Date()).format("DD-MM-YYYY")
	//$scope.fromDate = moment().subtract(6, 'months').format('DD-MM-YYYY');
	$scope.fromDate = moment().subtract(7, 'days').format('DD-MM-YYYY');
	$scope.showMiMaxDateMsg = false;
	var userId = commonDataService.getSessionStorage().userId;
	var orgId = commonDataService.getLocalStorage().orgId;
	var loggedInUser = response.usersAuthoritiesPermissionsDto;
	$scope.fileType = "EXCEL"
	//$scope.loggedInUserMail = loggedInUser.email;
	$scope.myObject = {}
	 $scope.fileTypes =[
     	//{ name:"PDF",value:"PDF"},
     	{ name:"EXCEL",value:"EXCEL"}
     ]
	 
	$scope.frmDate = function (fromDate)
	  {
	        if(fromDate){
	        	$scope.FromDateValue=[];
				$scope.FromDateValue = fromDate.split("-")
				//$scope.someObject.momentFromDate=$scope.FromDateValue[2]+"-"+$scope.FromDateValue[1]+"-"+$scope.FromDateValue[0];
				
				var partscheck = $scope.fromDate.split('-');
				var mydatecheck = new Date(partscheck[2], partscheck[1] - 1,partscheck[0] ); 
				var datecheck = new Date( Date.parse( mydatecheck ) ); 
				
				var topartscheck = $scope.toDate.split('-');
				var tomydatecheck = new Date(topartscheck[2], topartscheck[1] - 1,topartscheck[0] ); 
				var todatecheck = new Date( Date.parse( tomydatecheck ) ); 
				if(new Date(todatecheck) < new Date(datecheck)){
					
					$scope.showMiMaxDateMsg = true;
				}else{
					$scope.showMiMaxDateMsg = false;
				}
				var parts = $scope.fromDate.split('-');
				var mydate = new Date(parts[2], parts[1] - 1,parts[0] ); 
			var date = new Date( Date.parse( mydate ) ); 
			date.setDate( date.getDate() + 1 );
			var mintoDate = date.toDateString(); 
			$scope.mintoDate = new Date( Date.parse( mintoDate ) );
	        }
	        
    }
	
	$scope.checktoDate = function(toDate)
	  {
	      
	     if(toDate){

		      $scope.ToDateValue=[];
			  $scope.ToDateValue = toDate.split("-")
			 // $scope.momentToDate=$scope.ToDateValue[2]+"-"+$scope.ToDateValue[1]+"-"+$scope.ToDateValue[0];
			  var partscheck = $scope.fromDate.split('-');
				var mydatecheck = new Date(partscheck[2], partscheck[1] - 1,partscheck[0] ); 
				var datecheck = new Date( Date.parse( mydatecheck ) ); 
				
				var topartscheck = $scope.toDate.split('-');
				var tomydatecheck = new Date(topartscheck[2], topartscheck[1] - 1,topartscheck[0] ); 
				var todatecheck = new Date( Date.parse( tomydatecheck ) ); 
				if(new Date(todatecheck) < new Date(datecheck)){
					
					$scope.showMiMaxDateMsg = true;
				}
				else{
					$scope.showMiMaxDateMsg = false;
				}
	     }
	  }
	
    $scope.isSessionValid = function(){
        UserService.header({}).session({}, function(data){
        }, function(err){});
    }
    
	$scope.isSessionValid();
	
	$scope.myActivityReportsSubmit = function(){
		if($scope.showMiMaxDateMsg == false){
			$scope.myObject.reportName = "MY_ACTIVITY_REPORT";
			$scope.myObject.reportRequesterName = userId;
			$scope.myObject.reportMimeType = $scope.fileType;
			$scope.myObject.requesterOrgId = orgId;
			$scope.myObject.emailId = loggedInUser.email;
			$scope.myObject.reportSummary = true;
			$scope.myObject.reportDetails = true;
			$scope.toDate = $scope.toDate.split("-").reverse().join("-");
			$scope.fromDate = $scope.fromDate.split("-").reverse().join("-");
			$scope.myObject.reportToDate = $scope.toDate + ' 00:00:00';;
			$scope.myObject.reportFromDate = $scope.fromDate + ' 00:00:00';
			$scope.myObject.reportForOrg = orgId;
			$scope.myObject.requestedField = 'N/A'
			efrmReports.header().myactivityreport($scope.myObject, function(data) {
				$scope.myObject = {}
	            toastr.success("Successful", Msg.hurrah);	           
	            $scope.myActivityReports.$setUntouched(true);
	            $scope.myActivityReports.$setPristine(true);
	            $scope.submitted = false;
	           // $scope.fileType = null;
	            $scope.toDate = moment(new Date()).format("DD-MM-YYYY")
	        	$scope.fromDate = moment().subtract(6, 'months').format('DD-MM-YYYY');
	        },function(err){
	        	$scope.myObject = {};
	        	//$scope.fileType = null;
	            $scope.toDate = moment(new Date()).format("DD-MM-YYYY")
	        	$scope.fromDate = moment().subtract(6, 'months').format('DD-MM-YYYY');
	        });
		}
	}
 }])
