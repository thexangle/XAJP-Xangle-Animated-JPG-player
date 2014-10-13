$(document).ready(function() {
	

	// Thumbnails Panel (Appears after XX seconds)
	(function(){
		
		// Thumbnails Appearing Function
		jQuery.fn.show_thumbs = function() {
			$(this).delay(2000).fadeIn();
		};		
		
		// Default: Opens Thumbnails
		$("#thumbnails").show_thumbs();
		
		// When Replay button is clicked, the animation is restarted
		$(".btn-replay").click(function(){
			$("#thumbnails").fadeOut().show_thumbs();
			
			// If share-tools is visible then hide it
			if( $("#share-tools").is(":visible") ) {
				$("#share-tools").fadeOut();
			} 
			
		});
	
	})();
	
	
	
	// Overlay Animations on Thumbnails
	$(".embed-thumbs a").hover(
	  function () {
		$(this).find(".more-thumb-overlay").stop().fadeIn();
	  }, 
	  function () {
		$(this).find(".more-thumb-overlay").stop().fadeOut();
	  }
	);

	
	
	// Embed Panel
	$(".btn-embed").click(function(){
		$("#share-tools").fadeToggle();
	});
	
	
	
});