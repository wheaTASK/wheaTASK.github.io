// contains js for index page
$(document).ready(function() {
	// submenu
	$("#submenu").hide();
	$(".submenuOpen").click(function() {
		$("#submenu").slideDown();
		$(".submenuOpen").hide();
	});
	$(".submenuEnter").click(function() {
		checkboxes();
	});
	$(".submenuClose").click(function() {
		$("#submenu").slideUp("slow", function() {
			$(".submenuOpen").show();
		});
		checkboxes();
	});
})

// checkboxes
function checkboxes() {
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