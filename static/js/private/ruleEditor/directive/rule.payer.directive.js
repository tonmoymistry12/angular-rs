(function() {
    'use strict';
    angular.module('rule').
    directive('rulePayer', function() {
        return {
            restrict: 'E',
            scope:{
              
                payerfilter:'=',
                metadata: '=',
                mandatory:"="
            },
            controller:function($scope,ruleDataService, $filter,$window) {
            	$window.scrollTo(0, 0);
            	
                $scope.jurisdictionInternational=false;
                 $scope.jurisdictionDomistic=false;
                 
                 
                 var getPayerAccountData = ruleDataService.getPayerAccount()
                 if($scope.metadata.channel==='RuPayAtm,RuPayPos'){
                 	var RuPayAtm = $filter('filter')(getPayerAccountData, {
                          for: 'RuPayAtm'
                      });
                 	var RuPayPos = $filter('filter')(getPayerAccountData, {
                         for: 'RuPayPos'
                     });
                 
                 	// console.log('RuPayAtm - ', RuPayAtm)
                 	 //console.log('RuPayPos - ',  RuPayPos)
                 	 $scope.getPayerAccounts = RuPayAtm.concat(RuPayPos);
                     // console.log('RuPayAtm, RuPayPos - ',  $scope.subChannel)
                  }else{
                	  $scope.getPayerAccounts = $filter('filter')(getPayerAccountData, {
                          for: $scope.metadata.channel
                      });
                  }
                 
                 
                var getUsageAcrossEndpointsData = ruleDataService.getUsageAcrossEndpoints()
                 if($scope.metadata.channel==='RuPayAtm,RuPayPos'){
                  	var RuPayAtm = $filter('filter')(getUsageAcrossEndpointsData, {
                           for: 'RuPayAtm'
                       });
                  	var RuPayPos = $filter('filter')(getUsageAcrossEndpointsData, {
                          for: 'RuPayPos'
                      });
                  
                  	// console.log('RuPayAtm - ', RuPayAtm)
                  	 //console.log('RuPayPos - ',  RuPayPos)
                  	 $scope.getUsageAcrossEndpoints = RuPayAtm.concat(RuPayPos);
                      // console.log('RuPayAtm, RuPayPos - ',  $scope.subChannel)
                   }else{
                	   $scope.getUsageAcrossEndpoints = $filter('filter')(getUsageAcrossEndpointsData, {
                           for: $scope.metadata.channel
                       });
                   }
                 
           if($scope.payerfilter.account===undefined){
        	   if($scope.metadata.channel==='RuPayAtm' || $scope.metadata.channel==='RuPayPos' || $scope.metadata.channel==='RuPayAtm,RuPayPos'){
           			$scope.payerfilter.account="card"
				}else{
					delete $scope.payerfilter.account
				}
           }
                	
                

                
                
                 
                 $scope.resetOptAndEpnt=function(){
                	 if($scope.payerfilter.usageAcrossDistinctEndpoint.operator1.length===0){
                		 delete $scope.payerfilter.usageAcrossDistinctEndpoint
                	 }
                 }
                 
                $scope.payerJuridictionChange = function(juridiction){
                    
                    if($scope.jurisdictionInternational){
                   $scope.payerfilter.jurisdiction=juridiction
                   }else if($scope.jurisdictionDomistic){
                      $scope.payerfilter.jurisdiction=juridiction
                   }else{
                       delete $scope.payerfilter.jurisdiction
                   }    
                }
                
                $scope.withRepresentmentChange=function(){
                	
                	if($scope.payerfilter.chargebackRepresentment === undefined){
                		$scope.payerfilter.chargebackRepresentment={}
                	}
                	
                	if($scope.withRepresentment===true && $scope.payerfilter.chargebackRepresentment != undefined){
                		$scope.payerfilter.chargebackRepresentment.isWithRepresentment=true
                	}else{
                		delete $scope.payerfilter.chargebackRepresentment.isWithRepresentment
                	}
                }
                
                
                
                $scope.withOutRepresentmentChange=function(){
                	
                	if($scope.withOutRepresentment===true && $scope.payerfilter.chargebackRepresentment != undefined){
                		$scope.payerfilter.chargebackRepresentment.isWithRepresentment=false
                	}else{
                		delete $scope.payerfilter.chargebackRepresentment.isWithRepresentment
                	}
                }
                
                
                
                
                if( $scope.payerfilter.chargebackRepresentment != undefined){
                	if($scope.payerfilter.chargebackRepresentment.isWithRepresentment===true){
                		$scope.withRepresentment=true
                	}else if($scope.payerfilter.chargebackRepresentment.isWithRepresentment===false){
                		$scope.withOutRepresentment=true
                	}else{
                		$scope.withRepresentment=false
                		$scope.withRepresentment=false
                	}
                }
                
                
                $scope.categories= ruleDataService.getCategories();
                    
                    $scope.categoryChange = function(){
                       $scope.payerfilter.category=[]                    
                         angular.forEach($scope.category, function (value, key) {
                            $scope.payerfilter.category.push(value);
                        });
                    }
                    if($scope.payerfilter.jurisdiction!=undefined){
                        if($scope.payerfilter.jurisdiction==='Domestic'){
                            $scope.jurisdictionDomistic=true;
                        }else{
                            $scope.jurisdictionInternational=true;
                        }
                    }
                
                    if($scope.payerfilter.category!=undefined){
                        $scope.category= $scope.payerfilter.category;
                    }
                    $scope.payerfilterOperators= ruleDataService.getOperatorsNumeric();
                    
                  //  $scope.payerfilterOperators = $filter('filter')(ruleDataService.getOperators(), {for: 'payer' });
                    
                    
                    $scope.endpointChange=function(){
                    	delete $scope.payerfilter.usageAcrossDistinctEndpoint.operator2
                    	delete $scope.payerfilter.usageAcrossDistinctEndpoint.value2
                    }
            },
            templateUrl: 'templates/private/ruleEditor/directive/payer.html',
            link: function(scope, element, attr) {
                
            }
        }
    })
})()