'use strict';

angular
.module('efrm.dashboard')
.controller(
		'viewCaseController',
		[
		 '$scope',
		 '$window',
		 '$state',
		 '$stateParams',
		 'MyCases',
		 'SearchCaseService',
		 'statusService',
		 'RolePermissionMatrix',
		 '$ngConfirm',
		 'casesManagement',
		 'casesManagement2',
		 'toastr',
		 'Msg',
		 'Session',
		 'alertService',
		 '$location',
		 '$sce',
		 '$timeout',
		 '$compile',
		 'commonDataService',
		 '$q',
		 'archive',
		 function($scope, $window, $state, $stateParams,
				 MyCases, SearchCaseService, statusService,
				 RolePermissionMatrix, $ngConfirm,
				 casesManagement, casesManagement2, toastr, Msg, Session,
				 alertService, $location, $sce, $timeout, $compile, commonDataService, $q, archive)
				 {
			 $scope.productcd = null;
			 $scope.totalRecords = 0;
			 $scope.showBoxOne = false;
			 $scope.orgidcheck = commonDataService.getLocalStorage().orgId;
			 $scope.createAlert = {};
			 $scope.userInformationDTO = {};
			 $scope.alertDTO = {};
			 var filteredDataAll=[];
			 $scope.isPlainText = commonDataService.getLocalStorage().p2Visibility == 1 ? true : false
			 $scope.selectedFraudType = {
					 selectedType:''
			 };
			 var myVarinterval;
			 $scope.nodataMsg = "true";
			 $scope.jsonData =[];
			 //var filteredDataAll;
			 
			 $scope.changedProductCd = function(productCd){
				 $scope.productcd = productCd;
				 $scope.showProductCdMsg = false;
			 }
			 $scope.productcdlist = [    	
				                         { name:"ATM",val:"ATM"},
				                         { name:"POS",val:"POS"},
				                         { name:"ECOM",val:"ECOM"}
			                         ]

			 $scope.inCaseDetails = function()
			 {
				 
				 $scope.productcd = undefined;
				 $scope.showProductCdMsg = false;
				 
			 }	
			 
			
			 $scope.perspective=commonDataService.getLocalStorage().perspective;
			 $scope.items = [ 
				 {
				 name : "PLEASE SELECT THE ALERT TYPE",
				 val : ""
				 }, 
				 {
					 name : "ISSR",
					 val : "ISSR"
				 }, 
				 {
					 name : "ACQR",
					 val : "ACQR"
				 }, 
				 {
					 name : "NPCI",
					 val : "NPCI"
				 }, 
				 {
					 name : "REMITTER",
					 val : "REMITTER"
				 }, 
				 {
					 name : "BENEFICIARY",
					 val : "BENEFICIARY"
				 }, 
				 {
					 name : "AML",
					 val : "AML"
				 } 
			 ];

			 $scope.isChecked=false;
			 $scope.checkCounter=0;

			 $scope.stopFight = function() {
				 if (angular.isDefined($scope.myVarinterval)) {
					 clearInterval($scope.myVarinterval);
					 stop = undefined;
				 }
			 };
			 $scope.$on('$destroy', function() {
				 $scope.stopFight();
			 });	

			 $scope.currPage = function() {
				 $scope.prev_url = localStorage.getItem("prev_path");
				 localStorage.setItem("prev_path_view", "/dashboard/viewCases");
				 // change for back button//
				 if ($scope.prev_url == '/dashboard/reviewcases') {
					 $state.go('dashboard.reviewcases');
				 }
				 if ($scope.prev_url == '/dashboard/unassignedcases') {
					 $state.go('dashboard.unassignedcases');
				 }
				 if ($scope.prev_url == '/dashboard/caseInQueue') {
					 $state.go('dashboard.caseinqueue');
				 }
				 if ($scope.prev_url == '/dashboard/mycases') {
					 $state.go('dashboard.mycases');
				 }
				 if ($scope.prev_url == '/dashboard/searchCases') {
					 $state.go('dashboard.searchCases');
				 }
				 if ($scope.prev_url == '/dashboard/alertsInQueue') {
					 $state.go('dashboard.alertsInQueue');
				 }

				 // End here//
			 }
			 var path = $location.path();
			 $scope.hidemeflag = false;
			 $scope.hidemeAllFlag = false;
			 $scope.hidemeCloseCaseFlag = false;
			 var checkeLock = function(lock) {
				 if (lock == 'false') {
					 $scope.lockLable = 'Lock Case';
					 $scope.lockIcon = 'fa fa-lock'
				 } else {
					 $scope.lockLable = 'Unlock Case';
					 $scope.lockIcon = 'fa fa-unlock-alt'
				 }
			 }

			 var checkeHold = function(hold) {
				 if (hold == true) {
					 $scope.holdLable = 'Hold Case';
					 $scope.holdContent = 'Want To Hold The Case ?';
					 $scope.holdIcon = 'fa fa-hand-paper-o'
				 } else {
					 $scope.holdLable = 'Remove Hold';
					 $scope.holdContent = 'Want To Remove Hold On The Case ?';
					 $scope.holdIcon = 'fa fa-hand-rock-o'
				 }
			 }

			 $scope.alertType = "";
			 $scope.actionTypes = [ {
				 name : "ACTIVE",
				 value : "ACTIVE"
			 }, {
				 name : "MANUAL CLOSE",
				 value : "MANUAL_CLOSE"
			 }, ];
			 $scope.actionType = 'ACTIVE'
				 $scope.changedValue = function(channelCode) {
				 $scope.channelCodeMsg = false;
				 if (channelCode != null) {
					 $scope.showFraudTypeCd = true;
				 }
				 $scope.fraudTypes = [ {
					 name : "PLEASE SELECT THE FRAUD TYPE",
					 val : ""
				 }, {
					 name : "Lost",
					 val : "Lost"
				 }, {
					 name : "Stolen",
					 val : "Stolen"
				 }, {
					 name : "VISHING",
					 val : "VISHING"
				 }, {
					 name : "SIM swap",
					 val : "SIM swap"
				 }, {
					 name : "BC Fraud",
					 val : "BC Fraud"
				 }, {
					 name : "Others",
					 val : "Others"
				 } ];
				 // $scope.fraudTypeCd = "";
			 }

			 $scope.caseDetailsDTO = {};
			 $scope.alertType = '0';

			 var initialize = function() {
				 $scope.fraudnote='';
				 $scope.caseNotes = '';
				 $scope.amlnote='';
				 // $scope.selectCheckMsg=false;
				 $scope.checkCounter=0;
				 $scope.selectedFraudType={
						 selectedType:''
				 };

				 $scope.rolePermission = RolePermissionMatrix;

				 $scope.loggdUserid = commonDataService.getSessionStorage().userId;
				 $scope.response = statusService
				 .getResponseMessage();
				 $scope.authority = [];
				 var searchPerspective;
				 if(SearchCaseService.getSearchCase().caseId.startsWith('I')){
					 searchPerspective='I';
				 }else if(SearchCaseService.getSearchCase().caseId.startsWith('A')){
					 searchPerspective='A';
				 }else if(SearchCaseService.getSearchCase().caseId.startsWith('M')){
					 searchPerspective='M';
				 }else if(SearchCaseService.getSearchCase().caseId.startsWith('R')){
					 searchPerspective='R';
				 }else if(SearchCaseService.getSearchCase().caseId.startsWith('B')){
					 searchPerspective='B';
				 }

				 var config = {
						 "searchMap" : {
							 "caseId" : SearchCaseService
							 .getSearchCase().caseId,
							 "channel" : SearchCaseService
							 .getSearchCase().sourceChannel
						 },
						 "userInformationDTO" : {
							 "orgId" : SearchCaseService
							 .getSearchCase().orgId,
							 "channel" : SearchCaseService
							 .getSearchCase().sourceChannel,
							 "perspective":searchPerspective,
							 "userId" : commonDataService.getSessionStorage().userId,
							 "isPlainText" : commonDataService.getLocalStorage().p2Visibility == 1 ? true : false,
							 "fetchFromArchive" : archive.getArchive() 
						 }
				 }
				 if(config.searchMap.channel == 'AEPS'){
					 config.userInformationDTO.isPlainText = false;
				 }else{
					 config.userInformationDTO.isPlainText = commonDataService.getLocalStorage().p2Visibility == 1 ? true : false
				 }
				 $scope.channels = [];
				 casesManagement.header({}).channel(
						 function(data) {
							 $scope.channels = data.response;

						 }, function(err) {
							 $scope.channels = [];
						 });
				 searchDetails(config);
			 }

			 $scope.createFraudModal = function() {
				 $scope.createFraud = {};
				 $scope.userInformationDTO = {};
				 $scope.fraudId = "";
				 $scope.fraudnotes = "";
				 $scope.fraudTypeCd = "";
				 $scope.channelCode = "";
				 $scope.showFraudTypeCd = false;
				 $scope.channelCodeMsg = false;
				 $scope.fraudIdMsg = false;
				 $scope.fraudTypeCdMsg = false;
				 $ngConfirm({
					 title : 'Create Fraud',
					 theme : 'Material',
					 icon : 'fa fa-plus',
					 content : '<div class="form-group"><input type="text" name="fraudId" ng-change="fraudIdMsg = false" class="form-control" placeholder="Fraud Id" ng-model="fraudId"/><div class="text-danger" ng-if="fraudIdMsg"><small>This is required field</small></div></div><div class="form-group"><select class="form-control" ng-model="channelCode" ng-change="changedValue(channelCode)" name="channelCode" class="admin_input" id="channelCode"><option style="display:none" label="PLEASE SELECT THE CHANNEL" ></option><option ng-repeat="item in channels" value="{{item.channelCode}}">{{item.channelCode}}</option></select><div class="text-danger" ng-if="channelCodeMsg"><small>This is required field</small></div></div><div class="form-group" ng-if="showFraudTypeCd"><select class="form-control" ng-model="$parent.fraudTypeCd" name="fraudTypeCd" class="admin_input" id="fraudTypeCd" ng-change="fraudTypeCdMsg = false" ng-options="item.val as item.name for item in fraudTypes" required></select><div class="text-danger" ng-show="fraudTypeCdMsg"><small>This is a required field</small></div></div><div class="form-group"><textarea ng-model="fraudnotes" class="form-control" placeholder="Note"></textarea></div>',
					 scope : $scope,
					 buttons : {
						 Ok : {
							 text : 'Submit',
							 btnClass : 'btn-red',
							 action : function(scope, button) {
								 if ($scope.fraudId == ""
									 || $scope.channelCode == ""
										 || $scope.channelCode == undefined
										 || $scope.channelCode == null
										 || $scope.fraudTypeCd == ""
											 || $scope.fraudTypeCd == undefined
											 || $scope.fraudTypeCd == null) {
									 if ($scope.fraudId == "") {
										 $scope.fraudId = "";
										 $scope.fraudIdMsg = true;
									 }
									 if ($scope.fraudTypeCd == ""
										 || $scope.fraudTypeCd == undefined
										 || $scope.fraudTypeCd == null) {
										 $scope.fraudTypeCd = ""
											 $scope.fraudTypeCdMsg = true;
									 }
									 if ($scope.channelCode == ""
										 || $scope.channelCode == undefined
										 || $scope.channelCode == null) {
										 $scope.fraudTypeCd = ""
											 $scope.channelCodeMsg = true;
									 }
									 return false;

								 } else {
									 $scope.createFraud.fraudId = $scope.fraudId;
									 $scope.createFraud.channelCode = $scope.channelCode;
									 $scope.createFraud.txnId = $scope.data.data[0].txnId;
									 $scope.createFraud.caseId = $scope.data.data[0].caseId;
									 $scope.createFraud.fraudTypeCd = $scope.fraudTypeCd;
									 $scope.userInformationDTO.userId = commonDataService.getSessionStorage().userId;
									 $scope.userInformationDTO.orgId = commonDataService.getLocalStorage().orgId;
									 $scope.userInformationDTO.actionType = "ACTIVE";
									 $scope.userInformationDTO.notes = $scope.fraudnotes;
									 $scope.createFraud.userInformationDTO = $scope.userInformationDTO;
									 alertService
									 .header({})
									 .createFraud(
											 $scope.createFraud,
											 function(
													 data) {
												 initialize();
												 toastr
												 .success(
														 "Fraud Created Successfully",
														 Msg.hurrah);
											 },
											 function(
													 err) {

											 });
								 }
							 }
						 },
						 Cancel : {
							 text : 'Cancel',
							 action : function(scope, button) {
								 $scope.createFraud = {};
								 $scope.userInformationDTO = {};
								 $scope.fraudId = "";
								 $scope.fraudnotes = "";
								 $scope.fraudTypeCd = '0';
								 $scope.channelCode = "";
								 $scope.showFraudTypeCd = false;

							 }

						 }
					 },
				 });
			 }

			 $scope.updateFraudModal = function(id, fraudId,
					 channelCode, fraudTypeCd) {
				 $scope.updateFraud = {};
				 $scope.userInformationDTO = {};
				 $scope.fraudId = fraudId;
				 $scope.fraudnotes = "";
				 $scope.fraudTypeCd = fraudTypeCd;
				 $scope.channelCode = channelCode;
				 $scope.changedValue(channelCode);
				 $scope.fraudTypeCd = fraudTypeCd;
				 $scope.showFraudTypeCd = false;
				 $scope.actionType = 'ACTIVE';
				 $scope.channelCodeMsg = false;
				 $scope.fraudIdMsg = false;
				 $scope.fraudTypeCdMsg = false;
				 $ngConfirm({
					 title : 'Update Fraud',
					 theme : 'Material',
					 icon : 'fa fa-edit',
					 content : '<div class="form-group"><input type="text" name="fraudId" ng-change = "fraudIdMsg = false" class="form-control" placeholder="Fraud Id" ng-model="fraudId" disabled/><div class="text-danger" ng-if="fraudIdMsg"><small>This Is Required Field</small></div></div><div class="form-group"><select class="form-control" ng-model="actionType" name="actionType" class="admin_input" id="actionType" ng-options="item.value as item.name for item in actionTypes" required></select></div><div class="form-group"><select class="form-control" ng-model="channelCode" ng-change="changedValue(channelCode)" name="channelCode" class="admin_input" id="channelCode"><option style="display:none" label="PLEASE SELECT THE CHANNEL" ></option><option ng-repeat="item in channels" value="{{item.channelCode}}">{{item.channelCode}}</option></select><div class="text-danger" ng-if="channelCodeMsg"><small>This Is Required Field</small></div></div><div class="form-group" ><select class="form-control" ng-model="fraudTypeCd" name="fraudTypeCd" class="admin_input" id="fraudTypeCd" ng-change = "fraudTypeCdMsg = false" ng-options="item.val as item.name for item in fraudTypes" required></select><div class="text-danger" ng-show="fraudTypeCdMsg"><small>This is a required field</small></div></div><div class="form-group"><textarea ng-model="fraudnotes" class="form-control" placeholder="Note"></textarea></div>',
					 scope : $scope,
					 buttons : {
						 Ok : {
							 text : 'Submit',
							 btnClass : 'btn-red',
							 action : function(scope, button) {
								 if ($scope.fraudId == ""
									 || $scope.channelCode == ""
										 || $scope.channelCode == undefined
										 || $scope.channelCode == null
										 || $scope.fraudTypeCd == ""
											 || $scope.fraudTypeCd == undefined
											 || $scope.fraudTypeCd == null) {
									 if ($scope.fraudId == "") {
										 $scope.fraudId = "";
										 $scope.fraudIdMsg = true;
									 }
									 if ($scope.fraudTypeCd == ""
										 || $scope.fraudTypeCd == null
										 || $scope.fraudTypeCd == undefined) {
										 $scope.fraudTypeCd = ""
											 $scope.fraudTypeCdMsg = true;
									 }
									 if ($scope.channelCode == ""
										 || $scope.channelCode == null
										 || $scope.channelCode == undefined) {
										 $scope.channelCode = ""
											 $scope.channelCodeMsg = true;
									 }
									 return false;

								 } else {

									 $scope.updateFraud.id = id;
									 $scope.updateFraud.fraudId = $scope.fraudId;
									 $scope.updateFraud.channelCode = $scope.channelCode;
									 $scope.updateFraud.txnId = $scope.data.data[0].txnId;
									 $scope.updateFraud.caseId = $scope.data.data[0].caseId;
									 $scope.updateFraud.fraudTypeCd = $scope.fraudTypeCd;
									 $scope.userInformationDTO.userId = commonDataService.getSessionStorage().userId;
									 $scope.userInformationDTO.orgId = commonDataService.getLocalStorage().orgId;
									 //$scope.userInformationDTO.isPlainText = commonDataService.getLocalStorage().p2Visibility == 1 ? true : false
									 $scope.userInformationDTO.actionType = $scope.actionType;
									 $scope.userInformationDTO.notes = $scope.fraudnotes;
									 $scope.updateFraud.userInformationDTO = $scope.userInformationDTO;

									 alertService
									 .header({})
									 .createFraud(
											 $scope.updateFraud,
											 function(
													 data) {
												 initialize();
												 toastr
												 .success(
														 "Fraud Updated Successfully",
														 Msg.hurrah);
											 },
											 function(
													 err) {

											 });
								 }
							 }
						 },
						 Cancel : {
							 text : 'Cancel',
							 action : function(scope, button) {
								 $scope.updateFraud = {};
								 $scope.userInformationDTO = {};
								 $scope.fraudId = "";
								 $scope.fraudnotes = "";
								 $scope.fraudTypeCd = '0';
								 $scope.channelCode = "";
								 $scope.showFraudTypeCd = false;
								 $scope.actionType = 'ACTIVE';
							 }

						 }
					 },
				 });

			 }

			 $scope.addFraudModelNote = function(id) {

				 $scope.farudNote = "";
				 $scope.addFraudNote = {};
				 $scope.userInformationDTO = {};
				 $scope.farudNoteMsg = "";
				 $ngConfirm({
					 title : 'Add Fraud Note',
					 theme : 'Material',
					 icon : 'fa fa-plus',
					 content : '<div class="form-group"><textarea ng-model="farudNote" class="form-control" placeholder="Note"></textarea><div class="text-danger" ng-if="farudNoteMsg"><small>This is required field</small></div></div>',
					 scope : $scope,
					 buttons : {
						 Ok : {
							 text : 'Submit',
							 btnClass : 'btn-red',
							 action : function(scope, button) {
								 if ($scope.farudNote == "") {

									 $scope.farudNote = ""
										 $scope.farudNoteMsg = true;

									 return false;

								 } else {
									 $scope.addFraudNote.fraudId = id;
									 $scope.userInformationDTO.userId = commonDataService.getSessionStorage().userId;
									 $scope.userInformationDTO.orgId = commonDataService.getLocalStorage().orgId;
									 $scope.userInformationDTO.actionType = "ACTIVE";
									 $scope.userInformationDTO.notes = $scope.farudNote;
									 $scope.addFraudNote.userInformationDTO = $scope.userInformationDTO;

									 alertService
									 .header({})
									 .addFraudNote(
											 $scope.addFraudNote,
											 function(
													 data) {
												 initialize();
												 toastr
												 .success(
														 "Fraud Note Created Successfully",
														 Msg.hurrah);
											 },
											 function(
													 err) {

											 });
								 }
							 }
						 },
						 Cancel : {
							 text : 'Cancel',
							 action : function(scope, button) {
								 $scope.farudNote = "";
								 $scope.addFraudNote = {};
								 $scope.userInformationDTO = {};
							 }

						 }
					 },
				 });

			 }

			 $scope.editPriorityModal = function() {
				 $ngConfirm({
					 title : 'Change case priority',
					 theme : 'Material',
					 icon : 'fa fa-exclamation',
					 content : '<div class="form-group"><select class="form-control" name="prioritySelected" id="prioritySelected" ng-model="prioritySelected" ng-init="required=false" ng-change="required=false" required>\n'
						 + '                <option style="display:none" value="">Please select</option>\n'
						 + '                <option value="High">High</option> \n'
						 + '                <option value="Medium">Medium</option>\n'
						 + '                <option value="Low">Low</option>\n'
						 + '                </select>'
						 + '<div class="text-danger" id="prioritySelected_required_msg" ng-show="required"><small>This is a required field.</small></div></div>',
						 scope : $scope,
						 buttons : {
							 Ok : {
								 text : 'Submit',
								 btnClass : 'btn-red',
								 action : function(scope, button) {
									 if (angular
											 .isUndefined($scope.prioritySelected)) {
										 $scope.required = true;
										 return false;
									 } else {
										 var config = {};
										 config.caseId = $scope.data.data[0].caseId;
										 config.priority = $scope.prioritySelected;
										 $scope.userInformationDTO.orgId = commonDataService.getLocalStorage().orgId;
										 $scope.userInformationDTO.userId = commonDataService.getSessionStorage().userId;
										 $scope.userInformationDTO.channel = $scope.data.data[0].sourceChannel
										 config.userInformationDTO = $scope.userInformationDTO;
										 casesManagement
										 .header({})
										 .editPriority(
												 config,
												 function(
														 data) {
													 initialize();
													 toastr
													 .success(
															 "Priority Changed Successfully",
															 Msg.hurrah);
												 },
												 function(
														 err) {

												 });
									 }
								 }
							 },
							 Cancel : {
								 text : 'Cancel',
								 action : function(scope, button) {
								 }

							 }
						 },
				 });
			 }

			 $scope.editCaseTypeModal = function() {
				 $ngConfirm({
					 title : 'Change case type',
					 theme : 'Material',
					 icon : 'fa fa-pencil',
					 content : '<div class="form-group"><select class="form-control" name="caseTypeSelected" id="caseTypeSelected" ng-init="required=false" ng-model="caseTypeSelected" ng-change="required=false" required>\n'
						 + '                <option style="display:none" value="">Please select</option>\n'
						 + '                <option value="FRAUD">FRAUD</option>\n'
						 + '                <option value="NONFRAUD">NON-FRAUD</option>\n'
						 + '                </select>'
						 + '<div class="text-danger" id="caseTypeSelected_required_msg" ng-show="required"><small>This is a required field.</small></div></div>',
						 scope : $scope,
						 buttons : {
							 Ok : {
								 text : 'Submit',
								 btnClass : 'btn-red',
								 action : function(scope, button) {

									 if (angular
											 .isUndefined($scope.caseTypeSelected)) {
										 $scope.required = true;
										 return false;
									 } else {
										 var config = {};
										 config.caseId = $scope.data.data[0].caseId;
										 config.caseType = $scope.caseTypeSelected;
										 $scope.userInformationDTO.orgId = commonDataService.getLocalStorage().orgId;
										 $scope.userInformationDTO.userId = commonDataService.getSessionStorage().userId;
										 $scope.userInformationDTO.channel = $scope.data.data[0].sourceChannel
										 config.userInformationDTO = $scope.userInformationDTO;
										 casesManagement
										 .header({})
										 .editCaseType(
												 config,
												 function(
														 data) {
													 initialize();
													 toastr
													 .success(
															 "Case Type Changed Successfully",
															 Msg.hurrah);
												 },
												 function(
														 err) {

												 });
									 }
								 }
							 },
							 Cancel : {
								 text : 'Cancel',
								 action : function(scope, button) {
								 }

							 }
						 },
				 });
			 }

			 $scope.editHoldModal = function(hold) {
				 checkeHold(hold);
				 $ngConfirm({
					 title : $scope.holdLable,
					 theme : 'Material',
					 // icon : $scope.holdIcon,
					 content : '<span class = "modalfontsize">{{holdContent}}</span>',
					 scope : $scope,
					 buttons : {
						 Ok : {
							 text : 'Yes',
							 btnClass : 'btn-red',
							 action : function(scope, button) {

								 var config = {};

								 config.caseId = $scope.data.data[0].caseId;
								 config.hold = hold;
								 $scope.userInformationDTO.orgId = commonDataService.getLocalStorage().orgId;
								 $scope.userInformationDTO.userId = commonDataService.getSessionStorage().userId;
								 $scope.userInformationDTO.channel = $scope.data.data[0].sourceChannel;
								 if(hold==false){
									 $scope.userInformationDTO.notes ='Removed Hold from Case';
								 }else{
									 $scope.userInformationDTO.notes ='Case Hold';
								 }
								 config.userInformationDTO = $scope.userInformationDTO;
								 casesManagement
								 .header({})
								 .editHold(
										 config,
										 function(data) {
											 initialize();
											 toastr
											 .success(
													 "Hold Status Updated Successfully",
													 Msg.hurrah);
										 },
										 function(err) {

										 });
								 // }
							 }
						 },
						 Cancel : {
							 text : 'No',
							 action : function(scope, button) {
							 }

						 }
					 },
				 });
			 }

			 $scope.editLockModal = function(lock) {

				 checkeLock(lock);
				 $ngConfirm({
					 title : $scope.lockLable,
					 theme : 'Material',
					 icon : $scope.lockIcon,
					 content : '<div class="form-group"><select class="form-control" name="selectedLock" id="selectedLock" ng-model="selectedLock" ng-init="required=false" ng-change="required=false" required">\n'
						 + '                <option style="display:none" value="">Please select</option>\n'
						 + '                <option value="true">True</option> <!-- interpolation -->\n'
						 + '                <option value="false">False</option>\n'
						 + '                </select>'
						 + '<div class="text-danger" id="selectedHold_required_msg" ng-show="required"><small>This is a required field.</small></div></div>',
						 scope : $scope,
						 buttons : {
							 Ok : {
								 text : 'Submit',
								 btnClass : 'btn-red',
								 action : function(scope, button) {
									 if (angular
											 .isUndefined($scope.selectedLock)) {
										 $scope.required = true;
										 return false;
									 } else {
										 var config = {};
										 config.caseId = $scope.data.data[0].caseId;
										 config.locked = $scope.selectedLock;
										 $scope.userInformationDTO.orgId = commonDataService.getLocalStorage().orgId;
										 $scope.userInformationDTO.userId = commonDataService.getSessionStorage().userId;
										 $scope.userInformationDTO.channel = $scope.data.data[0].sourceChannel
										 config.userInformationDTO = $scope.userInformationDTO;
										 casesManagement
										 .header({})
										 .editLock(
												 config,
												 function(
														 data) {
													 initialize();
													 toastr
													 .success(
															 "Lock Changed Successfully",
															 Msg.hurrah);
												 },
												 function(
														 err) {

												 });
									 }
								 }
							 },
							 Cancel : {
								 text : 'Cancel',
								 action : function(scope, button) {
								 }

							 }
						 },
				 });
			 }


			 $scope.addCaseNotesModal = function() {

				 casesManagement
				 .header({})
				 .getCaseNotes( {selectedOrgId:null},
						 function(
								 data) {
					 $scope.notesSuggestions=data.response;
				 },
				 function(
						 err) {

				 });
				 $scope.selectednote=''
				 $scope.showOther=false;
				 $scope.required=false;
				 $scope.caseNotes='';
				 $scope.showSelect=false;

				 $scope.setCaseNote=function(selectednote){
					 $scope.showSelect=false;

					 $scope.selectednote=selectednote;
					 if($scope.selectednote=='Others'){
						 $scope.showOther=true;
						 $scope.caseNotes='';

					 }else{
						 $scope.requiredNote=false;
						 $scope.caseNotes=$scope.selectednote;
						 $scope.showOther=false;
						 $scope.required=false;
					 }

				 }
				 $ngConfirm({

					 title : 'Add Case Notes',
					 theme : 'Material',
					 icon : 'fa fa-plus',
					 content : '<div class="form-group">' +
					 '<select class="cases_status upperCases noBottomMargin"' +
					 'ng-model="selectednote"' +
					 'ng-change="setCaseNote(selectednote)" required>' +
					 '<option style="display:none" value="">Select a Note</option>' +
					 '<option ng-repeat="option in notesSuggestions track by $index"' +
					 'value="{{option}}">{{option}}</option>' +
					 '<option value="Others">Others</option>'+
					 '</select>'
					 + '<div class="text-danger" id="otherRequired_msg" ng-show="showSelect"><small>This is a required field.</small></div></div>'+
					 '<textarea ng-show="showOther" onchange="caseNotes.length==0?\'requiredNote=true\':\'requiredNote=false\'" class="form-control" ng-model="caseNotes" name="caseNotes" maxlength="225" placeholder="Add case notes" required >'
					 + '</textarea>'
					 + '<div class="text-danger" id="otherRequired_msg" ng-show="requiredNote"><small>This is a required field.</small></div></div>',
					 scope : $scope,
					 buttons : {
						 Ok : {
							 text : 'Submit',
							 btnClass : 'btn-red',
							 action : function(scope, button) {
								 $scope.submitted=true;
								 if($scope.selectednote=='' || angular.isUndefined($scope.selectednote)){
									 $scope.showSelect=true;
									 return false;
								 }else if (($scope.caseNotes=='' || $scope.caseNotes==null || angular.isUndefined($scope.caseNotes))&& $scope.selectednote=='Others') {
									 $scope.requiredNote = true;
									 return false;
								 } else {

									 var config = {};
									 config.caseId = $scope.data.data[0].caseId;
									 config.caseNotes = $scope.caseNotes;
									 $scope.userInformationDTO.orgId = commonDataService.getLocalStorage().orgId;
									 $scope.userInformationDTO.userId = commonDataService.getSessionStorage().userId;
									 $scope.userInformationDTO.channel = $scope.data.data[0].sourceChannel
									 $scope.userInformationDTO.notes = $scope.caseNotes
									 config.userInformationDTO = $scope.userInformationDTO;
									 casesManagement
									 .header({})
									 .addNotes(
											 config,
											 function(
													 data) {
												 initialize();
												 toastr
												 .success(
														 "Case Note Added Successfully",
														 Msg.hurrah);
											 },
											 function(
													 err) {
											 });
								 }
							 }
						 },
						 Cancel : {
							 text : 'Cancel',
							 action : function(scope, button) {
							 }

						 }
					 },
				 });
			 }

			 var searchDetails = function(config) {
				 MyCases.header().searchcase(
						 config,
						 function(response) {
							 $scope.hideAml = true;

							 if (response.status == 200) {


								 $scope.data = response.response;
								 // condition for
								 // searchTransaction
								 $scope.cardnumberFlag=false;
								 $scope.acqInidFlag=false;
								 $scope.remitterMMIDAndMobilenumberflag=false;
								 $scope.midFlag=false;
								 $scope.tidFlag=false;
								 $scope.payerifcFlag=false;
								 $scope.payeraccountFlag=false;
								 $scope.payeeifscFlag=false;
								 $scope.payeeaccountFlag=false;
								 $scope.remMMidnumber = false;
								 $scope.veichleTagFlag=false;
								 if($scope.data.data[0].caseId.startsWith("M")){
									 $scope.bankCode = 'NPCI'
								 }else{
									 $scope.bankCode = $scope.data.data[0].caseId.slice(1, 4);
								 }
								 if(($scope.data.data[0].caseId.startsWith("I")) ||($scope.data.data[0].caseId.startsWith("M")) || ($scope.data.data[0].caseId.startsWith("B")) )
								 {
									 if($scope.data.data[0].sourceChannel=='RuPayPos' || $scope.data.data[0].sourceChannel=='AEPS' || $scope.data.data[0].sourceChannel=='RuPayAtm' || $scope.data.data[0].sourceChannel=='IMPS' )
									 {

										 $scope.cardnumberFlag=true;
									 }

									 if($scope.data.data[0].sourceChannel=='UPI')
									 {

										 $scope.payeeifscFlag=true;
										 $scope.payeeaccountFlag=true;
									 }
									 if($scope.data.data[0].sourceChannel=='NETC')
									 {

										 $scope.veichleTagFlag=true;
									 }
								 }

								 if($scope.data.data[0].caseId.startsWith("A"))
								 {
									 if($scope.data.data[0].sourceChannel=='RuPayPos' || $scope.data.data[0].sourceChannel=='AEPS' || $scope.data.data[0].sourceChannel=='RuPayAtm' ){

										 $scope.acqInidFlag=true;
										 $scope.midFlag=true;
										 $scope.tidFlag=true;
									 }
									 
									 if($scope.data.data[0].sourceChannel=='NETC')
									 {

										 $scope.veichleTagFlag=true;
									 }
								 }

								 if($scope.data.data[0].caseId.startsWith("R")){
									 if($scope.data.data[0].sourceChannel=='IMPS'){
										 $scope.remMMidnumber=true;
										 $scope.remitterMMIDAndMobilenumberflag = true;
									 }
									 if($scope.data.data[0].sourceChannel=='UPI'){

										 $scope.payerifcFlag=true;
										 $scope.payeraccountFlag=true;
									 }
									 
									 if($scope.data.data[0].sourceChannel=='NETC')
									 {

										 $scope.veichleTagFlag=true;
									 }

								 }

								 
								 
								 
								 

								 $scope.alertDetails=[];
								 $scope.alertDetails=$scope.data.data[0].alerts;
								 $scope.transactionFun($scope.data)

								 if($scope.data.data[0].lockedByUserIdOrig == commonDataService.getSessionStorage().userId){

									 $scope.hidemeflag = false;
									 $scope.hidemeAllFlag = false
								 }else{
									 $scope.hidemeflag = true;
									 $scope.hidemeAllFlag = true;
								 }
								 var dataList = [];
								 $scope.newDataList = [];
								 $scope.newDataList1 = [];

								 if ($scope.data.data != null) {
									 if ($scope.data.data[0].caseId
											 .startsWith("I")) {
										 $scope.hideAml = false;
										 $scope.data.data[0].finalRiskScore = $scope.data.data[0].issuerScore.riskScore;
									 } else if ($scope.data.data[0].caseId
											 .startsWith("A")) {
										 $scope.hideAml = false;
										 $scope.data.data[0].finalRiskScore = $scope.data.data[0].aquirerScore.riskScore;
									 }


									 if ($scope.data.data[0].caseStatus == 'MANUAL_CLOSE' || $scope.data.data[0].caseStatus == 'AUTO_CLOSE') {

										 $scope.hidemeCloseCaseFlag = true;
									 }

								 }
								 


								 if ($scope.data.data != null) {
									 $scope.storeallData=[]
									 $scope.newJsonData =[];
									 var fraudAmlArray=[];
									 var checkObj={
											 isCheck:false
									 }
									 // storing the case
									 // transaction
									 $scope.newDataList1 = $scope.data.data[0].caseTransactions;
									 
									 $scope.newDataList1.forEach((itm, i) => {
										 $scope.newDataList.push(Object.assign({}, itm,checkObj))
									 });

									 var object={}
									 object=Object.entries($scope.newDataList).forEach(([key,value])=>{
										 object[key]=value;
									 })
									 
									 /* $scope.storeallData=$scope.data.data[0].caseTransactions.map((x)=>{
										 return x.txnjson;
									 });
									  var objs = $scope.storeallData.map(JSON.parse);*/
									 for (var i = 0; i < $scope.newDataList.length; i++) {
										 fraudAmlArray.push({
											 casetypedesc: $scope.newDataList[i].caseTypeDesc,
											 casetypecode: $scope.newDataList[i].caseTypeCode,
											 amltypedesc: $scope.newDataList[i].amltypedesc,
											 tagType:$scope.newDataList[i].tagType,
											 cardnumber:$scope.newDataList[i].cardNumber1,
											 caseId:$scope.newDataList[i].caseId,
											 npciriskscore:$scope.newDataList[i].npciRiskScore,
											 responseCode:$scope.newDataList[i].responseCode,
											 remitterRiskScore:$scope.newDataList[i].remitterRiskScore,
											 payeraccountno:$scope.newDataList[i].payerAccountNo,
											 payermobile:$scope.newDataList[i].payerMobileNo,
											 payeemobile:$scope.newDataList[i].payeeMobileNo,
											 payeeaccountno:$scope.newDataList[i].payeeAccountNo,
											 payervpa:$scope.newDataList[i].payerVpa,
											 payeevpa:$scope.newDataList[i].payeeVpa,
											 mrchid:$scope.newDataList[i].mid,
											 //initiationmode:objs[i].txninitiationmode

										 });
									 }
									 $scope.storeallData=$scope.data.data[0].caseTransactions.map((x)=>{
										 return x.txnjson;
									 });

									 var objs = $scope.storeallData.map(JSON.parse);
									 $scope.findingmmid = objs
									 var combined = [];
									 objs.forEach((itm, i) => {
										 combined.push(Object.assign({}, itm, fraudAmlArray[i]))
									 });

									 $scope.newJsonData = combined;
									 
									 if($scope.data.data[0].sourceChannel=='NETC')
									 {

										 $scope.someObject.vehicleTagId=$scope.newJsonData[0].vehicletagid;
									 }
									 
									 //offlinetxn
			/*						 $scope.offline = false;

									 var blink = `<span ng-if="offline == false">
									 <div class="led-yellow"></div> 
									 <span class="onlineColor">Online</span></span>
									 <span ng-if="offline != false">
									 <div class="led-red"></div>
									 <span class="offlineColor">Offline</span></span>`;*/
									 // Create Gender
									 var genderEditor = function(cell, value){
										 // cell - JQuery object for current cell
										 // value - the current value for current cell

										 // create and style editor
										 var editor = $("<select><option value=''></option><option value='male'>male</option><option value='female'>female</option></select>");
										 editor.css({
											 "padding":"3px",
											 "width":"100%",
											 "box-sizing":"border-box",

										 })

										 // Set value of editor to the value of the cell
										 .val(value);


										 // set focus on the select box when the editor is selected (timeout allows
										 // for editor to be added to DOM)
										 if(cell.hasClass("tabulator-cell")){
											 setTimeout(function(){
												 editor.focus();
											 },100);
										 }

										 // when the value has been set, update the cell
										 editor.on("change blur", function(e){
											 cell.trigger("editval", editor.val());
										 });

										 // return the editor element
										 return editor;
									 }
									 var printIcon = function(value,data,cell,row,options, formatterParams){

										 var rowSelect = $("<input type='checkbox' style='position: absolute;left: 13px;' class='row-select'>");
										 rowSelect.on("change", function(){
											 var currentTxnId=value.getData().txnid;
											 if($(this).is(":checked")){
												 $(this).closest(".tabulator-row").addClass("selected");
												 if(!angular.isUndefined(filteredDataAll)){
													 filteredDataAll.filter(x=>{
														 if(currentTxnId==x.txnid){
															 x.isCheck=true;
														 }
													 })
													 var allChecked=false;
													 allChecked = filteredDataAll.every(x=> x.isCheck==true)
														 //console.log(allChecked);
													 if(allChecked==true){
														 // #selectAll if all are true then
														 // mark it as checked
														 document.getElementById("selectAll").checked = true;

													 }
													 $scope.$digest($scope.checkCounter++);
												 }

											 }
											 else{
												 $(this).closest(".tabulator-row").removeClass("selected");
												 if(!angular.isUndefined(filteredDataAll)){
													 filteredDataAll.filter(x=>{
														 if(currentTxnId==x.txnid){
															 x.isCheck=false;
														 }
													 })
													 if(filteredDataAll.every(x=>{
														 return x.isCheck==true
													 })){
														 // #selectAll if none is true then
														 // mark it as unchecked
														 document.getElementById("selectAll").checked = true;
													 }else {
														 document.getElementById("selectAll").checked = false;
													 }
													 $scope.$digest($scope.checkCounter--);
												 }

											 }

										 })
										 return rowSelect;
									 }

									 $scope.checkDisability=function (taggingTs) {
										 var isExpiryDate = function(taggingTs){
											 //console.log(taggingTs);
											 if(!angular.isUndefined(taggingTs)&& taggingTs != null){
												 var currentDate = new Date();
												 var amlTaggingDate = new Date(taggingTs);
												 //console.log(currentDate);
												 //console.log(amlTaggingDate);
												 var minutes = 1000*60;
												 var hours = minutes*60;
												 var days = hours*24;
												 var diff_date = Math.round((currentDate - amlTaggingDate)/days);
												 //console.log(diff_date)
												 if(diff_date <= 30){
													 $scope.leftTime= true;
												 }else{
													 $scope.leftTime= false;
												 }

											 }
										 }
										 isExpiryDate(taggingTs);

										 // NPCI logged in, case not closed and the case locked by Bank User.
										 // Visibility false
										 if($scope.orgidcheck=='NPCI' && $scope.hidemeCloseCaseFlag!=true
												 && $scope.data.data[0].lockedByOrgId!='NPCI'){
											 return true
										 }
										 // NPCI logged in, case not closed and the case locked by that NPCI User.
										 // Visibility true
										 else if($scope.orgidcheck=='NPCI' && $scope.hidemeCloseCaseFlag!=true
												 && $scope.data.data[0].lockedByUserIdOrig==commonDataService.getSessionStorage().userId
												 && $scope.data.data[0].lockedByOrgId=='NPCI'){
											 return false;
										 }
										 // NPCI logged in, case not closed and the case locked by other NPCI User.
										 // Visibility false
										 else if($scope.orgidcheck=='NPCI' && $scope.hidemeCloseCaseFlag!=true
												 && $scope.data.data[0].lockedByUserIdOrig!=commonDataService.getSessionStorage().userId
												 && $scope.data.data[0].lockedByOrgId=='NPCI'){
											 return true;
										 }
										 // NPCI logged in && case closed && time = undefined
										 else if($scope.orgidcheck=='NPCI' && $scope.hidemeCloseCaseFlag==true && angular.isUndefined($scope.leftTime)){
											 return false;
										 }
										 // NPCI logged in && case closed && time left<30
										 else if($scope.orgidcheck=='NPCI' && $scope.hidemeCloseCaseFlag==true && $scope.leftTime==true){
											 return false;
										 }
										 // NPCI logged in && case closed && time has not remained
										 else if($scope.orgidcheck=='NPCI' && $scope.hidemeCloseCaseFlag==true && $scope.leftTime==false){
											 return true;
										 }
										 // nonNPCI same user logged in && case not closed
										 else if($scope.orgidcheck!='NPCI' && $scope.hidemeCloseCaseFlag!=true && $scope.hidemeflag!=true ){
											 return false;
										 }
										 // nonNPCI other user logged in && case not closed
										 else if($scope.orgidcheck!='NPCI' && $scope.hidemeCloseCaseFlag!=true && $scope.hidemeflag==true ){
											 return true;
										 }
										 // nonNPCI and case closed
										 else if($scope.orgidcheck!='NPCI' && $scope.hidemeCloseCaseFlag==true){
											 return true;
										 }

									 }

									 

									/* var blinkIcon = function(cell, formatterParams)
									 {
										 
										 return ( $compile(blink)($scope) )
									 };*/
									 var tooltip_content = ``


									 $scope.amltrue=false;
									 var rowCount = 0;
									 var caseTypeDesc1 = function(){
										 return rowCount++;
									 }

									 var rowCount1 = 0;
									 var caseTypeDesc2 = function(){
										 return rowCount1++;
									 }

									 var checkTable = $( "#example-table" ).hasClass( "tabulator" )
									 if (checkTable) {
										 $("#example-table").tabulator("destroy");

									 }
									 $scope.allChecked=false;
									 $(document).on("change","#selectAll", function(){
										 $('input:checkbox').prop('checked', this.checked);
										
										 if($(this).is(":checked")){
											
											 var data = $("#example-table").tabulator("getData");
											 data.filter(x=>{
												 x.isCheck=true;
											 })
											 filteredDataAll=data;
											 $scope.$digest($scope.checkCounter=filteredDataAll.length+1);
										 }else{
											 
											 var data = $("#example-table").tabulator("getData");
											 data.filter(x=> {
												 x.isCheck = false;
											 })
											 
											 filteredDataAll=data;
											 $scope.$digest($scope.checkCounter=0);
										 }
									 });

									 var tabledata=[];
									 if($scope.data.data[0].sourceChannel=='NETC')
									 {
										 tabledata =[
											 
                                     		
                                     		{
                                     			'title':'API Name',
                                     			'field':'apiname',
                                     			'headerSort': true
                                     		},
                                     		{
                                     			'title':'Txn Date & Time',
                                     			'field':'txndatetime',
                                     			'headerSort': true
                                     		},
                                     		{
                                     			'title':'Requestor Org ID',
                                     			'field':'orgid',
                                     			'headerSort': true
                                     		},
                                     		{
                                     			'title':'Message ID',
                                     			'field':'txnmsgid',
                                     			'headerSort': true
                                     		},
                                     		{
                                     			'title':'Txn ID',
                                     			'field':'txnid',
                                     			'headerSort': true
                                     		},
                                     		{
                                     			'title':'Txn Note',
                                     			'field':'txnnote',
                                     			'headerSort': true
                                     		},
                                     		{
                                     			'title':'Consumer ref number',
                                     			'field':'consumerrefnumber',
                                     			'headerSort': true
                                     		},
                                     		
                                     		{
                                     			'title':'Txn URL',
                                     			'field':'txnrefurl',
                                     			'headerSort': true
                                     		},
                                     		{
                                     			'title':'Transaction origination time',
                                     			'field':'transactiondatetime',
                                     			'headerSort': true
                                     		},
                                     		{
                                     			'title':'Txn Type',
                                     			'field':'txnType',
                                     			'headerSort': true
                                     		},
                                     		{
                                     			'title':'Original Txn Id',
                                     			'field':'originaltxnid',
                                     			'headerSort': true
                                     		},
                                     		{
                                     			'title':'Transaction Mode',
                                     			'field':'txnmode',
                                     			'headerSort': true
                                     		},
                                     		{
                                     			'title':'Request Type',
                                     			'field':'txnreqtype',
                                     			'headerSort': true
                                     		},
                                             {
                                                 'title': 'Fraud Score',
                                                 'field': 'issuerriskscore',
                                                 'headerSort': true,
                                                 'visible': false,
                                                 'formatter': function(cell, formatterParams) {
                                                     var score = cell.getValue();
                                                     if (typeof score === 'undefined') {
                                                         return "0";
                                                     }
                                                     if (score == null || score == '') {
                                                         return "0";
                                                     } else
                                                         return score;
                                                 }

                                             },
                                             {
                                                 'title': 'Fraud Score',
                                                 'field': 'remitterRiskScore',
                                                 'headerSort': true,
                                                 'visible': false,
                                                 'formatter': function(cell, formatterParams) {
                                                     var score = cell.getValue();
                                                     if (typeof score === 'undefined') {
                                                         return "0";
                                                     }
                                                     if (score == null || score == '') {
                                                         return "0";
                                                     } else
                                                         return score;
                                                 }

                                             },
                                     		{
                                     			'title':'Plaza ID',
                                     			'field':'mrchid',
                                     			'headerSort': true
                                     		},
                                     		{
                                     			'title':'Plaza Name',
                                     			'field':'mrchname',
                                     			'headerSort': true
                                     		},
                                     		{
                                     			'title':'Plaza state',
                                     			'field':'state',
                                     			'headerSort': true,
                                     			'visible': false
                                     		},
                                     		{
                                     			'title':'Plaza city',
                                     			'field':'city',
                                     			'headerSort': true,
                                     			'visible': false
                                     		},
                                     		{
                                     			'title':'Plaza Location',
                                     			'field':'payergeocode',
                                     			'headerSort': true,
                                     		},
                                     		{
                                     			'title':'Merchant Name',
                                     			'field':'mrchname',
                                     			'headerSort': true
                                     		},
                                     		{
                                     			'title':'Merchant Lane ID',
                                     			'field':'mrchlaneid',
                                     			'headerSort': true
                                     		},
                                     		{
                                     			'title':'Merchant Lane Type',
                                     			'field':'mrchlanetype',
                                     			'headerSort': true
                                     		},
                                     		{
                                     			'title':'Merchant Lane Direction',
                                     			'field':'mrchlanedirection',
                                     			'headerSort': true
                                     		},
                                     		{
                                     			'title':'Parking Type',
                                     			'field':'mrchparkingtype',
                                     			'headerSort': true
                                     		},
                                     		{
                                     			'title':'Parking Floor',
                                     			'field':'mrchparkingfloor',
                                     			'headerSort': true
                                     		},
                                     		{
                                     			'title':'Parking Zone',
                                     			'field':'mrchparkingzone',
                                     			'headerSort': true
                                     		},
                                     		{
                                     			'title':'Sign Data',
                                     			'field':'mrchreaderverificationsigndata',
                                     			'headerSort': true
                                     		},
                                     		{
                                     			'title':'Proc Restriction Result',
                                     			'field':'mrchreaderrerificationrrocrestrictionresult',
                                     			'headerSort': true
                                     		},
                                     		{
                                     			'title':'Merchant Type',
                                     			'field':'mrchtype',
                                     			'headerSort': true
                                     		},
                                     		{
                                     			'title':'Merchant Sub type',
                                     			'field':'mrchsubtype',
                                     			'headerSort': true
                                     		},
                                     		{
                                     			'title':'Reader Read Time',
                                     			'field':'mrchreaderverificationtsread',
                                     			'headerSort': true
                                     		},
                                     		{
                                     			'title':'TAG Verification Result',
                                     			'field':'tagverificationresult',
                                     			'headerSort': true
                                     		},
                                     		{
                                     			'title':'Vehicle Authentication Status',
                                     			'field':'vehicleauthenticationstatus',
                                     			'headerSort': true
                                     		},
                                     		{
                                     			'title':'TID',
                                     			'field':'vehicletid',
                                     			'headerSort': true
                                     		},
                                     		/*{
                                     			'title':'vehicle Class',
                                     			'field':'vehicledetailvehicleclass',
                                     			'headerSort': true
                                     		},*/
                                     		{
                                     			  'title': 'Vehicle Class',
                                     			  'field': 'vehicledetailvehicleclass',
                                     			  'headerSort': true,
                                     			  'formatter': function(cell,
                                     			  formatterParams){
                                     			    var vclass=cell.getValue()
                                     			    return vclass.toUpperCase();
                                     			  }
                                     			},
                                     		{
                                     			'title':'Lane Controller Txn Counter',
                                     			'field':'lanecontrollertxncounter',
                                     			'headerSort': true
                                     		},
                                     		{
                                     			'title':'Lane Controller Txn Status',
                                     			'field':'lanecontrollertxnstatus',
                                     			'headerSort': true
                                     		},
                                     		
                                     		/*{
                                     			'title':'TID',
                                     			'field':'vechicletid',
                                     			'headerSort': true
                                     		},*/
                                     		/*{
                                     			'title':'Vehicle Class',
                                     			'field':'vehicleclass',
                                     			'headerSort': true
                                     		},*/
                                     		{
                                     			'title':'Vehicle Weight',
                                     			'field':'vehicleweight',
                                     			'headerSort': true
                                     		},
                                     		{
                                     			'title':'Vehicle Details',
                                     			'field':'vehicledetails',
                                     			'headerSort': true
                                     		},
                                     		{
                                     			'title':'Payer Address',
                                     			'field':'payervpa',
                                     			'headerSort': true
                                     		},
                                     		{
                                     			'title':'Payer Name',
                                     			'field':'payername',
                                     			'headerSort': true
                                     		},
                                     		{
                                     			'title':'Payer Type',
                                     			'field':'payertype',
                                     			'headerSort': true
                                     		},
                                     		{
                                     			'title':'Transaction Amount',
                                     			'field':'txnamount',
                                     			'headerSort': true,
                                     			formatter:"money"
                                     		},
                                     		{
                                     			'title':'Transaction Currency',
                                     			'field':'transactionCurrencyCode',
                                     			'headerSort': true
                                     		},
                                     		{
                                     			'title':'Payee Address',
                                     			'field':'payeevpa',
                                     			'headerSort': true
                                     		},
                                     		{
                                     			'title':'Payee Name',
                                     			'field':'payeename',
                                     			'headerSort': true
                                     		},
                                     		{
                                     			'title':'Payee Type',
                                     			'field':'payeetype',
                                     			'headerSort': true
                                     		}
                                     		
                                     	
										 ]
									 }
									 if($scope.data.data[0].sourceChannel=='AEPS')
									 {

								        	
							        	 tabledata=[
									            /*{
													        'title': 'User Name',
													        'field': 'cardnumber1',
													        'headerSort': true,
													        
												},*/
									            {
													        'title': 'DE00 - MTI',
													        'field': 'mti',
													        'headerSort': true,
													        
												}, 
												{
											        'title': 'Issuer IIN',
											        'field': 'issueriin',
												},
												{
													        'title': 'DE3 - Processing Code',
													        'field': 'processingCode',
													        'headerSort': true,
													        
											    },
									            {
													        'title': 'DE11 - STAN',
													        'field': 'stan',
													        'headerSort': true,
													        
												},
									            {			'title': 'DE18 - MCC', 
													        'field': 'mcc' 
											    },
									            {
													        'title': 'DE22 - POS Entry Mode ',
													        'field': 'pointofserviceentrymode',
													        'headerSort': true,
													        
												},
									            {
													        'title': 'DE25 - POS Condition Code',
													        'field': 'pointofserviceconditionCode',
													        'headerSort': true,
												},
												{
													        'title': 'DE32 - Acquiring BIN',
													        'field': 'acquiringinstitutionid',
													        
											    },
												{
													        'title': 'DE39 - Response Code',
													        'field': 'responseCode',
													        'headerSort': true,
													        'formatter': function (cell, formatterParams) {
													            var respCode = cell.getValue();
													            if (typeof respCode === 'undefined') {
													                return "";
													            }
													            if (respCode == null || respCode == '') {
													                return "";
													            }
													            return respCode;
													    
													        }
												},
												{'title': 'DE41 - Card Acceptor Terminal Identification', 'field': 'tid' },
												//{'title': 'DE42 - Card Acceptor Identification Code', 'field': 'mid' },
												{
															'title': 'DE43_1-23 - Card Acceptor Name/Address',
															'field': 'cardAcceptorNameLocation',
															'headerSort': true,
															formatter : function(cell, formatterParams){
																var updateName = cell.getValue();
																if(updateName){
																	return (updateName.slice(0, 22));
																}
																else{
																	return "";
																}
																
															 }	
												},
												{
															'title': 'DE43_24-36 - Card Acceptor City',
															'field': 'cardAcceptorNameLocation',
															'headerSort': true,
															formatter : function(cell, formatterParams){
																
																var updacity = cell.getValue();
																if(updacity){
																	return (updacity.slice(22, 35));
																}
																else{
																	return "";
																}
																
															 }	
												},
												{
															'title': 'DE43_37-38 - Card Acceptor State',
															'field': 'cardAcceptorNameLocation',
															'headerSort': true,
															formatter : function(cell, formatterParams){
																
																var updacity = cell.getValue();
																if(updacity){
																	return (updacity.slice(35, 38));
																}
																else{
																	return "";
																}
																
															 }	
												},
												/*{
														'title': 'Card Acceptor Zip Code',
														'field': 'pincode',
														'headerSort': true,
														 
												},*/
												{
														'title': 'DE43_39-40 - Card Acceptor Country Code',
														'field': 'cardAcceptorNameLocation',
														'headerSort': true,
														 formatter : function(cell, formatterParams){
															var updatecountry = cell.getValue();
															if(updatecountry){
																return (updatecountry.slice(38, 41));
															}
															else{
																return "";
															}
															
														 }	
												},
												{
														'title': 'DE48 _001 - Product Code',
														'field': 'productcd',
														'headerSort': true,
												},					 
												{
														 'title': 'DE49 - Currency Code',
														 'field': 'transactionCurrencyCode',
														 'headerSort': true
												},
												{
														 'title': 'DE62_003 - UID Token',
														 'field': 'uidtoken',
														 'headerSort': true
												},
												
												
												{
															'title': 'PAN Key Mode', 
														    'field': 'panKeyMode',
														    'headerSort': true
												},
												{'title': 'MID', 'field': 'mid' },
												/*{
													        'title': 'Acq_Inst_Cntry_code',
													        'field': 'acquiringinstitutioncountrycode',
													        'headerSort': true,
													        
												},*/
													    
												{
													        'title': 'Txn Sub Code',
													        'field': 'txnSubCode',
													        'headerSort': true,
													        
												},
												{
													        'title': 'Txn Type',
													        'field': 'txnType',
													        'headerSort': true,
													        
												},
												{
													        'title': 'AcqInstId+Mid+Tid',
													        'field': 'acqinstidmidtid',
													        'headerSort': true,
													        
												},
												{
													        'title': 'AcqInstId+Mid',
													        'field': 'acqinstidmid',
													        'headerSort': true,
													        
												},
												{
													        'title': 'Txn Sub Type',
													        'field': 'txnSubType',
													        'headerSort': true,
													        
												}
													 						                        
												]

									 }
									 
									 if($scope.data.data[0].sourceChannel=='IMPS'){
										    tabledata=[
										    	{
													 'title': 'DE51 - Currency Code',
													 'field': 'transactionCurrencyCode',
													 'headerSort': true
												 },
										    {
										        'title': 'Base Currency Amount',
										        'field': 'txnamount',
										         formatter:"money"
										     },
										     
										     {
										        'title': 'DE120_001 - IMPS Mode',
										        'field': 'txnSubCode',
										        'headerSort': true,
										        

										    },
										    {
										        'title': 'DE03 - Processing Code',
										        'field': 'processingCode',
										        'headerSort': true,
										        
										    },
										    {
										        'title': 'DE13 - Date Local transaction MMDD',
										        'field': 'dateLocaltransactionMMDD',
										        'headerSort': true,
										        
										    },
										    
										    {
										        'title': 'DE120_001 - Action',
										        'field': 'txnSubCode',
										        'headerSort': true
										  },
										  {
										    'title': 'DE39 - Response Code',
										    'field': 'responseCode',
										    'headerSort': true,
										    'formatter': function (cell, formatterParams) {
										        var respCode = cell.getValue();
										        if (typeof respCode === 'undefined') {
										            return "";
										        }
										        if (respCode == null || respCode == '') {
										            return "";
										        }
										        return respCode.toUpperCase();

										    }
										},
										{
										    'title': 'Transaction Status',
										    'field': 'rrn6',
										    'headerSort': true
										},
										{
										    'title': 'Reversal Status',
										    'field': 'rrn7',
										    'headerSort': true
										},
										{
										    'title': 'Transaction Action Code',
										    'field': 'responseCode',
										    
										},
										{
										    'title': 'DE00 - MTI',
										    'field': 'mti',
										    'headerSort': true,
										},
										{
										    'title': 'Beneficiary Account Number',
										    'field': 'payeeaccountno',
										    'headerSort': true,
										},
										{
										    'title': 'Beneficiary IFSC',
										    'field': 'payeeifsc',
										    'headerSort': true,
										},
										{
										    'title': 'Beneficiary Mobile Number',
										    'field': 'payeemobile',
										    'headerSort': true,
										},
										{
										    'title': 'IP Address',
										    'field': 'ipaddressforrupay',
										    'headerSort': true,
										},
										{
											'title':'DE42 - Acceptor Id',
											'field': 'acceptorId',
											'headerSort': true,
										},
										{
											'title': 'DE2 - Issuing BIN',
											'field': 'issuerBin',
										},
										{
											'title': 'DE32 - Acquiring BIN',
											'field': 'acquiringinstitutionid',

										},
										{'title': 'DE42 - MID', 'field': 'mid' },
										{'title': 'DE41 - TID', 'field': 'tid' },
										{'title': 'DE18 - MCC', 'field': 'mcc' },
										{
											'title': 'DE18 - Merchant Category',
											'field': 'mcc'
										},
										{
											'title': 'DE22 (1-2) - PAN Key Mode',
											'field': 'panKeyMode',
											'headerSort': true
										},
										{
											'title': 'DE120_046 - Merchant Name',
											'field': 'merchantName',
											'headerSort': true
										},
										{
											'title': 'DE11 - STAN',
											'field': 'stan',
											'headerSort': true,

										},
										{
											'title': 'DE120_001 - Txn Type',
											'field': 'txnType',
											'headerSort': true,

										},
										{
										    'title': 'DE120_56 - Originating Channel',
										    'field': 'originatingchannel',
										    'headerSort': true,
										},
										{
										    'title': 'Pin Code',
										    'field': 'pincode',
										},
										{
										    'title': 'DE120_50 - Remitter IMPSID',
										    'field': 'remittermmidandmobilenumber',
										    'headerSort': true,
										},
										{
										    'title': 'Remitter Mobile Number',
										    'field': 'payermobile',
										    'headerSort': true,
										},
										{
										    'title': 'DE22 - POS Entry mode',
										    'field': 'pointofserviceentrymode',
										    'headerSort': true,
										},
										{
										    'title': 'DE43 - Acceptor Address',
										    'field': 'cardAcceptorNameLocation',
										    'headerSort': true,
										},
										{
										    'title': 'Acceptor City',
										    'field': 'cardAcceptorNameLocation',
										    'headerSort': true,
										    formatter : function(cell, formatterParams){
									            var updateCity = cell.getValue();
									            if(updateCity){
									            	return (updateCity.slice(22, 35));
									            }
									            else{
									            	return "";
									            }
									            
									         }	

										},
										{
										    'title': 'Acceptor State',
										    'field': 'cardAcceptorNameLocation',
										    'headerSort': true,
										    formatter : function(cell, formatterParams){
									            var updateState = cell.getValue();
									            if(updateState){
									            	 return (updateState.slice(35, 38));
									            }
									            else{
									            	return "";
									            }
									          
									         }	
										},
										{
										    'title': 'Card Accept Country',
										    'field': 'cardAcceptorNameLocation',
										    'headerSort': true,
										    formatter : function(cell, formatterParams){
									            var updateCountry = cell.getValue();
									            if(updateCountry){
									            	return (updateCountry.slice(38, 41));
									            }
									            else{
									            	return "";
									            }
									            
									         }	
										},
										
										{
										    'title': 'DE41 - Acceptor Terminal Id', 
										    'field': 'tid'
										},
										{
											'title': 'DE61_2 - Cardholder authentication capability id', 
										    'field': 'cardholderauthenticationcapabilityid',
										    'headerSort': true
										},
										{
											'title': 'Private data6 Mc attribute Data', 
										    'field': 'privatedata6mcattributedata',
										    'headerSort': true
										},
										{
											'title': 'Point Of Service capture code', 
										    'field': 'pointofservicecapturecode',
										    'headerSort': true
										}

										]
										    
										}
									 if($scope.data.data[0].sourceChannel=='RuPayPos'){

										    tabledata=[
										    	{
													 'title': 'DE51 - Currency Code',
													 'field': 'transactionCurrencyCode',
													 'headerSort': true
												 },
										      
										    {
										        'title': 'DE13 - Date Local transaction MMDD',
										        'field': 'dateLocaltransactionMMDD',
										        'headerSort': true,
										    },
										    {
										        'title': 'DE25 - POS Condition code',
										        'field': 'pointofserviceconditionCode',
										        'headerSort': true,
										    },
										    {
												'title': 'DE22 (1-2) - PAN Key Mode', 
											    'field': 'panKeyMode',
											    'headerSort': true
											},
											{
												'title': 'DE48_071 - IP address for RuPay', 
											    'field': 'ipaddressforrupay',
											    'headerSort': true
											},
											{
												'title': 'DE61_2 - Cardholder authentication capability id', 
											    'field': 'cardholderauthenticationcapabilityid',
											    'headerSort': true
											},
											{
												'title': 'Private data6 Mc attribute Data', 
											    'field': 'privatedata6mcattributedata',
											    'headerSort': true
											},
											{
												'title': 'Point Of Service capture code', 
											    'field': 'pointofservicecapturecode',
											    'headerSort': true
											},
											
										    {
										        'title': 'DE05 - Settlement Amount',
										        'field': 'settlementamount',
										        formatter:"money"
										     },
										     {
										        'title': 'DE06 - Billing Amount',
										        'field': 'cardholderbillingamount',
										        formatter : function(cell, formatterParams){
										        	var txnamount = Number(cell.getRow().getData().txnamount);
										            var acquiringinstitutioncountrycode = cell.getRow().getData().acquiringinstitutioncountrycode;
										            var cardholderbillingamount = cell.getRow().getData().cardholderbillingamount;
										            if(acquiringinstitutioncountrycode != 356){
										            	return (cardholderbillingamount / 100);
										            }
										            else{
										            	return (txnamount.toFixed(2));
										            }
										            
										         }	
										     },
										     {
										        'title': 'DE00 - MTI',
										        'field': 'mti',
										        'headerSort': true,
										        
										    }, 
										    {
										        'title': 'DE03 - Processing Code',
										        'field': 'processingCode',
										        'headerSort': true,
										        
										    },
										    {
										        'title': 'DE48_051 - Product Code',
										        'field': 'productcd',
										        'headerSort': true,
										    },
										    {
										        'title': 'DE39 - Response Code',
										        'field': 'responseCode',
										        'headerSort': true,
										        'formatter': function (cell, formatterParams) {
										            var respCode = cell.getValue();
										            if (typeof respCode === 'undefined') {
										                return "";
										            }
										            if (respCode == null || respCode == '') {
										                return "";
										            }
										            return respCode;
										    
										        }
										    },
										    {
										        'title': 'DE2 - Issuing BIN',
										        'field': 'issuerBin',
										   },
										    {
										        'title': 'DE32 - Acquiring BIN',
										        'field': 'acquiringinstitutionid',
										        
										    }, 
										    {
										        'title': 'DE22 - POS Entry mode',
										        'field': 'pointofserviceentrymode',
										        'headerSort': true,
										        
										    },
										    {'title': 'DE42 - MID', 'field': 'mid' },
										    {'title': 'DE41 - TID', 'field': 'tid' },
										    {'title': 'DE18 - MCC', 'field': 'mcc' },
										    {
										        'title': 'DE61_013 - Merchant pincode',
										        'field': 'pincode',
										        
										    },
										    {
										        'title': 'DE43 - Card Accptr Name/Loc',
										        'field': 'cardAcceptorNameLocation',
										        'headerSort': true,
										        
										    },
										    {
										        'title': 'DE19 - Acq_Inst_Cntry_code',
										        'field': 'acquiringinstitutioncountrycode',
										        'headerSort': true,
										        
										    },
										    {
										        'title': 'DE61 - POS data code',
										        'field': 'posdatacode',
										        'headerSort': true,
										        
										    },
										    {
										        'title': 'DE11 - STAN',
										        'field': 'stan',
										        'headerSort': true,
										        
										    },
										   {
										        'title': 'DE48_001 - Txn Sub Code',
										        'field': 'txnSubCode',
										        'headerSort': true,
										        
										    },
										    {
										        'title': 'DE48_083 - Merchant Business Type',
										        'field': 'merchantbusinesstype',
										        'headerSort': true,
										        
										    },
										    {
										        'title': 'DE48_080 - Additional Acquiring Information',
										        'field': 'additionalacquiringinformation',
										        'headerSort': true,
										        
										    },
										    {
										        'title': 'DE120_001 - Txn Type',
										        'field': 'txnType',
										        'headerSort': true,
										        
										    },
										    {
										        'title': 'DE32+DE42+DE41 - AcqInstId+Mid+Tid',
										        'field': 'acqinstidmidtid',
										        'headerSort': true,
										        
										    },
										    {
										        'title': 'DE32+DE42 - AcqInstId+Mid',
										        'field': 'acqinstidmid',
										        'headerSort': true,
										        
										    },
										    {
										        'title': 'DE48_074 - Customer Telephone Mobile Number',
										        'field': 'customertelephonemobilenumber',
										        'headerSort': true,
										        
										    },
										    
										    {
										        'title': 'Is International Debit Card',
										        'field': 'isinternationaldebitcard',
										        'headerSort': true,
										        
										    },
										    {
										        'title': 'Txn Sub Type',
										        'field': 'txnSubType',
										        'headerSort': true,
										        
										    },
										   
										    {
										        'title': 'AML Score',
										        'field': 'npciriskscore',
										        'headerSort': true,
										        'visible' : false
										        
										        
										    },
										    {
										        'title': 'Is Declined Txn',
										        'field': 'isdeclinedtxn',
										        'headerSort': true,
										        'visible' : false
										        
										    },
										    {
										        'title': 'DE40 - Service Code',
										        'field': 'servicecode',
										        'headerSort': true,
										       
										    },
										    {
										        'title': 'Risk Terminal Indicator',
										        'field': 'tfriskterminal',
										        'headerSort': true,
										       
										    },
										    {
										        'title': 'DE105_11 - Device ID',
										        'field': 'deviceid',
										        'headerSort': true
										    },
										    {
										        'title': 'DE105_10 - Device Type',
										        'field': 'devicetype',
										        'headerSort': true,
										        
										    },
										    {
										        'title': 'DE33 - Forwarding Institution Identification Code',
										        'field': 'forwardinginstitutionidentificationcode',
										        'headerSort': true,
										        
										    },
										    {
										        'title': 'CHIP Transaction Authorization Indicator',
										        'field': 'chiptransactionauthorizationindicator',
										        'headerSort': true,
										        
										    },
										    {
										        'title': 'Pos Address',
										        'field': 'posaddaddress',
										        'headerSort': true,
										        
										    },
										    {
										        'title': 'Forwarding Institution Country Code',
										        'field': 'forwardinginstitutioncountrycode',
										        'headerSort': true,
										        
										    },
										    {
										        'title': 'Card Capture Capability ID',
										        'field': 'cardcapturecapabilityid',
										        'headerSort': true,
										        
										    },
										    {
										        'title': 'DE48_54 - CVDiCVD Match result code',
										        'field': 'cvdiCVDMatchresultcode',
										        'headerSort': true
										    },
										    {
										        'title': 'DE43_1-23 - Terminal Owner Name',
										        'field': 'cardAcceptorNameLocation',
											    'headerSort': true,
											    formatter : function(cell, formatterParams){
										            var updateName = cell.getValue();
										            if(updateName){
										            	return (updateName.slice(0, 22));
										            }
										            else{
										            	return "";
										            }
										            
										         }	
										    },
										    {
										        'title': 'DE43_24-36 - Terminal City',
										        'field': 'cardAcceptorNameLocation',
											    'headerSort': true,
											    formatter : function(cell, formatterParams){
											    	
										            var updacity = cell.getValue();
										            if(updacity){
										            	return (updacity.slice(22, 35));
										            }
										            else{
										            	return "";
										            }
										            
										         }	
										    },
										    {
										        'title': 'DE43_39-40 - Terminal Country Code',
										        'field': 'cardAcceptorNameLocation',
											    'headerSort': true,
											     formatter : function(cell, formatterParams){
										            var updatecountry = cell.getValue();
										            if(updatecountry){
										            	return (updatecountry.slice(38, 41));
										            }
										            else{
										            	return "";
										            }
										            
										         }	
										    }
										 
										]
										    
										
									 }
									 

									 if($scope.data.data[0].sourceChannel=='RuPayAtm' ){
										    tabledata=[
										    	{
													 'title': 'DE51 - Currency Code',
													 'field': 'transactionCurrencyCode',
													 'headerSort': true
												 },
										      
										    {
										        'title': 'DE13 - Date Local transaction MMDD',
										        'field': 'dateLocaltransactionMMDD',
										        'headerSort': true,
										    },
										    {
										        'title': 'DE25 - POS Condition code',
										        'field': 'pointofserviceconditionCode',
										        'headerSort': true,
										    },
										    {
												'title': 'DE22 (1-2) - PAN Key Mode', 
											    'field': 'panKeyMode',
											    'headerSort': true
											},
											{
												'title': 'DE48_071 - IP address for RuPay', 
											    'field': 'ipaddressforrupay',
											    'headerSort': true
											},
											{
												'title': 'DE61_2 - Cardholder authentication capability id', 
											    'field': 'cardholderauthenticationcapabilityid',
											    'headerSort': true
											},
											{
												'title': 'Private data6 Mc attribute Data', 
											    'field': 'privatedata6mcattributedata',
											    'headerSort': true
											},
											{
												'title': 'Point Of Service capture code', 
											    'field': 'pointofservicecapturecode',
											    'headerSort': true
											},
											
										    {
										        'title': 'DE05 - Settlement Amount',
										        'field': 'settlementamount',
										        formatter:"money"
										     },
										     {
										        'title': 'DE06 - Billing Amount',
										        'field': 'cardholderbillingamount',
										        formatter : function(cell, formatterParams){
										        	var txnamount = Number(cell.getRow().getData().txnamount);
										            var acquiringinstitutioncountrycode = cell.getRow().getData().acquiringinstitutioncountrycode;
										            var cardholderbillingamount = cell.getRow().getData().cardholderbillingamount;
										            if(acquiringinstitutioncountrycode != 356){
										            	return (cardholderbillingamount / 100);
										            }
										            else{
										            	return (txnamount.toFixed(2));
										            }
										            
										         }	
										     },
										     {
											        'title': 'DE95 - Dispensed Amount',
											        'field': 'replacementamounts',
											        formatter : function(cell, formatterParams){
											            var replacementamounts = cell.getValue();
											            var txnamount = Number(cell.getRow().getData().txnamount);
											            if(replacementamounts){
											            	return ((replacementamounts.slice(0, 12))/100);
											            }
											            else{
											            	return (txnamount.toFixed(2));
											            }
											            
											         }	
											 },
										     {
										        'title': 'DE00 - MTI',
										        'field': 'mti',
										        'headerSort': true,
										        
										    }, 
										    {
										        'title': 'DE03 - Processing Code',
										        'field': 'processingCode',
										        'headerSort': true,
										        
										    },
										    {
										        'title': 'DE48_051 - Product Code',
										        'field': 'productcd',
										        'headerSort': true,
										    },
										    {
										        'title': 'DE39 - Response Code',
										        'field': 'responseCode',
										        'headerSort': true,
										        'formatter': function (cell, formatterParams) {
										            var respCode = cell.getValue();
										            if (typeof respCode === 'undefined') {
										                return "";
										            }
										            if (respCode == null || respCode == '') {
										                return "";
										            }
										            return respCode;
										    
										        }
										    },
										    {
										        'title': 'DE2 - Issuing BIN',
										        'field': 'issuerBin',
										   },
										    {
										        'title': 'DE32 - Acquiring BIN',
										        'field': 'acquiringinstitutionid',
										        
										    }, 
										    {
										        'title': 'DE22 - POS Entry mode',
										        'field': 'pointofserviceentrymode',
										        'headerSort': true,
										        
										    },
										    {'title': 'DE42 - MID', 'field': 'mid' },
										    {'title': 'DE41 - TID', 'field': 'tid' },
										    {'title': 'DE18 - MCC', 'field': 'mcc' },
										    {
										        'title': 'DE61_013 - Merchant pincode',
										        'field': 'pincode',
										        
										    },
										    {
										        'title': 'DE43 - Card Accptr Name/Loc',
										        'field': 'cardAcceptorNameLocation',
										        'headerSort': true,
										        
										    },
										    {
										        'title': 'DE19 - Acquiring Institution Country Code',
										        'field': 'acquiringinstitutioncountrycode',
										        'headerSort': true,
										        
										    },
										    {
										        'title': 'DE61 - POS data code',
										        'field': 'posdatacode',
										        'headerSort': true,
										        
										    },
										    {
										        'title': 'DE11 - STAN',
										        'field': 'stan',
										        'headerSort': true,
										        
										    },
										   {
										        'title': 'DE48_001 - Txn Sub Code',
										        'field': 'txnSubCode',
										        'headerSort': true,
										        
										    },
										    {
										        'title': 'DE48_083 - Merchant Business Type',
										        'field': 'merchantbusinesstype',
										        'headerSort': true,
										        
										    },
										    {
										        'title': 'DE48_080 - Additional Acquiring Information',
										        'field': 'additionalacquiringinformation',
										        'headerSort': true,
										        
										    },
										    {
										        'title': 'DE120_001 - Txn Type',
										        'field': 'txnType',
										        'headerSort': true,
										        
										    },
										    {
										        'title': 'DE32+DE42+DE41 - AcqInstId+Mid+Tid',
										        'field': 'acqinstidmidtid',
										        'headerSort': true,
										        
										    },
										    {
										        'title': 'DE32+DE42 - AcqInstId+Mid',
										        'field': 'acqinstidmid',
										        'headerSort': true,
										        
										    },
										    {
										        'title': 'DE48_074 - Customer Telephone Mobile Number',
										        'field': 'customertelephonemobilenumber',
										        'headerSort': true,
										        
										    },
										    
										    {
										        'title': 'Is International Debit Card',
										        'field': 'isinternationaldebitcard',
										        'headerSort': true,
										        
										    },
										    {
										        'title': 'Txn Sub Type',
										        'field': 'txnSubType',
										        'headerSort': true,
										        
										    },
										   
										    {
										        'title': 'AML Score',
										        'field': 'npciriskscore',
										        'headerSort': true,
										        'visible' : false
										        
										        
										    },
										    {
										        'title': 'Is Declined Txn',
										        'field': 'isdeclinedtxn',
										        'headerSort': true,
										        'visible' : false
										        
										    },
										    {
										        'title': 'DE40 - Service Code',
										        'field': 'servicecode',
										        'headerSort': true,
										       
										    },
										    {
										        'title': 'Risk Terminal Indicator',
										        'field': 'tfriskterminal',
										        'headerSort': true,
										       
										    },
										    {
										        'title': 'DE105_11 - Device ID',
										        'field': 'deviceid',
										        'headerSort': true
										    },
										    {
										        'title': 'DE105_10 - Device Type',
										        'field': 'devicetype',
										        'headerSort': true,
										        
										    },
										    {
										        'title': 'DE33 - Forwarding Institution Identification Code',
										        'field': 'forwardinginstitutionidentificationcode',
										        'headerSort': true,
										        
										    },
										    {
										        'title': 'CHIP Transaction Authorization Indicator',
										        'field': 'chiptransactionauthorizationindicator',
										        'headerSort': true,
										        
										    },
										    {
										        'title': 'Pos Address',
										        'field': 'posaddaddress',
										        'headerSort': true,
										        
										    },
										    {
										        'title': 'Forwarding Institution Country Code',
										        'field': 'forwardinginstitutioncountrycode',
										        'headerSort': true,
										        
										    },
										    {
										        'title': 'Card Capture Capability ID',
										        'field': 'cardcapturecapabilityid',
										        'headerSort': true,
										        
										    },
										    {
										        'title': 'DE48_54 - CVDiCVD Match result code',
										        'field': 'cvdicvdmatchresultcode',
										        'headerSort': true
										    },
										    {
										        'title': 'DE43_1-23 - Terminal Owner Name',
										        'field': 'cardAcceptorNameLocation',
											    'headerSort': true,
											    formatter : function(cell, formatterParams){
										            var updateName = cell.getValue();
										            if(updateName){
										            	return (updateName.slice(0, 22));
										            }
										            else{
										            	return "";
										            }
										            
										         }	
										    },
										    {
										        'title': 'DE43_24-36 - Terminal City',
										        'field': 'cardAcceptorNameLocation',
											    'headerSort': true,
											    formatter : function(cell, formatterParams){
											    	
										            var updacity = cell.getValue();
										            if(updacity){
										            	return (updacity.slice(22, 35));
										            }
										            else{
										            	return "";
										            }
										            
										         }	
										    },
										    {
										        'title': 'DE43_39-40 - Terminal Country Code',
										        'field': 'cardAcceptorNameLocation',
											    'headerSort': true,
											    formatter : function(cell, formatterParams){
										            var updatecountry = cell.getValue();
										            if(updatecountry){
										            	return (updatecountry.slice(38, 41));
										            }
										            else{
										            	return "";
										            }
										            
										         }	
										    }
										 
										]
										    
										}

									 if($scope.data.data[0].sourceChannel=='UPI'){
										 tabledata=[
											 

												
												{
													'title': 'Payer VPA',
													'field': 'payervpa',
													'headerSort': true,
													
												},
												{
													'title': 'Payee VPA',
													'field': 'payeevpa',
													'headerSort': true,
													
												},
												{
													'title': 'Txn Type',
													'field': 'txnType',
												},
												{
													 'title': 'Payer user name',
													 'field': 'payerifscaccountno',
													 'headerSort': true,
												},
												{
													 'title': 'Payer Mobile Number',
													 'field': 'payermobile',
													 'headerSort': true,
												 },
											    {
														'title': 'Payer IFSC',
														'field': 'payerifsc',
														'headerSort': true,
												},
												{
													'title': 'Payer Account No',
													'field': 'payeraccountno',
													'headerSort': true
												},
												{
													'title': 'Payer Device ID',
													'field': 'payerdeviceid'
												},
												{
													'title': 'Payer Device App Id',
													'field': 'payerdeviceappid',
													'headerSort': true,

												},
												{
													'title': 'Payer Device OS',
													'field': 'payerdeviceos',
													'headerSort': true,

												},
												{
													 'title': 'Payee user name',
													 'field': 'payeeifscaccountno',
													 'headerSort': true,
												},
												{
													'title': 'Payee Mobile Number',
													'field': 'payeemobile',
													'headerSort': true
												},
												{
													'title': 'Payee IFSC',
													'field': 'payeeifsc',
													'headerSort': true
												},
												{
													'title': 'Payee Account No',
													'field': 'payeeaccountno',
													'headerSort': true
												},
												{
													'title': 'Payee Device Id',
													'field': 'payeedeviceid',
													'headerSort': true,

												},
												{
													'title': 'Payee Device App Id',
													'field': 'payeedeviceappid',
													'headerSort': true
												},
												{
													'title': 'Payee Device OS',
													'field': 'payeedeviceos'

												},
												{
													'title': 'Txn Sub Type',
													'field': 'txnSubType',

												},
												{
													'title': 'Channel',
													'field': 'channel',
													'headerSort': true,

												},
												{
													'title': 'Currency Code',
													'field': 'transactionCurrencyCode',
													'headerSort': true
												},
												{
													'title': 'Payer IP',
													'field': 'payerip',
													'headerSort': true,
												},
												{
													'title': 'Payer Location',
													'field': 'payerlocation',
													'headerSort': true,

												},
												{
													'title': 'Payer Geo Code',
													'field': 'payergeocode',
													'headerSort': true,

												},
												{
													'title': 'Payer Device Type',
													'field': 'payerdevicetype',
													'headerSort': true,

												},
												{
													 'title': 'Payer PSP',
													 'field': 'payerPsp',
													 'headerSort': true,
													 formatter : function(cell, formatterParams){
												        	var payervpa = cell.getRow().getData().payervpa;
												        	var res = '';
												        	if(payervpa){
												        	  res = payervpa.split("@");
												        	  res = res[1];
												        	}
												            return res;
												            
												         }
												 },
												
												 {
													 'title': 'Payee PSP',
													 'field': 'payeePsp',
													 'headerSort': true,
													 formatter : function(cell, formatterParams)
													 {
												        	var payeevpa = cell.getRow().getData().payeevpa;
												        	var res ='';
												        	if(payeevpa){
												        	   res = payeevpa.split("@");
												        	   res = res[1];
												        	}
												        	
												            return res;
												     }
												 },
												{
													'title': 'Payee IP',
													'field': 'payeedeviceip',

												},
												{
													'title': 'Payee Geo Code',
													'field': 'payeegeocode',
													'headerSort': true,

												},
												{
													'title': 'Payee Device Type',
													'field': 'payeedevicetype',
													'headerSort': true,
													/*formatter : function(cell, formatterParams){
						                                var updatecountry = cell.getValue();
						                                if(updatecountry){
						                                    return (updatecountry.slice(38, 41));
						                                }
						                                else{
						                                    return "";
						                                }

						                            }*/
												},
												{
													'title': 'Txn Initiation Mode',
													'field': 'txninitiationmode',
													'headerSort': true,

												},
												{
													'title': 'Txn Purpose',
													'field': 'txnpurpose',
													'headerSort': true


												},
												{
													'title': 'Payer Account Type',
													'field': 'payeraccounttype'

												},
												{
													'title': 'Payee Account Type',
													'field': 'payeeaccounttype',
													'headerSort': true,

												},
												{
													'title': 'Payee currency',
													'field': 'payeecurrency',
													'headerSort': true
												},
												{
													 'title': 'Payee Name',
													 'field': 'payeeverifiedname',
													 'headerSort': true,
												 },
												 {
														'title': 'Payee Location',
														'field': 'payeelocation',
														'headerSort': true,

												 },
												 {
														'title': 'Payee Dev Capablity',
														'field': 'payeedevicecapability',
														'headerSort': true,

												},
												{
													 'title': 'Processing Code',
													 'field': 'processingCode',
													 'headerSort': true,
												 },
												 {
														'title': 'Org Id',
														'field': 'orgid',
														'headerSort': true,

												},
												{
													'title': 'Payer Info Id',
													'field': 'payerinfoid',
													'headerSort': true,

												},
												{
													'title': 'Payee Infoid',
													'field': 'payeeinfoid',
													'headerSort': true,

												},
												{
													'title': 'Payer Seq Num',
													'field': 'payerseqnum',
													'headerSort': true,

												},
												{
											        'title': 'Payer Device Number',
											        'field': 'devicenumber',
											        'headerSort': true,
											    },
												
												{
													'title': 'Payer Name',
													'field': 'payername',
													'headerSort': true,

												},
												{
													'title': 'Payer Txn Api Name',
													'field': 'txnapiname',
													'headerSort': true,

												},
												  {
			                                        'title': 'Payer Device Registration Time',
			                                        'field': 'payerDeviceRegTs',
			                                        formatter: function(cell, formatterParams) {
			                                            var updateDate = cell.getValue();
			                                            if (updateDate != null){
			                                                 var mydate = moment(new Date(updateDate)).format("DD-MM-YY HH:mm:ss");
			                                                return mydate ;
			                                            }

			                                        }
			                                        

			                                    },
			                                    {
			                                        'title': 'Transaction Purpose',
			                                        'field': 'txnPurpose',
			                                        'headerSort': true,

			                                    },
												
												{
													'title': 'Final Riskscore',
													'field': 'finalriskscore',
													'headerSort': true,
													'formatter': function (cell, formatterParams) {
												        var score = cell.getValue();
												        if (typeof score === 'undefined') {
												            return "0";
												        }
												        if (score == null || score == '') {
												            return "0";
												        }
												        else 
													         return score;	
												    }

												},
												{
													'title': 'Txn Risk Scorevalue',
													'field': 'txnriskscorevalue',
													'headerSort': true,

												},
												/*{
												'title': 'Txn Msgid',
												'field': 'txnmsgid',
												'headerSort': true,

											},*/
											/*{
											'title': 'Txn Version',
											'field': 'txnversion',
											'headerSort': true,

										},*/
										{
											'title': 'Txn Ref Url',
											'field': 'txnrefurl'

										},
										{
											'title': 'Txn Risk Scor Prvidr',
											'field': 'txnriskscoreprovider',
											'headerSort': true,
											/*formatter : function(cell, formatterParams){
						                        var updateName = cell.getValue();
						                        if(updateName){
						                            return (updateName.slice(0, 24));
						                        }
						                        else{
						                            return "";
						                        }

						                    }*/
										},
										{
											 'title': 'Merchant Status',
											 'field': 'payermerchanttype',
											 'headerSort': true,
										 },
										 {
												'title': 'Even Purchase Flag',
												'field': 'evenpurchaseflag',
												'headerSort': true,

										},
										{
											'title': 'Locality Type',
											'field': 'localitytype',
											'headerSort': true,

										},
										
										{
									        'title': 'Is Sunday',
									        'field': 'issunday',
									        'headerSort': true,
									        
									    }, 
										
										
										{
													 'title': 'Merchant Name',
													 'field': 'payemrchbrandname',
													 'headerSort': true,
										},
										{
													 'title': 'TID',
													 'field': 'tid',
													 'headerSort': true,
												 },
												 {
													 'title': 'MID',
													 'field': 'mid',
													 'headerSort': true,
												 },
												 {
													 'title': 'Merchant Business Type',
													 'field': 'payeemrchtype',
													 'headerSort': true,
												 },
												 
												 {
													 'title': 'Reversal Amount',
													 'field': 'txnamount',
													 'headerSort': true,
													 formatter : function(cell, formatterParams){
												        	var txnamount = Number(cell.getRow().getData().txnamount);
												            var txnsubtype = cell.getRow().getData().txnSubType;
												            
												            if(txnsubtype == 'REVERSAL' || txnsubtype == 'Reversal' ){
												            	return (txnamount);
												            }
												            else{
												            	return '0';
												            }
												            
												         }
												 },
												 
												{
													 'title': 'MTI',
													 'field': 'mti',
													 'headerSort': true,
												 },
												 
												 
												 {
													 'title': 'POS Entry mode',
													 'field': 'pointofserviceentrymode',
													 'headerSort': true,
												 },
												 {
													 'title': 'Merchant pincode',
													 'field': 'pincode',
													 'headerSort': true,
												 },
												 {
													 'title': 'Merchant Country',
													 'field': 'country',
													 'headerSort': true,
												 },
												 {
												        'title': 'Issuing BIN',
												        'field': 'issuerBin',
												 },
												 {
												        'title': 'Acquiring BIN',
												        'field': 'acquirerbin',
												        
												  },
												  {
												        'title': 'Acq_Inst_Cntry_code',
												        'field': 'acquiringinstitutioncountrycode',
												        
												  },
												  {
												        'title': 'Card Accptr Name/Loc',
												        'field': 'cardAcceptorNameLocation',
												        
												  },
												 
												  {
												        'title': 'Payment A/c Ref',
												        'field': 'paymentaccountreferencepar',
														'headerSort': true
												  },
												  {
												        'title': 'State',
												        'field': 'state',
														'headerSort': true
												  },
												  {
												        'title': 'Is Declined Txn',
												        'field': 'isdeclinedtxn',
												        'headerSort': true,
												        'visible' : false
												        
												  },
											    {
											        'title': 'MAC Value',
											        'field': 'macvalue',
											        'headerSort': true,
											        
											    },
											    
											    
											    /*{
													 'title': 'Wallet ID',
													 'field': 'walletid',
													 'headerSort': true,
												},*/
												{
													 'title': 'Product Code',
													 'field': 'productcd',
													 'headerSort': true,
												},
												{
													'title': 'Transaction Id',
													'field': 'txnid',
													'headerSort': true,
													'visible': false
												},
												
												{
													'title': 'MCC',
													'field': 'mcc',
													'headerSort': true,

												},
												
												/*{
													'title': 'Response',
													'field': 'response',
													'headerSort': true,
													'formatter': function (cell, formatterParams) {
														var respCode = cell.getValue();
														if (typeof respCode === 'undefined') {
															return "00";
														}
														if (respCode == null || respCode == '') {
															return "00";
														}
														return respCode;

													}
												},*/
												
												
												
												{
													'title': 'Payment Reference',
													'field': 'txnnote',
													'headerSort': true,

												},
												
												
												
												/*{
													'title': 'Is Abnormal Hour Txn',
													'field': 'isabnormalhourtxn',
													'headerSort': true,

												},
						*/						
												
												
									/*			{
													'title': 'Final Riskscore',
													'field': 'finalriskscore',
													'headerSort': true,
													'formatter': function (cell, formatterParams) {
												        var score = cell.getValue();
												        if (typeof score === 'undefined') {
												            return "0";
												        }
												        if (score == null || score == '') {
												            return "0";
												        }
												        else 
													         return score;	
												    }

												},*/
												

											
												
												{
													'title': 'Txn Ref Category',
													'field': 'txnrefcategory',
													'headerSort': true,

												}
												
												
												
												
												
												/*{
													'title': 'Payee Mobile Hash',
													'field': 'payeemobilehash',
													'headerSort': true,
													formatter : function(cell, formatterParams){

						                                var updacity = cell.getValue();
						                                if(updacity){
						                                    return (updacity.slice(23, 36));
						                                }
						                                else{
						                                    return "";
						                                }

						                            }
												},*/
												
												
												/*{
													'title': 'Payer Mobile Hash',
													'field': 'payermobilehash',
													'headerSort': true,

												},*/
												
												
												
												
											
											 
											 
										 ]

									 }
									 //end here

 //preferences data
 var getAllList=function(){
								//var selectedChannel = $scope.data.data[0].sourceChannel;
	                            var selectedChannel = $scope.data.data[0].sourceChannel;
								var screen='createManualCase';
								$scope.allColumns='';
	  casesManagement.header($scope.response.token).getPreferencesByUserId({userId:$scope.loggdUserid,channel : selectedChannel, screen: screen},
			  function(data) {
										if(!angular.isUndefined(data.response))
										{
                                           $scope.printIcon = [{
									        	   formatter: printIcon,
									        	   'title': `<input id='selectAll' style="position: absolute;left: 13px;" type='checkbox'/>`,
									        	   'headerSort': false,
									        	   'align': "center",
									        	   'field': 'action_button',
									        	   	'download':false,
									        	   'cellClick': function (e, cell,value,data) {
									        		   getSelectedRow(e,cell,value,data)
									        	   }

									           }]	
                                           
                                           if($scope.data.data[0].sourceChannel=='UPI' )
											 {
												 
													$scope.tabulatorJosnto_add = [
														
														{
												        	 'title': 'Offline Txn',
															 'field': 'offlinetxn',
												        	 'headerSort': false,
												        	 'align': "center",
															formatter:function(cell, formatterParams){
																$scope.offline = cell.getValue();
																
																if($scope.offline != undefined || $scope.offline != null){
																	$scope.offline = cell.getValue().toString();
																	if($scope.offline == 'false'){
																	 
																	             return ($compile(`
																	              
																	<div class="led-yellow"></div> 
																	<span class="onlineColor">Online</span>
																	`)($scope));
																	}else{
																	return ($compile(`
																	 
																	<div class="led-red"></div>
																	<span class="offlineColor">Offline</span>`)($scope));
																	}
																	}
																	else{
																	 
																	             return ($compile(`
																	<div class="led-red"></div>
																	<span class="offlineColor">Offline</span>`)($scope));
																	}

													              
													          }
												        	  
												        	   
												        },
												        { 
													          'title': 'RRN', 
													          'field': 'rrn',
													          formatter:function(cell, formatterParams){
													              var value2 = cell.getValue();
													              return ($compile(`<div popover-trigger="outsideClick" class='rrn_font' popover-class="my-notifications-popover" uib-popover="{{rulenametoString}}"  popover-title="Rule Name - Score" popover-append-to-body="true" popover-placement="right" popover>` + value2 + `</div>`)($scope));
													          }


													    },
													    {
														    'title': 'Response Code',
														    'field': 'responseCode',
														    'headerSort': true,
														    'formatter': function (cell, formatterParams) 
														    {
														        var respCode = cell.getValue();
														        if (typeof respCode === 'undefined') {
														            return "";
														        }
														        if (respCode == null || respCode == '') {
														            return "";
														        }
														        return respCode.toUpperCase();
				
														    }
													   },
													   {
											        	   'title': 'Transaction Id',
											        	   'field': 'txnid',
											        	   'headerSort': true,
											        	   'visible': false
											           },
											           {
													        'title': 'Date & time',
													        'field': 'txndatetime',
													        formatter : function(cell, formatterParams){
													            var updateDate = cell.getValue();
													            if(angular.isUndefined(updateDate)){
													                return 'NA';
													            }else{
													               /* var time = updateDate.slice(11, 19);
													                var res = updateDate.slice(0,10)
													                res = res.split(":", 3).join("-");*/
													            	if(typeof updateDate == 'string'){
													            			var time = updateDate.slice(11, 19);
															                var res = updateDate.slice(0,10)
															                res = res.split(":", 3).join("-");
															                var mydate = moment(new Date(res)).format("DD-MM-YY")
															                return (mydate +" "+ time);
													            	}else{
													                var mydate = moment(new Date(updateDate)).format("DD-MM-YY HH:mm:ss")
													                return mydate ;
													            	}
													            }

													        }	

													    },
													    {
													        'title': 'Txn Amount',
													        'field': 'txnamount',
													        'formatter' : 'money'
													    },
													    
													    {
												        	   'title': 'Fraud Type',
												        	   'headerSort': true,
												        	   'field' : 'casetypecode',

												        	   formatter: function (cell, formatterParams) {
												        		   var value = cell.getValue();
												        		   var tagType = cell.getData().tagType;// refer to line
												        		 
												        		   if(tagType==null || tagType==""){

												        			   return (value);
												        		   }
												        		   if($scope.perspective != 'AML'){
												        			   return ('Fraud - '+tagType);
												        		   }
												        		   else {
												        			   return ('AML - '+tagType);
												        		   }

												        	   }
												           },
												           {
														        'title': 'Fraud Score',
														        'field': 'issuerriskscore',
														        'headerSort': true,
														        'visible' : false,
														        'download':false,
														        'formatter': function (cell, formatterParams) {
															        var score = cell.getValue();
															        if (typeof score === 'undefined') {
															            return "0";
															        }
															        if (score == null || score == '') {
															            return "0";
															        }
															        else 
															         return score;	
															        
															    }
														        
														   },
														   {
														        'title': 'Fraud Score',
														        'field': 'remitterRiskScore',
														        'headerSort': true,
														        'visible' : false,
														        'download':false,
														        'formatter': function (cell, formatterParams) {
															        var score = cell.getValue();
															        if (typeof score === 'undefined') {
															            return "0";
															        }
															        if (score == null || score == '') {
															            return "0";
															        }
															        else 
																         return score;	
															    }
														        
														   },
														   {
														        'title': 'Rule Score',
														        'field': 'issuerrulescore',
														        'headerSort': true,
														        'visible' : false,
														        'download':false,
														        'formatter': function (cell, formatterParams) {
															        var score = cell.getValue();
															        if (typeof score === 'undefined') {
															            return "0";
															        }
															        if (score == null || score == '') {
															            return "0";
															        }
															        else 
																         return score;	
															    }
														        
														    },
														    {
														        'title': 'Rule Score',
														        'field': 'aquirerriskscore',
														        'headerSort': true,
														        'visible' : false,
														        'download':false,
														        'formatter': function (cell, formatterParams) {
															        var score = cell.getValue();
															        if (typeof score === 'undefined') {
															            return "0";
															        }
															        if (score == null || score == '') {
															            return "0";
															        }
															        else 
																         return score;	
															    }
														        
														    },
														    {
														        'title': 'Rule Score',
														        'field': 'remitterrulescore',
														        'headerSort': true,
														        'visible' : false,
														        'download':false,
														        'formatter': function (cell, formatterParams) {
															        var score = cell.getValue();
															        if (typeof score === 'undefined') {
															            return "0";
															        }
															        if (score == null || score == '') {
															            return "0";
															        }
															        else 
																         return score;	
															    }
														        
														    },
														    {
														        'title': 'Rule Score',
														        'field': 'beneficiaryriskscore',
														        'headerSort': true,
														        'visible' : false,
														        'download':false,
														        'formatter': function (cell, formatterParams) {
															        var score = cell.getValue();
															        if (typeof score === 'undefined') {
															            return "0";
															        }
															        if (score == null || score == '') {
															            return "0";
															        }
															        else 
																         return score;	
															    }
														        
														    },
														    
														
														    {
														        'title': 'Model Score',
														        'field': 'finalriskscore',
														        'headerSort': true,
														        'formatter': function (cell, formatterParams) {
															        var score = cell.getValue();
															        if (typeof score === 'undefined') {
															            return "0";
															        }
															        if (score == null || score == '') {
															            return "0";
															        }
															        else 
																         return score;	
															    }
														        

														    },
												        
														    {
													          'title': 'Case Id',
													          'field': 'caseId',
													          'visible' : false,
													          'download':false,
													        }
													    
											           ];
												 
											 }
                                           
                                           else if($scope.data.data[0].sourceChannel=='IMPS'){

												 
												$scope.tabulatorJosnto_add = [
													
													{
											        	   //formatter: blinkIcon,
														 'title': 'Offline Txn',
														 'field': 'offlinetxn',
											        	   'headerSort': false,
											        	   'align': "center",
											        	   formatter:function(cell, formatterParams){
																$scope.offline = cell.getValue();
																if($scope.offline != undefined || $scope.offline != null){
																	$scope.offline = cell.getValue().toString();
																	if($scope.offline == 'false'){
																	 
																	             return ($compile(`
																	              
																	<div class="led-yellow"></div> 
																	<span class="onlineColor">Online</span>
																	`)($scope));
																	}else{
																	return ($compile(`
																	 
																	<div class="led-red"></div>
																	<span class="offlineColor">Offline</span>`)($scope));
																	}
																	}
																	else{
																	 
																	             return ($compile(`
																	<div class="led-red"></div>
																	<span class="offlineColor">Offline</span>`)($scope));
																	}

													              
													          }
											        	  
											        	   
											        },
													
										           
											        {
												          'title': 'Case Id',
												          'field': 'caseId',
												          'visible' : false,
												          'download':false,
												   },
												   { 
												          'title': 'RRN', 
												          'field': 'rrn',
												          formatter:function(cell, formatterParams){
												              var value2 = cell.getValue();
												              return ($compile(`<div popover-trigger="outsideClick" class='rrn_font' popover-class="my-notifications-popover" uib-popover="{{rulenametoString}}"  popover-title="Rule Name - Score" popover-append-to-body="true" popover-placement="right" popover>` + value2 + `</div>`)($scope));
												          }


												    },
												    {
												        'title': 'Date & time',
												        'field': 'txndatetime',
												        formatter : function(cell, formatterParams){
												            var updateDate = cell.getValue();
												            if(angular.isUndefined(updateDate)){
												                return 'NA';
												            }else{
												                /*var time = updateDate.slice(11, 19);
												                var res = updateDate.slice(0,10)
												                res = res.split(":", 3).join("-");*/
												            	if(typeof updateDate == 'string'){
											            			var time = updateDate.slice(11, 19);
													                var res = updateDate.slice(0,10)
													                res = res.split(":", 3).join("-");
													                var mydate = moment(new Date(res)).format("DD-MM-YY")
													                return (mydate +" "+ time);
											            	}else{
											                var mydate = moment(new Date(updateDate)).format("DD-MM-YY HH:mm:ss")
											                return mydate ;
											            	}
												            }

												        }	

												    },
												    {
												        'title': 'Transaction Amount',
												        'field': 'txnamount',
												        'formatter' : 'money'
												        
												     },
												    
												    {
										        	   'title': 'Transaction Id',
										        	   'field': 'txnid',
										        	   'headerSort': true,
										        	   'visible':false,
										        	   'download':false,
										        	    
										           },
										           {
										        	   'title': 'Fraud Type',
										        	   'headerSort': true,
										        	   'field' : 'casetypecode',

										        	   formatter: function (cell, formatterParams) {
										        		   var value = cell.getValue();
										        		   var tagType = cell.getData().tagType;// refer to line
										        		 
										        		   if(tagType==null || tagType==""){

										        			   return (value);
										        		   }
										        		   if($scope.perspective != 'AML'){
										        			   return ('Fraud - '+tagType);
										        		   }
										        		   else {
										        			   return ('AML - '+tagType);
										        		   }

										        	   }
										           },
										           {
												        'title': 'Fraud Score',
												        'field': 'issuerriskscore',
												        'headerSort': true,
												        'visible' : false,
												        'download':false,
												        'formatter': function (cell, formatterParams) {
													        var score = cell.getValue();
													        if (typeof score === 'undefined') {
													            return "0";
													        }
													        if (score == null || score == '') {
													            return "0";
													        }
													        else 
													         return score;	
													        
													    }
												        
												   },
												   {
												        'title': 'Fraud Score',
												        'field': 'remitterRiskScore',
												        'headerSort': true,
												        'visible' : false,
												        'download':false,
												        'formatter': function (cell, formatterParams) {
													        var score = cell.getValue();
													        if (typeof score === 'undefined') {
													            return "0";
													        }
													        if (score == null || score == '') {
													            return "0";
													        }
													        else 
														         return score;	
													    }
												        
												   },
												    {
												        'title': 'Rule Score',
												        'field': 'issuerrulescore',
												        'headerSort': true,
												        'visible' : false,
												        'download':false,
												        'formatter': function (cell, formatterParams) {
													        var score = cell.getValue();
													        if (typeof score === 'undefined') {
													            return "0";
													        }
													        if (score == null || score == '') {
													            return "0";
													        }
													        else 
														         return score;	
													    }
												        
												    },
												    {
												        'title': 'Rule Score',
												        'field': 'aquirerriskscore',
												        'headerSort': true,
												        'visible' : false,
												        'download':false,
												        'formatter': function (cell, formatterParams) {
													        var score = cell.getValue();
													        if (typeof score === 'undefined') {
													            return "0";
													        }
													        if (score == null || score == '') {
													            return "0";
													        }
													        else 
														         return score;	
													    }
												        
												    },
												    {
												        'title': 'Rule Score',
												        'field': 'remitterrulescore',
												        'headerSort': true,
												        'visible' : false,
												        'download':false,
												        'formatter': function (cell, formatterParams) {
													        var score = cell.getValue();
													        if (typeof score === 'undefined') {
													            return "0";
													        }
													        if (score == null || score == '') {
													            return "0";
													        }
													        else 
														         return score;	
													    }
												        
												    },
												    {
												        'title': 'Rule Score',
												        'field': 'beneficiaryriskscore',
												        'headerSort': true,
												        'visible' : false,
												        'download':false,
												        'formatter': function (cell, formatterParams) {
													        var score = cell.getValue();
													        if (typeof score === 'undefined') {
													            return "0";
													        }
													        if (score == null || score == '') {
													            return "0";
													        }
													        else 
														         return score;	
													    }
												        
												    },
												    
												    {
												        'title': 'Model Score',
												        'field': 'finalriskscore',
												        'headerSort': true,
												        'formatter': function (cell, formatterParams) {
													        var score = cell.getValue();
													        if (typeof score === 'undefined') {
													            return "0";
													        }
													        if (score == null || score == '') {
													            return "0";
													        }
													        else 
														         return score;	
													    }
												        

												    }
										           
													];
											 
										 
                                           }
                                           else if($scope.data.data[0].sourceChannel=='NETC'){
                                        	   $scope.tabulatorJosnto_add =[
                                                   {
										        	 'title': 'Offline Txn',
													 'field': 'offlineflag',
										        	 'headerSort': false,
										        	 'align': "center",
													formatter:function(cell, formatterParams){
														$scope.offline = cell.getValue();
														
														if($scope.offline != undefined || $scope.offline != null){
															$scope.offline = cell.getValue().toString();
															if($scope.offline == 'false'){
															 
															             return ($compile(`
															              
															<div class="led-yellow"></div> 
															<span class="onlineColor">Online</span>
															`)($scope));
															}else{
															return ($compile(`
															 
															<div class="led-red"></div>
															<span class="offlineColor">Offline</span>`)($scope));
															}
															}
															else{
															 
															             return ($compile(`
															<div class="led-red"></div>
															<span class="offlineColor">Offline</span>`)($scope));
															}

											              
											          }
										        
                                           		},
                                           		{
	                                     			'title':'Vehicle Tag ID',
	                                     			'field':'vehicletagid',
	                                     			'formatter': function(cell,
	                                           			  formatterParams){
	                                           			    var vclass=cell.getValue()
	                                           			    return vclass.toUpperCase();
	                                           			  },
	                                     			'headerSort': true
	                                     	    },
	                                     	   {
	                                     			'title':'Case Id',
	                                     			'field':'caseId',
	                                     			'headerSort': true
	                                     	    },
                                           		{ 
  										          'title': 'NPCI Reference Value(RRN)', 
  										          'field': 'npcirefid',
  										          formatter:function(cell, formatterParams){
  										              var value2 = cell.getValue();
  										              return ($compile(`<div popover-trigger="outsideClick" class='rrn_font' popover-class="my-notifications-popover" uib-popover="{{rulenametoString}}"  popover-title="Rule Name - Score" popover-append-to-body="true" popover-placement="right" popover>` + value2 + `</div>`)($scope));
  										          }

                                               },
  								
                                           	
	                                     	{
                                     			'title': 'Fraud Type',
                                                 'headerSort': true,
                                                 'field': 'casetypecode',

                                                 formatter: function(cell, formatterParams) {
                                                     var value = cell.getValue();
                                                     var tagType = cell.getData().tagType; // refer
                                                     // to
                                                     // line

                                                     if (tagType == null || tagType == "") {

                                                         return (value);
                                                     }
                                                     if ($scope.perspective != 'AML') {
                                                         return ('Fraud - ' + tagType);
                                                     } else {
                                                         return ('AML - ' + tagType);
                                                     }

                                                 }
                                     		},
	                                     	
                                           	{
                                                       'title': 'Fraud Score',
                                                       'field': 'issuerriskscore',
                                                       'headerSort': true,
                                                       'visible': false,
                                                       'formatter': function(cell, formatterParams) {
                                                           var score = cell.getValue();
                                                           if (typeof score === 'undefined') {
                                                               return "0";
                                                           }
                                                           if (score == null || score == '') {
                                                               return "0";
                                                           } else
                                                               return score;
                                                       }

                                                   },
                                                   {
                                                       'title': 'Fraud Score',
                                                       'field': 'remitterRiskScore',
                                                       'headerSort': true,
                                                       'visible': false,
                                                       'formatter': function(cell, formatterParams) {
                                                           var score = cell.getValue();
                                                           if (typeof score === 'undefined') {
                                                               return "0";
                                                           }
                                                           if (score == null || score == '') {
                                                               return "0";
                                                           } else
                                                               return score;
                                                       }

                                                   },
                                                   {
                                                       'title': 'Rule Score',
                                                       'field': 'issuerrulescore',
                                                       'headerSort': true,
                                                       'visible': false,
                                                       'formatter': function(cell, formatterParams) {
                                                           var score = cell.getValue();
                                                           if (typeof score === 'undefined') {
                                                               return "0";
                                                           }
                                                           if (score == null || score == '') {
                                                               return "0";
                                                           } else
                                                               return score;
                                                       }

                                                   },
                                                   {
                                                       'title': 'Rule Score',
                                                       'field': 'aquirerriskscore',
                                                       'headerSort': true,
                                                       'visible': false,
                                                       'formatter': function(cell, formatterParams) {
                                                           var score = cell.getValue();
                                                           if (typeof score === 'undefined') {
                                                               return "0";
                                                           }
                                                           if (score == null || score == '') {
                                                               return "0";
                                                           } else
                                                               return score;
                                                       }

                                                   },
                                                   {
                                                       'title': 'Rule Score',
                                                       'field': 'remitterrulescore',
                                                       'headerSort': true,
                                                       'visible': false,
                                                       'formatter': function(cell, formatterParams) {
                                                           var score = cell.getValue();
                                                           if (typeof score === 'undefined') {
                                                               return "0";
                                                           }
                                                           if (score == null || score == '') {
                                                               return "0";
                                                           } else
                                                               return score;
                                                       }

                                                   },
                                                   {
                                                       'title': 'Rule Score',
                                                       'field': 'beneficiaryriskscore',
                                                       'headerSort': true,
                                                       'visible': false,
                                                       'formatter': function(cell, formatterParams) {
                                                           var score = cell.getValue();
                                                           if (typeof score === 'undefined') {
                                                               return "0";
                                                           }
                                                           if (score == null || score == '') {
                                                               return "0";
                                                           } else
                                                               return score;
                                                       }

                                                   },

                                                   {
                                                       'title': 'Model Score',
                                                       'field': 'finalriskscore',
                                                       'headerSort': true,
                                                       'formatter': function(cell, formatterParams) {
                                                           var score = cell.getValue();
                                                           if (typeof score === 'undefined') {
                                                               return "0";
                                                           }
                                                           if (score == null || score == '') {
                                                               return "0";
                                                           } else
                                                               return score;
                                                       }


                                                   },
                                           		
                                           	
                                           	
                                        	   ]
                                           }
                                           else if($scope.data.data[0].sourceChannel=='AEPS'){


          									 $scope.tabulatorJosnto_add = [
          										 
          							 			 {
          										          'title': 'frorgamount',
          										          'field': 'frorgamount',
          										          'visible' : false
          										 },
          										/* {
          										          'title': 'acquiringinstitutioncountrycode',
          										          'field': 'acquiringinstitutioncountrycode',
          										          'visible' : false
          										  },*/
          										{
										        	   //formatter: blinkIcon,
													 'title': 'Offline Txn',
													 'field': 'offlinetxn',
										        	   'headerSort': false,
										        	   'align': "center",
										        	   formatter:function(cell, formatterParams){
															$scope.offline = cell.getValue();
															
															if($scope.offline != undefined || $scope.offline != null){
																$scope.offline = cell.getValue().toString();
																if($scope.offline == 'false'){
																 
																             return ($compile(`
																              
																<div class="led-yellow"></div> 
																<span class="onlineColor">Online</span>
																`)($scope));
																}else{
																return ($compile(`
																 
																<div class="led-red"></div>
																<span class="offlineColor">Offline</span>`)($scope));
																}
																}
																else{
																 
																             return ($compile(`
																<div class="led-red"></div>
																<span class="offlineColor">Offline</span>`)($scope));
																}

												              
												          }
										        	  
										        	   
										        },
          									       {
          									        	   'title': 'Fraud Type',
          									        	   'headerSort': true,
          									        	   'field' : 'casetypecode',

          									        	   formatter: function (cell, formatterParams) {
          									        		   var value = cell.getValue();
          									        		   var tagType = cell.getData().tagType;// refer
          																							// to
          																							// line
          									        		 
          									        		   if(tagType==null || tagType==""){

          									        			   return (value);
          									        		   }
          									        		   if($scope.perspective != 'AML'){
          									        			   return ('Fraud - '+tagType);
          									        		   }
          									        		   else {
          									        			   return ('AML - '+tagType);
          									        		   }

          									        	   }
          									         },
          									         {
          											        'title': 'Rule Score',
          											        'field': 'issuerrulescore',
          											        'headerSort': true,
          											        'visible' : false,
          											        'formatter': function (cell, formatterParams) {
          												        var score = cell.getValue();
          												        if (typeof score === 'undefined') {
          												            return "0";
          												        }
          												        if (score == null || score == '') {
          												            return "0";
          												        }
          												        else 
          													         return score;	
          												    }
          											        
          											    },
          											    {
          											        'title': 'Rule Score',
          											        'field': 'aquirerriskscore',
          											        'headerSort': true,
          											        'visible' : false,
          											        'formatter': function (cell, formatterParams) {
          												        var score = cell.getValue();
          												        if (typeof score === 'undefined') {
          												            return "0";
          												        }
          												        if (score == null || score == '') {
          												            return "0";
          												        }
          												        else 
          													         return score;	
          												    }
          											        
          											    },
          											    {
          											        'title': 'Rule Score',
          											        'field': 'remitterrulescore',
          											        'headerSort': true,
          											        'visible' : false,
          											        'formatter': function (cell, formatterParams) {
          												        var score = cell.getValue();
          												        if (typeof score === 'undefined') {
          												            return "0";
          												        }
          												        if (score == null || score == '') {
          												            return "0";
          												        }
          												        else 
          													         return score;	
          												    }
          											        
          											   },
          											   {
          											        'title': 'Rule Score',
          											        'field': 'beneficiaryriskscore',
          											        'headerSort': true,
          											        'visible' : false,
          											        'formatter': function (cell, formatterParams) {
          												        var score = cell.getValue();
          												        if (typeof score === 'undefined') {
          												            return "0";
          												        }
          												        if (score == null || score == '') {
          												            return "0";
          												        }
          												        else 
          													         return score;	
          												    }
          											        
          										      },
          	                                          {
          											          'title': 'DE2 - PAN (User Name)',
          											          'field': 'cardnumber'
          											  },
          										      {
          										        'title': 'DE4 - Transaction Amount',
          										        'field': 'txnamount',
          										        formatter : function(cell, formatterParams){
          										            var frorgamount = Number(cell.getRow().getData().frorgamount);
          										           	var txnamount = Number(cell.getRow().getData().txnamount);
          										            if(frorgamount){
          										            	return (frorgamount.toFixed(2));
          										            }
          										            else{
          										            	return (txnamount.toFixed(2));
          										            }
          										            
          										         }	
          										     },
          										     {
          										        'title': 'DE7 - Date & Time',
          										        'field': 'txndatetime',
          										        formatter : function(cell, formatterParams){
          										            var updateDate = cell.getValue();
          										            if(angular.isUndefined(updateDate)){
          										                return 'NA';
          										            }else{
          										                /*var time = updateDate.slice(11, 19);
          										                var res = updateDate.slice(0,10)
          										                res = res.split(":", 3).join("-");*/
          										            	if(typeof updateDate == 'string'){
											            			var time = updateDate.slice(11, 19);
													                var res = updateDate.slice(0,10)
													                res = res.split(":", 3).join("-");
													                var mydate = moment(new Date(res)).format("DD-MM-YY")
													                return (mydate +" "+ time);
											            	}else{
											                var mydate = moment(new Date(updateDate)).format("DD-MM-YY HH:mm:ss")
											                return mydate ;
											            	}
          										            }

          										        }	

          										     },
          											   {
          											          'title': 'DE12 - Local Transmission Time',
          											          'field': 'localtransactiontime'
          											   },
          											   {
          											          'title': 'DE13 - Local Transmission Date',
          											          'field': 'dateLocaltransactionMMDD'
          											   },
          										       { 
          										          'title': 'RRN', 
          										          'field': 'rrn',
          										          formatter:function(cell, formatterParams){
          										              var value2 =cell.getValue();
          										              return ($compile(`<div popover-trigger="outsideClick" class='rrn_font' popover-class="my-notifications-popover" uib-popover="{{rulenametoString}}"  popover-title="Rule Name - Score" popover-append-to-body="true" popover-placement="right" popover>` + value2 + `</div>`)($scope));
          										       }


          										      },
          									        {
          										        'title': 'Fraud Score',
          										        'field': 'issuerriskscore',
          										        'headerSort': true,
          										        'visible' : false,
          										        'formatter': function (cell, formatterParams) {
          											        var score = cell.getValue();
          											        if (typeof score === 'undefined') {
          											            return "0";
          											        }
          											        if (score == null || score == '') {
          											            return "0";
          											        }
          											        else 
          												         return score;	
          											    }
          										        
          										   },
          										   {
          										        'title': 'Fraud Score',
          										        'field': 'remitterRiskScore',
          										        'headerSort': true,
          										        'visible' : false,
          										        'formatter': function (cell, formatterParams) {
          											        var score = cell.getValue();
          											        if (typeof score === 'undefined') {
          											            return "0";
          											        }
          											        if (score == null || score == '') {
          											            return "0";
          											        }
          											        else 
          												         return score;	
          											    }
          										        
          										   },
          										   /*{
          										        'title': 'Model Score',
          										        'field': 'finalriskscore',
          										        'headerSort': true,
          										        'formatter': function (cell, formatterParams) {
          											        var score = cell.getValue();
          											        if (typeof score === 'undefined') {
          											            return "0";
          											        }
          											        if (score == null || score == '') {
          											            return "0";
          											        }
          											        else 
          												         return score;	
          											    }
          										        

          										    },
          										   
                         							   {
          										          'title': 'Case Id',
          										          'field': 'caseId'
          										   },*/
          										  {
          								        	   'title': 'Transaction Id',
          								        	   'field': 'txnid',
          								        	   'headerSort': true,
          								        	   'visible':false
          								        	    
          								           }
          								           

          										    
          										];	
          								    
                                           }
                                           
                                           else {
											$scope.tabulatorJosnto_add = [
												
												{
										        	//formatter: blinkIcon,
													   'title': 'Offline Txn',
										        	   'field': 'offlinetxn',
										        	   'headerSort': false,
										        	   'align': "center",
										        	   formatter:function(cell, formatterParams){
															$scope.offline = cell.getValue();
															
															if($scope.offline != undefined || $scope.offline != null){
																$scope.offline = cell.getValue().toString();
																if($scope.offline == 'false'){
																 
																             return ($compile(`
																              
																<div class="led-yellow"></div> 
																<span class="onlineColor">Online</span>
																`)($scope));
																}else{
																return ($compile(`
																 
																<div class="led-red"></div>
																<span class="offlineColor">Offline</span>`)($scope));
																}
																}
																else{
																 
																             return ($compile(`
																<div class="led-red"></div>
																<span class="offlineColor">Offline</span>`)($scope));
																}

												              
												          }   
										        },
										        
									           {
											          'title': 'frorgamount',
											          'field': 'frorgamount',
											          'visible' : false
											   },
											   {
											          'title': 'acquiringinstitutioncountrycode',
											          'field': 'acquiringinstitutioncountrycode',
											          'visible' : false
											   },
									           {
											          'title': 'DE02 - PAN',
											          'field': 'cardnumber'
											   },
										       {
											          'title': 'Case Id',
											          'field': 'caseId',
											          'visible' : false,
											          'download':false
											   },
											   { 
											          'title': 'DE37 - RRN', 
											          'field': 'rrn',
											          formatter:function(cell, formatterParams){
											              var value2 = cell.getValue();
											              return ($compile(`<div popover-trigger="outsideClick" class='rrn_font' popover-class="my-notifications-popover" uib-popover="{{rulenametoString}}"  popover-title="Rule Name - Score" popover-append-to-body="true" popover-placement="right" popover>` + value2 + `</div>`)($scope));
											          }


											    },
											    {
											        'title': 'DE07 - Date & time',
											        'field': 'txndatetime',
											        formatter : function(cell, formatterParams){
											            var updateDate = cell.getValue();
											            if(angular.isUndefined(updateDate)){
											                return 'NA';
											            }else{
											               /* var time = updateDate.slice(11, 19);
											                var res = updateDate.slice(0,10)
											                res = res.split(":", 3).join("-");*/
											            	if(typeof updateDate == 'string'){
										            			var time = updateDate.slice(11, 19);
												                var res = updateDate.slice(0,10)
												                res = res.split(":", 3).join("-");
												                var mydate = moment(new Date(res)).format("DD-MM-YY")
												                return (mydate +" "+ time);
										            	}else{
										                var mydate = moment(new Date(updateDate)).format("DD-MM-YY HH:mm:ss")
										                return mydate ;
										            	}
											            }

											        }	

											    },
											    {
											        'title': 'Transaction Amount',
											        'field': 'txnamount',
											        formatter : function(cell, formatterParams){
											            var frorgamount = Number(cell.getRow().getData().frorgamount);
											           // var acquiringinstitutioncountrycode = cell.getRow().getData().acquiringinstitutioncountrycode;
											            var txnamount = Number(cell.getRow().getData().txnamount);
											            if(frorgamount){
											            	return (frorgamount.toFixed(2));
											            }
											            else{
											            	return (txnamount.toFixed(2));
											            }
											            
											         }
											     },
											    
											    
											    
											   
									           {
									        	   'title': 'Transaction Id',
									        	   'field': 'txnid',
									        	   'headerSort': true,
									        	   'visible':false,
									        	   'download':false
									        	    
									           },
									           {
									        	   'title': 'Fraud Type',
									        	   'headerSort': true,
									        	   'field' : 'casetypecode',

									        	   formatter: function (cell, formatterParams) {
									        		   var value = cell.getValue();
									        		   var tagType = cell.getData().tagType;// refer to line
									        		 
									        		   if(tagType==null || tagType==""){

									        			   return (value);
									        		   }
									        		   if($scope.perspective != 'AML'){
									        			   return ('Fraud - '+tagType);
									        		   }
									        		   else {
									        			   return ('AML - '+tagType);
									        		   }

									        	   }
									           },
									           {
											        'title': 'DE48_058 - Fraud Score',
											        'field': 'issuerriskscore',
											        'headerSort': true,
											        'visible' : false,
											        'download':false,
											        'formatter': function (cell, formatterParams) {
												        var score = cell.getValue();
												        if (typeof score === 'undefined') {
												            return "0";
												        }
												        if (score == null || score == '') {
												            return "0";
												        }
												        else 
													         return score;	
												    }
											        
											   },
											   {
											        'title': 'DE48_058 - Fraud Score',
											        'field': 'remitterRiskScore',
											        'headerSort': true,
											        'visible' : false,
											        'download':false,
											        'formatter': function (cell, formatterParams) {
												        var score = cell.getValue();
												        if (typeof score === 'undefined') {
												            return "0";
												        }
												        if (score == null || score == '') {
												            return "0";
												        }
												        else 
													         return score;	
												    }
											        
											   },
											    {
											        'title': 'Rule Score',
											        'field': 'issuerrulescore',
											        'headerSort': true,
											        'visible' : false,
											        'download':false,
											        'formatter': function (cell, formatterParams) {
												        var score = cell.getValue();
												        if (typeof score === 'undefined') {
												            return "0";
												        }
												        if (score == null || score == '') {
												            return "0";
												        }
												        else 
													         return score;	
												    }
											        
											    },
											    {
											        'title': 'Rule Score',
											        'field': 'aquirerriskscore',
											        'headerSort': true,
											        'visible' : false,
											        'download':false,
											        'formatter': function (cell, formatterParams) {
												        var score = cell.getValue();
												        if (typeof score === 'undefined') {
												            return "0";
												        }
												        if (score == null || score == '') {
												            return "0";
												        }
												        else 
													         return score;	
												    }
											        
											    },
											    {
											        'title': 'Rule Score',
											        'field': 'remitterrulescore',
											        'headerSort': true,
											        'visible' : false,
											        'download':false,
											        'formatter': function (cell, formatterParams) {
												        var score = cell.getValue();
												        if (typeof score === 'undefined') {
												            return "0";
												        }
												        if (score == null || score == '') {
												            return "0";
												        }
												        else 
													         return score;	
												    }
											        
											    },
											    {
											        'title': 'Rule Score',
											        'field': 'beneficiaryriskscore',
											        'headerSort': true,
											        'visible' : false,
											        'download':false,
											        'formatter': function (cell, formatterParams) {
												        var score = cell.getValue();
												        if (typeof score === 'undefined') {
												            return "0";
												        }
												        if (score == null || score == '') {
												            return "0";
												        }
												        else 
													         return score;	
												    }
											        
											    },
											    
											    {
											        'title': 'Model Score',
											        'field': 'finalriskscore',
											        'headerSort': true,
											        'formatter': function (cell, formatterParams) {
												        var score = cell.getValue();
												        if (typeof score === 'undefined') {
												            return "0";
												        }
												        if (score == null || score == '') {
												            return "0";
												        }
												        else 
													         return score;	
												    }
											        

											    }
									           
												];
                                           }
			
											
											
											
											$scope.allColumns=data.response.columnPref;
											$scope.tabulatorJosn = 	tabledata;		
											if($scope.allColumns.length){
														$scope.allColumns = $scope.allColumns.map((x)=>{
															return(x.jsonKey)
														})
														
														//filtering the required json for tabulator	
														 $scope.tabulatorJosn = tabledata.filter(function(o) {
														    return $scope.allColumns.some(function(o2) {
														        return o.field === o2;
														    })
														});
														
														

													$scope.tabulatorJosn.sort(function(a, b){
													  return $scope.allColumns.indexOf(a.field) - $scope.allColumns.indexOf(b.field);
													});
														
														
														
											}			
														
										 
										    Array.prototype.push.apply($scope.tabulatorJosnto_add, $scope.tabulatorJosn);   
										    Array.prototype.push.apply($scope.printIcon, $scope.tabulatorJosnto_add);  
														
											//tabulator
														   var newTableData = $scope.printIcon;
														   
														    var table = $("#example-table").tabulator({
														    										 pagination:"local",
														    										 paginationSize:50,
														    										 paginationSizeSelector:true,
																								 rowFormatter:function(row){
																									 row.getElement().on("mouseover", function(){
																										 var rowData = row.getData().txnid;
																										 var value = rowData;
																										 var id=value;
																										 $scope.filtered_ruleName=[];
																										 $scope.rulenametoString = '';
																										 $scope.alertDetails.sort(function(a,b){
																											 return b.riskScoreDetails-a.riskScoreDetails;
																										 })
																										 $scope.filtered_ruleName = $scope.alertDetails.filter((x)=>{
																											 return (x.txnId==id);
																										 });
																										 $scope.final_rulename = $scope.filtered_ruleName.map((y)=>{
																											 return ( y.ruleName + ' - '+ y.riskScoreDetails +' ');
																										 })


																										 $scope.rulenametoString = $scope.final_rulename.toString().split(",").join(", ");
																									 });
																								 },
																								 resizableColumns:false,
																								 movableColumns: true,
																								 columns: newTableData 
																								 
						
																							 });
																							
															var  tabledatabig = $scope.newJsonData;
														    $("#example-table").tabulator("setData", tabledatabig);
															 filteredDataAll=$("#example-table").tabulator("getData");
															 filteredDataAll.filter(x=>{
																 x.isCheck=false;
															 })
															
															 var getSelectedRow = function(jsonData,value,data){
																 $scope.filteredData = $scope.newDataList.filter((x)=>{
																	 return (x.txnid == jsonData.txnid)
																 })
																 


															 }
															 
                                                            //hiding Column based on channel for IMPS
																
															 // condition for all risk score coulmn
						
						
															 if(($scope.data.data[0].caseId.startsWith("I")) ||($scope.data.data[0].caseId.startsWith("i")) ){
																 if($scope.data.data[0].sourceChannel=='RuPayPos' || $scope.data.data[0].sourceChannel=='RuPayAtm' || $scope.data.data[0].sourceChannel=='AEPS' || $scope.data.data[0].sourceChannel=='NETC'){
																	 $("#example-table").tabulator("showColumn","issuerriskscore"); // Fraud Score
																	 $("#example-table").tabulator("showColumn","issuerrulescore"); //Rule Score
																	 //$scope.fraud_score = $scope.data.data[0].caseTransactions[0].issuerRiskScore;
																	 $scope.fraud_score = $scope.data.data[0].issuerScore.riskScore;
																	 
																 }
															 }
						
															 if(($scope.data.data[0].caseId.startsWith("A")) ||($scope.data.data[0].caseId.startsWith("a")) ){
																 if($scope.data.data[0].sourceChannel=='RuPayPos' || $scope.data.data[0].sourceChannel=='RuPayAtm' || $scope.data.data[0].sourceChannel=='AEPS' || $scope.data.data[0].sourceChannel=='NETC'){
																	 $("#example-table").tabulator("showColumn","issuerriskscore");  // Fraud Score
																	 $("#example-table").tabulator("showColumn","aquirerriskscore"); //Rule Score
																	 $scope.fraud_score = $scope.data.data[0].aquirerScore.riskScore;
																	 
																 }
															 }
						
															 if(($scope.data.data[0].caseId.startsWith("R")) ||($scope.data.data[0].caseId.startsWith("r")) ){
																// if($scope.data.data[0].sourceChannel=='UPI' || $scope.data.data[0].sourceChannel=='IMPS' || $scope.data.data[0].sourceChannel=='NETC' ){
																 //Debashis Change
																 if($scope.data.data[0].sourceChannel=='UPI' || $scope.data.data[0].sourceChannel=='IMPS'  ){
																	 $("#example-table").tabulator("showColumn","remitterRiskScore");  // fraud Score
																	 $("#example-table").tabulator("showColumn","remitterrulescore");  // Rule Score
																	 
																	 $scope.fraud_score = $scope.data.data[0].remitterScore.riskScore;
																	 
																	 
																 }
															 }
															 if(($scope.data.data[0].caseId.startsWith("B")) ||($scope.data.data[0].caseId.startsWith("b")) ){
																// if($scope.data.data[0].sourceChannel=='UPI' || $scope.data.data[0].sourceChannel=='IMPS' || $scope.data.data[0].sourceChannel=='NETC'  ){
																 //Debashis Change
																 if($scope.data.data[0].sourceChannel=='UPI' || $scope.data.data[0].sourceChannel=='IMPS'){
																	 $("#example-table").tabulator("showColumn","remitterRiskScore");  // fraud score
																	 $("#example-table").tabulator("showColumn","beneficiaryriskscore") //Rule Score
																	 $scope.fraud_score = $scope.data.data[0].beneficiaryScores.riskScore;
																 }
															 }
						
															 if(($scope.data.data[0].caseId.startsWith("M")) ||($scope.data.data[0].caseId.startsWith("M")) ){
						
																 $("#example-table").tabulator("showColumn","npciriskscore")
						
															 }	
															 
															 $("#download-csv").click(function(){
																 $("#example-table").tabulator("download", "csv", "data.csv");
																});

											//tabulator end			
														
															 $scope.submitFraudTag=function(){

																 if($scope.selectedFraudType.selectedType!='' && !angular.isUndefined(filteredDataAll) && $scope.checkCounter!=0){
																	 if($scope.selectedFraudType.selectedType=='confirmFraud'){
																		 $scope.tagFraud();
																	 }else if($scope.selectedFraudType.selectedType=='tagAML'){
																		 $scope.tagAml();
																	 }else{
																		 $scope.tagOthers($scope.selectedFraudType.selectedType)
																	 }
																 }

															 }

//															 Tag Fraud Cell
															 $scope.tagFraud = function() {
																 var txnid=[]
																 //console.log(filteredDataAll);
																 filteredDataAll.forEach(x=>{
																	 if(x.isCheck==true){
																		 txnid.push(x.txnid);
																	 }
																 })
																 var channel = $scope.data.data[0].sourceChannel;
																 $scope.fraudList = [];
																 $scope.fraudMsg = false;
																 $scope.fraudCode = ""
																 $scope.fraudnote='';
																 $scope.fraudNoteMsg = false;
																 alertService.header({}).fraudList({
																	 channel : channel
																 }, function(data) {
																	 $scope.fraudList = data.response.data;
																 }, function(err) {

																 })
																 $ngConfirm({
																	 title : 'Tag Fraud',
																	 theme : 'Material',
																	 icon : 'fa fa-tag',
																	 content : '<div class="form-group"><select class="form-control" ng-change = "fraudMsg = false" ng-model="fraudCode" ><option style="display:none" label="PLEASE SELECT THE FRAUD TYPE"></option><option ng-repeat="item in fraudList | orderBy:\'fraudTypeDesc\'" value="{{item.fraudTypeCd}}">{{item.fraudTypeDesc}}</option></select><div class="text-danger"  ng-if="fraudMsg"><small>This Is Required Field</small></div></div><div class="form-group"><textarea ng-change = "fraudNoteMsg = false"  ng-model="fraudnote" class="form-control" placeholder="Note"></textarea><div class="text-danger" ng-if="fraudNoteMsg"><small>This Is Required Field</small></div></div>',
																	 scope : $scope,
																	 buttons : {
																		 Ok : {
																			 text : 'Submit',
																			 btnClass : 'btn-red',
																			 action : function(scope, button) {
																			if($scope.fraudCode == "" && $scope.fraudnote == ""){
																				$scope.fraudMsg = true;
																				$scope.fraudNoteMsg = true;
																				return false;
																			}
																			 else if ($scope.fraudCode == "") {
																					 $scope.fraudMsg = true;
																					 return false;
																				 } else if($scope.fraudnote == ""){
																					 $scope.fraudNoteMsg = true;
																					 return false;
																				 }
																			 
																			 else if(txnid.length!=0){
																					 $scope.userInformationDTO = {};
																					 $scope.fraudDto = {};

																					 var caseId = $scope.data.data[0].caseId;
																					 var caseType = $scope.data.data[0].caseType;
																					 $scope.fraudDto.caseId = caseId
																					 var txnArrayConfig=[];
																					 txnid.forEach(x=>{
																						 var obj= {
																								 "businessTxnId": x,
																								 "caseTypeCode": 'Fraud',
																								 "tagType": $scope.fraudCode
																						 }
																						 txnArrayConfig.push(obj);
																					 })
																					 $scope.fraudDto.caseId = caseId
																					 $scope.fraudDto.caseDetailsDTOList=txnArrayConfig
																					 $scope.userInformationDTO.userId= commonDataService.getSessionStorage().userId;
																					 $scope.userInformationDTO.orgId = commonDataService.getLocalStorage().orgId;
																					 $scope.userInformationDTO.notes = ", Note: "+$scope.fraudnote+",";
																					 $scope.userInformationDTO.fetchFromArchive = archive.getArchive();
																					 $scope.fraudDto.userInformationDTO = $scope.userInformationDTO;

																					 alertService
																					 .header({})
																					 .submitFraud(
																							 {
																								 channel : null
																							 },
																							 $scope.fraudDto,
																							 function(data) {


																								 initialize();
																								 toastr.success(
																										 data.message,
																										 Msg.hurrah);
																							 },
																							 function(
																									 err) {

																							 });
																				 }

																			 }
																		 },
																		 Cancel : {
																			 text : 'Cancel',
																			 action : function(scope, button) {
																				 $scope.updateAlert = {};
																				 $scope.userInformationDTO = {};
																				 $scope.alertnote = "";
																				 $scope.actionType = 'ACTIVE'
																					 $scope.fraudnote='';
																			 }

																		 }
																	 },
																 });
															 }

//															 Tag Aml
															 $scope.tagAml = function() {

																 var txnid=[]
																 filteredDataAll.forEach(x=>{
																	 if(x.isCheck==true){
																		 txnid.push(x.txnid);
																	 }
																 })
																 var channel = $scope.data.data[0].sourceChannel;
																 $scope.amlList = [];
																 $scope.amlMsg = false;
																 $scope.amlNoteMsg = false;
																 $scope.amlCode = ""
																	 $scope.amlnote=''
																		 alertService.header({}).amlList({
																			 channel : channel
																		 }, function(data) {
																			 $scope.amlList = data.response.data;
																		 }, function(err) {

																		 })
																		 $ngConfirm({
																			 title : 'Tag AML',
																			 theme : 'Material',
																			 icon : 'fa fa-tag',
																			 content : '<div class="form-group"><select class="form-control" ng-change = "amlMsg = false" ng-model="amlCode" ><option style="display:none" label="PLEASE SELECT THE AML TYPE"></option><option ng-repeat="item in amlList" value="{{item.amlTypeCd}}">{{item.amlTypeDesc}}</option></select><div class="text-danger" ng-if="amlMsg"><small>This Is Required Field</small></div></div><div class="form-group"><div class="text-danger" ng-if="channelCodeMsg"><small>This is a required field</small></div></div><div class="form-group"><textarea  ng-model="amlnote" ng-change = "amlNoteMsg = false" class="form-control" placeholder="Note"></textarea><div class="text-danger" ng-if="amlNoteMsg"><small>This Is Required Field</small></div></div>',
																			 scope : $scope,
																			 buttons : {
																				 Ok : {
																					 text : 'Submit',
																					 btnClass : 'btn-red',
																					 action : function(scope, button) {
																						 
																					if($scope.amlCode == "" && $scope.amlnote == ""){
																						$scope.amlMsg = true;
																						$scope.amlNoteMsg = true;
																						
																						return false
																					}
																					 else if ($scope.amlCode == "") {
																							 $scope.amlMsg = true;
																							 return false;
																						 } else if ($scope.amlnote == ""){
																							 $scope.amlNoteMsg = true;
																							 return false;
																						 }
																						 
																						 else  {

																							 $scope.userInformationDTO = {};
																							 $scope.fraudDto = {};
																							 var caseId = $scope.data.data[0].caseId;
																							 var caseType = $scope.data.data[0].caseType;
																							 var txnArrayConfig=[];
																							 txnid.forEach(x=>{
																								 var obj= {
																										 "businessTxnId": x,
																										 "caseTypeCode": 'AML',
																										 "tagType": $scope.amlCode
																								 }
																								 txnArrayConfig.push(obj);
																							 })
																							 $scope.fraudDto.caseId = caseId
																							 $scope.fraudDto.caseDetailsDTOList=txnArrayConfig
																							 $scope.userInformationDTO.userId = commonDataService.getSessionStorage().userId;
																							 $scope.userInformationDTO.orgId = commonDataService.getLocalStorage().orgId;
																							 $scope.userInformationDTO.notes = ", Note: "+$scope.amlnote+",";
																							 $scope.userInformationDTO.fetchFromArchive = archive.getArchive();
																							 $scope.fraudDto.userInformationDTO = $scope.userInformationDTO;

																							 alertService
																							 .header({})
																							 .submitFraud(
																									 {
																										 channel : null
																									 },
																									 $scope.fraudDto,
																									 function(
																											 data) {

																										 initialize();
																										 toastr
																										 .success(
																												 data.message,
																												 Msg.hurrah);
																									 },
																									 function(
																											 err) {

																									 });
																						 }

																					 }
																				 },
																				 Cancel : {
																					 text : 'Cancel',
																					 action : function(scope, button) {
																						 $scope.updateAlert = {};
																						 $scope.userInformationDTO = {};
																						 $scope.alertnote = "";
																						 $scope.actionType = 'ACTIVE'

																					 }

																				 }
																			 },
																		 });

															 }

															 $scope.tagOthers = function(selectedOtherTag) {
																
																 $scope.otherNote = '';
																 $scope.noteMsg = false;
																 var selectedOtherTag = selectedOtherTag;
																 var txnid=[]
																 filteredDataAll.forEach(x=>{
																	 if(x.isCheck==true){
																		 txnid.push(x.txnid);
																	 }
																 })
																 var txnArrayConfig=[];
																				 txnid.forEach(x=>{
																					 var obj= {
																							 "businessTxnId": x,
																							 "caseTypeCode": selectedOtherTag,
																							 "tagType": ''
																					 }
																					 txnArrayConfig.push(obj);
																				 })
																		
																 $ngConfirm({
																	 title : 'Tag Others',
																	 theme : 'Material',
																	 icon : 'fa fa-tag',
																	 content : '<div class="form-group"><textarea  ng-model="otherNote" ng-change = "noteMsg = false" class="form-control" placeholder="Note"></textarea><div class="text-danger" ng-if="noteMsg"><small>This Is Required Field</small></div></div>',
																	 scope : $scope,
																	 buttons : {
																		 Ok : {
																			 text : 'Submit',
																			 btnClass : 'btn-red',
																			 action : function(scope, button) {
																				 if ($scope.otherNote == "") {
																					 $scope.noteMsg = true;
																					 return false;
																				 } else {
																				
																				 var channel = $scope.data.data[0].sourceChannel;
																				
																				 $scope.userInformationDTO = {};
																				 $scope.fraudDto = {};
																				 var caseId = $scope.data.data[0].caseId;
																				 var caseType = $scope.data.data[0].caseType;
																				 $scope.fraudDto.caseId = caseId
																				 
																				 $scope.fraudDto.caseDetailsDTOList=txnArrayConfig;
																				 $scope.userInformationDTO.userId = commonDataService.getSessionStorage().userId.toString();
																				 $scope.userInformationDTO.orgId = commonDataService.getLocalStorage().orgId;
																				 $scope.userInformationDTO.fetchFromArchive = archive.getArchive();
																				 $scope.userInformationDTO.notes = ", Note: "+$scope.otherNote+",";
																				 $scope.fraudDto.userInformationDTO = $scope.userInformationDTO;

																				 alertService
																				 .header({})
																				 .submitFraud(
																						 {
																							 channel : null
																						 },
																						 $scope.fraudDto,
																						 function(
																								 data) {

																							 initialize();
																							 toastr
																							 .success(
																									 data.message,
																									 Msg.hurrah);
																						 },
																						 function(
																								 err) {
																							 $scope.updateAlert = {};
																							 $scope.userInformationDTO = {};
																							 $scope.alertnote = "";
																							 $scope.actionType = 'ACTIVE'
																							 $scope.fraudnote='';
																						 });
																			    }
																				 
																			 }
																		 },Cancel : {
																			 text : 'Cancel',
																			 action : function(scope, button) {
																				 $scope.updateAlert = {};
																				 $scope.userInformationDTO = {};
																				 $scope.alertnote = "";
																				 $scope.actionType = 'ACTIVE'
																				 $scope.fraudnote='';

																			 }

																		 }
																		 
																	 }
																 })

																
															 }

															 $scope.updateAlertModel = function(alertId) {
																 $scope.updateAlert = {};
																 $scope.userInformationDTO = {};
																 $scope.alertnote = "";
																 $scope.actionType = 'ACTIVE';
																 $ngConfirm({
																	 title : 'Change Status',
																	 theme : 'Material',
																	 icon : 'fa fa-edit',
																	 content : '<div class="form-group">' +
																	 '<select class="form-control" ng-model="actionType" name="actionType" class="admin_input" id="actionType" ng-options="item.value as item.name for item in actionTypes" required></select><div class="text-danger" ng-show="showMsg"><small>This is a required field</small></div></div><div class="form-group"><textarea ng-model="alertnote" class="form-control" placeholder="Note"></textarea></div>',
																	 scope : $scope,
																	 buttons : {
																		 Ok : {
																			 text : 'Submit',
																			 btnClass : 'btn-red',
																			 action : function(scope, button) {
																				 $scope.updateAlert.alertId = alertId;
																				 $scope.updateAlert.caseId = $scope.data.data[0].caseId;
																				 $scope.userInformationDTO.userId = commonDataService.getSessionStorage().userId;
																				 $scope.userInformationDTO.orgId = commonDataService.getLocalStorage().orgId;
																				 $scope.userInformationDTO.actionType = $scope.actionType;
																				 $scope.userInformationDTO.notes = $scope.alertnote;
																				 $scope.updateAlert.userInformationDTO = $scope.userInformationDTO;

																				 alertService
																				 .header({})
																				 .updateAlert(
																						 $scope.updateAlert,
																						 function(data) {
																							 initialize();
																							 toastr
																							 .success(
																									 "Alert Updated Successfully",
																									 Msg.hurrah);
																						 },
																						 function(err) {

																						 });
																			 }
																		 },
																		 Cancel : {
																			 text : 'Cancel',
																			 action : function(scope, button) {
																				 $scope.updateAlert = {};
																				 $scope.userInformationDTO = {};
																				 $scope.alertnote = "";
																				 $scope.actionType = 'ACTIVE'

																			 }

																		 }
																	 },
																 });
															 }

															 $scope.closeCaseModal = function() {
																 $scope.closeCase = {};
																 $scope.userInformationDTO = {};
																 $scope.closeCasenote = "";
																 $scope.closeCaseNoteMsg = false;
																 $ngConfirm({
																	 title : 'Close Case',
																	 theme : 'Material',
																	 icon : 'fa fa-times',
																	 content : '<div class="form-group"><textarea ng-change="closeCaseNoteMsg = false" ng-model="closeCasenote" class="form-control" placeholder="Note"></textarea><div class="text-danger" ng-if="closeCaseNoteMsg"><small>This is a required field</small></div></div>',
																	 scope : $scope,
																	 buttons : {
																		 Ok : {
																			 text : 'Submit',
																			 btnClass : 'btn-red',
																			 action : function(scope, button) {
																				 if ($scope.closeCasenote == "") {

																					 $scope.closeCasenote = ""
																						 $scope.closeCaseNoteMsg = true;

																					 return false;

																				 } else {
																					 var caseId = $scope.data.data[0].caseId;
																					 $scope.userInformationDTO.userId = commonDataService.getSessionStorage().userId;
																					 $scope.userInformationDTO.orgId = commonDataService.getLocalStorage().orgId;
																					 $scope.userInformationDTO.actionType = "MANUAL_CLOSE";
																					 $scope.userInformationDTO.notes = $scope.closeCasenote;
																					 $scope.closeCase.userInformationDTO = $scope.userInformationDTO;

																					 casesManagement
																					 .header({})
																					 .closecase(
																							 {
																								 caseId : caseId
																							 },
																							 $scope.closeCase,
																							 function(
																									 data) {
																								 initialize();
																								 toastr
																								 .success(
																										 data.response.data,
																										 Msg.hurrah);

																							 },
																							 function(
																									 err) {

																							 });
																				 }
																			 }
																		 },
																		 Cancel : {
																			 text : 'Cancel',
																			 action : function(scope, button) {
																				 $scope.updateAlert = {};
																				 $scope.userInformationDTO = {};
																				 $scope.alertnote = "";
																				 $scope.actionType = 'ACTIVE'

																			 }

																		 }
																	 },
																 });

															 }

											//tabulator functions end
															 
											
										}
										
										else 
										{
													$scope.allColumns={};
										}

							},
			  function(err){
									toastr.error("No Preference found", Msg.oops);
							}
						);
													
			}
   getAllList(); 	 
 //end	

								 }


							 }
						 }, 
						 function(err) {
						 })

						

			 }




			 /*
			  * *************************************************search Transaction code starts here***************************************************************
			  */

			 $scope.transactionFun = function(data){

				 $scope.storeallData1=$scope.data.data[0].caseTransactions.map((x)=>{
					 return x.txnjson;
				 });
				 $scope.isDisabled = false;
				 var objs = $scope.storeallData1.map(JSON.parse);
				 $scope.findingmmid = objs
				 $scope.someObject = {}
				 $scope.datatobeUsed = data;
				 $scope.second_pack = false;
				 $scope.orgId = commonDataService.getLocalStorage().orgId;
				 $scope.userId = commonDataService.getSessionStorage().userId;
				 $scope.response = statusService.getResponseMessage();
				 $scope.authority = $scope.response.usersAuthoritiesPermissionsDto.authority;
				 $scope.rolePermission = RolePermissionMatrix;
				 $scope.someObject.ucard_number = '';
				 $scope.searchTxnData = [];
				 $scope.showme_flag = false;
				 $scope.enableme = true;
				 $scope.searchId_input = '';
				 $scope.someObject = {};
				 $scope.toDate1 = moment(new Date()).format("DD-MM-YYYY")
				 $scope.fromDate1 = moment().subtract(3, 'months').format('DD-MM-YYYY');
				 $scope.count = 0;
				 $scope.hideSearch = false;
				 $scope.someObject.ucard_number = $scope.datatobeUsed.data[0].cardNumber;
				 $scope.someObject.acquiring_id = $scope.datatobeUsed.data[0].caseTransactions[0].acqInstId;
				 $scope.someObject.remittermmidandmobilenumber =  $scope.findingmmid[0].remittermmidandmobilenumber;
				 $scope.someObject.mid = $scope.datatobeUsed.data[0].caseTransactions[0].mid;
				 //$scope.someObject.vehicleTagId = $scope.datatobeUsed.data[0].caseTransactions[0].vehicletagid;
				 $scope.someObject.tid = $scope.datatobeUsed.data[0].caseTransactions[0].tid;
				 $scope.someObject.payer_ifc = $scope.datatobeUsed.data[0].payerIfsc;
				 $scope.someObject.payer_acctNo = $scope.datatobeUsed.data[0].caseTransactions[0].payerAccountNo;
				 $scope.someObject.payee_ifsc = $scope.datatobeUsed.data[0].payeeIfsc;
				 $scope.someObject.payee_acctNo = $scope.datatobeUsed.data[0].caseTransactions[0].payeeAccountNo;
				 $scope.someObject.card_no = true;
				 $scope.someObject.acq_id = true;
				 $scope.someObject.mid_check = true;
				 $scope.someObject.tid_check = true;
				 $scope.someObject.is_payerifc = true;
				 $scope.someObject.is_payer_acctNo = true;
				 $scope.someObject.is_payeifc = true;
				 $scope.someObject.is_payee_acctNo = true;
				 $scope.someObject.isr_todate = true;
				 $scope.someObject.isr_frmdate = true
				 $scope.currentPage = 1;
				 $scope.pageSize = 10;
				 $scope.pageSizeNo = 0;
				 $scope.isSuccess = false;
				 /*$scope.someObject.toDate1 = moment(new Date()).format("DD-MM-YYYY")
				 $scope.someObject.fromDate1 = moment().subtract(7, 'days').format('DD-MM-YYYY');*/
				 $scope.someObject.toDate1 = moment(new Date()).format("DD-MM-YYYY");
                 $scope.someObject.fromDate1 = moment().subtract(1, 'days').format('DD-MM-YYYY');
                 $scope.maxtoDate =  moment(new Date()).format("DD-MM-YYYY");
				 var today = new Date();
				 $scope.someObject.frm_time = new Date (new Date().toDateString() + ' ' + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds());
				 $scope.someObject.to_time = new Date (new Date().toDateString() + ' ' +  today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds());
				 casesManagement2.header($scope.response.token).channel( {}, function(response) {
					 $scope.channel_code = response.response;
					 $scope.filterChannel($scope.channel_code);
				 },
				 function(err) {

				 });

				 casesManagement.header($scope.response.token).organisations( 
						 { 
							 organisationID : $scope.orgId
						 },
						 function(response) {
							 $scope.orgarnisations = response.response;
							 $scope.orgarnisations = $scope.orgarnisations.filter((x)=>{
								 return (x.orgId == $scope.bankCode)
							 })
							 $scope.SelectedOrdid = $scope.orgarnisations[0];
					         $scope.SelectedOrdid_val = $scope.SelectedOrdid;



						 },
						 function(err) {
						 });	

$scope.change_channel = function(case_channel){
					 if(case_channel){
						 $scope.second_pack = true;
						 $scope.channel = case_channel;

					 }
					 else{
						 // $scope.init();
						 $scope.second_pack = false;
					 }

				 }
				 var perspective=commonDataService.getLocalStorage().perspective;
				 $scope.perspectiveArray = perspective.split(",");
				 if ($scope.perspectiveArray[0] == 'undefined') {
					 $scope.perspectiveArray = [];
				 }

				 if ($scope.perspectiveArray.length == 1) {
					 $scope.SelectedPerspective = $scope.perspectiveArray[0];
					 $scope.desableme = true;
				 }else if($scope.perspectiveArray.length>1){
					 $scope.desableme = false;
					 if($scope.perspectiveArray[0]=='ISSUER'){
						 $scope.SelectedPerspective = $scope.perspectiveArray[0];
					 }else if($scope.perspectiveArray[1]=='ISSUER'){
						 $scope.SelectedPerspective = $scope.perspectiveArray[1];
					 }

				 }

				 $scope.setPrespective = function(SelectedPerspective){
					 $scope.SelectedPerspective = SelectedPerspective;
				 }


				 $scope.userInformationDTO =
				 {
						 userInformationDTO: {
							 userId : $scope.userId,
							 orgId : $scope.orgId,
							 isPlainText : commonDataService.getLocalStorage().p2Visibility == 1 ? true : false

						 }


				 }
				 if($scope.channel == 'AEPS'){
					 $scope.userInformationDTO.userInformationDTO.isPlainText = false;
				 }else{
					 $scope.userInformationDTO.userInformationDTO.isPlainText = commonDataService.getLocalStorage().p2Visibility == 1 ? true : false
				 }


			 }

			 $scope.filterChannel = function(channel) {
				 $scope.caseChannel = channel.filter((x)=>{

					 return (x.channelCode ==  $scope.datatobeUsed.data[0].sourceChannel)
				 })
				 $scope.someObject.channel= $scope.caseChannel[0].channelCode;
				 $scope.someObject.newChannel_code = channel;
				 $scope.second_pack = true;
				 $scope.userInformationDTO.channel = $scope.caseChannel[0].channelCode;

			 }

			 $scope.search_popup = function(search_code){
				 localStorage.setItem("searchId",search_code );
				 $scope.SearchIDList = localStorage.getItem("searchId");
				 $scope.hideSearch=true;
				 $scope.search_id = search_code;
				 $scope.channel_code = '';
				 $scope.SearchIDList = $scope.search_id;

			 }


			 /* Manual Case Created */
			 $scope.manual_create_popup = function(caseID){
				 $scope.created_case_id = caseID;
				 $ngConfirm({
					 title : 'Success',
					 theme : 'Material',
					 icon : 'fa fa-check',
					 content: '<span class="alert_text">Case created sucessfully with case Id: <input ng-model="created_case_id" readonly=""></input><a copy-to-clipboard={{search_id}} data-toggle="tooltip" data-placement="right" title="Copy to clipboard"><i style ="margin-left:0; color:#000;" class="fa fa-clipboard" aria-hidden="true"></i></a></span>',
					 scope : $scope,
					 buttons : {
						 Ok : {
							 text : 'OK',
							 btnClass : 'btn-red',
							 action : function(
									 scope,
									 button) {



							 }
						 }

					 }
				 });
			 }
			 
			/* $scope.fetchSearchIdByUserId = function(searchTrnsId){
				 $scope.isDisabled = false;
				 if(typeof searchTrnsId != "undefined"){
					 var startTime = new Date().getTime();

					 $scope.transactionList = searchTrnsId;
					 $scope.nodataMsg="true";
					 // $scope.myVarinterval =
					 // setInterval($scope.searchTransactionsById($scope.transactionList),
					 // 1000);
					 $scope.myVarinterval = setInterval(function(){
						 if(new Date().getTime() - startTime > 300000){
							 $scope.$apply(function () {
								 $scope.nodataMsg = "false";
							 });
							 clearInterval($scope.myVarinterval);
							 return;
						 }
						 $scope.searchTransactionsById($scope.transactionList);
					 }, 5000);    
				 }
			 }*/
			 
             $scope.fetchSearchIdByUserId = function(searchTrnsId,transactionDto) {
                 if (typeof searchTrnsId != "undefined") {
                     var startTime = new Date().getTime();

                     $scope.transactionList = searchTrnsId;
                     $scope.myVarinterval = setInterval(function() {
                         if (new Date().getTime() - startTime > 300000) {
                             $scope.$apply(function() {
                                 $scope.nodataMsg = "false";
                             });

                             // $scope.nodataMsg = true;
                             clearInterval($scope.myVarinterval);
                             return;
                         }
                         $scope.searchTransactionsById($scope.transactionList,null,null);
                     }, 5000);
                 }
                 

             }
             
             $scope.searchTransactionsById = function(transaction,caseId,txnId) {
             	
                 $scope.selected = transaction;
                 $scope.showme_flag = true;
                // $scope.viewDisabled = true;
                 //$scope.$broadcast('timer-reset',{otp : otp});
                 casesManagement2.header($scope.response.token).searchTransactionResultCount({
                         searchId: transaction,
                         channel:$scope.someObject.channel
                     },
                     function(response) {
                     	
                     	
                     	if (response.response.completionStatus == "F") {
                     		clearInterval($scope.myVarinterval);
                         	$scope.nodataMsg = "false"; 
                         	$scope.totalRecords = 0;
                         	$scope.isSuccess = true;
                         	$scope.isDisabled = false
                     	}

                         if (response.response.completionStatus == "C") {
                         	
                         	 casesManagement2.header($scope.response.token).searchResult({
                                  searchId: transaction,
                                  channel:$scope.someObject.channel,
                                  pageNumber:$scope.pageSizeNo
                              },
                              function(response) {
                             	 $scope.totalRecords = response.response.totalElements;
                             	 $scope.nodataMsg = "somthingelse";
                             	 $scope.isPendingtext = false;
                             	$scope.isDisabled = false
                             	 $scope.numberOfPages = response.response.totalPages;
                                  $scope.isSuccess = true;
                             	 clearInterval($scope.myVarinterval);
                                  $scope.findCaseId(response.response.content,caseId,txnId)
                                  
                              },
                              function(err) {
                             	 $scope.nodataMsg = "false";
                             	 $scope.isDisabled = false
                             	 clearInterval($scope.myVarinterval);
                              });
                         	
                         }

                     },
                     function(err) {
                     	clearInterval($scope.myVarinterval);
                     	$scope.nodataMsg = "false"; 
                     	$scope.isDisabled = false
                     });



             }
             
             $scope.findCaseId = function(data,caseId,txnId){
            	 $scope.newJsonData2 = [];
                 $scope.newJsonData2 = data;
                 var printIcon = function(cell, formatterParams)
				 {
					 return ( $compile(`<div class="dropdown" id="user_info_action_dropdown">
					 <button class="btn dropdown-toggle button-width" type="button" data-toggle="dropdown"><span class="fa fa-cog add_red" aria-hidden="true"></span>
					 </button>
					 <ul class="dropdown-menu drop-downadj drop-downadj2 adjust_createcase" id="user_info_action_dropdown_action">
					 <li ><a ng-click="createCase()" id="create_case" href="#"><span  class="glyphicon" aria-hidden="true">&#xe081; Create</span></a></li>
					 </ul>										 
					 </div>`)($scope) )
					 if(cell.getRow().getData().caseId == null || typeof cell.getRow().getData().caseId == 'undefined'){
                            return ($compile(`<div class="dropdown" id="user_info_action_dropdown">
								  <button class="btn dropdown-toggle button-width" type="button" data-toggle="dropdown"><span class="fa fa-cog add_red" aria-hidden="true"></span>
								  </button>
								  <ul class="dropdown-menu drop-downadj drop-downadj2 adjust_createcase" id="user_info_action_dropdown_action">
								   <li ><a ng-click="createCase()" id="create_case" href="#"><span  class="glyphicon" aria-hidden="true">&#xe081; Create</span></a></li>
								  </ul>										 
								</div>`)($scope))
                        	}else{
                        		 return ($compile(`<div class="dropdown" id="user_info_action_dropdown">
										  <button class="btn dropdown-toggle button-width" type="button" disabled data-toggle="dropdown"><span class="fa fa-cog add_red" aria-hidden="true"></span>
										  </button>
										 									 
										</div>`)($scope))
                        	}

				 }


				

				 var checkTable = $( "#example-table2" ).hasClass( "tabulator" )
				 if (checkTable) {
					 $("#example-table2").tabulator("destroy");

				 }
                
				 //Array.prototype.push.apply($scope.tabulatorJosnto_add, $scope.tabulatorJosn);
				 var newTableData_trans = $scope.tabulatorJosn;
				 var table = $("#example-table2").tabulator({
					 pagination:"local",
					    paginationSize:50,
					    paginationSizeSelector:true, 
					 rowFormatter:function(row){
						 row.getElement().on("mouseover", function(){
							 var rowData = row.getData().txnid;
							 var value = rowData;
							 var id=value;
							 $scope.filtered_ruleName=[];
							 $scope.rulenametoString = '';
							 $scope.alertDetails.sort(function(a,b){
								 return b.riskScoreDetails-a.riskScoreDetails;
							 })
							 $scope.filtered_ruleName = $scope.alertDetails.filter((x)=>{
								 return (x.txnId==id);
							 });
							 $scope.final_rulename = $scope.filtered_ruleName.map((y)=>{
								 return ( y.ruleName + ' - '+ y.riskScoreDetails +' ');
							 })
                             $scope.rulenametoString = $scope.final_rulename.toString().split(",").join(", ");
						 });
					 },

			     columns:  $scope.tabulatorJosnto_add
			 
				 })

				 var  tabledatabig = $scope.newJsonData2;

				 $("#example-table2").tabulator("setData", tabledatabig);
				 $("#example-table2").tabulator("showColumn","caseId"); 
				 
				 $scope.totalRecords1 = $scope.totalRecords;
				 if(($scope.data.data[0].caseId.startsWith("I")) ||($scope.data.data[0].caseId.startsWith("i")) ){
					 if($scope.data.data[0].sourceChannel=='RuPayPos' || $scope.data.data[0].sourceChannel=='RuPayAtm' || $scope.data.data[0].sourceChannel=='NETC'){
						 $("#example-table2").tabulator("showColumn","issuerriskscore"); // Fraud Score
						 $("#example-table2").tabulator("showColumn","issuerrulescore"); //Rule Score
						 
						 
					 }
				 }

				 if(($scope.data.data[0].caseId.startsWith("A")) ||($scope.data.data[0].caseId.startsWith("a")) ){
					 if($scope.data.data[0].sourceChannel=='RuPayPos' || $scope.data.data[0].sourceChannel=='RuPayAtm' || $scope.data.data[0].sourceChannel=='NETC'){
						 $("#example-table2").tabulator("showColumn","issuerriskscore");  // Fraud Score
						 $("#example-table2").tabulator("showColumn","aquirerriskscore"); //Rule Score
						
						 
					 }
				 }

				 if(($scope.data.data[0].caseId.startsWith("R")) ||($scope.data.data[0].caseId.startsWith("r")) ){
					 if($scope.data.data[0].sourceChannel=='UPI' || $scope.data.data[0].sourceChannel=='IMPS' ){
						 $("#example-table2").tabulator("showColumn","remitterRiskScore");  // fraud Score
						 $("#example-table2").tabulator("showColumn","remitterrulescore");  // Rule Score
					 }
				 }
				 if(($scope.data.data[0].caseId.startsWith("B")) ||($scope.data.data[0].caseId.startsWith("b")) ){
					 if($scope.data.data[0].sourceChannel=='UPI' || $scope.data.data[0].sourceChannel=='IMPS' ){
						 $("#example-table2").tabulator("showColumn","remitterRiskScore");  // fraud score
						 $("#example-table2").tabulator("showColumn","beneficiaryriskscore") //Rule Score
						 
					 }
				 }

				 if(($scope.data.data[0].caseId.startsWith("M")) ||($scope.data.data[0].caseId.startsWith("M")) ){

					 $("#example-table2").tabulator("showColumn","npciriskscore")

				 }	
				 
				 // my COde Done Here
				 $("#download-csv1").click(function(){
					 $("#example-table2").tabulator("download", "csv", "data.csv");
					});
             }

/*			 $scope.searchTransactionsById = function(){
				 $scope.selected2 = $scope.transactionList;
				 $scope.showme_flag = true;

				 casesManagement2.header($scope.response.token).searchTransactionResultCount( {
					 searchId : $scope.selected2
				 },
				 function(response) {
					 
					 if(response.status==200){
						 if(response.response.searchStatus == "COMPLETED" && response.response.count < 1)
						 {
								clearInterval($scope.myVarinterval);
								$scope.nodataMsg = "false";
								$scope.isSuccess = false;
							}
						 if(response.response.searchStatus == "COMPLETED" && response.response.count >= 1)
						 {
							    $scope.totalRecords = response.response.count
					            $scope.numberOfPages = Math.ceil($scope.totalRecords/$scope.pageSize);
								$scope.isSuccess = true;
							 
								casesManagement2.header($scope.response.token).searchTransactionById( {
									searchId : $scope.selected2,
									offset   : $scope.pageSizeNo
								},
								function(response) {
									
									 
									 $scope.nodataMsg = "somthingelse";
									 $scope.newJsonData2 =[];
									 $scope.newJsonData2 = response.response.data;
									 var newObject ={}
									 var fraudAmlArray2 =[];
									 $scope.storeallData2=$scope.newJsonData2.map((x)=>{
										 return x.tiSearchResultJson;
									 });
									 var objs2 = $scope.storeallData2.map(JSON.parse);
									 var combined2 = [];
									 if($scope.data.data[0].sourceChannel=='AEPS'){
										 for (var i = 0; i < $scope.newJsonData2.length; i++) {
											 fraudAmlArray2.push({
												 cardnumber1:objs2[i].cardnumberenc, // due to bad data structure from response we are taking it from inside
												 caseId:$scope.newJsonData2[i].caseId,
												 remitterRiskScore : $scope.newJsonData2[i].remitterRiskScore,
												 responsecode : $scope.newJsonData2[i].responseCode,
												 payermobile : $scope.isPlainText ? objs2[i].payermobile : objs2[i].payermobileenc,
												 payeemobile : $scope.isPlainText ? objs2[i].payeemobile : objs2[i].payeemobileenc,
												 payerifscaccountno : $scope.isPlainText ? objs2[i].payerifsc + objs2[i].payeraccountno : objs2[i].payeraccountnoenc,
												 payeeifscaccountno : $scope.isPlainText ? objs2[i].payeeifsc + objs2[i].payeeaccountno : objs2[i].payeeaccountnoenc,
												 payeraccountno : $scope.isPlainText ? objs2[i].payeraccountno : objs2[i].payeraccountnoenc,
												 payeeaccountno : $scope.isPlainText ? objs2[i].payeeaccountno : objs2[i].payeeaccountnoenc,		 
											     payervpa : $scope.isPlainText ? objs2[i].payervpa : objs2[i].payervpaenc,
											     payeevpa : $scope.isPlainText ? objs2[i].payeevpa : objs2[i].payeevpaenc,
											     id	: newJsonData2[i].id	 
												  
												 
											});
										 }
									 }else if($scope.data.data[0].sourceChannel=='NETC'){
										 for (var i = 0; i < $scope.newJsonData2.length; i++) {
											 fraudAmlArray2.push({
												 payervpa : $scope.isPlainText ? objs2[i].payervpa : objs2[i].payervpaenc,
												 payeevpa : $scope.isPlainText ? objs2[i].payeevpa : objs2[i].payeevpaenc
											});
										 }
									 }
									 
									 else{
										 
										 for (var i = 0; i < $scope.newJsonData2.length; i++) {
											 fraudAmlArray2.push({
												 cardnumber1:$scope.newJsonData2[i].cardNumber,
												 caseId:$scope.newJsonData2[i].caseId,
												 remitterRiskScore : $scope.newJsonData2[i].remitterRiskScore,
												 responsecode : $scope.newJsonData2[i].responseCode,
												 payermobile : $scope.isPlainText ? objs2[i].payermobile : objs2[i].payermobileenc,
												 payeemobile : $scope.isPlainText ? objs2[i].payeemobile : objs2[i].payeemobileenc,
												 payerifscaccountno : $scope.isPlainText ? objs2[i].payerifsc + objs2[i].payeraccountno : objs2[i].payeraccountnoenc,
												 payeeifscaccountno : $scope.isPlainText ? objs2[i].payeeifsc + objs2[i].payeeaccountno : objs2[i].payeeaccountnoenc,
												 payeraccountno : $scope.isPlainText ? objs2[i].payeraccountno : objs2[i].payeraccountnoenc,
												 payeeaccountno : $scope.isPlainText ? objs2[i].payeeaccountno : objs2[i].payeeaccountnoenc,		 
												 payervpa : $scope.isPlainText ? objs2[i].payervpa : objs2[i].payervpaenc,
												 payeevpa : $scope.isPlainText ? objs2[i].payeevpa : objs2[i].payeevpaenc,		 
												  
												 
											});
										 }
									 }
									 
									clearInterval($scope.myVarinterval);
									 
									 
								     objs2.forEach((itm, i) => {
										 combined2.push(Object.assign({}, itm, fraudAmlArray2[i]))
									 });
								     $scope.newJsonData2 = combined2;
									 $scope.searchTxnData = response.response.data; 

									 var printIcon = function(cell, formatterParams)
									 {
										 return ( $compile(`<div class="dropdown" id="user_info_action_dropdown">
										 <button class="btn dropdown-toggle button-width" type="button" data-toggle="dropdown"><span class="fa fa-cog add_red" aria-hidden="true"></span>
										 </button>
										 <ul class="dropdown-menu drop-downadj drop-downadj2 adjust_createcase" id="user_info_action_dropdown_action">
										 <li ><a ng-click="createCase()" id="create_case" href="#"><span  class="glyphicon" aria-hidden="true">&#xe081; Create</span></a></li>
										 </ul>										 
										 </div>`)($scope) )
										 if(cell.getRow().getData().caseId == null || typeof cell.getRow().getData().caseId == 'undefined'){
	                                            return ($compile(`<div class="dropdown" id="user_info_action_dropdown">
													  <button class="btn dropdown-toggle button-width" type="button" data-toggle="dropdown"><span class="fa fa-cog add_red" aria-hidden="true"></span>
													  </button>
													  <ul class="dropdown-menu drop-downadj drop-downadj2 adjust_createcase" id="user_info_action_dropdown_action">
													   <li ><a ng-click="createCase()" id="create_case" href="#"><span  class="glyphicon" aria-hidden="true">&#xe081; Create</span></a></li>
													  </ul>										 
													</div>`)($scope))
	                                        	}else{
	                                        		 return ($compile(`<div class="dropdown" id="user_info_action_dropdown">
	       												  <button class="btn dropdown-toggle button-width" type="button" disabled data-toggle="dropdown"><span class="fa fa-cog add_red" aria-hidden="true"></span>
	       												  </button>
	       												 									 
	       												</div>`)($scope))
	                                        	}

									 }


									 var checkTable = $( "#example-table2" ).hasClass( "tabulator" )
									 if (checkTable) {
										 $("#example-table2").tabulator("destroy");

									 }
		                            
									 //Array.prototype.push.apply($scope.tabulatorJosnto_add, $scope.tabulatorJosn);
									 var newTableData_trans = $scope.tabulatorJosn;
									 var table = $("#example-table2").tabulator({
										 pagination:"local",
										    paginationSize:50,
										    paginationSizeSelector:true, 
										 rowFormatter:function(row){
											 row.getElement().on("mouseover", function(){
												 var rowData = row.getData().txnid;
												 var value = rowData;
												 var id=value;
												 $scope.filtered_ruleName=[];
												 $scope.rulenametoString = '';
												 $scope.alertDetails.sort(function(a,b){
													 return b.riskScoreDetails-a.riskScoreDetails;
												 })
												 $scope.filtered_ruleName = $scope.alertDetails.filter((x)=>{
													 return (x.txnId==id);
												 });
												 $scope.final_rulename = $scope.filtered_ruleName.map((y)=>{
													 return ( y.ruleName + ' - '+ y.riskScoreDetails +' ');
												 })
                                                 $scope.rulenametoString = $scope.final_rulename.toString().split(",").join(", ");
											 });
										 },

								     columns:  $scope.tabulatorJosnto_add
								 
									 })

									 var  tabledatabig = $scope.newJsonData2;

									 $("#example-table2").tabulator("setData", tabledatabig);
									 $("#example-table2").tabulator("showColumn","caseId"); 
									 
									 if(($scope.data.data[0].caseId.startsWith("I")) ||($scope.data.data[0].caseId.startsWith("i")) ){
										 if($scope.data.data[0].sourceChannel=='RuPayPos' || $scope.data.data[0].sourceChannel=='RuPayAtm' || $scope.data.data[0].sourceChannel=='NETC'){
											 $("#example-table2").tabulator("showColumn","issuerriskscore"); // Fraud Score
											 $("#example-table2").tabulator("showColumn","issuerrulescore"); //Rule Score
											 
											 
										 }
									 }

									 if(($scope.data.data[0].caseId.startsWith("A")) ||($scope.data.data[0].caseId.startsWith("a")) ){
										 if($scope.data.data[0].sourceChannel=='RuPayPos' || $scope.data.data[0].sourceChannel=='RuPayAtm' || $scope.data.data[0].sourceChannel=='NETC'){
											 $("#example-table2").tabulator("showColumn","issuerriskscore");  // Fraud Score
											 $("#example-table2").tabulator("showColumn","aquirerriskscore"); //Rule Score
											
											 
										 }
									 }

									 if(($scope.data.data[0].caseId.startsWith("R")) ||($scope.data.data[0].caseId.startsWith("r")) ){
										 if($scope.data.data[0].sourceChannel=='UPI' || $scope.data.data[0].sourceChannel=='IMPS' ){
											 $("#example-table2").tabulator("showColumn","remitterRiskScore");  // fraud Score
											 $("#example-table2").tabulator("showColumn","remitterrulescore");  // Rule Score
										 }
									 }
									 if(($scope.data.data[0].caseId.startsWith("B")) ||($scope.data.data[0].caseId.startsWith("b")) ){
										 if($scope.data.data[0].sourceChannel=='UPI' || $scope.data.data[0].sourceChannel=='IMPS' ){
											 $("#example-table2").tabulator("showColumn","remitterRiskScore");  // fraud score
											 $("#example-table2").tabulator("showColumn","beneficiaryriskscore") //Rule Score
											 
										 }
									 }

									 if(($scope.data.data[0].caseId.startsWith("M")) ||($scope.data.data[0].caseId.startsWith("M")) ){

										 $("#example-table2").tabulator("showColumn","npciriskscore")

									 }	
									 
									 // my COde Done Here
									 $("#download-csv1").click(function(){
										 $("#example-table2").tabulator("download", "csv", "data.csv");
										});
									 
								},
								function(err){
									clearInterval($scope.myVarinterval);
								});
							 
						 } } },
						 function(err) {
							 
						 });

			 }*/

			 $scope.makePagination = function(pageSizeCheck){
					
				  localStorage.setItem("pageSizeCheckfortrns", pageSizeCheck);
				  /*$scope.memoryUsageFunc(pageSizeCheck);*/
				  $scope.searchTransactionsById($scope.transactionList,null,null);
				  $scope.pageSizeNo = (pageSizeCheck - 1) * 10;
				 // alert($scope.pageSizeNo)
				  
			}  


			 $scope.copyID = function(){
				 $scope.search_id.select();
				 document.execCommand("copy");

			 }

			 $scope.sort = function(keyname){
				 $scope.sortKey = keyname;   // set the sortKey to the param passed
				 $scope.reverse = !$scope.reverse; // if true make it false and vice versa
				 if(keyname == 'queueCode'){
					 $scope.queueCodeSort = !$scope.queueCodeSort;
				 }
				 if(keyname == 'queueName'){
					 $scope.queueNameSort = !$scope.queueNameSort;
				 }
			 }



			 var getSelectedRow = function(jsondata){

				 $scope.createCase = function(){

					 $scope.TxnDTO = 
					 {
							 userInformationDTO: { userId : $scope.userId, orgId : $scope.orgId, actionType : 'MANUAL_CREATE', notes : "manual create"  },
							 gatewayData: { channel : jsondata.channel, txnType : 'FINANCIAL'},
							 searchId : $scope.transactionList,
							 txnId : jsondata.txnid,


					 }
					 casesManagement2.header($scope.response.token).createCase( {searchId:null} , $scope.TxnDTO ,
							 function(response) {
						 // $scope.searchTransactionsById($scope.transactionList);
						 $scope.manual_create_popup(response.response.data.caseId);
					 },
					 function(err) {
					 });	

				 }


			 }



			 $scope.searchTransaction = function() {
				 $scope.totalRecords = 0;
				 $scope.withoutCaseId = true;
				 $scope.isSuccess =false;
				 $scope.nodataMsg = 'true'
				   $scope.isDisabled = true; // disable button on single click
				 /*if(typeof $scope.productcd != "undefined" || $scope.someObject.channel =='UPI' || $scope.someObject.channel =='IMPS'){*/
					 var checkTable = $( "#example-table2" ).hasClass( "tabulator" )
					 if (checkTable) {
						 $("#example-table2").tabulator("destroy");

					 }	
					 
					 var perspectiveObj;
					 var channel = $scope.someObject.channel;
					 var SelectedPerspective = $scope.SelectedPerspective;

					 if (channel=='IMPS'||channel=='UPI') {
						 if(SelectedPerspective == "ISSUER"){
							 perspectiveObj = "R"
						 }
						 if (SelectedPerspective == "ACQUIRER") {
							 perspectiveObj = "B";
						 }
						 if (SelectedPerspective == "AML") {
							 perspectiveObj = "M";
						 }

					 }
					 if (channel=='RuPayPos'||channel=='RuPayAtm'||channel=='AEPS'||channel=='NETC') {
						 if(SelectedPerspective == "ISSUER"){
							 perspectiveObj = "I"
						 }
						 if (SelectedPerspective == "ACQUIRER") {
							 perspectiveObj = "A";
						 }
						 if (SelectedPerspective == "AML") {
							 perspectiveObj = "M";
						 }

					 }
					 
					 $scope.prespectiveForCaseId = perspectiveObj;
					 $scope.userInformationDTO.perspective = perspectiveObj;
					 $scope.userInformationDTO.orgId = $scope.SelectedOrdid_val.orgId;
					 

					 if($scope.cardnumberFlag)
					 {
						
						 if(channel=='AEPS'){
							 $scope.userInformationDTO.cardNumber = $scope.someObject.ucard_number; 
							 $scope.userInformationDTO.userInformationDTO.isPlainText = false;
						 }
						 else if(commonDataService.getLocalStorage().p2Visibility != 1){
							 $scope.userInformationDTO.cardNumber = $scope.someObject.ucard_number;
							 
						 }
						 else{
							 $scope.userInformationDTO.cardNumber = $scope.someObject.ucard_number;
						 }
					 }

					 if($scope.acqInidFlag){
						 $scope.userInformationDTO.acquiringinstitutionid = $scope.someObject.acquiring_id;
					 }
					 if($scope.remitterMMIDAndMobilenumberflag){
						 $scope.userInformationDTO.remitterMMIDAndMobilenumber = $scope.someObject.remittermmidandmobilenumber;
					 }

					 if($scope.midFlag){
						 $scope.userInformationDTO.mid = $scope.someObject.mid;
					 }
					 if($scope.tidFlag){
						 $scope.userInformationDTO.tid = $scope.someObject.tid;
					 }
					 if($scope.payerifcFlag){
						 $scope.userInformationDTO.payerIfsc = $scope.someObject.payer_ifc;
					 }
					 if($scope.payerifcFlag){
						 $scope.userInformationDTO.payerIfsc = $scope.someObject.payer_ifc;
					 }
					 if($scope.veichleTagFlag){
						 $scope.userInformationDTO.vehicleTagId = $scope.someObject.vehicleTagId;
					 }
					 if($scope.payeraccountFlag){
						 if(commonDataService.getLocalStorage().p2Visibility != 1)
						 {
							 $scope.userInformationDTO.payerAccountno  = $scope.someObject.payer_acctNo;
						 }
						 else{
							 $scope.userInformationDTO.payerAccountno = $scope.someObject.payer_acctNo;
						 }
						 
					 }
					 if($scope.payeeaccountFlag){
						 if(commonDataService.getLocalStorage().p2Visibility != 1)
						 {
							 $scope.userInformationDTO.payeeAccountno  = $scope.someObject.payee_acctNo;
						 }
						 else{
							 $scope.userInformationDTO.payeeAccountno = $scope.someObject.payee_acctNo;
						 }
						 
					 }

					 if($scope.someObject.isr_todate){
						 
						 $scope.userInformationDTO.tiSearchtoDate = $scope.someObject.toDate1;
						 var date1 = new Date($scope.someObject.to_time);
						 var datevalues1 = ('0' + date1.getDate()).slice(-2) + '-' + ('0' + (date1.getMonth() + 1)).slice(-2) + '-' + date1.getFullYear();
						 $scope.fromDate1=datevalues1;

						 var hours1 =  date1.getHours();
						 var checkLength2 = hours1.toString().length;
						 if(checkLength2 == 1)
						 {
							 hours1 = '0' + date1.getHours();
						 }
						 var minutes1 = "0" + date1.getMinutes();
						 var seconds1 = "0" + date1.getSeconds();
						 var formattedTime1= new Date(date1.getFullYear(), ('0' + (date1.getMonth() + 1)).slice(-2), date1.getDate(), hours1, minutes1.substr(-2), seconds1.substr(-2));
						 $scope.fromTime=formattedTime1;
						 $scope.fromTime1=hours1 + ':' + minutes1.substr(-2) + ':' + seconds1.substr(-2);
						 $scope.userInformationDTO.endTime = $scope.fromTime1;
					 }
					 if($scope.someObject.isr_frmdate){

						 
						 $scope.userInformationDTO.tiSearchfromDate =$scope.someObject.fromDate1;
						 var date2 = new Date($scope.someObject.frm_time);
						 var datevalues2 = ('0' + date2.getDate()).slice(-2) + '-' + ('0' + (date2.getMonth() + 1)).slice(-2) + '-' + date2.getFullYear();
						 $scope.fromDate2=datevalues2;
						 var hours2 =  date2.getHours();
						 var checkLength = hours2.toString().length;

						 if(checkLength == 1)
						 {
							 hours2 = '0' + date2.getHours(); 
						 }
						 var minutes2 = "0" + date2.getMinutes();
						 var seconds2 = "0" + date2.getSeconds();
						 var formattedTime2= new Date(date2.getFullYear(), ('0' + (date2.getMonth() + 1)).slice(-2), date2.getDate(), hours2, minutes2.substr(-2), seconds2.substr(-2));
						 $scope.fromTime11=formattedTime1;
						 $scope.fromTime2=hours2 + ':' + minutes2.substr(-2) + ':' + seconds2.substr(-2);
						 $scope.userInformationDTO.startTime = $scope.fromTime2;
						 if($scope.productcd == ""){
								$scope.userInformationDTO.productCd = null;
							}if($scope.productcd != ""){
							$scope.userInformationDTO.productCd = $scope.productcd;
							}
						 //$scope.userInformationDTO.productCd = $scope.productcd;
						 //if($scope.someObject.channel =='UPI' || $scope.someObject.channel =='IMPS' || $scope.someObject.channel =='NETC'){
							//Debashis Change
							if($scope.someObject.channel =='UPI' || $scope.someObject.channel =='IMPS'){
							 $scope.userInformationDTO.productCd = null;
						 }
					 }


					 var updatedDto =  $scope.userInformationDTO
	                   delete updatedDto['userInformationDTO'];
	                   delete updatedDto['channel'];
					 casesManagement2.header(localStorage.getItem("sessionToken")).searchTransactions( {selectedchannel:$scope.someObject.channel},updatedDto,
							 function(data)
							 {
						 
						 $scope.search_popup(data.response.searchId);
						 $scope.fetchSearchIdByUserId(data.response.searchId,$scope.userInformationDTO);
						 //$scope.fetchSearchIdByUserId(data.response.data.txnSearchEventId);
						 // $scope.transactionFun($scope.data);

							 },
							 function(err) {
								 $scope.isDisabled = false;
							 });
/*				 }*/
				 
				/* else{
					 $scope.showProductCdMsg = true;
				 }*/
					 $("#download-csv1").click(function(){
						 $("#example-table2").tabulator("download", "csv", "data.csv");
						});
			 }
			 $scope.isSelected = function(transaction) {
				 return $scope.selected === transaction;
			 }


			 /*
			  * **************************************************************end of Search
			  * Transactions**********************************************************************
			  */


			 // $scope.autoCaseAssign();
			 $scope.prespectiveDisplay = function(prespective){
				 var str = prespective;
				 if(prespective == "ACQUIRER" && ($scope.someObject.channel == "UPI" || $scope.someObject.channel == "IMPS" )){
					 return str = "BENEFICIARY"
				 }else if(prespective == "ISSUER" && ($scope.someObject.channel == "UPI" || $scope.someObject.channel == "IMPS")){
					 return str = "REMITTER"
				 }else{
					 return str;
				 }

			 }
			 initialize();
			 
             $scope.viewAllCase = function(searchArchived){
             	let transacListData = [];
             	
             	transacListData = $scope.newJsonData2.map(function(txn) {
             		  return txn.txnid;
             	});
             	
             	
             	$scope.withoutCaseId = false;
             	casesManagement2.header(localStorage.getItem("sessionToken")).searchCaseIdResult({prespective:$scope.prespectiveForCaseId,searchArchived:searchArchived}, transacListData,
                         function(data) {
             				if(data.response){
	                                for(var i=0;i<$scope.newJsonData2.length;i++){
	                                	for(var j = 0; j < data.response.length; j++) {                               		
		                                    if($scope.newJsonData2[i].txnid == data.response[j].txnId){
		                                         $scope.newJsonData2[i].caseId =  data.response[j].caseId;
		                                         $scope.newJsonData2[i].isArchived =  data.response[j].archived;  
		                                    }
	                                	}
	                                }
             				}
                             $scope.findCaseId($scope.newJsonData2,null,null)
                            
                         },
                         function(err) {});
             	
             	 
             }


             $scope.chnageDate = function() {
                 var partscheck = $scope.someObject.fromDate1.split('-');
                 var mydatecheck = new Date(partscheck[2], partscheck[1] - 1, partscheck[0]);
                 var datecheck = new Date(Date.parse(mydatecheck));

                 var topartscheck = $scope.someObject.toDate1.split('-');
                 var tomydatecheck = new Date(topartscheck[2], topartscheck[1] - 1, topartscheck[0]);
                 var todatecheck = new Date(Date.parse(tomydatecheck));
                
 /*                if (new Date(todatecheck) < new Date(datecheck)) {

                     $scope.showMiMaxDateMsg = true;
                 } else {
                     $scope.showMiMaxDateMsg = false;
                 }*/
                 var parts = $scope.someObject.fromDate1.split('-');
                 var mydate = new Date(parts[2], parts[1] - 1, parts[0]);
                 var date = new Date(Date.parse(mydate));
                 date.setDate(date.getDate());
                 var mintoDate = date.toDateString();
                 $scope.mintoDate = new Date(Date.parse(mintoDate));
                 $scope.maxtoDate = moment(new Date(Date.parse(mydate))).add(1, 'days').format("DD-MM-YYYY");
                 $scope.someObject.toDate1 = moment(new Date(Date.parse(mydate))).add(1, 'days').format("DD-MM-YYYY");
             }

             $scope.toDate = function() {

                 var partscheck = $scope.someObject.fromDate1.split('-');
                 var mydatecheck = new Date(partscheck[2], partscheck[1] - 1, partscheck[0]);
                 var datecheck = new Date(Date.parse(mydatecheck));

                 var topartscheck = $scope.someObject.toDate1.split('-');
                 var tomydatecheck = new Date(topartscheck[2], topartscheck[1] - 1, topartscheck[0]);
                 var todatecheck = new Date(Date.parse(tomydatecheck));
                /* if (new Date(todatecheck) < new Date(datecheck)) {

                     $scope.showMiMaxDateMsg = true;
                 } else {
                     $scope.showMiMaxDateMsg = false;
                 }*/
             }
             
             $scope.showIsArchiveModel = function(){
           	   $ngConfirm({
         			title: 'Search Archive Case',
         			theme: 'Material',
         			//icon: 'fa fa-unlock',
         			content: 'Do you want to search archive case?',
         			scope: $scope,
         			buttons: {
         				Ok: {
         					text: 'Yes',
         					btnClass: 'btn-red',
         					action: function(scope, button){
         						$scope.viewAllCase(true)
         					}
         				},
         				Cancel: {
         					text: 'No',
         					btnClass: 'btn-red',
         					action: function(scope, button){
         						$scope.viewAllCase(false)
         					}
         				}
         			}
         		});
              }


				 } ])