$(function() {
	
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
    });
    //Show data for a switch
    $("#switchList").on('click','tbody > tr', function(){
    	var url = "/network/" + $(this).find("td:nth-child(2)").html() + "/" + $("#datepicker").val();
    	loadPage(url);
    });
});