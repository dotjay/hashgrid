/*
 * This is just a proxy for storage function
 * Ideally, local storage is used,
 * cookie storage is provided only as fallback
*/

if (typeof module!='undefined' && module.exports) {
  var LocalStorage = require("./localStorage");
  var CookieStorage = require("./cookieStorage");
}

var Storage = function() {
  if(this.hasLocalStorage()) {
    return new LocalStorage();
  }
  else {
    return new CookieStorage();
  }
};

Storage.prototype.hasLocalStorage = function() {
  try {
    var storage = window.localStorage,
        someData = "some value";

    storage.setItem(someData, someData);
    storage.removeItem(someData);
    return true;
  }
  catch(e) {
    return false;
  }
};

if (typeof module!="undefined" && module.exports) module.exports = Storage;
