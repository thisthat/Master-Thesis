/* ---------- Page width functions ---------- */

$(function(){
	widthFunctions();
})


$(window).bind("resize", widthFunctions);

function widthFunctions(e) {
	
    var winHeight = $(window).height();
    var winWidth = $(window).width();

	var contentHeight = $("#content").height();

	if (winHeight) {
		var hh = $(".navbar").height();
		var fh = $("footer").height();
		var dh = $(window).height();
		var h = dh - fh - hh - fh;
		
		$("#content").css("min-height", h );
		
	}
	
	if (contentHeight) {
		
		$("#sidebar-left2").css("height",contentHeight);
		
	}
    
	if (winWidth < 980 && winWidth > 767) {
		
		if($("#sidebar-left").hasClass("span2")) {
			
			$("#sidebar-left").removeClass("span2");
			$("#sidebar-left").addClass("span1");
			
		}
		
		if($("#content").hasClass("span10")) {
			
			$("#content").removeClass("span10");
			$("#content").addClass("span11");
			
		}
		
		
		$("a").each(function(){
			
			if($(this).hasClass("quick-button-small span1")) {

				$(this).removeClass("quick-button-small span1");
				$(this).addClass("quick-button span2 changed");
			
			}
			
		});
		
		$(".circleStatsItem, .circleStatsItemBox").each(function() {
			
			var getOnTablet = $(this).parent().attr('onTablet');
			var getOnDesktop = $(this).parent().attr('onDesktop');
			
			if (getOnTablet) {
			
				$(this).parent().removeClass(getOnDesktop);
				$(this).parent().addClass(getOnTablet);
			
			}
			  			
		});
		
		$(".box").each(function(){
			
			var getOnTablet = $(this).attr('onTablet');
			var getOnDesktop = $(this).attr('onDesktop');
			
			if (getOnTablet) {
			
				$(this).removeClass(getOnDesktop);
				$(this).addClass(getOnTablet);
			
			}
			  			
		});
		
		$(".widget").each(function(){
			
			var getOnTablet = $(this).attr('onTablet');
			var getOnDesktop = $(this).attr('onDesktop');
			
			if (getOnTablet) {
			
				$(this).removeClass(getOnDesktop);
				$(this).addClass(getOnTablet);
			
			}
			  			
		});
		
		$(".statbox").each(function(){
			
			var getOnTablet = $(this).attr('onTablet');
			var getOnDesktop = $(this).attr('onDesktop');
			
			if (getOnTablet) {
			
				$(this).removeClass(getOnDesktop);
				$(this).addClass(getOnTablet);
			
			}
			  			
		});
							
	} else {
		
		if($("#sidebar-left").hasClass("span1")) {
			
			$("#sidebar-left").removeClass("span1");
			$("#sidebar-left").addClass("span2");
			
		}
		
		if($("#content").hasClass("span11")) {
			
			$("#content").removeClass("span11");
			$("#content").addClass("span11");
			
		}
		
		$("a").each(function(){
			
			if($(this).hasClass("quick-button span2 changed")) {

				$(this).removeClass("quick-button span2 changed");
				$(this).addClass("quick-button-small span1");
			
			}
			
		});
		
		$(".circleStatsItem, .circleStatsItemBox").each(function() {
			
			var getOnTablet = $(this).parent().attr('onTablet');
			var getOnDesktop = $(this).parent().attr('onDesktop');
			
			if (getOnTablet) {
			
				$(this).parent().removeClass(getOnTablet);
				$(this).parent().addClass(getOnDesktop);
			
			}
			  			
		});
		
		$(".box").each(function(){
			
			var getOnTablet = $(this).attr('onTablet');
			var getOnDesktop = $(this).attr('onDesktop');
			
			if (getOnTablet) {
			
				$(this).removeClass(getOnTablet);
				$(this).addClass(getOnDesktop);
			
			}
			  			
		});
		
		$(".widget").each(function(){
			
			var getOnTablet = $(this).attr('onTablet');
			var getOnDesktop = $(this).attr('onDesktop');
			
			if (getOnTablet) {
			
				$(this).removeClass(getOnTablet);
				$(this).addClass(getOnDesktop);
			
			}
			  			
		});
		
		$(".statbox").each(function(){
			
			var getOnTablet = $(this).attr('onTablet');
			var getOnDesktop = $(this).attr('onDesktop');
			
			if (getOnTablet) {
			
				$(this).removeClass(getOnTablet);
				$(this).addClass(getOnDesktop);
			
			}
			  			
		});
		
	}
	
	if($('.timeline')) {
		
		$('.timeslot').each(function(){
			
			var timeslotHeight = $(this).find('.task').outerHeight();
			
			$(this).css('height',timeslotHeight);
			
		});
		
	}

}