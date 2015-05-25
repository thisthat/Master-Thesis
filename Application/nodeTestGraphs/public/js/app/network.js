var data = [];

$(function() {
	setTimeout(function(){
		$(".row-fluid .sortable").find('.btn-minimize').trigger('click');
	},500);
	
	/*, function(e){
		e.preventDefault();
		var $target = $(this).parent().parent().next('.box-content');
		if($target.is(':visible')) $('i',$(this)).removeClass('chevron-up').addClass('chevron-down');
		else 					   $('i',$(this)).removeClass('chevron-down').addClass('chevron-up');
		$target.slideToggle();
	});*/

	$.getJSON( "/api/time/min", function( data ) {
		var tmin = data['_time'];
		tmp = tmin;
		var minDate = new Date(tmin*1000);
		console.log(minDate);
		$.getJSON( "/api/time/max", function( data ) {
			var tmax = data['_time'];
			var maxDate = new Date(tmax*1000);
			$( "#datepicker" ).datepicker({
				minDate: minDate,
				maxDate: maxDate,
				dateFormat: "yy-mm-dd"
			});
		});
	});


    
    $('#datepicker').on('change', function(){
    	var val = $(this).val();
    	var regexp = /(\d{4})-(\d{2})-(\d{2})/;
		var dateArray = regexp.exec(val); 
		var min = new Date(
		    dateArray[1],
		    dateArray[2]-1, // month starts at 0!
		    dateArray[3]
		);
		var secInDay = 60*60*24;
		var minT = min.getTime()/1000;
		var maxT = minT + secInDay;
		var i = 0;
		//Empty from previous search
		$('#switchList').find('tbody > tr').remove();
		$.getJSON( "/api/switch/list/" + minT + "/" + maxT, function( data ) {
			for(var sw in data){
				var tr = $("<tr>");
				var th = $("<th>");
				var dpid = $("<td>");
				var ip = $("<td>");
				th.attr('row',1);
				th.html(++i);
				dpid.html(sw);
				//IP from first result
				ip.html(data[sw][0]["inetAddress"]);
				tr.append(th);
				tr.append(dpid);
				tr.append(ip);
				$("#switchList").append(tr);
			}
		});
		printGraphs(minT,maxT);
    });
    //Show data for a switch
    $("#switchList").on('click','tbody > tr', function(){
    	var url = "/network/" + $(this).find("td:nth-child(2)").html() + "/" + $("#datepicker").val();
    	loadPage(url);
    });

    function printGraphs(minT, maxT){
    	$.getJSON( "/api/time/min", function( _data ) {
			var tmin = _data['_time'];
			tmp = tmin;
			var minDate = new Date(tmin*1000);
			console.log(minDate);
			$.getJSON( "/api/network/load/" + minT + "/" + maxT, function( _data ) {
				data = _data;
				$(".row-fluid .sortable").find('.btn-minimize').trigger('click');
				graphBandwidth();
				graphPacket();
				graphFlow();

			});
		});
    }




	function graphBandwidth(){
		//console.log(data);
		var s1 = [];
		var times = Object.keys(data);
		var prevTime = times[0];
		console.log(data,times, prevTime);
		var prevSendByte = data[prevTime].byteCount;
		for(var i = 1; i < times.length; i++){
			var k = times[i];

			var send = Math.max(0, data[k].byteCount - prevSendByte);
			send = send / (k - prevTime);
			s1.push([k, send]);
			prevSendByte = data[k].byteCount;
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
				{data:s1,label:"Bandwidth [B/s]"},
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
		//console.log(data);
		var s1 = [];
		var times = Object.keys(data);
		var prevTime = times[0];
		var prevSendPacket = data[prevTime].packetCount;
		for(var i = 1; i < times.length; i++){
			var k = times[i];

			var send = Math.max(0, data[k].packetCount - prevSendPacket);
			send = send / (k - prevTime);
			s1.push([k, send]);
			prevSendBPacket = data[k].packetCount;
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
			colors:["#2FABE9"]
		};

		var plot = $.plot(
			$("#switchPacket"),
			[
				{data:s1,label:"Send [Packet/s]"},
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

	function graphFlow(_id){
		var s1 = [];
		var times = Object.keys(data);
		for(var i = 0; i < times.length; i++){
			var k = times[i];
			s1.push([k, data[k].flowCount]);
		}
		var options = {
			series: {
				bars: {
			        show: true,
			        align: "center",
	    			barWidth: 0.5
			    },
				shadowSize: 2
			},
			grid: {
				hoverable:true,
				clickable:true,
				tickColor:"#dddddd",
				borderWidth:0 
			},
			colors:["#FABB3D","#2FABE9"]
		};
		console.log(s1);
		var plot = $.plot(
			$("#switchFlow"),
			[
				{data:s1,label:"Flows"},
			],
			options
		);
		function showTooltip(x, y, contents) {
			$('<div id="tooltipFlow">' + contents + '</div>').css( {
				position: 'absolute',
				display: 'block',
				top: y + 5,
				left: x + 5,
				border: '1px solid #fdd',
				padding: '2px',
				'background-color': '#FABB3D',
				opacity: 0.80,
				'z-index': 100
			}).appendTo("body").fadeIn(200);
		}

		var previousPoint = null;
		$("#switchFlow").bind("plothover", function (event, pos, item) {
			if (item) {
				if (previousPoint != item.dataIndex) {
					previousPoint = item.dataIndex;

					$("#tooltipFlow").remove();
					var x = item.datapoint[0].toFixed(2),
						y = item.datapoint[1].toFixed(2);

					showTooltip(item.pageX, item.pageY,
								item.series.label + " @time:" + x + " = " + y);
				}
			}
			else {
				$("#tooltipFlow").remove();
				previousPoint = null;
			}
		});
	}
});	