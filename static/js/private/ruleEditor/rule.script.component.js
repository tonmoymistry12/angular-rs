(function() {
    'use strict';
    angular.module('rule')
        .component('ruleScript', {
            templateUrl: "templates/private/ruleEditor/rule.script.component.html",
            controller: function(Idle, Keepalive, $scope, $ngConfirm, $window, $state, $location, $http, ruleEditorManagement, toastr, Msg, casesManagement2, editPermission, RuleService, ruleManagement, ruleDataService, commonDataService, ngDialog, $timeout, $filter) {
 	
            	 Idle.watch();

				 $scope.$on('IdleStart', function() {
					  $scope.countDown = 10;
					    var timer = setInterval(function(){
					        $scope.countDown--;
					        $scope.$apply();
					     //   console.log($scope.countDown);
					    }, 1000);
				 });
				  
				  $scope.$on('IdleEnd', function() {
					  $scope.countDown = 10;  
					  ngDialog.close({ template: 'sessionTimeOut', scope: $scope });
				  });
				  
				  $scope.$on('IdleTimeout', function() {
					  
				  });
				  
				  
				  $scope.dateFormatChk = function(date){
				
					  if($scope.formParams.effectiveFromTs!=undefined){
						  var getFromDate = $scope.formParams.effectiveFromTs.split(' ')[0]
						  var getFromTime = $scope.formParams.effectiveFromTs.split(' ')[1]
						  if(getFromTime.length>5){
							  getFromTime=getFromTime.substring(0, getFromTime.length-3);
						  }
						  $scope.formParams.effectiveFromTs=getFromDate+' '+getFromTime
					  }
					 
					  if($scope.formParams.effectiveToTs!=undefined){
						  var getToDate = $scope.formParams.effectiveToTs.split(' ')[0]
						  var getToTime = $scope.formParams.effectiveToTs.split(' ')[1]
					//  console.log(getToDate+'----'+getToTime)
					  if(getToTime.length>5){
						  getToTime=getToTime.substring(0, getToTime.length-3);
					  }
					  	$scope.formParams.effectiveToTs=getToDate+' '+getToTime
					  }
					 
				  }
            	           	
            	
				//  console.log('LOCAL STORAGE OrgID',commonDataService.getLocalStorage().orgId)
				//  console.log('LOCAL STORAGE perspective',commonDataService.getLocalStorage().perspective[0])
            	$window.scrollTo(0, 0);
            	$scope.mandatoryField ="Red border fields are mandatory fields";
            	
            	$scope.channels = ruleDataService.getChannel();
            	$scope.showMsg = false;
            	
            	var isView = RuleService.getCopyFlag()

                if (isView === 'true' || isView === null) {
                    $scope.isView = false;
                } else {
                    $scope.isView = true;
                }
            	//alert(isView)
                function loadChannel() {
                    casesManagement2.header(localStorage.getItem("sessionToken")).channel({},
                        function(response) {
                            $scope.channel_code = response.response;
                            var channelComb=[{channelCode: "RuPayAtm,RuPayPos", channelDesc: "ATM, POS and ECOM"} ]
                            $scope.channel_code.push(...channelComb);
                        },
                        function(err) {

                        });
                }

                loadChannel()
                
                $scope.showBankList = false
                function loadOrganizations() {
                    editPermission.header({
                        token: localStorage.getItem("sessionToken")
                    }).bankNamesOrgId({
                        orgId: commonDataService.getLocalStorage().orgId
                    }, function(data) {
                        $scope.bankList = data.response;
                        
                        configureBank()
                        
                    }, function(err) {
                        $scope.bankList = [];
                    });
                }
                
                loadOrganizations()
               
                $scope.onlineList = [
                	{
                        name: "Online",
                        text: "True",
                        value: true
                    },
                    {
                        name: "Offline",
                        text: "False",
                        value: false
                    }
                ]
                $scope.ruleTypeList=[
                    { name:"Activity Rule",value:"A",title:"Activity Rule"},
                    {  name:"Hotlist Rule",value:"H",title:"Rules which access hotlist rules"}
                ]
                //	$scope.isView=RuleService.getCopyFlag();
                $scope.isEdit = RuleService.getEditFlag()||null;

                var orgId = commonDataService.getLocalStorage().orgId;
                //  var userId = sessionStorage.getItem("userId");
                var userId =  commonDataService.getSessionStorage().userId;
                //  console.log('USERID ', userId)
                //  var perspective = localStorage.getItem("perspective");
                
                var perspective = commonDataService.getLocalStorage().perspective;
                
               $scope.perspective=perspective
              //  $scope.perspective=['ISSUER','ACQUIRER']
			   $scope.orgId=orgId
			   $scope.currentDate =new Date();
			   
			   $scope.hasACQUIRER = ($scope.perspective.indexOf('ACQUIRER') !== -1) ? true : false
			   $scope.hasAML = ($scope.orgId === 'NPCI' && ($scope.perspective.indexOf('AML') !== -1)) ? true : false
			   $scope.hasISSUER = ($scope.perspective.indexOf('ISSUER') !== -1) ? true : false

					   $scope.getRuleData = '';
			   
		               $scope.formParams = {
		                   //  "ruleMetaData": {
		                   "acquirer": ($scope.perspective.indexOf('ACQUIRER') !== -1) ? true : false,
		                   "alertRequired": true,
		                   "alertTypeCd": "NPCI",
		                   "aml": ($scope.orgId === 'NPCI' && ($scope.perspective.indexOf('AML') !== -1)) ? true : false,
		                   "autoClosable": true,
		                   "beneficiary": false,
		                   "declineFlag": false,
		                   "excludeCurrentTxn": false,
		                   "issuer": ($scope.perspective.indexOf('ISSUER') !== -1) ? true : false,
		                   "npci": false,
		                   "online": true,
		                   "remitter": false,
		                   "supressOnModelScore":false,
		                 //"ruleScore": "000",
		                   "ruleType": "A",
		                   "composite": true,
		                   //  "effectiveFromTs":$scope.currentDate,
		                   "userInformationDTO": {
		                       //  "actionType": "PENDING_REVIEW",
		                       "notes": "",
		                       "orgId": orgId,
		                       "userId": userId
		                   },
		
		                   //},
		
		                   //"ruleId": ""
		
		               };
		               
		               var initialData = $scope.formParams;
                
               //  $scope.intAcquirer =($scope.formParams.channel=='RuPayPos') || ($scope.perspective==='ACQUIRER')?true:false;
               $scope.intBeneficiary = ($scope.formParams.channel == 'RuPayAtm' || $scope.formParams.channel == 'UPI') ? true : false;
               //  $scope.intIssuer = ($scope.formParams.channel==='RuPayPos') || ($scope.perspective==='ISSUER')?true:false;
               $scope.intRemitter = ($scope.formParams.channel == 'RuPayAtm' || $scope.formParams.channel == 'UPI') ? true : false

               $scope.ruleData = $scope.formParams;
               //   $scope.ruleMetaData = $scope.formParams.ruleMetaData;

               //   $scope.stage = "";
               $scope.formValidation = false;
               $scope.toggleJSONView = false;
               $scope.toggleFormErrorsView = false;

                $scope.addBank = function(bank){
                	
                	 var bnkList = [];
                        if (bank.length>0) {
                            for (var i = 0; i < bank.length; i++) {
                            	bnkList.push(bank[i].orgId);
                            }
                            $scope.formParams.orgId = [...new Set(bnkList)].toString();
                            RuleService.setOrgForUnique($scope.formParams.orgId)
                          //  console.log('overridingRulesList - ', $scope.overridingRulesList)
                          //  if(isView===null && $scope.isEdit===null ){
                            	 $scope.uniqueChk()
                          //  }
                           
                        }else{
                        	delete $scope.formParams.orgId
                        }
                            
                }
                
                function configureBank(){
                	$scope.showBankList = true
                	var orgs
                	
                	if($scope.formParams.orgId=='NPCI' && $scope.formParams.userInformationDTO.orgId=='NPCI'){
                		orgs = [{name: "NPCI [NPCI]",orgId: "NPCI"}]
                	}else{
                		orgs = $scope.bankList
                	}
                	var setOrgId
                	if(isView===null && $scope.isEdit===null){
                		$scope.formParams.orgId=orgId
                		$scope.bankModel= $filter('filter')(orgs, {
                    		orgId: orgId
                        });
                		setOrgId=orgId
                    //	console.log('bankModel for NEW- ',$scope.bankModel);
                		
                	}else{
                		if($scope.formParams.orgId!=undefined){
                		$scope.bankModel= $filter('filter')(orgs, {
                    		orgId: $scope.formParams.orgId
                        });
                		setOrgId=$scope.formParams.orgId
                	//	console.log('bankModel for EDIT/COPY/VIEW- ',$scope.bankModel);
                		}
                		
                		$window.document.getElementById('ruleId').focus()
                	}
                	//console.log('**setOrgId** ',setOrgId)
                	
                	RuleService.setOrgForUnique(setOrgId)
                	
                	
                }
 
              //  $scope.formParams.orgId=$scope.formParams.userInformationDTO.orgId
              //  $scope.formParams.userInformationDTO.orgId=orgId;
              
                
                
                
                /* FOR DATE PICKER START */
                $scope.dateRequired = true
               /* $scope.dateChange=function(date){
                	
                	if(date.length>0){
                		$scope.visitedRuleEffectiveFromTs=true
                		$scope.startDate=date
                	}else{
                		$scope.visitedRuleEffectiveFromTs=false
                		$scope.startDate="";
                	}
                }*/
               
                /* FOR DATE PICKER END */
                
                
                /* FOR OVER RIDING RULES START */

                $scope.disableSubmit=true;
                $scope.isOvrriding=false;
                $scope.getRulesForOverriding = function(orgId, channel, status) {
                	
                	if(channel!=undefined){
                	
                		$scope.isOvrriding=true;
                		
                    ruleManagement.header().viewRule({
                        orgId: orgId,
                        channel: channel,
                        status: status
                    }, function(response) {
                        var arrayList = [];
                        if (response.response.data != null && !angular.isUndefined(response.response.data)) {
                            for (var i = 0; i < response.response.data.length; i++) {
                                arrayList.push(response.response.data[i].ruleId);
                            }
                            $scope.overridingRuleList = [...new Set(arrayList)];
                          //  console.log('overridingRulesList - ', $scope.overridingRulesList)
                        }
                    }, function(err) {

                    })
                }else{
                	$scope.isOvrriding=false;
                	$scope.overridingRuleList='';
                }
                    
                    
                }
                $scope.onChannelChange = function(channel) {
                	
                	/*if(channel==='IMPS'||channel==='UPI'){
                		$scope.formParams.beneficiary=true
                		$scope.formParams.remitter=true
                	}else{
                		$scope.formParams.beneficiary=false
                		$scope.formParams.remitter=false
                	}*/
                    if($scope.hasAML!==true){
                        if((channel.startsWith('IMPS') && $scope.hasISSUER && $scope.hasACQUIRER)||
                        		(channel.startsWith('AEPS') && $scope.hasISSUER && $scope.hasACQUIRER) ||
                            (channel=='UPI' && $scope.hasISSUER && $scope.hasACQUIRER))
                        {
                        	
                            $scope.formParams.remitter=true;
                            $scope.formParams.beneficiary=true;
                            $scope.formParams.issuer=false;
                            $scope.formParams.acquirer=false;
                            $scope.disableSubmit=true;
                            
                        }
                        else if(channel.startsWith('IMPS') && $scope.hasISSUER || channel.startsWith('AEPS') && $scope.hasISSUER  || channel=='UPI' && $scope.hasISSUER)
                        {
                            $scope.formParams.remitter=true;
                            $scope.formParams.beneficiary=false;
                            $scope.formParams.issuer=false;
                            $scope.formParams.acquirer=false;
                            $scope.disableSubmit=false;
                        }
                        else if(channel.startsWith('IMPS') && $scope.hasACQUIRER || channel.startsWith('AEPS') && $scope.hasACQUIRER || channel=='UPI' && $scope.hasACQUIRER)
                        {
                            $scope.formParams.remitter=false;
                            $scope.formParams.beneficiary=true;
                            $scope.formParams.issuer=false;
                            $scope.formParams.acquirer=false;
                            $scope.disableSubmit=false;
                        }
                        else if((channel=='RuPayPos' && $scope.hasISSUER && $scope.hasACQUIRER)||
                            (channel.startsWith('RuPayAtm') && $scope.hasISSUER && $scope.hasACQUIRER))
                        {
                            $scope.formParams.remitter=false;
                            $scope.formParams.beneficiary=false;
                            $scope.formParams.issuer=true;
                            $scope.formParams.acquirer=true;
                            $scope.disableSubmit=true;
                        }
                        else if(channel=='RuPayPos' && $scope.hasISSUER || channel.startsWith('RuPayAtm') && $scope.hasISSUER)
                        {
                            $scope.formParams.remitter=false;
                            $scope.formParams.beneficiary=false;
                            $scope.formParams.issuer=true;
                            $scope.formParams.acquirer=false;
                            $scope.disableSubmit=false;
                        }
                        else if(channel=='RuPayPos' && $scope.hasACQUIRER || channel.startsWith('RuPayAtm') && $scope.hasACQUIRER)
                        {
                            $scope.formParams.remitter=true;
                            $scope.formParams.beneficiary=false;
                            $scope.formParams.issuer=true;
                            $scope.formParams.acquirer=false;
                            $scope.disableSubmit=false;
                        }
                    }else{
                        $scope.disableSubmit=false;
                    }
                	
                	 //  $scope.intAcquirer =($scope.formParams.channel=='RuPayPos') || ($scope.perspective==='ACQUIRER')?true:false;
                  //  $scope.intBeneficiary = ($scope.formParams.channel=='RuPayAtm'||$scope.formParams.channel=='UPI')?true:false;
                  //  $scope.intIssuer = ($scope.formParams.channel==='RuPayPos') || ($scope.perspective==='ISSUER')?true:false;
                 //   $scope.intRemitter =  ($scope.formParams.channel=='RuPayAtm'||$scope.formParams.channel=='UPI')?true:false

                	$scope.getRulesForOverriding(orgId, channel.replace(',','_'), "ACTIVE")
                	
                	

                }

                $scope.issuerAcqr=false;
                $scope.beneficiaryRemtr=false;
                
              /*  function dateFormat(d){
                	if(d){
                	//	d.split(' ')
                    	//console.log('____===',d.split(" ")[0])
                    	var date = d.split(" ")[0]
                    	var time = d.split(" ")[1]
                    	var dd =d.split(" ")[0].split("-")[0]
                    	var mm=d.split(" ")[0].split("-")[1]
                    	var yyyy=d.split(" ")[0].split("-")[2]
                    	return yyyy+","+mm+","+dd+" "+time
                	}
                	
                }*/
               /* $scope.simTimeRange=false;
                $scope.$watch('formParams.effectiveToTs', function (newValue, oldValue, scope) {
                //	console.log('formParams.ruleMetaData.effectiveToTs ',$scope.formParams.ruleMetaData.effectiveToTs)
                	
                	
                	if(!$scope.formParams.effectiveToTs){
                		delete $scope.formParams.effectiveToTs
                		delete $scope.formParams.effectiveToTs_detail
                	}
                	
                	
                	
                	
                	var rule = $scope.formParams.ruleName
                	if (rule && fmDt!='Invalid Date' && toDt!='Invalid Date') {
                		
                		var fmDt = new Date(dateFormat($scope.formParams.effectiveFromTs))
                    	var toDt = new Date(dateFormat($scope.formParams.effectiveToTs))
            
                		if (rule.toLowerCase().contains("simulated")) {
                			//console.log('its simulated rule'+fmDt+toDt)
                			if (toDt && fmDt) {
                				var diff = (toDt.getTime() - fmDt.getTime()) / 1000;
                				diff /= 60;
                				//console.log(Math.round(diff * 60))
                				//console.log(Math.abs(Math.round(diff * 60)))
                				if (Math.round(diff * 60) <= 21600 && Math.round(diff * 60)>0) {
                					//console.log('OK')
                					$scope.simTimeRange=false;
                				} else {
                					//console.log('NO')
                					$scope.simTimeRange=true;
                				}
                			}

                		}

                	}


                })*/
                
                $scope.$watch('formParams.orgId', function (newValue, oldValue, scope) {
                	
                	if($scope.formParams.orgId!=undefined){
                		
                		if($scope.orgId==='NPCI'){
                			if(!$scope.formParams.orgId.contains("NPCI")){
                				$scope.formParams.aml=false
                				 $scope.chkAml=false;
                				$scope.disableSubmit=false;
                			}else{
                				$scope.formParams.aml=true
                				if($scope.formParams.orgId.split(",").length>=1 && $scope.formParams.orgId==='NPCI'){
                					$scope.disableSubmit=false;
                					$scope.chkAml=true;
                				}else{
                					$scope.chkAml=false;
                					$scope.disableSubmit=true;
                				}
                				if($scope.formParams.orgId.split(",").length>1){
                					// toastr.error("For NPCI rule AML should be true. Need to remove NPCI from Organizastions properly.", Msg.oops);
                					 toastr.error("Can not make NPCI rule with other organizations. Need to make NPCI rule separately.", Msg.oops);
                				}
                			}
                		}
                		
                	}
                   
                })
                
                $scope.$watch('formParams.issuer', function (newValue, oldValue, scope) {
                    if(($scope.formParams.issuer===false && $scope.formParams.acquirer===false && $scope.hasACQUIRER && $scope.hasISSUER)||
                        ($scope.formParams.issuer===true && $scope.formParams.acquirer===true && $scope.hasACQUIRER && $scope.hasISSUER)){
                        $scope.issuerAcqr=true;
                        $scope.disableSubmit=true;
                    }else{
                        $scope.issuerAcqr=false;
                        $scope.disableSubmit=false;
                    }
                })
                
                $scope.$watch('formParams.acquirer', function (newValue, oldValue, scope) {
                    if(($scope.formParams.issuer===false && $scope.formParams.acquirer===false && $scope.hasACQUIRER && $scope.hasISSUER)||
                        ($scope.formParams.issuer===true && $scope.formParams.acquirer===true) && $scope.hasACQUIRER && $scope.hasISSUER){
                        $scope.issuerAcqr=true;
                        $scope.disableSubmit=true;
                    }else{
                        $scope.issuerAcqr=false;
                        $scope.disableSubmit=false;
                    }
                })
                
                $scope.$watch('formParams.beneficiary', function (newValue, oldValue, scope) {
                    if(($scope.formParams.beneficiary===false && $scope.formParams.remitter===false && $scope.hasACQUIRER && $scope.hasISSUER)||
                        ($scope.formParams.beneficiary===true && $scope.formParams.remitter===true && $scope.hasACQUIRER && $scope.hasISSUER)){
                        $scope.beneficiaryRemtr=true;
                        $scope.disableSubmit=true;
                    }else{
                        $scope.beneficiaryRemtr=false;
                        $scope.disableSubmit=false;
                    }
                })
                
               $scope.$watch('formParams.remitter', function (newValue, oldValue, scope) {
                    if(($scope.formParams.beneficiary===false && $scope.formParams.remitter===false && $scope.hasACQUIRER && $scope.hasISSUER)||
                        ($scope.formParams.beneficiary===true && $scope.formParams.remitter===true && $scope.hasACQUIRER && $scope.hasISSUER)){
                        $scope.beneficiaryRemtr=true;
                        $scope.disableSubmit=true;
                    }else{
                        $scope.beneficiaryRemtr=false;
                        $scope.disableSubmit=false;
                    }
                })
                
                $scope.scoreChange=function(v){
                //	console.log('SCORE ', v)
                	if(v>=900){
                		$scope.formParams.alertRequired = true;
                	}
                }
                /* FOR OVER RIDING RULES END */

                $scope.changeNpci=function(){
                    $scope.formParams.npci=($scope.hasAML==true) ? true : false
                    $scope.formParams.aml=($scope.hasAML==true) ? true : false
                }


                $scope.getRule = function() {


                    /*console.log('get rule api RuleId - ',RuleService.getRules().ruleId)
                    console.log('get rule api RuleName - ',RuleService.getRules().ruleName)*/
                    $scope.formParams.ruleName = RuleService.getRules().ruleName

                    /*  ruleManagement.header({}).getRule({
                          ruleId: RuleService.getRules().ruleName,
                          orgId: RuleService.getRules().orgId
                      }, function(data) {*/

                    //var viewservice = RuleService.getCopyFlag()

                    $scope.getRuleData = RuleService.getRules();
                    console.log('getRULE from API - ', $scope.getRuleData);
                    console.log($filter('date')($scope.getRuleData.effectiveFromTs, 'dd-MM-yyyy hh:mm:ss'));
                    var tmpStartDate = $filter('date')($scope.getRuleData.effectiveFromTs, 'dd-MM-yyyy hh:mm:ss')
                    var startDate = tmpStartDate.slice(0, -3)
                    $scope.getRuleData.effectiveFromTs = startDate;

                    if ($scope.getRuleData.effectiveToTs != undefined) {
                        var tmpToDate = $filter('date')($scope.getRuleData.effectiveToTs, 'dd-MM-yyyy hh:mm:ss')
                        var toDate = tmpToDate.slice(0, -3)
                        $scope.getRuleData.effectiveToTs = toDate;
                    }


                    if (RuleService.getCopyFlag() === 'true') {
                        delete $scope.getRuleData.userInformationDTO.orgId
                        delete $scope.getRuleData.userInformationDTO.userId
                        delete $scope.getRuleData.effectiveFromTs
                    	delete $scope.getRuleData.effectiveToTs
                    //	delete $scope.getRuleData.id
                        delete $scope.getRuleData.userInformationDTO.userIdOrig
                        
                        delete $scope.getRuleData.userInformationDTO.rejectedByOrgId;
                    	delete $scope.getRuleData.userInformationDTO.rejectedByUserId
                    	delete $scope.getRuleData.userInformationDTO.rejectedByUserIdOrig;
                    	
                    	delete $scope.getRuleData.userInformationDTO.updatedByOrgId;
                    	delete $scope.getRuleData.userInformationDTO.updatedByUserId;
                    	delete $scope.getRuleData.userInformationDTO.updatedByUserIdOrig;
                    	
                    	delete $scope.getRuleData.userInformationDTO.approvedByUserId
                    	delete $scope.getRuleData.userInformationDTO.approvedByOrgId
                    	delete $scope.getRuleData.userInformationDTO.approvedByUserIdOrig
                    	
                    	delete $scope.getRuleData.userInformationDTO.deactivatedByOrgId
                    	delete $scope.getRuleData.userInformationDTO.deactivatedByUserId
                    	delete $scope.getRuleData.userInformationDTO.deactivatedByUserIdOrig
                    }

                    if (RuleService.getEditFlag() === 'true') {
                        /*if(orgId!='NPCI'){
                        		delete $scope.getRuleData.userInformationDTO.orgId
                            	delete $scope.getRuleData.userInformationDTO.userId
                        	}else{
                        		delete $scope.getRuleData.userInformationDTO.userId
                        	}*/
                        delete $scope.getRuleData.userInformationDTO.orgId
                        delete $scope.getRuleData.userInformationDTO.userId
                        
                    }

                    //	console.log('GET - ',$scope.getRuleData)

                    var mergedObject = angular.merge($scope.formParams, $scope.getRuleData);

                    $scope.formParams = mergedObject;
                    console.log('mergedObject ', mergedObject)
                    $scope.formParams.ruleTextJson = $scope.formParams.ruleExpr
                    //	console.log('GET - ',$scope.formParams)
                    // console.log('Edit OrgID ',$scope.formParams.userInformationDTO.orgId)
                    // console.log('Edit userId ',$scope.formParams.userInformationDTO.userId)

                    // console.log('afer marger getRULE - ',mergedObject)




                    if (($scope.getRuleData.issuer === false && $scope.getRuleData.acquirer === false && $scope.hasACQUIRER && $scope.hasISSUER) ||
                        ($scope.getRuleData.issuer === true && $scope.getRuleData.acquirer === true && $scope.hasACQUIRER && $scope.hasISSUER)) {
                        $scope.issuerAcqr = false;
                        $scope.disableSubmit = false;
                    } else if (($scope.getRuleData.beneficiary === false && $scope.getRuleData.remitter === false && $scope.hasACQUIRER && $scope.hasISSUER) ||
                        ($scope.getRuleData.beneficiary === true && $scope.getRuleData.remitter === true && $scope.hasACQUIRER && $scope.hasISSUER)) {
                        $scope.beneficiaryRemtr = false;
                        $scope.disableSubmit = false;
                    }
                    toastr.success("Rule Successfully Loaded", Msg.hurrah);
                    //  configureBank()
                }

                if (RuleService.getCopyFlag() || RuleService.getEditFlag()) {
                    $scope.copyFlag=RuleService.getCopyFlag();
                    $scope.editFlag=RuleService.getEditFlag();
                    $scope.getRule();
                }

                // $scope.formParams.effectiveFromTs = $filter('date')($scope.currentDate, "dd-mm-yyyy")+" "+$filter('date')($scope.currentDate, "hh:mm")
                // Post to desired exposed web service.
                $scope.submitForm = function() {
                    var today = $filter('date')($scope.currentDate, "dd-MM-yyyy")
                    var startDate
                    var getDate = $scope.formParams.effectiveFromTs.split(' ')[0]

                    if (getDate === today) {
                        var getTime = $scope.formParams.effectiveFromTs.split(' ')[1]
                        startDate = getDate + " " + $filter('date')($scope.currentDate, "hh:mm") + ":00"
                    } else {
                        startDate = $scope.formParams.effectiveFromTs + ":00"
                    }



                    //console.log($scope.formParams.effectiveFromTs.split(' '))
                    $scope.formParams.effectiveFromTs = startDate;
                    if ($scope.formParams.effectiveToTs != undefined) {
                        var toDate = $scope.formParams.effectiveToTs + ":00"
                        $scope.formParams.effectiveToTs = toDate;
                    }



                    //console.log('CREATE - ',$scope.formParams)
                   // $scope.formParams.ruleId = $scope.formParams.ruleName
                    delete $scope.formParams.effectiveFromTs_detail
                    
                /*    if(RuleService.getCopyFlag()){
                    	
                    	delete $scope.formParams.userInformationDTO.rejectedByOrgId;
                    	delete $scope.formParams.userInformationDTO.rejectedByUserId
                    	delete $scope.formParams.userInformationDTO.rejectedByUserIdOrig;
                    	
                    	delete $scope.formParams.userInformationDTO.updatedByOrgId;
                    	delete $scope.formParams.userInformationDTO.updatedByUserId;
                    	delete $scope.formParams.userInformationDTO.updatedByUserIdOrig;
                    	
                    	delete $scope.formParams.userInformationDTO.approvedByUserId
                    	delete $scope.formParams.userInformationDTO.approvedByOrgId
                    	delete $scope.formParams.userInformationDTO.approvedByUserIdOrig
                    	
                    	delete $scope.formParams.userInformationDTO.deactivatedByOrgId
                    	delete $scope.formParams.userInformationDTO.deactivatedByUserId
                    	delete $scope.formParams.userInformationDTO.deactivatedByUserIdOrig
                    }*/
                    
                    createRule($scope.formParams)

                };
                
                
            
                
                function createRule(config) {
                	
                	
                	
                	if(RuleService.getCopyFlag()==='true'){
                		delete $scope.formParams.id
                	}

                    if ($scope.formParams.effectiveToTs != undefined) {
                        if ($scope.formParams.effectiveToTs.length === 0) {
                            delete $scope.formParams.effectiveToTs
                        }
                    }
                      console.log('rule data to be saves - ', config)

                    if (RuleService.getEditFlag() === 'true') {
                    	
                        ruleManagement.header({}).updateRule({
                            channel: null,
                            orgId: null
                        }, config, function(data) {

                           /* if (data.response.status==='SUCCESS') {
                                toastr.success(data.response.data.toString(), Msg.hurrah);
                            }
                            if (data.response.errorDesc) {
                                toastr.error(data.response.errorDesc.toString(), Msg.oops);
                            }*/
                        	if(data.response.errorCode === "00"){
                        		toastr.success(data.response.data.toString(), Msg.hurrah);
                        	}
                        	if(data.response.errorCode === "99"){
                        		 toastr.warning(data.response.data.toString(), Msg.oops);
                        	}
                        	if(data.response.errorDesc){
                        		 toastr.error(data.response.errorDesc.toString(), Msg.oops);
                        	}
                            $state.go('dashboard.viewRule');
                        }, function(err) {
                            //   console.log(err)
                            toastr.error("Rule Creation Failed", Msg.oops);
                        });
                    } else {
                    	//console.log('config - ',config)
                        ruleManagement.header({}).createRule({
                            channel: null,
                            orgId: null
                        }, config, function(data) {
                           /* if (data.response.status==='SUCCESS') {
                                toastr.success(data.response.data.toString(), Msg.hurrah);
                            }
                            
                            if (data.response.errorDesc) {
                                toastr.error(data.response.errorDesc.toString(), Msg.oops);
                            }*/
                        	
                        	if(data.response.errorCode === "00"){
                        		toastr.success(data.response.data.toString(), Msg.hurrah);
                        		
                        	}else{
                        		 toastr.error(data.response.data.toString(), Msg.oops);
                        	}
                        	if(data.response.errorDesc){
                        		 toastr.error(data.response.errorDesc.toString(), Msg.oops);
                        	}
                            $state.go('dashboard.viewRule');
                        }, function(err) {
                            // console.log(err)
                            toastr.error("Rule Creation Failed", Msg.oops);
                        });
                    }
                }
                
                
                $scope.reset = function() {
                    // Clean up scope before destorying
                    $scope.formParams = initialData;
                    $scope.stage = "";
                }
                
                $scope.reset()
                
                $scope.isSimulated=function(rule){
                	if(rule){
                		if(rule.toLowerCase().contains("simulated")){
                    		$scope.formParams.alertRequired=false
                    		$scope.formParams.ruleScore='0'
                    		
                    		$scope.isSimulatedd=true
                    	}else{
                    		$scope.formParams.alertRequired=true
                    		$scope.formParams.ruleScore='';
                    		$scope.formParams.priority='';
                    		delete $scope.formParams.effectiveToTs
                    		$scope.isSimulatedd=false
                    	}
                	}
                	
                }
                /*$scope.priorityValid=function(priority){
                	
                	if($scope.isSimulatedd){
                		if(priority<9999){
                			$scope.disableSubmit=true;
                			return true
                		}else{
                			$scope.disableSubmit=false;
                			return false
                		}
                		
                	}
                	//return false
                }*/
                
                $scope.uniqueChk = function(){
                	var orgId =  RuleService.getOrgForUnique();
                //	console.log('orgId===== ',orgId.replace(/,/g, "_"))
                    var currentValue = $scope.formParams.ruleName;
                //    console.log('RULE NAME ',$scope.formParams.ruleName)
                    ruleEditorManagement.header({}).checkUniqueRuleName({
                        ruleId:currentValue,
                        orgId:orgId.replace(/,/g, "_")
                    }, function(unique) {
                    	/*console.log('message ',unique)
                    	console.log('duplicate rule id ',unique.response)*/
                    	if (unique.response===false && currentValue.length>0) { 
                    		$scope.createRule.ruleId.$setValidity('unique', true);
                        }else{
                        	$scope.createRule.ruleId.$setValidity('unique', false);
                        	toastr.error(unique.message, Msg.oops);
                        }
                    }, function(err) {
                    //	ngModel.$setValidity('unique', true);
                      /*  console.log(err)
                        toastr.error("Rule List Failed", Msg.oops);*/
                    });
                }


            }
        })
        .directive('number', function () {
            return {
                require: 'ngModel',
                restrict: 'A',
                link: function (scope, element, attrs, ctrl) {
                    ctrl.$parsers.push(function (input) {
                        if (input == undefined) return ''
                        var inputNumber = input.toString().replace(/[^0-9]/g, '');
                        if (inputNumber != input) {
                            ctrl.$setViewValue(inputNumber);
                            ctrl.$render();
                        }
                        return inputNumber;
                    });
                }
            };
        })
        .directive('ngSpace', function() {
		 return function(scope, element, attrs) {
		 element.bind("keydown", function(event) {
		   if (event.keyCode == 32) event.preventDefault();
		   });
		  };
		})
        .directive('uniqueRuleName', function(ruleEditorManagement,commonDataService,RuleService,toastr, Msg){
        	return{
        		restrict: 'A',
                require: 'ngModel',
                link: function (scope, element, attrs, ngModel) {
                    element.bind('blur', function (e) {

                    	
                        if (!ngModel || !element.val()) return;

                        var orgId =  RuleService.getOrgForUnique();
                        var currentValue = element.val();
                        
                        ruleEditorManagement.header({}).checkUniqueRuleName({
                            ruleId:element.val(),
                            orgId:orgId.replace(/,/g, "_")
                        }, function(unique) {
                        //	console.log('duplicate rule id ',unique.response)
                        	if (unique.response===false && element.val().length>0) { 
                                ngModel.$setValidity('unique', true);
                            }else{
                            	ngModel.$setValidity('unique', false);
                            	toastr.error(unique.message, Msg.oops);
                            }
                        }, function(err) {
                        //	ngModel.$setValidity('unique', true);
                        /*  console.log(err)
                            toastr.error("Rule List Failed", Msg.oops);*/
                        });
                        
                        
                        /*ruleEditorManagement.checkUniqueRuleName(keyProperty.key, keyProperty.property, currentValue)
                            .then(function (unique) {
                                //Ensure value that being checked hasn't changed
                                //since the Ajax call was made
                                if (currentValue == element.val()) { 
                                    ngModel.$setValidity('unique', unique);
                                }
                            }, function () {
                                //Probably want a more robust way to handle an error
                                //For this demo we'll set unique to true though
                                ngModel.$setValidity('unique', true);
                            });*/
                    });
                }
        	}
        })
        .directive('toggle', function(){
        	  return {
        		    restrict: 'A',
        		    link: function(scope, element, attrs){
        		      if (attrs.toggle=="tooltip"){
        		        $(element).tooltip();
        		      }
        		      if (attrs.toggle=="popover"){
        		        $(element).popover();
        		      }
        		    }
        		  };
        		})
        		.directive("progressbarsessiontimeout", function () {
				    return {
				        restrict: "A",
				        scope: {
				            total: "=",
				            current: "="
				        },
				        link: function (scope, element) {
				
				            scope.$watch("current", function (value) {
				                element.css("width", scope.current / scope.total * 100 + "%");
				            });
				            scope.$watch("total", function (value) {
				                element.css("width", scope.current / scope.total * 100 + "%");
				            })
				        }
				    };
				})
        		.filter('formatArray', ['OptionalInjection', function(OptionalInjection) {
				  return function(value) {
				    if (!angular.isArray(value)) return '';
				    return value.map(OptionalInjection.formatter).join(', ');  // or just return value.join(', ');
				  };
				}])
				.config(['KeepaliveProvider', 'IdleProvider', function(KeepaliveProvider, IdleProvider) {
					 
				  var userEmail=localStorage.getItem("userEmail");
					//console.log('call',userEmail)
					  IdleProvider.idle(13*60);
					  IdleProvider.timeout(13*60);
					  KeepaliveProvider.interval(60);
					  KeepaliveProvider.http('/session/update?userEmail='+userEmail);
				}]);
    
})()