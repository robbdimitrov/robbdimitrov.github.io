/**
 * script.js
 *
 * Robert Dimitrov
 *
 * Copyright (c) 2013 Robert Dimitrov
 */

$(window).scroll(function() {
	var $header = $("header");
	var scrolledClass = "scrolled";

    if ($(window).scrollTop() >= 15) {
    	if (!$header.hasClass(scrolledClass)) {
    		$header.addClass(scrolledClass);
    		$("#logo").addClass(scrolledClass);
    		$("#menu_button").addClass(scrolledClass);

	        $("#menu").children().each(function () {
			    $(this).addClass(scrolledClass);
			});
    	};
    } else {
    	if ($header.hasClass(scrolledClass)) {
    		$header.removeClass(scrolledClass);
    		$("#logo").removeClass(scrolledClass);
    		$("#menu_button").removeClass(scrolledClass);

	        $("#menu").children().each(function () {
			    $(this).removeClass(scrolledClass);
			});
    	};
    }
});

$("#menu_button").click(function (event) {
	event.preventDefault();
});
