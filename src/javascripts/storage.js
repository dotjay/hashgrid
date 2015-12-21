/*
 * This is just a proxy for storage function
 * Ideally, session storage is used,
 * cookie storage is provided only as fallback
*/

// REMOVE START //
if (typeof module != "undefined" && module.exports) {
  var SessionStorage = require("./sessionStorage");
  var CookieStorage = require("./cookieStorage");
}
// REMOVE END //

var SimpleStorage = (function() {
  "use strict";

  function SimpleStorage() {
    if(this.hasSessionStorage()) {
      return new SessionStorage();
    }
    else {
      return new CookieStorage();
    }
  }

  return SimpleStorage;
})();

SimpleStorage.prototype.hasSessionStorage = function() {
  try {
    var storage = window.sessionStorage,
      someData = "some value";

    storage.setItem(someData, someData);
    storage.removeItem(someData);
    return true;
  }
  catch(e) {
    return false;
  }
};

// REMOVE START //
if (typeof module!="undefined" && module.exports) module.exports = SimpleStorage;
// REMOVE END //
