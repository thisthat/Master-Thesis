var width = $("#topologyGraph").width(),
height = 500;

var color = d3.scale.category20();

var force = d3.layout.force()
.charge(-120)
.linkDistance(30)
.size([width, height]);

var svg = d3.select("#topologyGraph").append("svg")
.attr("width", width)
.attr("height", height);


var NodeColors = [
	"#2ca02c",	//OK
	"#ff7f0e", //Medium
	"#d62728"	//Risk
];

d3.json("/api/topology/graph/json", function(error, graph) {
	if(graph == ""){
		svg.append("g")
		.attr("class", "legend")
		.attr("x", width/2)
		.attr("y", height / 2)
		.attr("height", 100)
		.attr("width", 100).append("text")
				.attr("x", width / 2 - 100)
				.attr("y", 25)
				.text("The Controller is not avaiable :(");
	}
	else if(graph.nodes.length == 0){
		svg.append("g")
		.attr("class", "legend")
		.attr("x", width/2)
		.attr("y", height / 2)
		.attr("height", 100)
		.attr("width", 100).append("text")
				.attr("x", width / 2 - 100)
				.attr("y", 25)
				.text("There are no switches in the network!");
	}
	console.log(graph);
	force
	.nodes(graph.nodes)
	.links(graph.links)
	.start();

	var link = svg.selectAll(".link")
	.data(graph.links)
	.enter().append("line")
	.attr("class", "link")
	.style("stroke-width", function(d) { return Math.sqrt(d.value); });

	var node = svg.selectAll(".node")
	.data(graph.nodes)
	.enter().append("circle")
	.attr("class", "node")
	.attr("r", 5)
	.style("fill", function(d) {
		var url = "api/prediction/" + d.name + "/execute/index"; 
		$.ajaxSetup({
		    async: false
		});
		var c = 0;
		$.getJSON( url, function( pred ) {
			var index = parseInt(pred.prediction);
			console.log(pred.DPID, pred.prediction);
			if(index >= 5 && index < 8){
				c = 1;
			}
			if(index >= 8){
				c = 2;
			}
		});
		$.ajaxSetup({
		    async: true
		});
		return NodeColors[c];
	})
	.call(force.drag);

	node.append("title")
	.text(function(d) { return d.name; });

	force.on("tick", function() {
		link.attr("x1", function(d) { return d.source.x; })
		.attr("y1", function(d) { return d.source.y; })
		.attr("x2", function(d) { return d.target.x; })
		.attr("y2", function(d) { return d.target.y; });

		node.attr("cx", function(d) { return d.x; })
		.attr("cy", function(d) { return d.y; });
	});

	
	d3.selectAll("circle.node").on("click", function(d){
      //Run the call of legend
      //legend.style("opacity",0);
      //generateLegend(d);
      console.log(d);
      generatePopUp(d);
  });

	function generatePopUp(node){
		$.getJSON( "/api/prediction/" + node.name + "/execute/all", function( _data ) {
			console.log(_data);
			var serie = [];
			var val = _data[0].ValueList;
			var pre = _data[0].PredictionList;
			var size= _data[0].ClassSize;
			var j = 0;
			for(var i = 0; i < val.length; i++){
				serie.push([ j++ , parseInt(val[i]) ] );
			}
			for(var i = 0; i < pre.length; i++){
				serie.push([ j++ , parseInt(pre[i]) * size ] );
			}
			console.log(serie);
			$('#inline').modal('show');
			var plot = $.plot($("#graphPrediction"), [ serie ], {
				legend: {
					show: true
					//container: $("#legend")
				},
				series: { shadowSize: 1 },
				lines: { fill: true, fillColor: { colors: [ { opacity: 0.3 }, { opacity: 0.1 } ] }},
				xaxis: { show: false },
				colors: ["#2FABE9", "#EB3C00"],
				grid: {	
						tickColor: "#dddddd",
						borderWidth: 0,
						hoverable: true
				},
				crosshair: {
					mode: "x"
				}
			});
			//Line NOW
			var o = plot.pointOffset({ x: val.length - 1, y: -20});
			var ctx = plot.getCanvas().getContext("2d");
			ctx.beginPath();
			ctx.moveTo(o.left, o.top + 20);
			ctx.lineTo(o.left, o.top - 300);
			ctx.lineTo(o.left + 2, o.top - 300);
			ctx.lineTo(o.left + 2, o.top + 20);
			ctx.fillStyle = "#F4A506";
			ctx.fill();
			ctx.font="10px Arial";
			ctx.fillText("Now", o.left + 5 ,o.top + 5);
			$("#graphPrediction").css("margin","20px auto");
		});
	}

	function generateLegend(node){

		$.getJSON( "/api/switch/" + node.name + "/info", function( _data ) {
			var n = Math.floor(Math.random() * colors.length);
			var data = _data.desc;
			d3.selectAll("text").remove();
			legend.append("text")
				.attr("x", width - 300)
				.attr("y", 25)
				.text(node.name);
			legend.append("text")
				.attr("x", width - 300)
				.attr("y", 45)
				.text("HW: " + data.hardwareDescription);
			legend.append("text")
				.attr("x", width - 300)
				.attr("y", 65)
				.text("" + data.manufacturerDescription);
			legend.append("text")
				.attr("x", width - 300)
				.attr("y", 85)
				.text("OpenFlow Protocol: " + data.version);
			legend.transition()
  				.style("opacity",1)
  				.duration(1000) // this is 1s
  				.delay(100);     // this is 0.1s

			d3.select("rect.legendBorder")
           		.style('stroke-width', 1)
				.style("stroke", colors[1])
				.style("stroke-width", colors[1]);

		});
	}
	var colors = ['#1f77b4','#ff7f0e','#2ca02c','#d62728','#9467bd','#8c564b','#e377c2','#7f7f7f','#bcbd22', '#17becf']

	var legend = svg.append("g")
		.attr("class", "legend")
		.attr("x", width - 300)
		.attr("y", 25)
		.attr("height", 100)
		.attr("width", 100);
	var border = svg.append("rect")
		.attr("x", width - 350)
		.attr("y", 5)
		.attr("height", 90)
		.attr("width", 300)
		.attr("class","legendBorder")
		.style("fill", "none");

});