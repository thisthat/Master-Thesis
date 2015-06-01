var express = require('express');
var router = express.Router();
var request = require('request');
var MJ = require("mongo-fast-join"),
    mongoJoin = new MJ();
var controller_url = "http://192.168.56.1:8080/";

var debug = false;
var __test = "full_00";

/* GET users listing. */

var controller = require('./api/controller');
var switches = require('./api/switches')
var prediction = require('./api/prediction')

router.use("/controller", controller);
router.use("/switch", switches);
router.use("/prediction", prediction);


router.get('/', function(req, res, next) {
  res.send('API Working');
});

/*
	NETWORK LOAD
*/

router.get('/network/load/:min/:max', function(req, res, next) {
	var db = req.db;
	var _min = parseInt(req.params.min);
	var _max = parseInt(req.params.max);
	res.setHeader('Content-Type', 'application/json');
	var out = {};
	var project = {};
	project["_id"] = 0;
	console.log(project);
	db.collection('NetInfo')
	.find(
		{
			_time: { $gte: _min, $lte: _max }
		},
		project
	)
	.sort({_time: -1})
	.toArray(function (err, items) {
		items.forEach( function(item, index){
			var keys = Object.keys(item);
			var t = item['_time'];
			for(var i = 0; i < keys.length; i++){
				var key = keys[i];
				//console.log(key);
				if(key != "test" && key != "_time"){
					var aggr = item[key]["aggregate"];
					//console.log(aggr);
					if(typeof out[t] != "undefined"){
						out[t]["packetCount"]	+= parseInt(aggr["packetCount"]);
						out[t]["byteCount"] 	+= parseInt(aggr["byteCount"]);
						out[t]["flowCount"] 	+= parseInt(aggr["flowCount"]);
					}
					else {
						out[t] = {
							packetCount : 0,
							byteCount: 0,
							flowCount: 0
						};
						out[t]["packetCount"]	= parseInt(aggr["packetCount"]);
						out[t]["byteCount"] 	= parseInt(aggr["byteCount"]);
						out[t]["flowCount"] 	= parseInt(aggr["flowCount"]);
					}
					
				}
			}
		});

        res.json(out);
    })
	;
});



/*

Time Section

*/
router.get('/time/min', function(req, res, next) {
	var db = req.db;
	res.setHeader('Content-Type', 'application/json');
	if(debug){
		db.collection('DataTime').find({test: __test}).sort({_time: 1}).limit( 1 ).toArray(function (err, items) {
	        res.json(items[0]);
	    });
	}
	else {
		db.collection('DataTime').find().sort({_time: 1}).limit( 1 ).toArray(function (err, items) {
	        res.json(items[0]);
	    });
	}
});
router.get('/time/max', function(req, res, next) {
	var db = req.db;
	res.setHeader('Content-Type', 'application/json');
	if(debug){
		db.collection('DataTime').find({test: __test}).sort({_time: -1}).limit( 1 ).toArray(function (err, items) {
	        res.json(items[0]);
	    });
	}
	else {
		db.collection('DataTime').find().sort({_time: -1}).limit( 1).toArray(function (err, items) {
	        res.json(items[0]);
	    });
	}
});


/* 

Topology Section

*/

router.get('/topology/graph/json', function(req, res, next) {
	res.setHeader('Content-Type', 'application/json');
  
    request({
        url: controller_url + 'wm/controller/topology', 
        timeout: 13000, //after 12s the controller stop to wait the switches and answer
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(body)
        }
        else {
            res.send("[]");
        }
    })
});





module.exports = router;
