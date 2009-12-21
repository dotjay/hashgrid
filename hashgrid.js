/**
 * Overlay tool (jQuery version)
 * http://github.com/dotjay/hashgrid
 * Version 1, 21 Dec 2009
 * By Jon Gibbins, accessibility.co.uk
 */

$(document).ready(function() {

	var grid = new GridOverlay('grid');

});


/**
 * Grid overlay
 */
var GridOverlay = function(id) {

	var overlayEl = $('<div id="' + id + '"></div>'),
		overlayGrid = false,
		overlaySticky = false,
		cookieName = 'gridoverlay' + id;

	// Remove any conflicting overlay in the DOM
	if ($('#' + id).length > 0) {
		$('#' + id).remove();
	}

	// Ensure the overlay is hidden before adding to the DOM
	overlayEl.css('display', 'none');
	$("body").prepend(overlayEl);
	var overlay = $('#' + id);

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
	overlayGridLineHeight = parseFloat(overlayGridLines.css('height')) + parseFloat(overlayGridLines.css('border-bottom-width')),
	numGridLines = Math.floor(pageHeight / overlayGridLineHeight),
	i;

	// Add the remaining grid lines
	for (i = numGridLines - 1; i >= 1; i--) {
		overlay.append('<div class="horiz">');
	};

	// Check for previous overlay state
	var overlayCookie = readCookie(cookieName);
	if (overlayCookie) {
		overlayGrid = true;
		overlaySticky = true;
		overlay.show();
	}

	// Keyboard controls
	$(document).bind('keydown', function(e) {
		var code = (e.keyCode ? e.keyCode : e.which);
		var modifier = (e.altKey ? e.altKey : false);
		//console.log('press: ' + code);
		if (overlayGrid) {
			// Toggle sticky overlay z-index (b == 66)
			if (modifier && (code == 66)) {
				if (overlay.css('z-index') == 9999) {
					overlay.css('z-index', overlayZ);
				}
				else {
					overlay.css('z-index', 9999);
				}
			}
			// Turn sticky overlay on
			if (modifier && (code == 13)) {
				overlaySticky = true;
				createCookie(cookieName, true, 1);
			}
			// Turn sticky overlay off
			else if (overlaySticky && modifier && (code == 71)) {
				overlay.hide();
				overlayGrid = false;
				overlaySticky = false;
				eraseCookie(cookieName);
			}
		}
		else{
			// Show overlay (g == 71)
			if (modifier && (code == 71)) {
				overlay.show();
				overlayGrid = true;
			}
		}
	});

	$(document).bind('keyup', function(e) {
		var code = (e.keyCode ? e.keyCode : e.which);
		var modifier = (e.altKey ? e.altKey : false);
		// Hide overlay (g == 71)
		if (!overlaySticky && modifier && (code == 71)) {
			overlay.hide();
			overlayGrid = false;
		}
	});

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