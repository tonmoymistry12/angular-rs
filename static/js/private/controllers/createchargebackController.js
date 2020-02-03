'use strict';
angular.module('efrm.dashboard')
.controller('createchargebackController', ['$scope', '$rootScope', 'toastr','$timeout', '$state', '$stateParams', 'statusService', 'UserService','AdminService','casesManagement', 'Msg','fileUpload','chargeBack','Validation','commonDataService',
	function($scope, $rootScope, toastr, $timeout, $state, $stateParams, statusService, UserService, AdminService,casesManagement, Msg,fileUpload,chargeBack, Validation, commonDataService){
	 $scope.init = function(){
	    	$(function () {
	    		setTimeout(function(){ $('#contact').val($('#contact').val()).trigger('change');}, 10);
	    	});
	    };
		
	
	
	 var orgId = commonDataService.getLocalStorage().orgId;
	 $scope.showFileUploadChargeback = false;
	 $scope.userId = commonDataService.getSessionStorage().userId;	
	 $scope.email = commonDataService.getLocalStorage().userEmail;	
	 $scope.response = statusService.getResponseMessage();	
	 $rootScope.welcomeName = $scope.response.usersAuthoritiesPermissionsDto.firstName;
	 $scope.submitted = false;
	 $scope.manuallyCreate = false;
	 $scope.fileUploaded = false;
	 $scope.showfileuploadmessage = false;
	 $scope.processMode = "REPLACE";
	 $scope.cardnumberList = [];
	 $scope.obj = {}
	 $scope.channelobj = {}
	 $scope.tags = [
		    
		  ];
	 var today = new Date();
	 var dd = today.getDate();

	 var mm = today.getMonth()+1; 
	 var yyyy = today.getFullYear();
	 if(dd<10) 
	 {
	     dd='0'+dd;
	 } 

	 if(mm<10) 
	 {
	     mm='0'+mm;
	 } 
	 $scope.cuurentDate = yyyy+'-'+mm+'-'+dd;
   
  //Get Channel//
    $scope.channelName  = function(){
		    casesManagement.header().channel( {},
					function(response) {
		                         $scope.channel_code = response.response;
						},
					function(err) {
					});
    }
    $scope.channelName();
    
    $scope.changeChannel = function(listName){
    	$scope.showFileUploadChargeback = false;
    	$scope.channelobj.listName = listName;
    	
    }
    
    $scope.onTagAdded = function($tag) {
        var currentId = 0;
        if ($scope.tags.length > 1) {
                  var previousTagIdx = $scope.tags.indexOf($tag) - 1;
                  var previousTag  = $scope.tags[previousTagIdx];
                  currentId = previousTag.id + 1;
          }
          $tag.id = currentId;
      }
	

    $scope.changeType = function(type){
    	$scope.channelobj.listName = null;
    	if(type == 'manual'){
    		$scope.manuallyCreate = true;
    		$scope.fileUploaded = false;
    		 $scope.tags = [];
    		 $scope.cardnumberList = [];
    		 $scope.selectedChannel = null;
    		 $scope.obj = {}
    	}if(type == 'uploaded'){
    		$scope.manuallyCreate = false;
    		$scope.fileUploaded = true;
    		 $scope.tags = [];
    		 $scope.cardnumberList = [];
    		 $scope.selectedChannel = null;
    		 $scope.obj = {}
    	}
    }
   
    $scope.changeProcessMode = function(processMode){
    	$scope.processMode = processMode;
    }
    
   
    
    $scope.uploadFile = function(){
        var file = $scope.myFile;
        if($scope.channelobj.listName == null || typeof $scope.channelobj.listName == 'undefiled'){
        	$scope.showFileUploadChargeback = true;
        }else{
        	$scope.showFileUploadChargeback = false;
        if(typeof file != "undefined"){
	        $scope.showfileuploadmessage = false;
	        var uploadUrl = "/efrm/case/frm/1.0/disputeInformation/uploadChargeBack"+"?processMode="+$scope.processMode+"&listName="+$scope.channelobj.listName;
	        fileUpload.uploadFileToUrl(file, uploadUrl,null);
	        document.getElementById("myFile").value = "";
	          $scope.selectedChannel = '';
			  $scope.channelobj = {};
			  $scope.processMode = "REPLACE"
	        }else{
	        	$scope.showfileuploadmessage = true;
	        }
        }
    }
    
    $scope.chckUpload = function(){
    	$scope.showfileuploadmessage = false;
    }
    
  $scope.onChargeBackSubmit = function(){
	  $scope.create = {}
	  $scope.userInformationDTO = {}
	  
	  for (var i = 0; i < $scope.tags.length; i++){
		  var obj = {};
		  obj.adjType = "B";
		  obj.adjDate = $scope.cuurentDate+" "+'00:00:00.000';
		  obj.shCRD = $scope.tags[i].text;
		  obj.channel = "RuPayAtm";
		  $scope.cardnumberList.push(obj);
	  }
	  $scope.create.processMode = $scope.processMode;
	  $scope.userInformationDTO.orgId = orgId;
	  $scope.userInformationDTO.userId = $scope.email;
	  $scope.userInformationDTO.channel = "RuPayAtm";
	  $scope.create.listName = $scope.channelobj.listName;
	  $scope.create.disputeInfoDTOList = $scope.cardnumberList;
	  $scope.create.userInformationDTO = $scope.userInformationDTO;
	  
	  chargeBack.header().createmanualChargeback({orgId:null,email:null}, $scope.create, function(data) {
			  $scope.tags = [];
			  $scope.cardnumberList = [];
			  $scope.create = {}
			  $scope.userInformationDTO = {}
			  $scope.selectedChannel = '';
			  $scope.channelobj = {};
			  $scope.processMode = "REPLACE"
			  $scope.submitted = false;
			  toastr.success(data.message, Msg.hurrah);
		},function(err){
			  $scope.tags = [];
			  $scope.cardnumberList = [];
			  $scope.create = {}
			  $scope.userInformationDTO = {}
			  $scope.selectedChannel = '';
			  $scope.channelobj = {};
			  $scope.processMode = "REPLACE"
			  $scope.submitted = false;
		});
	  
	 
	  
  }
 
   
      
}])