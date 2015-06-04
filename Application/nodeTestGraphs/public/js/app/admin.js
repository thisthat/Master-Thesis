$(function(){
	var __time = 300;

	$(".admin-modal").on('click', function(e){
		e.preventDefault();
		$('#myModal').modal('show');
		init();
	});

	//Bind action to save button
	$("#admin-save").on('click', function(){
		save();
		$('#myModal').modal('hide');
		//Notification
		var id = $.gritter.add({
			// (string | mandatory) the heading of the notification
			title: 'Data Saved',
			// (string | mandatory) the text inside the notification
			text: 'Data saved correctly',
			sticky: false, 
			time: 2000,
			after_close: function(){
				$.gritter.removeAll();
			}
		});
		console.log("Quante volte premo?", id);
	});

	//Bind the rebuild now
	$("#admin-rebuild").on('click', function() {
		console.log("Ok");
		$.ajax({
			method: "POST",
			url: "api/controller/rebuild"
		}).done(function(res) {
			var html = "";
			if(typeof res.msg == "undefined"){
				var html = "<div class='alert alert-error' role='alert'>Some errors occurs. Please, try again later!</div>";
			}
			else {
				var html = "<div class='alert alert-success' role='alert'>Topology Rebuilded!</div>";
			}
			$(".tabsAdmin").after(html);
			setTimeout(function(){
				$(".alert").hide(500, function(){
					$(this).remove();
				});
			}, 2000);
		});
	});

	//Trigger to change tab
	$(".tab").on('click', function(){
		$(".tabsAdmin").find("li").each(function( index ) {
		 	$(this).removeClass("active");
		 	var active = ".admin-" + $(this).attr('data-show');
		 	$(active).hide();
		});

		$(this).addClass("active");
		var active = ".admin-" + $(this).attr('data-show');
		$(active).show();
	});


	//Start with General Tab
	$(".tab1").trigger("click");

	function init(){

		//Load the slide for set the TimeOut
		loadTimeOut();

		//Get Mongo Info
		loadMongo();

		//Get info daemon
		loadDaemon();

		//Fill the second tab with switch
		loadSwitch();

		//Fill the third tab with dataset info
		loadDataset();

		//Handle the reload of a model
		$(".tab2-data").on('click', 'button',function(){
			var dpid = $(this).attr('data-sw');
			$.getJSON( "api/prediction/" + dpid + "/reload", function( res ) { 
				console.log(res);
				loadSwitch();
			});
		});
	}

	function sendTime(){
		var s = $( "#secondTopologyBuild" ).slider( "value" );
		__time = s*1000;
		var $spanTime = $("#secondTopologyBuild").parent().parent().find(".time");
		$spanTime.html( s + " [s]");
	}
	function sendTimerDaemon(){
		var s = $( "#secondQueryController" ).slider( "value" );
		var $spanTime = $("#secondQueryController").parent().parent().find(".timeQuery");
		$spanTime.html( s + " [s]");
	}
	

	function loadTimeOut(){
		$.getJSON( "api/prediction/timeout", function( time ) {
			__time = parseInt(time.timeout) / 1000;
			$( "#secondTopologyBuild" ).slider({
		      orientation: "horizontal",
		      range: "min",
		      max: 600,
		      min: 1,
		      slide: sendTime,
		      change: sendTime
		    });
			$( "#secondTopologyBuild" ).slider( "value", __time );
		});
	}
	function loadDaemon(){
		$.getJSON( "/daemon", function( info ) {
			console.log(info);
			var t = info.timer;
			var active = info.isRunning == "true";
			$( "#secondQueryController" ).slider({
		      orientation: "horizontal",
		      range: "min",
		      max: 30,
		      min: 1,
		      slide: sendTimerDaemon,
		      change: sendTimerDaemon
		    });
			$( "#secondQueryController" ).slider( "value", t );
			$('#isRunningDaemon').prop('checked', active);
		});
	}
	function loadSwitch(){
		console.log("Load Switch");
		$(".tab2-data").html("");
		$.getJSON( "api/prediction/all/info", function( prediction ) {
			for(var i in prediction){
				var sw = prediction[i];
				var time = sw.loadedAt;
				var html = '<div class="bs-example" data-example-id="list-group-custom-content">';
				html += '<div class="list-group">';
				html += '<a href="#" class="list-group-item active">';
				html += '<h4 class="list-group-item-heading" id="list-group-item-heading">' + sw.dpid;
				html += '<a class="anchorjs-link" href="#"><span class="anchorjs-icon"></span></a></h4>'
				html += '<p class="list-group-item-text">';
				html += 'Classifier: ' + sw.classifier + ' <br />';
				html += 'Model loaded @:' + time;
				html += '<button type="button" style="margin-left: 20px;" class="btn btn-info reload" data-sw="' + sw.dpid + '">';
				html += '<span class="halflings-icon refresh" aria-hidden="true"></span>';
				html += '</button></p>';
				html += '</a>';
				html += '</div>';
				html += '</div>';
				$(".tab2-data").append(html);
				// glyphicons-icon refresh
			}
		});
	}
	function loadMongo(){
		$.getJSON( "api/controller/mongoDB", function( mongo ) {
			$("#mongoIP").val(mongo.ip);
			$("#mongoPort").val(mongo.port);
		});
	}


	function loadDataset(){
		console.log("Load Dataset");
		$(".tab3-data").html("");
		$.getJSON( "api/prediction/all/dataset", function( info ) {
			for(var i in info){
				var sw = info[i];
				var lags = sw.lags;
				var dpid = sw.dpid;
				var deri = sw.derivative;
				var size = sw.classSize;
				var html;

				html  = '<div class="bs-example" data-example-id="list-group-custom-content">';
				html += '<div class="list-group">';
				html += '<a href="#" class="list-group-item active">';
				html += '<h4 class="list-group-item-heading" id="list-group-item-heading">' + dpid;
				html += '<a class="anchorjs-link" href="#"><span class="anchorjs-icon"></span></a></h4>'
				html += '<p class="list-group-item-text">';

				html += "Class size: <select class='classSize' data-dpid='" + dpid + "'>";
					html += "<option value='200' " + (size == "200" ? "SELECTED" : "") + "> 200KB </option>"; 
					html += "<option value='500' " + (size == "500" ? "SELECTED" : "") + "> 500KB </option>"; 
					html += "<option value='1000' " + (size == "1000" ? "SELECTED" : "") + "> 1000KB </option>";  
				html += "</select>";
				html += "<br />";
				html += "Lags: <select class='lags' data-dpid='" + dpid + "'>";
					html += "<option value='5' " + (lags == "5" ? "SELECTED" : "") + "> 5 </option>"; 
					html += "<option value='8' " + (lags == "8" ? "SELECTED" : "") + "> 8 </option>"; 
					html += "<option value='10' " + (lags == "10" ? "SELECTED" : "") + "> 10 </option>";  
				html += "</select>";
				html += "<br />";
				html += "Derivative: <input type='checkbox' class='derivative'"+ (deri == "true" ? "CHECKED" : "") + " data-dpid='" + dpid + "'>";


				html += '</p>';
				html += '</a>';
				html += '</div>';
				html += '</div>';
				$(".tab3-data").append(html);
				// glyphicons-icon refresh
			}
		});
	}


	function save(){
		saveTime();
		saveMongo();
		saveDaemon();
		saveDataset();
	}

	function saveTime(){
		$.ajax({
			method: "POST",
			url: "api/prediction/timeout",
			data: { time: __time }
		}).done(function(res) {
			console.log(res);
		});
	};

	function saveMongo(){
		var _ip 	= $("#mongoIP").val();
		var _port 	= $("#mongoPort").val();
		$.ajax({
			method: "POST",
			url: "api/controller/mongoDB",
			data: { ip: _ip, port: _port }
		}).done(function(res) {
			console.log(res);
		});
	};

	function saveDaemon(){
		var _timer 	= $( "#secondQueryController" ).slider( "value");
		var _active	= $("#isRunningDaemon").prop('checked');
		console.log(_timer, _active);
		$.ajax({
			method: "POST",
			url: "/daemon",
			data: { timer: _timer, active: _active }
		}).done(function(res) {
			console.log(res);
		});
	};

	function saveDataset(){
		var jsonObj = [];
		$(".tab3-data").find(".list-group-item-text").each(function(index){
			var sel = $(this).find('select.classSize');
			var dpid = sel.attr('data-dpid');
			var size = sel.val();
			var lags = $(this).find('select.lags').val();
			var deri = $(this).find('.derivative').is(':checked');
			jsonObj.push({
				"dpid" : dpid, 
				"lags" : lags, 
				"derivative" : String(deri), 
				"classSize" : size
			});
		});
		$.ajax({
			method: "POST",
			url: "api/prediction/all/dataset",
			data: { obj : JSON.stringify(jsonObj) }
		}).done(function(res) {
			console.log(res);
		});

	};

})
