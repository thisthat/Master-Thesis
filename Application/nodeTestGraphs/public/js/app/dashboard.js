//Global variables
var updateInterval = 3000;
var bytes = [], packets = [], flows = [], totalPoints = 20;
var lastData = {
	'byte' : 0,
	'flow' : 0,
	'pack' : 0
};
var lastRealData = {
	'byte' : 0,
	'flow' : 0,
	'pack' : 0
};
$.getJSON( "/api/controller/load", function( data ) {
		lastData.byte = data.bytes;
		lastData.pack = data.packets;

		lastRealData.byte = data.bytes;
		lastRealData.pack = data.packets;

	});

$(function(){
	init();
});

function init(){

	Array.prototype.max = function() {
	  return Math.max.apply(null, this);
	};

	Array.prototype.min = function() {
	  return Math.min.apply(null, this);
	};

	loadMemoryUsage();
	loadHealth();
	loadUptime();
	loadChart();
	
}

function loadUptime(){
	$.getJSON( "/api/controller/uptime", function( data ) {
		t = formatTime(data.systemUptimeMsec);
		$("#timeController").html('Uptime: <br/>' + t);
		if(data.systemUptimeMsec == 0){
			$("#timeController").parent().addClass('yellow');
		}
		else if(typeof data.systemUptimeMsec == "undefined"){
			$("#timeController").parent().addClass('yellow');
		}
	});
}

function loadHealth(){
	var p = $("#statusController").parent();
	p.removeClass("greenDark");
	p.addClass("red");
	$("#statusController").html('Status: NOT Health');
	$.getJSON( "/api/controller/health", function( data ) {
		if(data.healthy){
			var p = $("#statusController").parent();
			p.removeClass("red");
			p.addClass("greenDark");
			$("#statusController").html('Status: Health');
		}
		else {
			var p = $("#statusController").parent();
			p.removeClass("greenDark");
			p.addClass("red");
			$("#statusController").html('Status: NOT Health');
		}
	});
}

function loadMemoryUsage(){
	$.getJSON( "/api/controller/memory", function( data ) {
		var free = data.free;
		var tot  = data.total;

		if(typeof free == "undefined" || typeof tot == "undefined" ){
			$("#memoryGraph").addClass('red');
			$("#memoryGraph").find('input').val(0);
			$("#memoryGraph").find(".value > .number").html(0);
			$("#memoryGraph").find(".count > .number").html(0);
			$("#memoryGraph").find(".value > .unit").html('K');
			$("#memoryGraph").find(".count > .unit").html('K');
		}
		else {
			free = formatFileSize(free);
			tot = formatFileSize(tot);
			valPerc = (free.value / tot.value * 100).toFixed(1);

			//$("#memoryGraph").addClass('greenDark');
			//$("#memoryGraph").addClass('yellow');
			//$("#memoryGraph").addClass('red');
			if(valPerc > 75 && valPerc <= 90) {
				$("#memoryGraph").addClass('yellow');
			}
			else if(valPerc > 90){
				$("#memoryGraph").addClass('red');
			}
			else {
				$("#memoryGraph").addClass('greenDark');
			}

			$("#memoryGraph").find('input').val(valPerc);
			$("#memoryGraph").find(".value > .number").html(tot.value);
			$("#memoryGraph").find(".count > .number").html(free.value);
			$("#memoryGraph").find(".value > .unit").html(tot.unit);
			$("#memoryGraph").find(".count > .unit").html(free.unit);
		}

		$(".whiteCircle").knob({
	        'min':0,
	        'max':100,
	        'readOnly': true,
	        'width': 120,
	        'height': 120,
			'bgColor': 'rgba(255,255,255,0.5)',
	        'fgColor': 'rgba(255,255,255,0.9)',
	        'dynamicDraw': true,
	        'thickness': 0.2,
	        'tickColorizeValues': true
	    });
		$(".circleStatsItemBox").each(function(){
			
			var value = $(this).find(".value > .number").html();
			var unit = $(this).find(".value > .unit").html();
			var percent = $(this).find("input").val()/100;
			
			countSpeed = 2300*percent;
			
			endValue = $(this).find(".count > .number").html();
			
			$(this).find(".count > .unit").html(unit);
			$(this).find(".count > .number").countTo({
				
				from: 0,
			    to: endValue,
			    speed: countSpeed,
			    refreshInterval: 100
			
			});
			
			//$(this).find(".count").html(value*percent + unit);
			
		});
	});
}

