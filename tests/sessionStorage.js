var tape = require("tape");
var SessionStorage = require("../src/sessionStorage");

tape("Session Storage module", function(assert) {
  var storage = new SessionStorage();
  var dataLabel = "label";
  var dataValue = "value";

  window.sessionStorage.clear();

  assert.equal(storage.read(dataLabel), null, "Data reading returns null if data value is not set");

  assert.ok(storage.write(dataLabel, dataValue), "Data writing returns written value");

  assert.equal(storage.read(dataLabel), dataValue, "Data writing sets valid data value");

  assert.equal(storage.remove(dataLabel), dataValue, "Data removal returns removed value");

  assert.equal(storage.read(dataLabel), null, "Data reading returns null after data value is removed");

  assert.end();
});
