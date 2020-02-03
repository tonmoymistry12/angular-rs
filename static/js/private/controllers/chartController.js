'use strict';

angular.module('efrm.dashboard').controller('chartController',  [
	'$scope', 
	'$state',
	'neovisJs', 
	'statusService', 
	'UserService', 
	'Session', 
	'$ngConfirm', 
	 'toastr',
	 'Msg',
	'RolePermissionMatrix',
	 'commonDataService',
	
function(
		$scope, 
		$state, 
		neovisJs,
		statusService, 
		UserService, 
		Session, 
		$ngConfirm, 
		toastr,
		Msg,
		RolePermissionMatrix,
		commonDataService
		) {
		$scope.someObject={};
		$scope.orgId = commonDataService.getLocalStorage().orgId;	
		$scope.userId = commonDataService.getSessionStorage().userId;
		$scope.response = statusService.getResponseMessage();
		$scope.authority = $scope.response.usersAuthoritiesPermissionsDto.authority;
		$scope.rolePermission = RolePermissionMatrix;
		$scope.show_download_msg = false;
		$scope.flag = false;
		var data = [];
		$scope.message ='';
		var nodes = [];
		var nodes_info = [];
		var edges = [];
		$scope.toDate1 = moment(new Date()).format("DD-MM-YYYY") // 22-11-2017
		$scope.fromDate1 = moment().subtract(6, 'months').format('DD-MM-YYYY');//'01-10-2017'
		$scope.tab = 1;
		$scope.someObject.count_val = 4;
		$scope.showondata = false;
		$scope.report_gent2 = false;
		$scope.showAml = true;	
		$scope.showCpp = false;
		$scope.currentPage = 1;
		$scope.itemsintable = parseInt(5);
		$scope.item = {
	    		pageNo 	 : 1,
	    		itemsintable : 5
	    };
		$scope.item2 = {
	    		pageNo 	 : 1,
	    		itemsintable : 5
	    };
		
		$scope.setTab = function(newTab)
	        {
			 $scope.tab = newTab;
		    };
	
		$scope.isSet = function(tabNum)
		    {
		      return $scope.tab === tabNum;
		    };
		    
// **************************For AML Start********************//
	$scope.getAmlData = function()
	         {
		$scope.report_gent2 = false;		
		neovisJs.header($scope.response.token).nodes_list( 
						{
										startDate : $scope.fromDate1,
										endDate : $scope.toDate1,
										txnCount : $scope.someObject.count_val,
										flag : $scope.flag
						},
					function(response) {
										if(response.response.download == "1")
										{
											$scope.showondata = true;
										}
										if(response.response.download == "2")
										{
											$scope.report_gent2 = true;
										}
					
					if(response.response.download !== "1" && response.response.download !== "2")
					                   {
						                  $scope.showondata = false;
										  data = response.response;
									      nodes_info = data.forms1;
									      $scope.data_set_forms1 = data.forms1;
									      $scope.data_set_forms2 = data.forms2;
									      var totalItems = parseInt($scope.data_set_forms2.length);
									      $scope.totalItems = totalItems;
									      $scope.array2 = data.forms1.map((x)=>{
												return x.id
											});
									      		      
							              $scope.amlanalysis(data);
						
					                   }
					
					      
						},
					function(err) {
					});
	         }
//**************************************AML END **************************************************//	

// *************************************For CPP Start *********************************************//
	$scope.getCppData = function()
		{
				/*neovisJs.header($scope.response.token).getCppTransaction( {
					startDate : $scope.fromDate1,
					endDate : $scope.toDate1
					
				},
						function(response) {*/
							                  data = {
							                		  "forms2": [
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 169952,
							                			      "to": 45125,
							                			      "label": "1000.0",
							                			      "ts": "2019-10-25 01:38:12",
							                			      "txnId": "30003892980169202360802380303561"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 150435,
							                			      "to": 144361,
							                			      "label": "10000.0",
							                			      "ts": "2019-10-25 00:33:26",
							                			      "txnId": "800001929800001540652163SACWC456"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 127923,
							                			      "to": 127924,
							                			      "label": "2000.0",
							                			      "ts": "2019-10-24 23:30:19",
							                			      "txnId": "70000292972300263660810899229198"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 127939,
							                			      "to": 127940,
							                			      "label": "100.0",
							                			      "ts": "2019-10-24 23:30:18",
							                			      "txnId": "7204249297239842376521595P043242"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 191460,
							                			      "to": 191461,
							                			      "label": "2000.0",
							                			      "ts": "2019-10-25 03:37:55",
							                			      "txnId": "62201892980300534651296705088621"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 158351,
							                			      "to": 158352,
							                			      "label": "2000.0",
							                			      "ts": "2019-10-25 01:32:16",
							                			      "txnId": "800025929801012656652157S1AWIM01"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 124958,
							                			      "to": 76011,
							                			      "label": "0.0",
							                			      "ts": "2019-10-24 23:29:47",
							                			      "txnId": "800001929723005523508944SPCND117"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 155854,
							                			      "to": 155855,
							                			      "label": "1000.0",
							                			      "ts": "2019-10-25 01:32:03",
							                			      "txnId": "800001929801006279608023S1CNI190"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 140010,
							                			      "to": 140011,
							                			      "label": "500.0",
							                			      "ts": "2019-10-25 00:29:45",
							                			      "txnId": "800031929800016710607270CW118957"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 132029,
							                			      "to": 108464,
							                			      "label": "3000.0",
							                			      "ts": "2019-10-24 23:30:28",
							                			      "txnId": "800068929723726450607089ATM0099 "
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 141058,
							                			      "to": 10543,
							                			      "label": "50.0",
							                			      "ts": "2019-10-25 00:31:23",
							                			      "txnId": "30001292980025591560710187001380"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 141032,
							                			      "to": 28681,
							                			      "label": "169.0",
							                			      "ts": "2019-10-25 00:30:19",
							                			      "txnId": "30001292980015559660704187013766"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 143840,
							                			      "to": 143841,
							                			      "label": "0.0",
							                			      "ts": "2019-10-25 00:32:57",
							                			      "txnId": "62201892980002059960699414388315"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 191347,
							                			      "to": 34409,
							                			      "label": "2000.0",
							                			      "ts": "2019-10-25 03:36:42",
							                			      "txnId": "810300929803006375606998TCCS2963"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 141058,
							                			      "to": 9034,
							                			      "label": "50.0",
							                			      "ts": "2019-10-25 00:30:18",
							                			      "txnId": "30001092980092856060710170010810"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 197949,
							                			      "to": 199654,
							                			      "label": "10000.0",
							                			      "ts": "2019-10-25 04:31:53",
							                			      "txnId": "603741929804874000608023C0117301"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 201641,
							                			      "to": 9084,
							                			      "label": "500.0",
							                			      "ts": "2019-10-25 04:32:04",
							                			      "txnId": "30001092980494104260708970015490"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 128294,
							                			      "to": 10340,
							                			      "label": "200.0",
							                			      "ts": "2019-10-24 23:29:45",
							                			      "txnId": "30001292972313510560743100220085"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 140577,
							                			      "to": 43032,
							                			      "label": "2000.0",
							                			      "ts": "2019-10-25 00:30:10",
							                			      "txnId": "800024929800026017607270LWCW3002"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 166695,
							                			      "to": 121110,
							                			      "label": "0.0",
							                			      "ts": "2019-10-25 01:35:38",
							                			      "txnId": "800004929801603854652163D8006600"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 197911,
							                			      "to": 197912,
							                			      "label": "10000.0",
							                			      "ts": "2019-10-25 04:30",
							                			      "txnId": "62201892980401689960802300755080"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 140902,
							                			      "to": 140903,
							                			      "label": "712.0",
							                			      "ts": "2019-10-25 00:30:34",
							                			      "txnId": "720399929800834995607324E0002314"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 124967,
							                			      "to": 124968,
							                			      "label": "0.0",
							                			      "ts": "2019-10-24 23:29:47",
							                			      "txnId": "800025929723026903463795P1ENMU05"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 166014,
							                			      "to": 166015,
							                			      "label": "0.0",
							                			      "ts": "2019-10-25 01:36:50",
							                			      "txnId": "62201892980102481450891061185041"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 122272,
							                			      "to": 43349,
							                			      "label": "6238.0",
							                			      "ts": "2019-10-24 23:29:10",
							                			      "txnId": "30001092972391947260790970016078"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 191517,
							                			      "to": 143640,
							                			      "label": "10000.0",
							                			      "ts": "2019-10-25 03:35:25",
							                			      "txnId": "62201892980300285065223604319622"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 155836,
							                			      "to": 155837,
							                			      "label": "5000.0",
							                			      "ts": "2019-10-25 01:30:42",
							                			      "txnId": "800025929801012632508963S1ACDH20"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 144153,
							                			      "to": 113011,
							                			      "label": "2000.0",
							                			      "ts": "2019-10-25 00:31:08",
							                			      "txnId": "800009929800169750607589ALD19931"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 194030,
							                			      "to": 194031,
							                			      "label": "0.0",
							                			      "ts": "2019-10-25 03:38:55",
							                			      "txnId": "810502929803002808607532TKIS0536"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 191782,
							                			      "to": 143408,
							                			      "label": "200.0",
							                			      "ts": "2019-10-25 03:40:23",
							                			      "txnId": "800025929803001830607010S1ACNM54"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 159674,
							                			      "to": 9238,
							                			      "label": "220.0",
							                			      "ts": "2019-10-25 01:32:20",
							                			      "txnId": "30000892980113713360727811113565"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 190474,
							                			      "to": 190475,
							                			      "label": "20000.0",
							                			      "ts": "2019-10-25 03:34:39",
							                			      "txnId": "720201929803840511652159UP015512"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 195049,
							                			      "to": 111842,
							                			      "label": "50.0",
							                			      "ts": "2019-10-25 03:33:01",
							                			      "txnId": "30003792980395395160802330000255"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 202386,
							                			      "to": 197548,
							                			      "label": "0.0",
							                			      "ts": "2019-10-25 04:32:45",
							                			      "txnId": "429393929804491566450478DELON598"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 145095,
							                			      "to": 145096,
							                			      "label": "0.0",
							                			      "ts": "2019-10-25 00:32:57",
							                			      "txnId": "603741929800870512608023C0117902"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 181526,
							                			      "to": 132189,
							                			      "label": "10000.0",
							                			      "ts": "2019-10-25 02:36:19",
							                			      "txnId": "800025929802013672608023S1ANDE81"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 194283,
							                			      "to": 194284,
							                			      "label": "10000.0",
							                			      "ts": "2019-10-25 03:40:21",
							                			      "txnId": "62201892980301856060802701490062"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 166760,
							                			      "to": 3371,
							                			      "label": "3000.0",
							                			      "ts": "2019-10-25 01:34:15",
							                			      "txnId": "8000029298010194666522121FDTIR11"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 158125,
							                			      "to": 158126,
							                			      "label": "0.0",
							                			      "ts": "2019-10-25 01:32:54",
							                			      "txnId": "62201892980101048065216300358017"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 6499,
							                			      "to": 6500,
							                			      "label": "1000.0",
							                			      "ts": "2019-10-24 18:08:55",
							                			      "txnId": "504432929718032572606998AHOW7002"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 140869,
							                			      "to": 9176,
							                			      "label": "35.0",
							                			      "ts": "2019-10-25 00:29:34",
							                			      "txnId": "30005492980034450060727089050471"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 162665,
							                			      "to": 45125,
							                			      "label": "5000.0",
							                			      "ts": "2019-10-25 01:31:46",
							                			      "txnId": "30003892980130680260812080303561"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 190011,
							                			      "to": 9054,
							                			      "label": "35.0",
							                			      "ts": "2019-10-25 03:29:37",
							                			      "txnId": "300021929803452999607532BDR00001"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 195451,
							                			      "to": 9088,
							                			      "label": "1.0",
							                			      "ts": "2019-10-25 03:38:05",
							                			      "txnId": "30001292980326996260743100218923"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 202260,
							                			      "to": 173898,
							                			      "label": "0.0",
							                			      "ts": "2019-10-25 04:33:16",
							                			      "txnId": "800025929804002578517574S1ANGG03"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 124408,
							                			      "to": 114278,
							                			      "label": "10000.0",
							                			      "ts": "2019-10-24 23:30:20",
							                			      "txnId": "800025929723006569652151S1ANSU07"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 133524,
							                			      "to": 133525,
							                			      "label": "6121.52",
							                			      "ts": "2019-10-24 23:30:36",
							                			      "txnId": "720212929723792571608171PR013306"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 140758,
							                			      "to": 140759,
							                			      "label": "745.0",
							                			      "ts": "2019-10-25 00:30:25",
							                			      "txnId": "72001592980090203460706620301132"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 125084,
							                			      "to": 100792,
							                			      "label": "8000.0",
							                			      "ts": "2019-10-24 23:30:11",
							                			      "txnId": "476338929723717832607093SINN1548"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 155774,
							                			      "to": 129524,
							                			      "label": "1500.0",
							                			      "ts": "2019-10-25 01:30:34",
							                			      "txnId": "62201892980100653565216301467003"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 197949,
							                			      "to": 144008,
							                			      "label": "0.0",
							                			      "ts": "2019-10-25 04:30:25",
							                			      "txnId": "603741929804873972608023CD117301"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 166760,
							                			      "to": 112887,
							                			      "label": "3000.0",
							                			      "ts": "2019-10-25 01:35",
							                			      "txnId": "8000029298010194716522121CRHTNCO"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 125352,
							                			      "to": 125353,
							                			      "label": "3000.0",
							                			      "ts": "2019-10-24 23:30:38",
							                			      "txnId": "800011929723569309471219CUB01061"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 158125,
							                			      "to": 158126,
							                			      "label": "500.0",
							                			      "ts": "2019-10-25 01:32:17",
							                			      "txnId": "62201892980102230865216300358017"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 156950,
							                			      "to": 124602,
							                			      "label": "200.0",
							                			      "ts": "2019-10-25 01:29:56",
							                			      "txnId": "81059892980166345750891493492043"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 158067,
							                			      "to": 124245,
							                			      "label": "4000.0",
							                			      "ts": "2019-10-25 01:31:59",
							                			      "txnId": "800027929801290529508991ABA8005 "
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 124604,
							                			      "to": 132800,
							                			      "label": "9000.0",
							                			      "ts": "2019-10-24 23:30:48",
							                			      "txnId": "62201892972301278860790903595037"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 124786,
							                			      "to": 124787,
							                			      "label": "2300.0",
							                			      "ts": "2019-10-24 23:29:42",
							                			      "txnId": "800001929723003676652261S1CNI134"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 194006,
							                			      "to": 194007,
							                			      "label": "500.0",
							                			      "ts": "2019-10-25 03:38:47",
							                			      "txnId": "800024929803004282607093APRH2260"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 129434,
							                			      "to": 129435,
							                			      "label": "0.0",
							                			      "ts": "2019-10-24 23:30:51",
							                			      "txnId": "62201892972302037465219661185126"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 166096,
							                			      "to": 166097,
							                			      "label": "2000.0",
							                			      "ts": "2019-10-25 01:37:25",
							                			      "txnId": "62201892980103106360699401494025"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 125003,
							                			      "to": 125004,
							                			      "label": "6000.0",
							                			      "ts": "2019-10-24 23:29:49",
							                			      "txnId": "800024929723000192606998BPCN1145"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 129822,
							                			      "to": 55172,
							                			      "label": "9000.0",
							                			      "ts": "2019-10-24 23:30:12",
							                			      "txnId": "800025929723006550608243P3FNMU04"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 130305,
							                			      "to": 130306,
							                			      "label": "10000.0",
							                			      "ts": "2019-10-24 23:30:22",
							                			      "txnId": "800025929723006574652160S1ACCH93"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 143356,
							                			      "to": 143357,
							                			      "label": "10000.0",
							                			      "ts": "2019-10-25 00:31:02",
							                			      "txnId": "800025929800031078607885S1ANSU54"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 181190,
							                			      "to": 144369,
							                			      "label": "5000.0",
							                			      "ts": "2019-10-25 02:35:59",
							                			      "txnId": "800004929802304254652160N7167300"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 140235,
							                			      "to": 155394,
							                			      "label": "0.0",
							                			      "ts": "2019-10-25 01:35:04",
							                			      "txnId": "800027929801364236541919AVD8007 "
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 199780,
							                			      "to": 173898,
							                			      "label": "1000.0",
							                			      "ts": "2019-10-25 04:31:43",
							                			      "txnId": "800025929804015164652151S1ANGG03"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 179400,
							                			      "to": 10340,
							                			      "label": "200.0",
							                			      "ts": "2019-10-25 03:34:09",
							                			      "txnId": "30001292980326978260727100220085"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 124920,
							                			      "to": 124921,
							                			      "label": "2000.0",
							                			      "ts": "2019-10-24 23:29:46",
							                			      "txnId": "810300929723002340608043TCCS1058"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 130261,
							                			      "to": 130262,
							                			      "label": "500.0",
							                			      "ts": "2019-10-24 23:30:37",
							                			      "txnId": "504594929723027991559601MN004209"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 181526,
							                			      "to": 132189,
							                			      "label": "10000.0",
							                			      "ts": "2019-10-25 02:37:14",
							                			      "txnId": "800025929802013682608023S1ANDE81"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 199822,
							                			      "to": 144587,
							                			      "label": "500.0",
							                			      "ts": "2019-10-25 04:33:19",
							                			      "txnId": "62201892980401935165216018708621"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 201389,
							                			      "to": 9054,
							                			      "label": "226.4",
							                			      "ts": "2019-10-25 04:32:48",
							                			      "txnId": "300021929804454007608023BDR00001"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 191468,
							                			      "to": 191469,
							                			      "label": "1200.0",
							                			      "ts": "2019-10-25 03:36:44",
							                			      "txnId": "800001929803003192462495S1CNI558"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 194728,
							                			      "to": 194729,
							                			      "label": "10000.0",
							                			      "ts": "2019-10-25 03:40:48",
							                			      "txnId": "403362929803300404607532W0145004"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 125013,
							                			      "to": 39838,
							                			      "label": "0.0",
							                			      "ts": "2019-10-24 23:29:49",
							                			      "txnId": "800010929723960758652262TMB44101"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 139888,
							                			      "to": 139889,
							                			      "label": "10000.0",
							                			      "ts": "2019-10-25 00:29:41",
							                			      "txnId": "800025929800031022607909S1ANHY19"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 141535,
							                			      "to": 141536,
							                			      "label": "10000.0",
							                			      "ts": "2019-10-25 00:30:31",
							                			      "txnId": "70000792980001691360753240144670"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 194283,
							                			      "to": 194531,
							                			      "label": "4000.0",
							                			      "ts": "2019-10-25 03:41:31",
							                			      "txnId": "800027929803325821608027IKC8019 "
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 194260,
							                			      "to": 188351,
							                			      "label": "10000.0",
							                			      "ts": "2019-10-25 03:38:29",
							                			      "txnId": "62201892980301943852235831254022"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 157735,
							                			      "to": 157736,
							                			      "label": "500.0",
							                			      "ts": "2019-10-25 01:31:29",
							                			      "txnId": "800025929801000052607589P3DCGT02"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 145131,
							                			      "to": 145132,
							                			      "label": "5000.0",
							                			      "ts": "2019-10-25 00:33",
							                			      "txnId": "429393929800432828421492CHOD9444"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 124793,
							                			      "to": 124794,
							                			      "label": "5000.0",
							                			      "ts": "2019-10-24 23:29:44",
							                			      "txnId": "800024929723024460526495CPRH4070"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 140046,
							                			      "to": 94830,
							                			      "label": "4500.0",
							                			      "ts": "2019-10-25 00:29:48",
							                			      "txnId": "429393929800308582512652KNON2024"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 191141,
							                			      "to": 191142,
							                			      "label": "2500.0",
							                			      "ts": "2019-10-25 03:34:53",
							                			      "txnId": "800025929803001743525380S1AWCB24"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 191782,
							                			      "to": 143408,
							                			      "label": "200.0",
							                			      "ts": "2019-10-25 03:39:42",
							                			      "txnId": "800025929803001812607010S1ACNM54"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 124800,
							                			      "to": 124801,
							                			      "label": "0.0",
							                			      "ts": "2019-10-24 23:29:45",
							                			      "txnId": "62201892972301920550854500900017"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 122272,
							                			      "to": 43349,
							                			      "label": "6238.0",
							                			      "ts": "2019-10-24 23:30:01",
							                			      "txnId": "30001092972391964060790970016078"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 124950,
							                			      "to": 124951,
							                			      "label": "5000.0",
							                			      "ts": "2019-10-24 23:29:47",
							                			      "txnId": "810744929723953285652261UN447901"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 127993,
							                			      "to": 9167,
							                			      "label": "1999.8",
							                			      "ts": "2019-10-24 23:28:32",
							                			      "txnId": "30005492972333853360708589051528"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 145398,
							                			      "to": 9088,
							                			      "label": "120.0",
							                			      "ts": "2019-10-25 00:32:01",
							                			      "txnId": "30001292980015611460753200218923"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 121583,
							                			      "to": 10253,
							                			      "label": "157.4",
							                			      "ts": "2019-10-24 22:39:22",
							                			      "txnId": "30001092972290153060802370021005"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 127923,
							                			      "to": 127924,
							                			      "label": "2000.0",
							                			      "ts": "2019-10-24 23:30:45",
							                			      "txnId": "70000292972300267360810899229198"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 173000,
							                			      "to": 173001,
							                			      "label": "400.0",
							                			      "ts": "2019-10-25 01:40:27",
							                			      "txnId": "720201929801831373608032TN004123"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 140453,
							                			      "to": 132036,
							                			      "label": "2000.0",
							                			      "ts": "2019-10-25 00:32:03",
							                			      "txnId": "504432929800023685607089NPUN9021"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 147112,
							                			      "to": 9088,
							                			      "label": "1.0",
							                			      "ts": "2019-10-25 00:32:28",
							                			      "txnId": "30001292980025627060699400218923"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 157796,
							                			      "to": 40487,
							                			      "label": "2000.0",
							                			      "ts": "2019-10-25 01:30:42",
							                			      "txnId": "800001929801008228408849SACWC662"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 179400,
							                			      "to": 10340,
							                			      "label": "1000.0",
							                			      "ts": "2019-10-25 02:29:59",
							                			      "txnId": "30001292980226738660727100220085"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 140830,
							                			      "to": 9086,
							                			      "label": "150.0",
							                			      "ts": "2019-10-25 00:29:31",
							                			      "txnId": "30005492980083177765216389050470"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 162665,
							                			      "to": 45125,
							                			      "label": "5000.0",
							                			      "ts": "2019-10-25 02:38:19",
							                			      "txnId": "30003892980229953060812080303561"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 153626,
							                			      "to": 9088,
							                			      "label": "70.0",
							                			      "ts": "2019-10-25 00:33:12",
							                			      "txnId": "30001292980015648360709300218923"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 191517,
							                			      "to": 143640,
							                			      "label": "5000.0",
							                			      "ts": "2019-10-25 03:37:02",
							                			      "txnId": "62201892980301385265223604319622"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 140830,
							                			      "to": 9088,
							                			      "label": "100.0",
							                			      "ts": "2019-10-25 00:30:29",
							                			      "txnId": "30001292980015563665216300218923"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 201507,
							                			      "to": 153794,
							                			      "label": "10000.0",
							                			      "ts": "2019-10-25 04:31:10",
							                			      "txnId": "70000792980402310465215140149051"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 124766,
							                			      "to": 115862,
							                			      "label": "0.0",
							                			      "ts": "2019-10-24 23:29:54",
							                			      "txnId": "800001929723005935652163SCVDL374"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 157796,
							                			      "to": 40487,
							                			      "label": "500.0",
							                			      "ts": "2019-10-25 01:31:25",
							                			      "txnId": "800001929801008229408849SACWC662"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 112802,
							                			      "to": 79621,
							                			      "label": "2000.0",
							                			      "ts": "2019-10-24 22:39:34",
							                			      "txnId": "70000292972202893060810899203411"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 155782,
							                			      "to": 8742,
							                			      "label": "1000.0",
							                			      "ts": "2019-10-25 01:28:55",
							                			      "txnId": "800030929801002297622018W41F0196"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 194260,
							                			      "to": 188351,
							                			      "label": "10000.0",
							                			      "ts": "2019-10-25 03:40:13",
							                			      "txnId": "62201892980303096452235831254022"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 157796,
							                			      "to": 158155,
							                			      "label": "500.0",
							                			      "ts": "2019-10-25 01:32:24",
							                			      "txnId": "800001929801002330408849SACWC809"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 195289,
							                			      "to": 9054,
							                			      "label": "672.8",
							                			      "ts": "2019-10-25 03:39:47",
							                			      "txnId": "300021929803453098608023BDR00001"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 155854,
							                			      "to": 155855,
							                			      "label": "0.0",
							                			      "ts": "2019-10-25 01:30:45",
							                			      "txnId": "800001929801006278608023S1CNI190"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 162665,
							                			      "to": 45125,
							                			      "label": "5000.0",
							                			      "ts": "2019-10-25 03:39:32",
							                			      "txnId": "30003892980397269160812080303561"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 195582,
							                			      "to": 195583,
							                			      "label": "160.0",
							                			      "ts": "2019-10-25 03:42:14",
							                			      "txnId": "70000792980302223660753240625576"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 124820,
							                			      "to": 124821,
							                			      "label": "3000.0",
							                			      "ts": "2019-10-24 23:29:46",
							                			      "txnId": "603741929723867312607187C0165006"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 144680,
							                			      "to": 144681,
							                			      "label": "6000.0",
							                			      "ts": "2019-10-25 00:33:02",
							                			      "txnId": "504433929800002596622018S1C01421"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 156920,
							                			      "to": 156921,
							                			      "label": "200.0",
							                			      "ts": "2019-10-25 01:29:48",
							                			      "txnId": "60153092980100378245921644705574"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 120728,
							                			      "to": 120729,
							                			      "label": "0.0",
							                			      "ts": "2019-10-24 22:39:44",
							                			      "txnId": "62201892972202317860803200652003"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 191007,
							                			      "to": 191343,
							                			      "label": "8000.0",
							                			      "ts": "2019-10-25 03:36:04",
							                			      "txnId": "62201892980301471465226207074095"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 125417,
							                			      "to": 104038,
							                			      "label": "2000.0",
							                			      "ts": "2019-10-24 23:30:08",
							                			      "txnId": "900001929723363809607431ID118001"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 129476,
							                			      "to": 129477,
							                			      "label": "10000.0",
							                			      "ts": "2019-10-24 23:30:06",
							                			      "txnId": "800024929723009455606998CPRH7730"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 145098,
							                			      "to": 145099,
							                			      "label": "10000.0",
							                			      "ts": "2019-10-25 00:32:57",
							                			      "txnId": "800024929800002506512652DPRH2544"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 188451,
							                			      "to": 190833,
							                			      "label": "2000.0",
							                			      "ts": "2019-10-25 03:32:37",
							                			      "txnId": "800001929803004362450504S1CND904"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 191233,
							                			      "to": 195475,
							                			      "label": "2977.5",
							                			      "ts": "2019-10-25 03:41:14",
							                			      "txnId": "72030192980302853160710562741796"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 199102,
							                			      "to": 199103,
							                			      "label": "0.0",
							                			      "ts": "2019-10-25 04:32:04",
							                			      "txnId": "800024929804016741652193CWCW5241"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 125109,
							                			      "to": 125110,
							                			      "label": "0.0",
							                			      "ts": "2019-10-24 23:30:33",
							                			      "txnId": "800031929723006439607089FW198601"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 139860,
							                			      "to": 21016,
							                			      "label": "500.0",
							                			      "ts": "2019-10-25 00:29:38",
							                			      "txnId": "62201892980002445751296704251621"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 140577,
							                			      "to": 103733,
							                			      "label": "2000.0",
							                			      "ts": "2019-10-25 00:31:51",
							                			      "txnId": "800031929800014956607270CW118933"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 140235,
							                			      "to": 155394,
							                			      "label": "10000.0",
							                			      "ts": "2019-10-25 00:34:37",
							                			      "txnId": "800027929800364233541919AVD8007 "
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 125371,
							                			      "to": 125372,
							                			      "label": "5000.0",
							                			      "ts": "2019-10-24 23:30:38",
							                			      "txnId": "900001929723646176459115ID137901"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 129455,
							                			      "to": 129456,
							                			      "label": "8000.0",
							                			      "ts": "2019-10-24 23:30:05",
							                			      "txnId": "504594929723027963652209MN002107"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 197917,
							                			      "to": 109371,
							                			      "label": "0.0",
							                			      "ts": "2019-10-25 04:30:01",
							                			      "txnId": "800010929804965960525380TMB39801"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 225251,
							                			      "to": 225252,
							                			      "label": "500.0",
							                			      "ts": "2019-10-26 03:41",
							                			      "txnId": "62201892990301494360727050811001"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 140307,
							                			      "to": 140308,
							                			      "label": "10000.0",
							                			      "ts": "2019-10-25 00:29:59",
							                			      "txnId": "800024929800031015430217DPRH2462"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 143438,
							                			      "to": 143439,
							                			      "label": "200.0",
							                			      "ts": "2019-10-25 00:30:53",
							                			      "txnId": "62201892980000422750899270734001"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 201359,
							                			      "to": 9347,
							                			      "label": "1000.0",
							                			      "ts": "2019-10-25 04:29:11",
							                			      "txnId": "300008929804289766652193cashfree"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 191671,
							                			      "to": 191672,
							                			      "label": "100.0",
							                			      "ts": "2019-10-25 03:33:58",
							                			      "txnId": "800029929803115907606989A2008001"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 194283,
							                			      "to": 194531,
							                			      "label": "10000.0",
							                			      "ts": "2019-10-25 03:37:39",
							                			      "txnId": "800027929803325820608027IKC8019 "
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 181561,
							                			      "to": 197944,
							                			      "label": "100.0",
							                			      "ts": "2019-10-25 04:30:24",
							                			      "txnId": "62201892980401031160774900816206"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 141727,
							                			      "to": 141728,
							                			      "label": "9000.0",
							                			      "ts": "2019-10-25 00:31:53",
							                			      "txnId": "70000292980000595150893047097301"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 155774,
							                			      "to": 130032,
							                			      "label": "3000.0",
							                			      "ts": "2019-10-25 01:36:13",
							                			      "txnId": "80001592980115426865216300007173"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 191460,
							                			      "to": 36545,
							                			      "label": "1000.0",
							                			      "ts": "2019-10-25 03:40",
							                			      "txnId": "504594929803032646512967MC004048"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 155756,
							                			      "to": 155757,
							                			      "label": "2000.0",
							                			      "ts": "2019-10-25 01:30:31",
							                			      "txnId": "800001929801008569606994SACWF501"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 201389,
							                			      "to": 9054,
							                			      "label": "227.18",
							                			      "ts": "2019-10-25 04:31:25",
							                			      "txnId": "300021929804453908608023BDR00001"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 179579,
							                			      "to": 179580,
							                			      "label": "405.0",
							                			      "ts": "2019-10-25 02:31:36",
							                			      "txnId": "72000292980285016760802356112607"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 190534,
							                			      "to": 190535,
							                			      "label": "10000.0",
							                			      "ts": "2019-10-25 03:35:02",
							                			      "txnId": "70000292980300883960802341361814"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 188388,
							                			      "to": 188389,
							                			      "label": "0.0",
							                			      "ts": "2019-10-25 03:29:44",
							                			      "txnId": "62201892980302704560782405678015"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 140577,
							                			      "to": 103733,
							                			      "label": "2000.0",
							                			      "ts": "2019-10-25 00:32:28",
							                			      "txnId": "800031929800014957607270CW118933"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 141727,
							                			      "to": 141728,
							                			      "label": "9000.0",
							                			      "ts": "2019-10-25 00:32:41",
							                			      "txnId": "70000292980000598050893047097301"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 124699,
							                			      "to": 107836,
							                			      "label": "0.0",
							                			      "ts": "2019-10-24 23:30:11",
							                			      "txnId": "800025929723026936522358P3ENCI85"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 191782,
							                			      "to": 176046,
							                			      "label": "0.0",
							                			      "ts": "2019-10-25 03:30:53",
							                			      "txnId": "504482929703441676607010VA195102"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 144931,
							                			      "to": 144932,
							                			      "label": "9000.0",
							                			      "ts": "2019-10-25 00:32:36",
							                			      "txnId": "811022929700524444606994RNB00053"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 159652,
							                			      "to": 9704,
							                			      "label": "160.0",
							                			      "ts": "2019-10-25 01:32:28",
							                			      "txnId": "30004692980100332660706638R00580"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 236925,
							                			      "to": 169998,
							                			      "label": "673.54",
							                			      "ts": "2019-10-26 04:40:42",
							                			      "txnId": "72001492990490062560788313580037"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 140414,
							                			      "to": 15453,
							                			      "label": "4500.0",
							                			      "ts": "2019-10-25 00:31:28",
							                			      "txnId": "800025929800010843608023S1AWUP27"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 130128,
							                			      "to": 67538,
							                			      "label": "10000.0",
							                			      "ts": "2019-10-24 23:30:19",
							                			      "txnId": "800025929723026959459845S1ACDD26"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 139933,
							                			      "to": 150185,
							                			      "label": "500.0",
							                			      "ts": "2019-10-25 00:33:14",
							                			      "txnId": "81031392980000296260712667106901"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 173000,
							                			      "to": 194029,
							                			      "label": "3500.0",
							                			      "ts": "2019-10-25 03:38:55",
							                			      "txnId": "62201892980302704960803200900006"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 188451,
							                			      "to": 188452,
							                			      "label": "2000.0",
							                			      "ts": "2019-10-25 03:30:09",
							                			      "txnId": "800027929803378796450504FPA8013 "
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 194450,
							                			      "to": 194451,
							                			      "label": "500.0",
							                			      "ts": "2019-10-25 03:40:31",
							                			      "txnId": "603741929803873184525380C0128607"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 166056,
							                			      "to": 166057,
							                			      "label": "10000.0",
							                			      "ts": "2019-10-25 01:36:35",
							                			      "txnId": "800025929801025616559601S1AWDH28"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 166695,
							                			      "to": 121110,
							                			      "label": "6000.0",
							                			      "ts": "2019-10-25 01:33:58",
							                			      "txnId": "800004929801603852652163D8006600"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 191347,
							                			      "to": 34409,
							                			      "label": "0.0",
							                			      "ts": "2019-10-25 03:38:08",
							                			      "txnId": "810300929803006376606998TCCS2963"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 128362,
							                			      "to": 128363,
							                			      "label": "3500.0",
							                			      "ts": "2019-10-24 23:30:43",
							                			      "txnId": "70000792972301137765222840624158"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 199544,
							                			      "to": 199132,
							                			      "label": "0.0",
							                			      "ts": "2019-10-25 04:31:34",
							                			      "txnId": "800024929804009860652261CWAW1372"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 143495,
							                			      "to": 86727,
							                			      "label": "10000.0",
							                			      "ts": "2019-10-25 00:31:11",
							                			      "txnId": "800001929800000208559601S1CNP037"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 166695,
							                			      "to": 121110,
							                			      "label": "1000.0",
							                			      "ts": "2019-10-25 01:34:45",
							                			      "txnId": "800004929801603853652163D8006600"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 117433,
							                			      "to": 117434,
							                			      "label": "100.0",
							                			      "ts": "2019-10-24 22:39:21",
							                			      "txnId": "72020192972272783460817120354458"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 140235,
							                			      "to": 155394,
							                			      "label": "10000.0",
							                			      "ts": "2019-10-25 01:33:56",
							                			      "txnId": "800027929801364235541919AVD8007 "
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 129902,
							                			      "to": 129903,
							                			      "label": "500.0",
							                			      "ts": "2019-10-24 23:30:14",
							                			      "txnId": "8000029297230067176070931RDNDEL5"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 150029,
							                			      "to": 143457,
							                			      "label": "500.0",
							                			      "ts": "2019-10-25 00:32:49",
							                			      "txnId": "800014929800863794652262KBNA1520"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 109741,
							                			      "to": 109742,
							                			      "label": "9800.0",
							                			      "ts": "2019-10-24 22:39:09",
							                			      "txnId": "504439929722249874652235DCB01904"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 166014,
							                			      "to": 166015,
							                			      "label": "10000.0",
							                			      "ts": "2019-10-25 01:37:15",
							                			      "txnId": "62201892980102244150891061185041"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 191661,
							                			      "to": 191662,
							                			      "label": "3500.0",
							                			      "ts": "2019-10-25 03:37:23",
							                			      "txnId": "800025929803026391510372S1ACCC23"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 194728,
							                			      "to": 194729,
							                			      "label": "0.0",
							                			      "ts": "2019-10-25 03:39:43",
							                			      "txnId": "403362929803300403607532W0145004"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 199102,
							                			      "to": 199103,
							                			      "label": "2000.0",
							                			      "ts": "2019-10-25 04:31:16",
							                			      "txnId": "800024929804016735652193CWCW5241"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 250822,
							                			      "to": 250823,
							                			      "label": "17000.0",
							                			      "ts": "2019-11-07 22:32:17",
							                			      "txnId": "72039393112217615460790936R92633"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 167169,
							                			      "to": 165903,
							                			      "label": "1000.0",
							                			      "ts": "2019-10-25 01:36:44",
							                			      "txnId": "62201892980101653360699400615001"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 143840,
							                			      "to": 143841,
							                			      "label": "2000.0",
							                			      "ts": "2019-10-25 00:32:20",
							                			      "txnId": "62201892980001951660699414388315"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 128528,
							                			      "to": 128529,
							                			      "label": "597.0",
							                			      "ts": "2019-10-24 23:30:06",
							                			      "txnId": "72020192972379215760718709718412"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 181190,
							                			      "to": 144341,
							                			      "label": "10000.0",
							                			      "ts": "2019-10-25 02:34:04",
							                			      "txnId": "800004929802214414652160DB167300"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 202393,
							                			      "to": 8359,
							                			      "label": "4500.0",
							                			      "ts": "2019-10-25 04:33:02",
							                			      "txnId": "81021292980400429151037245420102"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 140906,
							                			      "to": 140907,
							                			      "label": "700.0",
							                			      "ts": "2019-10-25 00:30:35",
							                			      "txnId": "72001492980090204365226211589943"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 201507,
							                			      "to": 153794,
							                			      "label": "10000.0",
							                			      "ts": "2019-10-25 04:30:35",
							                			      "txnId": "70000792980402309365215140149051"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 145398,
							                			      "to": 9088,
							                			      "label": "100.0",
							                			      "ts": "2019-10-25 00:31:23",
							                			      "txnId": "30001292980015591460753200218923"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 197911,
							                			      "to": 197912,
							                			      "label": "10000.0",
							                			      "ts": "2019-10-25 04:32:10",
							                			      "txnId": "62201892980401091160802300755080"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 129288,
							                			      "to": 108616,
							                			      "label": "0.0",
							                			      "ts": "2019-10-24 23:30:02",
							                			      "txnId": "810869929723001971607532IS002348"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 121583,
							                			      "to": 9991,
							                			      "label": "155.4",
							                			      "ts": "2019-10-24 23:30:27",
							                			      "txnId": "30001292972313541260802300220082"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 201641,
							                			      "to": 9084,
							                			      "label": "500.0",
							                			      "ts": "2019-10-25 04:31:35",
							                			      "txnId": "30001092980494283860708970015490"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 191007,
							                			      "to": 191343,
							                			      "label": "7000.0",
							                			      "ts": "2019-10-25 03:37:03",
							                			      "txnId": "62201892980302720865226207074095"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 191692,
							                			      "to": 191693,
							                			      "label": "10000.0",
							                			      "ts": "2019-10-25 03:38:12",
							                			      "txnId": "800025929803001797607431S1ANJO3 "
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 139933,
							                			      "to": 139934,
							                			      "label": "100.0",
							                			      "ts": "2019-10-25 00:29:49",
							                			      "txnId": "62201892980001054560712600361622"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 140056,
							                			      "to": 140057,
							                			      "label": "500.0",
							                			      "ts": "2019-10-25 00:29:49",
							                			      "txnId": "504432929800012195459186OMUM0140"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 141208,
							                			      "to": 27165,
							                			      "label": "2000.0",
							                			      "ts": "2019-10-25 00:29:56",
							                			      "txnId": "30001292980015553260732400216616"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 140552,
							                			      "to": 136819,
							                			      "label": "500.0",
							                			      "ts": "2019-10-25 00:31:42",
							                			      "txnId": "800024929800007946421492APCN6362"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 143495,
							                			      "to": 86727,
							                			      "label": "10000.0",
							                			      "ts": "2019-10-25 00:32:06",
							                			      "txnId": "800001929800000209559601S1CNP037"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 166096,
							                			      "to": 166097,
							                			      "label": "2000.0",
							                			      "ts": "2019-10-25 01:36:48",
							                			      "txnId": "62201892980101058660699401494025"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 112603,
							                			      "to": 112604,
							                			      "label": "20.0",
							                			      "ts": "2019-10-24 22:39:16",
							                			      "txnId": "70000792972203229465220227087425"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 129346,
							                			      "to": 129347,
							                			      "label": "10000.0",
							                			      "ts": "2019-10-24 23:30:45",
							                			      "txnId": "62201892972300831754191901611041"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 109483,
							                			      "to": 97769,
							                			      "label": "500.0",
							                			      "ts": "2019-10-24 22:39:07",
							                			      "txnId": "62201892972203200365226200311009"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 140176,
							                			      "to": 18791,
							                			      "label": "1000.0",
							                			      "ts": "2019-10-25 00:27:04",
							                			      "txnId": "80000892980013685745920009150124"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 158108,
							                			      "to": 57997,
							                			      "label": "2000.0",
							                			      "ts": "2019-10-25 01:32:11",
							                			      "txnId": "800001929801001139652151SACWJ467"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 157667,
							                			      "to": 157668,
							                			      "label": "500.0",
							                			      "ts": "2019-10-25 01:31:47",
							                			      "txnId": "800028929801934118432093001DM058"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 199525,
							                			      "to": 199526,
							                			      "label": "400.0",
							                			      "ts": "2019-10-25 04:31:16",
							                			      "txnId": "800010929804965997652163TMB23403"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 108574,
							                			      "to": 14639,
							                			      "label": "400.0",
							                			      "ts": "2019-10-24 22:37:20",
							                			      "txnId": "800030929722001407459845M03C0654"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 159748,
							                			      "to": 9088,
							                			      "label": "25.0",
							                			      "ts": "2019-10-25 01:32:56",
							                			      "txnId": "30001292980116318365217100218923"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 125512,
							                			      "to": 125513,
							                			      "label": "500.0",
							                			      "ts": "2019-10-24 23:29:58",
							                			      "txnId": "62201892972302443760723001539017"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 194260,
							                			      "to": 188351,
							                			      "label": "10000.0",
							                			      "ts": "2019-10-25 03:41:02",
							                			      "txnId": "62201892980301246852235831254022"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 195049,
							                			      "to": 111842,
							                			      "label": "50.0",
							                			      "ts": "2019-10-25 03:31:06",
							                			      "txnId": "30003792980395394660802330000255"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 157667,
							                			      "to": 157668,
							                			      "label": "2000.0",
							                			      "ts": "2019-10-25 01:29:59",
							                			      "txnId": "800028929801934112432093001DM058"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 199822,
							                			      "to": 199823,
							                			      "label": "500.0",
							                			      "ts": "2019-10-25 04:32:14",
							                			      "txnId": "62201892980401934465216000300306"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 141727,
							                			      "to": 141728,
							                			      "label": "9000.0",
							                			      "ts": "2019-10-25 00:31:26",
							                			      "txnId": "70000292980000593250893047097301"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 191233,
							                			      "to": 7980,
							                			      "label": "300.0",
							                			      "ts": "2019-10-25 03:35:24",
							                			      "txnId": "800025929803001750607105P3ECBE19"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 130031,
							                			      "to": 130032,
							                			      "label": "1000.0",
							                			      "ts": "2019-10-24 23:30:34",
							                			      "txnId": "80001592972315312165221100007173"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 191347,
							                			      "to": 34409,
							                			      "label": "2500.0",
							                			      "ts": "2019-10-25 03:35:44",
							                			      "txnId": "810300929803006374606998TCCS2963"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 191600,
							                			      "to": 191296,
							                			      "label": "2000.0",
							                			      "ts": "2019-10-25 03:37:35",
							                			      "txnId": "810502929803006209607105TKBS0222"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 124752,
							                			      "to": 124753,
							                			      "label": "6500.0",
							                			      "ts": "2019-10-24 23:29:44",
							                			      "txnId": "62201892972303263260732115417018"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 181561,
							                			      "to": 181562,
							                			      "label": "0.0",
							                			      "ts": "2019-10-25 02:36:32",
							                			      "txnId": "800024929802015992607749SWAW1383"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 24406,
							                			      "to": 24407,
							                			      "label": "2000.0",
							                			      "ts": "2019-10-24 18:09:24",
							                			      "txnId": "504432929718002642607093NMUM7251"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 125316,
							                			      "to": 125317,
							                			      "label": "5000.0",
							                			      "ts": "2019-10-24 23:29:56",
							                			      "txnId": "800031929723004581461934FW198201"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 191600,
							                			      "to": 191296,
							                			      "label": "2000.0",
							                			      "ts": "2019-10-25 03:39:03",
							                			      "txnId": "810502929803006210607105TKBS0222"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 108880,
							                			      "to": 108881,
							                			      "label": "3000.0",
							                			      "ts": "2019-10-24 22:39:02",
							                			      "txnId": "800025929722019503522358S1ACMB63"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 201774,
							                			      "to": 9088,
							                			      "label": "2000.0",
							                			      "ts": "2019-10-25 04:32:04",
							                			      "txnId": "30001292980417134760709300218923"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 145086,
							                			      "to": 145087,
							                			      "label": "0.0",
							                			      "ts": "2019-10-25 00:32:56",
							                			      "txnId": "62201892980000423450899160318009"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 159652,
							                			      "to": 9088,
							                			      "label": "10.0",
							                			      "ts": "2019-10-25 01:33:31",
							                			      "txnId": "30001292980116326360706600218923"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 197949,
							                			      "to": 144008,
							                			      "label": "10000.0",
							                			      "ts": "2019-10-25 04:31:09",
							                			      "txnId": "603741929804873982608023CD117301"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 124811,
							                			      "to": 124812,
							                			      "label": "10000.0",
							                			      "ts": "2019-10-24 23:29:45",
							                			      "txnId": "800001929723005997428090S1CNQ462"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 111739,
							                			      "to": 10526,
							                			      "label": "120.0",
							                			      "ts": "2019-10-24 22:38:47",
							                			      "txnId": "30001292972211385360708900218060"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 129209,
							                			      "to": 129237,
							                			      "label": "300.0",
							                			      "ts": "2019-10-24 23:29:59",
							                			      "txnId": "800025929723006536608234S1ANLA03"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 195451,
							                			      "to": 9088,
							                			      "label": "1.0",
							                			      "ts": "2019-10-25 03:38:52",
							                			      "txnId": "30001292980326999760743100218923"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 185598,
							                			      "to": 183922,
							                			      "label": "250.0",
							                			      "ts": "2019-10-25 02:39:58",
							                			      "txnId": "70000792980202119965215728085070"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 143783,
							                			      "to": 15803,
							                			      "label": "10000.0",
							                			      "ts": "2019-10-25 00:30:46",
							                			      "txnId": "800004929800301312652160N4156500"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 141470,
							                			      "to": 45822,
							                			      "label": "424.0",
							                			      "ts": "2019-10-25 00:30:53",
							                			      "txnId": "30001092980092867960708970011751"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 159775,
							                			      "to": 9088,
							                			      "label": "31.0",
							                			      "ts": "2019-10-25 01:32:58",
							                			      "txnId": "30001292980126319160785900218923"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 143840,
							                			      "to": 143841,
							                			      "label": "1000.0",
							                			      "ts": "2019-10-25 00:31:29",
							                			      "txnId": "62201892980000642260699414388315"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 199525,
							                			      "to": 199526,
							                			      "label": "0.0",
							                			      "ts": "2019-10-25 04:32:04",
							                			      "txnId": "800010929804966010652163TMB23403"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 144754,
							                			      "to": 43069,
							                			      "label": "0.0",
							                			      "ts": "2019-10-25 00:32:13",
							                			      "txnId": "8000029298000074604520551FNCHE24"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 166857,
							                			      "to": 166858,
							                			      "label": "8000.0",
							                			      "ts": "2019-10-25 01:34:40",
							                			      "txnId": "800024929801003377607253BPCN2744"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 224249,
							                			      "to": 27165,
							                			      "label": "4000.0",
							                			      "ts": "2019-10-25 23:38:59",
							                			      "txnId": "30001292982320826550885500216616"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 140577,
							                			      "to": 103733,
							                			      "label": "2000.0",
							                			      "ts": "2019-10-25 00:33:02",
							                			      "txnId": "800031929800014958607270CW118933"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 201389,
							                			      "to": 9054,
							                			      "label": "217.74",
							                			      "ts": "2019-10-25 04:29:30",
							                			      "txnId": "300021929804453799608023BDR00001"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 124699,
							                			      "to": 107836,
							                			      "label": "10000.0",
							                			      "ts": "2019-10-24 23:29:42",
							                			      "txnId": "800025929723026900522358P3ENCI85"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 197949,
							                			      "to": 199654,
							                			      "label": "10000.0",
							                			      "ts": "2019-10-25 04:32:44",
							                			      "txnId": "603741929804874020608023C0117301"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 199800,
							                			      "to": 199801,
							                			      "label": "0.0",
							                			      "ts": "2019-10-25 04:31:48",
							                			      "txnId": "603741929804873997607089C0161601"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 128387,
							                			      "to": 128388,
							                			      "label": "230.0",
							                			      "ts": "2019-10-24 23:30:18",
							                			      "txnId": "70000292972300263550885540086467"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 124552,
							                			      "to": 124553,
							                			      "label": "500.0",
							                			      "ts": "2019-10-24 23:29:40",
							                			      "txnId": "800048929723713664428090ATM09101"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 155774,
							                			      "to": 157632,
							                			      "label": "2000.0",
							                			      "ts": "2019-10-25 01:31:58",
							                			      "txnId": "62201892980100035765216301467002"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 121583,
							                			      "to": 9991,
							                			      "label": "155.4",
							                			      "ts": "2019-10-24 23:29:53",
							                			      "txnId": "30001292972313515560802300220082"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 129460,
							                			      "to": 129461,
							                			      "label": "2000.0",
							                			      "ts": "2019-10-24 23:30:05",
							                			      "txnId": "800024929723009454559601BECN1531"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 195451,
							                			      "to": 9088,
							                			      "label": "1.0",
							                			      "ts": "2019-10-25 03:41:04",
							                			      "txnId": "30001292980327006760743100218923"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 124533,
							                			      "to": 124534,
							                			      "label": "0.0",
							                			      "ts": "2019-10-24 23:29:40",
							                			      "txnId": "62201892972303220160784830067006"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 194457,
							                			      "to": 84835,
							                			      "label": "400.0",
							                			      "ts": "2019-10-25 03:40:21",
							                			      "txnId": "800024929803004296401704TWCW1224"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 127923,
							                			      "to": 127924,
							                			      "label": "2000.0",
							                			      "ts": "2019-10-24 23:30:33",
							                			      "txnId": "70000292972300265660810899229198"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 128088,
							                			      "to": 9088,
							                			      "label": "2000.0",
							                			      "ts": "2019-10-24 23:30:07",
							                			      "txnId": "30001292972323526060790900218923"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 201217,
							                			      "to": 27165,
							                			      "label": "200.0",
							                			      "ts": "2019-10-25 03:43:49",
							                			      "txnId": "30001292980317015365220900216616"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 191007,
							                			      "to": 184730,
							                			      "label": "10000.0",
							                			      "ts": "2019-10-25 03:34:02",
							                			      "txnId": "62201892980300928665226207074057"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 199220,
							                			      "to": 90903,
							                			      "label": "2200.0",
							                			      "ts": "2019-10-25 04:31:05",
							                			      "txnId": "800025929804002545607431S1AWCD08"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 194283,
							                			      "to": 194284,
							                			      "label": "10000.0",
							                			      "ts": "2019-10-25 03:39:08",
							                			      "txnId": "62201892980300535060802701490062"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 194260,
							                			      "to": 188351,
							                			      "label": "10000.0",
							                			      "ts": "2019-10-25 03:39:18",
							                			      "txnId": "62201892980301471552235831254022"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 125013,
							                			      "to": 39838,
							                			      "label": "0.0",
							                			      "ts": "2019-10-24 23:30:56",
							                			      "txnId": "800010929723960883652262TMB44101"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 145398,
							                			      "to": 9088,
							                			      "label": "100.0",
							                			      "ts": "2019-10-25 00:32:41",
							                			      "txnId": "30001292980015632860753200218923"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 139914,
							                			      "to": 139915,
							                			      "label": "6500.0",
							                			      "ts": "2019-10-25 00:29:42",
							                			      "txnId": "800025929800010745652159S1ANBK85"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 144153,
							                			      "to": 113011,
							                			      "label": "1000.0",
							                			      "ts": "2019-10-25 00:32:51",
							                			      "txnId": "800009929800169751607589ALD19931"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 191460,
							                			      "to": 36545,
							                			      "label": "1000.0",
							                			      "ts": "2019-10-25 03:41:13",
							                			      "txnId": "504594929803032659512967MC004048"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 124604,
							                			      "to": 22038,
							                			      "label": "1000.0",
							                			      "ts": "2019-10-24 23:29:41",
							                			      "txnId": "62201892972302213060790903595022"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 166857,
							                			      "to": 166858,
							                			      "label": "1000.0",
							                			      "ts": "2019-10-25 01:36:49",
							                			      "txnId": "800024929801003396607253BPCN2744"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 129434,
							                			      "to": 129435,
							                			      "label": "0.0",
							                			      "ts": "2019-10-24 23:30:04",
							                			      "txnId": "62201892972301246265219661185126"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 158182,
							                			      "to": 136386,
							                			      "label": "400.0",
							                			      "ts": "2019-10-25 01:32:31",
							                			      "txnId": "800024929801031736472254CWCW5141"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 140296,
							                			      "to": 140297,
							                			      "label": "1500.0",
							                			      "ts": "2019-10-25 00:29:58",
							                			      "txnId": "800024929800026016652150CPRH5910"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 191460,
							                			      "to": 191461,
							                			      "label": "5000.0",
							                			      "ts": "2019-10-25 03:37:24",
							                			      "txnId": "62201892980301084651296705088621"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 157850,
							                			      "to": 157851,
							                			      "label": "10000.0",
							                			      "ts": "2019-10-25 01:30:55",
							                			      "txnId": "800025929801000043459845S1ANPE47"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 125417,
							                			      "to": 104038,
							                			      "label": "1000.0",
							                			      "ts": "2019-10-24 23:31:08",
							                			      "txnId": "900001929723363810607431ID118001"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 147167,
							                			      "to": 44917,
							                			      "label": "100.0",
							                			      "ts": "2019-10-25 00:33:03",
							                			      "txnId": "70000792980001705665222847082146"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 125417,
							                			      "to": 104038,
							                			      "label": "2500.0",
							                			      "ts": "2019-10-24 23:29:56",
							                			      "txnId": "900001929723363808607431ID118001"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 108780,
							                			      "to": 16146,
							                			      "label": "8000.0",
							                			      "ts": "2019-10-24 22:39:08",
							                			      "txnId": "504594929722023184607093MN001269"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 124931,
							                			      "to": 124932,
							                			      "label": "10000.0",
							                			      "ts": "2019-10-24 23:29:46",
							                			      "txnId": "62201892972302437560709300478034"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 194066,
							                			      "to": 101551,
							                			      "label": "0.0",
							                			      "ts": "2019-10-25 03:39:04",
							                			      "txnId": "800001929803009966459845SCVDL829"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 140453,
							                			      "to": 132036,
							                			      "label": "3000.0",
							                			      "ts": "2019-10-25 00:30:44",
							                			      "txnId": "504432929800023670607089NPUN9021"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 191692,
							                			      "to": 191693,
							                			      "label": "10000.0",
							                			      "ts": "2019-10-25 03:39:13",
							                			      "txnId": "800025929803001808607431S1ANJO3 "
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 124771,
							                			      "to": 124493,
							                			      "label": "0.0",
							                			      "ts": "2019-10-24 23:31:02",
							                			      "txnId": "810812929723724873652151ABNGJ017"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 199586,
							                			      "to": 139742,
							                			      "label": "10000.0",
							                			      "ts": "2019-10-25 04:31:39",
							                			      "txnId": "800004929804820080608043B1364800"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 191460,
							                			      "to": 191461,
							                			      "label": "10000.0",
							                			      "ts": "2019-10-25 03:36:43",
							                			      "txnId": "62201892980302479951296705088621"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 191782,
							                			      "to": 143408,
							                			      "label": "200.0",
							                			      "ts": "2019-10-25 03:35:38",
							                			      "txnId": "800025929803001756607010S1ACNM54"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 236664,
							                			      "to": 236665,
							                			      "label": "100.0",
							                			      "ts": "2019-10-28 03:41:31",
							                			      "txnId": "7204149301039055566521514907324M"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 202315,
							                			      "to": 202316,
							                			      "label": "5000.0",
							                			      "ts": "2019-10-25 04:33:29",
							                			      "txnId": "62201892980403112160721400296011"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 158332,
							                			      "to": 165340,
							                			      "label": "500.0",
							                			      "ts": "2019-10-25 01:32:10",
							                			      "txnId": "8000029298010077394520551FDBAR07"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 191141,
							                			      "to": 191142,
							                			      "label": "0.0",
							                			      "ts": "2019-10-25 03:40:04",
							                			      "txnId": "800025929803001823525380S1AWCB24"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 158058,
							                			      "to": 116130,
							                			      "label": "500.0",
							                			      "ts": "2019-10-25 01:31:55",
							                			      "txnId": "5045809984929701621721508781WA070801"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 166695,
							                			      "to": 121110,
							                			      "label": "6500.0",
							                			      "ts": "2019-10-25 01:36:38",
							                			      "txnId": "800004929801603855652163D8006600"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 129492,
							                			      "to": 97562,
							                			      "label": "2000.0",
							                			      "ts": "2019-10-24 23:30:47",
							                			      "txnId": "603741929723867388608023C0128303"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 143495,
							                			      "to": 86727,
							                			      "label": "10000.0",
							                			      "ts": "2019-10-25 00:32:59",
							                			      "txnId": "800001929800000210559601S1CNP037"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 194283,
							                			      "to": 194531,
							                			      "label": "6000.0",
							                			      "ts": "2019-10-25 03:42:14",
							                			      "txnId": "800027929803325822608027IKC8019 "
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 155774,
							                			      "to": 130032,
							                			      "label": "2000.0",
							                			      "ts": "2019-10-25 01:34:53",
							                			      "txnId": "80001592980115426065216300007173"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 129424,
							                			      "to": 129425,
							                			      "label": "8000.0",
							                			      "ts": "2019-10-24 23:30:04",
							                			      "txnId": "800001929723008367608171S1CPN221"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 195573,
							                			      "to": 195574,
							                			      "label": "200.0",
							                			      "ts": "2019-10-25 03:41:14",
							                			      "txnId": "72000192980390055460750965311525"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 143783,
							                			      "to": 15803,
							                			      "label": "10000.0",
							                			      "ts": "2019-10-25 00:32:35",
							                			      "txnId": "800004929800301313652160N4156500"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 144680,
							                			      "to": 144681,
							                			      "label": "10000.0",
							                			      "ts": "2019-10-25 00:32:02",
							                			      "txnId": "504433929800002595622018S1C01421"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 188451,
							                			      "to": 190833,
							                			      "label": "2000.0",
							                			      "ts": "2019-10-25 03:35:40",
							                			      "txnId": "800001929803004363450504S1CND904"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 127923,
							                			      "to": 127924,
							                			      "label": "2000.0",
							                			      "ts": "2019-10-24 23:30:03",
							                			      "txnId": "70000292972300261160810899229198"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 155782,
							                			      "to": 8742,
							                			      "label": "1000.0",
							                			      "ts": "2019-10-25 01:28:19",
							                			      "txnId": "800030929801002296622018W41F0196"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 159593,
							                			      "to": 9238,
							                			      "label": "270.0",
							                			      "ts": "2019-10-25 01:31:52",
							                			      "txnId": "30000892980128361160809511113565"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 195653,
							                			      "to": 9196,
							                			      "label": "263.19",
							                			      "ts": "2019-10-25 03:35:10",
							                			      "txnId": "300008929803289415607093IRCTKTMA"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 166021,
							                			      "to": 143682,
							                			      "label": "1500.0",
							                			      "ts": "2019-10-25 01:36:26",
							                			      "txnId": "62201892980101201065216301431014"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 199102,
							                			      "to": 199103,
							                			      "label": "1000.0",
							                			      "ts": "2019-10-25 04:30:23",
							                			      "txnId": "800024929804016726652193CWCW5241"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 44064,
							                			      "to": 44065,
							                			      "label": "3130.96",
							                			      "ts": "2019-10-24 18:27:16",
							                			      "txnId": "72020192971896761560817120318024"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 157735,
							                			      "to": 157736,
							                			      "label": "0.0",
							                			      "ts": "2019-10-25 01:30:29",
							                			      "txnId": "800025929801000027607589P3DCGT02"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 166014,
							                			      "to": 166015,
							                			      "label": "10000.0",
							                			      "ts": "2019-10-25 01:36:22",
							                			      "txnId": "62201892980101653250891061185041"
							                			    },
							                			    {
							                			      "color": "#FF0000",
							                			      "arrows": "to",
							                			      "from": 108821,
							                			      "to": 108822,
							                			      "label": "500.0",
							                			      "ts": "2019-10-24 22:39:01",
							                			      "txnId": "81086992972200965345911506176273"
							                			    }
							                			  ],
							                			  "forms1": [
							                			    {
							                			      "id": 24406,
							                			      "cardNumber": "6070936164442854",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 194283,
							                			      "cardNumber": "6080270200449535",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 129461,
							                			      "terminalId": "BECN1531",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 129524,
							                			      "terminalId": "01467003",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 124699,
							                			      "cardNumber": "5223580111572922",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 9196,
							                			      "terminalId": "IRCTKTMA",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 115862,
							                			      "terminalId": "SCVDL374",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 125512,
							                			      "cardNumber": "6072300001629710",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 195574,
							                			      "terminalId": "65311525",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 157796,
							                			      "cardNumber": "4088490002792620",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 181562,
							                			      "terminalId": "SWAW1383",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 139915,
							                			      "terminalId": "S1ANBK85",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 159593,
							                			      "cardNumber": "6080951504392600",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 124771,
							                			      "cardNumber": "6521510603286191",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 141032,
							                			      "cardNumber": "6070415003886936",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 166858,
							                			      "terminalId": "BPCN2744",
							                			      "color": "#4882ff",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 191347,
							                			      "cardNumber": "6069980068541737",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 236664,
							                			      "cardNumber": "6521515033342225",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 14639,
							                			      "terminalId": "M03C0654",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 188388,
							                			      "cardNumber": "6078240004407009",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 191469,
							                			      "terminalId": "S1CNI558",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 124752,
							                			      "cardNumber": "6073212177842150",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 124800,
							                			      "cardNumber": "5085450200259038",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 199132,
							                			      "terminalId": "CWAW1372",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 143783,
							                			      "cardNumber": "6521601396524557",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 143438,
							                			      "cardNumber": "5089921339886319",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 124932,
							                			      "terminalId": "00478034",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 197949,
							                			      "cardNumber": "6080231530052589",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 201217,
							                			      "cardNumber": "6522091524083685",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 195049,
							                			      "cardNumber": "6080235606023085",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 130305,
							                			      "cardNumber": "6521600132607684",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 44917,
							                			      "terminalId": "47082146",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 199586,
							                			      "cardNumber": "6080434077002831",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 190534,
							                			      "cardNumber": "6080233694003697",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 155837,
							                			      "terminalId": "S1ACDH20",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 125013,
							                			      "cardNumber": "6522623002168164",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 156950,
							                			      "cardNumber": "5089147703000192",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 173000,
							                			      "cardNumber": "6080320513146789",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 9238,
							                			      "terminalId": "11113565",
							                			      "color": "#4882ff",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 191692,
							                			      "cardNumber": "6074310204829668",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 141208,
							                			      "cardNumber": "6073240200096643",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 140010,
							                			      "cardNumber": "6072700634554799",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 124968,
							                			      "terminalId": "P1ENMU05",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 67538,
							                			      "terminalId": "S1ACDD26",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 140453,
							                			      "cardNumber": "6070891458009259",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 121583,
							                			      "cardNumber": "6080235320000948",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 124534,
							                			      "terminalId": "30067006",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 157735,
							                			      "cardNumber": "6075894147009537",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 144153,
							                			      "cardNumber": "6075896501009078",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 199654,
							                			      "terminalId": "C0117301",
							                			      "color": "#4882ff",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 157851,
							                			      "terminalId": "S1ANPE47",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 202315,
							                			      "cardNumber": "6072149901832456",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 199526,
							                			      "terminalId": "TMB23403",
							                			      "color": "#4882ff",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 191141,
							                			      "cardNumber": "5253800207486040",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 191460,
							                			      "cardNumber": "5129670100167431",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 9086,
							                			      "terminalId": "89050470",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 86727,
							                			      "terminalId": "S1CNP037",
							                			      "color": "#ee0",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 108821,
							                			      "cardNumber": "4591150398926139",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 128294,
							                			      "cardNumber": "6074310034211616",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 57997,
							                			      "terminalId": "SACWJ467",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 144754,
							                			      "cardNumber": "4520554092021889",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 124553,
							                			      "terminalId": "ATM09101",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 191468,
							                			      "cardNumber": "4624951790008223",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 132800,
							                			      "terminalId": "03595037",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 140552,
							                			      "cardNumber": "4214920355767958",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 124766,
							                			      "cardNumber": "6521635633028519",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 129346,
							                			      "cardNumber": "5419190210741453",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 120728,
							                			      "cardNumber": "6080320402920997",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 9054,
							                			      "terminalId": "BDR00001",
							                			      "color": "#f00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 156920,
							                			      "cardNumber": "4592164021003843",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 124787,
							                			      "terminalId": "S1CNI134",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 144587,
							                			      "terminalId": "18708621",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 125352,
							                			      "cardNumber": "4712191508271366",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 111842,
							                			      "terminalId": "30000255",
							                			      "color": "#4882ff",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 7980,
							                			      "terminalId": "P3ECBE19",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 130261,
							                			      "cardNumber": "5596010173889633",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 139860,
							                			      "cardNumber": "5129670807707844",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 159775,
							                			      "cardNumber": "6078591003593045",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 169998,
							                			      "terminalId": "13580037",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 124967,
							                			      "cardNumber": "4637950201950556",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 191343,
							                			      "terminalId": "07074095",
							                			      "color": "#4882ff",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 140903,
							                			      "terminalId": "E0002314",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 201774,
							                			      "cardNumber": "6070936150024989",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 145095,
							                			      "cardNumber": "6080235347034144",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 144932,
							                			      "terminalId": "RNB00053",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 9704,
							                			      "terminalId": "38R00580",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 166097,
							                			      "terminalId": "01494025",
							                			      "color": "#4882ff",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 141535,
							                			      "cardNumber": "6075320817828667",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 166760,
							                			      "cardNumber": "6522121302240064",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 108780,
							                			      "cardNumber": "6070936188418971",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 125003,
							                			      "cardNumber": "6069980064492992",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 150029,
							                			      "cardNumber": "6522622217140141",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 139914,
							                			      "cardNumber": "6521590207403202",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 112802,
							                			      "cardNumber": "6081080150384601",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 22038,
							                			      "terminalId": "03595022",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 97769,
							                			      "terminalId": "00311009",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 124931,
							                			      "cardNumber": "6070936019909271",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 129209,
							                			      "cardNumber": "6082345131000561",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 191661,
							                			      "cardNumber": "5103720271584508",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 185598,
							                			      "cardNumber": "6521570108647123",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 129476,
							                			      "cardNumber": "6069989736971242",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 166021,
							                			      "cardNumber": "6521636032014951",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 34409,
							                			      "terminalId": "TCCS2963",
							                			      "color": "#ee0",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 197911,
							                			      "cardNumber": "6080235138015575",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 16146,
							                			      "terminalId": "MN001269",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 127939,
							                			      "cardNumber": "6521590177401855",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 139742,
							                			      "terminalId": "B1364800",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 127993,
							                			      "cardNumber": "6070857501724301",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 129237,
							                			      "terminalId": "S1ANLA03",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 155756,
							                			      "cardNumber": "6069945005454179",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 158126,
							                			      "terminalId": "00358017",
							                			      "color": "#4882ff",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 128388,
							                			      "terminalId": "40086467",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 188389,
							                			      "terminalId": "05678015",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 129435,
							                			      "terminalId": "61185126",
							                			      "color": "#4882ff",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 129492,
							                			      "cardNumber": "6080231021001095",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 3371,
							                			      "terminalId": "1FDTIR11",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 124951,
							                			      "terminalId": "UN447901",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 124811,
							                			      "cardNumber": "4280902006757827",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 157850,
							                			      "cardNumber": "4598459004655724",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 176046,
							                			      "terminalId": "VA195102",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 108822,
							                			      "terminalId": "06176273",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 191782,
							                			      "cardNumber": "6070109100433417",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 43032,
							                			      "terminalId": "LWCW3002",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 147112,
							                			      "cardNumber": "6069942101293320",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 158155,
							                			      "terminalId": "SACWC809",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 199102,
							                			      "cardNumber": "6521931653007982",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 112887,
							                			      "terminalId": "1CRHTNCO",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 125109,
							                			      "cardNumber": "6070891033018403",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 124245,
							                			      "terminalId": "ABA8005 ",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 132036,
							                			      "terminalId": "NPUN9021",
							                			      "color": "#4882ff",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 139888,
							                			      "cardNumber": "6079090334045469",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 194531,
							                			      "terminalId": "IKC8019 ",
							                			      "color": "#ee0",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 125084,
							                			      "cardNumber": "6070936151744908",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 140759,
							                			      "terminalId": "20301132",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 128362,
							                			      "cardNumber": "6522284310009846",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 191517,
							                			      "cardNumber": "6522360010043069",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 224249,
							                			      "cardNumber": "5088550000461671",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 140296,
							                			      "cardNumber": "6521503920022969",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 145096,
							                			      "terminalId": "C0117902",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 94830,
							                			      "terminalId": "KNON2024",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 190474,
							                			      "cardNumber": "6521590750402890",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 136386,
							                			      "terminalId": "CWCW5141",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 130031,
							                			      "cardNumber": "6522110010422841",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 125417,
							                			      "cardNumber": "6074310080793137",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 157668,
							                			      "terminalId": "001DM058",
							                			      "color": "#4882ff",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 143841,
							                			      "terminalId": "14388315",
							                			      "color": "#ee0",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 109741,
							                			      "cardNumber": "6522350006138189",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 158125,
							                			      "cardNumber": "6521636700022807",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 199800,
							                			      "cardNumber": "6070893056003197",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 117433,
							                			      "cardNumber": "6081711763000990",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 166014,
							                			      "cardNumber": "5089100005836581",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 188451,
							                			      "cardNumber": "4505040001634821",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 15803,
							                			      "terminalId": "N4156500",
							                			      "color": "#4882ff",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 124820,
							                			      "cardNumber": "6071870002300157",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 179580,
							                			      "terminalId": "56112607",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 9347,
							                			      "terminalId": "cashfree",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 21016,
							                			      "terminalId": "04251621",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 129425,
							                			      "terminalId": "S1CPN221",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 107836,
							                			      "terminalId": "P3ENCI85",
							                			      "color": "#4882ff",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 129460,
							                			      "cardNumber": "5596010142538584",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 108616,
							                			      "terminalId": "IS002348",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 194066,
							                			      "cardNumber": "4598450004847353",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 143840,
							                			      "cardNumber": "6069945103352838",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 130262,
							                			      "terminalId": "MN004209",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 140297,
							                			      "terminalId": "CPRH5910",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 173001,
							                			      "terminalId": "TN004123",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 9167,
							                			      "terminalId": "89051528",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 159652,
							                			      "cardNumber": "6070660900040760",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 129347,
							                			      "terminalId": "01611041",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 125513,
							                			      "terminalId": "01539017",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 79621,
							                			      "terminalId": "99203411",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 194031,
							                			      "terminalId": "TKIS0536",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 225252,
							                			      "terminalId": "50811001",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 125372,
							                			      "terminalId": "ID137901",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 145099,
							                			      "terminalId": "DPRH2544",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 130306,
							                			      "terminalId": "S1ACCH93",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 144361,
							                			      "terminalId": "SACWC456",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 199525,
							                			      "cardNumber": "6521636061021083",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 191233,
							                			      "cardNumber": "6071059417016059",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 124921,
							                			      "terminalId": "TCCS1058",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 128528,
							                			      "cardNumber": "6071870003026579",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 43069,
							                			      "terminalId": "1FNCHE24",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 124753,
							                			      "terminalId": "15417018",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 8742,
							                			      "terminalId": "W41F0196",
							                			      "color": "#4882ff",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 145132,
							                			      "terminalId": "CHOD9444",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 124793,
							                			      "cardNumber": "5264956828049794",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 202260,
							                			      "cardNumber": "5175740010283728",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 116130,
							                			      "terminalId": "WA070801",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 165903,
							                			      "terminalId": "00615001",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 143457,
							                			      "terminalId": "KBNA1520",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 6499,
							                			      "cardNumber": "6069989736665810",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 190011,
							                			      "cardNumber": "6075320009914077",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 9088,
							                			      "terminalId": "00218923",
							                			      "color": "#f00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 124602,
							                			      "terminalId": "93492043",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 158058,
							                			      "cardNumber": "5087817187002540",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 129902,
							                			      "cardNumber": "6070936137933989",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 124493,
							                			      "terminalId": "ABNGJ017",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 45822,
							                			      "terminalId": "70011751",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 40487,
							                			      "terminalId": "SACWC662",
							                			      "color": "#4882ff",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 129288,
							                			      "cardNumber": "6075320287706625",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 195583,
							                			      "terminalId": "40625576",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 159748,
							                			      "cardNumber": "6521711515017597",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 125371,
							                			      "cardNumber": "4591150020909834",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 28681,
							                			      "terminalId": "87013766",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 162665,
							                			      "cardNumber": "6081200113955590",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 166056,
							                			      "cardNumber": "5596010169417142",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 108574,
							                			      "cardNumber": "4598450014003211",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 181561,
							                			      "cardNumber": "6077499001803773",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 150435,
							                			      "cardNumber": "6521635639048750",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 140176,
							                			      "cardNumber": "4592000193344849",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 144369,
							                			      "terminalId": "N7167300",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 55172,
							                			      "terminalId": "P3FNMU04",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 236665,
							                			      "terminalId": "4907324M",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 140869,
							                			      "cardNumber": "6072700618755396",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 129424,
							                			      "cardNumber": "6081710412011424",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 117434,
							                			      "terminalId": "20354458",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 144680,
							                			      "cardNumber": "6220180094700353488",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 202386,
							                			      "cardNumber": "4504780103340113",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 124920,
							                			      "cardNumber": "6080433484002046",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 124801,
							                			      "terminalId": "00900017",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 157632,
							                			      "terminalId": "01467002",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 140906,
							                			      "cardNumber": "6522622213183392",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 128529,
							                			      "terminalId": "09718412",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 191671,
							                			      "cardNumber": "6069890001690071",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 124533,
							                			      "cardNumber": "6078485010529508",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 194006,
							                			      "cardNumber": "6070936089441379",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 45125,
							                			      "terminalId": "80303561",
							                			      "color": "#f60",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 124604,
							                			      "cardNumber": "6079092394008783",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 124812,
							                			      "terminalId": "S1CNQ462",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 139889,
							                			      "terminalId": "S1ANHY19",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 9034,
							                			      "terminalId": "70010810",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 145086,
							                			      "cardNumber": "5089910037423350",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 108881,
							                			      "terminalId": "S1ACMB63",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 121110,
							                			      "terminalId": "D8006600",
							                			      "color": "#f60",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 141727,
							                			      "cardNumber": "5089303205010748",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 188452,
							                			      "terminalId": "FPA8013 ",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 166096,
							                			      "cardNumber": "6069942120032659",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 120729,
							                			      "terminalId": "00652003",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 112604,
							                			      "terminalId": "27087425",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 132189,
							                			      "terminalId": "S1ANDE81",
							                			      "color": "#4882ff",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 97562,
							                			      "terminalId": "C0128303",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 141470,
							                			      "cardNumber": "6070891393003789",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 10340,
							                			      "terminalId": "00220085",
							                			      "color": "#ee0",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 166015,
							                			      "terminalId": "61185041",
							                			      "color": "#ee0",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 179579,
							                			      "cardNumber": "6080232009027235",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 225251,
							                			      "cardNumber": "6072700631059065",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 199780,
							                			      "cardNumber": "6521510607852279",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 143682,
							                			      "terminalId": "01431014",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 144008,
							                			      "terminalId": "CD117301",
							                			      "color": "#4882ff",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 9991,
							                			      "terminalId": "00220082",
							                			      "color": "#4882ff",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 140577,
							                			      "cardNumber": "6072700624262429",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 158182,
							                			      "cardNumber": "4722541422036139",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 143408,
							                			      "terminalId": "S1ACNM54",
							                			      "color": "#ee0",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 199823,
							                			      "terminalId": "00300306",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 236925,
							                			      "cardNumber": "6078834003696198",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 10526,
							                			      "terminalId": "00218060",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 128363,
							                			      "terminalId": "40624158",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 194284,
							                			      "terminalId": "01490062",
							                			      "color": "#4882ff",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 103733,
							                			      "terminalId": "CW118933",
							                			      "color": "#ee0",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 157667,
							                			      "cardNumber": "4320933340105532",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 166695,
							                			      "cardNumber": "6521635584031975",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 191142,
							                			      "terminalId": "S1AWCB24",
							                			      "color": "#4882ff",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 188351,
							                			      "terminalId": "31254022",
							                			      "color": "#f60",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 250823,
							                			      "terminalId": "36R92633",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 39838,
							                			      "terminalId": "TMB44101",
							                			      "color": "#4882ff",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 27165,
							                			      "terminalId": "00216616",
							                			      "color": "#ee0",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 125004,
							                			      "terminalId": "BPCN1145",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 124794,
							                			      "terminalId": "CPRH4070",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 143640,
							                			      "terminalId": "04319622",
							                			      "color": "#4882ff",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 108880,
							                			      "cardNumber": "5223580110193878",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 140056,
							                			      "cardNumber": "4591860002652190",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 109742,
							                			      "terminalId": "DCB01904",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 140057,
							                			      "terminalId": "OMUM0140",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 128387,
							                			      "cardNumber": "5088550000045870",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 144681,
							                			      "terminalId": "S1C01421",
							                			      "color": "#4882ff",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 184730,
							                			      "terminalId": "07074057",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 141536,
							                			      "terminalId": "40144670",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 201359,
							                			      "cardNumber": "6521931582003391",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 109371,
							                			      "terminalId": "TMB39801",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 111739,
							                			      "cardNumber": "6070891248001103",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 155854,
							                			      "cardNumber": "6080232164046988",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 143439,
							                			      "terminalId": "70734001",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 155757,
							                			      "terminalId": "SACWF501",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 132029,
							                			      "cardNumber": "6070893117005777",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 201641,
							                			      "cardNumber": "6070896089000528",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 136819,
							                			      "terminalId": "APCN6362",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 158352,
							                			      "terminalId": "S1AWIM01",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 169952,
							                			      "cardNumber": "6080231505039744",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 113011,
							                			      "terminalId": "ALD19931",
							                			      "color": "#4882ff",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 124950,
							                			      "cardNumber": "6522612278000946",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 129455,
							                			      "cardNumber": "6522091532600033",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 139933,
							                			      "cardNumber": "6071261508783148",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 158332,
							                			      "cardNumber": "4520554648016912",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 191600,
							                			      "cardNumber": "6071059632040413",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 191672,
							                			      "terminalId": "A2008001",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 153626,
							                			      "cardNumber": "6070935006227267",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 140830,
							                			      "cardNumber": "6521636846001558",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 155855,
							                			      "terminalId": "S1CNI190",
							                			      "color": "#4882ff",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 90903,
							                			      "terminalId": "S1AWCD08",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 167169,
							                			      "cardNumber": "6069945138906483",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 141728,
							                			      "terminalId": "47097301",
							                			      "color": "#ee0",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 144931,
							                			      "cardNumber": "6069942114597238",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 133525,
							                			      "terminalId": "PR013306",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 6500,
							                			      "terminalId": "AHOW7002",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 10253,
							                			      "terminalId": "70021005",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 147167,
							                			      "cardNumber": "6522280180004032",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 158067,
							                			      "cardNumber": "5089910032552898",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 199103,
							                			      "terminalId": "CWCW5241",
							                			      "color": "#ee0",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 201389,
							                			      "cardNumber": "6080239138034693",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 140414,
							                			      "cardNumber": "6080232543023559",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 183922,
							                			      "terminalId": "28085070",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 125316,
							                			      "cardNumber": "4619340201041378",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 194457,
							                			      "cardNumber": "4017041393011645",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 195573,
							                			      "cardNumber": "6075090926125673",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 129822,
							                			      "cardNumber": "6082430100234563",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 194451,
							                			      "terminalId": "C0128607",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 145098,
							                			      "cardNumber": "5126522019710954",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 156921,
							                			      "terminalId": "44705574",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 199220,
							                			      "cardNumber": "6074310043774802",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 199544,
							                			      "cardNumber": "6522610764022994",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 139934,
							                			      "terminalId": "00361622",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 195475,
							                			      "terminalId": "62741796",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 125110,
							                			      "terminalId": "FW198601",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 158351,
							                			      "cardNumber": "6521570110605044",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 197917,
							                			      "cardNumber": "5253800200236749",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 129903,
							                			      "terminalId": "1RDNDEL5",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 140907,
							                			      "terminalId": "11589943",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 179400,
							                			      "cardNumber": "6072710100338718",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 76011,
							                			      "terminalId": "SPCND117",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 24407,
							                			      "terminalId": "NMUM7251",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 143495,
							                			      "cardNumber": "5596010164232637",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 140758,
							                			      "cardNumber": "6070660484038917",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 18791,
							                			      "terminalId": "09150124",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 129456,
							                			      "terminalId": "MN002107",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 155782,
							                			      "cardNumber": "6220180665400047312",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 44065,
							                			      "terminalId": "20318024",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 191007,
							                			      "cardNumber": "6522623025379855",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 199822,
							                			      "cardNumber": "6521601254715388",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 190535,
							                			      "terminalId": "41361814",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 191296,
							                			      "terminalId": "TKBS0222",
							                			      "color": "#4882ff",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 129434,
							                			      "cardNumber": "6521960812001008",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 190475,
							                			      "terminalId": "UP015512",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 141058,
							                			      "cardNumber": "6071013681436170",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 112603,
							                			      "cardNumber": "6522023582017347",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 145398,
							                			      "cardNumber": "6075320385920714",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 194260,
							                			      "cardNumber": "5223580111273760",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 194030,
							                			      "cardNumber": "6075320029376620",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 194728,
							                			      "cardNumber": "6075320571883437",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 15453,
							                			      "terminalId": "S1AWUP27",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 143356,
							                			      "cardNumber": "6078852458007695",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 122272,
							                			      "cardNumber": "6079091889031847",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 140011,
							                			      "terminalId": "CW118957",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 109483,
							                			      "cardNumber": "6522622212950197",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 157736,
							                			      "terminalId": "P3DCGT02",
							                			      "color": "#4882ff",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 128088,
							                			      "cardNumber": "6079090095011114",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 124821,
							                			      "terminalId": "C0165006",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 194029,
							                			      "terminalId": "00900006",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 181526,
							                			      "cardNumber": "6080231427018933",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 155836,
							                			      "cardNumber": "5089631541700816",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 195451,
							                			      "cardNumber": "6074310081988181",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 124786,
							                			      "cardNumber": "6522611847008109",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 250822,
							                			      "cardNumber": "6079091649023860",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 104038,
							                			      "terminalId": "ID118001",
							                			      "color": "#ee0",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 202393,
							                			      "cardNumber": "5103720382165684",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 194007,
							                			      "terminalId": "APRH2260",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 125353,
							                			      "terminalId": "CUB01061",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 10543,
							                			      "terminalId": "87001380",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 191662,
							                			      "terminalId": "S1ACCC23",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 202316,
							                			      "terminalId": "00296011",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 84835,
							                			      "terminalId": "TWCW1224",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 159674,
							                			      "cardNumber": "6072780600116419",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 181190,
							                			      "cardNumber": "6521601020523462",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 127940,
							                			      "terminalId": "5P043242",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 130032,
							                			      "terminalId": "00007173",
							                			      "color": "#ee0",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 124552,
							                			      "cardNumber": "4280901000282493",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 44064,
							                			      "cardNumber": "6081710679008238",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 140902,
							                			      "cardNumber": "6073240204803424",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 133524,
							                			      "cardNumber": "6081710359001198",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 140046,
							                			      "cardNumber": "5126522024435191",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 190833,
							                			      "terminalId": "S1CND904",
							                			      "color": "#4882ff",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 9084,
							                			      "terminalId": "70015490",
							                			      "color": "#4882ff",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 173898,
							                			      "terminalId": "S1ANGG03",
							                			      "color": "#4882ff",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 43349,
							                			      "terminalId": "70016078",
							                			      "color": "#4882ff",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 127923,
							                			      "cardNumber": "6081080150319177",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 140235,
							                			      "cardNumber": "5419190202426394",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 158108,
							                			      "cardNumber": "6521515004807883",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 166857,
							                			      "cardNumber": "6072532177131549",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 194450,
							                			      "cardNumber": "5253800203155532",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 195289,
							                			      "cardNumber": "6080235067052011",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 127924,
							                			      "terminalId": "99229198",
							                			      "color": "#f60",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 191693,
							                			      "terminalId": "S1ANJO3 ",
							                			      "color": "#4882ff",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 145131,
							                			      "cardNumber": "4214920337792371",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 114278,
							                			      "terminalId": "S1ANSU07",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 140307,
							                			      "cardNumber": "4302170004027825",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 101551,
							                			      "terminalId": "SCVDL829",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 197944,
							                			      "terminalId": "00816206",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 140308,
							                			      "terminalId": "DPRH2462",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 199801,
							                			      "terminalId": "C0161601",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 166057,
							                			      "terminalId": "S1AWDH28",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 150185,
							                			      "terminalId": "67106901",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 195582,
							                			      "cardNumber": "6075320699494778",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 143357,
							                			      "terminalId": "S1ANSU54",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 201507,
							                			      "cardNumber": "6521510603017299",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 145087,
							                			      "terminalId": "60318009",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 9176,
							                			      "terminalId": "89050471",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 8359,
							                			      "terminalId": "45420102",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 100792,
							                			      "terminalId": "SINN1548",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 130128,
							                			      "cardNumber": "4598459032963884",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 165340,
							                			      "terminalId": "1FDBAR07",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 155394,
							                			      "terminalId": "AVD8007 ",
							                			      "color": "#ee0",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 129477,
							                			      "terminalId": "CPRH7730",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 124958,
							                			      "cardNumber": "5089440052344398",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 144341,
							                			      "terminalId": "DB167300",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 155774,
							                			      "cardNumber": "6521637625000506",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 191461,
							                			      "terminalId": "05088621",
							                			      "color": "#ee0",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 195653,
							                			      "cardNumber": "6070935018153659",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 197912,
							                			      "terminalId": "00755080",
							                			      "color": "#4882ff",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 197548,
							                			      "terminalId": "DELON598",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 108464,
							                			      "terminalId": "ATM0099 ",
							                			      "color": "#006c00",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 153794,
							                			      "terminalId": "40149051",
							                			      "color": "#4882ff",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 36545,
							                			      "terminalId": "MC004048",
							                			      "color": "#4882ff",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 124408,
							                			      "cardNumber": "6521515026919427",
							                			      "color": "#00FFFF",
							                			      "label": "Card"
							                			    },
							                			    {
							                			      "id": 194729,
							                			      "terminalId": "W0145004",
							                			      "color": "#4882ff",
							                			      "label": "Terminal"
							                			    },
							                			    {
							                			      "id": 125317,
							                			      "terminalId": "FW198201",
							                			      "color": "#006c00",
							                			      
							                			    }
							                			  ]
							                			};
							                  
							                  if(data){
							                	  nodes_info = data.forms1;
							                	  $scope.terminal_id_details=data.forms1;
							                	  $scope.array1 = data.forms1.map((x)=>{
														return x.id
													});
							                	  $scope.cppanalysis(data);  
							                  }
							                   
//											},
//						function(err) { } 
//											);
		}
	
	
// *************************************For CPP Ends ************************************************//	
	
	
/* ****************************************AML analysis start ************************************************ */

$scope.amlanalysis = function(data){
	
	nodes=[];
	edges=[];
	nodes = new vis.DataSet();
	$.each(data.forms1, function(i, item) {
		nodes.add({
			"id" : item.id,
			"label" : item.label,
			"shape" : 'dot',
			"size" : "25",
			"color" : item.color
		});
	});
	edges = new vis.DataSet();
	$.each(data.forms2, function(i, item) {
		edges.add({
			"from" : item.from,
			"to" : item.to,
			"label" : item.label,
			"arrows" : item.arrows,
			"length" : 300,
			"font" : {
				color : 'red',
				background : '#fff'
			}
		});
	});
	
	var container = document.getElementById('mynetwork_alm');
	
	var data = {
		nodes : nodes,
		edges : edges
	};
	var options = {
			 autoResize: true,
		      height: '555',
		      width: '100%',
		interaction : {
			hover : true,
			navigationButtons: true,
			keyboard: true
			
		},
		
		manipulation : {
			enabled :  false 
		},
		nodes : {
			shape : 'dot',
			size : 25,
			font : {
				size : 20,
				color : '#000'
			},
			borderWidth : 1
		},
		edges : {
			width : 1,
			length : 50,
			color : '#000'
		},
		groups : {
			diamonds : {
				color : {
					background : '#fff',
					border : 'white'
				},
				shape : 'diamond'
			},
			dotsWithLabel : {
				shape : 'dot',
				color : 'cyan'
			},
			mints : {
				color : 'rgb(0,255,140)'
			},
			icons : {
				shape : 'icon',
				icon : {
					face : 'FontAwesome',
					code : '\uf0c0',
					size : 50,
					color : '#000'
				}
			},
			source : {
				color : {
					border : '#000'
				}
			}
		}
	};

	
	
	
var network2 = new vis.Network(container, data, options);
		

network2.on("hoverNode", function(params)
	    	{
				
				document.getElementById("toast").innerHTML = "";
				var x = document.getElementById("toast")
				var tooltip_info = nodes_info.filter((x)=>{
					return x.id == params.node
					} )
				
				x.innerHTML += "ID: "+tooltip_info[0].id+"; Account Number: "+tooltip_info[0].acctNo+"; Account ID: " +tooltip_info[0].acctid;
				x.className = "show";
				setTimeout(
						   function() 
							   {
								x.className = x.className.replace("show","");
								}, 15000
						  );
		    });

network2.on('doubleClick',function(params){
	if((params.nodes.length > 0) && (params.edges.length > 0)) {
		
		var nodes_id = nodes.getIds(); 
		
		
	var accountNo = nodes_info.filter((x)=>{
		return x.id == params.nodes[0];
		} )
	var account_data = accountNo[0].acctid;	
	neovisJs.header($scope.response.token).getAllTransaction( {
		accountId:account_data,
		startDate : $scope.fromDate1,
		endDate : $scope.toDate1,
		txnCount : $scope.someObject.count_val
		},
		function(response) {
			if(typeof response.response !== "undefined"){
				if(response.response.download == "1")
				{   
					$scope.showondata = true;
					
				}
				else
				{
				var forms_id; forms_id = response.response.forms2.map((x)=>{
					return x.from
				});
				var array3 =''; array3 = forms_id.filter(function(obj) { return $scope.array2.indexOf(obj) == -1; });// filtering nodes that needs to added on click
				var forms2 = ''; forms2 = response.response.forms2.filter(function(obj) { return array3.indexOf(obj.from) !== -1; });
				var forms1 = ''; forms1 = response.response.forms1.filter(function(obj) { return array3.indexOf(obj.id) !== -1; });
				nodes_info = [...nodes_info, ...forms1] //arr3 ==> [1,2,3,4,5,6]
				const found = array3.some(r=> nodes_id.indexOf(r) >= 0)
				
				if(found==false){
					$scope.array2 = [...$scope.array2, ...array3]
					$.each(forms1, function(i, item) {
						nodes.add({
							"id" : item.id,
							"label" : item.label,
							"shape" : 'dot',
							"size" : "25",
							"color" : item.color
						});
					});
					
					$.each(forms2, function(i, item) {
						edges.add({
							"from" : item.from,
							"to" : item.to,
							"label" : item.label,
							"arrows" : item.arrows,
							"length" : 100,
							"font" : {
								color : 'red',
								background : '#fff'
							}
						});
					});
				}
			}
		}	
		},
	function(err) {
			
	})
		      
		
	}
	
        
        
   
})
	
}
/* ********************************************AML Analysis End ******************************************** */

/* *********************************************CPP Analysis Start ************************************** */
/*for cpp analysis*/
$scope.cppanalysis = function(data){
	//image and svg width:123px
	//url:https://vectr.com/tonmoy122/d4E7QHbLLq
	function createImage(itemName,color) {
		var data='';
		  if(itemName=='Card'){
			  data = '../img/network/cards.svg'; 
		  }
		 if(itemName=='Terminal')
		  {
			  if(color=='#f00')
				 data = '../img/network/severe.svg';
			  if(color=='#f60')
				 data = '../img/network/high.svg';	
			  if(color=='#ee0')
				 data = '../img/network/elevated.svg';	 
			  if(color=='#4882ff')
				 data = '../img/network/gaurded.svg'; 	
			  if(color=='#006c00')
				 data = '../img/network/low.svg';
		   }	  
		return data;
		  
		}
	
	nodes=[];
	edges=[];
	nodes = new vis.DataSet();
	$.each(data.forms1, function(i, item) {
		nodes.add({
			"id" : item.id,
			"label" : item.label,
			"shape" : "image",
			"image"	:createImage(item.label,item.color),	
			"size" : item.label=='Card'?'24':'26',
			
		});
	});
	edges = new vis.DataSet();
	$.each(data.forms2, function(i, item) {
		edges.add({
			"from" : item.from,
			"to" : item.to,
			"label" : item.label,
			"arrows" : item.arrows,
			"length" : 300,
			"font" : {
				color : 'red',
				background : '#fff'
			}
		});
	});
	
	var container = document.getElementById('mynetwork_cpp');
	var data = {
		nodes : nodes,
		edges : edges
	};
	var options = {
			 autoResize: true,
		      height: '500',
		      width: '100%',
		layout: { improvedLayout: false },      
		interaction : {
			hover : true,
			navigationButtons: true,
			keyboard: true
			
		},
		nodes : {
			shape : 'dot',
			size : 25,
			font : {
				size : 20,
				color : '#000'
			},
			borderWidth : 1
		},
		edges : {
			width : 1,
			length : 50,
			color : '#000'
		},
		groups : {
			diamonds : {
				color : {
					background : '#fff',
					border : 'white'
				},
				shape : 'diamond'
			},
			dotsWithLabel : {
				shape : 'dot',
				color : 'cyan'
			},
			mints : {
				color : 'rgb(0,255,140)'
			},
			icons : {
				shape : 'icon',
				icon : {
					face : 'FontAwesome',
					code : '\uf0c0',
					size : 50,
					color : '#000'
				}
			},
			source : {
				color : {
					border : '#000'
				}
			}
		},
		physics:{
			stabilization: false
		}
	};

	
	
	
var network2 = new vis.Network(container, data, options);
		network2.on("doubleClick",	function(params) {
			
			if((params.nodes.length > 0) && (params.edges.length > 0)) {
				var nodes_id = nodes.getIds();
				
				var terminalId =[];
				terminalId = $scope.terminal_id_details.filter((x)=>{
					return x.id == params.nodes[0];
					} );
				$scope.store_terminalId=terminalId[0].terminalId;
				if(terminalId[0].terminalId){
					neovisJs.header($scope.response.token).getCppTerminal( {
						startDate : $scope.fromDate1,
						endDate : $scope.toDate1,
						/*terminal : 'P1EWBA67'*/
						terminal : terminalId[0].terminalId,
						flag:'false'
						
					},
					     function(response) {
						if(typeof response.response !== "undefined"){
							if(response.response.response.download == "1")
							{   
								$scope.showondata = true;
								
							}
							else
							{
								var forms_id; forms_id = response.response.response.forms2.map((x)=>{
									return x.from
								});
								var array3 =''; array3 = forms_id.filter(function(obj) { return $scope.array1.indexOf(obj) == -1; });// filtering nodes that needs to added on click
								var forms2 = ''; forms2 = response.response.response.forms2.filter(function(obj) { return array3.indexOf(obj.from) !== -1; });
								var forms1 = ''; forms1 = response.response.response.forms1.filter(function(obj) { return array3.indexOf(obj.id) !== -1; });
								nodes_info = [...nodes_info, ...forms1] //arr3 ==> [1,2,3,4,5,6]
								const found = array3.some(r=> nodes_id.indexOf(r) >= 0);
								if(found==false){
									$scope.array1 = [...$scope.array1, ...array3]
									$.each(forms1, function(i, item) {
										nodes.add({
											"id" : item.id,
											"label" : item.label,
											"shape" : 'dot',
											"size" : "25",
											"color" : item.color
										});
									});
									
									$.each(forms2, function(i, item) {
										edges.add({
											"from" : item.from,
											"to" : item.to,
											"label" : item.label,
											"arrows" : item.arrows,
											"length" : 100,
											"font" : {
												color : 'red',
												background : '#fff'
											}
										});
									});
								}
							
							}
					
						
						
						}	
						
						
						
					},
					      function(err) { }
					
					);
				}
					
				
			}
			
			
			
			});

network2.on("hoverNode", function(params) {
				
		document.getElementById("toast").innerHTML = "";
		var x = document.getElementById("toast")
		var tooltip_info = nodes_info.filter((x)=>{
			return x.id == params.node
			} )
		if(tooltip_info[0].label == 'Card' || tooltip_info[0].label == 'card')	{
			x.innerHTML += "Card Number: "+tooltip_info[0].cardNumber;
		}
		if(tooltip_info[0].label == 'Terminal' || tooltip_info[0].label == 'terminal')	{
			x.innerHTML += "Terminal ID: "+tooltip_info[0].terminalId;
		}
		
		
		x.className = "show";
		setTimeout(
				function() {
					x.className = x.className
							.replace(
									"show",
									"");
				}, 15000);
					});
	
}



/* *******************************************CPP Analysis End ******************************************* */
$scope.getAmlData();
$scope.getReport = function(){
	$scope.show_download_msg = true;
	if($scope.reccur_val == true){
		$scope.flag = true;
		$scope.getAmlData();
	}
	
	if($scope.reccur_val == false){
		
		//alert("clicked on"+ $scope.store_terminalId)
		neovisJs.header($scope.response.token).getCppTerminal( {
			startDate : $scope.fromDate1,
			endDate : $scope.toDate1,
			terminal : $scope.store_terminalId,
			flag:'true'
			
		},
		     function(response) {
			if(response.response.response.download == "2")
			{   
				$scope.report_gent2 = true;
				
			}
			
		},
		     function(err) { }
				
		);
		
		
		
		/*if(response.response.download == "2")
		{
			$scope.report_gent2 = true;
		}*/
	}
	
	
}	
$scope.newValue = function(value){
	
	$scope.show_download_msg = false;
	if(value == true){
		
		$scope.showAml = true;
		$scope.showCpp = false;
		$scope.showondata = false;
		$scope.getAmlData();
		
		
	}
	if(value == false){
		
		$scope.showAml = false;
		$scope.showCpp = true;
		$scope.showondata = false;
		$scope.getCppData();
		
		
	}
}
$scope.checkFunction = function(){
	$scope.flag = false;
	if($scope.reccur_val == true){
		$scope.showondata = false;
		$scope.getAmlData();
	}
	if($scope.reccur_val == false){
		$scope.showondata = false;
		$scope.getCppData();
	}
}

}])