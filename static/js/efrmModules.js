/**
 * 
 */

'use strict';

angular.module('efrm.service',[
	'ngResource',
	
]);

angular.module('efrm.dashboard',[
	
]);

angular.module('efrm.directive',[
	'efrm.service'
]);

angular.module('efrm.config',[
	'ngAnimate',
	'toastr',
	'ngSanitize',
	'ui.router',
	'angular-loading-bar', 
	'angularUtils.directives.dirPagination',
	'chieffancypants.loadingBar',
	'cfp.loadingBar',
	'cp.ngConfirm',
	'moment-picker',
	'chart.js',
	'angular.filter',
	'pdf',
	'ngTagsInput',
	'ADM-dateTimePicker',
	'ui.multiselect.ruleset',
	'ngPatternRestrict',
	'dx'
	
]);

angular.module('efrm',[
	'ui.bootstrap',
	'ui.bootstrap2',
	'ui.toggle',
	'efrm.config',
	'ui.select',
	'ui.sortable',
	'dndLists',
	'efrm.service',
	'efrm.directive',
	'efrm.dashboard',
	'common',
	'rule'
]);