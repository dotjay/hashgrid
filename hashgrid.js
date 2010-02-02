/**
 * hashgrid (jQuery version)
 * http://github.com/dotjay/hashgrid
 * Version 2, 02 Feb 2010
 * By Jon Gibbins, accessibility.co.uk
 */

$(document).ready(function() {

	var grid = new hashgrid({
		id: 'grid',
		modifierKey : 'alt',
		showKey: 'g',
		stickKey: 'enter',
		zIndexKey: 'b'
	});

});


/**
 * hashgrid overlay
 */
var hashgrid = function(set) {

	var overlayOn = false,
		sticky = false,
		conf = {
			id: 'grid',
			modifierKey: null,
			showKey: 'g',
			stickKey: 'enter',
			zIndexKey: 'b',
			cookiePrefix: 'hashgrid'
		};

	// Apply user settings
	if (typeof set == 'object') {
		var k;
		for (k in set) conf[k] = set[k];
	}
	else if (typeof set == 'string') {
		conf.id = set;
	}

	// Remove any conflicting overlay
	if ($('#' + conf.id).length > 0) {
		$('#' + conf.id).remove();
	}

	// Create overlay, hidden before adding to DOM
	var overlayEl = $('<div></div>');
	overlayEl.attr('id', conf.id).css('display', 'none');
	$("body").prepend(overlayEl);
	var overlay = $('#' + conf.id);

	// Unless a custom z-index is set, ensure the overlay will be behind everything
	var overlayZ = overlay.css('z-index');
	if (overlayZ == 'auto') {
		overlayZ = '-1';
		overlay.css('z-index', overlayZ);
	}

	// Override the default overlay height with the actual page height
	var pageHeight = parseFloat($(document).height());
	overlay.height(pageHeight);

	// Add the first grid line so that we can measure it
	overlay.append('<div class="horiz first-line">');

	// Calculate the number of grid lines needed
	var overlayGridLines = overlay.children('.horiz'),
		overlayGridLineHeight = parseFloat(overlayGridLines.css('height')) + parseFloat(overlayGridLines.css('border-bottom-width'));

	// Break on zero line height
	if (overlayGridLineHeight <= 0) return true;

	// Add the remaining grid lines
	var i, numGridLines = Math.floor(pageHeight / overlayGridLineHeight);
	for (i = numGridLines - 1; i >= 1; i--) {
		overlay.append('<div class="horiz"></div>');
	}

	// Check for previous overlay state
	var overlayCookie = readCookie(conf.cookiePrefix + conf.id);
	if (overlayCookie) {
		overlayOn = true;
		sticky = true;
		overlay.show();
	}

	// Keyboard controls
	$(document).bind('keydown', keydownHandler);
	$(document).bind('keyup', keyupHandler);

	/**
	 * Helpers
	 */

	function getModifier(e) {
		if (conf.modifierKey == null) return true; // Bypass by default
		var m = true;
		switch(conf.modifierKey) {
			case 'ctrl':
				m = (e.ctrlKey ? e.ctrlKey : false);
				break;

			case 'alt':
				m = (e.altKey ? e.altKey : false);
				break;

			case 'shift':
				m = (e.shiftKey ? e.shiftKey : false);
				break;
		}
		return m;
	}

	function getKey(e) {
		var k = false, c = (e.keyCode ? e.keyCode : e.which);
		if (c == 13) {
			k = 'enter';
		}
		else {
			k = String.fromCharCode(c).toLowerCase();
		}
		return k;
	}

	/**
	 * Event handlers
	 */

	function keydownHandler(e) {
		var m = getModifier(e);
		if (!m) return true;
		var key = getKey(e);
		switch(key) {
			case conf.showKey:
				if (!overlayOn) {
					overlay.show();
					overlayOn = true;
				}
				else if (sticky) {
					overlay.hide();
					overlayOn = false;
					sticky = false;
					eraseCookie(conf.cookiePrefix + conf.id);
				}
				break;
			case conf.stickKey:
				if (overlayOn) {
					// Turn sticky overlay on
					sticky = true;
					createCookie(conf.cookiePrefix + conf.id, true, 1);
				}
				break;
			case conf.zIndexKey:
				if (overlayOn) {
					// Toggle sticky overlay z-index
					if (overlay.css('z-index') == 9999) {
						overlay.css('z-index', overlayZ);
					}
					else {
						overlay.css('z-index', 9999);
					}
				}
				break;
		}
	}

	function keyupHandler(e) {
		var m = getModifier(e);
		if (!m) return true;
		var key = getKey(e);
		switch(key) {
			case conf.showKey:
				if (!sticky) {
					overlay.hide();
					overlayOn = false;
				}
				break;
		}
	}

}


/**
 * Cookie functions
 * 
 * By Peter-Paul Koch:
 * http://www.quirksmode.org/js/cookies.html
 */
function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name,"",-1);
}