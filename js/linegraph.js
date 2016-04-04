// contains js for index page
$(document).ready(function() {
	// submenu
	$("#submenu").hide();
	$(".submenuOpen").click(function() {
		$("#submenu").slideDown();
		$(".submenuOpen").hide();
	});
	$(".submenuClose").click(function() {
		$("#submenu").slideUp("slow", function() {
			$(".submenuOpen").show();
		});
	});
});

// checkboxes and radio buttons
function checkboxes() {
	if ($("#heatmap").is(':checked')) {
		$("#map").addClass("activegraph");
		$("#map").removeClass("inactivegraph");
		$("#lineGraph").addClass("inactivegraph");
		$("#lineGraph").removeClass("activegraph");
	}
	else {
		$("#lineGraph").addClass("activegraph");
		$("#lineGraph").removeClass("inactivegraph");
		$("#map").addClass("inactivegraph");
		$("#map").removeClass("activegraph");
	}
}

// select all button
function selectall() {
	if ($("#selectAll").is(':checked')) {
		$('input[type=checkbox]').each(function() {
			this.checked = true;
		});
	}
	else if ($("#selectAll").not(':checked')) {
		$('input[type=checkbox]').each(function() {
			this.checked = false;
		});
	}
}

// sort button
function sort() {
	$("#ordered").addClass("tempActiveImage");
	$("#ordered").removeClass("tempInActiveImage");
	$("#unordered").addClass("tempInActiveImage");
	$("#unordered").removeClass("tempActiveImage");
}

// reset button
function reset() {
	$("#unordered").addClass("tempActiveImage");
	$("#unordered").removeClass("tempInActiveImage");
	$("#ordered").addClass("tempInActiveImage");
	$("#ordered").removeClass("tempActiveImage");
}