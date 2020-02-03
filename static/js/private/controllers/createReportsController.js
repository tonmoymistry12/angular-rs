'use strict';

angular.module('efrm.dashboard')
.controller('efrmCerateReportsController',  [
	'$scope', 
	'$state',
	'efrmReports', 
	'statusService',
	'UserService',
	'Session',
	'toastr',
	'casesManagement',
	'Msg',
	'RolePermissionMatrix',
	'$timeout',
	'alertService',
	'commonDataService',
	
     function(
			$scope, 
			$state, 
			efrmReports,
			statusService, 
			UserService, 
			Session, 
			toastr,
			casesManagement,
			Msg,
			RolePermissionMatrix,
			$timeout,
			alertService,
			commonDataService
			) {
		
		$scope.isSaved = false;
	var initialize = function()
	  {
		 			$scope.fieldMsg = false;
					$scope.isChanged = false;
					$scope.response = statusService.getResponseMessage();
					$scope.rolePermission = RolePermissionMatrix;
					$scope.authority = $scope.response.usersAuthoritiesPermissionsDto.authority;
					$scope.uID = commonDataService.getSessionStorage().userId;
					var loggedInUser = $scope.response.usersAuthoritiesPermissionsDto;
					$scope.loggedInUserMail = loggedInUser.email;
					$scope.reccur_val = {}
					$scope.reccur_val.value = 'true';
					$scope.fieldType = {};
					$scope.fieldValue = [];
					$scope.orgId = commonDataService.getLocalStorage().orgId;
					$scope.showme_flag = false;
					$scope.showme_flag2 = false;
					$scope.showThreshold = false;
					$scope.filteredData = [];
					$scope.orgarnisations = [];
					$scope.setAvailable_fld_flag = true;
					$scope.requestedField = {}
					$scope.requestedField = $scope.selectedPeopleSimple;
					$scope.min = 1;
					$scope.max = 999;
					$scope.issuer = [];
					$scope.issuer.prop = {};
					$scope.acquirer = [];
					$scope.acquirer.prop = {}
					$scope.someObject = { selectedPeopleSimple: [] };
					$scope.someObject.tags = [];
					$scope.someObject.threshold = 500;
					$scope.someObject.upi_final_risk_score = 500;
					$scope.someObject.remitterRuleScore = 500;
					$scope.someObject.beneficiaryRuleScore = 500;
					//$scope.someObject.Acq_mcc = '';
					$scope.tags = [];
					$scope.disableChannel = false;
					$scope.someObject.setitundefined='';
					$scope.required = true;
					$scope.optionalInputs = null;
					$scope.hidesummry_report =true
					$scope.someObject.mid_data = '';
					$scope.someObject.tid_data ='';
					$scope.case_channel_val = '';
					$scope.showScoreType = false;
					$scope.someObject.model = true;
					$scope.someObject.counter = 1;
					$scope.someObject.hidedatePicker = true;
					$scope.filetype_flag = false;
					$scope.enable_email = true;
					$scope.someObject.counterinhrs = 1;
					//$scope.showRecurrencefld= true;
					$scope.showRecurrencefld= false;
					$scope.recurrenceData = [
							/*{name: 'Hour/Hours', value: 'H'},
							{name: 'Day/Days', value: 'D'},
							{name: 'Month/Months', value: 'M'},*/
						{name: 'Hour(s)', value: 'H'},
						{name: 'Day(s)', value: 'D'},
						{name: 'Month(s)', value: 'M'},
						];
					//$scope.someObject.amlType_data="ÄLL"
					//$scope.fraudType ="ALL"	
					$scope.recRange = 24;
					$scope.someObject.recr_value = $scope.recurrenceData[0];
					$scope.someObject.fromDate2 = moment().subtract(1, 'days').format("DD-MM-YYYY")
					$scope.someObject.toDate1 = moment(new Date()).format("DD-MM-YYYY")
					//$scope.someObject.fromDate1 = moment().subtract(6, 'months').format('DD-MM-YYYY');
					$scope.someObject.fromDate1 = moment().subtract(7, 'days').format('DD-MM-YYYY');
					
					/*Fetching all reports data in one go*/
					if($scope.isSaved == false){
					        efrmReports.header($scope.response.token).viewReports( { orgId : $scope.orgId },
									function(response) 
									    {
						                  $scope.reports_data = response.response;
						                },
									function(err) {
									});	
        
					}else{
						$scope.selectedStatus = null;
					}
					/* Frequency field*/
					        $scope.setInterval = function(reccur_val)
					        {
					        	$scope.isChanged = true
					        	//if(reccur_val == false) cahange by debashis
					        	if(reccur_val == 'true')
								    {  $scope.someObject.recr_value.value = null
					        	     	$scope.showRecurrencefld = false;
								    	$scope.someObject.counter = null;
								    	$scope.someObject.counterinhrs = null;
								    	
									}
					        	//if(reccur_val == true) cahange by debashis
								if(reccur_val == 'false')
									
								    {
									
							    	//$scope.someObject.counterinhrs = 24;
									 $scope.showRecurrencefld = true;
									 $scope.someObject.recr_value = $scope.recurrenceData[0];
									  $scope.someObject.counter = 1;
									  $scope.someObject.counterinhrs = 1
									  
								    	if($scope.selectedStatus.reportName == 'CALLING_REPORT' || $scope.selectedStatus.reportName == 'TAGGED_TRANSACTIONS_REPORT'){
								    		
								    	 $scope.someObject.counterinhrs = 24;
								    	 $scope.someObject.counter = 24;
								    	// $scope.someObject.fromDate2 = moment(new Date()).format("DD-MM-YYYY")
								    	 $scope.someObject.fromDate2 = moment().subtract(1, 'days').format("DD-MM-YYYY") 
								    	}
									}
					        }
		
					/*Get Bank Organization List*/
					 $scope.getAllOrg = function(){
						 $scope.all_orgarnisations='';
						 casesManagement.header($scope.response.token).organisations( 
									{ 
										
										organisationID : $scope.orgId
									},
									function(response) {
						                         $scope.all_orgarnisations = response.response;
						                         $scope.enable_email = true;
						                         if($scope.selectedReporType == 'CALLING REPORT' || $scope.selectedReporType == 'AML TYPE REPORT' || $scope.selectedReporType == 'TAGGED TRANSACTIONS REPORT'){
													 $scope.enable_email = false;
												 }
										},
									function(err) {
									});
						 
					 }   
					 //new changes //
					// $scope.getAllOrg();
        
					/*check on organization change */       
					$scope.change_orgID = function(case_orgId)
					        {
						       if(case_orgId){
						    	   $scope.organisationID = case_orgId.orgId;
									
									casesManagement.header($scope.response.token).unCases_dropdown(
									 		{
									 			loggedInOrgId:$scope.orgId,
									 			selectedOrgId : $scope.organisationID
									 			
									 		},
									 		function(response) {

									 			$scope.userEmail = response.response;
									 			$scope.loadUsers($scope.userEmail);
									 			$scope.enable_email = false;

									 		},
									 		function(err) {
									 			
									 		});
						       }
						       else{
						    	   $scope.enable_email = true;
						       }
								
							}
					
					/*Get User List */
					$scope.loadUsers = function(data) {
						var data = data.map((x)=>{ return x.email;});
						$scope.email_length = data.length;
						
						$scope.searchPeople = function(term) {
							
						    var search_term = term.toUpperCase();
						    $scope.people = [];
						    
						    angular.forEach(data, function(item) {
						      if (item.toUpperCase().indexOf(search_term) >= 0)
						        $scope.people.push(item);

						    });
                            
						    return $scope.people;
						  };
						};
					
					/*check on AML change */
					/*$scope.setAml = function()
						      {
							      $scope.amlType = $scope.someObject.amlType_data.amlTypeCd;
								  
							  }
*/
					/*set Fraud Type*/
					$scope.setFraud = function(fraud_data)
							{
						if(fraud_data){
							$scope.fraudType = fraud_data.fraudTypeCd;
						}
						else
						{
							$scope.fraudType = 'ALL';
						}
						
								
							}

					$scope.setAml = function(aml_data){
						if(aml_data)
						{
							$scope.someObject.amlType_data2 = aml_data.amlTypeCd;
						}
						else
						{
							$scope.someObject.amlType_data = 'ALL';
						}
						
					}
					
                  /* set issuer and acquirer
					$scope.setAcq_issue = function(acq_issue)
							     {
									 $scope.filtered_bankdata = [];
									 $scope.filtered_bankdata = acq_issue;
									 $scope.acquirer_data = $scope.filtered_bankdata.filter((x)=>{ return (x.orgId == $scope.orgId); })
									 $scope.acquirer.prop = $scope.acquirer_data[0];
									 $scope.issuer.prop = $scope.acquirer_data[0];
									 casesManagement.header($scope.response.token).unCases_dropdown(
										 		{
										 			loggedInOrgId:$scope.orgId,
										 			selectedOrgId : $scope.issuer.prop.orgId
										 			
										 		},
										 		function(response) {

										 			$scope.userEmail = response.response;
										 			$scope.loadUsers($scope.userEmail);
										 			$scope.enable_email = false;

										 		},
										 		function(err) {
										 			
										 		});
								}*/
		

					/*onchange of Acquirer*/
					/*$scope.change_acuirer = function(case_orgId)
							   {
								 if($scope.orgId != 'NPCI')
								   {
									  $scope.issuer.prop = $scope.acquirer_data[0];
										   	 
								   }
							   }*/
					/*onchange of Issuer*/
					/*$scope.change_issuer = function(case_orgId)
						    {
							 
							  if($scope.orgId != 'NPCI' )
									 {
										$scope.acquirer.prop =  $scope.acquirer_data[0];
										$scope.organisationID = $scope.acquirer.prop.orgId;
									 }
							 $scope.organisationID = case_orgId.prop.orgId;
							  casesManagement.header($scope.response.token).unCases_dropdown(
								 		{
								 			loggedInOrgId:$scope.orgId,
								 			selectedOrgId : case_orgId.prop.orgId
								 			
								 		},
								 		function(response) {

								 			$scope.userEmail = response.response;
								 			$scope.loadUsers($scope.userEmail);
								 			$scope.enable_email = false;

								 		},
								 		function(err) {
								 			
								 		});
						    }*/
					/*onChange of Remitter*/
					$scope.onChangeofRemitter = function(remitterOrgId)
					{
						casesManagement.header($scope.response.token).unCases_dropdown(
						 		{
						 			loggedInOrgId:$scope.orgId,
						 			selectedOrgId : remitterOrgId.orgId
						 			
						 		},
						 		function(response) {

						 			$scope.userEmail = response.response;
						 			$scope.loadUsers($scope.userEmail);
						 			$scope.enable_email = false;

						 		},
						 		function(err) {
						 			
						 		});
					}
					
					/*onChange of Beneficery*/
					$scope.onChangeOfBeneficiary = function(beneficiaryOrgId)
					{
						//do nothing
					}

					/*from date change*/
					$scope.frmDate = function (fromDate)
						  {
						        if(fromDate){
						        	$scope.FromDateValue=[];
									$scope.FromDateValue = fromDate.split("-")
									$scope.someObject.momentFromDate=$scope.FromDateValue[2]+"-"+$scope.FromDateValue[1]+"-"+$scope.FromDateValue[0];
									
									var partscheck = $scope.someObject.fromDate1.split('-');
									var mydatecheck = new Date(partscheck[2], partscheck[1] - 1,partscheck[0] ); 
									var datecheck = new Date( Date.parse( mydatecheck ) ); 
									
									var topartscheck = $scope.someObject.toDate1.split('-');
									var tomydatecheck = new Date(topartscheck[2], topartscheck[1] - 1,topartscheck[0] ); 
									var todatecheck = new Date( Date.parse( tomydatecheck ) ); 
									if(new Date(todatecheck) < new Date(datecheck)){
										
										$scope.showMiMaxDateMsg = true;
									}else{
										$scope.showMiMaxDateMsg = false;
									}
									var parts = $scope.someObject.fromDate1.split('-');
									var mydate = new Date(parts[2], parts[1] - 1,parts[0] ); 
								var date = new Date( Date.parse( mydate ) ); 
								date.setDate( date.getDate() + 1 );
								var mintoDate = date.toDateString(); 
								$scope.mintoDate = new Date( Date.parse( mintoDate ) );
						        }
						        
					      }

					/*To Date change*/
					$scope.toDate = function(toDate)
						  {
						      
						     if(toDate){

							      $scope.ToDateValue=[];
								  $scope.ToDateValue = toDate.split("-")
								  $scope.someObject.momentToDate=$scope.ToDateValue[2]+"-"+$scope.ToDateValue[1]+"-"+$scope.ToDateValue[0];
								  var partscheck = $scope.someObject.fromDate1.split('-');
									var mydatecheck = new Date(partscheck[2], partscheck[1] - 1,partscheck[0] ); 
									var datecheck = new Date( Date.parse( mydatecheck ) ); 
									
									var topartscheck = $scope.someObject.toDate1.split('-');
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
				/*Method on change of Recurrence*/
				$scope.recr_Chng = function(value){
					if(value.value=='H')
					{
						$scope.recRange = 24;
						$scope.someObject.counter = 1;
					}
					if(value.value=='D'){
						$scope.recRange = 31;
						$scope.someObject.counter = 1;
					}
					if(value.value=='M')
					{
						$scope.recRange = 6;	
						$scope.someObject.counter = 1;
					}
					else{
						$scope.someObject.counter=null;
					}
										
					
				}	
					

				/*Method on change of report Type*/
						  
				$scope.chngStatus = function(selectedReport)
					{
					
								$scope.channel_name=[];
								
								if(selectedReport)
								{
									
									if(selectedReport.reportName == 'CALLING_REPORT' || selectedReport.reportName == 'TAGGED_TRANSACTIONS_REPORT'){
								    	$scope.someObject.counterinhrs = 24;
								    	 $scope.someObject.counter = 24;
								    	}else{
								    		$scope.someObject.counterinhrs = 1;
									    	 $scope.someObject.counter = 1;
								    	}
									$scope.filetype_flag = false;
									
									$scope.showhrRecurrence = false;
									$scope.hidesummry_report = true; // default value set for summy and detail report
									$scope.disableChannel= false;   //default value set for Channel
									$scope.hideorg_drp = true;
									//$scope.enable_email=true;
									$scope.someObject.hidedatePicker = true;
									$scope.someObject.tags ='';
									$scope.selectedReporType = selectedReport.channels[0].reportName;
									$scope.selectedReporType_underscore = selectedReport.channels[0].reportType;
									$scope.channel_data = $scope.reports_data.filter((x)=> x.channels[0].reportName == $scope.selectedReporType )
									$scope.channel_code = $scope.channel_data.map((item)=> item.channels);
									$scope.getAllOrg();
									if($scope.selectedReporType == 'EFRM STATISTICS REPORT' ||  $scope.selectedReporType == 'CALLING REPORT' || $scope.selectedReporType == 'TAGGED TRANSACTIONS REPORT' || $scope.selectedReporType == 'RULE EFFICIENCY REPORT')
									{
										$scope.hidesummry_report = false;
									}
										
									 if($scope.selectedReporType == 'CALLING REPORT' || $scope.selectedReporType == 'AML TYPE REPORT' || $scope.selectedReporType == 'TAGGED TRANSACTIONS REPORT'){
										  
										   $scope.orgName = { orgId:'NPCI' }
										   $scope.change_orgID($scope.orgName);
										   $scope.hideorg_drp = false;
										   //$scope.getAllOrg();
									   }
									/*if($scope.selectedReporType == 'RTD REPORT' || $scope.selectedReporType == 'FRAUD CARD REPORT' )
									{
										//$scope.hideorg_drp = false;
										Get All Bank List
										efrmReports.header($scope.response.token).getallbank({ },
													function(response) 
													 {
														$scope.orgarnisations = response.response;
										                $scope.setAcq_issue($scope.orgarnisations)    
										             },
													function(err) 
													{ }
										          );	
									}*/
									
									if($scope.selectedReporType == 'UPI FRAUD DETAIL REPORT')
									{
										$scope.hideorg_drp = false;
										
									}
									
									if($scope.selectedReporType == 'PERIMETER REPORT' || $scope.selectedReporType == 'CALLING REPORT' || $scope.selectedReporType == 'TAGGED TRANSACTIONS REPORT' ) 
									   {
							              $scope.showhrRecurrence = true;
								       }
									
									
									$scope.channel_name = $scope.channel_code[0].map((x)=>x.channel)
									/* store true or false if channel has NA value in it*/
									$scope.check_channel = $scope.channel_name.map((x)=>{ return (x.channelCode=='N/A') });
									
									/*if channel length==1 then assigning the value to the model*/
									if($scope.channel_name.length == 1 && $scope.check_channel[0]==false) //condition to check if channel returns 1 object without NA.
										 { 
											$scope.someObject.case_channel=$scope.channel_name[0];
											$scope.disableChannel = true;//hide channel
											
											$scope.setChannel_Value=$scope.channel_name[0].channelCode;
											$scope.filteredDataSet($scope.selectedReporType_underscore, $scope.setChannel_Value ) 
											$scope.showme_flag = true;
											$scope.showme_flag2=true;
											
										 }
									
									
									
								   if($scope.check_channel[0]==true) //condition to check if channel has NA
											{  
									          
									            $scope.disableChannel = true;//hide channel
												$scope.showme_flag = true;
												$scope.showme_flag2 = true;
												$scope.someObject.case_channel = $scope.channel_name[0];
												$scope.setChannel_Value = $scope.channel_name[0].channelCode;
												$scope.filteredDataSet($scope.selectedReporType_underscore, $scope.setChannel_Value ) 
												
											}
										
									
								   if($scope.channel_name.length > 1)
									{
										$scope.required = true;
										$scope.disableMe = false;
									    $scope.showme_flag = true;
									    $scope.someObject.case_channel = $scope.channel_name[0];
									    $scope.setChannel_Value = $scope.channel_name[0].channelCode;
										$scope.filteredDataSet($scope.selectedReporType_underscore, $scope.setChannel_Value ) // (value, undefined)
									}
								   if($scope.reportMimeType == 'EXCEL'){
								   $scope.someObject.selectedPeopleSimple = $scope.available_fields	
								   }
								  
								 if(selectedReport.reportName == 'POS_MERCHANT_SALES_VALUE_REPORT' || selectedReport.reportName == 'ECOM_MERCHANT_SALES_VALUE_REPORT' || selectedReport.reportName == 'REMITTER_REPORT' || selectedReport.reportName == 'ATM_WITHDRAWAL_REPORT' ) 
									   {
									
									 		$scope.reccur_val.value = 'true';
									 		$scope.showRecurrencefld = false
									
									   }
								
								}
				else
					{
					
						  initialize();
					}
					
	     }
				/* *************************************** End of Method change report type ******************************************************************* */

				/*Method on change of channel*/
				$scope.change_channel = function(case_channel)
				{    $scope.showme_flag2 = false;
					
					if(case_channel)//checks if it has data or undefined
					{
						
					    $scope.filteredDataSet($scope.selectedReporType_underscore, case_channel.channelCode )
						$scope.showme_flag2 = true;
					    if($scope.selectedReporType == 'AML TYPE REPORT')
					     {
								
								
								alertService.header($scope.response.token).amlList(
								{
									channel : case_channel.channelCode
								},
								function(response) {
							                         
							                          $scope.amldata = response.response.data;
							                       },
								function(err) {
										});
							}
					}
					
					
					else
					{
						initialize();
					}
				}

               /* ******************************************** End of Method on change of channel ********************************************************************** */

				$scope.setmcc = function(mcc_data)
				{
					if(mcc_data)
					  {
						$scope.someObject.tid_data=null;
					  }
				}
				$scope.setMid = function(mid_data)
				{
					if(mid_data)
					  {
						$scope.someObject.tid_data=null;
					  }
				}

				$scope.setTid = function(tid_data)
				{
					if(tid_data)
					  {
						$scope.someObject.mcc_data=null;
						$scope.someObject.mid_data = null;
					  }
				}

				$scope.setRuleScore = function(ruleScore){
					$scope.showScoreType = true;
					$scope.ruleScore = ruleScore;
				}


				/*Method to get the filtered data on based of channel & report type selection */
				$scope.filteredDataSet = function(reportType, channelCode){
				
					if(reportType && channelCode)
					{
						
						$scope.case_channel_val = channelCode;
						$scope.showme_flag2 = true;
						$scope.listType = reportType;
						$scope.mndt_flag=false;
						$scope.filteredData = $scope.channel_code[0].filter((x)=> x.channel.channelCode == channelCode)
					    
						if($scope.filteredData.length >= 1)
						  {
							$scope.available_fields = $scope.filteredData[0].data.fieldsAvailable;
							
								if($scope.available_fields[0].fields=='N/A')
									{
									
									$scope.mndt_flag=true;
									}
								else
								   {
									$scope.mndt_flag=false;
								   }
							 $scope.mandtry_avlflds = $scope.available_fields.filter((x)=>{
									 return (x.primary == true);
								 });
							 
							 if(typeof $scope.someObject.selectedtype != 'undefined' || typeof $scope.filteredData != 'undefined'){
								 if(typeof $scope.someObject.selectedtype != 'undefined'){
							 	if($scope.someObject.selectedtype.fields == 'EXCEL'){
							 		
							 		$scope.someObject.selectedPeopleSimple = $scope.available_fields;
							 	}else{
							 		
								$scope.someObject.selectedPeopleSimple = $scope.mandtry_avlflds;
							 	}
								 }else{
									 
							 	if($scope.filteredData[0].data.avilableMimeType[0].fields == 'EXCEL'){
							 		
							 		$scope.someObject.selectedPeopleSimple = $scope.available_fields;
							 	}else{
							 		
								$scope.someObject.selectedPeopleSimple = $scope.mandtry_avlflds;
							 	}
								 }
							 }else{
								 $scope.someObject.selectedPeopleSimple = $scope.mandtry_avlflds;
							 }
								$scope.file_type = $scope.filteredData[0].data.avilableMimeType;
								
								if($scope.file_type.length==1){
									
									
									$scope.someObject.selectedtype = $scope.file_type[0];
									$scope.reportMimeType = $scope.file_type[0].fields;
									$scope.filetype_flag = true;
								}
							    $scope.trans_period = $scope.filteredData[0].data.reportSinceAvailable;
							   // alert($scope.trans_period.length)
							    $scope.avlFields=$scope.someObject.selectedPeopleSimple;
								$scope.avlFields = $scope.avlFields.map((x)=>{
									return x.fields;
								})
								
								var passFieldavailable = $scope.avlFields ;
								$scope.makemetoPipeFormat(passFieldavailable);
						}
						else
						{
							$scope.showme_flag2 = false;
							
						}
						
						if(reportType == 'EFRM STATISTICS REPORT' ||  reportType == 'CALLING REPORT' || reportType == 'TAGGED TRANSACTIONS REPORT')
						{
							
							$scope.hidesummry_report = false;
						}
						
					
						if($scope.selectedReporType == 'AML TYPE REPORT')
						     {
									
									
									alertService.header($scope.response.token).amlList(
									{
										channel : $scope.case_channel_val
									},
									function(response) {
								                         
								                          $scope.amldata = response.response.data;
								                       },
									function(err) {
											});
								}
						 if($scope.selectedReporType == 'FRAUD TYPE REPORT' || $scope.selectedReporType == 'TXN WISE FRAUD REPORT' || $scope.selectedReporType == 'FRAUD CARD REPORT' )
						 {
						      	
						      	alertService.header($scope.response.token).fraudList( {
						      		channel : $scope.case_channel_val
						      	},
											function(response) {
							                                     $scope.fraudData = response.response.data;
								                               },
											function(err) { });
						  }
						 
						 if($scope.selectedReporType == 'PERIMETER REPORT' || $scope.selectedReporType == 'CALLING REPORT' || $scope.selectedReporType == 'TAGGED TRANSACTIONS REPORT' ) 
						   {
								$scope.someObject.hidedatePicker = false;
								
						   }
						
						 
				
					}
					else{
						
						return false;
					}
					
					
			 }

					$scope.makemetoPipeFormat = function(passFieldavailable){
						$scope.avlFieldsNew = passFieldavailable.toString();
					    $scope.avlFieldsNew = $scope.avlFieldsNew.replace(/,/g, "|");	
					    $scope.sendfieldWithPipe = $scope.avlFieldsNew;
						
					}
				
					$scope.setFileType = function(filetype){
							$scope.reportMimeType = filetype.fields;
							if(filetype.fields == 'PDF'){
								$scope.filteredDataSet($scope.selectedReporType_underscore, $scope.someObject.case_channel.channelCode )
							}if(filetype.fields == 'EXCEL'){
								$scope.someObject.selectedPeopleSimple = $scope.available_fields
							}
							
						}
					$scope.setDays = function(selectedDay) {
							$scope.numberOfdays = selectedDay;
						}
		
					$scope.getDataBasedonselect = function(value){
						
						$scope.makemetoPipeFormat(value);	
						
						if($scope.available_fields.length == $scope.someObject.selectedPeopleSimple.length){
						    
						    var myEl = angular.element( document.querySelector( '#avialableFields' ) );
						    myEl.css('display','none');
						    $scope.fieldMsg = true;
						  }else{
							  $scope.fieldMsg = false;
						  }
						
					}
					
					$scope.onclick = function(){
						  if($scope.available_fields.length == $scope.someObject.selectedPeopleSimple.length){
							    
							    var myEl = angular.element( document.querySelector( '#avialableFields' ) );
							    myEl.css('display','none');
							    $scope.fieldMsg = true;
							  }else{
								  $scope.fieldMsg = false;
								  var myEl = angular.element( document.querySelector( '#avialableFields' ) );
								    myEl.css('display','block');
							  }
						
					}
					
					$scope.onRemove = function(){
						 $scope.fieldMsg = false;
						  var myEl = angular.element( document.querySelector( '#avialableFields' ) );
						    myEl.css('display','block');
						   
						  
					}

   }	
/* *****************************end of initialize function ****************** */	
	
initialize();
/* **************** On Click of Submit Button below methd is called **********************/
$scope.createReport = function(){
	/*$scope.fromDateValue = ''; 
	$scope.toDateValue = ''; 
	$scope.someObject.momentFromDate = $scope.someObject.fromDate1;
	$scope.someObject.momentToDate = $scope.someObject.toDate1*/
	console.log($scope.someObject.recr_value.value)
	if($scope.someObject.recr_value.value=='D'){
		 
		$scope.someObject.counter2=$scope.someObject.counter+'D'
	}
	else if($scope.someObject.recr_value.value=='M'){
	  
	   $scope.someObject.counter2=$scope.someObject.counter+'M'
	   console.log($scope.someObject.counter2)
	}
	else if($scope.someObject.recr_value.value=='H'){
	   $scope.someObject.counter2=$scope.someObject.counter+'H'
	}
   else{
	   $scope.someObject.counter2=$scope.someObject.counter;
   }
   /*if($scope.selectedReporType == 'RTD REPORT'){
		
		$scope.organisationID =$scope.issuer.prop.orgId;
		$scope.optionalInputs = {
				acquirer: $scope.issuer.prop.orgId,
				issuer: $scope.acquirer.prop.orgId
		}
		$scope.optionalInputs = JSON.stringify($scope.optionalInputs)
		$scope.optionalInputs = btoa($scope.optionalInputs)
		
	}*/
   
  

	/*if($scope.selectedReporType == 'RULE EFFICIENCY REPORT')
	{
		$scope.optionalInputs = {
				minweightage: $scope.someObject.min_rl_weight,
				maxweightage: $scope.someObject.max_rl_weight
		}
		$scope.optionalInputs = JSON.stringify($scope.optionalInputs)
		$scope.optionalInputs = btoa($scope.optionalInputs)
		
	}*/

	if($scope.selectedReporType == 'AML TYPE REPORT'){
		if($scope.someObject.amlType_data2)
		{
			$scope.optionalInputs = {
					amltype: $scope.someObject.amlType_data2
					
			}
		}
		else{
			$scope.optionalInputs = {
					amltype: 'ALL'
					
			}
		}
		
		$scope.optionalInputs = JSON.stringify($scope.optionalInputs)
		$scope.optionalInputs = btoa($scope.optionalInputs)
		
	}
	if($scope.selectedReporType == 'ACQUIRER LEVEL FRAUD REPORT' || $scope.selectedReporType == 'POS MERCHANT SALES VALUE REPORT' || $scope.selectedReporType == 'ECOM MERCHANT SALES VALUE REPORT')
	{
		if($scope.someObject.Acq_mcc){
			var mcc_array = $scope.someObject.Acq_mcc.map((x)=>{
				return x.text;
			})
			$scope.someObject.Acq_mcc = mcc_array.toString();
		}
		$scope.optionalInputs = {
			mcc: $scope.someObject.Acq_mcc
		}
		$scope.optionalInputs = JSON.stringify($scope.optionalInputs)
		$scope.optionalInputs = btoa($scope.optionalInputs)
		
	}
	
	if($scope.selectedReporType == 'REMITTER REPORT' || $scope.selectedReporType == 'ATM WITHDRAWAL REPORT')
	{
		
		$scope.optionalInputs = {
			amount: $scope.someObject.amount
		}
		$scope.optionalInputs = JSON.stringify($scope.optionalInputs)
		$scope.optionalInputs = btoa($scope.optionalInputs)
		
	}


	if($scope.selectedReporType == 'FRAUD TYPE REPORT' )
	{
		if($scope.someObject.fraudType_data){
			$scope.optionalInputs = {
					fraudtype: $scope.fraudType
			}
		}
		else {
			$scope.optionalInputs = {
					fraudtype: 'ALL'
			}
		}
		
		$scope.optionalInputs = JSON.stringify($scope.optionalInputs)
		$scope.optionalInputs = btoa($scope.optionalInputs)
	}
	
	
	if($scope.selectedReporType == 'PERIMETER REPORT' || $scope.selectedReporType == 'CALLING REPORT' || $scope.selectedReporType == 'TAGGED TRANSACTIONS REPORT') 
	{
		$scope.someObject.counter2 = null;
		if($scope.someObject.counterinhrs)
		{
			$scope.someObject.counter2 = $scope.someObject.counterinhrs+'H';
		}
		
	}
	if($scope.selectedReporType == 'POS_MERCHANT_SALES_VALUE_REPORT' || $scope.selectedReporType == 'ECOM_MERCHANT_SALES_VALUE_REPORT' || $scope.selectedReporType == 'REMITTER_REPORT' || $scope.selectedReporType == 'ATM_WITHDRAWAL_REPORT' ) 
	   {
	
	
	 $scope.someObject.counter2 = null;
	   }

	if($scope.selectedReporType == 'UPI FRAUD DETAIL REPORT')
	{
		$scope.organisationID =$scope.someObject.remitterOrgId.orgId;
		$scope.optionalInputs = {
				threshold: $scope.someObject.upi_final_risk_score,
				remitterRuleScore: $scope.someObject.remitterRuleScore,
				beneficiaryRuleScore: $scope.someObject.beneficiaryRuleScore,
				beneficiaryOrgId: $scope.someObject.beneficiaryOrgId.orgId,
				remitterOrgId: $scope.someObject.remitterOrgId.orgId
		}
		$scope.optionalInputs = JSON.stringify($scope.optionalInputs)
		$scope.optionalInputs = btoa($scope.optionalInputs)
	}	
	
	if($scope.selectedReporType == 'MERCHANT WISE FRAUD REPORT' ){
		if($scope.someObject.mid_data){
			var myArray_mid=$scope.someObject.mid_data.map((x)=>{
				return x.text;
			})
			$scope.someObject.mid_data = myArray_mid.toString();
		}
			
			$scope.optionalInputs = {
					 mid: $scope.someObject.mid_data
					/*includeOpencases : $scope.someObject.open_check,
					includeClosedcases : $scope.someObject.closed_check*/
			}	
			$scope.optionalInputs = JSON.stringify($scope.optionalInputs)
			$scope.optionalInputs = btoa($scope.optionalInputs)
	}
	
	if($scope.selectedReporType == 'TXN WISE FRAUD REPORT' )
	{
		if($scope.someObject.fraudType_data){
			$scope.optionalInputs = {
					mcc:  $scope.someObject.mcc_data,
					mid: $scope.someObject.mid_data,
					tid:  $scope.someObject.tid_data,
					approvedTxn: $scope.someObject.approved_check,
					declinedTxn: $scope.someObject.declined_check,
					fraudtype: $scope.fraudType
		
			}	
		}
		else{
			$scope.optionalInputs = {
					mcc:  $scope.someObject.mcc_data,
					mid: $scope.someObject.mid_data,
					tid:  $scope.someObject.tid_data,
					approvedTxn: $scope.someObject.approved_check,
					declinedTxn: $scope.someObject.declined_check,
					fraudtype: 'ALL'
		
			}
		}
		
		$scope.optionalInputs = JSON.stringify($scope.optionalInputs)
		$scope.optionalInputs = btoa($scope.optionalInputs)
	
	}


   if($scope.trans_period.length >= 1)
	{  
	     $scope.fromDateValue ='';
		 $scope.toDateValue = '';
		 $scope.numberOfdays = $scope.someObject.days_value;
    }


	if($scope.trans_period.length < 1)
	{
		if($scope.selectedReporType == 'PERIMETER REPORT' ||  $scope.selectedReporType == 'TAGGED TRANSACTIONS REPORT')
		{
			
			$scope.fromDateValue = moment(new Date()).format("YYYY-MM-DD") + ' 00:00:00';
			$scope.fromDateValue = $scope.fromDateValue.toString();
			$scope.toDateValue = moment(new Date()).format("YYYY-MM-DD") + ' 00:00:00';
			$scope.toDateValue = $scope.toDateValue.toString();
		}
		
		else 
		{

		      $scope.newToDateValue=[];
			  $scope.newToDateValue = $scope.someObject.toDate1.split("-")
			  $scope.newToDateValue =$scope.newToDateValue[2]+"-"+$scope.newToDateValue[1]+"-"+$scope.newToDateValue[0];
			  
			  $scope.newFromDateValue=[];
			  $scope.newFromDateValue = $scope.someObject.fromDate1.split("-")
			  $scope.newFromDateValue = $scope.newFromDateValue[2]+"-"+$scope.newFromDateValue[1]+"-"+$scope.newFromDateValue[0];
				
			  
			$scope.fromDateValue = $scope.newFromDateValue  + ' 00:00:00'; //date formatting
			$scope.toDateValue = $scope.newToDateValue + ' 00:00:00';
			$scope.numberOfdays = '';
		}
		
		if($scope.selectedReporType == 'CALLING REPORT' || $scope.selectedReporType == 'TAGGED TRANSACTIONS REPORT'){
			  $scope.newToDateValue=[];
			  $scope.newToDateValue = $scope.someObject.fromDate2.split("-")
			  $scope.newToDateValue =$scope.newToDateValue[2]+"-"+$scope.newToDateValue[1]+"-"+$scope.newToDateValue[0];
			  
			  $scope.newFromDateValue=[];
			  $scope.newFromDateValue = $scope.someObject.fromDate2.split("-")
			  $scope.newFromDateValue = $scope.newFromDateValue[2]+"-"+$scope.newFromDateValue[1]+"-"+$scope.newFromDateValue[0];
				
			  
			$scope.fromDateValue = $scope.newFromDateValue  + ' 00:00:00'; //date formatting
			$scope.toDateValue = $scope.newToDateValue + ' 00:00:00';
			$scope.numberOfdays = '';
		}
		
	}

	if($scope.selectedReporType == 'FRAUD CARD REPORT' )
	{
		/*$scope.organisationID =$scope.issuer.prop.orgId;*/
		if($scope.ruleScore == 'Issuer' && $scope.someObject.model)
		{
			$scope.issuerModelMinScore = $scope.someObject.min_risk_score;
			$scope.issuerModelMaxScore = $scope.someObject.max_risk_score
		}
		if($scope.ruleScore == 'Issuer' && $scope.someObject.model == false)
		{
			$scope.issuerRuleMinScore = $scope.someObject.min_risk_score;
			$scope.issuerRuleMaxScore = $scope.someObject.max_risk_score
		}
	
		if($scope.ruleScore == 'Acquirer' && $scope.someObject.model)
		{
			$scope.acquirerModelMinScore =$scope.someObject.min_risk_score;
			$scope.acquirerModelMaxScore =$scope.someObject.max_risk_score
		}
		if($scope.ruleScore == 'Acquirer' && $scope.someObject.model ==false)
		{
			$scope.acquirerRuleMinScore =$scope.someObject.min_risk_score;
			$scope.acquirerRuleMaxScore =$scope.someObject.max_risk_score
		}		
		
		if($scope.someObject.fraudType_data){
			$scope.optionalInputs = {
					/*mcc:  $scope.someObject.Acq_mcc,*/
					fraudtype:$scope.fraudType,
					acquirer: $scope.issuer.prop.orgId,
					issuer: $scope.acquirer.prop.orgId,
					tnxAmount: $scope.someObject.Txn_Amount,
					issuerModelMinScore : $scope.issuerModelMinScore,
					issuerModelMaxScore : $scope.issuerModelMaxScore,
					issuerRuleMinScore  : $scope.issuerRuleMinScore,
					issuerRuleMaxScore  : $scope.issuerRuleMaxScore,
					acquirerModelMinScore : $scope.acquirerModelMinScore,
					acquirerModelMaxScore : $scope.acquirerModelMaxScore,
					acquirerRuleMinScore : $scope.acquirerRuleMinScore,
					acquirerRuleMaxScore : $scope.acquirerRuleMaxScore,
                }
		}
		
		else{
			$scope.optionalInputs = {
					/*mcc:  $scope.someObject.Acq_mcc,*/
					fraudtype:'ALL',
					acquirer: $scope.issuer.prop.orgId,
					issuer: $scope.acquirer.prop.orgId,
					tnxAmount: $scope.someObject.Txn_Amount,
					issuerModelMinScore : $scope.issuerModelMinScore,
					issuerModelMaxScore : $scope.issuerModelMaxScore,
					issuerRuleMinScore  : $scope.issuerRuleMinScore,
					issuerRuleMaxScore  : $scope.issuerRuleMaxScore,
					acquirerModelMinScore : $scope.acquirerModelMinScore,
					acquirerModelMaxScore : $scope.acquirerModelMaxScore,
					acquirerRuleMinScore : $scope.acquirerRuleMinScore,
					acquirerRuleMaxScore : $scope.acquirerRuleMaxScore,
                }
		}
		
		$scope.optionalInputs = JSON.stringify($scope.optionalInputs)
		$scope.optionalInputs = btoa($scope.optionalInputs)
	
	}



$scope.email_list = [];
var size = Object.keys($scope.someObject.tags).length;

for(var i = 0 ; i<size; i++){
	$scope.email_list.push($scope.someObject.tags[i].text);
}

$scope.email_list = $scope.email_list.toString();

//Debashis Code//

if($scope.optionalInputs == 'e30='){
	$scope.optionalInputs = 'eyJtY2MiOiIifQ==';
}
if($scope.listType == 'ORG_AUDIT_TRAIL_REPORT' || $scope.listType == 'USER_AUDIT_TRAIL_REPORT' || $scope.listType == 'ADMIN_ACTIVITY_REPORT'){
	
	$scope.someObject.detailed_check = true;
	$scope.someObject.summry_check = true;
}

//End Here//
		if(!$scope.isChanged){
			$scope.someObject.counter2 = null;
		}
$scope.reportsDto =JSON.stringify({
		
									  reportName : $scope.listType,
									  reportRequesterName : $scope.uID,
									  reportMimeType : $scope.reportMimeType,
									  requestedField: $scope.sendfieldWithPipe,
									  numberOfdays: $scope.numberOfdays,
									  requesterOrgId: commonDataService.getLocalStorage().orgId,
									  scheduledInterVal: $scope.someObject.counter2,
									  sourceChannel: $scope.case_channel_val,
									  optionalInputs: $scope.optionalInputs,
									  reportForOrg:  $scope.organisationID,
									  reportSummary: $scope.someObject.summry_check,
									  reportDetails: $scope.someObject.detailed_check,
									  reportToDate : $scope.toDateValue,
									  reportFromDate : $scope.fromDateValue,
									  emailId : $scope.email_list,
		                          });
        

		efrmReports.header().createReports( {},$scope.reportsDto,
						function(data) {
							
							if(data.status == 201){
								 toastr.info(data.response, Msg.hurrah);
							}else{
								console.log("Enter")
								toastr.success("Success!!", Msg.hurrah);
							}
			             $scope.isSaved = true;
			             initialize();
		               },
						function(err) {
		            	   
		            	   $scope.someObject.counter = 1;
						});
				
			}
	
   
	  
	
}]);