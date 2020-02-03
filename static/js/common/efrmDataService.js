'use strict';
angular.module('efrm.service')
.constant('Util',{
	    imagePath : './img',
	    moment 	  : moment,
	    restPath  : ''
})
.constant('Msg',{
	    oops	: '',
	    hurrah	: ''
})
.factory('statusService', [function() {
	var responseMessage = null;
	return {				
		setResponseMessage : function(msg){
			responseMessage = msg;
		},
		getResponseMessage : function(){
			return responseMessage;
		}
	}
}])
.factory('DataService', [function(){
	var allPermissions = null;
	var reasons		   = null;
	var parameters	   = null;
	var cardHolder	   = null;
	return {				
		setPermissions : function(permissions){
			allPermissions = permissions;
		},
		getPermissions : function(){
			return allPermissions;
		},
		setReasons : function(r){
			reasons = r;
		},
		getReasons : function(){			
			return reasons;
		},
		setParameters : function(p){
			parameters = p;
		},
		getParameters : function(){
			return parameters;
		},
		getReasonCode : function(code, value){
			return _.filter(reasons, {domain : code, domainCode : parseInt(value)})[0].domainDescription;
		},
		setCardHolder : function(card){
			cardHolder = card;
		},
		getCardHolder : function(){
			return cardHolder;
		}
	}
}])
.factory('RolePermissionMatrix', [function(){
	var authority = null;
	return {				
		setAuthority : function(a){
			authority = a;
		},
		getAuthority : function(){
			return authority;
		},
		isPermissionGranted : function(permissionRefId){
			return (_.filter(authority, {permissionRefId : permissionRefId})).length > 0 ? true : false;
		}
	}
}])
.factory('Session', [function(){
	var session = null;
	var token = '';
	var csrf = '';
	return {
		setCsrf : function(c){
			csrf = c;
		},
		getCsrf : function(){
			return csrf;
		},
		setSession : function(s){
			session = s;
		},
		getSession : function(){
			return session;
		},
		isSameLoggedInUser : function(emailToBeUpdated){
			return emailToBeUpdated == session.usersAuthoritiesPermissionsDto.email;
		},
		getLoggedInUser : function(){
			return session.usersAuthoritiesPermissionsDto.email;
		},
		getLoggedInUserRole : function(){
			return session.usersAuthoritiesPermissionsDto.authority;
		},
		setToken : function(t){
			token = t;
		},
		getToken : function(t){
			return token;
		},
		clear : function(){
			token = '';
		}
	}
}])
.factory('Convert',function(){
	return {
		'stringToHex' : function(str){
			var hex = '';
			for(var i=0; i<str.length; i++) {
				hex += '' + str.charCodeAt(i).toString(16);
			}
			return hex;
		},
		'hexToString' : function(hex){
			var string = '';
		    for (var i = 0; i < hex.length; i += 2) {
		      string += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
		    }
		    return string;
		}
	}
})
.factory('Export',['$q', '$timeout', function($q, $timeout){
	return {
		'asPdf' : function(renderArea, reportName, frequency){
			var deferred = $q.defer();
			$timeout(function () {
				var divHeight = $(renderArea).height();
				var divWidth = $(renderArea).width();
				var ratio = divHeight / divWidth;
		        html2canvas(document.querySelector(renderArea), {
		            onrendered: function(canvas) {
		            	canvas.getContext("2d").fillStyle = '#ffffff'; 
		            	var imgData = canvas.toDataURL("image/jpeg", 1.0);
		            	var doc = new jsPDF(); 
		                var width = doc.internal.pageSize.width;    
		                var height = doc.internal.pageSize.height;
		                height = ratio * width;
		                doc.addImage(imgData, 'JPEG', 5, 5, width-10, height);
		                if(reportName != 'Billing Statement Balance'){
		                	doc.save(reportName+'_'+frequency+'.pdf'); 
		                }else{
		                	doc.save(reportName+'.pdf'); 
		                }
		                
		                //doc.save(reportName+'.pdf'); 
		                deferred.resolve('downloaded');
		            }
		        });
			 }, 5000 );
	        return deferred.promise;
		},
		'print' : function(renderArea){
			var deferred = $q.defer();
			$timeout(function () {
				var divHeight = $(renderArea).height();
				var divWidth = $(renderArea).width();
				var ratio = divHeight / divWidth;
		        html2canvas(document.querySelector(renderArea), {
		            onrendered: function(canvas) {
		            	canvas.getContext("2d").fillStyle = '#ffffff'; 
		            	var imgData = canvas.toDataURL("image/jpeg", 1.0);
		            	var windowContent = '<!DOCTYPE html>';
		            	windowContent += '<html>'
		            	windowContent += '<head><title>Print Report</title></head>';
		            	windowContent += '<body>'
		            	windowContent += '<img src="' + imgData + '">';
		            	windowContent += '</body>';
		            	windowContent += '</html>';
		            	var printWin = window.open('', '', 'width=340,height=260');
		            	printWin.document.open();
		            	printWin.document.write(windowContent);
		            	//printWin.document.close();
		            	//printWin.focus();
		            	$timeout(function () {
		            		printWin.print();
		            	},100);
		            	
		            	//printWin.close();
		            	deferred.resolve('downloaded');
		            }
		        });
			 }, 5000 );
	        return deferred.promise;
		},
		'asExcel' : function(blobData, downloadedFilename){
			var result = '';
			var sliceSize =  512;
			var result =  blobData;
			result = atob(result);

			var uint8Array = new Uint8Array(result.length);
			for (var i = 0; i < result.length; i++) {
				uint8Array[i] = result.charCodeAt(i);
			}

			result = uint8Array;
			var currentBlob = new Blob([result], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
			var excelUrl = URL.createObjectURL(currentBlob);
			saveAs(currentBlob, downloadedFilename);
		}
	}
}])
.factory('Validation', function() {
	return {
		'doCapitalize' : function(name){
			if(name == undefined || name == false){
				return; 
			}
			else{				
				return name.charAt(0).toUpperCase() + name.slice(1);
			}
		},
		'doNullCheck' : function(element){
			if(element != undefined){
				return element;
			}
			else{
				return false;
			}
		}
	}
 })
 .service('getpopupdata', function() {
     this.message = '';
 })
 
	.factory('RuleService', [function(){
		var ruleDetails = null;
		var createPath=null;
		var copyRule=null;
		var editRule=null;
		var selectedChannel=null;
		var selectedOrgId=null;
		var selectedStatus=null;
		var prevPath=null;
		var editRuleSet=null;
		var ruleSetDetails=null;
		var setSelectedOrgIdForRuleSet=null;
		var viewRuleSet=null;
		var editRuleSet=null;
		var setOrgForUnique=null;
		var getOrgForUnique=null;
		var orgForUniqueRule=null;
		
		var setViewRuleComeFrom=null;
		var getViewRuleComeFrom=null;
		var viewRuleComeFrom=null;
		
		return {
			setViewRuleComeFrom : function(back){
				viewRuleComeFrom = back;
			},
			getViewRuleComeFrom : function(){
				return viewRuleComeFrom;
			},
		
			
			setOrgForUnique : function(org){
				orgForUniqueRule = org;
			},
			getOrgForUnique : function(){
				return orgForUniqueRule;
			},
		
			setRuleSet : function(ruleset){
				ruleSetDetails = ruleset;
			},
			getRuleSet : function(){
				return ruleSetDetails;
			},	
			setSelectedOrgIdForRuleSet:function(orgId){
				setSelectedOrgIdForRuleSet=orgId;
			},
			getSelectedOrgIdForRuleSet:function(){
				return setSelectedOrgIdForRuleSet;
			},
			
			setViewFlagForRuleSet:function (flag) {
				viewRuleSet=flag;
			},
			getViewFlagForRuleSet : function(){
				return viewRuleSet;
			},
			setEditFlagForRuleSet: function (flag) {
				editRuleSet=flag
			},
			getEditFlagForRuleSet: function () {
				return editRuleSet;
			},
			
			
		
			setRules : function(rules){
				ruleDetails = rules;
			},
			getRules : function(){
				return ruleDetails;
			},
			setSelectedOrgId:function(orgId){
				selectedOrgId=orgId;
			},
			getSelectedOrgId:function(){
				return selectedOrgId;
			},
			setSelectedChannel:function(channel){
				selectedChannel=channel;
			},
			getSelectedChannel:function(){
				return selectedChannel;
			},
			setSelectedStatus:function(status){
				selectedStatus=status;
			},
			getSelectedStatus:function(){
				return selectedStatus;
			},
			setPrevPath:function(path){
				prevPath=path;
			},
			getPrevPath:function(){
				return prevPath;
			},
			setCreateFlag:function (path) {
				createPath=path;
			},
			getCreateFlag : function(){
				return createPath;
			},
			setCopyFlag:function (flag) {
				copyRule=flag;
			},
			getCopyFlag : function(){
				return copyRule;
			},
			setEditFlag: function (flag) {
				editRule=flag
			},
			getEditFlag: function () {
				return editRule;
			}
		}
	}])
	.factory('BinService', [function(){
		var binDetails = null;
		var createPath=null;
		var binAction=null
		var selectedChannel=null;
		var selectedOrgId=null;
		var selectedStatus=null;
		var prevPath=null;
		return {
			setBinDetails:function(bin){
				binDetails=bin;
			},
			getBinDetails:function(){
				return binDetails;
			},
			setBinAction:function(action){
				binAction=action;
			},
			getBinAction:function(){
				return binAction;
			},
			setSelectedOrgId:function(orgId){
				selectedOrgId=orgId;
			},
			getSelectedOrgId:function(){
				return selectedOrgId;
			}
		}
	}])
	.factory('AbnormalHoursService', [function(){
		var abnormalHoursDetails = '';
		var createPath='';
		return {
			getCreateFlag : function(){
				return createPath;
			},
			setAbnormalHoursDetails : function(rules){
				abnormalHoursDetails = rules;
			},
			getAbnormalHoursDetails : function(){
				return abnormalHoursDetails;
			},
			setCreateFlag:function (path) {
				createPath=path;
			}

		}
	}])
	.factory('AlertDataService', [function(){
		var alertDataDetails = '';
		return {
			setAlertDataDetails : function(alertData){
				alertDataDetails = alertData;
			},
			getAlertDataDetails : function(){
				return alertDataDetails;
			}

		}
	}])
    .factory('EmailIdForSecurityQues', [function() {
         var email = '';
         return{
         getEmail : function() {
             return email;
         },
         setEmail : function(data) {
             email = data;
         }
         }
   	}])
   	.factory('archive', [function() {
         var archive_value='false';
         return {
        	     setArchive: setArchive,
	        	 getArchive: getArchive
	        	 
             };
             function setArchive(val) {
            	 archive_value = val;
             }
         function getArchive() {
        	 return archive_value;
         }
         
   	}]);
