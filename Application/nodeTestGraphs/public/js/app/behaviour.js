$(function() {
	init();


	function init(){
		loadSwitch();
	}


	function loadSwitch(){
		$.getJSON( "/api/topology/graph/json", function( data ) {
			console.log(data);
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
})