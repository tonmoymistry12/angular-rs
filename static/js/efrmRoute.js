/**
 * 
 */

'use strict';
angular.module('efrm')
.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/signin');
    $stateProvider
	    .state('signIn', {
							url : '/signin',
							title : 'Sign In',
							templateUrl : 'templates/public/signIn.html',
							controller : 'signInController'
					    })
		.state('signOut', {
							url : '/signin',
							title : 'Sign In',
							templateUrl : 'templates/public/signIn.html',
							controller : 'signInController'
					    })
	    .state('status', {
				            url: '/status',
				            title : 'Status',
				            templateUrl: 'templates/status.html',
				            controller: 'statusController'
				        })
		.state('resetTempPass', {
            			url: '/resetTempPass',
            			title : 'Reset Temporary Password',
            			templateUrl: 'templates/public/resetTempPass.html',
            			controller: 'resetTempPassController'        	
        			})
        .state('forgotPassword', {
            			url: '/forgotPassword',
            			title : 'Forgot Password',
            			templateUrl: 'templates/public/forgotPassword.html',
            			controller: 'forgotPasswordController'        	
        			})
		 .state('updatePassBySecurityQues', {
						url: '/updatePassBySecurityQues',
						title : 'Forgot Password',
						templateUrl: 'templates/public/updatePassBySecurityQues.html',
						controller: 'updatePassBySecurityQuesController'        	
        			})
		.state('dashboard', {
							url : '/dashboard',
							templateUrl : 'templates/private/dashboard.html',
							controller: 'dashboardController'
					    })
		.state('broken', {
							url : '/broken',
							templateUrl : 'templates/broken.html',
							title : 'I am broken'
					    })
		
       
        $locationProvider.html5Mode(true);
});