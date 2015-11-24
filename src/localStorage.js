var LocalStorage = (function() {

  function LocalStorage() {
    this.storage = window.localStorage;
  }

  LocalStorage.prototype.read = function(dataLabel) {
    var dataValue = this.storage.getItem(dataLabel);

    if(dataValue) {
      return JSON.parse(dataValue);
    }
    else {
      return null;
    }
  };

  LocalStorage.prototype.write = function(dataLabel, dataValue) {
    this.storage.setItem(dataLabel, JSON.stringify(dataValue));
    return dataValue;
  };

  LocalStorage.prototype.remove = function(dataLabel) {
    var removedDataValue = this.read(dataLabel);

    if(removedDataValue) {
      this.storage.removeItem(dataLabel);
      return removedDataValue;
    }
    else {
      return null;
    }
  };

  return LocalStorage;

})();

if (typeof module!="undefined" && module.exports) module.exports = LocalStorage;
