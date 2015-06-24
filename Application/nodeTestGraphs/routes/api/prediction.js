var express = require('express');
var router = express.Router();
var request = require('request');

var controller_url = "http://192.168.56.1:8080/";

var debug = false;
var __test = "full_00";

router.get('/graph/json', function(req, res, next) {
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

router.get('/:dpid/info', function(req, res, next) {
	res.setHeader('Content-Type', 'application/json');
  	var _dpid = req.params.dpid;
    request({
        url: controller_url + 'wm/controller/prediction/' + _dpid + '/json', 
        timeout: 2000, //after 12s the controller stop to wait the switches and answer
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(body)
        }
        else {
            res.send("[]");
        }
    })
});

router.get('/:dpid/dataset', function(req, res, next){
	var _dpid = req.params.dpid;
	res.setHeader('Content-Type', 'application/json'); 
    request.get({
        url: controller_url + '/wm/controller/prediction/' + _dpid + '/dataset', 
        timeout: 1000,
    },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(body);
        }
        else {
            res.send("{}");
        }
    })
});

router.get('/:dpid/reload', function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var _dpid = req.params.dpid;
    request({
        url: controller_url + 'wm/controller/prediction/' + _dpid + '/reload', 
        timeout: 2000, //after 12s the controller stop to wait the switches and answer
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(body)
        }
        else {
            res.send("[]");
        }
    })
});

router.get('/:dpid/:model/reload', function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var _dpid = req.params.dpid;
    var _model = req.params.model;
    var post = {
        index : _model
    };
    console.log("Send " + _model);
    request({
        method: 'POST',
        url: controller_url + 'wm/controller/prediction/' + _dpid + '/reload', 
        form: JSON.stringify(post),
        timeout: 2000, //after 12s the controller stop to wait the switches and answer
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(body)
        }
        else {
            res.send("[]");
        }
    })
});

router.get('/timeout', function(req, res, next) {
	res.setHeader('Content-Type', 'application/json');
  	var _dpid = req.params.dpid;
    request({
        url: controller_url + 'wm/controller/topology/timeout', 
        timeout: 2000, //after 12s the controller stop to wait the switches and answer
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(body)
        }
        else {
            res.send("[]");
        }
    })
});

router.post('/timeout', function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var time = req.body.time;
    var post = {
        "time" : time
    };
    request({
        method: 'POST',
        url: controller_url + 'wm/controller/topology/timeout', 
        timeout: 2000, 
        form: JSON.stringify(post)
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(body)
        }
        else {
            res.send("[]");
        }
    })
});

router.post('/:dpid/dataset', function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var _dpid = req.params.dpid;
    var post = req.body.obj;
    console.log(post);
    request({
        method: 'POST',
        url: controller_url + '/wm/controller/prediction/' + _dpid + '/dataset', 
        timeout: 2000, 
        form: post
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(body)
        }
        else {
            res.send("[]");
        }
    })
});


router.get('/:dpid/execute', function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var _dpid = req.params.dpid;
    request({
        url: controller_url + '/wm/controller/prediction/' + _dpid + '/class/execute', 
        timeout: 10000
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(body)
        }
        else {
            res.send("[]");
        }
    })
});
router.get('/:dpid/execute/index', function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var _dpid = req.params.dpid;
    request({
        url: controller_url + '/wm/controller/prediction/' + _dpid + '/index/execute', 
        timeout: 10000
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

