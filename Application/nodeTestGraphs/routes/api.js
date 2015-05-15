var express = require('express');
var router = express.Router();
var request = require('request');
var controller_url = "http://192.168.56.1:8080/";

var __test = "_1";

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('API Working');
});


router.get('/controller/memory', function(req, res, next) {  
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
    //Get all switches first, then foreach the stats
    var totByte = 0;
    var totFlow = 0;
    var totPack = 0;
    request({
        url: controller_url + 'wm/core/controller/switches/json', 
        timeout: 1000,
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var switches = JSON.parse(body);
            for(i in switches){
                sw = switches[i];
                var _url = controller_url + 'wm/core/switch/' + sw.switchDPID +'/aggregate/json';
                //For all switch get the data
                request({
                    url: _url, 
                    timeout: 1000,
                }, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        var data = JSON.parse(body);
                        totByte += parseInt(data.aggregate.byteCount);
                        totPack += parseInt(data.aggregate.packetCount);
                        totFlow += parseInt(data.aggregate.flowCount);
                        if(i == switches.length - 1){
                            res.end(JSON.stringify({
                                "bytes"     : totByte,
                                "packets"   : totPack,
                                "flows"     : totFlow 
                            }));
                        }
                    }
                });
            }
        }
        else {
            res.send("[]");
        }
    })
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
