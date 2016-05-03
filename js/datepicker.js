// global so other files can access (use on line graph page as well)
var endYear;
var endMonth;
var endDay;
var startYear;
var startMonth;
var startDay;
var farthestBackMonth = 4;
var farthestBackDay = 22;
var farthestBackYear = 2016;


$(document).ready(function(){
  // implementation of custom elements instead of inputs
  	var today = new Date();

  	// get the end date (today) and start date (default to 1 month before)
  	// endYear = today.getFullYear();
	// endMonth = today.getMonth()+1;
	// endDay = today.getDate();
	endYear = 2016;
	endMonth = 5;
	endDay = 1;
	startYear = endYear;
	startMonth = endMonth - 1;
	startDay = endDay;

	// format month and day to mm/dd
	endMonth = checkFormat(endMonth);
	endDay = checkFormat(endDay);
	startMonth = checkFormat(startMonth);
	startDay = checkFormat(startDay);

	// turn dates into strings for use with date picker
	var stringStartDate = startYear + '-' + startMonth + '-' + startDay;
	var stringEndDate = endYear + '-' + endMonth + '-' + endDay;

	// display date to user in date picker
	// var startDate = new Date(startYear, startMonth, startDay);
	// var endDate = new Date(endYear, endMonth, endDay);
	$('#startDate').append(stringStartDate);
	$('#endDate').append(stringEndDate);

	// set start and end dates on change button press to ones calculated
	$('#dp4').fdatepicker('update', stringStartDate);
	$('#dp5').fdatepicker('update', stringEndDate);

	$('#dp4').fdatepicker()
		.on('changeDate', function (ev) {
		var newDate = new Date(ev.date);
		var validDate = checkDate(newDate);
		if (validDate) {
			if (ev.date.valueOf() > endDate.valueOf()) {
				$('#alert').show().find('strong').text('The start date can not be greater then the end date');
			} else {
				$('#alert').hide();
				startDate = new Date(ev.date);
				$('#startDate').text($('#dp4').data('date'));
				changeStartDate(startDate);
				var newEndDate = fixEndDate(startDate);
				changeEndDate(newEndDate);
			}
			$('#dp4').fdatepicker('hide');
		}
	});
	$('#dp5').fdatepicker()
		.on('changeDate', function (ev) {
		var newDate = new Date(ev.date);
		var validDate = checkDate(newDate);
		if (validDate) {
			if (ev.date.valueOf() < startDate.valueOf()) {
				$('#alert').show().find('strong').text('The end date can not be less then the start date');
			} else {
				$('#alert').hide();
				endDate = new Date(changeEndDate(ev.date));
				$('#endDate').text($('#dp5').data('date'));
				// changeEndDate(endDate);
			}
			$('#dp5').fdatepicker('hide');
		}
	});
});

function checkFormat(dateNum) {
	if (dateNum < 10) 
		return ('0' + dateNum);
	else
		return dateNum;
}

function changeStartDate(startDate) {
	startYear = startDate.getFullYear();
	startMonth = checkFormat(startDate.getMonth()+1);
	startDay = checkFormat(startDate.getDate());
	// checkFormat(startMonth);
}

function changeEndDate(endDate) {
	console.log("changeEndDate");
	endYear = endDate.getFullYear();
	endMonth = checkFormat(endDate.getMonth()+1);
	endDay = checkFormat(endDate.getDate());
	// checkFormat(startMonth);
}

function checkDate(newDate) {
	var newDay = newDate.getDate();
	var newMonth = newDate.getMonth()+1;
	var newYear = newDate.getFullYear();

	if (newDay == 31 && newMonth == 3)
		newDay = 1;
	else if (newDay == 30 && newMonth == 4)
		newDay = 1;
	else
		newDay += 1;

	// for some reason first of month gets month number of previous month
	console.log(newDay);
	if (newDay == 1) {
		console.log("chose first");
		newMonth += 1;
	}

	// console.log(newMonth);

	if (newYear !== 2016) {
		console.log("invalid year");
		return false;
	}
	if (newMonth < 4 || newMonth > 5) {
		console.log("invalid month");
		return false;
	}
	if (newMonth == 4 && newDay < farthestBackDay) {
		console.log("invalid day");
		return false;
	}
	return true;
}

function fixEndDate(startDate) {
	var newDay = newDate.getDate();
	var newMonth = newDate.getMonth()+1;
	var newYear = newDate.getFullYear();
}