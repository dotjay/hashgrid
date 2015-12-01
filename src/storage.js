/*
 * This is just a proxy for storage function
 * Ideally, local storage is used,
 * cookie storage is provided only as fallback
*/

// REMOVE START //
if (typeof module!='undefined' && module.exports) {
  var SessionStorage = require("./sessionStorage");
  var CookieStorage = require("./cookieStorage");
}
// REMOVE END //

var Storage = function() {
  if(this.hasSessionStorage()) {
    return new SessionStorage();
  }
  else {
    return new CookieStorage();
  }
};

Storage.prototype.hasSessionStorage = function() {
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
if (typeof module!="undefined" && module.exports) module.exports = Storage;
// REMOVE END //
