/**
 * 
 */

'use strict';
angular.module('efrm.directive')
.directive('efrmNav', function() {
	return {
		restrict: 'E',
		templateUrl: './templates/headerNav.html',
		controller: ['$scope', 'Util', 'Msg', 'ruleManagement','RolePermissionMatrix','toastr','$ngConfirm','commonDataService', function($scope, Util, Msg, ruleManagement,RolePermissionMatrix,toastr,$ngConfirm,commonDataService){
			$scope.imagePath = Util.imagePath;
			$scope.loggedIn = false;
			
			$scope.refresh = function(){
				$scope.rolePermission = RolePermissionMatrix;
				if(commonDataService.getLocalStorage().orgId != 'NPCI'){
					$scope.items = [
		        		{ name:"PLEASE SELECT THE REFRESH TYPE",val:""},
		        		{ name:"Refresh List",val:"List"}
                        //hidden as we have new APIs to refresh rules individually
		        		/*{ name:"Refresh Rule",val:"Rule"},*/
		            ];
				}
				if($scope.rolePermission.isPermissionGranted(1723019062) && $scope.rolePermission.isPermissionGranted(1723019076) && $scope.rolePermission.isPermissionGranted(1723019075)){
					$scope.items = [
		        		{ name:"PLEASE SELECT THE REFRESH TYPE",val:""},
                        //hidden as we have new APIs to refresh rules individually
		        		/*{ name:"Refresh Rule",val:"Rule"},*/
		            	{ name:"Refresh Config Params",val:"Config"},
		            	{ name:"Refresh Bank",val:"Bank"},
		            	{ name:"Refresh List",val:"List"},
                        { name:"Refresh Abnormal Hours",val:"Hours"}
		            ];
				}
				$scope.refreshMsg = false;
				
				$scope.refreshType = "";
				$ngConfirm({
                    title: 'Confirm',
                    theme: 'Material',
                    icon: 'fa fa-check',
                    content: '<div class="form-group"><select class="form-control" ng-change = "refreshMsg = false" ng-model="refreshType" ><option ng-repeat="item in items" value="{{item.val}}">{{item.name}}</option></select><div class="text-danger" ng-if="refreshMsg"><small>Please Choose One Of The Options</small></div></div>',
                    scope: $scope,
                    buttons: {
                        Yes: {
                            text: 'Submit',
                            btnClass: 'btn-red',
                            action: function (scope, button) {
                            	if($scope.refreshType == ""){
    								$scope.refreshMsg = true;
    								return false;
    							}else{
    								if($scope.refreshType == "Rule"){
    									$scope.refreshRule();
    								}else if($scope.refreshType == "Config"){
    									$scope.refreshconfigparams();
    								}else if($scope.refreshType == "Bank"){
    									$scope.refreshAccountProviders();
    								}else if($scope.refreshType == "List"){
    									$scope.refreshHotlist();
    								}else if($scope.refreshType == "Hours"){
                                        $scope.refreshAbnormalHours();
                                    }
    							}
                            }
                        },
                        Cancel: {
                            text: 'Cancel',
                            action: function (scope, button) {

                            }

                        }
                    },
                });
			}
			
            $scope.refreshRule=function() {
            	var userDto = {};
            	var userInformation = {};
            	userInformation.userId = commonDataService.getSessionStorage().userId
            	userInformation.orgId = commonDataService.getLocalStorage().orgId;
            	userDto.userInformationDTO = userInformation;
                $ngConfirm({
                    title: 'Confirm',
                    theme: 'Material',
                    icon: 'fa fa-check',
                    content: '<div class="form-group"><strong>Are you sure to refresh rules?</strong></div>',
                    scope: $scope,
                    buttons: {
                        Yes: {
                            text: 'Confirm',
                            btnClass: 'btn-red',
                            action: function (scope, button) {
                                ruleManagement.header({}).refreshRule({channel: null, orgId: null},userDto, function (data) {
                                    toastr.success("Rule Refreshed Successfully", Msg.hurrah);
                                }, function (err) {
                                    //toastr.error("Rule Refreshed Failed", Msg.oops);
                                	toastr.error("Your request is in progress, please contact efrm support team to get the updated status.", Msg.oops);
                                });
                            }
                        },
                        Cancel: {
                            text: 'Cancel',
                            action: function (scope, button) {

                            }

                        }
                    },
                });
            };
            
            $scope.refreshHotlist=function() {
            	var userDto = {};
            	var userInformation = {};
            	userInformation.userId = commonDataService.getSessionStorage().userId
            	userInformation.orgId = commonDataService.getLocalStorage().orgId;
            	userDto.userInformationDTO = userInformation;
            	
                $ngConfirm({
                    title: 'Confirm',
                    theme: 'Material',
                    icon: 'fa fa-check',
                    content: '<div class="form-group"><strong>Are you sure to refresh list?</strong></div>',
                    scope: $scope,
                    buttons: {
                        Yes: {
                            text: 'Confirm',
                            btnClass: 'btn-red',
                            action: function (scope, button) {
                                ruleManagement.header({}).refreshHotlist({channel: null, orgId: null},userDto, function (data) {
                                    toastr.success("List Refreshed Successfully", Msg.hurrah);
                                }, function (err) {
                                    toastr.error("Your request is in progress, please contact efrm support team to get the updated status.", Msg.oops);
                                });
                            }
                        },
                        Cancel: {
                            text: 'Cancel',
                            action: function (scope, button) {

                            }

                        }
                    },
                });
            };
            
            $scope.refreshconfigparams =function() {
            	var userDto = {};
            	var userInformation = {};
            	userInformation.userId = commonDataService.getSessionStorage().userId
            	userInformation.orgId = commonDataService.getLocalStorage().orgId;
            	userDto.userInformationDTO = userInformation;
                $ngConfirm({
                    title: 'Confirm',
                    theme: 'Material',
                    icon: 'fa fa-check',
                    content: '<div class="form-group"><strong>Are you sure to refresh config paramas ?</strong></div>',
                    scope: $scope,
                    buttons: {
                        Yes: {
                            text: 'Confirm',
                            btnClass: 'btn-red',
                            action: function (scope, button) {
                                ruleManagement.header({}).refreshConfigParamas({channel: null, orgId: null},userDto, function (data) {
                                    toastr.success("Config Paramas Refreshed Successfully", Msg.hurrah);
                                }, function (err) {
                                    toastr.error("Your request is in progress, please contact efrm support team to get the updated status.", Msg.oops);
                                });
                            }
                        },
                        Cancel: {
                            text: 'Cancel',
                            action: function (scope, button) {

                            }

                        }
                    },
                });
            };
            
            $scope.refreshAccountProviders =function() {
            	var userDto = {};
            	var userInformation = {};
            	userInformation.userId = commonDataService.getSessionStorage().userId
            	userInformation.orgId = commonDataService.getLocalStorage().orgId;
            	userDto.userInformationDTO = userInformation;
                $ngConfirm({
                    title: 'Confirm',
                    theme: 'Material',
                    icon: 'fa fa-check',
                    content: '<div class="form-group"><strong>Are you sure to refresh bank ?</strong></div>',
                    scope: $scope,
                    buttons: {
                        Yes: {
                            text: 'Confirm',
                            btnClass: 'btn-red',
                            action: function (scope, button) {
                                ruleManagement.header({}).refreshAccountProviders({channel: null, orgId: null},userDto, function (data) {
                                    toastr.success("Account Providers Refreshed Successfully", Msg.hurrah);
                                }, function (err) {
                                    toastr.error("Your request is in progress, please contact efrm support team to get the updated status.", Msg.oops);
                                });
                            }
                        },
                        Cancel: {
                            text: 'Cancel',
                            action: function (scope, button) {

                            }

                        }
                    },
                });
            }

            $scope.refreshAbnormalHours=function(){
                var userDto = {};
                var userInformation = {};
                userInformation.userId = commonDataService.getSessionStorage().userId
                userInformation.orgId = commonDataService.getLocalStorage().orgId;
                userDto.userInformationDTO = userInformation;
                $ngConfirm({
                    title: 'Confirm',
                    theme: 'Material',
                    icon: 'fa fa-check',
                    content: '<div class="form-group"><strong>Are you sure to refresh Abnormal Hours ?</strong></div>',
                    scope: $scope,
                    buttons: {
                        Yes: {
                            text: 'Confirm',
                            btnClass: 'btn-red',
                            action: function (scope, button) {
                                ruleManagement.header({}).refreshAbnormalHours({channel: null, orgId: null},userDto, function (data) {
                                    toastr.success("Abnormal Hours Refreshed Successfully", Msg.hurrah);
                                }, function (err) {
                                    toastr.error("Your request is in progress, please contact efrm support team to get the updated status.", Msg.oops);
                                });
                            }
                        },
                        Cancel: {
                            text: 'Cancel',
                            action: function (scope, button) {

                            }

                        }
                    },
                });
            }

			$scope.openNav = function(){        		
				$("#sideNav").css('margin-left', '0px')
				document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
			};
			
			$scope.closeNav = function(){        		
				$("#sideNav").css('margin-left', '-250px')
				document.body.style.backgroundColor = "white";
			};
		}]

	};
})



