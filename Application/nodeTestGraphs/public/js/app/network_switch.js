var data = [];
$(function(){
	//Taken from global env
	var regexp = /(\d{4})-(\d{2})-(\d{2})/;
	var dateArray = regexp.exec(day); 
	var _day = new Date(
	    dateArray[1],
	    dateArray[2]-1, // month starts at 0!
	    dateArray[3]
	);
	var _id = dpid;
	//_day & _ip are the local parsed copy
	var secInDay = 60*60*24;
	var minT = _day.getTime()/1000;
	var maxT = minT + secInDay;
	$.getJSON( "/api/switch/" + _id + "/" + minT + "/" + maxT, function( _data ) {
		data = _data;	
		graphBandwidth();
		graphPacket();
	});
	
});

function graphBandwidth(){
	console.log(data);
	var s1 = [];
	var s2 = [];
	var times = Object.keys(data);
	var prevTime = times[0];
	var prevSendByte = data[prevTime].sendByte;
	var prevRecvByte = data[prevTime].recvByte;
	for(var i = 1; i < times.length; i++){
		var k = times[i];

		var recv = Math.max(0, data[k].recvByte - prevRecvByte);
		recv = recv/ (k - prevTime);
		s1.push([k, recv]);
		prevRecvByte = data[k].recvByte;

		var send = Math.max(0, data[k].sendByte - prevSendByte);
		send = send / (k - prevTime);
		s2.push([k, send]);
		prevSendByte = data[k].sendByte;
	}
	var options = {
		series: {
			lines: {
				show:true,
				lineWidth:2,
			},
			points: {
				show:true
			},
			shadowSize: 2
		},
		grid: {
			hoverable:true,
			clickable:true,
			tickColor:"#dddddd",
			borderWidth:0 
		},
		colors:["#FA5833","#2FABE9"]
	};

	var plot = $.plot(
		$("#switchBandwidth"),
		[
			{data:s1,label:"Recv [B/s]"},
			{data:s2,label:"Send [B/s]"}
		],
		options
	);
	function showTooltip(x, y, contents) {
		$('<div id="tooltip">' + contents + '</div>').css( {
			position: 'absolute',
			display: 'block',
			top: y + 5,
			left: x + 5,
			border: '1px solid #fdd',
			padding: '2px',
			'background-color': '#dfeffc',
			opacity: 0.80,
			'z-index': 100
		}).appendTo("body").fadeIn(200);
	}

	var previousPoint = null;
	$("#switchBandwidth").bind("plothover", function (event, pos, item) {
		if (item) {
			if (previousPoint != item.dataIndex) {
				previousPoint = item.dataIndex;

				$("#tooltip").remove();
				var x = item.datapoint[0].toFixed(2),
					y = item.datapoint[1].toFixed(2);

				showTooltip(item.pageX, item.pageY,
							item.series.label + " @time:" + x + " = " + y);
			}
		}
		else {
			$("#tooltip").remove();
			previousPoint = null;
		}
	});
}

function graphPacket(){
	console.log(data);
	var s1 = [];
	var s2 = [];
	var times = Object.keys(data);
	var prevTime = times[0];
	var prevSendPacket = data[prevTime].recvByte;
	var prevRecvPacket = data[prevTime].recvPacket;
	for(var i = 1; i < times.length; i++){
		var k = times[i];

		var recv = Math.max(0, data[k].recvPacket - prevRecvPacket);
		recv = recv/ (k - prevTime);
		s1.push([k, recv]);
		prevRecvPacket = data[k].recvPacket;

		var send = Math.max(0, data[k].recvByte - prevSendPacket);
		send = send / (k - prevTime);
		s2.push([k, send]);
		prevSendBPacket = data[k].recvPacket;
	}
	var options = {
		series: {
			lines: {
				show:true,
				lineWidth:2,
			},
			points: {
				show:true
			},
			shadowSize: 2
		},
		grid: {
			hoverable:true,
			clickable:true,
			tickColor:"#dddddd",
			borderWidth:0 
		},
		colors:["#FA5833","#2FABE9"]
	};

	var plot = $.plot(
		$("#switchPacket"),
		[
			{data:s1,label:"Recv [Packet/s]"},
			{data:s2,label:"Send [Packet/s]"}
		],
		options
	);
	function showTooltip(x, y, contents) {
		$('<div id="tooltipPacket">' + contents + '</div>').css( {
			position: 'absolute',
			display: 'block',
			top: y + 5,
			left: x + 5,
			border: '1px solid #fdd',
			padding: '2px',
			'background-color': '#dfeffc',
			opacity: 0.80,
			'z-index': 100
		}).appendTo("body").fadeIn(200);
	}

	var previousPoint = null;
	$("#switchPacket").bind("plothover", function (event, pos, item) {
		if (item) {
			if (previousPoint != item.dataIndex) {
				previousPoint = item.dataIndex;

				$("#tooltipPacket").remove();
				var x = item.datapoint[0].toFixed(2),
					y = item.datapoint[1].toFixed(2);

				showTooltip(item.pageX, item.pageY,
							item.series.label + " @time:" + x + " = " + y);
			}
		}
		else {
			$("#tooltipPacket").remove();
			previousPoint = null;
		}
	});
}


