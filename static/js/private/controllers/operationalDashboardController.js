
angular.module('efrm.dashboard')
.controller('operationalDashboard', ['$scope','$rootScope','$state', '$timeout','statusService', 'UserService','AdminService', '$ngConfirm', 'RolePermissionMatrix','Util', 'Session', 'Msg', '$interval','operationalDashboard','casesManagement2','commonDataService','casesManagement',
function($scope, $rootScope, $state, $timeout, statusService, UserService, AdminService, $ngConfirm, RolePermissionMatrix, Util, Session, Msg, $interval, operationalDashboard,casesManagement2,commonDataService,casesManagement){
	$scope.moment = Util.moment;
	$scope.showMsg = false;
	$scope.rolePermission = RolePermissionMatrix;
    $scope.response = statusService.getResponseMessage();
    $scope.orgId = commonDataService.getLocalStorage().orgId;	
    $scope.channel_data = '1H';
    $scope.stats_channel = 'RuPayAtm';
    $scope.ruleeff_channel = 'RuPayAtm';
	$rootScope.welcomeName = $scope.response.usersAuthoritiesPermissionsDto.firstName;
    var loggedInUser = $scope.response.usersAuthoritiesPermissionsDto;    
    $scope.authority = $scope.response.usersAuthoritiesPermissionsDto.authority;
    $scope.loggedInUserMail = loggedInUser.email;
    $scope.ammount = 60;
    $scope.usageData=[];
    $scope.memoryUsage =[];
    $scope.cpuUsage = [];
    $scope.diskUsage = [];
    $scope.channel_code ='';
    $scope.chart_data = [];
    $scope.shownodataAvailable = false;
    /*$scope.case_organisation ='SBI'*/
    $scope.case_org ='SBI'
    $scope.isEncripted = function(visibility){
   		if(visibility == '0'){
   			return "Encrypted";
   		}if(visibility == '1'){
   			return "Plain Text";
   		}
   }
   $scope.timeline = [
	      {
		    name: "1 Hour",
		    value: "1H"
		  },
	      {
		    name: "1 Month",
		    value: "1M"
		  },
		  {
			name: "1 Week",
			value: "1W"
		  },
		  {
		    name: "1 Day",
		    value: "1D"
		  }
		];
   
  $scope.getChannel = function(){
	   casesManagement2.header($scope.response.token).channel( {},
				function(response) {
	                         $scope.channel_code = response.response;
	                          var filtered_channel = $scope.channel_code.filter((x)=>{
	                        	 return x.channelDesc =='ATM';
	                         });
	                         $scope.ruleEff_channel=filtered_channel[0];
	                         $scope.stats_chnnl = filtered_channel[0];
					},
				function(err) {

				});
   }
  $scope.getChannel();
    
   casesManagement.header($scope.response.token).organisations( 
			{ 
				organisationID : $scope.orgId
			},
			function(response) {
                        $scope.orgarnisations = response.response;
                        $scope.selectedOrg = $scope.orgarnisations.filter((x)=>{
                        	return x.orgId =='SBI'
                        })
                        $scope.case_organisation =  $scope.selectedOrg[0];

				},
			function(err) {
			});
   
   
    operationalDashboard.header($scope.response.token).ruleEfficiency( 
				{ 
					
					channel : $scope.channel_data,
					channelName : $scope.ruleeff_channel
				},
				function(response) {
	                         $scope.chart_data=response.response.response;
	                         $scope.barchart($scope.chart_data);

					},
				function(err) {
				});
    
    $scope.changeinDropDown = function(value){
    	
    	$scope.channel_data = value.value;
    operationalDashboard.header($scope.response.token).ruleEfficiency( 
   				{ 
   					
   					channel : $scope.channel_data,
   					channelName : $scope.ruleeff_channel
   				},
   				function(response) {
   					$scope.chart_data=response.response.response;
   					$scope.barchart($scope.chart_data);

   					},
   				function(err) {
   				});
    	
    } 
    
  
 
 
    
    $scope.barchart = function(getChart_data){
    	
    	
    	 d3.select("#bar_chart").select("svg").remove();
    	
    	 var margin = {top: 40, right: 30, bottom: 30, left: 45}, width = 400 - margin.left - margin.right, height = 250 - margin.top - margin.bottom;
    	   var i = 0;
    	   var formatPercent = d3.format(" ");
    	   var x = d3.scale.ordinal()
    	        .rangeRoundBands([0, width], .1);
    	   
    	   var y = d3.scale.linear()
    	        .range([height, 0]);
    	   
    	   var xAxis = d3.svg.axis()
    	        .scale(x)
    	        .orient("bottom");
    	   
    	   var yAxis = d3.svg.axis()
    	        .scale(y)
    	        .orient("left")
    	        .tickFormat(formatPercent);

    	    var tip = d3.tip()
    	      .attr('class', 'd3-tip')
    	      .offset([-10, 0])
    	      .html(function(d) {
    	        return "<strong>Rule Id: </strong><span style='color:#8379b7'>" + d.ruleId + "</span><br><strong>Description:</strong> <span style='color:#8379b7'>" + d.ruleDescription + "</span><br><strong>Count:</strong> <span style='color:red'>" + d.count + "</span>";
    	      })

    	    var svg = d3.select("#bar_chart").append("svg")
    	        .attr("width", width + margin.left + margin.right)
    	        .attr("height", height + margin.top + margin.bottom)
    	        .append("g")
    	        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    	     svg.call(tip);
       
			   	 var data = [];	
			   	 data = getChart_data;
		         x.domain(data.map(function(d) { return d.id; }));
			      y.domain([0, d3.max(data, function(d) { return d.count; })]);
			
			         svg.append("g")
			             .attr("class", "x axis")
			             .attr("transform", "translate(0," + height + ")")
			             .call(xAxis)
			             .append("text")
					             .attr("x", 6)
					             .attr("dx", "3.5em")
					             .attr("dy", "2.2em")
					             .style("text-anchor", "end")
					             .text("Rule")
					             .style("font-size", "12px");
			             
			
			         svg.append("g")
			             .attr("class", "y axis")
			             .call(yAxis)
			           .append("text")
			             .attr("transform", "rotate(-90)")
			             .attr("y", 6)
			             .attr("dy", ".71em")
			             .style("text-anchor", "end")
			             .text("Count")
			             .style("font-size", "12px");
			             
			
			         svg.selectAll(".bar")
			             .data(data)
			           .enter().append("rect")
			             .attr("class", "bar")
			             
			             .attr("y", height)
			             .attr("height", 0)
			             .transition()
			             .duration(1500)
			             .delay(function (d, i) { return i*250; })
			             .attr("y", function(d) { return y(d.count); })
			             .attr("height", function(d) { return height - y(d.count); })
			             
			             .attr("x", function(d) { return x(d.id)+10; })
			             .attr("width", x.rangeBand() - 25)
			             
			         
			         svg.selectAll(".bar")
			         .on('mouseover', tip.show)
			         .on('mouseout', tip.hide)
			         .style("font-size", "12px");
			
			      
			       function type(d) {
			         d.count = +d.count;
			         return d;
			       }
       	
       }
    
    
$scope.pie_Chart = function(){
	d3.select("#mainPie").select("svg").remove();
	
	operationalDashboard.header($scope.response.token).caseCount( 
			{ 
				org_id : $scope.case_org,
				channelName : $scope.stats_channel
			},
			function(response) {
				var data = response.response.response.caseCount;
				/*var data =[
				    {
				        "name": "Total Case Count",
				        "value": 48
				    },
				    {
				        "name": "Open Case Count",
				        "value": 20
				    },
				  {
				        "name": "Closed Case Count",
				        "value": 28
				    }
				]*/
				var myArray = data.filter(function( obj ) {
					  return obj.name == 'Total Case Count';
				});
				data = data.filter(function( obj ) {
					  return obj.name !== 'Total Case Count';
					});
				
				

                if(data[0].value > 0){
                	$scope.shownodataAvailable = false;
    				var width = 220,
				    height = 220,
				    radius = Math.min(width, height) / 2;
				var divNode = d3.select("body").node();
				var outerRadius = radius - 10,
				    innerRadius = radius - 80;
				var color = d3.scale.ordinal()
				    .range(["#2E7D32","#FFC107","#FF7043", "#1FDA9A", "#28ABE3", "#DF514C", "#DAE9F7"]);

				var arc = d3.svg.arc()
				    .outerRadius(radius - 10)
				    .innerRadius(radius - 80);

				var pie = d3.layout.pie()
				    .sort(null)
				    .value(function(d) { return d.value; });

				d3.select("#chart").append("div")
				    .attr("id","mainPie")
				    .attr("class","pieBox");

				var svg = d3.select("#mainPie").append("svg")
				    .attr("width", width)
				    .attr("height", height)
				  .append("g")
				    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

				var defs = svg.append("defs");
				var filter = defs.append("filter")
				                .attr("id", "drop-shadow")
				                .attr("height","130%");

				filter.append("feGaussianBlur")
				        .attr("in","SourceAlpha")
				        .attr("stdDeviation", 3)
				        .attr("result", "blur");

				filter.append("feOffset")
				    .attr("in", "blur")
				    .attr("dx", 3)
				    .attr("dy", 3)
				    .attr("result", "offsetBlur");
				    var feMerge = filter.append("feMerge");

				feMerge.append("feMergeNode")
				    .attr("in", "offsetBlur")
				feMerge.append("feMergeNode")
				    .attr("in", "SourceGraphic");

				var g = svg.selectAll(".arc")
				      .data(pie(data))
				    .enter().append("g")
				      .attr("class", "arc");

				  g.append("path")
				      .attr("d", arc)
				      .style("fill", function(d) { return color(d.data.value); })
				      .on("mousemove", function(d) {
				          d3.select(this)
				              .attr("stroke","#fff")
				              .attr("stroke-width","2px")
				              .style("filter", "url(#drop-shadow)");
								  d3.select(this)
										.transition()
										.duration(500)
										.ease('elastic')
										.attr('transform',function(d){
											var dist = 1;
											d.midAngle = ((d.endAngle - d.startAngle)/2) + d.startAngle;
											var x = Math.sin(d.midAngle) * dist;
											var y = Math.cos(d.midAngle) * dist;
											return 'translate(' + x + ',' + y + ')';
										});
				            var mousePos = d3.mouse(divNode);
				            d3.select("#mainTooltip")
				              .style("left", mousePos[0] - 40 + "px")
				              .style("top", mousePos[1] - 70 + "px")
				              .select("#value")
				              .attr("text-anchor", "middle")
				              .html(d.data.name + "<br />" + d.data.value);

									d3.select("#mainTooltip").classed("hidden", false);
				        })
				      .on("mouseout", function(d){
				          d3.select(this)
				              .attr("stroke","none")
				              .style("filter","none");
									d3.select(this)
										.transition()
										.duration(500)
										.ease('bounce')
										.attr('transform','translate(0,0)');

									d3.select("#mainTooltip").classed("hidden", true);
				      });
				      var centerSvg = svg.append('circle')
								.attr('fill','#42A5F5')
								.attr('r','62');

							svg.append('text')
								.style('fill', '#F2F2F2')
								.style("font-size", "14px")
								.style("font-weight", "bold")
								.attr("transform", "translate(0," + 20 + ")")
								.attr("text-anchor", "middle")
								.html("Total Cases: " +myArray[0].value);

				
                }
                if(data[0].value <= 0) {
                	$scope.shownodataAvailable = true;
                }

				
			},
			function(err) {});
	
	
	
}    
$scope.pie_Chart();    
$scope.changeinorganisation = function(organisation_id){
	 d3.select("#mainPie").select("svg").remove();
	$scope.case_org = organisation_id.orgId;
	$scope.pie_Chart(); 
}

$scope.channelChngfrorgSpecStats = function(channel){
	d3.select("#mainPie").select("svg").remove();
	$scope.stats_channel = channel.channelCode
	$scope.pie_Chart(); 
}
$scope.channelChngforRuleEffi= function(channel){

	$scope.ruleeff_channel = channel.channelCode
	 operationalDashboard.header($scope.response.token).ruleEfficiency( 
				{ 
					
					channel : $scope.channel_data,
					channelName : $scope.ruleeff_channel
				},
				function(response) {
					$scope.chart_data=response.response.response;
					$scope.barchart($scope.chart_data);

					},
				function(err) {
				});
}

$scope.line_Chart = function(){
	
	   d3.select("#line_chart").select("svg").remove();
	   
	   operationalDashboard.header($scope.response.token).caseDetailsCount( 
				{ },
				function(response) {
					
		var data = response.response.response.caseHourlyDetails;
		var label = d3.select(".label");
	            	// Set the dimensions of the canvas / graph
		var	margin = {top: 30, right: 20, bottom: 30, left: 50},
			width = 340 - margin.left - margin.right,
			height = 220 - margin.top - margin.bottom;

		
		// Set the ranges
		var	x = d3.scale.ordinal().rangeRoundBands([0, width]);
		var	y = d3.scale.linear().range([height, 0]);

		// Define the axes
		var	xAxis = d3.svg.axis().scale(x)
			.orient("bottom").ticks(5);

		var	yAxis = d3.svg.axis().scale(y)
			.orient("left").ticks(5);

		// Define the line
		var	valueline = d3.svg.line()
			.x(function (d) { return x(d.hour) + x.rangeBand() / 2; })
			.y(function(d) { return y(d.totalCaseCount); });
		
		// Define the div for the tooltip
		var div = d3.select("body").append("div")	
		    .attr("class", "tooltip2")				
		    .style("opacity", 0);
		
		// Adds the svg canvas
		var	svg = d3.select("#line_chart")
			.append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
			    .append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		// Get the data
		
			data.forEach(function(d) {
				d.hour = d.hour;
				d.totalCaseCount = +d.totalCaseCount;
			});

			// Scale the range of the data
			var xData = data.map(function (d) { return (d.hour); });
			// Scale the range of the data
			x.domain(xData);
			y.domain([0, d3.max(data, function(d) { return d.totalCaseCount; })]);

			// Add the valueline path.
			svg.append("path")		// Add the valueline path.
				.attr("class", "line")
				.attr("d", valueline(data));
				
				// Add the valueline path.
			svg		// Add the valueline path.
				.selectAll("circle")
				.data(data)
				.enter()
				.append("circle")
				.attr("r", 5)
				.style("fill", "steelblue")
			    .attr("cx", function(d) {
			    	return x(d.hour) + x.rangeBand() / 2;
			     })
			    .attr("cy", function(d) {
			          return y(d.totalCaseCount)
			     })
			    .on("mouseover", function(d) {		
			    	div.transition().duration(200).style("opacity", .9);		
			    	div.html("Total Case Count: "+d.totalCaseCount+"<br/>"+d.channel.map(x=>x.name+" - "+x.caseCount))
			    	.style("left", (d3.event.pageX) + "px")
			    	.style("top", (d3.event.pageY - 28) + "px");	
	            })					
	            .on("mouseout", function(d) {		
	            	div.transition().duration(500).style("opacity", 0);	
	            });
				

			// Add the X Axis
			svg.append("g")			// Add the X Axis
				.attr("class", "x axis")
				.attr("transform", "translate(0," + height + ")")
				.call(xAxis)
				.append("text")
			             .attr("x", 6)
			             .attr("dx", "3.5em")
			             .attr("dy", "2.2em")
			             .style("text-anchor", "end")
			             .text("Hours")
			             .style("font-size", "12px");
			

			// Add the Y Axis
			svg.append("g")			// Add the Y Axis
				.attr("class", "y axis")
				.call(yAxis)
				.append("text")
			    .attr("transform", "rotate(-90)")
			    .attr("y", 6)
			    .attr("dy", ".71em")
			    .style("text-anchor", "end")
			    .text("Count")
			    .style("font-size", "12px");
				
	
					
				},
				function(err) {});
	
	
	

	
}       
  
$scope.line_Chart();

/*line chart for transactions */

$scope.line_ChartForTrans = function(){
	d3.select("#line_chart1").select("svg").remove();

	  operationalDashboard.header($scope.response.token).declinedTxnCount( 
				{ },
				function(response) {
					
		var data = response.response.response.declinedTxnDetails;
	    
		var label = d3.select(".label");
	            	// Set the dimensions of the canvas / graph
		var	margin = {top: 30, right: 20, bottom: 30, left: 50},
			width = 340 - margin.left - margin.right,
			height = 220 - margin.top - margin.bottom;

		// Parse the date / time
		//var	parseDate = d3.time.format("%d-%b-%y").parse;

		// Set the ranges
		var	x = d3.scale.ordinal().rangeRoundBands([0, width]);
		var	y = d3.scale.linear().range([height, 0]);

		// Define the axes
		var	xAxis = d3.svg.axis().scale(x)
			.orient("bottom").ticks(5);

		var	yAxis = d3.svg.axis().scale(y)
			.orient("left").ticks(5);

		// Define the line
		var	valueline = d3.svg.line()
			
			.x(function (d) { return x(d.hour) + x.rangeBand() / 2; })
			.y(function(d) { return y(d.totalDeclineCount); });
		
		// Define the div for the tooltip
		var div = d3.select("body").append("div")	
		    .attr("class", "tooltip2")				
		    .style("opacity", 0);
		
		// Adds the svg canvas
		var	svg = d3.select("#line_chart1")
			.append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
			    .append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		// Get the data
		
			data.forEach(function(d) {
				d.hour = d.hour;
				d.totalDeclineCount = +d.totalDeclineCount;
			});
			 var xData = data.map(function (d) { return (d.hour); });
			// Scale the range of the data
			x.domain(xData);
			y.domain([0, d3.max(data, function(d) { return d.totalDeclineCount; })]);

			// Add the valueline path.
			svg.append("path")		// Add the valueline path.
				.attr("class", "line")
				.attr("d", valueline(data));
				
				// Add the valueline path.
			svg		// Add the valueline path.
				.selectAll("circle")
				.data(data)
				.enter()
				.append("circle")
				.attr("r", 5)
				.style("fill", "steelblue")
			    .attr("cx", function(d) {
			    	return x(d.hour) + x.rangeBand() / 2;
			     })
			    .attr("cy", function(d) {
			          return y(d.totalDeclineCount)
			     })
			    .on("mouseover", function(d) {		
			    	div.transition().duration(200).style("opacity", .9);		
			    	div.html("Total Case Count: "+d.totalDeclineCount+"<br/>" + "Channel Name: "+d.channelWithHighestDecline.name+" With Highest Decline Count: "+d.channelWithHighestDecline.declineCount+"<br/>"+"Bank Name: "+d.bankWithHighestDecline.name+" With Highest Decline Count: "+d.bankWithHighestDecline.declineCount)
			    	.style("left", (d3.event.pageX) + "px")
			    	.style("top", (d3.event.pageY - 28) + "px");
			    	/*div.html("Total Declined Count: "+d.totalDeclineCount)
			    	.style("left", (d3.event.pageX) + "px")
			    	.style("top", (d3.event.pageY - 28) + "px");*/	
	            })					
	            .on("mouseout", function(d) {		
	            	div.transition().duration(500).style("opacity", 0);	
	            });
				

			// Add the X Axis
			svg.append("g")			// Add the X Axis
				.attr("class", "x axis")
				.attr("transform", "translate(0," + height + ")")
				.call(xAxis)
				.append("text")
			             .attr("x", 6)
			             .attr("dx", "3.5em")
			             .attr("dy", "2.2em")
			             .style("text-anchor", "end")
			             .text("Hours")
			             .style("font-size", "12px");
			

			// Add the Y Axis
			svg.append("g")			// Add the Y Axis
				.attr("class", "y axis")
				.call(yAxis)
				.append("text")
			    .attr("transform", "rotate(-90)")
			    .attr("y", 6)
			    .attr("dy", ".71em")
			    .style("text-anchor", "end")
			    .text("Count")
			    .style("font-size", "12px");
             },
			function(err) {});
	
	
}
$scope.line_ChartForTrans();

//Total Transaction Count 
$scope.multiline_ChartForTrans = function(){
	d3.select("#line_chart2").select("svg").remove();
	operationalDashboard.header($scope.response.token).hr24Aggregate( 
			{ },
			function(response) {
				var Data  = response.response.response;

	
				function fnDrawMultiLineChart(Data, DivID, RevenueName) {
			          var margin = { 
					        		  top: 20, 
					        		  right: 80, 
					        		  bottom: 30, 
					        		  left: 50 
			        		       },
			           width = 600 - margin.left - margin.right,
			           height = 280 - margin.top - margin.bottom;

			          var x = d3.scale.ordinal().rangeRoundBands([0, width]);

			          var y = d3.scale.linear().range([height, 0]);

			          var color = d3.scale.category10();

			          var xAxis = d3.svg.axis().scale(x).orient("bottom");

			          var yAxis = d3.svg.axis().scale(y).orient("left").ticks(10);

			          // xData gives an array of distinct 'Weeks' for which trends chart is going to be made.
			          var xData = Data[0].data.map(function (d) { return (d.txnHour); });
			          //console.log(xData);
			          
			         
			          var line = d3.svg.line()
			              //.interpolate("basis")
			              .x(function (d) { return x(d.txnHour) + x.rangeBand() / 2; })
			              .y(function (d) { return y(d.txnCount); });

			          var svg = d3.select("#" + DivID).append("svg")
			              .attr("width", width + margin.left + margin.right)
			              .attr("height", height + margin.top + margin.bottom)
			              .append("g")
			              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			          color.domain(Data.map(function (d) { return d.channel; }));

			          x.domain(xData);

			          var valueMax = d3.max(Data, function (r) { return d3.max(r.data, function (d) { return d.txnCount; }) });
			          var valueMin = d3.min(Data, function (r) { return d3.min(r.data, function (d) { return d.txnCount; }) });
			          y.domain([valueMin, valueMax]);

			          //Drawing X Axis
			          svg.append("g")
			                  .attr("class", "x axis")
			                  .attr("transform", "translate(0," + height + ")")
			                  .call(xAxis)
			                  .append("text")
						             .attr("x", 6)
						             .attr("dx", "3.5em")
						             .attr("dy", "2.2em")
						             .style("text-anchor", "end")
						             .text("Hours")
						             .style("font-size", "12px");

			          // Drawing Horizontal grid lines.
			          svg.append("g")
			              .attr("class", "GridX")
			            .selectAll("line.grid").data(y.ticks()).enter()
			              .append("line")
			              .attr(
			              {
			                  "class": "grid",
			                  "x1": x(xData[0]),
			                  "x2": x(xData[xData.length - 1]),
			                  "y1": function (d) { return y(d); },
			                  "y2": function (d) { return y(d); }
			              });
			          // Drawing Y Axis
			          svg.append("g")
			              .attr("class", "y axis")
			              .call(yAxis)
			              .append("text")
			                  .attr("transform", "rotate(-90)")
			                  .attr("y", 6)
			                  .attr("dy", ".71em")
			                  .attr("font-size", "12px") 
			                  .style("text-anchor", "end")
			                  .text(RevenueName);

			          // Drawing Lines for each segments
			          var segment = svg.selectAll(".segment")
			                          .data(Data)
			                          .enter().append("g")
			                          .attr("class", "segment");
			        
			          segment.append("path")
			                  .attr("class", "line")
			                  .attr("id", function (d) { return d.channel; })
			                  .attr("visible",1)
			                  .attr("d", function (d) { return line(d.data); })
			                  .style("stroke", function (d) { return color(d.channel); });
			                      // Creating Dots on line
			          segment.selectAll("dot")
			                  .data(function (d) { return d.data; })
			                  .enter().append("circle")
			                  .attr("r", 5)
			                  .attr("cx", function (d) { return x(d.txnHour) + x.rangeBand() / 2; })
			                  .attr("cy", function (d) { return y(d.txnCount); })
			                  .style("stroke", "white")
			                  .style("fill", function (d) { return color(this.parentNode.__data__.channel); })
			                  .on("mouseover", mouseover)
			                  .on("mousemove", function (d) {
			                	  if(this.parentNode.__data__.channel =='RuPayPos'){
			                		  divToolTip
				                      .html(this.parentNode.__data__.channel +": "+ d.txnCount+"<br/>"+"POS Org With Highest Txn: "+ this.parentNode.__data__.genericMap.POSOrgWithHighestTxn +"<br/> POS Last Hour Txn: "+this.parentNode.__data__.genericMap.POSLastHourTxn+"<br/> ECOM Last Hour Txn: "+this.parentNode.__data__.genericMap.ECOMLastHourTxn+"<br/> ECOM Org With Highest Txn: "+this.parentNode.__data__.genericMap.ECOMOrgWithHighestTxn)
				                      .style("left", (d3.event.pageX + 15) + "px")
				                      .style("top", (d3.event.pageY - 10) + "px")
				                      .style("font-size", "11px");
			                	  }
			                	  else{
			                		  divToolTip
				                      .html(this.parentNode.__data__.channel +": "+ d.txnCount)
				                      .style("left", (d3.event.pageX + 15) + "px")
				                      .style("top", (d3.event.pageY - 10) + "px")
				                      .style("font-size", "11px");
			                	  }
			                     
			                  })
			                  .on("mouseout", mouseout);
			        
			          segment.append("text")
			                  .datum(function (d) { return { channel: d.channel, RevData: d.data[d.data.length - 1] }; })
			                  .attr("transform", function (d) {
			                      var xpos = x(d.RevData.txnHour) + x.rangeBand() / 2;
			                      return "translate(" + xpos + "," + y(d.RevData.txnCount) + ")";
			                  })
			                  .attr("x", 3)
			                  .attr("dy", ".35em")
			                  .attr("class", "segmentText")
			                  .attr("Segid", function (d) { return d.channel; })
			                  .text(function (d) { return d.channel; })
			                  .style("font-size", "12px");
			                             
			          d3.selectAll(".segmentText").on("click", function (d) {
			              var tempId = d3.select(this).attr("Segid");
			              var flgVisible = d3.select("#" + tempId).attr("visible");

			              var newOpacity = flgVisible == 1 ? 0 : 1;
			              flgVisible = flgVisible == 1 ? 0 : 1;

			              // Hide or show the elements
			              d3.select("#" + tempId).style("opacity", newOpacity)
			                  .attr("visible", flgVisible);

			          });
			           // Adding Tooltip
			          var divToolTip = d3.select("body").append("div")
			                      .attr("class", "tooltip2")
			                      .style("opacity", 1e-6);

			          function mouseover() {
			              divToolTip.transition()
			                  .duration(500)
			                  .style("opacity", 1);
			          }
			          function mouseout() {
			              divToolTip.transition()
			                  .duration(500)
			                  .style("opacity", 1e-6);
			          }
			      }
			//Calling function
				if(Data[0].data.length ){
					fnDrawMultiLineChart(Data, "line_chart2", "Transaction Count");
				}
			
				
			},
			function(err) {});
}

$scope.multiline_ChartForTrans();

$scope.memoryUsageFunc = function(){
	
    	operationalDashboard.header($scope.response.token).memoryUsage( {},function(response) 
				   {
    		        if(response.status == '202' && response.response.statusMsg == 'IN_PROGRESS'){
    		        	$scope.responseid = response.response.randomId;
    		        	$scope.myVarinterval = $interval(function(){
    		        	requestcall();
   					 }, 5000);
    		        }
    		        else{
    		        	$interval.cancel($scope.myVarinterval);
    		        }
		             
	    	       },
				function(err) {
	    	    	   $interval.cancel($scope.myVarinterval); 
				});
   }
    
 $scope.memoryUsageFunc();
   
 var requestcall = function() { 
	 
	 operationalDashboard.header($scope.response.token).memoryUsagewithid( 
    			{
    				randomId : $scope.responseid
    			},function(response) 
				   {
    				if(response.status == '200' && response.response.statusMsg == 'SUCCESS')
    				{
    					$interval.cancel($scope.myVarinterval);   
    					$scope.usageData = response.response;
    	                $scope.deviceusagefunc($scope.usageData.records);
    				}
    				
    	        	
				   },
				  function(err) {
					   $interval.cancel($scope.myVarinterval); 
				   }); 	
    	
 
 }
  var promise = $interval(function() { 
    	$scope.memoryUsageFunc() // calls operational dashboard API after each 3 mins
    	//API block for Rule Efficiency 
    	operationalDashboard.header($scope.response.token).ruleEfficiency( 
   				{ 
   					
   					channel : $scope.channel_data,
   					channelName : $scope.ruleeff_channel
   				},
   				function(response) {
   					$scope.chart_data=response.response.response;
   					$scope.barchart($scope.chart_data);

   					},
   				function(err) {
   				});
    	
    	//API block for organisation specific stats
    	$scope.pie_Chart(); 
    	//API block for cases created 
    	$scope.line_Chart();
    	//API  call for declined Transactions
    	$scope.line_ChartForTrans();
    	//API call for Total Transaction Count 
    	$scope.multiline_ChartForTrans();
    	
    }, 600000);
    
    $scope.$on('$destroy',function(){
    	
    	$interval.cancel(promise);
    	$interval.cancel($scope.myVarinterval); 
        
    });
   
   
   //get channel list
	/*casesManagement2.header($scope.response.token).channel( {},
			function(response) {
                        $scope.channel_code = response.response;
                        $scope.case_channel = $scope.channel_code[2];
				},
			function(err) {
			});
   */
    $scope.case_channel = $scope.timeline[0];	
	
   
   
 $scope.deviceusagefunc = function(data){
	  // console.log(data)
	    $scope.stats=[];
	    var memUsage = [];
	    var cpuUsage = [];
	    var diskUsage = [];
	    var topfiveCpuCons = [];
	    var topFiveMemoryConsumers = [];
	    var obj = {};
	    $scope.max_memory_usage = [];
	    
	    //finding all down box
	    $scope.downBox = data.filter((x)=>{
	    	return(x.stats == undefined)
	    })
	      
	   $scope.stats = data.filter((x)=>{ return x.stats; }) // filtering all stats
	   $scope.filtered_nodes=[];
	   $scope.filtered_nodes2 = [];
      
	   for(var i=0; i<$scope.stats.length; i++)
		   {
			  for(var j=0 ; j<5 ;j++){
				  $scope.max_memory_usage.push($scope.stats[i].stats[j]);
						
			  }
			}
      
	   $scope.box_response = $scope.max_memory_usage.map((x)=>{
		    	  return x.response;
		      })
		   
	   $scope.dividing_array=[];
      while ($scope.box_response.length > 0){
    	  $scope.dividing_array.push($scope.box_response.splice(0, 5));
      }
    //finding the maximum memory usage 
    for(var k=0; k<$scope.dividing_array.length; k++)
    {
    	for(var kj=0; kj<5 ; kj++)
    	   {
    		 if($scope.dividing_array[k][kj].apiName == 'MemoryUsage')
    		   {
    			   obj.hostIp=$scope.dividing_array[k][kj].hostIp;
    			   obj.apiName =$scope.dividing_array[k][kj].apiName;
    			   obj.usage = (Math.max.apply(Math, $scope.dividing_array[k][kj].response.map(function(o){return o.percentMem;})))
    			   memUsage.push(JSON.parse(JSON.stringify(obj)));
               }
            }
     }
    
    
  //finding CpuUsage
    for(var cpu=0; cpu<$scope.dividing_array.length; cpu++)
    {
    	  for(var cpu2=0; cpu2<5 ; cpu2++)
    	   {
    		 if($scope.dividing_array[cpu][cpu2].apiName == 'CpuUsage')
    		   {
    			   
    			   obj.hostIp=$scope.dividing_array[cpu][cpu2].hostIp;
    			   obj.apiName =$scope.dividing_array[cpu][cpu2].apiName;
    			   obj.usage = (Math.max.apply(Math, $scope.dividing_array[cpu][cpu2].response.map(function(o){return o.usage;})))
    			   cpuUsage.push(JSON.parse(JSON.stringify(obj)));
              }
            }
    	    
    }
    
    
  //finding DiskUsage
    for(var disk=0; disk<$scope.dividing_array.length; disk++)
    {
    	  for(var disk2=0; disk2<5 ; disk2++)
    	   {
    		 if($scope.dividing_array[disk][disk2].apiName == "DiskUsage")
    		   {
    			   obj.hostIp=$scope.dividing_array[disk][disk2].hostIp;
    			   obj.apiName =$scope.dividing_array[disk][disk2].apiName;
    			   obj.usage = (Math.max.apply(Math, $scope.dividing_array[disk][disk2].response.map(function(o){return o.usePercentage;})))
    			   diskUsage.push(JSON.parse(JSON.stringify(obj)));
              }
            }
    	    
    }
      
    
  //finding TopFiveCpuConsumers
    for(var topCpu=0; topCpu<$scope.dividing_array.length; topCpu++)
    {
    	  for(var topCpu2=0; topCpu2<5 ; topCpu2++)
    	    {
    		  if($scope.dividing_array[topCpu][topCpu2].apiName == 'TopFiveCpuConsumers')
    		   {
    			  obj.hostIp=$scope.dividing_array[topCpu][topCpu2].hostIp;
    			   obj.apiName =$scope.dividing_array[topCpu][topCpu2].apiName;
    			   obj.usage = (Math.max.apply(Math, $scope.dividing_array[topCpu][topCpu2].response.map(function(o){return o.percentCpu;})))
    			   topfiveCpuCons.push(JSON.parse(JSON.stringify(obj)));
               }
            }
     }
    
  //finding TopFiveMemoryConsumers
    for(var topMem=0; topMem<$scope.dividing_array.length; topMem++)
    {
       for(var topMem2=0; topMem2<5 ; topMem2++)
    	   {
    		 if($scope.dividing_array[topMem][topMem2].apiName == 'TopFiveMemoryConsumers')
    		   {
    			   obj.hostIp=$scope.dividing_array[topMem][topMem2].hostIp;
    			   obj.apiName =$scope.dividing_array[topMem][topMem2].apiName;
    			   obj.usage = (Math.max.apply(Math, $scope.dividing_array[topMem][topMem2].response.map(function(o){return o.memPercentege;})))
    			   topFiveMemoryConsumers.push(JSON.parse(JSON.stringify(obj)));
               }
            }
   }

     $scope.finalResult =[];
     $scope.finalResultList =[];
     $scope.finalResult.push(memUsage);
     $scope.finalResult.push(cpuUsage);
     $scope.finalResult.push(diskUsage);
     $scope.finalResult.push(topfiveCpuCons);
     $scope.finalResult.push(topFiveMemoryConsumers)
     $scope.maxBoxValueSep = [];
     $scope.arr1d = [];
     $scope.arr1d = [].concat(...$scope.finalResult);
     $scope.maxBoxValue = [];
     $scope.result = [];
     while($scope.maxBoxValue.length > 0) {
    	 $scope.maxBoxValue.pop();
    	}
     
     $scope.uniqueBox = [...new Set($scope.arr1d.map(item => item.hostIp))];
    
    $scope.result = groupBy($scope.arr1d, function(item)
     {
       return [item.hostIp];
     });
    for(var max=0; max<$scope.result.length; max++){
    	$scope.maxBoxValue.push($scope.result[max].reduce(function(prev, current) {
    	    return (prev.usage > current.usage) ? prev : current
    	})) 
    } 
    
   
    
    
  }
   
 
   
   //$scope.deviceusagefunc($scope.usageData.records);
  
   $scope.modalShown = false;
   
   // logic to show and not-show on a toggle
   $scope.toggleModal = function(hosIp){
	   $scope.modalBoxList=[] 
     $scope.modalShown = !$scope.modalShow;
     $scope.modalBoxList = $scope.arr1d.filter((x)=>{
    	 return x.hostIp == hosIp;
     });
     
     $scope.response_memusage = $scope.max_memory_usage.filter((x)=>{
 		return (x.response.apiName == 'MemoryUsage' && x.response.hostIp == hosIp);
 	})
 	$scope.response_response = $scope.response_memusage.map((y)=>{
 		return (y.response.response);
 	})
 	
 	
 	 $scope.response_cpuusage = $scope.max_memory_usage.filter((x)=>{
 		return (x.response.apiName == 'CpuUsage' && x.response.hostIp == hosIp);
 	})
 	$scope.response_cpuresponse = $scope.response_cpuusage.map((y)=>{
 		return (y.response.response);
 	})
 	$scope.final_cpu_usage = $scope.response_cpuresponse[0][0].usage;
 	 $scope.response_diskusage = $scope.max_memory_usage.filter((x)=>{
 		return (x.response.apiName == 'DiskUsage' && x.response.hostIp == hosIp);
 	})
 	
 	$scope.response_diskresponse = $scope.response_diskusage.map((y)=>{
 		return (y.response.response);
 	})
     $scope.final_disk_usage = $scope.response_diskresponse[0][0].usePercentage;
 	
 	 
 	 $scope.response_topfivecpuusage = $scope.max_memory_usage.filter((x)=>{
 		return (x.response.apiName == 'TopFiveCpuConsumers' && x.response.hostIp == hosIp);
 	})
 	
 	$scope.response_topCpuresponse = $scope.response_topfivecpuusage.map((y)=>{
 		return (y.response.response);
 	})

 	 $scope.response_topfivememusage = $scope.max_memory_usage.filter((x)=>{
 		return (x.response.apiName == 'TopFiveMemoryConsumers' && x.response.hostIp == hosIp);
 	})
 	$scope.response_topMemresponse = $scope.response_topfivememusage.map((y)=>{
 		return (y.response.response);
 	})

    
   }
   
   function groupBy( array , f )
   {
     var groups = {};
     array.forEach( function( o )
     {
       var group = JSON.stringify( f(o) );
       groups[group] = groups[group] || [];
       groups[group].push( o );  
     });
     return Object.keys(groups).map( function( group )
     {
       return groups[group]; 
     })
   }
  
  
}])
