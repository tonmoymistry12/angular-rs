'use strict';
angular.module('efrm.dashboard')
.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
	 $stateProvider
		.state('dashboard.create', {  //user Management > create user
           			 	url: '/create',
           			 	id : 1723019059,
           			    reload: true,
           			 	title : 'Create Users',
        				templateUrl: 'templates/private/create.html',
        				params : {
        					  editable: "N",
        					  value: null
        				},
           	 			controller: 'createController'        	
        })
        .state('dashboard.update', {  //user management > create User
           			 	url: '/create',
           			 	id : 1723019059,
           			    reload: true,
           			 	title : 'Update Users',
        				templateUrl: 'templates/private/create.html',
        				params : {
        					  editable: "N",
        					  value: null
        				},
           	 			controller: 'createController'        	
        })
        .state('dashboard.search', {   //user management > search user
			        	url: '/adminSearch',
			        	id : 1723019060,
			        	title : 'View Users',
			        	templateUrl: 'templates/private/search.html',
			        	controller: 'searchController'
        })
        .state('dashboard.validateUser', {   //user management > search user
			        	url: '/adminSearch',
			        	id : 1723019060,
			        	title : 'View Users',
			        	templateUrl: 'templates/private/validateUser.html',
			        	controller: 'validateUserController'
        })
        .state('dashboard.unapprovedList', {  //user management > manage user
			        	url: '/unapprovedList',
			        	id : 1723019059,
			        	title : 'Approve / Pending',
			        	templateUrl: 'templates/private/unapprovedList.html',
			        	controller: 'unapprovedListController'
        })
        .state('dashboard.unapprovedRoleList', { //role management > manage role
			        	url: '/unapprovedRoles',
			        	id : 1723019058,
			        	title : 'Approve / Pending',
			        	templateUrl: 'templates/private/unapprovedRoleList.html',
			        	controller: 'unapprovedRoleController'
        }) .state('dashboard.resetroleapprove', {
			 url: '/resetroleapprove',
			 reload: true,
			 title : 'Reset Role Approval',
			 templateUrl: 'templates/private/resetroleapprove.html',
			 controller: 'resetroleapproveController'
		 })
        .state('dashboard.createqueue', { //Queue Management > Create Queue
           			 	url: '/createqueue',
           			 	id : 1723019063,
           			    reload: true,
           			 	title : 'Create Queue',
        				templateUrl: 'templates/private/createQueue.html',
        				params : {
        					  
        					  editable: "N",
        					  viewable:"N",
        					  value: null
        				},
           	 			controller: 'createQueueController'        	
        })
        .state('dashboard.updatequeue', { //Queue Management > Create Queue
           			 	url: '/createqueue',
           			 	id : 1723019063,
           			    reload: true,
           			 	title : 'Update Queue',
        				templateUrl: 'templates/private/createQueue.html',
        				params : {
        					 
        					  editable: "N",
        					  viewable:"N",
        					  value: null
        				},
           	 			controller: 'createQueueController'        	
        })
        .state('dashboard.searchqueue', { //Queue Management > search queue
           			 	url: '/searchqueue',
           			 	id : 1723019063,
           			 	title : 'View Queue',
        				templateUrl: 'templates/private/searchQueue.html',
           	 			controller: 'searchQueueController'        	
        })
        .state('dashboard.assignqueue', {  //Queue Management > assign queue
           			 	url: '/assignqueue',
           			 	id : 1723019063,
           			 	title : 'Manage Queue',
        				templateUrl: 'templates/private/assignQueue.html',
           	 			controller: 'assignQueueController'        	
        })
		 .state('dashboard.unassignedQueue', {  //Queue Management > unassigned queue
			 url: '/unassignedQueue',
			 id : 1723019063,
			 title : 'Unassigned Queue',
			 templateUrl: 'templates/private/unassignedQueue.html',
			 controller: 'unassignedQueueController'
		 })
        .state('dashboard.approvependingqueue', {  //Queue Management > assign queue
           			 	url: '/approvependingqueue',
           			 	id : 1723019063,
           			 	title : 'Approve / Pending Queue',
        				templateUrl: 'templates/private/approvePendingQueue.html',
           	 			controller: 'approvePendingQueueController'        	
        })
        .state('dashboard.approvependingassignment', {  //Queue Management > assign queue
           			 	url: '/approvependingassignment',
           			 	id : 1723019063,
           			 	title : 'Approve Assignment',
        				templateUrl: 'templates/private/approvependingassignment.html',
           	 			controller: 'approvependingassignmentController'        	
        })
        /*.state('dashboard.adminUserManagement', {
			            url: '/adminUserManagement',
			            templateUrl: 'templates/private/adminUserManagement.html',
			            controller: 'adminUserManagementController'        	
        })*/
         .state('dashboard.editPermission', {
			            url: '/adminEditPermission', //Role Management > Edit Permission
			            title : 'Edit Permission',
			            id : 1723019058,
			            templateUrl: 'templates/private/adminEditPermission.html',
			            params : {
      					  editable: "Y",
      					  value: null
			            },
			            controller: 'editPermissionController'        	
        })
        .state('dashboard.createPermission', {  //user management > create User
        				url: '/adminCreatePermission', //Role Management > Edit Permission
        				title : 'Create Permission',
        				id : 1723019058,
        				templateUrl: 'templates/private/adminEditPermission.html',
        				params : {
        					  editable: "N",
        					  value: null
        				},
           	 			controller: 'editPermissionController'        	
        })
       
        .state('dashboard.forbidden', {
			            url: '/forbidden',
			            title : 'Forbidden',
			            templateUrl: 'templates/private/forbidden.html'
        })
        .state('dashboard.config', { //*????????????????????????
			            url: '/config',
			            id : 3317860870,
			            title : 'Configuration',
			            templateUrl: 'templates/private/configuration.html',
			            controller: 'configurationController'
        })
        .state('dashboard.frauds', { //dashboard
           			 	url: '/frauds',
           			 	id : 1723019071,
           			    reload: true,
           			 	title : 'Fradus Data',
        				templateUrl: 'templates/private/charts.html',
           	 			controller: 'chartController'        	
        })
        .state('dashboard.mycases', {
			 	url: '/mycases',
   			 	id : 1723019069,
   			    reload: true,
   			 	title : 'My Current Cases',
				templateUrl: 'templates/private/mycases.html',
   	 			controller: 'myCasesController'
        })
          .state('dashboard.reviewcases', {
           			 	url: '/reviewcases',
           			 	id : 1723019067,
           			    reload: true,
           			 	title : 'View Cases',
        				templateUrl: 'templates/private/reviewcases.html',
           	 			controller: 'reviewCases'        	
        })
         .state('dashboard.searchCases', {
             url: '/searchCases',
             id : 1723019067,
             reload: true,
             title : 'Search Case',
             templateUrl: 'templates/private/searchCases.html',
             controller: 'searchCases'
         })
          .state('dashboard.unassignedcases', {
           			 	url: '/unassignedcases',
           			 	id : 1723019067,
           			    reload: true,
           			 	title : 'Assign Manual Cases',
        				templateUrl: 'templates/private/unassignedcases.html',
           	 			controller: 'unassignedCases'        	
        })
         .state('dashboard.viewCase', {
                    url: '/viewCase',
                    reload: true,
                   // id : 1723019067,
                    title : 'View Cases',
                    templateUrl: 'templates/private/viewCase.html',
                    params : {
      				  value: null
                    },
                    controller: 'viewCaseController'

         })
		 .state('dashboard.myAlerts', {
			 url: '/myAlerts',
			 reload: true,
			 title : 'My Cases',
			 templateUrl: 'templates/private/myAlerts.html',
			 id : 1723019066,
			 params : {
				 value: null
			 },
			 controller: 'myAlertsController'

		 })
		 .state('dashboard.viewAlert', {
			 url: '/viewAlert',
			 reload: true,
			// id : 1723019066,
			 title : 'View Alert',
			 templateUrl: 'templates/private/viewAlert.html',
			 params : {
				 value: null
			 },
			 controller: 'viewAlertController'

		 })
		 .state('dashboard.unassignedAlerts', {
			 url: '/unassignedAlerts',
			 reload: true,
			 id : 1723019065,
			 title : 'Assign Alerts',
			 templateUrl: 'templates/private/unassignedAlerts.html',
			 params : {
				 value: null
			 },
			 controller: 'unassignedAlertsController'

		 })
		 .state('dashboard.alertsInQueue', {
			 url: '/alertsInQueue',
			 reload: true,
			 id : 1723019064,
			 title : 'My Cases',
			 templateUrl: 'templates/private/alertsInQueue.html',
			 params : {
				 value: null
			 },
			 controller: 'alertsInQueueController'

		 })
        
         .state('dashboard.caseTransactions', {
             url: '/viewTransactions',
             reload: true,
             id : 1723019070,
             title : 'Create Manual Case',
             templateUrl: 'templates/private/viewTransactions.html',
             controller: 'viewTransactionsController'
         })
         .state('dashboard.myReports', {
             url: '/myReports',
             reload: true,
             id: 1723019072,
             title : 'My Reports',
             templateUrl: 'templates/private/my_reports.html',
             controller: 'efrmMyReportsController'
         })
         .state('dashboard.createReports', {
             url: '/createReports',
             reload: true,
             id : 1723019072,
             title : 'Create Reports',
             templateUrl: 'templates/private/create_reports.html',
             controller: 'efrmCerateReportsController'
         })
         .state('dashboard.viewRule', {
             url: '/viewRule',
             reload: true,
             id : 1723019061,
             title : 'Manage Rule',
             templateUrl: 'templates/private/viewRule.html',
             controller: 'viewRuleController'
         })
         	.state('dashboard.importExportRules', {
	             url: '/importExportRules',
	             reload: true,
	             id : 1723019061,
	             title : 'Manage Rule',
	             templateUrl: 'templates/private/ruleImportExport.html',
	             controller: 'ruleImportExportController'
	         })
         .state('dashboard.unapprovedRules', {
             url: '/unapprovedRules',
             reload: true,
             id : 1723019061,
             title : 'Manage Rule',
             templateUrl: 'templates/private/unapprovedRules.html',
             controller: 'unapprovedRulesController'
         })
         .state('dashboard.ruleByScript', {
             url: '/ruleByScript',
             reload: true,
             id: 1723019061,
             title : 'Create Rule',
             templateUrl: 'templates/private/createRuleScript.html',
             controller: 'ruleByEditorController'
           //  controller: 'createRuleController'
         })
		 .state('dashboard.ruleByEditor', {
			 url: '/ruleByEditor',
			 reload: true,
			 id: 1723019061,
			 title : 'Create Rule',
			 templateUrl: 'templates/private/ruleByEditor.html',
			 controller: 'ruleByEditorController'
		 })
		 .state('dashboard.ruleDetail', {
			 url: '/ruleDetail',
			 reload: true,
			 id: 1723019061,
			 title : 'Create Rule',
			 templateUrl: 'templates/private/ruleEditor/ruleDetail.html',
			 controller: 'ruleByEditorController'
		 })
		 .state('dashboard.simulateRules', {
			 url: '/simulateRules',
			 reload: true,
			 id: 1723019061,
			 title : 'Create Rule',
			 templateUrl: 'templates/private/viewSimulation.html',
             controller: 'viewSimulationController'
		 })
		 .state('dashboard.createRule', {
			 url: '/createRule',
			 reload: true,
			 id: 1723019061,
			 title : 'Create Rule',
			 templateUrl: 'templates/private/createRule.html',
             controller: 'createRuleController'
		 })
		 .state('dashboard.notGeneratedRules', {
			 url: '/notGeneratedRules',
			 reload: true,
			 id: 1723019061,
			 title : 'Create Rule',
			 templateUrl: 'templates/private/notGeneratedRules.html',
			 controller: 'notGeneratedRulesController'
		 })
		 .state('dashboard.createRuleSets', {
			 url: '/createRuleSets',
			 reload: true,
			 id: 1723019061,
			 title : 'Create Rule',
			 templateUrl: 'templates/private/createRuleSet.html',
			 controller: 'createRuleSetsController'
		 })
		 .state('dashboard.viewRuleSet', {
             url: '/viewRuleSet',
             reload: true,
             id : 1723019061,
             title : 'Manage Rule',
             templateUrl: 'templates/private/viewRuleSet.html',
             controller: 'viewRuleSetController'
         })
         .state('dashboard.viewRuleSets', {
             url: '/viewRuleSets',
             reload: true,
             id : 1723019061,
             title : 'Manage Rule',
             templateUrl: 'templates/private/viewRuleSets.html',
             controller: 'viewRuleSetsController'
         })
         .state('dashboard.hotlist', {
             url: '/hotlist',
             reload: true,
             title : 'Manage List',
             id: 1723019074,
             templateUrl: 'templates/private/hotlist.html',
             controller: 'hotlistController'
         })
         .state('dashboard.hotlistinsert', {
             url: '/hotlistinsert',
             reload: true,
             id : 1723019074,
             title : 'Insert To Hotlist',
             templateUrl: 'templates/private/inserthotlist.html',
             params : {
				  editable: "N",
				  value: null
			},
             controller: 'insertHotlistController'
         })
         .state('dashboard.accountSettings', {
             url: '/changepassword',
             reload: true,
             title : 'Manage List',
             templateUrl: 'templates/private/accountSettings.html',
             controller: 'accountSettingsController'
         })
         .state('dashboard.updateSecurityQuestion',{
            url: '/updateSecurityQuestion',
            reload: true,
            title : 'Update Security Question',
            templateUrl: 'templates/private/securityQuestion.html',
            controller: 'updateSecurityQuestionController'
         })
		 .state('dashboard.changePreferences', {
			 url: '/changePreferences',
			 reload: true,
			 title : 'Change Preferences',
			 templateUrl: 'templates/private/changePreferences.html',
			 controller: 'changePreferencesController'
		 })
		 .state('dashboard.configAbnormal', {
			 url: '/configAbnormal',
			 reload: true,
			 id : 1723019074,
			 title : 'Config Abnormal Hours',
			 templateUrl: 'templates/private/configAbnormal.html',
			 controller: 'configAbnormalController'
		 })
		 .state('dashboard.approvependingAbnormal', {
			 url: '/approvependingAbnormal',
			 reload: true,
			 id : 1723019074,
			 title : 'Approve Pending Abnormal Hours',
			 templateUrl: 'templates/private/viewAbnormal.html',
			 params : {
				  viewable:"N",
				  value: null
			},
			 controller: 'viewAbnormalController'
		 })
		 .state('dashboard.viewAbnormal', {
			 url: '/viewAbnormal',
			 reload: true,
			 id : 1723019074,
			 title : 'View Abnormal Hours',
			 templateUrl: 'templates/private/viewAbnormal.html',
			 params : {
				  viewable:"Y",
				  value: null
			},
			 controller: 'viewAbnormalController'
		 })
		 .state('dashboard.createBin', {
			 url: '/createBin',
			 reload: true,
			 id : 1723019074,
			 title : 'Create Bin',
			 templateUrl: 'templates/private/createBin.html',
			 controller: 'createBinController'
		 })
		 .state('dashboard.viewBin', {
			 url: '/viewBin',
			 reload: true,
			 id : 1723019074,
			 title : 'View Bin',
			 templateUrl: 'templates/private/viewBin.html',
			 controller: 'viewBinController'
		 })
		 .state('dashboard.acquirerBin', {
			 url: '/acquirerBin',
			 reload: true,
			 id: 1723019061,
			 title : 'Acquirer Bin',
			 templateUrl: 'templates/private/acquirerBin.html',
			 controller: 'createBinController'
		 })
		 .state('dashboard.issuerBin', {
			 url: '/issuerBin',
			 reload: true,
			 id: 1723019061,
			 title : 'Issuer Bin',
			 templateUrl: 'templates/private/issuerBin.html',
			 controller: 'createBinController'
		 })
		 .state('dashboard.operationalDashboard', {
			 url: '/operationalDashboard',
			 reload: true,
			 id : 1723019071,
			 title : 'System Performance',
			 templateUrl: 'templates/private/operationalDashboard.html',
			 controller: 'operationalDashboard'
		 })
		 .state('dashboard.fileUpload', {
			 url: '/fileUpload',
			 reload: true,
			 title : 'Upload Data',
			 templateUrl: 'templates/private/fileUpload.html',
			 controller: 'uploadController'
		 })
		 .state('dashboard.getmyreports', {
			 url: '/myreportdetails',
			 reload: true,
			 title : 'My Report',
			 templateUrl: 'templates/private/myReportsDetails.html',
			 controller: 'myReportsDetailsController'
		 })
		 .state('dashboard.getmyactivityreports', {
			 url: '/myactivityreport',
			 reload: true,
			 title : 'My Activity Report',
			 templateUrl: 'templates/private/myActivityReports.html',
			 controller: 'myActivityReportsController'
		 })
		  .state('dashboard.createchargeback', {
			 url: '/createchargeback',
			 reload: true,
			 title : 'Create Charge Back',
			 templateUrl: 'templates/private/createchargeback.html',
			 controller: 'createchargebackController'
		 })
		 .state('dashboard.viewchargeback', {
			 url: '/viewcharegeback',
			 reload: true,
			 title : 'View Charge Back',
			 templateUrl: 'templates/private/viewcharegeback.html',
			 controller: 'viewcharegebackController'
		 })
		 .state('dashboard.createNamedList', {
			 url: '/createnamedhotlist',
			 reload: true,
			 title : 'Create Named Hot List',
			 templateUrl: 'templates/private/createnamedhotlist.html',
			 controller: 'createnamedhotlistController'
		 })
		 .state('dashboard.checkchargeback', {
			 url: '/checkcharegeback',
			 reload: true,
			 title : 'View Charge Back'
		 })
         
}]);
