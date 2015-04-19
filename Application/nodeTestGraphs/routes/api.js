var express = require('express');
var router = express.Router();

var __test = "_2";

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
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
