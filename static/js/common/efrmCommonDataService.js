(function(){
    'use strict';
    angular.module('common')
    .factory('commonDataService',function(){
    	
    	var commonData;
    	var sessionData;
    	var encryptData;
    	var prespective;
    	var durationInfoForSimulation;
        return {
    		
    		getDurationInfoForSimulation:getDurationInfoForSimulation,
    		setDurationInfoForSimulation:setDurationInfoForSimulation,
    		
        	getSessionStorage:getSessionStorage,
        	setSessionStorage:setSessionStorage,
            
             getLocalStorage:getLocalStorage,
             setLocalStorage:setLocalStorage,
             getEnncryptData:getEnncryptData,
             getPrespective:getPrespective
        };

        
        
      //  return service;
        function setDurationInfoForSimulation(durationInfo){
        	durationInfoForSimulation = durationInfo;
        }
        
        function getDurationInfoForSimulation(){
        	return durationInfoForSimulation
        }
        
        function setLocalStorage(localstorageInfo){
        	commonData = localstorageInfo;
        }
        
        function getLocalStorage(){
        	return commonData
        }
        
        function getEnncryptData(readebaledata){
        	//encryptData = 	btoa(readebaledata);
        	encryptData = readebaledata;
        	return encryptData;
        	
        }
        
        function getPrespective(caseId){
        	//encryptData = 	btoa(readebaledata);
        	var mycaseId = caseId;
        	if(mycaseId.startsWith('I') || mycaseId.startsWith('R')){
        		prespective = "ISSUER"
        	}else if(mycaseId.startsWith('B') || mycaseId.startsWith('A')){
        		prespective = "ACQUIRER"
        	}else if(mycaseId.startsWith('M')){
        		prespective = "AML"
        	}
        	return prespective;
        	
        }
        
        function setSessionStorage(session){
        	sessionData = session;
        }
        
        function getSessionStorage(){
        	return sessionData
        }
      })
})()