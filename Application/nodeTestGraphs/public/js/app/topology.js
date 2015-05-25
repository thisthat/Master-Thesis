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
	.style("fill", function(d) { return color(1); })
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
      //On Click, reset the style
      d3.selectAll("circle.node").attr('r', 5)
      .style("fill", function(d) { return color(1); });
      d3.select(this).attr('r', 7)
      .style("fill","green");
      //Run the call of legend
      generateLegend(d);
  });

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
			d3.select("rect.legendBorder")
           		.style('stroke-width', n+1)
				.style("stroke", colors[n])
				.style("stroke-width", colors[n]);

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