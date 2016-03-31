$(function() {

	var today = new Date(),					// today's date
		dayHeLeft = new Date(2014, 4, 1),	// date he left
		totalDays = 457,					// total number of days he's gone
		daysBeenGone = today - dayHeLeft,	// # days gone so far
		percent,							// percent of time completed
		daysLeft;							// # days left of sabbatical

	// convert number of days he's been gone to days from milliseconds
	// check in console to make sure right
    daysBeenGone = Math.floor(((((daysBeenGone/1000)/60)/60)/24));
    console.log("He's been gone for " + daysBeenGone + " days");

    daysLeft = Math.floor(totalDays - daysBeenGone);

    // if he's already back fill up entire bar and say he's been gone
    if ((daysLeft) <= 0) {
		document.getElementById('progress-bar').style.width = 100 + "%";
        document.getElementById('progress-bar').innerHTML="Mark's returned";
    }
    
    // if he isn't back yet fill up what percent is completed and say how much
    else {

        if (daysBeenGone != 0) {
           	percent = Math.floor((daysBeenGone/totalDays)*100);
        }

        console.log(percent + "% of the way through sabbatical");
        document.getElementById('progress-bar').style.width = percent + "%";
        document.getElementById('progress-bar').innerHTML = percent + "% of sabbatical completed.  " + daysLeft + " days left";
    }
})