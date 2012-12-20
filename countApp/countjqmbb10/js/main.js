/*
Program: main.js
Purpose: used in index.html 
Author: Meyer Tanuan
Last Updated: 2012-12-09
*/

// global variables
var maxval = localStorage.getItem('maxval');
if (maxval == null) {
	maxval = 4;
	localStorage.setItem('maxval', maxval);
}

