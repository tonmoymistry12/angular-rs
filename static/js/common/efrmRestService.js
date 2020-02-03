'use strict';
angular.module('efrm.service')
.factory('UserService', ['$resource', 'Session','Util', function($resource, Session, Util) {
	return {
	   header : function (header) {
	        return $resource('/auth', null, {
	        	'login'			 : { method: 'POST', url : '/auth?ts='+Util.moment().valueOf(), headers: { 'X-Auth-Username' : header.id, 'X-Auth-Password' : header.password } },
	        	'resetFirstPass' : { method: 'PUT',  url : '/config/users/changePassword?ts='+Util.moment().valueOf(), headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() } },
	        	'logout' 		 : { method: 'POST', url : '/signout?ts='+Util.moment().valueOf(), isArray:false, headers: { 'X-Auth-Token' : Session.getToken(), 'x-csrf-token' : Session.getCsrf()}},
	        	'forgotPass' 	 : {method:'PUT', 	url : '/config/users/password?ts='+Util.moment().valueOf(), isArray:false, headers: {'X-Auth-Token' : Session.getToken(), 'x-csrf-token' : Session.getCsrf() }},
	            'otp' 			 : {method:'POST', 	url : '/config/users/password/otp?ts='+Util.moment().valueOf(), isArray:false},
	            'otpauth' 		 : {method:'POST', 	url : '/config/users/login/otp?ts='+Util.moment().valueOf(), isArray:false, headers: {'X-Auth-Token' : Session.getToken(),'x-csrf-token' : Session.getCsrf() }},
	            'session' 		 : {method:'GET', url : '/session/isvalid?ts='+Util.moment().valueOf(), isArray:false, headers: { 'X-Auth-Token' : Session.getToken(), 'x-csrf-token' : Session.getCsrf()  }},
	            'changePass' 	 : {method:'PUT', url : '/config/users/changeLogInUsrPassword?ts='+Util.moment().valueOf(), isArray:false, headers: {'X-Auth-Token' : Session.getToken(), 'x-csrf-token' : Session.getCsrf() }},
                'securityQues'   : {method:'GET', url : '/getSecurityQuestions?ts='+Util.moment().valueOf(), isArray:false, headers: { 'X-Auth-Token' : Session.getToken(), 'x-csrf-token' : Session.getCsrf(),'email':header.email  }},
                'updateSeqQues'   : {method:'PUT', url : '/config/users/updateSecurityQuestion?ts='+Util.moment().valueOf(), isArray:false, headers: { 'X-Auth-Token' : Session.getToken(), 'x-csrf-token' : Session.getCsrf()  }},
                'validateSecQues'   : {method:'POST', url : '/config/users/validateSecurityQues?ts='+Util.moment().valueOf(), isArray:false, headers: { 'X-Auth-Token' : Session.getToken(), 'x-csrf-token' : Session.getCsrf()  }},
			})
	    }
	};
}])
.factory('AdminService', ['$resource', 'Session', 'Util', function($resource, Session, Util) {
	return {
    	header: function (token) {
        	return $resource('/config/users', {email : '@email', address : '@address' ,orgId:'@orgId', role:'@role' ,criteria:'@criteria',filter:'@filter',status:'@status',loggedInOrgId:'@loggedInOrgId',roleName:'@roleName', selectedOrgId:'@selectedOrgId'}, {
            	create  : { method:'POST', url : '/config/users?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() } },
				search  : { method:'GET', url : '/config/users?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() } },
            	update  : { method:'PUT', url : '/config/users?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() } },
            	unlock  : { method:'PUT', url : '/config/users/state?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf()  } },
            	deactive: { method:'PUT', url : '/config/users/status?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf()  } },
            	reactive: { method:'PUT', url : '/config/users/status?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf()  } },
            	getRoles  : { method:'GET', url : '/config/bankdetails/v1/roles/:orgId?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() } },
            	bankNames  : { method:'GET', url : '/config/bankdetails/v1/organisations/:role?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() } },
        		getUnapprovedList  : { method:'GET', url : 'config/makerchecker/unapprovedlist/:filter/:criteria?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() } },
        		activeDecativeUnapprovedList  : { method:'GET', url : 'config/makerchecker/unapprovedlist/:filter/:criteria/:status?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() } },
        		updateUnapprovedList  : { method:'PUT', url : '/config/makerchecker?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() } },
        		resetRoles  : { method:'PUT', url : '/efrm/config/permission/request/reset/:role/:orgId?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() } },
        		resetRoleReject  : { method:'PUT', url : 'efrm/config/permission/reject/reset/:roleName/:orgId?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() } },
        		resetRoleApprove  : { method:'PUT', url : '/efrm/config/permission/approve/reset/:roleName/:orgId?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() } },
        		unparroveResetRole  : { method:'GET', url : '/efrm/config/permission/all/reset/pending?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() } }
        	})
    	}
	}
}])
.factory('Permission', ['$resource', 'Session', 'Util', function($resource, Session, Util) {
	return {
    	header: function (header) {
        	return $resource('config/roles/permissions', {roleName: '@roleName', orgId: '@orgId'}, {
            	'fetchPermissions'	  : { method:'GET', url : 'config/roles/:roleName/:orgId?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf()  } },
            	'all'  	  : { method:'GET', url : 'config/roles/permissions?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf()  } },
            	'update'  : { method:'PUT', url : 'config/roles/permissions?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf()  } },
				'createrole'  : {method:'POST', url : '/config/users/createrole?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf()  }}
        	})
    	}
	}
}])
.factory('Lookup', ['$resource', 'Session', 'Util', function($resource, Session, Util) {
	return {
    	header: function (token) {
        	return $resource('config/domain', {}, {
            	'reason'	  : { method:'GET', url : 'config/domain?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf()   } },
            	'parameters' : { method:'GET',  url : 'config/parameters?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() } },
        	})
    	}
	}
}])
.factory('Report', ['$resource', 'Session', 'Util', function($resource, Session, Util) {
	return {
    	header: function (header) {
        	return $resource('config/reports/accounts', {reportType : '@reportType'}, {
            	'plots'	 	     : { method:'GET', url : 'config/reports/plots?reportType=:reportType&ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() } },
            	'summary'	     : { method:'GET', url : 'config/reports/summary?reportType=:reportType&ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() } },
            	'summaryexcel'	 : { method:'GET', url : 'config/reports/excel?reportType=:reportType&from=:from&to=:to&ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() } }
              	})
    	}
	}
}])
.factory('chartData', ['$resource', 'Session', 'Util', function($resource, Session, Util) {
	return {
    	header: function (header) {
        	return $resource('config/frauds', {}, {
        		
	            'chartdata' : {method:'GET', 	url : 'config/frauds?ts='+Util.moment().valueOf(), isArray:false, headers: {'req_id':'343455', 'X-Force-Content-Type': 'application/json','x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf()}
	            }
	            
        	})
    	}
	}
}])
.factory('QueueService', ['$resource', 'Session', 'Util', 'commonDataService', function($resource, Session, Util,commonDataService) {
	return {
    	header: function (header) {
        	return $resource('efrm/queue', {loggedInOrgId:'@loggedInOrgId',userId:'@userId',selectedOrgId:'selectedOrgId',orgId:'@orgId',email:'@email',queueCode:'@queueCode',queueId:'@queueId',channel:'@channel',isPlainText:'@isPlainText',count:'@count',queueActionType:'@queueActionType',flag:'@flag',pageNumber:'@pageNumber'}, {
        		viewQueue  : { method:'GET', url : 'efrm/queue/frm/1.0/taskQueueByOrgIdAndStatus/:orgId/:queueActionType?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() } },
				fetchAllApprovedUnassignedQueues  : { method:'GET', url : 'queue/fetchAllApprovedUnassignedQueues/:orgId?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() } },
				viewCases  : { method:'GET', url : 'queue/frm/1.0/taskQueueByOrgIdAndStatus/:orgId/ALL?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() } },
        		createQueue  : { method:'POST', url : 'efrm/queue/frm/1.0/taskQueue?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },
        		updateQueue  : { method:'PUT', url : 'efrm/queue/frm/1.0/taskQueue?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId  } },
        		manageQueue  : { method:'PUT', url : 'efrm/queue/frm/1.0/taskQueue?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },
				refreshQueue  : { method:'POST', url : 'efrm/queue/frm/1.0/refreshQueues?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },
				getUserList  : { method:'GET', url : 'efrm/case/frm/1.0/users?loggedInOrgId=:loggedInOrgId&selectedOrgId=:selectedOrgId&ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() } },
				fetchUserByQueueCode: { method:'GET', url : 'efrm/queue/fetchUserByQueueCode/:queueCode/:channel/:queueId/:selectedOrgId/:loggedInOrgId/:userId?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() } },
				removeUserFromQueue: { method:'PUT', url : 'efrm/queue/userByQueueCode/:queueCode/:channel/:selectedOrgId?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() } },
				queueList  : { method:'GET', url : 'efrm/queue/frm/1.0/fetchQueue?selectedOrgId=:selectedOrgId&channel=:channel&ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },
        		assignQueue  : { method:'GET', url : 'efrm/queue/frm/1.0/assignedQueueDetails/:email?selectedOrgId=:selectedOrgId&channel=:channel&flag=:flag&ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() } },
        		getTransaction  : { method:'GET', url : '/efrm/queue/frm/1.0/fieldsByChannel/:channel/ACTIVE?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },
        		saveQueue  : { method:'POST', url : 'efrm/queue/frm/1.0/saveQueueMakerChecker?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() } },
        		queueInMyCases  : { method:'POST', url : 'efrm/queue/frm/1.0/caseInQueue?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },
        		//alertInQueue  : { method:'POST', url : 'efrm/queue/frm/1.0/alertInQueue/:count?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':localStorage.getItem("orgId") } }
        		alertInQueue  : { method:'POST', url : 'efrm/queue/frm/1.0/alertCaseTransactionInQueue/:count?pageNumber=:pageNumber&ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },
        		assignQueueMakerChacker  : { method:'GET', url : 'efrm/queue/frm/1.0/unapprovedAssignments?orgId=:selectedOrgId&ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() } },
        		assignQueueMakerChackerApproveReject : { method:'PUT', url : '/efrm/queue/frm/1.0/updateStatus?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() } },
        		getIssuerUser  : { method:'GET', url : '/config/users/:selectedOrgId/ISSUER?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() } },
        		getAquirerUser  : { method:'GET', url : '/config/users/:selectedOrgId/ACQUIRER?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() } },
        		getAmlUser  : { method:'GET', url : '/config/users/:selectedOrgId/AML?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() } },
        		getQueuePrespective  : { method:'GET', url : 'efrm/queue/frm/v1/checkQueuePerspective/:selectedOrgId/:channel/:queueCode?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() } }
        	})
    	}
	}
}]) 
	.factory('MyCases',['$resource', 'Session', 'Util','commonDataService', function($resource, Session, Util, commonDataService){
        return{
            header: function (header) {
                return $resource('frm/myCases', {orgId :'@orgId',userId :'@userId',isPlainText: '@isPlainText',count: '@count', status:'@status'}, {

                    'mycases' : {method:'GET', 	url : '/efrm/case/frm/1.0/myCases/:orgId/:userId/:isPlainText/:count/:status?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() }},
                    'searchcase': { method:'POST',  url : '/efrm/case/frm/1.0/searchCase?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } }

                })
            }
        }
    }])
	.factory('MyAlerts',['$resource', 'Session', 'Util','commonDataService', function($resource, Session, Util, commonDataService){
		return{
			header: function (header) {
				return $resource('frm/myAlerts', {orgId :'@orgId',userId :'@userId',alertId:'@alertId', status:'@status',isPlainText: '@isPlainText',count: '@count'}, {

					'myAlerts' : {method:'GET', 	url : '/efrm/case/frm/1.0/myAlerts/:orgId/:userId/:status/:isPlainText/:count?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() }},
					//'myAlerts' : {method:'GET', 	url : '/efrm/case/frm/1.0/myAlerts/ALL/:userId/:status/:isPlainText/:count?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() }},
					'lockStatus' : { method:'POST', url : 'efrm/case/frm/1.0/lockStatus?alertId=:alertId&ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },
					'addAlertNotes' : { method:'POST', url : 'efrm/case/frm/1.0/alertNotes?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } }

				})
			}
		}
	}])
    .service('SearchCaseService',[function(){
        var data = {};

        this.setSearchCase = function (caseId,orgId,sourceChannel,SelectedPerspective) {
            data = {
                'caseId': caseId,
                'orgId': orgId,
				'sourceChannel':sourceChannel,
				'perspective':SelectedPerspective
				

            };
        }


        this.getSearchCase = function () {
            return data;
        }
    }])
    .factory('casesManagement', ['$resource', 'Session', 'Util','commonDataService', function($resource, Session, Util,commonDataService) {
	return {
    	header: function (header) {
        	return $resource('/frm/1/casesByOrgidAndStatus', {
        		organisationID: '@organisationID', 
        		status: '@status', 
        		fromDate: '@fromDate', 
        		toDate: '@toDate', 
        		caseId: '@caseId', 
        		prespective : '@prespective', 
        		value : '@value' , 
        		channel: '@channel', 
        		isPlainText : '@isPlainText',
        		dataSize: '@dataSize',
        		count: '@count',
        		hotlistType : '@hotlistType',
        		actionType : '@actionType',
        		hotListEntity : '@hotListEntity',
        		loggedInOrgId:'@loggedInOrgId',
        		selectedOrgId:'@selectedOrgId',
				screen:'@screen',
				isAlertNoteRequired:'@isAlertNoteRequired',
				userId:'@userId'}, {
        		
	            'reviewcases' : { method:'GET', url : 'efrm/case/frm/1.0/casesByOrgidStatusPerspectiveAml/:organisationID/:status/:prespective/:fromDate/:toDate/:channel/:isPlainText/:pageNumber/:count?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() } },
	            'approvecases' : { method:'PUT', url : 'efrm/case/frm/1.0/caseStatus/:caseId?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },
	            'rejectcases' : { method:'PUT', url : 'efrm/case/frm/1.0/caseStatus/:caseId?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },
	            'unassignedCases' : { method:'GET', url : 'efrm/case/frm/1.0/unassignedCases/:orgId/:fromDate/:toDate/:channel/:dataSize/:isPlainText?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() } },
	            'unCases_dropdown' : { method:'GET', url : 'efrm/case/frm/1.0/users?loggedInOrgId=:loggedInOrgId&selectedOrgId=:selectedOrgId&ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() } },
	            'unCases_dropdown1' : { method:'GET', url : 'efrm/case/frm/1.0/users?loggedInOrgId=:loggedInOrgId&selectedOrgId=:selectedOrgId&perspective=:prespective&ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() } },
	            'assignCases' : { method:'POST', url : 'efrm/case/frm/1.0/caseOwnerUser?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId} },
	            'organisations' : { method:'GET', url : 'config/bankdetails/v1/organisations?orgId=:organisationID&ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() } },
	            'channel' : { method:'GET', url : 'config/bankdetails/v1/channels?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() } },
                'addNotes' : { method:'POST', url : 'efrm/case/frm/1.0/caseNotes?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },
                'editHold' : { method:'POST', url : 'efrm/case/frm/1.0/holdStatus?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },
                'editLock' : { method:'POST', url : 'efrm/case/frm/1.0/lockStatus?alertId=0&ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },
                'editPriority' : { method:'POST', url : 'efrm/case/frm/1.0/casePriority?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },
                'closecase' : { method:'PUT', url : '/efrm/case/frm/1.0/caseStatus/:caseId?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },
                'hotlists' : { method:'GET', url : 'efrm/hotlist/frm-hotlist/1.0/hotlistByTypeAndStatusAndCode/:hotListEntity/:actionType/:hotlistType/:channel/:organisationID/:isPlainText?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(),'orgId':commonDataService.getLocalStorage().orgId } }, 
                'hotListEntity' : { method:'GET', url : 'efrm/hotlist/frm-hotlist/1.0/hotlistTypeByStatus/ACTIVE/:channel?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } }, 
                'apprveRejectHotlist' : { method:'PUT', url : 'efrm/hotlist/frm-hotlist/1.0/hotlist?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },
                'insertToHotlist' : { method:'POST', url : 'efrm/hotlist/frm-hotlist/1.0/hotlist?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },
                'unassignedAlerts' : { method:'GET', url : 'efrm/case/frm/1.0/unassignedAlerts/:orgId/:fromDate/:toDate/:channel/:isPlainText/:pageNumber/:count/:isAlertNoteRequired?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() } },
                'assignAlerts' : { method:'POST', url : 'efrm/case/frm/1.0/assignAlert?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId} },
                'getCaseNotes' : { method:'GET', url : 'efrm/case/caseNotesList?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() } },
				'getPreferences' : {method:'GET', url : 'efrm/case/preference/:screen/:channel?ts='+Util.moment().valueOf(), isArray:false, headers: { 'X-Auth-Token' : Session.getToken(), 'x-csrf-token' : Session.getCsrf()  }},
				'getPreferencesByUserId' : {method:'GET', url : 'efrm/case/users/:userId/preference/:screen/channel/:channel?ts='+Util.moment().valueOf(), isArray:false, headers: { 'X-Auth-Token' : Session.getToken(), 'x-csrf-token' : Session.getCsrf()  }},
				'updatePreferencesByUserId' : { method:'PUT', url : 'efrm/case/users/:userId/preference/:screen/channel/:channel?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },
				'createPreferencesByUserId' : { method:'POST', url : 'efrm/case/users/:userId/preference/:screen/channel/:channel?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },
				'downloadReports' : { method:'GET', url : '/rulewiki?ts='+Util.moment().valueOf(), isArray:false, headers: {responseType:'arraybuffer',"Content-Type": "application/octet-stream",'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() } },
				'customHotListAdd' : { method:'POST', url : 'efrm/hotlist/1.0/customHotlist?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },
				'getCustomHotList' : {method:'GET', url : '/efrm/hotlist/1.0/customHotlist/:hotListEntity/:channel/:organisationID/:actionType?ts='+Util.moment().valueOf(), isArray:false, headers: { 'X-Auth-Token' : Session.getToken(), 'x-csrf-token' : Session.getCsrf()  }},
				'customHotListApproveReject' : { method:'PUT', url : 'efrm/hotlist/1.0/customHotlist/approveReject?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },
				'customHotListEdit' : { method:'PUT', url : 'efrm/hotlist/1.0/customHotlist?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },

		})
    	}
	}
}])
    .factory('editPermission', ['$resource', 'Session', 'Util', function($resource, Session, Util) {
        return {
            header: function (header) {
                return $resource('config/bankdetails', {orgId :'@orgId'}, {
                    bankNamesOrgId  : { method:'GET', url : '/config/bankdetails/v1/organisations?orgId=:orgId&ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() } }

                })
            }
        }
    }])

 .factory('casesManagement2', ['$resource', 'Session', 'Util','commonDataService', function($resource, Session, Util, commonDataService) {
	return {
    	header: function (header) {
        	return $resource('config/bankdetails', {authority: '@authority', status: '@status', fromDate: '@fromDate', toDate: '@toDate', caseId: '@caseId', searchId: '@searchId', organisationID: '@organisationID', uId : '@uId', offset : '@offset', selectedchannel : '@selectedchannel', prespective : '@prespective', archive:'@archive',pageNumber:'@pageNumber'}, {
        		'channel' : { method:'GET', url : 'config/bankdetails/v1/channels?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() } },
	            //'searchTransactions' : { method:'POST', url : 'efrm/case/frm-transactioninquiry/1.0/transactionEnquiry?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },
	            'searchTransactions' : { method:'POST', url : '/transaction/search/:selectedchannel/v1?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId,'userId':commonDataService.getSessionStorage().userId,'isPlainText':commonDataService.getLocalStorage().p2Visibility == 1 ? true : false } },
	            //'searchTransactionResultCount' : { method:'GET', url : 'efrm/case/frm-transactioninquiry/1.0/transactionEnquiryResultCount/:searchId?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },
	            'searchTransactionResultCount' : { method:'GET', url : '/transaction/search/:channel/v1/status/:searchId?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId,'userId':commonDataService.getSessionStorage().userId } },
	            'searchResult' : { method:'GET', url : '/transaction/search/:channel/v1/:searchId?page=:pageNumber&size=50&sort=txndatetime&order=desc&ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId,'userId':commonDataService.getSessionStorage().userId,'isPlainText':commonDataService.getLocalStorage().p2Visibility == 1 ? true : false } },
	            'searchCaseIdResult' : { method:'POST', url : '/transaction/case/txn/:searchId/v1?perspective=:prespective&ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId,'userId':commonDataService.getSessionStorage().userId } },
	            'searchTransactionById' : { method:'GET', url : 'efrm/case/frm-transactioninquiry/1.0/transactionEnquiryBySearchId/:searchId?limit=50&offset=:offset&ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },
	            'createCase' : { method:'POST', url : 'efrm/case/frm-transactioninquiry/v1/case?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },
	            'searchList' : { method:'GET', url : 'efrm/case/frm-transactioninquiry/v1/fetchSearchIdByUserId/:uId?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() } },
	            'newSearchTransaction' : { method:'POST', url : 'efrm/case/frm-transactioninquiry/1.0/transaction/search?searchId=:searchId&userId=:uId&ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },
	            'topsearchResult' : { method:'GET', url : 'efrm/case/frm-transactioninquiry/1.0/transaction/search?userId=:uId&ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },
        	})
    	}
	}
}])
.factory('alertService', ['$resource', 'Session', 'Util','commonDataService', function($resource, Session, Util, commonDataService) {
	return {
    	header: function (header) {
        	return $resource('efrm/case/frm/1', {channel: '@channel', orgId:'@orgId'}, {
	            'createAlert' : { method:'POST', url : 'efrm/case/frm/1.0/alert?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },		
	            'updateAlert' : { method:'POST', url : 'efrm/case/frm/1.0/caseAlert?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },
				'addFraudNote' : { method:'POST', url : '/efrm/case/frm/1.0/fraudNote?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },
				'amlList' : { method:'GET', url : '/efrm/case/frm/1.0/amlTypesByStatusAndChannel/ACTIVE/:channel/?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },
				'submitAml' : { method:'PUT', url : 'efrm/case/frm/1.0/amlCategory?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },	
				'fraudList' : { method:'GET', url : '/efrm/case/frm/1.0/fraudTypesByStatusAndChannel/ACTIVE/:channel/?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },
				'submitFraud' : { method:'PUT', url : 'efrm/case/frm/1.0/fraudCategories?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },
        	})
    	}
	}
}])
 .factory('efrmReports', ['$resource', 'Session', 'Util', function($resource, Session, Util) {
	return {
    	header: function (header) {
        	return $resource('report', { orgId:'@orgId',reportRequestId:'@reportRequestId'}, {
        		'viewReports' : { method:'GET', url : 'report/reportdetail?orgId=:orgId&ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() } },
        		'createReports' : { method:'POST', url : 'report/reports?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() } },
	            'myReports' : { method:'POST', url : 'report/allreports?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() } },
	            'stopReports' : { method:'PUT', url : 'stopScheduledReport/:reportRequestId?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() } },
	            'getallbank' : { method:'GET', url : 'config/bankdetails/all?ts='+Util.moment().valueOf(), isArray:false, headers: {responseType:'arraybuffer',"Content-Type": "application/octet-stream",'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() } },
	            'myactivityreport' : { method:'POST', url : '/report/activityReport?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() } }
	            
        	})
    	}
	}
}])

    .factory('ruleManagement', ['$resource', 'Session', 'Util','commonDataService','RuleService', function($resource, Session, Util, commonDataService,RuleService) {
        return {
            header: function (header) {
                return $resource('efrm/case/frm/1', {orgId:'@orgId',channel:'@channel',status:'@status',startdate:'@startdate',enddate:'@enddate',count:'@count',ruleId:'@ruleId',simRuleId:'@simRuleId',simRuleOrgId:'@simRuleOrgId',currentRulePriority:'@currentRulePriority'}, {
                    'viewRule' : { method:'GET', url : 'efrm/case/frm/1.0/allRulesByOrgIdChannelAndStatus/:orgId/:channel/:status?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() } },
                    'createRule' : { method:'POST', url : 'efrm/case/frm/1.0/ruleDetail?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },
                    'updateRule' : { method:'PUT', url : 'efrm/case/frm/1.0/ruleDetail?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },
                    'Rule' : { method:'POST', url : 'efrm/case/frm/1.0/refreshRule?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },
                    'refreshRule' : { method:'POST', url :  'efrm/case/frm/1.0/refreshRules?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },
                    'refreshHotlist' : { method:'POST', url :  '/efrm/hotlist/frm/1.0/refreshHotlists?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },
                    'refreshConfigParamas' : { method:'POST', url : '/efrm/case/frm/1.0/refreshConfigParams?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },
                    'refreshAccountProviders' : { method:'POST', url : '/efrm/case/frm/1.0/refreshAccountProviders?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },
					'refreshAbnormalHours':{ method:'POST', url : '/efrm/case/frm/1.0/refreshAbnormalHours?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },
					'validateRule' : { method:'POST', url : 'efrm/case/frm/1.0/evaluateRule?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },
					'lastSimulate' : { method:'GET', url : 'rulegen/v1/lastSimulateResult?ruleName=:ruleId&orgId=:orgId&ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId,'userId':commonDataService.getSessionStorage().userId } },
					'simulateRule' : { method:'POST', url : 'simulate/v1/executeRuleByTimeframe?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },
					'toCreateSimulateRule' : { method:'POST', url : 'rulegen/v1/simulateRule?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },
					'simulateRuleGetStatus' : { method:'GET', url : '/rulegen/v1/simulateRuleStatus?ruleName=:simRuleId&orgId=:simRuleOrgId&ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },
					'simulateRuleGetResult' : { method:'GET', url : 'rulegen/v1/simulateResultsByUserId?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId,'userId':commonDataService.getSessionStorage().userId  } },
					'rulePriority' : { method:'GET', url : '/rulegen/v1/getAllRulesWithSameNHigherPriority?orgId=:orgId&currentRulePriority=:currentRulePriority&channel=:channel&ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() } }
				})
            }
        }
    }])
   
    .factory('ruleEditorManagement', ['$resource', 'Session', 'Util','commonDataService', function($resource, Session, Util, commonDataService) {
        return {
            header: function (header) {
                return $resource('rulegen/v1', {orgId:'@orgId',userId:'@userId',channel:'@channel',status:'@status',id:'@id'}, {
               //     'viewRule'            : { method:'GET', url : 'efrm/case/frm/1.0/allRulesByOrgIdChannelAndStatus/:orgId/:channel/:status?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() } },
                	'getRule'               : { method:'GET', url : 'rulegen/v1?ruleId=:ruleId&orgId=:orgId&id=:id&ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },  
                	'createRule'            : { method:'POST', url : 'rulegen/v1?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },
                	'editRule'              : { method:'PUT', url : 'rulegen/v1?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },
                    'getNotGenRules'        : { method:'GET', url : 'rulegen/v1/getUnCompiledRulesList?userId=:userId&ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },
                    'getHotList'            : { method:'GET', url : 'rulegen/v1/getSpecialList?channel=:channel&orgId=:orgId&listType=:listType&hotListTypeCode=:hotListTypeCode&ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },
                    'parseRule'             : { method:'POST', url : '/rulegen/v1/parseRule?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },
                    'checkUniqueRuleName'   : { method:'GET', url : 'rulegen/v1/getIsRuleIdExist?ruleId=:ruleId&orgId=:orgId&ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },
                    'compareRule'   		: { method:'GET', url : 'rulegen/v1/getRuleExpresionsByRuleId?ruleId=:ruleId&orgId=:orgId&ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },
                    'exportRules'           : { method:'POST', url : 'rulegen/v1/exportRules?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },
                    'importedSaveRules'     : { method:'POST', url : 'rulegen/v1/importRules?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },
                    'refreshRules'          : { method:'POST', url : '/efrm/case/frm/1.0/refreshRulesByOrgAndChannel?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },
                    'getValidateData'       : { method:'GET', url : '/efrm/case/frm/1.0/ruleExprTxnFields?ruleId=:ruleId&ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },
                })
            }
        }
    }])
	.factory('binManagement', ['$resource', 'Session', 'Util','commonDataService', function($resource, Session, Util, commonDataService) {
		return {
			header: function (header) {
				return $resource('rulegen/v1', {orgId:'@orgId',userId:'@userId',channel:'@channel',status:'@status'}, {
					//     'viewRule'            : { method:'GET', url : 'efrm/case/frm/1.0/allRulesByOrgIdChannelAndStatus/:orgId/:channel/:status?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() } },
					'editBins'               : { method:'GET', url : 'managebin/v1?binId=:ruleId&channel:=channel&orgId=:orgId&ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },
					'getBins'               : { method:'GET', url : 'managebin/v1/allBinsByOrgIdAndStatus?orgId=:orgId&status=:status&ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },
					'manageBinCreate'            : { method:'POST', url : 'managebin/v1?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },
					'manageBinUpdate'            : { method:'PUT', url : 'managebin/v1?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },
					})
			}
		}
	}])
    .factory('ruleSetManagement', ['$resource', 'Session', 'Util','commonDataService', function($resource, Session, Util, commonDataService) {
        return {
            header: function (header) {
                return $resource('rulegen/v1', {orgId:'@orgId',userId:'@userId',channel:'@channel',ruleSetName:'@ruleSetName',isEditorOnly:'@isEditorOnly'}, {
                    'getRuleSet'            : { method:'GET', url : 'ruleset/v1?orgId=:orgId&ruleSetName=:ruleSetName&ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() } },
                    'getRuleSetDtl'         : { method:'GET', url : 'ruleset/v1/viewRuleSet?orgId=:orgId&ruleSetName=:ruleSetName&ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() } },
                	'getAvailableRules'     : { method:'GET', url : 'ruleset/v1/allAvailableRulesByOrg?orgId=:orgId&isEditorOnly=:isEditorOnly&ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },
                	'getRuleSets'           : { method:'GET', url : 'ruleset/v1/allRuleSetsByOrg?orgId=:orgId&ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },
                	'UpdateRuleSetsStatus'  : { method:'PUT', url : 'ruleset/v1/updateRuleSetStatus?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },
                	'getRulesFromSet'       : { method:'GET', url : 'ruleset/v1/allRulesByRuleSet?ruleSetName=:ruleSetName&orgId=:orgId&ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },
                	'createRuleSet'         : { method:'POST', url : 'ruleset/v1?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },
                	
                	'editRuleSet'           : { method:'PUT', url : 'ruleset/v1?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },
                	'checkUniqueRuleSetName': { method:'GET', url : 'ruleset/v1/isRuleSetNameExist?ruleSetName=:ruleSetName&orgId=:orgId&ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },
                })
            }
        }
    }])
    .factory('abnormalHour', ['$resource', 'Session', 'Util','commonDataService', function($resource, Session, Util, commonDataService) {
        return {
            header: function (header) {
                return $resource('efrm/case/frm/1', {status:'@status'}, {
                    'viewAbnormalHour' : { method:'GET', url : 'efrm/case/frm/1.0/abnormalHourByStatus/:status?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(),'orgId':commonDataService.getLocalStorage().orgId } },
                    'createAbnormalHour' : { method:'POST', url : 'efrm/case/frm/1.0/abnormalHour?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(),'orgId':commonDataService.getLocalStorage().orgId } },
                    'updateAbnormalHour' : { method:'PUT', url : 'efrm/case/frm/1.0/abnormalHour?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(),'orgId':commonDataService.getLocalStorage().orgId } },
					'checkUniqueBinId'   : { method:'GET', url : 'rulegen/v1/getIsRuleIdExist?ruleId=:ruleId&orgId=:orgId&ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId } },

				})
            }
        }
    }])
 .factory('chargeBack', ['$resource', 'Session', 'Util','commonDataService', function($resource, Session, Util, commonDataService) {
        return {
            header: function (header) {
                return $resource('efrm/case/frm/1.0', {status:'@status',channel:'@channel',cardnumber:'@cardnumber'}, {
                	 'fetchChargeBackInformation' : { method:'GET', url : '/efrm/case/frm/1.0/disputeInformationByStatusAndChannel/:status/:channel/true?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(),'orgId':commonDataService.getLocalStorage().orgId } },
                	 'createmanualChargeback' : { method:'POST', url : '/efrm/case/frm/1.0/disputeInformation?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(),'orgId':commonDataService.getLocalStorage().orgId } },
                	 'checkCardNumber' : { method:'GET', url : '/efrm/case/frm/1.0/isChargebackExist/:cardnumber?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(),'orgId':commonDataService.getLocalStorage().orgId } },
                })
            }
        }
    }])
.factory('neovisJs', ['$resource', 'Session', 'Util', function($resource, Session, Util) {
        return {
            header: function (header) {
                return $resource('efrm/cppservice/aml', {accountId:'@accountId'}, {
                    'nodes_list' : { method:'GET', url : 'cppservice/aml/account/:startDate/:endDate/:flag?txnCount=:txnCount&ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() } },
                    'getAllTransaction' : { method:'GET', url : 'cppservice/aml/transaction/:startDate/:endDate/false?accountId=:accountId&txnCount=:txnCount&ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() } },
                    'graphaml' : { method:'GET', url : 'cppservice/cpp/graph/aml?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() } },
                    'getCppTransaction' : { method:'GET', url : 'efrm/cpp/card/:startDate/:endDate/false?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() } },
                    'getCppTerminal' : { method:'GET', url : 'efrm/cpp/card/:startDate/:endDate/:terminal/:flag?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() } }
                  })
            }
        }
    }])    
    .factory('operationalDashboard', ['$resource', 'Session', 'Util', function($resource, Session, Util) {
        return {
            header: function (header) {
                return $resource('stats/consolidator', {}, {
                    'memoryUsage' : { method:'GET', url : '/stats/consolidator/fetchStatisticalDetails?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() } },
                    'memoryUsagewithid' : { method:'GET', url : '/stats/consolidator/fetchStatisticalDetails/:randomId?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() } },
                    'ruleEfficiency' : { method:'GET', url : 'efrm/stats/ruleefficiency/:channel/:channelName/consolidation?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() } },
                    'caseDetailsCount' : { method:'GET', url : '/efrm/stats/case/details/consolidation?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() } },
                    'declinedTxnCount' : { method:'GET', url : '/efrm/stats/transaction/declined/consolidation?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() } },
                    'hr24Aggregate' : { method:'GET', url : '/efrm/stats/txn/details/consolidation?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() } },
                    'caseCount' : { method:'GET', url : '/efrm/stats/case/count/:org_id/:channelName/consolidation?ts='+Util.moment().valueOf(), isArray:false, headers: {'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf() } }

                  })
            }
        }
    }])
