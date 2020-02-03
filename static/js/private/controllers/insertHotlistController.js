'use strict';
angular.module('efrm.dashboard')
.controller('insertHotlistController', ['$scope', '$rootScope', 'toastr','$timeout', '$state', '$stateParams', 'statusService', 'UserService','AdminService','casesManagement', 'Msg','fileUpload','Validation','commonDataService',
	function($scope, $rootScope, toastr, $timeout, $state, $stateParams, statusService, UserService, AdminService,casesManagement, Msg, fileUpload,Validation, commonDataService){
	 $scope.init = function(){
	    	$(function () {
	    		setTimeout(function(){ $('#contact').val($('#contact').val()).trigger('change');}, 10);
	    	});
	    };
		
	var myJson = {}
	
	var hotlistDTOList = [];
	$scope.namedHotList = [];
	$scope.typeOfInput = 'single';
	$scope.showMiMaxDateMsg = false
	$scope.showToDateMessage = false;
	$scope.showNamedList = true;
	$scope.showfileuploadmessage = false;
	$scope.hotlist = {};
	$scope.someobj = {}
	$scope.userInformationDTO = {};
	$scope.isEntitySelected = true;
	 $scope.isEditable = false;
	 $scope.isMobile = false;
	 var orgId = commonDataService.getLocalStorage().orgId;
	 $scope.userId = commonDataService.getSessionStorage().userId;
	 $scope.desableme = true;
	 $scope.dateDisabled = true; 
    $scope.isEditable = false;
		$scope.fromDate='';
    
    $scope.chnageDate = function(){
    	$scope.dateDisabled = false;
    	var parts = $scope.hotlist.fromDate.split('-');
    	var mydate = new Date(parts[2], parts[1] - 1,parts[0] ); 
    var date = new Date( Date.parse( mydate ) ); 
   // date.setDate( date.getDate() + 1 );
    var mintoDate = date.toDateString(); 
    $scope.mintoDate = new Date( Date.parse( mintoDate ) );
    $scope.hotlist.toDate = '';
   
		/*if ($scope.hotlist.fromDate == '') {
		} else {
			if ($scope.hotlist.toDate == '') {
				$scope.fromDate = 'set';
			} else if($scope.hotlist.fromDate > $scope.hotlist.toDate)
			{
				$scope.hotlist.toDate = $scope.hotlist.fromDate;
				$scope.mintoDate= $scope.hotlist.fromDate;
				$scope.fromDate = 'set';
			}
		}*/
    }
	if($stateParams.editable != undefined && $stateParams.editable == 'Y'){
		$scope.isEditable = true;
		var rowdata = $stateParams.value;
		$scope.hotlist.id = rowdata.id;
		$scope.hotlist.hotlistTypeCd = rowdata.hotlistTypeCd;
		$scope.hotlist.hotlistValue = rowdata.hotlistValue;
		$scope.hotlist.fromDate = rowdata.fromDate;
		$scope.hotlist.toDate = rowdata.toDate;	
		$scope.hotlist.sourceChannel = rowdata.sourceChannel;	
		$scope.hotlist.code = rowdata.code;	
		$scope.init();
	}
	
	$scope.response = statusService.getResponseMessage();
	
	$rootScope.welcomeName = $scope.response.usersAuthoritiesPermissionsDto.firstName;
	
	$scope.hotlistTypeList = [
		{ name:"Hot List",val:"H"},
    	{ name:"White List",val:"W"},
    	{ name:"Common Point of Purchase",val:"CPP"},
    	{ name:"High Net-Worth Individual",val:"HNI"},
    	{ name:"Terrorist Funding",val:"TF"},
    	{ name:"Conditional hotlist",val:"COND"},
    	{ name:"Misused List",val:"MISU"}
    	
    ];
    
    $scope.statusList = [
		{ name:"ACTIVE",val:"ACTIVE"},
    	{ name:"PENDING",val:"PENDING_REVIEW"},
    	{ name:"DEACTIVATED",val:"DEACTIVATED"}
    ];
    
    //Get Organization//
    $scope.organisationName  = function(){
    	casesManagement.header().organisations( 
				{ 
					
					organisationID : orgId
				},
				function(response) {
	                         $scope.orgarnisations = response.response;

					},
				function(err) {
				});
    }
    
  //Get Channel//
    $scope.channelName  = function(){
		    casesManagement.header().channel( {},
					function(response) {
		                         //$scope.channel_code = response.response;
		    	var array = response.response;
                for(var i = array.length - 1; i >= 0; i--) {
                    if(array[i].channelCode === 'AEPS' || array[i].channelCode === 'NETC') {
                       array.splice(i, 1);
                    }
                }
                $scope.channel_code = array;
						},
					function(err) {
					});
    }
	
	$scope.getHotListEntity = function(selectedChannel){
		$scope.hotlist.code = null;
    	if(selectedChannel == "" || selectedChannel == undefined){
    		$scope.desableme = true;
    	}else{
    		$scope.desableme = false;
    		 casesManagement.header().hotListEntity(
    	  	 		   {
    	  	 			channel : selectedChannel
    	  		 		},
    	  		 		function(response) 
    	  		 		   {
    	  		 			$scope.hotlistEntityList = response.response.data;
    	  		 			
    	  			       },
    	  			 	function(err) 
    	  			 		{
    	  			 	    }
    	  	               );
    		
    	}
    }
	
    
    
	$scope.hotlistFormSubmit = function(){
		var myCode = $scope.hotlist.code;
		console.log($scope.hotlist)
		/*if($scope.hotlist.fromDate != null && $scope.hotlist.toDate == null){
			$scope.showToDateMessage = true;
		}else{*/
		myJson = {}
		hotlistDTOList = [];
		//ADDED NEW//
		/*$scope.desableme = true;
		$scope.isEntitySelected = true;
		$scope.isEntitySelected = true;*/
		// END HERE//
		
		/*if($scope.hotlist.fromDate != null && $scope.hotlist.toDate != null){
			var partscheck = $scope.hotlist.fromDate.split('-');
			var mydatecheck = new Date(partscheck[2], partscheck[1] - 1,partscheck[0] ); 
			var datecheck = new Date( Date.parse( mydatecheck ) ); 
			
			var topartscheck = $scope.hotlist.toDate.split('-');
			var tomydatecheck = new Date(topartscheck[2], topartscheck[1] - 1,topartscheck[0] ); 
			var todatecheck = new Date( Date.parse( tomydatecheck ) ); 
			if(new Date(todatecheck) < new Date(datecheck)){
				
				$scope.showMiMaxDateMsg = true;
			}else{
				$scope.showMiMaxDateMsg = false;
			}
		}*/
		//if($scope.showMiMaxDateMsg == false){
		if(!$scope.isEditable){
			if($scope.isMobile){
				$scope.hotlist.hotlistValue = "91"+$scope.hotlist.hotlistValue;
			}
			$scope.userInformationDTO.orgId = $scope.response.usersAuthoritiesPermissionsDto.orgId;
			$scope.userInformationDTO.userId = $scope.userId;
			$scope.userInformationDTO.actionType = "PENDING_REVIEW";
			//$scope.hotlist.userInformationDTO = $scope.userInformationDTO;
			/*if($scope.typeOfInput == "bulk"){
				delete $scope.hotlist["hotlistValue"];
			}*/
			if($scope.hotlist.code == 'others'){
				$scope.hotlist.code = $scope.hotlistName;
			}
			if($scope.hotlist.hotlistTypeCd == 'mid'){
				if($scope.hotlist.hotlistValue != null &&  typeof $scope.hotlist.hotlistValue != 'undefined' ){
				if($scope.hotlist.hotlistValue.length < 15){
					var noOfSpace = 15 - $scope.hotlist.hotlistValue.length;
					 var finalCode = $scope.hotlist.hotlistValue
					  
					for(var i = 0; i<noOfSpace;i++){
						
						finalCode += " ";
					}
				  $scope.hotlist.hotlistValue = finalCode
				}
				}
			}
			if($scope.hotlist.hotlistTypeCd == 'payeeIfscAccountNo' || $scope.hotlist.hotlistTypeCd == 'payerIfscAccountNo'){
				console.log($scope.ifsc)
				console.log($scope.accountno)
				$scope.hotlist.hotlistValue = $scope.someobj.ifsc + $scope.someobj.accountno;
			}
			hotlistDTOList.push($scope.hotlist);
			myJson.userInformationDTO = $scope.userInformationDTO;
			myJson.hotlistDTOList = hotlistDTOList;
			if($scope.typeOfInput == 'single'){
				casesManagement.header().insertToHotlist(myJson, function(data) {
		            $scope.thisSession = data;
		            $scope.dateDisabled = true;
		            toastr.success("Insert To Hotlist Successful", Msg.hurrah);	           
		            $scope.hotlistForm.$setUntouched(true);
		            $scope.hotlistForm.$setPristine(true);
		            $scope.hotlist = {};	   
		            $scope.submitted = false;
		            $scope.showNamedList = true;
		            $scope.showToDateMessage = false;
		            $scope.someobj = {};
		        },function(err){
		        	$scope.ifsc = null;
		        	$scope.someobj = {};
		        });
			}else{
				if($scope.hotlist.actionType == 'add'){
					$scope.userInformationDTO.actionType = "PENDING_REVIEW";
				}else if($scope.hotlist.actionType == 'delete'){
					$scope.userInformationDTO.actionType = "PENDING_DEACTIVATION";
				}else{
					$scope.userInformationDTO.actionType = "REPLACED";
				}
				$scope.hotlist.userInformationDTO = $scope.userInformationDTO;
				$scope.uploadFile($scope.hotlist);
				//added Newly
				//$scope.typeOfInput = 'single';
			}
    	}else{
    		if($scope.isMobile){
				$scope.hotlist.hotlistValue = "91"+$scope.hotlist.hotlistValue;
			}
    		$scope.userInformationDTO.orgId = $scope.response.usersAuthoritiesPermissionsDto.orgId;
			$scope.userInformationDTO.userId = $scope.userId;
			$scope.userInformationDTO.actionType = "PENDING_REVIEW"
			//$scope.hotlist.userInformationDTO = $scope.userInformationDTO;
			hotlistDTOList.push($scope.hotlist);
			myJson.userInformationDTO = $scope.userInformationDTO;
			myJson.hotlistDTOList = hotlistDTOList;
			casesManagement.header().apprveRejectHotlist(myJson, function(data) {
	            $scope.thisSession = data;
	            $scope.desableme = true;
	    		$scope.isEntitySelected = true;
	    		$scope.isEntitySelected = true;
	            $scope.dateDisabled = true;
	            $scope.someobj = {};
	            toastr.success("Update To Hotlist Successful", Msg.hurrah);	           
	            $scope.typeOfInput == 'single'
	        },function(err){
	        	//$scope.hotlist.code = myCode;
	        });
    	}
		//}
	  //}
	}
    $scope.init = function(){
    	UserService.header({}).session({}, function(data){
		}, function(err){});
    	$scope.organisationName();
    	$scope.channelName();

    }
    
    
    $scope.backToList = function(){
    	$state.go('dashboard.hotlist');
    }
    $scope.init();
    
  $scope.chckValidation = function(selectedValue){
	  $scope.valueForValidation = selectedValue
	  $scope.hotlist.hotlistValue = null;
	  $scope.hotlist.code = null;
	  if(typeof selectedValue == "undefined"){
		  $scope.isEntitySelected = true;
		  $scope.isMobile = false;
	  }else{
		  $scope.isEntitySelected = false;
		    if(selectedValue == 'sourceChannel' || selectedValue =='state'){
		    	$scope.maxNo = 18;
		    	$scope.minNo = null;
				$scope.pattern = "^[A-Z a-z]*$"
				$scope.isMobile = false;
			}
		    if(selectedValue =='city'){
		    	$scope.maxNo = 13;
		    	$scope.minNo = null;
				$scope.pattern = "^[A-Z a-z 0-9]*$";
				$scope.isMobile = false;
			}
		    if(selectedValue =='country'){
		    	$scope.maxNo = 2;
		    	$scope.minNo = 2;
				$scope.pattern = "^[A-Z a-z 0-9]*$"
				$scope.isMobile = false;
			}
			if(selectedValue == 'aquirerRiskScore' || selectedValue == 'issuerRiskScore' || selectedValue == 'remitterRiskScore' ||selectedValue == 'beneficiaryRiskScore' ||selectedValue == 'finalRiskScore'){
				
				$scope.maxNo = 4;
				$scope.minNo = 4;
				//$scope.pattern = "^\d{0,3}(,\d{0,3}(,\d{0,3}(,\d{0,3}(,\d{0,3})?)?)?)?$"
				$scope.pattern = "^[0-9]*$"
				$scope.isMobile = false;
			}
			if(selectedValue == 'priority'){
				
				$scope.maxNo = 1;
				$scope.minNo = 1;
				$scope.pattern = "^[1-5]*$"
				$scope.isMobile = false;
			}
			if(selectedValue == 'issuerBin' ||  selectedValue == 'acquiringinstitutionid' || selectedValue == 'acquirerBin' || selectedValue =='bin'){
				
				$scope.maxNo = 6;	
				$scope.minNo = 6;
				$scope.pattern = "^[0-9]*$"
				$scope.isMobile = false;
			}
			if(selectedValue == 'mcc' ){
				
				$scope.maxNo = 4;	
				$scope.minNo = 4;
				$scope.pattern = "^[0-9]*$"
				$scope.isMobile = false;
			}
			if(selectedValue == 'AcquiringinstitutionCountrycode'){
				
				$scope.maxNo = 3;	
				$scope.minNo = 3;
				$scope.pattern = "^[0-9]*$"
				$scope.isMobile = false;
			}
			if(selectedValue == 'remitterNbin' || selectedValue == 'beneficiaryNbin'){
				
				$scope.maxNo = 4;	
				$scope.minNo = 4;
				$scope.pattern = "^[A-Z a-z 0-9]*$"
				$scope.isMobile = false;
			}
			if(selectedValue == 'productCd'){
				
				$scope.maxNo = 4;	
				$scope.minNo = 4;
				$scope.pattern = "^[0-9]*$"
				$scope.isMobile = false;
			}
			if(selectedValue == 'cardnumber'){
				
				$scope.maxNo = 19;	
				$scope.minNo = 14;
				$scope.pattern = "^[0-9]*$"
				$scope.isMobile = false;
			}
			if(selectedValue == 'payerIfscAccountNo' || selectedValue == 'payeeIfscAccountNo'){
				
				$scope.maxNo = 40;	
				$scope.minNo = null;
				$scope.pattern = "^[A-Z a-z 0-9]*$";
				$scope.isMobile = false;
			}
		if(selectedValue == 'RemitterMMIDAndMobilenumber'){
				
				$scope.maxNo = 19;	
				$scope.minNo = null;
				$scope.pattern = "^[A-Z a-z 0-9]*$";
				$scope.isMobile = false;
			}
			if(selectedValue == 'acqInstIdMidTid'){
				$scope.maxNo = 34;	
				$scope.minNo = null;
				$scope.pattern = "^[A-Z a-z 0-9]*$";
				$scope.isMobile = false;
			}
			if(selectedValue == 'acqInstIdMid'){
				$scope.maxNo = 26;	
				$scope.minNo = null;
				$scope.pattern = "^[A-Z a-z 0-9]*$";
				$scope.isMobile = false;
			}
			if(selectedValue == 'payeeIfsc' || selectedValue == 'payerIfsc'){
				
				$scope.maxNo = 11;
				$scope.minNo = 11;
				$scope.pattern = "^[A-Z a-z 0-9]*$";
				$scope.isMobile = false;
			}
			/*if(selectedAttribute == 'assignedTo'){
				
				$scope.maxNo = 1000;	
				$scope.pattern = "/^[_a-zA-Z0-9]+(\.[_a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,4}),$/"
			}*/
			if(selectedValue == 'payerPspCd'||  selectedValue =='payeeDeviceId' || selectedValue == 'caseId'   || selectedValue =='MerchantBusinessType' || selectedValue =='caseType' || selectedValue =='amlType' ||  selectedValue == 'payergeocode'|| selectedValue == 'txnDate' || selectedValue == 'txnId' || selectedValue == 'caseStatus'  || selectedValue == 'state'  || selectedValue == 'amlType' || selectedValue == 'caseType' || selectedValue == 'assignedTo' ||  selectedValue == 'locked' ||  selectedValue == 'hold' ){
				$scope.maxNo = 100;
				$scope.minNo = null;
				
				$scope.pattern = null
				$scope.isMobile = false;
				
			}
			if(selectedValue == 'payerMobile' || selectedValue == 'payeeMobile'){
				
				$scope.maxNo = 10;
				$scope.minNo = 10;
				$scope.isMobile = true;
				$scope.pattern = "^[0-9]*$"
			}
			/*if(selectedValue == 'txnAmount' ){
				
				$scope.maxNo = 12;
				$scope.pattern = "^[0-9]*$"
			}*/
			if( selectedValue == 'payeePspCd'){
				$scope.maxNo = 100;
				$scope.minNo = null;
				$scope.pattern = null;
				$scope.isMobile = false;
			}
			if( selectedValue == 'terminalOwnerName'){
				$scope.maxNo = 23;
				$scope.minNo = null;
				$scope.pattern = null;
				$scope.isMobile = false;
			}
			if(selectedValue =='payerVpa' || selectedValue == 'payeeVpa'){
				$scope.maxNo = 100;
				$scope.minNo = null;
				$scope.pattern = "^[0-9a-zA-Z.-]*[@][a-zA-Z]*$";
				$scope.isMobile = false;
			}
			if(selectedValue == 'mid'){
				$scope.maxNo = 15
				//$scope.minNo = 15;
				$scope.minNo = null;
				$scope.pattern = "^[0-9a-zA-Z ]*$";
				$scope.isMobile = false;
			}
			if(selectedValue == 'tid'){
				
				$scope.maxNo = 8;
				$scope.minNo = 8;
				$scope.pattern = "^[0-9a-zA-Z]*$";
				$scope.isMobile = false;
			}
			if(selectedValue == 'Pointofserviceentrymode'){
				
				$scope.maxNo = 3;
				$scope.minNo = 3;
				$scope.pattern = "^[0-9]*$";
				$scope.isMobile = false;
			}
			if(selectedValue == 'responsecode' || selectedValue == 'rrn'){
				
				$scope.maxNo = 100000000000;
				$scope.minNo = null;
				$scope.pattern = "^[0-9]*$";
				$scope.isMobile = false;
			}
			if(selectedValue == 'stip'){
				
				$scope.maxNo = 4;
				$scope.minNo = 4;
				$scope.pattern = "^[0-9]*$";
				$scope.isMobile = false;
			}
			if(selectedValue == 'pincode'){
				
				$scope.maxNo = 6;
				$scope.minNo = 6;
				$scope.pattern = "^[0-9]*$";
				$scope.isMobile = false;
			}
			
			if(selectedValue =='IPaddressforRuPay'){
				$scope.maxNo = 100;
				$scope.minNo = null;
				$scope.pattern = "^([0-9]{1,3})[.]([0-9]{1,3})[.]([0-9]{1,3})[.]([0-9]{1,3})$";
				$scope.isMobile = false;
			}
	  }

}
  $scope.uploadFile = function(myjson){
	  
      var file = $scope.myFile;
      if(typeof file != "undefined"){
      $scope.showfileuploadmessage = false;
      var uploadUrl = "/efrm/hotlist/frm-hotlist/1.0/bulkHotlist";
      fileUpload.uploadFileToUrl(file, uploadUrl,myjson);
      document.getElementById("myFile").value = "";
      $scope.typeOfInput = 'single';
      $scope.dateDisabled = true;
      $scope.hotlistForm.$setUntouched(true);
      $scope.hotlistForm.$setPristine(true);
      $scope.hotlist = {};	   
      $scope.submitted = false;
      $scope.showNamedList = true;
      $scope.showToDateMessage = false;
      }else{
      	$scope.showfileuploadmessage = true;
      }
  }
  
  $scope.changeListType = function(type){
	  if(type == "others"){
		  $scope.showNamedList = true;
		  $scope.namedHotList = []
		  casesManagement.header().getCustomHotList(
	  	 		   {
	  	 			organisationID : $scope.hotlist.orgId,
	  	 			channel : $scope.hotlist.sourceChannel,
	  	 			actionType:"ACTIVE",
	  	 			hotListEntity:$scope.hotlist.hotlistTypeCd,
	  	 			 },
	  		 		function(response) 
	  		 		   {
	  	 				 $scope.showDatatableForCustom = true;
	  	 				$scope.namedHotList = response.response;
	  		 			
	  		 			$scope.showNamedList = false;
	  			       },
	  			 	function(err) 
	  			 		{
	  			    	 $scope.showNamedList = true;
	  			    	 $scope.namedHotList = []
	  			 	    }
	  	               );
	  }else{
		  $scope.showNamedList = true; 
	  }
  }
  
  $scope.changeOrg = function(){
	  $scope.hotlist.code = null;
  }
  
  $scope.chckUpload = function(){
  	$scope.showfileuploadmessage = false;
  }
  
  $scope.changeNamedList = function(hotlistName){
	  $scope.hotlistName = hotlistName;
  }
  
  $scope.changeToDate = function(){
	  $scope.showToDateMessage = false;
  }
  
}])