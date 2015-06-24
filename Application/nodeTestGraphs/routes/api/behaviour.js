var express = require('express');
var router = express.Router();
var request = require('request');

var controller_url = "http://192.168.56.1:8080/";

//Get the lists of rules
router.get('/', function(req, res){
	res.setHeader('Content-Type', 'application/json');
	var db = req.db;
	db.collection('Behaviour').find().toArray(function (err, items) {
       	res.json(items);
    });
});

//Add a rule
router.post('/create', function(req, res, next){
	res.setHeader('Content-Type', 'application/json');
	var sw   = req.body.sw;
	var sym  = req.body.sym;
	var load = req.body.load;
	var rule = req.body.rule;
	var db = req.db;
	var doc =
	{ 
		sw   : sw,
		sym  : sym,
		load : load,
		rule : rule,
		createAt: parseInt(new Date().getTime() / 1000)
	};
	db.collection('Behaviour').save(doc,function(err, records) {
		if (err) res.send("");
		res.send("{ \"status\" : \"ok\" }");
	});
	
});


//Handle Time Behaviour
router.get('/timeout', function(req, res){
	res.setHeader('Content-Type', 'application/json');
  	var _dpid = req.params.dpid;
    var controller_url = req.controller_url;
    request({
        url: controller_url + 'wm/controller/behaviour/time', 
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
        url: controller_url + 'wm/controller/behaviour/time', 
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

//Get a rule
router.get('/:id', function(req, res){
	res.setHeader('Content-Type', 'application/json');
	var nm = require('mongodb').ObjectID(req.params.id);
	var db = req.db;
	db.collection('Behaviour').find({_id : nm}).toArray(function (err, items) {
		if(items.length > 0)
        	res.json(items[0]);
        else 
        	res.json("");
    });
});

//Delete a rule
router.get('/:id/delete', function(req, res){
	res.setHeader('Content-Type', 'application/json');
	var db = req.db;
	var id = require('mongodb').ObjectID(req.params.id);
	db.collection('Behaviour').remove({_id : id},function(err, numberOfRemovedDocs) {
		console.log(err);
        if(err){
        	res.json("");
        }
        else {
        	res.send("{ \"status\" : \"ok\" }");
        }
    });
});



module.exports = router;