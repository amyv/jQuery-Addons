/*
* 
* @author: Amy Varga
* 
* Object which provides functionality for human readable format for days, months or years
* @param locale 	string 		Specifies language, currently only supports 'en'

*/
(function ($, window) {
	window.CalendarHelper = function (locale) {
		this.locale = locale;
	};
	
	/*
	* 
	* @param format 		string 		'number' or 'word' or 'abbrWord'
	* @param yearSpan		int			Only for getYears, sets the span of years to return
	* @returns 				array	
	* 
	*/
    CalendarHelper.prototype.getDays = function (format) {
		var dayObj;
    	var arrDayText = new Array(),
    		i;
    	switch (format) {
    		case 'number':
    			if (this.locale == 'en') {
					for (i = 1; i <= 31; i++) {
						i = this.addLeadingZero(i);
						arrDayText.push(''+i+'');
					}
				}
    		break;
    		case 'abbrWord':
    			if (this.locale == 'en') {
    				arrDayText = ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'];
    			}
    		break;
    		case 'word':
    			if (this.locale == 'en') {
    				arrDayText = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    			}
    		break;
    			
    	}
    	dayObj = this.createObj(arrDayText); 
    	return dayObj;
    };

    CalendarHelper.prototype.getMonths = function (format) {
		var monthObj;
        var arrMonthText = new Array(),
        	arrMonthValues,
        	i;
    	switch (format) {
        	case 'number':
        		if (this.locale == 'en') {
					for (i = 1; i <= 12; i++) {
						i = this.addLeadingZero(i);
						arrMonthText.push(''+i+'');
					}
				}
        	break;
        	case 'word':
				if (this.locale == 'en') {
					arrMonthText = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
				}
			break;
			case 'abbrWord':
				if (this.locale == 'en') {
					arrMonthText = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
				}
			break;
		}
    	arrMonthValues = this.getMonthValues();
    	monthObj = this.createObj(arrMonthText, arrMonthValues);
        return monthObj;
    };

    // @todo check this, we were declaring a local variable with the same name
    // as the argument to this function 'yearSpan' this is wrong
	CalendarHelper.prototype.getYears = function (format, yearSpanArg) {
		var yearObj;
		var yearSpan = parseInt(yearSpanArg),
			arrYearText = new Array(),
			currentYear =  new Date().getFullYear(),
			i;
    	switch (format) {
        	case 'number':
        		if (this.locale == 'en') {
        			if (yearSpan < 0) {
        				yearSpan = Math.abs(yearSpan);
						for (i = yearSpan; i >= 0; i--) {
							arrYearText.unshift(''+(currentYear-i)+'');
						}
        			} else if (yearSpan > 0) {
        				for (i = 0; i <= yearSpan; i++) {
        					arrYearText.push(''+(currentYear+i)+'');
						}
        			}
				}
        	break;
		}
    	yearObj = this.createObj(arrYearText);
        return yearObj;
	};
	
	CalendarHelper.prototype.addLeadingZero = function (i) {
		if  (i < 10) {
			i = ('0'+i);
		}
		return i;
	};
	
	CalendarHelper.prototype.getMonthValues = function () {
		var arrMonthValues = new Array();
        var i;
		for (i = 1; i <= 12; i++) {
			arrMonthValues.push(i.toString());
		}
		return arrMonthValues;
	};
	
	CalendarHelper.prototype.createObj = function (arrText, arrValues) {
		var obj;
		if (typeof(arrValues) == 'undefined') {
			arrValues = 'undefined'
		}
		obj = {
			'optionText': arrText,
			'optionValues': arrValues
		};
		return obj;
	};
	
})($, window);