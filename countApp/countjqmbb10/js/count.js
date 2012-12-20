/*
Program: count.js
Purpose: used in count.html
Author: Meyer Tanuan
Last Updated: 2012-11-20
*/

var maxval = localStorage.getItem('maxval');
	
// Form specific functions
function setFormDefaultValues() {
	maxval = localStorage.getItem('maxval');		
	// alert("Highest Value is: " + maxval);
	
	// update form values
	countForm.highval.value = maxval;
	countForm.currval.value = 0;
};

function setFormValues(currval) {
	// increment currval
	currvalnum = parseInt(currval) + 1;
	countForm.currval.value = currvalnum;		
};

// main
$(document).ready(function() {

	setFormDefaultValues();
	
	$("#btnNext").click(function () {
		// alert("Next clicked");
		
		var currval = countForm.currval.value;
		
		if (parseInt(currval) < parseInt(maxval)) {
			setFormValues(currval);
		} else {
			alert("Current value has reached the highest value");
		}
		return false;
	}); // end btnNext
	
}); // end ready