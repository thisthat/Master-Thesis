// Switch data built with REST API
var switchData = [];
var switchAddress = [];
var lastTime = [];
var chart;
var chart_switch;
var limit = 30;

// DOM Ready =============================================================
$(document).ready(function() {
    loadGraph();
    perSwitchGraph();
    //reDrawGraphSwitch("00:00:00:00:00:00:00:02");
    test();
});


function loadGraph(){
    init();
    initGraph();
    getLastTime();
    finish();
}

//Init
function init(){
    switchData = [];
    switchAddress = [];
    lastTime = [];
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

function finish(){
    $.ajaxSetup({
        async: true
    });
    $("#loading_graph_switchByte").hide();
}


// Functions =============================================================


function initGraph(){
    Highcharts.setOptions({
        global: {
            useUTC: false
        }
    });

    chart = $('#graphDiv').highcharts({
        chart: {
            zoomType: 'x',
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
            valueSuffix: ' B',
            crosshairs: true,
            shared: true         
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
                pointInterval: 600000, // one minute
                pointStart: Date.UTC(2009, 9, 6, 0, 0, 0) //Random point
            },
            series: {
                cursor: 'pointer',
                events: {
                    click: function (event) {
                        reDrawGraphSwitch(this.name);
                    }
                }
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

function transformData(){
    //console.log(switchAddress,lastTime);
    
    var dataPoint = [];
    for(j = 0; j < switchAddress.length; j++){
        var address = switchAddress[j];
        var serie = [];
        var prev = 0;
        for(i = lastTime.length - 1; i >= 0; i--){
            var url = '/api/switch/' + lastTime[i] + "/" + address + "/flow";
            var byte = 0;
            
            $.getJSON( url , function( data ) {
                $.each(data, function(){ 
                    byte += parseInt(this.byteCount);
                });
                //Skip the first             
                if(i != lastTime.length - 1)
                    serie.push({y: Math.max(byte-prev,0), x: lastTime[i] * 1000});

                prev = byte;
            });
        }
        chart.addSeries({name : address, data: serie, pointStart: lastTime[lastTime.length - 1] * 1000});
    }    
}
//Test live update
function test(j){
    //return;
    if(typeof j == "undefined")
        j = 1;
    var time = (lastTime[0] + 60*j) * 1000; 
    //console.log(time,lastTime[0]);
    for(i = 0; i < chart.series.length; i++){
        if(i==2)
            chart.series[i].addPoint({x:time, y:14000},true,true);
        else 
            chart.series[i].addPoint({x:time, y:10000*Math.random()},true,true);
    }
    setTimeout(test,3000, j+1);
}

function reDrawGraphSwitch(_switch){
    chart_switch.setTitle({text: "Flow per Switch"},{text: _switch});
    var url = "api/switch/" + _switch + "/ports";

    $.ajaxSetup({
        async: false
    });
    while(chart_switch.series.length > 0)
        chart_switch.series[0].remove(true);
    $.getJSON( url, function( data ) {
        $.each(data, function(){
            var serie = [];
            var port = this.portNumber;
            url = "api/switch/" + _switch + "/port/" + port;
            $.getJSON( url, function( data ) { 
                $.each(data, function(){
                    var value = parseInt(this.transmitBytes);
                    var time = parseInt(this._time);
                    console.log(time);
                    serie.push({y: value, x: time*1000});
                });
            });
            console.log("_________FINISH_______________");
            chart_switch.addSeries({name : port, data: serie.reverse()});
        });

    });

    $.ajaxSetup({
        async: true
    });
}

function perSwitchGraph(){
    chart_switch = $('#graphDivSwitchFlow').highcharts({
        chart: {
            type: 'spline'
        },
        title: {
            text: 'Flow per Switch'
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
                pointInterval: 60000, // one hour
                pointStart: Date.UTC(2009, 9, 6, 0, 0, 0)
            }
        },
        navigation: {
            menuItemStyle: {
                fontSize: '10px'
            }
        }
    }).highcharts();
}