.directive('efrmFooter', function() {
	return {
		restrict: 'E',
		templateUrl: './templates/footer.html',
		controller: ['$scope', 'Util', function($scope, Util){
			$scope.imagePath = Util.imagePath;
		}]
	};
})
.directive('efrmHeader', function() {
	return {
		restrict: 'E',
		templateUrl: './templates/private/main_header.html',
		controller: ['$scope', 'Util', function($scope, Util){
			$scope.imagePath = Util.imagePath;
		}]
	};
})
.directive('onlyDigits', function () {
  return {
      restrict: 'A',
      require: '?ngModel',
      link: function (scope, element, attrs, signUp) {
    	  signUp.$parsers.push(function (inputValue) {
              if (inputValue == undefined) return '';
              if (isNaN(inputValue.charAt(0))) {
            	  signUp.$setViewValue('');
            	  signUp.$render();
              }
              var regexp = /^[0-9]\d{0,9}(\.\d{1,2})?%?$/;
              if(regexp.test(inputValue)){
            	  var transformedInput = inputValue;
              }else{
            	  var regexp_2 = /^[0-9]\d{0,9}(\.)?%?$/;
            	  if(regexp_2.test(inputValue)){
            	  var transformedInput = inputValue;
            	  }
              }
              
              if (transformedInput !== inputValue) {
            	  signUp.$setViewValue(transformedInput);
            	  signUp.$render();            	  
              }
              return transformedInput;
          });
      }
  };
})
.directive('onlyDigitsWithoutDecimal', function () {
  return {
      restrict: 'A',
      require: '?ngModel',
      link: function (scope, element, attrs, signUp) {
    	  signUp.$parsers.push(function (inputValue) {
              if (inputValue == undefined) return '';
              var transformedInput = inputValue.replace(/[^0-9]/g, '');
              if (transformedInput !== inputValue) {
            	  signUp.$setViewValue(transformedInput);
            	  signUp.$render();            	  
              }
              return transformedInput;
          });
      }
  };
})
.directive('datePicker', function() {
    // Define fuction for getting the maximum date for a month.
    function maxDate(month, year) {
        var res = 31;
        if(month != null) {
            if(month == 4 || month == 6 || month == 9 || month == 11) {
                res = 30;
            }
            if(year != null && month == 2) {
                res = (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)? 29 : 28;
            }
        }
        return res;
    }

    // Define function for adjust timezone.
    function adjustTimezone (myDate, myTimezone) {
        var offset = isNaN(myTimezone)? new Date().getTimezoneOffset() : parseFloat(myTimezone)*60;
        return new Date(myDate.getTime() + offset*60*1000);                           
    }
    
    // Define function for parse dates.
    function parseDate(myDate, myTimezone) {
        var res = null;
        if(myDate !== undefined && myDate !== null) {
            if(myDate instanceof Date) {
                res = myDate;
            } else {
                if(typeof myDate == 'number' || typeof myDate == 'string') {
                    // Parse date.
                    res = new Date(isNaN(myDate)? myDate : parseInt(myDate, 10));
                    
                    // Adjust timezone.
                    res = adjustTimezone(res, myTimezone);
                }
            }
        }
        return res;
    };

    // Function to parse an string returning either a number or 'null' (instead of NaN).
    function parseIntStrict(num) {
        return (num !== null && num !== '' && parseInt(num) != NaN)? parseInt(num) : null;
    };
    
    // Function to parse a JSON object.
    function parseJsonPlus(jsonObj) {
        var res = null;
        if(jsonObj != null) {
            try{ res = JSON.parse(jsonObj); }catch(ex) {}
            if(res == null) try{ res = JSON.parse(jsonObj.replace(/'/g, '"')); }catch(ex) {}
        }
        return res;
    }
    
    // Create directive.
    return {
        restrict: 'AEC',
        scope: {
            ngModel: '=',
            ngDate : '@',
            ngMinDate : '@',
            ngMaxDate : '@',
            ngMinModel : '=?',
            ngMaxModel : '=?',
            ngMonths : '@',
            ngTimezone: '@',
            ngOrder: '@',
            ngAttrsDate: '@',
            ngAttrsMonth: '@',
            ngAttrsYear: '@',
            ngDisabled: '=?',
            ngYearOrder: '@',
            ngPlaceholder: '@',
            ngPlaceholderEnabled: '@',
            ngRequired: '@'
        },
        require: 'ngModel',
        controller: ['$scope', function($scope) {
            // Initialize models.
            $scope.ngModel = parseDate($scope.ngModel, $scope.ngTimezone);
            $scope.ngMinModel = parseDate($scope.ngMinModel, $scope.ngTimezone);
            $scope.ngMaxModel = parseDate($scope.ngMaxModel, $scope.ngTimezone);
            
            // Initialize attributes variables.
            $scope.ngAttrsDate = parseJsonPlus($scope.ngAttrsDate);
            $scope.ngAttrsMonth = parseJsonPlus($scope.ngAttrsMonth);
            $scope.ngAttrsYear = parseJsonPlus($scope.ngAttrsYear);
            
            // Verify if initial date was defined.
            var initDate = parseDate($scope.ngDate, $scope.ngTimezone);
            if(initDate != null) $scope.ngModel = initDate;

            // Initialize order.
            if(typeof $scope.ngOrder != 'string') {
                $scope.ngOrder = 'dmy';
            } else {
                $scope.ngOrder = $scope.ngOrder.toLowerCase();
            }

            // Initialize minimal and maximum values.
            if($scope.ngMinDate) {
                $scope.ngMinModel = parseDate($scope.ngMinDate, $scope.ngTimezone);
            }
            if(!$scope.ngMinModel) {
                var now = new Date();
                $scope.ngMinModel = new Date(now.getFullYear()-100, now.getMonth(), now.getDate(),
                                          now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
            }
            if($scope.ngMaxDate) {
                $scope.ngMaxModel = parseDate($scope.ngMaxDate, $scope.ngTimezone);
            }
            if(!$scope.ngMaxModel) {
                $scope.ngMaxModel = new Date();
            }

            // Watch for changes in the minimum and maximum dates.
            $scope.$watch('[ngMinModel, ngMaxModel]', function() {
                // Update list of years (if possible).
                if($scope.ngMinModel && $scope.ngMaxModel) {
                    // Get list of years.
                    $scope.years = [];
                    for(var i=$scope.ngMinModel.getFullYear(); i<=$scope.ngMaxModel.getFullYear()-18; i++) {
                        $scope.years.push({value:i, name:i});
                    }

                    // Verify if the order of the years must be reversed.
                    if(typeof $scope.ngYearOrder == 'string' && $scope.ngYearOrder.indexOf('des') == 0) {
                        $scope.years.reverse();
                    }

                    // Prepend the years placeholder
                    if($scope.placeHolders) $scope.years.unshift($scope.placeHolders[0]);
                }
                
                // Verify if selected date is in the valid range.
                if($scope.ngModel && $scope.ngMinModel && $scope.ngModel < $scope.ngMinModel) $scope.ngModel = $scope.ngMinModel;
                if($scope.ngModel && $scope.ngMaxModel && $scope.ngModel > $scope.ngMaxModel) $scope.ngModel = $scope.ngMaxModel;
            });

            // Initialize place holders.
            $scope.placeHolders = null;
            if($scope.ngPlaceholder !== undefined && $scope.ngPlaceholder !== null && (typeof $scope.ngPlaceholder == 'string' || Array.isArray($scope.ngPlaceholder))) {
                var holders = typeof $scope.ngPlaceholder == 'string'? $scope.ngPlaceholder.split(',') : $scope.ngPlaceholder;
                if(holders.length == 3) {
                    $scope.placeHolders = [];
                    for(var h=0; h<holders.length; h++) {
                        $scope.placeHolders.push({value:'', name:holders[h], disabled:false});
                    }
                }
            }

            // Initialize list of months names.
            var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            if($scope.ngMonths !== undefined && $scope.ngMonths !== null) {
                if(typeof $scope.ngMonths == 'string') {
                    var months = $scope.ngMonths.split(',');
                    if(months.length == 12) monthNames = months;
                }
                if(Array.isArray($scope.ngMonths) && $scope.ngMonths.length == 12) {
                     monthNames = $scope.ngMonths;
                }
            }
            
            // Update list of months.
            $scope.updateMonthList = function(year) {
                // Parse parameter.
                year = parseIntStrict(year);

                // Some months can not be choosed if the year matchs with the year of the minimum or maximum dates.
                var start = year !== null && year == $scope.ngMinModel.getFullYear()? $scope.ngMinModel.getMonth() : 0;
                var end = year !== null && year == $scope.ngMaxModel.getFullYear()? $scope.ngMaxModel.getMonth() : 11;

                // Generate list.
                $scope.months = [];
                if($scope.placeHolders) $scope.months.push($scope.placeHolders[1]);
                for(var i=start; i<=end; i++) {
                    $scope.months.push({value:i, name:monthNames[i]});
                }
            };

            // Initialize list of days.
            $scope.updateDateList = function(month, year) {
                // Parse parameters.
                month = parseIntStrict(month);
                year = parseIntStrict(year);
                
                // Start date is 1, unless the selected month and year matchs the minimum date.
                var start = 1;
                if(month !== null && month == $scope.ngMinModel.getMonth() && 
                   year !== null && year == $scope.ngMinModel.getFullYear()) {
                    start = $scope.ngMinModel.getDate();
                }

                // End date is 30 or 31 (28 or 29 in February), unless the selected month and year matchs the maximum date.
                var end = maxDate(month !== null? (month+1) : null, year);
                if(month !== null && month == $scope.ngMaxModel.getMonth() && 
                   year !== null && year == $scope.ngMaxModel.getFullYear()) {
                    end = $scope.ngMaxModel.getDate();
                }

                // Generate list.
                $scope.dates = [];
                if($scope.placeHolders) $scope.dates.push($scope.placeHolders[2]);
                for(var i=start; i<=end; i++) {
                    $scope.dates.push({value:i, name:i});
                }
            };
        } ],
        
        link: function(scope, element, attrs, ngModelCtrl) {
            // Initialize variables.
            var jqLite = angular.element;
            var children = jqLite(element[0]).children();
            var order = scope.ngOrder.split('');

            // Reorder elements.
            for(var i=0; i<order.length; i++) {
                if(order[i] == 'd') jqLite(element[0]).append(children[0]);
                if(order[i] == 'm') jqLite(element[0]).append(children[1]);
                if(order[i] == 'y') jqLite(element[0]).append(children[2]);
            }
            
            // Set formatter function.
            ngModelCtrl.$formatters.push(function(modelValue) {
                var res = {date: null, month: null, year: null};

                // Verify if model is defined.
                if (modelValue) {
                    res.date = modelValue.getDate();
                    res.month = modelValue.getMonth();
                    res.year = modelValue.getFullYear();
                } else {
                    res.date = '';
                    res.month = '';
                    res.year = '';
                    
                    if(scope.placeHolders) {
                        scope.placeHolders[0].disabled = false;
                        scope.placeHolders[1].disabled = false;
                        scope.placeHolders[2].disabled = false;
                    }
                }

                // Hide or show days and months according to the min and max dates.
                scope.updateMonthList(res.year);
                scope.updateDateList(res.month, res.year);
                return res;
            });
            
            // Set render function.
            ngModelCtrl.$render = function() {
                scope.date  = ngModelCtrl.$viewValue.date;
                scope.month = ngModelCtrl.$viewValue.month;
                scope.year  = ngModelCtrl.$viewValue.year;
            };
            
            // Set watch function for update the view value.
            scope.$watch('date + "-" + month + "-" + year', function(newValue, oldValue) {
                if(newValue != oldValue) {
                    ngModelCtrl.$setViewValue({
                        date: scope.date,
                        month: scope.month,
                        year: scope.year
                    });
                }
            });
            
            // Override function to check if the value is empty.
            ngModelCtrl.$isEmpty = function(viewValue) {
                return viewValue.date == null || viewValue.date == '' || 
                       isNaN(parseInt(viewValue.month)) ||
                       viewValue.year == null || viewValue.year == '';
            };
            
            // Set parser function.
            ngModelCtrl.$parsers.push(function(viewValue) {
                var res = null;

                // Check that the three combo boxes have values.
                if(viewValue.date != null && viewValue.date != '' && !isNaN(parseInt(viewValue.month)) && viewValue.year != null && viewValue.year != '') {
                    var maxDay = maxDate(viewValue.month+1, viewValue.year);
                    
                    var hours = 0, minutes = 0, seconds = 0, milliseconds = 0;
                    if(scope.ngModel != null) {
                        hours = scope.ngModel.getHours();
                        minutes = scope.ngModel.getMinutes();
                        seconds = scope.ngModel.getSeconds();
                        milliseconds = scope.ngModel.getMilliseconds();
                    }
                    
                    res = new Date(viewValue.year, viewValue.month, viewValue.date > maxDay? maxDay : viewValue.date, hours, minutes, seconds, milliseconds);
                }
                
                // Disable placeholders after selecting a value.
                if(scope.placeHolders && angular.isUndefined(scope.ngPlaceholderEnabled)) {
                    if(scope.year != '') scope.placeHolders[0].disabled = true;
                    if(scope.month != '') scope.placeHolders[1].disabled = true;
                    if(scope.date != '') scope.placeHolders[2].disabled = true;
                }
                
                // Hide or show days and months according to the min and max dates.
                scope.updateMonthList(viewValue.year);
                scope.updateDateList(viewValue.month, viewValue.year);
                          
                return res;
            });
            
            // Method called when one of the combo boxes is touched.
            scope.touched = function() {
                ngModelCtrl.$touched = true;
                ngModelCtrl.$untouched = false;
            };
        },
        template: function(element, attrs) {
            // Verify if addtional attributes were defined.
            var strAttrs = ['', '', ''];
            var attrNames = ['ngAttrsDate', 'ngAttrsMonth', 'ngAttrsYear'];
            for(var i=0; i<3; i++) {
                try{
                    // Verify if the attributes were defined.
                    if(attrs && attrs[attrNames[i]]) {
                        // Iterate over each attribute.
                        eval("var attrsAux= " + attrs[attrNames[i]]);
                        for(var key in attrsAux) {
                            var value = attrsAux[key];
                            if(typeof value == "boolean") {
                                if(value) strAttrs[i] += key + ' ';
                            } else {
                                if(typeof value == "string" && value.indexOf('"') > 0) { value = value.replace(/"/g, '&quot;'); }
                                strAttrs[i] += key + '="' + value + '" ';
                            }
                        }
                    }
                }catch(err){}
            }

            // Generate HTML code.
            var html =
            	'<div class="form-group col-sm-4  nopad-left"><select class="form-control"  ng-disabled="ngDisabled === true || ngDisabled[0] === true" ng-model="date" ng-blur="touched()" '+strAttrs[0]+' ng-options="date.value as date.name disable when date.disabled for date in dates"></select></div>' +
            	'<div class="form-group col-sm-4  nopad-left"><select class="form-control" ng-disabled="ngDisabled === true || ngDisabled[1] === true" ng-model="month" ng-blur="touched()" '+strAttrs[1]+' ng-options="month.value as month.name disable when month.disabled for month in months"></select></div>' +
            	'<div class="form-group col-sm-4  nopad-left"><select class="form-control" ng-disabled="ngDisabled === true || ngDisabled[2] === true" ng-model="year" ng-blur="touched()" '+strAttrs[2]+' ng-options="year.value as year.name disable when year.disabled for year in years"></select></div>'
            ;

            return html;
        }
    }
})
.directive('accessibleForm', function () {
    return {
        restrict: 'A',
        link: function (scope, elem) {

            // set up event handler on the form element
            elem.on('submit', function () {

                // find the first invalid element
                var firstInvalid = elem[0].querySelector('.ng-invalid');

                // if we find one, set focus
                if (firstInvalid) {
                    firstInvalid.focus();
                }
            });
        }
    };
})
.directive("moveNextInput", function() {
    return {
        restrict: "A",
        link: function($scope, element) {
            element.on("input", function(e) {
                if(element.val().length == element.attr("maxlength")) {
                    var $nextElement = element.parent().next().find('input');
                    if($nextElement.length) {
                        $nextElement[0].focus();
                    }
                }
            });
        }
    }
})
.directive('popover', function(){
    return {
        restrict: 'A',
        link: function(scope, element, attrs){
            $(element).hover(function(){
                // on mouseenter
                $(element).popover('show');
            }, function(){
                // on mouseleave
                $(element).popover('hide');
            });
        }
    };
}).directive('phoneInput', function($filter, $browser) {
    return {
        require: 'ngModel',
        link: function($scope, $element, $attrs, ngModelCtrl) {
            var listener = function() {
                var value = $element.val().replace(/[^0-9]/g, '');
                $element.val($filter('tel')(value, false));
            };

            // This runs when we update the text field
            ngModelCtrl.$parsers.push(function(viewValue) {
                return viewValue.replace(/[^0-9]/g, '').slice(0,10);
            });

            // This runs when the model gets updated on the scope directly and keeps our view in sync
            ngModelCtrl.$render = function() {
                $element.val($filter('tel')(ngModelCtrl.$viewValue, false));
            };

            $element.bind('change', listener);
            $element.bind('keydown', function(event) {
                var key = event.keyCode;
                // If the keys include the CTRL, SHIFT, ALT, or META keys, or the arrow keys, do nothing.
                // This lets us support copy and paste too
                if (key == 91 || (15 < key && key < 19) || (37 <= key && key <= 40)){
                    return;
                }
                $browser.defer(listener); // Have to do this or changes don't get picked up properly
            });

            $element.bind('paste cut', function() {
                $browser.defer(listener);
            });
        }

    };
})
.directive('passwordVerify', function() {
	return {
	  	restrict: 'A', // only activate on element attribute
	  	require: '?ngModel', // get a hold of NgModelController
	  	link: function(scope, elem, attrs, ngModel) {
	  		if (!ngModel) return; // do nothing if no ng-model
	  		// watch own value and re-validate on change
	  		scope.$watch(attrs.ngModel, function() {
	  			validate();
	  		});

	  		// observe the other value and re-validate on change
	  		attrs.$observe('passwordVerify', function(val) {
	  			validate();
	  		});
	  		var validate = function() {
                var val1 = ngModel.$viewValue;
                var val2 = attrs.passwordVerify;
                ngModel.$setValidity('passwordVerify', val1 === val2);
	  		};
	  	}
	}
})
.directive('onlyLettersInput', function onlyLettersInput() {
	return {
		require: 'ngModel',
		link: function(scope, element, attr, ngModelCtrl) {
			function fromUser(text) {
				var transformedInput = text.replace(/[^a-zA-Z]/g, '');
				if (transformedInput !== text) {
					ngModelCtrl.$setViewValue(transformedInput);
					ngModelCtrl.$render();
				}
				return transformedInput;
			}
			ngModelCtrl.$parsers.push(fromUser);
		}
	};
})
.directive('onlyLettersInputspace', function onlyLettersInput() {
	return {
		require: 'ngModel',
		link: function(scope, element, attr, ngModelCtrl) {
			function fromUser(text) {
				var transformedInput = text.replace(/[^a-zA-Z ]/g, '');
				if (transformedInput !== text) {
					ngModelCtrl.$setViewValue(transformedInput);
					ngModelCtrl.$render();
				}
				return transformedInput;
			}
			ngModelCtrl.$parsers.push(fromUser);
		}
	};
})
 .directive('timer', function($timeout, $compile) {
	return {
		restrict: 'E',
		scope: {
			interval: '=', //don't need to write word again, if property name matches HTML attribute name
			startTimeAttr: '=?startTime', //a question mark makes it optional
			countdownAttr: '=?countdown', //what unit?
			notifyWhenStop : '='
		},
		template: '{{ minutes }} minute, ' +
		'{{ seconds }} second ',
		link: function (scope, elem, attrs) {

			//Properties
			scope.startTime = scope.startTimeAttr ? new Date(scope.startTimeAttr) : new Date();
			var countdown = (scope.countdownAttr && parseInt(scope.countdownAttr, 10) > 0) ? parseInt(scope.countdownAttr, 10) : 60; //defaults to 60 seconds

			function tick () {

				//How many milliseconds have passed: current time - start time
				scope.millis = new Date() - scope.startTime;

				if (countdown > 0) {
					scope.millis = countdown * 1000;
					countdown--;
				} else if (countdown <= 0) {
					scope.stop();
				}

				scope.seconds = Math.floor((scope.millis / 1000) % 60);
				scope.minutes = Math.floor(((scope.millis / (1000 * 60)) % 60));
				scope.hours = Math.floor(((scope.millis / (1000 * 60 * 60)) % 24));
				scope.days = Math.floor(((scope.millis / (1000 * 60 * 60)) / 24));

				//is this necessary? is there another piece of unposted code using this?
				scope.$emit('timer-tick', {
					intervalId: scope.intervalId,
					millis: scope.millis
				});

				scope.$apply();

			}

			function resetInterval () {
				if (scope.intervalId) {
					clearInterval(scope.intervalId);
					scope.intervalId = null;
				}        
			}

			scope.stop = function () {
				scope.notifyWhenStop(true);
				scope.stoppedTime = new Date();
				resetInterval();
			}

			//if not used anywhere, make it a regular function so you don't pollute the scope
			function start () {
				resetInterval();
				scope.intervalId = setInterval(tick, scope.interval);           
			}

			scope.resume = function () {
				scope.stoppedTime = null;
				scope.startTime = new Date() - (scope.stoppedTime - scope.startTime);
				start();
			}

			start(); //start timer automatically

			//Watches
			scope.$on('time-start', function () {
				start();
			});

			scope.$on('timer-resume', function() {
				scope.resume();
			});

			scope.$on('timer-stop', function() {
				scope.stop();
			});
			
			scope.$on('timer-reset', function(event, obj){
				//scope.stop();
				//scope.intervalId = null;
				scope.startTime = scope.startTimeAttr ? new Date(scope.startTimeAttr) : new Date();
				//start();
				countdown = obj.otp;
				//resetInterval();
				//scope.intervalId = setInterval(tick, scope.interval);
				resetInterval();
				scope.intervalId = setInterval(tick, scope.interval);    
			});

			//Cleanup
			elem.on('$destroy', function () {
				resetInterval();
			});

		}
	};
})
.directive('tooltip', function(){
    return {
        restrict: 'A',
        link: function(scope, element, attrs){
            $(element).hover(function(){
                $(element).tooltip('show');
            }, function(){
                $(element).tooltip('hide');
            });
        }
    };
}).directive('focus', function() {
	  return {
		    restrict: 'A',
		    link: function($scope,elem,attrs) {
		    	$scope.$watch(attrs.ngModel, function (v) {
		    	});
		      var count = 0;
		      elem.bind('keyup', function(e) {
		        var code = e.keyCode || e.which;
		        if(code==8)
		        {
		        	count = count +1;
		        	if(code==8 && count == 2)
		        	 {
		        		count = 0;
		        		elem.prev().focus();
				        e.preventDefault(); 
		              }
		        }
		        if (code>=48 && code<=57 || code>=96 && code<=105 ) 
		           {
			    	   elem.next().focus();
			           e.preventDefault();
			       }
		       });
		      
		      
		      $scope.inputType = 'password';
		      // Hide & show password function
		         $scope.hideShowPassword = function(){
		           if ($scope.inputType == 'password')
		             $scope.inputType = 'text';
		           else
		             $scope.inputType = 'password';
		         };
		      
		    }
		  }
}).directive('datePicker2', function(){
		    return{
		        restrict: 'A',
		        require: 'ngModel',
		        link: function(scope, elm, attr, ctrl){
		          // Format date on load
		          ctrl.$formatters.unshift(function(value) {
		        
		            return value;
		          })
		          
		          //Disable Calendar
		          scope.$watch(attr.ngDisabled, function (newVal) {
		            if(newVal === true)
		              $(elm).datepicker("disable");
		            else
		              $(elm).datepicker("enable");
		          });
		          
		          // Datepicker Settings
		          elm.datepicker({
		            autoSize: true,
		            changeYear: true,
		            changeMonth: true,
		            dateFormat: attr["dateformat"] || 'dd-mm-yy',
		            showOn: 'focus',
		            buttonText: '<i class="glyphicon glyphicon-calendar"></i>',
		            onSelect: function (valu) {
		              scope.$apply(function () {
		                  ctrl.$setViewValue(valu);
		              });
		              elm.click();
		            },
		            
		             beforeShow: function(){
		               
		              if(attr["minDate"] != null)
		                  $(elm).datepicker('option', 'minDate', attr["minDate"]);
		                
		              if(attr["maxDate"] != null )
		                  $(elm).datepicker('option', 'maxDate', attr["maxDate"]);
		            },
		            
		            
		          });
		        }

		    }})


    .directive('ngPatternRestrict', ['$log', function ($log) {
        'use strict';

        return {
            restrict: 'A',
            require: "?ngModel",
            compile: function uiPatternRestrictCompile() {


                return function ngPatternRestrictLinking(scope, iElement, iAttrs, ngModelController) {
                    var regex, // validation regex object
                        oldValue, // keeping track of the previous value of the element
                        caretPosition, // keeping track of where the caret is at to avoid jumpiness
                        // housekeeping
                        initialized = false, // have we initialized our directive yet?
                        eventsBound = false, // have we bound our events yet?
                        // functions
                        getCaretPosition, // function to get the caret position, set in detectGetCaretPositionMethods
                        setCaretPosition; // function to set the caret position, set in detectSetCaretPositionMethods

                    //-------------------------------------------------------------------
                    // caret position
                    function getCaretPositionWithInputSelectionStart() {
                        return iElement[0].selectionStart; // we need to go under jqlite
                    }

                    function getCaretPositionWithDocumentSelection() {
                        // create a selection range from where we are to the beggining
                        // and measure how much we moved
                        var range = document.selection.createRange();
                        range.moveStart('character', -iElement.val().length);
                        return range.text.length;
                    }

                    function getCaretPositionWithWindowSelection() {
                        var s = window.getSelection(),
                            originalSelectionLength = String(s).length,
                            selectionLength,
                            didReachZero = false,
                            detectedCaretPosition,
                            restorePositionCounter;

                        do {
                            selectionLength = String(s).length;
                            s.modify('extend', 'backward', 'character');
                            // we're undoing a selection, and starting a new one towards the beggining of the string
                            if (String(s).length === 0) {
                                didReachZero = true;
                            }
                        } while (selectionLength !== String(s).length);

                        detectedCaretPosition = didReachZero ? selectionLength : selectionLength - originalSelectionLength;
                        s.collapseToStart();

                        restorePositionCounter = detectedCaretPosition;
                        while (restorePositionCounter-- > 0) {
                            s.modify('move', 'forward', 'character');
                        }
                        while (originalSelectionLength-- > 0) {
                            s.modify('extend', 'forward', 'character');
                        }

                        return detectedCaretPosition;
                    }

                    function setCaretPositionWithSetSelectionRange(position) {
                        iElement[0].setSelectionRange(position, position);
                    }

                    function setCaretPositionWithCreateTextRange(position) {
                        var textRange = iElement[0].createTextRange();
                        textRange.collapse(true);
                        textRange.moveEnd('character', position);
                        textRange.moveStart('character', position);
                        textRange.select();
                    }

                    function setCaretPositionWithWindowSelection(position) {
                        var s = window.getSelection(),
                            selectionLength;

                        do {
                            selectionLength = String(s).length;
                            s.modify('extend', 'backward', 'line');
                        } while (selectionLength !== String(s).length);
                        s.collapseToStart();

                        while (position--) {
                            s.modify('move', 'forward', 'character');
                        }
                    }

                    // HACK: Opera 12 won't give us a wrong validity status although the input is invalid
                    // we can select the whole text and check the selection size
                    // Congratulations to IE 11 for doing the same but not returning the selection.
                    function getValueLengthThroughSelection(input) {
                        // only do this on opera, since it'll mess up the caret position
                        // and break Firefox functionality
                        if (!/Opera/i.test(navigator.userAgent)) {
                            return 0;
                        }

                        input.focus();
                        document.execCommand("selectAll");
                        var focusNode = window.getSelection().focusNode;
                        return (focusNode || {}).selectionStart || 0;
                    }

                    //-------------------------------------------------------------------
                    // event handlers
                    function revertToPreviousValue() {
                        if (ngModelController) {
                            scope.$apply(function () {
                                ngModelController.$setViewValue(oldValue);
                            });
                        }
                        iElement.val(oldValue);

                        if (!angular.isUndefined(caretPosition)) {
                            setCaretPosition(caretPosition);
                        }
                    }

                    function updateCurrentValue(newValue) {
                        oldValue = newValue;
                        caretPosition = getCaretPosition();
                    }

                    function genericEventHandler(evt) {

                        //HACK Chrome returns an empty string as value if user inputs a non-numeric string into a number type input
                        // and this may happen with other non-text inputs soon enough. As such, if getting the string only gives us an
                        // empty string, we don't have the chance of validating it against a regex. All we can do is assume it's wrong,
                        // since the browser is rejecting it either way.
                        var newValue = iElement.val(),
                            inputValidity = iElement.prop("validity");
                        if (newValue === "" && iElement.attr("type") !== "text" && inputValidity && inputValidity.badInput) {

                            evt.preventDefault();
                            revertToPreviousValue();
                        } else if (newValue === "" && getValueLengthThroughSelection(iElement[0]) !== 0) {

                            evt.preventDefault();
                            revertToPreviousValue();
                        } else if (regex.test(newValue)) {

                            updateCurrentValue(newValue);
                        } else {
                            evt.preventDefault();
                            revertToPreviousValue();
                        }
                    }
                    function tryParseRegex(regexString) {
                        try {
                            regex = new RegExp(regexString);
                        } catch (e) {
                            throw "Invalid RegEx string parsed for ngPatternRestrict: " + regexString;
                        }
                    }

                    //-------------------------------------------------------------------
                    // setup events
                    function bindListeners() {
                        if (eventsBound) {
                            return;
                        }

                        iElement.bind('input keyup click', genericEventHandler);

                        //DEBUG && showDebugInfo("Bound events: input, keyup, click");
                    }

                    function unbindListeners() {
                        if (!eventsBound) {
                            return;
                        }

                        iElement.unbind('input', genericEventHandler);
                        //input: HTML5 spec, changes in content

                        iElement.unbind('keyup', genericEventHandler);
                        //keyup: DOM L3 spec, key released (possibly changing content)

                        iElement.unbind('click', genericEventHandler);
                        //click: DOM L3 spec, mouse clicked and released (possibly changing content)

                        //DEBUG && showDebugInfo("Unbound events: input, keyup, click");

                        eventsBound = false;
                    }

                    //-------------------------------------------------------------------
                    // initialization
                    function readPattern() {
                        var entryRegex = !!iAttrs.ngPatternRestrict ? iAttrs.ngPatternRestrict : iAttrs.pattern;
                        //DEBUG && showDebugInfo("RegEx to use:", entryRegex);
                        tryParseRegex(entryRegex);
                    }

                    function notThrows(testFn, shouldReturnTruthy) {
                        try {
                            return testFn() || !shouldReturnTruthy;
                        } catch (e) {
                            return false;
                        }
                    }

                    function detectGetCaretPositionMethods() {
                        var input = iElement[0];

                        // Chrome will throw on input.selectionStart of input type=number
                        // See http://stackoverflow.com/a/21959157/147507
                        if (notThrows(function () { return input.selectionStart; })) {
                            getCaretPosition = getCaretPositionWithInputSelectionStart;
                        } else {
                            // IE 9- will use document.selection
                            // TODO support IE 11+ with document.getSelection()
                            if (notThrows(function () { return document.selection; }, true)) {
                                getCaretPosition = getCaretPositionWithDocumentSelection;
                            } else {
                                getCaretPosition = getCaretPositionWithWindowSelection;
                            }
                        }
                    }

                    function detectSetCaretPositionMethods() {
                        var input = iElement[0];
                        if (typeof input.setSelectionRange === 'function') {
                            setCaretPosition = setCaretPositionWithSetSelectionRange;
                        } else if (typeof input.createTextRange === 'function') {
                            setCaretPosition = setCaretPositionWithCreateTextRange;
                        } else {
                            setCaretPosition = setCaretPositionWithWindowSelection;
                        }
                    }

                    function initialize() {
                        if (initialized) {
                            return;
                        }
                        //DEBUG && showDebugInfo("Initializing");

                        readPattern();

                        oldValue = iElement.val();
                        if (!oldValue) {
                            oldValue = "";
                        }
                        //DEBUG && showDebugInfo("Original value:", oldValue);

                        bindListeners();

                        detectGetCaretPositionMethods();
                        detectSetCaretPositionMethods();

                        initialized = true;
                    }

                    function uninitialize() {
                        //DEBUG && showDebugInfo("Uninitializing");
                        unbindListeners();
                    }

                    iAttrs.$observe("ngPatternRestrict", readPattern);
                    iAttrs.$observe("pattern", readPattern);

                    scope.$on("$destroy", uninitialize);

                    initialize();
                };
            }
        };

    }])
.directive('copyToClipboard', function () {


		        return {
		            restrict: 'A',
		            link: function (scope, elem, attrs) {
		                elem.click(function () {
		                    if (attrs.copyToClipboard) {
		                        var $temp_input = $("<input>");
		                        $("body").append($temp_input);
		                        $temp_input.val(attrs.copyToClipboard).select();
		                        document.execCommand("copy");
		                        $temp_input.remove();
		                    }
		                });
		            }
		        };
		    }).directive('back', ['$window', function($window) {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                elem.bind('click', function () {
                    $window.history.back();
                });
            }
        };
    }]).directive('scrollToBookmark', function() {  
    	  return {
    		    link: function(scope, element, attrs) {
    		      var value = attrs.scrollToBookmark;
    		      element.click(function() {
    		        scope.$apply(function() {
    		          var selector = "[scroll-bookmark='"+ value +"']";
    		          var element = $(selector);
    		          if(element.length) {
    		        	  setTimeout(function(){window.scrollTo(0, (element[0].offsetTop + 100)); }, 1500);
    		             
    		           
    		          }
    		        });
    		      });
    		    }
    		  };

    		}).directive('autoFocus', function() {
    return {
        link: {
            pre: function(scope, element, attr) {
            },
            post: function(scope, element, attr) {
                element[0].focus();
            }
        }
    }
}).directive('noSpecialChar', function() {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function(scope, element, attrs, editPermissionController) {
            editPermissionController.$parsers.push(function(roleNewName) {

                if (roleNewName == null)
                    return ''
                let cleanInputValue = roleNewName.replace(/[^\w]|_/gi, '');
                if (cleanInputValue != roleNewName) {
                    editPermissionController.$setViewValue(cleanInputValue);
                    editPermissionController.$render();
                }
                return cleanInputValue;
            });
        }
    }
}).directive('pctComplete', function() {
	  return {
		    restrict: 'E',
		    replace: true,
		    scope: {
		      value: '='
		    },
		    template: ' <div class="c100 p{{value}} big blue">\
		                      <span>{{value}}%</span>\
		                      <div class="slice">\
		                        <div class="bar"></div>\
		                        <div class="fill"></div>\
		                      </div>\
		                    </div>'
		  };
}).directive('modalDialog', function( ){
	 
	  return {
	    restrict: 'E',
	    scope: {
	      show : '='
	    },
	    replace: true, // This will replace the template below
	    transclude: true, // This says we want to insert custom content inside an element with our directive
	    link: function(scope, element, attrs) {  // This gives us the scope element and attributes from the current state
	      
	      // initialize Style Obj ...
	      scope.dialogStyle = {};
	      if (attrs.width)
	        scope.dialogStyle.width = attrs.width;
	      if (attrs.height)
	        scope.dialogStyle.height = attrs.height;
	      scope.hideModal = function() {
	        scope.show = false;
	      };
	    },
	    template: "<div class='ng-modal transition' ng-show='show'><div class='ng-modal-overlay transition' ng-click='hideModal()'></div><div class='ng-modal-dialog transition' ng-style='dialogStyle'><div class='ng-modal-close' ng-click='hideModal()'>X</div><div class='ng-modal-dialog-content' ng-transclude></div></div></div>"
	  };
	})
	
	.directive('fileModel', ['$parse', function ($parse) {
	    return {
	        restrict: 'A',
	        link: function(scope, element, attrs) {
	            var model = $parse(attrs.fileModel);
	            var modelSetter = model.assign;
	            element.bind('change', function(){
	                scope.$apply(function(){
	                    modelSetter(scope, element[0].files[0]);
	                });
	            });
	        }
	    };
	}]).directive('uiSelectNoAnimate', () => ({
        restrict: 'A',
        require: 'uiSelect',
        link: (scope, element, attrs, $select) => {
            $select.$animate = null;
        }
    }))
	.service('fileUpload', ['$http','Session','commonDataService','toastr','Msg', function ($http,Session,commonDataService,toastr,Msg) {
	    this.uploadFileToUrl = function(file, uploadUrl, model){
	        var fd = new FormData();
	        if(model == null){
	        	fd.append('file', file);
	        }else{
	        	fd.append('file', file);
	        	fd.append('hotlistDto', new Blob([JSON.stringify(model)],{
	                type: "application/json"

	            }));
	        }
	        $http.post(uploadUrl, fd, {
	            transformRequest: angular.identity,
	            headers: {'Content-Type': undefined,'x-auth-token': Session.getToken(), 'x-csrf-token' : Session.getCsrf(), 'orgId':commonDataService.getLocalStorage().orgId}
	        })
	        .then(function successCallback(response) {
	        	
	        	toastr.success(response.data.message, Msg.hurrah);	
  }, function errorCallback(response) {
	  
})
	    }
	}]).filter('propsFilter', function() {
	  return function(items, props) {
		    var out = [];

		    if (angular.isArray(items)) {
		      items.forEach(function(item) {
		        var itemMatches = false;

		        var keys = Object.keys(props);
		        for (var i = 0; i < keys.length; i++) {
		          var prop = keys[i];
		          var text = props[prop].toLowerCase();
		          if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
		            itemMatches = true;
		            break;
		          }
		        }

		        if (itemMatches) {
		          out.push(item);
		        }
		      });
		    } else {
		      // Let the output be the input untouched
		      out = items;
		    }
		   
		    return out;
		    
		  }
		}

);
