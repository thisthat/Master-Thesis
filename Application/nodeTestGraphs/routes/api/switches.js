var express = require('express');
var router = express.Router();
var request = require('request');

var controller_url = "http://192.168.56.1:8080/";

var debug = false;
var __test = "full_00";

//Group by par
router.get('/list/:min/:max/:group', function(req, res, next) {
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
router.get('/list/:min/:max', function(req, res, next) {
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

router.get('/:dpid/:min/:max', function(req, res, next) {
	var db = req.db;
	var _min = parseInt(req.params.min);
	var _max = parseInt(req.params.max);
	var _dpid = req.params.dpid;
	res.setHeader('Content-Type', 'application/json');
	var out = {};
	var findObj = {
		DPID: _dpid,
		_time: { $gte: _min, $lte: _max }
	};
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

router.get('/flow/:dpid/:min/:max', function(req, res, next) {
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

router.get('/:dpid/info', function(req, res, next){
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
router.get('/:dpid/port', function(req, res, next){
	var _dpid = req.params.dpid;
	res.setHeader('Content-Type', 'application/json'); 
    request.get({
        url: controller_url + '/wm/core/switch/' + _dpid + '/port/json', 
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

module.exports = router;