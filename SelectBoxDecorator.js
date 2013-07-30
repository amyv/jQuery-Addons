/*
* 
* @author: Amy Varga
* 
* Object which provides functionality to customise a select box into a list
* @param select					jQuery DOM element		The select box
* @param options 				string 					An object that consists of:
* @param selectIconClass 		string					Attr class for the select div icon span tag
* @param selectIconImgUrl		string					The url for the icon image which is contained within the selectIconClass span tags
* @param listClass				string					Attr class for the list
* @param listItemClass 			string					Attr class for the list item
* @param selectedListIconClass	string					Attr class for the selected list icon
* @param selectListEvent		string					Js event to trigger when clicking a select list item
* 
*/

(function ($, window) {
	window.SelectBoxDecorator = function (select, options) {
		if (select != null) {
			this.select = select;
			if ($(this.select).siblings('ul.select').length == 0) {
				this.selectIconClass = options.selectIconClass;
				this.selectIconImgUrl = options.selectIconImgUrl;
				this.listClass = options.listClass;
				this.listItemClass = options.listItemClass;
				this.selectedListIconClass = options.selectedListIconClass;
				this.selectListEvent = options.selectListEvent;
				this.listWidth = null;
				this.isTouch = BrowserCapabilities.hasTouch;
				this.tabIndex = null;
				this.createNewSelect();
			}
		}
		
	}
	
	SelectBoxDecorator.prototype.createNewSelect = function () {
		var defaultString;
		this.parentDiv = this.select.parent('div');
		this.parentForm = this.select.closest('form');
		this.parentFormSubmit = this.parentForm.find('button[type=submit]');
		
		//this.tabIndex = this.getTabIndex();
		this.newSelect = $('<a>', {
			href:'javascript:void(0);'
			//,tabindex: this.tabIndex
		}).insertAfter($(this.select));
		this.newSelect.attr('class', 'newSelect');
		this.newSelectSelectedValue = $('<span>').prependTo(this.newSelect);
		this.newSelectSelectedValue.attr('class', 'selectedValue');
		this.icon = $('<span>').appendTo($(this.newSelect));
		this.icon.attr('class', this.selectIconClass);
		
		
		if (!this.isTouch) {
			this.select.hide();
		} else {
			this.select.css({
				'position': 'absolute',
				'z-index': '10',
				'opacity': '0'
			});
			this.newSelect.css({
				'z-index': '5'
			});
		}
		
		
		if (this.iconImg !== null) {
			this.iconImg = $('<img>', {
				src: this.selectIconImgUrl
			}).appendTo($(this.icon));
		}

		if (!this.isTouch) {
			this.list = $('<ul>', {
			}).appendTo($(this.parentDiv)).hide();
			this.list.attr('class', 'select');
			this.createListItems();
			this.addListEvents();
		}
		this.setSelectHtml();
		var thisObj = this;
		this.newSelect.on('keydown click', function(e) {
			if (!thisObj.isTouch) {
				if ((e.type == 'keydown' && e.keyCode == 40) || e.type == 'click') {
					if (thisObj.listWidth == null) {
						newSelectWidth = parseInt(thisObj.newSelect.width());
						newSelectPaddingRight = parseInt(thisObj.newSelect.css('padding-right'));
						listWidth = newSelectWidth + newSelectPaddingRight;
						thisObj.list.css('width', listWidth);
					}
					$('div.newSelect').each(function(index) {
						if ($(this).hasClass('is-expanded')) {
							$(this).siblings('ul').trigger('hide');
						}
					});
					thisObj.list.trigger('toggle');
					$(document).click(function() {
						thisObj.list.trigger('hide');
					});
					if (e.keyCode == 40) {
						var firstListItem = $(thisObj.list).find('li:nth-child(1)');
						thisObj.focusListItem(firstListItem);
						return false;
					}
					return false;
				}
			}
		});
		if (this.isTouch) {
			var thisObj = this;
			this.select.on('change', function () {
				thisObj.setSelectHtml();
			});
		}
		this.newSelect.blur(function () {
			thisObj.select.blur();
		});
		this.parentFormSubmit.click(function () {
			thisObj.select.blur();
		});
		this.select.focus(function (){
			thisObj.newSelect.focus();
		});
	}
	
	SelectBoxDecorator.prototype.getTabIndex = function () {
		var parentForm = this.select.closest('form').attr('id'),
			thisObj = this,
			tabIndex = 1,
			selectTabIndex = null;
		$('#'+parentForm+' :input').each (function (i) {
			$(this).attr('tabindex', tabIndex);
			if ($(thisObj.select)[0] == this) {
				selectTabIndex = tabIndex;
			}
			tabIndex++;
		});
		return selectTabIndex;
	}

	
	SelectBoxDecorator.prototype.setSelectHtml = function () {
		this.selectVal = this.select.val();
		this.selected = $(this.select).find('option[value='+this.selectVal+']').text();
		if (this.selected == '') {
			this.selected = '&nbsp;&nbsp;&nbsp';
		}
		this.newSelectSelectedValue.text(this.selected);
	}

	
	SelectBoxDecorator.prototype.createListItems = function () {
		this.selected = this.select.val();
		var thisObj = this;
		this.select.find('option').each(function(i) {
			this.option = $(this);
			this.text = this.option.html();
			this.value = this.option.val();
			this.className = thisObj.listItemClass;
			this.selectedListIconClass = thisObj.selectedListIconClass;
			if (this.value == thisObj.selected) {
				this.className += ' selected';
			}
			this.li = $('<li>', {
				html: '<a href="javascript:void(0);" title="select '+this.text+'">'+this.text+'</a>'
			}).appendTo($(thisObj.list));
			this.li.attr('class', this.className);
			
			if (this.value == thisObj.selected && thisObj.selectedListIconClass != 'undefined') {
				thisObj.addSelectedListIcon (this.li);
			}
			this.li.attr('data-value', this.value);	
			this.li.on('click keydown', function(e) {
				if ((e.type == 'keydown' && e.keyCode == 13) || e.type == 'click') {
					var selectedVal = $(this).attr('data-value'),
						selectedOption = $(this).text();
					thisObj.newSelect.children('span.selectedValue').text(selectedOption);
					thisObj.select.val(selectedVal);
					thisObj.select.change();
					thisObj.select.trigger(thisObj.selectListEvent);
					thisObj.select.find('option[value='+selectedVal+']').attr('selected', 'selected');
					var currentSelectedItem = thisObj.list.find('.selected');
					if (thisObj.selectedListIconClass != null) {
						$(currentSelectedItem).find('span.'+thisObj.selectedListIconClass+'').remove();
					}
					currentSelectedItem.removeClass('selected');
					if (thisObj.selectedListIconClass != null) {
						thisObj.addSelectedListIcon(this);
					}
					$(thisObj.list).find('li.focus').removeClass('focus');
					$(thisObj.newSelect).focus();
					$(this).addClass('selected');
					thisObj.list.trigger('hide');
					return false;
				}
			});
			if (!this.isTouch) {
				thisObj.addListKeyInteractions(this.li, i);
			}
		});
		return true;
	}
	
	SelectBoxDecorator.prototype.addListKeyInteractions = function (listItem, listIndex) {
		var thisObj = this;
		$(listItem).on('keydown', function(e) {
			if ($(this).attr('class').indexOf('focus') > -1) {
				//
				if (e.keyCode == 40) {
					$(this).removeClass('focus');
					if ((listIndex + 1) == $(thisObj.list).children().length) {
						thisObj.focusListItem(this);
					} else {
						thisObj.focusListItem($(this).next());
					}
				} else if (e.keyCode == 38) {
					$(this).removeClass('focus');
					if (listIndex == 0) {
						$(thisObj.newSelect).focus();
					} else {
						thisObj.focusListItem($(this).prev());
					}
				} else {
					e.preventDefault();
					if ($(this).attr('class') == 'focus') {
						thisObj.focusListItem(this);
					}
				}
			}
			return false;
		});
	}
	
	
	SelectBoxDecorator.prototype.focusListItem = function (listItem) {
		$(listItem).addClass('focus');
		$(listItem).find('a').focus();
	}
	
	SelectBoxDecorator.prototype.addListEvents = function () {
		var thisObj = this;
		this.list.bind('show', function(){
			if ($(this).is(':animated')){
			  return false;
			}
			thisObj.newSelect.addClass('is-expanded');
			$(this).slideDown().css('overflow-y', 'scroll');
		}).bind('hide', function(){
			if ($(this).is(':animated')){
			  return false;
			}
			thisObj.newSelect.addClass('is-hidden');
			thisObj.newSelect.removeClass('is-expanded');
			$(this).slideUp(function () {
				thisObj.newSelect.removeClass('is-hidden');
			});
		}).bind('toggle', function(){
			if (thisObj.newSelect.hasClass('is-expanded')) {
				$(this).trigger('hide');
			} else {
				$(this).trigger('show');
			}
		});
		return true;
	}
	
	SelectBoxDecorator.prototype.addSelectedListIcon = function (listItem) {
		this.icon = $('<span>').appendTo($(listItem));
		this.icon.attr('class', this.selectedListIconClass);
	}
})(jQuery, window);