/**
 * hashgrid (vanilla version)
 * http://github.com/dotjay/hashgrid
 * Version 10, 25 Nov 2015
 * Written by Jon Gibbins at Analog, http://analog.coop/
 *
 * Contibutors:
 * Sean Coates, http://seancoates.com/
 * Phil Dokas, http://jetless.org/
 * Andrew Jaswa, http://andrewjaswa.com/
 *
 * License:
 * http://www.apache.org/licenses/LICENSE-2.0.html
 *
 * // Using a basic #grid setup
 * var grid = new Hashgrid();
 *
 * // Using #grid with a custom id (e.g. #mygrid)
 * var grid = new Hashgrid("mygrid");
 *
 * // Using #grid with additional options
 * var grid = new hashgrid({
 *     id: "mygrid",              // id for the grid container
 *     modifierKey: "alt",        // optional "ctrl", "alt" or "shift"
 *     showGridKey: "s",          // key to show the grid
 *     holdGridKey: "enter",      // key to hold the grid shown
 *     foregroundKey: "f",        // key to toggle foreground/background
 *     jumpGridsKey: "d",         // key to cycle through the grids
 *     numberOfGrids: 2,          // number of grids
 *     classPrefix: "mygrid",     // prefix for rows and columns
 *     storagePrefix: "mygrid"    // prefix for storage label
 * });
 */

// REMOVE START //
if (typeof module!="undefined" && module.exports) {
  var Storage = require("./storage");
  var Helper = require("./helper");
}
// REMOVE END //

