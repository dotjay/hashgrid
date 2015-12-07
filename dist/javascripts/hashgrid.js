(function(window, document) {
    var Helper = function() {
        "use strict";
        function copyObjectProperties(target, source) {
            var properties = Object.getOwnPropertyNames(source);
            var propertyLength = properties.length;
            var idx;
            for (idx = 0; idx < propertyLength; idx++) {
                target[properties[idx]] = source[properties[idx]];
            }
        }
        return {
            getKey: function(event) {
                var k = false, c = event.keyCode ? event.keyCode : event.which;
                if (c == 13) k = "enter"; else k = String.fromCharCode(c).toLowerCase();
                return k;
            },
            getKeyModifier: function(event, modifierOption) {
                if (modifierOption === null) return true;
                var m = true;
                switch (modifierOption) {
                  case "ctrl":
                    m = event.ctrlKey ? event.ctrlKey : false;
                    break;

                  case "alt":
                    m = event.altKey ? event.altKey : false;
                    break;

                  case "shift":
                    m = event.shiftKey ? event.shiftKey : false;
                    break;
                }
                return m;
            },
            mergeObjects: function(mergedObject, obj1, obj2) {
                if (!mergedObject && !obj1 && !obj2) {
                    return {};
                } else if (mergedObject && typeof mergedObject !== "object" || obj1 && typeof obj1 !== "object" || obj2 && typeof obj2 !== "object") {
                    return {};
                }
                if (obj1) {
                    copyObjectProperties(mergedObject, obj1);
                }
                if (obj2) {
                    copyObjectProperties(mergedObject, obj2);
                }
                return mergedObject;
            },
            forceRepaint: function() {
                var ss = document.styleSheets[0];
                try {
                    ss.addRule(".xxxxxx", "position: relative");
                    ss.removeRule(ss.rules.length - 1);
                } catch (e) {}
            }
        };
    }();
    var CookieStorage = function() {
        "use strict";
        function CookieStorage() {}
        CookieStorage.prototype.read = function(cookieLabel) {
            var cookieCrumb, cookieArray = document.cookie.split(";"), i = 0, cookieCrumbCount = cookieArray.length;
            cookieLabel = cookieLabel + "=";
            for (;i < cookieCrumbCount; i++) {
                cookieCrumb = cookieArray[i];
                while (cookieCrumb.charAt(0) === " ") {
                    cookieCrumb = cookieCrumb.substring(1, cookieCrumb.length);
                }
                if (cookieCrumb.indexOf(cookieLabel) === 0) {
                    return JSON.parse(cookieCrumb.substring(cookieLabel.length, cookieCrumb.length));
                }
            }
            return null;
        };
        CookieStorage.prototype.write = function(cookieLabel, cookieValue, expirationDay) {
            var date, cookieExpires = "", toBeWritten = "";
            if (expirationDay) {
                date = new Date();
                date.setTime(date.getTime() + expirationDay * 24 * 60 * 60 * 1e3);
                cookieExpires = "; expires=" + date.toGMTString();
            }
            toBeWritten = cookieLabel + "=" + JSON.stringify(cookieValue) + cookieExpires + "; path=/";
            document.cookie = toBeWritten;
            return toBeWritten;
        };
        CookieStorage.prototype.remove = function(cookieLabel) {
            var removedCookieValue = this.read(cookieLabel);
            if (removedCookieValue) {
                this.write(cookieLabel, "", -1);
                return removedCookieValue;
            } else {
                return null;
            }
        };
        return CookieStorage;
    }();
    var SessionStorage = function() {
        "use strict";
        function SessionStorage() {
            this.storage = window.sessionStorage;
        }
        SessionStorage.prototype.read = function(dataLabel) {
            var dataValue = this.storage.getItem(dataLabel);
            if (dataValue) {
                return JSON.parse(dataValue);
            } else {
                return null;
            }
        };
        SessionStorage.prototype.write = function(dataLabel, dataValue) {
            this.storage.setItem(dataLabel, JSON.stringify(dataValue));
            return dataValue;
        };
        SessionStorage.prototype.remove = function(dataLabel) {
            var removedDataValue = this.read(dataLabel);
            if (removedDataValue) {
                this.storage.removeItem(dataLabel);
                return removedDataValue;
            } else {
                return null;
            }
        };
        return SessionStorage;
    }();
    var Storage = function() {
        "use strict";
        function Storage() {
            if (this.hasSessionStorage()) {
                return new SessionStorage();
            } else {
                return new CookieStorage();
            }
        }
        Storage.prototype.hasSessionStorage = function() {
            try {
                var storage = window.sessionStorage, someData = "some value";
                storage.setItem(someData, someData);
                storage.removeItem(someData);
                return true;
            } catch (e) {
                return false;
            }
        };
        return Storage;
    }();
    var Hashgrid = function() {
        "use strict";
        var storage = new Storage(), fillGrid, boundKeydownHandler, keydownHandler, boundKeyupHandler, keyupHandler, createStorageData;
        function Hashgrid(customOptions) {
            var defaultOptions = {
                id: "hashgrid",
                modifierKey: null,
                showGridKey: "g",
                holdGridKey: "h",
                foregroundKey: "f",
                jumpGridsKey: "j",
                numberOfGrids: 1,
                classPrefix: "hashgrid",
                storagePrefix: "hashgrid"
            }, privateOptions = {
                overlayZBG: "-1",
                overlayZFG: "9999"
            };
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
        Hashgrid.prototype.init = function() {
            var storageData;
            this.overlay = document.createElement("div");
            this.overlay.id = this.options.id;
            this.overlay.classList.add(this.options.classPrefix + this.state.gridNumber);
            this.overlay.style.display = "none";
            this.overlay.style.pointerEvents = "none";
            this.overlay.style.height = document.body.scrollHeight + "px";
            if (this.overlay.style.zIndex === "auto") {
                this.overlay.style.zIndex = this.overlayZBackground;
            }
            document.body.insertBefore(this.overlay, document.body.firstChild);
            boundKeydownHandler = keydownHandler.bind(this);
            boundKeyupHandler = keyupHandler.bind(this);
            if (document.addEventListener) {
                document.addEventListener("keydown", boundKeydownHandler, false);
                document.addEventListener("keyup", boundKeyupHandler, false);
            } else if (document.attachEvent) {
                document.attachEvent("onkeydown", boundKeydownHandler);
                document.attachEvent("onkeyup", boundKeyupHandler);
            }
            fillGrid.call(this);
            storageData = storage.read(this.options.storagePrefix + this.options.id);
            if (storageData) {
                if (storageData.gridNumber) {
                    this.overlay.classList.remove(this.options.classPrefix + this.state.gridNumber);
                    this.overlay.classList.add(this.options.classPrefix + storageData.gridNumber);
                    this.state.gridNumber = storageData.gridNumber;
                }
                if (storageData.overlayHold) {
                    this.overlay.style.display = "block";
                    this.state.overlayOn = true;
                    this.state.overlayHold = true;
                }
                if (storageData.overlayZIndex) {
                    if (storageData.overlayZIndex === "B") {
                        this.overlay.style.zIndex = this.options.overlayZBG;
                    } else if (storageData.overlayZIndex === "F") {
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
            storage.remove(this.options.storagePrefix + this.options.id);
            if (document.removeEventListener) {
                document.removeEventListener("keydown", boundKeydownHandler);
                document.removeEventListener("keyup", boundKeyupHandler);
            } else if (document.detachevent) {
                document.detachEvent("onkeydown", boundKeydownHandler);
                document.detachEvent("onkeyup", boundKeyupHandler);
            }
        };
        fillGrid = function() {
            var columnContainer = document.createElement("div"), column = document.createElement("div"), columnCount = 0, columnWidth, docFragment = document.createDocumentFragment(), options = this.options, overlay = this.overlay, overlayHeight, overlayWidth, rowContainer = document.createElement("div"), row = document.createElement("div"), rowCount = 0, rowHeight;
            rowContainer.classList.add(options.id + "-row-container");
            columnContainer.classList.add(options.id + "-column-container");
            overlay.appendChild(rowContainer);
            overlay.appendChild(columnContainer);
            row.classList.add(options.id + "__row");
            column.classList.add(options.id + "__column");
            rowContainer.appendChild(row);
            columnContainer.appendChild(column);
            overlay.style.display = "block";
            overlay.top = "-9999px";
            overlayHeight = overlay.scrollHeight;
            overlayWidth = overlay.scrollWidth;
            rowHeight = row.getBoundingClientRect().height;
            columnWidth = column.clientWidth;
            overlay.style.display = "none";
            overlay.top = "0";
            if (!rowHeight && !columnWidth) {
                return false;
            }
            if (rowHeight) {
                rowCount = Math.floor(overlayHeight / rowHeight) - 1;
                while (rowCount--) {
                    row = document.createElement("div");
                    row.classList.add(options.id + "__row");
                    docFragment.appendChild(row);
                }
                rowContainer.appendChild(docFragment);
            } else {
                rowContainer.remove(row);
            }
            if (columnWidth) {
                columnCount = Math.floor(overlayWidth / columnWidth) - 2;
                while (columnCount--) {
                    column = document.createElement("div");
                    column.classList.add(options.id + "__column");
                    docFragment.appendChild(column);
                }
                columnContainer.appendChild(docFragment);
            } else {
                columnContainer.remove(column);
            }
        };
        keydownHandler = function(event) {
            var k, m, options = this.options, state = this.state, source = event.target.tagName.toLowerCase();
            if (source == "input" || source == "textarea" || source == "select") {
                return true;
            }
            m = Helper.getKeyModifier(event, options.modifierKey);
            if (!m) {
                return true;
            }
            k = Helper.getKey(event);
            if (!k) {
                return true;
            }
            if (state.isKeyDown[k]) {
                return true;
            }
            state.isKeyDown[k] = true;
            switch (k) {
              case options.showGridKey:
                if (!state.overlayOn) {
                    this.showOverlay();
                    state.overlayOn = true;
                } else if (state.overlayHold) {
                    this.hideOverlay();
                    state.overlayOn = false;
                    state.overlayHold = false;
                    storage.write(options.storagePrefix + options.id, createStorageData.call(this));
                }
                break;

              case options.holdGridKey:
                if (state.overlayOn && !state.overlayHold) {
                    state.overlayHold = true;
                    storage.write(options.storagePrefix + options.id, createStorageData.call(this));
                }
                break;

              case options.foregroundKey:
                if (state.overlayOn) {
                    if (this.overlay.style.zIndex === options.overlayZFG) {
                        this.overlay.style.zIndex = options.overlayZBG;
                        state.overlayZIndex = "B";
                    } else {
                        this.overlay.style.zIndex = options.overlayZFG;
                        state.overlayZIndex = "F";
                    }
                    storage.write(options.storagePrefix + options.id, createStorageData.call(this));
                }
                break;

              case options.jumpGridsKey:
                if (state.overlayOn && options.numberOfGrids > 1) {
                    this.overlay.classList.remove(options.classPrefix + state.gridNumber);
                    state.gridNumber += 1;
                    if (state.gridNumber > options.numberOfGrids) {
                        state.gridNumber = 1;
                    }
                    this.overlay.classList.add(options.classPrefix + state.gridNumber);
                    this.showOverlay();
                    if (/webkit/.test(navigator.userAgent.toLowerCase())) {
                        Helper.forceRepaint();
                    }
                    storage.write(options.storagePrefix + options.id, createStorageData.call(this));
                }
                break;
            }
            return true;
        };
        keyupHandler = function(event) {
            var k, m = Helper.getKeyModifier(event), options = this.options, state = this.state;
            if (!m) {
                return true;
            }
            k = Helper.getKey(event);
            delete state.isKeyDown[k];
            if (k && k == options.showGridKey && !state.overlayHold) {
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
    }();
    window.Hashgrid = Hashgrid;
})(window, document);