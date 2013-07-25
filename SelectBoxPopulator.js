/*
* 
* @author: Amy Varga
* 
* Object which populates a selectBox with options
* @param selectors		Object					Indexed array containing:
* @param selector		jQuery DOM element		The selectbox
* @param options		Object					Contains:
* @param optionText		array					Option HTML
* @param optionValue	array					Option values - if this is 'undefined' then the option HTML will be the value
* @param defaultString 	string 					Set as the first item in the returned array. If set to null, no default value will be set
* @param selectedText	string					The optionText value of the option to be selected - if this is undefined then the defaultString will be selected
* 
*/

(function ($, window) {
	window.SelectBoxPopulator = function (selectors) {
		var i,
			ele,
			arrOptionText,
			arrOptionValues,
			optionsBound,
			defaultString,
			selectedText,
            optionVal,
			j;
		for (i in selectors) {
			ele = selectors[i].selector;
			arrOptionText = selectors[i].options.optionText;
			arrOptionValues = selectors[i].options.optionValues;
			optionsBound = arrOptionText.length;
			defaultString = selectors[i].defaultString;
			selectedText = this.setSelectedOptionText(selectors[i].selectedValue, defaultString);
			if (this.addDefaultOption(selectedText, defaultString, ele)) {
				for (j = 0; j < optionsBound; j++) {

					var optionText = arrOptionText[j];
					if (arrOptionValues != 'undefined') {
						optionVal = arrOptionValues[j];
					} else {
						optionVal = this.getOptionValue(optionText);
					}
					this.option = $('<option/>', {
						attr: {
							value: optionVal
						},
						html: optionText
					}).appendTo(ele);
					//this.setSelectedOption(selectedText, optionText, this.option);
				}
			}
			$(ele).val(selectedText);
		}
	}
	
	SelectBoxPopulator.prototype.getOptionValue = function (optionText) {
		var optionVal = optionText;
		if (optionText.substr(0,1) == 0) {
			optionVal = optionText.replace(0, '');
		}
		if (optionText == '') {
			optionVal = 'default';
		} 
		return optionVal;
	}
	
	SelectBoxPopulator.prototype.addDefaultOption = function (selectedText, defaultString, ele) {
		if (defaultString !== null) {
			this.option = $('<option/>', {
				attr: {
					value: ''
				},
				html: defaultString
			}).appendTo(ele);
			//this.setSelectedOption (selectedText, defaultString, this.option);
		}
		return true;
	}
	
	SelectBoxPopulator.prototype.setSelectedOptionText = function (selectedText, defaultString) {
		if (typeof(selectedText) == 'undefined') {
			selectedText = defaultString;
		}
		return selectedText;
	}
	
	SelectBoxPopulator.prototype.setSelectedOption = function (selectedText, optionText, option) {
		if (typeof(selectedText) != 'undefined' && selectedText == optionText) {
			option.attr('selected', 'selected');
		}
	}
	
})($, window);