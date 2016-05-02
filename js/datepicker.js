// global so other files can access (use on line graph page as well)
var endYear;
var endMonth;
var endDay;
var startYear;
var startMonth;
var startDay;


$(document).ready(function(){
  // implementation of custom elements instead of inputs
  	var today = new Date();

  	// get the end date (today) and start date (default to 1 month before)
  	endYear = today.getFullYear();
	endMonth = today.getMonth()+1;
	endDay = today.getDate();
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
		if (ev.date.valueOf() > endDate.valueOf()) {
			$('#alert').show().find('strong').text('The start date can not be greater then the end date');
		} else {
			$('#alert').hide();
			startDate = new Date(ev.date);
			$('#startDate').text($('#dp4').data('date'));
			changeStartDate(startDate);
		}
		$('#dp4').fdatepicker('hide');
	});
	$('#dp5').fdatepicker()
		.on('changeDate', function (ev) {
		if (ev.date.valueOf() < startDate.valueOf()) {
			$('#alert').show().find('strong').text('The end date can not be less then the start date');
		} else {
			$('#alert').hide();
			endDate = new Date(changeEndDate(ev.date));
			$('#endDate').text($('#dp5').data('date'));
			// changeEndDate(endDate);
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
	// checkFormat(startMonth);
}

function changeEndDate(endDate) {
	console.log("changeEndDate");
	endYear = endDate.getFullYear();
	endMonth = checkFormat(endDate.getMonth()+1);
	endDay = checkFormat(endDate.getDate());
	// checkFormat(startMonth);
}