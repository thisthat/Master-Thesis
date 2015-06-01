var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var swig  = require('swig');

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
    next();
});

app.use('/', routes);
app.use('/api', api);
app.use('/graph', graph);

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

/*
callDaemon();
function callDaemon(){
  var python = require('child_process').spawn(
     'python',
     // second argument is array of parameters, e.g.:
     ["../echo.py"]
     );
  var output = "";
  python.stdout.on('data', function(data){ output += data });
  console.log(output);
  setTimeout(callDaemon, 500);
}
*/