var Hashgrid = (function() {

  var storage = new Storage();

  // Constructor
  function Hashgrid(customOptions) {

    var
      defaultOptions = {
        id: "hashgrid",               // id for the grid container
        modifierKey: null,            // optional "ctrl", "alt" or "shift"
        showGridKey: "g",             // key to show the grid
        holdGridKey: "h",             // key to hold the grid shown
        foregroundKey: "f",           // key to toggle foreground/background
        jumpGridsKey: "j",            // key to cycle through the grids
        numberOfGrids: 1,             // number of grids
        classPrefix: "hashgrid",      // prefix for rows and columns
        storagePrefix: "hashgrid"     // prefix for storage label
      },
      privateOptions = {
        overlayZBG: "-1",
        overlayZFG: "9999"
      };

    // Apply options
    this.options = Helper.mergeObjects(defaultOptions, customOptions, privateOptions);

    this.state = {
      overlayHold: false,
      overlayOn: false,
      overlayZIndex: "B",
      isKeyDown: {},
      gridNumber: 1
    };

    this.init();
  }


  // Instance methods

  Hashgrid.prototype.init = function() {
    var storageData;

    // Create overlay, hidden before adding to DOM
    this.overlay = document.createElement("div");
    this.overlay.id = this.options.id;
    this.overlay.classList.add(this.options.classPrefix + this.state.gridNumber);
    this.overlay.style.display = "none";
    this.overlay.style.pointerEvents = "none";
    this.overlay.style.height = document.body.scrollHeight + "px";

    // Unless a custom z-index is set, ensure the overlay will be behind everything
    if(this.overlay.style.zIndex === "auto") {
      this.overlay.style.zIndex = this.overlayZBackground;
    }

    // Prepend overlay to body
    document.body.insertBefore(this.overlay, document.body.firstChild);

    // Add keyboard events listener
    // TODO: Find a way to add event handler that is bindable and removable
    if(document.addEventListener) {
      document.addEventListener("keydown", keydownHandler.bind(this), false);
      document.addEventListener("keyup", keyupHandler.bind(this), false);
    }
    else if(document.attachEvent){
      document.attachEvent("onkeydown", keydownHandler.bind(this));
      document.attachEvent("onkeyup", keyupHandler.bind(this));
    }

    fillGrid.call(this);

    storageData = storage.read(this.options.storagePrefix + this.options.id);

    // TODO: Improve storage and state management
    if(storageData) {
      if(storageData.gridNumber) {
        this.overlay.classList.remove(this.options.classPrefix + this.state.gridNumber);
        this.overlay.classList.add(this.options.classPrefix + storageData.gridNumber);
        this.state.gridNumber = storageData.gridNumber;
      }

      if(storageData.overlayHold) {
        this.overlay.style.display = "block";
        this.state.overlayOn = true;
        this.state.overlayHold = true;
      }

      if(storageData.overlayZIndex) {
        if(storageData.overlayZIndex === "B"){
          this.overlay.style.zIndex = this.options.overlayZBG;
        }
        else if(storageData.overlayZIndex === "F"){
          this.overlay.style.zIndex = this.options.overlayZFG;
        }
        this.state.overlayZIndex = storageData.overlayZIndex;
      }
    }

  };

  Hashgrid.prototype.showOverlay = function() {
    this.overlay.style.display = "block";
    this.state.overlayOn = true;
  };

  Hashgrid.prototype.hideOverlay = function() {
    this.overlay.style.display = "none";
    this.state.overlayOn = false;
  };

  Hashgrid.prototype.destroy = function() {
    this.overlay.remove();

    // Remove keyboard events listener (these does not work)
    //if(document.removeEventListener) {
      //document.removeEventListener("keydown", keydownHandler, false);
      //document.removeEventListener("keyup", keyupHandler, false);
    //}
    //else if(document.detachEvent){
      //document.detachEvent("onkeydown", keydownHandler);
      //document.detachEvent("onkeyup", keyupHandler);
    //}
  };


  // Helper functions

  fillGrid = function() {
    var
      columnContainer = document.createElement("div"),
      column = document.createElement("div"),
      columnCount,
      columnWidth,
      docFragment = document.createDocumentFragment(),
      options = this.options,
      overlay = this.overlay,
      overlayHeight,
      overlayWidth,
      rowContainer = document.createElement("div"),
      row = document.createElement("div"),
      rowCount,
      rowHeight;

    // Row and column container
    rowContainer.classList.add(options.id + "-row-container");
    columnContainer.classList.add(options.id + "-column-container");

    overlay.appendChild(rowContainer);
    overlay.appendChild(columnContainer);


    // First row and column
    row.classList.add(options.id + "__row");
    column.classList.add(options.id + "__column");

    rowContainer.appendChild(row);
    columnContainer.appendChild(column);


    // Display temporarily to get row and column size
    overlay.style.display = "block";
    overlay.top = "-9999px";

    overlayHeight = overlay.scrollHeight;
    overlayWidth = overlay.scrollWidth;
    rowHeight = row.getBoundingClientRect().height; // height + border
    columnWidth = column.clientWidth;

    // Hide it again
    overlay.style.display = "none";
    overlay.top = "0";

    if(!rowHeight || !columnWidth) {
      return false;
    }

    // Calculate rows and columns needed
    rowCount = Math.floor(overlayHeight / rowHeight) - 1;
    columnCount = Math.floor(overlayWidth / columnWidth) - 2;

    // Fill them in
    while(rowCount--) {
      row = document.createElement("div");
      row.classList.add(options.id + "__row");

      docFragment.appendChild(row);
    }

    rowContainer.appendChild(docFragment);

    while(columnCount--) {
      column = document.createElement("div");
      column.classList.add(options.id + "__column");

      docFragment.appendChild(column);
    }

    columnContainer.appendChild(docFragment);
  };

  keydownHandler = function(event) {
    var
      k,
      m,
      options = this.options;
      state = this.state;
      source = event.target.tagName.toLowerCase();

    if ((source == 'input') || (source == 'textarea') || (source == 'select')) {
      return true;
    }

    m = Helper.getKeyModifier(event, options.modifierKey);
    if(!m) {
      return true;
    }

    k = Helper.getKey(event);
    if(!k) {
      return true;
    }

    if(state.isKeyDown[k]) {
      return true;
    }

    state.isKeyDown[k] = true;

    switch(k) {
      case options.showGridKey:
        if(!state.overlayOn) {
          this.showOverlay();
          state.overlayOn = true;
        }
        else if(state.overlayHold) {
          this.hideOverlay();
          state.overlayOn = false;
          state.overlayHold = false;

          storage.write(options.storagePrefix + options.id, createStorageData.call(this));
        }
        break;
      case options.holdGridKey:
        if(state.overlayOn && !state.overlayHold) {
          state.overlayHold = true;

          storage.write(options.storagePrefix + options.id, createStorageData.call(this));
        }
        break;
      case options.foregroundKey:
        // TODO: Turn into instance method
        if(state.overlayOn) {
          if(this.overlay.style.zIndex === options.overlayZFG) {
            this.overlay.style.zIndex = options.overlayZBG;
            state.overlayZIndex = "B";
          }
          else {
            this.overlay.style.zIndex = options.overlayZFG;
            state.overlayZIndex = "F";
          }

          storage.write(options.storagePrefix + options.id, createStorageData.call(this));
        }
        break;
      case options.jumpGridsKey:
        // TODO: Turn into instance method
        if(state.overlayOn && options.numberOfGrids > 1) {
          // Cycle through available grids
          this.overlay.classList.remove(options.classPrefix + state.gridNumber);
          state.gridNumber += 1;

          if(state.gridNumber > options.numberOfGrids) {
            state.gridNumber = 1;
          }

          this.overlay.classList.add(options.classPrefix + state.gridNumber);
          this.showOverlay();

          if (/webkit/.test( navigator.userAgent.toLowerCase() )) {
            Helper.forceRepaint();
          }

          storage.write(options.storagePrefix + options.id, createStorageData.call(this));
        }
        break;
    }

    return true;
  };

  keyupHandler = function(event) {
    var
      k,
      m = Helper.getKeyModifier(event),
      options = this.options,
      state = this.state;

    if (!m) {
      return true;
    }

    k = Helper.getKey(event);

    delete state.isKeyDown[k];

    if (k && (k == options.showGridKey) && !state.overlayHold) {
      this.hideOverlay();
      state.overlayOn = false;
    }

    return true;
  };

  createStorageData = function() {
    var state = this.state;
    return {
      gridNumber: state.gridNumber,
      overlayHold: state.overlayHold,
      overlayZIndex: state.overlayZIndex
    };
  };

  return Hashgrid;

})();


window.Hashgrid = Hashgrid;

// REMOVE START //
if (typeof module!="undefined" && module.exports) module.exports = Hashgrid;
// REMOVE END //
