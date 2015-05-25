/*

CONTROLLER SECTION

*/
router.get('/controller/memory', function(req, res, next) { 
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

router.get('/controller/health', function(req, res, next) {
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

router.get('/controller/uptime', function(req, res, next) {
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

router.get('/controller/summary', function(req, res, next) {
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

router.get('/controller/load', function(req, res, next) {
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