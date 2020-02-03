'use strict';

angular.module('efrm.dashboard')
    .controller('viewTransactionsController',
        [
            '$scope',
            '$state',
            'casesManagement2',
            'casesManagement',
            'statusService',
            'UserService',
            'Session',
            '$ngConfirm',
            'RolePermissionMatrix',
            'toastr',
            'Msg',
            'commonDataService',
            '$compile',
            function(
                $scope,
                $state,
                casesManagement2,
                casesManagement,
                statusService,
                UserService,
                Session,
                $ngConfirm,
                RolePermissionMatrix,
                toastr,
                Msg,
                commonDataService,
                $compile
            ) {

                $scope.init = function() {
               
                	$scope.submitted = false;
                	//$scope.SelectedOrdid = {}
                	//$scope.SelectedOrdid.selected = undefined;
                	//$scope.SelectedOrdid.selected = undefined;
                	$scope.isPendingtext = false;
                	$scope.viewDisabled = false;
                    $scope.productcd = "";
                    $scope.second_pack = false;
                    $scope.orgId = commonDataService.getLocalStorage().orgId;
                    $scope.userId = commonDataService.getSessionStorage().userId;
                    $scope.response = statusService.getResponseMessage();
                    $scope.authority = $scope.response.usersAuthoritiesPermissionsDto.authority;
                    $scope.rolePermission = RolePermissionMatrix;
                    $scope.showMiMaxDateMsg = false;
                    $scope.showResult = false;
                    $scope.ucard_number = '';
                    $scope.txn_amt = '';
                    $scope.product_code = '';
                    $scope.Issuer_bin = '';
                    $scope.acquiring_id = '';
                    $scope.mcc_mdl = '';
                    $scope.fromDate1 = '';
                    $scope.toDate1 = '';
                    $scope.payee_mobile = '';
                    $scope.payer_mobile = '';
                    $scope.mid = '';
                    $scope.tid = '';
                    $scope.payee_vpa = '';
                    $scope.payer_vpa = '';
                    $scope.payer_ifc = '';
                    $scope.payee_ifsc = '';
                    $scope.payer_acctNo = '';
                    $scope.payee_acctNo = '';
                    $scope.stip = '';
                    $scope.rrn = '';
                    $scope.search_id = '';
                    $scope.searchTxnData = [];
                    $scope.toptenlist = [];
                    $scope.showme_flag = false;
                    $scope.enableme = true;
                    $scope.searchId_input = '';
                    $scope.someObject = {};
                    $scope.orgarnisations = [];
                    $scope.someObject.toDate1 = moment(new Date()).format("DD-MM-YYYY");
                    $scope.someObject.fromDate1 = moment().subtract(1, 'days').format('DD-MM-YYYY');
                    $scope.maxtoDate =  moment(new Date()).format("DD-MM-YYYY");
                    $scope.count = 0;
                    $scope.desableme = false;
                    $scope.showMax_min_value = 0;
                    var today = new Date();
                    $scope.currentPage = 1;
                    $scope.pageSize = 50;
                    $scope.someObject.defaulttime = new Date(new Date().toDateString() + ' ' + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds());
                    $scope.someObject.frm_time = new Date(new Date().toDateString() + ' ' + '00' + ":" + '00' + ":" + '00');
                    $scope.someObject.to_time = new Date(new Date().toDateString() + ' ' + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds());
                    var myVarinterval;
                    $scope.nodataMsg = "true";
                    $scope.pageSizeNo = 0;
                    $scope.isSuccess = false;
                    $scope.withoutCaseId = true;
                    $scope.isPlainText = commonDataService.getLocalStorage().p2Visibility == 1 ? true : false

                    casesManagement.header($scope.response.token).organisations({
                            organisationID: $scope.orgId
                        },
                        function(response) {
                            $scope.orgarnisations = response.response;

                        },
                        function(err) {});
                    var perspective = commonDataService.getLocalStorage().perspective;
                    $scope.perspectiveArray = perspective.split(",");
                    if ($scope.perspectiveArray[0] == 'undefined') {
                        $scope.perspectiveArray = [];
                    }

                    if ($scope.perspectiveArray.length == 1) {
                        $scope.SelectedPerspective = $scope.perspectiveArray[0];
                        $scope.desableme = true;
                    } else if ($scope.perspectiveArray.length > 1) {
                        $scope.desableme = false;
                        if ($scope.perspectiveArray[0] == 'ISSUER') {
                            $scope.SelectedPerspective = $scope.perspectiveArray[0];
                        } else if ($scope.perspectiveArray[1] == 'ISSUER') {
                            $scope.SelectedPerspective = $scope.perspectiveArray[1];
                        }

                    }

                    $scope.setPrespective = function(SelectedPerspective) {
                        $scope.SelectedPerspective = SelectedPerspective;
                    }
                    $scope.setOrgid = function(SelectedOrdid) {
                        $scope.SelectedOrdid_val = SelectedOrdid; // npci
                    }


                    $scope.operator = [{
                            key: "greater than or equal to",
                            value: "0"
                        },
                        {
                            key: "less than or equal to",
                            value: "1"
                        },
                        {
                            key: "between",
                            value: "2"
                        },
                        {
                            key: "equal to",
                            value: "3"
                        }
                    ];
                    $scope.result = $scope.operator[0];
                    $scope.userInformationDTO = {
                        userInformationDTO: {
                            userId: $scope.userId,
                            orgId: $scope.orgId,
                            isPlainText: commonDataService.getLocalStorage().p2Visibility == 1 ? true : false

                        }


                    }


                    casesManagement2.header($scope.response.token).channel({},
                        function(response) {
                            $scope.channel_code = response.response;

                        },
                        function(err) {

                        });
                }


                $scope.productcdlist = [{
                        name: "ATM",
                        val: "ATM"
                    },
                    {
                        name: "POS",
                        val: "POS"
                    },
                    {
                        name: "ECOM",
                        val: "ECOM"
                    }
                ]

                $scope.changedProductCd = function(productCd) {
                    $scope.productcd = productCd;
                }

                $scope.isClicked = false;
                $scope.stopFight = function() {
                    if (angular.isDefined($scope.myVarinterval)) {
                        clearInterval($scope.myVarinterval);
                        stop = undefined;
                    }
                };

                $scope.$on('$destroy', function() {
                    $scope.stopFight();
                });

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
                
             

              
                
                $scope.searchFinalTransaction = function(searchTrnsId){
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
                
                $scope.changeInAmnt = function(result) {
                    $scope.someObject.txn_amt = null;
                    $scope.someObject.minAmount = null;
                    $scope.someObject.maxAmount = null;
                    $scope.showMax_min_value = result.value;
                }
                /* Manual Case Created */
                $scope.manual_create_popup = function(caseID) {
                    $scope.created_case_id = caseID;
                    $scope.search_id = $scope.created_case_id;
                    $ngConfirm({
                        title: 'Success',
                        theme: 'Material',
                        icon: 'fa fa-check',
                        content: '<span class="alert_text">Case created sucessfully with case Id: <input ng-model="created_case_id" readonly=""></input><a copy-to-clipboard={{search_id}} data-toggle="tooltip" data-placement="right" title="Copy to clipboard"><i style ="margin-left:0; color:#000;" class="fa fa-clipboard" aria-hidden="true"></i></a></span>',
                        scope: $scope,
                        buttons: {
                            Ok: {
                                text: 'OK',
                                btnClass: 'btn-red',
                                action: function(
                                    scope,
                                    button) {



                                }
                            }

                        }
                    });
                }

                
                $scope.loading = function(mytime){
                	
                		$scope.nodataMsg = 'somethingelse'; 
    			    	$scope.viewDisabled = false;
    			    	if($scope.isPendingStatus == 'PENDING'){
    			    		$scope.isPendingtext = true;
    			    	}
                	  			   
    			}


                $scope.searchTransactionsById = function(transaction,caseId,txnId) {
                	
                    $scope.selected = transaction;
                    $scope.showme_flag = true;
                   // $scope.viewDisabled = true;
                    //$scope.$broadcast('timer-reset',{otp : otp});
                    casesManagement2.header($scope.response.token).searchTransactionResultCount({
                            searchId: transaction,
                            channel:$scope.searchchannel
                        },
                        function(response) {
                        	
                        	
                        	if (response.response.completionStatus == "F") {
                        		clearInterval($scope.myVarinterval);
                            	$scope.nodataMsg = "false"; 
                            	$scope.totalRecords = 0;
                            	$scope.isSuccess = true;
                        	}

                            if (response.response.completionStatus == "C") {
                            	
                            	 casesManagement2.header($scope.response.token).searchResult({
                                     searchId: transaction,
                                     channel:$scope.searchchannel,
                                     pageNumber:$scope.pageSizeNo
                                 },
                                 function(response) {
                                	 $scope.totalRecords = response.response.totalElements;
                                	 $scope.nodataMsg = "somthingelse";
                                	 $scope.isPendingtext = false;
                                	 
                                	 $scope.numberOfPages = response.response.totalPages;
                                     $scope.isSuccess = true;
                                	 clearInterval($scope.myVarinterval);
                                     $scope.findCaseId(response.response.content,caseId,txnId)
                                     
                                 },
                                 function(err) {
                                	 $scope.nodataMsg = "false";
                                	 clearInterval($scope.myVarinterval);
                                 });
                            	
                            }

                        },
                        function(err) {
                        	clearInterval($scope.myVarinterval);
                        	$scope.nodataMsg = "false"; 
                        });



                }
                
                $scope.findCaseId = function(data,caseId,txnId){
 
                            $scope.newJsonData = [];
                            $scope.newJsonData = data
                            if(caseId != null && txnId != null){
                                
                            	for(var i=0;i<$scope.newJsonData.length;i++){
                                      if($scope.newJsonData[i].txnid == txnId){
                                           $scope.newJsonData[i].caseId =  caseId          
                                      }
                            	}
                            }

                            $scope.offline = false;

                            var blink = `<span ng-if="offline == false">
							 <div class="led-yellow"></div> 
							 <span class="onlineColor">Online</span></span>
							 <span ng-if="offline != false">
							 <div class="led-red"></div>
							 <span class="offlineColor">Offline</span></span>`;

                            var blinkIcon = function(cell, formatterParams) {
                                return ($compile(blink)($scope))
                            };

                            var printIcon = function(cell, formatterParams) {
                            	
                            	if((cell.getRow().getData().isArchived == true || typeof cell.getRow().getData().caseId == 'undefined')&&!$scope.withoutCaseId ){
                            		
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


                            var checkTable = $("#example-table").hasClass("tabulator")
                            if (checkTable) {
                                $("#example-table").tabulator("destroy");

                            }

                            var tabledata = [];

                            if ($scope.channel == 'AEPS') {

                                tabledata = [
                                   
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
                                    {
                                        'title': 'DE18 - MCC',
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
                                        'formatter': function(cell, formatterParams) {
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
                                        'title': 'DE41 - Card Acceptor Terminal Identification',
                                        'field': 'tid'
                                    },
                                    {
                                        'title': 'DE43_1-23 - Card Acceptor Name/Address',
                                        'field': 'cardAcceptorNameLocation',
                                        'headerSort': true,
                                        formatter: function(cell, formatterParams) {
                                            var updateName = cell.getValue();
                                            if (updateName) {
                                                return (updateName.slice(0, 22));
                                            } else {
                                                return "";
                                            }

                                        }
                                    },
                                    {
                                        'title': 'DE43_24-36 - Card Acceptor City',
                                        'field': 'cardAcceptorNameLocation',
                                        'headerSort': true,
                                        formatter: function(cell, formatterParams) {

                                            var updacity = cell.getValue();
                                            if (updacity) {
                                                return (updacity.slice(22, 35));
                                            } else {
                                                return "";
                                            }

                                        }
                                    },
                                    {
                                        'title': 'DE43_37-38 - Card Acceptor State',
                                        'field': 'cardAcceptorNameLocation',
                                        'headerSort': true,
                                        formatter: function(cell, formatterParams) {

                                            var updacity = cell.getValue();
                                            if (updacity) {
                                                return (updacity.slice(35, 38));
                                            } else {
                                                return "";
                                            }

                                        }
                                    },
                                   
                                    {
                                        'title': 'DE43_39-40 - Card Acceptor Country Code',
                                        'field': 'cardAcceptorNameLocation',
                                        'headerSort': true,
                                        formatter: function(cell, formatterParams) {
                                            var updatecountry = cell.getValue();
                                            if (updatecountry) {
                                                return (updatecountry.slice(38, 41));
                                            } else {
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
                                    {
                                        'title': 'MID',
                                        'field': 'mid'
                                    },
                                   

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
                            
                            /*FOR NETC START*/
                            if ($scope.channel == 'NETC') {
                            	
                            	tabledata = [

                            		
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
                                         'field': 'remitterriskscore',
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
                             			'headerSort': true
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
                             			'title':'Lane Controller Txn Counter',
                             			'field':'lanecontrollertxncounter',
                             			'headerSort': true
                             		},
                             		{
                             			'title':'Lane Controller Txn Status',
                             			'field':'lanecontrollertxnstatus',
                             			'headerSort': true
                             		},
                             		
                             		{
                             			'title':'TID',
                             			'field':'vehicletid',
                             			'headerSort': true
                             		},
                             		
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
                             			'title':'Vehicle Class',
                             			'field':'vehicledetailvehicleclass',
                             			'headerSort': true,
                             			'formatter': function(cell,
                                   			  formatterParams){
                                   			    var vclass=cell.getValue()
                                   			    return vclass.toUpperCase();
                                   			  }
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
                             			'field':'transactioncurrencycode',
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
                            /*FOR NETC END*/
                            
                            if ($scope.channel == 'IMPS') {
                                tabledata = [{
                                        'title': 'DE51 - Currency Code',
                                        'field': 'transactionCurrencyCode',
                                        'headerSort': true
                                    },
                                    {
                                        'title': 'Base Currency Amount',
                                        'field': 'txnamount',
                                        formatter: "money"
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
                                        'formatter': function(cell, formatterParams) {
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
                                        'title': 'DE42 - Acceptor Id',
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
                                    {
                                        'title': 'DE42 - MID',
                                        'field': 'mid'
                                    },
                                    {
                                        'title': 'DE41 - TID',
                                        'field': 'tid'
                                    },
                                    {
                                        'title': 'DE18 - MCC',
                                        'field': 'mcc'
                                    },
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
                                        'title': 'DE43 - Acceptor Address',
                                        'field': 'cardAcceptorNameLocation',
                                        'headerSort': true,
                                    },
                                    {
                                        'title': 'Acceptor City',
                                        'field': 'cardAcceptorNameLocation',
                                        'headerSort': true,
                                        formatter: function(cell, formatterParams) {
                                            var updateCity = cell.getValue();
                                            if (updateCity) {
                                                return (updateCity.slice(22, 35));
                                            } else {
                                                return "";
                                            }

                                        }

                                    },
                                    {
                                        'title': 'Acceptor State',
                                        'field': 'cardAcceptorNameLocation',
                                        'headerSort': true,
                                        formatter: function(cell, formatterParams) {
                                            var updateState = cell.getValue();
                                            if (updateState) {
                                                return (updateState.slice(35, 38));
                                            } else {
                                                return "";
                                            }

                                        }
                                    },
                                    {
                                        'title': 'Card Accept Country',
                                        'field': 'cardAcceptorNameLocation',
                                        'headerSort': true,
                                        formatter: function(cell, formatterParams) {
                                            var updateCountry = cell.getValue();
                                            if (updateCountry) {
                                                return (updateCountry.slice(38, 41));
                                            } else {
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
                            if ($scope.channel == 'RuPayAtm') {


                                tabledata = [{
                                        'title': 'DE51 - Currency Code',
                                        'field': 'transactionCurrencyCode',
                                        'headerSort': true
                                    },
                                    {
                                        'title': 'DE95 - Dispanced Amount',
                                        'field': 'replacementamounts',
                                        formatter: function(cell, formatterParams) {
                                            var replacementamounts = cell.getValue();
                                            var txnamount = Number(cell.getRow().getData().txnamount);
                                            if (replacementamounts) {
                                                return ((replacementamounts.slice(0, 12)) / 100);
                                            } else {
                                                return (txnamount.toFixed(2));
                                            }

                                        }
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
                                        'title': 'DE61 - Cardholder authentication capability id',
                                        'field': 'cardholderauthenticationcapabilityid',
                                        'headerSort': true
                                    },
                                    {
                                        'title': 'Private data6 Mc attribute Data',
                                        'field': 'privatedata6mcattributedata',
                                        'headerSort': true
                                    },
                                    {
                                        'title': 'DE22 - Point Of Service capture code',
                                        'field': 'pointofservicecapturecode',
                                        'headerSort': true
                                    },

                                    {
                                        'title': 'DE05 - Settlement Amount',
                                        'field': 'settlementamount',
                                        formatter: "money"
                                    },
                                    {
                                        'title': 'DE06 - Billing Amount',
                                        'field': 'cardholderbillingamount',
                                        formatter: function(cell, formatterParams) {
                                            var txnamount = Number(cell.getRow().getData().txnamount);
                                            var acquiringinstitutioncountrycode = cell.getRow().getData().acquiringinstitutioncountrycode;
                                            var cardholderbillingamount = cell.getRow().getData().cardholderbillingamount;
                                            if (acquiringinstitutioncountrycode != 356) {
                                                return (cardholderbillingamount / 100);
                                            } else {
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
                                        'formatter': function(cell, formatterParams) {
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
                                    {
                                        'title': 'DE42 - MID',
                                        'field': 'mid'
                                    },
                                    {
                                        'title': 'DE41 - TID',
                                        'field': 'tid'
                                    },
                                    {
                                        'title': 'DE18 - MCC',
                                        'field': 'mcc'
                                    },
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
                                        'visible': false


                                    },
                                    {
                                        'title': 'Is Declined Txn',
                                        'field': 'isdeclinedtxn',
                                        'headerSort': true,
                                        'visible': false

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
                                        'title': 'For_Inst_Cntry_code',
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
                                        formatter: function(cell, formatterParams) {
                                            var updateName = cell.getValue();
                                            if (updateName) {
                                                return (updateName.slice(0, 22));
                                            } else {
                                                return "";
                                            }

                                        }
                                    },
                                    {
                                        'title': 'DE43_24-36 - Terminal City',
                                        'field': 'cardAcceptorNameLocation',
                                        'headerSort': true,
                                        formatter: function(cell, formatterParams) {

                                            var updacity = cell.getValue();
                                            if (updacity) {
                                                return (updacity.slice(22, 35));
                                            } else {
                                                return "";
                                            }

                                        }
                                    },
                                    {
                                        'title': 'DE43_39-40 - Terminal Country Code',
                                        'field': 'cardAcceptorNameLocation',
                                        'headerSort': true,
                                        formatter: function(cell, formatterParams) {
                                            var updatecountry = cell.getValue();
                                            if (updatecountry) {
                                                return (updatecountry.slice(38, 41));
                                            } else {
                                                return "";
                                            }

                                        }
                                    }


                                ]
                            }

                            if ($scope.channel == 'RuPayPos') {
                                tabledata = [{
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
                                        'title': 'DE61 - Cardholder authentication capability id',
                                        'field': 'cardholderauthenticationcapabilityid',
                                        'headerSort': true
                                    },
                                    {
                                        'title': 'Private data6 Mc attribute Data',
                                        'field': 'privatedata6mcattributedata',
                                        'headerSort': true
                                    },
                                    {
                                        'title': 'DE22 - Point Of Service capture code',
                                        'field': 'pointofservicecapturecode',
                                        'headerSort': true
                                    },

                                    {
                                        'title': 'DE05 - Settlement Amount',
                                        'field': 'settlementamount',
                                        formatter: "money"
                                    },
                                    {
                                        'title': 'DE06 - Billing Amount',
                                        'field': 'cardholderbillingamount',
                                        formatter: function(cell, formatterParams) {
                                            var txnamount = Number(cell.getRow().getData().txnamount);
                                            var acquiringinstitutioncountrycode = cell.getRow().getData().acquiringinstitutioncountrycode;
                                            var cardholderbillingamount = cell.getRow().getData().cardholderbillingamount;
                                            if (acquiringinstitutioncountrycode != 356) {
                                                return (cardholderbillingamount / 100);
                                            } else {
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
                                        'formatter': function(cell, formatterParams) {
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
                                    {
                                        'title': 'DE42 - MID',
                                        'field': 'mid'
                                    },
                                    {
                                        'title': 'DE41 - TID',
                                        'field': 'tid'
                                    },
                                    {
                                        'title': 'DE18 - MCC',
                                        'field': 'mcc'
                                    },
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
                                        'visible': false


                                    },
                                    {
                                        'title': 'Is Declined Txn',
                                        'field': 'isdeclinedtxn',
                                        'headerSort': true,
                                        'visible': false

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
                                        'title': 'For_Inst_Cntry_code',
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
                                        formatter: function(cell, formatterParams) {
                                            var updateName = cell.getValue();
                                            if (updateName) {
                                                return (updateName.slice(0, 22));
                                            } else {
                                                return "";
                                            }

                                        }
                                    },
                                    {
                                        'title': 'DE43_24-36 - Terminal City',
                                        'field': 'cardAcceptorNameLocation',
                                        'headerSort': true,
                                        formatter: function(cell, formatterParams) {

                                            var updacity = cell.getValue();
                                            if (updacity) {
                                                return (updacity.slice(22, 35));
                                            } else {
                                                return "";
                                            }

                                        }
                                    },
                                    {
                                        'title': 'DE43_39-40 - Terminal Country Code',
                                        'field': 'cardAcceptorNameLocation',
                                        'headerSort': true,
                                        formatter: function(cell, formatterParams) {
                                            var updatecountry = cell.getValue();
                                            if (updatecountry) {
                                                return (updatecountry.slice(38, 41));
                                            } else {
                                                return "";
                                            }

                                        }
                                    }

                                ]

                            }

                            if ($scope.channel == 'UPI') {
                                tabledata = [

                                    {
                                        'title': 'Payer VPA',
                                        'field': 'payervpa',
                                        'headerSort': true
                                        /*formatter: function(cell, formatterParams) {
                                            var payervpa = cell.getRow().getData().payervpa;
                                            var payervpaenc = cell.getRow().getData().payervpaenc;
                                            if ($scope.isPlainText) {
                                                return payervpa;
                                            } else {
                                                return payervpaenc;
                                            }

                                        }*/
                                    },
                                    {
                                        'title': 'Payee VPA',
                                        'field': 'payeevpa',
                                        'headerSort': true
                                       /* formatter: function(cell, formatterParams) {
                                            var payeevpa = cell.getRow().getData().payeevpa;
                                            var payeevpaenc = cell.getRow().getData().payeevpaenc;
                                            if ($scope.isPlainText) {
                                                return payeevpa;
                                            } else {
                                                return payeevpaenc;
                                            }

                                        }*/
                                    },
                                    {
                                        'title': 'Txn Type',
                                        'field': 'txnType',
                                    },
                                    {
                                        'title': 'Payer user name',
                                        'field': 'payerusername',
                                        'headerSort': true,
                                        formatter: function(cell, formatterParams) {
                                            var payerIfsc = cell.getRow().getData().payerifsc;
                                            var payerAccountno = cell.getRow().getData().payeraccountno;
                                            //var payerAccountnoenc = cell.getRow().getData().payeraccountnoenc;
                                            var payerAccountnoenc = cell.getRow().getData().payeraccountno;
                                            if ($scope.isPlainText) {
                                                return payerIfsc + payerAccountno;
                                            } else {
                                                return payerAccountnoenc
                                            }

                                        }
                                    },
                                    {
                                        'title': 'Payer Mobile Number',
                                        'field': 'payermobile',
                                        'headerSort': true,
                                       /* formatter: function(cell, formatterParams) {
                                            var payerMobile = cell.getRow().getData().payermobile;
                                            var payerMobileenc = cell.getRow().getData().payermobileenc;
                                            if ($scope.isPlainText) {
                                                return payerMobile;
                                            } else {
                                                return payerMobileenc
                                            }

                                        }*/
                                    },
                                    {
                                        'title': 'Payer IFSC',
                                        'field': 'payerifsc',
                                        'headerSort': true,
                                    },
                                    {
                                        'title': 'Payer Account No',
                                        'field': 'payeraccountno',
                                        'headerSort': true,
                                        /*formatter: function(cell, formatterParams) {
                                            var payerAccountno = cell.getRow().getData().payeraccountno;
                                            var payerAccountnoenc = cell.getRow().getData().payeraccountnoenc;
                                            if ($scope.isPlainText) {
                                                return payerAccountno;
                                            } else {
                                                return payerAccountnoenc
                                            }

                                        }*/
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
                                        formatter: function(cell, formatterParams) {
                                            var payeeIfsc = cell.getRow().getData().payeeifsc;
                                            var payeeAccountno = cell.getRow().getData().payeeaccountno;
                                            var payeeAccountnoenc = cell.getRow().getData().payeeaccountno;
                                            if ($scope.isPlainText) {
                                                return payeeIfsc + payeeAccountno;
                                            } else {
                                                return payeeAccountnoenc
                                            }

                                        }
                                    },
                                    {
                                        'title': 'Payee Mobile Number',
                                        'field': 'payeemobile',
                                        'headerSort': true,
                                       /* formatter: function(cell, formatterParams) {
                                            var payeeMobile = cell.getRow().getData().payeemobile;
                                            var payeeMobileenc = cell.getRow().getData().payeemobileenc;
                                            if ($scope.isPlainText) {
                                                return payeeMobile;
                                            } else {
                                                return payeeMobileenc
                                            }

                                        }*/
                                    },
                                    {
                                        'title': 'Payee IFSC',
                                        'field': 'payeeifsc',
                                        'headerSort': true
                                    },
                                    {
                                        'title': 'Payee Account No',
                                        'field': 'payeeaccountno',
                                        'headerSort': true,
                                         /*formatter: function(cell, formatterParams) {
                                            
                                            var payeeAccountno = cell.getRow().getData().payeeaccountno;
                                            var payeeAccountnoenc = cell.getRow().getData().payeeaccountnoenc;
                                            if ($scope.isPlainText) {
                                                return payeeAccountno;
                                            } else {
                                                return payeeAccountnoenc
                                            }

                                        }*/
                                        
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
                                        /*formatter: function(cell, formatterParams) {
                                            var payervpa = cell.getRow().getData().payervpa;
                                            var res = '';
                                            if (payervpa) {
                                                res = payervpa.split("@");
                                                res = res[1];
                                            }
                                            return res;

                                        }*/
                                    },

                                    {
                                        'title': 'Payee PSP',
                                        'field': 'payeePsp',
                                        'headerSort': true,
                                        /*formatter: function(cell, formatterParams) {
                                            var payeevpa = cell.getRow().getData().payeevpa;
                                            var res = '';
                                            if (payeevpa) {
                                                res = payeevpa.split("@");
                                                res = res[1];
                                            }

                                            return res;
                                        }*/
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
                                            if (updateDate != null) {
                                                       
                                               /* var time = updateDate.slice(11, 19);
                                                var res = updateDate.slice(0, 10)
                                                res = res.split(":", 3).join("-");*/
                                                //var mydate = moment(new Date(updateDate)).format("DD-MM-YY HH:mm:ss")
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
                                        'title': 'Txn Risk Scorevalue',
                                        'field': 'txnriskscorevalue',
                                        'headerSort': true,

                                    },
                                    /*{
			'title': 'Txn Msgid',
			'field': 'txnmsgid',
			'headerSort': true,

		},
		{
		'title': 'Txn Version',
		'field': 'txnversion',
		'headerSort': true,

	},
*/
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
                                        formatter: function(cell, formatterParams) {
                                            var txnamount = Number(cell.getRow().getData().txnamount);
                                            var txnsubtype = cell.getRow().getData().txnSubType;

                                            if (txnsubtype == 'REVERSAL' || txnsubtype == 'Reversal') {
                                                return (txnamount);
                                            } else {
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
                                        'visible': false

                                    },
                                    {
                                        'title': 'MAC Value',
                                        'field': 'macvalue',
                                        'headerSort': true,

                                    },


                                   
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

                                   


                                    {
                                        'title': 'Payment Reference',
                                        'field': 'txnnote',
                                        'headerSort': true,

                                    },



                                   

                                   /* {
                                        'title': 'Final Riskscore',
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

                                    },*/




                                    {
                                        'title': 'Txn Ref Category',
                                        'field': 'txnrefcategory',
                                        'headerSort': true,

                                    }




                                   
                                ]

                            }
                            var preferencesData =function(){
                            	 var selectedChannel = $scope.channel;
                                 var screen = 'createManualCase';
                                 $scope.allColumns = '';
                                 casesManagement.header($scope.response.token).getPreferencesByUserId({
                                     userId: $scope.userId,
                                     channel: $scope.channel,
                                     screen: screen
                                 },
                                 function(data) {
                                	 if (!angular.isUndefined(data.response)) {
                                		 $scope.preferencesdata = data.response.columnPref;
                                		 getAllList($scope.preferencesdata)
                                	 }
                                 }),
                                 function(err) {
                                     toastr.error("No Preference found", Msg.oops);
                                 }
                            	
                            }
                            // preferences data
                            var getAllList = function(prefDta) {
                               

                                            if ($scope.channel == 'UPI') {
                                                $scope.tabulatorJosnto_add = [{
                                                        'formatter': printIcon,
                                                        'title': 'Action',
                                                        'headerSort': false,
                                                        'cellClick': function(e, cell) {
                                                            getSelectedRow(cell.getRow().getData())
                                                        }
                                                    },
                                                    {
											        	 'title': 'Offline Txn',
														 'field': 'offlinetxn',
											        	 'headerSort': false,
											        	 'align': "center",
														formatter:function(cell, formatterParams){
															$scope.offline = cell.getValue();
															//var onlineFlag  = !$scope.offline || $scope.offline == 'false'
																
															if($scope.offline || $scope.offline != null){
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
                                                        formatter: function(cell, formatterParams) {
                                                            var value2 = cell.getValue();
                                                            return ($compile(`<div popover-trigger="outsideClick" class='rrn_font' popover-class="my-notifications-popover" uib-popover="{{rulenametoString}}"  popover-title="Rule Name - Score" popover-append-to-body="true" popover-placement="right" popover>` + value2 + `</div>`)($scope));
                                                        }
                                                    },
                                                    {
                                                        'title': 'Response Code',
                                                        'field': 'responseCode',
                                                        'headerSort': true,
                                                        'formatter': function(cell, formatterParams) {
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
                                                        formatter: function(cell, formatterParams) {
                                                            var updateDate = cell.getValue();
                                                            if (angular.isUndefined(updateDate)) {
                                                                return 'NA';
                                                            } else {
                                                               /* var time = updateDate.slice(11, 19);
                                                                var res = updateDate.slice(0, 10)
                                                                res = res.split(":", 3).join("-");*/
                                                            	
                                                                var mydate = moment(new Date(updateDate)).format("DD-MM-YY HH:mm:ss")
                                                                return mydate ;
                                                            }

                                                        }

                                                    },
                                                    {
                                                        'title': 'Txn Amount', // upi
                                                        'field': 'txnamount',
                                                        formatter: function(cell, formatterParams) {
                                                            var txnamount = Number(cell.getValue());
                                                            return (txnamount.toFixed(2));
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
                                                        'field': 'remitterriskscore',
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
                                                    {
                                                        'title': 'Case Id',
                                                        'field': 'caseId',

                                                    }

                                                ];

                                            } else if ($scope.channel == 'IMPS') {
                                                $scope.tabulatorJosnto_add = [{
                                                        'formatter': printIcon,
                                                        'title': 'Action',
                                                        'headerSort': false,
                                                        'cellClick': function(e, cell) {
                                                            getSelectedRow(cell.getRow().getData())
                                                        }
                                                    },
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
                                                        'title': 'DE02 - PAN',
                                                        'field': 'cardnumber'
                                                    },
                                                    {
                                                        'title': 'Case Id',
                                                        'field': 'caseId'
                                                    },
                                                    {
                                                        'title': 'DE37 - RRN',
                                                        'field': 'rrn',
                                                        formatter: function(cell, formatterParams) {
                                                            var value2 = cell.getValue();
                                                            return ($compile(`<div popover-trigger="outsideClick" class='rrn_font' popover-class="my-notifications-popover" uib-popover="{{rulenametoString}}"  popover-title="Rule Name - Score" popover-append-to-body="true" popover-placement="right" popover>` + value2 + `</div>`)($scope));
                                                        }


                                                    },
                                                    {
                                                        'title': 'DE07 - Date & time',
                                                        'field': 'txndatetime',
                                                        formatter: function(cell, formatterParams) {
                                                            var updateDate = cell.getValue();
                                                            if (angular.isUndefined(updateDate)) {
                                                                return 'NA';
                                                            } else {
                                                                /*var time = updateDate.slice(11, 19);
                                                                var res = updateDate.slice(0, 10)
                                                                res = res.split(":", 3).join("-");*/
                                                                var mydate = moment(new Date(updateDate)).format("DD-MM-YY HH:mm:ss")
                                                                return mydate;
                                                            }

                                                        }

                                                    },
                                                    {
                                                        'title': 'Transaction Amount',
                                                        'field': 'txnamount',
                                                        formatter: function(cell, formatterParams) {
                                                            var txnamount = Number(cell.getValue());
                                                            return (txnamount.toFixed(2));
                                                        }

                                                    },

                                                    {
                                                        'title': 'Transaction Id',
                                                        'field': 'txnid',
                                                        'headerSort': true,
                                                        'visible': false

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
                                                        'title': 'DE48_058 - Fraud Score',
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
                                                        'title': 'DE48_058 - Fraud Score',
                                                        'field': 'remitterriskscore',
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

                                                    }

                                                ];

                                            } else if ($scope.channel == 'AEPS') {

                                                $scope.tabulatorJosnto_add = [{
                                                        'formatter': printIcon,
                                                        'title': 'Action',
                                                        'headerSort': false,
                                                        'cellClick': function(e, cell) {
                                                            getSelectedRow(cell.getRow().getData())
                                                        }
                                                    },
                                                    {
                                                        'title': 'frorgamount',
                                                        'field': 'frorgamount',
                                                        'visible': false
                                                    },
                                                    /*{
                                                             'title': 'acquiringinstitutioncountrycode',
                                                             'field': 'acquiringinstitutioncountrycode',
                                                             'visible' : false
                                                     },*/
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
                                                        'title': 'DE2 - PAN (User Name)',
                                                        'field': 'cardnumber'
                                                    },
                                                    {
                                                        'title': 'DE4 - Transaction Amount',
                                                        'field': 'txnamount',
                                                        formatter: function(cell, formatterParams) {
                                                            var frorgamount = Number(cell.getRow().getData().frorgamount);
                                                            var txnamount = Number(cell.getRow().getData().txnamount);
                                                            if (frorgamount) {
                                                                return (frorgamount.toFixed(2));
                                                            } else {
                                                                return (txnamount.toFixed(2));
                                                            }

                                                        }
                                                    },
                                                    {
                                                        'title': 'DE7 - Date & Time',
                                                        'field': 'txndatetime',
                                                        formatter: function(cell, formatterParams) {
                                                            var updateDate = cell.getValue();
                                                            if (angular.isUndefined(updateDate)) {
                                                                return 'NA';
                                                            } else {
                                                               /* var time = updateDate.slice(11, 19);
                                                                var res = updateDate.slice(0, 10)
                                                                res = res.split(":", 3).join("-");*/
                                                            	return moment(new Date(updateDate)).format("DD-MM-YY HH:mm:ss")
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
                                                        formatter: function(cell, formatterParams) {
                                                            var value2 = cell.getValue();
                                                            return ($compile(`<div popover-trigger="outsideClick" class='rrn_font' popover-class="my-notifications-popover" uib-popover="{{rulenametoString}}"  popover-title="Rule Name - Score" popover-append-to-body="true" popover-placement="right" popover>` + value2 + `</div>`)($scope));
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
                                                        'field': 'remitterriskscore',
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
                                                        'title': 'Transaction Id',
                                                        'field': 'txnid',
                                                        'headerSort': true,
                                                        'visible': false

                                                    }



                                                ];

                                            } else if ($scope.channel == 'NETC') {
                                            	$scope.tabulatorJosnto_add = [
                                                    {
                                                        'formatter': printIcon,
                                                        'title': 'Action',
                                                        'headerSort': false,
                                                        'cellClick': function(e, cell) {
                                                            getSelectedRow(cell.getRow().getData())
                                                        }
                                                    },
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
                                                          'field': 'remitterriskscore',
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
                                            }else {
                                                $scope.tabulatorJosnto_add = [{
                                                        'formatter': printIcon,
                                                        'title': 'Action',
                                                        'headerSort': false,
                                                        'cellClick': function(e, cell) {
                                                            getSelectedRow(cell.getRow().getData())
                                                        }
                                                    },
                                                    {
                                                        'title': 'frorgamount',
                                                        'field': 'frorgamount',
                                                        'visible': false
                                                    },
                                                    {
                                                        'title': 'acquiringinstitutioncountrycode',
                                                        'field': 'acquiringinstitutioncountrycode',
                                                        'visible': false
                                                    },
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
                                                        'title': 'DE02 - PAN',
                                                        'field': 'cardnumber'
                                                    },
                                                    {
                                                        'title': 'Case Id',
                                                        'field': 'caseId',
                                                        formatter: function(cell, formatterParams) {
                                                            var value = cell.getValue();
                                                            if(value){
                                                            	if(cell.getRow().getData().isArchived){
                                                            		return ($compile(`<span style='color:red;'>` + value + `</div>`)($scope));
                                                            	}else{
                                                            		return ($compile(`<span style='color:black;'>` + value + `</div>`)($scope));
                                                            	}
                                                            }
                                                        }
                                                    },
                                                    {
                                                        'title': 'DE37 - RRN',
                                                        'field': 'rrn',
                                                        formatter: function(cell, formatterParams) {
                                                            var value2 = cell.getValue();
                                                            return ($compile(`<div popover-trigger="outsideClick" class='rrn_font' popover-class="my-notifications-popover" uib-popover="{{rulenametoString}}"  popover-title="Rule Name - Score" popover-append-to-body="true" popover-placement="right" popover>` + value2 + `</div>`)($scope));
                                                        }


                                                    },
                                                    {
                                                        'title': 'DE07 - Date & time',
                                                        'field': 'txndatetime',
                                                        formatter: function(cell, formatterParams) {
                                                            var updateDate = cell.getValue();
                                                            if (angular.isUndefined(updateDate)) {
                                                                return 'NA';
                                                            } else {
                                                              
                                                                var mydate = moment(new Date(updateDate)).format("DD-MM-YY HH:mm:ss")
                                                                //return (mydate + " " + time);
                                                                return mydate ;
                                                            }

                                                        }

                                                    },
                                                    {
                                                        'title': 'Transaction Amount',
                                                        'field': 'txnamount',
                                                        formatter: function(cell, formatterParams) {
                                                            var frorgamount = Number(cell.getRow().getData().frorgamount);
                                                            // var acquiringinstitutioncountrycode = cell.getRow().getData().acquiringinstitutioncountrycode;
                                                            var txnamount = Number(cell.getRow().getData().txnamount);
                                                            if (frorgamount) {
                                                                return (frorgamount.toFixed(2));
                                                            } else {
                                                                return (txnamount.toFixed(2));
                                                            }

                                                        }
                                                    },

                                                    {
                                                        'title': 'Transaction Id',
                                                        'field': 'txnid',
                                                        'headerSort': true,
                                                        'visible': false

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
                                                        'title': 'DE48_058 - Fraud Score',
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
                                                        'title': 'DE48_058 - Fraud Score',
                                                        'field': 'remitterriskscore',
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


                                            $scope.allColumns = prefDta;
                                            $scope.tabulatorJosn = tabledata;
                                            if ($scope.allColumns.length) {
                                                $scope.allColumns = $scope.allColumns.map((x) => {
                                                    return (x.jsonKey)
                                                })

                                                // filtering the required json for
                                                // tabulator
                                                $scope.tabulatorJosn = tabledata.filter(function(o) {
                                                    return $scope.allColumns.some(function(o2) {
                                                        return o.field === o2;
                                                    })
                                                });

                                                $scope.tabulatorJosn.sort(function(a, b) {
                                                    return $scope.allColumns.indexOf(a.field) - $scope.allColumns.indexOf(b.field);
                                                });


                                            }

                                            Array.prototype.push.apply($scope.tabulatorJosnto_add, $scope.tabulatorJosn);

                                            var newTableData = $scope.tabulatorJosnto_add;

                                            $scope.table = $("#example-table").tabulator({

                                                columns: newTableData

                                            })



                                            var tabledatabig = $scope.newJsonData;

                                            $("#example-table").tabulator("setData", tabledatabig);
                                            //if ($scope.channel == 'IMPS' || $scope.channel == 'UPI'|| $scope.channel == 'NETC') {
                                            //Debashis Change
                                            if ($scope.channel == 'IMPS' || $scope.channel == 'UPI') {
                                                if ($scope.SelectedPerspective == "ISSUER") {

                                                    $("#example-table").tabulator("showColumn", "remitterriskscore"); //fraud score
                                                    $("#example-table").tabulator("showColumn", "remitterrulescore"); // Rule Score

                                                }
                                                if ($scope.SelectedPerspective == "ACQUIRER") {

                                                    $("#example-table").tabulator("showColumn", "remitterriskscore"); //fraud score
                                                    $("#example-table").tabulator("showColumn", "beneficiaryriskscore") //Rule Score

                                                }


                                            }
                                            if ($scope.channel == 'RuPayPos' || $scope.channel == 'RuPayAtm' || $scope.channel == 'AEPS' || $scope.channel == 'NETC') {
                                                if ($scope.SelectedPerspective == "ISSUER") {

                                                    $("#example-table").tabulator("showColumn", "issuerriskscore"); // Fraud Score
                                                    $("#example-table").tabulator("showColumn", "issuerrulescore"); //Rule Score
                                                }
                                                if ($scope.SelectedPerspective == "ACQUIRER") {

                                                    $("#example-table").tabulator("showColumn", "issuerriskscore"); //Fraud Score
                                                    $("#example-table").tabulator("showColumn", "aquirerriskscore"); //Rule Score
                                                }


                                            }

                                            $("#download-csv").click(function() {
                                                $("#example-table").tabulator("download", "csv", "data.csv");
                                            });
                                      
                            }
                           if($scope.firstCall){
                            
                            preferencesData()
                           }else{
                        	   getAllList($scope.preferencesdata)
                           }
                      

                
                }

                $scope.makePagination = function(pageSizeCheck) {
                	$scope.withoutCaseId = true;
                	$scope.firstCall = false;
                    localStorage.setItem("pageSizeCheckfortrns", pageSizeCheck);
                    /*$scope.memoryUsageFunc(pageSizeCheck);*/
                    $scope.searchTransactionsById($scope.transactionList,null,null);
                    $scope.pageSizeNo = pageSizeCheck-1;
                    //$scope.pageSizeNo = (pageSizeCheck - 1) * 50;
                    // alert($scope.pageSizeNo)

                }



                $scope.copyID = function() {
                    $scope.search_id.select();
                    document.execCommand("copy");

                }

                $scope.sort = function(keyname) {
                    $scope.sortKey = keyname; // set the sortKey to the param passed
                    $scope.reverse = !$scope.reverse; // if true make it false and vice versa
                    if (keyname == 'queueCode') {
                        $scope.queueCodeSort = !$scope.queueCodeSort;
                    }
                    if (keyname == 'queueName') {
                        $scope.queueNameSort = !$scope.queueNameSort;
                    }
                }

                var getSelectedRow = function(jsondata) {

                	
                    $scope.createCase = function() {

                        $scope.TxnDTO = {
                            userInformationDTO: {
                                userId: $scope.userId,
                                orgId: $scope.orgId,
                                actionType: 'MANUAL_CREATE',
                                notes: "manual create"
                            },
                            gatewayData: {
                                channel: $scope.channel,
                                txnType: 'FINANCIAL'
                            },
                            searchId: $scope.transactionList,
                            txnId: jsondata.txnid,
                            manual: true


                        }
                        casesManagement2.header($scope.response.token).createCase({
                                searchId: null
                            }, $scope.TxnDTO,
                            function(response) {
                            	for(var i=0;i<$scope.newJsonData.length;i++){
                                    if($scope.newJsonData[i].txnid == jsondata.txnid){
                                         $scope.newJsonData[i].caseId =  response.response.data.caseId          
                                    }
                          	}
                            	//$("#example-table").tabulator("updateData", $scope.newJsonData);
                            	$scope.findCaseId($scope.newJsonData,response.response.data.caseId,jsondata.txnid)
                            	$scope.manual_create_popup(response.response.data.caseId);
                            },
                            function(err) {});

                    }


                }




                $scope.doIfChecked = function(flag_value) {
                    if (flag_value) {
                        $scope.count++;
                    } else {

                        $scope.count--;
                    }

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

                $scope.searchTransaction = function() {
                	$scope.totalRecords = 0;
                	$scope.firstCall = true;
                	$scope.withoutCaseId = true;
                    var checkTable = $("#example-table").hasClass("tabulator")
                    if (checkTable) {
                        $("#example-table").tabulator("destroy");

                    }

                    var perspectiveObj;
                    var channel = $scope.channel;
                    var SelectedPerspective = $scope.SelectedPerspective;

                    if (channel == 'IMPS' || channel == 'UPI') {
                        if (SelectedPerspective == "ISSUER") {
                            perspectiveObj = "R"


                        }
                        if (SelectedPerspective == "ACQUIRER") {
                            perspectiveObj = "B";


                        }
                        if (SelectedPerspective == "AML") {
                            perspectiveObj = "M";
                        }

                    }
                    if (channel == 'RuPayPos' || channel == 'RuPayAtm' || channel == 'AEPS' || channel == 'NETC') {
                        if (SelectedPerspective == "ISSUER") {
                            perspectiveObj = "I"

                        }
                        if (SelectedPerspective == "ACQUIRER") {
                            perspectiveObj = "A";

                        }
                        if (SelectedPerspective == "AML") {
                            perspectiveObj = "M";
                        }

                    }
                    $scope.userInformationDTO.perspective = perspectiveObj;
                    $scope.prespectiveForCaseId = perspectiveObj
                    $scope.userInformationDTO.orgId = $scope.SelectedOrdid_val;
                   // if ($scope.userInformationDTO.channel == 'IMPS' || $scope.userInformationDTO.channel == 'UPI' || $scope.userInformationDTO.channel == 'NETC') {
                    //Debashis Change
                    if ($scope.userInformationDTO.channel == 'IMPS' || $scope.userInformationDTO.channel == 'UPI') {
                        $scope.userInformationDTO.productCd = null;
                    } else {
                        if ($scope.productcd == "") {
                            $scope.userInformationDTO.productCd = null;
                        }
                        if ($scope.productcd != "") {
                            $scope.userInformationDTO.productCd = $scope.productcd;
                        }
                    }

                    //$scope.userInformationDTO.cardNumber = $scope.someObject.ucard_number;
                    $scope.userInformationDTO.minAmount = $scope.someObject.maxAmount;
                    if ($scope.showMax_min_value == 2) {
                        $scope.userInformationDTO.maxAmount = $scope.someObject.maxAmount;
                        $scope.userInformationDTO.minAmount = $scope.someObject.minAmount;
                    } else {
                        $scope.userInformationDTO.txnAmount = $scope.someObject.txn_amt;
                        $scope.userInformationDTO.maxAmount = $scope.someObject.minAmount;
                    }

                    //$scope.userInformationDTO.productCd = $scope.someObject.product_code;
                    $scope.userInformationDTO.issuerBin = $scope.someObject.Issuer_bin;
                    $scope.userInformationDTO.issuerIin = $scope.someObject.Issuer_iin;
                    $scope.userInformationDTO.acquiringinstitutionid = $scope.someObject.acquiring_id;
                    $scope.userInformationDTO.mcc = $scope.someObject.mcc_mdl;
                    if($scope.someObject.payee_mobile){
                    	$scope.userInformationDTO.payeeMobile = '91'+$scope.someObject.payee_mobile;	
                    }
                    if($scope.someObject.payer_mobile){
                    	$scope.userInformationDTO.payerMobile = '91'+$scope.someObject.payer_mobile;
                    }
                    $scope.userInformationDTO.mid = $scope.someObject.mid;
                    $scope.userInformationDTO.tid = $scope.someObject.tid;
                    $scope.userInformationDTO.payeeVpa = $scope.someObject.payee_vpa;
                    $scope.userInformationDTO.payerVpa = $scope.someObject.payer_vpa;
                    $scope.userInformationDTO.payerIfsc = $scope.someObject.payer_ifc;
                    $scope.userInformationDTO.payeeIfsc = $scope.someObject.payee_ifsc;
                    $scope.userInformationDTO.payerAccountno = $scope.someObject.payer_acctNo;
                    $scope.userInformationDTO.payeeAccountno = $scope.someObject.payee_acctNo;
                    $scope.userInformationDTO.stip = $scope.someObject.stip;
                    $scope.userInformationDTO.remitterMMIDAndMobilenumber = $scope.someObject.remittermmidandmobilenumber;
                    $scope.userInformationDTO.tiSearchtoDate = $scope.someObject.toDate1;
                    $scope.userInformationDTO.vehicleTagId = $scope.someObject.vehicleTagId;
                    var date1 = new Date($scope.someObject.to_time);
                    var datevalues1 = ('0' + date1.getDate()).slice(-2) + '-' + ('0' + (date1.getMonth() + 1)).slice(-2) + '-' + date1.getFullYear();
                    $scope.fromDate1 = datevalues1;

                    var hours1 = date1.getHours();
                    var checkLength2 = hours1.toString().length;
                    if (checkLength2 == 1) {
                        hours1 = '0' + date1.getHours();
                    }
                    var minutes1 = "0" + date1.getMinutes();
                    var seconds1 = "0" + date1.getSeconds();
                    var formattedTime1 = new Date(date1.getFullYear(), ('0' + (date1.getMonth() + 1)).slice(-2), date1.getDate(), hours1, minutes1.substr(-2), seconds1.substr(-2));
                    $scope.fromTime = formattedTime1;
                    $scope.fromTime1 = hours1 + ':' + minutes1.substr(-2) + ':' + seconds1.substr(-2);
                    $scope.userInformationDTO.endTime = $scope.fromTime1;



                    $scope.userInformationDTO.tiSearchfromDate = $scope.someObject.fromDate1;
                    var date2 = new Date($scope.someObject.frm_time);
                    var datevalues2 = ('0' + date2.getDate()).slice(-2) + '-' + ('0' + (date2.getMonth() + 1)).slice(-2) + '-' + date2.getFullYear();
                    $scope.fromDate2 = datevalues2;
                    var hours2 = date2.getHours();
                    var checkLength = hours2.toString().length;

                    if (checkLength == 1) {
                        hours2 = '0' + date2.getHours();
                    }
                    var minutes2 = "0" + date2.getMinutes();
                    var seconds2 = "0" + date2.getSeconds();
                    var formattedTime2 = new Date(date2.getFullYear(), ('0' + (date2.getMonth() + 1)).slice(-2), date2.getDate(), hours2, minutes2.substr(-2), seconds2.substr(-2));
                    $scope.fromTime11 = formattedTime1;
                    $scope.fromTime2 = hours2 + ':' + minutes2.substr(-2) + ':' + seconds2.substr(-2);
                    $scope.userInformationDTO.startTime = $scope.fromTime2;


                    $scope.userInformationDTO.rrn = $scope.someObject.rrn;


                    if ($scope.channel == 'AEPS') {
                        //$scope.userInformationDTO.userInformationDTO.isPlainText = false;
                        //$scope.userInformationDTO.cardNumberEnc = $scope.someObject.ucard_number;
                        $scope.userInformationDTO.cardNumber = $scope.someObject.ucard_number;
                    } else {
                        $scope.userInformationDTO.cardNumber = $scope.someObject.ucard_number;
                    }
                    $scope.searchchannel = $scope.userInformationDTO.channel
                    
                   var updatedDto =  $scope.userInformationDTO
                   delete updatedDto['userInformationDTO'];
                   delete updatedDto['channel'];
                    casesManagement2.header(localStorage.getItem("sessionToken")).searchTransactions({selectedchannel:channel}, updatedDto,
                        function(data) {
                            if (data.status == 202) {
                                //$scope.fetchSearchIdByUserId(data.response.data.txnSearchEventId,$scope.userInformationDTO);
                            	$scope.fetchSearchIdByUserId(data.response.searchId,$scope.userInformationDTO);
                                $scope.pane = 'two';
                                $scope.page = 'second';
                                $scope.isClicked = true;
                                // $scope.channel_code = '';
                                $scope.init();
                                $scope.showResult = true;
                            }
                        },
                        function(err) {
                        	$scope.userInformationDTO = {}
                        });
                }
                $scope.isSelected = function(transaction) {
                    return $scope.selected === transaction;
                }
                $scope.init();



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
                    if($scope.someObject.fromDate1 == moment(new Date()).format("DD-MM-YYYY")){
                    	$scope.someObject.toDate1 = moment(new Date()).format("DD-MM-YYYY");
                    	$scope.maxtoDate = moment(new Date()).format("DD-MM-YYYY");
                    }else{
                    
                    $scope.maxtoDate = moment(new Date(Date.parse(mydate))).add(1, 'days').format("DD-MM-YYYY");
                    $scope.someObject.toDate1 = moment(new Date(Date.parse(mydate))).add(1, 'days').format("DD-MM-YYYY");
                    }
                    /*$scope.maxtoDate = moment(new Date(Date.parse(mydate))).add(1, 'days').format("DD-MM-YYYY");
                    $scope.someObject.toDate1 = moment(new Date(Date.parse(mydate))).add(1, 'days').format("DD-MM-YYYY");*/
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

                $scope.prespectiveDisplay = function(prespective) {
                    var str = prespective;
                    if (prespective == "ACQUIRER" && ($scope.channel == "UPI" || $scope.channel == "IMPS")) {
                        return str = "BENEFICIARY"
                    } else if (prespective == "ISSUER" && ($scope.channel == "UPI" || $scope.channel == "IMPS")) {
                        return str = "REMITTER"
                    } else {
                        return str;
                    }

                }

                // on channel change
                $scope.change_channel = function(case_channel) {
                    if (case_channel) {

                        $scope.second_pack = true;
                        $scope.channel = case_channel;
                        //if (case_channel == 'IMPS' || case_channel == 'UPI' || case_channel == 'NETC' ) {
                        //Debashis Change
                        if (case_channel == 'IMPS' || case_channel == 'UPI') {
                            $scope.productcd = undefined;
                        }
                        $scope.userInformationDTO.channel = $scope.channel;
                        $scope.disableSearch = false;
                    } else {
                        // $scope.init();
                        $scope.second_pack = false;
                        $scope.disableSearch = true;
                    }


                }
                
                $scope.viewAllCase = function(searchArchived){
                	let transacListData = [];
                	
                	transacListData = $scope.newJsonData.map(function(txn) {
                		  return txn.txnid;
                	});
                	
                	
                	$scope.withoutCaseId = false;
                	casesManagement2.header(localStorage.getItem("sessionToken")).searchCaseIdResult({prespective:$scope.prespectiveForCaseId,searchArchived:searchArchived}, transacListData,
                            function(data) {
                				if(data.response){
	                                for(var i=0;i<$scope.newJsonData.length;i++){
	                                	for(var j = 0; j < data.response.length; j++) {                               		
		                                    if($scope.newJsonData[i].txnid == data.response[j].txnId){
		                                         $scope.newJsonData[i].caseId =  data.response[j].caseId;
		                                         $scope.newJsonData[i].isArchived =  data.response[j].archived;  
		                                    }
	                                	}
	                                }
                				}
                				//$("#example-table").tabulator("updateData", $scope.newJsonData);
                				//$scope.table.updateData($scope.newJsonData);
                                $scope.findCaseId($scope.newJsonData,null,null)
                               
                            },
                            function(err) {});
                	
                	 
                }
            }
        ])