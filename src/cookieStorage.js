/**
 * Based on cookie functions
 * By Peter-Paul Koch:
 * http://www.quirksmode.org/js/cookies.html
*/

var CookieStorage = (function() {

  function CookieStorage() {

  }

  CookieStorage.prototype.read = function(cookieLabel) {

    var
      cookieCrumb,
      cookieArray = document.cookie.split(";"),
      i = 0,
      cookieCrumbCount = cookieArray.length;

    cookieLabel = cookieLabel + "=";

    for(; i < cookieCrumbCount; i++) {
      cookieCrumb = cookieArray[i];

      while(cookieCrumb.charAt(0) === " ") {
        cookieCrumb = cookieCrumb.substring(1, cookieCrumb.length);
      }

      if(cookieCrumb.indexOf(cookieLabel) === 0) {
        return JSON.parse(cookieCrumb.substring(cookieLabel.length, cookieCrumb.length));
      }
    }

    return null;
  };

  CookieStorage.prototype.write = function(cookieLabel, cookieValue, expirationDay) {

    var
      date,
      cookieExpires = "",
      toBeWritten = "";

    if (expirationDay) {
      date = new Date();
      date.setTime( date.getTime() + (expirationDay*24*60*60*1000) );
      cookieExpires = "; expires=" + date.toGMTString();
    }

    toBeWritten =  cookieLabel + "=" + JSON.stringify(cookieValue) + cookieExpires + "; path=/";
    document.cookie = toBeWritten;

    return toBeWritten;
  };

  CookieStorage.prototype.remove = function(cookieLabel) {
    var removedCookieValue = this.read(cookieLabel);

    if(removedCookieValue) {
      this.write(cookieLabel, "", -1);
      return removedCookieValue;
    }
    else {
      return null;
    }
  };

  return CookieStorage;

})();


// REMOVE START //
if (typeof module!="undefined" && module.exports) module.exports = CookieStorage;
// REMOVE END //
