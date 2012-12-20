/*
Program: settings.js
Purpose: used in settings.html
Author: Meyer Tanuan
Last Updated: 2012-11-20
*/

// Form specific functions

// Note: instead of resetFormValues(), set the maxval 
// and use localStorage to pass new maxval
$(document).ready(function() {
	
	$("#btnSet2").click(function () {
		// alert("Set2 clicked");
		maxval = localStorage.getItem('maxval');
//		if (maxval != null) {
			maxval = 2;
			localStorage.setItem('maxval', maxval); 
			alert("maxval set to 2");
//		} else {
//			alert("maxval not initialized; start index.html");
//		}
		return false;
	}); // end btnSet2
	
	
	$("#btnSet10").click(function () {
		maxval = localStorage.getItem('maxval');
		maxval = 10;
		localStorage.setItem('maxval', maxval); 
		alert("maxval set to 10");
		return false;
	}); // end btnSet10
	
	
}); // end ready