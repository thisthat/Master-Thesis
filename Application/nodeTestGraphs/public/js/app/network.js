$(function() {
	var tmp = 0;
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
		$.getJSON( "/api/switch/list/" + minT + "/" + maxT, function( data ) {
			console.log(data);
		});
    });
});