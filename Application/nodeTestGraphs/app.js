var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var swig  = require('swig');

var isDaemonRunning = false;
var daemonTimer = 5; //In seconds

var controller_url = "http://192.168.56.1:8080/";

//DB
var mongo = require('mongoskin');
var db = mongo.db("mongodb://127.0.0.1:27017/FloodLight", {native_parser:true});

//routers
// Routers -> Interface
// API -> get data from the network
// Graph -> render the Graphs 
var routes = require('./routes/index');
var api = require('./routes/api');
var graph = require('./routes/graph');

var app = express();

// view engine setup
app.engine('html', swig.renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    req.controller_url = controller_url;
    next();
});

app.use('/', routes);
app.use('/api', api);
app.use('/graph', graph);


//Getter and setter of the Daemon Timeout
app.get('/daemon', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  var out = "{ \"timer\" : \"" + daemonTimer + "\", \"isRunning\" : \"" + isDaemonRunning + "\"}";
  res.send(out);
});

app.post('/daemon', function (req, res) {
  var active = String(req.body.active);
  var timer = parseInt(req.body.timer);
  var isAlreadyRunning = isDaemonRunning;
  isDaemonRunning = active == "true";
  daemonTimer = timer;
  res.setHeader('Content-Type', 'application/json');
  var out = "{ \"status\" : \"ok\", \"msg\" : \"\"}";
  res.send(out);
  //Let's start the daemon
  if(isDaemonRunning && !isAlreadyRunning){
    callDaemon();
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  /*res.render('error', {
    message: err.message,
    error: {}
  });*/
});

module.exports = app;

app.listen(8000);
console.log("Server start @ 127.0.0.1:8000");

if(isDaemonRunning){
  callDaemon();
}

function callDaemon(){
  if(isDaemonRunning){
    var python = require('child_process').spawn(
      'python',
      // second argument is array of parameters, with the file of course
      ["../daemon/grab_network_data.py"]
    );
    python.stdout.on('data', function(data){ console.log("[DAEMON] Data acquired"); });
    setTimeout(callDaemon, daemonTimer * 1000);
  }
}
