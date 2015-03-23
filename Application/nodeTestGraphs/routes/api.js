var express = require('express');
var router = express.Router();

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
    db.collection('DataTime').find().sort({_time: -1}).limit( lim ).toArray(function (err, items) {
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
    db.collection('SwitchFlowData').find({_time : time, DPID : ID}).toArray(function (err, items) {
        res.json(items);
    });
});

module.exports = router;
