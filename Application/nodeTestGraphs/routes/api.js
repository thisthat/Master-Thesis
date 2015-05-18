var express = require('express');
var router = express.Router();
var request = require('request');
var MJ = require("mongo-fast-join"),
    mongoJoin = new MJ();
var controller_url = "http://172.16.149.134:8080/";

var debug = true;
var __test = "full_0";

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
        timeout: 13000, //after 12s the switch don't answer
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

//Doesn't seems like to working the join!
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
        res.json(out);
    })
	;
	
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
		db.collection('DataTime').find({test: __test}).sort({_time: -1}).limit( 1 ).toArray(function (err, items) {
	        res.json(items);
	    });
	}
	else {
		db.collection('DataTime').find().sort({_time: -1}).limit( 1 ).toArray(function (err, items) {
	        res.json(items);
	    });
	}
});
router.get('/time/max', function(req, res, next) {
	var db = req.db;
	res.setHeader('Content-Type', 'application/json');
	if(debug){
		db.collection('DataTime').find({test: __test}).sort({_time: 1}).limit( 1 ).toArray(function (err, items) {
	        res.json(items);
	    });
	}
	else {
		db.collection('DataTime').find().sort({_time: 1}).limit( 1).toArray(function (err, items) {
	        res.json(items);
	    });
	}
});





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
