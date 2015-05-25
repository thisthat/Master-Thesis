var express = require('express');
var router = express.Router();
var request = require('request');
var MJ = require("mongo-fast-join"),
    mongoJoin = new MJ();
var controller_url = "http://192.168.56.1:8080/";

var debug = true;
var __test = "full_00";

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('API Working');
});


/*

CONTROLLER SECTION

*/
router.get('/controller/memory', function(req, res, next) { 
	res.setHeader('Content-Type', 'application/json'); 
    request.get({
        url: controller_url + 'wm/core/memory/json', 
        timeout: 1000,
    },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(body);
        }
        else {
            res.send("[]");
        }
    })
});

router.get('/controller/health', function(req, res, next) {
	res.setHeader('Content-Type', 'application/json');
    request({
        url: controller_url + 'wm/core/health/json',
        timeout: 1000,
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(body);
        }
        else {
            console.log("Healt Error :(");
            if(!error){
                console.log(response.statusCode );
            }
            res.send("[]");
        }
    })
});

router.get('/controller/uptime', function(req, res, next) {
	res.setHeader('Content-Type', 'application/json');
    request({
        url: controller_url + 'wm/core/system/uptime/json', 
        timeout: 1000,
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(body);
        }
        else {
            res.send("[]");
        }
    })
});

router.get('/controller/summary', function(req, res, next) {
	res.setHeader('Content-Type', 'application/json');
    request({
        url: controller_url + 'wm/core/controller/summary/json', 
        timeout: 1000,
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(body);
        }
        else {
            res.send("[]");
        }
    })
});

router.get('/controller/load', function(req, res, next) {
	res.setHeader('Content-Type', 'application/json');
    var totByte = 0;
    var totPack = 0;
    request({
        url: controller_url + 'wm/core/switch/all/port/json', 
        timeout: 13000, //after 12s the controller stop to wait the switches and answer
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var switches = JSON.parse(body);
            for(i in switches){
                var sw = switches[i];
                for(j in sw.port){
                    var port = sw.port[j];
                    //console.log(port);
                    totByte += parseInt(port.transmitBytes);
                    totPack += parseInt(port.transmitPackets);
                }
            }
            res.send({
                "bytes"     : totByte,
                "packets"   : totPack
            })
        }
        else {
            res.send("[]");
        }
    })
});

