var express = require('express');
var router = express.Router();
var request = require('request');
var controller_url = "http://192.168.56.1:8080/";

var debug = false;
var __test = "full_00";


router.get('/memory', function(req, res, next) { 
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

router.get('/health', function(req, res, next) {
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

router.get('/uptime', function(req, res, next) {
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

router.get('/summary', function(req, res, next) {
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

router.get('/load', function(req, res, next) {
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


//Mongo DB Controller Info
router.get('/mongoDB', function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    request({
        url: controller_url + 'wm/controller/info/mongoDB', 
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

//Mongo DB Controller Info Store
router.post('/mongoDB', function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var ip = req.body.ip;
    var port = req.body.port;
    var post = {
        "ip" : ip, 
        "port" : port
    };
    request({
        method: 'POST',
        url: controller_url + 'wm/controller/info/mongoDB', 
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

module.exports = router;