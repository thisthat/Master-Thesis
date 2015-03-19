<?php

if(isset($_GET['url'])){
	$url = $_GET['url'];
	// Get cURL resource
	$curl = curl_init();
	// Set some options - we are passing in a useragent too here
	curl_setopt_array($curl, array(
	    CURLOPT_RETURNTRANSFER => 1,
	    CURLOPT_URL => $url,
	    CURLOPT_USERAGENT => 'Codular Sample cURL Request'
	));
	// Send the request & save response to $resp
	$resp = curl_exec($curl);
	// Close request to clear up some resources
	curl_close($curl);
	echo $resp;
	//echo $url;
	die();
}

?>

<html>
<head>
	<title>Test API</title>
</head>

<body>


<script type='text/javascript' src='//cdnjs.cloudflare.com/ajax/libs/jquery/2.0.3/jquery.min.js'></script>

<script type="text/javascript">
	
jQuery(document).ready(function($) {
	
	ajaxCall('/wm/core/switch/00:00:00:00:00:00:00:01/flow/json');


	function getSwitch(){
		ajaxCall("/wm/core/controller/switches/json");
	}

	function getHost(){
		$.ajax({
		  	url: "?url=http://192.168.56.1:8080/wm/device/"
		}).done(function(res) {
		  	$( "#r" ).html( res);
		  	res = JSON.parse(res);
		  	var d = new Date();
		  	res.forEach(function(element, index, array){
		  		element._time = d.getTime();
		  		array[index] = element;
		  	})
		});
	}

	function ajaxCall(api){
		$.ajax({
		  	url: "?url=http://192.168.56.1:8080" + api
		}).done(function(res) {
		  	
		  	res = JSON.parse(res);
		  	var d = new Date();
		  	/*res.forEach(function(element, index, array){
		  		element._time = d.getTime();
		  		array[index] = element;
		  	})*/
		  	console.log(res);
		  	$( "#r" ).html( JSON.stringify(res));
		});
	}

});

</script>


<p id="r">

</p>






</body>
</html>