/*

SWITCH SECTION

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

//Group by par
router.get('/switch/list/:min/:max/:group', function(req, res, next) {
	var db = req.db;
	var _min = parseInt(req.params.min);
	var _max = parseInt(req.params.max);
	var _groupby = req.params.group;
	res.setHeader('Content-Type', 'application/json');
	var out = {};
	db.collection('SwitchDevices')
	.find({
		_time: { $gte: _min, $lte: _max }	
	})
	.sort({_time: -1})
	.toArray(function (err, items) {
		items.forEach( function(item, index){
			var t = item[_groupby];
			//console.log(out.t, typeof out.t);
			if(typeof out[t] != "undefined"){
				out[t].push(item);
			}
			else {
				out[t] = [item];
			}
			//console.log(index, item['_time']);
		});
        res.json(out);
    })
	;
	
});
//Group by MAC address
router.get('/switch/list/:min/:max', function(req, res, next) {
	var db = req.db;
	var _min = parseInt(req.params.min);
	var _max = parseInt(req.params.max);
	res.setHeader('Content-Type', 'application/json');
	var out = {};
	db.collection('SwitchDevices')
	.find({
		_time: { $gte: _min, $lte: _max }	
	})
	.sort({_time: -1})
	.toArray(function (err, items) {
		items.forEach( function(item, index){
			var t = item['switchDPID'];
			//console.log(out.t, typeof out.t);
			if(typeof out[t] != "undefined"){
				out[t].push(item);
			}
			else {
				out[t] = [item];
			}
			//console.log(index, item['_time']);
		});
        res.json(out);
    })
	;
});

router.get('/switch/:dpid/:min/:max', function(req, res, next) {
	var db = req.db;
	var _min = parseInt(req.params.min);
	var _max = parseInt(req.params.max);
	var _dpid = req.params.dpid;
	res.setHeader('Content-Type', 'application/json');
	var out = {};
	if(debug){
		var findObj = {
			DPID: _dpid,
			test: __test,
			_time: { $gte: _min, $lte: _max }
		};
	}
	else {
		var findObj = {
			DPID: _dpid,
			_time: { $gte: _min, $lte: _max }
		};
	}
	db.collection('SwitchPortData')
	.find(
		findObj
	)
	.sort({_time: -1})
	//.limit(10)
	.toArray(function (err, items) {
		items.forEach( function(item, index){
			var t = item['_time'];
			if(typeof out[t] != "undefined"){	
				var tmp = out[t];
				tmp.sendByte += parseInt(item.transmitBytes);
				tmp.sendPacket += parseInt(item.transmitPackets);
				tmp.recvByte += parseInt(item.receiveBytes);
				tmp.recvPacket += parseInt(item.receivePackets);
				out[t] = tmp;
			}
			else {
				out[t] = {
					sendByte: parseInt(item.transmitBytes),
					sendPacket: parseInt(item.transmitPackets),
					recvByte: parseInt(item.receiveBytes),
					recvPacket: parseInt(item.receivePackets)
				};
			}
		});
        res.json(out);
    })
	;
	
});

router.get('/switch/flow/:dpid/:min/:max', function(req, res, next) {
	var db = req.db;
	var _min = parseInt(req.params.min);
	var _max = parseInt(req.params.max);
	var _dpid = req.params.dpid;
	res.setHeader('Content-Type', 'application/json');
	var out = {};
	if(debug){
		var findObj = {
			test: __test,
			_time: { $gte: _min, $lte: _max }
		};
	}
	else {
		var findObj = {
			_time: { $gte: _min, $lte: _max }
		};
	}
	var project = {};
	project[_dpid] = 1;
	db.collection('NetInfo')
	.find(
		findObj,
		project
	)
	.sort({_time: -1})
	//.limit(100)
	.toArray(function (err, items) {
		items.forEach( function(item, index){
			var t = item['_time'];
			//console.log(out.t, typeof out.t);
			if(typeof out[t] != "undefined"){
				out[t].push(item);
			}
			else {
				out[t] = [item];
			}
			//console.log(index, item['_time']);
		});
        //res.json(project);
        res.json(items);
    })
	;
});

router.get('/switch/:dpid/info', function(req, res, next){
	var _dpid = req.params.dpid;
	res.setHeader('Content-Type', 'application/json'); 
    request.get({
        url: controller_url + '/wm/core/switch/' + _dpid + '/desc/json', 
        timeout: 1000,
    },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(body);
        }
        else {
            res.send("[]");
        }
    })
});


//Doesn't seems like to working the join!
router.get('/switch/load', function(req, res, next) {
	var db = req.db;
	var _lim = 1000;//req.params.limit;
	res.setHeader('Content-Type', 'application/json');
	mongoJoin
    .query(
      //say we have blog posts and we store comments in a separate collection
      db.collection("SwitchDevices"),
        {}, //query statement
        {}, //fields
        {
            limit: _lim,
            sort: ['_time','desc'] //options
        }
    )
    .join({
        joinCollection: db.collection("SwitchFlowData"),
        //respect the dot notation, multiple keys can be specified in this array
        leftKeys: ["_time"],
        //This is the key of the document in the right hand document
        rightKeyPropertyPaths: ["_time"],
        //This is the new subdocument that will be added to the result document
        newKey: "comments",
        pageSize: 25, //would recommend experimenting, to find the best size
    })
    //Call exec to run the compiled query and catch any errors and results, in the callback
    .exec(function (err, items) {
        console.log(err);
        res.send(items);
    });
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


/*

Prediction Section

*/

router.get('/prediction/graph/json', function(req, res, next) {
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

////////////////////////////////////////////////////////////////
//////////////		OLD 	///////////////////////////////////
///////////////////////////////////////////////////////////////

/*
 * GET DataTime Info.
 */
router.get('/datatime/:limit', function(req, res) {
    var db = req.db;
    var lim = parseInt(req.params.limit);
    db.collection('DataTime').find({test: __test}).sort({_time: -1}).limit( lim ).toArray(function (err, items) {
        res.json(items);
    });
});

router.get('/switch/:time', function( req, res ){
	var db = req.db;
    var time = req.params.time;
    time = parseInt(time);
    db.collection('SwitchDevices').find({_time : time}).toArray(function (err, items) {
        res.json(items);
    });
});

router.get('/switch/:time/:dpid/flow', function( req, res ){
    var db = req.db;
    var time = parseInt(req.params.time);
    var ID = req.params.dpid;
    db.collection('SwitchFlowData').find({_time : time, DPID : ID, test: __test}).toArray(function (err, items) {
        res.json(items);
    });
});

router.get('/switch/:dpid/ports/', function( req, res ){
    var db = req.db;
    var ID = req.params.dpid;
    var ports = [];
    var r = db.collection('SwitchPortData').group(["portNumber"],{"DPID" : ID}, {}, 'function(curr,result){}', true, function(err, results) {
        res.json(results);
    });
    

});


router.get('/switch/:dpid/port/:p', function( req, res ){
    var db = req.db;
    var port = req.params.p;
    var ID = req.params.dpid;
    var lim = 10;
    db.collection('SwitchPortData').find({portNumber : port, DPID : ID}).sort({_time: -1}).limit( lim ).toArray(function (err, items) {
        res.json(items);
    });
});

module.exports = router;
