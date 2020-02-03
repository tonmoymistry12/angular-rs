'use strict';
angular.module('efrm.dashboard')
    .controller('editPermissionController', ['$scope', 'Permission', 'DataService', 'toastr', 'Msg','editPermission','AdminService', 'Session','$state', '$stateParams','commonDataService', function($scope, Permission, DataService, toastr, Msg,editPermission,AdminService,Session,$state,$stateParams,commonDataService){


        init();
        var roleNameAct=''
        $scope.roles = [];
        var bankorgId = '';
        $scope.isValid = false;
        $scope.bankNmae = ""
        var getData = [];
        $scope.enableRoleName=false;
        $scope.bankNmae="";
        $scope.selectedNPCI='';
        $scope.isdisabled = true;
        $scope.isdisabledCreate = true;
        $scope.showerrmsg = false;
       $scope.showBanknamerequiredMessage = false;
        $scope.changeRoles = function(){
        	

        	$scope.selectedBankName = null;
        	$scope.visibility = null;
        	$scope.banknNames = [];
        	 var allPermissions = [];
             allPermissions = angular.copy(DataService.getPermissions());
             
             _.map(allPermissions, function (permission) {
                 permission.active = false;
             });

        	 $scope.permissions = allPermissions;
        	 
        	if($scope.selectedRole == undefined){
        		$scope.isdisabled = true;
        	}if($scope.selectedRole != undefined){
        		$scope.isdisabled = false;
        	}
            if($scope.selectedRole) {
            	
                if ($scope.selectedRole.includes("NPCI")) {
                    $scope.showBanknameDropdown = true;
                    var selectedBankName = 'NPCI'
                    $scope.selectedNPCI='NPCI'
                    bankorgId='NPCI';
                    $scope.fetchPermissions(selectedBankName);
                } else {
               
                    AdminService.header({token: localStorage.getItem("sessionToken")}).bankNames({role: $scope.selectedRole}, function (data) {
                        $scope.banknNames = [];
                        $scope.banknNames = data.response;
                        $scope.selectedNPCI='';
                        $scope.showBanknameDropdown = true;


                    }, function (err) {
                        $scope.banknNames = [];
                    });
                }

            }else{
                init();

            }


        };

        $scope.fetchPermissions = function (selectedBankName) {
        	$scope.isdisabled = false;
        	$scope.showBanknamerequiredMessage = false;
            bankorgId=selectedBankName;
            if (!angular.isUndefined(selectedBankName)) {
            	$scope.isValid = true;
                Permission.header({token: localStorage.getItem("sessionToken")}).fetchPermissions({
                    roleName: $scope.selectedRole,
                    orgId: selectedBankName
                }, function (data) {
                    var allPermissions = [];
                    allPermissions = angular.copy(DataService.getPermissions());
                    
                    _.map(allPermissions, function (permission) {
                        permission.active = false;
                    });


                    var rolePermission = data.response.permissions;
                    $scope.visibility = data.response.p2Visibility;
                    
                    $scope.permissions = {};
                    var availiableRoles = _.map(rolePermission, function (permission) {
                        var index = _.findIndex(allPermissions, {permissionRefId: permission.permissionRefId});
                        if (index >= 0) {
                            allPermissions[index].active = true;
                        }
                    });

                    $scope.permissions = allPermissions;
                }, function (err) {
                    $scope.permissions = DataService.getPermissions();
                });
            }else{
            	$scope.visibility = null;
            	 var allPermissions = [];
                 allPermissions = angular.copy(DataService.getPermissions());
                 
                 _.map(allPermissions, function (permission) {
                     permission.active = false;
                 });

            	 $scope.permissions = allPermissions;
            }
        }


        function init() {
            $scope.selectedBankName = "";
            $scope.selectedRole=''
            $scope.showBanknameDropdown = false;
            $scope.permissions = [];
            $scope.orgId = commonDataService.getLocalStorage().orgId;

            AdminService.header({token : localStorage.getItem("sessionToken")}).getRoles({orgId: commonDataService.getLocalStorage().orgId },function(data) {
                $scope.roles=data.response;
                //$scope.visibility = data.response.p2Visibility;
                
                $scope.visibility = data.response.p2Visibility;
               
            },function(err){
                $scope.items = [];
            });

            Permission.header({token: localStorage.getItem("sessionToken")}).all({}, function (data) {
                var data = data.response;

                var permissions = _.map(data, function (element) {
                    return _.extend({}, element, {active: false});
                });
                DataService.setPermissions(permissions);
                $scope.permissions = DataService.getPermissions();
            }, function (error) {

            });
        }

        $scope.update1 = function(){
        	$scope.submitted = true;
        	$scope.isdisabled = true;
        	if($scope.isValid == false ){
        		$scope.isdisabled = false;
        		$scope.showBanknamerequiredMessage = true;
        	}else{
        		$scope.showBanknamerequiredMessage = false;
        	}
        	if($scope.selectedRole != "" && $scope.isValid == true ){
            var updatedPermissions = _.filter($scope.permissions,{active : true});
            var updateObj = {};
            updateObj.authorityType = $scope.selectedRole;
            updateObj.orgId=bankorgId;
            updateObj.permissions = updatedPermissions;
            updateObj.permissions = JSON.parse(angular.toJson(updateObj.permissions));
            updateObj.p2Visibility = $scope.visibility;
            updateObj.lastEditedBy = localStorage.getItem("userEmail");
            Permission.header({token : localStorage.getItem("sessionToken")}).update({}, updateObj, function(data){
                toastr.success(data.message, Msg.hurrah);
                $scope.submitted = false;
            }, function(error){
            	$scope.submitted = false;
            	$scope.isdisabled = false;
            });
        	}

        }



        $scope.createRole=function(){
        	
            $scope.dataFormat='0';
            $scope.submitted = false;
            $scope.selectedOrgId = null;
            $scope.bankList = [];
            $scope.bankNmae = null;
            $scope.roleNewName = null;
            $scope.bank=''
            $scope.enableRoleName = false;
            Permission.header({token : localStorage.getItem("sessionToken")}).all({}, function(data){
                var data = data.response;
                getData = data;
                
                $scope.roleFlag=true;
                var permissions = _.map(data, function(element) {
                    return _.extend({}, element, {active: false});
                });
                DataService.setPermissions(permissions);
                $scope.newPermissions = DataService.getPermissions();
            }, function(error){

            });
            
            editPermission.header({token : localStorage.getItem("sessionToken")}).bankNamesOrgId({orgId : commonDataService.getLocalStorage().orgId},function(data) {
                $scope.bankList = [];
                $scope.bankList = data.response;
            },function(err){
                $scope.bankList = [];
            });

        }
        
        if($stateParams.editable == 'N'){
        	$scope.roleFlag = true;
        	$scope.createRole();
        }
        
        if($stateParams.editable == 'Y'){
        	$scope.roleFlag = false;
        }

        $scope.selectBank=function(bank){
        	$scope.newPermissions = [];
        	
        	$scope.dataFormat = '0';
        	 var permissions = _.map(getData, function(element) {
                 return _.extend({}, element, {active: false});
             });
             DataService.setPermissions(permissions);
             $scope.newPermissions = DataService.getPermissions();
             $scope.roleNewName = null;
        	if(typeof bank == "undefined" || bank == null){
        		$scope.isdisabledCreate = true;
        		
        		$scope.enableRoleName = false;
        		
        		 $scope.bankNmae = null;
                 $scope.roleNewName = null;
        		//$scope.isdisabled = true;
        	}if(typeof bank != "undefined" ){
        		$scope.isdisabledCreate = false;
        		$scope.enableRoleName=true;
        		//$scope.isdisabled = false;
        	}
            
            
            $scope.bank=bank;
            if(bank=='NPCI'){
                $scope.bankNmae="NPCI";

                //ROLE_NPCI_
                
            }else{
            	if($scope.bank !=''){
                $scope.bankNmae="BANK";
                //ROLE_BANK_
            	}
            }

        }

        $scope.goBack=function(){
        	$scope.submitted = false;
            $scope.roleFlag=false;
            $scope.bank='';
            init();
        }


        $scope.submitRole=function (roleNewName) {
            $scope.submitted=false;
            $scope.isdisabledCreate = true;
            roleNameAct="ROLE_"+$scope.bankNmae+"_"+roleNewName;
            var updatedPermissions = _.filter($scope.newPermissions,{active : true});
            var updateObj = {};
            updateObj.permissions = updatedPermissions;
            updateObj.permissions = JSON.parse(angular.toJson(updateObj.permissions));
			var updateobj={};
			var updateObjArray=[];
            for(var i=0;i<updatedPermissions.length;i++){
                updateObjArray.push({permissionId : updatedPermissions[i].permissionRefId,permissionName:updatedPermissions[i].permission})
               
			}
            
            var config={
                "roleName": roleNameAct,
                "orgId":$scope.bank,
                "p2Visibility":$scope.dataFormat,
                "lstRolePermission":updateObjArray,
                "createdBy":commonDataService.getLocalStorage().userEmail
            }

            if(updateObjArray.length != 0 && updateObjArray != null){
            	$scope.showerrmsg = false;
             Permission.header().createrole({orgId:null,roleName:null},config,function(response){

                if(response.status==200){

                    toastr.success('Role created successfully', Msg.hurrah);
                   // $scope.roleFlag=false;
                    //init();
                    $scope.createRole();
                    $scope.roleNewName='';
                    $scope.selectedOrgId='';
                    $scope.enableRoleName='';
                    $scope.bankNmae=''
                }


             },function (err) {

                // $scope.roleFlag=false;
                 //init();
            	 $scope.createRole();
                 $scope.roleNewName='';
                 $scope.selectedOrgId='';
                 $scope.enableRoleName='';
                 $scope.bankNmae='';
             })
            }else{
            	$scope.isdisabledCreate = false;
            	$scope.showerrmsg = true;
            }

        }
        $scope.roleDisplay = function(role){
        	var res1;
        	var res;
        	if(typeof role != 'undefined'){
        		if(role.includes("ROLE") && role.includes("_")){
        			res1 = role.replace("ROLE", "");
        		
        			res = res1.replace(/_/g, " ");
        		}else if(role.includes("ROLE") && !role.includes("_")){
        			res = role.replace("ROLE", "");
        		}else if(!role.includes("ROLE") && role.includes("_")){
        			res = role.replace("/_/g", " ");
        		}}else if(!role.includes("ROLE") && !role.includes("_")){
        			res = role;
        		}
        	if(res.includes("APPLICATION")){
        		res = res.replace(/APPLICATION/g,'');
        	}
        	  return res;
        	}
        
    }]);
