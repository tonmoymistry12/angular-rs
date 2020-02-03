/**
 * All the config related modules will be kept here
 */

'use strict';
angular.module('efrm.config')
	.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
		cfpLoadingBarProvider.includeSpinner = false;
	}])
	.config(function(toastrConfig) {
		angular.extend(toastrConfig, {
			allowHtml: true,
			closeButton: true,
			closeHtml: '<button>&times;</button>',
			extendedTimeOut: 1000,
			iconClasses: {
				error: 'toast-error',
				info: 'toast-info',
				success: 'toast-success',
				warning: 'toast-warning'
			},  
			messageClass: 'toast-message',
			positionClass: 'toast-top-right',
			autoDismiss: false,
			onHidden: null,
			onShown: null,
			onTap: null,
			progressBar: true,
			tapToDismiss: true,
			timeOut: 8000,
			titleClass: 'toast-title',
			toastClass: 'toast',
			preventOpenDuplicates: true
		});
	})
	.run(['$rootScope', 'Session', function($rootScope, Session,$location){
		Session.clear();
		$rootScope.spinner = false;

	//	$rootScope.preload = false;
	}])
	.run(function($anchorScroll, $window) {
		var wrap = function(method) {
			var orig = $window.window.history[method];
			$window.window.history[method] = function() {
				var retval = orig.apply(this, Array.prototype.slice.call(arguments));
				$anchorScroll();
				return retval;
			};
		};
		wrap('pushState');
		wrap('replaceState');
	})
	.config(function($provide) {
	    $provide.decorator("$exceptionHandler", function($delegate, $injector) {
			return function(exception, cause) {
				$delegate(exception, cause);
	            var toastr = $injector.get('toastr');
	            toastr.warning(exception.message+'\n'+ exception, 'Fatal!!!!!');
			};
		});
	})
	.factory('RequestsErrorHandler', ['$q', '$injector','$rootScope', 'Msg', '$state','$timeout', function($q,  $injector, $rootScope, Msg, $state, $timeout) {
		var toastr;
		var counter = 0;
		
		return {
			request: function (config) {
				
				var encryptkey = 0;
				var getencryptkey = 0;
				function generateChecksum(str){
					
					var checksum =0;
					var i;
					var x
					var hexValue;
					var carry;
					for(i=0;i<str.length-2;i=i+2){
						
						x = str.charCodeAt(i);
						hexValue= Number(x).toString(16);
						x = str.charCodeAt(i+1);
						hexValue= hexValue + Number(x).toString(16);
						x = parseInt(hexValue, 16)
						checksum +=x;
					}
					 if (str.length % 2 == 0){
						
						// If number of characters is even, then repeat above loop's steps
						// one more time.
						x = str.charCodeAt(i);
						hexValue = Number(x).toString(16);
						x = str.charCodeAt(i+1);
						hexValue = hexValue + Number(x).toString(16);
						x = parseInt(hexValue, 16);
					}else{
						// If number of characters is odd, last 2 digits will be 00.
						x = str.charCodeAt(i);
						hexValue = "00" + Number(x).toString(16);
						x = parseInt(hexValue, 16);
					}
					
					 checksum += x;
					 hexValue = Number(checksum).toString(16);
					if (hexValue.length > 4)
					{
						// If a carry is generated, then we wrap the carry
						carry = parseInt(('' + hexValue[0]), 16);
						// Get the value of the carry bit
						hexValue = hexValue.substring(1, 5);
						// Remove it from the string
						checksum = parseInt(hexValue, 16);
						// Convert it into an int
						checksum += carry;
						// Add it to the checksum
					}
					checksum = parseInt("FFFF", 16) - checksum;
					return checksum;//(checksum.toString(16));
				}
				if(config.method == "GET"){
					
					if(config.url.includes("?ts") || config.url.includes("&ts")){
						
						var url = config.url;
						if(url.charAt(0) != '/'){
							url = "/"+url;
						}
						//url = /a/b/c?ts=m&orgId=NPCI&loginUser=A
						var urlArray = url.split("?");
						var pathParam;
						if(urlArray.length==1){
							url = urlArray[0]; // /a/b/c
							pathParam = null;
						}else{
							url = urlArray[0];// /a/b/c
							pathParam = urlArray[1];  // ts=m&orgId=NPCI&loginUser=A
						}
						
						var checkSumOfPathParam = 0;
						
						if(pathParam != null){
							var splittedPathParam = pathParam.split("&");
							splittedPathParam.forEach(function(entry) {
								if(!entry.includes("ts"))
									checkSumOfPathParam =  checkSumOfPathParam + parseInt(generateChecksum(entry));
							});
						}
						
						
						if(typeof config.params != 'undefined'){
							var checkSumOfOptionalPathParam = 0;
							var myObj = config.params;
							for (var key in myObj) {
                                  if(typeof myObj[key] == 'undefined' || myObj[key] == null ){
                                         continue;
                                  }
                                  if(typeof myObj[key] != 'undefined' && myObj[key] != null ){
                                	  checkSumOfOptionalPathParam =  checkSumOfOptionalPathParam + parseInt(generateChecksum(key+'='+myObj[key]));  
                                	  //url += '?'+key+'='+myObj[key];
                                  }
                                 
							}
							//if(checkSumOfPathParam==0)
							checkSumOfPathParam = checkSumOfPathParam+ checkSumOfOptionalPathParam;
						}
						
						var urlCheckSum = generateChecksum(url);
						var finalCheckSum = parseInt(urlCheckSum) + parseInt(checkSumOfPathParam);
						config.headers.checksum=CryptoJS.AES.encrypt(finalCheckSum.toString(), "Secret Passphrase");
					}
				}
				if(typeof config.data != 'undefined'){
					var url = config.url;
					if(url.charAt(0) != '/'){
						url = "/"+url;
					}
					//url = /a/b/c?ts=m&orgId=NPCI&loginUser=A
					var urlArray = url.split("?");
					var pathParam;
					if(urlArray.length==1){
						url = urlArray[0]; // /a/b/c
						pathParam = null;
					}else{
						url = urlArray[0];// /a/b/c
						pathParam = urlArray[1];  // ts=m&orgId=NPCI&loginUser=A
					}
					
					var checkSumOfPathParam = 0;
					
					if(pathParam != null){
						var splittedPathParam = pathParam.split("&");
						splittedPathParam.forEach(function(entry) {
							if(!entry.includes("ts"))
								checkSumOfPathParam =  checkSumOfPathParam + parseInt(generateChecksum(entry));
						});
					}
					
					
					if(typeof config.params != 'undefined'){
						var checkSumOfOptionalPathParam = 0;
						var myObj = config.params;
						for (var key in myObj) {
                              if(typeof myObj[key] == 'undefined' || myObj[key] == null ){
                                     continue;
                              }
                              if(typeof myObj[key] != 'undefined' && myObj[key] != null ){
                            	  checkSumOfOptionalPathParam =  checkSumOfOptionalPathParam + parseInt(generateChecksum(key+'='+myObj[key]));  
                            	  //url += '?'+key+'='+myObj[key];
                              }
                             
						}
						//if(checkSumOfPathParam==0)
						checkSumOfPathParam = checkSumOfPathParam+ checkSumOfOptionalPathParam;
					}
					
					
					/*function isJSON(text){
					    if (typeof text!=="string"){
					        return false;
					    }
					    try{
					        JSON.parse(text);
					        return true;
					    }
					    catch (error){
					        return false;
					    }
					}
					
					console.log('isJSON - ',isJSON(config.data))*/
					
					var myJSON
					if(typeof config.data === "string"){
						myJSON = config.data;
					} else if("[object FormData]" == config.data.toString()){
						myJSON = "";
					}
					else{
						
						/*if(isJSON(config.data)){
							myJSON = config.data;
						}else{
							myJSON = JSON.stringify(config.data);
						}*/
						myJSON = JSON.stringify(config.data);
					}
					
					
					var urlPlusPayloadCheckSum = generateChecksum(url+myJSON);
					var finalCheckSum = parseInt(urlPlusPayloadCheckSum) + parseInt(checkSumOfPathParam);
					config.headers.checksum=CryptoJS.AES.encrypt(finalCheckSum.toString(), "Secret Passphrase");
					
				}
				
				 counter += 1;
				 $timeout(
				          function () {
				            if (counter !== 0) {
				            	$rootScope.spinner = true;
				            }
				          },
				          800);
				
                return config || $q.when(config);
                
            },
            requestError: function(request){
            	counter -= 1;
                if (counter === 0) {
                	$rootScope.spinner = false;
                }
            	return $q.reject(request);
            },
            response: function (response) {
            	    counter -= 1; 
            	    if (counter === 0) {
            	    	$rootScope.spinner = false;
            	        }
            		
            		return response || $q.when(response);
              
            },
			responseError : function(error) {
				counter -= 1;
		        if (counter === 0) {
		        	$rootScope.spinner = false;
		        }
				$rootScope.preload = true;
				
				toastr = $injector.get('toastr');
				if(error.status <= 0) {
					toastr.error('Error faced during some activity. Please try after sometime.', Msg.oops);
                    return $q.reject(error);
                }else{
                	
                	if(error.data.message){
                	toastr.error(error.data.message.replace(/\.(?=[A-Za-z ])/g,'<br/>'), Msg.oops);
                	}else{
                		toastr.error('Error faced during some activity. Please try after sometime.', Msg.oops);
                	}
                	if(error.status == 417){
                		localStorage.clear();
                		$state.go('signOut');
                	}
                }
				return $q.reject(error);
			}
		};
	}])
	.config(['$httpProvider', function ($httpProvider) {
		$httpProvider.defaults.headers.common = { 
				'content-type': 'application/json'
		};
		
		$httpProvider.interceptors.push('RequestsErrorHandler');
	}])
	//Dev Back Button Handle
	.run(function($rootScope, $location,$state,toastr, Msg){
   
   $rootScope.$on('$locationChangeSuccess', function() {
        $rootScope.actualLocation = $location.path();
    });        

   $rootScope.$watch(function () {return $location.path()}, function (newLocation, oldLocation) {
	   
        if($rootScope.actualLocation === newLocation) {
        	if(oldLocation != "/index.html"){
        		//toastr.error('You have pressed back111/forward/reload button. It is not allowed', Msg.oops);
        	}        	
	    	$state.go('signIn');
	  }
    });
})
	.run(function($transitions, $window, RolePermissionMatrix, $state, toastr, Msg, Session) {
		$transitions.onStart({}, function(transition){
		    var toState = transition.to();
		    var fromState = transition.from();
		    if(toState.id != undefined){
		    	if(!RolePermissionMatrix.isPermissionGranted(toState.id)){
		    		$state.go('dashboard.forbidden');
		    	}
		    }
		    if (!String.prototype.startsWith) {
		    	  String.prototype.startsWith = function(searchString, position) {
		    	    position = position || 0;
		    	    return this.indexOf(searchString, position) === position;
		    	  };
		    }
		    //Back button handling
		    if(toState.name.startsWith("dashboard") && fromState.name.trim().valueOf() == "signIn" && !Session.getToken()){
		    	toastr.error('You have pressed back/forward button. It is not allowed', Msg.oops);
		    	$state.go('signIn');
		    } else if(toState.name.startsWith("dashboard") && fromState.name.trim().valueOf() == "signOut" && !Session.getToken()){
		    	toastr.error('You have pressed back/forward button. It is not allowed', Msg.oops);
		    	$state.go('signIn');
		    } else if(toState.name.trim().valueOf() == "signIn" && fromState.name.startsWith("dashboard")){
		    	toastr.error('You have pressed back/forward button. It is not allowed', Msg.oops);
		    	Session.clear();
		    	$state.go('signIn');
		    }
		}),
	    $transitions.onSuccess({}, function(transition){
	        var title = transition.to().title;
	        $window.document.title = title;
	    })
	})
	.config(['momentPickerProvider', function (momentPickerProvider) {
        momentPickerProvider.options({
            /* Picker properties */
            locale:        'en',
            format:        'L LTS',
            minView:       'decade',
            maxView:       'minute',
            startView:     'year',
            autoclose:     true,
            today:         false,
            keyboard:      false,
            
            /* Extra: Views properties */
            leftArrow:     '&larr;',
            rightArrow:    '&rarr;',
            yearsFormat:   'YYYY',
            monthsFormat:  'MMM',
            daysFormat:    'D',
            hoursFormat:   'HH:[00]',
            minutesFormat: moment.localeData().longDateFormat('LT').replace(/[aA]/, ''),
            secondsFormat: 'ss',
            minutesStep:   5,
            secondsStep:   1
        });
    }]);
