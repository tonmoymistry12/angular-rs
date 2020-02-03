/**
 * 
 */

'use strict';
angular.module('efrm')
/*.service('path', function() {
	var resource = 'http://127.0.0.1:8008';
	  return {
	    USERS_DOMAIN: resource,
	    USERS_API: resource + '/users',
	    BASIC_INFO: resource + '/api/info',
	    IMAGE_PATH : './img'
	  }
})*/
.controller('homeController', ['$scope', 'Util', function($scope, Util){
	$scope.imagePath = Util.imagePath;
}]);