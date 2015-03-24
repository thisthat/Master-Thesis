// Switch data built with REST API
var switchData = [];
var switchAddress = [];
var lastTime = [];
var chart;

var limit = 30;

// DOM Ready =============================================================
$(document).ready(function() {
    init();
    testGraph();
    getLastTime();
});


//Init
function init(){
    //Only Sync ajax call
    $.ajaxSetup({
        async: false
    });
    //Extend prototype of Arrays

    // check if an element exists in array using a comparer function
    // comparer : function(currentElement)
    Array.prototype.inArray = function(comparer) { 
        for(var i=0; i < this.length; i++) { 
            if(comparer(this[i])) return true; 
        }
        return false; 
    }; 

    // adds an element to the array if it does not already exist using a comparer 
    // function
    Array.prototype.pushIfNotExist = function(element, comparer) { 
        if (!this.inArray(comparer)) {
            this.push(element);
        }
    }; 
}


// Functions =============================================================


function testGraph(){
    Highcharts.setOptions({
        global: {
            useUTC: false
        }
    });

    chart = $('#graphdiv').highcharts({
        chart: {
            type: 'spline'
        },
        title: {
            text: 'Switches Traffic'
        },
        xAxis: {
            type: 'datetime',
            labels: {
                overflow: 'justify'
            }
        },
        yAxis: {
            title: {
                text: 'Bytes [B]'
            },
            min: 0,
            minorGridLineWidth: 0,
            gridLineWidth: 0,
            alternateGridColor: null
        },
        tooltip: {
            valueSuffix: ' B'
        },
        plotOptions: {
            spline: {
                lineWidth: 4,
                states: {
                    hover: {
                        lineWidth: 5
                    }
                },
                marker: {
                    enabled: true
                },
                pointInterval: 60000, // one minute
                pointStart: Date.UTC(2009, 9, 6, 0, 0, 0) //Random point
            }
        }
    }).highcharts();
}

//Get last time info of API data collect
function getLastTime() {

    // jQuery AJAX call for JSON
    $.getJSON( '/api/DataTime/' + limit, function( data ) {
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            var time = this._time;
            lastTime.push(time);
            $.getJSON( '/api/switch/' + time, function( data ) {
                nSwitch = data.length;
                $.each(data, function(){
                    var dpid = this.switchDPID;
                    switchAddress.pushIfNotExist(dpid, function(e){ return dpid == e});
                });

            });
        });

    });
    transformData();
};

function getSwitchInfo(time, dpid){
    var url = '/api/switch/' + time + "/" + dpid;
    var eventData = [];
    $.getJSON( url + '/flow', function( data ) {
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            var info = {
                _time   : time,
                _DPID   : dpid,
                _Byte   : this.byteCount,
                _Packet : this.packetCount,
                _SecUp  : this.durationSeconds
            };
            switchData.push(info);
        });
    });
}

function transformData(){
    //console.log(switchAddress,lastTime);
    
    var dataPoint = [];
    for(j = 0; j < switchAddress.length; j++){
        var address = switchAddress[j];
        var serie = [];
        for(i = lastTime.length - 1; i >= 0; i--){
            var url = '/api/switch/' + lastTime[i] + "/" + address + "/flow";
            var byte = 0;
            $.getJSON( url , function( data ) {
                $.each(data, function(){ 
                    byte += parseInt(this.byteCount);
                });
                serie.push(byte);
            });
        }
        chart.addSeries({name : address, data: serie, pointStart: lastTime[lastTime.length - 1] * 1000});

    }    
}