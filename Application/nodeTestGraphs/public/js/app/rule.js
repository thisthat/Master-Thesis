$(function() {

	init();

	function init(){
		//press the plus button to add a row
		$("#actionRows").on('click','button.addRow', function(){
			$(this).remove();
			var row = $("#templateRow").clone();
			row.removeClass("hide");
			$("#actionRows").append( row.html() );
		});

		//Press the minus
		$("#actionRows").on('click','button.removeThis', function(){
			var plus = $(this).parent().find(".addRow");
			if(plus.length != 1)
				$(this).parent().parent().remove();
		});
		
		//Inser one row to start
		var row = $("#templateRow").clone();
		row.removeClass("hide");
		$("#actionRows").append( row.html() );

		//Change the switch selected
		$("#switchList").change(function(){
			var dpid = $(this).val();
			$('#inport').find('option').remove();
			$.getJSON( "/api/switch/" + dpid +"/port", function( data ) {
				var ports = data.port;
				for(i = 0; i < ports.length; i++) {
					var p = ports[i].portNumber;
					$("#inport").append($('<option>', {
					    value: p,
					    text: p
					}));
				}
			});
		});

		$("#cancBtn").on('click', function(){
			loadPage("/rule");
		});

		$("#saveBtn").on('click', function(){

			var name = $("#ruleName").val();
			var sw 	 = $("#switchList").val();
			var pri  = $("#priority").val();
			var inPt = $("#inport").val();

			var strAction = "";
			$("#actionRows").find('.addAction').each(function(){
				var key = $(this).find('.actionType').val();
				var val = $(this).find('.actionValue').val();
				strAction += key + "=" + val + ",";
			});

			//Checks
			//name unique
			//Not empy fields
			var errors = false;
			var msgErrors = "";
			if(name == ""){
				errors = true;
				msgErrors += "<li>Name must not be empty</li>";
			}
			if(sw == ""){
				errors = true;
				msgErrors += "<li>Switch must not be empty</li>";
			}
			if(pri == ""){
				errors = true;
				msgErrors += "<li>Priority must not be empty</li>";
			}
			if(inPt == ""){
				errors = true;
				msgErrors += "<li>In Port must not be empty</li>";
			}
			if(errors){
				$(".errList").html(msgErrors);
				$(".errList").show();
				return;
			}
			$.getJSON( "/api/rule/" + name, function( data ) {
				if(typeof data == "object"){
					errors = true;
					msgErrors += "<li>Name already Exists</li>";
					$(".errList").html(msgErrors);
					$(".errList").show();
					return;
				}
				else {
					$(".errList").hide();
					$.ajax({
						method: "POST",
						url: "/api/rule/create",
						data: { 
							name : name,
							sw   : sw,
							pri  : pri,
							inPt : inPt,
							act  : strAction
						}
					})
					.always(function( msg ) {
						if(msg.status && msg.status == "ok"){
							loadPage("/rule");
						}
						else {
							msgErrors += "<li>Errors while inserting the rule. Try again later please.</li>";
							$(".errList").html(msgErrors);
							$(".errList").show();
						}
					});
				}
			});
		});
		$(".errList").hide();

		loadSwitch();

	}


	function loadSwitch(){
		$.getJSON( "/api/topology/graph/json", function( data ) {
			var sws = data.nodes;
			for(i = 0; i < sws.length; i++) {
				var sw = sws[i];
				$("#switchList").append($('<option>', {
				    value: sw.name,
				    text: sw.name
				}));
			}
			var dpid = $("#switchList").val();
			$('#inport').find('option').remove();
			$.getJSON( "/api/switch/" + dpid +"/port", function( data ) {
				var ports = data.port;
				for(i = 0; i < ports.length; i++) {
					var p = ports[i].portNumber;
					$("#inport").append($('<option>', {
					    value: p,
					    text: p
					}));
				}
			});
		});
	}
})