var tape = require("tape");
var Helper = require("../src/helper");

function setupKeyboardEvent(keyCode, keyModifier) {
  // So much for dispatching event, sigh
  var kbdEvent = new KeyboardEvent("keydown");
  var initMethod = kbdEvent.initKeyboardEvent ? "initKeyboardEvent" : "initKeyEvent";

  Object.defineProperty(kbdEvent, "keyCode", {
    get: function() {
      return this.keyCodeVal;
    }
  });

  Object.defineProperty(kbdEvent, "which", {
    get: function() {
      return this.keyCodeVal;
    }
  });

  if(keyModifier) {
    Object.defineProperty(kbdEvent, keyModifier + "Key", {
      get: function() {
        return this.keyModifierVal;
      }
    });
  }

  kbdEvent[initMethod](
    "keydown",
    true,
    true,
    window,
    keyModifier === "ctrl" ? true : false,
    keyModifier === "alt" ? true : false,
    keyModifier === "shift" ? true : false,
    keyModifier === "metaKey" ? true : false,
    keyCode,
    0
  );

  kbdEvent.keyCodeVal = keyCode;
  kbdEvent.keyModifierVal = true;

  return kbdEvent;
}

tape("Helper module", function(assert) {
  var obj1 = {
    a: 1,
    b: 2
  };
  var obj2 = {
    a: 2,
    c: 3
  };
  var obj3 = {
    a: 2,
    b: 2,
    c: 3
  };

  var keyCode = "a";
  var keyModifier = "alt";

  var kbdEvent = setupKeyboardEvent(keyCode.charCodeAt(0), keyModifier);

  assert.plan(2);

  assert.test("Object merge", function(assert) {
    assert.plan(5);

    assert.deepEqual(Helper.mergeObjects(), {}, "Returns an empty object when called without any arguments");
    assert.deepEqual(Helper.mergeObjects("string"), {}, "Returns an empty object when one of the arguments is not an object");
    assert.deepEqual(Helper.mergeObjects(obj1), obj1, "Returns the only available object for merge");
    assert.deepEqual(Helper.mergeObjects(obj1, obj2), obj3, "Two objects merged properly");
    assert.deepEqual(Helper.mergeObjects({}, obj1, obj2), obj3, "Three objects merged properly");
  });


  assert.test("Keyboard event helper", function(assert) {
    assert.plan(2);

    var keydownHandler = function(event) {
      assert.equal(Helper.getKey(event), keyCode, "Event keyCode obtained");
      assert.ok(Helper.getKeyModifier(event, keyModifier), "Event keyModifier obtained");
    };

    document.addEventListener("keydown", keydownHandler);

    document.documentElement.dispatchEvent(kbdEvent);

    document.removeEventListener("keydown", keydownHandler);
  });


});
