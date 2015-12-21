var tape = require("tape");
var Hashgrid = require("../src/javascripts/hashgrid");

function setupDOM() {
  document.body.style.height = "100px";
}

tape("Hashgrid module", function(assert) {
  var hashgrid;
  var hashgridOptions = {
    id: "hashgrid"
  };
  var hashgridEl;

  setupDOM();
  hashgrid = new Hashgrid(hashgridOptions);
  hashgridEl = document.querySelector("#" + hashgridOptions.id);

  assert.ok(hashgridEl, "Hashgrid created");

  hashgrid.showOverlay();

  assert.equal(hashgridEl.style.display, "block", "Hashgrid shown");

  hashgrid.hideOverlay();

  assert.equal(hashgridEl.style.display, "none", "Hashgrid hidden");

  hashgrid.destroy();
  hashgridEl = document.querySelector("#" + hashgridOptions.id);

  assert.notOk(hashgridEl, "Hashgrid destroyed");

  assert.end();
});