/* helps with formatting sizes */
function formatFileSize(bytes) {
    if (typeof bytes !== 'number') {
        return {};
    }

    /* if (bytes >= 1000000000 && 1 == 0) {
        return { value: (bytes / 1000000000).toFixed(2) , unit: 'GB'};
    }*/

    if (bytes >= 1000000) {
        return { value: (bytes / 1000000).toFixed(2) , unit: 'MB'};
    }

    return { value: (bytes / 1000).toFixed(2) ,unit:  'KB' };
}

function formatTime(time){
	var g = 0;
	var h = 0;
	var m = 0;
	var s = 0;
	if(time > 86400000){
		g = Math.floor(time / 86400000);
		time = (time % 86400000);
	}
	if(time > 3600000) {
		h = Math.floor(time / 3600000);
		time = (time % 3600000);
	}
	if(time > 60000){
		m =  Math.floor(time / 60000);
		time = (time % 60000);
	}
	if(time > 1000){
		s = Math.floor(time / 1000);
	}
	return g + "g " + h + "h " + m + "m " + s + "s";
}

function loadChart(){
	generalStatus();
	realTimeGraph();
	packetGraph();
}

function generalStatus(){
	$.getJSON( "/api/controller/summary", function( data ) {
		keys = Object.keys(data);
		var d1 = [];
		for(i = 0; i < 4; i++){
			d1.push([ keys[i] , data[keys[i]] ]);
		}
		$.plot($("#stackchart"), [ d1 ], {
			series: {
				bars: {
					show: true,
					barWidth: 0.6,
					align: "center"
				}
			},
			xaxis: {
				mode: "categories",
				tickLength: 0
			},
			colors: ["#2FABE9", "#FABB3D"]
		});
	});
}

function realTimeGraph(){

	function getInitData() {
		if (bytes.length > 0){
			bytes = bytes.slice(1);
		}
		while (bytes.length < totalPoints) {
			bytes.push(0);
		}
		var data = bytes;
		// zip the generated y values with the x values
		var res = [];
		for (var i = 0; i < data.length; ++i)
			res.push([i, data[i]])
		return res;
	}

	function getDataByte() {
		//delete one element
		if (bytes.length > 0)
			bytes = bytes.slice(1);

		var val = lastData['byte'];
		bytes.push(val);

		// zip the generated y values with the x values
		var res = [];
		for (var i = 0; i < bytes.length; ++i)
			res.push([i, bytes[i]])
		return res;
	}

	var options = {
		legend: {
			show: true
			//container: $("#legend")
		},
		series: { shadowSize: 1 },
		lines: { fill: true, fillColor: { colors: [ { opacity: 0.3 }, { opacity: 0.1 } ] }},
		yaxis: { min: 0, max: 100 },
		xaxis: { show: false },
		colors: ["#2FABE9", "#EB3C00"],
		grid: {	
				tickColor: "#dddddd",
				borderWidth: 0,
				hoverable: true
		},
		crosshair: {
			mode: "x"
		}
	};
	var plotMB = $.plot($("#realtimechart"), [ 
			{ label: "bytes = 0",  data: getInitData("byte")},
			//{ label: "packets = 0",  data: getInitData("pack")},
			//{ label: "flows = 0",  data: getInitData("flow")}
		], options);

	//Update Legends on hover
	var legendsMB = $("#realtimechart .legendLabel");

	legendsMB.each(function () {
		// fix the widths so they don't jump around
		$(this).css('width', $(this).width() + 30);
	});

	// Legend update
	var updateLegendTimeout = null;
	var latestPosition = null;

	function updateLegendMB() {

		updateLegendTimeout = null;
		var pos = latestPosition;
		var axes = plotMB.getAxes();
		//Out of graph
		if (pos.x < axes.xaxis.min || pos.x > axes.xaxis.max ||
			pos.y < axes.yaxis.min || pos.y > axes.yaxis.max) {
			return;
		}
		var i, j, dataset = plotMB.getData();
		for (i = 0; i < dataset.length; ++i) {
			var series = dataset[i];
			// Find the nearest points, x-wise
			for (j = 0; j < series.data.length; ++j) {
				if (series.data[j][0] > pos.x) {
					break;
				}
			}
			// Now Interpolate
			var y, p1 = series.data[j];
			y = p1[1].toFixed(10);
			var txt = series.label.replace(/=.*/, "= " + y);
			txt += "= " + y;
			//Update the value in the legend
			$(".legend").find("tr").each(function (index, val){
				if( i == index){
					$(this).find('.legendLabel').html(txt);
				}
			});
		}
	}

	$("#realtimechart").on("plothover",  function (event, pos, item) {
		latestPosition = pos;
		if (!updateLegendTimeout) {
			updateLegendTimeout = setTimeout(updateLegendMB, 50);
		}
	});


	//Data Update
	function update() {

		//New values
		$.getJSON( "/api/controller/load", function( data ) {
			//console.log(data);
			var b = (Math.abs(lastRealData.byte - data.bytes) / 1000000) / updateInterval;
			var p = Math.abs(lastRealData.pack - data.packets);
			lastData.byte = b;
			lastData.pack = p;

			lastRealData.byte = data.bytes;
			lastRealData.pack = data.packets;
		});

		//console.log(packets);

		plotMB.setData([
			{ label: "[MB/s]",  data: getDataByte() }
		]);
		//Redraw y-axis
		var _max = bytes.max();
		plotMB.getOptions().yaxes[0].max = _max;
		plotMB.setupGrid();
		plotMB.draw();
		setTimeout(update, updateInterval);
	}

	update();

}


