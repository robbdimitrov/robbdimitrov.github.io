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
			    $(this).children().addClass(scrolledClass);
			});
    	};
    } else {
    	if ($header.hasClass(scrolledClass)) {
    		$header.removeClass(scrolledClass);
    		$("#logo").removeClass(scrolledClass);
    		$("#menu_button").removeClass(scrolledClass);

	        $("#menu").children().each(function () {
			    $(this).children().removeClass(scrolledClass);
			});
    	};
    }
});

$("#menu_button").click(function (event) {
    var $dropdownMenu = $("#dropdown");
    
    $dropdownMenu.slideToggle(200);

    event.stopPropagation();
	event.preventDefault();
});

$("body").click(function (event) {
    var $dropdownMenu = $("#dropdown");

    if ($dropdownMenu.is(":visible")) {
        $dropdownMenu.slideUp(200);
        event.preventDefault();
    }
});
