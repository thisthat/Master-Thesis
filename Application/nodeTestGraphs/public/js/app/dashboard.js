$(function(){
	init();
});

function init(){

	loadMemoryUsage();
	loadHealth();
	loadUptime();
	//Autoreload
	
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