var tape = require("tape");
var CookieStorage = require("../src/javascripts/cookieStorage");

tape("Cookie Storage module", function(assert) {
  var storage = new CookieStorage();
  var cookieLabel = "label";
  var cookieValue = "value";

  assert.equal(storage.read(cookieLabel), null, "Cookie reading returns null if cookie value is not set");

  assert.ok(storage.write(cookieLabel, cookieValue), "Cookie writing returns written value");

  assert.equal(storage.read(cookieLabel), cookieValue, "Cookie writing sets valid cookie value");

  assert.equal(storage.remove(cookieLabel), cookieValue, "Cookie removal returns removed value");

  assert.equal(storage.read(cookieLabel), null, "Cookie reading returns null after cookie value is removed");

  assert.end();
});
