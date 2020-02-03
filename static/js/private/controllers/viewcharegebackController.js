'use strict';
angular.module('efrm.dashboard')
.controller('viewcharegebackController', ['$scope', '$rootScope', 'toastr','$timeout', '$state', '$stateParams', 'statusService', 'UserService','AdminService','casesManagement', 'Msg','Validation','chargeBack','commonDataService',
	function($scope, $rootScope, toastr, $timeout, $state, $stateParams, statusService, UserService, AdminService,casesManagement, Msg, Validation,chargeBack, commonDataService){
	 $scope.init = function(){
	    	$(function () {
	    		setTimeout(function(){ $('#contact').val($('#contact').val()).trigger('change');}, 10);
	    	});
	    };
		
	
	
	 var orgId = commonDataService.getLocalStorage().orgId;
	 $scope.userId = commonDataService.getSessionStorage().userId;	
	 $scope.response = statusService.getResponseMessage();	
	 $rootScope.welcomeName = $scope.response.usersAuthoritiesPermissionsDto.firstName;
	 $scope.submitted = false;
	 $scope.showDatatable = false;
	 $scope.chargebackdata = [];
	    $scope.statusList = [			
	    	{ name:"ALL",val:"ALL"},
	    	{ name:"ACTIVE",val:"ACTIVE"},
	    	{ name:"DEACTIVATED",val:"DEACTIVE"}
	    ];
    
   
  //Get Channel//
   /* $scope.channelName  = function(){
		    casesManagement.header().channel( {},
					function(response) {
		                         $scope.channel_code = response.response;
						},
					function(err) {
					});
    }
    
    $scope.channelName();*/
	
    $scope.onChargeBackViewSubmit = function(){
    	$scope.submitted = true;
    	 $scope.showDatatable = true;
    	chargeBack.header().fetchChargeBackInformation(
    	 		   { channel : "RuPayAtm",
    	 			 status:$scope.selectedstatus
    		 		},
    		 		function(response) 
    		 		   {
    		 			$scope.chargebackdata= response.response;
    			       },
    			 	function(err) 
    			 		{
    			    	   $scope.chargebackdata = [];
    			    	   toastr.clear();
    			 	    }
    	               );
    }
	
    
    $scope.adjFormat = function(adjFormat){
    	if(adjFormat == 'B'){
    		return 'CHARGE BACK';
    	}
    }

    $scope.dateFormat = function(date){
    	var lastIndex = date.lastIndexOf(" ");

    	date = date.substring(0, lastIndex);
    	return date;
    }
    
    $scope.Export = function () {
        $("#charge_back_table").table2excel({
        	exclude: ".noExport",
            filename: "User_List.xls"
        });
    }
   
      
}])