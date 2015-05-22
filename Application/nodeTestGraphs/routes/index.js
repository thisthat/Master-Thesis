var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('app', { title: 'Overview usage' });
});


router.get('/dashboard', function(req, res, next) {
  res.render('dashboard', { title: 'Overview usage' });
});

router.get('/network', function(req, res, next) {
  res.render('network_general', { title: 'Overview usage' });
});

router.get('/network/:dpid/:time', function(req, res, next) {
  var id = req.params.dpid;
  var time = req.params.time;
  res.render('network_switch', { dpid: id, day: time });
});

router.get('/topology', function(req, res, next) {
  res.render('topology', { title: 'Overview usage' });
});

router.get('/other', function(req, res, next) {
  res.render('themeItems', { title: 'Overview usage' });
});

/* Test */
router.get('/dbtest', function(req, res) {
   	var db = req.db;
    var collection = db.get('DataTime');
    collection.find({},{},function(e,docs){
        res.render('showDataTime', {
            "timeList" : docs
        });
    });
});

module.exports = router;
