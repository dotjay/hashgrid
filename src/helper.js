
var Helper = (function() {
  "use strict";

  function copyObjectProperties(target, source) {
    var properties = Object.getOwnPropertyNames(source);
    var propertyLength = properties.length;
    var idx;

    for(idx = 0; idx < propertyLength; idx++) {
      target[properties[idx]] = source[properties[idx]];
    }
  }


  return {

    /* Keyboard event helpers */
    getKey: function(event) {
      var k = false, c = (event.keyCode ? event.keyCode : event.which);
      // Handle keywords
      if (c == 13) k = 'enter';
      // Handle letters
      else k = String.fromCharCode(c).toLowerCase();
      return k;
    },

    getKeyModifier: function(event, modifierOption) {
      if (modifierOption === null) return true; // Bypass by default
      var m = true;
      switch(modifierOption) {
        case 'ctrl':
          m = (event.ctrlKey ? event.ctrlKey : false);
        break;

        case 'alt':
          m = (event.altKey ? event.altKey : false);
        break;

        case 'shift':
          m = (event.shiftKey ? event.shiftKey : false);
        break;
      }
      return m;
    },

    /*
     * Simple object merge
     * - merge obj1 and obj2 to mergedResult
     * - mergedResult, obj1 and obj2 can only contain primitives
     * - obj2 is optional
    */
    mergeObjects: function(mergedObject, obj1, obj2) {

      if(!mergedObject && !obj1 && !obj2) {
        return {};
      }
      else if(
        (mergedObject && typeof(mergedObject) !== "object") ||
        (obj1 && typeof(obj1) !== "object") ||
        (obj2 && typeof(obj2) !== "object")) {
        return {};
      }

      if(obj1) {
        copyObjectProperties(mergedObject, obj1);
      }

      if(obj2) {
        copyObjectProperties(mergedObject, obj2);
      }

      return mergedObject;
    },

    /**
     * Forces a repaint (because WebKit has issues)
     * http://www.sitepoint.com/forums/showthread.php?p=4538763
     * http://www.phpied.com/the-new-game-show-will-it-reflow/
    */
    forceRepaint: function() {
      var ss = document.styleSheets[0];

      try {
        ss.addRule('.xxxxxx', 'position: relative');
        ss.removeRule(ss.rules.length - 1);
      }
      catch(e) {}
    }
  };

})();


// REMOVE START //
if (typeof module!="undefined" && module.exports) module.exports = Helper;
// REMOVE END //
