/*
Program: main.js
Purpose: used in index.html 
Author: Meyer Tanuan
Last Updated: 2012-11-20
*/

// global variables
var maxval = localStorage.getItem('maxval');
if (maxval == null) {
	maxval = 2;
	localStorage.setItem('maxval', maxval);
}

// Form specific functions
function setFormDefaultValues() {

	maxval = localStorage.getItem('maxval');		
	// alert("Highest Value is: " + maxval);
	
	// update form values
	countForm.highval.value = maxval;
	countForm.currval.value = 0;
};

function setFormValues(currval) {
	// increment 
	currval = parseInt(currval) + 1;
	countForm.currval.value = currval;		
	
	// alert("form updated ");
};

function resetFormValues(maxval) {
	localStorage.setItem('maxval', maxval); 
	maxval = localStorage.getItem('maxval');
	countForm.highval.value = maxval;
	countForm.currval.value = 0;
	
	alert("reset form completed");
};

$(document).ready(function() {

	setFormDefaultValues();
	
	$("#btnNext").click(function () {
		// alert("Next clicked");
		
		var currval = countForm.currval.value;
		
		if (currval < maxval) {
			setFormValues(currval);
		} else {
			alert("current value has reached the highest value");
		}
		
		return false;
	}); // end btnNext
	
}); // end ready