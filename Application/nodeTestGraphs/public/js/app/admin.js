$(function(){
	var __time = 300;
	init();


	function init(){
		$('#myModal').modal('show');
		$( "#secondTopologyBuild" ).slider({
	      orientation: "horizontal",
	      range: "min",
	      max: 600,
	      min: 1,
	      value: 127,
	      slide: sendTime,
	      change: sendTime
	    });
		$( "#secondTopologyBuild" ).slider( "value", __time );
	}

	function sendTime(){
		var s = $( "#secondTopologyBuild" ).slider( "value" );
		__time = s;
		var $spanTime = $("#secondTopologyBuild").parent().parent().find(".time");
		$spanTime.html( s + " [s]");
	}
})
