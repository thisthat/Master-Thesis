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