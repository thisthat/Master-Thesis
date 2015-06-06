$(function() {
	init();


	function init(){

		$(".cancel").on('click', function(){
			loadPage("/behaviour");
		});

		$(".save").on('click', function(){
			var sw = $("#switchList").val();
			var sym = $("#simbol").val() == "lesser" ? "<" : ">";
			var load = $("#loadNetwork").val();
			var rule = $("#ruleSwitch").val();
			console.log(sw,sym,load,rule);
			$(".errList").hide();
			var errors = false;
			var htmlErrors = "";
			if(sw == ""){
				htmlErrors += "<li>The <b>When</b> filed must not be empty</li>";
				errors = true;
			}
			if(load == ""){
				htmlErrors += "<li>The <b>Than</b> filed must not be empty</li>";
				errors = true;
			}
			if(rule == ""){
				htmlErrors += "<li>The <b>Do</b> filed must not be empty</li>";
				errors = true;
			}
			if(errors){
				$(".errList").html(htmlErrors);
				$(".errList").show();
				return;
			}
			$(".errList").hide();
			$.ajax({
				method: "POST",
				url: "/api/behaviour/create",
				data: { 
					sw   : sw,
					sym  : sym,
					load : load,
					rule : rule
				}
			})
			.always(function( msg ) {
				if(msg.status && msg.status == "ok"){
					loadPage("/behaviour");
				}
				else {
					msgErrors += "<li>Errors while inserting the behaviour. Try again later please.</li>";
					$(".errList").html(msgErrors);
					$(".errList").show();
				}
			});
		});
		$(".errList").hide();
		loadSwitch();
		loadRule();
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
		});
	}

	function loadRule(){
		$.getJSON( "/api/rule", function( data ) {
			for(i = 0; i < data.length; i++) {
				var rule = data[i];
				$("#ruleSwitch").append($('<option>', {
				    value: rule.name,
				    text: rule.name
				}));
			}
		});
	}
})