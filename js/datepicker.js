// global so other files can access (use on line graph page as well)
var endYear;
var endMonth;
var endDay;
var startYear;
var startMonth;
var startDay;
var startDateObj;
var endDateObj;
var farthestBackMonth = 4;
var farthestBackDay = 22;
var farthestBackYear = 2016;


$(document).ready(function(){
  // implementation of custom elements instead of inputs
  	var today = new Date();

  	// get the end date (today) and start date (default to 1 month before)
	endYear = 2016;
	endMonth = 5;
	endDay = 3;
	startYear = endYear;
	startMonth = endMonth - 1;
	startDay = endDay;

	// format month and day to mm/dd
	endMonth = checkFormat(endMonth);
	endDay = checkFormat(endDay);
	startMonth = checkFormat(startMonth);
	startDay = checkFormat(startDay);

	startDateObj = new Date(startYear, (startMonth-1), startDay);
	endDateObj = new Date(endYear, (endMonth-1), endDay);

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
				startDateObj = new Date(startYear, (startMonth-1), startDay);

				getValRange("hour",startDateObj,endDateObj);
				avgKWH();

				if (indexPage)
					redrawMap();
				else if (linePage) {
					normalize_bed();
					deleteSVGs();
					makeGraph();
				}
			}
		}
		$('#dp4').fdatepicker('hide');
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
				endDate = new Date(ev.date);
				$('#endDate').text($('#dp5').data('date'));
				
				changeEndDate(endDate);
				endYear = 2016;

				endDateObj = new Date(endYear, (endMonth-1), endDay);

				getValRange("hour",startDateObj,endDateObj);
				avgKWH();

				if (indexPage)
					redrawMap();
				else if (linePage) {
					normalize_bed();
					deleteSVGs();
					makeGraph();
				}
			}
		}
		$('#dp5').fdatepicker('hide');
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

	if (startDay == 31 && startMonth == 3) {
		startMonth = startDate.getMonth() + 2;
		startMonth = '0' + startMonth;
		startDay = '0' + 1;
	}
	else if (startDay == 30 && startMonth == 4) {
		startMonth = startDate.getMonth() + 2;
		startMonth = '0' + startMonth;
		startDay = '0' + 1;
	}
	else {
		var tempStartDay = startDate.getDate();
		startDay = '0' + (tempStartDay + 1);
	}
}

function changeEndDate(endDate) {
	endYear = endDate.getFullYear();
	endMonth = checkFormat(endDate.getMonth()+1);
	endDay = checkFormat(endDate.getDate());

	if (endDay == 31 && endMonth == 3) {
		endMonth = endDate.getMonth() + 2;
		endDay = 1;
	}
	else if (endDay == 30 && endMonth == 4) {
		endMonth = endDate.getMonth() + 2;
		endDay = 1;
	}
	else {
		var tempEndDay = endDate.getDate();
		endDay = (tempEndDay + 1);
	}
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
	if (newDay == 1) {
		newMonth += 1;
	}

	if (newYear !== 2016) {
		return false;
	}
	if (newMonth < 3 || newMonth > 5) {
		return false;
	}
	if (newMonth == 3 && newDay < farthestBackDay) {
		return false;
	}
	if (newMonth == 5 && newDay > 3)
		return false;
	return true;
}

function fixEndDate() {
	endDay = startDay;
	endMonth = startMonth;
}

function byHoursL() {
	getValRange("hour", startDateObj, endDateObj);
	labelDelim = "hour";
	avgKWH();
	normalize_bed();
	deleteSVGs();
	makeGraph();
}

function byDaysL() {
	getValRange("day", startDateObj, endDateObj);
	labelDelim = "day";
	avgKWH();
	normalize_bed();
	deleteSVGs();
	makeGraph();
}

function byWeeksL() {
	getValRange("week", startDateObj, endDateObj);
	labelDelim = "week";
	avgKWH();
	normalize_bed();
	deleteSVGs();
	makeGraph();
}

function byHours() {
	getValRange("hour", startDateObj, endDateObj);
	labelDelim = "hour";
	avgKWH();
	redrawMap();
	resetScales();
}

function byDays() {
	getValRange("day", startDateObj, endDateObj);
	labelDelim = "day";
	avgKWH();
	redrawMap();
	resetScales();
}

function byWeeks() {
	getValRange("week", startDateObj, endDateObj);
	labelDelim = "week";
	avgKWH();
	redrawMap();
	resetScales();
}