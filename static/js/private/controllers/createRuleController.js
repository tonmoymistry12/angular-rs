'use strict';

angular.module('efrm.dashboard')
	.directive('ngSpace', function() {
		 return function(scope, element, attrs) {
		 element.bind("keydown", function(event) {
		   if (event.keyCode == 32) event.preventDefault();
		   });
		  };
		})
    .directive('uniqueRuleNameScript', function(ruleEditorManagement,commonDataService,RuleService){
        return{
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ngModel) {
                element.bind('blur', function (e) {
                //	RuleService.setOrgForUnique($scope.selectedOrgId);
                	//alert($scope.selectedOrgId)
                    if (!ngModel || !element.val()) return;
                    //  var keyProperty = scope.$eval(attrs.uniqueRuleName);
                 //   var orgId = commonDataService.getLocalStorage().orgId;
                    var orgId =RuleService.getOrgForUnique();
                    var currentValue = element.val();

                    ruleEditorManagement.header({}).checkUniqueRuleName({
                        ruleId:element.val(),
                        orgId:orgId
                    }, function(unique) {
                        //	console.log('duplicate rule id ',unique.response)
                        if (unique.response===false && element.val().length>0) {
                            ngModel.$setValidity('unique', true);
                        }else{
                            ngModel.$setValidity('unique', false);
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
    .controller('createRuleController',  ['$scope', '$state','MyCases','statusService','UserService','$location','SearchCaseService','casesManagement2','RolePermissionMatrix','$ngConfirm','casesManagement','toastr','Msg','Session','alertService','editPermission','ruleManagement','RuleService','commonDataService','ruleEditorManagement',function($scope,$state, MyCases, statusService,UserService,$location,SearchCaseService,casesManagement2,RolePermissionMatrix,$ngConfirm,casesManagement,toastr,Msg,Session,alertService,editPermission,ruleManagement,RuleService,commonDataService,ruleEditorManagement) {
    	
    	
    	$scope.uniqueChk = function(organisation){
    		
        	RuleService.setOrgForUnique(organisation);
        //	console.log('orgId===== ',orgId.replace(/,/g, "_"))
            var currentValue = $scope.ruleId;
        //    console.log('RULE NAME ',$scope.formParams.ruleMetaData.ruleName)
            ruleEditorManagement.header({}).checkUniqueRuleName({
                ruleId:currentValue,
                orgId:RuleService.getOrgForUnique()
            }, function(unique) {
            	/*console.log('message ',unique)
            	console.log('duplicate rule id ',unique.response)*/
            	/*if (unique.response===false && currentValue.length>0) { 
            		$scope.ruleId.$setValidity('unique', true);
                }else{
                	$scope.ruleId.$setValidity('unique', false);
                	toastr.error(unique.message, Msg.oops);
                }*/
            }, function(err) {
            //	ngModel.$setValidity('unique', true);
              /*  console.log(err)
                toastr.error("Rule List Failed", Msg.oops);*/
            });
        }
    	
    	
    	/*if(RuleService.getCopyFlag()===null || RuleService.getEditFlag()===null){
    		$scope.createRule.$setPristine();
    		$scope.createRule.$error = {};
        }*/
    	$scope.resetTab=function(){
    		
    		RuleService.setCopyFlag(null)
            RuleService.setEditFlag(null)
    	}

        $scope.beneficiary={value:false}
        $scope.remitter={value:false}
        $scope.issuer={value:false}
        $scope.acquirer={value:false}
        var perspective = commonDataService.getLocalStorage().perspective;
        var orgId = commonDataService.getLocalStorage().orgId;
        var userId = commonDataService.getSessionStorage().userId

        $scope.perspective=perspective;
        $scope.orgId=orgId;
        $scope.userId=userId;
        $scope.hasACQUIRER = ($scope.perspective.indexOf('ACQUIRER') !== -1) ? true : false
        $scope.hasAML = ($scope.orgId === 'NPCI' && ($scope.perspective.indexOf('AML') !== -1)) ? true : false
        $scope.hasISSUER = ($scope.perspective.indexOf('ISSUER') !== -1) ? true : false


        $scope.copyFlag=null;
        $scope.editFlag=null;
        $scope.disableTrue=false;
        $scope.editDisabled=false;
        $scope.cahngeRemitter=function(remitter){
            $scope.remitter.value=remitter;
        }
        $scope.cahngeBeneficiary=function(beneficiary){
            $scope.beneficiary.value=beneficiary;
        }
        $scope.cahngeIssuer=function(issuer){
            $scope.issuer.value=issuer;
        }
       
        $scope.cahngeAcquirer=function(acquirer){
            $scope.acquirer.value=acquirer;
        }

        $scope.onChannelChange=function(){
            $scope.overridingRulesList=[];
            if($scope.selectedChannel!='' && !angular.isUndefined($scope.selectedChannel) && $scope.selectedChannel!=null && $scope.hasAML!=true){
                    if(($scope.selectedChannel.startsWith('IMPS') && $scope.hasISSUER && $scope.hasACQUIRER)||
                        ($scope.selectedChannel=='UPI' && $scope.hasISSUER && $scope.hasACQUIRER)) {
                        $scope.remitter.value=true;
                        $scope.beneficiary.value=true;
                        $scope.issuer.value=false;
                        $scope.acquirer.value=false;
                        $scope.beneficiaryRemtr=true;
                        $scope.issuerAcqr=false;
                    } else if($scope.selectedChannel.startsWith('IMPS') && $scope.hasISSUER ||
                        $scope.selectedChannel=='UPI' && $scope.hasISSUER){
                        $scope.remitter.value=true;
                        $scope.beneficiary.value=false;
                        $scope.issuer.value=false;
                        $scope.acquirer.value=false;
                        $scope.beneficiaryRemtr=false;
                        $scope.issuerAcqr=false;
                    }else if($scope.selectedChannel.startsWith('IMPS') && $scope.hasACQUIRER ||
                        $scope.selectedChannel=='UPI' && $scope.hasACQUIRER){
                        $scope.remitter.value=false;
                        $scope.beneficiary.value=true;
                        $scope.issuer.value=false;
                        $scope.acquirer.value=false;
                        $scope.beneficiaryRemtr=false;
                        $scope.issuerAcqr=false;
                    }else if(($scope.selectedChannel=='RuPayPos' && $scope.hasISSUER && $scope.hasACQUIRER)||
                        ($scope.selectedChannel.startsWith('RuPayAtm') && $scope.hasISSUER && $scope.hasACQUIRER)){
                        $scope.remitter.value=false;
                        $scope.beneficiary.value=false;
                        $scope.issuer.value=true;
                        $scope.acquirer.value=true;
                        $scope.issuerAcqr=true;
                        $scope.beneficiaryRemtr=false;
                    } else if($scope.selectedChannel=='RuPayPos' && $scope.hasISSUER ||
                            $scope.selectedChannel.startsWith('RuPayAtm') && $scope.hasISSUER){
                        $scope.remitter.value=false;
                        $scope.beneficiary.value=false;
                        $scope.issuer.value=true;
                        $scope.acquirer.value=false;
                        $scope.issuerAcqr=false;
                        $scope.beneficiaryRemtr=false;
                    }else if($scope.selectedChannel=='RuPayPos' && $scope.hasACQUIRER ||
                                $scope.selectedChannel.startsWith('RuPayAtm') && $scope.hasACQUIRER){
                        $scope.remitter.value=true;
                        $scope.beneficiary.value=false;
                        $scope.issuer.value=true;
                        $scope.acquirer.value=false;
                        $scope.issuerAcqr=false;
                        $scope.beneficiaryRemtr=false;
                    }

                loadOverridingRules();
            }

        }
        $scope.issuerAcqr=false;
        $scope.beneficiaryRemtr=false;
        $scope.$watch('issuer.value', function (newValue, oldValue, scope) {
            if(($scope.issuer.value===false && $scope.acquirer.value===false &&($scope.selectedChannel==='RuPayPos'||$scope.selectedChannel.startsWith('RuPayAtm')))||
                ($scope.issuer.value===true && $scope.acquirer.value===true && ($scope.selectedChannel==='RuPayPos'||$scope.selectedChannel.startsWith('RuPayAtm')))){
                $scope.issuerAcqr=true;
            }else{
                $scope.issuerAcqr=false;
            }
        })
        $scope.$watch('acquirer.value', function (newValue, oldValue, scope) {
            if(($scope.issuer.value===false && $scope.acquirer.value===false && ($scope.selectedChannel==='RuPayPos'||$scope.selectedChannel.startsWith('RuPayAtm')))||
                ($scope.issuer.value===true && $scope.acquirer.value===true && ($scope.selectedChannel==='RuPayPos'||$scope.selectedChannel.startsWith('RuPayAtm')))){
                $scope.issuerAcqr=true;
            }else{
                $scope.issuerAcqr=false;
            }
        })
        $scope.$watch('beneficiary.value', function (newValue, oldValue, scope) {
            if(($scope.beneficiary.value===false && $scope.remitter.value===false && ($scope.selectedChannel.startsWith('IMPS')||$scope.selectedChannel==='UPI'))||
                ($scope.beneficiary.value===true && $scope.remitter.value===true && ($scope.selectedChannel.startsWith('IMPS')||$scope.selectedChannel==='UPI'))){
                $scope.beneficiaryRemtr=true;
            }else{
                $scope.beneficiaryRemtr=false;
            }
        })
        $scope.$watch('remitter.value', function (newValue, oldValue, scope) {
            if(($scope.beneficiary.value===false && $scope.remitter.value===false && ($scope.selectedChannel.startsWith('IMPS')||$scope.selectedChannel==='UPI'))||
                ($scope.beneficiary.value===true && $scope.remitter.value===true && ($scope.selectedChannel.startsWith('IMPS')||$scope.selectedChannel==='UPI'))){
                $scope.beneficiaryRemtr=true;
            }else{
                $scope.beneficiaryRemtr=false;
            }
        })


        if(RuleService.getCopyFlag()=='true'){
            $scope.copyFlag='true';
            $scope.disableTrue=false;
            
        }else if(RuleService.getCopyFlag()=='false'){
            $scope.copyFlag='false';
            $scope.disableTrue=true;
        }else if(RuleService.getEditFlag()=='true'){
            $scope.editFlag='true';
            $scope.disableTrue=false;
            $scope.editDisabled=true;

        }else{
            $scope.disableTrue=false;
        }
       
        $scope.onlineList=[
            { name:"Online",text: "True",value:true},
            {  name:"Offline",text: "False",value:false}
        ]
        $scope.ruleTypeList=[
            { name:"Activity Rule",value:"A",title:"Activity Rule"},
            {  name:"Hotlist Rule",value:"H",title:"Rules which access hotlist rules"}
        ]

        var fromDateNew='';
        var toDateNew='';
        $scope.overridingRulesList=[];
        $scope.pageLabel='Create Rule';
        $scope.selectedChannel=''
        $scope.status=['PENDING_REVIEW','ACTIVE','DEACTIVATED'];
        /*$scope.remitter.value=false;
        $scope.beneficiary.value=false;*/
        $scope.issuer.value=($scope.perspective.indexOf('ISSUER') !== -1) ? true : false;
        $scope.acquirer.value=($scope.perspective.indexOf('ACQUIRER') !== -1) ? true : false;
        $scope.bankList = [];
        $scope.ruleId='';
        $scope.ruleDesc='';
        $scope.selectedOrgId='';
        $scope.ruleScore='000';
        $scope.ruleTextJson='';
        $scope.priority='';
        $scope.ruleType='';
        $scope.overridingRules='';
        $scope.toDate1=''
        $scope.fromDate1=''
        $scope.fromDate='';
        $scope.notes='';
        $scope.fromTime1='00:00:00';
        $scope.toTome1='00:00:00';
        if($scope.hasAML==true){
            $scope.npci=true;
        }else{
            $scope.npci=false;
        }
        $scope.alertRequired=true;
        $scope.autoClosable=true;
        $scope.excludeCurrentTxn=false;
        $scope.aml=$scope.hasAML;
        $scope.declineFlag=false;

        $scope.fromTime=new Date(1970, 0, 1, 0, 0, 0);
        $scope.toTime=new Date(1970, 0, 1, 0, 0, 0);

        //$scope.exprFunc=null;
        loadChannel();
        loadOrganizations();
        if($scope.editFlag=='true'){
           

            $scope.pageLabel='Edit Rule';
            $scope.selectedChannel=RuleService.getRules().channel;
            $scope.onChannelChange();
            //$scope.status=RuleService.getRules().actionType;
            $scope.selectedOrgId = RuleService.getRules().orgId;
            $scope.alertTypeCd = RuleService.getRules().alertTypeCd;
            $scope.ruleId=RuleService.getRules().ruleName;
            $scope.ruleDesc=RuleService.getRules().ruleDesc;
            $scope.remitter.value=RuleService.getRules().remitter;
            $scope.beneficiary.value=RuleService.getRules().beneficiary;
            $scope.issuer.value=RuleService.getRules().issuer;
            $scope.acquirer.value=RuleService.getRules().acquirer;
            //$scope.npci=RuleService.getRules().npci;
            $scope.online=RuleService.getRules().online;
            $scope.ruleScore=RuleService.getRules().ruleScore;
            $scope.ruleTextJson=RuleService.getRules().ruleExpr;
            $scope.priority=RuleService.getRules().priority;
            $scope.alertRequired=RuleService.getRules().alertRequired;
            $scope.autoClosable=RuleService.getRules().autoClosable;
            $scope.excludeCurrentTxn=RuleService.getRules().excludeCurrentTxn;
            $scope.ruleType=RuleService.getRules().ruleType;
            $scope.overridingRules=(RuleService.getRules().overridingRules!=null && RuleService.getRules().overridingRules!=''?RuleService.getRules().overridingRules.split(","):'');
            //$scope.aml=(RuleService.getRules().aml==true?true:false);
            $scope.declineFlag=(RuleService.getRules().declineFlag==true?true:false);
            $scope.notes=RuleService.getRules().userInformationDTO.notes;
            fromDateNew=((RuleService.getRules().effectiveFromTs==null && angular.isUndefined(RuleService.getRules().effectiveFromTs))?'':RuleService.getRules().effectiveFromTs);
            toDateNew=((RuleService.getRules().effectiveToTs==null && angular.isUndefined(RuleService.getRules().effectiveToTs))?'':RuleService.getRules().effectiveToTs);

            if(fromDateNew!=null){
                var date1 = new Date(fromDateNew);
                var datevalues1 = ('0' + date1.getDate()).slice(-2) + '-' + ('0' + (date1.getMonth() + 1)).slice(-2) + '-' + date1.getFullYear();
                $scope.fromDate1=datevalues1;
                var hours1 = date1.getHours();
                var minutes1 = "0" + date1.getMinutes();
                var seconds1 = "0" + date1.getSeconds();
                var formattedTime1= new Date(date1.getFullYear(), ('0' + (date1.getMonth() + 1)).slice(-2), date1.getDate(), hours1, minutes1.substr(-2), seconds1.substr(-2));
                $scope.fromTime=formattedTime1;
                $scope.fromTime1=hours1 + ':' + minutes1.substr(-2) + ':' + seconds1.substr(-2);
            }
            if(toDateNew!=null){
                var date = new Date(toDateNew);
                var datevalues = ('0' + date.getDate()).slice(-2) + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear();
                var hours = date.getHours();
                var minutes = "0" + date.getMinutes();
                var seconds = "0" + date.getSeconds();
                $scope.toDate1=datevalues;
                var formattedTime= new Date(date.getFullYear(), ('0' + (date.getMonth() + 1)).slice(-2), date.getDate(), date.getHours(), minutes.substr(-2), seconds.substr(-2));
                $scope.toTime=formattedTime;
                $scope.toTime1=hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
            }
            if($scope.toDate1!='' && !angular.isUndefined($scope.toDate1)){
                $scope.fromDate='set';
            }
            RuleService.setEditFlag(null)
            RuleService.setCopyFlag(null)
        }
        else if($scope.copyFlag=='false') {
            

            $scope.pageLabel='View Rule';
            $scope.selectedChannel=RuleService.getRules().channel;
            $scope.onChannelChange();
            $scope.selectedOrgId = RuleService.getRules().orgId;
            $scope.alertTypeCd = RuleService.getRules().alertTypeCd;
            $scope.ruleId=RuleService.getRules().ruleName;
            $scope.ruleDesc=RuleService.getRules().ruleDesc;
            $scope.remitter.value=RuleService.getRules().remitter;
            $scope.beneficiary.value=RuleService.getRules().beneficiary;
            $scope.issuer.value=RuleService.getRules().issuer;
            $scope.acquirer.value=RuleService.getRules().acquirer
            //$scope.npci=RuleService.getRules().npci;
            $scope.online=RuleService.getRules().online;
            $scope.ruleScore=RuleService.getRules().ruleScore;
            $scope.ruleTextJson=RuleService.getRules().ruleExpr;
            $scope.priority=RuleService.getRules().priority;
            $scope.alertRequired=RuleService.getRules().alertRequired;
            $scope.autoClosable=RuleService.getRules().autoClosable;
            $scope.excludeCurrentTxn=RuleService.getRules().excludeCurrentTxn;
            $scope.ruleType=RuleService.getRules().ruleType;
            $scope.overridingRules=(RuleService.getRules().overridingRules!=null && RuleService.getRules().overridingRules!=''?RuleService.getRules().overridingRules.split(","):'');
            //$scope.aml=RuleService.getRules().aml;
            $scope.declineFlag=RuleService.getRules().declineFlag;
          //  $scope.notes=RuleService.getRules().userInformationDTO.notes;
            fromDateNew=((RuleService.getRules().effectiveFromTs==null && angular.isUndefined(RuleService.getRules().effectiveFromTs))?'':RuleService.getRules().effectiveFromTs);
            toDateNew=((RuleService.getRules().effectiveToTs==null && angular.isUndefined(RuleService.getRules().effectiveToTs))?'':RuleService.getRules().effectiveToTs);

            if(fromDateNew!=null){
                var date = new Date(fromDateNew);
                var datevalues = ('0' + date.getDate()).slice(-2) + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear();
                $scope.fromDate1=datevalues;
                var hours = date.getHours();
                var minutes = "0" + date.getMinutes();
                var seconds = "0" + date.getSeconds();
                var formattedTime= new Date(date.getFullYear(), ('0' + (date.getMonth() + 1)).slice(-2), date.getDate(), date.getHours(), minutes.substr(-2), seconds.substr(-2));
                $scope.fromTime=formattedTime;
                $scope.fromTime1=hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
            }
            if(toDateNew!=null){
                var date = new Date(toDateNew);
                var datevalues = ('0' + date.getDate()).slice(-2) + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear();
                var hours = date.getHours();
                var minutes = "0" + date.getMinutes();
                var seconds = "0" + date.getSeconds();
                $scope.toDate1=datevalues;
                var formattedTime= new Date(date.getFullYear(), ('0' + (date.getMonth() + 1)).slice(-2), date.getDate(), date.getHours(), minutes.substr(-2), seconds.substr(-2));
                $scope.toTime=formattedTime;
                $scope.toTime1=hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
            }
            if($scope.toDate1!='' && !angular.isUndefined($scope.toDate1)){
                $scope.fromDate='set';
            }
            RuleService.setEditFlag(null)
            RuleService.setCopyFlag(null)
        }
        else if($scope.copyFlag=='true') {
            
            $scope.pageLabel='Copy Rule';
            $scope.selectedChannel=RuleService.getRules().channel;
            
            $scope.onChannelChange();
            $scope.selectedOrgId = RuleService.getRules().orgId;
            RuleService.setOrgForUnique($scope.selectedOrgId);
            $scope.alertTypeCd = RuleService.getRules().alertTypeCd;
            $scope.ruleId=RuleService.getRules().ruleName;
            $scope.ruleDesc=RuleService.getRules().ruleDesc;
            $scope.remitter.value=RuleService.getRules().remitter;
            $scope.beneficiary.value=RuleService.getRules().beneficiary;
            $scope.issuer.value=RuleService.getRules().issuer;
            $scope.acquirer.value=RuleService.getRules().acquirer;
            //$scope.npci=RuleService.getRules().npci;
            $scope.online=RuleService.getRules().online;
            $scope.ruleScore=RuleService.getRules().ruleScore;
            $scope.ruleTextJson=RuleService.getRules().ruleExpr;
            $scope.priority=RuleService.getRules().priority;
            $scope.alertRequired=RuleService.getRules().alertRequired;
            $scope.autoClosable=RuleService.getRules().autoClosable;
            $scope.excludeCurrentTxn=RuleService.getRules().excludeCurrentTxn;
            $scope.ruleType=RuleService.getRules().ruleType;
            $scope.overridingRules=(RuleService.getRules().overridingRules!=null && RuleService.getRules().overridingRules!=''?RuleService.getRules().overridingRules.split(","):'');
            //$scope.aml=RuleService.getRules().aml;
            $scope.declineFlag=RuleService.getRules().declineFlag;
            $scope.notes=RuleService.getRules().userInformationDTO.notes;
            fromDateNew=((RuleService.getRules().effectiveFromTs==null && angular.isUndefined(RuleService.getRules().effectiveFromTs))?'':RuleService.getRules().effectiveFromTs);
            toDateNew=((RuleService.getRules().effectiveToTs==null && angular.isUndefined(RuleService.getRules().effectiveToTs))?'':RuleService.getRules().effectiveToTs);

            if(fromDateNew!=null){
                var date1 = new Date(fromDateNew);
                var datevalues1 = ('0' + date1.getDate()).slice(-2) + '-' + ('0' + (date1.getMonth() + 1)).slice(-2) + '-' + date1.getFullYear();
                $scope.fromDate1=datevalues1;
                var hours1 = date1.getHours();
                var minutes1 = "0" + date1.getMinutes();
                var seconds1 = "0" + date1.getSeconds();
                var formattedTime1= new Date(date1.getFullYear(), ('0' + (date1.getMonth() + 1)).slice(-2), date1.getDate(), hours1, minutes1.substr(-2), seconds1.substr(-2));
                $scope.fromTime=formattedTime1;
                $scope.fromTime1=hours1 + ':' + minutes1.substr(-2) + ':' + seconds1.substr(-2);
            }
            if(toDateNew!=null){
                var date = new Date(toDateNew);
                var datevalues = ('0' + date.getDate()).slice(-2) + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear();
                var hours = date.getHours();
                var minutes = "0" + date.getMinutes();
                var seconds = "0" + date.getSeconds();
                $scope.toDate1=datevalues;
                var formattedTime= new Date(date.getFullYear(), ('0' + (date.getMonth() + 1)).slice(-2), date.getDate(), date.getHours(), minutes.substr(-2), seconds.substr(-2));
                $scope.toTime=formattedTime;
                $scope.toTime1=hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
            }
            if($scope.toDate1!='' && !angular.isUndefined($scope.toDate1)){
                $scope.fromDate='set';
            }
            RuleService.setEditFlag(null)
            RuleService.setCopyFlag(null)
        }

        $scope.isSessionValid = function(){
            UserService.header({}).session({}, function(data){
            }, function(err){});
        }
        $scope.fromDateChanged=function() {

            if ($scope.fromDate1 == '') {
            } else {
                if ($scope.toDate1 == '') {
                    $scope.fromDate = 'set';
                } else if($scope.fromDate1 > $scope.toDate1)
                {
                    $scope.toDate1 = $scope.fromDate1;
                    $scope.fromDate = 'set';
                }
            }
        }
        function loadOrganizations(){
            editPermission.header().bankNamesOrgId({orgId : commonDataService.getLocalStorage().orgId},function(data) {
                $scope.bankList = data.response;
            },function(err){
                $scope.bankList = [];
            });

        }
        function loadChannel(){
            $scope.channel_code=[];
            casesManagement2.header().channel( {},
                function(response) {
                    $scope.channel_code = response.response;
                    //console.log($scope.channel_code);
                    var channelComb=[{channelCode: "RuPayAtm,RuPayPos", channelDesc: "ATM, POS and ECOM"} ]
                    $scope.channel_code.push(...channelComb);
                    //console.log($scope.channel_code);
                },
                function(err) {

                });
        }
        function loadOverridingRules(){
            ruleManagement.header().viewRule({orgId:orgId,channel:$scope.selectedChannel.replace(',','_'),status:"ACTIVE"},function(response){
                var arrayList=[];
                    if (response.response.data != null && !angular.isUndefined(response.response.data)) {
                        for (var i = 0; i < response.response.data.length; i++) {
                            arrayList.push(response.response.data[i].ruleId);
                        }
                        $scope.overridingRulesList = [...new Set(arrayList)];
                    }
            },function (err) {

            })

        }
        $scope.changeOverridingRules=function(rules){
            $scope.overridingRules=rules;
        }
        $scope.changeFromTime=function(fromTime){
            $scope.fromTime1=fromTime;
        }
        $scope.changeToTime=function(toTime){
            $scope.toTime1=toTime;
        }
       // $scope.issuerAcq=false;
        $scope.createNewRule=function(){
               if($scope.issuerAcqr==true || $scope.beneficiaryRemtr==true){
                   return false;
               }else{
                   if($scope.fromTime1==null){
                       $scope.fromTime1='00:00:00'
                   }
                   if($scope.toTime1==null){
                       $scope.toTime1='00:00:00'
                   }

                   if($scope.editFlag=='true'){
                        /*const modifiedChannel=$scope.selectedChannel.replace(',','_')*/

                       var config={
                           userInformationDTO:{
                               "userId": userId,
                               "orgId": orgId,
                               "actionType": "PENDING_REVIEW",
                               "notes":$scope.notes
                           },
                           "composite": true,
                           "ruleId": $scope.ruleId,
                           "ruleName": $scope.ruleId,
                           "channel": $scope.selectedChannel,
                           "ruleDesc":$scope.ruleDesc,
                           "ruleScore":$scope.ruleScore,
                           "ruleTextJson": $scope.ruleTextJson,
                           "priority": $scope.priority,
                           "orgId":$scope.selectedOrgId,
                           "alertTypeCd":'NPCI',
                           "alertRequired":$scope.alertRequired,
                           "issuer":$scope.issuer.value,
                           "acquirer":$scope.acquirer.value,
                           "remitter":$scope.remitter.value,
                           "beneficiary":$scope.beneficiary.value,
                           "npci":$scope.npci,
                           "autoClosable":$scope.autoClosable,
                           "excludeCurrentTxn":$scope.excludeCurrentTxn,
                           "ruleType":$scope.ruleType,
                           "overridingRules":$scope.overridingRules.length!=0?$scope.overridingRules.join():'',
                           "online":$scope.online,
                           "aml":$scope.aml,
                           "declineFlag":$scope.declineFlag,
                           "effectiveFromTs":$scope.fromDate1 +' '+ $scope.fromTime1,
                           "effectiveToTs":$scope.toDate1 +' '+ $scope.toTime1
                       };
                       updateRule(config);
                   }
                   else {

                       /*const modifiedChannel=$scope.selectedChannel.replace(',','_')*/

                       var config={
                           userInformationDTO:{
                               "userId": userId,
                               "orgId": orgId,
                               "actionType": "PENDING_REVIEW",
                               "notes":$scope.notes
                           },
                           "composite": true,
                           "ruleId":$scope.ruleId,
                           "ruleName":$scope.ruleId,
                           "channel":$scope.selectedChannel,
                           "ruleDesc":$scope.ruleDesc,
                           "ruleScore":$scope.ruleScore,
                           "ruleTextJson":$scope.ruleTextJson,
                           "priority":$scope.priority,
                           "orgId":$scope.selectedOrgId,
                           "alertTypeCd":'NPCI',
                           "alertRequired":$scope.alertRequired,
                           "issuer":$scope.issuer.value,
                           "acquirer":$scope.acquirer.value,
                           "remitter":$scope.remitter.value,
                           "beneficiary":$scope.beneficiary.value,
                           "npci":$scope.npci,
                           "autoClosable":$scope.autoClosable,
                           "excludeCurrentTxn":$scope.excludeCurrentTxn,
                           "ruleType":$scope.ruleType,
                           "overridingRules":$scope.overridingRules.length!=0?$scope.overridingRules.join():'',
                           "online":$scope.online,
                           "aml":$scope.aml,
                           "declineFlag":$scope.declineFlag,
                           "effectiveFromTs":$scope.fromDate1 +' '+ $scope.fromTime1,
                           "effectiveToTs":$scope.toDate1 +' '+ $scope.toTime1
                       };
                       createRule(config);

                   }

               }




        }

        function createRule(config){

            ruleManagement.header({}).createRule({channel:null,orgId:null},config,function(data) {

                if(data.response.errorCode==="00"){
                    toastr.success("Rule Created Successfully", Msg.hurrah);
                    var fromDateNew='';
                    var toDateNew='';
                    $scope.overridingRulesList=[];
                    $scope.pageLabel='Create Rule';
                    $scope.selectedChannel=''
                    //$scope.status=['PENDING_REVIEW','ACTIVE','DEACTIVATED'];
                    $scope.bankList = [];
                    $scope.ruleId='';
                    $scope.ruleDesc='';
                    $scope.selectedOrgId='';
                    $scope.ruleScore='000';
                    $scope.ruleTextJson='';
                    $scope.priority='';
                    $scope.ruleType='';
                    $scope.overridingRules='';
                    $scope.toDate1=''
                    $scope.fromDate1=''
                    $scope.fromDate='';
                    $scope.notes='';
                    $scope.fromTime1='00:00:00';
                    $scope.toTome1='00:00:00';

                    $scope.alertRequired=true;
                    $scope.autoClosable=true;
                    $scope.excludeCurrentTxn=false;
                    $scope.aml=$scope.hasAML;
                    $scope.declineFlag=true;
                    //$scope.issuerAcq=false;
                    //$scope.exprFunc=null;
                    loadChannel();
                    loadOrganizations();
                    $scope.submitted=false;
                    $scope.editDisabled=false;
                    $scope.disableTrue=false;
                    $scope.copyFlag=null;
                    $scope.editFlag=null;

                    $state.go('dashboard.viewRule');
                }
                else if(data.response.errorCode==="99") {
                    toastr.error(data.response.data, Msg.oops);
                }else{
                    toastr.error("Rule Creation Failed", Msg.oops);
                }

            },function(err){
                toastr.error("Rule Creation Failed", Msg.oops);
            });
        }

        function updateRule(config){
            ruleManagement.header({}).updateRule({channel:null,orgId:null},config,function(data) {
                if(data.response.errorCode==="00") {
                    toastr.success("Rule Updated Successfully", Msg.hurrah);
                    var fromDateNew = '';
                    var toDateNew = '';
                    $scope.overridingRulesList = [];
                    $scope.pageLabel = 'Create Rule';
                    $scope.selectedChannel = ''
                    //$scope.status=['PENDING_REVIEW','ACTIVE','DEACTIVATED'];
                    $scope.bankList = [];
                    $scope.ruleId = '';
                    $scope.ruleDesc = '';
                    $scope.selectedOrgId = '';
                    $scope.ruleScore = '000';
                    $scope.ruleTextJson = '';
                    $scope.priority = '';
                    $scope.ruleType = '';
                    $scope.overridingRules = '';
                    $scope.toDate1 = ''
                    $scope.fromDate1 = ''
                    $scope.fromDate = '';
                    $scope.notes = '';
                    $scope.fromTime1 = '00:00:00';
                    $scope.toTome1 = '00:00:00';

                    $scope.alertRequired = true;
                    $scope.autoClosable = true;
                    $scope.excludeCurrentTxn = false;
                    $scope.aml = $scope.hasAML;
                    $scope.declineFlag = true;
                    //$scope.exprFunc=null;
                    loadChannel();
                    loadOrganizations();
                    $scope.submitted = false;
                    $scope.editDisabled = false;
                    $scope.disableTrue = false;
                    $scope.copyFlag = null;
                    $scope.editFlag = null;
                    //$scope.issuerAcq=false;
                    $state.go('dashboard.viewRule');

                }
                else{
                        toastr.error("Rule Creation Failed", Msg.oops);

                }

            },function(err){

                toastr.error("Rule Creation Failed", Msg.oops);

            });
        }
       
        
        $scope.goBackView=function () {
            $state.go('dashboard.viewRule');
        }



    }])
