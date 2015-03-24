var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Overview usage' });
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
