'use strict';

angular.module('efrm.dashboard')
.controller('hotlistController',  ['$scope', '$state','statusService','UserService','$location','SearchCaseService','casesManagement','$ngConfirm','toastr','Msg','commonDataService', function($scope, $state,statusService,UserService,$location,SearchCaseService,casesManagement,$ngConfirm,toastr,Msg,commonDataService) {

		
    var orgId = commonDataService.getLocalStorage().orgId;
    $scope.loggedInOrgId = orgId;
    $scope.userId = commonDataService.getSessionStorage().userId;
    $scope.email = commonDataService.getLocalStorage().userEmail;	
    $scope.desableme = true;
    $scope.showDatatable = false;
    $scope.fromDateSort = true;
    $scope.toDateSort = true;
    $scope.showDatatableForCustom = false;
    $scope.customhotlistdata = [];
    $scope.isNamedList = false;
    $scope.namedHotList = [];
    $scope.showNamedList = false;
    $scope.customErrorMessage = false;
    var myJson = {}
	var hotlistDTOList = []
    $scope.model = {}
    $scope.model.allItemsSelected = false;
    $scope.selectedOrgid = {}
    
    if(commonDataService.getLocalStorage().p2Visibility == 1){
    	$scope.p2Visibility = true
    }
    if(commonDataService.getLocalStorage().p2Visibility == 0){
    	$scope.p2Visibility = false;
    }
   
    
    $scope.getHotListEntity = function(selectedChannel){
    	if(selectedChannel == "" || selectedChannel == undefined){
    		$scope.desableme = true;
    	}else{
    		$scope.showNamedList = false;
    		$scope.desableme = false;
    		 casesManagement.header().hotListEntity(
    	  	 		   {
    	  	 			channel : selectedChannel
    	  		 		},
    	  		 		function(response) 
    	  		 		   {
    	  		 			$scope.hotlistEntityList = response.response.data;
    	  		 			
    	  			       },
    	  			 	function(err) 
    	  			 		{
    	  			 	    }
    	  	               );
    		
    	}
    }
    
    
    $scope.onHotListSubmit = function(){
    $scope.finalSerachType = $scope.selectedActionType;
    $scope.model.allItemsSelected = false;
    $scope.chkactionType = 	$scope.selectedActionType
    	if($scope.selectedHotlistType != "others"){
    		 //$scope.showDatatableForCustom = false;
    		 $scope.hotlistdata = [];
    		 $scope.model.entities = [];
    		 $scope.customhotlistdata = [];
    	 casesManagement.header().hotlists(
  	 		   {
  	 			organisationID : $scope.selectedOrgid.selected,
  	 			channel : $scope.selectedChannel,
  	 			hotlistType:$scope.selectedHotlistType,
  	 			actionType:$scope.selectedActionType,
  	 			hotListEntity:$scope.selectedHotListEntity,
  	 			isPlainText:$scope.p2Visibility,
  		 		},
  		 		function(response) 
  		 		   {
  	               
  		 			$scope.hotlistdata = response.response.data;
  		 			$scope.showDatatable = true;
  		 			//$scope.showDatatableForCustom = false;
  		 			$scope.model.entities = $scope.hotlistdata;
  		 		   
  			       },
  			 	function(err) 
  			 		{
  			    	 //$scope.showDatatableForCustom = false;
  			    	$scope.hotlistdata = []
  			 	    }
  	               );
    	}else{
    		/*$scope.customhotlistdata = [];
    		$scope.hotlistdata = [];
    		$scope.showDatatable = false;
    		if($scope.selectedActionType == "DEACTIVATED"){
    			casesManagement.header().getCustomHotList(
     	  	 		   {
     	  	 			organisationID : $scope.selectedOrgid,
     	  	 			channel : $scope.selectedChannel,
     	  	 			actionType:"DEACTIVE",
     	  	 			hotListEntity:$scope.selectedHotListEntity,
     	  	 			 },
     	  		 		function(response) 
     	  		 		   {
     	  	 				// $scope.showDatatableForCustom = true;
     	  	 				$scope.customhotlistdata = response.response;
     	  		 			$scope.showDatatable = false;
     	  			       },
     	  			 	function(err) 
     	  			 		{
     	  			    	 $scope.customhotlistdata = []
     	  			 	    }
     	  	               );
    			
    		}//else{
    		casesManagement.header().getCustomHotList(
    	  	 		   {
    	  	 			organisationID : $scope.selectedOrgid,
    	  	 			channel : $scope.selectedChannel,
    	  	 			actionType:"ACTIVE",
    	  	 			hotListEntity:$scope.selectedHotListEntity,
    	  	 			 },
    	  		 		function(response) 
    	  		 		   {
    	  	 				// $scope.showDatatableForCustom = true;
    	  	 				$scope.customhotlistdata = response.response;
    	  		 			$scope.showDatatable = false;
    	  			       },
    	  			 	function(err) 
    	  			 		{
    	  			    	 $scope.customhotlistdata = []
    	  			 	    }
    	  	               );
    		//}
*/    	
    		//$scope.selectedHotlistType = $scope.hotlistName;
    		 $scope.hotlistdata = [];
    		 $scope.model.entities = [];
    		 $scope.customhotlistdata = [];
    	 casesManagement.header().hotlists(
  	 		   {
  	 			organisationID : $scope.selectedOrgid.selected,
  	 			channel : $scope.selectedChannel,
  	 			hotlistType:$scope.hotlistName,
  	 			actionType:$scope.selectedActionType,
  	 			hotListEntity:$scope.selectedHotListEntity,
  	 			isPlainText:$scope.p2Visibility,
  		 		},
  		 		function(response) 
  		 		   {
  	               
  		 			$scope.hotlistdata = response.response.data;
  		 			$scope.model.entities = $scope.hotlistdata;
  		 			$scope.showDatatable = true;
  		 			//$scope.showDatatableForCustom = false;
  			       },
  			 	function(err) 
  			 		{
  			    	 //$scope.showDatatableForCustom = false;
  			    	$scope.hotlistdata = []
  			 	    }
  	               );
    	}
    	
    }
    
    $scope.sort = function(keyname){
    	$scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
        
        if(keyname == 'fromDate'){
        	 $scope.fromDateSort = !$scope.fromDateSort;
         }
        if(keyname == 'toDate'){
       	 $scope.toDateSort = !$scope.toDateSort;
        }
       
    }
    
   
    
    function formatDate(date) {
    	if(date != null ){
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [day, month, year].join('-');
    	}else{
    		return date;
    	}
    }
    
    $scope.queueModel= function(row,type,title){
       myJson = {}
       hotlistDTOList = []
 	   $scope.hotlistDto = {};
 	   $scope.userInformationDTO = {};
 	   $scope.hotlistDto.id = row.id;
 	   $scope.hotlistDto.hotlistTypeCd = row.hotlistTypeCd;
 	   $scope.hotlistDto.hotlistValue = row.hotlistValue;
 	   $scope.hotlistDto.orgId = row.orgId;
 	   $scope.hotlistDto.fromDate = formatDate(row.fromDate);
 	   $scope.hotlistDto.toDate = formatDate(row.toDate);
 	   $scope.hotlistDto.sourceChannel = row.sourceChannel;
 	   $scope.hotlistDto.code = row.code;
 	   $scope.userInformationDTO.orgId = orgId;
 	   $scope.userInformationDTO.userId = $scope.userId;
 	   if(row.userInformationDTO.actionType != "PENDING_DEACTIVATION"){
 		   $scope.userInformationDTO.actionType = type;
 	   }
 	   //$scope.hotlistDto.userInformationDTO = $scope.userInformationDTO;
 	   if(title == "Active"){
 	   	$scope.modalTitle = 'Approve';
 	    $scope.modelContent = 'Do You Want To Approve ?';
	 	   if(row.userInformationDTO.actionType == "PENDING_DEACTIVATION"){
	 		   $scope.userInformationDTO.actionType = "DEACTIVATED";
	 	   }
 	   }
 	   
 	   if(title == "Reject"){
 		$scope.modalTitle = 'Reject';
 		$scope.modelContent = 'Do You Want To Reject ?';
 		 if(row.userInformationDTO.actionType == "PENDING_DEACTIVATION"){
	 		   $scope.userInformationDTO.actionType = "ACTIVE";
	 	   }
 		}
 	   
 	  if(title == "Deactive"){
 	 		$scope.modalTitle = 'Deactive';
 	 		$scope.modelContent = 'Do You Want To Deactive ?';
 	 		 $scope.userInformationDTO.actionType = "PENDING_DEACTIVATION";
 	 		}
 	   $ngConfirm({
 			title: $scope.modalTitle,
 			theme: 'Material',
 			//icon: 'fa fa-unlock',
 			content: $scope.modelContent,
 			scope: $scope,
 			buttons: {
 				Ok: {
 					text: 'Confirm',
 					btnClass: 'btn-red',
 					action: function(scope, button){   
 						hotlistDTOList.push($scope.hotlistDto);
 						myJson.userInformationDTO = $scope.userInformationDTO;
 						myJson.hotlistDTOList = hotlistDTOList;
 						casesManagement.header().apprveRejectHotlist({fromDate:null,toDate:null},myJson, function(data) {
 							toastr.success("Changes Made Successful", Msg.hurrah);
 							$scope.onHotListSubmit();
 					       },function(err){
 					    	  //toastr.error(err.msg,Msg.hurrah);
 					    	  //toastr.clear();
 					    	   //toastr.success("Changes Made UnSuccessful", Msg.hurrah);
 					       });
 					}
 				},
 				Cancel: {
 					text: 'Cancel'
 				}
 			}
 		});
    }
    
    $scope.customHotlistModel= function(row,type,title){
	  	  
  	   var hotlistDto = {};
  	  
  	   hotlistDto.id = row.id;
  	   hotlistDto.hotlistName = row.hotlistName;
  	   hotlistDto.orgId = row.orgId;
  	   hotlistDto.sourceChannel = row.sourceChannel;
  	   hotlistDto.hotlistTypeCd = row.hotlistTypeCd;
  	   hotlistDto.description = row.description;
  	   hotlistDto.creationTS = row.creationTS;
  	   hotlistDto.createdByUserId = row.createdByUserId;
  	   hotlistDto.createdByOrgId = row.createdByOrgId;
	   hotlistDto.updatedByUserId = $scope.email;
	   hotlistDto.updatedByOrgId = orgId;
	  
  	   
  	   if(title == "Active"){
  		hotlistDto.status = "ACTIVE";
  		hotlistDto.makerChecker = 1;
  	   	$scope.modalTitle = 'Approve';
  	    $scope.modelContent = 'Do You Want To Approve ?';
  	   }
  	   
  	   if(title == "Reject"){
  		hotlistDto.status = "REJECT";
  		hotlistDto.makerChecker = 3;
  		$scope.modalTitle = 'Reject';
  		$scope.modelContent = 'Do You Want To Reject ?';
  		}
  	   
  	  if(title == "Deactive"){
  		  	hotlistDto.status = "DEACTIVE"
  	 		$scope.modalTitle = 'Deactive';
  	 		$scope.modelContent = 'Do You Want To Deactive ?';
  	 		}
  	   $ngConfirm({
  			title: $scope.modalTitle,
  			theme: 'Material',
  			//icon: 'fa fa-unlock',
  			content: $scope.modelContent,
  			scope: $scope,
  			buttons: {
  				Ok: {
  					text: 'Confirm',
  					btnClass: 'btn-red',
  					action: function(scope, button){                    	
  						if(title == "Deactive"){
  							casesManagement.header().customHotListEdit(hotlistDto, function(data) {
  	  							toastr.success("Selected value Marked For Deactivation", Msg.hurrah);
  	  							$scope.selectedHotlistType = "others"
  	  							//$scope.onHotListSubmit();
  	  						$scope.submitApprovependingNamedList();
  	  					       },function(err){
  	  					    	//toastr.error(err.msg,Msg.hurrah);
  	  					    	//toastr.clear();
  	  					       });
  							
  						}else{
  						casesManagement.header().customHotListApproveReject(hotlistDto, function(data) {
  							toastr.success("Operation Successful", Msg.hurrah);
  							$scope.selectedHotlistType = "others"
  							//$scope.onHotListSubmit();
  								$scope.submitApprovependingNamedList();
  					       },function(err){
  					    	 //toastr.error(err.msg,Msg.hurrah);
  					    	 //toastr.clear();
  					       });
  						}
  					}
  				},
  				Cancel: {
  					text: 'Cancel'
  				}
  			}
  		});
     }
    
   
    
    $scope.hotlistTypeList = [
		{ name:"Hot List",val:"H"},
    	{ name:"White List",val:"W"},
    	{ name:"Common Point of Purchase",val:"CPP"},
    	{ name:"High Net-Worth Individual",val:"HNI"},
    	{ name:"Terrorist Funding",val:"TF"},
    	{ name:"Conditional hotlist",val:"COND"},
    	{ name:"Misused List",val:"MISU"}
    ];
    
    $scope.statusList = [
		{ name:"ACTIVE",val:"ACTIVE"},
    	{ name:"PENDING ACTIVATION",val:"PENDING_REVIEW"},
    	{ name:"DEACTIVATED",val:"DEACTIVATED"},
    	{ name:"PENDING DEACTIVATION",val:"PENDING_DEACTIVATION"}
    ];
    
    $scope.statusList1 = [
		{ name:"ACTIVE",val:"ACTIVE"},
    	{ name:"PENDING ACTIVATION",val:"PENDING_REVIEW"}
    ];
    
    //Get Organization//
    $scope.organisationName  = function(){
    	casesManagement.header().organisations( 
				{ 
					
					organisationID : orgId
				},
				function(response) {
	                         $scope.orgarnisations = response.response;

					},
				function(err) {
				});
    }
    
  //Get Channel//
    $scope.channelName  = function(){
		    casesManagement.header().channel( {},
					function(response) {
		                         //$scope.channel_code = response.response;
		    	var array = response.response;
                for(var i = array.length - 1; i >= 0; i--) {
                    if(array[i].channelCode === 'AEPS' || array[i].channelCode === 'NETC') {
                       array.splice(i, 1);
                    }
                }
                $scope.channel_code = array;
						},
					function(err) {
					});
    }
    
    $scope.displayCode = function(code){
    	if(code == "H"){
    		return "Hot List"
    	}if(code == "W"){
    		return "White List"
    	}if(code == "CPP"){
    		return "Common Ponit of Purchase"
    	}if(code == "HNI"){
    		return "High Net-Worth Individual"
    	}if(code == "TF"){
    		return "Terrorist Funding"
    	}
    }
       
    $scope.isSessionValid = function(){
		UserService.header({}).session({}, function(data){
		}, function(err){});
	}
    
    $scope.init = function(){
    	$scope.organisationName();
    	$scope.channelName();
    }  	   
    $scope.dateFormat = function(date){
    	if(date == null){
    		return 'NA';
    	}else{
    		return moment(date).format('DD-MM-YY')
    	}
    }
    $scope.addToList = function(){
    	$state.go('dashboard.hotlistinsert');
    }
    
    $scope.createNamedList = function(){
    	$state.go('dashboard.createNamedList');
    }
    
    
    $scope.approvependingNamedList = function(){
    	$scope.isNamedList = true;
    	$scope.selectedActionType = null;
    	$scope.selectedOrgid.selected = undefined;
    	$scope.selectedChannel = null;
    	$scope.selectedHotListEntity = null;
    	$scope.showDatatable = false;
    	$scope.showDatatableForCustom = false;
    }
    
    $scope.backToMangeList = function(){
    	$scope.isNamedList = false;
    	$scope.showDatatableForCustom = false;
    	$scope.selectedActionType = null;
    	$scope.selectedOrgid.selected = undefined;
    	$scope.selectedChannel = null;
    	$scope.selectedHotListEntity = null;
    	$scope.showDatatable = false;
    	$scope.showDatatableForCustom = false;
    }
    
    $scope.submitApprovependingNamedList = function(){
    	$scope.chkactionType = 	$scope.selectedActionType
    	$scope.showDatatableForCustom = true;
		$scope.customhotlistdata = [];
		$scope.hotlistdata = [];
		$scope.showDatatable = false;
		if($scope.selectedActionType == "DEACTIVATED"){
			casesManagement.header().getCustomHotList(
 	  	 		   {
 	  	 			organisationID : $scope.selectedOrgid.selected,
 	  	 			channel : $scope.selectedChannel,
 	  	 			actionType:"DEACTIVE",
 	  	 			hotListEntity:$scope.selectedHotListEntity,
 	  	 			 },
 	  		 		function(response) 
 	  		 		   {
 	  	 				// $scope.showDatatableForCustom = true;
 	  	 				$scope.customhotlistdata = response.response;
 	  		 			$scope.showDatatable = false;
 	  			       },
 	  			 	function(err) 
 	  			 		{
 	  			    	 $scope.customhotlistdata = []
 	  			 	    }
 	  	               );
			
		}else{
		casesManagement.header().getCustomHotList(
	  	 		   {
	  	 			organisationID : $scope.selectedOrgid.selected,
	  	 			channel : $scope.selectedChannel,
	  	 			actionType:$scope.selectedActionType,
	  	 			hotListEntity:$scope.selectedHotListEntity,
	  	 			 },
	  		 		function(response) 
	  		 		   {
	  	 				// $scope.showDatatableForCustom = true;
	  	 				$scope.customhotlistdata = response.response;
	  		 			$scope.showDatatable = false;
	  			       },
	  			 	function(err) 
	  			 		{
	  			    	 toastr.clear();
	  			    	 $scope.customhotlistdata = []
	  			 	    }
	  	               );
		}
	
    	
    }
    
    $scope.changeActionType = function(selectedActionType){
    	$scope.selectedActionType = selectedActionType;
    	$scope.selectedHotlistType = null;
    	$scope.showNamedList = false;
    	$scope.hotlistName = null;
    }
    
    $scope.changeListType = function(selectedHotlistType){
    	$scope.selectedHotlistType = selectedHotlistType;
    	$scope.showNamedList = false;
    	$scope.hotlistName = null;
    
    	//$scope.selectedHotlistType = null;
    	
    	if(selectedHotlistType == "others"){
	    	casesManagement.header().getCustomHotList(
		  	 		   {
		  	 			organisationID : $scope.selectedOrgid.selected,
		  	 			channel : $scope.selectedChannel,
		  	 			actionType:"ACTIVE",
		  	 			hotListEntity:$scope.selectedHotListEntity,
		  	 			 },
		  		 		function(response) 
		  		 		   {
		  	 				$scope.showNamedList = true;
		  	 				// $scope.showDatatableForCustom = true;
		  	 				$scope.namedHotList = response.response;
		  		 			//$scope.showDatatable = false;
		  			       },
		  			 	function(err) 
		  			 		{
		  			    	 $scope.showNamedList = false;
		  			    	 $scope.namedHotList = []
		  			 	    }
		  	               );
    	}else{
    		 $scope.showNamedList = false;
    	}

    }
    
    $scope.changeNamedList = function(hotlistName){
    	
    	$scope.hotlistName = hotlistName;
    }
    
    $scope.changeOrganisation = function(selectedOrg){
    	$scope.selectedOrgid.selected = selectedOrg;
    	
    	$scope.selectedHotlistType = null;
    	$scope.showNamedList = false;
    	$scope.hotlistName = null;
    }
    
    $scope.changeEntity = function(selectedHotListEntity){
    	$scope.selectedHotListEntity = selectedHotListEntity;
    	$scope.showNamedList = false;
    	$scope.selectedHotlistType = null;
    	$scope.hotlistName = null;
    }
    
    //implementing checkbox//
    
    
 // This executes when entity in table is checked
    $scope.selectEntity = function () {
    	
        // If any entity is not checked, then uncheck the "allItemsSelected" checkbox
        for (var i = 0; i < $scope.model.entities.length; i++) {
            if (!$scope.model.entities[i].isChecked) {
                $scope.model.allItemsSelected = false;
                               
                return;
            }
        }

        //If not the check the "allItemsSelected" checkbox
        $scope.model.allItemsSelected = true;
       
    }
    
    $scope.sync = function(bool, item){
    	
    	 if(bool){
 	    	
   	      // add item
   	      hotlistDTOList.push(item);
    	 }else{
    		 for(var i=0 ; i< hotlistDTOList.length; i++){
 	    		if(hotlistDTOList[i].id == item.id){
 	    			hotlistDTOList.splice(i,1);
 	    		}
 	    	}
    	 }
    	 if(hotlistDTOList.length == 0){
    		 
    		 $scope.customErrorMessage = false;
    	 }else{
    		 
    		 $scope.customErrorMessage = true;
    	 }
    }
    
    $scope.selectAll = function () {
    	
        // Loop through all the entities and set their isChecked property
    	
        for (var i = 0; i < $scope.model.entities.length; i++) {
        	$scope.model.entities[i].isChecked = $scope.model.allItemsSelected;
        	
        	if($scope.userId != $scope.model.entities[i].userInformationDTO.userIdOrig && $scope.model.entities[i].userInformationDTO.actionType != "DEACTIVATED"){
        		hotlistDTOList.push($scope.model.entities[i]);
        		$scope.customErrorMessage = true;
        	}
        }
    	if($scope.model.allItemsSelected == false){
    		$scope.customErrorMessage = false;
    		hotlistDTOList = [];
    	}
    };
    
    
    $scope.approveSubmit = function(type,title){
    	if(hotlistDTOList.length != 0){
    		$scope.multiapprove(type,title);
    	}else{
    		$scope.customErrorMessage = true;
    	}
    	
    }
    
    $scope.multiapprove = function(type,title){
    	var myJson = {}
    	var hotlistjson = {}
    	var finalList = []
    	$scope.userInformationDTO = {}
    	$scope.userInformationDTO.orgId = commonDataService.getLocalStorage().orgId;
  	   $scope.userInformationDTO.userId = $scope.userId;
  	   if($scope.finalSerachType != "PENDING_DEACTIVATION"){
  		   $scope.userInformationDTO.actionType = type;
  	   }
  	   if(title == "Active"){
  	   	$scope.modalTitle = 'Approve';
  	    $scope.modelContent = 'Do You Want To Approve ?';
	  	  if($scope.finalSerachType == "PENDING_DEACTIVATION"){
	 		   $scope.userInformationDTO.actionType = "DEACTIVATED";
	 	   }
  	   }
  	   
  	   if(title == "Reject"){
  		$scope.modalTitle = 'Reject';
  		$scope.modelContent = 'Do You Want To Reject ?';
  		if($scope.finalSerachType == "PENDING_DEACTIVATION"){
	 		   $scope.userInformationDTO.actionType = "ACTIVE";
	 	   }
  		}
  	   
  	  if(title == "Deactive"){
  	 		$scope.modalTitle = 'Deactive';
  	 		$scope.modelContent = 'Do You Want To Deactive ?';
  	 		$scope.userInformationDTO.actionType = "PENDING_DEACTIVATION";
  	 		}
  	   $ngConfirm({
  			title: $scope.modalTitle,
  			theme: 'Material',
  			//icon: 'fa fa-unlock',
  			content: $scope.modelContent,
  			scope: $scope,
  			buttons: {
  				Ok: {
  					text: 'Confirm',
  					btnClass: 'btn-red',
  					action: function(scope, button){   
  						//hotlistDTOList.push($scope.hotlistDto);
  						myJson.userInformationDTO = $scope.userInformationDTO;
  						 for (var i = 0; i < hotlistDTOList.length; i++) {
  						    hotlistjson = {}
  							hotlistjson.id = hotlistDTOList[i].id;
  							hotlistjson.hotlistTypeCd = hotlistDTOList[i].hotlistTypeCd;
  							hotlistjson.hotlistValue = hotlistDTOList[i].hotlistValue;
  							hotlistjson.orgId = hotlistDTOList[i].orgId;
  							hotlistjson.fromDate = formatDate(hotlistDTOList[i].fromDate);
  							hotlistjson.toDate = formatDate(hotlistDTOList[i].toDate);
  							hotlistjson.sourceChannel = hotlistDTOList[i].sourceChannel;
  							hotlistjson.code = hotlistDTOList[i].code;
  							finalList.push(hotlistjson)
  						 }
  						myJson.hotlistDTOList = finalList;
  					
  						casesManagement.header().apprveRejectHotlist({fromDate:null,toDate:null},myJson, function(data) {
  							if(title == "Active"){
  							toastr.success("Request Approved Successfully", Msg.hurrah);
  							}
  							if(title == "Reject"){
  	  							toastr.success("Request Rejected Successfully", Msg.hurrah);
  	  						}
  							if(title == "Deactive"){
  	  							toastr.success("Request Deactived Successfully", Msg.hurrah);
  	  						}
  							$scope.onHotListSubmit();
  							$scope.customErrorMessage = false;
  							hotlistDTOList = [];
  					       },function(err){
  					       hotlistDTOList = [];
  					     //toastr.error(err.msg,Msg.hurrah);
  					    	 // toastr.clear();
  					    	   //toastr.success("Changes Made UnSuccessful", Msg.hurrah);
  					       });
  					}
  				},
  				Cancel: {
  					text: 'Cancel'
  				}
  			}
  		});
    }
    
    $scope.Export = function () {
        $("#hotlist_table").table2excel({
        	exclude: ".noExport",
            filename: "Hotlist.xls"
        });
    }
    
    $scope.init();
 }])