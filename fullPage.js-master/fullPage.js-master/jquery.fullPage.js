/**
 * fullPage 1.0
 * https://github.com/alvarotrigo/fullPage.js
 * MIT licensed
 *
 * Copyright (C) 2013 alvarotrigo.com - A project by Alvaro Trigo
 */

(function($) {
	$.fn.fullpage = function(options) {
	
		var that = this;

		// Create some defaults, extending them with any options that were provided
		var options = $.extend({
			"verticalCentered" : true,
			'resize' : true,
			'slidesColor' : [],
			'anchors':["Home","About","Team", "Gallery","Donate","Contact"],
			'scrollingSpeed': 3000,
			'easing': 'easeInQuart',
			'menu': false,
			'navigation': true,
			'navigationPosition': 'left',
			'navigationColor': 'yellow',
			'controlArrowColor': '#fff',
			
			'loopBottom': false,
			'loopTop': false,
			'touchScrolling': true,
			'mouseScrolling': true,
			'fixedElements':'#header, #footer, #fullPage-nav,#qLoverlay',
			'navigationTooltips': ["Home","About","Team", "Gallery","Donate","Contact"],
			//events
			'afterLoad': null
		}, options);


		var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    // Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
var isFirefox = typeof InstallTrigger !== 'undefined';   // Firefox 1.0+
var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
    // At least Safari 3+: "[object HTMLElementConstructor]"
var isChrome = !!window.chrome && !isOpera;              // Chrome 1+
var isIE = /*@cc_on!@*/false || !!document.documentMode; // At least IE6
		var isTablet = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/); 

		var windowsWidtdh = $(window).width();
		var windowsHeight = $(window).height();
		var isMoving = false;
		
		var lastScrolledDestiny;
		
		if(!isTablet || options.touchScrolling){
			$('html, body').css({
				'overflow' : 'hidden',
				'height' : '100%'
			});
		}
		
		if(options.verticalCentered){
			$('.section').addClass('table');
			$('.section').wrapInner('<div class="tableCell" />');
		}

		$('body').wrapInner('<div id="superContainer" />');

		
		//creating the navigation dots 
		if(options.navigation){
			$('#fullpage').prepend('<div id="fullPage-nav"><ul></ul></div>');	
			var nav = $('#fullPage-nav');

			nav.css('color', options.navigationColor);
	
	
			if(options.navigationPosition == 'right'){
				nav.css('right', '17px');
				nav.css('top', '20%')
			}else{
				nav.css('top', '20%')
				nav.css('left', '17px');
			}
		}
		
		$('.section').each(function(index){
			var slides = $(this).find('.slide');
			var numSlides = slides.length;
			
			if(!index){
				$(this).addClass('active');
			}

			$(this).css('height', windowsHeight + 'px');
			
			if(typeof options.slidesColor[index] != 'undefined'){
				$(this).css('background-color', options.slidesColor[index]);
			}	

			if(typeof options.anchors[index] != 'undefined'){			
				$(this).attr('data-anchor', options.anchors[index]);
			}
			
			if(options.navigation){
				var link = '';
				if(options.anchors.length){
					link = options.anchors[index];
				}
				var tooltip = options.navigationTooltips[index];
				console.log("navaigation", options.navigationTooltips);
				

				nav.find('ul').append('<li data-tooltip="' + tooltip + '"><a href="#' + link + '"><span></span></a></li>');
			}
				

			// if there's any slide
			if (numSlides > 0) {
				var sliderWidth = numSlides * 100;
				var slideWidth = 100 / numSlides;

				slides.wrapAll('<div class="slidesContainer" />');
				slides.parent().wrap('<div class="slides" />');

				$(this).find('.slidesContainer').css('width', sliderWidth + '%');
				$(this).find('.slides').after('<div class="controlArrow prev"><img src="lib/images/demo/arrow_left.png"/></div><div class="controlArrow next"><img src="lib/images/demo/arrow_right.png"/></div>');
				
				if(options.slidesNavigation){
					addSlidesNavigation($(this), numSlides);
				}
				
				slides.each(function(index) {
					if(!index){
						$(this).addClass('active');
					}
					
					$(this).css('width', slideWidth + '%');
				});
			}
			

			
		}).promise().done(function(){
			scrollToAnchor();
		});
		
		
		if(options.touchScrolling && isTablet){
			var touchStartY = 0;
			var touchEndY = 0;
		
			/* Detecting touch events 
			
			* As we are changing the top property of the page on scrolling, we can not use the traditional way to detect it.
			* This way, the touchstart and the touch moves shows an small difference between them which is the
			* used one to determine the direction.
			*/
			document.addEventListener('touchmove', function(e){
				//preventing the easing on iOS devices
				e.preventDefault();

				if (!isMoving) { //if theres any #
					touchEndY  = e.touches[0].pageY;
					touchEndX  = e.touches[0].pageX;
					if(touchStartY > touchEndY){
						// moved down
						$.fn.fullpage.moveSlideDown();
				     }else{
				        // moved up
						$.fn.fullpage.moveSlideUp();
				     }
				}
		   
			});
			
			document.addEventListener('touchstart', function(e){
			     touchStartY = e.touches[0].pageY;
			});
		}


		/**
		 * Detecting mousewheel scrolling
		 * 
		 * http://blogs.sitepointstatic.com/examples/tech/mouse-wheel/index.html
		 * http://www.sitepoint.com/html5-javascript-mouse-wheel/
		 */
		if(options.mouseScrolling){
			var sq = {};
			sq = document;
			if (sq.addEventListener){
				sq.addEventListener("mousewheel", MouseWheelHandler(), false);
				sq.addEventListener("DOMMouseScroll", MouseWheelHandler(), false);
			}else{
				sq.attachEvent("onmousewheel", MouseWheelHandler());
			}
		}

		/**
		* Creates a landscape navigation bar with dots for horizontal sliders.
		*/
		function addSlidesNavigation(section, numSlides){
			section.append('<div class="fullPage-slidesNav"><ul></ul></div>');
			var nav = section.find('.fullPage-slidesNav');

			//top or bottom
			nav.addClass(options.slidesNavPosition);

			for(var i=0; i< numSlides; i++){
				nav.find('ul').append('<li><a href="#"><span></span></a></li>');
			}

			//centering it
			nav.css('margin-left', '-' + (nav.width()/2) + 'px');

			nav.find('li').first().find('a').addClass('active');
		}

		function MouseWheelHandler() {

			return function(e) {
				// cross-browser wheel delta
				var e = window.event || e;
				var delta = Math.max(-1, Math.min(1,
						(e.wheelDelta || -e.detail)));

				if (!isMoving) { //if theres any #
					//scrolling down?
					if (delta < 0) {
						
							$.fn.fullpage.moveSlideDown();
					
					}

					//scrolling up?
					else {
						
							$.fn.fullpage.moveSlideUp();
						
					}
				}

				return false;
			}
		}

		$.fn.fullpage.moveSlideUp = function(){
			var prev = $('.section.active').prev('.section');
			
			//looping to the bottom if there's no more sections above
			if(options.loopTop && !prev.length){
				prev = $('.section').last();
			}
			
			if (prev.length > 0 || (!prev.length && options.loopTop)){
				prev.addClass('active').siblings().removeClass('active');
				scrollPage(prev);
			}
		}

		$.fn.fullpage.moveSlideDown = function (){
			var next = $('.section.active').next('.section');
			//looping to the top if there's no more sections below
			if(options.loopBottom && !next.length){
				next = $('.section').first();
			}
	
			if (next.length > 0 || (!next.length && options.loopBottom)){

				next.addClass('active').siblings().removeClass('active');
				scrollPage(next);
			} 
		}
		
		$.fn.fullpage.moveToSlide = function (index){
			var destiny = '';
			
			if(isNaN(index)){
				destiny = $('[data-anchor="'+index+'"]');
			}else{
				destiny = $('.section').eq( (index -1) );
			}

			if (destiny.length > 0) {
				destiny.addClass('active').siblings().removeClass('active');
				scrollPage(destiny);
			}
		}
		
		function transformContainer(translate3d, animated){
			

			$('#superContainer').css(getTransforms(translate3d));
		}

		function transformSlideContainer( props, element){

			element.css(props);
		}
		function getTransforms(translate3d){
			return {
				'-webkit-transform': translate3d,
				'-moz-transform': translate3d,
				'-ms-transform':translate3d,
				'transform': translate3d,
				'transition': "all 1500ms ease",
				'-webkit-backface-visibility': "hidden"
			};
		}

		
		function scrollPage(element) {
			//preventing from activating the MouseWheelHandler event
			//more than once if the page is scrolling
			isMoving = true;
			var otherElem=$("#section3");
			var winheight=$(window).height();
			var winWidth=$(window).width();
			var winny=winheight/2;
			if(typeof element.data('anchor') != 'undefined'){
				location.hash = element.data('anchor');
			}else{
				location.hash = '';
			}
			var slide2=$("#sec-about").height();
			var danceStyle=$("#danceStyleHead").height();
			var header=$("#header").height();
			var footer=$("#footer").height();

	    	console.log("winheight",winheight);
	    	console.log("danceStyle",danceStyle);
	    	console.log("header",header);
	    	console.log("footer",footer);
	    	console.log("windowWidth",winWidth);


	    	$("#danceStyle").mCustomScrollbar({

	    		setHeight:winheight-10-footer-(.15*slide2)-danceStyle, 
	    		scrollButtons:{
	    			enable:true
	    		}
	    	});
	    	$("#grid-gallery").mCustomScrollbar({
	    		setHeight:.85*winheight-40, 
	    		scrollButtons:{
	    			enable:true
	    		}
	    	});
	    	$("#aboutHistory").mCustomScrollbar({
	    		setHeight:.80*winheight, 
	    		scrollButtons:{
	    			enable:true
	    		}
	    	});
	    	$("#sec-gallery").mCustomScrollbar({
	    		
	    		setHeight:winheight-header-footer-(.05*slide2),
	    		setWidth:winWidth,
	    		
	    		mousewheel:{
	    			axis:"x"
	    		},
	    		scrollButtons:{
	    			enable:true
	    		},
	    		axis:"x"
	    	});
	    	$("#mCSB_4_scrollbar_horizontal").css({bottom:0});

			dest = element.position();


			/** IE and Safari incompatability with google grid**/
			if ((element.data('anchor')=="ourteam") && (isFirefox || isChrome)) {
				console.log("Its gallery");
				$(".slideshow").css({"top":dest.top})

			}
			

			
			dtop = dest != null ? dest.top : null;
			
			var currentPage = element.data('anchor');
		
			//call parallax site
			
			//parallaxSite(currentPage, lastScrolledDestiny, dtop);

			var translate3d = 'translate3d(0px, -' + dtop + 'px, 0px)';
			transformContainer(translate3d, true);
			//callback
					console.log("animation started");
					$.isFunction( options.afterLoad ) && options.afterLoad.call( this, anchorLink, (element.index('.section') + 1));
					setTimeout(function(){ isMoving=false; console.log("Animation finished");}, 1200);
				
		
			/**
				$('#superContainer').animate( {top : -dtop},400,'linear',function(){
					//callback
					$.isFunction( options.afterLoad ) && options.afterLoad.call( this, anchorLink, (element.index('.section') + 1));
					setTimeout(function(){ isMoving = false;}, 700);
				});
			
			**/

			
			/*
			
			TweenLite.ticker.fps(70);
			TweenLite.to([$('#superContainer')], 1.5, {top : -dtop, ease:Quad.easeIn, immediateRender:false, onComplete:function(){
					//callback
					$.isFunction( options.afterLoad ) && options.afterLoad.call( this, anchorLink, (element.index('.section') + 1));
					setTimeout(function(){ isMoving = false;}, 700);
				}
			});*/
			
	
			/*
			$('#superContainer').animate({
				top : -dtop
			}, options.scrollingSpeed, options.easing, function() {
				//callback
				$.isFunction( options.afterLoad ) && options.afterLoad.call( this, anchorLink, (element.index('.section') + 1));
				
				setTimeout(function(){
					isMoving = false;	
				}, 700);
			});
			*/
			
			var anchorLink  = element.attr('data-anchor');
			
			//flag to avoid callingn `scrollPage()` twice in case of using anchor links
			lastScrolledDestiny = anchorLink;

			activateMenuElement(anchorLink);
			activateNavDots(anchorLink);

			if(element.data('anchor')=="home"){
				$('#header').css({
  'visibility': "hidden",
  'opacity': 0,
  'transition': "visibility 0s 1s, opacity 1s linear"
});
				$('#footer').css({
  'visibility': "hidden",
  'opacity': 0,
  'transition': "visibility 0s 1s, opacity 1s linear"
});
				//$("#header").fadeOut();
				//$("#footer").fadeOut();
			}
			else{
				$('#header').css({'visibility': "visible",
  'opacity': 1,
  'transition': "opacity 1s linear"});
				$('#footer').css({'visibility': "visible",
  'opacity': 1,
  'transition': "opacity 1s linear",});
				//$("#header").fadeIn();
				//$("#footer").fadeIn();
			}
		}
		
		function scrollToAnchor(){

			//getting the anchor link in the URL and deleting the `#`
			var value =  window.location.hash.replace('#', '');
			
			
			if(value){  //if theres any #
			
				var element = $('[data-anchor="'+value+'"]');
								
				element.addClass('active').siblings().removeClass('active');
				//updating the array positions...
				scrollPage(element);
			}
		}

		//detecting any change on the URL to scroll to the given anchor link
		//(a way to detect back history button as we play with the hashes on the URL)
		$(window).on('hashchange',function(){
			
			var value =  window.location.hash.replace('#', '');
			
			/*in order to call scrollpage() only once for each destination at a time
			It is called twice for each scroll otherwise, as in case of using anchorlinks `hashChange` 
			event is fired on every scroll too.*/
			if(value != lastScrolledDestiny){
				var element = $('[data-anchor="'+value+'"]');
				
				element.addClass('active').siblings().removeClass('active');
				scrollPage(element);
			}
		});
			
		//fixed elements need to be moved out of the plugin container due to problems with CSS3.
			if(options.fixedElements && options.css3){
				$(options.fixedElements).appendTo('body');
			}
		/**
		 * Sliding with arrow keys, both, vertical and horizontal
		 */
		$(document).keydown(function(e) {
			//Moving the mian page with the keyboard arrows
			if (!isMoving) {
				switch (e.which) {
				//up
				case 38:
				case 33:
					$.fn.fullpage.moveSlideUp();
					break;

				//down
				case 40:
				case 34:
					$.fn.fullpage.moveSlideDown();
					break;

				//left
				case 37:
					$('.section.active').find('.controlArrow.prev').trigger('click');
					break;

				//right
				case 39:
					$('.section.active').find('.controlArrow.next').trigger('click');
					break;

				default:
					return; // exit this handler for other keys
				}
			}
		});

		/**
		 * Scrolling horizontally when clicking on the slider controls.
		 */
		$('.section').on('click', '.controlArrow', function() {
			var slides = $(this).closest('.section').find('.slides');
			var slidesContainer = slides.find('.slidesContainer').parent();
			var currentSlide = slides.find('.slide.active');
			var destiny = null;
			var destinyPos = 0;

			currentSlide.removeClass('active');

			if ($(this).hasClass('prev')) {
				destiny = currentSlide.prev('.slide');
			} else {
				destiny = currentSlide.next('.slide');
			}

			//is there a next slide in the secuence?

			if (destiny.length > 0) {
				destinyPos = destiny.position();
			}

			//to the last
			else {
				if ($(this).hasClass('prev')) {
					destiny = currentSlide.siblings(':last');
				} else {
					destiny = currentSlide.siblings(':first');
				}

				destinyPos = destiny.position();
			}

			//var translate3d = 'translate3d(-' + destinyPos.left + 'px, 0px ,0px)';
			//transformSlideContainer({'right':+destinyPos.left +"px",'transition': "all 1000ms ease", '-webkit-backface-visibility': "hidden"},slidesContainer);

			slidesContainer.animate({
				scrollLeft : destinyPos.left
			}, 300);

			destiny.addClass('active');
		});
		$('#dance').on('click', function() {
			var slides = $("#section1").find('.slides');
			var slidesContainer = slides.find('.slidesContainer').parent();
			var currentSlide = slides.find('.slide.active');
			

			if (currentSlide.attr("id")=="slide1"){
			var destiny = null;
			var destinyPos = 0;

			currentSlide.removeClass('active');

			if ($(this).hasClass('prev')) {
				destiny = currentSlide.prev('.slide');
			} else {
				destiny = currentSlide.next('.slide');
			}

			//is there a next slide in the secuence?
			if (destiny.length > 0) {
				destinyPos = destiny.position();
			}

			//to the last
			else {
				if ($(this).hasClass('prev')) {
					destiny = currentSlide.siblings(':last');
				} else {
					destiny = currentSlide.siblings(':first');
				}

				destinyPos = destiny.position();
			}

			slidesContainer.animate({
				scrollLeft : destinyPos.left
			}, 500);

			destiny.addClass('active');}
		});
		$('#history').on('click', function() {
			var slides = $("#section1").find('.slides');
			var slidesContainer = slides.find('.slidesContainer').parent();
			var currentSlide = slides.find('.slide.active');
			

			if (currentSlide.attr("id")=="slide2"){
			var destiny = null;
			var destinyPos = 0;

			currentSlide.removeClass('active');

			if ($(this).hasClass('prev')) {
				destiny = currentSlide.prev('.slide');
			} else {
				destiny = currentSlide.next('.slide');
			}

			//is there a next slide in the secuence?
			if (destiny.length > 0) {
				destinyPos = destiny.position();
			}

			//to the last
			else {
				if ($(this).hasClass('prev')) {
					destiny = currentSlide.siblings(':last');
				} else {
					destiny = currentSlide.siblings(':first');
				}

				destinyPos = destiny.position();
			}

			slidesContainer.animate({
				scrollLeft : destinyPos.left
			}, 500);

			destiny.addClass('active');}
		});
		$('#inTouch').on('click', function() {
			var slides = $("#section5").find('.slides');
			var slidesContainer = slides.find('.slidesContainer').parent();
			var currentSlide = slides.find('.slide.active');
		

			if (currentSlide.attr("id")=="slide2"){
			var destiny = null;
			var destinyPos = 0;

			currentSlide.removeClass('active');

			
			destiny=currentSlide.prev('.slide');
			//is there a next slide in the secuence?
			if (destiny.length > 0) {
				destinyPos = destiny.position();
			}

			//to the last
			else {
				if ($(this).hasClass('prev')) {
					destiny = currentSlide.siblings(':last');
				} else {
					destiny = currentSlide.siblings(':first');
				}

				destinyPos = destiny.position();
			}

			slidesContainer.animate({
				scrollLeft : destinyPos.left
			}, 500);

			destiny.addClass('active');}
			else if (currentSlide.attr("id")=="slide3"){
			var destiny = null;
			var destinyPos = 0;

			currentSlide.removeClass('active');

			destiny=currentSlide.next('.slide');

			//is there a next slide in the secuence?
			if (destiny.length > 0) {
				destinyPos = destiny.position();
			}

			//to the last
			else {
				if ($(this).hasClass('prev')) {
					destiny = currentSlide.siblings(':last');
				} else {
					destiny = currentSlide.siblings(':first');
				}

				destinyPos = destiny.position();
			}

			slidesContainer.animate({
				scrollLeft : destinyPos.left
			}, 500);

			destiny.addClass('active');}
		});
$('#costumeRental').on('click', function() {
			var slides = $("#section5").find('.slides');
			var slidesContainer = slides.find('.slidesContainer').parent();
			var currentSlide = slides.find('.slide.active');
			

			if (currentSlide.attr("id")=="slide1"){
			var destiny = null;
			var destinyPos = 0;

			currentSlide.removeClass('active');

			
			destiny=currentSlide.next('.slide');
			//is there a next slide in the secuence?
			if (destiny.length > 0) {
				destinyPos = destiny.position();
			}

			//to the last
			else {
				if ($(this).hasClass('prev')) {
					destiny = currentSlide.siblings(':last');
				} else {
					destiny = currentSlide.siblings(':first');
				}

				destinyPos = destiny.position();
			}

			slidesContainer.animate({
				scrollLeft : destinyPos.left
			}, 500);

			destiny.addClass('active');}
			else if (currentSlide.attr("id")=="slide3"){
			var destiny = null;
			var destinyPos = 0;

			currentSlide.removeClass('active');

			destiny=currentSlide.prev('.slide');

			//is there a next slide in the secuence?
			if (destiny.length > 0) {
				destinyPos = destiny.position();
			}

			//to the last
			else {
				if ($(this).hasClass('prev')) {
					destiny = currentSlide.siblings(':last');
				} else {
					destiny = currentSlide.siblings(':first');
				}

				destinyPos = destiny.position();
			}

			slidesContainer.animate({
				scrollLeft : destinyPos.left
			}, 500);

			destiny.addClass('active');}
		});
$('#contactFormMenu').on('click', function() {
			var slides = $("#section5").find('.slides');
			var slidesContainer = slides.find('.slidesContainer').parent();
			var currentSlide = slides.find('.slide.active');
			

			if (currentSlide.attr("id")=="slide1"){
			var destiny = null;
			var destinyPos = 0;

			currentSlide.removeClass('active');

			
			destiny=currentSlide.next('.slide');
			destiny=destiny.next('.slide');
			//is there a next slide in the secuence?
			if (destiny.length > 0) {
				destinyPos = destiny.position();
			}

			//to the last
			else {
				if ($(this).hasClass('next')) {
					destiny = currentSlide.siblings(':last');
				} else {
					destiny = currentSlide.siblings(':first');
				}

				destinyPos = destiny.position();
			}

			slidesContainer.animate({
				scrollLeft : destinyPos.left
			}, 500);

			destiny.addClass('active');}
			else if (currentSlide.attr("id")=="slide2"){
			var destiny = null;
			var destinyPos = 0;

			currentSlide.removeClass('active');

			destiny=currentSlide.next('.slide');

			//is there a next slide in the secuence?
			if (destiny.length > 0) {
				destinyPos = destiny.position();
			}

			//to the last
			else {
				if ($(this).hasClass('prev')) {
					destiny = currentSlide.siblings(':last');
				} else {
					destiny = currentSlide.siblings(':first');
				}

				destinyPos = destiny.position();
			}

			slidesContainer.animate({
				scrollLeft : destinyPos.left
			}, 500);

			destiny.addClass('active');}
		});


		if (!isTablet) {
			var resizeId;

			//when resizing the site, we adjust the heights of the sections
			$(window).resize(function() {

				//in order to call the functions only when the resize is finished
				//http://stackoverflow.com/questions/4298612/jquery-how-to-call-resize-event-only-once-its-finished-resizing
				clearTimeout(resizeId);
				resizeId = setTimeout(doneResizing, 500);
			});
		}
		
		$(window).bind('resize', function(event) {
			$('#danceStyle').mCustomScrollbar("destroy");
$('#grid-gallery').mCustomScrollbar("destroy");
$('#aboutHistory').mCustomScrollbar("destroy");
$('#sec-gallery').mCustomScrollbar("destroy");
		  doneResizing();
		  setTimeout(doneResizing,100);
		});

		/**
		 * When resizing is finished, we adjust the slides sizes and positions
		 */
		function doneResizing() {
			var windowsWidtdh = $(window).width();
			var windowsHeight = $(window).height();
			console.log("Its done resizing");
			if(windowsHeight > 700){
				var margins = "70px auto 40px auto";
			}else if(windowsHeight <= 700){
				var margins = "0px auto 40px auto";
			}
			var slide2=$("#sec-about").height();
			var danceStyle=$("#danceStyleHead").height();
			var header=$("#header").height();
			var footer=$("#footer").height();
			var winheight=$(window).height();
			var winwidth=$(window).width();

			$(".header #logo, #btnHomeLogo").css({margin: margins});
			

			//text and images resizing
			if (options.resize) {
				resizeMe(windowsHeight, windowsWidtdh);
			}

			$("#danceStyle").mCustomScrollbar({

	    		setHeight:winheight-10-footer-(.15*slide2)-danceStyle, 
	    		scrollButtons:{
	    			enable:true
	    		}
	    	});
	    	$("#grid-gallery").mCustomScrollbar({
	    		setHeight:.85*winheight-40, 
	    		scrollButtons:{
	    			enable:true
	    		}
	    	});
	    	$("#aboutHistory").mCustomScrollbar({
	    		setHeight:.80*winheight, 
	    		scrollButtons:{
	    			enable:true
	    		}
	    	});
	    	$("#sec-gallery").mCustomScrollbar({
	    		
	    		setHeight:winheight-header-footer-(.05*slide2),
	    		setWidth:winwidth,
	    		
	    		mousewheel:{
	    			axis:"x"
	    		},
	    		scrollButtons:{
	    			enable:true
	    		},
	    		axis:"x"
	    	});
	    	$("#mCSB_4_scrollbar_horizontal").css({bottom:0});

				
			$('.section').each(function(){
				$(this).css('height', windowsHeight + 'px');

				//adjusting the position fo the FULL WIDTH slides...
				var slides = $(this).find('.slides');
				if (slides.length > 0) {
					var destinyPos = slides.find('.slide.active').position();

					slides.animate({
						scrollLeft : destinyPos.left
					}, options.scrollingSpeed);
				}
			});

			//adjusting the position for the current section
			var destinyPos = $('.section.active').position();
			scrollToAnchor();
			/**
			
			$('#superContainer').css({top : -destinyPos.top});

			var translate3d = 'translate3d(0px, -' + dtop + 'px, 0px)';
			transformContainer(translate3d, true);
			//callback
					$.isFunction( options.afterLoad ) && options.afterLoad.call( this, anchorLink, (element.index('.section') + 1));
					setTimeout(function(){ isMoving = false;}, 700);
			
			$('#superContainer').animate({
				top : -destinyPos.top
			}, options.scrollingSpeed, options.easing);**/
			
		}

		/**
		 * Resizing of the font size depending on the window size as well as some of the images on the site.
		 */
		function resizeMe(displayHeight, displayWitdh) {
			//Standard height, for which the body font size is correct
			var preferredHeight = 825;
			var windowSize = displayHeight;

			/* Problem to be solved
			
			if (displayHeight < 825) {
				var percentage = (windowSize * 100) / preferredHeight;
				var newFontSize = percentage.toFixed(2);

				$("img").each(function() {
					var newWidth = ((80 * percentage) / 100).toFixed(2);
					$(this).css("width", newWidth + '%');
				});
			} else {
				$("img").each(function() {
					$(this).css("width", '');
				});
			}*/

			if (displayHeight < 825 || displayWitdh < 900) {
				if (displayWitdh < 900) {
					windowSize = displayWitdh;
					preferredHeight = 900;
				}
				var percentage = (windowSize * 100) / preferredHeight
				var newFontSize = percentage.toFixed(2);

				$("body").css("font-size", newFontSize + '%');
			} else {
				$("body").css("font-size", '100%');
			}
		}
		
		/**
		 * Activating the website navigation dots according to the given slide name.
		 */
		function activateNavDots(name){
			if(options.navigation){
				$('#fullPage-nav').find('.active').removeClass('active');	
				$('#fullPage-nav').find('a[href="#' + name + '"]').addClass('active');
			}
		}
				
		/**
		 * Activating the website main menu elements according to the given slide name.
		 */
		function activateMenuElement(name){
			if(options.menu){
				$(options.menu).find('.active').removeClass('active');	
				$(options.menu).find('[data-menuanchor="'+name+'"]').addClass('active');
			}
		}

	};
	
			
			


})(jQuery);

