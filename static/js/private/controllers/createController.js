'use strict';
angular.module('efrm.dashboard')
.controller('createController', ['$scope', '$rootScope', 'toastr','$timeout', '$state', '$stateParams', 'statusService', 'UserService','AdminService','Session', 'Msg','Validation','commonDataService',
	function($scope, $rootScope, toastr, $timeout, $state, $stateParams, statusService, UserService, AdminService,Session, Msg, Validation, commonDataService){
	 $scope.init = function(){
	    	$(function () {
	    		setTimeout(function(){ $('#contact').val($('#contact').val()).trigger('change');}, 10);
	    	});
	    };
		
	var original = $scope.createUser;
	$scope.submitted=false;
	$scope.createUser = {};
	$scope.phNoLn = false;
	$scope.userRole = '0';
	$scope.isNpci = true;
	$scope.disablesOneBankName = false;
	$scope.orgName = commonDataService.getLocalStorage().orgName;
		var perspective=[];

		var resetPerspective=function(){
			$scope.npciPerspective=[{name:'ISSUER', checked:false, value:'ISSUER'},
				{name:'ACQUIRER',checked:false, value:'ACQUIRER'},
				{name:'AML',checked:false, value:'AML'}];
			$scope.bankPerspective=[{name:'ISSUER',checked:false, value:'ISSUER'},
				{name:'ACQUIRER',checked:false, value:'ACQUIRER'}];
			$scope.requiredperspective =true;
			$scope.selectedPerspective=false;
			$scope.amlSelected=false;
			$scope.disableAml=false;
			perspective=[];
		}

		resetPerspective();

		//for eidt
		var persItem={};
		//var updatedPerspective=[];

	//$scope.roleSelected=false;
		$scope.showNPCI = false;
//$scope.roleSelected=false;
		$scope.changePerspective=function(selectedPerspective,item){
			
			if(item.value=='AML'&& selectedPerspective==true){
				$scope.amlSelected=true;
				$scope.npciPerspective[0].checked=false;
				$scope.npciPerspective[1].checked=false;
			}else{
				$scope.amlSelected=false;
			}
			if((item.value=='ISSUER' || item.value=='ACQUIRER') && selectedPerspective==true){
				$scope.disableAml=true;
			}else if((item.value !='ISSUER' || item.value !='ACQUIRER')&& perspective.length==1 && selectedPerspective==false){
				$scope.disableAml=false;
			}
			
		if(selectedPerspective==true && !perspective.includes(item.value)){
			perspective.push(item.value);
		}
		if(selectedPerspective!=true && perspective.includes(item.value)){
			var i = perspective.indexOf(item.value);
			perspective.splice(i,1);
		}
		if(perspective.length==0){
			$scope.requiredperspective=true;
		}else{
			$scope.requiredperspective=false;
		}
	}

		$scope.items = $scope.roles;
    $scope.isEditable = false;
	if($stateParams.editable != undefined && $stateParams.editable == 'Y'){
		$scope.isEditable = true;
		var user = $stateParams.value;
		if(user.orgId != 'NPCI'){
		$scope.disabledBanknameDropdown = true;
		$scope.showBanknameDropdown = true;
		$scope.isNpci = false;
		}
		AdminService.header({}).getRoles({orgId : user.orgId},function(data) {
        	$scope.items = [];  
        	var dataList = [];
            //$scope.items = data.response;  
        	dataList = data.response;  
            if(user.orgId == 'NPCI'){
            	$scope.items = dataList.filter(function (el) {
            		  return el.includes("NPCI")
            	});
            }else{
            	$scope.items = dataList;
            }

        },function(err){
        	$scope.items = []; 
        });
		AdminService.header({}).bankNames({role : user.userAuthorities[0].authority},function(data) {
        	$scope.banknNames = [];                    
            $scope.banknNames = data.response;  
        },function(err){
        	$scope.banknNames = []; 
        });
		
		$scope.createUser.orgId = user.orgId;
		$scope.createUser.userId = user.userId;
		$scope.createUser.firstName = user.firstName;
		$scope.createUser.middleName = user.middleName;
		$scope.createUser.lastName = user.lastName;
		$scope.createUser.phoneNo = user.phoneNo;		
		$scope.createUser.username = user.email;
		$scope.createUser.status = user.status;
		$scope.createUser.locked = user.locked;
		$scope.createUser.createdByNotes = user.createdByNotes;
		$scope.createUser.lastUpdatedBy = commonDataService.getLocalStorage().userEmail;
		$scope.userRole = user.userAuthorities[0].authority;
		perspective=[];
		var updatederspective=[]
		if($scope.userRole.indexOf('NPCI') >= 0 || userRole == "0"){
			$scope.showBanknameDropdown = false;
			$scope.showNPCI = true;

			if(!angular.isUndefined(user.perspective)){
				//$scope.selectedPerspective=user.perspective.split(',');
				$scope.npciPerspective.forEach(function (item) {
					
					if(user.perspective.includes(item.name)){
						item.checked=true
						perspective.push(item.value);
						if(item.value=='AML'&& item.checked==true){
							$scope.amlSelected=true;
							$scope.npciPerspective[0].checked=false;
							$scope.npciPerspective[1].checked=false;
						}
						if((item.value=='ISSUER' || item.value=='ACQUIRER') && item.checked==true){
							$scope.disableAml=true;
						}else if((item.value !='ISSUER' || item.value !='ACQUIRER')&& perspective.length==1 && item.checked==true){
							$scope.disableAml=false;
						}

					}else{
						item.checked=false
					}
					//$scope.requiredperspective=false
					updatederspective.push(item);
				})

				
				$scope.npciPerspective=updatederspective;
				if($scope.npciPerspective.length==0){
					$scope.requiredperspective=true;
				}else{
					$scope.requiredperspective=false;
				}
				
			}
		}else{
			if(!angular.isUndefined(user.perspective)){
				$scope.bankPerspective.forEach(function (item) {
					if(user.perspective.includes(item.name)){
						item.checked=true
						perspective.push(item.value);
					}else{
						item.checked=false
					}

					updatederspective.push(item);
				})
				$scope.bankPerspective=updatederspective;
				if($scope.bankPerspective.length==0){
					$scope.requiredperspective=true;
				}else{
					$scope.requiredperspective=false;
				}
				
				$scope.showBanknameDropdown = true;
			}

		}
		$scope.init();
	}
	$scope.PfirstLetter = function(){
		$(function () {
			var priContact = $('#contact').val();
			var PfirstChar = priContact.charAt(0);
			/*if(PfirstChar === '0'){
				$('#contact').val('');
			}	*/		
		})
	}
	$scope.isMiddleNamePresent = function(middleName){
	    return Validation.doNullCheck(middleName);
	}
	$('#contact').bind("cut copy paste",function(e) {
	     e.preventDefault();
	});
	$scope.response = statusService.getResponseMessage();
	$rootScope.welcomeName = $scope.response.usersAuthoritiesPermissionsDto.firstName;
	$scope.csrMgr = $scope.response.usersAuthoritiesPermissionsDto.authority;
	if($scope.csrMgr == 'ROLE_CSR_MGR'){
		$scope.items = [
			{ name:"PLEASE SELECT A ROLE",val:"0", show:false},	    	
	    	{ name:"CSR",val:"ROLE_CSR", show:true},
	    	{ name:"CSR SUPERVISOR",val:"ROLE_CSR_SUPERVISOR", show:true}
	    ]
	}
	
	$scope.loggedUserOrgId = commonDataService.getLocalStorage().orgId;
	
	$scope.checLoginkUser = function(){
	if($stateParams.editable != 'Y'){
		if($scope.loggedUserOrgId != "NPCI"){
			$scope.disabledBanknameDropdown = true;
			$scope.disablesOneBankName = true;
			$scope.createUser.orgId = $scope.loggedUserOrgId;
			$scope.oneBankName = $scope.loggedUserOrgId;
		}
		if($scope.loggedUserOrgId == "NPCI"){
			$scope.createUser.orgId = $scope.loggedUserOrgId;
		}
	}
	}
	
	$scope.changedValue = function(userRole){
		resetPerspective();
		//$scope.roleSelected=true;
		if($scope.loggedUserOrgId =="NPCI"){
		if($scope.isNpci == true){
		var text = userRole;
		if(userRole != "0"){
			$scope.submitted = false;
		AdminService.header($scope.response.token).bankNames({role : userRole},function(data) {
        	$scope.banknNames = [];
			perspective=[];
            $scope.banknNames = data.response;  
            if($scope.banknNames.length == 1){
            	    //$scope.disablesOneBankName = true;
            		$scope.oneBankName = $scope.banknNames[0].name;
            		$scope.oneBankOrgId = $scope.banknNames[0].orgId;
            		$scope.createUser.orgId = $scope.oneBankOrgId;
            	
            }else{
				perspective=[];
            	$scope.oneBankName = null;
            	//$scope.disablesOneBankName = false;
				$scope.createUser.orgId='';

            }
        },function(err){
        	$scope.banknNames = []; 
        });
		}
		if(text.indexOf('NPCI') >= 0 || userRole == "0"){
			$scope.showBanknameDropdown = false;
			$scope.showNPCI = true;
		}else{
			$scope.showBanknameDropdown = true;
		}
		}
	  }else{
		  $scope.showBanknameDropdown = true;
		  $scope.createUser.orgId=commonDataService.getLocalStorage().orgId;
	  }
	}

    $scope.createUserSubmit = function(){
		console.log($scope.createUser.orgId)
		if(perspective.length==0){
			$scope.requiredperspective=true;
		}else{
			$scope.requiredperspective=false;
		}
		if($scope.requiredperspective==true){
			return false;
		}else{
			if($scope.userRole == '0'){
				return false;
			}
			/*if($scope.userRole.indexOf('NPCI') >= 0){
				$scope.createUser.orgId=$scope.banknNames[0].orgId;
			}*/
			$scope.createUser.email = $scope.createUser.username;
			var authority = {};
			authority.authority = $scope.userRole;
			$scope.createUser.userAuthorities = [];
			$scope.createUser.userAuthorities.push(authority);
			$scope.createUser.firstName = Validation.doCapitalize($scope.createUser.firstName);
			$scope.createUser.middleName = Validation.doCapitalize($scope.isMiddleNamePresent($scope.createUser.middleName));
			$scope.createUser.lastName = Validation.doCapitalize($scope.createUser.lastName);
			$scope.createUser.createdByReason = null;
			$scope.createUser.perspective=perspective;
			
			if(!$scope.isEditable){
				$scope.oneBankName = null;
				AdminService.header($scope.response.token).create({orgId:null,email:null},$scope.createUser, function(data) {
					$scope.thisSession = data;
					toastr.success(data.message, Msg.hurrah);
					$scope.userRole =  '0';
					$scope.showBanknameDropdown = false;
					$scope.showNPCI = false;
					$scope.createUserForm.$setUntouched(true);
					$scope.createUserForm.$setPristine(true);
					$scope.createUser = {};
					$scope.checLoginkUser();
					$scope.submitted = false;
					$scope.requiredperspective =true;
				},function(err){
				});
			}else{
				$scope.createUser.editedNotes = $scope.createUser.createdByNotes;
				$scope.createUser.lastEditedBy = $scope.createUser.lastUpdatedBy;
				AdminService.header($scope.response.token).update({orgId:null,email:null},$scope.createUser, function(data) {
					$scope.thisSession = data;
					toastr.success(data.message, Msg.hurrah);
					$scope.backToSearch();
					
				},function(err){
					$scope.backToSearch();
				});
			}
		}

    };
    
    $scope.roleDisplay = function(role){
    	/*var str = authorityRole;
    	var afterRemovingRole = str.replace("ROLE","");
    	var finalTxt = afterRemovingRole.replace(/_/g," ");
    	return finalTxt;*/
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
    
    $scope.isNpciLogin = function(){
		if($scope.loggedUserOrgId !="NPCI"){
			
			$scope.createUser.orgId = $scope.loggedUserOrgId;
			$scope.organisationDisabled = true;
		}else{
			$scope.organisationDisabled = false;
		}
	}
    $scope.isNpciLogin();
    $scope.init = function(){
    	UserService.header({}).session({}, function(data){
		}, function(err){});

    	if(!$scope.isEditable){
    	AdminService.header($scope.response.token).getRoles({orgId : $scope.loggedUserOrgId},function(data) {
        	$scope.items = [];                    
            $scope.items = data.response;  
        },function(err){
        	$scope.items = []; 
        });
    	}
    	
    	 $scope.checLoginkUser();

    }

		$scope.backToSearch = function() {
			localStorage.setItem("prev_path_view", "seacrhUserDetails")
			// change for back button//
			$state.go('dashboard.search');
		}

    $scope.init();
   
}])