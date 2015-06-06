$(function() {

	init();

	function init(){
		//Load the table
		loadTable();

		//Bind new rule
		$(".addRule").on('click', function(){
			loadPage("/rule/add");
		});

		//Bind on click of a row
		$("#ruleList").on('click','button', function(){
			var row = $(this).parent().parent();
	    	var url = "/api/rule/" + row.find("td:nth-child(2)").html() + "/delete";
	    	$.ajax({
				method: "GET",
				url: url
			})
			.done(function( msg ) {
				console.log(msg);
				if(msg.status && msg.status == "ok"){
					$(".alert").hide();
					$(".alert-success").show();
					row.remove();
				}
				else {
					$(".alert").hide();
					$(".alert-danger").show();
				}
			});
	    });
	    $(".alert").hide();
	}


	function loadTable(){
		$.getJSON( "/api/rule", function( data ) {
			var i  = 0;
			for(var ind = 0; ind < data.length; ind++){
				var rule = data[ind];
				var tr = $("<tr>");
				var th = $("<th>");
				var name = $("<td>");
				var createAt = $("<td>");
				var del = $("<td>");
				del.html('<button type="submit" class="btn btn-danger btn-mini"><i class="icon-remove icon-white"></i></button>');
				th.attr('row',1);
				th.html(++i);
				name.html(rule.name);
				createAt.html(convertTime(rule.createAt));
				tr.append(th);
				tr.append(name);
				tr.append(createAt);
				tr.append(del);
				$("#ruleList").append(tr);
			}
		});
	}

	function convertTime(unix_timestamp){
		var date = new Date(unix_timestamp*1000);

		var hours = date.getHours();
		var minutes = "0" + date.getMinutes();
		var seconds = "0" + date.getSeconds();
		var formattedTime = hours + ':' + minutes.substr(minutes.length-2) + ':' + seconds.substr(seconds.length-2);

		var day   = "0" + date.getDate();
		var month = "0" + date.getMonth();
    	var year  = 	  date.getFullYear();
    	var formattedDate = year + '/' + month.substr(month.length-2) + '/' + day.substr(day.length-2);

    	return formattedDate + " " + formattedTime;
	}
})