var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/*
 * GET render the graph of traffic per switch.
 */
router.get('/switchByteUsage', function(req, res) {
    res.render('graph/graphSwitch', { title: 'Express Test' });
});

module.exports = router;
