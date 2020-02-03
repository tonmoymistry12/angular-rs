'use strict';
angular.module('efrm.dashboard')
.controller('createQueueController', ['$scope','$rootScope','toastr','$state', '$stateParams','casesManagement','casesManagement2','QueueService','ruleManagement', 'statusService', 'UserService','Session', 'Msg','Validation','commonDataService',
	function($scope,$rootScope, toastr, $state, $stateParams,casesManagement, casesManagement2,QueueService,ruleManagement,statusService, UserService,Session, Msg, Validation,commonDataService){
	
	$scope.showForm = false;
	$scope.data =[];
	$scope.createQueue = {};
	$scope.userInformationDTO = {};
	var orgId = commonDataService.getLocalStorage().orgId;
	$scope.showDatatable = false;
	$scope.showChannels = false;
	$scope.showValueField = false
	$scope.disableTrue=true;
	$scope.showbtn = false;
	$scope.ïnValue = false;
	$scope.showErrormsg = false;
	$scope.showValidErrormsg = false;
	$scope.isPriority = false;
	$scope.organisationDisabled = false;
	$scope.pattern=""
	$scope.selectedChannel = '';
	$scope.overridingRulesList = [];
	$scope.showSubmitButton = true;
	$scope.submitted = false;
	$scope.isAutoEscalateDisabled = true; 
	$scope.isAutoExpire = "true"
	$scope.isAutoEscalate = "false"
	$scope.createQueue.escalateTime = null;
	$scope.model = {}
	$scope.model.allItemsSelected = false;
	$scope.organisationName  = function(){
    	casesManagement.header().organisations( 
				{ 
					
					organisationID : orgId,
					selectedOrgId:null
				},
				function(response) {
	                         $scope.orgarnisations = response.response;

					},
				function(err) {
				});
    }
	$scope.organisationName();
	
	$scope.isNpciLogin = function(){
		if(orgId !="NPCI"){
			
			$scope.createQueue.orgId = orgId;
			$scope.organisationDisabled = true;
		}else{
			$scope.organisationDisabled = false;
		}
	}
	$scope.isNpciLogin();
	
	$scope.changeAutoExpiry = function(expiry){
		
		if(expiry == "true"){
			$scope.createQueue.isAutoExpire = true;
			$scope.isAutoEscalateDisabled = true;
			$scope.isAutoEscalate = "false";
			$scope.isAutoExpire = "true";
			$scope.createQueue.isAutoEscalate = false;
			$scope.createQueue.escalateTime = null;
		}
		if(expiry == "false"){
			$scope.isAutoEscalateDisabled = false;
			$scope.createQueue.isAutoExpire = false;
			$scope.createQueue.isAutoEscalate = true;
			$scope.isAutoEscalate = "true";
			$scope.isAutoExpire = "false";
			$scope.createQueue.expireTime = null;
		}
	}
	
	$scope.changeAutoEsclate = function(exclate){
		
		if(exclate == "true"){
			$scope.isAutoEscalateDisabled = false;
			$scope.createQueue.isAutoEscalate = true;
			$scope.createQueue.isAutoExpire = false;
			$scope.isAutoExpire = "false";
			$scope.isAutoEscalate = "true";
			$scope.createQueue.expireTime = null;
		}
		if(exclate == "false"){
			$scope.createQueue.isAutoEscalate = false;
			$scope.isAutoEscalateDisabled = true;
			$scope.createQueue.isAutoExpire = true;
			$scope.isAutoExpire = "true";
			$scope.isAutoEscalate = "false";
			$scope.createQueue.escalateTime = null;
			
		}
		
	}
		
	function loadChannel(){
        casesManagement2.header().channel( {},
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
	loadChannel();
	$scope.choices = [{id: 'id', selectedAttribute: 'selectedAttribute',selectedExpression:'selectedExpression',value:null,pattern:null,maxNo:null}];
	   $scope.showRemoveButton = function(){
		   if($scope.choices.length > 1){
			   $scope.showbtn = true;
		   }
	   }
	   
	   $scope.addNewChoice = function() {
	     var newItemNo = $scope.choices.length+1;
	     $scope.choices.push({'id' : 'id'+ newItemNo , 'selectedAttribute' : 'selectedAttribute' , 'selectedExpression' : 'selectedExpression' , 'value':null,pattern:null,maxNo:null  });
	     
	     if($scope.choices.length > 1){
			   $scope.showbtn = true;   
		   }
	     
	   };
	   
	   $scope.removeNewChoice = function(choice) {
		     var newItemNo = $scope.choices.length-1;
		     if ( newItemNo !== 0 ) {
		     
		     for(var i=0 ; i < $scope.choices.length; i++) {
			        if($scope.choices[i].id== choice.id){
			        	
			          $scope.choices.splice(i,1);
	
			        }
			      }   
		     if($scope.choices.length == 1){
				   $scope.showbtn = false;
			   }
		   }
	   }
	   
	   $scope.showAddChoice = function(choice) {
	     return choice.id === $scope.choices[$scope.choices.length-1].id;
	     
	   };
	   
	$scope.binTypeValues = [
		{  name:"Credit",value:"C"},
        {  name:"Debit",value:"D"},
        {  name:"Prepaid",value:"P"}
	];
	
	 $scope.items = [
		 {  name:"1",value:"1"},
         {  name:"2",value:"2"},
         {  name:"3",value:"3"},
         {  name:"4",value:"4"},
         {  name:"5",value:"5"}
	 ];
	
	 $scope.expressionItems = [
		 {  name:"IN",value:"in"},
         {  name:">",value:">"},
         {  name:"=",value:"="},
         {  name:"<",value:"<"},
         {  name:"<=",value:"<="},
         {  name:">=",value:">="},
         {  name:"!=",value:"!="}
	 ]
	 
	 $scope.checkIn = function(check){
		 if(check != 'selectedExpression' || $scope.validationselectedAttribute != 'selectedAttribute'){
		 $scope.showValueField = true;
		 }if(check == 'selectedExpression' || $scope.validationselectedAttribute == 'selectedAttribute'){
			 $scope.showValueField = false;
		 }
		 $scope.showErrormsg = false;
		 $scope.showValidErrormsg = false;
		 if(check == "in"){
			 $scope.inValue = true;
			 $scope.noValidation = true;
		 }else{
			 $scope.inValue = false; 
			 for(var i=0 ; i < $scope.choices.length; i++) { 
		        	//$scope.cheangeTransaction($scope.choices[i].selectedAttribute);
			  		 if($scope.choices[i].selectedAttribute == 'sourceChannel' || $scope.choices[i].selectedAttribute =='city' || $scope.choices[i].selectedAttribute =='country' ||  $scope.choices[i].selectedAttribute =='state'){
							$scope.noValidation = false;
							$scope.choices[i].maxNo = 100;
							$scope.choices[i].pattern = "^[A-Z a-z]*$"
						}
			  		if($scope.choices[i].selectedAttribute == 'PanKeyMode'){
						
						$scope.noValidation = false;
						$scope.choices[i].maxNo = 2;
						$scope.choices[i].pattern = "^[0-9]*$"
					}
						if($scope.choices[i].selectedAttribute == 'aquirerRiskScore' || $scope.choices[i].selectedAttribute == 'issuerRiskScore' || $scope.choices[i].selectedAttribute == 'remitterRiskScore' ||$scope.choices[i].selectedAttribute == 'beneficiaryRiskScore' ||$scope.choices[i].selectedAttribute == 'finalRiskScore'){
							$scope.noValidation = false;
							$scope.choices[i].maxNo = 4;
							//$scope.pattern = "^\d{0,3}(,\d{0,3}(,\d{0,3}(,\d{0,3}(,\d{0,3})?)?)?)?$"
							$scope.choices[i].pattern = "^[0-9]*$"
						}
						if($scope.choices[i].selectedAttribute == 'priority'){
							$scope.noValidation = false;
							$scope.choices[i].maxNo = 1;	
							$scope.choices[i].pattern = "^[1-5]*$"
						}
						if($scope.choices[i].selectedAttribute == 'issuerBin' || $scope.choices[i].selectedAttribute == 'acquirerBin'){
							$scope.noValidation = false;
							$scope.choices[i].maxNo = 6;	
							$scope.choices[i].pattern = "^[0-9]*$"
						}
						if($scope.choices[i].selectedAttribute == 'mcc' ||  $scope.choices[i].selectedAttribute == 'acquiringinstitutionid' || $scope.choices[i].selectedAttribute == 'acquiringinstitutionid' || $scope.choices[i].selectedAttribute == 'AcquiringinstitutionCountrycode'){
							$scope.noValidation = false;
							$scope.choices[i].maxNo = 4;	
							$scope.choices[i].pattern = "^[0-9 ,]*$"
						}
						if($scope.choices[i].selectedAttribute == 'remitterNbin' || $scope.choices[i].selectedAttribute == 'beneficiaryNbin'){
							$scope.noValidation = false;
							$scope.choices[i].maxNo = 4;	
							$scope.choices[i].pattern = "^[A-Z a-z 0-9]*$"
						}
						if($scope.choices[i].selectedAttribute == 'productCd'){
							$scope.noValidation = false;
							$scope.choices[i].maxNo = 4;	
							$scope.choices[i].pattern = "^[0-9]*$"
						}
						if($scope.choices[i].selectedAttribute == 'terminalOwnerName'){
							$scope.noValidation = false;
							$scope.choices[i].maxNo = 23;	
							$scope.choices[i].pattern = "^[A-Z a-z 0-9]*$"
						}
						if($scope.choices[i].selectedAttribute == 'cardNumber'){
							$scope.noValidation = false;
							$scope.choices[i].maxNo = 19;	
							$scope.choices[i].pattern = "^[0-9]*$"
						}
						if($scope.choices[i].selectedAttribute == 'payerIfscAccountNo' || $scope.choices[i].selectedAttribute == 'payeeIfscAccountNo'){
							$scope.noValidation = false;
							$scope.choices[i].maxNo = 500;	
							$scope.choices[i].pattern = "^[0-9 ,]*$"
						}
						if($scope.choices[i].selectedAttribute == 'payeeIfsc' || $scope.choices[i].selectedAttribute == 'payerIfsc'){
							$scope.noValidation = false;
							$scope.choices[i].maxNo = 11;	
							$scope.choices[i].pattern = "^[A-Z a-z 0-9]*$"
						}
						
						if($scope.choices[i].selectedAttribute == 'payerPspCd' || $scope.choices[i].selectedAttribute == 'caseId' || $scope.choices[i].selectedAttribute == 'RemitterMMIDAndMobilenumber' || $scope.choices[i].selectedAttribute =='IPaddressforRuPay' || $scope.choices[i].selectedAttribute =='MerchantBusinessType' || $scope.choices[i].selectedAttribute =='caseType' || $scope.choices[i].selectedAttribute =='amlType'  ||  $scope.choices[i].selectedAttribute == 'payergeocode'|| $scope.choices[i].selectedAttribute == 'txnDate' || $scope.choices[i].selectedAttribute == 'txnId' || $scope.choices[i].selectedAttribute == 'caseStatus'  || $scope.choices[i].selectedAttribute == 'amlType' || $scope.choices[i].selectedAttribute == 'caseType' || $scope.choices[i].selectedAttribute == 'assignedTo' ||  $scope.choices[i].selectedAttribute == 'locked' ||  $scope.choices[i].selectedAttribute == 'hold' ){
							$scope.choices[i].maxNo = 100;
							$scope.choices[i].pattern = null
							
						}
						if($scope.choices[i].selectedAttribute == 'payerMobile' || $scope.choices[i].selectedAttribute == 'payeeMobile'){
							$scope.noValidation = false;
							$scope.choices[i].maxNo = 10;
							$scope.choices[i].pattern = "^[0-9]*$"
						}
						
						if( $scope.choices[i].selectedAttribute == 'payeePspCd' || $scope.choices[i].selectedAttribute =='payerVpa' || $scope.choices[i].selectedAttribute == 'payeeVpa'){
							$scope.noValidation = false;
							$scope.choices[i].maxNo = 100;
							$scope.choices[i].pattern = "^[0-9]*$"
						}
						if($scope.choices[i].selectedAttribute == 'mid'){
							$scope.noValidation = false;
							$scope.choices[i].maxNo = 15;
							$scope.choices[i].pattern = "^[0-9a-zA-Z]*$"
						}
						if($scope.choices[i].selectedAttribute == 'tid'){
							
							$scope.noValidation = false;
							$scope.choices[i].maxNo = 8;
							$scope.choices[i].pattern = "^[0-9a-zA-Z]*$"
						}
						if($scope.choices[i].selectedAttribute == 'Pointofserviceentrymode'){
							$scope.noValidation = false;
							$scope.choices[i].maxNo = 3;
							$scope.choices[i].pattern = "^[0-9]*$"
						}
						if($scope.choices[i].selectedAttribute == 'responsecode' || $scope.choices[i].selectedAttribute == 'rrn'){
							$scope.noValidation = false;
							$scope.choices[i].maxNo = 100000000000;
							$scope.choices[i].pattern = "^[0-9]*$"
						}
						if($scope.choices[i].selectedAttribute == 'stip'){
							$scope.noValidation = false;
							$scope.choices[i].maxNo = 4;
							$scope.choices[i].pattern = "^[0-9]*$"
						}
						if($scope.choices[i].selectedAttribute == 'pincode'){
							$scope.noValidation = false;
							$scope.choices[i].maxNo = 6;
							$scope.choices[i].pattern = "^[0-9]*$"
						}
		      } 
			 
			
					
		 }
	 }
	 
	 $scope.cheangeTransaction = function(selectedAttribute){
		
		 for(var i=0 ; i < $scope.choices.length; i++){
			 
			 if($scope.choices[i].id == selectedAttribute.id){
				 $scope.choices[i].value = null;
				//new changes//
				 $scope.choices[i].pattern = null;
				 $scope.choices[i].maxNo = null;
				 //new changes end//
			 }
		 }
		
		 $scope.showErrormsg = false;
		 $scope.showValidErrormsg = false;
		$scope.validationselectedAttribute = selectedAttribute;
		for(var i=0 ; i < $scope.choices.length; i++) { 
        	//$scope.cheangeTransaction($scope.choices[i].selectedAttribute);
	  		if($scope.choices[i].selectedAttribute == 'sourceChannel' || $scope.choices[i].selectedAttribute =='city' || $scope.choices[i].selectedAttribute =='country' ||  $scope.choices[i].selectedAttribute =='state'){
				$scope.noValidation = false;
				$scope.choices[i].maxNo = 100;
				$scope.choices[i].pattern = "^[A-Z a-z]*$"
			}
	  		if($scope.choices[i].selectedAttribute == 'PanKeyMode'){
				
				$scope.noValidation = false;
				$scope.choices[i].maxNo = 2;
				$scope.choices[i].pattern = "^[0-9]*$"
			}
			if($scope.choices[i].selectedAttribute == 'aquirerRiskScore' || $scope.choices[i].selectedAttribute == 'issuerRiskScore' || $scope.choices[i].selectedAttribute == 'remitterRiskScore' ||$scope.choices[i].selectedAttribute == 'beneficiaryRiskScore' ||$scope.choices[i].selectedAttribute == 'finalRiskScore'){
				$scope.noValidation = false;
				$scope.choices[i].maxNo = 4;
				//$scope.pattern = "^\d{0,3}(,\d{0,3}(,\d{0,3}(,\d{0,3}(,\d{0,3})?)?)?)?$"
				$scope.choices[i].pattern = "^[0-9]*$"
			}
			if($scope.choices[i].selectedAttribute == 'priority'){
				$scope.noValidation = false;
				$scope.choices[i].maxNo = 1;	
				$scope.choices[i].pattern = "^[1-5]*$"
			}
			if($scope.choices[i].selectedAttribute == 'issuerBin' || $scope.choices[i].selectedAttribute == 'acquirerBin'){
				$scope.noValidation = false;
				$scope.choices[i].maxNo = 6;	
				$scope.choices[i].pattern = "^[0-9]*$"
			}
			if($scope.choices[i].selectedAttribute == 'mcc' ||  $scope.choices[i].selectedAttribute == 'acquiringinstitutionid' || $scope.choices[i].selectedAttribute == 'acquiringinstitutionid'  || $scope.choices[i].selectedAttribute == 'AcquiringinstitutionCountrycode'){
				$scope.noValidation = false;
				$scope.choices[i].maxNo = 4;	
				$scope.choices[i].pattern = "^[0-9 ,]*$"
			}
			
			if($scope.choices[i].selectedAttribute == 'remitterNbin' || $scope.choices[i].selectedAttribute == 'beneficiaryNbin'){
				$scope.noValidation = false;
				$scope.choices[i].maxNo = 4;	
				$scope.choices[i].pattern = "^[A-Z a-z 0-9]*$"
			}
			
			if($scope.choices[i].selectedAttribute == 'productCd'){
				$scope.noValidation = false;
				$scope.choices[i].maxNo = 4;	
				$scope.choices[i].pattern = "^[0-9]*$"
			}
			if($scope.choices[i].selectedAttribute == 'terminalOwnerName'){
				$scope.noValidation = false;
				$scope.choices[i].maxNo = 23;	
				$scope.choices[i].pattern = "^[A-Z a-z 0-9]*$"
			}
			if($scope.choices[i].selectedAttribute == 'cardNumber'){
				$scope.noValidation = false;
				$scope.choices[i].maxNo = 19;	
				$scope.choices[i].pattern = "^[0-9]*$"
			}
			if($scope.choices[i].selectedAttribute == 'payerIfscAccountNo' || $scope.choices[i].selectedAttribute == 'payeeIfscAccountNo'){
				$scope.noValidation = false;
				$scope.choices[i].maxNo = 500;	
				$scope.choices[i].pattern = "^[0-9 ,]*$"
			}
			if($scope.choices[i].selectedAttribute == 'payeeIfsc' || $scope.choices[i].selectedAttribute == 'payerIfsc'){
				$scope.noValidation = false;
				$scope.choices[i].maxNo = 11;	
				$scope.choices[i].pattern = "^[A-Z a-z 0-9]*$"
			}
			
			if($scope.choices[i].selectedAttribute == 'payerPspCd' || $scope.choices[i].selectedAttribute == 'payeePspCd' || $scope.choices[i].selectedAttribute == 'caseId' || $scope.choices[i].selectedAttribute == 'RemitterMMIDAndMobilenumber' || $scope.choices[i].selectedAttribute =='IPaddressforRuPay' || $scope.choices[i].selectedAttribute =='MerchantBusinessType' || $scope.choices[i].selectedAttribute =='caseType' || $scope.choices[i].selectedAttribute =='amlType' || $scope.choices[i].selectedAttribute == 'payergeocode'|| $scope.choices[i].selectedAttribute == 'txnDate' || $scope.choices[i].selectedAttribute == 'txnId' || $scope.choices[i].selectedAttribute == 'caseStatus' ||  $scope.choices[i].selectedAttribute == 'amlType' || $scope.choices[i].selectedAttribute == 'caseType' || $scope.choices[i].selectedAttribute == 'assignedTo' ||  $scope.choices[i].selectedAttribute == 'locked' ||  $scope.choices[i].selectedAttribute == 'hold' ){
				$scope.choices[i].maxNo = 100;
				$scope.choices[i].pattern = null
				
			}
			if($scope.choices[i].selectedAttribute == 'payerMobile' || $scope.choices[i].selectedAttribute == 'payeeMobile'){
				$scope.noValidation = false;
				$scope.choices[i].maxNo = 10;
				$scope.choices[i].pattern = "^[0-9]*$"
			}
			
			if(  $scope.choices[i].selectedAttribute =='payerVpa' || $scope.choices[i].selectedAttribute == 'payeeVpa'){
				$scope.noValidation = false;
				$scope.choices[i].maxNo = 100;
				$scope.choices[i].pattern = "^[0-9]*$"
			}
			if($scope.choices[i].selectedAttribute == 'mid'){
				$scope.noValidation = false;
				$scope.choices[i].maxNo = 15;
				$scope.choices[i].pattern = "^[0-9a-zA-Z]*$"
			}
			if($scope.choices[i].selectedAttribute == 'tid'){
				$scope.noValidation = false;
				$scope.choices[i].maxNo = 8;
				$scope.choices[i].pattern = "^[0-9a-zA-Z]*$"
			}
			if($scope.choices[i].selectedAttribute == 'Pointofserviceentrymode'){
				$scope.noValidation = false;
				$scope.choices[i].maxNo = 3;
				$scope.choices[i].pattern = "^[0-9]*$"
			}
			if($scope.choices[i].selectedAttribute == 'responsecode' || $scope.choices[i].selectedAttribute == 'rrn'){
				$scope.noValidation = false;
				$scope.choices[i].maxNo = 100000000000;
				$scope.choices[i].pattern = "^[0-9]*$"
			}
			if($scope.choices[i].selectedAttribute == 'stip'){
				$scope.noValidation = false;
				$scope.choices[i].maxNo = 4;
				$scope.choices[i].pattern = "^[0-9]*$"
			}
			if($scope.choices[i].selectedAttribute == 'pincode'){
				$scope.noValidation = false;
				$scope.choices[i].maxNo = 6;
				$scope.choices[i].pattern = "^[0-9]*$"
			}
      } 
	 }
	 
	 $scope.changeVlueOne = function(){
		 $scope.showErrormsg = false;
		 $scope.showValidErrormsg = false;
		 }
	 
	 
	
	
	$scope.doIfChecked = function(rule,isChecked){
		$scope.showErrormsg = false;
		 if(isChecked){
		      $scope.data.push(rule);
		      if($scope.data.length == $scope.overridingRulesList.length){
		    	  $scope.model.allItemsSelected = true;
		      }
		    } else {
		      // remove item
		    	
		    	$scope.model.allItemsSelected = false;
		      for(var i=0 ; i < $scope.data.length; i++) {
		        if($scope.data[i] == rule){
		        	
		          $scope.data.splice(i,1);

		        }
		      }   
		    }
	}
	
	$scope.changePriority = function(priority){
		
		$scope.createQueue.priority = priority;
		if(priority !=undefined){
		$scope.isPriority = true;
		}else{
			$scope.isPriority = false;
		}
		if(priority == "1"){
			$scope.isAutoExpire = "true"
			$scope.isAutoEscalate = "false"
			$scope.isAutoEscalateDisabled = true;
			$scope.createQueue.escalateTime = null;
			
			$scope.expireList =[ 
				 { name:"YES",value:"true"}
		         ];
		}else{
			
			
			$scope.isAutoEscalateDisabled = false;
			$scope.createQueue.isAutoEscalate = true;
			$scope.createQueue.isAutoExpire = false;
			$scope.isAutoExpire = "false";
			$scope.isAutoEscalate = "true";
			$scope.createQueue.expireTime = null;
		}
	}
	
	
	 $scope.changeChannel=function(channel){
		 //changes after channel change
		 $scope.ruleIdAllSelect = [];
		 $scope.data = [];
		 $scope.model.allItemsSelected = false;
		if($scope.createQueue.orgId != null){
		 var rules = {};
		 ruleManagement.header().viewRule({orgId:$scope.createQueue.orgId,channel:channel,status:'ACTIVE'},function(response){
			 var arrayList=[];
             if (response.response.data != null && !angular.isUndefined(response.response.data)) {
                 for (var i = 0; i < response.response.data.length; i++) {
                	 var rules = {};
                	 rules.ruleId = response.response.data[i].ruleId;
                	 rules.ruleDesc = response.response.data[i].ruleDesc;
                	 rules.ruleName = response.response.data[i].ruleName;
                	 arrayList.push(rules);
                	 $scope.ruleIdAllSelect.push(rules.ruleId);
                 }
                 $scope.overridingRulesList = arrayList;
                 
                 $scope.showDatatable = true;
                 //$scope.showChannels = true;
                
             }
		 } ,function (err) {
        	 $scope.showDatatable = false;
        	 //$scope.showChannels = false
         })
		}
		
		 //end here//
		
		 $scope.choices = [{id: 'id', selectedAttribute: 'selectedAttribute',selectedExpression:'selectedExpression',value:null,pattern:null,maxNo:null}];
		 if(channel == undefined){
			 $scope.showChnlmsg = true;
			 $scope.disableTrue = false;
			 $scope.showChannels = false
			// $scope.showDatatable = false;
		 }else{
		$scope.showChnlmsg = false;
		 $scope.disableTrue = true;
		 //$scope.showDatatable = true;
		 $scope.showChannels = true;
		$scope.channel = channel;
		if(channel == 'IMPS'){
			$scope.attributes = [
				 {  name:"Acquirer Bin",value:"acquirerBin"},
				 {  name:"Beneficiary NBIN",value:"beneficiaryNbin"},
				 {  name:"Beneficiary Risk Score",value:"beneficiaryRiskScore"},
				 {  name:"Country",value:"country"},
		         {  name:"MCC",value:"mcc"},	
		         {  name:"Model Score",value:"finalRiskScore"},			       
		         {  name:"Remitter Risk Score",value:"remitterRiskScore"},
		         {  name:"Remitter NBIN",value:"remitterNbin"},	       		        		       
		         {  name:"Source Channel",value:"sourceChannel"},		        
		         {  name:"TID",value:"tid"},
		         {  name:"Terminal Owner Name",value:"terminalOwnerName"},		      
		         {  name:"Transaction Amount",value:"txnAmount"}
		             
			]
		}if(channel == 'UPI'){
			$scope.attributes = [
				{  name:"Beneficiary Risk Score",value:"beneficiaryRiskScore"},
				{  name:"Model Score",value:"finalRiskScore"},
				{  name:"MCC",value:"mcc"},	
				{  name:"Payer Ifsc Code",value:"payerIfsc"},		       
		        {  name:"Payee Ifsc Code",value:"payeeIfsc"},
		        {  name:"Payer PSP Code",value:"payerPspCd"},
		        {  name:"Payee Psp Code",value:"payeePspCd"},
				{  name:"Remitter Risk Score",value:"remitterRiskScore"},
		        {  name:"Source Channel",value:"sourceChannel"},		      
		        {  name:"Transaction Amount",value:"txnAmount"}   
			]
			
		}if(channel == 'RuPayAtm' || channel == 'RuPayPos'){
			$scope.attributes = [
				{  name:"Acquirer Bin",value:"acquirerBin"},
				{  name:"Acquirer Risk Score",value:"aquirerRiskScore"},		        
		        {  name:"Country",value:"country"},
		        {  name:"City",value:"city"},
		        {  name:"Issuer Risk Score",value:"issuerRiskScore"},		       
		        {  name:"Issuing BIN",value:"issuerBin"},
		        {  name:"Model Score",value:"finalRiskScore"},
		        {  name:"MCC",value:"mcc"},	
		        {  name:"MID",value:"mid"},	
		        {  name:"Merchant pincode",value:"pincode"},
		        {  name:"Product Cd",value:"productCd"},
		        {  name:"State",value:"state"},		        
		        {  name:"Source Channel",value:"sourceChannel"},		        
		        {  name:"TID",value:"tid"},		        
		        {  name:"Terminal Owner Name",value:"terminalOwnerName"},
		        {  name:"Transaction Amount",value:"txnAmount"},
		        {  name:"CARD TYPE",value:"binType"},
		        {  name:"Pan Key Mode",value:"PanKeyMode"},
		        
		        		       
			]
			
		}
		
		
		
		 //var rules = {};
		/* if(channel !=null || channel != undefined){
			 $scope.disableTrue = false;
			 $scope.showDatatable = false;
		 }else{
			 $scope.showDatatable = true;
		 }*/
		/* ruleManagement.header().viewRule({orgId:$scope.createQueue.orgId,channel:channel,status:'ACTIVE'},function(response){
			 var arrayList=[];
             if (response.response.data != null && !angular.isUndefined(response.response.data)) {
                 for (var i = 0; i < response.response.data.length; i++) {
                	 var rules = {};
                	 rules.ruleId = response.response.data[i].ruleId;
                	 rules.ruleDesc = response.response.data[i].ruleDesc;
                	 rules.ruleName = response.response.data[i].ruleName;
                	 arrayList.push(rules);
                 }
                 $scope.overridingRulesList = arrayList;
                 $scope.showDatatable = true;
                
             }
		 }
         ,function (err) {
        	 $scope.showDatatable = false;
         })*/
		 }
	 }
	 
	 $scope.searchRule = function(channel){
		 $scope.model.allItemsSelected = false;
		$scope.ruleIdAllSelect = [];
		$scope.data = [];
		 var rules = {};
		 ruleManagement.header().viewRule({orgId:$scope.createQueue.orgId,channel:channel,status:'ACTIVE'},function(response){
			 var arrayList=[];
             if (response.response.data != null && !angular.isUndefined(response.response.data)) {
                 for (var i = 0; i < response.response.data.length; i++) {
                	 var rules = {};
                	 rules.ruleId = response.response.data[i].ruleId;
                	 rules.ruleDesc = response.response.data[i].ruleDesc;
                	 rules.ruleName = response.response.data[i].ruleName;
                	 arrayList.push(rules);
                	 $scope.ruleIdAllSelect.push(rules.ruleId);
                 }
                 $scope.overridingRulesList = arrayList;
                 $scope.showDatatable = true;
                 //$scope.showChannels = true;
                
             }
		 } ,function (err) {
        	 $scope.showDatatable = false;
        	 //$scope.showChannels = false
         })
	 }
	 $scope.convertRuleIDToName = function(ruleID){
		  for (var i = 0; i < $scope.overridingRulesList.length; i++) {
         	if($scope.overridingRulesList[i].ruleId == ruleID){
         		return $scope.overridingRulesList[i].ruleName;
         	}
          }
	 }
	 $scope.selectedUser = function(data){
			$scope.selectedusers = [];
			$scope.selectedusers = data;
		}

	 $scope.isCheckedQueue = function(ruleId){
		
	      var match = false;
	      if($scope.model.allItemsSelected){
	    	  match = true;
	      }else{
		      for(var i=0 ; i < $scope.data.length; i++) {
		    	if($scope.isEditable == false){  
			        if( $scope.data[i] == ruleId){
			        	
			        	match = true;
			        }
		    	}else{
		    		if( $scope.data[i] == ruleId){
			        	match = true;
			        }
		    	}
		      }
	      }  
	      return match;
	  }
	
    $scope.isEditable = false;
	if($stateParams.editable != undefined && $stateParams.editable == 'Y'){
		//$scope.showForm = false;
		$scope.isPriority = true;
		if($stateParams.viewable == 'Y'){
			//$("#createQueue :input").prop("disabled", true);
			$scope.showSubmitButton = false;
		}if($stateParams.viewable == 'N'){
			$scope.showSubmitButton = true;
		}
		$scope.isEditable = true;
		var queue = $stateParams.value;
		
		$scope.data = []
		$scope.createQueue.queueId = queue.queueId;
		$scope.createQueue.queueCode = queue.queueCode;
		$scope.createQueue.queueName = queue.queueName;
		$scope.createQueue.description = queue.description;
		$scope.createQueue.condition = queue.condition;		
		$scope.createQueue.queueTypeCd = queue.queueTypeCd;
		$scope.createQueue.orgId = queue.orgId;
		$scope.createQueue.priority = queue.priority.toString();
		$scope.createQueue.isAutoExpire = queue.isAutoExpire;
		if(queue.isAutoExpire == true){
			$scope.isAutoExpire = 'true';
			$scope.isAutoEscalateDisabled = true;
		}
		if(queue.isAutoExpire == false){
			$scope.isAutoExpire = 'false';
			$scope.isAutoEscalateDisabled = false;
		}
		
		if(queue.expireTime === 0 || queue.expireTime == null || queue.expireTime == undefined){
			
			$scope.createQueue.expireTime = null
		}else{
			$scope.createQueue.expireTime = queue.expireTime;
		}
		if(queue.escalateTime === 0 || queue.escalateTime == null || queue.escalateTime == undefined){
			$scope.createQueue.escalateTime = null;
		}
		else{
			$scope.createQueue.escalateTime = queue.escalateTime;
		}
		$scope.createQueue.isAutoEscalate = queue.isAutoEscalate;
		if(queue.isAutoEscalate == true){
			$scope.isAutoEscalate = 'true'
			$scope.isAutoEscalateDisabled = false;
		}
		if(queue.isAutoEscalate == false){
			$scope.isAutoEscalate = 'false';
			$scope.isAutoEscalateDisabled = true;
		}
		
		$scope.createQueue.queueAlert = queue.queueAlert;
		$scope.createQueue.selectedChannel = queue.userInformationDTO.channel;
		$scope.changeChannel($scope.createQueue.selectedChannel);
		$scope.searchRule($scope.createQueue.selectedChannel);
		
		if($scope.createQueue.queueTypeCd == "A"){
		$scope.data = $scope.createQueue.queueAlert.split(",");
		}if($scope.createQueue.queueTypeCd == "B"){
			$scope.data = $scope.createQueue.queueAlert.split(",");
			
			var str = $scope.createQueue.condition;
			
			if(str.includes("and")){
				var noOfCondition = str.split("and").length - 1
				var firstCondition =[]
				var splitNo;
				for (var i = 0; i < noOfCondition+1; i++) { 
					splitNo = i;
					firstCondition.push(getSecondPart(str));
					}
				var theObj;
				$scope.choices = [];
				for(var i = 0; i < firstCondition.length; i++){
					theObj = {};
					var str = firstCondition[i];
					if(str.includes(" in")){
					var truncateAfter1 = truncateBefore(firstCondition[i]," in");
					var truncateBefore1 = truncateAfter(firstCondition[i]," in");
					theObj.selectedExpression = "in"
					var firstremoveBracket = truncateAfter1.replace("[","");
					var removeEndBracket = firstremoveBracket.replace("]","");
					var afterTream = removeEndBracket.trim();
					//var value = truncateBefore(afterTream, ",")
					var value = afterTream
					theObj.value = value.trim();
					
					}
					if(str.includes("=")){
					var truncateAfter1 = truncateBefore(firstCondition[i],"=");
					var truncateBefore1 = truncateAfter(firstCondition[i],"=");
					theObj.selectedExpression = "="
					theObj.value = truncateAfter1.trim();
					}
					
					if(str.includes(">")){
						var truncateAfter1 = truncateBefore(firstCondition[i],">");
						var truncateBefore1 = truncateAfter(firstCondition[i],">");
						theObj.selectedExpression = ">"
						theObj.value = truncateAfter1.trim();
						}
					if(str.includes("<")){
						var truncateAfter1 = truncateBefore(firstCondition[i],"<");
						var truncateBefore1 = truncateAfter(firstCondition[i],"<");
						theObj.selectedExpression = "<"
						theObj.value = truncateAfter1.trim();
						}
					if(str.includes("<=")){
						var truncateAfter1 = truncateBefore(firstCondition[i],"<=");
						var truncateBefore1 = truncateAfter(firstCondition[i],"<=");
						theObj.selectedExpression = "<="
						theObj.value = truncateAfter1.trim();
						}
					if(str.includes(">=")){
						var truncateAfter1 = truncateBefore(firstCondition[i],">=");
						var truncateBefore1 = truncateAfter(firstCondition[i],">=");
						theObj.selectedExpression = ">="
						theObj.value = truncateAfter1.trim();
						}
					if(str.includes("!=")){
						var truncateAfter1 = truncateBefore(firstCondition[i],"!=");
						var truncateBefore1 = truncateAfter(firstCondition[i],"!=");
						theObj.selectedExpression = "!="
						theObj.value = truncateAfter1.trim();
						}
					
					var selectedAttribute = truncateBefore1.replace("$","");
					theObj.selectedAttribute = selectedAttribute.trim();
					theObj.id = 'id';
					$scope.choices.push(theObj);
					}
				
					
			}else{
				var theObj = {};
				$scope.choices = [];
				
				if(str.includes(" in")){
					var truncateAfter1 = truncateBefore(str," in");
					var truncateBefore1 = truncateAfter(str," in");
					theObj.selectedExpression = "in"
					var firstremoveBracket = truncateAfter1.replace("[","");
					var removeEndBracket = firstremoveBracket.replace("]","");
					var afterTream = removeEndBracket.trim();
					
					//var value = truncateBefore(afterTream, ",")
					var value = afterTream
					theObj.value = value.trim();
					}
				if(str.includes("=")){
					var truncateAfter1 = truncateBefore(str,"=");
					var truncateBefore1 = truncateAfter(str,"=");
					theObj.selectedExpression = "="
					theObj.value = truncateAfter1.trim();
					}
				if(str.includes(">")){
					var truncateAfter1 = truncateBefore(str,">");
					var truncateBefore1 = truncateAfter(str,">");
					theObj.selectedExpression = ">"
					theObj.value = truncateAfter1.trim();
					}
				if(str.includes("<")){
					var truncateAfter1 = truncateBefore(str,"<");
					var truncateBefore1 = truncateAfter(str,"<");
					theObj.selectedExpression = "<"
					theObj.value = truncateAfter1.trim();
					}
				if(str.includes("<=")){
					var truncateAfter1 = truncateBefore(str,"<=");
					var truncateBefore1 = truncateAfter(str,"<=");
					theObj.selectedExpression = "<="
					theObj.value = truncateAfter1.trim();
					}
				if(str.includes(">=")){
					var truncateAfter1 = truncateBefore(str,">=");
					var truncateBefore1 = truncateAfter(str,">=");
					theObj.selectedExpression = ">="
					theObj.value = truncateAfter1.trim();
					}
				if(str.includes("!=")){
					var truncateAfter1 = truncateBefore(str,"!=");
					var truncateBefore1 = truncateAfter(str,"!=");
					theObj.selectedExpression = "!="
					theObj.value = truncateAfter1.trim();
					}
				var selectedAttribute = truncateBefore1.replace("$","");
				theObj.selectedAttribute = selectedAttribute.trim();
				theObj.id = 'id';
				$scope.choices.push(theObj);
				
			}
		}if($scope.createQueue.queueTypeCd == "C"){
			
			var str = $scope.createQueue.condition;
			
			if(str.includes("and")){
				
				var noOfCondition = str.split("and").length - 1
				var firstCondition =[]
				var splitNo;
				for (var i = 0; i < noOfCondition+1; i++) { 
					splitNo = i;
					firstCondition.push(getSecondPart(str));
					}
				var theObj ;
				$scope.choices
				$scope.choices = [];
				for(var i = 0; i < firstCondition.length; i++){
					theObj = {};
					var str = firstCondition[i];
					if(str.includes(" in")){
					var truncateAfter1 = truncateBefore(firstCondition[i]," in");
					var truncateBefore1 = truncateAfter(firstCondition[i]," in");
					theObj.selectedExpression = "in"
					var firstremoveBracket = truncateAfter1.replace("[","");
					var removeEndBracket = firstremoveBracket.replace("]","");
					var afterTream = removeEndBracket.trim();
					
					//var value = truncateBefore(afterTream, ",")
					var value = afterTream;
					theObj.value = value.trim();
					
					}
					if(str.includes("=")){
					var truncateAfter1 = truncateBefore(firstCondition[i],"=");
					var truncateBefore1 = truncateAfter(firstCondition[i],"=");
					theObj.selectedExpression = "="
					theObj.value = truncateAfter1.trim();
					}
					
					if(str.includes(">")){
						var truncateAfter1 = truncateBefore(firstCondition[i],">");
						var truncateBefore1 = truncateAfter(firstCondition[i],">");
						theObj.selectedExpression = ">"
						theObj.value = truncateAfter1.trim();
						}
					if(str.includes("<")){
						var truncateAfter1 = truncateBefore(firstCondition[i],"<");
						var truncateBefore1 = truncateAfter(firstCondition[i],"<");
						theObj.selectedExpression = "<"
						theObj.value = truncateAfter1.trim();
						}
					if(str.includes("<=")){
						var truncateAfter1 = truncateBefore(firstCondition[i],"<=");
						var truncateBefore1 = truncateAfter(firstCondition[i],"<=");
						theObj.selectedExpression = "<="
						theObj.value = truncateAfter1.trim();
						}
					if(str.includes(">=")){
						var truncateAfter1 = truncateBefore(firstCondition[i],">=");
						var truncateBefore1 = truncateAfter(firstCondition[i],">=");
						theObj.selectedExpression = ">="
						theObj.value = truncateAfter1.trim();
						}
					if(str.includes("!=")){
						var truncateAfter1 = truncateBefore(firstCondition[i],"!=");
						var truncateBefore1 = truncateAfter(firstCondition[i],"!=");
						theObj.selectedExpression = "!="
						theObj.value = truncateAfter1.trim();
						}
					
					var selectedAttribute = truncateBefore1.replace("$","");
					theObj.selectedAttribute = selectedAttribute.trim();
					theObj.id = 'id';
					$scope.choices.push(theObj);
					}
				
					
			}else{
				var theObj = {};
				$scope.choices = [];
				if(str.includes(" in")){
					var truncateAfter1 = truncateBefore(str," in");
					
					var truncateBefore1 = truncateAfter(str," in");
					theObj.selectedExpression = "in"
					var firstremoveBracket = truncateAfter1.replace("[","");
					var removeEndBracket = firstremoveBracket.replace("]","");
					var afterTream = removeEndBracket.trim();
					//var value = truncateBefore(afterTream, ",")
					var value = afterTream;
					theObj.value = value.trim();
					
					}
				if(str.includes("=")){
					var truncateAfter1 = truncateBefore(str,"=");
					var truncateBefore1 = truncateAfter(str,"=");
					theObj.selectedExpression = "="
					theObj.value = truncateAfter1.trim();
					}
				if(str.includes(">")){
					var truncateAfter1 = truncateBefore(str,">");
					var truncateBefore1 = truncateAfter(str,">");
					theObj.selectedExpression = ">"
					theObj.value = truncateAfter1.trim();
					}
				if(str.includes("<")){
					var truncateAfter1 = truncateBefore(str,"<");
					var truncateBefore1 = truncateAfter(str,"<");
					theObj.selectedExpression = "<"
					theObj.value = truncateAfter1.trim();
					}
				if(str.includes("<=")){
					var truncateAfter1 = truncateBefore(str,"<=");
					var truncateBefore1 = truncateAfter(str,"<=");
					theObj.selectedExpression = "<="
					theObj.value = truncateAfter1.trim();
					}
				if(str.includes(">=")){
					var truncateAfter1 = truncateBefore(str,">=");
					var truncateBefore1 = truncateAfter(str,">=");
					theObj.selectedExpression = ">="
					theObj.value = truncateAfter1.trim();
					}
				if(str.includes("!=")){
					var truncateAfter1 = truncateBefore(str,"!=");
					var truncateBefore1 = truncateAfter(str,"!=");
					theObj.selectedExpression = "!="
					theObj.value = truncateAfter1.trim();
					}
				var selectedAttribute = truncateBefore1.replace("$","");
				theObj.selectedAttribute = selectedAttribute.trim();
				theObj.id = 'id';
				$scope.choices.push(theObj);
				
			}	
		}
		
		if(queue.queueTypeCd == 'C' || queue.queueTypeCd == 'B'){
			$scope.showValueField = true;
			if(queue.condition.includes("in")){
				$scope.noValidation = true
			}else{
				$scope.noValidation = false;
				for(var i=0 ; i < $scope.choices.length; i++) {
				if($scope.choices[i].selectedAttribute == 'sourceChannel' ||  $scope.choices[i].selectedAttribute =='city' || $scope.choices[i].selectedAttribute =='country' ||  $scope.choices[i].selectedAttribute =='state'){
					$scope.noValidation = false;
					$scope.choices[i].maxNo = 100;
					$scope.choices[i].pattern = "^[A-Z a-z]*$"
				}
				if($scope.choices[i].selectedAttribute == 'PanKeyMode'){
					
					$scope.noValidation = false;
					$scope.choices[i].maxNo = 2;
					$scope.choices[i].pattern = "^[0-9]*$"
				}
				if($scope.choices[i].selectedAttribute == 'aquirerRiskScore' || $scope.choices[i].selectedAttribute == 'issuerRiskScore' || $scope.choices[i].selectedAttribute == 'remitterRiskScore' ||$scope.choices[i].selectedAttribute == 'beneficiaryRiskScore' ||$scope.choices[i].selectedAttribute == 'finalRiskScore'){
					$scope.noValidation = false;
					$scope.choices[i].maxNo = 4;
					//$scope.pattern = "^\d{0,3}(,\d{0,3}(,\d{0,3}(,\d{0,3}(,\d{0,3})?)?)?)?$"
					$scope.choices[i].pattern = "^[0-9]*$"
				}
				if($scope.choices[i].selectedAttribute == 'priority'){
					$scope.noValidation = false;
					$scope.choices[i].maxNo = 1;	
					$scope.choices[i].pattern = "^[1-5]*$"
				}
				if($scope.choices[i].selectedAttribute == 'issuerBin' || $scope.choices[i].selectedAttribute == 'acquirerBin'){
					$scope.noValidation = false;
					$scope.choices[i].maxNo = 6;	
					$scope.choices[i].pattern = "^[0-9]*$"
				}
				if($scope.choices[i].selectedAttribute == 'mcc' || $scope.choices[i].selectedAttribute == 'acquiringinstitutionid' || $scope.choices[i].selectedAttribute == 'acquiringinstitutionid' || $scope.choices[i].selectedAttribute == 'AcquiringinstitutionCountrycode'){
					$scope.noValidation = false;
					$scope.choices[i].maxNo = 4;	
					$scope.choices[i].pattern = "^[0-9 ,]*$"
				}
				if($scope.choices[i].selectedAttribute == 'productCd'){
					$scope.noValidation = false;
					$scope.choices[i].maxNo = 4;	
					$scope.choices[i].pattern = "^[0-9]*$"
				}
				if($scope.choices[i].selectedAttribute == 'terminalOwnerName'){
					$scope.noValidation = false;
					$scope.choices[i].maxNo = 23;	
					$scope.choices[i].pattern = "^[A-Z a-z 0-9]*$"
				}
				if($scope.choices[i].selectedAttribute == 'remitterNbin' || $scope.choices[i].selectedAttribute == 'beneficiaryNbin'){
					$scope.noValidation = false;
					$scope.choices[i].maxNo = 4;	
					$scope.choices[i].pattern = "^[A-Z a-z 0-9]*$"
				}
				if($scope.choices[i].selectedAttribute == 'cardNumber'){
					$scope.noValidation = false;
					$scope.choices[i].maxNo = 19;	
					$scope.choices[i].pattern = "^[0-9]*$"
				}
				if($scope.choices[i].selectedAttribute == 'payerIfscAccountNo' || $scope.choices[i].selectedAttribute == 'payeeIfscAccountNo'){
					$scope.noValidation = false;
					$scope.choices[i].maxNo = 500;	
					$scope.choices[i].pattern = "^[0-9 ,]*$"
				}
				if($scope.choices[i].selectedAttribute == 'payeeIfsc' || $scope.choices[i].selectedAttribute == 'payerIfsc'){
					$scope.noValidation = false;
					$scope.choices[i].maxNo = 11;	
					$scope.choices[i].pattern = "^[A-Z a-z 0-9]*$"
				}
				
				if($scope.choices[i].selectedAttribute == 'payerPspCd' || $scope.choices[i].selectedAttribute == 'caseId' || $scope.choices[i].selectedAttribute == 'RemitterMMIDAndMobilenumber' || $scope.choices[i].selectedAttribute =='IPaddressforRuPay' || $scope.choices[i].selectedAttribute =='MerchantBusinessType' || $scope.choices[i].selectedAttribute =='caseType' || $scope.choices[i].selectedAttribute =='amlType'  ||  $scope.choices[i].selectedAttribute == 'payergeocode'|| $scope.choices[i].selectedAttribute == 'txnDate' || $scope.choices[i].selectedAttribute == 'txnId' || $scope.choices[i].selectedAttribute == 'caseStatus' || $scope.choices[i].selectedAttribute == 'amlType' || $scope.choices[i].selectedAttribute == 'caseType' || $scope.choices[i].selectedAttribute == 'assignedTo' ||  $scope.choices[i].selectedAttribute == 'locked' ||  $scope.choices[i].selectedAttribute == 'hold' ){
					$scope.choices[i].maxNo = 100;
					$scope.choices[i].pattern = null
					
				}
				if($scope.choices[i].selectedAttribute == 'payerMobile' || $scope.choices[i].selectedAttribute == 'payeeMobile'){
					$scope.noValidation = false;
					$scope.choices[i].maxNo = 10;
					$scope.choices[i].pattern = "^[0-9]*$"
				}
				
				if( $scope.choices[i].selectedAttribute == 'payeePspCd' || $scope.choices[i].selectedAttribute =='payerVpa' || $scope.choices[i].selectedAttribute == 'payeeVpa'){
					$scope.noValidation = false;
					$scope.choices[i].maxNo = 100;
					$scope.choices[i].pattern = "^[0-9]*$"
				}
				if($scope.choices[i].selectedAttribute == 'mid'){
					$scope.noValidation = false;
					$scope.choices[i].maxNo = 15;
					$scope.choices[i].pattern = "^[0-9a-zA-Z]*$"
				}
				if($scope.choices[i].selectedAttribute == 'tid'){
					$scope.noValidation = false;
					$scope.choices[i].maxNo = 8;
					$scope.choices[i].pattern = "^[0-9a-zA-Z]*$"
				}
				if($scope.choices[i].selectedAttribute == 'Pointofserviceentrymode'){
					$scope.noValidation = false;
					$scope.choices[i].maxNo = 3;
					$scope.choices[i].pattern = "^[0-9]*$"
				}
				if($scope.choices[i].selectedAttribute == 'responsecode' || $scope.choices[i].selectedAttribute == 'rrn'){
					$scope.noValidation = false;
					$scope.choices[i].maxNo = 100000000000;
					$scope.choices[i].pattern = "^[0-9]*$"
				}
				if($scope.choices[i].selectedAttribute == 'stip'){
					$scope.noValidation = false;
					$scope.choices[i].maxNo = 4;
					$scope.choices[i].pattern = "^[0-9]*$"
				}
				if($scope.choices[i].selectedAttribute == 'pincode'){
					$scope.noValidation = false;
					$scope.choices[i].maxNo = 6;
					$scope.choices[i].pattern = "^[0-9]*$"
				}
			}
				  
			}
			
		}
		 
		
	}
	
	$scope.response = statusService.getResponseMessage();
	
	$rootScope.welcomeName = $scope.response.usersAuthoritiesPermissionsDto.firstName;
	
	$scope.selectAll = function(){
		$scope.data = [];
		if($scope.model.allItemsSelected){
			$scope.isChecked = true;
			for (var i = 0; i < $scope.ruleIdAllSelect.length; i++) {
				$scope.data.push($scope.ruleIdAllSelect[i]);
			}
			
		}else{
			$scope.data = [];
			$scope.isChecked = false;
		}
	}
			
    $scope.createQueueSubmit = function(){
    	$scope.myPriority = $scope.createQueue.priority;
    	var priorityInnumber =  Number($scope.createQueue.priority);
    	
    	var newarray = $scope.data
    	
    	newarray = newarray.toString();
    	var myString;
    	var myStringForIn;
    	var myarray = []
    	for (var i = 0; i < $scope.choices.length; i++) {
    		if($scope.choices[i].selectedExpression == "in"){
    			myStringForIn = "$"+$scope.choices[i].selectedAttribute+" "+$scope.choices[i].selectedExpression+" "+"["+$scope.choices[i].value.replace(/,/g, '-')+"]";
    			
    			myarray.push(myStringForIn);
    		}else{
    		myString = "$"+$scope.choices[i].selectedAttribute+" "+$scope.choices[i].selectedExpression+" "+$scope.choices[i].value;
    		myarray.push(myString);
    		}
    		
    	}
    	var convertedString = myarray.toString();  	
    	var commaseparetedString = convertedString.replace(/,/g, ' and ');
    	var finalString = commaseparetedString.replace(/-/g, ',');
    	
    	if($scope.data.length == 0 && $scope.choices[0].selectedAttribute == "selectedAttribute"){
    		$scope.showErrormsg = true;
    		$scope.submitted = false;
    	}
    	if($scope.data.length != 0 && $scope.choices[0].selectedAttribute == "selectedAttribute" && $scope.channel != undefined){
    		
    		$scope.createQueue.priority = priorityInnumber;
    		$scope.createQueue.isAutoExpire = $scope.isAutoExpire;
    		$scope.createQueue.isAutoEscalate = $scope.isAutoEscalate;
    		$scope.createQueue.queueAlert = newarray;
    		$scope.createQueue.queueTypeCd = "A"
    		$scope.userInformationDTO.orgId = $scope.response.usersAuthoritiesPermissionsDto.orgId;
    		//$scope.userInformationDTO.userId = $scope.response.usersAuthoritiesPermissionsDto.email;
    		$scope.userInformationDTO.userId = commonDataService.getSessionStorage().userId;
    		$scope.userInformationDTO.actionType = "PENDING_REVIEW";
    		$scope.userInformationDTO.channel = $scope.channel ;
    		$scope.createQueue.userInformationDTO = $scope.userInformationDTO;
    		 if(!$scope.isEditable){
    		QueueService.header($scope.response.token).createQueue($scope.createQueue, function(data) {
	            $scope.thisSession = data;
	            	
	            if(!$scope.isEditable){
	            	toastr.success("Queue Created Successfully", Msg.hurrah);
	        		$scope.showDatatable = false;
	        		$scope.showChannels = false;
	        		$scope.createQueueForm.$setUntouched(true);
	 	            $scope.createQueueForm.$setPristine(true);
	 	            $scope.createQueue = {};	   
	 	            $scope.choices = [{id: 'id', selectedAttribute: 'selectedAttribute',selectedExpression:'selectedExpression',value:null}];
	 	            $scope.data = [];
	 	            $scope.isAutoExpire = undefined;
	 		   		$scope.isAutoEscalate = undefined;
	 		   		$scope.createQueue.selectedChannel = undefined;
	 	            $scope.isChecked = false;
	 	            $scope.model.allItemsSelected = false;
	 	            $scope.submitted = false;
	 	            $scope.isAutoExpire = "true"
	 	        	$scope.isAutoEscalate = "false"
	 	        	$scope.isPriority = false;
	 	            $scope.isAutoEscalateDisabled = true;
	 	            $scope.showValueField = false;
		 	       /*	$scope.expireList =[ 
		 	   			 { name:"YES",value:"true"},
		 	   	         {  name:"NO",value:"false"}
		 	   	         ];*/
		 	       //$state.go('dashboard.searchqueue');
	        	}if($scope.isEditable){
	        		toastr.success("Queue Updated Successfully", Msg.hurrah);
	        		
	        		$scope.showDatatable = true;
	        		$scope.showChannels = true;
	        		$scope.createQueue.priority = priorityInnumber.toString();
	        		localStorage.setItem("prev_path_Queue_view", "createEditQueue");
	        		 $state.go('dashboard.searchqueue');
	        	}
	           
	        },function(err){
	        	$scope.createQueue.priority = $scope.myPriority.toString();
	        });
    		 }
    		 if($scope.isEditable){
    			 QueueService.header($scope.response.token).updateQueue($scope.createQueue, function(data) {
    		            $scope.thisSession = data;
    		            	
    		            if(!$scope.isEditable){
    		            	toastr.success("Queue Created Successfully", Msg.hurrah);
    		        		$scope.showDatatable = false;
    		        		$scope.showChannels = false;
    		        		$scope.createQueueForm.$setUntouched(true);
    		 	            $scope.createQueueForm.$setPristine(true);
    		 	            $scope.createQueue = {};	   
    		 	            $scope.choices = [{id: 'id', selectedAttribute: 'selectedAttribute',selectedExpression:'selectedExpression',value:null}];
    		 	            $scope.data = [];
    		 	            $scope.isAutoExpire = undefined;
    		 		   		$scope.isAutoEscalate = undefined;
    		 		   		$scope.createQueue.selectedChannel = undefined;
    		 	            $scope.isChecked = false;
    		 	           $scope.model.allItemsSelected = false;
    		 	            $scope.submitted = false;
    		 	            $scope.isAutoExpire = "true"
    		 	        	$scope.isAutoEscalate = "false"
    		 	        	$scope.isPriority = false;
    		 	            $scope.isAutoEscalateDisabled = true;
    			 	       /*	$scope.expireList =[ 
    			 	   			 { name:"YES",value:"true"},
    			 	   	         {  name:"NO",value:"false"}
    			 	   	         ];*/
    			 	       //$state.go('dashboard.searchqueue');
    		        	}if($scope.isEditable){
    		        		toastr.success("Queue Updated Successfully", Msg.hurrah);
    		        		
    		        		$scope.showDatatable = true;
    		        		$scope.showChannels = true
    		        		$scope.createQueue.priority = priorityInnumber.toString();
    		        		localStorage.setItem("prev_path_Queue_view", "createEditQueue");
    		        		 $state.go('dashboard.searchqueue');
    		        	}
    		           
    		        },function(err){
    		        	$scope.createQueue.priority = $scope.myPriority.toString();
    		        });
    			 
    		 }
    	}
    	
    	if($scope.data.length == 0 && $scope.choices[0].selectedAttribute != "selectedAttribute" && $scope.channel != undefined){
    		for (var i = 0; i < $scope.choices.length; i++) {
    			if($scope.choices[i].selectedAttribute == "selectedAttribute" || $scope.choices[i].selectedExpression  == "selectedExpression" || $scope.choices[i].value == null  || $scope.choices[i].value == 'value' || $scope.choices[i].selectedExpression  == "in"){
    				if($scope.choices[i].selectedAttribute == "selectedAttribute" || $scope.choices[i].selectedExpression  == "selectedExpression" || $scope.choices[i].value == null){
    					$scope.showValidErrormsg = true;
    				}else{
    					$scope.showValidErrormsg = false;
    				}
    				if($scope.choices[i].selectedExpression  == "in"){
        				if($scope.choices[i].value == 'value' ||  $scope.choices[i].value == null ){
        					$scope.showValidErrormsg = true;	
        				}else{
        					$scope.showValidErrormsg = false;
        				}
        				
        			}else{
        				if($scope.choices[i].value == 'value' || $scope.choices[i].value == null){
        					$scope.showValidErrormsg = true
        				}else{
        					$scope.showValidErrormsg = false;
        				}
        				
        			}
    			}
    						
    		}
    		
    		if($scope.showValidErrormsg == false){
    		
    		$scope.createQueue.priority = priorityInnumber;
    		$scope.createQueue.isAutoExpire = $scope.isAutoExpire;
    		$scope.createQueue.isAutoEscalate = $scope.isAutoEscalate;
    		
    		$scope.createQueue.condition = finalString;
    		$scope.createQueue.queueTypeCd = "C"
    		$scope.userInformationDTO.orgId = $scope.response.usersAuthoritiesPermissionsDto.orgId;
    		//$scope.userInformationDTO.userId = $scope.response.usersAuthoritiesPermissionsDto.email;
    		$scope.userInformationDTO.userId = commonDataService.getSessionStorage().userId;
    		$scope.userInformationDTO.actionType = "PENDING_REVIEW";
    		$scope.userInformationDTO.channel = $scope.channel ;
    		$scope.createQueue.userInformationDTO = $scope.userInformationDTO;
    		if(!$scope.isEditable){
    		QueueService.header($scope.response.token).createQueue($scope.createQueue, function(data) {
	            $scope.thisSession = data;
	                       
	            if(!$scope.isEditable){
	            	toastr.success("Queue Created Successfully", Msg.hurrah);	
	        		$scope.showDatatable = false;
	        		$scope.showChannels = false;
	        		$scope.createQueueForm.$setUntouched(true);
	 	            $scope.createQueueForm.$setPristine(true);
	 	            $scope.createQueue = {};	   
	 	            $scope.choices = [{id: 'id', selectedAttribute: 'selectedAttribute',selectedExpression:'selectedExpression',value:null}];
	 	            $scope.data = [];
	 	            $scope.isAutoExpire = undefined;
	 		   		$scope.isAutoEscalate = undefined;
	 		   		$scope.createQueue.selectedChannel = undefined;
	 	            $scope.isChecked = false;
	 	           $scope.model.allItemsSelected = false;
	 	            $scope.submitted = false;
	 	            $scope.isAutoExpire = "true"
	 	        	$scope.isAutoEscalate = "false"
	 	        	$scope.isPriority = false;
	 	            $scope.isAutoEscalateDisabled = true;
	 	            $scope.showValueField = false;
		 	       /*	$scope.expireList =[ 
		 	   			 { name:"YES",value:"true"},
		 	   	         {  name:"NO",value:"false"}
		 	   	         ];*/
		 	      
	        	}if($scope.isEditable){
	        		toastr.success("Queue Updated Successfully", Msg.hurrah);
	        		 
	        		$scope.showDatatable = true;
	        		$scope.showChannels = true;
	        		$scope.createQueue.priority = priorityInnumber.toString();
	        		localStorage.setItem("prev_path_Queue_view", "createEditQueue");
	        		$state.go('dashboard.searchqueue');
	        	}
	        },function(err){
	        	$scope.createQueue.priority = $scope.myPriority.toString();
	        });
    		}
    		if($scope.isEditable){
    			QueueService.header($scope.response.token).updateQueue($scope.createQueue, function(data) {
    	            $scope.thisSession = data;
    	                       
    	            if(!$scope.isEditable){
    	            	toastr.success("Queue Created Successfully", Msg.hurrah);	
    	        		$scope.showDatatable = false;
    	        		$scope.showChannels = false
    	        		$scope.createQueueForm.$setUntouched(true);
    	 	            $scope.createQueueForm.$setPristine(true);
    	 	            $scope.createQueue = {};	   
    	 	            $scope.choices = [{id: 'id', selectedAttribute: 'selectedAttribute',selectedExpression:'selectedExpression',value:null}];
    	 	            $scope.data = [];
    	 	            $scope.isAutoExpire = undefined;
    	 		   		$scope.isAutoEscalate = undefined;
    	 		   		$scope.createQueue.selectedChannel = undefined;
    	 	            $scope.isChecked = false;
    	 	           $scope.model.allItemsSelected = false;
    	 	            $scope.submitted = false;
    	 	            $scope.isAutoExpire = "true"
    	 	        	$scope.isAutoEscalate = "false"
    	 	        	$scope.isPriority = false;
    	 	            $scope.isAutoEscalateDisabled = true;
    	 	            $scope.showValueField = false;
    		 	       /*	$scope.expireList =[ 
    		 	   			 { name:"YES",value:"true"},
    		 	   	         {  name:"NO",value:"false"}
    		 	   	         ];*/
    		 	      
    	        	}if($scope.isEditable){
    	        		toastr.success("Queue Updated Successfully", Msg.hurrah);
    	        		 
    	        		$scope.showDatatable = true;
    	        		$scope.showChannels = true;
    	        		$scope.createQueue.priority = priorityInnumber.toString();
    	        		localStorage.setItem("prev_path_Queue_view", "createEditQueue");
    	        		$state.go('dashboard.searchqueue');
    	        	}
    	        },function(err){
    	        	$scope.createQueue.priority = $scope.myPriority.toString();
    	        });
    			}
    		
    		}
    	}
    	if($scope.data.length != 0 && $scope.choices[0].selectedAttribute != "selectedAttribute" && $scope.channel != undefined){
    		for (var i = 0; i < $scope.choices.length; i++) {
    			if($scope.choices[i].selectedAttribute == "selectedAttribute" || $scope.choices[i].selectedExpression  == "selectedExpression" || $scope.choices[i].value == null  || $scope.choices[i].value == 'value' || $scope.choices[i].selectedExpression  == "in"){
    				if($scope.choices[i].selectedAttribute == "selectedAttribute" || $scope.choices[i].selectedExpression  == "selectedExpression" || $scope.choices[i].value == null){
    					$scope.showValidErrormsg = true;
    				}else{
    					$scope.showValidErrormsg = false;
    				}
    				if($scope.choices[i].selectedExpression  == "in"){
        				if($scope.choices[i].value == 'value' || $scope.choices[i].value == null ){
        					$scope.showValidErrormsg = true;	
        				}else{
        					$scope.showValidErrormsg = false;
        				}
        				
        			}else{
        				if($scope.choices[i].value == 'value' || $scope.choices[i].value == null){
        					$scope.showValidErrormsg = true
        				}else{
        					$scope.showValidErrormsg = false;
        				}
        				
        			}
    			}
    			
    		}
    	if($scope.showValidErrormsg == false){
    		$scope.createQueue.priority = priorityInnumber;
    		$scope.createQueue.isAutoExpire = $scope.isAutoExpire;
    		$scope.createQueue.isAutoEscalate = $scope.isAutoEscalate;
    		
    		$scope.createQueue.queueAlert = newarray;
    		$scope.createQueue.condition = finalString;
    		$scope.createQueue.queueTypeCd = "B"
    		$scope.userInformationDTO.orgId = $scope.response.usersAuthoritiesPermissionsDto.orgId;
    		//$scope.userInformationDTO.userId = $scope.response.usersAuthoritiesPermissionsDto.email;
    		$scope.userInformationDTO.userId = commonDataService.getSessionStorage().userId;
    		$scope.userInformationDTO.actionType = "PENDING_REVIEW";
    		$scope.userInformationDTO.channel = $scope.channel ;
    		$scope.createQueue.userInformationDTO = $scope.userInformationDTO;
    		if(!$scope.isEditable){
    		QueueService.header($scope.response.token).createQueue($scope.createQueue, function(data) {
    			
    			if(!$scope.isEditable){
    				toastr.success("Queue Created Successfully", Msg.hurrah);
	        		$scope.showDatatable = false;
	        		$scope.showChannels = false;
	        		$scope.createQueueForm.$setUntouched(true);
	 	            $scope.createQueueForm.$setPristine(true);
	 	            $scope.createQueue = {};	   
	 	            $scope.choices = [{id: 'id', selectedAttribute: 'selectedAttribute',selectedExpression:'selectedExpression',value:null}];
	 	            $scope.data = [];
	 	            $scope.isAutoExpire = undefined;
	 		   		$scope.isAutoEscalate = undefined;
	 		   		$scope.createQueue.selectedChannel = undefined;
	 	            $scope.isChecked = false;
	 	           $scope.model.allItemsSelected = false;
	 	            $scope.submitted = false;
	 	            $scope.isAutoExpire = "true"
	 	        	$scope.isAutoEscalate = "false"
	 	        	$scope.isPriority = false;
	 	            $scope.isAutoEscalateDisabled = true;
	 	            $scope.showValueField = false;
		 	       /*	$scope.expireList =[ 
		 	   			 { name:"YES",value:"true"},
		 	   	         {  name:"NO",value:"false"}
		 	   	         ];*/
		 	       //$state.go('dashboard.searchqueue');
	        	}if($scope.isEditable){
	        		toastr.success("Queue Updated Successfully", Msg.hurrah);
	        		$scope.showDatatable = true;
	        		$scope.showChannels = true;
	        		$scope.createQueue.priority = priorityInnumber.toString();
	        		localStorage.setItem("prev_path_Queue_view", "createEditQueue");
	        		$state.go('dashboard.searchqueue');
	        		
	        		
	        	}
	            
	        },function(err){
	        	$scope.createQueue.priority = $scope.myPriority.toString();
	        });
    		}if($scope.isEditable){
    			QueueService.header($scope.response.token).updateQueue($scope.createQueue, function(data) {
        			
        			if(!$scope.isEditable){
        				toastr.success("Queue Created Successfully", Msg.hurrah);
    	        		$scope.showDatatable = false;
    	        		$scope.showChannels = false
    	        		$scope.createQueueForm.$setUntouched(true);
    	 	            $scope.createQueueForm.$setPristine(true);
    	 	            $scope.createQueue = {};	   
    	 	            $scope.choices = [{id: 'id', selectedAttribute: 'selectedAttribute',selectedExpression:'selectedExpression',value:null}];
    	 	            $scope.data = [];
    	 	            $scope.isAutoExpire = undefined;
    	 		   		$scope.isAutoEscalate = undefined;
    	 		   		$scope.createQueue.selectedChannel = undefined;
    	 	            $scope.isChecked = false;
    	 	           $scope.model.allItemsSelected = false;
    	 	            $scope.submitted = false;
    	 	            $scope.isAutoExpire = "true"
    	 	        	$scope.isAutoEscalate = "false"
    	 	        	$scope.isPriority = false;
    	 	            $scope.isAutoEscalateDisabled = true;
    		 	       /*	$scope.expireList =[ 
    		 	   			 { name:"YES",value:"true"},
    		 	   	         {  name:"NO",value:"false"}
    		 	   	         ];*/
    		 	       //$state.go('dashboard.searchqueue');
    	        	}if($scope.isEditable){
    	        		toastr.success("Queue Updated Successfully", Msg.hurrah);
    	        		$scope.showDatatable = true;
    	        		$scope.showChannels = true;
    	        		$scope.createQueue.priority = priorityInnumber.toString();
    	        		localStorage.setItem("prev_path_Queue_view", "createEditQueue");
    	        		$state.go('dashboard.searchqueue');
    	        	}
    	            
    	        },function(err){
    	        	$scope.createQueue.priority = $scope.myPriority.toString();
    	        });
    		}
    	}
    	}
    
    };
    
    function truncateBefore(str, pattern) {
		  return str.slice(str.indexOf(pattern) + pattern.length);
		}

		  function truncateAfter (str, pattern) {
		  return str.slice(0, str.indexOf(pattern));
		} 
	  
function getSecondPart(str) {
	
  return str.split('and')[splitNo];
}
    $scope.backPage = function(){
    	
    	if(localStorage.getItem("prev_path_Queue") == 'viewQueue'){
    	localStorage.setItem("prev_path_Queue_view", "createEditQueue");
    	$state.go('dashboard.searchqueue');
    	
    	}else{
    		localStorage.setItem("prev_path_Queue_Edit_view", "createEditQueue");
    		$state.go('dashboard.approvependingqueue');
    	}
    }
    $scope.init = function(){
    	UserService.header({}).session({}, function(data){
		}, function(err){});
    	
    	 if($scope.choices.length > 1){
			   $scope.showbtn = true;
		   }
    }
  
    $scope.init();
    
    
   
}])