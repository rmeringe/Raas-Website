// Parallax Elements
var arr = ['home', 'about', 'ourteam', 'gallery', 'donate', 'contact'];


function parallaxSite(cPage, oPage, dtop){
	console.log(cPage+" - "+oPage+" - "+dtop);
	
	var wW = $(window).width();
	var wH = $(window).height();
	
	console.log(wW+" x "+wH);
	if(wH > 700){
		var margins = "70px auto 40px auto";
	}else if(wH <= 700){
		var margins = "0px auto 40px auto";
	}
	
	
	/* anim header */

		//TweenMax.to([$("#header ")], 1.5, {css:{margin: "0px auto 20px auto", width: 174, height:100}, transformOrigin:"center center",ease:Power1.easeOut});
		//TweenMax.to([$("#section0 ")], 1, {css:{opacity: 0},ease:Power1.easeOut});				
	
	/**/
	
	moveElements(cPage);
}

function moveElements(cPage){
	console.log("moveElements called")
	var idImg="";
	var element;
	
	var cPos = getPosInArray(arr, cPage);
	var prevPos = cPos-1;
	var nextPos = cPos+1;
	
	console.log(arr[prevPos]+" "+arr[cPos]+" "+arr[nextPos]);
	
	// prev
	if(arr[prevPos]){
		console.log("prev called")
		$("#sec-"+arr[prevPos]+" .plx").each(function() {
			console.log("Goes in here1");
			idImg = $(this).attr("id");
			element = $("#sec-"+arr[prevPos]+" .plx#"+idImg);
			
			//
			TweenLite.to([element], $(this).attr("data-speed"),{css:{top: $(this).attr("data-t")+"%"}, ease:Power1.easeOut});
		});
	}
	
	// current
	$("#sec-"+cPage+" .plx").each(function() {
		console.log("current called")
	
		idImg = $(this).attr("id");
		element = $("#sec-"+cPage+" .plx#"+idImg);

		console.log(element)
		TweenMax.to([element], $(this).attr("data-speed"),{css:{top: $(this).attr("data-b")+"%"}, ease:Power1.easeOut});
	});
	
	// next
	if(arr[nextPos]){
		console.log("next called")
		$("#sec-"+arr[nextPos]+" .plx").each(function() {
			idImg = $(this).attr("id");
			element = $("#sec-"+arr[nextPos]+" .plx#"+idImg);
			
			//
			TweenMax.to([element], $(this).attr("data-speed"),{css:{top: $(this).attr("data-n")+"%"}, ease:Power1.easeOut});
		});
	}
	
	
	
	
}


function getPosInArray(arr, value){
	for(var i=0; i < arr.length ;i++){
		if(value == arr[i]){
			var yearPosInArray = i;
		}
	}
	return yearPosInArray;
}