function packetGraph(){

	//Init and update of data structure already done in the other graph function	
	
	function getInitData() {
		if (packets.length > 0){
			packets = packets.slice(1);
		}
		while (packets.length < totalPoints) {
			packets.push(0);
		}
		var data = packets;
		var res = [];
		for (var i = 0; i < data.length; ++i)
			res.push([i, data[i]])
		return res;
	}
	function getDataPacket() {
		//delete one element
		if (packets.length > 0)
			packets = packets.slice(1);

		var val = lastData['pack'];
		packets.push(val);

		// zip the generated y values with the x values
		var res = [];
		for (var i = 0; i < packets.length; ++i)
			res.push([i, packets[i]])
		return res;
	}

	var options = {
		legend: {
			show: true
			//container: $("#legend")
		},
		series: { shadowSize: 1 },
		lines: { fill: true, fillColor: { colors: [ { opacity: 0.3 }, { opacity: 0.1 } ] }},
		yaxis: { min: 0, max: 100 },
		xaxis: { show: false },
		colors: ["#F4A506" ,"#2FABE9", "#EB3C00"],
		grid: {	
				tickColor: "#dddddd",
				borderWidth: 0,
				hoverable: true
		},
		crosshair: {
			mode: "x"
		}
	};
	var plot = $.plot($("#packetChart"), [ 
			{ label: "packets = 0",  data: getInitData() }
		], options);

	//Update Legends on hover
	var legends = $("#packetChart .legendLabel");

	legends.each(function () {
		// fix the widths so they don't jump around
		$(this).css('width', $(this).width() + 30);
	});

	// Legend update
	var updateLegendTimeout = null;
	var latestPosition = null;

	function updateLegend() {

		updateLegendTimeout = null;
		var pos = latestPosition;
		var axes = plot.getAxes();
		//Out of graph
		if (pos.x < axes.xaxis.min || pos.x > axes.xaxis.max ||
			pos.y < axes.yaxis.min || pos.y > axes.yaxis.max) {
			return;
		}
		var i, j, dataset = plot.getData();
		for (i = 0; i < dataset.length; ++i) {
			var series = dataset[i];
			// Find the nearest points, x-wise
			for (j = 0; j < series.data.length; ++j) {
				if (series.data[j][0] > pos.x) {
					break;
				}
			}
			// Now Interpolate
			var y, p1 = series.data[j];
			y = p1[1].toFixed(2);
			var txt = series.label.replace(/=.*/, "= " + y);
			txt += "= " + y;
			//Update the value in the legend
			$("#packetChart").find(".legend").find("tr").each(function (index, val){
				if( i == index){
					$(this).find('.legendLabel').html(txt);
				}
			});
		}
	}

	$("#packetChart").on("plothover",  function (event, pos, item) {
		latestPosition = pos;
		if (!updateLegendTimeout) {
			updateLegendTimeout = setTimeout(updateLegend, 50);
		}
	});


	//Data Update
	function update() {

		plot.setData([
			{ label: "packets",  data: getDataPacket() }
		]);
		var _max = packets.max();
		//Resize y-axis
		plot.getOptions().yaxes[0].max = _max;
		plot.setupGrid();
		plot.draw();
		setTimeout(update, updateInterval);
	}

	update();

}
