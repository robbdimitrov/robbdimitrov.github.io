/**
 * script.js
 *
 * Robert Dimitrov
 *
 * Copyright (c) 2013 Robert Dimitrov
 */

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
    }
});
