/* ---------- IE8 list style hack (:nth-child(odd)) ---------- */

jQuery(document).ready(function($){
	
	if($('.messagesList').width()) {
		
		if(jQuery.browser.version.substring(0, 2) == "8.") {

			$('ul.messagesList li:nth-child(2n+1)').addClass('odd');
			
		}
		
	}
	
});	


function initTemplate(){
	/* ---------- Skill Bars ---------- */
	$(".meter > span").each(function() {
		
		var getColor = $(this).parent().css('borderTopColor');
				
		$(this).css('background',getColor);
		
		$(this)
		.data("origWidth", $(this).width())
		.width(0)
		.animate({
			width: $(this).data("origWidth")
		}, 3000);
	});
	
	/* ---------- Disable moving to top ---------- */
	$('a[href="#"][data-top!=true]').click(function(e){
		e.preventDefault();
	});
	/* ---------- Uniform ---------- */
	$("input:checkbox, input:radio, input:file").not('[data-no-uniform="true"],#uniform-is-ajax').uniform();

	/* ---------- Choosen ---------- */
	$('[data-rel="chosen"],[rel="chosen"]').chosen();

	/* ---------- Tabs ---------- */
	$('#myTab a:first').tab('show');
	$('#myTab a').click(function (e) {
	  e.preventDefault();
	  $(this).tab('show');
	});

	/* ---------- Makes elements soratble, elements that sort need to have id attribute to save the result ---------- */
	$('.sortable').sortable({
		revert:true,
		cancel:'.btn,.box-content,.nav-header',
		update:function(event,ui){
			//line below gives the ids of elements, you can make ajax call here to save it to the database
			//console.log($(this).sortable('toArray'));
		}
	});

	/* ---------- Tooltip ---------- */
	$('[rel="tooltip"],[data-rel="tooltip"]').tooltip({"placement":"bottom",delay: { show: 400, hide: 200 }});

	/* ---------- Popover ---------- */
	$('[rel="popover"],[data-rel="popover"]').popover();

	/* ---------- Star Rating ---------- */
	$('.raty').raty({
		score : 4 //default stars
	});

	/* ---------- Fullscreen ---------- */
	$('#toggle-fullscreen').button().click(function () {
		var button = $(this), root = document.documentElement;
		if (!button.hasClass('active')) {
			$('#thumbnails').addClass('modal-fullscreen');
			if (root.webkitRequestFullScreen) {
				root.webkitRequestFullScreen(
					window.Element.ALLOW_KEYBOARD_INPUT
				);
			} else if (root.mozRequestFullScreen) {
				root.mozRequestFullScreen();
			}
		} else {
			$('#thumbnails').removeClass('modal-fullscreen');
			(document.webkitCancelFullScreen ||
				document.mozCancelFullScreen ||
				$.noop).apply(document);
		}
	});

	/* ---------- Datable ---------- */
	$('.datatable').dataTable({
			"sDom": "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span12'i><'span12 center'p>>",
			"sPaginationType": "bootstrap",
			"oLanguage": {
			"sLengthMenu": "_MENU_ records per page"
			}
		} );
	$('.btn-close').click(function(e){
		e.preventDefault();
		$(this).parent().parent().parent().fadeOut();
	});
	$('.btn-minimize').click(function(e){
		e.preventDefault();
		var $target = $(this).parent().parent().next('.box-content');
		if($target.is(':visible')) $('i',$(this)).removeClass('chevron-up').addClass('chevron-down');
		else 					   $('i',$(this)).removeClass('chevron-down').addClass('chevron-up');
		$target.slideToggle();
	});
	$('.btn-setting').click(function(e){
		e.preventDefault();
		$('#myModal').modal('show');
	});
	
	
	/* ---------- Progress  ---------- */

		$(".simpleProgress").progressbar({
			value: 89
		});

		$(".progressAnimate").progressbar({
			value: 1,
			create: function() {
				$(".progressAnimate .ui-progressbar-value").animate({"width":"100%"},{
					duration: 10000,
					step: function(now){
						$(".progressAnimateValue").html(parseInt(now)+"%");
					},
					easing: "linear"
				})
			}
		});

		$(".progressUploadAnimate").progressbar({
			value: 1,
			create: function() {
				$(".progressUploadAnimate .ui-progressbar-value").animate({"width":"100%"},{
					duration: 20000,
					easing: 'linear',
					step: function(now){
						$(".progressUploadAnimateValue").html(parseInt(now*40.96)+" Gb");
					},
					complete: function(){
						$(".progressUploadAnimate + .field_notice").html("<span class='must'>Upload Finished</span>");
					} 
				})
			}
		});
		
		if($(".taskProgress")) {
		
			$(".taskProgress").each(function(){
				
				var endValue = parseInt($(this).html());
												
				$(this).progressbar({
					value: endValue
				});
				
				$(this).parent().find(".percent").html(endValue + "%");
				
			});
		
		}
		
		if($(".progressBarValue")) {
		
			$(".progressBarValue").each(function(){
				
				var endValueHTML = $(this).find(".progressCustomValueVal").html();
				
				var endValue = parseInt(endValueHTML);
												
				$(this).find(".progressCustomValue").progressbar({
					
					value: 1,
					create: function() {
						$(this).find(".ui-progressbar-value").animate({"width": endValue + "%"},{
							duration: 5000,
							step: function(now){
																
								$(this).parent().parent().parent().find(".progressCustomValueVal").html(parseInt(now)+"%");
							},
							easing: "linear"
						})
					}
				});
				
			});
		
		}
		init_masonry();
		sparkline_charts();
}
function retina(){
	
	retinaMode = (window.devicePixelRatio > 1);
	
	return retinaMode;
	
}
function init_masonry(){
    var $container = $('.masonry-gallery');

    var gutter = 6;
    var min_width = 250;
    $container.imagesLoaded( function(){
        $container.masonry({
            itemSelector : '.masonry-thumb',
            gutterWidth: gutter,
            isAnimated: true,
              columnWidth: function( containerWidth ) {
                var num_of_boxes = (containerWidth/min_width | 0);

                var box_width = (((containerWidth - (num_of_boxes-1)*gutter)/num_of_boxes) | 0) ;

                if (containerWidth < min_width) {
                    box_width = containerWidth;
                }

                $('.masonry-thumb').width(box_width);

                return box_width;
              }
        });
    });
}
function sparkline_charts() {
	
	//generate random number for charts
	randNum = function(){
		//return Math.floor(Math.random()*101);
		return (Math.floor( Math.random()* (1+40-20) ) ) + 20;
	}

	var chartColours = ['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff'];

	//sparklines (making loop with random data for all 7 sparkline)
	i=1;
	for (i=1; i<9; i++) {
	 	var data = [[1, 3+randNum()], [2, 5+randNum()], [3, 8+randNum()], [4, 11+randNum()],[5, 14+randNum()],[6, 17+randNum()],[7, 20+randNum()], [8, 15+randNum()], [9, 18+randNum()], [10, 22+randNum()]];
	 	placeholder = '.sparkLineStats' + i;
		
		if (retina()) {
			
			$(placeholder).sparkline(data, {
				width: 160,//Width of the chart - Defaults to 'auto' - May be any valid css width - 1.5em, 20px, etc (using a number without a unit specifier won't do what you want) - This option does nothing for bar and tristate chars (see barWidth)
				height: 80,//Height of the chart - Defaults to 'auto' (line height of the containing tag)
				lineColor: '#ffffff',//Used by line and discrete charts to specify the colour of the line drawn as a CSS values string
				fillColor: 'rgba(255,255,255,0.2)',//Specify the colour used to fill the area under the graph as a CSS value. Set to false to disable fill
				spotColor: '#ffffff',//The CSS colour of the final value marker. Set to false or an empty string to hide it
				maxSpotColor: '#ffffff',//The CSS colour of the marker displayed for the maximum value. Set to false or an empty string to hide it
				minSpotColor: '#ffffff',//The CSS colour of the marker displayed for the mimum value. Set to false or an empty string to hide it
				spotRadius: 2,//Radius of all spot markers, In pixels (default: 1.5) - Integer
				lineWidth: 1//In pixels (default: 1) - Integer
			});
			
			$(placeholder).css('zoom',0.5);
			
		} else {
			
			if($.browser.msie  && parseInt($.browser.version, 10) === 8) {
				
				$(placeholder).sparkline(data, {
					width: 80,//Width of the chart - Defaults to 'auto' - May be any valid css width - 1.5em, 20px, etc (using a number without a unit specifier won't do what you want) - This option does nothing for bar and tristate chars (see barWidth)
					height: 40,//Height of the chart - Defaults to 'auto' (line height of the containing tag)
					lineColor: '#ffffff',//Used by line and discrete charts to specify the colour of the line drawn as a CSS values string
					fillColor: '#ffffff',//Specify the colour used to fill the area under the graph as a CSS value. Set to false to disable fill
					spotColor: '#ffffff',//The CSS colour of the final value marker. Set to false or an empty string to hide it
					maxSpotColor: '#ffffff',//The CSS colour of the marker displayed for the maximum value. Set to false or an empty string to hide it
					minSpotColor: '#ffffff',//The CSS colour of the marker displayed for the mimum value. Set to false or an empty string to hide it
					spotRadius: 2,//Radius of all spot markers, In pixels (default: 1.5) - Integer
					lineWidth: 1//In pixels (default: 1) - Integer
				});
				
			} else {
				
				$(placeholder).sparkline(data, {
					width: 80,//Width of the chart - Defaults to 'auto' - May be any valid css width - 1.5em, 20px, etc (using a number without a unit specifier won't do what you want) - This option does nothing for bar and tristate chars (see barWidth)
					height: 40,//Height of the chart - Defaults to 'auto' (line height of the containing tag)
					lineColor: '#ffffff',//Used by line and discrete charts to specify the colour of the line drawn as a CSS values string
					fillColor: 'rgba(255,255,255,0.2)',//Specify the colour used to fill the area under the graph as a CSS value. Set to false to disable fill
					spotColor: '#ffffff',//The CSS colour of the final value marker. Set to false or an empty string to hide it
					maxSpotColor: '#ffffff',//The CSS colour of the marker displayed for the maximum value. Set to false or an empty string to hide it
					minSpotColor: '#ffffff',//The CSS colour of the marker displayed for the mimum value. Set to false or an empty string to hide it
					spotRadius: 2,//Radius of all spot markers, In pixels (default: 1.5) - Integer
					lineWidth: 1//In pixels (default: 1) - Integer
				});
				
			}
			
		}
	
	}
	
	if($(".boxchart")) {
		
		if (retina()) {
			
			$(".boxchart").sparkline('html', {
			    type: 'bar',
			    height: '120', // Double pixel number for retina display
				barWidth: '8', // Double pixel number for retina display
				barSpacing: '2', // Double pixel number for retina display
			    barColor: '#ffffff',
			    negBarColor: '#eeeeee'}
			);
			
			$(".boxchart").css('zoom',0.5);
			
		} else {
			
			$(".boxchart").sparkline('html', {
			    type: 'bar',
			    height: '60',
				barWidth: '4',
				barSpacing: '1',
			    barColor: '#ffffff',
			    negBarColor: '#eeeeee'}
			);
			
		}		
		
	}
	console.log("Fine");
		
}

$(document).ready(function(){
	initTemplate();

	$(".whiteCircle").knob({
        'min':0,
        'max':100,
        'readOnly': true,
        'width': 120,
        'height': 120,
		'bgColor': 'rgba(255,255,255,0.5)',
        'fgColor': 'rgba(255,255,255,0.9)',
        'dynamicDraw': true,
        'thickness': 0.2,
        'tickColorizeValues': true
    });
	$(".circleStatsItemBox").each(function(){
		
		var value = $(this).find(".value > .number").html();
		var unit = $(this).find(".value > .unit").html();
		var percent = $(this).find("input").val()/100;
		
		countSpeed = 2300*percent;
		
		endValue = value*percent;
		
		$(this).find(".count > .unit").html(unit);
		$(this).find(".count > .number").countTo({
			
			from: 0,
		    to: endValue,
		    speed: countSpeed,
		    refreshInterval: 500
		
		});
		
		//$(this).find(".count").html(value*percent + unit);
		
	});
})