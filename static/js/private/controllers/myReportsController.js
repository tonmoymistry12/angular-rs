'use strict';

angular.module('efrm.dashboard')
.controller('efrmMyReportsController',  [
	'$scope',
	'$state',
	'efrmReports', 
	'statusService',
	'UserService',
	'Session',
	'toastr',
	'RolePermissionMatrix',
	'commonDataService',
	
	function(
			$scope, 
			$state, 
			efrmReports,
			statusService, 
			UserService, 
			Session, 
			toastr,
			RolePermissionMatrix,
			commonDataService
			) {
		
		$scope.response = statusService.getResponseMessage();
		$scope.rolePermission = RolePermissionMatrix;
		$scope.authority = $scope.response.usersAuthoritiesPermissionsDto.authority;
		$scope.uID = commonDataService.getSessionStorage().userId
		$scope.orgId = commonDataService.getLocalStorage().orgId;
		var loggedInUser = $scope.response.usersAuthoritiesPermissionsDto;
		$scope.loggedInUserMail = loggedInUser.email;
		
		$scope.myReportsDto =JSON.stringify({
			  
			  requesterName : $scope.uID,
			  orgId: $scope.orgId,
			  
		}
			);
		
		efrmReports.header(localStorage.getItem("sessionToken")).myReports( {},$scope.myReportsDto,
				function(data) {
                     
			$scope.searchUserData = data.response
			
					
				},
				function(err) {
					
				});
		
		$scope.downloadReports = function(data){
			$scope.link = data.reportId;
			$scope.extn = data.reportMimetype;
			$scope.finalUrl = ''
			if($scope.extn == 'PDF'|| $scope.extn == 'pdf'){
				efrmReports.header(localStorage.getItem("sessionToken")).downloadReports({link : data.reportId,extn:data.reportMimetype},
						function(data) {
						 var byteCharacters = atob(data.response);
						 var byteNumbers = new Array(byteCharacters.length);
						 for (var i = 0; i < byteCharacters.length; i++) {
						        byteNumbers[i] = byteCharacters.charCodeAt(i);
						    }
						 var reports = new Uint8Array(byteNumbers);
						 var blob = new Blob([reports], {type: 'application/pdf'});
						 var url = URL.createObjectURL(blob);
						 window.open(url)
						},
						function(err) {
							
						});
			}
			if($scope.extn == 'EXCEL'|| $scope.extn == 'excel'){
				
				var filename = data.reportId;
				efrmReports.header(localStorage.getItem("sessionToken")).downloadReports({link : data.reportId,extn:data.reportMimetype},
						function(data) {
								var byteCharacters = atob(data.response);
								 var byteNumbers = new Array(byteCharacters.length);
								 for (var i = 0; i < byteCharacters.length; i++) {
								        byteNumbers[i] = byteCharacters.charCodeAt(i);
								    }
								 var reports = new Uint8Array(byteNumbers);
								
								 var blob = new Blob([reports], {type : 'application/vnd.ms-excel'});
				                var objectUrl = (window.URL || window.webkitURL).createObjectURL(blob);
				                var link = angular.element('<a/>');
				                link.attr({
				                    href : objectUrl,
				                    download : filename+'.xls'
				                })[0].click();
						},
						function(err) {
							
						});
				
			}
					
		}
	
	
}]);