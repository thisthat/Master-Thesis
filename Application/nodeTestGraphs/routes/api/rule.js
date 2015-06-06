var express = require('express');
var router = express.Router();
var request = require('request');
var controller_url = "http://192.168.56.1:8080/";

//Get the lists of rules
router.get('/', function(req, res){
	res.setHeader('Content-Type', 'application/json');
	var db = req.db;
	db.collection('Rules').find().toArray(function (err, items) {
       	res.json(items);
    });
});

//Add a rule
router.post('/create', function(req, res, next){
	res.setHeader('Content-Type', 'application/json');
	var name = req.body.name;
	var sw   = req.body.sw;
	var pri  = req.body.pri;
	var inPt = req.body.inPt;
	var act  = req.body.act;
	var db = req.db;
	var doc =
	{ 
		name : name,
		sw   : sw,
		pri  : pri,
		inPt : inPt,
		act  : act,
		createAt: parseInt(new Date().getTime() / 1000)
	};
	db.collection('Rules').save(doc,function(err, records) {
		if (err) throw res.send("");
		res.send("{ \"status\" : \"ok\" }");
	});
	
});

//Get a rule
router.get('/:id', function(req, res){
	res.setHeader('Content-Type', 'application/json');
	var nm = req.params.id;
	var db = req.db;
	db.collection('Rules').find({name : nm}).toArray(function (err, items) {
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
	var name = req.params.id;
	db.collection('Rules').remove({name : name},function(err, numberOfRemovedDocs) {
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