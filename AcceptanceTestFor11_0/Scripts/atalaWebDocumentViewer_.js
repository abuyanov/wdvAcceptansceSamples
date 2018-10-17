//-------------------------------------------------------------------------------------------------
//
//  Web Document Viewer object cross browser client-side script. 
//  Copyright 2003-2018 Atalasoft, Inc. All Rights Reserved.
//
//  This source code is property of Atalasoft, Inc. (http://www.atalasoft.com/)
//  Permission for usage and modification of this code is only permitted 
//  with the purchase of a source code license.
//-------------------------------------------------------------------------------------------------

"use strict";
//-------------------------------------------------------------------------------------------------
//
//	Web Document Viewer object cross browser client-side script.
//	Copyright 2003-2018 Atalasoft Inc. All Rights Reserved.
//
//	This source code is property of Atalasoft, Inc. (http://www.atalasoft.com/)
//	Permission for usage and modification of this code is only permitted
//	with the purchase of a source code license.
//

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Atalasoft;
(function (Atalasoft) {
    var Controls;
    (function (Controls) {
        var DocumentStateManager = function () {
            function DocumentStateManager(viewer) {
                _classCallCheck(this, DocumentStateManager);

                this.viewer = viewer;
            }

            _createClass(DocumentStateManager, [{
                key: "isViewerActive",
                value: function isViewerActive() {
                    return !!(this.viewer && this.currentThumb);
                }
            }, {
                key: "isThumbnailerActive",
                value: function isThumbnailerActive(thumbnailer) {
                    return thumbnailer && !!this.currentThumb && this.currentThumb.get() === thumbnailer.get();
                }
            }, {
                key: "activateThumbnailer",
                value: function activateThumbnailer(thumbnailer, docInfo, link, config, force) {
                    var isActiveThumb = this.isThumbnailerActive(thumbnailer);
                    if (isActiveThumb && !force) {
                        return;
                    }
                    if (this.currentThumb && !isActiveThumb) {
                        this.currentThumb.detachViewer();
                    }
                    this.currentThumb = thumbnailer;
                    if (this.viewer && this.viewer.isInitialized()) {
                        this.viewer.switchDocument(docInfo, link, config);
                        this.currentThumb.activateViewer();
                    }
                }
            }, {
                key: "closeDocument",
                value: function closeDocument(thumbnailer, link) {
                    thumbnailer = thumbnailer || this.currentThumb;
                    var isActiveThumb = this.isThumbnailerActive(thumbnailer);
                    if (isActiveThumb) {
                        thumbnailer.detachViewer();
                        this.currentThumb = null;
                    }
                    if (this.viewer && this.viewer.isInitialized() && link) {
                        this.viewer.closeDocument(link, isActiveThumb);
                    }
                }
            }]);

            return DocumentStateManager;
        }();

        Controls.DocumentStateManager = DocumentStateManager;
    })(Controls = Atalasoft.Controls || (Atalasoft.Controls = {}));
})(Atalasoft || (Atalasoft = {}));
var Atalasoft;
(function (Atalasoft) {
    Atalasoft.$ = jQuery;
    var Utils = void 0;
    (function (Utils) {
        // gets the mouse position from a mouse event
        // e: browser's mouse event object
        // p: 'point' object to set values of
        // o: dom object to calculate relative position
        /**
         * @private
         */
        function getMousePosition(ev, point, domObj) {
            if (!point) {
                point = { x: 0, y: 0 };
            }
            if (Utils.Browser.Explorer) {
                if (ev === null) {
                    ev = event;
                }
                if (document.compatMode === "CSS1Compat") {
                    point.x = ev.x + document.documentElement.scrollLeft;
                    point.y = ev.y + document.documentElement.scrollTop;
                } else {
                    point.x = ev.x + document.body.scrollLeft;
                    point.y = ev.y + document.body.scrollTop;
                }
            } else {
                point.x = ev.pageX;
                point.y = ev.pageY;
            }
            if (domObj) {
                point.x -= domObj.offsetLeft;
                point.y -= domObj.offsetTop;
            }
            return point;
        }
        Utils.getMousePosition = getMousePosition;
        ;
        // gets the mouse position from a jQuery mouse event
        // e: jQuery mouse event object
        // p: 'point' object to set values of
        // ignoreWrongTarget: bool to indicate whether to ignore the target being different from currentTarget
        /**
         * @private
         */
        function getMousePositionJquery(e, p, ignoreWrongTarget) {
            if (!p) {
                p = { x: 0, y: 0 };
            }
            var origEvent = e.originalEvent;
            var oldIe = Utils.Browser.Explorer && parseInt(Utils.Browser.Version, 10) <= 9;
            if (!(e.offsetX || e.offsetY) || oldIe) {
                if (Utils.Browser.Explorer && !oldIe) {
                    if (origEvent instanceof MouseEvent) {
                        p.x = origEvent.x;
                        p.y = origEvent.y;
                    } else {
                        p.x = 0;
                        p.y = 0;
                    }
                } else {
                    var offset = null;
                    var target = e.target;
                    var touch = Utils.Browser.Features.Touch && origEvent instanceof TouchEvent && origEvent.touches.length === 1 ? origEvent.touches[0] : null;
                    if (touch !== null) {
                        target = document.elementFromPoint(touch.clientX, touch.clientY);
                    }
                    var jqTarget = Atalasoft.$(target);
                    var eventPage = { pageX: 0, pageY: 0 };
                    if (touch !== null) {
                        eventPage.pageX = touch.pageX;
                        eventPage.pageY = touch.pageY;
                    } else if (origEvent instanceof MouseEvent) {
                        eventPage.pageX = origEvent.pageX;
                        eventPage.pageY = origEvent.pageY;
                    }
                    if (!(eventPage.pageX || eventPage.pageY)) {
                        eventPage.pageX = e.pageX;
                        eventPage.pageY = e.pageY;
                    }
                    if (e.target.raphael) {
                        // SVG target, jquery bug calculates offsets wrong 
                        offset = jqTarget.parents('div:eq(0)').offset();
                    } else if (e.target.raphaelParent || jqTarget.parents('svg').length > 0) {
                        // html inside svg
                        offset = jqTarget.parents('svg').parents('div:eq(0)').offset();
                    }
                    if (!offset) {
                        offset = jqTarget.offset();
                    }
                    if (offset) {
                        p.x = eventPage.pageX - offset.left;
                        p.y = eventPage.pageY - offset.top;
                    } else {
                        p.x = eventPage.pageX;
                        p.y = eventPage.pageY;
                    }
                }
            } else {
                if (Utils.Browser.Firefox) {
                    // e.offsetX and e.offsetY are not supported well in Firefox
                    // so we have to calculate them using normalized jQuery values
                    var pOffset = e.target.raphelParent ?
                    // html inside svg
                    Atalasoft.$(e.target).parents('svg').offset() : Atalasoft.$(e.target.offsetParent || e.target.parentNode).offset();
                    if (pOffset) {
                        p.x = e.pageX - pOffset.left;
                        p.y = e.pageY - pOffset.top;
                    } else {
                        p.x = e.pageX;
                        p.y = e.pageY;
                    }
                } else if (origEvent.currentTarget !== origEvent.target && !ignoreWrongTarget) {
                    if (!(origEvent.currentTarget.offsetLeft || origEvent.currentTarget.offsetTop) && origEvent.currentTarget.ownerSVGElement) {
                        // there doesn't seem to be a way to get the relative position of a nested svg element in IE9
                        var bbox = Utils.Browser.Explorer ? origEvent.currentTarget.ownerSVGElement.getBBox() : origEvent.currentTarget.getBBox();
                        p.x = Math.round(bbox.x);
                        p.y = Math.round(bbox.y);
                    } else {
                        p.x = origEvent.currentTarget.offsetLeft + e.offsetX;
                        p.y = origEvent.currentTarget.offsetTop + e.offsetY;
                    }
                } else {
                    if (Utils.Browser.Explorer && parseInt(Utils.Browser.Version, 10) < 10 && origEvent instanceof MouseEvent) {
                        p.x = origEvent.x;
                        p.y = origEvent.y;
                    } else {
                        p.x = e.offsetX;
                        p.y = e.offsetY;
                    }
                }
            }
            return p;
        }
        Utils.getMousePositionJquery = getMousePositionJquery;
        function __loadDependencies() {
            __ef();
        }
        Utils.__loadDependencies = __loadDependencies;
        /**
         * Gets the normalized offsetLeft and offsetTop from an SVG element
         * with respect to its parent jQuery object
         * @private
         * @param objSVG: object, svg object from the dom
         * @param parent: object, jQuery object representing the parent DOM node
         */
        function getSVGOffset(objSVG, parent) {
            var offset = {
                left: 0,
                top: 0
            };
            if (objSVG instanceof HTMLElement) {
                offset.left = objSVG.offsetLeft;
                offset.top = objSVG.offsetTop;
            } else {
                var sOffset = Atalasoft.$(objSVG).offset();
                var pOffset = parent.offset();
                if (sOffset && pOffset) {
                    offset.left = sOffset.left - pOffset.left;
                    offset.top = sOffset.top - pOffset.top;
                }
            }
            return offset;
        }
        Utils.getSVGOffset = getSVGOffset;
        /**
         * @private
         */
        function getJSPath(s) {
            // grabs all script tags that have a src tag that matches the given string
            var jstag = Atalasoft.$('script[src*="' + s + '"]');
            if (jstag.length > 0) {
                // the js folder path
                var srcAttr = jstag.attr('src');
                if (srcAttr) return srcAttr.replace(s, '');else return '';
            } else {
                // path not found
                return '';
            }
        }
        Utils.getJSPath = getJSPath;
        ;
        /**
         * @private
         */
        function CalcDistance(x1, y1, x2, y2, old) {
            var highX = Math.max(x1, x2);
            var lowX = Math.min(x1, x2);
            var highY = Math.max(y1, y2);
            var lowY = Math.min(y1, y2);
            return {
                x: highX - lowX,
                y: highY - lowY,
                dx: old ? old.left - lowX : 0,
                dy: old ? old.top - lowY : 0,
                left: lowX,
                right: highX,
                top: lowY,
                bottom: highY
            };
        }
        Utils.CalcDistance = CalcDistance;
        ;
        /**
         * Creates a rectangle object.
         * @private
         */
        function makeRect(x, y, w, h) {
            return {
                x: x,
                y: y,
                width: w,
                height: h
            };
        }
        Utils.makeRect = makeRect;
        ;
        /**
         * Calculates rectangle bounds for the clockwise page rotation to the specified angle.
         * @private
         * @param rect
         * @param page
         * @param angle positive number, must be exactly divisible by 90.
         */
        function rotateRect(rect, page, angle) {
            if (angle === 0) {
                return rect;
            }
            angle = (angle - angle % 90) % 360;
            var left = rect.x;
            var top = rect.y;
            switch (angle) {
                case 90:
                    left = page.height - rect.y - rect.height;
                    top = rect.x;
                    break;
                case 180:
                    left = page.width - rect.x - rect.width;
                    top = page.height - rect.y - rect.height;
                    break;
                case 270:
                    left = rect.y;
                    top = page.width - rect.x - rect.width;
                    break;
            }
            return makeRect(left, top, angle === 90 || angle === 270 ? rect.height : rect.width, angle === 90 || angle === 270 ? rect.width : rect.height);
        }
        Utils.rotateRect = rotateRect;
        /**
         * Calculates new point coordinates for the clockwise page rotation to the specified angle.
         * @private
         * @param point
         * @param page
         * @param angle positive number, must be exactly divisible by 90.
         */
        function rotatePoint(point, page, angle) {
            return rotateRect({ x: point.x, y: point.y, width: 0, height: 0 }, page, angle);
        }
        Utils.rotatePoint = rotatePoint;
        /**
         * just a simple function to return false without writing it repeatedly
         * @private
         */
        function __rf() {
            return false;
        }
        Utils.__rf = __rf;
        /**
         * just a simple empty function
         * @private
         */
        function __ef() {}
        Utils.__ef = __ef;
        /**
         * just a simple event handler to stop the propagation of an event.
         * @private
         */
        function __sp(e) {
            e.stopPropagation();
        }
        Utils.__sp = __sp;
        /**
         * Creates a function that wraps multiple functions into one
         * @private
         * @param arr: array of functions
         * @param arguments to pass to called functions
         */
        function __functionFromArray(arr) {
            return function () {
                while (arr.length) {
                    var arrElem = arr.shift();
                    if (arrElem) arrElem.apply(this, arguments);
                }
            };
        }
        Utils.__functionFromArray = __functionFromArray;
        /**
         * @private
         */
        function __supportsVML() {
            var hasVML = void 0;
            if (typeof hasVML === 'undefined') {
                var div = Atalasoft.$('<div/>').appendTo('body');
                var shape = Atalasoft.$('<v:shape id="vml_flag1" adj="1" />').appendTo(div);
                shape.css('behavior', 'url(#default#VML)');
                hasVML = shape[0] ? _typeof(shape[0].adj) === 'object' : true;
                div.remove();
            }
            return hasVML;
        }
        Utils.__supportsVML = __supportsVML;
        /**
         * @private
         */
        function __htmlTransformStyle(transform) {
            return {
                ' transform': transform,
                '-moz-transform': transform,
                '-webkit-transform': transform,
                '-o-transform': transform,
                '-ms-transform': transform
            };
        }
        Utils.__htmlTransformStyle = __htmlTransformStyle;
        /**
         * @private
         */
        function __calcPathBounds(points, m) {
            var bbox = {
                x: 0,
                y: 0,
                width: 0,
                height: 0
            };
            if (!points || !points.length) {
                return bbox;
            }
            m = m || Raphael.matrix();
            bbox.x = m.x(points[0].x, points[0].y);
            bbox.y = m.y(points[0].x, points[0].y);
            points.forEach(function (point) {
                var p = {
                    x: m.x(point.x, point.y),
                    y: m.y(point.x, point.y)
                };
                bbox.x = p.x < bbox.x ? p.x : bbox.x;
                bbox.y = p.y < bbox.y ? p.y : bbox.y;
                bbox.width = p.x > bbox.width ? p.x : bbox.width;
                bbox.height = p.y > bbox.height ? p.y : bbox.height;
            });
            bbox.width -= bbox.x;
            bbox.height -= bbox.y;
            return bbox;
        }
        Utils.__calcPathBounds = __calcPathBounds;
        /**
         * @private
         */
        function flattenVersionSting(versionString) {
            // it's copypaste from first jquery check, but that code needs to be executed before any other our code so it's not convinient to share this function.
            var val = 0;
            var parts = ('' + versionString).replace('_', '.').replace(/[^0-9.]/g, '').split('.');
            parts.forEach(function (part, idx) {
                val += Number(part) / Math.pow(10, idx * 3);
            });
            return val;
        }
        Utils.flattenVersionSting = flattenVersionSting;
        /**
         * @private
         */
        function ParseInt(number) {
            if (typeof number === 'string') {
                var trimmedNumberStr = number.trim();
                var parsedNumber = parseInt(trimmedNumberStr);
                if (/^([\+|-]?[0-9]+)$/.test(trimmedNumberStr)) {
                    return parsedNumber;
                }
            }
            if (typeof number !== 'number') return null;else return number;
        }
        Utils.ParseInt = ParseInt;
    })(Utils = Atalasoft.Utils || (Atalasoft.Utils = {}));
})(Atalasoft || (Atalasoft = {}));
//-------------------------------------------------------------------------------------------------
//
//	Web Document Viewer object cross browser client-side script.
//	Copyright 2003-2018 Atalasoft Inc. All Rights Reserved.
//
//	This source code is property of Atalasoft, Inc. (http://www.atalasoft.com/)
//	Permission for usage and modification of this code is only permitted
//	with the purchase of a source code license.
//
/// <reference path="WDV_Utils.ts"/>
var Atalasoft;
(function (Atalasoft) {
    var Document = void 0;
    (function (Document) {
        ;
        ;
        function MemoryTracker(settings) {
            var jqe = Atalasoft.$({});
            var memoryEntries = [];
            var config = {
                colorDepth: 8,
                compression: 1,
                highWaterMark: 500000000,
                pageSize: {
                    width: 800,
                    height: 1132
                }
            };
            var bytesInUse = 0;
            function calcBytes(img) {
                var w = img.width() || config.pageSize.width;
                var h = img.height() || config.pageSize.height;
                return w * h * config.colorDepth / 8 * config.compression;
            }

            var MemoryTracker = function () {
                function MemoryTracker(settings) {
                    _classCallCheck(this, MemoryTracker);

                    // map settings onto config
                    if (settings) Atalasoft.$.extend(config, settings);
                }

                _createClass(MemoryTracker, [{
                    key: "dispose",
                    value: function dispose() {
                        this.clearEntries();
                    }
                }, {
                    key: "bind",

                    // jQuery bind shortcut
                    value: function bind() {
                        jqe.bind.apply(jqe, arguments);
                        return this;
                    }
                    // jQuery unbind shortcut

                }, {
                    key: "unbind",
                    value: function unbind() {
                        jqe.unbind.apply(jqe, arguments);
                        return this;
                    }
                    // jQuery trigger shortcut

                }, {
                    key: "trigger",
                    value: function trigger(eventName) {
                        jqe.trigger.apply(jqe, arguments);
                        return this;
                    }
                    // calculates approximate memory allocation based on size and bit depth of img tag

                }, {
                    key: "allocate",
                    value: function allocate(img) {
                        memoryEntries.push(img);
                        bytesInUse += calcBytes(img);
                        if (bytesInUse > config.highWaterMark) {
                            this.trigger('exceededhighwatermark');
                        }
                        return bytesInUse;
                    }
                    // removes the oldest entry from the memory entries, and returns it for disposal

                }, {
                    key: "deallocateOldestEntry",
                    value: function deallocateOldestEntry() {
                        // remove img tag from entries
                        var dealloc = memoryEntries.shift();
                        // update bytes in use
                        if (dealloc !== undefined) this.deallocate(dealloc);
                        // return deallocated img tag so parent control can release it
                        return dealloc;
                    }
                    // used to reset after a new image has loaded

                }, {
                    key: "clearEntries",
                    value: function clearEntries() {
                        memoryEntries.length = 0;
                        bytesInUse = 0;
                    }
                    // calculates approximate memory deallocation based on size and bit depth of img tag

                }, {
                    key: "deallocate",
                    value: function deallocate(img) {
                        bytesInUse -= calcBytes(img);
                        if (bytesInUse < 0) bytesInUse = 0;
                        return bytesInUse;
                    }
                }, {
                    key: "typeOf",
                    get: function get() {
                        return 'Atalasoft.Document.MemoryTacker';
                    }
                }, {
                    key: "colorDepth",
                    set: function set(depth) {
                        config.colorDepth = depth;
                    },
                    get: function get() {
                        return config.colorDepth;
                    }
                }, {
                    key: "highWatermark",
                    set: function set(watermark) {
                        config.highWaterMark = watermark;
                    },
                    get: function get() {
                        return config.highWaterMark;
                    }
                }, {
                    key: "pageSize",
                    set: function set(pageSize) {
                        config.pageSize = { width: pageSize.width, height: pageSize.height };
                    },
                    get: function get() {
                        return config.pageSize;
                    }
                }]);

                return MemoryTracker;
            }();

            return new MemoryTracker(settings);
        }
        Document.MemoryTracker = MemoryTracker;
    })(Document = Atalasoft.Document || (Atalasoft.Document = {}));
})(Atalasoft || (Atalasoft = {}));
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

//-------------------------------------------------------------------------------------------------
//
//	Web Document Viewer object cross browser client-side script. 
//	Copyright 2003-2018 Atalasoft Inc. All Rights Reserved.
//
//	This source code is property of Atalasoft, Inc. (http://www.atalasoft.com/)
//	Permission for usage and modification of this code is only permitted 
//	with the purchase of a source code license.
//
//	Change History:
//	11-04-10	*********		File Created.
//	08-23-11	D. Cilley		FB 12456: Added maxdpi for allowing codec DPI changes while zoomed out.
//	08-29-11	D. Cilley		FB 12458: Fixed js errors when scrolling a blank viewer.
//	11-18-11	D. Cilley		FB 12690: Removed DPI settings, and added fixed page widths.
//	02-22-12	D. Cilley		FB 12934: Fixed Stamp and Image saving.
//	02-24-12	D. Cilley		FB 12940: Fixed annotation loading from openUrl.
//	03-01-12	D. Cilley		FB 13030, FB 13031: Removed unusable buttons depending on opions given.
//	03-13-12	D. Cilley		FB 13073: Fixed a bug that would allow negative pages to show.
//	04-02-12	D. Cilley		Tidied up some of the error and event handler code.
//	04-19-12	D. Cilley		FB 13176: Fixed page load event firing after page recycle.
//	05-03-12	D. Cilley		Stopped removing everything from recycled pages to maintain events.
//	09-11-12	D. Cilley		FB 13589: Improved architecture to allow for easier editing.
//	10-02-12	D. Cilley		FB 13625: Fixed a bug with jQuery 1.8.x compatability.
//	10-18-12	D. Cilley		FB 13674, 13676: Fixed clicks in menu when using touch devices. 
//	10-25-12	D. Cilley		FB 13715: Refactored internal vars, and added __getDebugInfo for testing.
//	11-01-12	J. Burch		FB 13732, 13733: Created methods to get document information and deselect all annos.
//	11-05-12	D. Cilley		FB 13742, 13744: Fixed bugs in creating annotations.
//	11-06-12	D. Cilley		FB 13751: Fixed a bug with annotation zoom level after loading.
//	11-07-12	J. Burch		FB 13748: Added public deleteAnnotatoinOnPageAtIndex method.
//	11-09-12	D. Cilley		FB 13757: Added callbacks and 'async' on several methods to help with firing events.
//	11-12-12	D. Cilley		FB 13713: Fixed some problems with showPage callbacks.
//	11-15-12	D. Cilley		FB 13716: Fixed a bug with getCurrentPageIndex.
//	11-16-12	D. Cilley		FB 13794: Fixed a problem with menu item clicks in some iOS devices.
//	11-16-12	D. Cilley		FB 13793: Fixed a problem with loading images while zooming.
//	11-20-12	D. Cilley		FB 13803: Added reflow and image loading callbacks to fix overscroll.
//	11-26-12	D. Cilley		FB 13673: Fixed viewer scroll after annotation delete in iOS mobile.
//	12-10-12	D. Cilley		FB 13852: Fixed a bug that would allow controller access even if it was null.
//	02-06-12	D. Cilley		FB 13957: Fixed missing script checking, and added config option for script resource url.
//	02-15-13	D. Cilley		FB 13971: Fixed scope problem in __loadDependency.
//	02-21-13	D. Cilley		FB 14065: Added JSHint options and fixes to comply with JSHint warnings.
//	03-01-13	D. Cilley		FB 14066: TextAnnotations now use HTML rendering for all browsers.
//	03-14-13	D. Cilley		FB 14067: Fixed showNext and showPrevious endless event firing.
//	05-07-13	D. Cilley		FB 14119: Fixed AnnotationController initialization if scripts were already loaded.
//	06-14-13	D. Cilley		FB 14194: Fixed a bug that would initially load the first few pages twice.
//	07-15-13	D. Cilley		FB 14215: Added beforehandlerrequest and handlerreturned events.
//	08-30-13	D. Cilley		FB 14274: Added Thumbnailer functionality.
//	08-30-13	D. Cilley		FB 14275: Fixed multi-loading scripts when there's more than one WDV.
//	08-30-13	D. Cilley		FB 14276: Fixed visual fitting problem.
//	09-12-13	D. Cilley		FB 14305: Removed unnecessary scrollbar resizes for overscroll in WDT.
//	09-16-13	D. Cilley		FB 14333: Fixed annotation paper centering on thumbs.
//	09-19-13	D. Cilley		FB 14345: Fixed annotation paper sizing on page zoom.
//	11-06-13	D. Cilley		FB 14453: Added config to allow/disable flick scrolling.
//	11-06-13	D. Cilley		FB 14454: Added config to change the number of pages in buffer.
//	11-12-13	D. Cilley		FB 14186: Added ability to cancel or switch annotation drawing.
//	12-03-13	D. Cilley		FB 14071: Removed jquery.browser dependency.
//	12-17-13	D. Cilley		FB 14478: Fixed overscroll after scrolling to the bottom with the scrollbar thumb.
//	01-16-14	D. Cilley		Bug 293573: Fixed scroll position calculations while zooming.
//	01-24-14	D. Cilley		Bug 293565, 282529, 282620, 293575, 293574: Fixed bugs when paper was sized improperly.
//	01-28-14	D. Cilley		Bug 293824: Removed need for trailing slash on config.scripturl.
//	02-06-14	D. Cilley		Bug 309834: Fixed openUrl hang, and added public empty function.
//	03-18-14	D. Cilley		Bug 316222: Moved zoomStart zoomInstant and zoomEnd to _wdvInternals.
//	03-18-14	D. Cilley		Bug 316083: Fixed Fitting.Best config option.
//	08-12-14	D. Cilley		Bug 367422: Fixed a bug that would cause an error when a pageref was undefined.
//	08-14-14	D. Cilley		Bug 345109: Added framework for horizontal scrolling and grid layout.
//	08-27-14	D. Cilley		Bug 367422: Fixed a bug that would use old mapping for newly opened documents.
//	09-29-14	D. Cilley		Bug 369024: Fixed scrolling to page indicated on tooltip after scroll thumb was grabbed.
//	09-30-14	D. Cilley		Bug 367012: Added support for multiple page view, and differing sizes.
//	10-01-14	D. Cilley		Bug 369093: Fixed mouse wheel scrolling scrollbar desync.
//	10-02-14	D. Cilley		Bug 369053: Fixed initial clicking of the scrollbar.
//	11-07-14	D. Cilley		Bug 374493: Fixed a bug that would make too many image requests while scrolling after a zoom.
//	11-12-14	D. Cilley		Bug 403851: Added tracking of image resources to accomodate low memory machines.
//	12-17-14	D. Cilley		Bug 550581: Added locally scoped non-conflict jQuery.
//	01-16-15	D. Cilley		Bug 556294: Added image dispose to help with mapsto exceptions.
//	01-28-15	D. Cilley		Task 568577: Added Jpeg property.
//	01-29-15	D. Cilley		Bug 562652: Fixed poor performance when scrolling fast.
//	02-03-15	D. Cilley		Bug 571361: Fixed first page refresh after loading new document.
//	02-04-15	D. Cilley		Bug 549465: Fixed scrollTo and scrollBy when scrolling past available space.
//	02-18-15	D. Cilley		Bug 583364: Fixed a couple bugs that let the viewer scroll past last page.
//	02-19-15	D. Cilley		Bug 560725: Fixed multiple bugs that caused thumbnails not to be displayed.
//	02-26-15	D. Cilley		Bug 560686: Fixed multiple problems with navigation when scrolling.
//	03-11-15	D. Cilley		Bug 588639: Fixed off by one bugs in showPage and showPageAsync.
//	03-11-15	D. Cilley		Bug 587585: Fixed showPage() when requested to advance one page.
//	03-18-15	D. Cilley		Bug 589812: Fixed showPage() call that requests too many next pages.
//	04-06-15	D. Cilley		Bug 593013: Fixed column sizing when thumbs are scrolled quickly.
//	04-10-15	D. Cilley		Bug 596029: Fixed a bug in showPage() when used in a callback from openUrl.
//	05-01-15	D. Cilley		Bug 608515: Added vector flag for enabling zoom past 1.
//	06-04-15	A. Huck			Bug	610232: Removed call to __redrawVisiblePages in __onScroll.
//	06-17-15	D. Cilley		Bug 607631: Added config property to change page selection location.
//	06-24-15	D. Cilley		Bug 622231: Fixed secondary scrollbar when both are needed.
//	07-01-15	D. Cilley		Bug 561087: Fixed config.zoom initial setting.
//	07-02-15	D. Cilley		Bug 625845: Exposed dispose method.
//	07-08-15	D. Cilley		Bug 625900: Fixed zoom past 100%.
//	07-10-15	D. Cilley		Bug 629656: Added pagenumberchanged event.
//	07-16-15	G. Ermakov		Bug 618782: Incorrect scrolling when wrong image size detected. __CPimgUpdateSize to use naturalWidth/Height props. 
//	08-14-15	D. Cilley		Bug 635773: Fixed thumbnailer not clickable after opening a second image.
//	09-01-15	D. Cilley		Task 630965: Added event bind tracking and intellisense.
//	09-15-15	D. Cilley		Bug 627869: Added support for forcing all pages to be fit into the same size.
//	09-21-15	D. Cilley		Bug 635949: Fixed multiple scroll related issues, and page number label location.
//	09-22-15	D. Cilley		Bug 647639, 647645: Fixed more scroll related issues.
//	09-23-15	D. Cilley		Bug 647643: Fixed zooming to 1:1 with forcepagefit.
//	09-30-15	D. Cilley		Bug 610232: Fixed __redrawVisiblePages so that it would stop unecessarily redrawing annotation and form layers.
//	10-01-15	D. Cilley		Bug 649407: Fixed toolbar page number after loading a new doc.
//	10-02-15	D. Cilley		Bug 649406: Fixed fitting while forcepagefit == true.
//	10-07-15	D. Cilley		Bug 649408: Fixed scrollbar not able to scroll past a certain point after loading a new doc.
//	10-08-15	D. Cilley		Bug 652306: Fixed __showNext and __showPrev when increment of zero was passed in.
//	11-02-15	D. Cilley		Bug 656878: Fixed a bug that would cause multiple images to be displayed on a page.
//	11-18-15	D. Cilley		Bug 664373, 665129: Fixed a bug that would cause too many image requests when scrolling up.
//	11-19-15	D. Cilley		Bug 656878: Fixed a bug that would cause multiple images to be displayed on a page.
//	12-04-15	D. Cilley		Bug 670919, 670924, 670938: Fixed several ZoomArea bugs.
//	12-20-15	D. Cilley		Bug 670911: Fixed rubberband conflicts with forcepagefit config option.
//-------------------------------------------------------------------------------------------------

// JSHint options and globals
/*jshint eqnull: true, undef: true, jquery: true, browser: true, es3:false */

// #region Startup
// Local globals
/*global Raphael, jQuery */

// Check for jQuery
(function () {
    // parses a dot delimited version string into a float that we can compare with
    function parseVersionFloat(s) {
        var val = 0;
        var parts = ('' + s).replace('_', '.').replace(/[^0-9.]/g, '').split('.');

        for (var i = 0; i < parts.length; ++i) {
            val += Number(parts[i]) / Math.pow(10, i * 3);
        }

        return val;
    }

    var jqVersion = '1.7.1';
    if (typeof jQuery !== 'undefined') {
        if (parseVersionFloat(jQuery().jquery) < parseVersionFloat(jqVersion)) {
            throw 'Early jQuery version found: ' + jQuery().jquery + ', version expected: ' + jqVersion;
        }

        // add version parsing to jQuery
        if (!jQuery.isFunction(jQuery.fn.parseVersionFloat)) {
            jQuery.parseVersionFloat = parseVersionFloat;
            jQuery.fn.parseVersionFloat = parseVersionFloat;
        }
    } else {
        throw 'jQuery not found. The WebDocumentViewer requires jQuery version ' + jqVersion + ' or later.';
    }
})();

/**
 *  Main Atalasoft Namespace definition(s)
 *  @namespace Atalasoft
 */
var Atalasoft = jQuery.extend(true, Atalasoft, {
    /**
     * @namespace Atalasoft.Annotations
     */
    Annotations: {},

    /**
     * Contains Atalasoft imaging controls.
     * @namespace Atalasoft.Controls
     */
    Controls: {},

    /**
     * @namespace Atalasoft.Document
     * @private
     */
    Document: {},

    /**
     * @namespace Atalasoft.Forms
     * @private
     */
    Forms: {},

    /**
     * @namespace Atalasoft.Text
     * @private
     */
    Text: {},

    /**
     * @namespace Atalasoft.Utils
     */
    Utils: {}
});

// #endregion

(function () {
    Atalasoft.Controls.Version = [11,0,0,517];
    var _Statics = {
        instanceCounter: 0
    };

    /**
         * Control that views, modifies, and saves documents, annotations and forms.
         * @param {WebDocumentViewerConfig} [settings] Object of key value pairs representing initial settings
         * @param {OpenUrlCallback} [openCallback] callback that is called when document load complete(if {@link WebDocumentViewerConfig.documenturl| documenturl} is specified).
         * @class
         * @returns {WebDocumentViewer} A new control with the given settings.
         */
    Atalasoft.Controls.WebDocumentViewer = function (settings, openCallback) {
        var $ = Atalasoft.$;
        var _self = { typeOf: settings.type || 'Atalasoft.Controls.WebDocumentViewer' };
        var _isThumbnailer = _self.typeOf === 'Atalasoft.Controls.WebDocumentThumbnailer';

        var _id = '';
        var _zmd = 150; // zoom animation duration (ms)
        var _scd = 500; // scroll animation duration (ms)
        var _iconClass = 'atala-ui-icon';
        var _garbage = document.createElement('div');

        var _jqe = $({}); // jquery instance to bind events to
        var _internalEvents = $({}); //internal events instance for private communications.

        var _stateManager = new Atalasoft.Controls.DocumentStateManager(__getStateManagerApi());

        /**
         * Internal jQuery DOM objects
         * @private
         */
        var _dom = {
            /** Main outer object that holds the scrollbars */
            main: null,
            /** Toolbar wrapper object */
            toolbar: null,
            /** Inner object that controls scrolling */
            scroller: null,
            /** Inner object that defines the viewable area */
            viewport: null,
            /** Inner content container object */
            content: null,
            /** Inner horizontal scroll bar object */
            scrollH: null,
            /** Inner vertical scroll bar object */
            scrollV: null,
            /** Edge objects of viewable area */
            edges: [],
            /** Image objects already requested */
            loadedImgs: [],
            /** Page wrapper objects recycle pool */
            pageDivs: [],
            /** Span tag containing the page number */
            pageLabel: null,
            /** Status div */
            status: null
        };

        // Atalasoft Objects
        var _controllers = {
            annotations: null, // annotation controller
            document: null, // document manipulation controller
            forms: null, // form controller
            mouseTool: null, // mousetool controller
            memory: null, // memory controller
            text: null // text controller
        };

        // Atalasoft Enums
        var _fitting = Atalasoft.Utils.Fitting;
        var _direction = Atalasoft.Utils.ScrollDirection;
        var _toolTypes = Atalasoft.Utils.MouseToolType;

        // page values
        var _page = __createEmptyPageDataObject();

        // state values
        var _state = __createEmptyStateObject();

        // shortcut for enumeration.
        var _domClasses = Atalasoft.Controls.WebDocumentViewer.domclasses;
        // shortcut for enumeration.
        var _domAttributes = Atalasoft.Controls.WebDocumentViewer.domattributes;

        // events
        /**
         * @lends Atalasoft.Controls.WebDocumentViewer
         */
        var _events = {
            /**
             * @typedef {Object} Request
             * @property {string} method - The request HTTP method.
             * @property {Object} data - The request parameters that will be send to server.
             * @property {string} type - The request type identifier.
             * Supported request types are:
             *
             * |Identifier| Description|
             * | ----- | ------- |
             * |`docinfo` | Document info request. Maps to `DocumentInfoRequested` server event.|
             * |`docpage` | Document page request. Could be issued multiple times - it's expected that page will be served from browser cache for the same query. Maps to `ImageRequested` server event.|
             * |`docsave` | Document save request. Maps to `DocumentSave` server event.|
             * |`annodata` | Annotation data request. Maps to `AnnotationDataRequested` server event.|
             * |`formdata` | Forms data request. Maps to `PdfFormRequested` server event.|
             * |`pagetextdata` | Maps to `PageTextRequested` server event.|
             */

            /**
             * Callback signature for
             * @callback BeforeHandlerRequestCallback {@link Atalasoft.Controls.WebDocumentViewer#event:beforehandlerrequest} event.
             * @param {Object} event - The event object.
             * @param {Request} event.request - The request object.
             */

            /**
             * Triggers before a request is sent to the server.
             * @event Atalasoft.Controls.WebDocumentViewer#beforehandlerrequest
             * @type {BeforeHandlerRequestCallback}
             * @param {Object} event - The event object.
             * @param {Request} event.request - The request object.
             *
             * This event could be used to override or extend request parameters which is exposed through `event.request.data`.
             * Requests could be distinguished using `event.request.type` field. For supported request types see {@link Request} structure.
             */
            beforehandlerrequest: null,

            /**
             *  Triggers when the document info has changed, usually after a new document is opened.
             *  @event Atalasoft.Controls.WebDocumentViewer#documentinfochanged
             *  @type {NotificationCallback}
             */
            documentinfochanged: null,

            /** Triggers when the document is done loading.
             * @event Atalasoft.Controls.WebDocumentViewer#documentloaded
             * @type {NotificationCallback}
             */
            documentloaded: null,

            /**
             * Triggers when viewer has been activated by another thumbnailer or reactivated by the same thumbnailer with changed document data.
             */
            activedocumentchanged: null,

            /** Triggers after a response from the server while saving the document.
             * @event Atalasoft.Controls.WebDocumentViewer#documentsaved
             * @param {Object} event - The event object.
             * @param {boolean} event.success - Flag indicating whether save were successful.
             */
            documentsaved: null,

            /**
             * Triggers when the document has been unloaded from the control.
             * @event Atalasoft.Controls.WebDocumentViewer#documentunloaded
             * @type {NotificationCallback}
             */
            documentunloaded: null,

            /**
             * Callback signature for {@link Atalasoft.Controls.WebDocumentViewer#event:error} event.
             * @callback ErrorCallback
             * @param {Object} event - The event object.
             * @param {string} event.name - The error type identifier.
             * @param {string} event.message - The error clarification message.
             */

            /** Triggers when the control has encountered and error. Populated keys: e.name, e.message
             * @event Atalasoft.Controls.WebDocumentViewer#error
             * @param {Object} event - The event object.
             * @param {string} event.name - The error type identifier.
             * @param {string} event.message - The error clarification message.
             * @type {ErrorCallback}
             */
            error: null,

            /** Triggers when the control has completed asynchronous initialization.
             *
             * Asynchronous initialization happens when some dependent scripts are not included to web page and control trying to load them on background.
             * In case of synchronous initialization, this event won't be fired. {@link Atalasoft.Controls.WebDocumentViewer#isReady| isReady} method could be used after construction to check whether control is initialized.
             * @event Atalasoft.Controls.WebDocumentViewer#initialized
             * @type {NotificationCallback}
             */
            initialized: null,

            /**
             * Triggers when the page number has changed. Populated keys: e.number
             * @event Atalasoft.Controls.WebDocumentViewer#pagenumberchanged
             * @param {Object} event - The event object.
             */
            pagenumberchanged: null,

            /** Triggers when the control has recycled a pageDiv object.
             * @event Atalasoft.Controls.WebDocumentViewer#pagerecycled
             * @param {Object} event - The event object.
             * @param {number} event.index - Index of the recycled page.
             */
            pagerecycled: null,

            /**
             * Triggers when the control has resized a pageDiv object.
             * @event Atalasoft.Controls.WebDocumentViewer#pageresize
             * @param {Object} event - The event object.
             * @param {number} event.index - Index of the resized page.
             * @param {number} event.width - Width of the page after resize.
             * @param {number} event.height - Height of the recycled page.
             */
            pageresize: null,

            /** Triggers when the control has shown a page in the viewable area.
             * @event Atalasoft.Controls.WebDocumentViewer#pageshown
             * @param {Object} event - The event object.
             * @param {number} event.index - Index of the page.
             */
            pageshown: null,

            /** Triggers when the page size returned from the server is different than expected. The expected page size is the size returned from server along with other document info.
             * @event Atalasoft.Controls.WebDocumentViewer#pagesizechanged
             * @param {Object} event - The event object.
             * @param {number} event.index - Index of the resized page.
             * @param {number} event.width - Width of the page after resize.
             * @param {number} event.height - Height of the recycled page.
             * @param {number} event.dx - Difference with the previous(expected) page width. Scaled images are compared.
             * @param {number} event.dy - Difference with the previous(expected) page height. Scaled images are compared.
             */
            pagesizechanged: null,

            /** Triggers for every pixel movement registered by the scrollable area.
             * @event Atalasoft.Controls.WebDocumentViewer#scroll
             * @param {Object} event - The event object.
             * @param {number} event.x - Horizontal scroll position.
             * @param {number} event.y - Vertical scroll position.
             * @param {number} event.dx - Distance scrolled horizontally.
             * @param {number} event.dy - Distance scrolled vertically.
             */
            scroll: null,

            /**
             *@private 
             */
            scrollFinished: null,

            /** Triggers when dependencies have finished loading.
             * @event Atalasoft.Controls.WebDocumentViewer#scriptsloaded
             * @type {NotificationCallback}
             */
            scriptsloaded: null,

            /** Triggers when the control has updated the status bar.
             * @event Atalasoft.Controls.WebDocumentViewer#statusmessage
             * @param {Object} event - The event object.
             * @param {string} event.message - The status message.
             */
            statusmessage: null,

            /** Triggers when a zoom operation has been started.
             * @event Atalasoft.Controls.WebDocumentViewer#zoomstarted
             * @type {NotificationCallback}
             */
            zoomstarted: null,

            /** Triggers when the zoom level of the control has changed.
             * @event Atalasoft.Controls.WebDocumentViewer#zoomchanged
             * @param {Object} event - The event object.
             * @param {number} zoom - Current document zoom value.
             */
            zoomchanged: null
        };

        // config object
        /**
         * Represents {@link Atalasoft.Controls.WebDocumentViewer|WebDocumentViewer} configuration.
         * @atalaconfig
         * @alias WebDocumentViewerConfig
         */
        var _config = {
            /**
             * @property {boolean} [allowannotations=false] - Turns annotation support on or off.
             * This affects both UI annotations toolbar appearance and corresponding API methods behavior.
             * If set to `false`, {@link Atalasoft.Controls.WebDocumentViewer#annotations|WebDocumentViewer.annotations} will be set to `null` and annotation-related methods of {@link Atalasoft.Controls.WebDocumentViewer |WebDocumentViewer} will throw errors.
             */
            allowannotations: false,

            /**
             * @property {boolean} [allowflick=true] - Turns flick scrolling support on or off.
             */
            allowflick: true,

            /**
             * @property {boolean} [allowforms=false] - Turns forms support on or off.
             */
            allowforms: false,

            /**
             * @property {boolean} [allowtext=false] - Turns text selection support on or off.
             */
            allowtext: false,

            /**
             * @property {AnnotationsConfig} [annotations] - Annotations specific config options, including predefined configurations for particular annotation types.
             */
            annotations: {
                /**
                 * Represents default configuration for various types of annotations.
                 * @typedef {Object} AnnotationsConfig
                 * @property {AnnotationData[]} [defaults] - Pre defined annotations to be drawn with the mouse.
                 * @property {AnnotationData[]} [stamps] - Pre defined stamp annotations to be drawn with the mouse.
                 * @property {AnnotationData[]} [images] - Pre defined image annotations to be drawn with the mouse.
                 * @property {boolean} [saveusername] - Indicates whether the server handler will save the username property when saving all
                 */

                //TODO: set link to custom annotations tutorial
                /**
                 * Predefined annotations to be drawn with the mouse.
                 */
                defaults: null,

                /**
                 * Predefined stamp annotations to be drawn with the mouse.
                 */
                stamps: null,

                /**
                 * Pre defined image annotations to be drawn with the mouse.
                 */
                images: null,

                /**
                 * Indicates whether the server handler will save the username property when saving all annotations.
                 */
                saveusername: false
            },

            /**
             * @property {number} [columns] - Number of columns to show when displaying tabular pages, -1 is automatic. */
            columns: -1,

            /** @property {Atalasoft.Utils.ScrollDirection} [direction = Vertical] - Scroll direction of the viewer.
             *
             * i.e. controls whether document pages positioned in vertical or horizontal direction.
             */
            direction: _direction.Vertical,

            /**
             * @property {string} [documenturl] - Identifier of the document (that is on the server) to be displayed when the document is first opened.
             *
             * By default `documenturl` is treated as an url to the image file on server. Application could customize server behavior and in this case `documenturl` could contain arbitrary string.
             * If this parameter is specified, document will be opened right after viewer initialization completes. Otherwise document should be opened using {@link Atalasoft.Controls.WebDocumentViewer.openUrl | openUrl} method.
             *
             * This property on the {@link Atalasoft.Controls.WebDocumentViewer#config|viewer.config} is updated internally each time new document is opened.
             */
            documenturl: '',

            /**
             *  @property {string} [annotationsurl] Identifier of the annotation data (an .xmp file on the server) that should be displayed along with the displayed document.
             *
             *  By default `annotationsurl` is treated as an url to the serialized annotations data file on server(usually .xmp). Application could customize server behavior and in this case `annotationsurl` could contain arbitrary string.
             *
             *  This property on the {@link Atalasoft.Controls.WebDocumentViewer#config|viewer.config} is updated internally each time new document is opened.
             */
            annotationsurl: '',

            /**
             * @property {string} [formurl] - Identifier of the annotation data PDF form data (.pdf file on the server) that should be displayed along with the displayed document.
             *
             * In most cases this option should be omitted, so forms will be loaded from the PDF document specified by {@link WebDocumentViewerConfig.documenturl | documenturl}
             *
             * This property on the {@link Atalasoft.Controls.WebDocumentViewer#config|viewer.config} is updated internally each time new document is opened.
             */
            formurl: '',

            /**
             * @property {Atalasoft.Utils.Fitting} [fitting = Width] - Specifies the initial page image fit when document is opened in the viewer.
             *
             * Usually it makes sense to set initial fit to viewer width for vertical scrolling {@link WebDocumentViewerConfig.direction|direction} and to height for horizontal.
             */
            fitting: _fitting.Width,

            /**
             * @property {boolean} [forcepagefit=false] - Specifies whether document pages should be unified basing on the expected document page size.
             *
             * Expected page size is sent by server when opening new document. By default it's the size of the first page in document, but any values could be provided when default behavior is overridden by application.
             *
             * It's recommended to set this option to `true` for most documents.
             *
             * Setting this property to true have following benefits:
             * - Pages looks similar even for documents containing pages with having different sizes(or different DPI). Aspect ratio is preserved when calculating unification zoom ratio, so pages are not completely same. But in most cases they would have same width or height.
             *
             * - Pages are requested on demand, so size of each individual page is not known util it's loaded from server. Thus when pages having different sizes are inserted into DOM, their sizes are different from expected. This would cause resizing of the DOM elements and thus cause visual shifts of the images. Especially such effect could be noticeable on big images, when rendering and load time is bigger then usual.
             *
             * Setting this option to false is helpful when document having pages both "small" and "big" pages and those pages should be displayed as is, without additional zoom. For example, when driver license and scanned pages are displayed as a single document.
             */
            forcepagefit: false,

            /**
             * @property [forcepagesize] - Allows a custom page size to be used for force fitting all pages to. Ignored if forcepagefit is false.
             * @private
             */
            forcepagesize: {
                height: -1,
                width: -1
            },

            /**
             *  @property {boolean} [jpeg=false] - Allows page images to be returned as jpeg instead of png.
             */
            jpeg: false,

            /**
             *  @property {number} [maxwidth=3000] - Specifies the maximum amount of pixel width allowed for zooming in.
             *
             *  This property is intended to limit size of the images data transferred over the wire on big zoom values.
             */
            maxwidth: 3000,

            /**
             *  @property {number} [memorythreshold=500000000] - Maximum number of bytes in memory before larger memory objects are recycled.
             *
             *  DOM image objects are cached internally. This option allows to control memory usage on the browser page. Note, that estimated image sizes are not exactly match actual values - estimation is based on the expected document images color format and size. So actual memory usage in browser process could differ from the configured value.
             */
            memorythreshold: 500000000,

            /**
             *  @property {number} [minwidth=150] - Specifies the minimum amount of pixel width allowed for zooming out.
             */
            minwidth: 150,

            /**
             *  @property {number} [pageborderwidth=1] - Specifies the pixel border width around each page in a document.
             *  */
            pageborderwidth: 1,

            /**
             * @property {number} [pagebuffersize] - The number of pages to keep in memory while scrolling. Negative values will automatically calculate the optimal number based on available screen space. Values lower than can be displayed will be ignored, and higher values will cause a degradation in performance. */
            pagebuffersize: -1,

            /**
             *  @property {number} [pagespacing=4] - Specifies the distance (in pixels) between pages displayed.
             */
            pagespacing: 4,

            /**
             * @property {Atalasoft.Utils.PageSelection} [pageselectlocation] - Specifies the location to determine the current page number.
             *
             * Current page number is displayed on the document toolbar, and also current page is used in some operation in default UI, like page rotation is applied to the current page or in {@link Atalasoft.Controls.WebDocumentViewer.next | next}, {@link Atalasoft.Controls.WebDocumentViewer.previous | previous}, {@link Atalasoft.Controls.WebDocumentViewer.showPage | showPage} methods.
             */
            pageselectlocation: $.extend({}, Atalasoft.Utils.PageSelection.TopLeft),

            /**
             * @property {Object} parent - jQuery object that the control will contain the control. */
            parent: null,

            /** @property {number} [rows] - Number of rows to show when displaying tabular pages, -1 is automatic.
             * @deprecated tabular horizontal layout is not consistent with horizontal scrolling and will be removed. Use tabular layout with vertical scrolling and columns configuration. The value of this property will be ignored.
             * @ignore
             */
            rows: -1,

            /**
             * @property {string} [savefileformat] - Specifies the default file format for the document that will be used when saving multipage document to the server.
             *
             * The following formats are supported: pdf, tiff (or tif), jpeg (or jpg), png, bmp, tga, pcx, psd, tla, wbmp, emf, wmf.
             *
             * If set, this value is used when document save is performed using default UI or when {@link Atalasoft.Controls.WebDocumentViewer.save | save} is called without save format parameter passed.
             *
             * If not specified, document is saved in it's own format. Note that it's not possible to save multipage documents(for example when document pages was added using JavaScript API) to the single page image format by default. Server behavior on save could be highly customized.
             */
            savefileformat: '',

            /**
             * @property {string} [savepath] - Specifies the path that the document, annotation data, and form data will be saved to on the server.
             */
            savepath: '',

            /**
             *  @property {string} [scripturl] - Url location to the server where all JavaScript files are put when not in the default location.
             */
            scripturl: '',

            /**
             *  @property {string} serverurl - Url location to the server handler.
             */
            serverurl: '',

            /**
             *  @property {boolean} [showbuttontext=true] - If the toolbar is displayed, this can be used to hide or show the button text for the toolbar items.
             */
            showbuttontext: true,

            /**
             * @property {boolean} [showpageborder=true] - Specifies whether a black border will be added around each page in the displayed document. */
            showpageborder: true,

            /**
             * @property {boolean} [showpagenumber=true] - Specifies whether a page number will be added to the bottom left of each page. */
            showpagenumber: true,

            /**
             * @property {boolean} [showpagenumbertooltip=true] - Specifies whether a tooltip containing estimated current page number should be shown during fast scrolling. */
            showpagenumbertooltip: true,

            /**
             * @property {boolean} [showerrors=false] - Specifies whether error messages are allowed to show up in the console instead of being caught. */
            showerrors: false,

            /**
             * @property {boolean} [showstatus=false] - Specifies whether status messages will be output to an area in the toolbar. */
            showstatus: false,

            /**
             * @property {boolean} [showscrollbars=true] - Specifies whether scrollbars will be shown. */
            showscrollbars: true,

            /**
             * @property {boolean} [showselecttools=false] - Specifies whether rubberband selection tools are shown in the toolbar. */
            showselecttools: false,

            /**
             * @property {boolean} [tabular=false] - Specifies whether pages should be displayed in a tabular(grid) fashion, rather than one row or column. */
            tabular: false,

            /**
             * @property {Object} [toolbarparent] - Specifies the jQuery object where the toolbar will be created. */
            toolbarparent: null,

            /** @property {number} [zoom] - Sets the initial zoom level of the document. Ignored when fitting set to anything besides Fitting.None. */
            zoom: 1,

            /**
             * @ignore
             */
            showthumbcaption: false,

            /**
             * @ignore
             */
            thumbcaptionformat: '',

            /**
             * @property {boolean} [persistrotation=true] - Specifies whether to persist page rotation on document save.
             *
             * I.e of set to `false`, rotation applied in 'view-only' mode and ignored when document is saved.
             */
            persistrotation: true,

            /**
             * @property {boolean} [showrotatetools=true] - Specifies whether page and annotations rotation UI handles and buttons are shown.
             *
             * Annotation rotation could be explicitly enabled or disabled for individual types of annotations using {@link WebDocumentViewerConfig.annotations|annotations.defaults}. */
            showrotatetools: true,

            /** @property {MouseToolConfig|Atalasoft.Utils.MouseToolType} [mousetool] - Specifies the mouse tools settings. Could be set to Atalasoft.Utils.MouseToolType if no advanced settings specified.
             *
             * Mouse tool identifies how user mouse or touch actions ar interpreted. For example, this could be Pan tool to scroll pages, Zoom-Area tool to select image region and zoom to it, Text tool to select and copy document text, etc.
             *
             * Active mouse tool could be changed using {@link Atalasoft.Controls.WebDocumentViewer.setMouseTool | setMouseTool} method.
             */
            mousetool: {
                /**
                 * @typedef {Object} MouseToolConfig
                 *
                 * @property {Atalasoft.Utils.MouseToolType} [type = Pan] - default mouse tool. This tool is enabled each time new document is loaded.
                 * @property {TextMouseToolConfig} [text] - Text selection behavior configuration.
                 */

                type: _toolTypes.Pan,

                /** Specifies the default text selection settings*/
                text: {
                    /**
                     * @typedef {Object} TextMouseToolConfig
                     *
                     * @property [Atalasoft.Utils.ScrollArea] [scrolltriggerarea = Normal] - Specifies the percentage of type of scroll trigger area. When selecting text in that area around page bounds scrolling will be triggered for corresponding direction.
                     *
                     * @property {number} [throttlingtreshold=40] - Milliseconds throttling threshold for text selection UI operations. 0 performs selection without throttling barrier, most CPU intensive. I.e. setting this to 0 causes selection calculation on each corresponding browser mouse event.
                     *
                     * @property {Object} [selection] - Specifies the text selection highlight settings.
                     * @property {string} [selection.color='blue'] - Specifies the fill color for selected text.
                     * @property {number} [selection.alpha = 0.25] - Specifies the selected text highlighting transparency level.
                     *
                     * @property {Object} [highlight] - Specifies the search results highlight settings.
                     * @property {string} [highlight.color='yellow'] - Specifies the fill color for search results highlight.
                     * @property {number} [highlight.alpha = 0.7] - Specifies the transparency level for search results highlight.
                     *
                     * @property {boolean} [hookcopy=false] - Control subscribes to ctrl+c key combination. If so, selected text will be copied to clipboard when uses press ctrl+c.
                     *
                     * Alternatively application could apply it's own logic for ctrl+c - for example, grab selected text using {Atalasoft.Controls.WebDocumentViewer~TextController#getSelected| getSelected} method and let user to edit it before copying.
                     *
                     * @property {boolean} [allowsearch=true] - Specifies whether to show default search UI.
                     *
                     * @property {boolean} [wrapsearch=true] - Specifies whether default text search is wrapped.
                     *
                     * @property {number} [searchdelay=400] - Specifies the milliseconds timeout before triggering text search when text is modified in search textbox.
                     *
                     * This allows to delay potentially search operation start while user still types query text.
                     */

                    scrolltriggerarea: Atalasoft.Utils.ScrollArea.Normal,

                    /**
                     *  Specifies scroll delta in pixels that are applied when selecting text within viewport scroll trigger area
                     *  @private
                     */
                    innerscrolldelta: 10,

                    /**
                     * Specifies scroll delta in pixels that are applied when selecting text and mouse goes out of viewport.
                     * @private
                     */
                    outerscrolldelta: 20,

                    /** Specifies  */
                    throttlingtreshold: 40,

                    selection: {
                        color: 'blue',
                        alpha: 0.25
                    },

                    highlight: {
                        color: 'yellow',
                        alpha: 0.7
                    },

                    hookcopy: false,
                    allowsearch: true,
                    wrapsearch: true,
                    searchdelay: 400
                }
            }
        };

        // map settings onto config
        if (settings) {
            var mousetool = settings.mousetool;
            if (settings.mousetool && _typeof(settings.mousetool) !== "object") {
                settings.mousetool = $.extend({}, _config.mousetool, { type: mousetool });
            }

            // horizontal tabular layout with rows > 1 is deprecated and vertical tabular layout with columns == 1 doesn't have sense but have bugs.
            if (settings.tabular && (settings.direction === Atalasoft.Utils.ScrollDirection.Horizontal || settings.columns === 1)) {
                settings.tabular = false;
            }

            $.extend(true, _config, settings);
            settings.mousetool = mousetool;
        }

        __validateConfig();
        __generateID();

        // #region Exposed Internals
        /**
         * @member {WebDocumentViewerConfig} config - Current control configuration.
         * @memberOf Atalasoft.Controls.WebDocumentViewer
         * @instance
         * @alias config
         */
        _self.config = _config;
        /** WARNING: Changing values from these references can cause instability.*/
        _self.events = _events;
        /** WARNING: Changing values from these references can cause instability.*/
        _self.domclasses = _domClasses;
        /** WARNING: Changing values from these references can cause instability.*/
        _self.domattributes = _domAttributes;

        /**
         * @member {Atalasoft.Controls.WebDocumentViewer~AnnotationController} annotations - Annotations API. Will be available if {@link WebDocumentViewerConfig.allowannotations| config.allowannotations} is set to `true`. Otherwise will be `undefined`
         * @instance
         * @memberOf Atalasoft.Controls.WebDocumentViewer
         */

        /**
         * @member {Atalasoft.Controls.WebDocumentViewer~DocumentController} document - Document operations API.
         * @instance
         * @memberOf Atalasoft.Controls.WebDocumentViewer
         */

        /**
         * @member {Atalasoft.Controls.WebDocumentViewer~TextController} text - Text selection API.
         * @instance
         * @memberOf Atalasoft.Controls.WebDocumentViewer
         */

        // #endregion

        // gets the IViewerApi object to initialize state manager.
        function __getStateManagerApi() {
            return {
                get: function get() {
                    return _self;
                },
                isInitialized: __isReady,
                switchDocument: __switchDocument,
                closeDocument: __closeDocument
            };
        }

        // #region Control LifeCycle
        function __preInit() {
            if (!__isReady()) {
                _page = __createEmptyPageDataObject();
                _state = __createEmptyStateObject();
            }
            Atalasoft.Utils._scriptLoader = Atalasoft.Utils.__loadDependencies(_config.scripturl, _config.allowannotations, __throwError);

            var internals = {
                _config: _config,
                _id: _id,
                _dom: _dom,
                _document: _dom.loadedImgs,
                _pages: _dom.pageDivs,
                _state: _state,
                _internalEvents: _internalEvents,
                _controllers: _controllers,

                createDOM: __createDOM,
                createDiv: __createDiv,
                createDialog: __createDialog,
                createDropDownButton: __createDropDownButton,
                createDropDownMenu: __createDropDownMenu,
                createMenu: __createMenu,
                drawAnnotation: __drawAnnotation,
                redrawVisiblePages: __redrawVisiblePages,
                adjustVisiblePages: __adjustVisiblePages,
                startDomManipulation: __startDomManipulation,
                endDomManipulation: __endDomManipulation,
                redrawPageFromIndex: __redrawPageFromIndex,
                makeHandlerRequest: __makeHandlerRequest,
                getPageScale: __getPageScale,
                getPageSize: __getPageSize,
                getSourcePageSize: __getServerPageSize,
                getPageRotation: __getPageRotation,
                getViewerTransform: __getViewerTransform,
                isPageInView: __isPageInView,
                findPageFromIndex: __findPageFromIndex,
                showPagePoint: __showPagePoint
            };

            _controllers.document = new Atalasoft.Document.ManipulationController(_self, internals, _id);
            // re-set public api functions, so internal and external api points to the same data.
            _self.document = _controllers.document.__exposedApi;

            if (_config.allowannotations) {
                _controllers.annotations = new Atalasoft.Annotations.AnnotationController(_self, internals, _isThumbnailer);
                _self.annotations = _controllers.annotations.__exposedApi;
            } else {
                // annotation methods need to exist to throw an error
                _self.deselectAll = __annotationsAllowed;
                _self.createAnnotationOnPage = __annotationsAllowed;
                _self.getAnnotationsFromPage = __annotationsAllowed;
                _self.deleteAnnotationOnPageAtIndex = __annotationsAllowed;
                _self.setAnnotationDefaults = __annotationsAllowed;
                _self.setImages = __annotationsAllowed;
                _self.setStamps = __annotationsAllowed;
            }

            if (_config.allowforms && !_controllers.forms) {
                _controllers.forms = new Atalasoft.Forms.FormController(_self, internals);
                _self.forms = _controllers.forms.__exposedApi;
            }

            if (_config.allowtext && !Atalasoft.Utils.Browser.Explorer8) {
                _controllers.text = new Atalasoft.Text.TextController(_self, internals, _config.mousetool ? _config.mousetool.text : {});
                _self.text = _controllers.text.__exposedApi;
            }

            var dependencyAwaited = typeof $.easing === 'undefined' || typeof $.ui === 'undefined' || _config.allowannotations && typeof Raphael === 'undefined';

            //TODO: determine if CSS file is missing and load it with below:
            //__injectCSSHeader(jsFileLoc + 'atalaWebDocumentViewer.css');

            if (dependencyAwaited) {
                if (Atalasoft.Utils._scriptLoader) {
                    Atalasoft.Utils._scriptLoader.bind({
                        scriptsloaded: __init
                    });
                }
            } else {
                // nothing is missing, time to initialize
                __init();
            }
        }

        function __createEmptyPageDataObject() {
            return {
                size: { width: 0, height: 0 },
                sizes: [{ width: 0, height: 0 }],
                smallest: { width: 0, height: 0 }, // smallest height and width seen so far, used to calculate page buffer size
                count: 0,
                number: -1,
                numberoutof: -1,
                buffer: 3,
                dpi: 96,
                vector: false,
                caption: ''
            };
        }
        function __createEmptyStateObject() {
            return {
                prpr: 0, // pause/resume page refresh
                batchoperation: 0,
                loading: false,
                zooming: false,
                initialized: false,
                newpagedivsize: null,
                newpagedivfullzoom: 1,
                scrollPos: { // scroll position, used for deltas
                    x: 0,
                    y: 0,
                    t: 0 // time of the scroll position from Date.getTime()
                },
                scrollBuffer: null, // timer for buffering scroll events
                scrollTimeout: null, // timer for detecting when scrolling is finished
                activepage: null,
                nextImageCacheIndex: 0
            };
        }

        // jshint ignore:start
        function __injectCSSHeader(s) {
            $('head').append('<link type="text/css" rel="stylesheet" href="' + s + '"/>');
        }
        // jshint ignore:end

        function __init() {
            if (_state.initialized === false) {
                _state.initialized = true;
            } else {
                return;
            }

            // handles errors from child objects (such as AnnotationController)
            __bindEvents({
                throwerror: __throwErrorChild,
                pagedivsresized: __onPageDivsResized,
                documentchanged: __onDocumentChanged,
                pagesizechanged: __onPageSizeChanged
            });

            // check parent element
            if (_config.parent) {
                if (!(_config.parent instanceof jQuery)) {
                    _config.parent = $(_config.parent);
                }

                if (!_config.parent.length) {
                    __throwError('InitError', 'Parent element not found.');
                }
            } else {
                // TODO: floating window?
                __throwError('InitError', 'No parent element given.');
            }

            // create and style main container objects
            _dom.toolbar = __createToolbars(_config.toolbarparent || _config.parent);
            _dom.toolbar.addClass(_domClasses.atala_toolbar);

            _dom.main = __createDiv(_config.parent);
            _dom.main.addClass(_domClasses.atala_main_container);

            _dom.scroller = __createDiv(_dom.main);
            _dom.scroller.addClass(_domClasses.atala_scroller);

            // removes text selection from the top level, we make exceptions for text annos 
            _dom.main.bind({
                selectstart: __onSelectStart
            });

            _dom.toolbar.attr('id', _id + '_toolbar');
            _dom.main.attr('id', _id + '_main');
            _dom.scroller.attr('id', _id + '_scroller');

            _dom.main.css({ 'height': '100%', 'width': '100%', 'position': 'relative' });
            _dom.scroller.css({ 'height': '100%', 'width': '100%', 'position': 'relative' });

            // main viewport object
            _dom.viewport = __createDiv(_dom.scroller, _id + '_vp');
            _dom.viewport.css({ 'overflow': 'hidden', fontSize: 0, 'touch-action': 'none' });
            _dom.viewport.addClass(_domClasses.atala_viewport);
            _dom.viewport.attr("tabindex", -1);

            // main content
            _dom.edges[0] = __createEdge(_dom.viewport, _id + '_e0');
            _dom.edges[0].addClass(_domClasses.atala_dom_edge_first);
            _dom.content = __createDiv(_dom.viewport, _id + '_ct');
            _dom.content.addClass(_domClasses.atala_content);
            _dom.content.css({
                '-ms-touch-action': 'none', // stop default touch behavour in IE 10+
                fontSize: 0, // inline-block page divs(for tabular layout) could give additional spaces that are not calculated by our code. remove them with such font size.
                overflow: 'hidden'
            });

            if (_config.direction === _direction.Horizontal) {
                _dom.content.css({ 'display': 'inline-block' });
            }

            _dom.edges[1] = __createEdge(_dom.viewport, _id + '_e1');
            _dom.edges[1].addClass(_domClasses.atala_dom_edge_last);

            if (Atalasoft.Utils.Browser.Features.Compatibility) {
                __throwError('InitError', 'Compatibility Mode is not supported.');
            }

            // don't bother showing scrollbars on mobile devices, since they don't show anyway
            if (!Atalasoft.Utils.Browser.Mobile.Any()) {
                if (_config.showscrollbars) {
                    _dom.scroller.css({ 'overflow': 'auto' });

                    _dom.scrollH = __createScrollbar(_dom.main, _direction.Horizontal);
                    _dom.scrollH.attr('id', _id + '_sH');
                    _dom.scrollH.addClass(_domClasses.atala_scroll_horizontal);

                    _dom.scrollV = __createScrollbar(_dom.main, _direction.Vertical);
                    _dom.scrollV.attr('id', _id + '_sV');
                    _dom.scrollV.addClass(_domClasses.atala_scroll_vertical);
                } else {
                    _dom.scroller.css({ 'overflow': 'hidden' });
                }
            } else {
                // we use 'auto' to tell the mobile browser that this is scrollable with touch
                // but it breaks Android native 'Browser' programmatic scrolling, so we need
                // to use 'hidden' to scroll it programmatically
                _dom.scroller.css({ 'overflow': 'hidden' });
            }

            // mouse tool
            _controllers.mouseTool = new Atalasoft.Controls.ToolController(_self, {
                _internalEvents: _internalEvents,
                _controllers: _controllers,
                zoomStart: __zoomStart,
                zoom: __zoomInstant,
                zoomEnd: __zoomEnd,
                getActivePage: __getActivePage,
                raiseDrawLayer: __raiseDrawLayer,
                resetDrawLayer: __resetDrawLayer,
                getViewerTransform: __getViewerTransform
            }, _dom.viewport, _dom.scroller, $.extend({ allowflick: _config.allowflick }, _config.mousetool));

            _controllers.memory = new Atalasoft.Document.MemoryTracker({
                highWaterMark: _config.memorythreshold
            });

            _controllers.memory.bind({
                exceededhighwatermark: __onMemoryUsageExceeded
            });

            // set the viewport for the annotation controller
            if (_controllers.annotations) {
                _controllers.annotations.setViewPort(_dom.viewport);
            }

            __triggerEvent('initialized');
            __load();

            $(document).ready(__onReady);
        }

        // generates a prefix id for all of the sub elements, based on the parent
        function __generateID() {
            var tmpid = _config.parent.attr('id') + '_wdv';
            ++_Statics.instanceCounter;

            while (document.getElementById(tmpid + _Statics.instanceCounter)) {
                ++_Statics.instanceCounter;
            }

            _id = tmpid + _Statics.instanceCounter;
        }

        function __load() {
            // this makes the viewport wrap the contained objects
            if (Atalasoft.Utils.Browser.Explorer && parseInt(Atalasoft.Utils.Browser.Version, 10) < 8) {
                _dom.viewport.css({ 'float': 'left' });
            } else {
                if (_config.direction === _direction.Horizontal) {
                    _dom.viewport.css({ 'white-space': 'nowrap' });
                }

                _dom.viewport.css({ 'display': 'table-cell' });
            }

            __extendScroller(_dom.scroller);

            if (_dom.scrollH) {
                _dom.edges[1].height(_dom.scrollH.scrollbarHeight());
            }

            // sets the mouse tool
            _controllers.mouseTool.setTool(_toolTypes.Pan, _toolTypes.None);

            // async call, should be last
            if (_config.documenturl || _config.annotationsurl || _config.formurl) {
                __openUrlAsync(_config.documenturl, _config.annotationsurl, _config.formurl, openCallback);
            }
        }

        /**
         * Removes all DOM elements, internal references, and empties memory intensive objects.
         * The WebDocumentViewer will no longer function after a call to this method.
         * @instance
         * @memberOf Atalasoft.Controls.WebDocumentViewer
         * @function dispose
         */
        function __dispose() {
            if (!_isThumbnailer && _stateManager) {
                _stateManager.closeDocument();
            }

            __clearUI();

            if (_dom.main) {
                _dom.main.remove();
            }

            if (_dom.toolbar) {
                _dom.toolbar.remove();

                if (_dom.toolbar.annoToolbar) {
                    _dom.toolbar.annoToolbar.remove();
                }
            }

            if (_dom.search) {
                _dom.search.dispose();
            }

            _dom.main = null;
            _dom.toolbar = null;
            _dom.scroller = null;
            _dom.viewport = null;
            _dom.content = null;
            _dom.scrollH = null;
            _dom.scrollV = null;
            _dom.loadedImgs.length = 0;
            _dom.pageDivs.length = 0;
            _dom.pageLabel = null;
            _dom.status = null;
            _dom.search = null;

            if (_dom.edges) {
                for (var i = 0; i < _dom.edges.length; i++) {
                    _dom.edges[i] = null;
                }

                _dom.edges = [];
            }

            for (var p in _controllers) {
                if (_controllers.hasOwnProperty(p)) {
                    if (_controllers[p] !== null) {
                        _controllers[p].dispose();
                        _controllers[p] = null;
                    }
                }
            }

            _page = __createEmptyPageDataObject();
            _state = __createEmptyStateObject();
        }

        // #endregion

        // #region Internal events

        function __onMemoryUsageExceeded(e) {
            var img = _controllers.memory.deallocateOldestEntry();
            __garbageCollectObject(img[0]);
            if (img._cacheIndex >= 0) {
                _dom.loadedImgs[img._cacheIndex] = null;
                img._cacheIndex = -1;
            }

            img.remove();
            img.length = 0;
            img = null;
        }

        // triggered by the Thumbnailer when it resizes the page divs
        function __onPageDivsResized(e) {
            _state.newpagedivsize = {
                height: e.height,
                width: e.width
            };

            _state.newpagedivfullzoom = e.fullzoom;
            _config.minwidth = e.minwidth;
            _config.zoom = e.fullzoom;

            __onDocumentChanged();
        }

        function __onPageSizeChanged(e) {
            var sizechanged = false;

            if (_page.smallest.width <= 0 || e.width < _page.smallest.width) {
                _page.smallest.width = e.width;
                sizechanged = true;
            }

            if (_page.smallest.height <= 0 || e.height < _page.smallest.height) {
                _page.smallest.height = e.height;
                sizechanged = true;
            }

            if (!_isThumbnailer) {
                __resizeScrollBars(e.dx, e.dy);

                // smaller size found?
                if (sizechanged) {
                    if (__calculatePageDivCount(__getMinZoom()) > _dom.pageDivs.length) {
                        __onDocumentChanged(e);
                    }
                }
            }
        }

        // called when page is loaded in thumbnailer and thus shared size changed within document controller.
        // documentController: controller is passed from thumbnailer, since different thumbnailer could control viewer, so only thumbnailer holds the state which should be updated.
        // fitSize: target size for fitzoom calculation
        // updateView: indicates whether we have to update UI. generally it shows whether calling thumbnailer is attached to viewer.
        function __onSharedPageSizeChanged(e, documentController, fitSize, updateView) {
            var oldSize = documentController.getPageSize(e.index, _id);
            if (!oldSize) {
                var oldFit = documentController.getPageFitMultiplier(e.index, _id),
                    scale = oldFit,
                    newSize = { width: e.width, height: e.height };
                // if there were no fit zoom, i.e. page wasn't loaded in viewer.
                if (scale === 1 && _config.forcepagefit && (newSize.width !== fitSize.width || newSize.height !== fitSize.height) && newSize.width > 0 && newSize.height > 0) {
                    if (newSize.width / fitSize.width > newSize.height / fitSize.height) {
                        // size to the width
                        scale = fitSize.width / newSize.width;
                    } else {
                        // size to the height
                        scale = fitSize.height / newSize.height;
                    }

                    documentController.setPageFitMultiplier(e.index, scale, _id);
                }

                documentController.setPageSize(e.index, $.extend({}, newSize), _id);

                if (updateView) {
                    newSize.width *= _config.zoom * scale;
                    newSize.height *= _config.zoom * scale;

                    oldSize = $.extend({}, _page.size);
                    oldSize.width *= _config.zoom * oldFit;
                    oldSize.height *= _config.zoom * oldFit;
                    e.dx = newSize.width - oldSize.width;
                    e.dy = newSize.height - oldSize.height;
                    __onPageSizeChanged(e);
                }
            }
        }

        function __onReady() {
            if (Atalasoft.Utils.Browser.Mobile.Any()) {
                $(window).on({
                    'orientationchange': __onResize
                    // commented out disposing on page reload, since browser should clear us from memory himself.
                    //'beforeunload': __dispose
                });
            } else {
                $(window).on({
                    'resize': __onResize
                    // commented out disposing on page reload, since browser should clear us from memory himself.
                    //'beforeunload': __dispose
                });
            }

            _dom.scroller.scroll(__onScroll);

            // Since the document info is most likely still loading, we can't
            // accurately calculate the number of page divs that we need.
            // Set it to 3 to start with, and we'll modify it once the image info is loaded.
            __createPageDivs(_page.buffer);
        }

        // function to remove selections from everything except textarea boxes
        function __onSelectStart(e) {
            var src = e.target || e.srcElement;
            if (Atalasoft.Utils.Browser.Explorer8) {
                return Atalasoft.Utils.__rf();
            }

            if (src.nodeName !== 'TEXTAREA' && src.nodeName !== 'INPUT' && src.type !== 'text') {
                return Atalasoft.Utils.__rf();
            } else if (src.attributes.selectable && src.attributes.selectable.value === 'false') {
                // this is a textarea box, but we've marked it not selectable
                return Atalasoft.Utils.__rf();
            }
        }

        // prevents the default button click from happening
        function __buttonClickWrapper(evtTrigger) {
            return function (e) {
                e.preventDefault();
                __triggerEvent(evtTrigger, arguments);
            };
        }

        function __toolbarTriggerWrapper(f, context) {
            return function (e) {
                try {
                    e.currentTarget = context && context.length > 0 ? context[0] : e.currentTarget;

                    if (f) {
                        f(e);
                    }
                } catch (ex) {
                    __status(ex.message);
                }
            };
        }

        // shows an error message if the config allows, otherwise logs a status message and triggers an event
        // name: string, name of the error
        // msg: string, error message
        function __throwError(name, msg) {
            if (_config.showerrors) {
                throw typeof msg === 'undefined' ? name : name + ': ' + msg;
            }

            __status(name + ': ' + msg);

            __triggerEvent({
                type: 'error',
                name: name,
                message: msg
            });
        }

        // jquery event bound to 'throwerror' so child objects can all throw through the WDV's throw method
        // e: event object
        function __throwErrorChild(e) {
            __throwError(e.name, e.msg);
        }

        // #endregion

        // #region Create functions

        // tag: string representing the type of tag
        // p: jQuery parent object to append div to 
        // did: string representing the id of the div
        // ihtml: string representing the inner html
        function __createDOM(tag, p, did, ihtml) {
            var dom = $('<' + tag + '></' + tag + '>');

            if (p && p.append) {
                dom.appendTo(p);
            }

            if (did) {
                dom.attr('id', did);
            }

            if (ihtml) {
                dom.html(ihtml);
            }

            return dom;
        }

        // p: jQuery parent object to append div to 
        // did: string representing the id of the div
        // ihtml: string representing the inner html
        function __createDiv(p, did, ihtml) {
            return __createDOM('div', p, did, ihtml);
        }

        // object to catch drawing and select events
        // p: jQuery parent object to prepend draw layer to 
        function __createDrawLayer(p) {
            var draw = $('<div style="width:100%; height:100%; position:absolute; left: 0px; top: 0px; background: #F00; opacity:0.0;"></div>');

            if (Atalasoft.Utils.Browser.Explorer) {
                if (parseInt(Atalasoft.Utils.Browser.Version, 10) <= 8) {
                    draw.css({
                        'filter': 'alpha(opacity=0)'
                    });
                } else if (parseInt(Atalasoft.Utils.Browser.Version, 10) === 10) {
                    var added = false;
                    draw.reflow = function () {
                        if (added) {
                            draw.empty();
                        } else {
                            var dummy = $('<hr/>');
                            draw.append(dummy);
                        }

                        added = !added;
                    };
                }
                // if higher, it does nothing extra
            }

            draw.toFront = function () {
                draw.css({ 'z-index': '10' });

                if (draw.reflow) {
                    draw.reflow();
                }
            };

            draw.reset = function () {
                draw.css({ 'z-index': '' });

                if (draw.reflow) {
                    draw.reflow();
                }
            };

            if (p) {
                p.prepend(draw);
            }

            return draw;
        }

        // Creates the toolbars for this control, and appends them to the given object
        // p: jQuery parent object to append toolbars to
        function __createToolbars(p) {
            var mainToolbar = __createMainToolbar(p);

            if (_config.allowannotations) {
                mainToolbar.annoToolbar = __createAnnoToolbar(p);
                mainToolbar.annoToolbar.addClass(_domClasses.atala_annotation_toolbar);
            }

            if (_config.showstatus) {
                _dom.status = $('<div id="' + _id + '_status" style="display:inline"></div>');
                _dom.status.addClass(_domClasses.atala_statusbar);
                mainToolbar.append('Status:');
                mainToolbar.append(_dom.status);
            }

            if (_config.allowtext && _config.mousetool.text.allowsearch) {
                _dom.search = new __CSearchBox({ parent: mainToolbar });
            }

            return mainToolbar;
        }

        // Creates the main document toolbar for this control, and appends them to the given object
        // p: jQuery parent object to append toolbar to
        function __createMainToolbar(p) {
            // config object
            var tconfig = {
                id: _id + '_toolbar',
                parent: p,
                children: [{ type: 'button', id: 'Button_PagePrev', cls: _domClasses.atala_tool_button_page_prev, icon: 'page-prev', tooltip: 'Previous Page', text: null, onclick: function onclick() {
                        __scrollPreviousAsync();
                    } }, { type: 'pagelabel', id: 'Label_PageNumber', cls: _domClasses.atala_page_label }, { type: 'button', id: 'Button_PageNext', cls: _domClasses.atala_tool_button_page_next, icon: 'page-next', tooltip: 'Next Page', text: null, onclick: function onclick() {
                        __scrollNextAsync();
                    } }, { type: 'button', id: 'Button_ZoomOut', cls: _domClasses.atala_tool_button_zoom_out, icon: 'zoom-out', tooltip: 'Zoom Out', text: '', onclick: function onclick() {
                        __zoomOutAsync();
                    } }, { type: 'button', id: 'Button_ZoomIn', cls: _domClasses.atala_tool_button_zoom_in, icon: 'zoom-in', tooltip: 'Zoom In', text: '', onclick: function onclick() {
                        __zoomInAsync();
                    } }, { type: 'button', id: 'Button_FitNone', cls: _domClasses.atala_tool_button_fit_none, icon: 'zoom-full', tooltip: 'Full Size', text: '', onclick: function onclick() {
                        __setZoomAsync(1);
                    } }, { type: 'button', id: 'Button_FitBest', cls: _domClasses.atala_tool_button_fit_best, icon: 'fit-best', tooltip: 'Best Fit', text: '', onclick: function onclick() {
                        __fitAsync(_fitting.Best);
                    } }, { type: 'button', id: 'Button_FitWidth', cls: _domClasses.atala_tool_button_fit_width, icon: 'fit-width', tooltip: 'Fit To Width', text: '', onclick: function onclick() {
                        __fitAsync(_fitting.Width);
                    } }]
            };

            if (_config.showselecttools) {
                tconfig.children.splice(5, 0, { type: 'button', id: 'Button_ZoomArea', cls: _domClasses.atala_tool_button_zoom_area, icon: 'zoom-area', tooltip: 'Zoom Area', text: '', onclick: __enableZoomAreaTool });
                //tconfig.children.splice(3, 0, { type: 'button', id: 'Button_Selection', cls: _domClasses.atala_tool_button_selection, icon: 'selection', tooltip: 'Selection', text: '', onclick: function() { _controllers.mouseTool.setTool(_toolTypes.Selection); } });
            }

            if (_config.allowtext) {
                tconfig.children.splice(3, 0, { type: 'button', id: 'Button_Text', cls: _domClasses.atala_tool_button_text_tool, icon: 'text-tool', tooltip: 'Text Selection', text: '', onclick: function onclick() {
                        _controllers.mouseTool.setTool(_toolTypes.Text);
                    } });
                tconfig.children.splice(3, 0, { type: 'button', id: 'Button_Text', cls: _domClasses.atala_tool_button_pan_tool, icon: 'pan-tool', tooltip: 'Pan', text: '', onclick: function onclick() {
                        _controllers.mouseTool.setTool(_toolTypes.Pan);
                    } });
            }

            if (_config.showrotatetools) {
                tconfig.children.push({ type: 'button', id: 'Button_RotateLeft', cls: _domClasses.atala_tool_button_rotate_left, icon: 'rotate-left', tooltip: 'Rotate Left', text: '', onclick: __createRotateHandler(270) });
                tconfig.children.push({ type: 'button', id: 'Button_RotateRight', cls: _domClasses.atala_tool_button_rotate_right, icon: 'rotate-right', tooltip: 'Rotate Right', text: '', onclick: __createRotateHandler(90) });
            }

            // add the save button is the save path exists
            if (_config.savepath.length > 0) {
                tconfig.children.unshift({ type: 'button', id: 'Button_Save', cls: _domClasses.atala_tool_button_save, icon: 'save', tooltip: 'Save Changes', text: null, onclick: function onclick() {
                        __saveChanges();
                    } });
            }

            return __createToolbar(tconfig);
        }

        // Creates the annotation toolbar for this control, and appends them to the given object
        // p: jQuery parent object to append toolbar to
        function __createAnnoToolbar(p) {
            // config object
            var tconfig = {
                id: _id + '_toolbar',
                parent: p,
                children: [{ type: 'button', id: 'Button_Ellipse', cls: _domClasses.atala_tool_button_ellipse_anno, icon: 'ellipse', tooltip: 'Draw Ellipse', text: '', onclick: __drawAnnotation }, { type: 'button', id: 'Button_Highlight', cls: _domClasses.atala_tool_button_highlight_anno, icon: 'highlight', tooltip: 'Draw Highlight', text: '', onclick: __drawAnnotation }, { type: 'button', id: 'Button_Line', cls: _domClasses.atala_tool_button_line_anno, icon: 'line', tooltip: 'Draw Line', text: '', onclick: __drawAnnotation }, { type: 'button', id: 'Button_Lines', cls: _domClasses.atala_tool_button_lines_anno, icon: 'lines', tooltip: 'Draw Poly Lines', text: '', onclick: __drawAnnotation }, { type: 'button', id: 'Button_Freehand', cls: _domClasses.atala_tool_button_freehand_anno, icon: 'freehand', tooltip: 'Draw Freehand', text: '', onclick: __drawAnnotation },
                //				{ type: 'button', id: 'Button_Polygon',     cls: _domClasses.atala_tool_button_polygon_anno,	icon: 'polygon',	tooltip: 'Draw Polygon',	text: '', onclick: __drawAnnotation },
                { type: 'button', id: 'Button_Rectangle', cls: _domClasses.atala_tool_button_rect_anno, icon: 'rectangle', tooltip: 'Draw Rectangle', text: '', onclick: __drawAnnotation },
                //				{ type: 'button', id: 'Button_FillRect',    cls: _domClasses.atala_tool_button_fillrect_anno,	icon: 'fillrect',	tooltip: 'Filled Rectangle',text: '', onclick: __drawAnnotation },
                { type: 'button', id: 'Button_Text', cls: _domClasses.atala_tool_button_text_anno, icon: 'text', tooltip: 'Draw Text', text: '', onclick: __drawAnnotation //,
                    //				{ type: 'button', id: 'Button_Stamp',       cls: _domClasses.atala_tool_button_stamp_anno,	    icon: 'stamp',		tooltip: 'Add a Stamp',		text: '', onclick: __addAnnotation },
                    //				{ type: 'button', id: 'Button_Note',        cls: _domClasses.atala_tool_button_note_anno,		icon: 'note',		tooltip: 'Add a Sticky Note',text: '',onclick: __addAnnotation },
                    //				{ type: 'button', id: 'Button_Comment',     cls: _domClasses.atala_tool_button_commment_anno,	icon: 'comment',	tooltip: 'Add a Comment',	text: '', onclick: __addAnnotation }
                }]
            };

            return __createToolbar(tconfig);
        }

        // creates a toolbar based on the config options passed in
        // tConfig: options object
        function __createToolbar(tConfig) {
            var tray = __createDiv(tConfig.parent);
            var trayid = _id + '_toolbar';

            tray.buttons = [];

            for (var i = 0; tConfig.children && i < tConfig.children.length; i++) {
                var element = null;
                switch (tConfig.children[i].type) {
                    case 'button':
                        // touch events don't play nice with polyline 
                        if (!(Atalasoft.Utils.Browser.Features.Touch && tConfig.children[i].icon === 'lines')) {
                            tConfig.children[i].id = trayid + '_' + tConfig.children[i].id;
                            var btn = __createButtonFromConfig(tConfig.children[i], tray);
                            btn.addClass(_domClasses.atala_toolbar_button);
                            element = btn;
                            tray.buttons.push(btn);
                        }
                        break;

                    case 'pagelabel':
                        _dom.pageLabel = __createDOM('span', tray, trayid + '_' + tConfig.children[i].id);
                        element = _dom.pageLabel;
                        break;
                }

                if (element && tConfig.children[i].cls) {
                    element.addClass(tConfig.children[i].cls);
                }
            }

            return tray;
        }

        // creates a jQuery UI menu using the given options
        // mConfig: key value pairs, where the key is the menu text, value is a function 
        function __createMenu(mConfig) {
            var ul = $('<ul/>');
            ul.css({ fontSize: 'medium' });
            ul.addClass(_domClasses.atala_context_menu);

            for (var i in mConfig) {
                if (mConfig.hasOwnProperty(i)) {
                    // there was a breaking change in jquery-ui-1.12: menu items need to be wrapped now with block-style elements.
                    var jqueryUiMenuChangeVersion = '1.12';
                    var element = Atalasoft.Utils.flattenVersionSting($.ui.version) >= Atalasoft.Utils.flattenVersionSting(jqueryUiMenuChangeVersion) ? 'div' : 'a';
                    var li = $('<li><' + element + ' href="#"> ' + i + ' </' + element + '></li>');
                    if (Atalasoft.Utils.Browser.Features.Touch && !Atalasoft.Utils.Browser.Mobile.iOS) {
                        li.bind({
                            touchend: mConfig[i]
                        });
                    }

                    li.click(mConfig[i]);
                    li.appendTo(ul);
                }
            }

            ul.menu();

            return ul;
        }

        // creates a jQuery UI dialog box
        // p: jQuery parent object to append toolbar to
        // title: string, text to display on the title bar
        // content: string or jQuery object
        function __createDialog(p, title, content) {
            var div = $('<div title="' + title + '" />');

            if (content) {
                div.append(content);
            }

            div.dialog();

            return div;
        }

        // creates a jQuery UI button set dropdown
        // p: jQuery parent object to append toolbar to
        // bConfig: key value pairs, where the key is the menu text, value is a function 
        function __createDropDownButton(bConfig) {
            var span = __createDOM('span', _dom.toolbar.annoToolbar);
            __createButtonFromConfig(bConfig, span);
            __createButton(span, bConfig.id + '_Drop', 'ui-icon-triangle-1-s', 'Click To Choose', null, function () {
                var menu = $(this).next();

                if (menu.is(':visible')) {
                    menu.hide();
                    return false;
                }

                var btnAbove = menu.prev().prev().parent();

                menu.menu().show().css({
                    'position': 'absolute',
                    'top': 0,
                    'left': 0,
                    'min-width': btnAbove.width() + 'px',
                    'z-index': 11
                }).position({
                    my: 'left top',
                    at: 'left bottom',
                    of: btnAbove
                });

                //TODO: make menu hide on click outside of menu
                //$(document).one('click', function(){
                //	menu.hide();
                //});

                return false;
            });

            span.buttonset();
            return span;
        }

        // creates a jQuery UI drop menu
        // elm: jQuery instance of the DOM object where the drop-down button lives
        // fClick: function to execute when button is clicked on
        // btncfg: button config options
        // config: array of objects user wants in the menu
        function __createDropDownMenu(elm, btncfg, config) {
            var btn = $(elm.children().first());

            var menuList = {};
            for (var i = 0; i < config.length; i++) {
                //__createMenu takes in a key/value pair of menu item text and function to be executed on click event
                menuList[config[i].name] = __createMenuClickFunc(btn, btncfg, config[i]);
            }

            // need to create a reference to the menu so that we can hide it on the click
            btn.menu = __createMenu(menuList);
            //		btn.menu.addClass('atala-ui-button');
            elm.append(btn.menu);
            btn.menu.hide();
        }

        // creates a wrapper for a jQuery UI menu click function
        // btn: jQuery UI button object
        // btncfg: button config options
        // config: array of objects user wants in the menu
        function __createMenuClickFunc(btn, btncfg, config) {
            var toolbarEventTrigger = 'menuselect' + btncfg.icon + config.name;
            var clickEvent = function clickEvent() {
                btn.button('option', 'label', 'Draw ' + config.name);
                btn.data('_annoConfig', config);
                btn.click(btncfg.onclick);
                btn.menu.hide();

                btn.trigger('click');

                return false;
            };

            __bindEvents(toolbarEventTrigger, __toolbarTriggerWrapper(clickEvent, btn));

            return clickEvent;
        }

        // creates a jQuery UI button with the given properties	
        // p: jQuery parent object to append to 
        // bid: string, button id
        // bc: string, button icon class
        // btt: string, button tool tip
        // btxt: string, button text
        // fnc: function, click event function
        function __createButton(p, bid, bc, btt, btxt, fnc) {
            var btn = $('<button id="' + bid + '" title="' + btt + '">' + (btxt || btt) + '</button>');

            if (fnc) {
                btn.click(fnc);
            }

            btn.button({
                icons: { primary: bc },
                text: btxt != null && _config.showbuttontext
            });

            btn.addClass('atala-ui-button');

            if (p) {
                btn.appendTo(p);
            }

            return btn;
        }

        // creates a button that follows the same convention as the toolbar buttons
        // bConfig: key value pairs represented below
        //	.id:		string, button id 
        //	.icon:		string, button icon class suffix 
        //	.tooltip:	string, hover text
        //	.text:		string, button text
        //	.onclick:	function, button click function 
        function __createButtonFromConfig(bConfig, p) {
            var toolbarEventTrigger = 'menuclick' + bConfig.icon;
            var btn = __createButton(p, bConfig.id, _iconClass + ' ' + _iconClass + '-' + bConfig.icon, bConfig.tooltip, bConfig.text, __buttonClickWrapper(toolbarEventTrigger));

            // this data is used by click events in order to figure out what button was pressed
            btn.data('_config', bConfig);
            __bindEvents(toolbarEventTrigger, __toolbarTriggerWrapper(bConfig.onclick, btn));

            return btn;
        }

        function __CSearchBox(config) {
            var styles = {
                clearable: 'atala_search_input_clearable',
                onclear: 'atala_search_input_clear_hover',
                inputEmpty: 'atala_search_input_empty',
                loading: 'atala_search_input_loading'
            };

            var parent = config.parent || _dom.toolbar;
            var iterator = null;
            var searchTimeout = null; // timeout to trigger search when user finished typing in search box.
            var container, inputBox, btnNext, btnPrev;

            __initDom();

            function __initDom() {
                container = __createDiv().addClass(_domClasses.atala_search_container);

                inputBox = $('<input type="text" placeholder="Search..." />').addClass(_domClasses.atala_search_input).addClass('ui-widget');
                inputBox.bind({
                    keydown: __onInputKeyUp,
                    'input propertychange': __onIputChange
                });

                var inputSpan = __createDOM('span', container).css({ width: '100%' });
                inputSpan.append(inputBox);

                var buttonsSpan = __createDOM('span', container);
                btnNext = __createButton(buttonsSpan, null, _iconClass + ' ' + _iconClass + '-search-next', 'Next', null, __makeButtonHandler(__onSearchNext)).addClass(_domClasses.atala_search_next);
                btnPrev = __createButton(buttonsSpan, null, _iconClass + ' ' + _iconClass + '-search-prev', 'Previous', null, __makeButtonHandler(__onSearchPrev)).addClass(_domClasses.atala_search_prev);

                container.on('mousemove', '.' + styles.clearable, __togglePointer).on('touchstart click', '.' + styles.onclear, __onClearClick);

                parent.append(container);
                parent.append($('<div style="clear:both;"></div>'));
            }

            this.dispose = __disposeSearchBox;
            function __disposeSearchBox() {
                inputBox.unbind({
                    keypress: __onInputKeyUp,
                    'input propertychange': __onIputChange
                });

                container.off('mousemove', '.' + styles.clearable, __togglePointer).off('touchstart click', '.' + styles.onclear, __onClearClick);

                if (iterator) {
                    iterator.dispose();
                }

                container.remove();
            }

            function __onIputChange() {
                var text = inputBox.val();
                if (text) {
                    inputBox.addClass(styles.clearable);
                } else {
                    inputBox.removeClass(styles.clearable);
                }

                if (text && iterator && iterator.isValid() && text === iterator.getQuery()) {
                    return true;
                }

                clearTimeout(searchTimeout);
                iterator = null;

                if (text && text.length >= 3) {
                    __updateMatchIndicator(true);
                    searchTimeout = setTimeout(function () {
                        iterator = _controllers.text.search(text, __getCurrIndex(), __onNextMatch);
                        __suspendUI(true);
                    }, _config.mousetool.text.searchdelay);

                    return false;
                } else {
                    __onClearSearch();
                }
            }

            function __onInputKeyUp(e) {
                var text = inputBox.val();
                if (e.keyCode === 13 && iterator && text && iterator.isValid() && iterator.getQuery() === text) {
                    if (!e.shiftKey) {
                        __onSearchNext();
                    } else {
                        __onSearchPrev();
                    }
                    return false;
                } else if (e.keyCode === 13 && (!iterator || !iterator.isValid())) {
                    __onIputChange();
                    return false;
                } else if (e.keyCode === 27) {
                    __onClearSearch();
                    __onClearClick();
                    return false;
                } else if (Atalasoft.Utils.Browser.Explorer && Atalasoft.Utils.Browser.Version <= 9 && (e.keyCode === 8 || e.keyCode === 46)) {
                    // old ie incorrectly handles delete/backspace keys: they are not throwing oninput. so workaround it here.
                    clearTimeout(searchTimeout);
                    searchTimeout = setTimeout(function () {
                        __onIputChange();
                    }, _config.mousetool.text.searchdelay);
                }
            }

            function __onSearchNext() {
                if (iterator) {
                    __suspendUI(true);
                    iterator.next(__onNextMatch);
                }
            }

            function __onSearchPrev() {
                if (iterator) {
                    __suspendUI(true);
                    iterator.prev(__onNextMatch);
                }
            }

            function __onClearSearch() {
                iterator = null;
                _controllers.text.search('');
                __suspendUI(false);
                __updateMatchIndicator(true);
            }

            function __onNextMatch(iterator, match) {
                if (iterator.isValid()) {
                    __suspendUI(false);
                    iterator.wrap = _config.mousetool.text.wrapsearch;
                    if (!match) {
                        __updateMatchIndicator(match);
                    }
                }
            }

            function __suspendUI(suspended) {
                __toggleStyle(styles.loading, suspended);
            }

            function __updateMatchIndicator(match) {
                __toggleStyle(styles.inputEmpty, !match);
            }

            function __makeButtonHandler(fn) {
                return function (e) {
                    e.preventDefault();
                    if (fn) {
                        fn();
                    }
                };
            }

            function __toggleStyle(style, enabled) {
                if (enabled) {
                    inputBox.addClass(style);
                } else {
                    inputBox.removeClass(style);
                }
            }

            function __togglePointer(e) {
                __toggleStyle(styles.onclear, this.offsetWidth - 18 < e.clientX - this.getBoundingClientRect().left);
            }

            function __onClearClick(e) {
                if (e) {
                    e.preventDefault();
                }
                inputBox.removeClass(styles.clearable).removeClass(styles.onclear).val('').change();
                __onIputChange();
            }
        }

        function __enableZoomAreaTool() {
            if (_config.allowannotations) {
                _self.annotations.cancelDraw();
            }

            _controllers.mouseTool.setTool(_toolTypes.ZoomArea);
        }

        function __createRotateHandler(angle) {
            return function () {
                var selectedPages = __getSelectedPagesIndices(_page);
                var pageIndex = selectedPages[0];
                var pageRotations = [];

                selectedPages.forEach(function (currentValue) {
                    return pageRotations.push(_controllers.document.getPageRotation(currentValue) + angle);
                });

                _controllers.document.rotatePages(selectedPages, pageRotations, function () {
                    var scale = __getPageScale(pageIndex);
                    var pageSize = __getPageSize(pageIndex);
                    // for horizontal scrolling align to the beginning of the page.
                    var offset = _config.direction === _direction.Vertical ? pageSize.height * scale : 0;

                    // location object is not the same, so compare by value.
                    if (__isLocationEquals(_config.pageselectlocation, Atalasoft.Utils.PageSelection.Center) || __isLocationEquals(_config.pageselectlocation, Atalasoft.Utils.PageSelection.MiddleLeft)) {
                        offset = offset / 2;
                    } else if (__isLocationEquals(_config.pageselectlocation, Atalasoft.Utils.PageSelection.TopLeft)) {
                        offset = 0;
                    }

                    var anchor = {
                        x: _config.direction === _direction.Vertical ? 0 : offset,
                        y: _config.direction === _direction.Vertical ? offset : 0
                    };
                    __showPagePoint(pageIndex, anchor, _config.pageselectlocation, true);
                });
            };
        }

        function __getSelectedPagesIndices(page) {
            return [page.number - 1];
        }

        // creates an edge object used to mark and pad the viewable edges
        // p: jQuery parent object to append to
        // eid: string, edge id
        function __createEdge(p, eid) {
            var oldIE = Atalasoft.Utils.Browser.Explorer && parseInt(Atalasoft.Utils.Browser.Version, 10) < 8;
            var cont = __createDiv(p, eid);

            if (_config.direction === _direction.Vertical) {
                cont.height(1);
                cont.css({
                    display: 'block'
                });
            } else if (_config.direction === _direction.Horizontal) {
                cont.width(1);
                cont.css({
                    display: 'inline-block',
                    overflow: 'hidden'
                });
            }

            cont._zoom = 1;
            if (_config.backcolor) {
                cont.css({
                    backgroundColor: _config.backcolor
                });
            }
            if (oldIE) {
                cont.html('&nbsp;');
            }

            return cont;
        }

        // creates a set of div tags used to show pages
        // i: int, number of divs to create
        function __createPageDivs(i) {
            if (typeof i === 'undefined') {
                var minBuffer = __calculatePageDivCount(_isThumbnailer && _state.newpagedivsize && _config.zoom > 0 && isFinite(_config.zoom) ? _config.zoom : __getMinZoom());
                if (_page.buffer < minBuffer) {
                    // having less pages than needed tends to make scrolling unusable when zoomed out
                    _page.buffer = minBuffer;
                }

                _page.buffer = Math.min(_page.buffer, _controllers.document.getPageCount());

                i = _page.buffer;
            }

            function pgSetActivePage(pg) {
                return function () {
                    __setActivePage(pg);
                };
            }

            if (_dom.pageDivs.length < i) {
                for (var j = _dom.pageDivs.length; j < i; j++) {
                    _dom.pageDivs[j] = __createDiv();
                    _dom.pageDivs[j].addClass(_domClasses.atala_page_div);
                    if (_config.showselecttools) {
                        _dom.pageDivs[j]._rubberband = new Atalasoft.Controls.RubberBandTool(_self, {}, _dom.pageDivs[j], {
                            getViewportSize: __getViewportSize,
                            getMaxZoom: __getMaxZoom,
                            getPageOffsets: __getPageOffsets,
                            raiseDrawLayer: __raiseDrawLayer,
                            resetDrawLayer: __resetDrawLayer
                        });
                    }

                    _dom.pageDivs[j].bind({
                        'touchstart': pgSetActivePage(_dom.pageDivs[j]),
                        'mousedown': pgSetActivePage(_dom.pageDivs[j])
                    });

                    if (_controllers.annotations) {
                        _controllers.annotations.addDrawingSurface(_dom.pageDivs[j]);
                    }

                    if (_config.showselecttools || _config.allowannotations || _config.allowforms || _config.allowtext) {
                        _dom.pageDivs[j]._draw = __createDrawLayer(_dom.pageDivs[j]);
                    }

                    if (_controllers.forms && !_isThumbnailer) {
                        _controllers.forms.addFormLayer(_dom.pageDivs[j]);
                    }

                    if (_controllers.text && !_isThumbnailer) {
                        _controllers.text.addTextLayer(_dom.pageDivs[j]);
                    }
                }
            } else if (_dom.pageDivs.length > i) {
                // too many page divs, length must equal given value
                while (_dom.pageDivs.length > i && _dom.pageDivs.length !== 0) {
                    var pg = _dom.pageDivs.pop();

                    if (pg._rubberband) {
                        pg._rubberband.dispose();
                    }

                    if (_controllers.annotations) {
                        _controllers.annotations.removeDrawingSurface(pg);
                    }

                    if (_controllers.forms && !_isThumbnailer) {
                        _controllers.forms.removeFormLayer(pg);
                    }

                    if (_controllers.text && !_isThumbnailer) {
                        _controllers.text.removeTextLayer(pg);
                    }

                    if (pg) {
                        __deletePage(pg);
                    }

                    pg = null;
                }
            }
        }

        // creates and asynchronously loads the image representing the page at the given index
        // i: int, frame index
        // pageref: object, represents page reference on another document
        // callback: function to execute when the image is finished loading
        function __createPageImageAsync(i, pageref, params, callback) {
            if (typeof params === "function") {
                callback = params;
                params = undefined;
            }

            var _CPcallback = typeof callback === 'function' ? [callback] : [];
            var _CPimg = $(new Image());
            var oldIe = Atalasoft.Utils.Browser.Explorer && parseInt(Atalasoft.Utils.Browser.Version, 10) <= 8;
            var reZoomTreshold = 0.9; // we've loaded image with fit zoom, but turns out that size is different from expected and we gor blur effect. need to rezoom.
            var _loadParams = $.extend(true, { atala_cb: undefined }, params || {});
            _CPimg._domEl = __createDiv();
            _CPimg._domEl.addClass(_domClasses.atala_page_image_anchor);
            _CPimg.addClass(_domClasses.atala_page_image);

            if (!oldIe) {
                _CPimg._domEl.append(_CPimg);
            }

            var _CPbinds = {
                load: __CPimgLoaded,
                error: __CPimgError,
                inserted: __CPimgInserted
            };

            _CPimg._binds = _CPbinds;
            //  cache documenturl on image creations, since viewer could show different docs, but image should stay same.
            _CPimg.documenturl = _config.documenturl;
            _CPimg._index = pageref ? pageref.mapsto : i;
            _CPimg._loaded = false;
            _CPimg._size = {
                width: 0,
                height: 0,
                isEmpty: function isEmpty() {
                    return this.width === 0 && this.height === 0;
                }
            };
            _CPimg._zoom = -1;
            _CPimg._prevzoom = _CPimg._zoom;
            _CPimg._scaledzoom = -1;

            // physical image rotation done by server
            _CPimg._rotation = 0;
            // view image rotation done by client until image is updated by server
            _CPimg._viewrotation = 0;

            // addded functions
            _CPimg.dispose = __CPimgDispose;
            _CPimg.zoom = __CPimgZoomAsync;
            _CPimg.needsZoom = __CPimgNeedsZoom;
            _CPimg.getSize = __CPgetSize;
            _CPimg.getScaledSize = __CPgetScaledSize;
            _CPimg.getFitZoom = __CPgetFitZoom;
            _CPimg.getFitMultiplier = __CPgetFitMultiplier;
            _CPimg.needsRotate = __CPimgNeedsRotate;
            _CPimg.rotate = __CPimgRotateAsync;
            _CPimg.getDomElement = __CPimgGetDom;
            _CPimg.invalidate = __CPimgInvalidate;

            __CPimgInit();

            function __getPageIndex() {
                return _CPimg._page ? _CPimg._page._index : _controllers.document.getPageIndexByImageIndex(_CPimg._index);
            }

            function __CPimgGetDom() {
                return _CPimg._domEl;
            }

            // multiplier to fit image into forcefit bounds
            function __CPgetFitMultiplier(index) {
                return _controllers.document.getPageFitMultiplier(typeof index !== "undefined" ? index : __getPageIndex());
            }

            function __CPgetFitZoom(z, index) {
                z = typeof z === 'undefined' ? _config.zoom : z;

                return z * __CPgetFitMultiplier(index);
            }

            function __CPsetFitMultiplier(m) {
                return _controllers.document.setPageFitMultiplier(__getPageIndex(), m);
            }

            function __CPgetSize() {
                var size = __getPageSize(__getPageIndex()) || _page.size;
                return {
                    height: size.height,
                    width: size.width
                };
            }

            /**
            * Returns physical size of the image without client transformations applied(like view rotation)
            */
            function __CPgetSourceSize() {
                var size = __CPgetSize();
                return _CPimg._viewrotation === 90 || _CPimg._viewrotation === 270 ? __CPimgSwapSizeSides(size) : size;
            }

            function __CPgetScaledSize(z, size) {
                size = size || __CPgetSize();
                return {
                    height: Math.round(size.height * __CPgetFitZoom(z)),
                    width: Math.round(size.width * __CPgetFitZoom(z))
                };
            }

            function __CPimgInit() {
                _CPimg.bind(_CPbinds);

                var bSize = _config.pageborderwidth;
                var margins = { 'bottom': 0, 'top': 0, 'right': 0, 'left': 0 };

                _CPimg._loaded = false;
                _CPimg._reqzoom = -1;

                if (_config.direction === _direction.Vertical || _config.tabular) {
                    margins.bottom = _config.pagespacing;
                }

                if (_config.direction === _direction.Horizontal || _config.tabular) {
                    margins.right = _config.pagespacing;
                }

                var domAnchor = __CPimgGetDom();
                if (_config.showpageborder) {
                    domAnchor.css({
                        'border-bottom': bSize + 'px solid black',
                        'border-right': bSize + 'px solid black',
                        'border-top': bSize + 'px solid silver',
                        'border-left': bSize + 'px solid silver',
                        'margin-bottom': margins.bottom + 'px',
                        'margin-right': margins.right + 'px'
                    });
                }

                domAnchor.css({
                    display: 'inline-block'
                });

                domAnchor.addClass(_domClasses.atala_page_loading);
                __CPimgLoad();
            }

            function __CPimgLoad(force) {
                var pageindex = __getPageIndex();
                // inserted from other document pages we assume non-vector
                var isVector = _page.vector && (!pageref || !pageref.uri);
                var reqZoom = isVector ? __CPgetFitZoom() : Math.min(__CPgetFitZoom(), 1);
                var reqangle = _controllers.document.getPageRotation(pageindex);

                if (force || reqZoom !== _CPimg._zoom || _CPimg._rotation !== reqangle) {
                    var params = $.extend({
                        'atala_docurl': pageref ? pageref.uri : _CPimg.documenturl,
                        'atala_doczoom': reqZoom,
                        // TODO: remove atala_thumbpadding
                        'atala_thumbpadding': false
                    }, _loadParams);

                    if (reqangle) {
                        params.atala_angle = reqangle;
                    }

                    if (_config.jpeg) {
                        params.atala_jpeg = true;
                    }

                    var hRequest = {
                        type: 'docpage',
                        serverurl: _config.serverurl,
                        query: '?ataladocpage=' + (pageref === null ? _CPimg._index : pageref.index !== undefined ? pageref.index : pageref),
                        method: 'GET',
                        data: params,
                        cancel: false,
                        info: _CPimg
                    };

                    _CPimg._reqzoom = reqZoom;
                    _CPimg._reqangle = reqangle;
                    // rotation could change while image is loading. tell success handler what was requested by received request.
                    __makeHandlerRequest(hRequest, __CPimgLoaded, __CPimgLoaded);
                }
            }

            function __CPimgLoaded() {
                if (!_CPimg._loaded) {
                    _CPimg._domEl.removeClass(_domClasses.atala_page_loading);
                }

                _CPimg._loaded = true;
                _CPimg._zoom = _CPimg._reqzoom;
                _CPimg._rotation = _CPimg._reqangle;
                var pageindex = __getPageIndex();

                if (pageindex >= 0) {
                    // reload page if it was rotated while load request
                    if (_CPimg._rotation !== _controllers.document.getPageRotation(pageindex)) {
                        __CPimgLoad();
                        return;
                    }

                    // need to drop view rotation value, so sizes will be correctly recalculated for new image.
                    __CPimgResetViewRotationValue();
                    // if image doesn't have a parent yet, then it will have no height and width
                    // in webkit based browsers, even though it has finished loading
                    if (_CPimg.parent().length > 0) {
                        __CPimgUpdateSize();
                    } else if (oldIe && _CPimg._page && _CPimg._page.nullinserted) {
                        __insertPageContents(_CPimg._page, _CPimg, pageindex, true);
                        // explicitly notify clients that page size changed, sice we've skipped inserting in dom before.
                        // image actually appended to dom before handlers is bound to pageresize. so pageresize won't be handled when triggered under __CPimgInserted handler.
                        __CPimgUpdateSize();
                    }

                    __CPimgRotateView(_CPimg._viewrotation);

                    var fitZoom = _page.vector ? __CPgetFitZoom() : Math.min(__CPgetFitZoom(), 1);
                    if (__CPimgNeedsZoom() && _CPimg._zoom < fitZoom * reZoomTreshold && !__closeToEqual(_CPimg._zoom, fitZoom)) {
                        // we've go the image with smaller zoom so to avoid blur effect re-request image with correct zoom. 
                        // most likely this happens when image is requested first time with forcepagefit set,
                        // so we don't know exact fit zoom for images different then first page.
                        __CPimgZoomAsync(false);
                    }
                }

                __CPcompleted();
            }

            // called after the image is inserted, so that we can update the size
            function __CPimgInserted(e) {
                if (_CPimg._loaded) {
                    __CPimgUpdateSize();
                }
            }

            function __CPimgResetDomSize(el) {
                if (el) {
                    el.removeAttr('width height');
                    el.css({
                        width: 'auto',
                        height: 'auto'
                    });
                }
            }

            function __CPimgUpdateSize() {
                __CPimgResetDomSize(_CPimg);

                // IE11 could return incorrect image size if it wasn't resized till this time.
                var naturalWidth = _CPimg.prop('naturalWidth') || 0,
                    naturalHeight = _CPimg.prop('naturalHeight') || 0,
                    width = naturalWidth || _CPimg.width(),
                    height = naturalHeight || _CPimg.height();
                var oldSize = __CPgetSize();
                var oldZoom = __CPgetFitZoom();
                var sizechanged = false;

                if (width === 0 || height === 0) {
                    if (!oldIe) {
                        // nothing to do
                        return;
                    } else {
                        var s = __CPgetSourceSize(); // for IE8 this will return rotated size if view rotation set.
                        var scale = __CPimgCalculateFit(s);
                        s.width *= scale;
                        s.height *= scale;
                        __CPimgGetDom().css(s);
                        _CPimg.trigger({
                            type: 'pageresize',
                            image: _CPimg,
                            index: __getPageIndex(),
                            width: s.width,
                            height: s.height
                        });
                        return;
                    }
                }

                _CPimg._size.width = Math.round(width / _CPimg._zoom);
                _CPimg._size.height = Math.round(height / _CPimg._zoom);
                if (_CPimg._viewrotation === 90 || _CPimg._viewrotation === 270) {
                    _CPimg._size = __CPimgSwapSizeSides(_CPimg._size);
                }

                if (_CPimg._size.width !== _page.size.width || _CPimg._size.height !== _page.size.height) {
                    if (!__closeToEqual(_CPimg._size.width, oldSize.width) || !__closeToEqual(_CPimg._size.height, oldSize.height)) {
                        sizechanged = true;
                        _controllers.document.setPageSize(__getPageIndex(), _CPimg._size);
                    }
                }

                if (_config.forcepagefit) {
                    __CPimgFit();
                } else {
                    // one last scale if the image returned from the server still isn't the right size
                    if (_CPimg._zoom !== _config.zoom || sizechanged || _CPimg._viewrotation !== 0) {
                        __CPimgScale();
                    }
                }

                var scaledSize = __CPgetScaledSize();
                if (sizechanged) {
                    _CPimg.trigger({
                        type: 'pagesizechanged',
                        image: _CPimg,
                        index: __getPageIndex(),
                        width: _CPimg._size.width,
                        height: _CPimg._size.height,
                        dx: Math.round(scaledSize.width - oldSize.width * oldZoom),
                        dy: Math.round(scaledSize.height - oldSize.height * oldZoom)
                    });
                }

                _CPimg.trigger({
                    type: 'pageresize',
                    image: _CPimg,
                    index: __getPageIndex(),
                    width: scaledSize.width,
                    height: scaledSize.height
                });
            }

            function __CPimgDispose() {
                _CPimg.unbind(_CPbinds);
                _CPimg._page = null;
                _CPimg = null;
            }

            function __CPimgZoomAsync(ani, callback) {
                if (__CPimgNeedsZoom() && !_CPimg._size.isEmpty()) {
                    if (typeof callback === 'function') {
                        _CPcallback.push(callback);
                    }

                    _CPimg._prevzoom = _CPimg._reqzoom;

                    if (ani && !_state.loading) {
                        // don't add the callback call to the animation because we
                        // need to wait until the image is finished loading to call it
                        _CPimg.animate({
                            'height': Math.round(_CPimg._size.height * __CPgetFitZoom()),
                            'width': Math.round(_CPimg._size.width * __CPgetFitZoom())
                        }, {
                            duration: _zmd,
                            easing: 'easeOutQuad',
                            complete: __CPimgZoomed,
                            queue: false
                        });
                    } else {
                        __CPimgScale();
                        __CPimgZoomed();
                    }
                } else {
                    if (typeof callback === 'function') {
                        callback.call(this, _CPimg);
                    }
                }
            }

            function __CPimgNeedsZoom() {
                if (!_CPimg._loaded) {
                    return false;
                }

                // we are not scaling scalar images past one, so fitzoom is never close to _reqzoom if > 1. compensate that to avoid unnecessary work.
                var alreadyScaled = !_page.vector && _CPimg._reqzoom === 1 && _CPimg._prevzoom === 1 && __CPgetFitZoom() > 1;
                var close = __closeToEqual(_CPimg._reqzoom, __CPgetFitZoom()) || alreadyScaled;

                if (!close) {
                    // sometimes the zoom changes are so close that the image will round to the same size
                    var dw = Math.abs(_CPimg._reqzoom * _CPimg._size.width - __CPgetFitZoom() * _CPimg._size.width);
                    var dh = Math.abs(_CPimg._reqzoom * _CPimg._size.height - __CPgetFitZoom() * _CPimg._size.height);

                    // is the delta of the change smaller than one pixel?
                    if (dw < 1 && dh < 1) {
                        close = true;
                    }
                }

                return !close || __CPimgNeedsScale();
            }

            function __CPimgNeedsScale() {
                return !__closeToEqual(_CPimg._scaledzoom, __CPgetFitZoom());
            }

            function __CPimgZoomed() {
                _CPimg.trigger({
                    type: 'pagezoom',
                    index: __getPageIndex(),
                    height: Math.round(_CPimg._size.height * __CPgetFitZoom()),
                    width: Math.round(_CPimg._size.width * __CPgetFitZoom()),
                    prevzoom: _CPimg._prevzoom,
                    zoom: __CPgetFitZoom()
                });

                if (_state.prpr === 0) {
                    __CPimgLoad();
                } else {
                    __CPcompleted();
                }
            }

            function __CPimgScale() {
                var naturalSizeThreshold = 0.01;
                var physicalSize = __CPgetScaledSize(undefined, __CPgetSourceSize()),
                    viewSize = __CPgetScaledSize();

                var naturalWidth = _CPimg.prop('naturalWidth') || 0,
                    naturalHeight = _CPimg.prop('naturalHeight') || 0;

                // explicit size could cause image corruption if it's not exactly corresponds to natural size.
                // due to floating point calculations, expected and received from server size of the image not always exactly same.
                // even one pixel differences in size could cause blur effect on image. So if there is really minor differences
                // in expected and natural sizes, then it's better to leave image as is.
                var widthPreserved = naturalWidth && Math.abs(naturalWidth - physicalSize.width) / physicalSize.width < naturalSizeThreshold;
                var heightPreserved = naturalHeight && Math.abs(naturalHeight - physicalSize.height) / physicalSize.height < naturalSizeThreshold;
                if (!widthPreserved || !heightPreserved) {
                    _CPimg.height(physicalSize.height);
                    _CPimg.width(physicalSize.width);
                }

                _CPimg._domEl.width(viewSize.width);
                _CPimg._domEl.height(viewSize.height);
                _CPimg._scaledzoom = __CPgetFitZoom();

                __CPimgRotateView(_CPimg._viewrotation);
                __repositionPageNumber(__getPageIndex(), viewSize.width, viewSize.height);
            }

            function __CPimgError() {
                // TODO: attempt to reload image
                __CPcompleted();
                var pageindex = __getPageIndex();
                __throwError('ImageError', 'Image at frameIndex ' + pageindex + ' failed to load.');
            }

            function __CPimgFit() {
                var scale = __CPimgCalculateFit();
                __CPsetFitMultiplier(scale / _config.zoom);
                __CPimgScale();
            }

            function __CPimgCalculateFit(size) {
                var scale = 1;
                size = size || _CPimg._size;
                var destSize = {
                    width: _config.forcepagesize.width * (_isThumbnailer ? 1 : _config.zoom),
                    height: _config.forcepagesize.height * (_isThumbnailer ? 1 : _config.zoom)
                };

                if (destSize.width < 1 || destSize.height < 1) {
                    destSize.width = _page.size.width * _config.zoom;
                    destSize.height = _page.size.height * _config.zoom;
                }

                if (size.width / destSize.width > size.height / destSize.height) {
                    // size to the width
                    scale = destSize.width / size.width;
                } else {
                    // size to the height
                    scale = destSize.height / size.height;
                }
                return scale;
            }

            // loading completed (regardless of errors), call the callback(s)
            function __CPcompleted() {
                if (_CPcallback.length > 0) {
                    __callFunctionArray(_CPcallback, _CPimg);
                }
            }

            function __CPimgNeedsRotate() {
                // reqangle - is specified relative to the server source image.
                // checks whether need to execute rotation in general - either view rotation or image reload.
                var reqangle = _controllers.document.getPageRotation(__getPageIndex());
                return _CPimg._viewrotation === 0 && reqangle !== _CPimg._rotation || _CPimg._viewrotation !== 0;
            }

            function __CPimgNeedsViewRotate() {
                // reqangle - is specified relative to the server source image.
                // if no view rotation - just check whether we already have what we want from server
                // else check if current _CPimg._viewrotation + _CPimg._rotation already gives us required angle 
                var reqangle = _controllers.document.getPageRotation(__getPageIndex());
                return _CPimg._viewrotation === 0 && reqangle !== _CPimg._rotation || _CPimg._viewrotation !== 0 && (_CPimg._viewrotation + _CPimg._rotation) % 360 !== reqangle;
            }

            function __CPimgRotateAsync(callback) {
                if (typeof callback === 'function') {
                    _CPcallback.push(callback);
                }

                if (__CPimgNeedsRotate()) {
                    var angle = _controllers.document.getPageRotation(__getPageIndex());
                    if (__CPimgNeedsViewRotate()) {
                        if (_CPimg && _CPimg._loaded && _CPimg._page) {
                            angle = (360 + angle - _CPimg._rotation) % 360;
                            __CPimgRotateView(angle);
                            __CPimgUpdateSize();
                        }
                    }

                    if (_state.prpr === 0 && _CPimg._loaded) {
                        __CPimgLoad();
                        return;
                    }
                }
                __CPcompleted();
            }

            function __CPimgResetViewRotationValue() {
                _CPimg._viewrotation = 0;
            }

            function __CPimgRotateView(angle) {
                if (oldIe && angle !== 0) {
                    _CPimg.remove(undefined, true);
                    _CPimg._page.nullinserted = true;
                }
                var srcSize = __CPgetSourceSize(),
                    size = __CPgetScaledSize(undefined, srcSize);
                var dx = 0,
                    dy = 0,
                    transform = '';

                if (angle === 90 || angle === 270) {
                    dx = (size.height - size.width) / 2;
                    if (_isThumbnailer && srcSize.width < srcSize.height) {
                        dx = 0;
                    }
                    dy = (size.width - size.height) / 2;
                    size = __CPimgSwapSizeSides(size);
                }

                if (angle !== 0) {
                    transform += ' translate(' + dx + 'px,' + dy + 'px)';
                    transform += 'rotate(' + angle + 'deg)';
                    _CPimg.css(Atalasoft.Utils.__htmlTransformStyle(transform));
                } else {
                    _CPimg.css(Atalasoft.Utils.__htmlTransformStyle(''));
                }

                __CPimgGetDom().css({
                    width: size.width,
                    height: size.height
                });

                _CPimg._viewrotation = angle;
            }

            function __CPimgInvalidate(params, callback) {
                if (typeof params === "function") {
                    callback = params;
                    params = {};
                }
                _loadParams = $.extend(true, {}, params);
                _loadParams.atala_cb = Math.floor(Math.random() * 1000000000);
                if (typeof callback === 'function') {
                    _CPcallback.push(callback);
                }
                __CPimgLoad(true);
            }

            function __CPimgSwapSizeSides(size) {
                var w = size.width;
                size.width = size.height;
                size.height = w;
                return size;
            }

            return _CPimg;
        }

        // creates a vertical or horizontal scrollbar with tray to mimic real scrollbars
        // p: jQuery parent object to append div to
        // sd: ScrollDirection enum indicating direction 
        function __createScrollbar(p, sd) {
            var oldIE = Atalasoft.Utils.Browser.Explorer && parseInt(Atalasoft.Utils.Browser.Version, 10) < 8;
            var baseStyle = 'overflow:scroll; position:absolute; background-color:Transparent;';
            var scrollTip = __createDiv(p);
            scrollTip.css({ 'position': 'absolute', 'display': 'none', 'background-color': 'white' });

            var scrollbar = null;
            var explicitSize = false;
            if (sd === _direction.Horizontal) {
                if (oldIE || Atalasoft.Utils.Browser.Firefox) {
                    // IE 6+7 need overflow-x and a higher z-index for the horizontal bar
                    baseStyle = baseStyle.replace('overflow', 'overflow-x');
                }

                scrollbar = $('<div style="' + baseStyle + 'bottom:0px; left:0px; width:100%;z-index:10"></div>').appendTo(p);
                scrollbar._tray = $('<div style="height:1px;"></div>').appendTo(scrollbar);
            } else {
                // IE 6+7 need width for the vertical bar. and seems like FF too now(it creates scrollbar from the right of the 1px-width div, and not expanding it)
                if (oldIE || Atalasoft.Utils.Browser.Firefox) {
                    baseStyle = baseStyle.replace('overflow', 'overflow-y');
                    baseStyle += 'width:' + (__getScrollbarWidth() + 1) + 'px;';
                    explicitSize = true;
                }

                scrollbar = $('<div style="' + baseStyle + 'top:0px; right:0px; height:100%;z-index:10"></div>').appendTo(p);
                scrollbar._explicitSize = explicitSize;
                scrollbar._tray = $('<div style="width:1px;"></div>').appendTo(scrollbar);
            }

            __extendScroller(scrollbar);

            scrollbar._ratio = 1;
            scrollbar._direction = sd;
            scrollbar._tooltip = scrollTip;
            scrollbar._pagenum = -1;
            scrollbar._scrollSize = 0;

            scrollbar.pageNum = __SBsetPageNum;
            scrollbar.scrollbarHeight = __SBgetRealHeight;
            scrollbar.scrollSize = __SBsetScrollSize;
            scrollbar.ratio = __SBsetRatio;

            function __SBsetPageNum(i) {
                scrollbar._pagenum = i;
            }

            function __SBgetRealHeight() {
                return scrollbar.height() - scrollbar[0].clientHeight;
            }

            function __SBsetScrollSize(n) {
                scrollbar._scrollSize = n;
            }

            function __SBsetRatio(r) {
                scrollbar._ratio = r;
            }

            function __SBonScroll(e) {
                if (!scrollbar.propagationPaused()) {
                    clearTimeout(scrollbar._tooltip._timeout);
                    _dom.scroller.stop();
                    _dom.scroller.pauseEventPropagation(true);

                    var tooltipCss = {};
                    if (scrollbar._direction === _direction.Vertical) {
                        _dom.scroller.scrollTop(scrollbar[0].scrollTop * scrollbar._ratio);
                        scrollbar._pagenum = __SBpageNumberFromPos(scrollbar, scrollbar[0].scrollTop);

                        tooltipCss.right = scrollbar.width() + 10 + 'px';
                        tooltipCss.top = 16 + Math.round((scrollbar[0].offsetHeight - 48) / scrollbar[0].scrollHeight * scrollbar[0].scrollTop) + 'px';
                    } else if (scrollbar._direction === _direction.Horizontal) {
                        _dom.scroller.scrollLeft(scrollbar[0].scrollLeft * scrollbar._ratio);
                        scrollbar._pagenum = __SBpageNumberFromPos(scrollbar, scrollbar[0].scrollLeft);

                        tooltipCss.bottom = scrollbar.height() + 10 + 'px';
                        tooltipCss.left = 16 + Math.round((scrollbar[0].offsetWidth - 48) / scrollbar[0].scrollWidth * scrollbar[0].scrollLeft) + 'px';
                    }
                    // only show the tooltip on the main scrolling direction 
                    if (scrollbar._direction === _config.direction && _config.showpagenumbertooltip) {
                        if (scrollbar._tooltip.css('display') === 'none') {
                            scrollbar._tooltip.css(tooltipCss);
                            scrollbar._tooltip.show();
                        }

                        if (_config.showpagenumbertooltip) {
                            scrollbar._tooltip.html('Page ' + scrollbar._pagenum);
                        }
                        scrollbar._tooltip._timeout = setTimeout(__SBhideToolTip, 1000);
                    }
                }
            }

            function __SBhideToolTip() {
                scrollbar._tooltip.hide();

                if (_page.number !== scrollbar._pagenum && !__isPageInView(scrollbar._pagenum)) {
                    __showPage(scrollbar._pagenum);
                }

                __redrawVisiblePages();
            }

            function __SBpageNumberFromPos(scrollbar, pos) {
                if (_config.forcepagefit) {
                    // if we are sure all pages fit in scrollable area, it's possible to synchronize page index on toolbar and tooltip value.
                    pos *= scrollbar._ratio;
                    var point = scrollbar._direction === _direction.Vertical ? { x: 0, y: pos } : { x: pos, y: 0 };
                    return __getUIIndexFromPos(point.x, point.y) + 1;
                } else {
                    return Math.floor(pos / (scrollbar._max / _controllers.document.getPageCount())) + 1;
                }
            }

            scrollbar.bind({
                scroll: __SBonScroll
            });

            return scrollbar;
        }

        // removes _tooltip._timeout for scrolbar. it could be needed when reinitializing viewer.
        function __resetScrollbarTimeout(scrollbar) {
            if (scrollbar && scrollbar._tooltip) {
                clearTimeout(scrollbar._tooltip._timeout);
                scrollbar._tooltip.hide();
            }
        }

        // adds new functionality to the given scroller
        // obj: jQuery scrollable object to append functions to
        function __extendScroller(obj) {
            function __scrollFinished() {
                obj.unbind(sEvent);
                obj.resumeEventPropagation();
            }

            var sEvent = {
                scroll: __scrollFinished
            };

            obj._pauseEP = 0;

            obj.propagationPaused = function () {
                return obj._pauseEP > 0;
            };

            obj.pauseEventPropagation = function (resumeAfterScroll) {
                obj._pauseEP++;

                if (resumeAfterScroll) {
                    obj.bind(sEvent);
                }
            };

            obj.resumeEventPropagation = function () {
                if (obj._pauseEP > 0) {
                    obj._pauseEP--;
                }
            };
        }

        // #endregion

        // #region Helper functions

        // gets the number of page divs needed to correctly display the current
        // document when at the minimum zoom level.
        function __calculatePageDivCount(z) {
            var vps = __getViewportSize();
            var psz = __getClientPageDivSize(0, z);

            // calculate smallest page size that user could achieve. For WDT size is fixed and forcepagefit enabled, so we could assume first page as constant.
            psz.width = _page.smallest.width > 0 && _page.smallest.width < psz.width && !_isThumbnailer ? _page.smallest.width : psz.width;
            psz.height = _page.smallest.height > 0 && _page.smallest.height < psz.height && !_isThumbnailer ? _page.smallest.height : psz.height;
            var hdc = Math.ceil(vps.width / psz.width) + 2; // add two more for edges
            var vdc = Math.ceil(vps.height / psz.height) + 2; // add two more for edges
            var pdc;

            if (_config.tabular) {
                if (_config.direction === _direction.Vertical && _config.columns > 0) {
                    hdc = _config.columns;
                } else if (_config.direction === _direction.Horizontal && _config.rows > 0) {
                    vdc = _config.rows;
                }

                pdc = hdc * vdc;
            } else if (_config.direction === _direction.Vertical) {
                pdc = vdc;
            } else if (_config.direction === _direction.Horizontal) {
                pdc = hdc;
            }

            return pdc;
        }

        // determines if two numbers are close enough to equal
        function __closeToEqual(n1, n2) {
            return n1 + 0.001 > n2 && n1 - 0.001 < n2;
        }

        // attempts to throw away a dom element by removing it from its parent
        // then adding it to a div, and clearing that div
        function __garbageCollectObject(o) {
            try {
                if (o.parentNode) {
                    o.parentNode.removeChild(o);
                }
                _garbage.appendChild(o);
                _garbage.innerHTML = '';
            } catch (e) {}
        }

        // calls each function within an array of functions
        // arr: array of functions
        function __callFunctionArray(arr) {
            var args = Array.prototype.slice.call(arguments, 1);
            while (arr.length) {
                arr.shift().apply(this, args);
            }
        }

        // gets the minimum zoom level based on the minimum page width
        function __getMinZoom() {
            return _page.size.width !== 0 ? _config.minwidth / _page.size.width : 1;
        }

        // gets the maximum zoom level based on the maximum page width
        function __getMaxZoom() {
            return _page.size.width !== 0 ? _config.maxwidth / _page.size.width : 1;
        }

        // gets the client based page size, ignoring zoom when something else has changed it
        // i: integer, frame index
        // z: float, desired zoom to calculate the size with [optional]
        // b: bool, add borders
        function __getClientPageDivSize(i, z, b) {
            if (_controllers.document.getPageCount() <= 0) {
                return {
                    width: 0,
                    height: 0
                };
            }

            b = typeof b === 'undefined' ? true : b;

            if (_state.newpagedivsize) {
                // we ignore index when the pagedivs have been resized
                var cps = {
                    width: _state.newpagedivsize.width,
                    height: _state.newpagedivsize.height
                };
                var bSize = _config.showpageborder && b ? _config.pageborderwidth * 2 : 0;
                var scale = (z || _config.zoom) / _state.newpagedivfullzoom;

                cps.height = Math.round(cps.height * scale) + bSize;
                cps.width = Math.round(cps.width * scale) + bSize;

                return cps;
            } else {
                return __getClientPageSize(i, z || _config.zoom, _config.showpageborder && b);
            }
        }

        // gets the page size of the given frame index, including borders and zoom
        // i: integer, frame index
        // z: float, desired zoom to calculate the size with
        // b: bool, add borders
        function __getClientPageSize(i, z, b) {
            // creates a size object clone so we don't modify the original size
            var cps = $.extend({}, __getPageSize(i));
            var bSize = b ? _config.pageborderwidth * 2 : 0;

            z = z * __getPageFitMultiplier(i);

            cps.height = Math.round(cps.height * z) + bSize;
            cps.width = Math.round(cps.width * z) + bSize;

            return cps;
        }

        // gets the frame index that should be located at the given coordinates 
        // x: integer, position on the x-axis
        // y: integer, position on the y-axis
        function __getIndexFromPos(x, y) {
            return __getPageOffsets(null, x, y).index;
        }

        // gets the frame index that should be located at the given coordinates
        // taking into account current _config.pageselectlocation setting
        // x: integer, position on the x-axis
        // y: integer, position on the y-axis
        function __getUIIndexFromPos(x, y) {
            var vs = __getViewportSize();
            var select = {
                x: x + _config.pageselectlocation.x * vs.width,
                y: y + _config.pageselectlocation.y * vs.height
            };
            return __getIndexFromPos(select.x, select.y);
        }

        // gets the DOM offsets of a DOM object
        // o: DOM object
        // stop: DOM object to get relative position to
        function __getDomOffsets(o, stop) {
            var ret = { left: 0, top: 0 };
            for (var obj = o; obj != null && obj !== stop; obj = obj.offsetParent) {
                ret.left += obj.offsetLeft;
                ret.top += obj.offsetTop;
            }
            return ret;
        }

        var _maxDocSize = {
            height: 0,
            isEmpty: function isEmpty() {
                return this.width === 0 && this.height === 0;
            },
            width: 0,
            zero: function zero() {
                this.width = 0;
                this.height = 0;
            },
            zoom: 1
        };

        // gets the maximum document size at the current zoom level by calculating it once
        function __getMaxDocumentSize() {
            if (_maxDocSize.isEmpty() || _maxDocSize.zoom !== _config.zoom) {
                var offsets = __getPageOffsets(null, null, null, _config.zoom);

                _maxDocSize.height = offsets.height;
                _maxDocSize.width = offsets.width;
                _maxDocSize.zoom = _config.zoom;
            }

            return _maxDocSize;
        }

        // gets the offsets of the page at the given index or at the given position}
        function __getPageOffsets(i, x, y, z) {
            return __getPageRangeOffsets(0, i, x, y, z);
        }

        // gets the offsets of the page range at the given index or at the given position
        // i: integer, frame index [nullable]
        // x: integer, position on the x-axis [nullable]
        // y: integer, position on the y-axis [nullable]
        // z: float, desired zoom to calculate the offsets with [optional]
        function __getPageRangeOffsets(start, end, x, y, z) {
            if (_config.tabular) {
                return __getTabularPageRangeOffsets(start, end, x, y, z);
            }

            var pgcount = _controllers.document.getPageCount();
            start = !!start ? start : 0;
            end = !!end || end === 0 ? end : pgcount;
            var retSize = { 'height': 0, 'width': 0, 'index': start };

            if (_config.direction === _direction.Vertical) {
                var tmpH = null;
                for (var j = start; j < pgcount && j < end && (retSize.height + (tmpH = __getClientPageDivSize(j, z).height) <= y || y == null); j++) {
                    retSize.height += tmpH + _config.pagespacing;
                    retSize.index++;
                }
            } else if (_config.direction === _direction.Horizontal) {
                var tmpW = null;
                for (var k = start; k < pgcount && k < end && (retSize.width + (tmpW = __getClientPageDivSize(k, z).width) <= x || x == null); k++) {
                    retSize.width += tmpW + _config.pagespacing;
                    retSize.index++;
                }
            }

            if (retSize.index >= pgcount && pgcount > 0) {
                retSize.index = pgcount - 1;
            }

            return retSize;
        }

        function __getTabularPageRangeOffsets(start, end, x, y, z) {
            if (start > end) return { width: 0, height: 0, index: end
            };

            var startOffset = __getTabularPageOffsets(start, x, y, z);
            var endOffset = __getTabularPageOffsets(end, x, y, z);

            endOffset.height = _config.direction === _direction.Vertical ? endOffset.height - startOffset.height : endOffset.height;
            endOffset.width = _config.direction === _direction.Horizontal ? endOffset.width - startOffset.width : endOffset.width;
            return endOffset;
        }

        // gets the offsets of the page at the given index or at the given position
        // i: integer, frame index [nullable]
        // x: integer, position on the x-axis [nullable]
        // y: integer, position on the y-axis [nullable]
        // z: float, desired zoom to calculate the offsets with [optional]
        function __getTabularPageOffsets(i, x, y, z) {
            var pgcount = _controllers.document.getPageCount();
            var retSize = { 'height': 0, 'width': 0, 'index': 0 };
            var offset = __getTabularIndexOffset(z);

            i = i == null ? i = pgcount : i;

            var cols, rows;
            if (_config.direction === _direction.Vertical) {
                cols = offset || 1;
                rows = Math.ceil(pgcount / cols);
            } else if (_config.direction === _direction.Horizontal) {
                rows = offset || 1;
                cols = Math.ceil(pgcount / rows);
            }

            //		var tmpW = 0;
            //		var tmpH = 0;

            var size = __getClientPageDivSize(0, z);
            size.width += _config.pagespacing;
            size.height += _config.pagespacing;

            var row = y == null ? Math.floor(i / cols) : Math.floor(y / size.height);
            var col = x == null ? i % cols : Math.ceil(x / size.width);

            retSize.height = row * size.height;
            retSize.width = col * size.width;
            retSize.index = row * cols + col;
            if (retSize.index >= pgcount && pgcount > 0) {
                retSize.index = pgcount - 1;
            }
            /*			
                    for (var row = 1; row <= rows && retSize.index < pgcount && retSize.index < i && ((retSize.height + tmpH <= y) || y == null); row++) {
                        for (var col = 1; col < cols && retSize.index < pgcount; col++) {
                            if (retSize.width + tmpW <= x || x == null) {
                                var pSize = __getClientPageDivSize(retSize.index, z);
            
                                // found the page we're looking for?
                                if (retSize.index >= i) {
                                    // column width is not additive
                                    retSize.width = tmpW;
                                    return retSize;
                                }
            
                                // only want to add the height of the largest page
                                if (pSize.height > tmpH) {
                                    tmpH = pSize.height;
                                }
            
                                tmpW += pSize.width + _config.pagespacing;
                            }
            
                            if (x !== null && y !== null && retSize.width + tmpW > x && retSize.height + tmpH > y) {
                                // found the index
                                return retSize;
                            }
            
                            retSize.index += (_config.direction === _direction.Vertical) ? offset: 1;
                        }
            
                        retSize.height += (tmpH + _config.pagespacing);
            
                        if (tmpW > retSize.width) {
                            retSize.width = tmpW;
                        }
            
                        tmpW = 0;
                    }
            */
            return retSize;
        }

        // gets the number of pages that are skipped over when scrolling by rows or columns
        // z: float, desired zoom to calculate the offsets with [optional]
        function __getTabularIndexOffset(z) {
            var offset = 1;

            if (_config.tabular) {
                var pageSpacing = _config.pagespacing || 0;
                var pageSize = __getClientPageDivSize(0, z);
                if (_config.direction === _direction.Vertical) {
                    offset = Math.floor(_dom.content.width() / pageSize.width);
                    // check if pages are not fit because of page div margins
                    offset = Math.min(offset, Math.floor((_dom.content.width() - offset * pageSpacing) / pageSize.width));
                } else if (_config.direction === _direction.Horizontal) {
                    offset = Math.floor(_dom.content.height() / pageSize.height);
                    offset = Math.min(offset, Math.floor((_dom.content.height() - offset * pageSpacing) / pageSize.height));
                }
            }

            return offset || 1;
        }

        function __getServerPageSize(i, extraRotation) {
            var size = __getPageSize(i);
            var angle = __getPageRotation(i) + (extraRotation || 0);
            return angle % 180 === 0 ? size : {
                width: size.height,
                height: size.width
            };
        }

        // gets the page size of the given frame index, if available
        // i: integer, frame index
        function __getPageSize(i) {
            var size = _controllers.document.getPageSize(i);
            return size ? size : _page.size;
        }

        // calculates the width of native browser scrollbars (used for older browsers)
        function __getScrollbarWidth() {
            var div = __createDiv($('body'));
            var idiv = __createDiv(div);

            div.css({ 'width': '50px', 'height': '50px', 'overflow': 'hidden', 'position': 'absolute', 'visibility': 'hidden' });
            idiv.css({ 'width': '100px', 'height': '100px' });

            var w = div.width();
            div.css({ 'overflow-y': 'scroll' });

            var rv = w - div[0].clientWidth;

            $(div).remove();
            return rv;
        }

        // gets the viewable area size, minus scrollbars
        function __getViewportSize() {
            return {
                'width': _dom.scrollV ? _dom.main.width() - _dom.scrollV.width() : _dom.main.width(),
                'height': _dom.scrollH ? _dom.main.height() - _dom.scrollH.scrollbarHeight() : _dom.main.height()
            };
        }

        // returns size of individual stripe in viewport grid
        function __getViewportGridStripeSize() {
            var vs = __getViewportSize();
            var bSize = _config.showpageborder ? _config.pageborderwidth * 2 : 0;
            var stripeSize = {
                width: vs.width - bSize,
                height: vs.height - bSize
            };

            if (_config.tabular) {
                if (_config.columns > 1) {
                    stripeSize.width = Math.floor((vs.width - (_config.pagespacing + bSize) * _config.columns) / _config.columns);
                }

                if (_config.rows > 1) {
                    stripeSize.height = Math.floor((vs.height - (_config.pagespacing + bSize) * _config.rows) / _config.rows);
                }
            }
            return stripeSize;
        }

        function __failStartAsync(reason, callback) {
            var failed = {
                status: 'fail',
                started: false,
                reason: reason
            };

            // only execute the callback if it exists
            if (typeof callback === 'function') {
                callback.call();
            }

            return failed;
        }

        // o: DOM object
        // stop: DOM object to get relative position to
        // le: int, left edge 
        // te: int, top edge 
        // re: int, right edge 
        // be: int, bottom edge 
        function __isObjectInRect(o, stop, le, te, re, be) {
            var pos = __getDomOffsets(o, stop);
            return pos.left <= re && pos.left + o.clientWidth >= le && pos.top <= be && pos.top + o.clientHeight >= te;
        }

        // a: Array object
        // i: index to move from
        // dest: destination index
        function __moveArrayIndexTo(a, i, dest) {
            if (i < a.length) {
                a.splice(dest, 0, a.splice(i, 1)[0]);
                return true;
            } else {
                return false;
            }
        }

        // logs status messages to the status div, if present
        // s: string, message to display
        function __status(s) {
            if (_config.showstatus && _dom.status) {
                _dom.status.html(s);
            }

            __triggerEvent({
                type: 'statusmessage',
                message: s
            });
        }

        // makes a reference to all events bound using _self.bind
        // bindargs: arguments object passed into __bindEvents
        // append: bool, whether the event is being added
        function __trackEventBinds(bindargs, append) {
            var evtDictionary;

            if (bindargs.length === 1 && _typeof(bindargs[0]) === 'object') {
                // object notation
                evtDictionary = bindargs[0];
            } else if (typeof bindargs[0] === 'string') {
                // string notation
                evtDictionary = {};
                var fcn = null;

                if (bindargs.length === 3) {
                    fcn = bindargs[2];
                } else if (bindargs.length === 2) {
                    fcn = bindargs[1];
                }

                var keys = bindargs[0].indexOf(' ') > -1 ? bindargs[0].split(' ') : [bindargs[0]];

                for (var i = 0; i < keys.length; i++) {
                    evtDictionary[keys[i]] = fcn;
                }
            }

            for (var key in evtDictionary) {
                if (evtDictionary.hasOwnProperty(key)) {
                    var evtParent = null;

                    // find the right controller parent
                    if (key in _events) {
                        evtParent = _events;
                    } else if (_self && key in _self.annotations.events) {
                        evtParent = _self.annotations.events;
                    } else if (_self && key in _self.forms.events) {
                        evtParent = _self.forms.events;
                    } else if (_self && key in _self.document.events) {
                        evtParent = _self.document.events;
                    }

                    if (evtParent == null) {
                        // custom event added by user, add to base
                        evtParent = _events;
                    }

                    if (evtParent[key] == null && append) {
                        evtParent[key] = [evtDictionary[key]];
                    } else {
                        if (append) {
                            // bind called
                            evtParent[key].push(evtDictionary[key]);
                        } else {
                            // unbind called
                            if (evtDictionary[key]) {
                                // look for function by reference
                                for (var f = 0; f < evtParent[key].length; f++) {
                                    if (evtParent[key][f] === evtDictionary[key]) {
                                        // remove if found
                                        evtParent[key].splice(f, 1);
                                    }
                                }
                            } else {
                                evtParent[key].length = 0;
                            }
                        }
                    }
                }
            }
        }

        // validates (and fixes) the config so we don't have to check the inputs every time we need them
        function __validateConfig() {
            _config.direction = _config.direction === _direction.Vertical || _config.direction === _direction.Horizontal ? _config.direction : _direction.Vertical;
            _config.fitting = _config.fitting === _fitting.None || _config.fitting === _fitting.Best || _config.fitting === _fitting.Width || _config.fitting === _fitting.Height ? _config.fitting : _fitting.Width;
            _config.pageborderwidth = __validateNumber(_config.pageborderwidth) ? parseInt(_config.pageborderwidth, 10) : 1;
            _config.pagespacing = __validateNumber(_config.pagespacing) ? parseInt(_config.pagespacing, 10) : 4;
            _config.showpageborder = _config.showpageborder ? true : false;
            _config.showpagenumber = _config.showpagenumber ? true : false;
            _config.showstatus = _config.showstatus ? true : false;
            _config.zoom = __validateNumber(_config.zoom, true) ? parseFloat(_config.zoom) : 1;

            _config.scripturl = __validateScriptUrl(_config.scripturl) ? _config.scripturl : _config.scripturl + '/';
        }

        function __validateScriptUrl(s) {
            if (s.length > 0) {
                if (s.indexOf('/', s.length - 1) !== -1 || s.indexOf('\\', s.length - 1) !== -1) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return true;
            }
        }

        // checks a number
        // n: value to check
        // f: bool, indicates whether to check float
        function __validateNumber(n, f) {
            if (f) {
                return isFinite(parseFloat(n));
            } else {
                return isFinite(parseInt(n, 10));
            }
        }

        // #endregion

        // #region Scrolling

        // asynchronously sets the scroll position to the given coordinates
        // x: integer, scroll position on the x-axis
        // y: integer, scroll position on the y-axis
        // ani: bool, indicates whether this scroll should animate
        // dur: int, the length of time for the animation, in milliseconds 
        // callback: function to execute after the scroll is done animating
        function __setScrollPositionAsync(x, y, ani, dur, callback) {
            if (callback == null && typeof dur === 'function') {
                callback = dur;
                dur = null;
            }

            x = x == null ? _dom.scroller.scrollLeft() : x;
            y = y == null ? _dom.scroller.scrollTop() : y;

            // this fills the edge div with enough space to allow scrolling there
            if (_config.direction === _direction.Horizontal) {
                if (x > _dom.viewport.width()) {
                    var maxSize = __getMaxDocumentSize();

                    if (x < maxSize.width && _dom.content.width() > 0) {
                        var fillSize = maxSize.width - (_dom.edges[0].width() + _dom.content.width());
                        _dom.edges[1].width(fillSize);
                    }
                }
            } else if (_config.direction === _direction.Vertical) {
                if (y > _dom.viewport.height()) {
                    var mSize = __getMaxDocumentSize();

                    if (y < mSize.height && _dom.content.height() > 0) {
                        var fSize = mSize.height - (_dom.edges[0].height() + _dom.content.height());
                        _dom.edges[1].height(fSize);
                    }
                }
            }

            // we use 'auto' to tell the mobile browser that this is scrollable with touch
            // but it breaks Android native 'Browser' programmatic scrolling, so we need
            // to switch it to 'hidden' before we scroll it programmatically
            //		if (Atalasoft.Utils.Browser.Mobile.Android){
            //			var resetOverflow = function(){
            //				_dom.scroller.css({'overflow' : 'auto'});
            //			};
            //			
            //			_dom.scroller.css({'overflow' : 'hidden'});
            //			
            //			callback = (typeof(callback) === 'function') ? functionFromArray([resetOverflow, callback]) : resetOverflow;
            //			ani = false;
            //		}

            _dom.scroller.stop();

            if (ani && !_state.loading && (_state.scrollPos.x !== x || _state.scrollPos.y !== y)) {
                $.when(_dom.scroller.animate({ 'scrollLeft': x, 'scrollTop': y }, {
                    duration: dur || _scd,
                    easing: 'easeOutQuad',
                    queue: false
                })).done(callback);
            } else {
                _dom.scroller.scrollLeft(x);
                _dom.scroller.scrollTop(y);

                if (typeof callback === 'function') {
                    callback.call();
                }
            }
        }

        // asynchronously scrolls by the given deltas
        // dx: integer, delta to scroll on the x-axis
        // dy: integer, delta to scroll on the y-axis
        // ani: bool, indicates whether this scroll should animate
        // dur: int, the length of time for the animation, in milliseconds 
        // callback: function to execute after the scroll is done animating
        function __setScrollPositionByAsync(dx, dy, ani, dur, callback) {
            var x = _dom.scroller.scrollLeft() + dx;
            var y = _dom.scroller.scrollTop() + dy;

            __setScrollPositionAsync(x, y, ani, dur, callback);
        }

        // asynchronously scrolls to the next or previous page
        // inc: incremental amount, positive or negative
        // callback: function to execute after the scroll is done animating
        function __scrollNextPrevAsync(inc, callback) {
            //if (!_dom.scroller.is(':animated')){
            var offsets = __getPageOffsets(_page.number + inc - 1);

            __setScrollPositionAsync(offsets.width, offsets.height, true, callback);
            //}
            //else{
            //    // animation couldn't start because one was already going
            //    return __failStartAsync('scrolling', callback);
            //}
        }

        // adjusts the scrollbar tray height/widths, so that they accurately indicate the size of the document
        function __adjustScrollBars() {
            if (_dom.scrollH && _dom.scrollV) {
                var maxSize = 30000;
                var pgcount = _controllers.document.getPageCount();

                // When the scrollbars resize, scroll events can happen
                // pausing event propagation will stop them from setting the main scroller position
                _dom.scrollH.pauseEventPropagation();
                _dom.scrollV.pauseEventPropagation();

                if (_config.direction === _direction.Vertical) {
                    __adjustSecondaryScrollbar(_dom.scrollH, 'width');

                    var newH = Math.round(__getPageOffsets(pgcount - 1).height + __getClientPageDivSize(pgcount - 1).height);
                    _dom.scrollV.scrollSize(newH - (_dom.scrollV.height() - _dom.scrollH.scrollbarHeight() - 1));

                    if (newH > maxSize) {
                        _dom.scrollV.ratio(newH / (maxSize - (_dom.scrollV.height() - _dom.scrollH.scrollbarHeight() - 1)));
                        _dom.scrollV._tray.height(maxSize);
                    } else {
                        _dom.scrollV._tray.height(newH);
                        _dom.scrollV.ratio(1);
                    }

                    __adjustScrollbarVisibility(_dom.scrollV);
                } else if (_config.direction === _direction.Horizontal) {
                    __adjustSecondaryScrollbar(_dom.scrollV, 'height');

                    var newW = Math.round(__getPageOffsets(pgcount - 1).width + __getClientPageDivSize(pgcount - 1).width);
                    _dom.scrollH.scrollSize(newW);

                    if (newW > maxSize) {
                        _dom.scrollH.ratio(newW / (maxSize - (_dom.scrollH.width() - _dom.scrollV.width() - 1)));
                        _dom.scrollH._tray.width(maxSize);
                    } else {
                        _dom.scrollH._tray.width(newW);
                        _dom.scrollH.ratio(1);
                    }

                    __adjustScrollbarVisibility(_dom.scrollH);
                }

                // calculate max scroll positions
                _dom.scrollV._max = Math.max(_dom.scrollV._tray.height() - _dom.scrollV.height(), 0) + 1;
                _dom.scrollH._max = Math.max(_dom.scrollH._tray.width() - _dom.scrollH.width(), 0) + 1;

                // done resizing, allow propagation
                _dom.scrollH.resumeEventPropagation();
                _dom.scrollV.resumeEventPropagation();
            }
        }

        // less calculation scrollbar adjust
        function __resizeScrollBars(dx, dy) {
            var maxSize = 30000;
            if (_config.direction === _direction.Vertical) {
                if (_dom.scrollV) {
                    _dom.scrollV.scrollSize(Math.max(_dom.scrollV._scrollSize + dy, 0));
                    if (_dom.scrollV._ratio === 1 && _dom.scrollV._scrollSize + dy < maxSize) {
                        _dom.scrollV._tray.height(_dom.scrollV._tray.height() + dy);
                        _dom.scrollV._max = Math.max(_dom.scrollV._tray.height() - _dom.scrollV[0].clientHeight, 0) + 1;
                    } else {
                        var viwprotHeight = _dom.scrollV.height() - _dom.scrollH.scrollbarHeight() - 1;
                        var height = (maxSize - viwprotHeight) * _dom.scrollV._ratio;
                        if (height + dy > maxSize) {
                            _dom.scrollV.ratio((height + dy) / (maxSize - viwprotHeight));
                        } else {
                            __adjustScrollBars();
                        }
                    }
                }
                __adjustScrollbarVisibility(_dom.scrollV);
                __adjustSecondaryScrollbar(_dom.scrollH, 'width');
            } else if (_config.direction === _direction.Horizontal) {
                if (_dom.scrollH) {
                    _dom.scrollH.scrollSize(Math.max(_dom.scrollH._scrollSize + dx, 0));
                    if (_dom.scrollH._ratio === 1 && _dom.scrollH._scrollSize + dx < maxSize) {
                        _dom.scrollH._tray.width(_dom.scrollH._tray.width() + dx);
                        _dom.scrollH._max = Math.max(_dom.scrollH._tray.width() - _dom.scrollH[0].clientWidth, 0) + 1;
                        _dom.scrollH.ratio(_dom.scrollH._scrollSize / _dom.scrollH._max);
                    } else {
                        var viewportWidth = _dom.scrollH.width() - _dom.scrollV.width() - 1;
                        var width = (maxSize - viewportWidth) * _dom.scrollH._ratio;
                        if (width + dx > maxSize) {
                            _dom.scrollH.ratio((width + dx) / (maxSize - viewportWidth));
                        } else {
                            __adjustScrollBars();
                        }
                    }
                }

                __adjustScrollbarVisibility(_dom.scrollH);
                __adjustSecondaryScrollbar(_dom.scrollV, 'height');
            }

            if (dx !== 0 || dy !== 0) {
                if (dy !== 0) {
                    var x = _dom.scroller[0].scrollLeft;
                    var y = _dom.scroller[0].scrollTop;
                    __setPageNumber(__getUIIndexFromPos(x, y) + 1);
                    __triggerEvent({
                        type: 'scroll',
                        x: x,
                        y: y,
                        dx: 0,
                        dy: 0
                    });
                }
            }
        }

        function __adjustSecondaryScrollbar(scrollbar, key) {
            if (!scrollbar) {
                return;
            }

            var cs = Math.round(_page.size[key] * _config.zoom);
            if (_config.tabular) {
                cs = _dom.content[key]();
            } else {
                for (var i = 0; i < _dom.pageDivs.length; i++) {
                    if (_dom.pageDivs[i]._index != null) {
                        cs = Math.max(__getClientPageDivSize(_dom.pageDivs[i]._index)[key], cs);
                    }
                }
            }

            // scrollbar tray is 1:1
            scrollbar._tray[key](cs);
            scrollbar.scrollSize(cs - scrollbar[key]());
            __adjustScrollbarVisibility(scrollbar);
            scrollbar.ratio(1);
        }

        function __adjustScrollbarVisibility(scrollbar) {
            if (!scrollbar) {
                return;
            }

            // calculated size is just a little too much for fit
            if (scrollbar._scrollSize <= 0) {
                // hide the scroll tray
                scrollbar._tray.hide();
            } else {
                scrollbar._tray.show();
            }
        }

        // scroll event that fires from the browser when the scroller object changes scroll position
        // e: event object 
        function __onScroll(e) {
            if (_state.zooming || _state.scrollBuffer || !_dom.pageDivs.length) {
                return;
            }

            var t = new Date().getTime();
            var x = _dom.scroller[0].scrollLeft;
            var y = _dom.scroller[0].scrollTop;
            var x1 = x + _dom.scroller[0].clientWidth;
            var y1 = y + _dom.scroller[0].clientHeight;
            var n = __getIndexFromPos(x, y) + 1;
            // show prev/next is written to shift whole lines/rows in grid layout(otherwise shownext will stuck, since scrolling in non-main direction never changes _page.number now). 
            var dn = Math.abs(n - _page.number) / __getTabularIndexOffset();

            if (!_state.loading) {
                var pageCount = _controllers.document.getPageCount(),
                    startIndex = _dom.pageDivs[0]._index,
                    endIndex = _dom.pageDivs[_dom.pageDivs.length - 1]._index;
                var pagesOutOfSync = dn === 0 && (_page.number - 1 < startIndex || _page.number - 1 > endIndex);

                if (dn < _dom.pageDivs.length && !pagesOutOfSync) {
                    if (__isObjectInRect(_dom.edges[1][0], _dom.scroller[0], x, y, x1, y1) && endIndex < pageCount - 1) {
                        __showNext(dn);
                    } else if (__isObjectInRect(_dom.edges[0][0], _dom.scroller[0], x, y, x1, y1) && startIndex > 0) {
                        __showPrevious(dn);
                    } else if (n !== _page.number && __findPageFromIndex(n - 1) === null) {
                        __showPage(n);
                    }
                } else {
                    __showPageAsync(n, false, null);
                }

                __adjustVisiblePages();
            }

            __setPageNumber(__getUIIndexFromPos(x, y) + 1);

            if (!_dom.scroller.propagationPaused() && _dom.scrollH && _dom.scrollV) {
                var horiz = Math.round(x / _dom.scrollH._ratio);
                var vert = Math.round(y / _dom.scrollV._ratio);

                // scroll doesn't fire if it's already at that point
                if (horiz !== _dom.scrollH.scrollLeft()) {
                    // pause event propagation, and resume once the scroll event fires
                    _dom.scrollH.pauseEventPropagation(true);

                    // set horizontal scrollbar position
                    _dom.scrollH.scrollLeft(horiz);
                }

                if (vert !== _dom.scrollV.scrollTop()) {
                    // pause event propagation, and resume once the scroll event fires
                    _dom.scrollV.pauseEventPropagation(true);

                    // set vertical scrollbar position
                    _dom.scrollV.scrollTop(vert);
                }
            }

            __triggerEvent({
                type: 'scroll',
                x: x,
                y: y,
                dx: x - _state.scrollPos.x,
                dy: y - _state.scrollPos.y
            });

            if (e) {
                if (_state.scrollTimeout) {
                    clearTimeout(_state.scrollTimeout);
                }

                _state.scrollTimeout = setTimeout(function () {
                    __onScrollTimeout(x, y);
                }, 500);

                // in chrome canary(17-01-2017), scrollTop & scrollLeft could change during this method and differ from x & y
                // get most recent scrollbar values
                _state.scrollPos.x = _dom.scroller[0].scrollLeft;
                _state.scrollPos.y = _dom.scroller[0].scrollTop;
                _state.scrollPos.t = t;
            }

            _state.scrollBuffer = e ? setTimeout(__scrollBuffer, 50) : null;
        }

        function __onScrollCompleted() {
            __redrawVisiblePages();

            __triggerEvent({
                type: 'scrollFinished'
            });
        }

        // called after onscroll to figure out when scrolling has stopped and redraw pages
        function __onScrollTimeout(ox, oy) {
            var sbX = _dom.scroller[0].scrollLeft;
            var sbY = _dom.scroller[0].scrollTop;
            var scrollComplete = sbX === _state.scrollPos.x && sbY === _state.scrollPos.y;

            if (ox === _state.scrollPos.x && oy === _state.scrollPos.y && scrollComplete) {
                // this is the last timeout among created ones and there were no scroll attempts.
                __redrawVisiblePages();
                _state.scrollTimeout = null;
                if (!_state.loading) {
                    // it's possible that pages are not inserted into dom when scrolling(showPage as an example). 
                    // in such case adjusting on scroll is ignored. neeed to make sure state is correct after load.
                    __adjustVisiblePages();
                }
            } else if (!scrollComplete) {
                // we miss some scroll events. probably due to scrollBuffer - force __onScroll with setting new __onScrollTimeout
                __onScroll({});
                _state.scrollTimeout = null;
            }
        }

        function __scrollBuffer() {
            if (_state.scrollBuffer !== null) {
                clearTimeout(_state.scrollBuffer);
                _state.scrollBuffer = null;
            }
        }

        // #endregion

        // #region Page functions

        // adjusts the trailing and leading edge div widths, so that they occupy the right amount of space
        function __adjustEdgeWidths() {
            if (_config.direction === _direction.Vertical) {
                if (Atalasoft.Utils.Browser.Explorer && parseInt(Atalasoft.Utils.Browser.Version, 10) < 8) {
                    _dom.edges[0].width(_dom.content.width());
                    _dom.edges[1].width(_dom.content.width());
                }
            } else if (_config.direction === _direction.Horizontal) {
                // not use page div size or page size, because it's asynchronously changing right now during zoom.
                // on thumbnailer page div is square having side length as max image side size.
                var height = _dom.pageDivs.length ? (!_isThumbnailer ? _page.size.height : Math.max(_page.size.height, _page.size.width)) * _config.zoom : 0;
                if (_config.thumbpadding && typeof _config.thumbpadding === "number") {
                    height += _config.thumbpadding * 2;
                }
                _dom.edges[0].height(height);
                _dom.edges[1].height(height);
            }
        }

        // adjusts the trailing and leading edge div heights, so that they occupy the right amount of space
        // sIndex: int, starting frame index
        // eIndex: int, ending frame index
        function __adjustEdgeHeights(sIndex, eIndex) {
            eIndex = !eIndex && eIndex !== 0 ? sIndex + _dom.pageDivs.length - 1 : eIndex;
            eIndex = Math.max(sIndex, eIndex);
            var tabularOffset = _config.tabular ? __getTabularIndexOffset() : 1;

            // number of row/columns to move to the next row/column.
            var inc = _config.tabular ? (Math.floor(eIndex / tabularOffset) + 1) * tabularOffset - eIndex : 1;
            var startEdgeOffset = __getPageOffsets(sIndex);

            var pageCount = _controllers.document.getPageCount();
            // need to add last div size, since offsets calculates to the beginning of the page.
            var lastVisibleDivSize = eIndex < pageCount ? __getClientPageDivSize(eIndex) : { width: 0, height: 0 };
            var lastDocumentPageSize = eIndex < pageCount - tabularOffset ? __getClientPageDivSize(pageCount - 1) : { width: 0, height: 0 };
            var visiblePagesOffset = __getPageRangeOffsets(sIndex, eIndex);
            visiblePagesOffset.width += lastVisibleDivSize.width;
            visiblePagesOffset.height += lastVisibleDivSize.height;
            var endEdgeOffset = __getPageRangeOffsets(eIndex + 1, pageCount - 1);
            endEdgeOffset.width += lastDocumentPageSize.width;
            endEdgeOffset.height += lastDocumentPageSize.height;

            if (_config.direction === _direction.Vertical) {
                _dom.edges[0].height(startEdgeOffset.height);

                if (eIndex + inc >= _controllers.document.getPageCount()) {
                    var docHeight = startEdgeOffset.height + visiblePagesOffset.height + endEdgeOffset.height;
                    if (_dom.scrollH && docHeight > _dom.scroller[0].clientHeight && _dom.content.width() <= _dom.scroller[0].clientWidth) {
                        // set edge to cover our  virtual bottom horizontal scroll bar.  if content width is bigger then viewport, browser will add scrollbar to dom.scroller
                        _dom.edges[1].height(_dom.scrollH.scrollbarHeight());
                    } else {
                        _dom.edges[1].height(0);
                    }
                } else {
                    _dom.edges[1].height(endEdgeOffset.height);

                    // set height back to no value
                    if (Atalasoft.Utils.Browser.Chrome) {
                        _dom.content.height('');
                    }
                }
            } else if (_config.direction === _direction.Horizontal) {
                _dom.edges[0].width(startEdgeOffset.width);

                if (eIndex + inc >= _controllers.document.getPageCount()) {
                    var docWidth = startEdgeOffset.width + visiblePagesOffset.width + endEdgeOffset.width;
                    if (_dom.scrollV && docWidth > _dom.scroller[0].clientWidth && _dom.content.height() <= _dom.scroller[0].clientHeight) {
                        if (!_dom.scrollV._explicitSize) {
                            _dom.edges[1].width(_dom.scrollV.width());
                        } else {
                            // we could have explicit vertical scrollbar size, for example in FF. So need to check whether it's actually something to scroll.
                            _dom.edges[1].width(_dom.scrollV.height() < _dom.scrollV._tray.height() ? _dom.scrollV.width() : 0);
                        }
                    } else {
                        _dom.edges[1].width(0);
                    }
                } else {
                    _dom.edges[1].width(endEdgeOffset.width);
                    _dom.edges[1].height(1);
                }
            }
        }

        function __getActivePage() {
            return _state.activepage;
        }

        // recycles a page out of view and shows the previous page
        // n: int, number representing how many pages to show
        function __showPrevious(n) {
            n = n ? n : 1;

            if (_state.prpr === 0 && _dom.pageDivs.length > 0) {
                var tabularOffset = __getTabularIndexOffset(_config.zoom); // how many pages per row or column			
                __pausePageRequests();

                for (var c = n; c > 0; c--) {
                    var newIndex = _dom.pageDivs[0]._index - tabularOffset;

                    if (newIndex >= 0 && newIndex < _controllers.document.getPageCount()) {
                        // loop through rows or columns backwards
                        for (var i = tabularOffset - 1; i >= 0; i--) {
                            var pg = __getRecycledPage(-1);
                            __removePageContents(pg);
                            _dom.content.prepend(pg);
                            __insertPageContents(pg, __requestPageAsync(newIndex + i), newIndex + i);
                        }

                        __adjustEdgeHeights(newIndex, null);
                        __adjustEdgeWidths();

                        if (Atalasoft.Utils.Browser.Explorer && parseInt(Atalasoft.Utils.Browser.Version, 10) <= 8) {
                            // re-flows the content container so that the pages do not overlap
                            // this is only necessary for IE versions earlier than 9
                            _dom.content[0].className = _dom.content[0].className;
                        }
                    }
                }

                setTimeout(__resumePageRequests, 10);
            }
        }

        // recycles a page out of view and shows the next page
        // n: int, number representing how many pages to show
        function __showNext(n) {
            n = n ? n : 1;
            var next = _dom.pageDivs[_dom.pageDivs.length - 1]._index + 1;

            if (_state.prpr === 0 && _dom.pageDivs.length > 0 && next < _controllers.document.getPageCount()) {
                __pausePageRequests();

                // how many pages per row or column
                var tabularOffset = __getTabularIndexOffset(_config.zoom);
                var pageCount = _controllers.document.getPageCount();
                for (var c = n; c > 0; c--) {
                    var newIndex = _dom.pageDivs[_dom.pageDivs.length - 1]._index + 1;

                    if (newIndex < pageCount) {
                        // assume that page divs are always aligned to the end of row/coulumn
                        var trailing = newIndex + tabularOffset - 1 - _dom.pageDivs.length;
                        for (var i = 0; i < tabularOffset; i++) {
                            var pg = __getRecycledPage(1);
                            __removePageContents(pg);
                            _dom.content.append(pg);
                            __insertPageContents(pg, __requestPageAsync(newIndex + i), newIndex + i);
                        }

                        __adjustEdgeHeights(trailing + 1, newIndex);
                        __adjustEdgeWidths();
                    }
                }

                setTimeout(__resumePageRequests, 10);
            }
        }

        /**
        * Scrolls the viewer to the given page index and executes the callback when finished.
        * @param {number} index - Index of the page to show.
        * @param {NotificationCallback} [callback] - Function to execute after this operation is done.
        *  @instance
        * @memberOf Atalasoft.Controls.WebDocumentViewer
        * @function showPage
        */
        function __showPageAtIndex(index, callback) {
            __showPage(index + 1, callback);
        }

        /**
        * Scrolls the viewer to the given page number and executes the callback when finished.
        * @param {number} pageNumber - Number of the page to show. Note that page number is expected 1-based.
        * @param {NotificationCallback} [callback]: function to execute after this operation is done
        * @instance
        * @memberOf Atalasoft.Controls.WebDocumentViewer
        * @function showPageNumber
        * @deprecated Please use {@link Atalasoft.Controls.WebDocumentViewer#showPage|showPage} instead.
        */
        function __showPage(pageNumber, callback) {
            pageNumber = Math.max(1, pageNumber); // make sure pageNumber >= 1
            pageNumber = Math.min(_controllers.document.getPageCount(), pageNumber); // make sure pageNumber <= pagecount

            if (_page.number !== pageNumber) {
                var delta = pageNumber - _page.number;

                if (Math.abs(delta) < _dom.pageDivs.length) {
                    __scrollNextPrevAsync(delta, callback);
                } else {
                    __showPageAsync(pageNumber, true, callback);
                }
            } else if (typeof callback === 'function') {
                callback.call();
            }
        }

        // recycles all viewed pages, sets the current page to the given index, and loads other viewable pages
        // pagenum: int, page number (1 based)
        // scrollNeeded: bool, whether to scroll to the page
        // callback: function to execute after this operation is done
        function __showPageAsync(pagenum, scrollNeeded, callback) {
            var pgcount = _controllers.document.getPageCount();
            var i = pagenum - 1; // frame index (zero based)

            if (_state.prpr === 0 && pgcount > 0) {

                var resumecallback = function resumecallback() {
                    __resumePageRequests(!scrollNeeded);

                    // only execute the callback if it exists
                    if (typeof callback === 'function') {
                        callback.call();
                    }
                };

                __pausePageRequests();

                var sH = 0; // scroll offset height
                var sW = 0; // scroll offset width
                var si = i <= 0 ? 0 : i; // start index (zero based)

                if (si + _dom.pageDivs.length >= pgcount) {
                    // move the start index to the max, accounting for room, and making sure not to go under 0
                    si = pgcount - _dom.pageDivs.length;
                    if (_config.tabular) {
                        var tabularOffset = __getTabularIndexOffset();
                        // shift forward to the end of row to have whole last row shown(not existing pages won't be rendered). if we shift backward, last row wont fit.
                        si = Math.ceil(si / tabularOffset) * tabularOffset;
                    }
                    si = Math.max(si, 0);
                }

                if (_config.direction === _direction.Vertical) {
                    sH = __getPageOffsets(si).height;
                    _dom.edges[0].height(sH); // sets the top edge offset height

                    __adjustEdgeHeights(si, null);
                    __adjustEdgeWidths(); // adjusts the widths of the edges to fit

                    // recycles all the page content
                    __emptyPages();

                    // inserts images for the new location
                    for (var j = 0; j < _dom.pageDivs.length; j++) {
                        _dom.content.append(_dom.pageDivs[j]);
                        __insertPageContents(_dom.pageDivs[j], null, si + j);
                    }

                    var ny = __getPageOffsets(Math.max(i, 0)).height; // vertical location of the page to show
                    var inc = _page.number < pagenum ? -_page.size.height : _page.size.height;

                    if (scrollNeeded && ny !== _state.scrollPos.y) {
                        __setScrollPositionAsync(null, ny + inc, false);
                        __setScrollPositionAsync(null, ny, true, resumecallback);
                    } else {
                        resumecallback.call();
                    }
                } else if (_config.direction === _direction.Horizontal) {
                    sW = __getPageOffsets(si).width;
                    _dom.edges[0].width(sW); // sets the top edge offset height

                    __adjustEdgeHeights(si, null);
                    __adjustEdgeWidths(); // adjusts the widths of the edges to fit

                    // recycles all the page content
                    __emptyPages();

                    // inserts images for the new location
                    for (var h = 0; h < _dom.pageDivs.length; h++) {
                        _dom.content.append(_dom.pageDivs[h]);
                        __insertPageContents(_dom.pageDivs[h], null, si + h);
                    }

                    var nx = __getPageOffsets(Math.max(i, 0)).width; // horizontal location of the page to show
                    var incH = _page.number < pagenum ? -_page.size.width : _page.size.width;

                    if (scrollNeeded && nx !== _state.scrollPos.x) {
                        __setScrollPositionAsync(nx + incH, null, false);
                        __setScrollPositionAsync(nx, null, true, resumecallback);
                    } else {
                        resumecallback.call();
                    }
                }
            } else {
                __failStartAsync('paused', callback);
            }
        }

        function __setActivePage(pg) {
            _state.activepage = pg;
        }

        // sets the page number indicator to the given index
        // i: int, frame index + 1 
        function __setPageNumber(i) {
            var count = _controllers.document.getPageCount();
            if (i > 0 && i <= count) {
                if (_page.number !== i || _page.numberoutof !== count) {
                    _dom.pageLabel.html(i + ' / ' + count);

                    if (_page.number !== i) {
                        _page.number = i;

                        for (var j = 0; j < _dom.pageDivs.length; j++) {
                            var div = _dom.pageDivs[j];
                            if (div._index === i - 1) {
                                div.addClass(_domClasses.atala_active_page);
                            } else {
                                div.removeClass(_domClasses.atala_active_page);
                            }
                        }

                        __triggerEvent({
                            type: 'pagenumberchanged',
                            number: _page.number
                        });
                    }

                    if (_page.numberoutof !== count) {
                        _page.numberoutof = count;
                    }
                }
            } else {
                _dom.pageLabel.html('');
                _dom.viewport.find('.' + _domClasses.atala_active_page).removeClass(_domClasses.atala_active_page);
                _page.numberoutof = 0;
            }
        }

        // empties the contents of the page holder divs
        function __emptyPages() {
            for (var i = _dom.pageDivs.length - 1; i >= 0; i--) {
                __removePageContents(_dom.pageDivs[i]);
            }
        }

        // removes the loaded images from the dom 
        function __emptyImages() {
            for (var i = 0; i < _dom.loadedImgs.length; i++) {
                if (_dom.loadedImgs[i]) {
                    _dom.loadedImgs[i].dispose();
                    _dom.loadedImgs[i].remove();
                }
            }

            _dom.loadedImgs.length = 0;
        }

        // removes the contents of the given page div
        // pg: jQuery page div object
        function __removePageContents(pg) {
            if (Atalasoft.Utils.Browser.Explorer && document.activeElement && pg.has(document.activeElement).length) {
                // Workaround for keyboard scrolling in IE - if page get recycled we have to preserve focus to let user scroll further.
                _dom.scroller.focus();
            }

            // detach the given page from the parent object
            pg.detach();

            // we only need to detach the image from the page, since all of the other objects can be reused
            if (pg._img != null) {
                pg._img._page = null;
                pg._img.getDomElement().detach();
                pg._img = null;
            }

            __triggerEvent({
                type: 'pagerecycled',
                index: pg._index,
                page: pg
            });

            pg._index = -1;
            pg.removeAttr(_domAttributes.atala_page_index);
        }

        // deletes the given page div
        // pg: jQuery page div object
        function __deletePage(pg) {
            // clear div first so we won't lose event bindings for dom images while they are in cache.
            __removePageContents(pg);
            pg._index = -1;
            pg.removeAttr(_domAttributes.atala_page_index);
            pg._img = null;
            pg.remove();
        }

        // inserts the given image into the given page div, adding page number if necessary
        // pg: jQuery page div object
        // img: jQuery image object
        // index: page index
        // delayInsert: indicates whether to reset image into page.
        function __insertPageContents(pg, img, index, delayInsert) {
            if (pg._index === index && pg._img === img && !delayInsert) {
                return false; // this page doesn't need to be requested
            } else if (delayInsert && !pg.nullinserted && index < 0) {
                // image wasn't added to dom when created because it wasn't loaded. 
                // now it's finally loaded, but need to skip it if page were already reused for other image, 
                // i.e. is already have other index and thus corresponds to other image.
                return false;
            }

            pg._index = index;
            pg.attr(_domAttributes.atala_page_index, index);

            if (index >= _controllers.document.getPageCount()) {
                // this covers tabular layout case when last row of images is not fully filled because last document image is not last image in a row or column.
                pg.hide();
                return false;
            }

            if (pg._img && pg._img !== img) {
                pg._img._page = null;
                if (pg.has(pg._img.getDomElement()).length > 0) {
                    pg._img.getDomElement().detach(undefined, true);
                }
            }

            if (pg._rubberband) {
                pg._rubberband.reset();
            }
            pg._img = img;
            if (pg._img) {
                pg._img._page = pg;
            }
            pg.css({
                display: _config.tabular || _config.direction === _direction.Horizontal ? 'inline-block' : 'block'
            });

            if (_config.showpagenumber) {
                pg.css({ 'position': 'relative' });

                if (!pg._num) {
                    pg._num = $('<div style="position:absolute; right:20px; bottom:16px;z-index:1"/>');
                    pg._num.addClass(_domClasses.atala_page_number);
                    pg.append(pg._num);
                }

                pg._num.text(pg._index + 1);
            }

            var oldIe = Atalasoft.Utils.Browser.Explorer && parseInt(Atalasoft.Utils.Browser.Version, 10) <= 8,
                skipInsert = oldIe && pg._img && !pg._img._loaded;

            if (pg._img && pg._img._binds) {
                if (!pg._img._binds.pageresize) {
                    pg._img._binds.pageresize = function (e) {

                        __triggerEvent({
                            type: 'pageresize',
                            page: e.image._page,
                            image: e.image,
                            index: e.image._page ? e.image._page._index : _controllers.document.getPageIndexByImageIndex(e.image._index),
                            width: e.width,
                            height: e.height
                        });
                    };

                    pg._img.bind({
                        pageresize: pg._img._binds.pageresize
                    });
                }

                if (!pg._img._binds.pagesizechanged) {
                    pg._img._binds.pagesizechanged = function (e) {
                        __triggerEvent({
                            type: 'pagesizechanged',
                            page: pg,
                            image: e.image,
                            index: e.index,
                            width: e.width,
                            height: e.height,
                            dx: e.dx,
                            dy: e.dy
                        });
                    };

                    pg._img.bind({
                        pagesizechanged: pg._img._binds.pagesizechanged
                    });
                }
            }

            if (pg._img && !skipInsert) {
                var pageAnchor = pg._img.getDomElement();
                if (oldIe && pageAnchor.find(pg._img).length === 0) {
                    pageAnchor.append(pg._img);
                }

                // intermediate div used to explicitly size page when view transforms is applied to the image.
                pg.append(pageAnchor);
                pg._img.trigger({
                    type: 'inserted',
                    page: pg
                });

                // at this point the image has been added to the page, but has no size until the server returns it
                // so we transfer the base size of the div to the image, so we can remove the size from the page
                if (!pg._img._loaded) {
                    // indicates whether we've preloaded the div a base size already
                    if (pg.nullinserted) {
                        pg._img.css({
                            width: pg.width(),
                            height: pg.height()
                        });
                    } else {
                        __initializeObjectToPageSize(pg._img, pg._index);
                    }
                }

                // if the page div already has a new size, don't remove it
                if (!_state.newpagedivsize) {
                    pg.css({
                        width: '',
                        height: ''
                    });
                }

                pg.nullinserted = false;
            } else {
                // marker to indicate that we've preloaded the div with null, and given it a base size
                pg.nullinserted = true;
                // at this point the image hasn't been added to the page yet, so the we need to
                // give the page div some size so that it can be scrolled smoothly
                if (!_state.newpagedivsize) {
                    __initializeObjectToPageSize(pg, pg._index);
                }
            }

            __triggerEvent({
                type: 'pageshown',
                page: pg,
                index: pg._index
            });

            return true;
        }

        function __initializeObjectToPageSize(obj, i) {
            var pagesize = __getClientPageDivSize(i, null, false);

            obj.css({
                width: pagesize.width,
                height: pagesize.height
            });
        }

        // tells the viewer not to load more images until resume is called 
        function __pausePageRequests() {
            _state.prpr++;
        }

        // tells the viewer to resume loading images 
        function __resumePageRequests(supressScroll) {
            if (_state.prpr === 0) {
                return;
            } else {
                _state.prpr--;

                if (_state.prpr === 0 && !supressScroll) {
                    __onScroll();
                }
            }
        }

        // recycles a page div at the beginning or end of the array
        // i: int, positive to move forward, negative to move backward  
        function __getRecycledPage(i) {
            if (i > 0) {
                // moving forward
                __moveArrayIndexTo(_dom.pageDivs, 0, _dom.pageDivs.length - 1);
                return _dom.pageDivs[_dom.pageDivs.length - 1];
            } else {
                // moving backward
                __moveArrayIndexTo(_dom.pageDivs, _dom.pageDivs.length - 1, 0);
                return _dom.pageDivs[0];
            }
        }

        /**
         * Checks whether specified document page have been loaded. 
         * @param {number} index - Page index.
         * @returns {boolean} `true` if page have already been loaded; `false` otherwise.
         * @instance
         * @memberOf Atalasoft.Controls.WebDocumentViewer
         * @function isPageLoaded
         */
        function __isPageLoaded(index) {
            var pageInfo = _controllers.document.getPageDefinition(index);
            return pageInfo.cacheIndex >= 0 && _dom.loadedImgs[pageInfo.cacheIndex] && _dom.loadedImgs[pageInfo.cacheIndex]._loaded;
        }

        /**
        * Reloads the specified page.
        * @param {number} index - The index of the page to reload.
        * @param {string|boolean} [annotations=false] - Url of the annotation xmp file or flag indicating whether to reload annotations of boolean flag indicating whether to load annotations data.
        * @param {string|boolean} [forms] - Url of the form file or flag indicating whether to reload forms of boolean flag indicating whether to load forms data.
        * @param {object} [params] - A plain object containing optional parameters that will be passed to server.
        *
        * Params could contain any application specific information that should be passed to server.
        * For example, this could be the aggregated list of the parameters that was used in {@link Atalasoft.Controls.WebDocumentViewer#reloadPage|reloadPage} calls for different pages.
        * @param {NotificationCallback} [callback] - function that is called when page have been loaded.
        *
        * This object will be available on the server side hander as an key-values collection. This allows to pass specific load options for individual pages.
        * @function Atalasoft.Controls.WebDocumentViewer#reloadPage
        */
        function __reloadPage(index, annotations, forms, params, callback) {
            var deffered = $.Deferred(),
                pageDeffered = $.Deferred(),
                annotationDeffered = $.Deferred(),
                formsDeffered = $.Deferred();

            if (typeof params === "function") {
                callback = params;
                params = undefined;
            }
            if (typeof forms === "function") {
                callback = forms;
                forms = false;
            }
            if (typeof annotations === "function") {
                callback = annotations;
                annotations = false;
            }

            if (typeof callback === "function") {
                deffered.done(callback);
            }
            var pageInfo = _controllers.document.getPageDefinition(index);
            if (!pageInfo) {
                deffered.resolve();
                return deffered.promise();
            }

            if (pageInfo.cacheIndex >= 0 && _dom.loadedImgs[pageInfo.cacheIndex]) {
                pageDeffered = __silentReloadPage(pageInfo, params);
            } else {
                __requestPageAsync(index, params, function () {
                    pageDeffered.resolve();
                });
            }

            var annotationsUrl = typeof annotations === "string" ? annotations : !pageInfo.uri ? _config.annotationsurl : null;
            if (_config.allowannotations && !!annotations && (annotationsUrl || pageInfo.uri)) {
                // _config.annotationsurl means that some annotations have been loaded for document
                _controllers.annotations.loadAnnotationsUrl(_config.serverurl, annotationsUrl, pageInfo.uri, pageInfo.index, 1, index, function () {
                    annotationDeffered.resolve(true);
                });
            } else {
                if (!!annotations) {
                    // clear all annotations on the page if there were no annotations for the document.
                    _controllers.annotations.loadAnnotations({
                        layers: [[]],
                        offset: index
                    });
                }
                annotationDeffered.resolve(!!annotations);
            }

            var formsUrl = typeof forms === "string" ? forms : !pageInfo.uri ? _config.formsurl : null;
            if (_config.allowforms && !!forms && (_config.formsurl || formsUrl)) {
                _controllers.forms.loadFormUrl(_config.serverurl, formsUrl, pageInfo.uri, pageInfo.index, 1, index, function () {
                    formsDeffered.resolve(true);
                });
            } else {
                formsDeffered.resolve();
            }

            $.when(pageDeffered, annotationDeffered, formsDeffered).done(function (page, annotations, forms) {
                if (annotations || forms) {
                    __redrawPageFromIndex(index, true);
                }
                deffered.resolve(index);
            });
            return deffered.promise();
        }

        /**
        * Silently reloads the specified page if it has already been loaded before. Not creates new page.
        * @private
        * @return {object} page reload promise
        */
        function __silentReloadPage(pageDefinition, params) {
            var pageDeffered = $.Deferred();
            if (pageDefinition.cacheIndex >= 0 && _dom.loadedImgs[pageDefinition.cacheIndex]) {
                var img = _dom.loadedImgs[pageDefinition.cacheIndex];
                img.invalidate(params, function () {
                    pageDeffered.resolve();
                });
            } else {
                pageDeffered.resolve();
            }

            return pageDeffered.promise();
        }

        // asynchronously requests the image at the given index
        // i: int, frame index
        // params {object}, optional image request params. 
        // callback: function to execute after the image is done loading
        function __requestPageAsync(i, params, callback) {
            if (typeof params === "function") {
                callback = params;
                params = undefined;
            }

            var pageInfo = _controllers.document.getPageDefinition(i);
            if (!pageInfo) {
                return;
            }

            // when the document has inserted pages, this may not be the best way to get a page
            if (pageInfo.cacheIndex < 0 || !_dom.loadedImgs[pageInfo.cacheIndex]) {
                var cacheIndex = _state.nextImageCacheIndex++;
                pageInfo.cacheIndex = cacheIndex;
                _controllers.document.setPageCacheIndex(i, cacheIndex);
                _dom.loadedImgs[cacheIndex] = __createPageImageAsync(pageInfo.index, pageInfo.ref, params, function (cimg) {
                    if (cimg) {
                        // sometimes when image already been loaded, IE8 could call callback synchronously, i.e. before __createPageImageAsync returns.
                        _dom.loadedImgs[cacheIndex] = cimg;
                        cimg._cacheIndex = cacheIndex;
                        _controllers.memory.allocate(cimg);
                    }

                    if (typeof callback === 'function') {
                        callback.call();
                    }
                });

                if (_config.allowtext && _controllers.text && !_isThumbnailer) {
                    // async(inside called method) request to prevent page images blocking.
                    _controllers.text.ensurePageTextLoaded(i);
                }
            } else {
                if (typeof callback === 'function') {
                    callback.call();
                }
            }

            return _dom.loadedImgs[pageInfo.cacheIndex];
        }

        // determines whether the page is in the viewable area
        // pg: jQuery page div object
        function __isPageInView(index) {
            var pg = __findPageFromIndex(index);
            if (pg) {
                var le = _dom.scroller[0].scrollLeft;
                var te = _dom.scroller[0].scrollTop;

                return __isObjectInRect(pg[0], _dom.scroller[0], le, te, le + _dom.scroller[0].clientWidth, te + _dom.scroller[0].clientHeight);
            } else {
                return false;
            }
        }

        // finds the page if it's in the loaded pageDivs, returns null if it's not found
        // i: int, frame index
        function __findPageFromIndex(i) {
            var retPage = null;

            for (var j = 0; j < _dom.pageDivs.length && retPage === null; j++) {
                if (_dom.pageDivs[j]._index === i) {
                    retPage = _dom.pageDivs[j];
                }
            }

            return retPage;
        }

        function __showPagePoint(pageIndex, point, location, force, callback) {
            if (force && typeof force === "function") {
                callback = force;
                force = false;
            }

            var pg = __findPageFromIndex(pageIndex);
            var offset;
            if (pg) {
                var le = _dom.scroller[0].scrollLeft;
                var te = _dom.scroller[0].scrollTop;
                offset = __getDomOffsets(pg[0], _dom.scroller[0]);
                offset.left += point.x;
                offset.top += point.y;
                if (!force && offset.left >= le && offset.left <= le + le + _dom.scroller[0].clientWidth && offset.top >= te && offset.top <= te + _dom.scroller[0].clientHeight) {
                    // page is already in viewport.
                    if (callback) {
                        callback();
                    }
                    return;
                }
            } else {
                offset = __getPageOffsets(pageIndex);
                offset.left = offset.width + point.x;
                offset.top = offset.height + point.y;
            }

            var locationOffset = {
                x: _dom.scroller[0].clientWidth / 2,
                y: _dom.scroller[0].clientHeight / 2
            };

            // location object is not the same, so compare by value.
            if (__isLocationEquals(location, Atalasoft.Utils.PageSelection.BottomLeft)) {
                locationOffset.x = _dom.scroller[0].clientWidth;
                locationOffset.y = _dom.scroller[0].clientHeight;
            } else if (__isLocationEquals(location, Atalasoft.Utils.PageSelection.TopLeft)) {
                locationOffset.x = 0;
                locationOffset.y = 0;
            }

            __setScrollPositionAsync(offset.left - locationOffset.x, offset.top - locationOffset.y, true, callback);
        }

        function __isLocationEquals(first, second) {
            return first && second && first.x === second.x && first.y === second.y;
        }

        // puts the page number in a new spot based on the width and height of the image
        // i: int, frame index of the page
        // width: int, width of the image on the page
        // height: int, height of the image on the page
        function __repositionPageNumber(i, width, height) {
            var pg = __findPageFromIndex(i);
            if (pg != null && pg._num != null) {
                pg._num.css({
                    left: width - 20,
                    right: 0
                });
            }
        }

        // #endregion

        // #region Resize and Zoom

        // fires when the browser window is resized
        var resizeTimeout = null;

        function __onResize(e) {
            // TODO: need to slow this down with a timeout at maybe 1-2 times/sec
            if (resizeTimeout) {
                clearTimeout(resizeTimeout);
            }
            resizeTimeout = setTimeout(function () {
                __triggerEvent('documentchanged');
            }, 200);
        }

        // force reflow of the content div
        function __reflow() {
            if (_state.prpr === 0) {
                if (Atalasoft.Utils.Browser.Safari || Atalasoft.Utils.Browser.Chrome) {
                    _dom.edges[1].hide().show();
                } else {
                    _dom.edges[1][0].className = _dom.edges[1][0].className;
                }
            }
        }

        function __startDomManipulation() {
            _dom.scroller.stop();
            _dom.scroller.pauseEventPropagation();
            __pausePageRequests();
        }

        function __endDomManipulation() {
            __adjustScrollBars();
            if (_dom.pageDivs.length > 0 && __isPageInView(_controllers.document.getPageCount() - 1)) {
                // workaround to fix bottom document edge behind last page if it comes into view after dom manipulations(zoom, rotate).
                __adjustEdgeHeights(_dom.pageDivs[0]._index);
            }

            __adjustEdgeWidths();
            _dom.scroller.resumeEventPropagation();
            __resumePageRequests();
        }

        // start event to enable pinch zoom
        function __zoomStart() {
            _state.zooming = true;
            __startDomManipulation();
            __triggerEvent('zoomstarted');
        }

        // instant zoom to enable pinch zoom
        // z: new zoom level
        function __zoomInstant(z) {
            z = Math.min(z, __getMaxZoom());
            z = Math.max(z, __getMinZoom());

            __zoomScrollPositionAsync(z, false);
            _config.zoom = z;
            __adjustVisiblePages(false);
            __zoomOffsetEdgeAsync(z, false);
        }

        // end event to enable pinch zoom
        function __zoomEnd() {
            _state.zooming = false;
            __endDomManipulation();
            __triggerEvent({
                type: 'zoomchanged',
                zoom: _config.zoom
            });
        }

        /**
        * Asynchronously zooms the viewer to the given zoom over the default zoom duration
        * @param {number} zoom - Desired zoom level to zoom to.
        * @param {NotificationCallback} [callback] - function to execute after the zoom is finished animating.
        * @instance
        * @memberOf Atalasoft.Controls.WebDocumentViewer
        * @function zoom
        */
        function __setZoomAsync(zoom, callback) {
            if (!_state.zooming) {
                _state.zooming = true;
                __startDomManipulation();
                __triggerEvent('zoomstarted');

                callback = callback == null ? __zoomFinished : Atalasoft.Utils.__functionFromArray([__zoomFinished, callback]);

                if (zoom !== _config.zoom) {
                    zoom = Math.min(zoom, __getMaxZoom());
                    zoom = Math.max(zoom, __getMinZoom());

                    __zoomScrollPositionAsync(zoom, true);
                    _config.zoom = zoom;
                    __adjustVisiblePages(true);

                    // this should be the last animation, so we can use it to callback
                    __zoomOffsetEdgeAsync(zoom, true, callback);
                } else {
                    // no need to zoom, still need to call the callback
                    if (typeof callback === 'function') {
                        callback.call();
                    }
                }
            } else {
                // currently in a zoom animation call the callback
                __failStartAsync('zooming', callback);
            }
        }

        // callback for setZoomAsync, fires after a zoom is done animating
        function __zoomFinished() {
            _state.zooming = false;

            __endDomManipulation();
            __onScroll();

            __triggerEvent({
                type: 'zoomchanged',
                zoom: _config.zoom
            });
        }

        // zooms in or out depending on the given value
        // zoomout: bool, zooms out if true, zooms in otherwise
        // callback: function to execute when the zoom is done
        function __zoomAsync(zoomOut, callback) {
            var z = _config.zoom + (zoomOut ? -1 : 1) * _config.zoom * 0.3;

            __setZoomAsync(z, callback);
        }

        // zooms the current scroll position to the given zoom level
        // ani: bool, indicates whether the zoom should animate
        // callback: function to execute when the zoom is done
        function __zoomScrollPositionAsync(z, ani, callback) {
            var cpo = __getPageOffsets(_page.number, null, null);
            var cpoz = __getPageOffsets(_page.number, null, null, z);

            // relative scaled page coordinates
            var rpx = (_dom.scroller.scrollLeft() - cpo.width) / _config.zoom * z;
            var rpy = (_dom.scroller.scrollTop() - cpo.height) / _config.zoom * z;

            __setScrollPositionAsync(cpoz.width + rpx, cpoz.height + rpy, ani, _zmd, callback);
        }

        // fires after the trailing edge has finished zooming
        function __edgeZoomed() {
            _dom.edges[0]._z = _config.zoom;
        }

        // asynchronously zooms the trailing edge to the given zoom level
        // z: float, desired zoom level to zoom to
        // ani: bool, indicates whether the zoom should animate
        // callback: function to execute when the zoom is done animating
        function __zoomOffsetEdgeAsync(z, ani, callback) {
            if (_dom.edges.length > 0) {
                callback = typeof callback === 'function' ? Atalasoft.Utils.__functionFromArray([__edgeZoomed, callback]) : __edgeZoomed;

                var vert = _config.direction === _direction.Vertical;
                // TODO: need to change this to support horizontal as well
                var pi = _dom.pageDivs[0] && _dom.pageDivs[0]._img ? _dom.pageDivs[0]._index : 0;
                var offset = __getPageOffsets(pi, null, null, z);
                var nv = vert ? offset.height : offset.width;

                if (ani && !_state.loading) {
                    var aniCfg = vert ? { 'height': nv } : { 'width': nv };
                    _dom.edges[0].animate(aniCfg, {
                        duration: _zmd,
                        easing: 'easeOutQuad',
                        complete: callback,
                        queue: false
                    });
                } else {
                    if (vert) {
                        _dom.edges[0].height(nv);
                    } else {
                        _dom.edges[0].width(nv);
                    }

                    if (typeof callback === 'function') {
                        callback.call();
                    }
                }

                __updateEdgeBackgroundPlaceholders();
            }
        }

        function __updateEdgeBackgroundPlaceholders(zoom) {
            setTimeout(function () {
                var canvas = $('<canvas/>');
                // negative left values move object off screen in a way that doesn't make scrollbars appear
                var span = $('<span style="position:absolute; visibility:hidden; left: -5000px;">{[|,0123456789Thqkbfjplyg</span>');
                $(document.body).append(span);

                zoom = zoom || _config.zoom;
                var isVertical = _config.direction === _direction.Vertical;
                var cellSize = _state.newpagedivsize ? _state.newpagedivsize : { width: _page.size.width * zoom, height: _page.size.height * zoom };
                var pageSpacing = Math.max(1, _config.pagespacing);

                var tabularOffset = __getTabularIndexOffset();
                canvas[0].width = (cellSize.width + pageSpacing) * (isVertical ? tabularOffset : 1);
                canvas[0].height = cellSize.height * (isVertical ? 1 : tabularOffset);

                var ctx = canvas[0].getContext('2d');
                ctx.lineWidth = _config.pageborderwidth;
                if (_config.backcolor) {
                    ctx.fillStyle = _config.backcolor;
                }

                // get a pixel offset so border will visible on result rendered image.
                var backgroundMargin = 1;

                for (var i = 0; i < tabularOffset; ++i) {
                    var x = isVertical ? backgroundMargin + i * cellSize.width : backgroundMargin;
                    var y = isVertical ? backgroundMargin : backgroundMargin + i * cellSize.height;
                    ctx.strokeRect(x, y, cellSize.width - backgroundMargin * 2, cellSize.height - backgroundMargin * 2);

                    if (_config.backcolor) {
                        ctx.fillRect(x + ctx.lineWidth, y + ctx.lineWidth, cellSize.width - (backgroundMargin + ctx.lineWidth) * 2, cellSize.height - (backgroundMargin + ctx.lineWidth) * 2);
                    }
                }

                var base64 = canvas[0].toDataURL();
                var style = {
                    backgroundImage: 'url(' + base64 + ')',
                    backgroundSize: 'auto auto',
                    backgroundRepeat: isVertical ? 'repeat-y' : 'repeat-x'
                };

                _dom.edges[0].css(style);
                _dom.edges[1].css(style);
                span.remove();
            }, 0);
        }

        function __clearEdgesBackground() {
            var style = {
                backgroundImage: '',
                backgroundSize: '',
                backgroundRepeat: '',
                backgroundColor: ''
            };
            _dom.edges[0].css(style);
            _dom.edges[1].css(style);
        }

        // adjusts the visible pages to the current zoom level
        // ani: bool, indicates whether the zoom should animate
        // callback: function to execute when the zoom is done animating
        function __adjustVisiblePages(ani, callback) {
            var adjusts = 0;
            var needtocallback = true; // adjusts var can be added and subtracted asynch

            // nested callback function so we don't have to store given callback
            var adjustsCompleted = function adjustsCompleted() {
                adjusts--;

                if (adjusts <= 0) {
                    if (_config.direction === _direction.Horizontal) {
                        var maxWidth = __getMaxDocumentSize().width;
                        if (!_dom.spacer) {
                            _dom.spacer = __createDiv(); //$('<span/>');
                            _dom.spacer.css({
                                position: 'absolute',
                                top: '-1px',
                                height: '1px'
                            });
                            _dom.viewport.append(_dom.spacer);
                        }

                        _dom.spacer.width(maxWidth);
                    }

                    // only execute the callback if it exists
                    if (typeof callback === 'function') {
                        callback.call();
                    }

                    __reflow();
                }
            };

            for (var i = 0; i < _dom.pageDivs.length; i++) {
                if (_dom.pageDivs[i]._img) {
                    var needsReaload = _dom.pageDivs[i]._img.needsZoom() || _dom.pageDivs[i]._img.needsRotate();
                    if (needsReaload) {
                        needtocallback = false;
                        adjusts++;
                        if (_dom.pageDivs[i]._img.needsRotate()) {
                            _dom.pageDivs[i]._img.rotate(adjustsCompleted);
                        } else if (_dom.pageDivs[i]._img.needsZoom()) {
                            _dom.pageDivs[i]._img.zoom(ani, adjustsCompleted);
                        }
                    }
                }
            }

            // call callback even if no adjustment was necessary
            if (needtocallback) {
                adjustsCompleted.call();
            }
        }

        /**
        * Asynchronously zooms the viewer to fit to a page.
        * @param {Atalasoft.Utils.Fitting} fit - Type of fitting to fit the page to.
        * @param {number} pageNumber - Page number to fit to.  Note, that it's 1-based.
        * @param {NotificationCallback} callback - Function to execute after the fit is done animating.
        * @instance
        * @memberOf Atalasoft.Controls.WebDocumentViewer
        * @function fit
        */
        function __fitAsync(fit, pageNumber, callback) {
            if (pageNumber != null) {
                if (typeof pageNumber === 'function') {
                    callback = pageNumber;
                    pageNumber = _page.number;
                }
            } else {
                pageNumber = _page.number;
            }

            var docFit = __calculateDocumentFitting(fit, pageNumber - 1);
            var nZ = docFit.zoom;
            var nox = _fitting.Width === docFit.fit;
            var noy = _fitting.Height === docFit.height;

            // we fit to the width, so there shouldn't be any x scroll
            if (nox) {
                __setScrollPositionAsync(0, null, false);
            }

            // we fit to the height, so there shouldn't be any y scroll
            if (noy) {
                __setScrollPositionAsync(null, 0, false);
            }

            __setZoomAsync(nZ, callback);
        }

        // calculates document fit zoom for particular page: returns zoom value and fit describing which side this zoom will fit to(actual for best fit  option).
        function __calculateDocumentFitting(fit, index) {
            var vieportStripeSize = __getViewportGridStripeSize();
            var size = __getClientPageSize(index, 1, false);

            if (size.width === 0 || size.height === 0) {
                fit = null;
            }

            var zoom = _config.zoom;
            switch (fit) {
                case _fitting.None:
                    break;

                case _fitting.Best:
                    if (size.width / vieportStripeSize.width > size.height / vieportStripeSize.height) {
                        //size to the width
                        zoom = vieportStripeSize.width / size.width;
                        fit = _fitting.Width;
                    } else {
                        //size to the height
                        zoom = vieportStripeSize.height / size.height;
                        fit = _fitting.Height;
                    }
                    break;

                case _fitting.Height:
                    zoom = vieportStripeSize.height / size.height;
                    break;

                case _fitting.Width:
                    zoom = vieportStripeSize.width / size.width;
                    break;

                default:
                    zoom = 1;
                    fit = _fitting.None;
                    break;
            }

            return {
                zoom: zoom,
                fit: fit
            };
        }

        // gets the individual scale for a page, whether it's been fit or not
        function __getPageFitMultiplier(index) {
            return _controllers.document.getPageFitMultiplier(index);
        }

        // gets the individual scale for a page, whether it's been fit or not
        function __getPageScale(index) {
            return _config.zoom * _controllers.document.getPageFitMultiplier(index);
        }

        function __getPageRotation(index) {
            return _controllers.document.getPageRotation(index);
        }

        function __getViewerTransform(pageindex, extraRotation) {
            extraRotation = extraRotation || 0;

            var viewAngle = __getPageRotation(pageindex),
                scale = __getPageScale(pageindex),
                size = __getServerPageSize(pageindex, extraRotation);

            var m = Raphael.matrix();
            m.scale(scale, scale, 0, 0);
            m.rotate(viewAngle + extraRotation, 0, 0);

            var br = __transformPoint(m, { x: size.width, y: size.height });
            var dx = Math.min(0, br.x);
            var dy = Math.min(0, br.y);

            // absolute translation of the upper left corner of the rotated rectangle to (0; 0)
            var inver = m.invert();
            var dxSrc = inver.x(-dx, -dy);
            var dySrc = inver.y(-dx, -dy);
            m.translate(dxSrc, dySrc);
            return m;
        }

        function __transformPoint(matrix, p) {
            return {
                x: matrix.x(p.x, p.y),
                y: matrix.y(p.x, p.y)
            };
        }
        // #endregion

        // #region Annotations

        // draws an annotation with the mouse
        function __drawAnnotation(e) {
            var btnConfig = $.data(e.currentTarget, '_config');
            var defaultAnno = $.data(e.currentTarget, '_annoConfig');

            // checks to see if the default annotation properties already exist
            if (!defaultAnno && btnConfig) {
                // no default, draw blank
                defaultAnno = { type: btnConfig.icon, rotatable: _config.showrotatetools };
            }

            if (defaultAnno) {
                _controllers.mouseTool.setTool(_toolTypes.None, _toolTypes.None);
                _controllers.annotations.drawAnnotation(defaultAnno, false, __onAnnotationDrawn, __onAnnotationCancelled);
            }
        }

        // jshint ignore:start
        // adds an annotation without drawing it first
        function __addAnnotation(e) {}
        // jshint ignore:end

        // event fired when an annotation draw was cancelled
        function __onAnnotationCancelled(e) {
            _controllers.mouseTool.setTool(_toolTypes.Pan, _toolTypes.None);
        }

        // event fired when an annotation has been drawn on the drawing surface
        function __onAnnotationDrawn(e) {
            _controllers.mouseTool.setTool(_toolTypes.Pan, _toolTypes.None);
        }

        /**
        * Checks whether annotations support is enabled.
        * @private
        */
        function __annotationsAllowed() {
            // this function to checks if annotations are allowed to be drawn
            if (_config.allowannotations === false) {
                __throwError('InitError', 'The "allowannotations" property in the WebDocumentViewer config is set to false.');
            }

            return _config.allowannotations;
        }

        // elevates the z-index of the drawing surface, so that it can capture mouse events
        function __raiseDrawLayer() {
            for (var i = 0; i < _dom.pageDivs.length; i++) {
                _dom.pageDivs[i]._draw.toFront();
            }
        }

        // resets the z-index of the drawing surface, so that it can capture mouse events
        function __resetDrawLayer() {
            for (var i = 0; i < _dom.pageDivs.length; i++) {
                _dom.pageDivs[i]._draw.reset();
            }
        }

        // #endregion

        // #region Document state swithcing

        function __switchDocument(info, linker, config) {
            if (info) {
                _state.loading = true;
                _page.size.width = info.pagewidth;
                _page.size.height = info.pageheight;
                _page.count = info.pagecount;
                _page.buffer = _config.pagebuffersize;
                _page.dpi = info.dpi;
                _page.vector = info.vector === true;

                _config.allowannotations = config.allowannotations;
                _config.allowforms = config.allowforms;
                _config.allowtext = config.allowtext;

                _config.documenturl = config.documenturl;
                _config.annotationsurl = config.annotationsurl;
                _config.formsurl = config.formsurl;

                _controllers.document.__linkChanges(linker);
                if (_controllers.annotations) {
                    _controllers.annotations.clear();
                    _controllers.annotations.loadAnnotations(info);
                }

                if (_controllers.forms) {
                    _controllers.forms.clear();
                    if (info.forms) {
                        _controllers.forms.loadForms(info);
                    }
                }

                if (_controllers.text) {
                    // reset search if any.
                    _controllers.text.search('');
                }

                _controllers.mouseTool.setTool(_config.mousetool.type && !_isThumbnailer ? _config.mousetool.type : _toolTypes.Pan, _toolTypes.None);

                _state.zooming = false;
                if (info.zoom) {
                    _config.zoom = info.zoom;
                } else {
                    var docFit = __calculateDocumentFitting(_config.fitting, 1);
                    _config.zoom = docFit.zoom;
                }

                __invalidateDocument(info.pagenumber || 0);
                __updateEdgeBackgroundPlaceholders();
                _state.loading = false;
                __adjustVisiblePages();

                __getSelectedPagesIndices = linker.__getSelectedPagesIndices;

                __triggerEvent({
                    type: 'activedocumentchanged'
                });
            }
        }

        function __closeDocument(thumbLink, closeView) {
            if (closeView) {
                __clearUI(true);
            }

            for (var i = 0; i < thumbLink._controllers.document.getPageCount(); ++i) {
                var pageDef = thumbLink._controllers.document.getPageDefinition(i, _id);

                if (pageDef && pageDef.cacheIndex >= 0) {
                    if (_dom.loadedImgs[pageDef.cacheIndex]) {
                        _controllers.memory.deallocate(_dom.loadedImgs[pageDef.cacheIndex]);
                        _dom.loadedImgs[pageDef.cacheIndex].dispose();
                        _dom.loadedImgs[pageDef.cacheIndex].remove();
                        _dom.loadedImgs[pageDef.cacheIndex] = undefined;
                    }
                }
            }
        }

        // #endregion Document state switching

        // #region Ajax Functions and Callbacks

        // contacts the server for image info, JSON is returned to __onDocumentInfoLoaded
        // kvp: object, key value pairs to pass to the request
        // callback: function to execute after the request is done
        function __loadDocumentInfoAsync(kvp, callback) {
            _state.loading = true;

            var params = {
                atala_docurl: _config.documenturl,
                atala_pagebuffer: _config.pagebuffersize,
                atala_minwidth: _config.minwidth
            };

            if (_isThumbnailer) {
                params.atala_thumb = _isThumbnailer;
                params.atala_capt_format = _config.thumbcaptionformat;
            }

            if (kvp != null) {
                if (typeof kvp === 'function') {
                    callback = kvp;
                    kvp = null;
                }

                $.extend(params, kvp);
            }

            var hRequest = {
                type: 'docinfo',
                serverurl: _config.serverurl,
                query: '?ataladocinfo=',
                method: 'GET',
                data: params,
                cancel: false,
                info: {
                    pagewidth: -1,
                    pageheight: -1,
                    pagecount: -1
                }
            };

            // these are defined inline so we have a closure reference to callback
            function __success(info) {
                __onDocumentInfoLoaded(info, callback);
            }

            function __error(xhr, txtStatus, err) {
                __onDocumentLoadError(xhr, txtStatus, err, callback);
            }

            __makeHandlerRequest(hRequest, __success, __error);
        }

        // event fired when the document info is recieved from the server
        // info: object, key value pairs
        // callback: function to execute when finished
        function __onDocumentInfoLoaded(info, callback) {
            if (info && info.licensed !== false) {
                _page.size.width = info.pagewidth;
                _page.size.height = info.pageheight;
                _page.count = info.pagecount;
                _page.buffer = _config.pagebuffersize;
                _page.dpi = info.dpi;
                _page.vector = info.vector === true;
                _page.caption = info.thumbcaptionformat || (_config.showthumbcaption ? '{0}' : '');
                _maxDocSize.zero();

                _controllers.memory.clearEntries();
                _controllers.memory.colorDepth = info.colordepth;
                _controllers.memory.pageSize = { width: info.pagewidth, height: info.pageheight };

                __triggerEvent({ type: 'documentinfochanged', info: {
                        count: _page.count,
                        dpi: _page.dpi,
                        size: {
                            height: _page.size.height,
                            width: _page.size.width
                        },
                        vector: _page.vector
                    } });

                // load before page divs creations since it could trigger per-page load.
                if (_controllers.text) {
                    _controllers.text.clear();
                    if (info.text) {
                        _controllers.text.loadText(info);
                    }
                }

                // _state.loading == true represents the first pass, if it's false
                // there are more page sizes loading from the server.
                if (_state.loading) {
                    // reset previous zoom state to start from scratch.
                    _config.zoom = 1;
                    __createPageDivs();
                    __setScrollPositionAsync(0, 0);

                    if (_dom.scrollV) {
                        _dom.scrollV.pageNum(1);
                    }

                    __setPageNumber(1);

                    __fitAsync(_config.fitting, 1, function () {
                        __adjustEdgeWidths();
                        __adjustEdgeHeights(0, _dom.pageDivs.length - 1);

                        // add the pages after we fit so they don't load twice
                        for (var i = 0; i < _dom.pageDivs.length && i < _page.count; i++) {
                            _dom.content.append(_dom.pageDivs[i]);
                            __insertPageContents(_dom.pageDivs[i], null, i);
                        }

                        if (_dom.pageDivs.length > 0) {
                            _dom.pageDivs[0].addClass(_domClasses.atala_active_page);
                        }

                        // were annotations included in this request?
                        if (info.layers && info.layers.length) {
                            _controllers.annotations.loadAnnotations(info);
                        } else if (_config.annotationsurl && _controllers.annotations) {
                            // we wanted to load annotations but something bad happened. 
                            // so clear old annotations to not confuse client.
                            _controllers.annotations.clear();
                        }

                        // forms included?
                        if (_controllers.forms) {
                            _controllers.forms.clear();
                            if (info.forms) {
                                _controllers.forms.loadForms(info);
                            }
                        }

                        _controllers.mouseTool.setTool(_config.mousetool.type && !_isThumbnailer ? _config.mousetool.type : _toolTypes.Pan, _toolTypes.None);

                        // drop loading flag since if exception happens here, it will stuck. fitting could be synchronous.
                        _state.loading = false;

                        // recalculate edges background(in case if no zoom were applied after load).
                        __updateEdgeBackgroundPlaceholders();
                        // only execute the callback if it exists
                        if (typeof callback === 'function') {
                            callback(info.error);
                        }

                        if (info.error) {
                            setTimeout(function () {
                                // if showerrors is set to true, this will break execution in the middle of initialization, especially if we are in viewer-thumbnailer chain.
                                // throw asynchronously to prevent that - we are already asynchronous anyway.
                                __throwError('DocumentLoadError', info.error);
                            }, 0);
                        }
                    });
                }

                _state.loading = false;
            } else {
                var errorType, msg;
                if (info && info.licensed === false) {
                    errorType = 'LicenseException';
                    msg = info.error ? info.error : 'LicenseException: Handler was unable to find a valid license.';
                } else {
                    errorType = 'DocumentLoadError';
                    msg = 'HandlerException: Handler did not return any data.';
                }

                _state.loading = false;

                // only execute the callback if it exists
                if (typeof callback === 'function') {
                    callback.call(undefined, msg);
                }

                if (errorType && msg) {
                    __throwError(errorType, msg);
                }
            }
        }

        // event fired when there was an error retriving the document info
        // xhr: XMLHttpRequest object
        // txtStatus: string, status message
        // err: string, error message
        // callback: function to call after the error is handled
        function __onDocumentLoadError(xhr, txtStatus, err, callback) {
            if (xhr.responseText) {
                var txt = xhr.responseText.substr(xhr.responseText.indexOf('</html>') + 7);
                // tries to find the normal .NET error text located after the html tag
                if (txt.indexOf('<!--') >= 0) {
                    txt = txt.replace('<!--', '').replace('-->', '');

                    if (txt.length > 0) {
                        err = '<pre>' + txt + '</pre>';
                    }
                } else {
                    if (xhr.responseText.indexOf('web.config') > 0 && xhr.responseText.indexOf('customErrors') > 0) {
                        err += ': web.config customErrors attribute has disabled remote error messages.';
                    }
                }
            }

            __throwError('DocumentLoadError', err);

            // only execute the callback if it exists
            if (typeof callback === 'function') {
                callback.call(undefined, err);
            }
        }

        function __onDocumentChanged(e) {
            __invalidateDocument();
        }

        function __invalidateDocument(pageIndex) {
            __createPageDivs();
            if (_dom.pageDivs.length > 0) {
                var pgcount = _controllers.document.getPageCount();

                // if page was deleted or inserted we shift the indexes
                var startPage = typeof pageIndex === 'number' ? pageIndex : _dom.pageDivs[0]._index;
                startPage = startPage >= 0 ? Math.min(startPage, pgcount - _dom.pageDivs.length) : 0;

                // need to be careful with this method: if it's called during images loading, then loaded event won't be called in IE.
                for (var i = 0; i < _dom.pageDivs.length && i < pgcount; i++) {
                    var idx = startPage + i;
                    __removePageContents(_dom.pageDivs[i]);
                    _dom.content.append(_dom.pageDivs[i]);
                    __insertPageContents(_dom.pageDivs[i], null, idx);
                }
            }
            // need to recalculate pagedivs and edges
            __adjustEdgeHeights(_dom.pageDivs.length > 0 ? _dom.pageDivs[0]._index : 0, null);
            __adjustEdgeWidths();

            __redrawVisiblePages();
            __adjustScrollBars();

            var x = _dom.scroller[0].scrollLeft;
            var y = _dom.scroller[0].scrollTop;
            var visiblePage = __getUIIndexFromPos(x, y);
            __setPageNumber(visiblePage + 1);
            if (pageIndex >= 0 && visiblePage !== pageIndex) {
                // we've created page divs, but if the page is within 'buffer size' range from the end of the doc,
                // it's won't be in the first div and we have to shift it.
                __showPageAtIndex(pageIndex);
            }
        }

        // contacts the server to save changes, JSON is returned to __onDocumentSaved
        // kvp: object, key value pairs to pass to the request
        // callback: function to execute when finished
        function __saveDocumentAsync(kvp, callback) {
            var params = {
                'atala_docurl': _config.documenturl,
                'atala_spath': _config.savepath
            };

            $.extend(params, kvp);

            var hRequest = {
                type: 'docsave',
                serverurl: _config.serverurl,
                query: '?ataladocsave=',
                method: 'POST',
                data: params,
                cancel: false,
                info: { // response from server
                    success: undefined,
                    error: undefined
                }
            };

            // defined inline so we have a closure reference to callback
            function __complete(info) {
                __onDocumentSaved(info);

                // only execute the callback if it exists
                if (typeof callback === 'function') {
                    callback.call();
                }
            }

            function __error(jqXHR) {
                var info = [];
                info.error = jqXHR.responseText;
                __complete(info);
            }

            __makeHandlerRequest(hRequest, __complete, __error);
        }

        // event fired after the document has been saved (regardless of errors)
        // info: object, json returned from server 
        function __onDocumentSaved(info) {
            if (info.error) {
                __throwError('DocumentSaveError', info.error);
            } else {
                __status('DocumentSave: success=' + info.success);
            }

            __triggerEvent({
                type: 'documentsaved',
                success: info.success
            });
        }

        function __processRequestUrl(rurl, docurl, controller) {
            var request = null;

            if (typeof rurl === 'string') {
                // input is good
                request = {};

                if (_state.initialized && controller) {
                    if (rurl.length > 0) {
                        // make request object
                        request = controller.createHandlerRequest(_config.serverurl, rurl, docurl);
                    } else if (rurl.length === 0) {
                        // clear
                        controller.clear();
                    }
                }

                request.url = rurl;
            } else {
                // input is not a string, since we do nothing when this is null/undefined, only error on bad type
                if (typeof rurl !== 'undefined' && rurl != null) {
                    __throwError('openUrlError', 'string input expected for url.');
                }
            }

            return request;
        }

        function __beforeAnnotationsDataRequest() {
            __bindEvents({
                annotationsloaded: __onAnnotationsLoaded
            });
        }

        function __makeAnnotationsHandlerRequest(annRequest, callback) {
            if (_controllers.annotations) {
                __beforeAnnotationsDataRequest();
                _controllers.annotations.makeHandlerRequest(annRequest, callback);
            }
        }

        function __beforeFormsDataRequest() {
            __bindEvents({
                formsloaded: __onFormsLoaded
            });
        }

        function __makeFormsHandlerRequest(formsRequest, callback) {
            if (_controllers.forms) {
                __beforeFormsDataRequest();
                _controllers.forms.makeHandlerRequest(formsRequest, callback);
            }
        }

        // redraws the visible pages
        function __redrawVisiblePages(force) {
            if (_dom.pageDivs.length > 0 && typeof _dom.pageDivs[0]._index === 'undefined') {
                return;
            } else {
                for (var i = 0; i < _dom.pageDivs.length; i++) {
                    __redrawPage(_dom.pageDivs[i], force);
                }
            }
        }

        function __redrawPageFromIndex(i, force) {
            var page = __findPageFromIndex(i);

            if (page) {
                __redrawPage(page, force);
            }
        }

        function __redrawPage(pg, force) {
            // if insertPageContents returns true, it needs other elements to redraw
            if (__insertPageContents(pg, __requestPageAsync(pg._index), pg._index) || force) {
                if (_controllers.annotations) {
                    _controllers.annotations.showLayer(pg._index, pg);
                }

                if (_controllers.forms && !_isThumbnailer) {
                    _controllers.forms.showLayer(pg._index, pg);
                }

                if (_controllers.text && !_isThumbnailer && _config.allowtext) {
                    _controllers.text.showLayer(pg._index, pg);
                }
            }
        }

        // event fired when the annotation data is finished loading
        function __onAnnotationsLoaded(e) {
            if (e.error) {
                __throwError('AnnotationsLoadError', e.error);
                _config.annotationsurl = '';
            }

            if (_controllers.annotations) {
                __unbindEvents({
                    annotationsloaded: __onAnnotationsLoaded
                });
            }
        }

        // event fired when the forms data is finished loading
        function __onFormsLoaded(e) {
            if (e.error) {
                __throwError('FormsLoadError', e.error);
                _config.formsurl = '';
            }

            if (_controllers.forms) {
                __unbindEvents({
                    formsloaded: __onFormsLoaded
                });
            }
        }

        // fires an event before a request is sent to the handler
        // hRequest: object, handler request object
        function __beforeHandlerRequest(hRequest) {
            __triggerEvent({
                type: 'beforehandlerrequest',
                request: hRequest
            });
        }

        // makes a request to the handler
        // hRequest: object, handler request object
        // success: function to execute when the request succeeded
        // error: function to execute when an error occurs
        function __makeHandlerRequest(hRequest, success, error) {
            var handlerHook = __bindHandlerReturned(hRequest, function (e) {
                success(e.request.info);
            });

            __beforeHandlerRequest(hRequest);

            if (!hRequest.cancel) {
                // request wasn't cancelled, need to unbind handlerHook
                __unbindEvents({
                    handlerreturned: handlerHook
                });

                if (hRequest.serverurl && !$.isEmptyObject(hRequest.data)) {
                    if (hRequest.info instanceof jQuery && hRequest.type === 'docpage') {
                        // image request
                        hRequest.info.attr('src', hRequest.serverurl + hRequest.query + '&' + $.param(hRequest.data));
                    } else {
                        $.ajax({
                            type: hRequest.method,
                            url: hRequest.serverurl + hRequest.query + '?',
                            dataType: 'json',
                            data: hRequest.data,
                            success: success,
                            error: error,
                            crossDomain: typeof hRequest.method === "string" && hRequest.method.toLowerCase() === 'post' ? false : undefined
                        });
                    }
                }
            }
        }

        // binds a return function to execute when a handler request is finished
        // hRequest: object, handler request object
        // fnc: function to execute when the handler has responded
        function __bindHandlerReturned(hRequest, fnc) {
            var anon = function anon(e) {
                // need to make sure that we only respond to the request we were given
                if (e.request === hRequest) {
                    __unbindEvents({
                        handlerreturned: anon
                    });

                    if (typeof fnc === 'function') {
                        fnc.call(this, e);
                    }
                }
            };

            __bindEvents({
                handlerreturned: anon
            });

            return anon;
        }

        // #endregion

        // #region Undocumented Public functions

        /**
        * [Internal] Gets debug info object
        * @returns debug info object if available, otherwise null
        */
        _self.__getDebugInfo = __getDebugInfo;
        function __getDebugInfo() {
            var info = {
                version: Atalasoft.Controls.Version.join('.')
            };

            if (_config.debug) {
                $.extend(true, info, {
                    dom: _dom,
                    controllers: _controllers,
                    page: _page
                });
            }

            return info;
        }

        /**
        * [Internal] Gets the viewer linkage for controls that inherit this one
        * @param viewer object of type WebDocumentViewer
        * @param linker internal object of type __LVlinker
        * @returns linker object if possible, otherwise undefined
        */
        _self.__getViewerLink = __getViewerLink;
        function __getViewerLink(viewer, linker) {
            function __LVlinker() {
                this.typeOf = '__LVlinker';
                this._id = _id;

                // objects that cannot be cloned (need reference)
                this._config = _config;
                this._controllers = _controllers;
                this._dom = _dom;
                this._page = _page;
                this._state = _state;

                this._annos = null;
                this._fields = null;
                this.stateManager = _stateManager;

                this.__createDialog = __createDialog;
                this.__createDiv = __createDiv;
                this.__createDOM = __createDOM;
                this.__createDropDownButton = __createDropDownButton;
                this.__createDropDownMenu = __createDropDownMenu;
                this.__createMenu = __createMenu;
                this.__getPageSize = __getPageSize;

                this.__getTabularIndexOffset = __getTabularIndexOffset;
                this.__redrawVisiblePages = __redrawVisiblePages;
                this.__adjustVisiblePages = __adjustVisiblePages;
                this.__onDocumentChanged = __onDocumentChanged;
                this.__startDomManipulation = __startDomManipulation;
                this.__endDomManipulation = __endDomManipulation;
                this.__status = __status;
                this.__updatePageSize = __onSharedPageSizeChanged;
                this.__silentReloadPage = __silentReloadPage;
                this.__isObjectInRect = __isObjectInRect;
                this.__getIndexFromPos = __getIndexFromPos;
                this.__showNext = __showNext;
                this.__showPrevious = __showPrevious;
                this.__showPageAsync = __showPageAsync;
                this.__adjustEdgeHeights = __adjustEdgeHeights;
                this.__getSelectedPagesIndices = __getSelectedPagesIndices;
            }

            if (viewer) {
                if (viewer.typeOf === 'Atalasoft.Controls.WebDocumentThumbnailer') {
                    //!!link everything to itself. data exchange will happen lated on document switching.
                    var lnk = new __LVlinker();

                    // not sure if this change should be applied to the annotations and the forms yet
                    // but the linker wasn't really doing anything besides providing references to data
                    _controllers.document.__linkChanges(lnk);

                    if (_config.allowannotations) {
                        // annotations are about to be linked to the thumbs, so we need to make sure they don't load
                        if (viewer !== _self && _config.annotationsurl.length > 0) {
                            _config.annotationsurl = '';
                        }

                        _controllers.annotations.__linkAnnotations(lnk);
                    }

                    if (_config.allowforms) {
                        // forms are about to be linked to the thumbs, so we need to make sure they don't load
                        if (viewer !== _self && _config.formurl.length > 0) {
                            _config.formurl = '';
                        }

                        _controllers.forms.__linkForms(lnk);
                    }

                    if (_config.allowtext) {
                        if (_controllers.text) {
                            _controllers.text.__linkText(lnk);
                        }
                    }

                    return lnk;
                }
            }
        }

        // #endregion

        // #region Public functions
        _self.dispose = __dispose;
        _self.empty = __emptyAsync;
        _self.fit = __fitAsync;
        _self.getZoom = __getZoom;
        _self.isReady = __isReady;
        _self.scrollTo = __scrollToAsync;
        _self.scrollBy = __scrollByAsync;
        _self.next = __scrollNextAsync;
        _self.previous = __scrollPreviousAsync;
        _self.zoom = __setZoomAsync;
        _self.zoomIn = __zoomInAsync;
        _self.zoomOut = __zoomOutAsync;
        _self.openUrl = _self.OpenUrl = __openUrlAsync;
        _self.save = __saveChanges;
        _self.getCurrentPageIndex = __getCurrIndex;
        _self.bind = __bindEvents;
        _self.unbind = __unbindEvents;
        _self.trigger = __triggerEvent;
        _self.getDocumentInfo = __getDocumentInfo;
        _self.setMouseTool = __setMouseTool;

        _self.isPageLoaded = __isPageLoaded;
        _self.reloadPage = __reloadPage;

        // defined in scrolling region
        _self.showPage = __showPageAtIndex;
        _self.showPageNumber = __showPage;

        // need to pre-define exposed controller functions for intellisense
        Atalasoft.Annotations.AnnotationController();
        Atalasoft.Document.ManipulationController();
        Atalasoft.Forms.FormController();
        Atalasoft.Text.TextController();

        _self.annotations = Atalasoft.Annotations.AnnotationController.__exposedApi;
        _self.document = Atalasoft.Document.ManipulationController.__exposedApi;
        _self.forms = Atalasoft.Forms.FormController.__exposedApi;
        _self.text = Atalasoft.Text.TextController.__exposedApi;

        /**
         * Resets the viewer to its default state.
         * @param {OpenUrlCallback} [callback]  - Function to execute when the empty process is finished
         * @instance
         * @memberOf Atalasoft.Controls.WebDocumentViewer
         * @function empty
        */
        function __emptyAsync(callback) {
            _state.loading = true;

            var unloadCompleted = function unloadCompleted() {
                __adjustScrollBars();
                __triggerEvent({
                    type: 'documentunloaded'
                });

                // only execute the callback if it exists
                if (typeof callback === 'function') {
                    callback.call();
                }
            };

            __clearUI();

            __onDocumentInfoLoaded({
                pagewidth: 0,
                pageheight: 0,
                pagecount: -1
            }, unloadCompleted);
        }

        function __clearUI(preserveCache) {
            if (_state.initialized) {
                __emptyPages();
                __createPageDivs(0);

                if (!preserveCache) __emptyImages();

                _dom.edges[0].width(0).height(0);
                _dom.edges[1].width(0).height(0);

                if (_dom.scrollH) {
                    _dom.scrollH.scrollSize(0);
                    __adjustScrollbarVisibility(_dom.scrollH);
                }

                if (_dom.scrollV) {
                    _dom.scrollV.scrollSize(0);
                    __adjustScrollbarVisibility(_dom.scrollV);
                }

                __clearEdgesBackground();
            }
        }

        /**
        * Gets the current zoom level of the viewer.
        * @returns {number}
        * @instance
        * @memberOf Atalasoft.Controls.WebDocumentViewer
        * @function getZoom
        */
        function __getZoom() {
            return _config.zoom;
        }

        /**
        * Indicates whether the viewer is ready to receive commands.
         *
         * If all dependent JavaScript libraries are included to the web page, control is initialized synchronously.
         * Otherwise dependencies are asynchronously loaded automatically using {@link WebDocumentViewerConfig.scripturl|scripturl} parameter or from the same url where JQuery library is referenced.
         * When all dependent JavaScript libraries are loaded, {@link Atalasoft.Controls.WebDocumentViewer#event:initialized|initialized} event is fired.
         * @instance
         * @memberOf Atalasoft.Controls.WebDocumentViewer
         * @function isReady
         * @returns {boolean}
        */
        function __isReady() {
            return _state.initialized;
        }

        /**
        * Scrolls to the given coordinates, does not account for zoom, i.e. `x` and `y` values are passed in window coordinate space.
        * @param {number} x - Indicating the coordinate of the x axis.
        * @param {number} y - Indicating the coordinate of the y axis.
        * @param {boolean} [ani=false] - Indicating whether to animate this scroll.
        * @param {NotificationCallback} [callback] - function to execute when the scroll operation is finished.
        * @instance
        * @memberOf Atalasoft.Controls.WebDocumentViewer
        * @function scrollTo
         */
        function __scrollToAsync(x, y, ani, callback) {
            if (callback == null && typeof ani === 'function') {
                callback = ani;
                ani = false;
            }

            __setScrollPositionAsync(x, y, ani, null, callback);
        }

        /**
        * Scrolls by the given deltas, does not account for zoom, i.e. `dx` and `dy` values are passed in window coordinate space.
        * @param {number} dx - Indicating delta of the x axis.
        * @param {number} dy - Indicating delta of the y axis .
        * @param {boolean} [ani=false] - Indicating whether to animate this scroll.
        * @param {NotificationCallback} [callback] - Function to execute when the scroll operation is finished.
        * @instance
        * @memberOf Atalasoft.Controls.WebDocumentViewer
        * @function scrollBy
        */
        function __scrollByAsync(dx, dy, ani, callback) {
            if (callback == null && typeof ani === 'function') {
                callback = ani;
                ani = false;
            }

            __setScrollPositionByAsync(dx, dy, ani, null, callback);
        }

        /**
        * Scrolls to the next viewable page.
        * @param {number} n - Number of pages to scroll forward.
        * @param {NotificationCallback} [callback] - Function to execute when the scroll operation is finished.
        * @instance
        * @memberOf Atalasoft.Controls.WebDocumentViewer
        * @function next
        */
        function __scrollNextAsync(n, callback) {
            var inc = _config.direction === _direction.Vertical ? __getTabularIndexOffset() : 1;

            if (callback == null && typeof n === 'function') {
                callback = n;
                n = inc;
            }

            if (!isFinite(n)) {
                n = inc;
            }

            __scrollNextPrevAsync(n, callback);
        }

        /**
        * Scrolls to the previous viewable page.
        * @param {number} n - Number of pages to scroll backward.
        * @param {NotificationCallback} [callback] - Function to execute when the scroll operation is finished.
        * @instance
        * @memberOf Atalasoft.Controls.WebDocumentViewer
        * @function previous
        */
        function __scrollPreviousAsync(n, callback) {
            var inc = _config.direction === _direction.Vertical ? __getTabularIndexOffset() : 1;

            if (callback == null && typeof n === 'function') {
                callback = n;
                n = inc;
            }

            if (!isFinite(n)) {
                n = inc;
            }

            __scrollNextPrevAsync(-n, callback);
        }

        /**
         * Zooms in one level.
         * @param {NotificationCallback} [callback] - Function to execute when the zoom operation is finished
         * @instance
         * @memberOf Atalasoft.Controls.WebDocumentViewer
         * @function zoomIn
         */
        function __zoomInAsync(callback) {
            __zoomAsync(false, callback);
        }

        /**
        * Zooms out one level.
        * @param  {NotificationCallback} [callback] - Function to execute when the zoom operation is finished.
        * @instance
        * @memberOf Atalasoft.Controls.WebDocumentViewer
        * @function zoomOut
        */
        function __zoomOutAsync(callback) {
            __zoomAsync(true, callback);
        }

        /**
         * Callback signature for {@link Atalasoft.Controls.WebDocumentViewer#openUrl | openUrl} method.
         * @callback OpenUrlCallback
         * @param {string} error - If present, provides error description. If `undefined`, operation were successful.
         */

        /**
        * Opens the document at the given urls.
        * It's possible to call this method multiple times for the same document to load document and the forms or annotations data separately.
        *
        * @param {string} [documenturl] - url of the document file with respect to the {@link WebDocumentViewerConfig.serverurl | config.serverurl}.
        *
        * If set to empty string, call is equivalent to {@link Atalasoft.Controls.WebDocumentViewer#empty|empty}.
        *
        * @param {string} [annotationsurl] - url of the annotation xmp file with respect to the {@link WebDocumentViewerConfig.serverurl| config.serverurl}.
        *
        * *Note*, If empty string is passed, annotations from the previous document are cleared. if not passed or `undefined`, annotations from the previously opened document are preserved.
        * @param {string} [formurl] - url of the form file with respect to the @link WebDocumentViewerConfig.serverurl| config.serverurl}.
        * @param {OpenUrlCallback} [callback] - Function to execute when the open operation is finished.
        * @instance
        * @memberOf Atalasoft.Controls.WebDocumentViewer
        * @function openUrl
        */
        function __openUrlAsync(documenturl, annotationsurl, formurl, callback) {
            if (callback == null) {
                if (typeof annotationsurl === 'function') {
                    callback = annotationsurl;
                    annotationsurl = null;
                } else if (typeof formurl === 'function') {
                    callback = formurl;
                    formurl = null;
                }
            }

            var requests = 0;
            var infoRequested = false;
            var params = {};
            var annRequest = __processRequestUrl(annotationsurl, documenturl, _controllers.annotations);
            var formRequest = __processRequestUrl(formurl || documenturl, documenturl, _controllers.forms);

            _config.annotationsurl = annRequest ? annRequest.url : _config.annotationsurl;
            _config.formsurl = formRequest ? formRequest.url : _config.formsurl;

            // nested callback function so we don't have to store given callback
            var requestCompleted = function requestCompleted(error) {
                requests--;

                if (requests <= 0) {
                    __redrawVisiblePages(true);

                    __triggerEvent({
                        type: 'documentloaded'
                    });

                    // only execute the callback if it exists
                    if (typeof callback === 'function') {
                        callback.call(undefined, error);
                    }
                }
            };

            // load image info
            if (typeof documenturl === 'string') {
                if (documenturl.length === 0) {
                    __emptyAsync(requestCompleted);
                } else {
                    _config.documenturl = documenturl;

                    if (_state.initialized) {
                        __clearUI();
                        __resetScrollbarTimeout(_dom.scrollH);
                        __resetScrollbarTimeout(_dom.scrollV);

                        requests++;

                        if (documenturl.length === 0) {
                            __emptyAsync(requestCompleted);
                        }

                        // add annotations to this request if allowed
                        if (_config.allowannotations && annRequest && annRequest.data) {
                            __beforeAnnotationsDataRequest();
                            $.extend(params, annRequest.data);
                        }

                        // add forms to this request if allowed
                        if (_config.allowforms && formRequest && formRequest.data) {
                            __beforeFormsDataRequest();
                            $.extend(params, formRequest.data);
                        }

                        // let the rest of the function know that the main document info has been requested
                        infoRequested = true;

                        // async call, do not do anything after this
                        // this will complete before the next condition, if data is immediately provided
                        __loadDocumentInfoAsync(params, requestCompleted);
                    }
                }
            } else {
                // allow for opening or clearing annotations and forms if there is a document loaded already
                var clearRequest = !!(!documenturl && _config.documenturl.length > 0 && (annotationsurl || annotationsurl === '' || formurl || formurl === ''));
                if (!clearRequest) {
                    __throwError('openUrlError', 'string input expected for document url.');
                }
            }

            // make requests since the document wasn't requested
            if (!infoRequested) {
                if (annRequest) {
                    requests++;

                    // async call, do not do anything after this
                    __makeAnnotationsHandlerRequest(annRequest, requestCompleted);
                }

                if (formRequest) {
                    requests++;

                    // async call, do not do anything after this
                    __makeFormsHandlerRequest(formRequest, requestCompleted);
                }
            }
        }

        /**
        * Saves the client changes in this document to the pre defined save folder or to the given path.
        * @param {string} [subpath] - Relative path to save to starting from {@link WebDocumentViewerConfig.savepath | savepath}. Must be writable.
        * @param {string} [saveformat] - Save file format. If specified, the value overrides {@link WebDocumentViewerConfig.savefileformat | savefileformat} form config.
        * @param {object} [params] - A plain object containing optional reload parameters that will be passed to server.
        * @param {NotificationCallback} [callback]  to execute when the save has finished
        * @instance
        * @memberOf Atalasoft.Controls.WebDocumentViewer
        * @function save
         *
         * @example
         * var _viewer = new Atalasoft.Controls.WebDocumentViewer({
         * 		parent: $('#atala-document-container-left'),
         * 		toolbarparent: $('#atala-document-toolbar-left'),
         *		serverurl: 'WebDocumentHandler.ashx',
         *		savepath: 'Save/',
         *		savefileformat: 'pdf'
         * });
         *
         * // document will be saved to the subpath subfolder. So if the savepath configuration
         * // parameter was set to Save/ then the save path will be Save/subpath. The format to save the file to will
         * // be taken from the configuration parameter savefileformat (in this example, 'pdf').
         * // This means that the file in pdf format will be saved in Save/subpath folder.
         *  _viewer.save(‘subpath’) // saves to ‘Save/subpath’ in ‘pdf’ format
         *
         * // document will be saved to ‘Save/’ foler in ‘tif’ format.
         * _viewer.save(‘’, ‘tif’)
         */
        function __saveChanges(subpath, saveformat, params, callback) {

            if (typeof params === 'function') {
                callback = params;
                params = {};
            }
            if (typeof saveformat === 'function') {
                callback = saveformat;
                saveformat = _config.savefileformat;
            }

            if (typeof subpath === 'function') {
                callback = subpath;
                subpath = null;
            }

            if (saveformat === undefined) {
                saveformat = _config.savefileformat;
            }

            var saveParams = $.extend(true, params, {
                'atala_subpath': subpath || '',
                'atala_sformat': saveformat
            });

            if (_controllers.annotations) {
                $.extend(saveParams, {
                    'atala_iuname': _config.annotations.saveusername,
                    'atala_annos': _controllers.annotations.stringifyChanges()
                });
            }

            if (_controllers.forms) {
                $.extend(saveParams, {
                    'atala_forms': _controllers.forms.stringifyChanges()
                });
            }

            if (_controllers.document) {
                $.extend(saveParams, {
                    'atala_document': _controllers.document.stringifyChanges()
                });
            }
            // asynch call, do not do anything after this
            __saveDocumentAsync(saveParams, callback);
        }

        /**
        * Gets the current page index
        * @returns {number} Zero based index of the current page.
        *
        * Note, that current page index detection could be affected by {@link WebDocumentViewerConfig.pageselectlocation|pageselectlocation} configuration parameter.
        *  @instance
        * @memberOf Atalasoft.Controls.WebDocumentViewer
        * @function getCurrentPageIndex
        */
        function __getCurrIndex() {
            return _page.number - 1;
        }

        /**
         * Sets the current mouse tool
         * @param {Atalasoft.Utils.MouseToolType} tool - Type of the tool to set.
         *
         * Mouse tool configuration could be passed using {@link WebDocumentViewerConfig.mousetool| mousetool} configuration option.
         * @instance
         * @memberOf Atalasoft.Controls.WebDocumentViewer
         * @function setMouseTool
         */
        function __setMouseTool(tool) {
            for (var key in Atalasoft.Utils.MouseToolType) {
                if (Atalasoft.Utils.MouseToolType.hasOwnProperty(key) && Atalasoft.Utils.MouseToolType[key] === tool) {
                    _controllers.mouseTool.setTool(tool);
                    break;
                }
            }
        }

        /**
        *  Attaches a handler to an event.
        * @param {string} event - the name of the event to bind to.
        * @param {function} handler - event handler.
        * @returns {Atalasoft.Controls.WebDocumentViewer} reference to `this`.
        * @instance
         * @memberOf Atalasoft.Controls.WebDocumentViewer
         * @function bind
         */
        function __bindEvents(event, handler) {
            __trackEventBinds(arguments, true);
            _jqe.bind.apply(_jqe, arguments);

            return _self;
        }

        /**
        * Detaches the handler from the event.
        * @param {string} event - the name of the event to unbind.
        * @param {function} [handler] -  the event handler to unbind. If not specified, all handlers are unbound.
        * @returns {Atalasoft.Controls.WebDocumentViewer} reference to `this`.
        * @instance
        * @memberOf Atalasoft.Controls.WebDocumentViewer
        * @function unbind
        */
        function __unbindEvents(event, handler) {
            __trackEventBinds(arguments, false);
            _jqe.unbind.apply(_jqe, arguments);

            return _self;
        }

        /**
        * Triggers the event.
        * @param {string} event - the name of the event to trigger.
        * @param {Object} [parameters] - the event data.
        * @returns {Atalasoft.Controls.WebDocumentViewer} reference to `this`.
        * @instance
        * @memberOf Atalasoft.Controls.WebDocumentViewer
        * @function trigger
        */
        function __triggerEvent(event, parameters) {
            _jqe.trigger.apply(_jqe, arguments);

            return _self;
        }

        /**
         * Gets the current document info
         * @return {{count: *, dpi: number, size: {height: number, width: number}, vector: boolean}} object indicating document main page size, and number of pages
         * @instance
         * @memberOf Atalasoft.Controls.WebDocumentViewer
         * @function getDocumentInfo
         */
        function __getDocumentInfo() {
            return {
                count: _controllers.document.getPageCount(),
                dpi: _page.dpi,
                size: {
                    height: _page.size.height,
                    width: _page.size.width
                },
                vector: _page.vector
            };
        }

        // #endregion

        __preInit();

        return _self;
    };
})();
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

//
//  Document Manipulation Controller class
//
//  This source code is property of Atalasoft, Inc. (http://www.atalasoft.com/)
//  Permission for usage and modification of this code is only permitted 
//  with the purchase of a source code license.
//
//  Change History:
//	04-30-14	D. Cilley		File Created.
//	08-27-14	D. Cilley		Bug 367422: Fixed a bug that would use old mapping for newly opened documents.
//	12-17-14	D. Cilley		Bug 550581: Added locally scoped non-conflict jQuery.
//	07-02-15	D. Cilley		Bug 625845: Added dispose method.
//	09-01-15	D. Cilley		Task 630965: Added event bind tracking and intellisense.
//	09-15-15	D. Cilley		Bug 627869: Added support for forcing all pages to be fit into the same size.
//-------------------------------------------------------------------------------------------------

// JSHint options and globals
/*jshint eqnull: true, undef: true, jquery: true, browser: true, es3:false */

// Atalasoft global constructors and functions
/*global Atalasoft */

// Local globals

// wdv: parent WebDocumentViewer object
// internals: internal functions and objects from the WDV
// viewerId: id of the viewer, for view-state specific operations.
/**
 * WebDocuemntViewer Document operations API.
 * @class
 * @name DocumentController
 * @inner
 * @memberOf Atalasoft.Controls.WebDocumentViewer
 */
Atalasoft.Document.ManipulationController = function (wdv, internals, viewerId) {
    var $ = Atalasoft.$;
    var _self = this;
    var _wdv = wdv;
    var _wdvInternals = internals;
    var _viewerId = viewerId;

    // #region Intellisense

    var _exposedApi = {
        document: {
            events: {
                /**
                 * Triggers when a page is added to the document.
                 * @event Atalasoft.Controls.WebDocumentViewer~DocumentController#pageinserted
                 * @param {Object} e - Event arguments.
                 * @param {string} e.srcuri - Source document identifier.
                 * @param {number} e.srcindex - Index of the inserted page in the source document.
                 * @param {number} e.index - Page insert index.
                 */
                pageinserted: null,

                /** Triggers when a page is removed from the document.
                 * @event Atalasoft.Controls.WebDocumentViewer~DocumentController#pageremoved
                 * @param {Object} e - Event arguments.
                 * @param {number} e.index - Index of the removed page.
                 */
                pageremoved: null,

                /**
                 * Triggers when a page is moved within the same document.
                 * @event Atalasoft.Controls.WebDocumentViewer~DocumentController#pagemoved
                 * @param {Object} e - Event arguments.
                 * @param {number} e.shiftedsrcindex - Corrected initial page index. Represents an initial page index with all shifts and calculations during a batch operation. Can be useful, when {@link movePages} is called.
                 * @param {number} e.srcindex - Initial page index.
                 * @param {number} e.destindex - Destination page index.
                 */
                pagemoved: null,

                /**
                 * Triggers when the document is changed.
                 * This event indicates document structure or internal state changes and causes visible pages repaint.
                 * @event Atalasoft.Controls.WebDocumentViewer~DocumentController#documentchanged
                 */
                documentchanged: null,

                /**
                 * Fired when document page has been rotated.
                 * @event Atalasoft.Controls.WebDocumentViewer~DocumentController#pagerotated
                 * @param {Object} e - Event arguments
                 * @param {number} e.index - Index of the rotated page.
                 * @param {number} e.angle - Clockwise page rotation angle.
                 */
                pagerotated: null
            },

            /**
             * Inserts a page at the destination index from the given source uri and index.
             * @param {string} [documenturl] - The identifier of the document which contains the page. If empty, `src` numeric value is considered as referencing currently opened document.
             * @param {number|string|DocumentPageReference} src - zero based index of the page in the source document. Can be passed as string representation of a number. Or page descriptor returned by the {@link Atalasoft.Controls.WebDocumentViewer~DocumentController#getPageReference|getPageReference}.
             * @param {number} destination - Index in the target document to insert the page.
             * @param {NotificationCallback} [callback] - function to execute when the operation has completed.
             *
             * @instance
             * @memberOf Atalasoft.Controls.WebDocumentViewer~DocumentController
             * @function
             *
             *
             * @example
             * <caption>Assuming we have two instances of the {@link Atalasoft.Controls.WebDocumentThumbnailer| WebDocumentThumbnailer} control
             * both having document opened. To copy firs page of one control into first position of another
             * following code could be used. </caption>
             *
             * _thumb1.document.insertPage(null, _thumb2.document.getPageReference(0), 0);
             *
             * // this call will insert new page and correctly handle annotations and forms data, so new empty layers will be created.
             * // If annotations should be also coped from the source document, it could be done explicitly using following code
             *
             * const annotations = _thumb1.annotations.getFromPage(0);
             * for (const i = 0; i < annotations.length; i++) {
             * 	_thumb2.annotations.createOnPage(annotations[i], 0);
             * }
             */
            insertPage: __insertPagePublic,

            /**
             * Inserts a page at the destination index from the given source uri and index.
             * @param {string} [documenturl] - The identifier of the document which contains the page. If empty, `src` numeric value is considered as referencing currently opened document.
             * @param {number[]|string[]|DocumentPageReference[]} src - zero based indices of the pages in the source document. Can be passed as string representation of numbers. Or page descriptors returned by the {@link Atalasoft.Controls.WebDocumentViewer~DocumentController#getPageReference|getPageReference}.
             * @param {number} destination - Index in the target document to insert the page.
             * @param {NotificationCallback} [callback] - function to execute when the operation has completed.
             *
             * @instance
             * @memberOf Atalasoft.Controls.WebDocumentViewer~DocumentController
             * @function
             *
             */
            insertPages: __insertPagesPublic,

            /**
             * Removes the page at the given index.
             * @param {number|string} index - Index of the page to remove. Can be passed as string representation of a number
             * @param {NotificationCallback} [callback] - Function to execute when the operation has completed.
             * @instance
             * @memberOf Atalasoft.Controls.WebDocumentViewer~DocumentController
             * @function
             */
            removePage: __removePagePublic,

            /**
             * Removes pages at given indices.
             * @param {number[]|string[]} indices - Indices of pages to remove. Can be passed as string representation of numbers
             * @param {NotificationCallback} [callback] - Function to execute when the operation has completed.
             * @instance
             * @memberOf Atalasoft.Controls.WebDocumentViewer~DocumentController
             * @function
             */
            removePages: __removePagesPublic,

            /**
             * Moves a page from the source index to the destination index within single document.
             * @param {number|string} sourceIndex - Source index to get the page from. Can be passed as string representation of a number
             * @param {number|string} destinationIndex - Destination index to insert the page. Can be passed as string representation of a number
             * @param {NotificationCallback} [callback] - Function to execute when the operation has completed.
             *
             * @instance
             * @memberOf Atalasoft.Controls.WebDocumentViewer~DocumentController
             * @function
             */
            movePage: __movePagePublic,

            /**
             * Moves pages from the source indices to the destination index within single document.
             * @param {number[]|string[]} sourceIndices - Source indices to get pages from. Can be passed as string representation of numbers
             * @param {number|string} destinationIndex - Destination index to insert pages. Can be passed as string representation of a number
             * @param {NotificationCallback} [callback] - Function to execute when the operation has completed.
             *
             * @instance
             * @memberOf Atalasoft.Controls.WebDocumentViewer~DocumentController
             * @function
             */
            movePages: __movePagesPublic,

            /**
             * Rotates the specified angle page to the specified angle.
             *
             * Note, that `angle` represents final rotation value that will be applied to the original page.			 *
             * @param {number|string} index - Index of the page to rotate. Can be passed as string representation of a number
             * @param {number|string} angle - Clockwise rotation angle in degrees. Can be passed as string representation of a number
             * @param {NotificationCallback} [callback] - Function to execute when the operation has completed.
             *
             * @instance
             * @memberOf Atalasoft.Controls.WebDocumentViewer~DocumentController
             * @function
             *
             * @example
             * <caption>If rotation should be applied to already rotated page, use {@link Atalasoft.Controls.WebDocumentViewer~DocumentController#getPageRotation| getPageRotation} to get current page rotation.</caption>
             * viewer.document.rotatePage(0, viewer.document.getPageRotation(0) + 90);
             */
            rotatePage: __rotatePagePublic,

            /**
             * Rotates specified angle pages to specified angles.
             *
             * Note, that `angles` represents final rotation values that will be applied to original pages.
             * @param {number[]|string[]} indices - Indices of pages to rotate.
             * @param {number|number[]|string|string[]} angles - Clockwise rotation angles in degrees. Can be passed as string representation of a number If angles is a number|string or an number[]|string[] with length 1,
             * then all pages will be rotated to this angle, otherwise each page will be rotated to the specified angle in array.
             * @param {NotificationCallback} [callback] - Function to execute when the operation has completed.
             *
             * @instance
             * @memberOf Atalasoft.Controls.WebDocumentViewer~DocumentController
             * @function
             *
             * @example
             * <caption>Rotate pages with indexes 0 and 3 on 90 degrees</caption>
             * viewer.document.rotatePages([0, 3], 90)
             *
             * @example
             * <caption>Rotate page with index 0 on 180 degrees and page with index 3 on 90 degrees</caption>
             * viewer.document.rotatePages([0, 3], [180, 90])
             */
            rotatePages: __rotatePagesPublic,

            /**
             * Gets the rotation angle of the specified page.
             * @param {number} index - Index of the page to retrieve rotation angle.
             * @returns {number} Clockwise rotation angle of the specified page.
             *
             * @instance
             * @memberOf Atalasoft.Controls.WebDocumentViewer~DocumentController
             * @function
             */
            getPageRotation: __getPageRotation,

            /**
             * Document page descriptor.
             * @typedef {Object} DocumentPageReference
             * @property {string} uri - Identifier of the document containing the page.
             * @property {number} index - Index of the referenced page in current document.
             */
            /**
             * Gets the page reference object for the specified page. This can be passed as a 'srcindex' parameter into document.insertPage method.
             * @param {number} index - Index of the page to get the reference.
             * @returns {DocumentPageReference}
             * @instance
             * @memberOf Atalasoft.Controls.WebDocumentViewer~DocumentController
             * @function
             */
            getPageReference: __getPageReferencePublic
        }
    };

    Atalasoft.Document.ManipulationController.__exposedApi = _exposedApi.document;

    // we call this function without params to establish intellisense API
    if (!wdv) {
        return null;
    }

    // #endregion

    var _wdvReady = false;
    var _data = { // data object for controller properties
        changes: [], // array of objects representing changes in the document
        mapping: null,
        count: 0, // number of pages in addition to original document
        inserted: 0, // number of pages inserted from other documents regardless of full count
        info: { // image info from the server
            count: 0,
            dpi: 96,
            size: {
                width: 0,
                height: 0
            },
            vector: false
        }
    };

    var _publicEvents = {
        inserted: 'pageinserted',
        removed: 'pageremoved',
        moved: 'pagemoved',
        changed: 'documentchanged',
        rotated: 'pagerotated'
    };

    // #region Controller LifeCycle

    function __initController() {
        _wdv.bind({
            pagerecycled: __onPageRecycled,
            pageshown: __onPageShown,
            documentinfochanged: __onDocumentInfoChanged
        });

        // is WDV ready or still loading scripts?
        if (_wdvInternals._state.initialized) {
            __wdvInitialized();
        } else {
            _wdv.bind({
                initialized: __wdvInitialized
            });
        }
    }

    function __wdvInitialized() {
        _wdvReady = true;
    }

    function __onDocumentInfoChanged(e) {
        _data.info = e.info;
        _data.mapping = null;
        _data.changes.length = 0;
        _data.count = 0;
        _data.inserted = 0;
        _data.length = 0;
    }

    _self.dispose = __dispose;
    function __dispose() {
        _self = null;
        _wdv = null;
        _wdvInternals = null;

        // _data.changes.length = 0;
        // _data.mapping =  null;
        // _data.info = null;
    }

    // #endregion

    // #region Extend WDV

    // adds manipulation specific methods to WDV 
    function __extendWDV() {
        if (_wdv.typeOf === 'Atalasoft.Controls.WebDocumentViewer') {
            $.extend(_wdv, _exposedApi);
        }
    }

    function __throwError(name, msg) {
        _wdv.trigger({
            type: 'throwerror',
            name: name,
            msg: msg
        });
    }

    // #endregion

    // #region Private Page Methods
    // owerwrite instance public API to point to same data as internal API. otherwise exception is not clear since data is captured from shared closure
    _self.__exposedApi = _exposedApi.document;
    _self.getPageDefinition = __getPageDefinition;
    _self.setPageCacheIndex = __setPageCacheIndex;
    _self.insertPage = __insertPagePublic;
    _self.removePage = __removePagePublic;
    _self.movePage = __movePagePublic;
    _self.rotatePage = __rotatePagePublic;
    _self.insertPages = __insertPagesPublic;
    _self.removePages = __removePagesPublic;
    _self.movePages = __movePagesPublic;
    _self.rotatePages = __rotatePagesPublic;

    _self.getPageFitMultiplier = __getPageFitMultiplier;
    _self.setPageFitMultiplier = __setPageFitMultiplier;
    _self.getPageRotation = __getPageRotation;
    _self.getPageSize = __getPageSize;
    _self.setPageSize = __setPageSize;

    _self.updatePageText = __updatePageTextData;
    _self.getPageText = __getPageTextData;
    _self.initDocumentText = __initDocumentText;
    _self.getPageIndexByImageIndex = __getPageIndexByImageIndex;

    // checks if the mapping has been created, if not, creates it
    function __checkPageMapping() {
        if (_data.mapping == null) {
            __initPageMapping();
        }
    }

    function __ensureViewState(index, id) {
        __checkPageMapping();
        if (_data.mapping[index]) {
            if (!_data.mapping[index].viewestate[id]) {
                _data.mapping[index].viewestate[id] = {
                    size: null,
                    fitmultiplier: null
                };
            }
        }
    }

    function __getPageIndexByImageIndex(mapsto) {
        // if it is a source document page
        if (mapsto < _data.info.count) {
            for (var i = 0; i < _data.mapping.length; i++) {
                if (_data.mapping[i].index === mapsto) return i;
            }
        } else {
            // if the page was inserted
            for (var j = 0; j < _data.mapping.length; j++) {
                if (_data.mapping[j].pageref && _data.mapping[j].pageref.mapsto === mapsto) return j;
            }
        }

        return -1;
    }

    // creates initial page mapping
    function __initPageMapping() {

        var count = Math.max(_data.info.count, 0);
        _data.mapping = new Array(count);

        for (var i = 0; i < count; ++i) {
            _data.mapping[i] = __createEmptyMapping(i);
        }
    }

    function __createEmptyMapping(i) {
        return {
            index: i,
            viewestate: {}, // need to track fitmultipliers and page momentary size independently for each control
            pageref: null,
            angle: 0,
            text: null
        };
    }

    function __setPageCacheIndex(pageIndex, cacheIndex) {
        __ensureViewState(pageIndex, _viewerId);

        if (_data.mapping[pageIndex] && _data.mapping[pageIndex].viewestate) {
            _data.mapping[pageIndex].viewestate[_viewerId].cacheIndex = cacheIndex;
        }
    }

    function __getPageDefinition(index, id) {
        id = id || _viewerId;

        __checkPageMapping();

        if (index >= 0 && index < _data.mapping.length && _data.mapping[index]) {
            var mapping = _data.mapping[index];
            var pageref = null;
            var uri = null;
            if (mapping === -1) {
                return null;
            } else if (mapping.pageref != null) {
                pageref = mapping.pageref;
                index = pageref.index;
                uri = pageref.uri;
            } else {
                index = mapping.index;
            }

            var cacheIndex = mapping.viewestate[id] && mapping.viewestate[id].cacheIndex >= 0 ? mapping.viewestate[id].cacheIndex : -1;
            return {
                // index in source document
                index: index,
                // external page description
                ref: pageref,

                // index in dom 'img' cache 
                cacheIndex: cacheIndex,

                // extenal page document identifier.
                uri: uri
            };
        }

        return null;
    }

    function __getPageReference(index) {
        __checkPageMapping();

        if (index >= 0 && index < _data.mapping.length) {
            if (_data.mapping[index].pageref !== null) {
                return _data.mapping[index].pageref;
            } else {
                return _data.mapping[index].index;
            }
        } else {
            return null;
        }
    }

    // passing id is a hack to avoid viewer to work with a docuement controllers that are not currently controlling it(i.e. with multiple detached thumbnails)
    function __getPageFitMultiplier(index, id) {
        id = id || _viewerId;
        __checkPageMapping();
        __ensureViewState(index, id);

        if (index >= 0 && index < _data.mapping.length && _data.mapping[index].viewestate[id].fitmultiplier) {
            return _data.mapping[index].viewestate[id].fitmultiplier;
        } else {
            return 1;
        }
    }

    // passing id is a hack to avoid viewer to work with a docuement controllers that are not currently controlling it(i.e. with multiple detached thumbnails)
    function __setPageFitMultiplier(index, m, id) {
        id = id || _viewerId;
        __checkPageMapping();
        __ensureViewState(index, id);

        if (index >= 0 && index < _data.mapping.length) {
            _data.mapping[index].viewestate[id].fitmultiplier = m;
        }
    }

    function __getPageRotation(index) {
        __checkPageMapping();
        if (index >= 0 && index < _data.mapping.length) {
            return _data.mapping[index].angle;
        }

        return 0;
    }

    // inserts a new page into the document
    // sourceUri: string, relative uri to get the page from
    // sourceMapping: object, contains index, pageref, and fitmultiplier of the page in the source document
    // index: number, page index to insert the page into
    function __insertPage(sourceUri, sourceMapping, index) {
        var sourceRef = sourceMapping;
        if (sourceUri && sourceUri !== wdv.config.documenturl) {
            sourceRef.pageref = {
                uri: sourceUri,
                index: sourceMapping.index,
                mapsto: _data.info.count + _data.inserted
            };
        }

        _data.count++;
        _data.inserted++;
        _data.mapping.splice(index, 0, sourceRef);
    }

    // removes a page from the document
    // index: number, page index to remove the page from
    function __removePage(index) {
        _data.count--;
        return _data.mapping.splice(index, 1)[0];
    }

    // e.index: index of the shown page
    // e.page: jQuery dom object, reusable div container that represents the page
    function __onPageShown(e) {}

    // e.index: index of the recycled page
    // e.page: jQuery dom object, reusable div container that represents the page
    function __onPageRecycled(e) {}

    // #endregion

    // #region WDV Exposed Methods

    function __getPageReferencePublic(index) {
        var ref = __getPageReference(index);
        if (ref !== null) {
            if ((typeof ref === 'undefined' ? 'undefined' : _typeof(ref)) === 'object') {
                // return a copy
                return {
                    "uri": ref.uri,
                    "index": ref.index
                };
            } else if ($.isNumeric(ref)) {
                return {
                    "uri": wdv.config.documenturl,
                    "index": ref
                };
            }
        }

        return ref;
    }

    function __insertPagePublic(srcuri, srcindex, destindex, callback) {
        if (Array.isArray(srcindex)) {
            __throwError('IncorrectIndex', "Source index can not be an array.");
            return;
        }

        __insertPagesPublic(srcuri, [srcindex], destindex, callback);
    }

    function __insertPagesPublic(srcUri, srcIndices, destIndex, callback) {
        var checkedIndices = void 0;
        var uriFromParameter = void 0;

        if (typeof srcUri === 'string' && srcUri.trim().length > 0) {
            checkedIndices = __checkIndices(srcIndices, Number.MAX_VALUE);
            uriFromParameter = true;
        } else if (srcUri === null || typeof srcUri === 'undefined') {
            var checkPageReferences = function checkPageReferences(pageRefs) {
                var notAReference = [];
                var result = null;
                var refsFromIndices = null;

                if (!Array.isArray(pageRefs)) {
                    __throwError('IncorrectPageReferences', 'Objects ' + pageRefs + ' are not an array.');
                    return result;
                }

                if (__validateNumbers(pageRefs)) {
                    refsFromIndices = new Array(pageRefs.length);
                    for (var i = 0; i < pageRefs.length; i++) {
                        refsFromIndices[i] = __getPageReferencePublic(pageRefs[i]);
                    }
                }

                for (var _i = 0; _i < pageRefs.length; _i++) {
                    var idx = refsFromIndices !== null ? refsFromIndices[_i] : pageRefs[_i];

                    if ((typeof idx === 'undefined' ? 'undefined' : _typeof(idx)) !== 'object' || idx === null || typeof idx.uri !== 'string' || idx.uri.trim().length === 0) {
                        notAReference.push(idx);
                        continue;
                    }

                    var checkedPageRefNumber = __checkIndices([idx.index], Number.MAX_VALUE);

                    if (checkedPageRefNumber !== null) idx.index = checkedPageRefNumber[0];else notAReference.push(idx);
                }

                if (notAReference.length > 1) __throwError('IncorrectPageReferences', 'Objects "' + notAReference.join('", "') + '" are not correct page references.');else if (notAReference.length > 0) __throwError('IncorrectPageReferences', 'Object "' + notAReference[0] + '" is not a correct page reference.');else result = refsFromIndices !== null ? refsFromIndices : pageRefs;

                return result;
            };

            uriFromParameter = false;
            checkedIndices = checkPageReferences(srcIndices);
        } else {
            __throwError('IncorrectUri', 'Uri has invalid value "' + srcUri + '". It must be an uri to the source document or not set.');
            return;
        }

        var destIdx = __checkDestIndex(destIndex, false);

        if (checkedIndices === null || destIdx === null) return;

        _wdvInternals._state.batchoperation++;
        for (var i = 0; i < checkedIndices.length; i++) {
            var uri = uriFromParameter ? srcUri : checkedIndices[i].uri;
            var srcIdx = uriFromParameter ? checkedIndices[i] : checkedIndices[i].index;

            if (i === checkedIndices.length - 1) {
                _wdvInternals._state.batchoperation--;
            }

            var sourceMapping = __createEmptyMapping(srcIdx);
            __insertPage(uri, sourceMapping, destIdx);

            if (_wdvInternals._controllers.annotations) {
                _wdvInternals._controllers.annotations.insertLayer(null, null, destIdx);
            }

            if (_wdvInternals._controllers.forms) {
                _wdvInternals._controllers.forms.insertForm(null, null, destIdx);
            }

            _data.changes.push({
                type: 'insertpage',
                uri: uri,
                src: sourceMapping.index,
                dest: destIdx
            });

            _wdv.trigger({
                type: _publicEvents.inserted,
                srcuri: uri,
                srcindex: srcIdx,
                destindex: destIdx
            });

            destIdx++;
        }

        if (typeof callback === 'function') callback();

        _wdv.trigger(_publicEvents.changed);
    }

    function __removePagePublic(index, callback) {
        __removePagesPublic([index], callback);
    }

    function __removePagesPublic(indices, callback) {
        __checkPageMapping();

        var checkedIndices = __checkSrcIndices(indices, true);

        if (checkedIndices === null) return;

        _wdvInternals._state.batchoperation++;
        checkedIndices.sort(function (a, b) {
            return b - a;
        }).forEach(function (pageIndex, idx) {
            if (idx === checkedIndices.length - 1) {
                _wdvInternals._state.batchoperation--;
            }

            __removePage(pageIndex);

            if (_wdvInternals._controllers.annotations) {
                _wdvInternals._controllers.annotations.removeLayer(pageIndex);
            }

            if (_wdvInternals._controllers.forms) {
                _wdvInternals._controllers.forms.removeForm(pageIndex);
            }

            _data.changes.push({
                type: 'removepage',
                index: pageIndex
            });

            _wdv.trigger({
                type: _publicEvents.removed,
                index: pageIndex
            });
        });

        if (typeof callback === 'function') callback();

        _wdv.trigger(_publicEvents.changed);
    }

    function __movePagePublic(srcindex, destindex, callback) {
        __movePagesPublic([srcindex], destindex, callback);
    }

    function __movePagesPublic(srcIndices, destIndex, callback) {
        __checkPageMapping();

        var checkedSrcIndices = __checkSrcIndices(srcIndices, true);
        var checkedDestIndex = __checkDestIndex(destIndex, true);

        if (checkedSrcIndices === null || checkedDestIndex === null) return;

        var destIdx = checkedDestIndex;
        var destShiftDirection = checkedSrcIndices[0] > checkedDestIndex ? +1 : -1;
        _wdvInternals._state.batchoperation++;

        var _loop = function _loop(i) {
            var arrIdx = i;
            var srcIdx = checkedSrcIndices[arrIdx];

            /*
             * Try to calculate where original page is?
             * In some cases it can change its index:
             * Example:
             *   Original document pages : [0, 1, 2, 3, 4, 5]
             *   Operation - movePages ([1,3], 4)
             *   page with index 1 has shift 0
             *   BUT page with index 3 will have shift -1, because on previous step we move page 1 to the end of the document
             *
             * Example 2:
             *   Original document pages [0, 1, 2, 3, 4, 5]
             *   Operation - movePages ([3,2], 0)
             *   page with index 3 has shift 0
             *   BUT page with index 3 will have shift +1, because on previous step we move page 3 to the start of the document
             *
             * In other words, you need to calculate index shift because in some case page order is changed during move operation. 
             */
            var srcIdxShift = 0;
            var destIdxShift = 0;
            if (srcIdx < checkedDestIndex) {
                srcIdxShift = -checkedSrcIndices.filter(function (elem, idx) {
                    return idx < arrIdx && elem < srcIdx && elem < checkedDestIndex;
                }).length;
            } else if (srcIdx > checkedDestIndex) {
                srcIdxShift = checkedSrcIndices.filter(function (elem, idx) {
                    return idx < arrIdx && elem > srcIdx;
                }).length;
            } else {
                if (destShiftDirection < 0) srcIdxShift = -checkedSrcIndices.filter(function (elem, idx) {
                    return idx < arrIdx && elem < srcIdx && elem < checkedDestIndex;
                }).length;else srcIdxShift = checkedSrcIndices.filter(function (elem, idx) {
                    return idx < arrIdx && elem > srcIdx;
                }).length;
            }

            if (i > 0) {
                if (srcIdxShift < 0 || srcIdx < checkedDestIndex) destIdxShift = -1;
            }

            destIdx += destIdxShift;

            if (i === checkedSrcIndices.length - 1) {
                _wdvInternals._state.batchoperation--;
            }

            __insertPage(null, __removePage(srcIdx + srcIdxShift), destIdx);

            if (_wdvInternals._controllers.annotations) {
                _wdvInternals._controllers.annotations.moveLayer(srcIdx + srcIdxShift, destIdx);
            }

            if (_wdvInternals._controllers.forms) {
                _wdvInternals._controllers.forms.moveForm(srcIdx + srcIdxShift, destIdx);
            }

            _data.changes.push({
                type: 'movepage',
                src: srcIdx + srcIdxShift,
                dest: destIdx
            });

            _wdv.trigger({
                type: _publicEvents.moved,
                shiftedsrcindex: srcIdx + srcIdxShift,
                srcindex: srcIdx,
                destindex: destIdx
            });

            destIdx++;
        };

        for (var i = 0; i < checkedSrcIndices.length; i++) {
            _loop(i);
        }

        if (typeof callback === 'function') callback();

        _wdv.trigger(_publicEvents.changed);
    }

    function __rotatePagePublic(index, angle, callback) {
        if (Array.isArray(angle)) {
            __throwError('rotatePage', 'angle ' + angle + ' is array.');
            return;
        }

        __rotatePagesPublic([index], angle, callback);
    }

    function __rotatePagesPublic(indices, angles, callback) {
        __checkPageMapping();

        var checkAnglesFunc = function checkAnglesFunc(anglesToCheck, isNumberOrString) {
            var result = isNumberOrString ? __checkNumbers([anglesToCheck]) : __checkNumbers(anglesToCheck);
            if (result) for (var i = 0; i < result.length; i++) {
                if (result[i] % 90) {
                    __throwError('rotatePages', 'Angle must be a multiple of 90 degrees.');
                    return null;
                }
                result[i] = result[i] % 360;
            }

            return result;
        };

        var checkedIndices = __checkSrcIndices(indices);
        var angleIsNumberOrString = typeof angles === 'number' || typeof angles === 'string';
        var checkedAngles = checkAnglesFunc(angles, angleIsNumberOrString);

        if (checkedIndices === null || checkedAngles === null) return;

        if (!angleIsNumberOrString && checkedIndices.length !== checkedAngles.length) {
            __throwError('rotatePages', 'Indices array and angles array have different lengths.');
            return;
        }

        _wdvInternals._state.batchoperation++;
        checkedIndices.forEach(function (pageIdx, i) {
            var pageAngle = checkedAngles.length > 1 ? checkedAngles[i] : checkedAngles[0];

            if (i === checkedIndices.length - 1) {
                _wdvInternals._state.batchoperation--;
            }

            var pageDiv = __rotatePage(pageIdx, pageAngle);

            _data.changes.push({
                type: 'rotatepage',
                index: pageIdx,
                angle: pageAngle
            });

            _wdv.trigger({
                type: _publicEvents.rotated,
                index: pageIdx,
                page: pageDiv,
                angle: pageAngle
            });
        });

        if (typeof callback === 'function') callback();

        //TFS#1130484 By some reason uncommenting this line breaks rotation in IE11. 
        //_wdv.trigger(_publicEvents.changed);
    }

    function __rotatePage(index, angle) {
        _data.mapping[index].angle = angle;

        var pageDiv = null;
        for (var i = 0; i < _wdvInternals._pages.length; ++i) {
            var pg = _wdvInternals._pages[i];

            if (pg._index === index) {
                pageDiv = pg;
                break;
            }
        }

        var adjustNeeded = !!pageDiv && !!pageDiv._img;

        if (adjustNeeded) {
            _wdvInternals.startDomManipulation();
            _wdvInternals.adjustVisiblePages(true, _wdvInternals.endDomManipulation);
        }

        return pageDiv;
    }

    function __updatePageTextData(index, pageData) {
        __checkPageMapping();
        if (index >= 0 && index < _data.mapping.length) {
            _data.mapping[index].text = pageData;
        }
    }

    function __getPageTextData(index) {
        if (index >= 0 && index < _data.mapping.length) {
            return _data.mapping[index].text;
        }

        return null;
    }

    function __initDocumentText(document) {
        if (document && document.pages) {
            __checkPageMapping();

            // occurs on document load so in most cases mappings collection directly correspond to source document.
            for (var i = 0; i < _data.mapping.length; ++i) {
                if (i < document.pages.length) {
                    if (_data.mapping[i].index === i) {
                        _data.mapping[i].text = document.pages[i];
                    } else {
                        // we are not expected to get here, but maybe somehow method were called after pages added/removed
                        for (var j = 0; j < _data.mapping.length; ++j) {
                            if (_data.mapping[j].index === i) {
                                _data.mapping[j].text = document.pages[i];
                            }
                        }
                    }
                } else {
                    _data.mapping[i].text = null;
                }
            }
        }
    }

    // #endregion

    // #region Private Exposed Methods

    _self.__getDebugInfo = __getDebugInfo;
    function __getDebugInfo() {
        var info = {};
        $.extend(true, info, {
            data: _data,
            changes: _data.changes
        });

        return info;
    }

    _self.__linkChanges = __linkChanges;
    function __linkChanges(linker) {
        if (linker) {
            if (!linker._changes) {
                linker._changes = _data;
            } else {
                _data = linker._changes;
            }
        }
    }

    _self.clear = __clearDocumentPublic;
    function __clearDocumentPublic(callback) {
        _data.clear();
        if (typeof callback === 'function') {
            callback();
        }

        _wdv.trigger(_publicEvents.changed);
    }

    _self.getPageCount = __getPageCount;
    function __getPageCount() {
        return _data.info.count + _data.count;
    }

    // viewer id is required to avoid explicit size changes for same page which 
    // is displayed in the viewer and thumbnailer(changing size requires adjusting internal state).
    // passing id is a hack to avoid viewer to work with a docuement controllers that are not currently controlling it(i.e. with multiple detached thumbnails)
    function __getPageSize(index, id) {
        id = id || _viewerId;
        __checkPageMapping();
        __ensureViewState(index, id);

        if (index >= 0 && index < _data.mapping.length) {
            var size = _data.mapping[index].viewestate[id].size;
            if (!size) {
                var info = _data.info;
                if (info.pagesizes && info.pagesizes[index]) {
                    return info.pagesizes[index];
                }
            }
            return size;
        }
    }

    // viewer id is required to avoid explicit size changes for same page which 
    // is displayed in the viewer and thumbnailer(changing size requires adjusting internal state).
    // passing id is a hack to avoid viewer to work with a docuement controllers that are not currently controlling it(i.e. with multiple detached thumbnails)
    function __setPageSize(index, size, id) {
        id = id || _viewerId;
        __checkPageMapping();
        __ensureViewState(index, id);

        if (index >= 0 && index < _data.mapping.length) {
            _data.mapping[index].viewestate[id].size = size;
        }
    }

    function __checkDestIndex(destIndex, moveOperation) {
        var idx = __checkIndices([destIndex], _data.mapping.length + (moveOperation ? 0 : 1));

        if (idx) return idx[0];

        return idx;
    }

    function __checkSrcIndices(indices, checkForRepeat) {
        return __checkIndices(indices, _data.mapping.length, checkForRepeat);
    }

    function __checkIndices(indices, maxIndex, checkForRepeat) {
        var outOfRange = [];
        var repeated = [];
        var result = null;

        var errName = 'IncorrectIndices';

        if (!Array.isArray(indices)) {
            __throwError(errName, 'Object ' + indices + ' is not an array.');
            return result;
        }

        indices = __checkNumbers(indices);

        if (indices) indices.forEach(function (index, i, indicesArr) {
            if (index < 0 || index >= maxIndex) outOfRange.push(index);

            if (checkForRepeat && indicesArr.filter(function (value) {
                return value === index;
            }).length > 1 && repeated.indexOf(index) === -1) repeated.push(index);
        });

        if (outOfRange.length > 1) __throwError(errName, 'Page indices ' + outOfRange.join(', ') + ' are outside of the document.');else if (outOfRange.length > 0) __throwError(errName, 'Page index ' + outOfRange[0] + ' is outside of the document.');else if (repeated.length > 1) __throwError(errName, 'Page indices ' + repeated.join(', ') + ' are included more than once.');else if (repeated.length > 0) __throwError(errName, 'Page index ' + repeated[0] + ' is included more than once.');else result = indices;

        return result;
    }

    function __checkNumbers(numbers) {
        var notANumber = [];
        var result = [];

        if (!Array.isArray(numbers)) {
            __throwError('IncorrectNumbers', 'Object ' + numbers + ' is not an array.');
            return result;
        }

        numbers.forEach(function (number) {
            var parsedNumber = Atalasoft.Utils.ParseInt(number);
            if (parsedNumber === null) notANumber.push(number);else result.push(parsedNumber);
        });

        if (notANumber.length > 1) {
            __throwError('IncorrectNumbers', 'Objects "' + notANumber.join('", "') + '" are not numbers.');
            result = null;
        } else if (notANumber.length > 0) {
            __throwError('IncorrectNumbers', 'Object "' + notANumber[0] + '" is not a number.');
            result = null;
        }

        return result;
    }

    function __validateNumbers(numbers) {
        var notANumber = [];

        if (!Array.isArray(numbers)) {
            return false;
        }

        numbers.forEach(function (number) {
            var parsedNumber = Atalasoft.Utils.ParseInt(number);
            if (parsedNumber === null) notANumber.push(number);
        });

        return notANumber.length === 0;
    }

    // #endregion

    // #region Ajax/Json Methods

    _self.stringifyChanges = __stringifyChanges;
    function __stringifyChanges(s) {
        var arr = [];
        var pagecount = {
            "type": "docinfo",
            "pagescount": _data.info.count
        };
        arr.push(pagecount);

        for (var key in _data.changes) {
            if (_data.changes.hasOwnProperty(key)) {
                if (_wdv.config.persistrotation || _data.changes[key].type !== 'rotatepage') {
                    var obj = {};
                    for (var z in _data.changes[key]) {
                        if (_data.changes[key].hasOwnProperty(z)) {
                            obj[z] = _data.changes[key][z];
                        }
                    }
                    arr.push(obj);
                }
            }
        }

        return JSON.stringify({
            changes: arr
        });
    }

    // #endregion

    __extendWDV();
    __initController();
};
'use strict';

//
//  Tool Controller class
//
//  This source code is property of Atalasoft, Inc. (http://www.atalasoft.com/)
//  Permission for usage and modification of this code is only permitted 
//  with the purchase of a source code license.
//
//  Change History:
//	08-31-12	D. Cilley		File Created.
//	09-11-12	D. Cilley		FB 13589: Improved architecture to allow for easier editing.
//	10-25-12	D. Cilley		FB 13715: Added __getDebugInfo for testing.
//	11-16-12	D. Cilley		FB 13793: Made changes to help pinch zooming.
//	02-21-13	D. Cilley		FB 14065: Added JSHint options and fixes to comply with JSHint warnings.
//	03-01-13	D. Cilley		FB 14066: TextAnnotations now use HTML rendering for all browsers.
//	11-06-13	D. Cilley		FB 14453: Added config to allow/disable flick scrolling.
//	12-03-13	D. Cilley		FB 14071: Removed jquery.browser dependency.
//	03-18-14	D. Cilley		Bug 316222: Moved zoomStart zoomInstant and zoomEnd to _wdvInternals.
//	12-17-14	D. Cilley		Bug 550581: Added locally scoped non-conflict jQuery.
//	12-04-15	D. Cilley		Bug 670919, 670924, 670938: Fixed several ZoomArea bugs.
//-------------------------------------------------------------------------------------------------

// JSHint options and globals
/*jshint eqnull: true, undef: true, jquery: true, browser: true, es3:false */

// Atalasoft global constructors and functions
/*global Atalasoft */

// Local globals

// wdv: parent WebDocumentViewer object
// internals: internal functions and objects from the WDV
// eObject: jQuery object to attach events to
// sObject: scrollable jQuery scrollable object (usually _scroller)
Atalasoft.Controls.ToolController = function (wdv, internals, eObject, sObject, settings) {
    if (!eObject || !sObject) {
        Atalasoft.Event.Throw('Atalasoft.Controls.ToolController', 0, null, 'ToolController requires a WDV and two jQuery objects passed in as input, one for mouse events, the other for scrolling.');
        return false;
    }

    var $ = Atalasoft.$;
    var _self = this;
    var _wdv = wdv; // parent WebDocumentViewer
    var _wdvInternals = internals;
    var _jqeInternal = (internals ? internals._internalEvents : null) || $({});

    var SelectSrollTimeout = 50; // milliseconds timeout to detect that mouse is out of viewport so we need to scroll the document    

    var _vp = eObject; // event viewport
    var _scroller = sObject; // scrollable DOM object
    var container = _vp.parents('.' + _wdv.domclasses.atala_main_container).first();

    var _toolTypes = Atalasoft.Utils.MouseToolType;
    var _toolCursors = Atalasoft.Utils.MouseToolCursor;

    var _primaryToolBackup = _toolTypes.Pan;
    var _secondaryToolBackup = _toolTypes.None;

    var _tool = null;
    var _zoom = 1;

    var _rp = ''; // resource path
    var _cursor = null;
    var _custom = ''; // custom cursor
    var _flickPoints = [];
    var _scd = 1000;
    var _activePage = null;
    var _uses = -1;

    var _scrollTimeout = null;

    var _config = {
        allowflick: true,
        // will be passed from WDV. here is just for readability.
        text: {
            scrolltriggerarea: Atalasoft.Utils.ScrollArea.Normal,
            innerscrolldelta: 10,
            outerscrolldelta: 20
        }
    };

    /**
     * Internal events for conditional input handling.
     */
    _self.events = _events;
    var _events = {
        textselectstart: 'textselectstart',
        textselectmove: 'textselectmove',
        textselectend: 'textselectend',
        textselectcopy: 'textselectcopy'
    };

    // map settings onto config
    if (settings) {
        $.extend(_config, settings);
        _config.text.scrolltriggerarea = Math.max(0, Math.min(_config.text.scrolltriggerarea, 0.3));
    }

    __init();
    function __init() {
        _tool = new Atalasoft.Controls.PointerTool();
        _vp.bind(_tool.events.viewport);

        if (_tool.events.wdv) {
            _wdv.bind(_tool.events.wdv);
        }

        // upper level tool events
        _tool.bind({
            clickzoom: __onClickZoom,
            fit: __onFit,
            panstart: __onPanStart,
            panmove: __onPanMove,
            panend: __onPanEnd,
            zoomstart: __onZoomStart,
            zoommove: __onZoomMove,
            zoomend: __onZoomEnd,
            selectstart: __onSelectStart,
            selectmove: __onSelectMove,
            selectend: __onSelectEnd,
            zoomareastart: __onSelectStart,
            zoomareamove: __onSelectMove,
            zoomareaend: __onSelectEnd,

            textselectstart: __onTextSelectStart,
            textselectmove: __onTextSelectMove,
            textselectend: __onTextSelectEnd,
            textselectscroll: __onTextSelectScroll,
            textselectcopy: __onTextSelectCopy
        });
    }

    _self.dispose = __dispose;
    function __dispose() {
        if (_tool && _tool.events) {
            if (_tool.events.wdv && _wdv && _wdv.unbind) {
                _wdv.unbind(_tool.events.wdv);
            }

            if (_tool.events.viewport && _vp && _vp.unbind) {
                _vp.unbind(_tool.events.viewport);
            }
        }

        if (_flickPoints && _flickPoints.length > 0) {
            _flickPoints.length = 0;
        }

        if (_tool && _tool.dispose) {
            _tool.dispose();
        }

        _toolCursors = null;
        _toolTypes = null;
        _scroller = null;
        _vp = null;
        _wdv = null;
        _self = null;
    }

    // #region Events

    // #region Public functions

    _self.bind = __bindEvents;
    function __bindEvents() {
        _jqeInternal.bind.apply(_jqeInternal, arguments);

        return _self;
    }

    _self.unbind = __unbindEvents;
    function __unbindEvents() {
        _jqeInternal.unbind.apply(_jqeInternal, arguments);

        return _self;
    }

    _self.trigger = __triggerEvent;
    function __triggerEvent() {
        _jqeInternal.trigger.apply(_jqeInternal, arguments);

        return _self;
    }
    // #endregion
    _self.setTool = __setTool;
    function __setTool(priTool, secTool) {
        if (Atalasoft.Utils.Browser.Explorer8) {
            priTool = priTool !== Atalasoft.Utils.MouseToolType.Text ? priTool : Atalasoft.Utils.MouseToolType.Arrow;
            secTool = secTool !== Atalasoft.Utils.MouseToolType.Text ? secTool : Atalasoft.Utils.MouseToolType.Arrow;
        }

        _tool.setTool(priTool, secTool);
        __pushToolBackup(priTool, secTool);

        switch (priTool) {
            case _toolTypes.None:
                __setCursor(_toolCursors.Arrow);
                break;

            case _toolTypes.Pan:
                __setCursor(_toolCursors.Move);
                break;

            case _toolTypes.ZoomIn:
                __setCursor(_toolCursors.ZoomIn);
                break;

            case _toolTypes.ZoomOut:
                __setCursor(_toolCursors.ZoomOut);
                break;

            case _toolTypes.Selection:
                _wdvInternals.raiseDrawLayer();
                _uses = 1;
                __setCursor(_toolCursors.Crosshair);
                break;

            case _toolTypes.ZoomArea:
                _wdvInternals.raiseDrawLayer();
                _uses = 1;
                __setCursor(_toolCursors.Crosshair);
                break;

            case _toolTypes.Text:
                _wdvInternals.raiseDrawLayer();
                __setCursor(_toolCursors.Text);
                break;

            default:
                __setCursor(_toolCursors.Arrow);
                break;
        }
    }

    _self.__getDebugInfo = __getDebugInfo;
    function __getDebugInfo() {
        var info = {};
        $.extend(true, info, {
            cursor: _cursor,
            custom: _custom,
            flick: _flickPoints,
            resourcepath: _rp,
            flickdelay: _scd,
            scroller: _scroller,
            tool: _tool,
            toolcusors: _toolCursors,
            tooltypes: _toolTypes,
            viewport: _vp,
            zoom: _zoom
        });

        return info;
    }

    _self.getTool = __getTool;
    function __getTool() {
        return _tool.getTool();
    }

    // tells the viewer to pause tool handling
    _self.pauseTool = __pauseTool;
    function __pauseTool() {
        return _tool.pauseTool();
    }

    // tells the viewer to resume tool handling
    _self.resumeTool = __resumeTool;
    function __resumeTool() {
        return _tool.resumeTool();
    }

    // mtc: mouse tool cursor enum
    _self.setCursor = __setCursor;
    function __setCursor(mtc) {
        var pfx = _rp === '' ? '?atalacsr=' : _rp;
        _cursor = mtc === '%2' ? _cursor = _custom : mtc.replace('%1', pfx);
        _vp.css({ 'cursor': _cursor });
    }

    _self.setCustomCursor = __setCustomCursor;
    function __setCustomCursor(s) {
        _custom = s;
    }

    // #region tool events

    function __onFit(e) {
        _wdv.fit(e.fit);
    }

    function __onClickZoom(e) {
        if (e.zoomout) {
            // Zoom in or out
            _wdv.zoomOut();
        } else {
            _wdv.zoomIn();
        }
    }

    function __onPanStart(e) {
        _scroller // keep track of click origin
        .data('ox', _scroller.scrollLeft() + e.x).data('oy', _scroller.scrollTop() + e.y);

        _scroller.stop();
    }

    function __onPanMove(e) {
        // scroll to the new position
        _scroller.scrollLeft(_scroller.data('ox') - e.x);
        _scroller.scrollTop(_scroller.data('oy') - e.y);

        if (_config.allowflick) {
            _flickPoints.push({ x: e.x, y: e.y, time: new Date().getTime() });

            // only keep 10 points, and let the oldest one fall off
            if (_flickPoints.length > 10) {
                _flickPoints.shift();
            }
        }
    }

    function __onPanEnd(e) {
        if (_config.allowflick) {
            if (_flickPoints.length > 1) {
                var now = new Date().getTime();
                var last = _flickPoints.pop();

                if (now - last.time < 100) {
                    var first = _flickPoints.shift();
                    var dt = -first.time + last.time;

                    _scroller.animate({
                        'scrollLeft': _scroller.scrollLeft() + Math.round((first.x - last.x) / dt * 250),
                        'scrollTop': _scroller.scrollTop() + Math.round((first.y - last.y) / dt * 250)
                    }, _scd, 'easeOutQuad');
                }
            }

            // we're done, keeping points around is bad
            _flickPoints.length = 0;
        }
    }

    function __onSelectStart(e) {
        _activePage = _wdvInternals.getActivePage();

        if (_activePage) {
            _activePage._rubberband.startSelect(e);
        }
    }

    function __onSelectMove(e) {
        _activePage = _wdvInternals.getActivePage();

        if (_activePage) {
            _activePage._rubberband.moveSelect(e);
        }
    }

    function __onSelectEnd(e) {
        _activePage = _wdvInternals.getActivePage();

        if (_activePage) {
            _activePage._rubberband.endSelect(e);

            if (e.type === 'zoomareaend') {
                _activePage._rubberband.hide();
                _activePage._rubberband.zoomToSelection();
            }
        }

        _uses--;
        if (_uses === 0) {
            _uses = -1;

            _wdvInternals.resetDrawLayer();
            __setTool(_primaryToolBackup, _secondaryToolBackup);
        }
    }

    function __onZoomStart(e) {
        _wdvInternals.zoomStart();
        _zoom = _wdv.getZoom();
    }

    function __onZoomMove(e) {
        var z = _zoom * e.scale;
        _wdvInternals.zoom(z);
    }

    function __onZoomEnd(e) {
        _wdvInternals.zoomEnd();
    }

    function __onTextSelectStart(e) {
        var args = __getMouseTextEventArgs(e);
        if (args) {
            args.cursor = _cursor;
            args.complete = false;

            args.rectangular = e.toolEvent ? e.toolEvent.altKey : false;
            args.interval = e.toolEvent ? e.toolEvent.shiftKey : false;
            if (!args.rectangular && !args.interval) {
                var clicks = e.toolEvent && e.toolEvent.originalEvent && e.toolEvent.originalEvent.detail ? e.toolEvent.originalEvent.detail % 3 : 1;
                if (clicks !== 1) {
                    args.word = clicks === 2;
                    args.line = clicks === 0;
                }
            }

            __triggerEvent({
                type: _events.textselectstart,
                eventData: args
            });

            e.eventData.handled = args.handled;
            if (args.complete && args.handled) {
                __onTextSelectEnd(e);
                e.eventData.complete = true;
            }
        }
    }

    function __onTextSelectMove(e) {
        __clearScrollTimeout();
        var args = __getMouseTextEventArgs(e);
        if (args) {
            args.cursor = _cursor;
            args.selecting = e.eventData.selecting;
            __triggerEvent({
                type: _events.textselectmove,
                eventData: args
            });

            e.eventData.handled = args.handled;
            var cursor = args.handled && args.cursor ? args.cursor : _toolCursors.Arrow;
            if (cursor !== _cursor) {
                __setCursor(cursor);
            }

            if (e.eventData.handled && e.eventData.selecting && e.toolEvent && e.toolEvent.target) {
                __onSelectionScrollTimeout(e);
            }
        }
    }

    function __onTextSelectEnd(e) {
        __clearScrollTimeout();

        var args = __getMouseTextEventArgs(e);

        if (args) {
            __triggerEvent({
                type: _events.textselectend,
                eventData: args
            });

            e.eventData.handled = args.handled;
        }
    }

    function __onTextSelectScroll(e) {
        __clearScrollTimeout();
        __onSelectionScrollTimeout(e);
    }

    function __onTextSelectCopy(e) {
        if (_config.text.hookcopy) {
            __triggerEvent({
                type: _events.textselectcopy
            });
        }
    }

    // #endregion

    // #region helper methods

    function __clearScrollTimeout() {
        if (_scrollTimeout) {
            clearTimeout(_scrollTimeout);
            _scrollTimeout = null;
        }
    }

    function __onSelectionScrollTimeout(e) {
        __clearScrollTimeout();
        if (e && e.toolEvent) {
            var viewportOffset = container.offset();
            var positionContainer = null;
            if (e.toolEvent.pageX !== undefined && e.toolEvent.pageY !== undefined) {
                positionContainer = e.toolEvent;
            } else if (e.toolEvent.originalEvent && e.toolEvent.originalEvent.touches && e.toolEvent.originalEvent.touches.length === 1) {
                if (e.toolEvent.originalEvent.touches[0].pageX !== undefined && e.toolEvent.originalEvent.touches[0].pageY !== undefined) {
                    positionContainer = e.toolEvent.originalEvent.touches[0];
                }
            }

            if (positionContainer) {
                var pos = {
                    x: positionContainer.pageX - viewportOffset.left,
                    y: positionContainer.pageY - viewportOffset.top
                };

                var viewportWidth = container.width(),
                    viewortHeight = container.height(),
                    topDelta = 0,
                    leftDelta = 0;

                if (pos.y < viewortHeight * _config.text.scrolltriggerarea && _scroller.scrollTop() > 0) {
                    topDelta = pos.y > 0 ? -_config.text.innerscrolldelta : -_config.text.outerscrolldelta;
                } else if (pos.y > viewortHeight * (1 - _config.text.scrolltriggerarea)) {
                    topDelta = pos.y < viewortHeight ? _config.text.innerscrolldelta : _config.text.outerscrolldelta;
                } else if (pos.x < viewportWidth * _config.text.scrolltriggerarea && _scroller.scrollLeft() > 0) {
                    leftDelta = pos.x > 0 ? -_config.text.innerscrolldelta : -_config.text.outerscrolldelta;
                } else if (pos.x > viewportWidth * (1 - _config.text.scrolltriggerarea)) {
                    leftDelta = pos.x < viewportWidth ? _config.text.innerscrolldelta : _config.text.outerscrolldelta;
                }

                if ((topDelta || leftDelta) && _config.text.scrolltriggerarea !== Atalasoft.Utils.ScrollArea.None) {
                    _scroller.scrollTop(_scroller.scrollTop() + topDelta);
                    _scroller.scrollLeft(_scroller.scrollLeft() + leftDelta);
                    _scrollTimeout = setTimeout(__onSelectionScrollTimeout, SelectSrollTimeout, e);
                }
            }
        }
    }

    function __getMouseEventPageIndex(el) {
        var pageDiv = $(el).parents('.' + _wdv.domclasses.atala_page_div).first();
        if (pageDiv) {
            var idx = pageDiv.attr(_wdv.domattributes.atala_page_index);
            return parseInt(idx, 10);
        }
        return null;
    }

    function __getMousePosition(e, page) {
        var p = Atalasoft.Utils.getMousePositionJquery(e.toolEvent ? e.toolEvent : e);

        if (page && page._paper) {
            var offset = Atalasoft.Utils.getSVGOffset(page._paper.canvas, page);

            p.x -= offset.left;
            p.y -= offset.top;
        }

        return p;
    }

    function __getDocumentPoint(p, pageIndex) {
        var textRotation = 0;
        if (_wdvInternals._controllers.text) {
            var pageData = _wdvInternals._controllers.document.getPageText(pageIndex);
            if (pageData && isFinite(pageData.rotation)) {
                textRotation = pageData.rotation;
            }
        }

        var matrix = _wdvInternals.getViewerTransform(pageIndex, textRotation).invert();
        return {
            x: matrix.x(p.x, p.y),
            y: matrix.y(p.x, p.y)
        };
    }

    function __pushToolBackup(newPrimaryTool, newSecondatyTool) {
        var isTextToolTurnoff = (_primaryToolBackup === _toolTypes.Text || _secondaryToolBackup === _toolTypes.Text) && newPrimaryTool !== _toolTypes.Text && newSecondatyTool !== _toolTypes.Text;

        if (isTextToolTurnoff) {
            _wdvInternals.resetDrawLayer();
        }

        if (newPrimaryTool !== _toolTypes.Selection && newPrimaryTool !== _toolTypes.ZoomArea) {
            _primaryToolBackup = newPrimaryTool;
        }

        if (newSecondatyTool !== _toolTypes.Selection && newSecondatyTool !== _toolTypes.ZoomArea) {
            _secondaryToolBackup = newSecondatyTool;
        }
    }

    function __getMouseTextEventArgs(e) {
        var args = {
            cursor: null,
            handled: false
        };

        if (e && e.toolEvent) {
            var isTouchInput = e.toolEvent.originalEvent.touches && e.toolEvent.originalEvent.touches.length === 1;
            var target = isTouchInput ? document.elementFromPoint(e.toolEvent.originalEvent.touches[0].clientX, e.toolEvent.originalEvent.touches[0].clientY) : e.toolEvent.target;
            var page = __getMouseEventPageIndex(target);
            if (isFinite(page) && page >= 0) {
                var viewerPoint = __getMousePosition(e);
                var pos = __getDocumentPoint(viewerPoint, page);

                Atalasoft.$.extend(args, {
                    page: page,
                    point: pos,
                    viewerPoint: viewerPoint
                });
            }
        }

        return args;
    }

    // #endregion
};
'use strict';

//
//  PointerTool Class
//
//  This source code is property of Atalasoft, Inc. (http://www.atalasoft.com/)
//  Permission for usage and modification of this code is only permitted 
//  with the purchase of a source code license.
//
//  Change History:
//	08-31-12	D. Cilley		File Created.
//	09-11-12	D. Cilley		FB 13589: Improved architecture to allow for easier editing.
//	11-16-12	D. Cilley		FB 13793: Imported the pinch code from annotations, enabled pinch zoom.
//	11-26-12	D. Cilley		FB 13673: Fixed viewer scroll after annotation delete in iOS mobile.
//	02-21-13	D. Cilley		FB 14065: Added JSHint options and fixes to comply with JSHint warnings.
//	03-01-13	D. Cilley		FB 14066: TextAnnotations now use HTML rendering for all browsers.
//	01-28-14	D. Cilley		Bug 308677: Changed the buffer time from 10ms to 40ms to fix pinch slowness in iOS7.
//	12-17-14	D. Cilley		Bug 550581: Added locally scoped non-conflict jQuery.
//	02-12-15	D. Cilley		Bug 579500: Combined MouseTool and TouchTool for multi-input devices.
//	12-04-15	D. Cilley		Bug 670919, 670924, 670938: Fixed several ZoomArea bugs.
//-------------------------------------------------------------------------------------------------

// JSHint options and globals
/*jshint eqnull: true, undef: true, jquery: true, browser: true, es3:false */

// Atalasoft global constructors and functions
/*global Atalasoft */

// Local globals

Atalasoft.Controls.PointerTool = function () {
    var $ = Atalasoft.$;
    var _self = this;

    var _jqe = $({}); // jquery instance to bind tool events to
    var _pointer = { // Pointer data
        tapped: false, // double tap detected
        touching: false, // still touching
        pinching: false, // pinching
        zooming: false, // zooming
        textselection: false, // text selection performed
        origin: { x: 0, y: 0 }, // origin position of touch
        point: { x: 0, y: 0 }, // touch point
        delta: { x: 0, y: 0 }, // scroll delta
        drawing: false, // annotation drawing
        moves: 0, // number of moves between start and end
        prpt: 0 // pause / resume pointertool
    };

    var _pinch = null; // pinch data
    var _tools = Atalasoft.Utils.MouseToolType;
    var _priTool = _tools.None;
    var _secTool = _tools.None;
    var _boundTarget = null;

    // #region Lifecycle

    __init();
    function __init() {
        // clear dom events
        __resetMouseEvents();

        // Dom event binds, to be bound by the controller
        _self.events = {
            viewport: {
                click: __onClick,
                dblclick: __onDblClick,
                mousedown: __onMouseDown,
                mousemove: __onMouseMove,
                mouseout: __onMouseOut,
                mouseover: __onMouseOver,
                mouseup: __onMouseUp,
                contextmenu: __onContextMenu,
                mousewheel: __onMouseWheel,
                keydown: __onKeyDown
            }
        };

        if (Atalasoft.Utils.Browser.Features.Touch) {
            // Touch event binds, to be bound by the controller
            $.extend(true, _self.events, {
                viewport: {
                    touchstart: __onTouchStart,
                    touchmove: __onTouchMove,
                    touchend: __onTouchEnd
                },
                wdv: {
                    annotationdrawstart: __onAnnotationDrawStart,
                    annotationdrawend: __onAnnotationDrawEnd,
                    annotationdragstart: __onAnnotationDrawStart,
                    annotationdragend: __onAnnotationDrawEnd
                }
            });
        }
    }

    _self.dispose = __dispose;
    function __dispose() {
        if (_pointer) {
            _pointer = null;
        }

        if (_pinch) {
            _pinch = null;
        }

        _self = null;
    }

    // #endregion

    // #region Public functions

    _self.bind = __bindEvents;
    function __bindEvents() {
        _jqe.bind.apply(_jqe, arguments);

        return _self;
    }

    _self.unbind = __unbindEvents;
    function __unbindEvents() {
        _jqe.unbind.apply(_jqe, arguments);

        return _self;
    }

    _self.trigger = __triggerEvent;
    function __triggerEvent() {
        _jqe.trigger.apply(_jqe, arguments);

        return _self;
    }

    _self.setTool = __setTool;
    function __setTool(tPri, tSec) {
        _priTool = tPri;
        _secTool = tSec;

        __resetMouseEvents();

        // Left Mouse Button
        switch (_priTool) {
            case _tools.None:
                __onClickEvent = Atalasoft.Utils.__rf;
                break;

            case _tools.Pan:
                __onMouseDownLeft = __startPan;
                break;

            case _tools.ZoomIn:
                __onClickEvent = __clickZoomIn;
                break;

            case _tools.ZoomOut:
                __onClickEvent = __clickZoomOut;
                break;

            case _tools.Selection:
                __onMouseDownLeft = __startSelect;
                break;

            case _tools.ZoomArea:
                __onMouseDownLeft = __startSelect;
                break;

            case _tools.PassThrough:
                break;

            case _tools.Text:
                __onMouseDownLeft = __startTextSelection;
                __onMouseMoveEvent = __moveTextSelection;
                __onKeyDownEvent = __copyTextSelection;
                break;
        }

        // Right Mouse Button		
        switch (_secTool) {
            case _tools.None:
                break;

            case _tools.Pan:
                __onMouseDownRight = __startPan;
                break;

            case _tools.ZoomIn:
                __onContextMenuEvent = __clickZoomIn;
                break;

            case _tools.ZoomOut:
                __onContextMenuEvent = __clickZoomOut;
                break;

            case _tools.Selection:
                __onMouseDownRight = __startSelect;
                break;

            case _tools.ZoomArea:
                __onMouseDownRight = __startSelect;
                break;

            case _tools.PassThrough:
                break;
        }
    }

    _self.getTool = __getTool;
    function __getTool() {
        return { primary: _priTool, secondary: _secTool };
    }

    // tells the viewer to pause mousetool handling
    _self.pauseTool = __pauseTool;
    function __pauseTool() {
        _pointer.prpt++;
    }

    // tells the viewer to resume mousetool handling
    _self.resumeTool = __resumeTool;
    function __resumeTool() {
        if (_pointer.prpt > 0) {
            _pointer.prpt--;
        }
    }

    // #endregion

    // #region Annotation Tool

    function __onAnnotationDrawStart(e) {
        if (_pointer) {
            _pointer.drawing = true;
        }
    }

    function __onAnnotationDrawEnd(e) {
        if (_pointer) {
            _pointer.drawing = false;
        }
    }

    // #endregion

    // #region Pinch Tool

    function __onPinchStart(e) {
        if (_pointer.prpt) {
            return;
        }

        e.stopPropagation();
        _pointer.pinching = true;

        var t1 = e.originalEvent.touches[0];
        var t2 = e.originalEvent.touches[1];

        _pinch = {
            start: Atalasoft.Utils.CalcDistance(t1.clientX, t1.clientY, t2.clientX, t2.clientY)
        };

        __triggerEvent({
            type: 'zoomstart',
            touches: e.originalEvent.touches
        });
    }

    function __onPinchMove(e) {
        if (_pointer.prpt) {
            return;
        }

        e.stopPropagation();

        // this event gets called repeatedly while pinching, and we slow it down with __onPinchBuffer
        if (!_pointer.zooming) {
            _pointer.zooming = true;

            var t1 = e.originalEvent.touches[0];
            var t2 = e.originalEvent.touches[1];

            var dist = Atalasoft.Utils.CalcDistance(t1.clientX, t1.clientY, t2.clientX, t2.clientY, _pinch.start);

            var deltaScaleX = dist.x / _pinch.start.x;
            var deltaScaleY = dist.y / _pinch.start.y;

            setTimeout(__onPinchBuffer, 40);

            __triggerEvent({
                type: 'zoommove',
                touches: e.originalEvent.touches,
                scale: deltaScaleX,
                scalex: deltaScaleX,
                scaley: deltaScaleY,
                dx: dist.dx,
                dy: dist.dy
            });
        }
    }

    function __onPinchBuffer() {
        _pointer.zooming = false;
    }

    function __onPinchEnd(e) {
        if (_pointer.prpt) {
            return;
        }

        e.stopPropagation();

        _pointer.pinching = false;

        __triggerEvent({
            type: 'zoomend',
            touches: e.originalEvent.touches
        });

        // still touching with one finger, need to start a new touch
        if (e.originalEvent.touches.length === 1) {
            __onTouchStart(e);
        }
    }

    // #endregion

    // #region Pan Tool

    function __startPan(e) {
        if (_pointer.prmt) {
            return;
        }

        __triggerEvent({
            type: 'panstart',
            x: e.clientX,
            y: e.clientY
        });

        $(document).bind({
            mousemove: __movePan,
            mouseup: __stopPan,
            ondrag: Atalasoft.Utils.__rf
        });

        return false;
    }

    function __movePan(e) {
        e = e == null ? event : e;
        if (_pointer.prpt) {
            return;
        }

        // this is in case someone mouses up after mousing out		
        if (e.which === 0) {
            __stopPan();
            return;
        }

        __triggerEvent({
            type: 'panmove',
            x: e.clientX,
            y: e.clientY
        });

        return false;
    }

    function __stopPan() {
        if (_pointer.prpt) {
            return;
        }

        $(document).unbind({
            mousemove: __movePan,
            mouseup: __stopPan,
            ondrag: Atalasoft.Utils.__rf
        });

        __triggerEvent({
            type: 'panend'
        });

        return false;
    }

    // #endregion

    // #region text selection
    function __startTextSelection(e) {
        if (_pointer.prmt) {
            return false;
        }

        e.stopPropagation();

        // placeholder for "alternative action". for example to fallback to Pan tool if mouse is not above text.
        var args = { handled: false, complete: false };
        __triggerEvent({
            type: 'textselectstart',
            toolEvent: e,
            eventData: args
        });

        if (!args.complete) {
            _pointer.textselection = true;

            $(document).bind({
                mouseup: __stopTextSelection,
                mousemove: __onDocMouseMove,
                ondrag: Atalasoft.Utils.__rf
            });
        }

        return false;
    }

    function __moveTextSelection(e) {
        if (_pointer.prmt) {
            return true;
        }

        // this is in case someone mouses up after mousing out		
        if (e.which === 0 && !(e.originalEvent.touches && e.originalEvent.touches.length)) {
            __stopTextSelection();
            return true;
        }

        var args = {
            handled: false,
            selecting: _pointer.textselection
        };

        __triggerEvent({
            type: 'textselectmove',
            toolEvent: e,
            eventData: args
        });

        return false;
    }

    function __stopTextSelection(e) {
        if (_pointer.prmt || !_pointer.textselection) {
            return false;
        }

        _pointer.textselection = false;
        $(document).unbind({
            mouseup: __stopTextSelection,
            mousemove: __onDocMouseMove,
            ondrag: Atalasoft.Utils.__rf
        });

        var args = { handled: false };
        __triggerEvent({
            type: 'textselectend',
            toolEvent: e,
            eventData: args
        });

        return false;
    }

    function __onDocMouseMove(e) {
        if (_pointer.textselection) {

            if (_pointer.prmt) {
                return true;
            }

            // this is in case someone mouses up after mousing out		
            if (e.which === 0 && !(e.originalEvent.touches && e.originalEvent.touches.length)) {
                __stopTextSelection();
                return true;
            }

            __triggerEvent({
                type: 'textselectscroll',
                toolEvent: e
            });

            return false;
        }
    }

    function __copyTextSelection(e) {
        if (e.keyCode === 67 && e.ctrlKey) {
            // ctrl + c
            __triggerEvent({
                type: 'textselectcopy',
                toolEvent: e
            });
        }
    }

    // #endregion

    // #region Select tool

    function __startSelect(e) {
        if (_pointer.prmt) {
            return true;
        }

        __triggerEvent({
            type: _priTool === _tools.Selection ? 'selectstart' : 'zoomareastart',
            x: e.clientX,
            y: e.clientY,
            toolEvent: e
        });

        _boundTarget = $(e.target);
        _boundTarget._binds = {
            mousemove: __moveSelect,
            mouseup: __stopSelect,
            ondrag: Atalasoft.Utils.__rf
        };

        _boundTarget.bind(_boundTarget._binds);

        return false;
    }

    function __moveSelect(e) {
        e = e == null ? event : e;
        if (_pointer.prpt) {
            return true;
        }

        // this is in case someone mouses up after mousing out		
        if (e.which === 0) {
            __stopSelect();
            return;
        }

        __triggerEvent({
            type: _priTool === _tools.Selection ? 'selectmove' : 'zoomareamove',
            x: e.clientX,
            y: e.clientY,
            toolEvent: e
        });

        return false;
    }

    function __stopSelect(e) {
        if (_pointer.prpt) {
            return;
        }

        _boundTarget.unbind(_boundTarget._binds);
        _boundTarget = null;

        __triggerEvent({
            type: _priTool === _tools.Selection ? 'selectend' : 'zoomareaend',
            toolEvent: e
        });

        return false;
    }

    // #endregion

    // #region Main Tool

    function __toolStart(e) {
        if (_priTool === _tools.Pan) {
            e.type = 'panstart';
            __triggerEvent(e);
        }
    }

    function __toolMove(e) {
        if (_priTool === _tools.Pan) {
            e.type = 'panmove';
            __triggerEvent(e);
        }
    }

    function __toolEnd(e) {
        if (_priTool === _tools.Pan) {
            e.type = 'panend';
            __triggerEvent(e);
        }
    }

    function __toolHold(e) {
        e.type = 'contextmenu';
        __triggerEvent(e);
    }

    function __toolDoubleTap(e) {
        e.type = 'fit';
        __triggerEvent(e);
    }

    // #endregion

    // #region Mouse Events

    function __onClick(e) {
        e = e == null ? event : e;
        return __onClickEvent(e);
    }

    function __onDblClick(e) {
        e = e == null ? event : e;
        return; // double click isn't used by tools
    }

    function __onContextMenu(e) {
        e = e == null ? event : e;
        return __onContextMenuEvent(e);
    }

    function __onMouseDown(e) {
        e = e == null ? event : e;

        if (e.button === 2) {
            __onMouseDownRight(e);
        } else {
            __onMouseDownLeft(e);
        }

        return __onMouseDownEvent(e);
    }

    function __onMouseMove(e) {
        e = e == null ? event : e;
        return __onMouseMoveEvent(e);
    }

    function __onKeyDown(e) {
        e = e == null ? event : e;
        return __onKeyDownEvent(e);
    }

    function __resetMouseEvents() {
        __onClickEvent = _priTool === _tools.PassThrough ? Atalasoft.Utils.__ef : Atalasoft.Utils.__rf;
        __onContextMenuEvent = _secTool === _tools.PassThrough ? Atalasoft.Utils.__ef : Atalasoft.Utils.__rf;

        __onMouseDownEvent = Atalasoft.Utils.__ef;
        __onMouseDownLeft = Atalasoft.Utils.__ef;
        __onMouseDownRight = Atalasoft.Utils.__ef;
        __onMouseMoveEvent = Atalasoft.Utils.__ef;
        __onKeyDownEvent = Atalasoft.Utils.__ef;
    }

    function __onMouseOut() {}
    function __onMouseOver() {}
    function __onMouseUp() {}
    function __onMouseWheel() {}

    // internal event handlers for future use
    function __onMouseMoveEvent() {}
    function __onClickEvent() {}
    function __onContextMenuEvent() {}
    function __onMouseDownEvent() {}
    function __onMouseDownLeft() {}
    function __onMouseDownRight() {}
    function __onKeyDownEvent() {}

    function __clickZoomIn(e) {
        if (_pointer.prpt) {
            return;
        }

        __clickZoom(e, false);
        return false;
    }

    function __clickZoomOut(e) {
        if (_pointer.prpt) {
            return;
        }

        __clickZoom(e, true);
        return false;
    }

    function __clickZoom(e, zoomOut) {
        if (_pointer.prpt) {
            return;
        }

        __triggerEvent({
            type: 'clickzoom',
            x: e.clientX,
            y: e.clientY,
            zoomout: zoomOut
        });

        return false;
    }

    // #endregion

    // #region Touch Events

    function __onTouchStart(e) {
        if (_pointer.prpt || _pointer.drawing || _pointer.pinching || $(e.target).is(".ui-menu,.ui-menu-item,.ui-corner-all")) {
            return;
        }

        e.preventDefault();
        _pointer.e = e;

        if (e.originalEvent.touches.length === 2 && __touchingSameObject(e.originalEvent.touches)) {
            // need to clear the hold because the first touch started it
            __clearHold();

            // no touching!
            _pointer.touching = false;

            // time to pinch
            __onPinchStart(e);
        } else if (_priTool === _tools.Text) {
            __startTextSelection(e);
        } else if (e.originalEvent.touches.length === 1) {
            _pointer.touching = true;

            _pointer.point.x = e.originalEvent.touches[0].pageX;
            _pointer.point.y = e.originalEvent.touches[0].pageY;

            _pointer.hold = setTimeout(__detectHold, 1500);

            __toolStart({
                x: _pointer.point.x,
                y: _pointer.point.y
            });
        }
    }

    function __onTouchMove(e) {
        if (_pointer.prpt || _pointer.drawing) {
            return;
        }

        e.preventDefault();
        _pointer.e = e;

        if (_pointer.pinching) {
            __onPinchMove(e);
        } else if (_pointer.touching) {
            var tPoint = e.originalEvent.touches[0];

            _pointer.moves++;
            _pointer.touching = true;

            __toolMove({
                x: tPoint.pageX,
                y: tPoint.pageY
            });
        } else if (_pointer.textselection) {
            __moveTextSelection(e);
        }
    }

    function __onTouchEnd(e) {
        if (_pointer.prpt || _pointer.drawing) {
            return;
        }

        e.preventDefault();

        if (_pointer.pinching) {
            __onPinchEnd(e);
        } else if (_pointer.textselection) {
            __stopTextSelection(e);
        } else {
            _pointer.touching = false;

            // stop holding
            __clearHold();

            // reset moves
            if (_pointer.moves > 0) {
                _pointer.moves = 0;

                __toolEnd({});
            } else {
                // check if we've tapped once before
                if (_pointer.tapped) {
                    __onDoubleTap(e);
                } else {
                    // tapped the first time
                    _pointer.tapped = true;

                    // time between taps detected as a double tap
                    setTimeout(__detectDoubleTap, 300);
                }
            }
        }
    }

    // #endregion

    // #region Tap and Hold

    function __detectDoubleTap() {
        // reset double tap
        _pointer.tapped = false;
    }

    function __onDoubleTap(e) {
        __toolDoubleTap(e);
    }

    function __detectHold() {
        if (_pointer.moves > 0 && _pointer.e != null) {
            var p = Atalasoft.Utils.getMousePositionJquery(_pointer.e);

            if (Math.abs(_pointer.point.x - p.x) < 5 && Math.abs(_pointer.point.y - p.y) < 5) {
                // accidental drag
                _pointer.moves = 0;
            }
        }

        if (_pointer.moves === 0 && _pointer.touching) {
            __toolHold({
                x: _pointer.point.x,
                y: _pointer.point.y
            });
        }
    }

    function __clearHold() {
        if (_pointer.hold != null) {
            clearTimeout(_pointer.hold);
            _pointer.hold = null;
        }
    }

    // #endregion

    // #region Helper Functions

    // returns true if the touches have the same target (unless it's null)
    function __touchingSameObject(touches) {
        var target = null;

        for (var i = 0; i < touches.length; i++) {
            var obj = touches[i].target;

            if (obj) {
                if (target == null) {
                    target = obj;
                } else if (target !== obj) {
                    return false;
                }
            }
        }

        return true;
    }

    // #endregion

    return _self;
};
'use strict';

//
//  RubberBand Selection Tool for WDV
//
//  This source code is property of Atalasoft, Inc. (http://www.atalasoft.com/)
//  Permission for usage and modification of this code is only permitted 
//  with the purchase of a source code license.
//
//  Change History:
//	10-19-15	D. Cilley		File Created.
//	12-04-15	D. Cilley		Bug 670919, 670924, 670938: Fixed several ZoomArea bugs.
//	12-20-15	D. Cilley		Bug 670911: Fixed rubberband conflicts with forcepagefit config option.
//-------------------------------------------------------------------------------------------------

// JSHint options and globals
/*jshint eqnull: true, undef: true, jquery: true, browser: true, es3:false */

// Atalasoft global constructors and functions
/*global Atalasoft */

// Local globals

// Controls the zoom level of each page depending on the configuration
// wdv: parent WebDocumentViewer object
// settings: config object for additional settings
Atalasoft.Controls.RubberBandTool = function (wdv, settings, parent, internals) {
    var $ = Atalasoft.$;
    var RubberBandZindex = 3;
    var _self = this;
    var _jqe = $({}); // jquery instance to bind tool events to
    var _wdv = wdv;

    var _data = { // data object for rubberband properties
        animated: false,
        aspectratio: 0,
        backcolor: 'fff',
        forecolor: '000',
        movable: true,
        multicolor: true,
        resizable: true,
        showgrips: false,
        showmask: false,
        showtooltip: false,
        visible: false,
        x: 0,
        y: 0,
        width: 0,
        height: 0
    };

    var _dom = {
        /** Main RubberBand dom object */
        rect: null,
        /** Dom object underneath Main RubberBand */
        rectback: null,
        /** Mask objects */
        mask: {
            top: null,
            bottom: null,
            left: null,
            right: null
        }
    };

    var _state = {
        animating: false,
        boundevents: null,
        changing: false,
        colorswap: 0,
        origin: {
            x: 0,
            y: 0
        },

        pagesize: {
            width: 0,
            height: 0
        },

        pageoffset: {
            x: 0,
            y: 0
        },

        vert: false,
        horiz: false,
        zoom: 1
    };

    var _wdvInternals = internals;
    var _grips; // Grips object
    var _toolTip; // Tooltip
    var _clipper = parent;

    // #region Lifecycle

    function __init() {
        if (settings) {
            $.extend(true, _data, settings);
        }

        _dom.rect = __createBand();
        _dom.rectback = __createBand();

        _dom.mask.top = __createMask();
        _dom.mask.bottom = __createMask();
        _dom.mask.left = __createMask();
        _dom.mask.right = __createMask();

        _toolTip = __createDOM('div');
        _toolTip.addClass(_wdv.domclasses.atala_tool_selection_tooltip);
        _toolTip.hide();
        _toolTip.css({
            fontFamily: 'Arial, helvetica, san-serif',
            fontSize: '8pt',
            padding: '1px',
            backgroundColor: '#FFFFE1',
            border: '1px solid #000000',
            position: 'absolute',
            zIndex: 999
        });

        _clipper.append(_dom.rectback);
        _clipper.append(_dom.rect);
        _clipper.append(_toolTip);
        _clipper.append(_dom.mask.top);
        _clipper.append(_dom.mask.bottom);
        _clipper.append(_dom.mask.left);
        _clipper.append(_dom.mask.right);

        _grips = new __Grips();

        __refreshStyle();

        if (_data.visible) {
            __show();
        } else {
            __hide();
        }

        _clipper.bind({
            pageresize: __onPageSizeChanged,
            pagezoom: __onPageZoomChanged
        });
    }

    _self.dispose = __dispose;
    function __dispose() {
        if (_grips != null) {
            _grips.dispose();
            _grips = null;
        }

        _self = null;

        _dom.rect = null;
        _dom.rectback = null;

        _toolTip = null;

        _dom.mask.top = null;
        _dom.mask.bottom = null;
        _dom.mask.left = null;
        _dom.mask.right = null;
    }

    // #endregion

    // #region Events

    function __onPageSizeChanged(e) {
        __updateState();
        __updateRectangle();
    }

    function __onPageZoomChanged(e) {
        __updateState();
        __updateRectangle();
    }

    // #endregion

    // #region Grips

    function __Grips() {
        var _c = new Array('move', 'nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se');
        var _g = [];
        var _v = false;
        var _gva = []; // array used to indicate grip visibility before the show()
        var _gsw = 0;
        var _gsh = 0;

        for (var i = 0; i < 9; i++) {
            _g[i] = new __Grip(i);
            _clipper.append(_g[i].grip);
        }

        this.dispose = __Gdispose;
        this.setRectangle = __GsetRect;
        this.resetColors = __GresetColors;
        this.resetGrips = __GresetGrips;
        this.hide = __Ghide;
        this.show = __Gshow;
        this.showGrips = __GshowGrips;
        this.resetEvents = __GsetEvents;

        function __Gdispose() {
            for (var i = 0; i < 9; i++) {
                _g[i].dispose();
                _g[i] = null;
            }

            _c = null;
            _g = null;
            _v = null;
            _gva = null;
        }

        __GsetEvents();

        // ax, ay, aw, ah = adjusted values
        function __GsetRect(x, y, w, h) {
            _gsw = w;
            _gsh = h;

            _g[0].setPos(x, y);
            _g[1].setPos(x - 4, y - 4); // nw
            _g[3].setPos(x + w - 4, y - 4); // ne
            _g[6].setPos(x - 4, y + h - 4); // sw
            _g[8].setPos(x + w - 4, y + h - 4); // se
            _g[0].setSize(w, h);

            if (_data.showgrips) {
                _g[2].setPos(x + Math.round(w / 2) - 4, y - 4); // n
                _g[4].setPos(x - 4, y + Math.round(h / 2) - 4); // w 
                _g[5].setPos(x + w - 4, y + Math.round(h / 2) - 4); // e
                _g[7].setPos(x + Math.round(w / 2) - 4, y + h - 4); // s
            } else {
                _g[2].setPos(x + 4, y - 4); // n
                _g[4].setPos(x - 4, y + 4); // w 
                _g[5].setPos(x + w - 4, y + 4); // e
                _g[7].setPos(x + 4, y + h - 4); // s
                _g[2].setSize(w - 8, 8);
                _g[4].setSize(8, h - 8);
                _g[5].setSize(8, h - 8);
                _g[7].setSize(w - 8, 8);
            }

            __GshowGrips();
        }

        function __GresetColors() {
            for (var i = 0; i < 9; i++) {
                _g[i].resetColors();
            }
        }

        function __GresetGrips() {
            for (var i = 0; i < 9; i++) {
                _g[i].resetGripSize();
                _g[i].resetColors();
            }
        }

        function __Ghide() {
            for (var i = 0; i < 9; i++) {
                _g[i].hide();
            }
        }

        function __Gshow() {
            for (var i = 0; i < 9; i++) {
                if (_gva[i] === true) {
                    _g[i].show();
                } else {
                    _g[i].hide();
                }
            }
        }

        function __GshowGrips() {
            for (var i = 0; i < 9; i++) {
                _gva[i] = true;
            }

            _gva[0] = true;

            if (_gsw < 8 && _gsh < 8) {
                _gva[1] = false; // nw
            }

            if (_gsw < 12 || _gsh < 12) {
                _gva[3] = false; // ne
                _gva[6] = false; // sw
            }

            if (_gsw < 16 || _gsh < 8) {
                _gva[2] = false; // n
                _gva[7] = false; // s
            }

            if (_gsh < 16 || _gsw < 8) {
                _gva[4] = false; // w
                _gva[5] = false; // e
            }

            __Gshow();
        }

        // Sets the events for the grips and mover object
        function __GsetEvents() {
            if (__getMovable() === true) {
                _g[0].grip.onmousedown = __move;
                _g[0].grip.style.cursor = 'move';
            } else {
                _g[0].grip.onmousedown = Atalasoft.Utils.__rf; // returns false
                _g[0].grip.style.cursor = 'default';
            }

            for (var i = 1; i < 9; i++) {
                if (__getResizable() === true) {
                    _g[i].bind({
                        mousedown: _g[i].onResize
                    });
                    _g[i].grip.style.cursor = _c[i] + '-resize';
                } else {
                    _g[i].unbind({
                        mousedown: _g[i].onResize
                    });
                    _g[i].grip.style.cursor = 'default';
                }
            }
        }

        // Grip object
        function __Grip(i) {
            var _Gself = this;
            var _gr; // Html object
            var _gs; // Style
            var _di = _c[i]; // Compass direction
            var _gv = false; // Visible
            var _$grip;

            _gr = document.createElement('div');
            _gs = _gr.style;
            _$grip = $(_gr);
            _$grip.addClass(_wdv.domclasses.atala_tool_selection_grip);

            __GsetColors();
            __GsetGripSize();

            _Gself.grip = _gr;
            _Gself.dispose = __GRdispose;
            _Gself.setPos = __GsetPos;
            _Gself.setSize = __GsetSize;
            _Gself.hide = __GhideGrip;
            _Gself.show = __GshowGrip;
            _Gself.resetColors = __GsetColors;
            _Gself.resetGripSize = __GsetGripSize;
            _Gself.onResize = __Gresize;
            _Gself.bind = __GRbind;
            _Gself.unbind = __GRunbind;

            _gs.display = 'block';
            _gs.position = 'absolute';
            _gs.visibility = 'hidden';
            _gs.zIndex = RubberBandZindex;
            _gr.onclick = Atalasoft.Utils.__rf;
            _gr.onselectstart = Atalasoft.Utils.__rf;
            _gr.onselect = Atalasoft.Utils.__rf;
            _gr.oncontextmenu = Atalasoft.Utils.__rf;

            function __GRdispose() {
                _Gself = null;
                _gr = null;
                _gs = null;
                _di = null;
            }

            function __GRbind() {
                _$grip.bind.apply(_$grip, arguments);
                return _$grip;
            }

            function __GRunbind() {
                _$grip.unbind.apply(_$grip, arguments);
                return _$grip;
            }

            // Sets position for this grip
            function __GsetPos(x, y) {
                _gs.left = x + 'px';
                _gs.top = y + 'px';
            }

            // Sets size for this grip
            function __GsetSize(w, h) {
                if (__getShowGrips() === true && _di !== 'move') {
                    w -= 2;
                    h -= 2;
                }

                if (w <= 0) {
                    w = 1;
                }

                if (h <= 0) {
                    h = 1;
                }

                _gs.width = w + 'px';
                _gs.height = h + 'px';
            }

            // Hides this grip
            function __GhideGrip() {
                if (_gv) {
                    _gs.visibility = 'hidden';
                    _gv = false;
                }
            }

            // Shows this grip
            function __GshowGrip() {
                if (!_gv) {
                    _gs.visibility = 'visible';
                    _gv = true;
                }
            }

            // Changes Background Color
            function __GsetColors() {
                if (_di !== 'move') {
                    if (_data.showgrips === true) {
                        if (__getMultiColor() === true) {
                            _gs.backgroundColor = '#' + __getBackColor();
                            _gs.border = '1px solid #' + __getForeColor();
                        } else {
                            _gs.backgroundColor = '#' + __getForeColor();
                            _gs.border = '1px solid #' + __getForeColor();
                        }
                    } else {
                        _gs.backgroundColor = '';
                        _gs.border = '';
                    }
                }
            }

            function __GsetGripSize() {
                if (_data.showgrips === true) {
                    _gs.width = '6px';
                    _gs.height = '6px';
                } else {
                    _gs.width = '8px';
                    _gs.height = '8px';
                }
            }

            function __Gresize(e) {
                return __resize(e, _di);
            }
        }
    }

    // #endregion

    // #region Dom

    // tag: string representing the type of tag
    // p: jQuery parent object to append div to 
    // did: string representing the id of the div
    // ihtml: string representing the inner html
    function __createDOM(tag, p, did, ihtml) {
        var dom = $('<' + tag + '></' + tag + '>');

        if (p && p.append) {
            dom.appendTo(p);
        }

        if (did) {
            dom.attr('id', did);
        }

        if (ihtml) {
            dom.html(ihtml);
        }

        return dom;
    }

    function __createBand() {
        var band = __createDOM('div');

        band.addClass(_wdv.domclasses.atala_tool_selection_band);
        band.css({
            position: 'absolute',
            zIndex: RubberBandZindex
        });

        return band;
    }

    function __createMask() {
        var mask = __createDOM('div');

        mask.addClass(_wdv.domclasses.atala_tool_selection_mask);
        mask.hide();
        mask.css({
            left: '0px',
            top: '0px',
            width: '1px',
            height: '1px',
            position: 'absolute',
            background: '#000',
            opacity: '0.6',
            zIndex: '0'
        });

        return mask;
    }

    // #endregion

    // #region Public Properties

    _self.getAnimated = __getAnimated;
    _self.getAspectRatio = __getAspectRatio;
    _self.getBackColor = __getBackColor;
    _self.getForeColor = __getForeColor;
    _self.getHeight = __getHeight;
    _self.getMovable = __getMovable;
    _self.getMultiColor = __getMultiColor;
    _self.getPosition = __getPosition;
    _self.getRectangle = __getRectangle;
    _self.getResizable = __getResizable;
    _self.getShowGrips = __getShowGrips;
    _self.getShowMask = __getShowMask;
    _self.getShowTooltip = __getShowTooltip;
    _self.getSize = __getSize;
    _self.getVisible = __getVisible;
    _self.getWidth = __getWidth;

    function __getAnimated() {
        return _data.animated;
    }

    function __getAspectRatio() {
        return _data.aspectratio;
    }

    function __getBackColor() {
        return _data.backcolor;
    }

    function __getForeColor() {
        return _data.forecolor;
    }

    function __getHeight() {
        return _data.height;
    }

    function __getMovable() {
        return _data.movable;
    }

    function __getMultiColor() {
        return _data.multicolor;
    }

    function __getPosition() {
        return {
            x: _data.x,
            y: _data.y
        };
    }

    function __getRectangle() {
        return {
            x: _data.x,
            y: _data.y,
            width: _data.width,
            height: _data.height
        };
    }

    function __getResizable() {
        return _data.resizable;
    }

    function __getShowGrips() {
        return _data.showgrips;
    }

    function __getShowMask() {
        return _data.showmask;
    }

    function __getShowTooltip() {
        return _data.showtooltip;
    }

    function __getSize() {
        return {
            width: _data.width,
            height: _data.height
        };
    }

    function __getVisible() {
        return _data.visible;
    }

    function __getWidth() {
        return _data.width;
    }

    /*
        _self.setAnimated = __setAnimated;
        // Boolean value, true or false
        function __setAnimated(b) {
            if (Atalasoft.Utils.CheckBool(b) === true) {
                if (__getAnimated() !==  b) {
                    __setFormValue(_id + '_rsa', b);
                    if(b === true) {
                        _data.animated = true;
                        __animate();
                    }
                    else {
                        _data.animated = false;}
                }
            }
            else {
                __throwError('Selection.setAnimated', 5, b, '');
            }
        }
            
        _self.setAspectRatio = __setAspectRatio;
        function __setAspectRatio(f) {
            if (f >= 0) {
                __setFormValue(_id + '_rsar', f);
            }
        }
        
        _self.setAutoPostBack = __setAutoPostBack;
        function __setAutoPostBack(b) {
            if (Atalasoft.Utils.CheckBool(b) === true) {
                if (__getAutoPostBack() !==  b) {
                    __setFormValue(_id + '_rsp', b);
                    __updateEvents();
                }
            }
            else {
                __throwError('Selection.setAutoPostBack', 5, b, '');
            }
        }
        
        _self.setBackColor = __setBackColor;
        function __setBackColor(s) {
            __setFormValue(_id + '_rsbc', s);
            __refreshStyle();
        }
            
        _self.setShowMask = __setShowMask;
        function __setShowMask(b) {
            if (Atalasoft.Utils.CheckBool(b) === true) {
                if (__getShowMask() !==  b) {
                    __setFormValue(_id + '_rsdm', b);
                    __update();
                }
            }
            else {
                __throwError('Selection.setShowMask', 5, b, '');
            }
        }
            
        _self.setForeColor = __setForeColor;
        function __setForeColor(s) {
            __setFormValue(_id + '_rsfc', s);
            __refreshStyle();
        }
        
        _self.setHeight = __setHeight;
        function __setHeight(i) {
            if (i >= 0) {
                var oh = __getHeight();
        
                if (i > _state.pagesize.height)
                    i = _state.pagesize.height;
                            
                if (i !== oh) {
                    __setFormValue(_id + '_rsh', i);
        
                    if(_state.changing) {
                        try{
                            _self.Changing();
                        }
                        catch(ex) {
                            __throwError(_id + '.getSelection().Changing', -1, '\n' + _self.Changing, ex.message, ex);
                        }
                    }
                    else {
                        try{
                            _self.Changed();
                        }
                        catch(ex) {
                            __throwError(_id + '.getSelection().Changed', -1, '\n' + _self.Changed, ex.message, ex);
                        }
                    
                        if (__getAutoPostBack()) {
                            __doPostBack('RubberBand');
                        }
                    }
                            
                    __update();
                }
            }
            else {
                __throwError('Selection.setHeight', 3, i, 'Valid values are greater than or equal to 0.');
            }
        }
        
        _self.setMovable = __setMovable;
        function __setMovable(b) {
            if (Atalasoft.Utils.CheckBool(b) === true) {
                if (__getMovable() !==  b) {
                    __setFormValue(_id + '_rsm', b);
                    __updateEvents();
                }
            }
            else {
                __throwError('Selection.setMovable', 5, b, '');
            }
        }
            
        _self.setMultiColor = __setMultiColor;
        function __setMultiColor(b) {
            if (Atalasoft.Utils.CheckBool(b) === true) {
                __setFormValue(_id + '_rsmc', b);
                __refreshStyle();
            }
            else {
                __throwError('Selection.setMultiColor', 5, b, '');
            }
        }
    
        _self.setPosition = __setPosition;
        function __setPosition(p) {
            if (p.typeOf === 'atalaPoint') {
                __setPos(p.x, p.y);
            }
            else {
                __throwError('Selection.setPosition', 4, p.typeOf, 'atalaPoint expected.');
            }
        }
    
        function __setPos(x, y) {
            if (x >= 0 && y >= 0) {
                _data.x = Math.round(x * _state.zoom);
                _data.y = Math.round(y * _state.zoom);
    
                __updateRectangle();
            }
        }
    
        _self.setResizable = __setResizable;
        function __setResizable(b) {
            if (Atalasoft.Utils.CheckBool(b) === true) {
                if (__getResizable() !==  b) {
                    __setFormValue(_id + '_rsr', b);
                    __updateEvents();
                }
            }
            else {
                __throwError('Selection.setResizable', 5, b, '');
            }
        }
        
        _self.setSize = __setSize;
        function __setSize(s) {
            if (s.typeOf === 'atalaSize') {
                __setSizeO(s.width, s.height);
            }
            else {
                __throwError('Selection.setSize', 4, s.typeOf, 'atalaSize expected.');
            }
        }			
    
        function __setSize(w, h) {
            if (w >= 0 && h >= 0) {
                var ow = _data.width;
                var oh = _data.height;
    
                if (w > _state.pagesize.width) {
                    w = _state.pagesize.width;
                }
    
                if (h > _state.pagesize.height) {
                    h = _state.pagesize.height;
                }
    
                if (w !== ow || h !== oh) {
                    _data.width = w;
                    _data.height = h;
        
                    __update();
                }
            }
    //		else {
    //			__throwError('Selection.setSize', 3, w + 'x' + h, 'Size must be at least 0x0.');
    //		}
        }
    
        _self.setShowGrips = __setShowGrips;
        function __setShowGrips(b) {
            if (Atalasoft.Utils.CheckBool(b) === true) {
                if (__getShowGrips() !==  b) {
                    __setFormValue(_id + '_rsg', b);
                    _grips.resetGrips();
                    if(b) {
                        _grips.show();}
                    else {
                        _grips.hide();}
                            
                    __update();
                }
            }
            else {
                __throwError('Selection.setShowGrips', 5, b, '');
            }
        }
    
        _self.setShowTooltip = __setShowTooltip;
        function __setShowTooltip(b) {
            if (Atalasoft.Utils.CheckBool(b) === true) {
                if (__getShowTooltip() !==  b) {
                    __setFormValue(_id + '_rst', b);
                }
            }
            else {
                __throwError('Selection.setShowTooltip', 5, b, '');
            }
        }
        
        _self.setVisibility = __setVisibility;
        function __setVisibility(s) {
            if (__getVisibility() !== s) {
                if (s === 'visible') {
                    __setFormValue(_id + '_rsv', true);
                    __update();
                }
                else if (s === 'hidden') {
                    __setFormValue(_id + '_rsv', false);
                    __update();
                }
                else {
                    __throwError('Selection.setVisibility', 3, s, 'Valid values are "hidden" or "visible".');
                }
            }
        }
        
        _self.setWidth = __setWidth;
        function __setWidth(i) {
            if (i >= 0) {
                var ow = __getWidth();
        
                if (i > _state.pagesize.width)
                    i = _state.pagesize.width;
    
                if (i !== ow) {
                    __setFormValue(_id + '_rsw', i);
    
                    if(_state.changing) {
                        try{
                            _self.Changing();
                        }
                        catch(ex) {
                            __throwError(_id + '.getSelection().Changing', -1, '\n' + _self.Changing, ex.message, ex);
                        }
                    }
                    else {
                        try{
                            _self.Changed();
                        }
                        catch(ex) {
                            __throwError(_id + '.getSelection().Changed', -1, '\n' + _self.Changed, ex.message, ex);
                        }
                            
                        if (__getAutoPostBack()) {
                            __doPostBack('RubberBand');
                        }
                    }
                                
                    __update();
                }
            }
            else {
                __throwError('Selection.setWidth', 3, i, 'Valid values are greater than or equal to 0.');
            }
        }
    
        function __updateEvents() {
            _grips.resetEvents();
        }
    
        */

    // #endregion

    // #region Public Methods

    _self.bind = __bindEvents;
    _self.hide = __hide;
    _self.reset = __reset;
    _self.show = __show;
    _self.synchronize = __update;
    _self.trigger = __triggerEvent;
    _self.unbind = __unbindEvents;
    _self.zoomToSelection = __zoomToRectangle;

    function __bindEvents() {
        _jqe.bind.apply(_jqe, arguments);

        return _self;
    }

    function __unbindEvents() {
        _jqe.unbind.apply(_jqe, arguments);

        return _self;
    }

    function __triggerEvent() {
        _jqe.trigger.apply(_jqe, arguments);

        return _self;
    }

    function __reset() {
        __hide();

        _data.x = 0;
        _data.y = 0;
        _data.width = 0;
        _data.height = 0;
    }

    // #endregion

    // #region Private Methods

    _self.startSelect = __startRubberBand;
    _self.moveSelect = __sizeRubberBand;
    _self.endSelect = __finish;

    function __hideMask() {
        _dom.mask.left.hide();
        _dom.mask.right.hide();
        _dom.mask.top.hide();
        _dom.mask.bottom.hide();
    }

    function __showMask(rx, ry, rw, rh) {
        if (!_data.showmask) {
            __hideMask();
            return;
        }

        if (ry > 0) {
            _dom.mask.top.css({
                left: _state.pageoffset.x,
                top: _state.pageoffset.y,
                width: __getScaledPageWidth(),
                height: ry
            });

            _dom.mask.top.show();
        } else {
            _dom.mask.top.hide();
        }

        if (ry + rh < __getScaledPageHeight()) {
            _dom.mask.bottom.css({
                left: _state.pageoffset.x,
                top: _state.pageoffset.y + ry + rh,
                width: __getScaledPageWidth(),
                height: __getScaledPageHeight() - (ry + rh)
            });

            _dom.mask.bottom.show();
        } else {
            _dom.mask.bottom.hide();
        }

        if (rx > 0) {
            _dom.mask.left.css({
                left: _state.pageoffset.x,
                top: _state.pageoffset.y + ry,
                width: rx,
                height: rh
            });

            _dom.mask.left.show();
        } else {
            _dom.mask.left.hide();
        }

        if (rx + rw < __getScaledPageWidth()) {
            _dom.mask.right.css({
                left: _state.pageoffset.x + rx + rw,
                top: _state.pageoffset.y + ry,
                width: __getScaledPageWidth() - (rx + rw),
                height: rh
            });

            _dom.mask.right.show();
        } else {
            _dom.mask.right.hide();
        }
    }

    function __drawTooltip() {
        _toolTip.css({
            left: (_data.x + _data.width) * _state.zoom + 8 + 'px',
            top: (_data.y + _data.height) * _state.zoom + 4 + 'px'
        });

        _toolTip.text(Math.round(_data.width / _state.zoom) + 'x' + Math.round(_data.height / _state.zoom));

        if (_toolTip.is(':hidden')) {
            _toolTip.show();
        }
    }

    function __show() {
        _data.visible = true;
        _dom.rectback.show();
        _dom.rect.show();

        if (__getAnimated() === true && __getMultiColor() === true) {
            __animate();
        }
    }

    function __hide() {
        _data.visible = false;
        __hideMask();
        _grips.hide();

        _dom.rectback.hide();
        _dom.rect.hide();
    }

    function __refreshStyle() {
        var s = _data.multicolor ? 'dashed' : 'solid';

        var bg = '1px solid #' + _data.backcolor;
        var fg = '1px ' + s + ' #' + _data.forecolor;

        _dom.rectback.css('border', bg);
        _dom.rect.css('border', fg);
        _grips.resetColors();
    }

    function __update() {
        __updateRectangle();
    }

    function __updateRectangle() {
        var nx = _data.x;
        var ny = _data.y;
        var iw = _state.pagesize.width;
        var ih = _state.pagesize.height;

        if (nx >= iw || nx + _data.width > iw) {
            nx = iw - _data.width;
            if (nx < 0) {
                nx = 0;
            }
        }

        if (ny >= ih || ny + _data.height > ih) {
            ny = ih - _data.height;
            if (ny < 0) {
                ny = 0;
            }
        }

        if (nx !== _data.x) {
            _data.x = nx;
        }

        if (ny !== _data.y) {
            _data.y = ny;
        }

        var rx = Math.round(_data.x * _state.zoom);
        var ry = Math.round(_data.y * _state.zoom);

        var rw = Math.round(_data.width * _state.zoom);
        var rh = Math.round(_data.height * _state.zoom);

        __setClientPos(rx, ry);
        __setClientSize(rw, rh);
        _grips.setRectangle(rx, ry, rw, rh);

        if (_data.visible) {
            __show();
            __showMask(rx, ry, rw, rh);
        } else {
            __hide();
        }
    }

    function __setClientPos(x, y) {
        _dom.rectback.css({
            left: x + 'px',
            top: y + 'px'
        });

        _dom.rect.css({
            left: x + 'px',
            top: y + 'px'
        });
    }

    function __setClientSize(w, h) {
        if (w === 0) {
            w = 1;
        }

        _dom.rectback.css({
            width: w + 'px',
            height: h + 'px'
        });

        _dom.rect.css({
            width: w + 'px',
            height: h + 'px'
        });
    }

    function __startRubberBand(e) {
        e.stopPropagation();
        e.preventDefault();

        __updateState();
        var p = __getMousePosition(e);

        __show();
        _state.origin.x = p.x;
        _state.origin.y = p.y;

        _data.x = Math.round(p.x / _state.zoom);
        _data.y = Math.round(p.y / _state.zoom);
        _data.width = 1;
        _data.height = 1;

        _state.changing = true;

        _state.vert = 0;
        _state.horiz = 0;

        __updateRectangle();

        if (_data.showtooltip === true) {
            __drawTooltip();
        }

        return false;
    }

    function __sizeRubberBand(e, p) {
        e.stopPropagation();
        e.preventDefault();

        var ep = p ? p : __getMousePosition(e);

        var nx = Math.round(_state.origin.x / _state.zoom);
        var ny = Math.round(_state.origin.y / _state.zoom);
        var nw = Math.abs((ep.x - _state.origin.x) / _state.zoom);
        var nh = Math.abs((ep.y - _state.origin.y) / _state.zoom);

        if (_data.aspectratio > 0) {
            var r = Math.abs((ep.y - _state.origin.y) / (ep.x - _state.origin.x));

            if (r > 1 / _data.aspectratio && _state.horiz === 0 || _state.vert === 1) {
                // base the width off the height
                nw = Math.round(nh * _data.aspectratio);
            } else {
                // base the height off the width
                nh = Math.round(nw / _data.aspectratio);
            }
        }

        if (ep.x < _state.origin.x) {
            nx = nx - nw;
            if (nx - _state.pageoffset.x < 0) {
                nw = _state.origin.x - _state.pageoffset.x;
                if (_data.aspectratio > 0) {
                    nh = Math.round(nw / _data.aspectratio);
                }
                nx = _state.origin.x - nw;
            }
        } else if (nx + nw > _state.pagesize.width + _state.pageoffset.x) {
            nw = _state.pagesize.width - nx + _state.pageoffset.x;
            if (_data.aspectratio > 0) {
                nh = Math.round(nw / _data.aspectratio);
            }
        }

        if (ep.y < _state.origin.y) {
            ny = ny - nh;
            if (ny - _state.pageoffset.y < 0) {
                nh = _state.origin.y - _state.pageoffset.y;
                if (_data.aspectratio > 0) {
                    nw = Math.round(nh * _data.aspectratio);
                }
                ny = _state.origin.y - nh;

                if (ep.x < _state.origin.x) {
                    nx = _state.origin.x - nw;
                }
            }
        } else if (ny + nh > _state.pagesize.height + _state.pageoffset.y) {
            nh = _state.pagesize.height - ny + _state.pageoffset.y;
            if (_data.aspectratio > 0) {
                nw = Math.round(nh * _data.aspectratio);
            }

            if (ep.x < _state.origin.x) {
                nx = _state.origin.x - nw;
            }
        }

        if (_state.vert === 0 || _data.aspectratio > 0) {
            _data.x = nx - _state.pageoffset.x;
            _data.width = nw;
        }

        if (_state.horiz === 0 || _data.aspectratio > 0) {
            _data.y = ny - _state.pageoffset.y;
            _data.height = nh;
        }

        __updateRectangle();

        if (_data.showtooltip === true) {
            __drawTooltip();
        }

        return false;
    }

    function __resizeRubberBand(e) {
        return __sizeRubberBand(e, Atalasoft.Utils.getMousePositionJquery(e, null, true));
    }

    function __resize(e, d) {
        e = e || event;
        __stopPropagation(e);

        _state.vert = 0;
        _state.horiz = 0;

        _state.changing = true;

        var np = { x: 0, y: 0 };
        switch (d) {
            case 'nw':
                np.x = _data.x + _data.width;
                np.y = _data.y + _data.height;
                break;

            case 'n':
                np.x = _data.x;
                np.y = _data.y + _data.height;

                _state.vert = 1;
                break;

            case 'ne':
                np.x = _data.x;
                np.y = _data.y + _data.height;
                break;

            case 'w':
                np.x = _data.x + _data.width;
                np.y = _data.y + _data.height;

                _state.horiz = 1;
                break;

            case 'e':
                np.x = _data.x;
                np.y = _data.y + _data.height;

                _state.horiz = 1;
                break;

            case 'sw':
                np.x = _data.x + _data.width;
                np.y = _data.y;
                break;

            case 's':
                np.x = _data.x;
                np.y = _data.y;

                _state.vert = 1;
                break;

            case 'se':
                np.x = _data.x;
                np.y = _data.y;
                break;
        }

        _state.origin.x = Math.round(np.x * _state.zoom) + _state.pageoffset.x;
        _state.origin.y = Math.round(np.y * _state.zoom) + _state.pageoffset.y;

        _wdvInternals.raiseDrawLayer();

        var resizebinds = {
            mousemove: __resizeRubberBand,
            mouseup: __finish
        };

        if (_state.boundevents !== null) {
            $.extend(_state.boundevents, resizebinds);
        } else {
            _state.boundevents = resizebinds;
        }

        // don't want to rebind already bound events
        _clipper.bind(resizebinds);

        return false;
    }

    function __move(e) {
        e = e || event;
        __stopPropagation(e);
        var p = Atalasoft.Utils.getMousePosition(e, null, _clipper[0]);

        _state.origin.x = p.x - Math.round(_data.x * _state.zoom);
        _state.origin.y = p.y - Math.round(_data.y * _state.zoom);
        _state.changing = true;

        var movebinds = {
            mousemove: __moving,
            mouseup: __finish,
            ondrag: Atalasoft.Utils.__rf
        };

        if (_state.boundevents !== null) {
            $.extend(_state.boundevents, movebinds);
        } else {
            _state.boundevents = movebinds;
        }

        // don't want to rebind already bound events
        _clipper.bind(movebinds);

        return false;
    }

    function __moving(e) {
        e = e || event;
        __stopPropagation(e);
        var mp = Atalasoft.Utils.getMousePosition(e, null, _clipper[0]);
        var np = { x: 0, y: 0 };

        np.x = Math.round((mp.x - _state.origin.x) / _state.zoom);
        np.y = Math.round((mp.y - _state.origin.y) / _state.zoom);

        if (np.x > _state.pagesize.width - _data.width) {
            np.x = _state.pagesize.width - _data.width;
        }
        if (np.x < 0) {
            np.x = 0;
        }

        if (np.y > _state.pagesize.height - _data.height) {
            np.y = _state.pagesize.height - _data.height;
        }
        if (np.y < 0) {
            np.y = 0;
        }

        _data.x = np.x;
        _data.y = np.y;
        __updateRectangle();

        return false;
    }

    function __finish(e) {
        e = e || event;
        __stopPropagation(e);

        _state.changing = false;

        if (_data.showtooltip === true) {
            _toolTip.hide();
        }

        if (_state.changing) {
            _state.changing = false;

            __triggerEvent('changed');
        }

        if (_state.boundevents !== null) {
            _clipper.unbind(_state.boundevents);
            _state.boundevents = null;
            _wdvInternals.resetDrawLayer();
        }

        return false;
    }

    function __animate() {
        if (_data.animated === true && _state.colorswap === 0) {
            _dom.rect.css('border', '1px dashed #' + __getBackColor());
            _dom.rectback.css('border', '1px solid #' + __getForeColor());
            _state.colorswap = 1;
        } else {
            _dom.rect.css('border', '1px dashed #' + __getForeColor());
            _dom.rectback.css('border', '1px solid #' + __getBackColor());
            _state.colorswap = 0;
        }

        if (_data.animated === true && !_dom.rect.is(':hidden') && !_state.animating) {
            _state.animating = setTimeout(function () {
                _state.animating = false;
                __animate();
            }, 250);
        }
    }

    // #endregion

    // #region Helper Methods

    function __getMousePosition(e) {
        var p = Atalasoft.Utils.getMousePositionJquery(e.toolEvent ? e.toolEvent : e);

        if (_clipper._paper) {
            var offset = Atalasoft.Utils.getSVGOffset(_clipper._paper.canvas, _clipper);

            p.x -= offset.left;
            p.y -= offset.top;
        }

        return p;
    }

    function __getScaledPageHeight() {
        return Math.round(_state.pagesize.height * _state.zoom);
    }

    function __getScaledPageWidth() {
        return Math.round(_state.pagesize.width * _state.zoom);
    }

    function __stopPropagation(e) {
        if (typeof e.stopPropagation !== 'undefined') {
            e.stopPropagation();
        } else {
            e.cancelBubble = true;
        }
    }

    function __updateState() {
        // used for when centering the image is enabled
        //		var offset = _clipper._img.offset();
        //		_state.pageoffset.x = offset.left;
        //		_state.pageoffset.y = offset.top;

        var size = _clipper._img.getSize();
        _state.zoom = _clipper._img.getFitZoom();
        _state.pagesize.width = size.width;
        _state.pagesize.height = size.height;
    }

    function __zoomToRectangle() {
        var maxZoom = _wdvInternals.getMaxZoom();

        if (_wdv.getZoom() < maxZoom) {
            var newZoom;
            var vps = _wdvInternals.getViewportSize();
            var fitzoom = _clipper._img.getFitMultiplier();
            var fullzoom = 1;
            var npx = 0;
            var npy = 0;

            // Zooms to the best fit of the Selection area
            if (vps.width / _data.width === vps.height / _data.height) {
                // the unusual case when the ratio of the control is the same as the selection, need to use the minimum due to round off error
                newZoom = Math.min(vps.width / (_data.width * fitzoom), vps.height / (_data.height * fitzoom), maxZoom);
            } else if (vps.width / _data.width < vps.height / _data.height) {
                // base the new zoom on the width of the selection
                newZoom = Math.min(vps.width / (_data.width * fitzoom), maxZoom);
            } else {
                // base the new zoom on the height of the selection
                newZoom = Math.min(vps.height / (_data.height * fitzoom), maxZoom);
            }

            fullzoom = fitzoom * newZoom;
            npx = Math.round(_data.x * fullzoom);
            npy = Math.round(_data.y * fullzoom);
            // we are trying to zoom to fit one side of viewport. but due to maxZoom it could be not possible. so center the area.
            npy -= Math.max(0, Math.round((vps.height - _data.height * fullzoom) / 2));
            npx -= Math.max(0, Math.round((vps.width - _data.width * fullzoom) / 2));

            var offset = _wdvInternals.getPageOffsets(_clipper._index, null, null, newZoom);
            _wdv.zoom(newZoom, function () {
                _wdv.scrollTo(offset.width + npx, offset.height + npy);
            });
        }
    }

    // #endregion

    __init();

    return _self;
};
'use strict';

/*jshint eqnull: true, undef: true, jquery: true, browser: true, es3:false */

// Atalasoft global constructors and functions
/*global Atalasoft */

// #region declarations

/**
 * Notification callback signature. The callback function that is called without parameters.
 * @callback NotificationCallback
 */

/**
 * Represents point structure.
 * @typedef {Object} Point
 * @property {number} x - X axis coordinate.
 * @property {number} y - Y axis coordinate.
 */

// #endregion

/**
 * Represents supported annotation types.
 * @enum {string} AnnotationTypes
 * @memberOf Atalasoft.Annotations
 */
Atalasoft.Annotations.AnnotationTypes = {
    /**
     * Image annotation.
     */
    image: 'image',

    /**
     * Highlight annotation.
     */
    highlight: 'highlight',

    /**
     * Rectangle annotation.
     */
    rectangle: 'rectangle',

    /**
     * Filled rectangle annotation.
     */
    fillrect: 'fillrect',

    /**
     * Text annotation.
     */
    text: 'text',

    /**
     * Stamp annotation.
     */
    stamp: 'stamp',

    /**
     * Ellipse annotation.
     */
    ellipse: 'ellipse',

    /**
     * Single line annotation.
     */
    line: 'line',

    /**
     * Multiline annotation. Similar to `polygon` but represents not enclosed shape, first and last points are not joined.
     */
    lines: 'lines',

    /**
     * Freehand annotation.
     */
    freehand: 'freehand',

    /**
     * Polygon annotation. Similar to `lines` but represents enclosed shape.
     */
    polygon: 'polygon'

    // /**
    //  * Custom annotation type. Behavior is defined by the application.
    //  */
    // custom: 'custom'
};

/**
 * The current browser metadata.
 * @type {Atalasoft.Utils.BrowserMetadata}
 */
Atalasoft.Utils.Browser = {

    Explorer: navigator.userAgent.indexOf("MSIE") >= 0 || navigator.userAgent.indexOf("Trident") >= 0,
    Firefox: navigator.userAgent.indexOf("Firefox") >= 0 || navigator.userAgent.indexOf("Minefield") >= 0,
    Safari: navigator.userAgent.indexOf("Safari") >= 0 && navigator.userAgent.indexOf("Chrome") < 0,
    Opera: navigator.userAgent.indexOf("Opera") >= 0,
    Chrome: navigator.userAgent.indexOf("Safari") >= 0 && navigator.userAgent.indexOf("Chrome") >= 0,
    /**
     * @private
     */
    Features: {
        SVG: !!(window.SVGAngle || document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1")),
        Touch: !!('ontouchstart' in window),
        VML: Atalasoft.Utils.__supportsVML(),
        foreignObject: document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Extensibility", "1.1"),
        Compatibility: typeof document.documentMode !== 'undefined' && document.documentMode === 7,
        FlexBox: 'flex' in document.documentElement.style || 'WebkitFlex' in document.documentElement.style || 'msFlex' in document.documentElement.style
    },

    /**
     * @private
     */
    Layout: {
        Gecko: !!navigator.userAgent.match(/(Gecko)/i),
        Presto: !!navigator.userAgent.match(/(Presto)/i),
        Trident: !!navigator.userAgent.match(/(Trident)/i),
        Webkit: !!navigator.userAgent.match(/(WebKit)/i),
        Version: (Atalasoft.Utils.__blv = navigator.userAgent.match(/(?:Gecko|Presto|Trident|WebKit).[\d\.]*/)) ? Atalasoft.Utils.__blv[0].replace(/\D*/, '') : null
    },
    Mobile: {
        iOS: !!navigator.userAgent.match(/(iPad|iPhone|iPod)/i),
        Android: !!navigator.userAgent.match(/(Android)/i),
        IEMobile: !!navigator.userAgent.match(/(IEMobile)/i),

        Any: function Any() {
            return this.iOS || this.Android || this.IEMobile;
        }
    },
    Version: (Atalasoft.Utils.__bv = navigator.userAgent.match(/(?:MSIE|Firefox|Chrome|Safari|Opera| rv).[\d\.]*/)) ? Atalasoft.Utils.__bv[0].replace(/\D*/, '') : null
};

Atalasoft.Utils.Browser.Explorer8 = Atalasoft.Utils.Browser.Explorer && parseInt(Atalasoft.Utils.Browser.Version, 10) === 8;

/**
 *  Specifies the behavior of the mouse from within the WebDocumentViewer.
 *  @enum {number}
 */

Atalasoft.Utils.MouseToolType = {
    /** Specify no mouse behavior at all. */
    None: 0,
    /** Clicking and dragging the mouse will scroll the image. */
    Pan: 1,
    /** Clicking will zoom in. */
    ZoomIn: 2,
    /** Clicking will zoom out. */
    ZoomOut: 3,
    /** Shows a context menu for the clicked object (where applicable). */
    ContextMenu: 4,
    /** Allows mouse events to pass through the DOM without any handling. */
    PassThrough: 5,
    /** Mouse will be set to crosshairs and can be used to drag and modify a selection rectangle on the image. */
    Selection: 6,
    /** Zoom in on a specified area defined by dragging a rectangle onto the image. */
    ZoomArea: 7,
    /** Input actions are interpreted as text selection */
    Text: 8
};

/** Specifies the cursor used with the mouse tool.
 * @enum {number}
 */
Atalasoft.Utils.MouseToolCursor = {
    /** Automatically determined by the browser. */
    Auto: '',
    /** An arrow pointer. */
    Arrow: 'default',
    /** A crosshair usually used in drawing a box. */
    Crosshair: 'crosshair',
    /** A grabbing cursor. Usually changes to gabbed while the mouse button is down. */
    Grab: Atalasoft.Utils.Browser.Firefox ? '-moz-grab' : 'hand',
    /** A hand with a finger pointing. Usually what the browser uses for clicking hyperlinks. */
    Hand: 'pointer',
    /** A crosshair pointer with arrowheads on the ends indicating movement. */
    Move: 'move',
    /** A magnifying glass with a plus sign in it. */
    ZoomIn: Atalasoft.Utils.Browser.Firefox ? '-moz-zoom-in' : 'url("%1ZoomIn.cur"pointer), pointer',
    /** A magnifying glass with a minus sign in it. */
    ZoomOut: Atalasoft.Utils.Browser.Firefox ? '-moz-zoom-out' : 'url("%1ZoomOut.cur"), pointer',
    /** A selection editing cursor. */
    Text: 'text',
    /** A vertical text editing cursor. */
    VerticalText: 'vertical-text',
    /** A wait cursor. */
    Wait: 'wait',
    /** A custom CSS cursor string provided by the user. */
    Custom: '%2'
};

/** Specifies the direction of the scrolling.
 * @enum {number}
 */
Atalasoft.Utils.ScrollDirection = {
    /** Scrolls horizontally. */
    Horizontal: 'horizontal',
    /** Scrolls vertically. */
    Vertical: 'vertical'
};

/** Specifies the fitting options.
 * @enum {number}
 */
Atalasoft.Utils.Fitting = {
    /** No fitting will be applied to the image */
    None: 0,
    /** Finds the best option between width or height based fitting. */
    Best: 1,
    /** Fits the image to the available width. */
    Width: 2,
    /** Fits the image to the available height. */
    Height: 3
};

/** Specifies the page selection method.
 *  @enum {number}
 */
Atalasoft.Utils.PageSelection = {
    /** Selects the page under the top left corner of the viewer  */
    TopLeft: { x: 0, y: 0 },
    /** Selects the page under the middle left of the viewer  */
    MiddleLeft: { x: 0, y: 0.5 },
    /** Selects the page under the bottom left corner of the viewer  */
    BottomLeft: { x: 0, y: 1 },
    /** Selects the page under the center location of viewer  */
    Center: { x: 0.5, y: 0.5 }
};

/** Specifies the size of the viewport area that triggers document scroll when text selection enters it.
 * @enum {number}
 */
Atalasoft.Utils.ScrollArea = {
    /** Text selection scrolling is disabled */
    None: 0,

    /** Normal scroll area. Around 10% of the corresponding viewport dimension */
    Normal: 0.1,

    /** Normal scroll area. Around 20% of the corresponding viewport dimension */
    Large: 0.2
};

/**
 * Exposes the list of internal DOM elements classes that could be used to query and customize UI behavior.
 * @enum {string}
 * @readonly
 */
Atalasoft.Controls.WebDocumentViewer.domclasses = {
    /** Page element class. Container for all page elements - image, annotations, forms, text, etc layers. */
    atala_page_div: 'atala_page_div',

    /** Page image container that is in initial image load state */
    atala_page_loading: 'atala_page_loading',

    /** Page image anchor container element class*/
    atala_page_image_anchor: 'atala_page_image_anchor',

    /** Page image element class*/
    atala_page_image: 'atala_page_image',

    /** Page index element class. see {@link WebDocumentViewerConfig.showpagenumber | showpagenumber} config option */
    atala_page_number: 'atala_page_number',

    /** Active page class */
    atala_active_page: 'atala_active_page',

    /** Active thumbnail class */
    atala_active_thumb: 'atala_active_thumb',

    /** Thumbnail caption class */
    atala_thumb_caption: 'atala_thumb_caption',

    /** Document toolbar element class */
    atala_toolbar: 'atala_toolbar',

    /** Annotations toolbar element class */
    atala_annotation_toolbar: 'atala_annotation_toolbar',

    /** Toolbar button element class */
    atala_toolbar_button: 'atala_toolbar_button',

    /** Class of the main outer object that holds the scrollbars */
    atala_main_container: 'atala_main_container',

    /** Class of the inner object that controls scrolling */
    atala_scroller: 'atala_scroller',

    /** Class of the inner object that defines the viewable area */
    atala_viewport: 'atala_viewport',

    /** Inner content container object class */
    atala_content: 'atala_content',

    /** Thumbnailer draggable area */
    atala_thumb_draggable: 'atala_thumb_draggable',

    /** Placeholder element that is inserted into Thumbnailer to highlight drop location */
    atala_drag_placeholder: 'atala_drag_placeholder',

    /** Placeholder inserted before page dom object that is used in virtual scrolling */
    atala_dom_edge_first: 'atala_dom_edge_first',

    /** Placeholder inserted after page dom object that is used in virtual scrolling */
    atala_dom_edge_last: 'atala_dom_edge_last',

    /** Inner horizontal scroll bar object class */
    atala_scroll_horizontal: 'atala_scroll_horizontal',

    /** Inner vertical scroll bar object */
    atala_scroll_vertical: 'atala_scroll_vertical',

    /** Toolbar span element containing the page number */
    atala_page_label: 'atala_page_label',

    /** Context or dropdown menu element. Could be multiple instances within same viewer DOM sub tree */
    atala_context_menu: 'atala_context_menu',

    /** Status div */
    atala_statusbar: 'atala_statusbar',

    /** "Save Changes" toolbar button */
    atala_tool_button_save: 'atala_tool_button_save',

    /** "Previous Page" toolbar button */
    atala_tool_button_page_prev: 'atala_tool_button_page_prev',

    /** "Next Page" toolbar button */
    atala_tool_button_page_next: 'atala_tool_button_page_next',

    /** "Zoom Out" toolbar button */
    atala_tool_button_zoom_out: 'atala_tool_button_zoom_out',

    /** "Zoom In" toolbar button */
    atala_tool_button_zoom_in: 'atala_tool_button_zoom_in',

    /** "Full Size" toolbar button */
    atala_tool_button_fit_none: 'atala_tool_button_fit_none',

    /** "Best Fit" toolbar button */
    atala_tool_button_fit_best: 'atala_tool_button_fit_best',

    /** "Fit To Width" toolbar button */
    atala_tool_button_fit_width: 'atala_tool_button_fit_width',

    /** "Zoom Area" toolbar button */
    atala_tool_button_zoom_area: 'atala_tool_button_zoom_area',

    /** "Rotate Left" tooltip button */
    atala_tool_button_rotate_left: 'atala_tool_button_rotate_left',

    /** "Rotate Right" tooltip button */
    atala_tool_button_rotate_right: 'atala_tool_button_rotate_right',

    /** "Text selection" toolbar button */
    atala_tool_button_text_tool: 'atala_tool_button_text_tool',

    /** "Pan" toolbar button */
    atala_tool_button_pan_tool: 'atala_tool_button_pan_tool',

    /** "Draw Ellipse" annotation toolbar button */
    atala_tool_button_ellipse_anno: 'atala_tool_button_ellipse_anno',

    /** "Draw Highlight" annotation toolbar button */
    atala_tool_button_highlight_anno: 'atala_tool_button_highlight_anno',

    /** "Draw Line" annotation toolbar button */
    atala_tool_button_line_anno: 'atala_tool_button_line_anno',

    /** "Draw Poly Lines" annotation toolbar button */
    atala_tool_button_lines_anno: 'atala_tool_button_lines_anno',

    /** "Draw Freehand" annotation toolbar button */
    atala_tool_button_freehand_anno: 'atala_tool_button_freehand_anno',

    /** "Draw Polygon" annotation toolbar button */
    atala_tool_button_polygon_anno: 'atala_tool_button_polygon_anno',

    /** "Draw Rectangle" annotation toolbar button */
    atala_tool_button_rect_anno: 'atala_tool_button_rect_anno',

    /** "Filled Rectangle" annotation toolbar button */
    atala_tool_button_fillrect_anno: 'atala_tool_button_fillrect_anno',

    /** "Draw Text" annotation toolbar button */
    atala_tool_button_text_anno: 'atala_tool_button_text_anno',

    /** "Add a Stamp" annotation toolbar button */
    atala_tool_button_stamp_anno: 'atala_tool_button_stamp_anno',

    /** "Add a Sticky Note" annotation toolbar button */
    atala_tool_button_note_anno: 'atala_tool_button_note_anno',

    /** "Add a Comment" annotation toolbar button */
    atala_tool_button_commment_anno: 'atala_tool_button_commment_anno',

    /** Selection Rubberband div object */
    atala_tool_selection_band: 'atala_tool_selection_band',

    /** Selection Rubberband grip div object */
    atala_tool_selection_grip: 'atala_tool_selection_grip',

    /** Selection Rubberband mask div object */
    atala_tool_selection_mask: 'atala_tool_selection_mask',

    /** Selection Rubberband tooltip div object */
    atala_tool_selection_tooltip: 'atala_tool_selection_tooltip',

    /** Text search containing div object */
    atala_search_container: 'atala_search_container',

    /** Text search input box */
    atala_search_input: 'atala_search_input',

    /** Text search next match button */
    atala_search_next: 'atala_search_next',

    /** Text search previous match button */
    atala_search_prev: 'atala_search_prev'
};

/**
 * Exposes list of well-known attributes that are used to provide additional information for DOM elements
 * @enum {string}
 */
Atalasoft.Controls.WebDocumentViewer.domattributes = {
    /** Index of the page currently displayed within the element. applies to elements having `.atala_page_div` class */
    atala_page_index: 'atala_page_index'
};

/**
 * Defines Web Document Thumbnailer selection mode.
 * @enum {number}
 * @readonly 
 */
Atalasoft.Utils.SelectionMode = {
    /**
     * Only one thumbnail can be selected 
     */
    SingleSelect: 0,

    /**
     * Multiple thumbnails can be selected
     */
    MultiSelect: 1
};

/**
 * Defines the order in which selected thumbnails are ordered
 * @enum {number}
 * @readonly 
 */
Atalasoft.Utils.SelectedItemsOrder = {
    /**
     * Items are sorted in their index order.
     */
    ItemIndexOrder: 0,

    /**
     * Items are sorted in the order they were selected.
     */
    SelectedOrder: 1
};

// #region Enums
/**
 * Represents the current browser metadata.
 * @typedef {Object} BrowserMetadata
 * @memberOf Atalasoft.Utils
 * @property {boolean} Explorer - Indicates whether current browser is Internet Explorer.
 * @property {boolean} Firefox - Indicates whether current browser is Firefox.
 * @property {boolean} Safari -  Indicates whether current browser is Safari.
 * @property {boolean} Opera -  Indicates whether current browser is Opera.
 * @property {boolean} Chrome -  Indicates whether current browser is Google Chrome.
 * @property {Object} Mobile - Represents mobile browser indicators.
 * @property {boolean} Mobile.iOS - Indicates that current device runs on iOS device.
 * @property {boolean} Mobile.Android - Indicates that current device runs on Android device.
 * @property {boolean} Mobile.IEMobile - Indicates that current device runs on mobile internet explorer.
 * @property {function} Mobile.Any - Checks whether current platform is mobile device.
 * @returns {boolean}
 */

// #endregion
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

//
//  Annotation Controller class
//
//  This source code is property of Atalasoft, Inc. (http://www.atalasoft.com/)
//  Permission for usage and modification of this code is only permitted 
//  with the purchase of a source code license.
//
//  Change History:
//	02-09-12	D. Cilley		File Created.
//	02-22-12	D. Cilley		FB 12934: Fixed Stamp and Image saving
//	02-23-12	D. Cilley		FB 12940: Fixed annotation show problem with loading from Url
//	03-01-12	D. Cilley		FB 12939: Fixed IE page translation after annotation create
//	03-01-12	D. Cilley		FB 12947, FB 12977, FB 12973, FB 12990: Only one annotation should be created at a time
//	03-02-12	D. Cilley		FB 12982: Fixed annotation creation in Firefox
//	03-03-12	D. Cilley		FB 12938: Fixed an exception when showing properties of path annots
//	03-03-12	D. Cilley		FB 13009, FB 13010: Fixed bugs while drawing over other objects
//	03-04-12	D. Cilley		FB 12496, FB 12991: still fixing (select multiple, right click delete, menus won't come back)
//	03-13-12	D. Cilley		FB 13073: Added __disposePaper to support deleting of pages in the parent control
//	04-11-12	D. Cilley		FB 12978: Fixed a bug that would zoom grips as well as annotations
//	04-17-12	D. Cilley		FB 12978: Fixed bugs introduced by original fix
//	04-17-12	D. Cilley		FB 13173: Fixed a bug that would show grips on the wrong page
//	04-18-12	D. Cilley		FB 13174: Fixed a bug that would not allow deselecting annotations
//	04-19-12	D. Cilley		FB 13175: Fixed a bug that would throw js errors when selected annotation were recycled
//	05-08-12	D. Cilley		FB 13067: Fixed stamp font saving, text anno round trip, and stamp editing
//	06-20-12	D. Cilley		FB 13301: Fixed a bug that would fill freehand and lines annots
//	09-11-12	D. Cilley		FB 13589: Improved architecture to allow for easier editing.
//	09-20-12	D. Cilley		FB 13589: Moved grips to separate file.
//	10-18-12	D. Cilley		FB 13691: Disposed of context menu DOM elements when we're done with them.
//	10-19-12	D. Cilley		FB 13690: Returning getClonedData instead of annotation view
//	10-25-12	D. Cilley		FB 13715: Refactored internal vars, and added __getDebugInfo for testing.  
//	10-25-12	D. Cilley		FB 13714: Added Raphael version check.  
//	11-01-12	J. Burch		FB 13732: Added deselectAll method.
//	11-05-12	D. Cilley		FB 13742, 13744: Fixed bugs in creating annotations.
//	11-07-12	J. Burch		FB 13748, 13725: Refactored public events, made mobile ones public, added public deleteAnno method.
//	11-09-12	D. Cilley		FB 13757: Added callbacks and 'async' on several methods to help with firing events.
//	11-12-12	D. Cilley		FB 13763: Fixed a bug with loading annotation data from config options.
//	11-19-12	J. Burch		FB 13768, 13767: Adding new annotation events, fixing menu close bug.
//	11-19-12	J. Burch		FB 13791, 13792: Fixing a bug with properties menu, renamed public events
//	12-18-12	D. Cilley		FB 13874: Added HTML support to Raphael to help render text better.
//	02-06-13	D. Cilley		FB 13957: Added config option for script resource url.
//	02-21-13	D. Cilley		FB 14065: Added JSHint options and fixes to comply with JSHint warnings.
//	02-22-13	D. Cilley		FB 13988: Fixed an IE7 reflow height bug that would interrupt text anno drawing.
//	03-01-13	D. Cilley		FB 14066: TextAnnotations now use HTML rendering for all browsers.
//	04-04-13	D. Cilley		FB 13993, 13996, 13997: Added AnnotationSelector for document level selecting.
//	04-23-13	J. Burch		FB 13096: Fixing some initialization errors where _menu and _props were never constructed.
//	04-30-13	D. Cilley		FB 14116: Fixed a bug that didn't position annotations correctly in IE7-8 while zooming.
//	05-07-13	D. Cilley		FB 14119: Fixed AnnotationController initialization if scripts were already loaded.
//	05-10-13	D. Cilley		FB 14145: Fixed IE7-8 image annotation scaling after zoom.
//	05-15-13	D. Cilley		FB 14150: Fixed IE10 specific reflow problem.
//	07-15-13	D. Cilley		FB 14215: Added beforehandlerrequest and handlerreturned events.
//	07-31-13	D. Cilley		FB 14245: Added arrowhead functionality.
//	08-30-13	D. Cilley		FB 14274: Added Thumbnailer functionality.
//	08-30-13	D. Cilley		FB 14275: Fixed multi-loading scripts when there's more than one WDV.
//	11-12-13	D. Cilley		FB 14186: Added ability to cancel or switch annotation drawing.
//	12-03-13	D. Cilley		FB 14071: Removed jquery.browser dependency.
//	12-17-14	D. Cilley		Bug 550581: Added locally scoped non-conflict jQuery.
//	02-03-15	D. Cilley		Bug 321042: Fixed deleting of active annotation.
//	03-25-15	D. Cilley		Bug 591740: Fixed hiding of the drawing surface if it was shown inside annotationcreated event.
//	06-18-15	D. Cilley		Bug 607560: Fixed a bug that clipped annotations incorrectly when pageborderwidth was set.
//	07-02-15	D. Cilley		Bug 625845: Added dispose method.
//	07-10-15	D. Cilley		Bug 607560: Fixed an offset bug related to pageborderwidth fix.
//	09-01-15	D. Cilley		Task 630965: Added event bind tracking and intellisense.
//	09-15-15	D. Cilley		Bug 627869: Added support for forcing all pages to be fit into the same size.
//	09-30-15	D. Cilley		Bug 610232: Fixed __redrawVisiblePages so that it would stop unecessarily redrawing annotation and form layers.
//	12-04-15	D. Cilley		Bug 670919, 670924, 670938: Fixed several ZoomArea bugs.
//-------------------------------------------------------------------------------------------------

// JSHint options and globals
/*jshint eqnull: true, undef: true, jquery: true, browser: true, es3:false */

// Atalasoft global constructors and functions
/*global Atalasoft */

// Local globals
/*global Raphael */

// wdv: parent WebDocumentViewer object
// internals: internal functions and objects from the WDV
// readonly: annotations are only shown
/**
 * WebDocuemntViewer Annotations API.
 * @class
 * @inner
 * @name AnnotationController
 * @memberOf Atalasoft.Controls.WebDocumentViewer
 */
Atalasoft.Annotations.AnnotationController = function (wdv, internals, readonly) {
    var $ = Atalasoft.$;
    var minRaphaelVersion = 2.1;
    var _self = this;
    var _wdv = wdv;
    var _wdvInternals = internals;

    // #region Intellisense
    var _selector = new Atalasoft.Annotations.AnnotationSelector();
    var _exposedEvents = {

        /**
         * @callback AnnotationCallback
         * @param {Object} event - Event data object.
         * @param {AnnotationData} event.annotation - Annotation object related to the event.
         */

        /**
         * Triggers when the user uses the mouse to click on an annotation.
         * @event Atalasoft.Controls.WebDocumentViewer~AnnotationController#annotationclicked
         * @type {AnnotationCallback}
         * @param {Object} event - Event data object.
         * @param {AnnotationData} event.annotation - Annotation object related to the event.
         * @param {AnnotationData} event.anno - Deprecated. Please use `annotation` property. This property will be removed soon.
         */
        annotationclicked: null,

        /**
         * This event is triggered when annotation is created, whether through mouse/touch events or programmatically.
         * @event Atalasoft.Controls.WebDocumentViewer~AnnotationController#annotationcreated
         * @type {AnnotationCallback}
         * @param {Object} event - Event data object.
         * @param {AnnotationData} event.annotation - Annotation object related to the event.
         * @param {number} page - event.Index of the page where annotation is created.
         * @param {AnnotationData} event.anno - Deprecated. Please use `annotation` property. This property will be removed soon.
         */
        annotationcreated: null,

        /**
         * Triggers when the user uses the mouse to double-click on an annotation.
         * @event Atalasoft.Controls.WebDocumentViewer~AnnotationController#annotationdoubleclicked
         * @type {AnnotationCallback}
         * @param {Object} event - Event data object.
         * @param {AnnotationData} event.annotation - Annotation object related to the event.
         * @param {AnnotationData} event.anno - Deprecated. Please use `annotation` property. This property will be removed soon.
         */
        annotationdoubleclicked: null,

        /**
         *  Triggers when an annotation is loaded into the document. There are multiple ways how annotaions could be loaded, for example passing the {@link WebDocumentViewerConfig.annotationsurl| annotationsurl} in the constructor, or by calling {@link Atalasoft.Controls.WebDocumentViewer#openUrl | viewer.openUrl}. In this case event will be fired for each loaded annotation from all layers.
         * @event Atalasoft.Controls.WebDocumentViewer~AnnotationController#annotationloaded
         * @type {AnnotationCallback}
         * @param {Object} event - Event data object.
         * @param {AnnotationData} event.annotation - Annotation object related to the event.
         * @param {AnnotationData} event.anno - Deprecated. Please use `annotation` property. This property will be removed soon.
         */
        annotationloaded: null,

        /** Triggers when the user has depressed a mouse button on an annotation.
         * @event Atalasoft.Controls.WebDocumentViewer~AnnotationController#annotationmousedown
         * @type {AnnotationCallback}
         * @param {Object} event - Event data object.
         * @param {AnnotationData} event.annotation - Annotation object related to the event.
         * @param {AnnotationData} event.anno - Deprecated. Please use `annotation` property. This property will be removed soon.
         */
        annotationmousedown: null,

        /** Triggers when the user has depressed the left mouse button on an annotation.
         * @event Atalasoft.Controls.WebDocumentViewer~AnnotationController#annotationmousedownleft
         * @type {AnnotationCallback}
         * @param {Object} event - Event data object.
         * @param {AnnotationData} event.annotation - Annotation object related to the event.
         * @param {AnnotationData} event.anno - Deprecated. Please use `annotation` property. This property will be removed soon.
         */
        annotationmousedownleft: null,

        /** Triggers when the user has depressed the right mouse button on an annotation.
         * @event Atalasoft.Controls.WebDocumentViewer~AnnotationController#annotationmousedownright
         * @type {AnnotationCallback}
         * @param {Object} event - Event data object.
         * @param {AnnotationData} event.annotation - Annotation object related to the event.
         * @param {AnnotationData} event.anno - Deprecated. Please use `annotation` property. This property will be removed soon.
         */
        annotationmousedownright: null,

        /** Triggers when the user moves the mouse pointer over an annotation.
         * @event Atalasoft.Controls.WebDocumentViewer~AnnotationController#annotationmousemove
         * @type {AnnotationCallback}
         * @param {Object} event - Event data object.
         * @param {AnnotationData} event.annotation - Annotation object related to the event.
         * @param {AnnotationData} event.anno - Deprecated. Please use `annotation` property. This property will be removed soon.
         */
        annotationmousemove: null,

        /** Triggers when the user has moved the mouse pointer out of the bounds of the annotation.
         * @event Atalasoft.Controls.WebDocumentViewer~AnnotationController#annotationmouseout
         * @type {AnnotationCallback}
         * @param {Object} event - Event data object.
         * @param {AnnotationData} event.annotation - Annotation object related to the event.
         * @param {AnnotationData} event.anno - Deprecated. Please use `annotation` property. This property will be removed soon.
         */
        annotationmouseout: null,

        /** Triggers when the user has moved the mouse pointer into the bounds of the annotation.
         * @event Atalasoft.Controls.WebDocumentViewer~AnnotationController#annotationmouseover
         * @type {AnnotationCallback}
         * @param {Object} event - Event data object.
         * @param {AnnotationData} event.annotation - Annotation object related to the event.
         * @param {AnnotationData} event.anno - Deprecated. Please use `annotation` property. This property will be removed soon.
         */
        annotationmouseover: null,

        /** Triggers when the user has released a mouse button on an annotation.
         * @event Atalasoft.Controls.WebDocumentViewer~AnnotationController#annotationmouseup
         * @type {AnnotationCallback}
         * @param {Object} event - Event data object.
         * @param {AnnotationData} event.annotation - Annotation object related to the event.
         * @param {AnnotationData} event.anno - Deprecated. Please use `annotation` property. This property will be removed soon.
         */
        annotationmouseup: null,

        /** Triggers when an annotation has been moved.
         * @event Atalasoft.Controls.WebDocumentViewer~AnnotationController#annotationmoved
         * @type {AnnotationCallback}
         * @param {Object} event - Event data object.
         * @param {AnnotationData} event.annotation - Annotation object related to the event.
         * @param {AnnotationData} event.anno - Deprecated. Please use `annotation` property. This property will be removed soon.
         */
        annotationmoved: null,

        /** Triggers when an annotation has been rotated.
         * @event Atalasoft.Controls.WebDocumentViewer~AnnotationController#annotationrotated
         * @type {AnnotationCallback}
         * @param {Object} event - Event data object.
         * @param {AnnotationData} event.annotation - Annotation object related to the event.
         * @param {AnnotationData} event.anno - Deprecated. Please use `annotation` property. This property will be removed soon.
         */
        annotationrotated: null,

        /** Triggers when a pinch gesture has been detected on an annotation.
         * @event Atalasoft.Controls.WebDocumentViewer~AnnotationController#annotationpinchresize
         * @type {AnnotationCallback}
         * @param {Object} event - Event data object.
         * @param {AnnotationData} event.annotation - Annotation object related to the event.
         * @param {AnnotationData} event.anno - Deprecated. Please use `annotation` property. This property will be removed soon.
         */
        annotationpinchresize: null,

        /** Triggers when an annotation has been repainted.
         * @event Atalasoft.Controls.WebDocumentViewer~AnnotationController#annotationrepainted
         * @type {AnnotationCallback}
         * @param {Object} event - Event data object.
         * @param {AnnotationData} event.annotation - Annotation object related to the event.
         * @param {AnnotationData} event.anno - Deprecated. Please use `annotation` property. This property will be removed soon.
         */
        annotationrepainted: null,

        /** Triggers when an annotation has been resized.
         * @event Atalasoft.Controls.WebDocumentViewer~AnnotationController#annotationresized
         * @type {AnnotationCallback}
         * @param {Object} event - Event data object.
         * @param {AnnotationData} event.annotation - Annotation object related to the event.
         * @param {AnnotationData} event.anno - Deprecated. Please use `annotation` property. This property will be removed soon.
         */
        annotationresized: null,

        /** Triggers when the user right clicks on an annotation.
         * @event Atalasoft.Controls.WebDocumentViewer~AnnotationController#annotationrightclicked
         * @type {AnnotationCallback}
         * @param {Object} event - Event data object.
         * @param {AnnotationData} event.annotation - Annotation object related to the event.
         * @param {AnnotationData} event.anno - Deprecated. Please use `annotation` property. This property will be removed soon.
         */
        annotationrightclicked: null,

        /** Triggers when a touch end event has been finished on an annotation.
         * @event Atalasoft.Controls.WebDocumentViewer~AnnotationController#annotationtouchend
         * @type {AnnotationCallback}
         * @param {Object} event - Event data object.
         * @param {AnnotationData} event.annotation - Annotation object related to the event.
         * @param {AnnotationData} event.anno - Deprecated. Please use `annotation` property. This property will be removed soon.
         */
        annotationtouchend: null,

        /** Triggers when a touch move event is happening on an annotation.
         * @event Atalasoft.Controls.WebDocumentViewer~AnnotationController#annotationtouchmove
         * @type {AnnotationCallback}
         * @param {Object} event - Event data object.
         * @param {AnnotationData} event.annotation - Annotation object related to the event.
         * @param {AnnotationData} event.anno - Deprecated. Please use `annotation` property. This property will be removed soon.
         */
        annotationtouchmove: null,

        /** Triggers when a touch event has started on an annotation.
         * @event Atalasoft.Controls.WebDocumentViewer~AnnotationController#annotationtouchstart
         * @type {AnnotationCallback}
         * @param {Object} event - Event data object.
         * @param {AnnotationData} event.annotation - Annotation object related to the event.
         * @param {AnnotationData} event.anno - Deprecated. Please use `annotation` property. This property will be removed soon.
         */
        annotationtouchstart: null,

        /** Triggers when a layer has been inserted into the document.
         * @event Atalasoft.Controls.WebDocumentViewer~AnnotationController#layerinserted
         * @param {Object} event - Event data object.
         * @param {number} event.index - Index of the inserted layer.
         */
        layerinserted: null,

        /** Triggers when a layer has moved from one index to another within the document.
         * @event Atalasoft.Controls.WebDocumentViewer~AnnotationController#layermoved
         * @param {Object} event - Event arguments.
         * @param {number} event.srcindex - Index from which layer was moved.
         * @param {number} event.destindex - Index of the moved layer.
         */
        layermoved: null,

        /** Triggers when a layer has been removed from the document.
         * @event Atalasoft.Controls.WebDocumentViewer~AnnotationController#layerremoved
         * @param {Object} event - Event arguments.
         * @param {number} event.index - Index from which layer was removed.
         * @param {AnnotationData[]} event.layer - The removed layer data.
         */
        layerremoved: null,

        /** Triggers when a layer has been changed. Fired by any type of layers structure: {@link Atalasoft.Controls.WebDocumentViewer~AnnotationController#insertLayer|insertLayer},  {@link Atalasoft.Controls.WebDocumentViewer~AnnotationController#moveLayer|moveLayer} or {@link Atalasoft.Controls.WebDocumentViewer~AnnotationController#removeLayer|removeLayer}.
         * @event Atalasoft.Controls.WebDocumentViewer~AnnotationController#layerschanged
         * @type {NotificationCallback}
         */
        layerschanged: null,

        /** Triggers when all annotations have been deleted.
         * @event Atalasoft.Controls.WebDocumentViewer~AnnotationController#annotationscleared
         */
        annotationscleared: null,

        /** Triggers when an annotation is deleted.
         * @event Atalasoft.Controls.WebDocumentViewer~AnnotationController#annotationdeleted
         * @param {Object} event - Event arguments.
         * @param {number} event.page - Index of the page where annotation has been removed.
         * @param {number} event.index - Index at which annotation has been removed.
         */
        annotationdeleted: null,

        /** Triggers when a user has started drawing an annotation with the mouse or a touch event.
         * @event Atalasoft.Controls.WebDocumentViewer~AnnotationController#annotationdrawstart
         * @type {AnnotationCallback}
         * @param {Object} event - Event data object.
         * @param {AnnotationData} event.annotation - Annotation object related to the event.
         * @param {AnnotationData} event.ann - Deprecated. Please use `annotation` property. This property will be removed soon.
         */
        annotationdrawstart: null,

        /** Triggers when a user has finished drawing an annotation with the mouse or a touch event.
         * @event Atalasoft.Controls.WebDocumentViewer~AnnotationController#annotationdrawend
         * @type {AnnotationCallback}
         * @param {Object} event - Event data object.
         * @param {AnnotationData} event.annotation - Annotation object related to the event.
         * @param {boolean} event.cancelled - Indicates whether annotation draw was cancelled.
         * @param {AnnotationData} event.ann - Deprecated. Please use `annotation` property. This property will be removed soon.
         */
        annotationdrawend: null,

        /** Triggers when an annotation has started dragging.
         * @event Atalasoft.Controls.WebDocumentViewer~AnnotationController#annotationdragstart
         * @type {AnnotationCallback}
         * @param {Object} event - Event data object.
         * @param {AnnotationData} event.annotation - Annotation object related to the event.
         * @param {AnnotationData} event.ann - Deprecated. Please use `annotation` property. This property will be removed soon.
         */
        annotationdragstart: null,

        /** Triggers when an annotation has finished dragging.
         * @event Atalasoft.Controls.WebDocumentViewer~AnnotationController#annotationdragend
         * @type {AnnotationCallback}
         * @param {Object} event - Event data object.
         * @param {AnnotationData} event.annotation - Annotation object related to the event.
         * @param {AnnotationData} event.ann - Deprecated. Please use `annotation` property. This property will be removed soon.
         */
        annotationdragend: null,

        /**
         * @callback AnnotationHandler
         * @param {AnnotationData} annotation - annotation data object on which action is performed.
         */
        /**
         * @typedef {Object} AnnotationContextMenu
         * @property {AnnotationHandler} [...menuItemTitle] - Menu item handlers. All own properties of the menu object will be translated to menu items.
         */

        /**
         * Callback signature for {@link Atalasoft.Controls.WebDocumentViewer~AnnotationController#event:contextmenu | contextmenu} event.
         * @callback AnnotationContextMenuCallback
         * @param {Object} event - Event data object.
         * @param {AnnotationData} annotation - The data of the annotationon which context menu were activated.
         * @param {AnnotationContextMenu} menu - The menu configuration. Keys of this object is treated as menu titles and values under those keys are handler functions.
         * This object could be modified by application to extend or modify current menu instance.
         */

        /** Triggers when the context menu is shown for an annotation.
         * @event Atalasoft.Controls.WebDocumentViewer~AnnotationController#contextmenu
         * @type {AnnotationContextMenuCallback}
         * @param {Object} event - Event data object.
         * @param {AnnotationData} annotation - The data of the annotationon which context menu were activated.
         * @param {AnnotationContextMenu} menu - The menu configuration. Keys of this object is treated as menu titles and values under those keys are handler functions.
         * This object could be modified by application to extend or modify current menu instance.
         */
        contextmenu: null,

        /** Triggers when the Raphael dependency has finished loading.
         * @event Atalasoft.Controls.WebDocumentViewer~AnnotationController#raphaelloaded
         */
        raphaelloaded: null
    };

    var _exposedApi = {
        /** @lends Atalasoft.Controls.WebDocumentViewer~AnnotationController */
        annotations: {
            events: _exposedEvents,

            /**
             * Gets an array of selected annotation data objects.
             * @returns {AnnotationData[]} - Annotation data objects for selected annotations only.
             * @instance
             * @function
             */
            getSelected: _selector.getSelected,

            /**
             * Selects all annotations on every page.
             * @instance
             * @function
             */
            selectAll: _selector.selectAll,

            /**
             * Deselects all annotations on every page.
             * @instance
             * @function
             */
            deselectAll: _selector.deselectAll,

            /**
             * Selects all annotations on the given page.
             * @param {number} index - The index of the page the annotations should be selected on.
             * @instance
             * @function
             */
            selectAllOnPage: _selector.selectPage,

            /**
             * Deselects all annotations on the given page.
             * @param {number} index - The index of the page the annotations should be deselected on.
             * @instance
             * @function
             */
            deselectAllOnPage: _selector.deselectPage,

            /**
             * Cancels the drawing of an annotation and returns the viewer to the previous tool.
             * @instance
             * @function
             */
            cancelDraw: __cancelAnnotationDraw,

            /**
             * Setups the viewport to create an annotation
             * @param {AnnotationData} aConfig - Configuration for the annotation to draw
             * @param {NotificationCallback} [callback] - function to call when the annotation has finished drawing.
             * @param {NotificationCallback} [cancelled] - function to call when the annotation draw was canceled.
             * @instance
             * @function
             */
            drawAnnotation: __drawAnnotationPublic,

            /**
             * Gets an array of annotion data objects located on the given zero based page index.
             * @param {number} index - The page index the annotations are located on.
             * @returns {AnnotationData[]} Annotation data objects on the given page.
             * @instance
             * @function
             */
            getFromPage: __getAnnosFromPagePublic,

            /**
             * Creates an annotation on the desired page with the given annotation data.
             * @param {AnnotationData} annotationConfig - Key value pairs representing annotation data.
             * @param {number} index - The index of the page the annotation should be created on.
             * @returns {AnnotationData} - Annotation data.
             * @instance
             * @function
             */
            createOnPage: __createAnnotationPublic,

            /**
             * Deletes an annotation on the given page by it's index on the page.
             * @param {number} pageIndex - Page index the annotation is located on.
             * @param {number} annIndex - Index of the annotation on the page.
             * @instance
             * @function
             */
            deleteFromPage: __deleteAnnoOnPage,

            /**
             * Shows the editor dialog for text annotations. Ignores other types of annotations.
             * @param {AnnotationData} annotation - the annotation object to show editor for.
             *
             * Annotation object should be retrieved using corresponding API. If it's constructed by the application, annotation won't be matched.
             * @instance
             * @function
             */
            showEditor: __showTextAnnoEditorPublic,

            /**
             * Hides the text annotation editor. Applies only to text annotations and ignores other types of annotations.
             * @param {AnnotationData} annotation - The annotation object to hide editor for.
             * @instance
             * @function
             */
            hideEditor: __hideTextAnnoEditorPublic,

            /**
             * Sets the default annotation properties for initially created annotations. This accepts the same input as the {@link WebDocumentViewerConfig.annotations|config.annotations.defaults}.
             * @param {AnnotationData[]} aConfig - Default configurations for different types of the annotations.
             * @returns {Atalasoft.Controls.WebDocumentViewer}
             * @instance
             * @function
             */
            setDefaults: __setAnnotationDefaults,

            /**
             * Sets the default annotation properties for image annotations. This accepts the same input as the {@link WebDocumentViewerConfig.annotations|config.annotations.images}
             * @param {AnnotationData[]} aConfig - Default configurations image annotations.
             * @returns {Atalasoft.Controls.WebDocumentViewer}
             * @instance
             * @function
             */
            setImages: __setImages,

            /**
             * Sets the default annotation properties for stamp annotations. This accepts the same input as the {@link WebDocumentViewerConfig.annotations|config.annotations.stamps}.
             * @param {AnnotationData[]} aConfig - Default configurations stamp annotations.
             * @returns {Atalasoft.Controls.WebDocumentViewer}
             * @instance
             * @function
             */
            setStamps: __setStamps,

            /**
             * Inserts a layer of annotations at the source URL and index into the given page index. Single layer of annotations corresponds to single document page.
             * @param {string} sourceUrl - Reserved for future use.
             * @param {AnnotationData[]} layer - The annotation layer data.
             * @param {number} index - Index the layer is to be inserted into.
             * @param {NotificationCallback} [callback] - Function to be called when the operation has completed.
             * @instance
             * @function
             */
            insertLayer: __insertLayerPublic,

            /**
             * Removes a layer(page annotation) of annotations. All other layers are shifted. This operation corresponds to removing page from the document.
             * @param {number} index - index of the layer to be removed.
             * @param {NotificationCallback} [callback] - Function to be called when the operation has completed.
             * @instance
             * @function
             */
            removeLayer: __removeLayerPublic,

            /**
             * Moves a layer of annotations from one page index to another.
             * @param {number} sourceIndex - index of the layer to be moved.
             * @param {number} destIndex - Destination zero based page index.
             * @param {NotificationCallback} [callback] - Function to be called when the operation has completed.
             * @instance
             * @function
             */
            moveLayer: __moveLayerPublic
        },

        // old locations
        /**
         * @instance
         * @memberOf Atalasoft.Controls.WebDocumentViewer
         * @function
         * @deprecated Please use {@link Atalasoft.Controls.WebDocumentViewer~AnnotationController#deselectAll|annotations.deselectAll} instead.
         */
        deselectAll: _selector.deselectAll,

        /**
         * @instance
         * @memberOf Atalasoft.Controls.WebDocumentViewer
         * @function
         * @deprecated Please use {@link Atalasoft.Controls.WebDocumentViewer~AnnotationController#createOnPage|annotations.createOnPage} instead.
         */
        createAnnotationOnPage: __createAnnotationPublic,

        /**
         * @instance
         * @memberOf Atalasoft.Controls.WebDocumentViewer
         * @function
         * @deprecated Please use {@link Atalasoft.Controls.WebDocumentViewer~AnnotationController#getFromPage|annotations.getFromPage} instead.
         */
        getAnnotationsFromPage: __getAnnosFromPagePublic,

        /**
         * @instance
         * @memberOf Atalasoft.Controls.WebDocumentViewer
         * @function
         * @deprecated Please use {@link Atalasoft.Controls.WebDocumentViewer~AnnotationController#deleteFromPage|annotations.deleteFromPage} instead.
         */
        deleteAnnotationOnPageAtIndex: __deleteAnnoOnPage,

        /**
         * @instance
         * @memberOf Atalasoft.Controls.WebDocumentViewer
         * @function
         * @deprecated Please use {@link Atalasoft.Controls.WebDocumentViewer~AnnotationController#setDefaults|annotations.setDefaults} instead.
         */
        setAnnotationDefaults: __setAnnotationDefaults,

        /**
         * @instance
         * @memberOf Atalasoft.Controls.WebDocumentViewer
         * @function
         * @deprecated Please use {@link Atalasoft.Controls.WebDocumentViewer~AnnotationController#setImages|annotations.setImages} instead.
         */
        setImages: __setImages,

        /**
         * @instance
         * @memberOf Atalasoft.Controls.WebDocumentViewer
         * @function
         * @deprecated Please use {@link Atalasoft.Controls.WebDocumentViewer~AnnotationController#setStamps|annotations.setStamps} instead.
         */
        setStamps: __setStamps
    };

    Atalasoft.Annotations.AnnotationController.__exposedApi = _exposedApi.annotations;

    // we call this function without params to establish intellisense API
    if (!wdv) {
        return null;
    }

    // #endregion

    var _wdvConfig = internals._config; // parent WebDocumentViewer config object
    var _pages = internals._pages; // internal pageDiv array from the WDV
    var _wdvReady = false;

    var _vp = null; // viewport object
    var _menu = null; // jQuery UI menu for context options
    var _menuConfig = null;
    var _props = null;
    var _annoInit = []; // commands to execute when Raphael is done loading
    var _matrix = null; // top level matrix used for scroll position translation
    var _data = { // data object for controller properties
        annos: [], // array of arrays with annotations that have been added or changed since loading or saving
        activepage: null, // active page
        activeanno: null, // active annotation
        readonly: readonly ? true : false,
        zoom: _wdv.getZoom(),
        getZoom: _wdvInternals.getPageScale,
        getViewerTransform: _wdvInternals.getViewerTransform,
        getPageRotation: _wdvInternals.getPageRotation
    };

    var _defaults = {}; // annotation defaults object
    var _drawing = false; // flag indicating if the controller is waiting to finish drawing an annotation
    var _drawReady = false; // flag indicating if the controller is ready to start drawing an annotation

    // shortcuts for exposed event handlers triggered on the main WDV object
    var _publicEvents = {
        click: 'annotationclicked',
        dblclick: 'annotationdoubleclicked',
        touchstart: 'annotationtouchstart',
        interactend: 'annotationtouchend',
        touchmove: 'annotationtouchmove',
        pinchmove: 'annotationpinchresize',
        rightclick: 'annotationrightclicked',
        mousedown: 'annotationmousedown',
        mousedownleft: 'annotationmousedownleft',
        mousedownright: 'annotationmousedownright',
        mousemove: 'annotationmousemove',
        mouseout: 'annotationmouseout',
        mouseup: 'annotationmouseup',
        mouseover: 'annotationmouseover',
        annocreate: 'annotationcreated',
        annoload: 'annotationloaded',
        moved: 'annotationmoved',
        rotated: 'annotationrotated',
        annoresized: 'annotationresized',
        repaint: 'annotationrepainted',
        layerinserted: 'layerinserted',
        layerremoved: 'layerremoved',
        layermoved: 'layermoved',
        layerschanged: 'layerschanged'
    };

    // #region Dependencies

    // need to grab Raphael asap
    if (typeof Raphael === 'undefined') {
        Atalasoft.Utils._scriptLoader = Atalasoft.Utils.__loadDependencies(_wdvConfig.scripturl, _wdvConfig.allowannotations);
        if (Atalasoft.Utils._scriptLoader) {
            Atalasoft.Utils._scriptLoader.bind({
                scriptsloaded: __initAnnotations
            });
        }
    } else {
        __initAnnotations();
    }

    __extendWDV();

    // stores commands to execute after Raphael has loaded 
    // f: function to execute
    function __addAnnoInit(f) {
        _annoInit.push(f);
    }

    // #endregion

    // #region Control LifeCycle

    function __beforeInit() {
        _selector.setAnnos(_data.annos);
        _selector.setPages(_pages);
    }

    // executes stored commands once Raphael has loaded
    function __initAnnotations() {
        __beforeInit();

        if (typeof Raphael === 'undefined') {
            // Raphael still doesn't exist, there was a problem loading the resource
            __throwError('DependencyError', 'Raphael did not load properly.');

            // can't do anything with annots
            return;
        }

        if (parseFloat(Raphael.version) < minRaphaelVersion) {
            __throwError('DependencyError', 'Raphael versions 2.1 and higher are supported, other versions may cause instability.');
        }

        if (Atalasoft.Utils._raphaelLoader && Atalasoft.Utils._raphaelLoader === _wdv) {
            delete Atalasoft.Utils._raphaelLoader;
        }

        _wdv.trigger('raphaelloaded');

        // adds html object support to Raphael
        __extendRaphael();

        _wdv.trigger('raphaelextended');

        // calls all functions while removing them from the array
        // safer to do it this way than with a for loop
        while (_annoInit.length) {
            _annoInit.shift().call();
        }

        _matrix = Raphael.matrix(1, 0, 0, 1, 0, 0);

        _wdv.bind({
            scroll: __scroll,
            pagerecycled: __recyclePaper,
            pageshown: __pageShown,
            zoomchanged: __zoomChanged,
            pagerotated: __pageRotated
        });

        _menuConfig = {
            //			'Order to Front': function(){ __menuAnnoReorder();},
            //			'Order to Back': function(){ __menuAnnoReorder(0);},
            'Delete': __menuAnnoDelete,
            'Properties': __menuAnnoProperties
        };

        // is WDV ready or still loading scripts?
        if (_wdvInternals._state.initialized) {
            __wdvInitialized();
        } else {
            _wdv.bind({
                initialized: __wdvInitialized
            });
        }
    }

    function __wdvInitialized() {
        _wdvReady = true;

        if (!_data.readonly) {
            _menu = __initMenu(_menuConfig);
            _props = new __propertyDialog();

            if (_wdvConfig.annotations.defaults != null) {
                __setAnnotationDefaults(_wdvConfig.annotations.defaults);
            }

            if (_wdvConfig.annotations.stamps != null) {
                __setStamps(_wdvConfig.annotations.stamps);
            }

            if (_wdvConfig.annotations.images != null) {
                __setImages(_wdvConfig.annotations.images);
            }

            if (_wdvConfig.annotations.custom != null) {
                __setCustom(_wdvConfig.annotations.custom);
            }
        }
    }

    /**
    * [Internal] Disposes memory intensive objects
    * @returns undefined
    */
    function __dispose() {
        _self = null;
        _wdv = null;
        _wdvInternals = null;

        _wdvConfig = null;
        _pages = null;
        _vp = null;
        _menu = null;
        _menuConfig = null;
        _props = null;
        _annoInit.length = 0;

        _data.annos.length = 0;
        _data.activepage = null;
        _data.activeanno = null;
        _data.zoom = null;

        _selector.dispose();
        _selector = null;
    }

    // #endregion

    // #region Extend and fix Raphael

    function __extendRaphael() {
        var ieSVG = Raphael.svg && !Atalasoft.Utils.Browser.Features.foreignObject;

        if (Raphael.vml) {
            Raphael.fn.html = __ERaddHtmlVML;
        } else {
            // if (!Atalasoft.Utils.Browser.Explorer){
            Raphael.fn.html = __ERaddGenericHtmldSVG;
            __ERfixSVGMarker();
        }

        Raphael.fn.atalaImage = __ERaddImageBasedSVG;

        function __ERaddHtmlVML(html, x, y, width, height) {
            var fobj = __ERcreateSVG(this, this, null, 'div', x, y, width, height);
            // we're using an html tag to start with, so we don't need a new inner div
            var div = fobj.node;

            div.innerHTML = html ? html : '';
            fobj.innerDom = div;

            div.style.position = 'absolute';

            fobj.__tsfm = fobj.transform;
            fobj.transform = function () {
                // apply tranform to Raphael so interals have the right matrix
                this.__tsfm.apply(this, arguments);
                this.repaint();

                __ERvmlScalePos(this.attrs);
            };

            function __ERvmlScalePos(attrs) {
                var split = fobj.matrix.split();

                if (attrs.hasOwnProperty('x') && typeof attrs.x !== 'undefined' && attrs.hasOwnProperty('y') && typeof attrs.y !== 'undefined') {

                    var location = {
                        x: attrs.x * split.scalex,
                        y: attrs.y * split.scaley
                    };

                    if (split.rotate !== 0) {
                        var box = Atalasoft.Utils.__calcPathBounds([{ x: attrs.x, y: attrs.y }, { x: attrs.x + attrs.width, y: attrs.y }, { x: attrs.x + attrs.width, y: attrs.y + attrs.height }, { x: attrs.x, y: attrs.y + attrs.height }], fobj.matrix);
                        location = box;
                    }

                    div.style.left = Math.round(location.x) + 'px';
                    div.style.top = Math.round(location.y) + 'px';
                }
            }

            fobj.backgroundColor = function (bg) {
                div.style.backgroundColor = bg;
                this.repaint();
            };

            fobj.repaint = function () {
                div.style.filter = 'progid:DXImageTransform.Microsoft.Chroma(color="' + div.style.backgroundColor + '"); ' + this.matrix.toFilter();
            };

            fobj.__attr = fobj.attr;
            // override Raphael's attr function since it expects VML
            fobj.attr = function (attrs) {
                this.__attr.apply(this, arguments);

                if (attrs) {
                    __ERvmlScalePos(attrs);

                    if (attrs.hasOwnProperty('width')) {
                        div.style.width = attrs.width + 'px';
                    }

                    if (attrs.hasOwnProperty('height')) {
                        div.style.height = attrs.height + 'px';
                    }
                }
            };

            fobj.isHtml = true;

            return fobj;
        }

        function __ERaddImageBasedSVG(html, x, y, width, height) {
            return __ERaddHtmlSVGInternal.call(this, html, x, y, width, height, true);
        }

        function __ERaddGenericHtmldSVG(html, x, y, width, height) {
            return __ERaddHtmlSVGInternal.call(this, html, x, y, width, height);
        }

        function __ERaddHtmlSVGInternal(html, x, y, width, height, forceImage) {
            var xhtmlNS = 'http://www.w3.org/1999/xhtml';
            var xmlNS = 'http://www.w3.org/2000/xmlns/';
            var svgNS = 'http://www.w3.org/2000/svg';

            // IE9+ supports SVG, but doesn't support the foreignObject tag, so 
            // we need to use a different rendering method
            var tag = ieSVG || forceImage ? 'image' : 'foreignObject';

            var fobj = __ERcreateSVG(this, this, svgNS, tag, x, y, width, height);
            var div = null;

            // ieSVG doesn't use the textarea box to render the text
            if (!ieSVG) {
                div = document.createElementNS(xhtmlNS, 'div');

                div.setAttributeNS(xmlNS, 'xmlns', xmlNS);
                div.innerHTML = html ? html : '';
                fobj.node.appendChild(div);
                fobj.isHtml = true;
            }

            fobj.innerDom = div;

            return fobj;
        }

        function __ERcreateSVG(paper, parent, ns, type, x, y, w, h, r) {
            var svg = ns === null ? document.createElement(type) : document.createElementNS(ns, type);

            if (parent.canvas && parent.canvas.appendChild) {
                parent.canvas.appendChild(svg);
            }

            var rsvg = new paper.constructor.el.constructor(svg, paper);
            rsvg.attrs = {
                x: x,
                y: y,
                width: w,
                height: h,
                r: r || 0,
                rx: r || 0,
                ry: r || 0,
                fill: 'none',
                stroke: '#000'
            };

            rsvg.skew = {};

            rsvg.type = type;
            if (type === 'g') {
                rsvg.canvas = rsvg.node;
            }

            for (var key in rsvg.attrs) {
                if (rsvg.attrs.hasOwnProperty(key) && rsvg.attrs[key] !== undefined) {
                    svg.setAttribute(key, rsvg.attrs[key] + '');
                }
            }

            return rsvg;
        }

        // adds a new arrow marker creation function to work around a Raphael marker sharing bug
        function __ERfixSVGMarker() {
            var markers = {
                block: "M5,0 0,2.5 5,5z",
                classic: "M5,0 0,2.5 5,5 3.5,3 3.5,2z",
                diamond: "M2.5,0 5,2.5 2.5,5 0,2.5z",
                open: "M6,1 1,3.5 6,6",
                oval: "M2.5,0A2.5,2.5,0,0,1,2.5,5 2.5,2.5,0,0,1,2.5,0z"
            };
            var markerCounter = {};
            var $ = function $(el, attr) {
                if (attr) {
                    if (typeof el === "string") {
                        el = $(el);
                    }

                    for (var key in attr) {
                        if (attr.hasOwnProperty(key)) {
                            if (key.substring(0, 6) === "xlink:") {
                                el.setAttributeNS("http://www.w3.org/1999/xlink", key.substring(6), String(attr[key]));
                            } else {
                                el.setAttribute(key, String(attr[key]));
                            }
                        }
                    }
                } else {
                    el = Raphael._g.doc.createElementNS("http://www.w3.org/2000/svg", el);
                    if (el.style) {
                        el.style.webkitTapHighlightColor = "rgba(0,0,0,0)";
                    }
                }

                return el;
            };

            // this function was pulled from Raphael, and modified to pass JSHint
            Raphael.fn.addArrow = function (o, value, isEnd) {
                if (o.type === "path") {
                    var values = String(value).toLowerCase().split("-"),
                        p = o.paper,
                        se = isEnd ? "end" : "start",
                        node = o.node,
                        attrs = o.attrs,
                        stroke = attrs["stroke-width"],
                        i = values.length,
                        type = "classic",
                        from,
                        to,
                        dx,
                        refX,
                        attr,
                        w = 3,
                        h = 3,
                        t = 5;

                    while (i--) {
                        switch (values[i]) {
                            case "block":
                            case "classic":
                            case "oval":
                            case "diamond":
                            case "open":
                            case "none":
                                type = values[i];
                                break;
                            case "wide":
                                h = 5;
                                break;
                            case "narrow":
                                h = 2;
                                break;
                            case "long":
                                w = 5;
                                break;
                            case "short":
                                w = 2;
                                break;
                        }
                    }

                    if (type === "open") {
                        w += 2;
                        h += 2;
                        t += 2;
                        dx = 1;
                        refX = isEnd ? 4 : 1;
                        attr = {
                            fill: "none",
                            stroke: attrs.stroke
                        };
                    } else {
                        refX = dx = w / 2;
                        attr = {
                            fill: attrs.stroke,
                            stroke: "none"
                        };
                    }

                    if (o._.WDVarrows) {
                        if (isEnd) {
                            if (o._.WDVarrows.endPath) {
                                markerCounter[o._.WDVarrows.endPath]--;
                            }
                            if (o._.WDVarrows.endMarker) {
                                markerCounter[o._.WDVarrows.endMarker]--;
                            }
                        } else {
                            if (o._.WDVarrows.startPath) {
                                markerCounter[o._.WDVarrows.startPath]--;
                            }
                            if (o._.WDVarrows.startMarker) {
                                markerCounter[o._.WDVarrows.startMarker]--;
                            }
                        }
                    } else {
                        o._.WDVarrows = {};
                    }

                    if (type !== "none") {
                        // makes markerCounter obsolete, no refactoring done yet:
                        var randSuffix = Math.random().toString(36).substring(7),
                            pathId = "dave-marker-" + type,
                            markerId = "dave-marker-" + se + type + w + h + randSuffix;
                        if (!Raphael._g.doc.getElementById(pathId)) {
                            p.defs.appendChild($($("path"), {
                                "stroke-linecap": "round",
                                d: markers[type],
                                id: pathId
                            }));
                            markerCounter[pathId] = 1;
                        } else {
                            markerCounter[pathId]++;
                        }

                        var marker = Raphael._g.doc.getElementById(markerId),
                            use;

                        if (!marker) {
                            marker = $($("marker"), {
                                id: markerId,
                                markerHeight: h,
                                markerWidth: w,
                                orient: "auto",
                                refX: refX,
                                refY: h / 2
                            });
                            use = $($("use"), {
                                "xlink:href": "#" + pathId,
                                transform: (isEnd ? "rotate(180 " + w / 2 + " " + h / 2 + ") " : "") + "scale(" + w / t + "," + h / t + ")",
                                "stroke-width": (1 / ((w / t + h / t) / 2)).toFixed(4)
                            });
                            marker.appendChild(use);
                            p.defs.appendChild(marker);
                            markerCounter[markerId] = 1;
                        } else {
                            markerCounter[markerId]++;
                            use = marker.getElementsByTagName("use")[0];
                        }

                        $(use, attr);
                        var delta = dx * (type !== "diamond" && type !== "oval");
                        if (isEnd) {
                            from = o._.WDVarrows.startdx * stroke || 0;
                            to = Raphael.getTotalLength(attrs.path) - delta * stroke;
                        } else {
                            from = delta * stroke;
                            to = Raphael.getTotalLength(attrs.path) - (o._.WDVarrows.enddx * stroke || 0);
                        }

                        // 'to' was going negative and causing errors in chrome
                        to = to < 0 ? 0 : to;

                        attr = {};
                        attr["marker-" + se] = "url(#" + markerId + ")";
                        if (to || from) {
                            attr.d = Raphael.getSubpath(attrs.path, from, to);
                        }

                        $(node, attr);
                        o._.WDVarrows[se + "Path"] = pathId;
                        o._.WDVarrows[se + "Marker"] = markerId;
                        o._.WDVarrows[se + "dx"] = delta;
                        o._.WDVarrows[se + "Type"] = type;
                        o._.WDVarrows[se + "String"] = value;
                    } else {
                        if (isEnd) {
                            from = o._.WDVarrows.startdx * stroke || 0;
                            to = Raphael.getTotalLength(attrs.path) - from;
                        } else {
                            from = 0;
                            to = Raphael.getTotalLength(attrs.path) - (o._.WDVarrows.enddx * stroke || 0);
                        }

                        if (o._.WDVarrows[se + "Path"]) {
                            $(node, { d: Raphael.getSubpath(attrs.path, from, to) });
                        }
                        delete o._.WDVarrows[se + "Path"];
                        delete o._.WDVarrows[se + "Marker"];
                        delete o._.WDVarrows[se + "dx"];
                        delete o._.WDVarrows[se + "Type"];
                        delete o._.WDVarrows[se + "String"];
                    }

                    for (attr in markerCounter) {
                        if (markerCounter.hasOwnProperty(attr) && !markerCounter[attr]) {
                            var item = Raphael._g.doc.getElementById(attr);
                            if (item) {
                                item.parentNode.removeChild(item);
                            }
                        }
                    }
                }
            };
        }
    }

    // #endregion

    // #region Extend WDV

    // adds Annotation specific methods to WDV 
    function __extendWDV() {
        if (_wdv.typeOf === 'Atalasoft.Controls.WebDocumentViewer') {
            $.extend(_wdv, _exposedApi);
        }
    }

    // event fires when the WDV has scrolled by any amount
    function __scroll(e) {
        _matrix.translate(e.dx, e.dy);
    }

    // throws an error on the parent WDV
    function __throwError(name, msg) {
        _wdv.trigger({
            type: 'throwerror',
            name: name,
            msg: msg
        });
    }

    // event fires when the WDV has finished zooming
    function __zoomChanged(e) {
        _data.zoom = e.zoom;
    }

    // #endregion

    // #region Page Methods

    // these are not exposed to the user, only to the parent WDV
    // owerwrite instance public API to point to same data as internal API. otherwise exception is not clear since data is captured from shared closure
    _self.__exposedApi = _exposedApi.annotations;
    _self.addDrawingSurface = __initPaper;
    _self.removeDrawingSurface = __disposePaper;
    _self.insertLayer = __insertLayer;
    _self.removeLayer = __removeLayer;
    _self.moveLayer = __moveLayer;
    _self.showLayer = __showLayer;

    // sets up a Raphael paper to be used on the given page object
    // pg: jQuery dom object, reusable div container that represents the page
    function __initPaper(pg) {
        if (pg instanceof jQuery) {
            if (typeof Raphael !== 'undefined') {
                // page and the objects below always stay connected, and get reused
                // together when new images are loaded
                pg._paper = Raphael(pg[0]);
                pg._paper.canvas.style.position = 'absolute';
                pg._paper.canvas.style.zIndex = '2';
                if (_wdvConfig.pageborderwidth > 0) {
                    pg._paper.canvas.style.left = _wdvConfig.pageborderwidth + 'px';
                    pg._paper.canvas.style.top = _wdvConfig.pageborderwidth + 'px';
                }

                if (Atalasoft.Utils.Browser.Explorer && parseInt(Atalasoft.Utils.Browser.Version, 10) <= 10) {
                    pg._paper.canvas.style.backgroundColor = 'rgba(255,255,255,0.01)';
                }
                // set to hold annotations separately from other objects
                pg._paper._annos = pg._paper.set();

                // set to hold garbage objects left around by Raphael
                pg._paper._trash = pg._paper.set();

                // need a reference to the 'parent' object
                pg._paper._page = pg;

                // create a matrix and translate it to the offset of the page
                pg._matrix = Raphael.matrix(1, 0, 0, 1, 0, 0);
                pg._matrix.translate(-pg.offset().left, -pg.offset().top);

                // create selection grips for this page
                pg._grips = new Atalasoft.Annotations.Grips(pg, _data);

                var clearAllSelection = function clearAllSelection() {
                    __setActivePage(pg);
                    _selector.deselectPage(pg);
                    __menuHide();
                };

                pg.bind('mousedown', clearAllSelection);

                if (Atalasoft.Utils.Browser.Features.Touch) {
                    pg.bind('touchstart', clearAllSelection);
                }

                pg.bind({
                    pageresize: function pageresize(e) {
                        e.page = pg;__resizePaper(e);
                    },
                    pagezoom: function pagezoom(e) {
                        e.page = pg;__zoomPaper(e);
                    }
                });
            } else {
                // Raphael has not loaded yet
                __addAnnoInit(function () {
                    __initPaper(pg);
                });
            }

            return true;
        }

        return false;
    }

    // sets up a Raphael paper to be used on the given page object
    // pg: jQuery dom object, reusable div container that represents the page
    function __disposePaper(pg) {
        if (pg instanceof jQuery) {
            if (typeof Raphael !== 'undefined') {
                if (pg._paper) {
                    pg._paper._annos = null;
                    pg._paper._page = null;
                    pg._paper = null;
                }

                pg._matrix = null;
                pg._grips = null;
            }

            return true;
        }

        return false;
    }

    // inserts a new layer into the document
    // sourceUrl: string, relative url to get the layer data from
    // source: number or layer, index of the layer in the source document
    // index: number, layer index to insert the layer into
    function __insertLayer(sourceUrl, source, index) {
        if (!sourceUrl && typeof source === 'number') {
            source = __removeLayer(source);
        }

        source = source || [];
        if (index == null) {
            index = _data.annos.length;
        } else if (index < 0) {
            index = 0;
        }

        if (index > _data.annos.length) {
            var oldLength = _data.annos.length;
            _data.annos[index] = source;
            for (var i = oldLength; i < _data.annos.length; ++i) {
                if (!_data.annos[i]) {
                    _data.annos[i] = [];
                }
            }
        } else {
            _data.annos.splice(index, 0, source);
        }

        return index;
    }

    // removes a page from the document
    // index: number, page index to remove the page from
    function __removeLayer(index) {
        if (index < _data.annos.length) {
            return _data.annos.splice(index, 1)[0];
        }

        return null;
    }

    // moves a page at source index to the destination index
    // sourceIndex: number, original index of the page to move
    // destIndex: number, destination index to move the page to
    // returns the actual insert index
    function __moveLayer(sourceIndex, index) {
        return __insertLayer(null, __removeLayer(sourceIndex), index);
    }

    // function used in paper foreach to move the object to the trash set if it's not a grip
    function __raphaelTrasher(raphObj) {
        if (raphObj && raphObj.remove && !raphObj.grip && raphObj.paper && raphObj.paper._trash) {
            raphObj.paper._trash.push(raphObj);
        }
    }

    function __resizePaper(e) {
        e.page._paper.setSize(e.width, e.height);
        e.page._paper.canvas.style.width = e.width;
        e.page._paper.canvas.style.height = e.height;
        __repaintPage(e.page);
    }

    // e.index: index of the shown page
    // e.page: jQuery dom object, reusable div container that represents the page
    function __pageShown(e) {
        __showLayer(e.index, e.page);
    }

    // shows annotations that correspond to the given page
    function __showLayer(index, page) {
        if (typeof Raphael !== 'undefined') {
            if (index < _data.annos.length) {
                __clearPage(page);
                if (_data.annos[index] && _data.annos[index].length) {
                    var ann;

                    for (var i = 0; i < _data.annos[index].length; i++) {
                        ann = _data.annos[index][i];

                        ann._pageindex = index;
                        ann.repaint(page._paper);

                        if (ann.get('selected')) {
                            _selector.select(ann, index, true);
                        }
                    }
                }
            }
        } else {
            __addAnnoInit(function () {
                __showLayer(index, page);
            });
        }
    }

    function __clearPage(page) {
        // clear grips
        page._grips.clear();

        // remove all known annos
        page._paper._annos.remove();
        page._paper._annos.clear();

        // remove anything else except for the grips
        page._paper.forEach(function (obj) {
            if (obj && obj.remove && !obj.grip && obj.paper && obj.paper._trash) {
                obj.paper._trash.push(obj);
            }
        });

        // remove all other objects
        page._paper._trash.remove();
        page._paper._trash.clear();

        __cancelAnnotationDraw();
    }

    // sets the active page of the controller
    // pg: jQuery dom object, reusable div container that represents the page
    function __setActivePage(pg) {
        _data.activepage = pg;
    }

    // recycles paper by clearing annotations for the page
    // e.page: jQuery dom object, reusable div container that represents the page
    function __recyclePaper(e) {
        if (e.page._paper) {
            __clearPage(e.page);

            e.page.append(e.page._paper.canvas);
        }
    }

    function __zoomPaper(e) {
        // when width & height are zeroes, it knocks out IE and FF mind, so they cant resize svg object back.
        if (isFinite(e.width) && isFinite(e.height) && e.width && e.height) {
            _data.zoom = e.zoom;
            e.page._paper.setSize(e.width, e.height);
            e.page._paper.canvas.style.width = e.width;
            e.page._paper.canvas.style.height = e.height;

            e.page._paper.forEach(function (obj) {
                if (obj && obj.transform && !obj.grip) {
                    // need to zoom the stroke since Raphael doesn't
                    if (typeof obj._linewidth !== 'undefined') {
                        obj.attr('stroke-width', obj._linewidth * _data.zoom);
                    }

                    var clip = obj.attr('clip-rect');
                    if ((typeof clip === 'undefined' ? 'undefined' : _typeof(clip)) === 'object' && typeof clip.length === 'number') {
                        if (Atalasoft.Utils.Browser.Explorer && parseInt(Atalasoft.Utils.Browser.Version, 10) < 9) {
                            // IE versions before 9 need screen space values, not annotation space
                            for (var i = 0; i < clip.length; i++) {
                                clip[i] = clip[i] / e.prevzoom * e.zoom;
                            }
                        }

                        obj.attr('clip-rect', clip);
                    }
                }
            });

            __repaintPage(e.page);
        }
    }

    function __pageRotated(e) {
        __repaintPage(e.page);
    }

    function __repaintPage(page) {
        if (page) {
            if (page._index >= 0 && _data.annos[page._index]) {
                for (var i = 0; i < _data.annos[page._index].length; i++) {
                    _data.annos[page._index][i].repaint();
                }

                if (page) {
                    page._grips.repaint();
                }
            }
        }
    }

    // #endregion

    // #region Menu and Property Dialog 

    function __propertyDialog() {
        var _Pself = this;
        var _Pdiv = $('<div />');
        var _Pcontent = $('<div />');
        var _Pann = null;
        var _Pprops = null;
        var _PshownProps = {
            fill: {
                color: true,
                opacity: true
            },

            rotation: true,
            outline: {
                color: true,
                opacity: true,
                width: true,
                startcap: { // array of values 'TEXT:value' indicates options available for drop down
                    style: ['None:none', 'Arrow:open', 'Filled Arrow:block', 'Filled Ellipse:oval', 'Filled Diamond:diamond'],
                    width: ['medium', 'long', 'short'],
                    height: ['medium', 'wide', 'narrow']
                },
                endcap: {
                    style: ['None:none', 'Arrow:open', 'Filled Arrow:block', 'Filled Ellipse:oval', 'Filled Diamond:diamond'],
                    width: ['medium', 'long', 'short'],
                    height: ['medium', 'wide', 'narrow']
                }
            },

            text: {
                font: {
                    bold: true,
                    italic: true,
                    //					strike: true,
                    //					underline: true,
                    color: true,
                    family: true,
                    size: true
                }
            }
        };

        function __Pinit() {
            _Pcontent.appendTo(_Pdiv);
            _Pdiv.dialog({
                minWidth: 320,
                dialogClass: 'atala-ui',
                resizable: false,
                autoOpen: false,
                buttons: {
                    'Ok': __Phide,
                    'Reset': __Preset,
                    'Cancel': __Pcancel
                }
            });
        }

        _Pself.show = __Pshow;
        function __Pshow(ann) {
            _Pann = ann;

            // empty content and properties
            _Pcontent.empty();
            _Pprops = {};

            // deep copy shown properties from data object to allow cancel
            for (var propName in _PshownProps) {
                if (_PshownProps.hasOwnProperty(propName)) {
                    var prop = {};
                    prop[propName] = _Pann.get(propName);

                    $.extend(true, _Pprops, prop);
                }
            }

            // populate property grid
            __PwalkData(_Pann.get(), '', _PshownProps);

            _Pdiv.dialog('open');
        }

        _Pself.hide = __Phide;
        function __Phide() {
            _Pdiv.dialog('close');
        }

        _Pself.isVisible = __PisVisible;
        function __PisVisible() {
            return _Pdiv.dialog('isOpen');
        }

        _Pself.cancel = __Pcancel;
        function __Pcancel() {
            __Preset();
            __Phide();
        }

        _Pself.reset = __Preset;
        function __Preset() {
            _Pann.set(_Pprops, true);
            _Pann.updateView();
            _Pann.repaint();

            _Pcontent.empty();
            __PwalkData(_Pann.get(), '', _PshownProps);
            __PresetGrips();
        }

        function __PwalkData(data, pfx, shown) {
            // need to nest this function so it has a closure reference to the data for this anno
            function __PeditorChanged(e) {
                if (this.value && typeof this.value !== 'boolean') {
                    if (typeof data[this.title] === 'number') {
                        var pval = parseFloat(this.value);

                        if (!isNaN(pval) && this.title === 'rotation' && pval !== data[this.title]) {
                            // set with data setter so corresponding recalculations will be triggered
                            _Pann.set({ rotation: pval });
                            _Pann.repaint();
                        } else if (this.title === 'opacity' && pval >= 0 && pval <= 1 || this.title !== 'opacity' && this.value >= 0) {
                            data[this.title] = pval;
                        } else {
                            this.value = data[this.title];
                        }
                    } else {
                        data[this.title] = this.value;
                    }
                } else if (e && typeof this.value === 'boolean') {
                    data[this.title] = e.target.id.indexOf('true') >= 0;
                } else {
                    // no input, set it back
                    this.value = data[this.title];
                }

                _Pann.updateView();
                _Pann.repaint();
                __PresetGrips();
            }

            // recursively walk through all properties contained in the data object
            for (var i in data) {
                if (data.hasOwnProperty(i)) {
                    if (_typeof(data[i]) === 'object') {
                        var key = i !== 'text' ? __Pcapitalize(i) : '';

                        if (shown[i] && (i !== 'text' || i === 'text' && _Pann.get('type') === 'text')) {
                            __PwalkData(data[i], (pfx ? pfx + ' ' : pfx) + key, shown[i]);
                        }
                    } else {
                        if (i === 'type') {
                            _Pdiv.dialog('option', 'title', __Pcapitalize(data[i].replace('fillrect', 'rectangle')) + ' Annotation Properties');
                        } else if (shown[i]) {
                            var prop = $('<div/>');

                            var input = __PpropEditor(i, data[i], __PeditorChanged, shown[i]);

                            prop.addClass('ui-helper-clearfix atala-ui-dialog-clearfix');
                            prop.css({
                                overflow: 'hidden'
                            });

                            input.appendTo(prop);
                            __Plabel(prop, (pfx ? pfx + ' ' : pfx) + __Pcapitalize(i) + ':');
                            prop.appendTo(_Pcontent);
                        }
                    }
                }
            }
        }

        function __PpropEditor(name, val, fnc, shown) {
            var valType = typeof val === 'undefined' ? 'undefined' : _typeof(val);
            var editor = null;

            if ($.isArray(shown)) {
                // options available, make drop down
                editor = $('<select/>').attr({
                    'title': name
                });

                $.each(shown, function (key, value) {
                    var val = value;
                    var txt = value;
                    var options = value.split(':');

                    if (options.length > 1) {
                        txt = options[0];
                        val = options[1];
                    }

                    editor.append($("<option/>", {
                        // this is intentional, shown is an array, so key is just a number
                        value: val,
                        text: txt
                    }));
                });

                editor.change(fnc);
                editor.val(val);
            } else if (valType === 'string' || valType === 'number') {
                editor = $('<input/>').attr({
                    'type': 'text',
                    'title': name
                });

                editor.val(val);
                editor.change(fnc);

                editor.focus(function () {
                    this.select();
                    this._focused = true;
                });

                editor.mouseup(function (e) {
                    if (this._focused) {
                        e.preventDefault();
                        this._focused = false;
                    }
                });
            } else if (valType === 'boolean') {
                var setName = 'bool' + name;
                editor = $('<div/>').attr({
                    'title': name
                });

                __Pradio(editor, setName + true, setName, 'True', val);
                __Pradio(editor, setName + false, setName, 'False', !val);

                editor.buttonset();
                editor.change(fnc);
                editor[0].value = val;
            } else {
                editor = $('<div>' + val + '</div>');
            }

            editor.css({
                'float': 'right'
            });

            return editor;
        }

        function __Pradio(p, id, name, text, val) {
            p.append($('<input/>').attr({
                'type': 'radio',
                'id': id,
                'name': name,
                'checked': val
            }));

            p.append($('<label/>').attr({
                'for': id
            }).text(text));
        }

        function __Plabel(p, text) {
            p.append($('<span/>').text(text));
        }

        function __Pcapitalize(s) {
            return s.charAt(0).toUpperCase() + s.slice(1);
        }

        function __PresetGrips() {
            var aobj = _Pann.getObject();
            if (aobj && aobj.paper && aobj.paper._page) {
                aobj.paper._page._grips.repaint();
            }
        }
        __Pinit();

        return _Pself;
    }

    // shows context menu if it exists
    // e.x: int, x position of the mouse click relative to the page
    // e.y: int, y position of the mouse click relative to the page
    function __menuShow(e) {
        if (_menu) {
            //if the active anno is readonly, we don't want the user to edit properties
            if (_data.activeanno.get('readonly')) {
                _menu.children(':contains(Properties)').unbind('click').children('a, div').css('color', '#cdc9c9');
            } else {
                var propDiv = _menu.children(':contains(Properties)');

                if (propDiv.data('events') === undefined || !('click' in propDiv.data('events'))) {
                    propDiv.bind('click', __menuAnnoProperties);
                }

                propDiv.children('a').css('color', '#000000');
            }

            // need to add the menu to the DOM if it's not already
            if (_menu.closest().length === 0) {
                _vp.prepend(_menu);
            }

            var menuLoc = {
                x: e.x - 6,
                y: e.y - 6
            };

            _menu.css({
                'left': menuLoc.x,
                'top': menuLoc.y
            });

            _menu.show();
            _menu.visible = true;
        }
    }

    function __generateMenu(e) {
        if (_menu) {
            if (_menu.visible) {
                __menuHide();
            }

            // we need create a new one
            _menu.remove();
        }

        var menuCopy = $.extend(true, {}, _menuConfig);
        _wdv.trigger('contextmenu', [_data.activeanno.getClonedData(), menuCopy]);

        if (!$.isEmptyObject(menuCopy)) {
            for (var i in menuCopy) {
                if (menuCopy.hasOwnProperty(i)) {
                    menuCopy[i] = __wrapMenuMethod(menuCopy[i]);
                }
            }

            _menu = __initMenu(menuCopy);
        } else {
            _menu = null;
        }

        __menuShow(e);
    }

    // hides the context menu if it exists
    function __menuHide() {
        if (_menu) {
            _menu.hide();
            _menu.visible = false;
        }
    }

    function __initMenu(menuConfig) {
        var menu = _wdvInternals.createMenu(menuConfig);
        menu.css({
            'position': 'fixed',
            'z-index': 99999
        });

        menu.mouseleave(__menuHide);
        menu.visible = false;
        return menu;
    }

    function __wrapMenuMethod(func) {
        return function () {
            __menuHide();
            return func.call(this, _data.activeanno.getClonedData());
        };
    }

    function __menuAnnoDelete() {
        var findex = _data.activepage ? _data.activepage._index : 0;

        if (_data.annos[findex]) {
            var z = $.inArray(_data.activeanno, _data.annos[findex]);

            if (z !== -1) {
                _data.activeanno = null;
                __deleteAnnoAtIndex(z, findex);
            }
        }

        __menuHide();
    }

    function __menuAnnoProperties() {
        __menuHide();
        _props.show(_data.activeanno);
    }

    /*	TODO: flesh out reorder menu
        function __menuAnnoReorder(i){
            __menuHide();
        }
    */

    // #endregion

    // #region Exposed Methods

    _self.clear = __clearAnnotations;
    _self.createAnnotation = __createAnnotation;
    _self.deleteAnnoOnPage = __deleteAnnoOnPage;
    _self.drawAnnotation = __drawAnnotation;
    _self.getAnnosFromPage = __getAnnosFromPagePublic;
    _self.setStamps = __setStamps;
    _self.setAnnotationDefaults = __setAnnotationDefaults;
    _self.setImages = __setImages;
    _self.setCustom = __setCustom;

    /**
    * Clears the annotations and related data from all pages
    */
    function __clearAnnotations() {
        if (_data.annos.length > 0) {
            _data.annos.length = 0;

            if (_pages) {
                for (var i = 0; i < _pages.length; i++) {
                    // clear selected annotations
                    _pages[i]._grips.clear();

                    // remove anything else except for the grips
                    _pages[i]._paper.forEach(__raphaelTrasher);

                    // remove all other objects
                    _pages[i]._paper._trash.remove();
                    _pages[i]._paper._trash.clear();

                    // remove all known annos
                    _pages[i]._paper._annos.remove();
                    _pages[i]._paper._annos.clear();
                }
            }

            _wdv.trigger({
                type: 'annotationscleared'
            });
        }
    }

    /**
    * Creates an annotation on the desired page with the given annotation data.
    * @param aConfig: object, Key value pairs representing annotation data.
    * @param pgNum: number, The zero based index of the page the annotation should be created on.
    * @param callback: function, Function to be called when the operation has completed.
    * @returns object: Atalasoft.Annotations.Annotation.
    */
    function __createAnnotation(aConfig, pgNum, callback) {
        var annConfig = {};

        if (aConfig.multiview) {
            annConfig = aConfig;
        } else {
            if (aConfig && aConfig.type && _defaults[aConfig.type]) {
                $.extend(true, annConfig, _defaults[aConfig.type]);
            }

            $.extend(true, annConfig, aConfig);
        }

        var newAnno = new Atalasoft.Annotations.Annotation(annConfig, _data);
        newAnno._pageindex = pgNum;

        if (typeof _data.annos[pgNum] === 'undefined') {
            _data.annos[pgNum] = [];
        }

        _data.annos[pgNum].push(newAnno);
        _wdvInternals.redrawPageFromIndex(pgNum, true);

        if (typeof callback === 'function') {
            callback(newAnno);
        }

        __bindAnnoEvents(newAnno);

        return newAnno;
    }

    // Need a public facing function to return a clone, not internal annotation object.
    // callback receives internal annotation object, so not intended for user.
    function __createAnnotationPublic(aConfig, pgNum, callback) {
        var clonedAnno = __createAnnotation(aConfig, pgNum, callback).getClonedData();

        _wdv.trigger({
            type: _publicEvents.annocreate,
            anno: clonedAnno,
            annotation: clonedAnno,
            page: pgNum
        });

        return clonedAnno;
    }

    function __deleteAnnoOnPage(pgNum, annIndex) {
        __deleteAnnoAtIndex(annIndex, pgNum);
    }

    // made a separate function because the documented inputs are reversed
    /**
    * Deletes an annotation on the given z-index and zero based page index.
    * @param annIndex: number, Zero based z-index of the annotation.
    * @param pgNum: number, Zero based page index the annotation is located on.
    */
    function __deleteAnnoAtIndex(annIndex, pgNum) {
        var delanno = _data.annos[pgNum].splice(annIndex, 1)[0];

        if (_data.activepage && _data.activepage._paper) _data.activepage._paper._annos.exclude(delanno.getObject());

        if (_data.activeanno === delanno) _data.activeanno = null;

        delanno.dispose();
        if (_data.activepage && _data.activepage._grips) _data.activepage._grips.repaint();

        _wdv.trigger({
            type: 'annotationdeleted',
            page: pgNum,
            index: annIndex
        });
    }

    function __getAnnosFromPagePublic(pageNum) {
        var annArray = [];
        if (_data.annos.length === 0 || typeof _data.annos[pageNum] === 'undefined') {
            return annArray;
        }

        for (var i = 0; i < _data.annos[pageNum].length; i++) {
            annArray[i] = _data.annos[pageNum][i].getClonedData();
        }

        return annArray;
    }

    function __findFromClone(clone, pageIndex) {
        var i;
        if (isFinite(pageIndex)) {
            if (pageIndex < _data.annos.length) {
                for (i = 0; i < _data.annos[pageIndex].length; ++i) {
                    if (_data.annos[pageIndex][i].isCloneSource(clone)) {
                        return _data.annos[pageIndex][i];
                    }
                }
            }
        } else {
            for (i = 0; i < _data.annos.length; ++i) {
                var ann = __findFromClone(clone, i);
                if (ann) {
                    return ann;
                }
            }
        }

        return null;
    }

    function __insertLayerPublic(sourceUrl, sourceIndex, index, callback) {
        index = __insertLayer(sourceUrl, sourceIndex, index);

        if (typeof callback === 'function') {
            callback();
        }

        _wdv.trigger({
            type: _publicEvents.layerinserted,
            srcurl: sourceUrl,
            srcindex: sourceIndex,
            index: index
        });

        _wdv.trigger(_publicEvents.layerschanged);
    }

    function __removeLayerPublic(index, callback) {
        var layer = __removeLayer(index);

        if (typeof callback === 'function') {
            callback();
        }

        _wdv.trigger({
            type: _publicEvents.layerremoved,
            layer: layer,
            index: index
        });

        _wdv.trigger(_publicEvents.layerschanged);
    }

    function __moveLayerPublic(sourceIndex, destIndex, callback) {
        destIndex = __moveLayer(sourceIndex, destIndex);

        if (typeof callback === 'function') {
            callback();
        }

        _wdv.trigger({
            type: _publicEvents.layermoved,
            srcindex: sourceIndex,
            destindex: destIndex
        });

        _wdv.trigger(_publicEvents.layerschanged);
    }

    function __setAnnotationDefaults(aConfig) {
        _wdvConfig.annotations.defaults = aConfig;

        for (var i = 0; i < aConfig.length; i++) {
            if (typeof aConfig[i].type === 'string') {
                _defaults[aConfig[i].type] = aConfig[i];
            }
        }

        return _wdv;
    }

    function __setStamps(sConfig) {
        _wdvConfig.annotations.stamps = sConfig;

        for (var i = 0; i < sConfig.length; i++) {
            __validateStampConfig(sConfig[i]);
        }

        if (_wdvReady) {
            var bConfig = { type: 'button', id: _wdvInternals._id + '_toolbar_Button_Stamp', icon: 'stamp', tooltip: 'Draw Stamp', text: '' };
            var span = _wdvInternals.createDropDownButton(bConfig);

            bConfig.onclick = _wdvInternals.drawAnnotation;
            _wdvInternals.createDropDownMenu(span, bConfig, sConfig);
        }

        return _wdv;
    }

    function __setImages(iConfig) {
        _wdvConfig.annotations.images = iConfig;

        for (var i = 0; i < iConfig.length; i++) {
            __validateImageConfig(iConfig[i]);
        }

        if (_wdvReady) {
            var bConfig = { type: 'button', id: _wdvInternals._id + '_toolbar_Button_Image', icon: 'image', tooltip: 'Draw Image', text: '' };
            var span = _wdvInternals.createDropDownButton(bConfig);

            bConfig.onclick = _wdvInternals.drawAnnotation;
            _wdvInternals.createDropDownMenu(span, bConfig, iConfig);
        }

        return _wdv;
    }

    /**
    * Sets the default annotation properties for initially created custom annotations.  This accepts the same input as the main config.
    * @param cConfig: array, An array of JSON objects representing custom annotation types.
    * @returns object: Atalasoft.Controls.WebDocumentViewer
    */
    function __setCustom(cConfig) {
        _wdvConfig.annotations.custom = cConfig;

        for (var i = 0; i < cConfig.length; i++) {
            __validateCustomConfig(cConfig[i]);
        }

        if (_wdvReady) {
            var bConfig = { type: 'button', id: _wdvInternals._id + '_toolbar_Button_Custom', icon: 'image', tooltip: 'Draw Custom', text: '' };
            var span = _wdvInternals.createDropDownButton(bConfig);

            bConfig.onclick = _wdvInternals.drawAnnotation;
            _wdvInternals.createDropDownMenu(span, bConfig, cConfig);
        }

        return _wdv;
    }

    function __showTextAnnoEditorPublic(annotation) {
        return __showTextAnnoEditor(annotation, true);
    }

    function __hideTextAnnoEditorPublic(annotation) {
        return __showTextAnnoEditor(annotation, false);
    }

    function __showTextAnnoEditor(annotation, shown) {
        if (annotation.type === 'text' && annotation) {
            var page = annotation.getPageIndex();
            var annObj = __findFromClone(annotation, page);
            if (shown) {
                var visible = annotation.visible;
                if (visible) {
                    if (_wdvInternals.isPageInView(page)) {
                        __doShowEditor(annObj, page);
                    } else {
                        _wdv.showPage(annotation.getPageIndex(), function () {
                            __doShowEditor(annObj, page);
                        });
                    }
                }
            } else {
                annObj.trigger('hideeditor');
            }
        }
    }

    function __doShowEditor(annotation, page) {
        if (annotation) {
            if (annotation.get('selectable') !== false) {
                _selector.select(annotation, page, false);
            }

            annotation.trigger('showeditor');
        }
    }

    // #endregion

    // #region Private Exposed Methods

    _self.dispose = __dispose;

    /**
    * [Internal] Gets debug info object
    * @returns debug info object if available, otherwise null
    */
    _self.__getDebugInfo = __getDebugInfo;
    function __getDebugInfo() {
        var info = {};
        $.extend(true, info, {
            data: _data,
            defaults: _defaults,
            drawing: _drawing,
            drawready: _drawReady,
            matrix: _matrix,
            menu: _menu,
            menuconfig: _menuConfig,
            pages: _pages,
            props: _props,
            viewport: _vp
        });

        return info;
    }

    /**
    * [Internal] Links the annotation data between two controls
    * @param linker internal object of type __LVlinker
    * @returns undefined
    */
    _self.__linkAnnotations = __linkAnnotations;
    function __linkAnnotations(linker) {
        if (linker) {
            if (!linker._annos) {
                linker._annos = _data.annos;
            } else if ($.isArray(linker._annos)) {
                _data.annos = linker._annos;
            }
        }
    }

    _self.setViewPort = __setViewPort;
    function __setViewPort(obj) {
        if (obj) {
            if (!(obj instanceof jQuery)) {
                obj = $(obj);
            }

            _vp = obj;
        }
    }

    // #endregion

    // #region Annotation Drawing

    // sets up the viewport to create an annotation
    // aConfig: key value pairs sent
    // callback: function to call when the annotation has finished drawing
    // cancelled: function to call when the annotation draw was cancelled
    function __drawAnnotation(aConfig, configPrecedesDefault, callback, cancelled) {
        // if we're still drawing, don't draw another one
        if (_drawing) {
            return null;
        }

        var config = $.extend(true, {}, aConfig);
        // starts with default anno, and overlays aConfig defaults
        if (aConfig && aConfig.type && _defaults[aConfig.type]) {
            config = $.extend(true, config, _defaults[aConfig.type]);

            if (configPrecedesDefault) config = $.extend(true, config, aConfig);
        }

        // explicitly remove rotation since draw through UI don't support it.
        config.rotation = 0;
        // previous annotation was never added to anything, we should dispose of it
        if (_data.activeanno && _data.activeanno.getObject() === null) {
            __cancelAnnotation();
        }

        // prepare drawing surfaces
        __prepareForDraw();

        // create the new annototation from data
        _data.activeanno = new Atalasoft.Annotations.Annotation(config, _data);
        _data.activeanno.bind({
            drawn: __finishAnnotation,
            cancelled: __cancelAnnotation
        });

        if (typeof callback === 'function') {
            __annotationCreatedCallback = callback;
        }

        if (typeof cancelled === 'function') {
            __annotationCancelledCallback = cancelled;
        }

        return _data.activeanno;
    }

    function __drawAnnotationPublic(aConfig, callback, cancelled) {
        _wdvInternals._controllers.mouseTool.setTool(Atalasoft.Utils.MouseToolType.None, Atalasoft.Utils.MouseToolType.None);

        var completedCallback = function completedCallback() {
            _wdvInternals._controllers.mouseTool.setTool(Atalasoft.Utils.MouseToolType.Pan, Atalasoft.Utils.MouseToolType.None);
            if (typeof callback === 'function') callback();
        };

        var cancelledCallback = function cancelledCallback() {
            _wdvInternals._controllers.mouseTool.setTool(Atalasoft.Utils.MouseToolType.Pan, Atalasoft.Utils.MouseToolType.None);
            if (typeof cancelled === 'function') cancelled();
        };

        __drawAnnotation(aConfig, true, completedCallback, cancelledCallback);
    }

    function __annotationCreatedCallback() {
        // intentionally left blank, this gets overwritten
    }

    function __annotationCancelledCallback() {}
    // intentionally left blank, this gets overwritten


    // prepares all pages for drawing, since we don't know where the user will draw
    function __prepareForDraw() {
        if (!_drawReady) {
            _vp.bind('mousedown', __startAnnotationDraw);

            if (Atalasoft.Utils.Browser.Features.Touch) {
                _vp.bind('touchstart', __startAnnotationDraw);
            }

            for (var i = 0; i < _pages.length; i++) {
                _pages[i]._draw.toFront();
            }

            _drawReady = true;
        }
    }

    // resets all pages to state before prepareForDraw was called
    function __cleanupDraw() {
        if (_drawReady) {
            _vp.unbind('mousedown', __startAnnotationDraw);

            if (Atalasoft.Utils.Browser.Features.Touch) {
                _vp.unbind('touchstart', __startAnnotationDraw);
            }

            for (var i = 0; i < _pages.length; i++) {
                _pages[i]._draw.reset();
            }

            _drawReady = false;
        }
    }

    // draws an annotation with the mouse
    function __startAnnotationDraw(e) {
        _drawing = true;

        // don't want to start drawing this annotation again if a mousedown happens'
        _vp.unbind('mousedown', __startAnnotationDraw);

        if (Atalasoft.Utils.Browser.Features.Touch) {
            _vp.unbind('touchstart', __startAnnotationDraw);
        }

        var clonedData = _data.activeanno.getClonedData();
        _wdv.trigger({
            type: 'annotationdrawstart',
            annotation: clonedData,
            ann: clonedData
        });

        _data.activeanno._pageindex = _data.activepage._index;
        _data.activeanno.startDraw(e, _data.activepage._paper, {});

        // fix for IE7, _draw layer height sizes to 0 only on first text anno create. WTF
        if (Atalasoft.Utils.Browser.Explorer && parseInt(Atalasoft.Utils.Browser.Version, 10) < 8) {
            _data.activepage._draw.height(_data.activepage.height());
        }
    }

    function __finishAnnotation() {
        __finishDrawing();
        __annotationCreated(_data.activeanno);

        // fix for IE7, _draw layer height sizes to 0 only on first text anno create. WTF
        if (Atalasoft.Utils.Browser.Explorer && parseInt(Atalasoft.Utils.Browser.Version, 10) < 8) {
            _data.activepage._draw.height('100%');
        }
    }

    function __cancelAnnotation() {
        _data.activeanno.dispose();
        _data.activeanno = null;

        if (_drawing) {
            __finishDrawing(true);
        }
    }

    function __cancelAnnotationDraw() {
        if (_drawReady) {
            if (_drawing) {
                // user has started drawing the annotation
                __cancelAnnotation();
            } else {
                if (_data.activeanno) {
                    _data.activeanno.dispose();
                    _data.activeanno = null;
                }

                __cleanupDraw();
            }

            // call the callback, and set it back to empty
            __annotationCancelledCallback({
                annotation: null
            });

            __annotationCancelledCallback = function __annotationCancelledCallback() {};
        }
    }

    function __finishDrawing(cancelled) {
        _drawing = false;

        __cleanupDraw();
        var clonedData = cancelled ? null : _data.activeanno.getClonedData();
        _wdv.trigger({
            type: 'annotationdrawend',
            annotation: clonedData,
            ann: clonedData,
            cancelled: cancelled ? true : false
        });
    }

    function __annotationCreated(anno) {
        var page = _data.activepage;
        var findex = page ? page._index : 0;

        if (_data.annos[findex]) {
            _data.annos[findex].push(anno);
        } else {
            _data.annos[findex] = [anno];
        }

        _data.activeanno.unbind({
            drawn: __finishAnnotation,
            cancelled: __cancelAnnotation
        });

        __bindAnnoEvents(_data.activeanno);

        _selector.select(_data.activeanno, page, false);

        // call the callback, and set it back to empty
        __annotationCreatedCallback({
            annotation: anno
        });

        __annotationCreatedCallback = function __annotationCreatedCallback() {};
        var clonedData = anno.getClonedData();
        _wdv.trigger({
            type: _publicEvents.annocreate,
            anno: clonedData,
            annotation: clonedData,
            page: findex
        });
    }

    // #endregion

    // #region Annotation Events

    function __bindAnnoEvents(anno) {

        function __triggerPublicEvent(e) {
            var clonedData = anno.getClonedData();

            _wdv.trigger({
                type: _publicEvents[e.type],
                anno: clonedData,
                annotation: clonedData
            });
        }

        anno.bind({
            dragstart: function dragstart() {
                var clonedData = anno.getClonedData();
                _wdv.trigger({
                    type: 'annotationdragstart',
                    ann: clonedData,
                    annotation: clonedData
                });
            },
            dragend: function dragend() {
                var clonedData = anno.getClonedData();
                _wdv.trigger({
                    type: 'annotationdragend',
                    annotation: clonedData,
                    ann: clonedData
                });
            },
            interactstart: function interactstart(e) {
                if (!_data.activepage || _data.activepage._paper !== anno.getObject().paper) {
                    __setActivePage(anno.getObject().paper._page);
                }

                _data.activeanno = anno;
            },
            selected: __selectAnnotation,
            deselected: __selectAnnotation,
            reselected: __selectAnnotation,
            contextmenu: __generateMenu,
            serverrenderurlrequested: __serverRenderUrlRequested,

            moved: __triggerPublicEvent,
            rotated: __triggerPublicEvent,
            annoresized: __triggerPublicEvent,
            interactend: __triggerPublicEvent,
            touchstart: __triggerPublicEvent,
            touchmove: __triggerPublicEvent,
            pinchmove: __triggerPublicEvent,
            click: __triggerPublicEvent,
            dblclick: __triggerPublicEvent,
            rightclick: __triggerPublicEvent,
            mousedown: __triggerPublicEvent,
            mousedownleft: __triggerPublicEvent,
            mousedownright: __triggerPublicEvent,
            mousemove: __triggerPublicEvent,
            mouseout: __triggerPublicEvent,
            mouseup: __triggerPublicEvent,
            mouseover: __triggerPublicEvent,
            repaint: __triggerPublicEvent
        });
    }

    function __selectAnnotation(e) {
        var page = e.page || e.pageindex >= 0 ? e.pageindex : _data.activepage;

        var pageDiv = _selector.resolvePage(page);
        if (pageDiv) // the selection api is able to work on both page div and page index(if page is not in DOM in the moment).
            page = pageDiv;

        if (e.type === 'selected' || e.type === 'reselected') {
            _data.activeanno = e.ann;

            _selector.select(e.ann, page, e.append);

            if (_props && _props.isVisible()) {
                _props.show(e.ann);
            }
        } else {
            _selector.deselect(e.ann, page, e.append);

            if (_props && _props.isVisible()) {
                _props.cancel();
            }
        }

        if (pageDiv && pageDiv._grips) pageDiv._grips.repaint();
    }

    function __serverRenderUrlRequested(e) {
        var callback = e.complete;
        var url = __stringifyAnnotationData(e.data);

        if (typeof callback === 'function') {
            callback.call(url);
        }
    }

    // #endregion

    // #region Ajax/Json Methods

    // these are not exposed to the user, only to the parent WDV
    _self.stringifyChanges = __stringifyChanges;
    _self.stringifyAnnotationData = __stringifyAnnotationData;
    _self.createHandlerRequest = __createHandlerRequest;
    _self.makeHandlerRequest = __makeHandlerRequestAsync;
    _self.loadAnnotationsUrl = __loadAnnosAsync;
    _self.loadAnnotations = __onAnnotationsLoaded;

    function __stringifyChanges(s) {
        var arr = [];
        for (var key in _data.annos) {
            if (_data.annos.hasOwnProperty(key)) {
                arr[key] = {
                    items: []
                };

                var pageRotation = 0;
                var scale = _wdvInternals.getPageScale(key);
                var m = Raphael.matrix();

                if (_wdvInternals._config.persistrotation) {
                    pageRotation = _wdvInternals.getPageRotation(key);
                    m = _wdvInternals.getViewerTransform(key);
                    var reverseZoom = 1 / scale;
                    m.scale(reverseZoom, reverseZoom, 0, 0);
                    m.e *= reverseZoom;
                    m.f *= reverseZoom;
                }

                for (var z in _data.annos[key]) {
                    if (_data.annos[key].hasOwnProperty(z)) {
                        var annData = $.extend(true, {}, _data.annos[key][z].get());

                        if (annData.rotation || pageRotation) {
                            var box = _data.annos[key][z].getBox();
                            var halfWidth = box.width / 2;
                            var halfHeight = box.height / 2;

                            var transform = Raphael.matrix();
                            var dataAnnoTransform = _data.annos[key][z].getTransform();
                            transform.add(m.a, m.b, m.c, m.d, m.e, m.f);
                            transform.add(dataAnnoTransform.a, dataAnnoTransform.b, dataAnnoTransform.c, dataAnnoTransform.d, dataAnnoTransform.e, dataAnnoTransform.f);
                            // center point is visually invariant to rotation,
                            // so it depends only on page rotation.
                            var targetCenter = {
                                x: transform.x(box.x + halfWidth, box.y + halfHeight),
                                y: transform.y(box.x + halfWidth, box.y + halfHeight)
                            };

                            var dx = targetCenter.x - halfWidth - box.x;
                            var dy = targetCenter.y - halfHeight - box.y;

                            if (annData.points) {
                                for (var i = 0; i < annData.points.length; i++) {
                                    if (annData.type === 'line') {
                                        // desktop renderers doesn't show rotation grip for 'lines' and seems like not expect rotation on them
                                        // so setting line rotation knocks out their mind. ignoring line rotation.
                                        var x = transform.x(annData.points[i].x, annData.points[i].y);
                                        annData.points[i].y = transform.y(annData.points[i].x, annData.points[i].y);
                                        annData.points[i].x = x;
                                    } else {
                                        annData.points[i].x += dx;
                                        annData.points[i].y += dy;
                                    }
                                }
                            } else if (annData.type === 'custom' || !annData.points) {
                                annData.x += dx;
                                annData.y += dy;
                            }

                            annData.rotation = annData.type !== 'line' ? (annData.rotation + pageRotation) % 360 : 0;
                        }

                        arr[key].items[z] = annData;
                        __convertColorProps(annData);
                    }
                }
            }
        }
        return JSON.stringify(arr);
    }

    function __stringifyAnnotationData(data) {
        __convertColorProps(data);
        return JSON.stringify(data);
    }

    function __convertColorProps(data) {
        for (var i in data) {
            if (i === 'color' && data[i] != null) {
                var col = Raphael.getRGB(data[i]);
                if (col.error) {
                    col.hex = '#000000';
                }

                data[i] = col.hex;
            } else if (i !== 'points' && _typeof(data[i]) === 'object') {
                __convertColorProps(data[i]);
            }
        }
    }

    // annUrl should stay second parameter for generic document loading code in viewer
    function __createHandlerRequest(serverUrl, annUrl, docurl, offset, length) {
        docurl = docurl || _wdv.config.documenturl;
        var hRequest = {
            type: 'annodata',
            serverurl: serverUrl,
            query: '?atalaanndata=',
            method: 'GET',
            data: {
                atala_annurl: annUrl,
                atala_docurl: docurl,
                atala_a_ofs: offset,
                atala_a_len: length
            },
            cancel: false,
            info: {
                layers: [],
                offset: offset || 0,
                length: length,
                error: undefined
            }
        };

        // workaround for IE that encodes null as string
        for (var key in hRequest.data) {
            if (hRequest.data.hasOwnProperty(key) && hRequest.data[key] === null) {
                hRequest.data[key] = undefined;
            }
        }

        return hRequest;
    }

    function __makeHandlerRequestAsync(hRequest, preserveExisting, callback) {
        if (typeof preserveExisting === "function") {
            callback = preserveExisting;
            preserveExisting = false;
        }
        if (!preserveExisting) {
            // keep rest of the pages untouched if we are doing only partial reload.
            __clearAnnotations();
        }

        //  defined inline so we have a closure reference to callback
        function __complete(info) {
            if (hRequest.info.docIndex !== undefined) {
                info.offset = hRequest.info.docIndex;
            }

            // clear this particular page since loading end up in error.
            if (!info.layers && info.error && preserveExisting) {
                for (var i = info.offset; i < info.offset + hRequest.info.length; i++) {
                    _data.annos[i] = [];
                }
            }

            // we assume that all requests made through this method are for annotations
            __onAnnotationsLoaded(info);

            // only execute the callback if it exists
            if (typeof callback === 'function') {
                callback.call();
            }
        }

        _wdvInternals.makeHandlerRequest(hRequest, __complete, __complete);
    }

    // contacts the server for annotation info, JSON is returned to __onAnnotationsLoaded
    function __loadAnnosAsync(serverUrl, annUrl, docUrl, offset, length, docIndex, callback) {
        var args = Array.prototype.slice.call(arguments);
        callback = args.pop();
        if (typeof callback !== 'function') {
            args.push(callback);
        }
        serverUrl = args.shift();
        annUrl = args.shift();
        docUrl = args.shift();
        offset = args.shift();
        length = args.shift();
        docIndex = args.shift();

        var hRequest = __createHandlerRequest(serverUrl, annUrl, docUrl, offset, length);
        if (docIndex !== undefined) {
            hRequest.info.docIndex = docIndex;
        }

        __makeHandlerRequestAsync(hRequest, offset >= 0 && length >= 1, callback);
    }

    function __onAnnotationsLoaded(info) {
        if (info) {
            if (typeof Raphael !== 'undefined') {
                var annsLoadedEvt = {
                    type: 'annotationsloaded'
                };

                if (info.layers) {
                    for (var i = 0; i < info.layers.length; i++) {
                        info.offset = info.offset || 0;
                        var fIndex = info.offset + i;

                        if (_data.annos[fIndex] && _data.annos[fIndex].length > 0) {
                            _data.annos[fIndex].length = 0;
                        } else {
                            _data.annos[fIndex] = [];
                        }

                        var layer = info.layers[i];
                        if (layer) {
                            layer._index = isFinite(layer._index) && layer._index >= 0 ? layer._index : fIndex;

                            // workaround to support layer visibility setting that could came from another viewers. set only when explicitly requested.
                            layer.visible = layer.visible !== undefined ? layer.visible : true;
                            if (layer.items) {
                                for (var j = 0; j < layer.items.length; j++) {
                                    layer.items[j].visible = layer.items[j].visible && layer.visible;
                                    _data.annos[fIndex][j] = new Atalasoft.Annotations.Annotation(layer.items[j], _data);
                                    _data.annos[fIndex][j]._pageindex = layer._index;

                                    var data = _data.annos[fIndex][j].getClonedData();
                                    _wdv.trigger({
                                        type: _publicEvents.annoload,
                                        anno: data,
                                        annotation: data
                                    });

                                    __bindAnnoEvents(_data.annos[fIndex][j]);
                                }
                            }
                        }
                    }
                } else if (info.error) {
                    annsLoadedEvt.error = info.error;
                }

                annsLoadedEvt.offset = info.offset;
                annsLoadedEvt.length = info.layers ? info.layers.length : 0;

                _wdv.trigger(annsLoadedEvt);
            } else {
                __addAnnoInit(function () {
                    __onAnnotationsLoaded(info);
                });
            }
        }
    }

    // #endregion

    // #region Input Validation

    // fixes the stamp annotation config
    function __validateStampConfig(cfg) {
        cfg.type = 'stamp';

        if (cfg.text) {
            __validateTextConfig(cfg.text);

            // stamps cannot be edited via UI
            cfg.text.readonly = true;
        }

        return cfg;
    }

    // fixes the text properties of an annotation config
    function __validateTextConfig(cfg) {
        if (cfg && cfg.font && cfg.font.size) {
            // we don't support unit based fonts
            cfg.font.size = parseFloat(cfg.font.size);
        }

        return cfg;
    }

    // fixes the image annotation config
    function __validateImageConfig(cfg) {
        cfg.type = 'image';

        return cfg;
    }

    // checks that the custom annotation is in good form
    function __validateCustomConfig(cfg) {
        cfg.type = 'custom';
    }

    // #endregion
};
'use strict';

//
//  Annotation Grips class
//
//  This source code is property of Atalasoft, Inc. (http://www.atalasoft.com/)
//  Permission for usage and modification of this code is only permitted 
//  with the purchase of a source code license.
//
//  Change History:
//	09-20-12	D. Cilley		File Created, moved over relevant grips related notes:
//	04-11-12	D. Cilley		FB 12978: Fixed a bug that would zoom grips as well as annotations
//	04-17-12	D. Cilley		FB 12978: Fixed bugs introduced by original fix
//	04-17-12	D. Cilley		FB 13173: Fixed a bug that would show grips on the wrong page
//	04-18-12	D. Cilley		FB 13174: Fixed a bug that would not allow deselecting annotations
//	04-19-12	D. Cilley		FB 13175: Fixed a bug that would throw js errors when selected annotation were recycled
//	09-20-12	D. Cilley		FB 13589: Moved grips to separate file.
//	11-15-12	J. Burch		FB 13772: Fixed a visual bug that made an unmovable annotation appeared to also not be selectable.
//	11-19-12	J. Burch		FB 13791: Fixed a visual bug with grips after annotation was programmatically resized.
//	03-21-13	J. Burch		FB 14047: Fixed a bug where annotation's 'selected' property was not being updated
//	02-21-13	D. Cilley		FB 14065: Added JSHint options and fixes to comply with JSHint warnings.
//	04-04-13	D. Cilley		FB 13993, 13996, 13997: Added AnnotationSelector for document level selecting.
//	12-03-13	D. Cilley		FB 14071: Removed jquery.browser dependency.
//	12-17-14	D. Cilley		Bug 550581: Added locally scoped non-conflict jQuery.
//	07-10-15	D. Cilley		Bug 607560: Fixed an offset bug related to pageborderwidth fix.
//-------------------------------------------------------------------------------------------------

// JSHint options and globals
/*jshint eqnull: true, undef: true, bitwise: false, jquery: true, browser: true, es3:false */

// Atalasoft global constructors and functions
/*global Atalasoft */

// Local globals
/*global Raphael */

// creates a psuedo group object with grips for selecting and manipulating annotations
// pg: jQuery dom object, reusable div container that represents the page
Atalasoft.Annotations.Grips = function (pg, cdata) {
    var $ = Atalasoft.$;
    var GripSide = 8;
    var RotationGripOffset = 25;
    var GripCursorSectorOffset = -360 / 16; // grips axis shift angle - describes when grip cursor style changes
    var _Gd = { e: 0, ne: 315, n: 270, nw: 225, w: 180, sw: 135, s: 90, se: 45 }; // grip direction
    var _GLoc = {}; //{ e: [1, 0], ne: [0.5, 0.5], n: [0, 1], nw: [-0.5, 0.5], w: [-1, 0], sw: [-0.5, -0.5], s: [0, -1], se: [0.5, -0.5] };	// grip pos on unit circle
    var _GSectors = {}; // grip sectors that maps to cursor style

    var _Cdata = cdata;
    var _Ggrips = pg._paper.set(); // grips group
    var _Gselected = pg._paper.set(); // raphael object selection group
    var _Gannos = []; // annotation selection group
    var _GRotateGrip = null;
    var _Gop = {}; // grips origin point
    var _GhR,
        _GvR = null; // resize axes
    var _Grect = { // grip bounding rect
        x: 0,
        y: 0,
        width: 1,
        height: 1,
        x2: 1,
        y2: 1
    };

    var _Gevts = {
        dragstart: function dragstart() {// fires when raphael object detects dragging has started
        },
        dragmove: function dragmove() {
            _Ggrips.hide();
        },
        moved: function moved() {
            // fires after annotation handles dragend
            __Gupdate();
            _Ggrips.show();
            for (var i = 0; i < _Gannos.length; ++i) {
                var data = _Gannos[i].get();
                if (data.hasOwnProperty('rotatable') && !data.rotatable) {
                    _GRotateGrip.hide();
                }
            }
        }
    };

    __GInit();

    function __GInit() {
        var m;
        // create a grip for each direction, and add it to the grips group
        for (var k in _Gd) {
            if (_Gd.hasOwnProperty(k)) {
                var obj = pg._paper.rect(0, 0, GripSide, GripSide);
                var grip = __Ggrip(obj, k);
                _Ggrips.push(grip);
                _Ggrips[_Gd[k]] = grip;

                m = Raphael.matrix();
                m.rotate(_Gd[k]);
                // fill the locations of the grips on unit circle
                _GLoc[k] = {
                    x: m.x(1, 0),
                    y: m.y(1, 0)
                };
            }
        }

        _GRotateGrip = __GCreateRotateGrip();
        __GinitCursorSectors();
    }

    function __Ggrip(g, dir) {
        g.attr({
            fill: '#FFFFE1',
            cursor: (dir || 'ne') + '-resize'
        });

        g.grip = true;
        g.rect = g.getBBox();
        g.hide();

        // center the grip on the given point
        g.center = function (px, py, scale, transform) {
            scale = scale || 1;
            var w = GripSide / scale;
            var h = GripSide / scale;
            var r = w / 2;
            // need to compensate grid scaling before transforming all grips to annotation box.
            var xcrisp = Math.round(w / 2) + 0.5;
            var ycrisp = Math.round(h / 2) + 0.5;
            if (Atalasoft.Utils.Browser.Explorer && parseInt(Atalasoft.Utils.Browser.Version, 10) > 8) {
                // for some reason, IE9+ renders horizontal lines crisp already, but not vertical
                ycrisp -= 0.5;
            }

            var x = Math.round(px) - xcrisp;
            var y = Math.round(py) - ycrisp;
            // subtract half a point and half a grip to center and make the edges crisp
            if (!this.ellipse) {
                this.attr({
                    x: x,
                    y: y,
                    width: w,
                    height: h,
                    'stroke-width': 1
                });
            } else {
                x += r;
                this.attr({
                    cx: x,
                    cy: y,
                    r: r,
                    'stroke-width': 1
                });
            }

            // raphael ignores stroke setting when transform scale is 1. so previous attr value will remain. resetting it forcibly.
            this.node.setAttribute('stroke-width', 1);
            this.transform(transform);
        };

        // if this isn't a directional grip, we don't need to interact with it
        if (dir) {
            g.d = { key: dir, n: ~dir.indexOf('n'), s: ~dir.indexOf('s'), w: ~dir.indexOf('w'), e: ~dir.indexOf('e') };

            g.mousedown(function (e) {
                return __GstartBox(e, this.d);
            });
        }

        return g;
    }

    function __GCreateRotateGrip() {
        var obj = pg._paper.circle(0, 0, GripSide / 2);
        var g = __Ggrip(obj).attr({
            fill: '#00FF40',
            cursor: 'pointer'
        });

        g.ellipse = true;
        _Ggrips.push(g);
        g.mousedown(function (e) {
            return __GStartRotate(e, g);
        });
        return g;
    }

    // takes an Annotation object
    this.push = function (o) {
        if (!__contains(o)) {
            _Gannos.push(o);
            _Gselected.push(o.getObject());

            if (o.get('selectable') === true) {
                __Gbind(o);
            }

            __Gupdate();

            _Ggrips.toFront();
            _Ggrips.show();
        }
    };

    this.contains = __contains;
    function __contains(o) {
        return $.inArray(o, _Gannos) !== -1;
    }

    // takes an Annotation object
    this.remove = function (o) {
        for (var i = 0; i < _Gannos.length; i++) {
            if (_Gannos[i] === o) {
                _Gannos.splice(i, 1);
            }
        }

        _Gselected.exclude(o.getObject());
        __Gunbind(o);
    };

    // clear should only be used to switch pages, it doesn't deselect annos
    this.clear = __Gclear;
    function __Gclear() {
        for (var i = 0; i < _Gannos.length; i++) {
            __Gunbind(_Gannos[i]);
        }

        _Gannos.length = 0;
        _Gselected.clear();
        _Ggrips.hide();
    }

    function __Gbind(o) {
        o.getEventObject().bind(_Gevts);
    }

    function __Gunbind(o) {
        o.getEventObject().unbind(_Gevts);
    }

    this.repaint = __Gupdate;
    function __Gupdate() {
        if (_Gselected.length > 0) {
            __GupdateBounds();
        } else {
            if (_Gannos.length > 0) {
                __Gclear();
            } else {
                _Ggrips.hide();
            }
        }
    }

    this.updateCursor = __GUpdateCursor;
    function __GUpdateCursor(angle) {
        for (var gd in _Gd) {
            if (_Gd.hasOwnProperty(gd)) {
                __GsetCursor(_Ggrips[_Gd[gd]], angle);
            }
        }
    }

    // gets the bounding rectangle from the selected raphael objects
    function __GupdateBounds() {
        if (_Gselected.length > 0) {
            // if we have a single el selected - let's put transformed grips.
            var r = _Gselected.length === 1 ? _Gannos[0].getBox() : _Gselected.getBBox(); // set doesn't support second overload(i.e. overload for original box).

            _Grect.x = r.x;
            _Grect.y = r.y;
            _Grect.width = r.width;
            _Grect.height = r.height;
            _Grect.x2 = r.x + r.width;
            _Grect.y2 = r.y + r.height;
            _Grect.xmid = r.x + r.width / 2;
            _Grect.ymid = r.y + r.height / 2;

            // set grip positions
            __GplaceGrips();
        }
    }

    // This gets called to redraw the grips to the new size
    function __GsetRect(x, y, w, h) {
        // vertical resize?
        if (_GvR === 0) {
            _Grect.x = x;
            _Grect.width = Math.max(w, 1); // sizes below 1 are bad
            _Grect.x2 = x + _Grect.width;
            _Grect.xmid = x + _Grect.width / 2;
        }

        // horizontal resize?
        if (_GhR === 0) {
            _Grect.y = y;
            _Grect.height = Math.max(h, 1); // sizes below 1 are bad
            _Grect.y2 = y + _Grect.height;
            _Grect.ymid = y + _Grect.height / 2;
        }

        // set grip positions
        __GplaceGrips();
    }

    // This gets called to fit the object to the grips
    function __GfitAnnos() {
        for (var i = 0; i < _Gannos.length; i++) {
            _Gannos[i].transform(_Grect.x, _Grect.y, _Grect.width, _Grect.height);
        }
    }

    // places the grips along the bounding rect
    function __GplaceGrips() {
        var isSingleAnno = _Gselected.length === 1;
        var m = Raphael.matrix();
        var scale = 1;
        var transform = '';
        var viewerTransform = _Cdata.getViewerTransform(pg._index);

        m.add(viewerTransform.a, viewerTransform.b, viewerTransform.c, viewerTransform.d, viewerTransform.e, viewerTransform.f);
        if (isSingleAnno) {
            var annoTransform = _Gannos[0].getTransform();
            if (annoTransform) m.add(annoTransform.a, annoTransform.b, annoTransform.c, annoTransform.d, annoTransform.e, annoTransform.f);
            scale = _Cdata.getZoom(pg._index);
            transform = m.toTransformString(true);
        }

        _Ggrips[_Gd.nw].center(_Grect.x, _Grect.y, scale, transform); // nw
        _Ggrips[_Gd.ne].center(_Grect.x2, _Grect.y, scale, transform); // ne
        _Ggrips[_Gd.sw].center(_Grect.x, _Grect.y2, scale, transform); // sw
        _Ggrips[_Gd.se].center(_Grect.x2, _Grect.y2, scale, transform); // se
        _Ggrips[_Gd.n].center(_Grect.xmid, _Grect.y, scale, transform); // n
        _Ggrips[_Gd.w].center(_Grect.x, _Grect.ymid, scale, transform); // w 
        _Ggrips[_Gd.e].center(_Grect.x2, _Grect.ymid, scale, transform); // e
        _Ggrips[_Gd.s].center(_Grect.xmid, _Grect.y2, scale, transform); // s

        var data = _Gannos[0].get();
        if (data.rotatable || !data.hasOwnProperty('rotatable')) {
            _GRotateGrip.show();
            _GRotateGrip.center(_Grect.xmid, _Grect.y - RotationGripOffset / scale, scale, transform);
        } else {
            _GRotateGrip.hide();
        }
        var annRotation = _Gannos.length === 1 ? _Gannos[0].get().rotation : 0;
        __GUpdateCursor(annRotation + _Cdata.getPageRotation(pg._index));
    }

    function __GgetMousePos(e) {
        var po = pg.offset();
        var so = Atalasoft.Utils.getSVGOffset(pg._paper.canvas, pg);
        var p = {
            x: e.pageX - (po.left + so.left),
            y: e.pageY - (po.top + so.top)
        };

        return p;
    }

    function __GStartRotate(e) {
        e.stopPropagation();

        // multi-resize not allowed yet
        if (_Gannos.length !== 1 || _Gselected.length !== 1) {
            return;
        }

        for (var i = 0; i < _Gannos.length; i++) {
            var ann = _Gannos[i].get();
            if (ann.hasOwnProperty('rotatable') && !ann.rotatable) {
                return;
            }
        }

        $.extend(_Gop, _Grect);
        var m = _Gannos[0].getTransform();
        var xmid = m.x(_Gop.xmid, _Gop.ymid);
        _Gop.ymid = m.y(_Gop.xmid, _Gop.ymid);
        _Gop.xmid = xmid;

        $(pg._paper.canvas).bind({
            mouseup: __GEndRotate,
            mousemove: __GRotateBox
        });
    }

    function __GRotateBox(e) {
        e.stopPropagation();

        var p = __GpointToDocSpace(__GgetMousePos(e));
        // inverted counter-clockwise rotation angle, that is angle of mouse to annotation center - 90(which is grip initial angle).
        // i.e. long formula is 360 - (Math.atan2(-(p.y - _Gop.ymid), p.x - _Gop.xmid) * 180 / Math.PI - 90)
        var angle = Math.atan2(p.y - _Gop.ymid, p.x - _Gop.xmid) * 180 / Math.PI + 90;
        if (_Gannos.length === 1) {
            _Gannos[0].set({ rotation: angle });
            _Gannos[0].repaint();
        }
        pg._grips.repaint();
        return false;
    }

    function __GEndRotate(e) {
        e.stopPropagation();

        $(pg._paper.canvas).unbind({
            mouseup: __GEndRotate,
            mousemove: __GRotateBox
        });

        if (_Gannos.length === 1) {
            _Gannos[0].getEventObject().trigger('rotated');
        }
        return false;
    }

    // caclulates offsets based on the grip clicked
    function __GstartBox(e, d) {
        e.stopPropagation();

        // multi-resize not allowed yet
        if (_Gannos.length > 1) {
            return;
        }

        for (var i = 0; i < _Gannos.length; i++) {
            if (!_Gannos[i].get('resizable')) {
                return;
            }
        }

        $.extend(_Gop, _Grect);

        _GvR = _Gd[d.key] === _Gd.n || _Gd[d.key] === _Gd.s ? 1 : 0;
        _GhR = _Gd[d.key] === _Gd.w || _Gd[d.key] === _Gd.e ? 1 : 0;

        if (d.n || _GhR === 1) {
            _Gop.y = _Gop.y2;
        }

        if (d.w) {
            _Gop.x = _Gop.x2;
        }

        $(pg._paper.canvas).bind({
            mouseup: __GendBox,
            mousemove: __GsizeBox
        });

        return false;
    }

    // method for sizing bounding box
    function __GsizeBox(e) {
        e.stopPropagation();

        if (_Gselected.length === 1) {
            // now only single anno resize supported. if want multiple - 
            // we just need to store grips transform, since raphael set doesn't store it
            var p = __GpointToAnnoSpace(__GgetMousePos(e));

            var nw = Math.abs(p.x - _Gop.x);
            var nh = Math.abs(p.y - _Gop.y);
            var nx = p.x < _Gop.x ? _Gop.x - nw : _Gop.x;
            var ny = p.y < _Gop.y ? _Gop.y - nh : _Gop.y;

            __GsetRect(nx, ny, nw, nh);
            __GfitAnnos();
        }
        return false;
    }

    function __GendBox(e) {
        e.stopPropagation();

        for (var i = 0; i < _Gannos.length; i++) {
            _Gannos[i].getEventObject().trigger('resized');
            _Gannos[i].getEventObject().trigger('annoresized');
            _Gannos[i].repaint();
        }

        if (_Gselected.length > 0) {
            __GupdateBounds();
        }

        $(pg._paper.canvas).unbind({
            mouseup: __GendBox,
            mousemove: __GsizeBox
        });

        return false;
    }

    function __GpointToAnnoSpace(p) {
        if (_Gselected.length > 0) {
            var obj = _Gselected[0].type === 'set' ? _Gselected[0][0] : _Gselected[0];
            var srcMatrix = obj.matrix.invert();
            var docPt = {
                x: srcMatrix.x(p.x, p.y),
                y: srcMatrix.y(p.x, p.y)
            };
            return docPt;
        }
        return p;
    }

    function __GpointToDocSpace(p) {
        var matrix = _Cdata.getViewerTransform(pg._index).invert();
        var newx = matrix.x(p.x, p.y);
        p.y = matrix.y(p.x, p.y);
        p.x = newx;
        return p;
    }

    function __GsetCursor(grip, rotation) {
        if (grip && grip.d && grip.d.key) {
            var m = Raphael.matrix();
            m.rotate(rotation);
            var pos = {
                x: m.x(_GLoc[grip.d.key].x, _GLoc[grip.d.key].y),
                y: m.y(_GLoc[grip.d.key].x, _GLoc[grip.d.key].y)
            };

            for (var s in _GSectors) {
                if (_GSectors.hasOwnProperty(s)) {
                    if (__GisInsideSector(pos, _GSectors[s].start, _GSectors[s].end)) {
                        grip.attr({ cursor: (_GSectors[s].dir || 'ne') + '-resize' });
                        break;
                    }
                }
            }
        }
    }

    function __GinitCursorSectors() {
        var m = Raphael.matrix();
        m.rotate(GripCursorSectorOffset, 0, 0);
        var makeGripSector = function makeGripSector(dirStart, dirEnd) {
            // cursor changes at the middle of each of grip sectors(we have 8). 
            // so to find changing axes, we need to shift grips axes to 360/16.
            var sector = {
                dir: dirEnd,
                start: {
                    x: m.x(_GLoc[dirStart].x, _GLoc[dirStart].y),
                    y: m.y(_GLoc[dirStart].x, _GLoc[dirStart].y)
                },
                end: {
                    x: m.x(_GLoc[dirEnd].x, _GLoc[dirEnd].y),
                    y: m.y(_GLoc[dirEnd].x, _GLoc[dirEnd].y)
                }
            };
            return sector;
        };

        // manually set order of processing, because grips are connected here - first is the beginning of the sector and next is the end.
        var gdirections = ['e', 'ne', 'n', 'nw', 'w', 'sw', 's', 'se'];
        for (var i = 0; i < gdirections.length - 1; ++i) {
            if (i === 0) {
                _GSectors[gdirections[i]] = makeGripSector(gdirections[gdirections.length - 1], gdirections[i]);
            }

            _GSectors[gdirections[i + 1]] = makeGripSector(gdirections[i], gdirections[i + 1]);
        }
    }

    function __GisInsideSector(point, sectorStart, sectorEnd) {
        function areClockwise(v1, v2) {
            return -v1.x * v2.y + v1.y * v2.x > 0;
        }

        return !areClockwise(sectorStart, point) && areClockwise(sectorEnd, point);
    }
};
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

//
//  Annotation Selector class
//
//  This source code is property of Atalasoft, Inc. (http://www.atalasoft.com/)
//  Permission for usage and modification of this code is only permitted 
//  with the purchase of a source code license.
//
//  Change History:
//	04-04-13	D. Cilley		File Created.
//	04-04-13	D. Cilley		FB 13993, 13996, 13997: Added AnnotationSelector for document level selecting.
//	12-17-14	D. Cilley		Bug 550581: Added locally scoped non-conflict jQuery.
//	07-02-15	D. Cilley		Bug 625845: Added dispose method.
//-------------------------------------------------------------------------------------------------

// JSHint options and globals
/*jshint eqnull: true, undef: true, jquery: true, browser: true, es3:false */

// Atalasoft global constructors and functions
/*global Atalasoft */

// Local globals

// Handles all of the selection based operations for the WebAnnotationController
// annos: internal annos array object from the AnnotationController
// pages: internal pageDiv array from the WDV
Atalasoft.Annotations.AnnotationSelector = function (annos, pages) {
    var $ = Atalasoft.$;
    var _self = this;
    var _annos = annos; // root annotations array from the AnnotationController
    var _pages = pages; // visible pages array from the WDV
    var _selected = []; // array of nested arrays of currently selected annotations

    // #region Internal Methods
    _self.dispose = __dispose;
    _self.select = __selectAnno;
    _self.deselect = __deselectAnno;
    _self.setAnnos = __setAnnos;
    _self.setPages = __setPages;
    _self.resolvePage = __resolvePage;

    // set internal objects
    function __setAnnos(sAnnos) {
        _annos = sAnnos;
    }

    function __setPages(sPages) {
        _pages = sPages;
    }

    // disposes of objects
    function __dispose() {
        _self = null;
        _annos = null;
        _pages = null;
        _selected.length = 0;
    }

    // selects an annotation or array of annotations
    function __selectAnno(o, fIndex, append) {
        __select(true, o, fIndex, append);
    }

    // deselects an annotation or array of annotations
    function __deselectAnno(o, fIndex, append) {
        __select(false, o, fIndex, append);
    }

    // ***************************************************
    // All select operations must route through this event
    // ***************************************************
    // select: boolean, true to select, false to deselect
    // o: object[s], Annotation object or array of Annotations
    // fIndex: integer/object, frame index or page from _pages array
    // append: boolean, false clears the other selected annotations on this frame index  
    function __select(select, o, fIndex, append) {
        var arr = [].concat(o);
        var page = null;
        var ann, pos;

        // get page and frame index values from input
        page = __resolvePage(fIndex);
        if (page === fIndex && page !== null) {
            fIndex = page._index;
        }
        // need to deselect before we select
        if (!append) {
            __deselectAllPage(page || fIndex);
        }

        // select all annotations given
        for (var i = 0; i < arr.length; i++) {
            ann = arr[i];
            pos = $.inArray(ann, _selected[fIndex]); // array position, if selected

            if (pos >= 0) {
                // in selected
                if (!select && _selected[fIndex][pos] === ann) {
                    // need to remove?
                    // remove it from the selected array
                    _selected[fIndex].splice(pos, 1);
                }
            } else {
                // not in selected array
                if (select) {
                    // need to add?
                    if (_selected[fIndex]) {
                        _selected[fIndex].push(ann);
                    } else {
                        _selected[fIndex] = [ann];
                    }
                }
            }

            // it's possible to select annotations that aren't on a page
            if (page) {
                if (select) {
                    page._grips.push(ann);
                } else {
                    page._grips.remove(ann);
                }
            }

            // toggle the selected flag if it's not equal
            if (ann.get('selected') !== select) {
                // this call should be last, since it will fire select in the controller
                ann.toggleSelected({
                    append: true,
                    pageindex: fIndex,
                    page: page
                });
            }
        }
    }

    // ********************************************************
    // All page select operations must route through this event
    // ********************************************************
    // select: boolean, true to select, false to deselect
    // fIndex: integer/object, frame index or page from _pages array
    function __selectPage(select, fIndex) {
        var i = (typeof fIndex === 'undefined' ? 'undefined' : _typeof(fIndex)) === 'object' ? fIndex._index : fIndex;

        if (_annos[i]) {
            __select(select, _annos[i], fIndex, true);
        }
    }

    function __getClonedAnnotations(arr) {
        var cloned = [];

        for (var i = 0; i < arr.length; i++) {
            if (arr[i]) {
                cloned[i] = [];
                for (var z = 0; z < arr[i].length; z++) {
                    cloned[i][z] = arr[i][z].getClonedData();
                }
            }
        }

        return cloned;
    }

    // finds the visible page corresponding to the given frame index, if any 
    function __resolvePage(fIndex) {
        var page = null;
        if ((typeof fIndex === 'undefined' ? 'undefined' : _typeof(fIndex)) === 'object') {
            page = fIndex;
        } else {
            fIndex = Math.max(fIndex, 0);

            var pgsrch = $.grep(_pages, function (pg) {
                return pg._index === fIndex;
            });

            if (pgsrch.length >= 1) {
                page = pgsrch[0];
            }
        }
        return page;
    }

    // #endregion

    // #region WDV Exposed Methods
    _self.deselectAll = __deselectAll;
    _self.deselectPage = __deselectAllPage;
    _self.getAnnotations = __getAnnotations;
    _self.getSelected = __getSelected;
    _self.selectAll = __selectAll;
    _self.selectPage = __selectAllPage;

    function __selectAllPage(fIndex) {
        __selectPage(true, fIndex);
    }

    function __deselectAllPage(fIndex) {
        __selectPage(false, fIndex);

        var page = __resolvePage(fIndex);
        if (page && page._grips) page._grips.repaint();
    }
    function __selectAll() {
        for (var pi = 0; pi < _annos.length; pi++) {
            __selectAllPage(pi);
        }
    }

    function __deselectAll() {
        for (var pi = 0; pi < _annos.length; pi++) {
            __deselectAllPage(pi);
        }
    }

    function __getSelected() {
        return __getClonedAnnotations(_selected);
    }

    /**
    * Gets an array of all annotation data objects.
    * @returns array of arrays containing annotation data objects for each page of the document.
    */
    function __getAnnotations() {
        return __getClonedAnnotations(_annos);
    }

    // #endregion
};
'use strict';

//
//  Annotation class
//
//  This source code is property of Atalasoft, Inc. (http://www.atalasoft.com/)
//  Permission for usage and modification of this code is only permitted 
//  with the purchase of a source code license.
//
//  Change History:
//	02-09-12	D. Cilley		File Created.
//	03-02-12	D. Cilley		FB 12982: Fixed annotation creation in Firefox
//	05-03-12	D. Cilley		Replaced ellipse with a path
//	09-17-12	D. Cilley		FB 13597: Handled new selectchange event to improve mobile.
//	10-19-12	J. Burch		FB 13694: Fixing bug with recycled annotations
//	10-19-12	D. Cilley		FB 13690: Added getClonedData with update function
//	10-22-12	D. Cilley		FB 13694: Found a problem with original fix, added viewchanged event
//	11-05-12	D. Cilley		FB 13742, 13744: Fixed bugs in creating annotations.
//	11-07-12	J. Burch		FB 13748: Fixing problem with getClonedData
//	11-15-12	J. Burch		FB 13772: Fixing the movable, selectable, and resizable properties.
//	01-29-13	D. Cilley		FB 13946: Fixed default path opacity for lines, polys, and freehand.
//	02-15-13	D. Cilley		FB 13970: Removed stray commas to fix annotation drawing in IE7.
//	02-21-13	D. Cilley		FB 14065: Added JSHint options and fixes to comply with JSHint warnings.
//	02-22-13	D. Cilley		FB 13989: Rolled back a change in Arepaint from changeset 58054.
//	03-01-13	D. Cilley		FB 14066: TextAnnotations now use HTML rendering for all browsers.
//	03-21-13	J. Burch		FB 13973: Refactored __ArebindUIEvents so that events were not being thrown away.
//	04-04-13	D. Cilley		FB 13993, 13996, 13997: Added AnnotationSelector for document level selecting.
//	07-31-13	D. Cilley		FB 14245: Added arrowhead functionality.
//	08-30-13	D. Cilley		FB 14274: Added multiview for Thumbnailer functionality.
//	11-13-13	D. Cilley		FB 14477: Fixed internal default setting on multiview annotations.
//	12-03-13	D. Cilley		FB 14071: Removed jquery.browser dependency.
//	12-17-14	D. Cilley		Bug 550581: Added locally scoped non-conflict jQuery.
//-------------------------------------------------------------------------------------------------

// JSHint options and globals
/*jshint eqnull: true, undef: true, jquery: true, browser: true */

// Atalasoft global constructors and functions
/*global Atalasoft */

// Local globals
/*global Raphael */

Atalasoft.Annotations.Annotation = function (settings, cdata) {
    var $ = Atalasoft.$;
    var _Cdata = cdata; // controller data object (do not modify values)
    var _Aself = this;
    var _Aeve = new Atalasoft.Annotations.EventHelper(_Aself);
    var _Aboundeve = null; // UI events bound 
    var _Aobj = null; // Raphael obj
    var _Atxt = null; // TextAnnotationUI obj
    var _Aglw = null; // Raphael glow obj
    var _Adraw = null; // DrawHandler obj
    var _Acustom = null; // Custom renderer obj if needed
    var _Aclone = null;
    var _bbox = null; // bounding box for annotation


    var _Adata = settings.multiview ? settings : __createDefaultAnnotationData();

    // default properties for specific annotation types
    var _Adefaults = {
        highlight: {
            readonly: true,
            fill: {
                color: 'yellow',
                opacity: 0.5
            },
            outline: {
                opacity: 0
            }
        },

        image: {
            readonly: true,
            fill: {
                color: null
            },
            outline: {
                opacity: 0
            }
        },

        rectangle: {
            fill: {
                opacity: 0
            }
        },

        stamp: {
            readonly: true,
            cornerradius: 0,
            text: {
                autoscale: true
            }
        },

        line: {
            fill: {
                color: null
            },
            outline: {
                opacity: 1,
                startcap: {
                    width: 'medium', // Raphael arrow width: wide, narrow, medium
                    height: 'medium', // Raphael arrow length: long, short, medium
                    style: 'none' // Raphael arrow type: classic, block, open, oval, diamond, none
                },
                endcap: {
                    width: 'medium', // Raphael arrow width
                    height: 'medium', // Raphael arrow length
                    style: 'none' // Raphael arrow type
                }
            }
        },

        lines: {
            fill: {
                color: null
            },
            outline: {
                opacity: 1
            }
        },

        freehand: {
            fill: {
                color: null
            },
            outline: {
                opacity: 1
            }
        },

        ellipse: {},
        fillrect: {},
        polygon: {},
        text: {}
    };

    // default UI event handling 
    var _AuiEvents = {};

    __Ainit();
    function __Ainit() {
        // multiview annotations don't need defaults set
        if (!settings.multiview) {
            __AinitData(settings.type);
        }
        __AsetDataInternal(settings, true);
        __recalculateTransform();

        if (_Adata.type === 'custom') {
            _Acustom = new Atalasoft.Annotations.AnnotationCustomRenderer(_Adata, _Aeve);
        }

        _Adraw = new Atalasoft.Annotations.DrawHandler(_Adata, _Cdata, _Aeve, _Aself, _Acustom);

        __AbindEvents({
            repaint: _Adraw.events.update,
            viewchanged: _Adraw.events.viewchanged,
            drawn: __AbindUiEvents,
            resized: __AresizeFinished
        });

        if (_Adata.points && (_Adata.x > 0 || _Adata.y > 0)) {
            __Atranslate(_Adata.x, _Adata.y);

            // client side doesn't use location or size for point based annotations
            _Adata.x = 0;
            _Adata.y = 0;
            _Adata.width = 1;
            _Adata.height = 1;
        }

        // This has to be initialized after _Adraw is initialized
        __AinitUiEvents();
    }

    function __AinitUiEvents() {
        _AuiEvents = {
            // selectable events
            selectable: {
                selectchange: __AtoggleSelected
            },

            // moving events
            movable: {
                dragstart: _Adraw.events.dragstart,
                dragmove: _Adraw.events.dragmove,
                dragend: _Adraw.events.dragend
            },

            // resizing events for mobile
            resizable: {
                pinchstart: _Adraw.events.pinchstart,
                pinchmove: _Adraw.events.pinchmove,
                pinchend: _Adraw.events.pinchend
            },

            boundEvents: {
                'resizable': false,
                'movable': false,
                'selectable': false
            },
            isBound: function isBound(property) {
                return this.boundEvents[property];
            },
            bound: function bound(property) {
                this.boundEvents[property] = true;
            },
            unbound: function unbound(property) {
                this.boundEvents[property] = false;
            }
        };
    }

    _Aself.dispose = __Adispose;
    function __Adispose() {
        if (_Adata.selected) {
            __AtoggleSelected();
        }

        if (_Aeve) {
            // first one unbinds raphael events, second unbinds all jquery events
            //			_Aeve.unbind(_Aobj);
            _Aeve.unbind();
        }

        if (_Aobj) {
            _Aobj.remove();
        }

        if (_Atxt) {
            _Atxt.dispose();
        }

        if (_Aglw) {
            _Aglw.remove();
        }

        if (_Adraw) {
            _Adraw.unbindEvents();
        }

        _Adraw = null;
        _Cdata = null;
        _Aself = null;
        _Aeve = null;
        _Aobj = null;
        _Atxt = null;
        _Aglw = null;
        _Adata = null;
    }

    _Aself.bind = __AbindEvents;
    function __AbindEvents() {
        _Aeve.bind.apply(_Aeve, arguments);
    }

    _Aself.unbind = __AunbindEvents;
    function __AunbindEvents() {
        _Aeve.unbind.apply(_Aeve, arguments);
    }

    _Aself.trigger = __AtriggerEvent;
    function __AtriggerEvent() {
        _Aeve.trigger.apply(_Aeve, arguments);
        return _Aself;
    }

    function __createDefaultAnnotationData() {
        /**
         * Represents generic annotation data object.
         *
         * This basic object structure is applied to all annotations. Individual types of annotation could ignored some of those properties.
         * This structure is used when configuring default values for particular annotation types using {@link WebDocumentViewerConfig.annotations}, creating annotations using {@link Atalasoft.Controls.WebDocumentViewer~AnnotationController#createOnPage|annotations.createOnPage} or retrieving annotations data using corresponding api.
         *
         * *Note*, Annotation could have only one of two positioning models
         * - Box model, i.e. annotation position and size is defined by {@link AnnotationData.x | X}, {@link AnnotationData.y | Y}, {@link AnnotationData.width | width} and {@link AnnotationData.height | height} properties.
         * For example, `rectangle` or `text` annotations.
         *
         * - Points model, which means that annotation consist of an array of individual points stored in {@link AnnotationData.points | points} property.
         * For example, `lines` or `freehand` annotations.
         *
         * It's expected that annotation have only one of positioning model, and often rendering is performed basing on existence or absence of {@link AnnotationData.points | points} value. I.e. in case if {@link AnnotationData.points | points} is set, {@link AnnotationData.x | X}, {@link AnnotationData.y | Y}, {@link AnnotationData.width | width} and {@link AnnotationData.height | height} values could be ignored.
         *
         * @atalaconfig
         * @alias AnnotationData
         */
        var data = {
            // JSON serializable data object for transport to server
            /**
             * @property {Atalasoft.Annotations.AnnotationTypes} type - Annotation type.
             */
            type: '',

            /**
             * @property {number} [x=0] - X axis annotation coordinate in document coordinate space.
             */
            x: 0,

            /**
             * @property {number} [y=0] - Y axis annotation coordinate in document coordinate space.
             */
            y: 0,

            /**
             * @property {number} [width=0] - Width of the annotation box.
             */
            width: 0,

            /**
             * @property {number} [height=0] - Height of the annotation box.
             */
            height: 0,

            /**
             * @property {Point[]} [points=undefined] - Array of annotation points.
             */
            points: undefined,

            /**
             * @property {number} [rotation=0] - Represents annotation rotation angle.
             *
             * Note, this property is ignored when annotation is created from UI, i.e. when specified in {@link WebDocumentViewerConfig.annotations} configurations.
             */
            rotation: 0,

            /**
             * @private
             */
            transform: Raphael.matrix(),

            /**
             * @property {boolean} [visible=true] - Indicates whether annotation is visible.
             */
            visible: true,

            /**
             * @property {boolean} [movable=true] - Indicates whether annotation could be moved through UI.
             */
            movable: true,

            /**
             * @property {boolean} [rotatable=true] -Indicates whether annotation could be rotated through UI.
             */
            rotatable: true,

            /**
             * @property {boolean} [resizable=true] - Indicates whether annotation could be resized through UI.
             */
            resizable: true,

            /**
             * @property {boolean} [selected=false] - Indicates whether annotation is currently selected.
             */
            selected: false,

            /**
             * @property {boolean} [selectable=true] - Indicates whether annotation is selectable.
             */
            selectable: true,

            /**
             * @property {boolean} [readonly=false] - Indicates whether annotation is readonly. If set to true annotation couldn't be modified through UI and context menu couldn't be shown for it.
             */
            readonly: false,

            /**
             * @property {boolean} [burn=false] - Indicates whether this annotation should be "burned" to output document on save. If set to true, annotation will be rendered on top of the image for all output formats except PDF. For PDF documents, annotations will be rendered and added as a separate layer on top of the document content.
             */
            burn: false,

            /**
             * @property {string} [tooltip] - Annotation tooltip.
             */
            tooltip: '',

            /**
             * @property {string} name - Annotation type title. This will be shown as a caption for toolbar buttons representing "extended" types annotations. This applies to `stamp` and `image` types of annotation. I.e. name should be set to annotations defined by application using {@link WebDocumentViewerConfig.annotations| annotations.stamps} and {@link WebDocumentViewerConfig.annotations| annotations.images}.
             */
            name: '',

            /**
             * @property {string} [username] - Corresponds to server side `AnnotationData.UserName` property.
             */
            username: '',

            /**
             * @ignore
             */
            //this property not works properly since it's applied only on creation and ignored on resize
            aspectratio: 0, // 0 is unrestricted

            /**
             * @property {number} [cornerradius=0] - Represents corner rounding radius for Stamp annotations.
             *
             */
            cornerradius: 0,

            /**
             * Represents annotation fill configuration.
             * @typedef {Object} AnnotationFill
             * @property {string} [color='white'] - Fill color.
             * @property {number} [opacity=1] - Opacity level.
             */

            /**
             * @property {AnnotationFill} [fill] - Represents annotation fill.
             */
            fill: {
                color: 'white',
                opacity: 1
            },

            /**
             * @typedef AnnotationLineCap
             * @property {string} [style] - Style of the cap. Valid values are `'classic'`, `'block'`, `'open'`, `'oval'`, `'diamond'`, and `'none'`.
             * @property {string} [width] - Width of the cap. Valid values are `'wide'`, `'narrow'`, and `'medium'`
             * @property {string} [height] - Height of the cap. Valid values are `'long'`, `'short'`, and `'medium'`.
             */

            /**
             * Represents annotation outline configuration.
             * @typedef {Object} AnnotationOutline
             * @property {string} [color='black'] - Outline color.
             * @property {number} [opacity=1] - Opacity level.
             * @property {number} [width=2] - Line width.
             * @property {AnnotationLineCap} startcap - Starting point arrow cap configuration for the line annotation.
             * @property {AnnotationLineCap} endcap - End point arrow cap configuration for the line annotation.
             */
            /**
             * @property {AnnotationOutline} [outline] - Annotation outline.
             */
            outline: {
                color: 'black',
                opacity: 1,
                width: 2,
                startcap: null,
                endcap: null
            },

            /**
             * @property {string} [src] - Url of the image displayed by the "image" annotation.
             */
            src: '', // image based anno

            /**
             * Represents configuration for text based annotations like 'text' or 'stamp'.
             * @typedef {Object} AnnotationTextConfig
             * @property {string} [value] - Displayed annotation text.
             * @property {string} [align='left'] - Text align. Allowed values are `'left'`, `'center'`, or `'right'`.
             * @property {Object} [font] - Annotation text font configuration.
             * @property {boolean} [font.bold=false] - Indicates whether annotation text is bold.
             * @property {boolean} [font.italic=false] - Indicates whether annotation text is italic.
             * @property {boolean} [font.strike=false] - Indicates whether annotation text is strike.
             * @property {boolean} [font.underline=false] - Indicates whether annotation text is underline.
             * @property {string} [font.color='black'] - Annotation text color.
             * @property {string} [font.family='Arial'] - Annotation text font family.
             * @property {number} [font.size=12] - Annotation text font size.
             *
             * @property {boolean} [readonly=false] - Indicates whether annotation text could be changed.
             *
             * @property {boolean} [autoscale] - Indicates whether text should be scaled to the size of the bounding box for the Stamp and Text annotations.
             *
             * This could be useful to make Stamp annotation looks similar to its representation burned into image or opened in different Atalasoft viewers.
             *
             */

            /**
             * @property {AnnotationTextConfig} [text] - Annotation text configuration.
             */
            text: { // text based annos
                value: null, // text contents!
                align: 'left',
                font: { // font props
                    bold: false,
                    italic: false,
                    strike: false,
                    underline: false,
                    color: 'black',
                    family: 'Arial',
                    size: 12
                },
                readonly: false, // read only?
                replies: null, // comment annotation replies. not used?
                parent: null, // comment annotation anchor. not used?
                autoscale: false
            },

            /**
             * @property {Object} [extra] - Additional data that could be stored along with annotation. Application specific properties is expected to be inserted into this object.
             * Those data will be transacted to extra properties of the server-side `AnnotationData` object.
             */
            extra: {}
        };

        /**
         * Synchronizes user instance of the annotation data with corresponding internal state. Triggers UI invalidation if necessary.
         *
         * This method should be called to apply any property changes made by applicaion.
         * @function AnnotationData#update
         * @instance
         */

        /**
         * Returns the page index for particular annotation.
         * @function AnnotationData#getPageIndex
         * @instance
         * @returns {number}
         */

        return data;
    }

    function __onChangeRotation(value, old) {
        var diff = (value - old + 360) % 360;
        var tmpMatrix = Raphael.matrix();
        var transformMatrix = __AgetTransform();
        tmpMatrix.add(transformMatrix.a, transformMatrix.b, transformMatrix.c, transformMatrix.d, transformMatrix.e, transformMatrix.f);

        var rect = __AgetBox();
        // transform current doc space around center and check where location will be
        // then we'll just put real location there and rotate around it instead of center.
        // thus result will look like we've performed center rotation.
        tmpMatrix.rotate(diff, rect.x + rect.width / 2, rect.y + rect.height / 2);

        var newx = tmpMatrix.x(rect.x, rect.y);
        var newy = tmpMatrix.y(rect.x, rect.y);

        __Atranslate(newx - rect.x, newy - rect.y);
        __recalculateTransform();
    }

    function __recalculateTransform() {
        var tmpMatrix = Raphael.matrix();

        var rect = __AgetBox();
        tmpMatrix.rotate(_Adata.rotation, rect.x, rect.y);
        _Adata.transform = tmpMatrix;
    }

    // this is some sort of hack - when we are done with UI resizing, _ATransform.matrix 
    // is still constructed to rotate object around old location(before any resizing)
    // this were fine for UI but in model we should calculate rotation around (0;0)
    function __AresizeFinished() {
        var box = __AgetBox();

        var newL = __AtransformPoint(__AgetTransform(), box);
        if (newL.x !== box.x || newL.y !== box.y) {
            __Atranslate(newL.x - box.x, newL.y - box.y);
        }
    }

    // map settings onto data
    _Aself.set = __AsetData;
    function __AsetData(cfg, deep) {
        if (cfg) {
            var oldRotation = _Adata.rotation;
            if (cfg.hasOwnProperty('rotation')) {
                cfg.rotation = (cfg.rotation + 360) % 360;
            }
            __AsetDataInternal(cfg, deep, false);
            if (oldRotation !== _Adata.rotation) {
                __onChangeRotation(_Adata.rotation, oldRotation);
            }
        }
    }

    function __AsetDataInternal(cfg, deep) {
        if (deep) {
            $.extend(true, _Adata, cfg);
        } else {
            $.extend(_Adata, cfg);
        }
    }

    _Aself.get = __AgetData;
    function __AgetData(s) {
        if (s) {
            return _Adata[s];
        } else {
            return _Adata;
        }
    }

    _Aself.getTransform = __AgetTransform;
    function __AgetTransform() {
        return _Adata.transform;
    }

    function __AmakeClonedData() {
        function __removeCloneExtras() {
            if (_Adata.update) {
                delete _Adata.update;
            }

            if (_Adata.getPageIndex) {
                delete _Adata.getPageIndex;
            }
        }

        _Aclone = {
            // documented along with AnnotationData definition.
            update: function update(viewOnly) {
                // need to toggle selected before we overwrite the data
                if (_Adata.selected !== _Aclone.selected) {
                    __AtoggleSelected();
                }

                if (!viewOnly) {
                    //TODO: check if annotation data changed, and fire a datachanged event
                    __AsetData(_Aclone, true);
                }

                __removeCloneExtras();
                __AupdateView();
                __Arepaint();
                __ArebindUiEvents();
            },

            getPageIndex: function getPageIndex() {
                return _Aself._pageindex;
            }
        };

        $.extend(true, _Aclone, _Adata);
    }

    _Aself.getClonedData = __AgetClonedData;
    function __AgetClonedData() {
        if (!_Aclone) {
            __AmakeClonedData();
        } else {
            $.extend(true, _Aclone, _Adata);
        }

        delete _Aclone.transform;
        return _Aclone;
    }

    _Aself.getObject = __AgetObject;
    function __AgetObject() {
        return _Aobj;
    }

    _Aself.getEventObject = __AgetEventObject;
    function __AgetEventObject() {
        return _Aeve;
    }

    _Aself.getZoom = function () {
        return _Cdata.getZoom(_Aself._pageindex);
    };

    _Aself.stringify = __Astringify;
    _Aself.getJSON = __Astringify;
    function __Astringify() {
        return JSON.stringify(_Adata);
    }

    _Aself.toggleSelected = __AtoggleSelected;
    function __AtoggleSelected(e) {
        if (!_Adata) {
            return;
        }

        // event args to trigger	
        var evt = {
            ann: _Aself,
            append: true, // when e is undefined, we always append
            page: null,
            pageindex: _Aself._pageindex,
            type: ''
        };

        if (e) {
            evt.append = e.shiftKey || e.ctrlKey || typeof e.append !== 'undefined' && e.append;
            evt.page = e.page;
            evt.pageindex = e.pageindex;
        }

        // only toggle if we're appending or it's not already selected
        if (evt.append || !_Adata.selected) {
            _Adata.selected = !_Adata.selected;

            evt.type = _Adata.selected ? 'selected' : 'deselected';
        }
        // clicked without append needs to notify controller
        else if (_Adata.selected && !evt.append) {
                evt.type = 'reselected';
            }

        // only fire an event if we have something to do
        if (evt.type !== '') {
            __AtriggerEvent(evt);
        }
    }

    _Aself.isCloneSource = __AisCloneSource;
    function __AisCloneSource(clone) {
        return _Aclone && _Aclone === clone;
    }

    function __AinitData(aType) {
        $.extend(true, _Adata, _Adefaults[aType]);
    }

    // Since we don't know which drawing surface this annotation will be drawn
    // on, we need to create it when the annotation starts drawing
    // paper: Raphael drawing surface for this annotation
    function __AcreateAnnotation(paper) {
        var aobj = null;

        switch (_Adata.type) {
            case 'image':
                aobj = paper.image();
                aobj.attr('src', _Adata.src);
                break;

            // rectangle based annotations	
            case 'highlight':
                aobj = paper.rect();
                break;

            case 'rectangle':
                aobj = paper.rect();
                break;

            case 'fillrect':
                aobj = paper.rect();
                break;

            case 'text':
                aobj = paper.rect();
                break;

            case 'stamp':
                aobj = paper.rect();
                break;

            // path based annotations
            case 'ellipse':
                aobj = paper.path();
                break;

            case 'line':
                aobj = paper.path();
                break;

            case 'lines':
                aobj = paper.path();
                break;

            case 'freehand':
                aobj = paper.path();
                break;

            case 'polygon':
                aobj = paper.path();
                break;

            case 'custom':
                aobj = _Acustom.construct(paper);
                break;
        }

        if (paper._annos) {
            paper._annos.push(aobj);
        }

        return aobj;
    }

    function __AbindUiEvents() {
        if (_Aboundeve !== null) {
            if (_Aobj) {
                _Aeve.unbind(_Aobj, _Aboundeve);
            } else {
                _Aeve.unbind(_Aboundeve);
            }
        }

        var evts = {};

        if (_Adata.selectable) {
            $.extend(evts, _AuiEvents.selectable);
            _AuiEvents.bound('selectable');

            if (!_Cdata.readonly && _Adata.movable) {
                $.extend(evts, _AuiEvents.movable);
                _AuiEvents.bound('movable');
            }

            if (!_Cdata.readonly && _Adata.resizable && Atalasoft.Utils.Browser.Features.Touch) {
                $.extend(evts, _AuiEvents.resizable);
                _AuiEvents.bound('resizable');
            }
        }

        _Aboundeve = evts;
        _Aeve.bind(_Aobj, evts);
    }

    function __ArebindUiEvents() {
        if (_Aboundeve !== null) {
            // if the data is selectable but the event is not yet bound
            if (_Adata.selectable) {
                if (!_AuiEvents.isBound('selectable')) {
                    _Aeve.bind(_AuiEvents.selectable);
                    _AuiEvents.bound('selectable');
                }

                if (_Adata.movable && !_AuiEvents.isBound('movable')) {
                    _Aeve.bind(_AuiEvents.movable);
                    _AuiEvents.bound('movable');
                } else if (!_Adata.movable && _AuiEvents.isBound('movable')) {
                    _Aeve.unbind(_AuiEvents.movable);
                    _AuiEvents.unbound('movable');
                }

                if (Atalasoft.Utils.Browser.Features.Touch) {
                    if (_Adata.resizable && !_AuiEvents.isBound('resizable')) {
                        _Aeve.bind(_AuiEvents.resizable);
                        _AuiEvents.bound('resizable');
                    } else if (!_Adata.resizable && _AuiEvents.isBound('resizable')) {
                        _Aeve.unbind(_AuiEvents.resizable);
                        _AuiEvents.unbound('resizable');
                    }
                }
            }
            // OR if the data is NOT selectable but the event is still bound
            else if (!_Adata.selectable && _AuiEvents.isBound('selectable')) {
                    _Aeve.unbind(_AuiEvents.selectable);
                    _AuiEvents.unbound('selectable');

                    _Aeve.unbind(_AuiEvents.movable);
                    _AuiEvents.unbound('movable');

                    _Aeve.unbind(_AuiEvents.resizable);
                    _AuiEvents.unbound('resizable');
                }
        }
    }

    _Aself.getBox = __AgetBox;
    /**
     * Returns bounding box of the annotation in document space.
    */
    function __AgetBox() {
        if (!_bbox && _Adata.points) {
            _bbox = Atalasoft.Utils.__calcPathBounds(_Adata.points);
        }

        var rect = _Adata.points ? _bbox : _Adata;
        return {
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height
        };
    }

    // moves the data points by the given deltas
    _Aself.translate = __Atranslate;
    function __Atranslate(dx, dy) {
        if (_Adata.points) {
            for (var i = 0; i < _Adata.points.length; i++) {
                _Adata.points[i].x += dx;
                _Adata.points[i].y += dy;
            }

            if (_bbox) {
                _bbox.x += dx;
                _bbox.y += dy;
            }
        }

        if (_Adata.type === 'custom' || !_Adata.points) {
            _Adata.x += dx;
            _Adata.y += dy;
        }
        __recalculateTransform();
        __AbufferRepaint();
    }

    // scales and positions the annotation to fit within the given rectangle
    _Aself.transform = __Atransform;
    function __Atransform(x, y, w, h) {
        var box = __AgetBox();
        var sx = w / box.width;
        var sy = h / box.height;

        if (_Adata.points && _Adata.points.length > 0 && _Adata.type !== 'custom') {
            // scale all points by the calculated values
            for (var i = 0; i < _Adata.points.length; i++) {
                _Adata.points[i].x = x + (_Adata.points[i].x - box.x) * sx;
                _Adata.points[i].y = y + (_Adata.points[i].y - box.y) * sy;
            }

            // we store these on the main object since the data object gets serialized to the server
            _bbox.x = x;
            _bbox.y = y;
            _bbox.width *= sx;
            _bbox.height *= sy;
        } else {

            _Adata.x = x;
            _Adata.y = y;

            _Adata.width *= sx;
            _Adata.height *= sy;
        }

        __AtriggerEvent({
            type: 'annoresizing'
        });

        __AbufferRepaint();
    }

    // scales and positions the annotation in UI space
    _Aself.transformUI = __AtransformUI;
    function __AtransformUI() {
        _Adraw.transformUI.apply(_Adraw, arguments);
    }

    _Aself.commitTransform = __AcommitTransform;
    function __AcommitTransform() {
        _Adraw.commitTransform();
    }

    var _Arpnt = false;
    var _Atic = Atalasoft.Utils.Browser.Explorer ? 20 : 5;
    function __AbufferRepaint() {
        if (!_Arpnt) {
            _Arpnt = true;
            setTimeout(__AunBufferRepaint, _Atic);
        }
    }

    function __AunBufferRepaint() {
        _Arpnt = false;
        __Arepaint();
    }

    // #region Mouse Events

    _Aself.startDraw = __AstartDraw;
    function __AstartDraw(e, paper, cfg) {
        __AsetData(cfg);

        _Aobj = __AcreateAnnotation(paper);
        _Aobj.transform(_Adraw.getTransform());

        if (_Adata.type === 'text' || _Adata.type === 'stamp') {
            _Atxt = new Atalasoft.Annotations.TextAnnotationUI(_Aself, paper, _Cdata);
        }

        __AupdateView();

        _Adraw.drawStart(e, _Aobj, _Atxt);
    }

    // #endregion

    _Aself.repaint = __Arepaint;
    function __Arepaint(paper) {
        // repaint called with paper means that we need to draw it again
        if (paper) {
            if (_Aglw) {
                _Aglw = null;
            }

            // creation handles the custom recreate as well
            _Aobj = __AcreateAnnotation(paper);

            // only need to render it once, the rest should be transforms
            if (_Acustom) {
                _Acustom.render(_Aobj, _Adata);
            }

            __AupdateView();
            __AbindUiEvents();

            if ((_Adata.type === 'text' || _Adata.type === 'stamp') && _Atxt === null) {
                _Atxt = new Atalasoft.Annotations.TextAnnotationUI(_Aself, paper, _Cdata);
            }

            // notify of paper change
            if (_Atxt) {
                _Atxt.changepaper(paper);
            }
            // annotation view is on a new paper so we notify with viewchanged
            __AtriggerEvent({
                type: 'viewchanged',
                annview: _Aobj,
                textview: _Atxt
            });
        }

        __AtriggerEvent('repaint');
    }

    _Aself.updateView = __AupdateView;
    function __AupdateView() {
        if (_Aobj) {
            var kvp = __AmapFill();
            $.extend(kvp, __AmapOutline());

            _Aobj.attr(kvp);

            __AfixArrows();

            if (_Adata.visible) {
                _Aobj.show();
            } else {
                _Aobj.hide();
            }
        }

        __AupdateTextView();
        __AupdateImageView();
    }

    // updates the text properties
    function __AupdateTextView() {
        if (_Atxt) {
            _Atxt.set(_Adata.text);
            _Atxt.updateView();
        }
    }

    // Raphael doesn't support updating this property, so we
    // have to use our own methods.
    function __AupdateImageView() {
        if (_Aobj && _Adata.src !== '' && _Adata.type === 'image') {
            if (typeof _Aobj.node.src !== 'unknown' && _Aobj.node.src) {
                _Aobj.node.src = _Adata.src;
            } else {
                _Aobj.node.href.baseVal = _Adata.src;
            }
        }
    }

    // maps the fill properties to keys that Raphael uses
    function __AmapFill() {
        return {
            'fill': _Adata.fill.color,
            'fill-opacity': _Adata.fill.opacity
        };
    }

    // maps the outline properties to keys that Raphael uses
    function __AmapOutline() {
        var kvp = {
            'stroke': _Adata.outline.color,
            'stroke-width': _Adata.outline.width * _Cdata.getZoom(_Aself._pageindex),
            'stroke-opacity': _Adata.outline.opacity
        };

        _Aobj._linewidth = _Adata.outline.width;

        if (!Raphael.fn.addArrow) {
            if (_Adata.outline.startcap) {
                // && _Adata.outline.startcap.style !== 'none'){
                kvp['arrow-start'] = __AtranslateLineCap(_Adata.outline.startcap);
            }

            if (_Adata.outline.endcap) {
                // && _Adata.outline.endcap.style !== 'none'){
                kvp['arrow-end'] = __AtranslateLineCap(_Adata.outline.endcap);
            }
        }

        return kvp;
    }

    function __AfixArrows() {
        if (Raphael.fn.addArrow) {
            if (_Adata.outline.startcap) {
                // && _Adata.outline.startcap.style !== 'none'){
                Raphael.fn.addArrow(_Aobj, __AtranslateLineCap(_Adata.outline.startcap), false);
            }

            if (_Adata.outline.endcap) {
                // && _Adata.outline.endcap.style !== 'none'){
                Raphael.fn.addArrow(_Aobj, __AtranslateLineCap(_Adata.outline.endcap), true);
            }
        }
    }

    function __AtranslateLineCap(cap) {
        return [cap.style, '-', cap.width, '-', cap.height].join('');
    }

    function __AtransformPoint(matrix, p) {
        return {
            x: matrix.x(p.x, p.y),
            y: matrix.y(p.x, p.y)
        };
    }

    return _Aself;
};
'use strict';

//
//  Annotation Event Helper class
//
//  This source code is property of Atalasoft, Inc. (http://www.atalasoft.com/)
//  Permission for usage and modification of this code is only permitted 
//  with the purchase of a source code license.
//
//  Change History:
//	02-09-12	D. Cilley		File Created.
//	03-03-12	D. Cilley		FB 12982, FB 13003: Used correct method to get mouse position from jQuery event
//	04-17-12	D. Cilley		FB 13173: Added interactstart event to fix a bug that would show grips on the wrong page
//	09-11-12	D. Cilley		FB 13589: Improved architecture to allow for easier editing.
//	09-18-12	D. Cilley		FB 13597: Implemented new TouchHandler and MouseHandler.
//	10-16-12	D. Cilley		FB 13669, FB 13670: Moved away from using Raphael drag deltas. 
//	02-21-13	D. Cilley		FB 14065: Added JSHint options and fixes to comply with JSHint warnings.
//	12-03-13	D. Cilley		FB 14071: Removed jquery.browser dependency.
//	12-17-14	D. Cilley		Bug 550581: Added locally scoped non-conflict jQuery.
//	02-12-15	D. Cilley		Bug 579500: Combined MouseTool and TouchTool for multi-input devices.
//-------------------------------------------------------------------------------------------------

// JSHint options and globals
/*jshint eqnull: true, undef: true, jquery: true, browser: true, es3:false */

// Atalasoft global constructors and functions
/*global Atalasoft */

// Local globals
/*global Raphael */

// Wraps Raphael events in a jQuery like object
// pObject: parent object that these events belong to
Atalasoft.Annotations.EventHelper = function (pObject) {
    var $ = Atalasoft.$;
    var _Eself = this;
    var _Ejqe = $({}); // jquery instance to bind events to
    var _Eparent = pObject; // parent object
    var _Ehandler = null; // mouse/touch event handlers

    var _Edp = {
        target: null, // drag target
        mx: null, // current mouse/touch x
        my: null, // current mouse/touch y
        px: null, // previous x
        py: null, // previous y
        dx: null, // delta x
        dy: null // delta y
    };

    __init();
    function __init() {
        _Ehandler = new Atalasoft.Annotations.PointerHandler();

        _Ehandler.bind({
            // mouse events to pass to the user
            click: __EonClick,
            dblclick: __EonDblclick,
            mousedown: __EonMouseDown,
            mousemove: __EonMouseMove,
            mouseover: __EonMouseOver,
            mouseout: __EonMouseOut,
            mouseup: __EonMouseUp,

            // mobile events to pass to the user
            touchmove: __EonTouchMove,
            touchstart: __EonTouchStart,
            interactstart: __EstartInteract,
            interactend: __EendInteract,
            pinchstart: __EpinchStart,
            pinchmove: __EpinchMove,
            pinchend: __EpinchEnd,

            // events for both
            selectchange: __EselectChange,
            contextmenu: __EcontextMenu,
            showeditor: __Eshoweditor,
            annoresized: __Eresized
        });
    }

    function __EgetPagePosition(e) {
        _Edp.px = _Edp.mx;
        _Edp.py = _Edp.my;

        if (e.originalEvent) {
            _Edp.mx = e.originalEvent.targetTouches[0].pageX;
            _Edp.my = e.originalEvent.targetTouches[0].pageY;
        } else {
            _Edp.mx = e.targetTouches[0].pageX;
            _Edp.my = e.targetTouches[0].pageY;
        }

        _Edp.dx = _Edp.mx - _Edp.px;
        _Edp.dy = _Edp.my - _Edp.py;
    }

    function __EgetScreenPosition(e) {
        _Edp.px = _Edp.mx;
        _Edp.py = _Edp.my;
        _Edp.mx = e.screenX;
        _Edp.my = e.screenY;
        _Edp.dx = _Edp.mx - _Edp.px;
        _Edp.dy = _Edp.my - _Edp.py;
    }

    _Eself.bind = __EbindEvents;
    function __EbindEvents(robj) {
        var args = arguments;

        if (robj && (robj.constructor.prototype === Raphael.el || robj.constructor.prototype === Raphael.st)) {
            robj.drag(__EdragMove, __EdragStart, __EdragEnd);
            robj.hover(__EhoverIn, __EhoverOut);

            // binds _Ehandler DOM events to the Raphael object
            if (robj.type !== 'set') {
                $(robj[0]).bind(_Ehandler.events);
            } else {
                robj.forEach(function (el) {
                    $(el[0]).bind(_Ehandler.events);
                });
            }

            // create a new args array without the raphael object
            args = Array.prototype.slice.call(args, 1);
        }

        if (args.length > 0) {
            _Ejqe.bind.apply(_Ejqe, args);
        }
    }

    _Eself.unbind = __EunbindEvents;
    function __EunbindEvents(robj) {
        var args = arguments;

        if (robj && (robj.constructor.prototype === Raphael.el || robj.constructor.prototype === Raphael.st)) {
            robj.undrag();
            robj.unhover(__EhoverIn, __EhoverOut);

            // removes _Ehandler DOM events binds from the Raphael object
            if (robj.type !== 'set') {
                $(robj[0]).unbind(_Ehandler.events);
            } else {
                robj.forEach(function (el) {
                    $(el[0]).unbind(_Ehandler.events);
                });
            }

            // create a new args array without the raphael object
            args = Array.prototype.slice.call(args, 1);
        } else if (robj === null && args.length > 1) {
            args = Array.prototype.slice.call(args, 1);
        }

        _Ejqe.unbind.apply(_Ejqe, args);
    }

    _Eself.trigger = __Etrigger;
    function __Etrigger() {
        _Ejqe.trigger.apply(_Ejqe, arguments);
    }

    // event that needs to fire before any interaction with the annotation 
    function __EstartInteract(e) {
        __Etrigger({
            type: 'interactstart',
            target: _Eparent
        });
    }

    function __EendInteract(e) {
        __Etrigger({
            type: 'interactend',
            target: _Eparent
        });
    }

    // dx, dy: mouse delta from origin (not very useful)
    // mx, my: mouse position (not corrected for scrolled or offset objects)
    // we ignore the Raphael inputs here because they can be NaN at times
    function __EdragMove(dx, dy, mx, my, e) {
        // Raphael fires move event with dx=dy=0 when you just click on an object.
        // Looks like it makes sense to filter this out.
        if (dx || dy) {
            // only fire dragmove for intended objects when using touch
            if (!Atalasoft.Utils.Browser.Features.Touch || e.target === _Edp.target) {
                // if the previous point is not there, we need to start the drag
                if (_Edp.px === null) {
                    __EdragStart(null, null, e);
                }

                if (e.touches) {
                    __EgetPagePosition(e);
                } else {
                    __EgetScreenPosition(e);
                }

                __Etrigger({
                    type: 'dragmove',
                    dx: _Edp.dx,
                    dy: _Edp.dy,
                    mx: _Edp.mx,
                    my: _Edp.my,
                    originalEvent: e
                });
            }
        }
    }

    // mx, my: mouse position (not corrected for scrolled or offset objects)
    // we ignore the Raphael inputs here because they can be NaN at times
    function __EdragStart(mx, my, e) {
        _Edp.target = e.target;

        __EstartInteract();

        if (e.touches) {
            __EgetPagePosition(e);
        } else {
            __EgetScreenPosition(e);
        }

        __Etrigger({
            type: 'dragstart',
            mx: _Edp.mx,
            my: _Edp.my,
            originalEvent: e
        });
    }

    function __EdragEnd(e) {
        // only fire dragmove for intended objects when using touch
        if (!Atalasoft.Utils.Browser.Features.Touch || e.target === _Edp.target) {
            _Edp.target = null;

            _Edp.px = null;
            _Edp.py = null;
            _Edp.mx = null;
            _Edp.my = null;

            __Etrigger({
                type: 'dragend',
                originalEvent: e
            });
        }
    }

    function __EhoverIn() {
        __Etrigger('hoverin');
    }

    function __EhoverOut() {
        __Etrigger('hoverout');
    }

    function __EpinchStart(e) {
        __Etrigger(e);
    }

    function __EpinchMove(e) {
        __Etrigger(e);
    }

    function __EpinchEnd(e) {
        _Edp.px = null;
        _Edp.py = null;

        __Etrigger(e);
    }

    function __EselectChange(e) {
        __Etrigger(e);
    }

    function __EcontextMenu(e) {
        __Etrigger(e);
    }

    function __Eshoweditor(e) {
        __Etrigger(e);
    }

    function __EonClick(e) {
        __Etrigger(e);
    }

    function __EonDblclick(e) {
        __Etrigger(e);
    }

    function __EonMouseDown(e) {
        __Etrigger(e);
        if (e.which === 1) {
            __Etrigger('mousedownleft');
        } else if (e.which === 3) {
            __Etrigger('mousedownright');
        }
    }

    function __EonMouseMove(e) {
        __Etrigger(e);
    }

    function __EonMouseOut(e) {
        __Etrigger(e);
    }

    function __EonMouseOver(e) {
        __Etrigger(e);
    }

    function __EonMouseUp(e) {
        __Etrigger(e);

        if (e.which === 3) {
            __Etrigger('rightclick');
        }
    }

    function __EonTouchMove(e) {
        __Etrigger(e);
    }

    function __Eresized(e) {
        __Etrigger(e);
    }

    function __EonTouchStart(e) {
        __Etrigger(e);
    }
};
'use strict';

//
//  Annnotation DrawHandler Class
//
//  This source code is property of Atalasoft, Inc. (http://www.atalasoft.com/)
//  Permission for usage and modification of this code is only permitted 
//  with the purchase of a source code license.
//
//  Change History:
//	08-31-12	D. Cilley		File Created.
//	09-11-12	D. Cilley		FB 13589: Improved architecture to allow for easier editing.
//	09-18-12	D. Cilley		FB 13597: Added matrix drawing groundwork.
//	10-16-12	D. Cilley		FB 13669, FB 13670: Moved away from using Raphael drag deltas.
//	10-18-12	D. Cilley		FB 13692: Fixed Android position.
//	10-19-12	J. Burch		FB 13694: Fixing bug with recycled annotations
//	10-22-12	D. Cilley		FB 13694: Found a problem with original fix, added viewchanged event
//	11-28-12	J. Burch		FB 13812: Fixed a problem where text annos would not rewrap after pinch-to-resize.
//	11-28-12	D. Cilley		FB 13814: Fixed poly/freehand pinch resizing.
//	02-21-13	D. Cilley		FB 14065: Added JSHint options and fixes to comply with JSHint warnings.
//	12-03-13	D. Cilley		FB 14071: Removed jquery.browser dependency.
//	12-17-14	D. Cilley		Bug 550581: Added locally scoped non-conflict jQuery.
//	02-12-15	D. Cilley		Bug 368688: Fixed line cap rendering in IE10 and IE11.
//	07-09-15	D. Cilley		Bug 607560: Fixed an offset bug related to pageborderwidth fix.
//-------------------------------------------------------------------------------------------------

// JSHint options and globals
/*jshint eqnull: true, undef: true, jquery: true, browser: true, es3:false */

// Atalasoft global constructors and functions
/*global Atalasoft */

// Local globals
/*global Raphael */

// aData: annnotation data object
// cData: controller data object
// aEve: EventHelper instance to trigger events to
// aCustom: custom drawing handled if present
Atalasoft.Annotations.DrawHandler = function (aData, cData, aEve, aSelf, aCustom) {
    var $ = Atalasoft.$;
    var _self = this;

    var _Adata = aData;
    var _Cdata = cData;
    var _Aeve = aEve;
    var _Aobj = null; // Raphael obj
    var _Atxt = null; // TextAnnotationUI obj
    var _Acustom = aCustom; // custom renderer
    var _Aself = aSelf;

    var _draw = null; // drawing event properties 
    var _sop = null; // start point
    var _mtx = null; // matrix for manipulation
    var _pinch = null; // pinch data

    // assignable events, used for efficiency
    var __drawMove = function __drawMove() {};
    var __updateClient = function __updateClient() {};

    // these events will be bound to the Annotation class 
    _self.events = {
        drawstart: __onDrawStart,
        drawmove: __onDrawMove,
        drawend: __onDrawEnd,
        dragstart: __onDragStart,
        dragmove: __onDragMove,
        dragend: __onDragEnd,
        update: __onUpdate,
        viewchanged: __onViewChanged,
        pinchstart: __onPinchStart,
        pinchmove: __onPinchMove,
        pinchend: __onPinchEnd
    };

    __init();
    function __init() {}

    function __getPosition(e) {
        var p = Atalasoft.Utils.getMousePositionJquery(e);

        if (_Aobj.paper) {
            var offset = Atalasoft.Utils.getSVGOffset(_Aobj.paper.canvas, _Aobj.paper._page);

            p.x -= offset.left;
            p.y -= offset.top;
        }

        return p;
    }

    // gets the scaled position of the event
    function __getDocumentPoint(p) {
        var matrix = _Cdata.getViewerTransform(_Aself._pageindex).invert();

        var newx = matrix.x(p.x, p.y);
        p.y = matrix.y(p.x, p.y);
        p.x = newx;

        return p;
    }

    function __triggerEvent() {
        _Aeve.trigger.apply(_Aeve, arguments);
    }

    _self.drawStart = __onDrawStart;
    function __onDrawStart(e, aObj, tObj) {
        _Aobj = aObj;
        _Atxt = tObj;

        e.stopPropagation();
        e.preventDefault();

        var p = __getDocumentPoint(__getPosition(e));

        _Adata.visible = true;
        _sop = { x: p.x, y: p.y };

        _Adata.x = Math.round(p.x);
        _Adata.y = Math.round(p.y);
        _Adata.width = 1;
        _Adata.height = 1;

        if (_Aobj.type === 'path' && _Adata.type !== 'custom') {
            if (_Adata.type !== 'ellipse') {
                _Adata.points = [{ x: _Adata.x, y: _Adata.y }];
                if (_Adata.type === 'lines' || _Adata.type === 'polygon') {
                    // need a second point to start drawing
                    _Adata.points.push({ x: _Adata.x, y: _Adata.y });
                }

                // path based annotations ignore location
                _Adata.x = 0;
                _Adata.y = 0;

                // path drawing
                __drawMove = __plotAnnotation;
                __updateClient = __updateClientPath;
            } else {
                // ellipse drawing
                __drawMove = __sizeAnnotation;
                __updateClient = __updateClientEllipse;
            }
        } else {
            // rectangular drawing
            __drawMove = __sizeAnnotation;
            __updateClient = __updateClientRect;
        }

        __repaint();

        _draw = {
            events: Atalasoft.Utils.Browser.Features.Touch ? {
                touchend: __onDrawEnd,
                touchmove: __onDrawMove,
                mouseup: __onDrawEnd,
                mousemove: __onDrawMove
            } : {
                mouseup: __onDrawEnd,
                mousemove: __onDrawMove
            },

            src: $(e.srcElement || e.target), // src object that events were triggered on
            main: $(e.currentTarget) // main parent object that events bubble to 
        };

        _draw.src.bind(_draw.events);
        _draw.main.bind({
            mouseup: __onDrawEnd
        });
    }

    _self.unbindEvents = __onUnbindEvents;
    function __onUnbindEvents() {
        if (_draw) {
            _draw.src.unbind(_draw.events);
            _draw.main.unbind({
                mouseup: __onDrawEnd
            });
        }
    }

    function __onDrawMove(e) {
        e.stopPropagation();
        __drawMove(e);
        __repaint();
    }

    // called by __drawMove
    function __plotAnnotation(e) {
        var zp = __getDocumentPoint(__getPosition(e));

        switch (_Adata.type) {
            case 'line':
                _Adata.points[1] = zp;
                break;

            case 'freehand':
                _Adata.points.push(zp);
                break;

            case 'lines':
                _Adata.points[_Adata.points.length - 1] = zp;
                break;

            case 'polygon':
                _Adata.points[_Adata.points.length - 1] = zp;
                break;

            //			case 'custom':
            //				_Adata. // need to make sure width and height get to renderer, or this whole thing doesn't work
        }

        if (_Aobj.type === 'path') {
            if (_Adata.type === 'ellipse') {
                __plotEllipse();
            } else {
                __plotPoints();
            }

            if (_Aobj._ && _Aobj._.dirty === 0) {
                _Aobj._.dirty = 1;
            }
        }
    }

    // called by __drawMove
    // method for sizing bounding box based annotations with the mouse
    function __sizeAnnotation(e) {
        var p = __getDocumentPoint(__getPosition(e));

        var nx = _sop.x;
        var ny = _sop.y;
        var nw = Math.max(Math.abs(p.x - _sop.x), 1);
        var nh = Math.max(Math.abs(p.y - _sop.y), 1);

        if (_Adata.aspectratio > 0) {
            var r = Math.abs((p.y - _sop.y) / (p.x - _sop.x));

            if (r > 1 / _Adata.aspectratio) {
                // base the width off the height
                nw = Math.round(nh / _Adata.aspectratio);
            } else {
                // base the height off the width
                nh = Math.round(nw / _Adata.aspectratio);
            }
        }

        if (p.x < _sop.x) {
            nx = _sop.x - nw;
        }

        if (p.y < _sop.y) {
            ny = _sop.y - nh;
        }

        _Adata.x = nx;
        _Adata.y = ny;
        _Adata.width = nw;
        _Adata.height = nh;
    }

    function __onDrawEnd(e) {
        e.stopPropagation();
        var cancelled = false;

        if (_Adata.type === 'lines' || _Adata.type === 'polygon') {
            // if activepage is not the same as the page with annotation
            if (_Cdata.activepage._index !== _Aself._pageindex) {
                return;
            }

            _Adata.points.push(__getDocumentPoint(__getPosition(e)));
            if (e.button !== 2) {
                return;
            }
        } else if (!_Adata.points) {
            if (_Adata.width < 4 && _Adata.height < 4) {
                // rectangular annotation was most likely created with a click
                _Adata.width = 100;
                _Adata.height = 100;
            }

            __repaint();
        } else if (_Adata.points && _Adata.points.length < 2 && _Adata.type !== 'custom') {
            // line and freehand need more than 1 point to be drawn
            cancelled = true;
        }

        __onUnbindEvents();

        _draw = null;

        if (cancelled) {
            __triggerEvent('cancelled');
        } else {
            __triggerEvent('drawn');
        }
    }

    function __onDragStart(e) {
        if (_Cdata.readonly) {
            return;
        }

        e.originalEvent.stopPropagation();
        var box = _Aself.getBox();
        _sop = { x: box.x, y: box.y };
    }

    function __onDragMove(e) {
        if (_Cdata.readonly) {
            return;
        }

        e.originalEvent.stopPropagation();
        var base = __getDocumentPoint({ x: 0, y: 0 });
        var offset = __getDocumentPoint({ x: e.dx, y: e.dy });

        _Aself.translate(offset.x - base.x, offset.y - base.y);
        __triggerEvent('moving');
    }

    function __onDragEnd(e) {
        if (_Cdata.readonly) {
            return;
        }

        e.originalEvent.stopPropagation();
        var box = _Aself.getBox();

        // check if annotation is inside page rect
        if (_Aobj.paper && _Aobj.paper._page) {
            var bbox = _Aobj.getBBox();
            var pbox = { x: 0, y: 0, width: _Aobj.paper._page.width(), height: _Aobj.paper._page.height() };

            if (!__rectInRect(pbox, bbox)) {
                // annotation is not in bounds, move it back
                _Aself.translate(_sop.x - box.x, _sop.y - box.y);

                // annotation has not moved, so don't allow "moved" to trigger
                return;
            }
        }

        // trigger 'moved' only if annotation position has been changed
        if (_sop.x !== box.x || _sop.y !== box.y) {
            __triggerEvent('moved');
        }
    }

    function __onPinchStart(e) {
        // disables poly/freehand pinch resizing
        if (_Adata.points || _Cdata.readonly) {
            return;
        }

        var t1 = __getDocumentPoint({ x: e.touches[0].clientX, y: e.touches[0].clientY });
        var t2 = __getDocumentPoint({ x: e.touches[1].clientX, y: e.touches[1].clientY });

        var srect = _Aself.getBox();
        _pinch = {
            start: Atalasoft.Utils.CalcDistance(t1.x, t1.y, t2.x, t2.y),
            rect: srect
        };
    }

    function __onPinchMove(e) {
        if (!_pinch) {
            return;
        }

        var t1 = __getDocumentPoint({ x: e.touches[0].clientX, y: e.touches[0].clientY });
        var t2 = __getDocumentPoint({ x: e.touches[1].clientX, y: e.touches[1].clientY });

        var dist = Atalasoft.Utils.CalcDistance(t1.x, t1.y, t2.x, t2.y, _pinch.start);

        var deltaScaleX = dist.x - _pinch.start.x;
        var deltaScaleY = dist.y - _pinch.start.y;

        var newX = _pinch.rect.x - dist.dx;
        var newY = _pinch.rect.y - dist.dy;
        var newWidth = _pinch.rect.width + deltaScaleX;
        var newHeight = _pinch.rect.height + deltaScaleY;

        if (!_Adata.points) {
            _Adata.x = newX;
            _Adata.y = newY;
            _Adata.width = newWidth;
            _Adata.height = newHeight;
        } else {
            _Aself.transform(newX, newY, newWidth, newHeight);
        }

        if (_Aobj.paper && _Aobj.paper._page && _Aobj.paper._page._grips) {
            _Aobj.paper._page._grips.repaint();
        }

        __repaint();
    }

    function __onPinchEnd(e) {
        __triggerEvent('resized');
        __triggerEvent('annoresized');
        _pinch = null;
    }

    function __onUpdate(e) {
        __repaint();
    }

    function __onViewChanged(e) {
        _Aobj = e.annview;
        _Atxt = e.textview;

        if (_Aobj.type === 'path' && _Adata.type !== 'custom') {
            if (_Adata.type !== 'ellipse') {
                // path drawing
                __drawMove = __plotAnnotation;
                __updateClient = __updateClientPath;
            } else {
                // ellipse drawing
                __drawMove = __sizeAnnotation;
                __updateClient = __updateClientEllipse;
            }
        } else {
            // rectangular drawing
            __drawMove = __sizeAnnotation;
            __updateClient = __updateClientRect;
        }
    }

    function __updateFromMatrix() {
        _Aobj.transform(_mtx.toTransformString());

        if (_Atxt) {
            _Atxt.repaint();
        }
    }

    function __commitRaphaelData() {
        _Aobj.transform(__getResultTransformCommand());
        __repaint();
    }

    _self.repaint = __repaint;
    function __repaint() {
        __updateClient();
        if (_Aobj) {
            _Aobj.transform(__getResultTransformCommand());
        }

        if (_Atxt) {
            _Atxt.repaint();
        }
    }

    _self.getTransform = __getResultTransformCommand;

    function __getResultTransformCommand() {
        var m = Raphael.matrix();
        var viewerTransform = _Cdata.getViewerTransform(_Aself._pageindex);
        var selfTransform = _Aself.getTransform();

        m.add(viewerTransform.a, viewerTransform.b, viewerTransform.c, viewerTransform.d, viewerTransform.e, viewerTransform.f);

        m.add(selfTransform.a, selfTransform.b, selfTransform.c, selfTransform.d, selfTransform.e, selfTransform.f);

        return m.toTransformString();
    }

    // called by __updateClient
    function __updateClientRect() {
        _Aobj.attr({
            x: _Adata.x,
            y: _Adata.y,
            width: _Adata.width,
            height: _Adata.height
        });

        if (_Acustom) {
            _Acustom.render(_Aobj, _Adata);
        }

        // VML doesn't play well with setting attributes after the annotation is scaled
        if (Atalasoft.Utils.Browser.Features.VML) {
            _Aobj.transform(__getResultTransformCommand());
        }
    }

    // called by __updateClient
    function __updateClientEllipse() {
        // uncomment if we switch back to using Raphael ellipses
        //		_Aobj.attr({
        //			rx: (_Adata.width / 2),
        //			ry: (_Adata.height / 2),
        //			cx: _Adata.x + (_Adata.width / 2),
        //			cy: _Adata.y + (_Adata.height / 2)
        //		});

        __plotEllipse();

        if (_Aobj._ && _Aobj._.dirty === 0) {
            _Aobj._.dirty = 1;
        }
    }

    // called by __updateClient
    function __updateClientPath() {
        __plotPoints();

        if (_Aobj._) {
            if (_Aobj._.dirty === 0) {
                _Aobj._.dirty = 1;
            }
        }
    }

    // magic number: 4 * ((Math.sqrt(2) -1) / 3)
    var KAPPA = 0.5522847498307936;
    // plots an ellipse with a path, to work around a Raphael bug with paper.ellipse()
    function __plotEllipse() {
        var rx = _Adata.width / 2;
        var ry = _Adata.height / 2;
        var kx = KAPPA * rx;
        var ky = KAPPA * ry;
        var cx = _Adata.x + _Adata.width / 2;
        var cy = _Adata.y + _Adata.height / 2;

        var ps = ['M', cx, cy - ry, // moveto
        'C', cx + kx, cy - ry, cx + rx, cy - ky, cx + rx, cy, 'C', cx + rx, cy + ky, cx + kx, cy + ry, cx, cy + ry, 'C', cx - kx, cy + ry, cx - rx, cy + ky, cx - rx, cy, 'C', cx - rx, cy - ky, cx - kx, cy - ry, cx, cy - ry, 'Z' // close ellipse
        ];

        _Aobj.attr({ 'path': ps });
    }

    // plots the data or captured points into a Raphael path
    function __plotPoints() {

        // checking for data existing
        if (!_Adata.points || _Adata.points.length === 0) return;

        // moveto
        var ps = ['M', _Adata.points[0].x, _Adata.points[0].y];

        // lineto
        for (var i = 1; i < _Adata.points.length; i++) {
            ps = ps.concat(['L', _Adata.points[i].x, _Adata.points[i].y]);
        }

        // closes the path for fill
        if (_Adata.type === 'polygon') {
            ps.push('Z');
        }

        _Aobj.attr({ 'path': ps });

        __fixLineCapsIE();
    }

    /**
    * Work around outlined by this post:
    * http://stackoverflow.com/questions/15693178/svg-line-markers-not-updating-when-line-moves-in-ie10
    */
    function __fixLineCapsIE() {
        if (Atalasoft.Utils.Browser.Explorer) {
            var version = parseInt(Atalasoft.Utils.Browser.Version, 10);

            if (version >= 10 && version < 12 && _Aobj.node && _Aobj.node.parentNode) {
                _Aobj.node.parentNode.insertBefore(_Aobj.node, _Aobj.node);
            }
        }
    }

    _self.commitTransform = __commitMatrixData;
    function __commitMatrixData() {
        $.extend(_Adata, __dataFromMatrix(_mtx, _Cdata.getZoom(_Aself._pageindex)));
        __commitRaphaelData();
        _pathMtx = null;
    }

    // transforms the annotation on the UI space
    _self.transformUI = __transformUI;
    var _pathMtx = null;

    function __transformUI(x, y, w, h) {
        _mtx = Raphael.matrix(w, 0, 0, h, x, y);

        if (!_pathMtx) {
            _pathMtx = __matrixFromData(_Adata, 1);
        }

        _mtx.add(_pathMtx.a, _pathMtx.b, _pathMtx.c, _pathMtx.d, _pathMtx.e, _pathMtx.f);
        __updateFromMatrix();
    }

    // determines if any edge of the second rectangle is inside the bounds of the first
    function __rectInRect(rect1, rect2) {
        return __pointInRect(rect1, rect2.x, rect2.y) || __pointInRect(rect1, rect2.x + rect2.width, rect2.y) || __pointInRect(rect1, rect2.x, rect2.y + rect2.height) || __pointInRect(rect1, rect2.x + rect2.width, rect2.y + rect2.height);
    }

    // determines if the points is within the bounds of the rectangle
    function __pointInRect(rect, x, y) {
        return x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height;
    }

    function __matrixFromData(data, z) {
        var matrix;

        if (data.points && data.points.length > 1) {
            var box = _Aself.getBox();

            matrix = Raphael.matrix(1, 0, 0, 1, 0, 0);
            matrix.scale(1 / box.width, 1 / box.height, 0, 0);
            matrix.translate(-box.x, -box.y);
        } else {
            matrix = Raphael.matrix(z, 0, 0, z, 0, 0);
            matrix.translate(data.x, data.y);
            matrix.scale(data.width, data.height, 0, 0);
        }

        return matrix;
    }

    function __dataFromMatrix(matrix, z) {
        var val = matrix.split();
        var data = {
            x: val.dx / z,
            y: val.dy / z,
            width: val.scalex / z,
            height: val.scaley / z
        };

        return data;
    }
};
'use strict';

//
//  PointerHandler Class
//
//  This source code is property of Atalasoft, Inc. (http://www.atalasoft.com/)
//  Permission for usage and modification of this code is only permitted 
//  with the purchase of a source code license.
//
//  Change History:
//	08-31-12	D. Cilley		File Created.
//	09-11-12	D. Cilley		FB 13589: Improved architecture to allow for easier editing.
//	09-18-12	D. Cilley		FB 13597: Implemented new MouseHandler and TouchHandler.
//	10-17-12	D. Cilley		FB 13671: Added accidental drag threshold for touch hold.
//	11-26-12	D. Cilley		FB 13808: Fixed pinch resizing in Android Chrome.
//	11-28-12	D. Cilley		FB 13813: Fixed click hold + double tap problem.
//	01-08-13	D. Cilley		FB 13899: Fixed grips showing during multi-touch.
//	02-21-13	D. Cilley		FB 14065: Added JSHint options and fixes to comply with JSHint warnings.
//	04-04-13	D. Cilley		FB 13993, 13996, 13997: Added AnnotationSelector for document level selecting.
//	12-17-14	D. Cilley		Bug 550581: Added locally scoped non-conflict jQuery.
//	02-12-15	D. Cilley		Bug 579500: Combined MouseTool and TouchTool for multi-input devices.
//-------------------------------------------------------------------------------------------------

// JSHint options and globals
/*jshint eqnull: true, undef: true, jquery: true, browser: true, es3:false */

// Atalasoft global constructors and functions
/*global Atalasoft */

// Local globals

/**
* Mouse and Touch event handler for annotations
* @private
*/
Atalasoft.Annotations.PointerHandler = function () {
    var $ = Atalasoft.$;
    var _self = this;
    var _jqe = $({}); // jquery instance to bind events to

    var _touch = { // Touch data
        drawing: false, // annotation drawing
        hold: null, // timeout for hold
        pinching: false, // still pinching
        tapped: false, // double tap detected
        touching: false, // still touching
        delta: { x: 0, y: 0 }, // scroll delta
        origin: { x: 0, y: 0 }, // origin position of touch
        point: { x: 0, y: 0 }, // touch point
        moves: 0, // number of moves between start and end
        e: null // most recent touch event
    };

    // Mouse events bound to the Rapheal annotation object by the AnnotationEventHelper 
    _self.events = {
        click: __onClick,
        dblclick: __onDblClick,
        mousedown: __onMouseDown,
        mousemove: __onMouseMove,
        mouseout: __onMouseOut,
        mouseover: __onMouseOver,
        mouseup: __onMouseUp
    };

    // Touch event bound to the Rapheal annotation object by the AnnotationEventHelper 
    if (Atalasoft.Utils.Browser.Features.Touch) {
        $.extend(true, _self.events, {
            touchstart: __onTouchStart,
            touchmove: __onTouchMove,
            touchend: __onTouchEnd
        });
    }

    // #region Public functions

    _self.bind = __bindEvents;
    function __bindEvents() {
        _jqe.bind.apply(_jqe, arguments);

        return _self;
    }

    _self.unbind = __unbindEvents;
    function __unbindEvents() {
        _jqe.unbind.apply(_jqe, arguments);

        return _self;
    }

    // triggers to event handlers bound with bind on this object only 
    _self.trigger = __triggerEvent;
    function __triggerEvent() {
        _jqe.trigger.apply(_jqe, arguments);
    }

    // #endregion

    // #region Interaction

    function __interactStart() {
        __triggerEvent({
            type: 'interactstart'
        });
    }

    function __interactEnd() {
        __triggerEvent({
            type: 'interactend'
        });
    }

    // #endregion

    // #region Mouse Handlers 

    function __onClick(e) {
        __triggerEvent(e);
    }

    function __onDblClick(e) {
        __triggerEvent(e);

        var p = Atalasoft.Utils.getMousePositionJquery(e);
        __triggerEvent({
            type: 'showeditor',
            x: p.x,
            y: p.y
        });
    }

    function __onMouseDown(e) {
        __interactStart();
        __triggerEvent(e);
        __triggerEvent({
            type: 'selectchange',
            shiftKey: e.shiftKey,
            ctrlKey: e.ctrlKey
        });

        if (e.which === 3) {
            __triggerEvent({
                type: 'contextmenu',
                x: e.pageX,
                y: e.pageY,
                event: e
            });
        }
        return false;
    }

    function __onMouseMove(e) {
        __triggerEvent(e);
    }

    function __onMouseOut(e) {
        __triggerEvent(e);
    }

    function __onMouseOver(e) {
        __triggerEvent(e);
    }

    function __onMouseUp(e) {
        __triggerEvent(e);
        __interactEnd();
    }

    // #endregion

    // #region Touch Handlers

    function __onPinchStart(e) {
        e.stopPropagation();
        e.preventDefault();

        _touch.pinching = true;

        __triggerEvent({
            type: 'pinchstart',
            touches: e.originalEvent.touches
        });
    }

    function __onPinchMove(e) {
        e.stopPropagation();
        e.preventDefault();

        __triggerEvent({
            type: 'pinchmove',
            touches: e.originalEvent.touches
        });
    }

    function __onPinchEnd(e) {
        e.stopPropagation();
        e.preventDefault();

        _touch.pinching = false;

        __triggerEvent({
            type: 'pinchend',
            touches: e.originalEvent.touches
        });

        // still touching with one finger, need to start a new touch
        if (e.originalEvent.touches.length === 1) {
            __onTouchStart(e);
        }
    }

    function __onTouchStart(e) {
        _touch.e = e;
        __interactStart();
        __triggerEvent(e);

        if (e.originalEvent.touches.length === 2 && __touchingOneAnno(e.originalEvent.touches)) {
            // need to clear the hold because the first touch started it
            __clearHold();

            // no touching!
            _touch.touching = false;

            // time to pinch
            __onPinchStart(e);
        } else if (e.originalEvent.touches.length === 1) {
            __triggerEvent('selectchange');
            _touch.touching = true;

            // TODO: need to distinguish between touches started by this target, not just e
            var p = Atalasoft.Utils.getMousePositionJquery(e);
            _touch.point.x = p.x;
            _touch.point.y = p.y;

            _touch.hold = setTimeout(__detectHold, 1500);
        }
    }

    function __onTouchMove(e) {
        _touch.e = e;
        __triggerEvent(e);

        if (_touch.pinching) {
            __onPinchMove(e);
        } else {
            _touch.moves++;
        }
    }

    function __onTouchEnd(e) {
        _touch.e = e;
        __triggerEvent(e);

        if (_touch.pinching) {
            __onPinchEnd(e);
        } else if (_touch.touching) {
            _touch.touching = false;

            // stop holding
            __clearHold();

            // reset moves
            _touch.moves = 0;
            // check if we've tapped once before
            if (_touch.tapped) {
                __onDoubleTap(e);
            } else {
                // tapped the first time
                _touch.tapped = true;

                // time between taps detected as a double tap
                setTimeout(__detectDoubleTap, 300);
            }
        }

        __interactEnd();
    }

    function __detectDoubleTap() {
        // reset double tap
        _touch.tapped = false;
    }

    function __onDoubleTap(e) {
        _touch.e = e;
        __triggerEvent({
            type: 'showeditor',
            x: _touch.point.x,
            y: _touch.point.y
        });
    }

    function __detectHold() {
        if (_touch.moves > 0 && _touch.e !== null) {
            var p = Atalasoft.Utils.getMousePositionJquery(_touch.e);

            if (Math.abs(_touch.point.x - p.x) < 5 && Math.abs(_touch.point.y - p.y) < 5) {
                // accidental drag
                _touch.moves = 0;
            }
        }

        if (_touch.moves === 0 && _touch.touching && _touch.e) {
            _touch.touching = false;

            __triggerEvent({
                type: 'contextmenu',
                x: _touch.e.originalEvent.touches[0].pageX,
                y: _touch.e.originalEvent.touches[0].pageY
            });
        }
    }

    function __clearHold() {
        if (_touch.hold !== null) {
            clearTimeout(_touch.hold);
            _touch.hold = null;
        }
    }

    // #endregion

    // #region Helper functions

    // returns true if the touches point to one annotation
    function __touchingOneAnno(touches) {
        var ann = null;

        for (var i = 0; i < touches.length; i++) {
            var obj = touches[i].target;

            if (obj && (obj.raphael || obj.raphaelParent)) {
                if (ann === null) {
                    ann = obj;
                } else if (ann !== obj) {
                    return false;
                }
            } else {
                // html target without raphael parent
                return false;
            }
        }

        return true;
    }

    // #endregion
};
'use strict';

//
//  Font UI class
//
//  This source code is property of Atalasoft, Inc. (http://www.atalasoft.com/)
//  Permission for usage and modification of this code is only permitted 
//  with the purchase of a source code license.
//
//  Change History:
//	02-09-12	D. Cilley		File Created.
//	11-21-12	D. Cilley		FB 13804: Added a way to zoom the text so mobile browsers wouldn't.
//	12-21-12	D. Cilley		FB 13874: Added the ability to render to multiple textarea objects.
//	02-21-13	D. Cilley		FB 14065: Added JSHint options and fixes to comply with JSHint warnings.
//	03-01-13	D. Cilley		FB 14066: TextAnnotations now use HTML rendering for all browsers.
//	12-17-14	D. Cilley		Bug 550581: Added locally scoped non-conflict jQuery.
//-------------------------------------------------------------------------------------------------

// JSHint options and globals
/*jshint eqnull: true, undef: true, jquery: true, browser: true, es3:false */

// Atalasoft global constructors and functions
/*global Atalasoft */

// Local globals

Atalasoft.Annotations.FontUI = function (settings, txtObj) {
    var $ = Atalasoft.$;
    var _Fself = this;
    var _Fta = txtObj; // textarea DOM object
    var _Fdata = { // JSON serializable data object for transport to server
        bold: false,
        italic: false,
        strike: false,
        underline: false,

        color: '#000000',

        family: 'Arial',
        size: 12
    };

    var _Fz = 1.0; // current zoom level
    var _Fvz = 1.0; // viewer zoom level
    var _Fuz = 1.0; // user zoom level
    var _FminSize = Atalasoft.Utils.Browser.Mobile.Any() ? 18 : 8;

    __Finit();
    function __Finit() {
        __FsetData(settings);
    }

    // Dispose
    _Fself.dispose = __Fdispose;
    function __Fdispose() {
        _Fself = null;
        _Fta = null;
        _Fdata = null;
    }

    // map settings onto data
    _Fself.set = __FsetData;
    function __FsetData(cfg) {
        if (cfg) {
            $.extend(_Fdata, cfg);
        }

        __Frepaint();
    }

    _Fself.get = __FgetData;
    function __FgetData(s) {
        if (s) {
            return _Fdata[s];
        } else {
            // TODO: we may want to return a copy here so people can't mess with
            // the internal variables while we're doing something with it
            return _Fdata;
        }
    }

    _Fself.repaint = __Frepaint;
    function __Frepaint(jqtxt, zoom, noadjust) {
        jqtxt = jqtxt ? jqtxt : _Fta;

        if (jqtxt) {
            zoom = zoom !== undefined ? zoom : _Fz;

            if (!noadjust) {
                // auto adjusts the zoom if the font is too small to read
                __FadjustZoom();
            }

            __FapplyTo(jqtxt, zoom);
        }
    }

    // applies the current font properties to the given jQuery object(s)
    _Fself.applyTo = __FapplyTo;
    function __FapplyTo(jqObj, zoom) {
        var txtDec = 'none';
        if (_Fdata.strike || _Fdata.underline) {
            txtDec = _Fdata.strike ? 'line-through ' : '';
            txtDec += _Fdata.underline ? 'underline' : '';
        }

        jqObj.css({
            'color': _Fdata.color,
            'font-family': _Fdata.family,
            'font-style': _Fdata.italic ? 'italic' : 'normal',
            'font-weight': _Fdata.bold ? 'bold' : 'normal',
            'font-size': _Fdata.size * (zoom || 1) + 'pt',
            'text-decoration': txtDec
        });
    }

    function __FadjustZoom() {
        var docwidth = document.width || window.outerWidth;
        var uz = docwidth / window.innerWidth;

        if (_Fuz !== uz) {
            _Fuz = uz;
        }

        if (_Fdata.size * _Fvz < _FminSize) {
            _Fz = _FminSize / _Fuz / _Fdata.size;
        } else {
            _Fz = _Fvz;
        }
    }

    _Fself.getAdjustedZoom = __FgetAdjustedZoom;
    function __FgetAdjustedZoom() {
        __FadjustZoom();
        return _Fz;
    }

    _Fself.getUserZoom = __FgetUserZoom;
    function __FgetUserZoom() {
        __FadjustZoom();
        return _Fuz;
    }

    _Fself.getZoom = __FgetZoom;
    function __FgetZoom() {
        return _Fvz;
    }

    _Fself.setZoom = __FsetZoom;
    function __FsetZoom(f) {
        _Fvz = f;
        __Frepaint();
    }
};
'use strict';

//
//  Renders textarea tags to a base64 data string
//
//  This source code is property of Atalasoft, Inc. (http://www.atalasoft.com/)
//  Permission for usage and modification of this code is only permitted 
//  with the purchase of a source code license.
//
//  Change History:
//	03-01-13	D. Cilley		File Created.
//	03-01-13	D. Cilley		FB 14066: Normalized TextAnnotations to use HTML rendering for all browsers.
//	01-22-14	D. Cilley		Bug 307592: Fixed RTL text rendering in IE9+
//	12-17-14	D. Cilley		Bug 550581: Added locally scoped non-conflict jQuery.
//-------------------------------------------------------------------------------------------------

// JSHint options and globals
/*jshint eqnull: true, undef: true, jquery: true, browser: true, es3:false */

// Atalasoft global constructors and functions
/*global Atalasoft */

// Local globals

// creates an object that renders TextData to base64 dataUrl, using a canvas tag 
Atalasoft.Annotations.AnnotationTextRenderer = function (annData, fontUI) {
	var $ = Atalasoft.$;
	var _self = this;
	var _data = annData; // annotation data object (do not modify)
	var _font = fontUI; // FontUI object from the TextAnnotationUI
	var _canvas = null; // canvas for offscreen rendering
	var _span = null; // span tag for line height calculation
	var _rtl = false; // boolean set when text should be rendered right to left
	var _separators = { // separators to split text on (normalized on IE and Webkit behavior)
		' ': true,
		'-': true,
		'?': true,
		'\n': true,
		'\t': true
	};

	var _lastRenderData = null; // cache to avoid unnecessary images generation on annotation drag
	function __init() {
		__detectRTL();

		_canvas = $('<canvas ' + (_rtl ? 'dir="rtl"' : '') + '/>');

		// negative left values move object off screen in a way that doesn't make scrollbars appear
		_span = $('<span style="position:absolute; visibility:hidden; left: -5000px;">{[|,0123456789Thqkbfjplyg</span>');

		$(document.body).append(_span);
	}

	function __detectRTL() {
		var b = document.body;
		var v;

		if (b.currentStyle) {
			v = b.currentStyle.direction;
		} else if (window.getComputedStyle) {
			v = document.defaultView.getComputedStyle(b, null).getPropertyValue('direction');
		}

		if (v.toLowerCase() === 'rtl') {
			_rtl = true;
		}
	}

	// Dispose
	_self.dispose = __dispose;
	function __dispose() {
		_self = null;
		_data = null;
		_font = null;

		// objects created by the renderer
		if (_canvas && _canvas.remove) {
			_canvas.remove();
			_canvas = null;
		}

		if (_span && _span.remove) {
			_span.remove();
			_span = null;
		}
	}

	_self.renderToDataURL = __renderToDataURL;
	function __renderToDataURL(size) {
		if (!_canvas || !_span) {
			__init();
		}

		_font.applyTo(_span);

		_canvas[0].width = size.width; //(props.paddingLeft + props.paddingRight + txt.width());
		_canvas[0].height = size.height; //(props.paddingTop + props.paddingTop + txt.height());

		//need to accomodate for outline/2 + margin

		// need new context for each render
		var ctx = _canvas[0].getContext('2d');
		var lines = __splitLines(ctx, _data.text.value, size.width);

		var lineHeight = __calcLineHeight(lines.length);
		var fontSize = !_data.text.autoscale ? _data.text.font.size : lineHeight;
		var ctxfont = [_data.text.font.italic ? 'italic' : 'normal', _data.text.font.bold ? 'bold' : 'normal', fontSize + 'px', _data.text.font.family];

		ctx.font = ctxfont.join(' ');
		ctx.fillStyle = _data.text.font.color;
		ctx.textBaseline = 'top';

		var y = 0; //props.paddingTop;
		var longestLine = lines.length ? lines[0] : '';
		var i;
		for (i = 0; i < lines.length; i++) {
			if (lines[i].length > longestLine.length) longestLine = lines[i];
		}

		var maxWidth = ctx.measureText(longestLine).width;
		var start = _rtl ? maxWidth : 0;

		if (_data.text.autoscale && _data.text.align !== 'left') {
			switch (_data.text.align) {
				case 'center':
					ctx.textAlign = _data.text.align;
					start = maxWidth / 2;
					break;
				case 'right':
					ctx.textAlign = _data.text.align;
					start = !_rtl ? maxWidth : 0;
					break;
				default:
					ctx.textAlign = 'start';
					start = !_rtl ? 0 : maxWidth;
			}
		}

		if (_data.text.autoscale) {
			var scale = size.width / maxWidth;
			ctx.scale(scale, 1);
		}

		if (!_data.text.autoscale) {
			switch (_data.text.align) {
				case 'center':
					ctx.textAlign = _data.text.align;
					start = size.width / 2;
					break;
				case 'right':
					ctx.textAlign = _data.text.align;
					start = size.width;
					break;
			}
		}

		for (i = 0; i < lines.length; i++) {
			ctx.fillText(lines[i], start, y, maxWidth);
			y = y + lineHeight;
		}

		return _canvas[0].toDataURL();
	}

	_self.renderToSVGImage = __renderToSVGImage;
	function __renderToSVGImage(svg, size) {
		var ld = _lastRenderData;
		if (!ld || ld.width !== size.width || ld.height !== size.height || ld.text !== annData.text.value || ld.align !== annData.text.align) {
			_lastRenderData = {
				width: size.width,
				height: size.height,
				text: annData.text.value,
				align: annData.text.align
			};
			svg.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', __renderToDataURL(size));
		}
	}

	// uses the span tag to determine an approximate line height
	function __calcLineHeight(lineCount) {
		if (!_data.text.autoscale) {
			_font.applyTo(_span, 1);
			return _span[0].offsetHeight;
		} else {
			var height = Math.max(0, _data.height - _data.outline.width * 2);
			return lineCount > 0 ? Math.floor(height / lineCount) : height;
		}
	}

	// splits the given text into lines wrapped to the maxWidth
	function __splitLines(ctx, textToWrap, maxWidth) {
		var lines = [];

		if (typeof textToWrap === 'string') {
			var nl = '\n';
			if (_data.text.autoscale) {
				return textToWrap.split(nl);
			}

			var text = textToWrap;
			var width = maxWidth;
			var words = __splitWords(text);
			var prevWord = '',
			    currWord = '';
			var currLine = [];

			for (var i = 0; i < words.length; i++) {
				prevWord = currWord;
				currWord = words[i];

				// test to see if single word > width of bounding box
				if (ctx.measureText(currWord).width > width) {
					var chars = currWord.split('');

					for (var j = 0; j < chars.length; j++) {
						currLine.push(chars[j]);

						if (ctx.measureText(currLine.join('')).width > width) {
							// push pop push is faster than splice
							currLine.pop();
							lines.push(currLine.join(''));
							currLine.length = 0;
							currLine.push(chars[j]);
						}
					}
				} else {
					currLine.push(currWord);

					if (ctx.measureText($.trim(currLine.join(''))).width > width || prevWord.indexOf(nl) >= 0) {
						// push pop push is faster than splice
						currLine.pop();
						lines.push(currLine.join(''));
						currLine.length = 0;
						currLine.push(currWord);
					}
				}
			}

			if (currLine.length > 0) {
				lines.push(currLine.join(''));
				currLine.length = 0;
			}
		}

		return lines;
	}

	function __splitWords(s) {
		var words = [];
		var prev = '';
		var lastpos = 0;

		for (var i = 0; i < s.length; i++) {
			var c = s[i];

			if (_separators[prev]) {
				words.push(s.substr(lastpos, i - lastpos));

				lastpos = i;
			}

			prev = c;
		}

		if (lastpos < i) {
			words.push(s.substr(lastpos, i - lastpos));
		}

		return words;
	}
};
'use strict';

//
//  Provides events for custom annotation rendering
//
//  This source code is property of Atalasoft, Inc. (http://www.atalasoft.com/)
//  Permission for usage and modification of this code is only permitted 
//  with the purchase of a source code license.
//
//  Change History:
//	10-01-14	D. Cilley		File Created.
//-------------------------------------------------------------------------------------------------

// JSHint options and globals
/*jshint eqnull: true, undef: true, jquery: true, browser: true, es3:false */

// Atalasoft global constructors and functions
/*global Atalasoft */

// Local globals

// creates an object that renders custom annotations, based on the available renderer
Atalasoft.Annotations.AnnotationCustomRenderer = function (annData, evtHelper) {
    var _self = this;
    var _data = annData; // annotation data object (do not modify)
    var _constructor = null; // method pointer to return a Raphael object
    var _renderer = null; // method pointer to render the annotation
    var _jqe = evtHelper; // jquery instance to bind events to

    // #region Lifecycle

    function __init() {
        _constructor = _data.constructor ? _data.constructor : __serverConstructor;
        _renderer = _data.renderer ? _data.renderer : __serverRenderer;
    }

    _self.dispose = __dispose;
    function __dispose() {
        _self = null;
        _data = null;
        _constructor = null;
        _renderer = null;
    }

    // #endregion

    // #region jQuery Event handling

    // jQuery bind shortcut
    _self.bind = __bindEvents;
    function __bindEvents() {
        _jqe.bind.apply(_jqe, arguments);

        return _self;
    }

    // jQuery unbind shortcut
    _self.unbind = __unbindEvents;
    function __unbindEvents() {
        _jqe.unbind.apply(_jqe, arguments);

        return _self;
    }

    // jQuery trigger shortcut
    _self.trigger = __triggerEvent;
    function __triggerEvent() {
        _jqe.trigger.apply(_jqe, arguments);

        return _self;
    }
    // #endregion

    // #region Public methods

    _self.construct = __construct;
    function __construct(paper) {
        return _constructor(paper, _data);
    }

    _self.render = __render;
    function __render(annObject) {
        _renderer(annObject, _data);
    }

    // #endregion

    // #region Server rendering

    function __serverConstructor(paper) {
        return paper.image();
    }

    function __serverRenderer(annObject) {
        if (_data.customurl) {
            annObject.attr('src', _data.customurl);
        } else {
            __serverImageQueryRequest();
        }
    }

    function __serverImageQueryRequest() {
        __triggerEvent('serverrenderurlrequested', {
            data: _data,
            complete: __serverImageQueryReturned
        });
    }

    function __serverImageQueryReturned(data) {
        data.customurl = data;
    }

    // #endregion

    // #region Helper methods


    // #endregion

    __init();
    return _self;
};
'use strict';

//
//  Provides a wrapper for creating SVG path strings
//
//  This source code is property of Atalasoft, Inc. (http://www.atalasoft.com/)
//  Permission for usage and modification of this code is only permitted 
//  with the purchase of a source code license.
//
//  Change History:
//	12-09-14	D. Cilley		File Created.
//-------------------------------------------------------------------------------------------------

// JSHint options and globals
/*jshint eqnull: true, undef: true, jquery: true, browser: true, es3:false */

// Atalasoft global constructors and functions
/*global Atalasoft */

// Local globals

// creates an object that keeps track of the path points while drawing custom annotations
Atalasoft.Annotations.PathHelper = function (annData) {
    var _self = this;
    var _data = annData; // annotation data object (only points modified)
    var _commands = [];

    // #region Lifecycle

    function __init() {
        if (_data.points) {
            _data.points.length = 0;
        }
    }

    _self.dispose = __dispose;
    function __dispose() {
        _self = null;
        _data = null;
        _commands.length = 0;
        _commands = null;
    }

    // #endregion

    // #region Public methods

    _self.moveTo = __moveTo;
    function __moveTo(x, y, relative) {
        // M
        _commands = _commands.concat([relative ? 'm' : 'M', x, y]);
        __addPoint(x, y);
    }

    _self.lineTo = __lineTo;
    function __lineTo(x, y, relative) {
        // L
        _commands = _commands.concat([relative ? 'l' : 'L', x, y]);
        __addPoint(x, y);
    }

    _self.lineToHorizontal = __lineToHorizontal;
    function __lineToHorizontal(x, relative) {
        // H
        _commands = _commands.concat([relative ? 'h' : 'H', x]);
        __addPoint(x, null);
    }

    _self.lineToVertical = __lineToVertical;
    function __lineToVertical(y, relative) {
        // V
        _commands = _commands.concat([relative ? 'v' : 'V', y]);
        __addPoint(null, y);
    }

    _self.curveTo = __curveTo;
    function __curveTo(x1, y1, x2, y2, x, y, relative) {
        // C
        _commands = _commands.concat([relative ? 'c' : 'C', x1, y1, x2, y2, x, y]);
        __addPoint(x, y);
    }

    _self.curveToSmooth = __curveToSmooth;
    function __curveToSmooth(x2, y2, x, y, relative) {
        // S
        _commands = _commands.concat([relative ? 's' : 'S', x2, y2, x, y]);
    }

    _self.curveToQuadratic = __curveToQuadratic;
    function __curveToQuadratic(x1, y1, x, y, relative) {
        // Q
        _commands = _commands.concat([relative ? 'q' : 'Q', x1, y1, x, y]);
    }

    _self.curveToQuadraticSmooth = __curveToQuadraticSmooth;
    function __curveToQuadraticSmooth(x, y, relative) {
        // T
        _commands = _commands.concat([relative ? 't' : 'T', x, y]);
    }

    _self.ellipticalArc = __ellipticalArc;
    function __ellipticalArc(rx, ry, xRotation, largeArcFlag, sweepFlag, x, y, relative) {
        // A
        _commands = _commands.concat([relative ? 'a' : 'A', rx, ry, xRotation, largeArcFlag, sweepFlag, x, y]);
    }

    _self.close = __closePath;
    function __closePath() {
        // Z
        _commands.push('Z');
    }

    _self.toArray = __toArray;
    function __toArray() {
        return _commands;
    }

    // #endregion

    // #region Helper methods

    function __addPoint(x, y) {
        _data.points.push({ x: x, y: y });
    }

    // #endregion

    __init();
    return _self;
};
'use strict';

//
//  Form Field class
//
//  This source code is property of Atalasoft, Inc. (http://www.atalasoft.com/)
//  Permission for usage and modification of this code is only permitted 
//  with the purchase of a source code license.
//
//  Change History:
//	03-28-14	D. Cilley		File Created.
//	12-17-14	D. Cilley		Bug 550581: Added locally scoped non-conflict jQuery.
//  04-13-15	A. Huck			Bug 595087: Changed form element from input[type=text] to textarea if multiline is true.
//  04-15-15	A. Huck			Bug 595087: Added getParentName and getName methods. Added code to propagate changes to multiview form fields.
//  05-11-15	A. Daniell		Bug 611100: Fixed size of textarea to match 'noScroll' behavior in multiline pdf text form. 
//  05-22-15	A. Daniell		Bug 611100: Added text form data value to store the max height after initial rendering.
//  06-03-15	A. Daniell		Bug 611100: Added a config option to preserve overflow on load.
//  06-04-15	A. Daniell		Bug 611100: Added an update to the text data layer on input.
//	06-11-15	A. Huck			Bug 623575: Added handlers to stop propagation of mousedown and mouseup events.
//  08-18-15	A. Huck			Bug 635762: Added support the maxlength property of text fields.
//-------------------------------------------------------------------------------------------------

// JSHint options and globals
/*jshint eqnull: true, undef: true, jquery: true, browser: true */

// Atalasoft global constructors and functions
/*global Atalasoft */

// Local globals

Atalasoft.Forms.Field = function (settings, fdata, pageindex) {
    var $ = Atalasoft.$;
    var _Fdata = fdata; // form controller data object (do not modify values)
    var _self = this;
    var _jqe = $({}); // jquery instance to bind events to
    var _jqebound = null; // UI events bound 
    var _obj = null; // HTML obj
    var _clone = null;
    var _pageindex = pageindex;
    var _data = { // JSON serializable data object for transport to server
        type: '',

        backgroundcolor: '',
        color: null,
        fieldname: '',
        hidden: false,
        isfieldrequired: false,
        items: null,
        locked: false,
        norotate: false,
        noview: false,
        nozoom: false,
        readonly: false,
        required: false,

        x: 0,
        y: 0,
        width: 0,
        height: 0,

        // this is fields own rotation to compensate pdf page rotation.
        // we only need to rotate around center here - server will calculate translation.
        rotation: 0,
        border: {
            color: '#000',
            style: 'none',
            radius: {
                vertical: 0,
                horizontal: 0
            },
            width: 0
        },

        text: { // text based fields
            value: null, // text contents!
            align: 'left',
            font: { // font props
                bold: false,
                italic: false,
                strike: false,
                underline: false,
                color: 'black',
                family: 'Arial',
                size: 12,
                paddingtop: 0,
                linespacing: 0
            },
            ismultiline: false,
            ispassword: false,
            isrichtext: false,
            scrollable: false,
            maxlength: 0,
            maximumfieldheight: -1, //-1 = initial load
            preserveoverflow: false
        }
    };

    // default properties for specific field types
    var _defaults = {
        button: {},
        checkbox: {
            checked: false,
            group: null
        },
        radio: {
            checked: false,
            group: null
        },
        textbox: {
            text: {
                leftPadding: 2,
                rightPadding: 2,
                preserveoverflow: false
            }
        },
        signature: {
            text: {
                leftPadding: 2,
                rightPadding: 2,
                preserveoverflow: false
            }
        },
        choice: {
            multiline: false
            //			text: {
            //				padstart: 3
            //			}
        }
    };

    // default UI event handling 
    var _uiEvents = {};

    // #region Control Lifecycle

    // One-time initialization.	
    __staticInit();
    function __staticInit() {
        if (Atalasoft.Forms.Field.__staticInitOccured) {
            // Do nothing if it's occured already.
            return;
        } else {
            // Mark it as 'occured', so it does not get called a second time.
            Atalasoft.Forms.Field.__staticInitOccured = true;
        }

        // Fixes IE8/IE9 lack of oninput support. 
        // Derived from: http://benalpert.com/2013/06/18/a-near-perfect-oninput-shim-for-ie-8-and-9.html
        //				 (c) 2013 Ben Alpert, released under the MIT license.
        if (Atalasoft.Utils.Browser.Explorer && Atalasoft.Utils.Browser.Version <= 9) {
            (function () {
                var activeElement = null;
                var activeElementValue = null;
                var activeElementValueProp = null;

                var newValueProp = {
                    get: function get() {
                        return activeElementValueProp.get.call(this);
                    },
                    set: function set(val) {
                        activeElementValue = val;
                        activeElementValueProp.set.call(this, val);
                    }
                };

                var handlePropertyChange = function handlePropertyChange(e) {
                    if (e.propertyName !== "value") {
                        return;
                    }

                    var value = e.srcElement.value;
                    if (value === activeElementValue) {
                        return;
                    }

                    activeElementValue = value;
                    if ($(e.srcElement).data("ataladata") != null) {
                        $(activeElement).trigger("input");
                    }
                };

                var startWatching = function startWatching(target) {
                    activeElement = target;
                    activeElementValue = target.value;
                    activeElementValueProp = Object.getOwnPropertyDescriptor(target.constructor.prototype, "value");

                    Object.defineProperty(activeElement, "value", newValueProp);
                    activeElement.attachEvent("onpropertychange", handlePropertyChange);
                };

                var stopWatching = function stopWatching() {
                    if (!activeElement) {
                        return;
                    }

                    delete activeElement.value;
                    activeElement.detachEvent("onpropertychange", handlePropertyChange);

                    activeElement = null;
                    activeElementValue = null;
                    activeElementValueProp = null;
                };

                $(document).on("focusin", function (e) {
                    if (e.target.nodeName === "TEXTAREA" || e.target.nodeName === "INPUT" && (e.target.type === "text" || e.target.type === "password")) {
                        stopWatching();
                        startWatching(e.target);
                    }
                });

                $(document).on("focusout", function () {
                    stopWatching();
                });

                $(document).on("selectionchange keyup keydown", function (e) {
                    if (activeElement && activeElement.value !== activeElementValue) {
                        activeElementValue = activeElement.value;

                        if ($(e.srcElement).data("ataladata") != null) {
                            $(activeElement).trigger("input");
                        }
                    }
                });
            })();
        }
    }

    __init();
    function __init() {
        _self._pageindex = pageindex;
        __initData(settings.type);
        __setData(settings, true);

        // future draw support
        //		_draw = new Atalasoft.Annotations.DrawHandler(_data, _Fdata, _jqe);
        //		__bindEvents({
        //			repaint: _draw.events.update,
        //			viewchanged: _draw.events.viewchanged,
        //			drawn: __bindUiEvents
        //		});
        //		
        //		// This has to be initialized after _draw is initialized
        //		__initUiEvents();
    }

    /* future draw events
    function __initUiEvents(){
        _uiEvents = {
              // selectable events
            selectable: {
                selectchange: __toggleSelected
            },
            
            // moving events
            movable: {
                dragstart: _draw.events.dragstart,
                dragmove: _draw.events.dragmove,
                dragend: _draw.events.dragend
            },
            
            // resizing events for mobile
            resizable: {
                pinchstart: _draw.events.pinchstart,
                pinchmove: _draw.events.pinchmove,
                pinchend: _draw.events.pinchend
            },
              boundEvents: {
                resizable: false,
                movable: false,
                selectable: false	
            },
              isBound: function(property){
                return this.boundEvents[property];
            },
              bound: function(property){
                this.boundEvents[property] = true;	
            },
              unbound: function(property){
                this.boundEvents[property] = false;
            }
        };
    }
    */

    function __initData(fType) {
        $.extend(true, _data, _defaults[fType]);
    }

    _self.dispose = __dispose;
    function __dispose() {
        //		if (_data.selected){
        //			__toggleSelected();
        //		}

        if (_jqe) {
            _jqe.unbind();
        }

        _Fdata = null;
        _self = null;
        _jqe = null;
        _data = null;
    }

    // #endregion

    // #region Exposed Methods

    _self.bind = __bindEvents;
    function __bindEvents() {
        _jqe.bind.apply(_jqe, arguments);
    }

    _self.unbind = __unbindEvents;
    function __unbindEvents() {
        _jqe.unbind.apply(_jqe, arguments);
    }

    _self.trigger = __triggerEvent;
    function __triggerEvent() {
        _jqe.trigger.apply(_jqe, arguments);
        return _self;
    }

    // map settings onto data
    _self.set = __setData;
    function __setData(cfg, deep) {
        if (cfg) {
            if (deep) {
                $.extend(true, _data, cfg);
            } else {
                $.extend(_data, cfg);
            }
        }
    }

    _self.get = __getData;
    function __getData(s) {
        if (s) {
            return _data[s];
        } else {
            return _data;
        }
    }

    _self.setPageIndex = __setPageIndex;
    function __setPageIndex(index) {
        _pageindex = index;
        if (_self.hasOwnProperty('_pageindex')) {
            _self._pageindex = index;
        }
    }

    function __makeClonedData() {
        function __removeCloneExtras() {
            if (_data.update) {
                delete _data.update;
            }
        }

        _clone = {
            update: function update() {
                // need to toggle selected before we overwite the data
                //				if (_data.selected !== _clone.selected){
                //					__toggleSelected();
                //				}

                //TODO: check if data changed, and fire a datachanged event

                $.extend(true, _data, _clone);

                __removeCloneExtras();

                __updateView();
                __repaint();
                __rebindUiEvents();
            }
        };

        $.extend(true, _clone, _data);
    }

    _self.getClonedData = __getClonedData;
    function __getClonedData() {
        if (!_clone) {
            __makeClonedData();
        } else {
            $.extend(true, _clone, _data);
        }

        return _clone;
    }

    _self.getObject = __getObject;
    function __getObject() {
        return _obj;
    }

    _self.getEventObject = __getEventObject;
    function __getEventObject() {
        return _jqe;
    }

    _self.getZoom = function () {
        return _Fdata.zoom;
    };

    _self.stringify = __stringify;
    _self.getJSON = __stringify;
    function __stringify() {
        return JSON.stringify(_data);
    }
    /*	
        _self.toggleSelected = __toggleSelected;
        function __toggleSelected(e){
            if (!_data){
                return;
            }
            
            // event args to trigger	
            var evt = {
                field: _self,
                append: true,	// when e is undefined, we always append
                page: null,
                pageindex: _self._pageindex,
                type: ''
            };
            
            if (e){
                evt.append = (e.shiftKey || e.ctrlKey || (typeof(e.append) !== 'undefined' && e.append));
                evt.page = e.page;
                evt.pageindex = e.pageindex;
            }
            
            // only toggle if we're appending or it's not already selected
            if (evt.append || !_data.selected){
                _data.selected = !_data.selected;
                
                evt.type = (_data.selected) ? 'selected': 'deselected';
            }
            // clicked without append needs to notify controller
            else if (_data.selected && !evt.append){
                evt.type = 'reselected';
            }
            
            // only fire an event if we have something to do
            if (evt.type !== ''){
                __triggerEvent(evt);
            }
        }
    */
    // #endregion

    // browser-independent method for getting the selected text in a input or textarea element.
    // See: http://stackoverflow.com/a/3373056
    function __getTextSelection(element) {
        var start = 0,
            end = 0,
            normalizedValue,
            range,
            textInputRange,
            len,
            endRange;

        if (typeof element.selectionStart === "number" && typeof element.selectionEnd === "number") {
            start = element.selectionStart;
            end = element.selectionEnd;
        } else {
            range = document.selection.createRange();

            if (range && range.parentElement() === element) {
                len = element.value.length;
                normalizedValue = element.value.replace(/\r\n/g, "\n");

                // Create a working TextRange that lives only in the input
                textInputRange = element.createTextRange();
                textInputRange.moveToBookmark(range.getBookmark());

                // Check if the start and end of the selection are at the very end
                // of the input, since moveStart/moveEnd doesn't return what we want
                // in those cases
                endRange = element.createTextRange();
                endRange.collapse(false);

                if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
                    start = end = len;
                } else {
                    start = -textInputRange.moveStart("character", -len);
                    start += normalizedValue.slice(0, start).split("\n").length - 1;

                    if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
                        end = len;
                    } else {
                        end = -textInputRange.moveEnd("character", -len);
                        end += normalizedValue.slice(0, end).split("\n").length - 1;
                    }
                }
            }
        }

        return {
            start: start,
            end: end
        };
    }

    // See: http://stackoverflow.com/a/3275506
    function __offsetToRangeCharacterMove(element, offset) {
        return offset - (element.value.slice(0, offset).split("\r\n").length - 1);
    }

    // Browser-independent function to set the selected text in an input or textarea element
    // See: http://stackoverflow.com/a/3275506
    function __setTextSelection(element, selection) {
        if (typeof element.selectionStart === "number" && typeof element.selectionEnd === "number") {
            element.selectionStart = selection.start;
            element.selectionEnd = selection.end;
        } else {
            var range = element.createTextRange();
            var startCharMove = __offsetToRangeCharacterMove(element, selection.start);
            range.collapse(true);
            if (selection.start === selection.end) {
                range.move("character", startCharMove);
            } else {
                range.moveEnd("character", __offsetToRangeCharacterMove(element, selection.end));
                range.moveStart("character", startCharMove);
            }
            range.select();
        }
    }

    // #region DOM Creation & Events
    // Since we don't know which drawing surface this field will be drawn
    // on, we need to create it starts drawing
    // form: jQuery drawing surface for this form field
    function __createField(form) {
        var fobj = null;

        switch (_data.type) {
            case 'button':
                fobj = $('<button/>');
                fobj.click(function () {
                    __triggerEvent({
                        type: 'buttonclicked',
                        name: _data.fieldname
                    });

                    return false;
                });
                break;
            case 'textbox':
            case 'signature':
                if (_data.text.multiline) {
                    fobj = $('<textarea style="overflow-y:' + (_data.text.scrollable ? "auto" : "hidden") + ';resize:none"></textarea>');
                } else {
                    fobj = $('<input type="text" />');
                }

                // Normalizes the _data.text.value. (Fixes some issues caused by how different browsers interpret linebreaks)
                _data.text.value = fobj.val(_data.text.value).val();

                var isPasted = false;
                fobj.on("paste", function () {
                    // Used to notify oninput event that onpaste is what caused the value to change
                    isPasted = true;
                    return true;
                });

                fobj.on("input", function (e) {
                    if (_data.text.maximumfieldheight === -1) {
                        //initial
                        _data.text.maximumfieldheight = $(this).get(0).scrollHeight;
                    }

                    var isMaxLength = _data.text.maxlength > 0 && $(this).val().length > _data.text.maxlength;
                    var isMaxHeight = !_data.text.scrollable && $(this).get(0).scrollHeight > _data.text.maximumfieldheight;
                    var isAddingText = $(this).val().length > _data.text.value.length;

                    if (isAddingText && (isMaxLength || isMaxHeight)) {
                        var selection = __getTextSelection(e.target);

                        if (isPasted && _data.text.maxlength > 0) {
                            var currValue = $(this).val();
                            var isPastingAtEnd = currValue.length === selection.start;
                            if (isPastingAtEnd) {
                                // If pasting at the end of the string, all we have to do is make sure to truncate any extra characters at the end.
                                $(this).val(currValue.substr(0, _data.text.maxlength));
                            } else {
                                // If pasting within a string (Inserting text) we need to determine how many characters of the pasted text can fit and only insert that many characters.

                                // The length of the string which was pasted.
                                var pastedLength = currValue.length - _data.text.value.length;

                                // The number of remaining characters (I.e. How many more can fit).
                                var remainder = _data.text.maxlength - _data.text.value.length;

                                // Get the left string (Beginning, including however many characters in the pasted value can fit within the remaining characters)
                                var left = currValue.substr(0, selection.start - pastedLength + remainder);

                                // Get the ending string (Ending text, starting where the pasted text ended).
                                var right = _data.text.value.substr(selection.start - pastedLength);

                                // Concatenate them together to get the new value.
                                $(this).val(left + right);

                                // Put the text cursor back where it started (This gets set to the end of the string by the call to .val).
                                __setTextSelection(e.target, {
                                    start: left.length,
                                    end: left.length
                                });
                            }
                        } else {
                            $(this).val(_data.text.value); //reset to last fitting val

                            // Put the text cursor back where it started (This gets set to the end of the string by the call to .val).
                            __setTextSelection(e.target, {
                                start: selection.start - 1,
                                end: selection.start - 1
                            });
                        }
                    }
                    if (!_data.text.preserveoverflow && $(this).get(0).scrollHeight < _data.text.maximumfieldheight) {
                        //allow maxfieldheight to shrink back to client height(min of scroll height)
                        _data.text.maximumfieldheight = $(this).get(0).scrollHeight;
                    }
                    _data.text.value = $(this).val();

                    // Reset isPasted.
                    isPasted = false;
                });
                break;
            case 'checkbox':
                fobj = $('<input type="checkbox" />').prop({
                    name: _data.group,
                    checked: _data.checked
                });

                fobj.val(_data.value);
                break;
            case 'radio':
                fobj = $('<input type="radio" />').prop({
                    name: _data.group,
                    checked: _data.checked
                });

                fobj.val(_data.value);
                break;
            case 'choice':
                fobj = $('<select></select>');
                fobj.text(_data.value);
                fobj.attr({
                    multiple: _data.multiple,
                    size: _data.multiline && _data.items ? _data.items.length : 0
                });

                if (_data.items) {
                    fobj.items = [];

                    for (var itemkey in _data.items) {
                        if (_data.items.hasOwnProperty(itemkey)) {
                            var opt = $('<option></option>', {
                                selected: _data.items[itemkey].checked,
                                value: _data.items[itemkey].value,
                                text: _data.items[itemkey].text
                            });

                            fobj.append(opt);
                            fobj.items[itemkey] = opt;
                        }
                    }
                }

                // this is to force a change event to fire on mouse or touch select for multiline fields
                if (_data.multiline && _data.items) {
                    var manualTrigger = function manualTrigger(e) {
                        $(this).trigger('change');
                    };

                    fobj.bind({
                        mouseup: manualTrigger,
                        touchend: manualTrigger
                    });
                }

                break;
            case 'generic':
                fobj = $("<div></div>");
                break;
        }

        // generally one time set properties
        if (fobj) {
            if (_data.type === 'textbox' || _data.type === 'signature') {
                var top = _data.text.font.paddingtop;
                var lineHeight = _data.text.font.linespacing > 0 ? _data.text.font.linespacing + "px" : "1.14pt";
                fobj.css({
                    resize: 'none',
                    position: 'absolute',
                    paddingTop: _data.multiline ? top : 0,
                    paddingBottom: _data.multiline ? '2pt' : 0,
                    lineHeight: lineHeight,
                    margin: 0,
                    '-webkit-box-sizing': 'border-box',
                    '-moz-box-sizing': 'border-box',
                    'box-sizing': 'border-box'
                });
            } else {
                fobj.css({
                    resize: 'none',
                    position: 'absolute',
                    padding: 0,
                    margin: 0,
                    '-webkit-box-sizing': 'border-box',
                    '-moz-box-sizing': 'border-box',
                    'box-sizing': 'border-box'
                });
            }

            fobj.bind({
                click: Atalasoft.Utils.__sp,
                mousedown: Atalasoft.Utils.__sp,
                mouseup: Atalasoft.Utils.__sp,
                change: __onFieldChanged,
                uncheck: __onFieldUnchecked,
                focusin: __onFieldFocusIn,
                focusout: __onFieldFocusOut
            });
        }

        if (form._fields) {
            form._fields.push(fobj);
        }

        if (Atalasoft.Utils.Browser.Explorer && Atalasoft.Utils.Browser.Version <= 9) {
            // Used to identify this element as having been created by the WDV
            fobj.data("ataladata", {});
        }

        form.append(fobj);

        return fobj;
    }

    /*
    function __bindUiEvents(){
        if (_jqebound !== null){
            if (_obj){
                _jqe.unbind(_obj, _jqebound);
            }
            else {
                _jqe.unbind(_jqebound);
            }
        }
          var evts = {};
    
        if (_data.selectable){
            $.extend(evts, _uiEvents.selectable); 
            _uiEvents.bound('selectable');
            
            if (!_Fdata.readonly && _data.movable){
                $.extend(evts, _uiEvents.movable);
                _uiEvents.bound('movable');
            }
            
            if (!_Fdata.readonly && _data.resizable && Atalasoft.Utils.Browser.Features.Touch){
                $.extend(evts, _uiEvents.resizable);
                _uiEvents.bound('resizable');
            }
        }
          _jqebound = evts;
        _jqe.bind(_obj, evts);
    }	
    */

    function __rebindUiEvents() {
        if (_jqebound !== null) {
            // if the data is selectable but the event is not yet bound
            if (_data.selectable) {
                if (!_uiEvents.isBound('selectable')) {
                    _jqe.bind(_uiEvents.selectable);
                    _uiEvents.bound('selectable');
                }

                if (_data.movable && !_uiEvents.isBound('movable')) {
                    _jqe.bind(_uiEvents.movable);
                    _uiEvents.bound('movable');
                } else if (!_data.movable && _uiEvents.isBound('movable')) {
                    _jqe.unbind(_uiEvents.movable);
                    _uiEvents.unbound('movable');
                }

                if (Atalasoft.Utils.Browser.Features.Touch) {
                    if (_data.resizable && !_uiEvents.isBound('resizable')) {
                        _jqe.bind(_uiEvents.resizable);
                        _uiEvents.bound('resizable');
                    } else if (!_data.resizable && _uiEvents.isBound('resizable')) {
                        _jqe.unbind(_uiEvents.resizable);
                        _uiEvents.unbound('resizable');
                    }
                }
            }
            // OR if the data is NOT selectable but the event is still bound
            else if (!_data.selectable && _uiEvents.isBound('selectable')) {
                    _jqe.unbind(_uiEvents.selectable);
                    _uiEvents.unbound('selectable');

                    _jqe.unbind(_uiEvents.movable);
                    _uiEvents.unbound('movable');

                    _jqe.unbind(_uiEvents.resizable);
                    _uiEvents.unbound('resizable');
                }
        }
    }

    // #endregion

    // #region Draw Events

    /* for future use	
    
        var _rpnt = false;
        var _tic = (Atalasoft.Utils.Browser.Explorer) ? 20 : 5;
        function __bufferRepaint(){
            if (!_rpnt){
                _rpnt = true;
                setTimeout(__unBufferRepaint, _tic);
            }
        }
        
        function __unBufferRepaint(){
            _rpnt = false;
            __repaint();
        }
        
        _self.startDraw = __startDraw;
        function __startDraw(e, form, cfg){
            __setData(cfg);
            
            _obj = __AcreateAnnotation(form);
            _obj.transform(['S', _Fdata.zoom, _Fdata.zoom, 0, 0]);
            
            __updateView();
            
            _draw.drawStart(e, _obj, _Atxt);
        }
    */
    // #endregion

    // gets the parent name of the field (All text appearing before the last '.' in the fieldname proeprty)
    _self.getParentName = __getParentName;
    function __getParentName() {
        var index = _data.fieldname.lastIndexOf('.');
        if (index >= 0) {
            return _data.fieldname.substr(0, index);
        }

        return null;
    }

    // gets the name of the field (All text appearing after the last '.' in the fieldname proeprty)
    _self.getName = __getName;
    function __getName() {
        var index = _data.fieldname.lastIndexOf('.');
        if (index >= 0) {
            return _data.fieldname.substr(index + 1);
        }

        return _data.fieldname;
    }

    // #region Interaction Events

    // updates the data object connected to the DOM field
    function __onFieldChanged(e) {
        switch (_data.type) {
            case 'button':
                break;
            case 'textbox':
            case 'signature':
                _data.text.value = this.value;

                // Check for multiviews and update those with the new value.
                var parentName = __getParentName(_data);
                if (_Fdata.multiviewFields.hasOwnProperty(parentName)) {
                    var multiviewFields = _Fdata.multiviewFields[parentName];
                    for (var idx in multiviewFields) {
                        if (multiviewFields.hasOwnProperty(idx)) {
                            var multiviewField = multiviewFields[idx];
                            if (multiviewField !== _self) {
                                var data = multiviewField.get();
                                data.text.value = this.value;
                                multiviewField.updateView();
                            }
                        }
                    }
                }
                break;
            case 'checkbox':
                _data.checked = this.checked;

                if (_data.group && _data.checked) {
                    $('input[name="' + _data.group + '"]').trigger('uncheck');
                    _data.checked = true;
                    this.checked = true;
                }
                break;
            case 'radio':
                // trigger custom event on all radios in this group to set the data.checked to false
                if (_data.group) {
                    $('input[name="' + _data.group + '"]').trigger('uncheck');
                }

                _data.checked = this.checked;
                break;
            case 'choice':
                var selectedOptions = [];
                if (typeof e.target.selectedOptions !== 'undefined') {
                    selectedOptions = e.target.selectedOptions;
                } else {
                    // IE and FF both don't support e.target.selectedOptions.
                    if (e.target.multiple) {
                        for (var i = 0; i < e.target.options.length; i++) {
                            if (e.target.options[i].selected) {
                                selectedOptions.push(e.target.options[i]);
                            }
                        }
                    } else if (e.target.selectedIndex >= 0) {
                        selectedOptions.push(e.target.options[e.target.selectedIndex]);
                    }
                }

                for (var itemIndex in _data.items) {
                    if (_data.items.hasOwnProperty(itemIndex)) {
                        var item = _data.items[itemIndex];
                        item.checked = false;

                        for (var optionIndex in selectedOptions) {
                            if (selectedOptions.hasOwnProperty(optionIndex)) {
                                var option = selectedOptions[optionIndex];
                                if (option.value === item.value) {
                                    item.checked = true;
                                }
                            }
                        }
                    }
                }
                break;
        }
    }

    function __onFieldUnchecked(e) {
        if (e.target.type === 'checkbox') {
            e.target.checked = false;
        }
        _data.checked = false;
    }

    function __onFieldFocusIn(e) {
        __updateDefaultValue(true);

        __triggerEvent({
            type: 'fieldfocusin',
            field: _self
        });
    }

    function __onFieldFocusOut(e) {
        __updateDefaultValue(false);

        __triggerEvent({
            type: 'fieldfocusout',
            field: _self
        });
    }

    // #endregion

    // #region DOM Updates

    _self.repaint = __repaint;
    function __repaint(form) {
        // repaint called with form means that we need to draw it again
        if (form) {
            _obj = __createField(form);
            _obj.zoom = __zoomField;

            __updateView();

            // TODO: need to write appropriate ui events
            //			__bindUiEvents();

            // annotation view is on a new paper so we notify with viewchanged
            __triggerEvent({
                type: 'viewchanged',
                fieldview: _obj
            });
        }

        __triggerEvent('repaint');
    }

    _self.updateView = __updateView;
    function __updateView() {
        if (_obj) {
            if (_data.hidden || _data.noview) {
                _obj.hide();

                // nothing left to do if it's not visible
                return;
            } else {
                _obj.show();
            }

            var css = $.extend({}, __getTransformCss(), __getStyleCss());
            _obj.css(css);

            __updateHighlight();
            __updateReadOnly();

            if (_data.type === 'textbox') {
                __updateDefaultValue(_obj.is(':focus'));
            } else if (_data.type === 'button') {
                _obj.text(_data.text.value);
            }
        }
    }

    function __getStyleCss() {
        var underlined = _data.border && _data.border.style === 'underline';
        return {
            backgroundColor: _data.backgroundcolor,
            color: _data.color || _data.text.font.color,

            borderStyle: _data.border && _data.border.style && !underlined ? _data.border.style : 'none',
            borderBottomStyle: underlined ? 'solid' : 'inherit',
            borderColor: _data.border ? _data.border.color : null,

            fontFamily: _data.text.font.family,
            fontStyle: _data.text.font.italic ? 'italic' : _data.text.font.oblique ? 'oblique' : 'normal',
            fontWeight: _data.text.font.bold ? 'bold' : '',
            textAlign: _data.text.align
        };
    }

    function __getTransformCss() {
        var m = _Fdata.getViewerTransform(_pageindex),
            tl = __transformPoint(m, _data.x, _data.y),
            br = __transformPoint(m, _data.x + _data.width, _data.y + _data.height);

        var z = _Fdata.getZoom(_pageindex);
        var width = _data.width * z;
        var height = _data.height * z;

        var loc = {
            x: (tl.x + br.x - width) / 2,
            y: (tl.y + br.y - height) / 2
        };

        var angle = _Fdata.getPageRotation(_pageindex) + _data.rotation;
        var transform = 'rotate(' + angle + 'deg)';
        var css = {
            'left': Math.round(loc.x) + 'px',
            'top': Math.round(loc.y) + 'px',
            'width': width + 'px',
            'height': height + 'px',
            'max-width': width + 'px',
            'max-height': height + 'px'
        };

        var fieldTransform = angle !== 0 ? Atalasoft.Utils.__htmlTransformStyle(transform) : Atalasoft.Utils.__htmlTransformStyle('');
        $.extend(css, fieldTransform);
        if (_data.type === 'textbox' || _data.type === 'signature') {
            css.cursor = angle % 180 === 0 ? 'text' : 'vertical-text';
        }

        // limited compatibility for dom elenents rotation in IE8 - show only in correct orientation.
        if (!Atalasoft.Utils.Browser.Explorer8 || angle % 180 === 0) {
            css.visibility = 'visible';
        } else {
            css.visibility = 'hidden';
        }

        return css;
    }

    function __updateDefaultValue(focused) {
        if (_data.type === 'textbox') {
            if (!focused) {
                if (!_data.text.value) {
                    _obj.val(_data.text.defaultvalue);
                    // TODO: change color to be lighter
                } else if (_obj.val() !== _data.text.value) {
                    _obj.val(_data.text.value);
                }
            }
        }
    }

    function __updateHighlight() {
        if (_Fdata.highlighted) {
            _obj.addClass('atala-ui-form-highlight');

            if (_data.required) {
                _obj.addClass('atala-ui-form-required');
            } else {
                _obj.removeClass('atala-ui-form-required');
            }
        } else {
            _obj.removeClass('atala-ui-form-highlight');
        }
    }

    function __updateReadOnly() {
        if (_data.readonly) {
            _obj.attr('readonly', 'readonly');
        } else {
            _obj.removeAttr('readonly');
        }
    }

    _self.zoom = __zoomField;
    function __zoomField(z) {

        z = z || _Fdata.getZoom(_pageindex);
        _obj.css({
            fontSize: Math.round((_data.text.font.size || 12) * z * (_Fdata.dpi / 96)),
            borderWidth: _data.border ? Math.round(_data.border.width * z) : 0
        });

        if (_data.text && _data.text.align) {
            _obj.css({
                paddingLeft: _data.text.leftPadding * z + 'px',
                paddingRight: _data.text.rightPadding * z + 'px'
            });
        }

        __updateView();
    }

    function __transformPoint(matrix, x, y) {
        return {
            x: matrix.x(x, y),
            y: matrix.y(x, y)
        };
    }
    // #endregion

    return _self;
};

// Flag to ensure __staticInit method is called only one time.
Atalasoft.Forms.Field.__staticInitOccured = false;
'use strict';

//
//  Form Controller class
//
//  This source code is property of Atalasoft, Inc. (http://www.atalasoft.com/)
//  Permission for usage and modification of this code is only permitted 
//  with the purchase of a source code license.
//
//  Change History:
//	03-07-14	D. Cilley		File Created.
//	12-17-14	D. Cilley		Bug 550581: Added locally scoped non-conflict jQuery.
//  04-13-15	A. Huck			Bug 595087: Bound the WDV scroll event to force a call to focusOut (Triggering a save on form data)
//  04-15-15	A. Huck			Bug 595087: Added multiviewFields dictionary to _data and initialized in __onFieldsLoaded.
//	07-02-15	D. Cilley		Bug 625845: Added dispose method.
//	09-01-15	D. Cilley		Task 630965: Added event bind tracking and intellisense.
//-------------------------------------------------------------------------------------------------

// JSHint options and globals
/*jshint eqnull: true, undef: true, jquery: true, browser: true, es3:false */

// Atalasoft global constructors and functions
/*global Atalasoft */

// Local globals

// wdv: parent WebDocumentViewer object
// internals: internal functions and objects from the WDV
// readonly: form elements are only shown

// ignoring FormsController from documentation - it's look not complete and not very useful for user since
// we cant modify and generate forms now. But Api flexibility is now similar to annotations.
/**
 * WebDocuemntViewer PDF Forms API.
 * @class
 * @inner
 * @name FormController
 * @memberOf Atalasoft.Controls.WebDocumentViewer
 * @ignore
 */
Atalasoft.Forms.FormController = function (wdv, internals, readonly) {
    var $ = Atalasoft.$;
    var _self = this;
    var _wdv = wdv;
    var _wdvInternals = internals;
    var _exposedApi = {
        forms: {
            events: {
                /** Triggers when the user uses the mouse to click on a field. Populated keys: e.field */
                fieldclicked: null,
                /** Triggers when the user uses the mouse to create a field. Populated keys: e.field */
                fieldcreated: null,
                /** Triggers when the user uses the mouse to double-click on a field. Populated keys: e.field */
                fielddoubleclicked: null,
                /** Triggers when a field is loaded into the document. Populated keys: e.field */
                fieldloaded: null,
                /** Triggers when the user has depressed a mouse button on a field. Populated keys: e.field */
                fieldmousedown: null,
                /** Triggers when the user has depressed the left mouse button on a field. Populated keys: e.field */
                fieldmousedownleft: null,
                /** Triggers when the user has depressed the right mouse button on a field. Populated keys: e.field */
                fieldmousedownright: null,
                /** Triggers when the user moves the mouse pointer over a field. Populated keys: e.field */
                fieldmousemove: null,
                /** Triggers when the user has moved the mouse pointer out of the bounds of the field. Populated keys: e.field */
                fieldmouseout: null,
                /** Triggers when the user has moved the mouse pointer into the bounds of the field. Populated keys: e.field */
                fieldmouseover: null,
                /** Triggers when the user has released a mouse button on a field. Populated keys: e.field */
                fieldmouseup: null,
                /** Triggers when a field has been moved. Populated keys: e.field */
                fieldmoved: null,
                /** Triggers when a pinch gesture has been detected on a field. Populated keys: e.field */
                fieldpinchresize: null,
                /** Triggers when a field has been repainted. Populated keys: e.field */
                fieldrepainted: null,
                /** Triggers when a field has been resized. Populated keys: e.field */
                fieldresized: null,
                /** Triggers when the user right clicks on a field. Populated keys: e.field */
                fieldrightclicked: null,
                /** Triggers when a touch end event has finished on a field. Populated keys: e.field */
                fieldtouchend: null,
                /** Triggers when a touch move event is happening on a field. Populated keys: e.field */
                fieldtouchmove: null,
                /** Triggers when a touch event has started on a field. Populated keys: e.field */
                fieldtouchstart: null
            },
            createOnPage: __createFieldPublic,
            deleteFromPage: __deleteFieldPublic,
            getFromPage: __getFieldsFromPagePublic,
            insertForm: __insertFormPublic,
            moveForm: __moveFormPublic,
            removeForm: __removeFormPublic
        }
    };

    Atalasoft.Forms.FormController.__exposedApi = _exposedApi.forms;

    // we call this function without params to establish intellisense API
    if (!wdv) {
        return null;
    }

    //	var _wdvConfig = internals._config;	// parent WebDocumentViewer config object
    var _pages = internals._pages; // internal pageDiv array from the WDV
    var _wdvReady = false;

    var _vp = null; // viewport object
    var _data = { // data object for controller properties
        fields: [], // array of arrays with fields that have been added or changed since loading or saving
        multiviewFields: {}, // dictionary mapping parent names to multiview children.
        activepage: null, // active page
        activefield: null, // active form field
        highlighted: true,
        readonly: readonly ? true : false,
        getZoom: _wdvInternals.getPageScale,
        getViewerTransform: _wdvInternals.getViewerTransform,
        getPageRotation: _wdvInternals.getPageRotation,
        dpi: 96
    };

    var _defaults = {}; // form defaults object
    var _drawing = false; // flag indicating if the controller is waiting to finish drawing
    var _drawReady = false; // flag indicating if the controller is ready to start drawing
    var _lastFieldFocusInEvent = null; // the last focusin event that was triggered by a field.

    var _publicEvents = {
        click: 'fieldclicked',
        dblclick: 'fielddoubleclicked',
        touchstart: 'fieldtouchstart',
        interactend: 'fieldtouchend',
        touchmove: 'fieldtouchmove',
        pinchmove: 'fieldpinchresize',
        rightclick: 'fieldrightclicked',
        mousedown: 'fieldmousedown',
        mousedownleft: 'fieldmousedownleft',
        mousedownright: 'fieldmousedownright',
        mousemove: 'fieldmousemove',
        mouseout: 'fieldmouseout',
        mouseup: 'fieldmouseup',
        mouseover: 'fieldmouseover',
        create: 'fieldcreated',
        load: 'fieldloaded',
        moved: 'fieldmoved',
        resized: 'fieldresized',
        repaint: 'fieldrepainted'
    };

    // #region Control LifeCycle

    function __initForms() {
        _wdv.bind({
            pagerecycled: __recycleForm,
            pageshown: __pageShown,
            zoomchanged: __zoomChanged,
            pagerotated: __rotateForm
        });

        // is WDV ready or still loading scripts?
        if (_wdvInternals._state.initialized) {
            __wdvInitialized();
        } else {
            _wdv.bind({
                initialized: __wdvInitialized
            });
        }
    }

    function __wdvInitialized() {
        _wdvReady = true;
    }

    _self.dispose = __dispose;
    function __dispose() {
        _self = null;
        _wdv = null;
        _wdvInternals = null;
        _pages = null;
        _vp = null;

        _data.fields.length = 0;
        _data.multiviewFields = null;
        _data.activepage = null;
        _data.activefield = null;
    }

    // #endregion

    // #region Extend WDV

    // adds Forms specific methods to WDV 
    function __extendWDV() {
        if (_wdv.typeOf === 'Atalasoft.Controls.WebDocumentViewer') {
            $.extend(_wdv, _exposedApi);
        }
    }

    /*
    function __throwError(name, msg) {
        _wdv.trigger({
            type: 'throwerror',
            name: name,
            msg: msg
        });
    }
    */

    // event fires when the WDV has finished zooming
    function __zoomChanged(e) {}

    // #endregion

    // #region Page Methods

    // sets up a new layer to put form fields on
    // pg: jQuery dom object, reusable div container that represents the page
    _self.addFormLayer = __initForm;
    function __initForm(pg) {
        if (pg instanceof jQuery) {
            pg._form = _wdvInternals.createDiv(pg);
            pg._form.css({
                position: 'absolute',
                zIndex: 4
            });

            // array of form fields currently shown on this page
            pg._form._fields = [];

            // need a reference to the 'parent' object
            pg._form._page = pg;

            var setActivePage = function setActivePage() {
                __setActivePage(pg);
            };

            pg.bind('mousedown', setActivePage);
            if (Atalasoft.Utils.Browser.Features.Touch) {
                pg.bind('touchstart', setActivePage);
            }

            pg.bind({
                pageresize: function pageresize(e) {
                    e.page = pg;__resizeForm(e);
                },
                pagezoom: function pagezoom(e) {
                    e.page = pg;__zoomForm(e);
                }
            });

            return true;
        }

        return false;
    }

    // inserts a new form layer into the document
    // sourceUrl: string, relative url to get the form data from
    // source: number or layer, index of the form in the source document
    // index: number, layer index to insert the form into
    _self.insertForm = __insertForm;
    function __insertForm(sourceUrl, source, index) {
        if (sourceUrl == null && typeof source === 'number') {
            source = __removeForm(source);
        }

        source = source || [];

        if (index == null) {
            index = _data.fields.length;
        } else if (index < 0) {
            index = 0;
        }

        if (index > _data.fields.length) {
            var oldLength = _data.fields.length;
            _data.fields[index] = source;
            for (var i = oldLength; i < _data.fields.length; ++i) {
                if (!_data.fields[i]) {
                    _data.fields[i] = [];
                }
            }
        } else {
            _data.fields.splice(index, 0, source);
        }
    }

    // removes a form from the document
    // index: number, page index to remove the form from
    _self.removeForm = __removeForm;
    function __removeForm(index) {
        if (index < _data.fields.length) {
            return _data.fields.splice(index, 1)[0];
        }

        return null;
    }

    // moves a form at source index to the destination index
    // sourceIndex: number, original index of the form to move
    // destIndex: number, destination index to move the form to
    _self.moveForm = __moveForm;
    function __moveForm(sourceIndex, index) {
        __insertForm(null, __removeForm(sourceIndex), index);
    }

    // removes the form layer
    // pg: jQuery dom object, reusable div container that represents the page
    _self.removeFormLayer = __disposeForm;
    function __disposeForm(pg) {
        if (pg instanceof jQuery) {
            if (pg._form) {
                pg._form._fields = null;
                pg._form._page = null;
                pg._form = null;
            }

            return true;
        }

        return false;
    }

    // shows fields that correspond to the given page
    _self.showLayer = __showLayer;
    function __showLayer(index, page) {
        if (index < _data.fields.length && _data.fields[index] && _data.fields[index].length) {
            var field;

            __clearPage(page);

            for (var i = 0; i < _data.fields[index].length; i++) {
                field = _data.fields[index][i];
                field.setPageIndex(index);
                field.repaint(page._form);
            }
        }
    }

    function __clearPage(page) {
        if (page._form && page._form._fields) {
            // remove all fields
            page._form._fields.length = 0;
            page._form.empty();
        }
    }

    // e.index: index of the shown page
    // e.page: jQuery dom object, reusable div container that represents the page
    function __pageShown(e) {
        __showLayer(e.index, e.page);
    }

    // blurs the current focus, if any. Used to force the focusOut event to fire (Saves field from view to data layer)
    // Bound to the scroll event on the WDV to fix an issue where form data clears and is not saved when scrolling occurs.
    function __forceUnfocus(e) {
        if (_lastFieldFocusInEvent.field != null) {
            _lastFieldFocusInEvent.field.getObject()[0].blur();
        }
    }

    // recycles form by clearing the page
    // e.page: jQuery dom object, reusable div container that represents the page
    function __recycleForm(e) {
        if (e.page._form) {
            __clearPage(e.page);

            //TODO: check to see if we need to re-add this form to the page		
            //e.page.append(e.page._form);
        }
    }

    function __resizeForm(e) {
        __updatePageFields(e.page);
    }

    // sets the active page of the controller
    // pg: jQuery dom object, reusable div container that represents the page
    function __setActivePage(pg) {
        _data.activepage = pg;
    }

    function __zoomForm(e) {
        for (var key in e.page._form._fields) {
            if (e.page._form._fields.hasOwnProperty(key)) {
                e.page._form._fields[key].zoom(_wdvInternals.getPageScale(e.index));
            }
        }
    }

    function __rotateForm(e) {
        __updatePageFields(e.page);
    }

    function __updatePageFields(page) {
        if (page) {
            if (_data.fields.length && _data.fields[page._index]) {
                for (var i = 0; i < _data.fields[page._index].length; i++) {
                    _data.fields[page._index][i].updateView();
                }
            }
        }
    }

    // #endregion

    // #region WDV Exposed Methods

    // Need a public facing function to return a clone, not internal form object.
    /**
    * Creates a field on the desired page with the given field data.
    * @param fConfig: object, Key value pairs representing field data.
    * @param pgNum: number, The zero based index of the page the field should be created on.
    * @param callback: function, Function to be called when the operation has completed.
    * @returns object, Key value pairs representing field data.
    */
    function __createFieldPublic(fConfig, pgNum, callback) {
        var clonedField = __createField(fConfig, pgNum, callback).getClonedData();

        _wdv.trigger({
            type: _publicEvents.fieldcreate,
            field: clonedField
        });

        return clonedField;
    }

    /**
    * Deletes a field on the given z-index and zero based page index.
    * @param pgNum: number, Zero based page index the field is located on.
    * @param fieldIndex: number, Zero based z-index of the field.
    */
    function __deleteFieldPublic(pgNum, fieldIndex) {
        __deleteFieldAtIndex(fieldIndex, pgNum);
    }

    /**
    * Gets an array of field data objects located on the given zero based page index.
    * @param pageNum: number, Zero based page index the fields are located on.
    * @returns array: Array of field data objects on the given page index. 
    */
    function __getFieldsFromPagePublic(pageNum) {
        var fieldArray = [];
        if (_data.fields.length === 0 || typeof _data.fields[pageNum] === 'undefined') {
            return fieldArray;
        }

        for (var i = 0; i < _data.fields[pageNum].length; i++) {
            fieldArray[i] = _data.fields[pageNum][i].getClonedData();
        }

        return fieldArray;
    }

    /**
    * Inserts a form from the source URL and index into the given page index.
    * @param sourceUrl: string, Url of the desired form.
    * @param sourceIndex: number, Zero based page index the form is copied from.
    * @param index: number, Zero based page index the form is to be inserted into.
    * @param callback: function, Function to be called when the operation has completed.
    */
    function __insertFormPublic(sourceUrl, sourceIndex, index, callback) {
        __insertForm(sourceUrl, sourceIndex, index);

        if (typeof callback === 'function') {
            callback();
        }

        _wdv.trigger({
            type: _publicEvents.forminserted,
            srcurl: sourceUrl,
            srcindex: sourceIndex,
            index: index
        });

        _wdv.trigger(_publicEvents.formschanged);
    }

    /**
    * Removes a form from the given page index.
    * @param index: number, Zero based page index of the form to be removed.
    * @param callback: function, Function to be called when the operation has completed.
    */
    function __removeFormPublic(index, callback) {
        __removeForm(index);

        if (typeof callback === 'function') {
            callback();
        }

        _wdv.trigger({
            type: _publicEvents.formremoved,
            index: index
        });

        _wdv.trigger(_publicEvents.formschanged);
    }

    /**
    * Moves a form from one page index to another.
    * @param sourceIndex: number, Zero based page index of the form to be moved.
    * @param destIndex: number, Destination zero based page index.
    * @param callback: function, Function to be called when the operation has completed.
    */
    function __moveFormPublic(sourceIndex, destIndex, callback) {
        __moveForm(sourceIndex, destIndex);

        if (typeof callback === 'function') {
            callback();
        }

        _wdv.trigger({
            type: _publicEvents.formmoved,
            srcindex: sourceIndex,
            destindex: destIndex
        });

        _wdv.trigger(_publicEvents.formschanged);
    }

    // #endregion

    // #region Controller Level Exposed Methods
    // owerwrite instance public API to point to same data as internal API. otherwise exception is not clear since data is captured from shared closure
    _self.__exposedApi = _exposedApi.forms;
    _self.__getDebugInfo = __getDebugInfo;
    _self.__linkForms = __linkForms;
    _self.clear = __clearForms;
    _self.createField = __createField;
    _self.deleteFieldOnPage = __deleteFieldPublic;
    _self.getFieldsFromPage = __getFieldsFromPagePublic;
    _self.setViewPort = __setViewPort;

    function __getDebugInfo() {
        var info = {};
        $.extend(true, info, {
            data: _data,
            pages: _pages,
            viewport: _vp
        });

        return info;
    }

    function __linkForms(linker) {
        if (linker) {
            if (!linker._fields) {
                linker._fields = _data.fields;
            } else if ($.isArray(linker._fields)) {
                _data.fields = linker._fields;
            }
        }
    }

    function __clearForms() {
        if (_data.fields.length > 0) {
            _data.fields.length = 0;

            if (_pages) {
                for (var i = 0; i < _pages.length; i++) {
                    // remove all objects
                    __clearPage(_pages[i]);
                }
            }

            _wdv.trigger({
                type: 'formscleared'
            });
        }
    }

    // fConfig: key value pairs sent
    // pgNum: the index of the page the field should be created on
    function __createField(fConfig, pgNum, callback) {
        var fieldConfig = {};

        if (fConfig && fConfig.type && _defaults[fConfig.type]) {
            $.extend(true, fieldConfig, _defaults[fConfig.type]);
        }

        $.extend(true, fieldConfig, fConfig);

        var newField = new Atalasoft.Forms.Field(fieldConfig, _data, pgNum);

        if (typeof _data.fields[pgNum] === 'undefined') {
            _data.fields[pgNum] = [];
        }

        _data.fields[pgNum].push(newField);
        _wdvInternals.redrawVisiblePages();

        if (typeof callback === 'function') {
            callback(newField);
        }

        __bindFieldEvents(newField);

        return newField;
    }

    function __deleteFieldAtIndex(fieldIndex, pgNum) {
        var delField = _data.fields[pgNum].splice(fieldIndex, 1)[0];

        if (_data.activepage) {
            _data.activepage._form._fields.splice(fieldIndex, 1);
        }

        delField.dispose();

        _wdv.trigger({
            type: 'fielddeleted',
            page: pgNum,
            index: fieldIndex
        });
    }

    function __setViewPort(obj) {
        if (obj) {
            if (!(obj instanceof jQuery)) {
                obj = $(obj);
            }

            _vp = obj;
        }
    }

    // #endregion

    // #region Field Drawing

    // sets up the viewport to create a form field with the mouse
    // fConfig: key value pairs sent from button/function call
    // callback: function to call when the field has finished drawing
    // cancelled: function to call when the field draw was cancelled
    _self.drawField = __drawField;
    function __drawField(fConfig, callback, cancelled) {
        // if we're still drawing, don't draw another one
        if (_drawing) {
            return null;
        }

        // starts with default field, and overlays button defaults
        if (fConfig && fConfig.type && _defaults[fConfig.type]) {
            $.extend(true, fConfig, _defaults[fConfig.type]);
        }

        // previous field was never added to anything, we should dispose of it
        if (_data.activefield && _data.activefield.getObject() === null) {
            __cancelField();
        }

        // prepare drawing surfaces
        __prepareForDraw();

        // create the new field from data
        _data.activefield = new Atalasoft.Forms.Field(fConfig, _data, _data.activepage ? _data.activepage._index : undefined);
        _data.activefield.bind({
            drawn: __finishField,
            cancelled: __cancelField
        });

        if (typeof callback === 'function') {
            __fieldCreatedCallback = callback;
        }

        if (typeof cancelled === 'function') {
            __fieldCancelledCallback = cancelled;
        }

        return _data.activefield;
    }

    function __fieldCreatedCallback() {
        // intentionally left blank, this gets overwritten
    }

    function __fieldCancelledCallback() {}
    // intentionally left blank, this gets overwritten


    // prepares all pages for drawing, since we don't know where the user will draw
    function __prepareForDraw() {
        if (!_drawReady) {
            _vp.bind('mousedown', __startFieldDraw);

            if (Atalasoft.Utils.Browser.Features.Touch) {
                _vp.bind('touchstart', __startFieldDraw);
            }

            for (var i = 0; i < _pages.length; i++) {
                _pages[i]._draw.toFront();
            }

            _drawReady = true;
        }
    }

    // resets all pages to state before prepareForDraw was called
    function __cleanupDraw() {
        if (_drawReady) {
            _vp.unbind('mousedown', __startFieldDraw);
            if (Atalasoft.Utils.Browser.Features.Touch) {
                _vp.unbind('touchstart', __startFieldDraw);
            }

            for (var i = 0; i < _pages.length; i++) {
                _pages[i]._draw.reset();
            }

            _drawReady = false;
        }
    }

    // draws a form field with the mouse
    function __startFieldDraw(e) {
        _drawing = true;

        // don't want to start drawing this field again if another mousedown happens'
        _vp.unbind('mousedown', __startFieldDraw);

        if (Atalasoft.Utils.Browser.Features.Touch) {
            _vp.unbind('touchstart', __startFieldDraw);
        }

        _wdv.trigger({
            type: 'fielddrawstart',
            field: _data.activefield.getClonedData()
        });

        _data.activefield._pageindex = _data.activepage._index;
        _data.activefield.startDraw(e, _data.activepage._form, {});

        // fix for IE7, _draw layer height sizes to 0 only on first create. WTF
        if (Atalasoft.Utils.Browser.Explorer && parseInt(Atalasoft.Utils.Browser.Version, 10) < 8) {
            _data.activepage._draw.height(_data.activepage.height());
        }
    }

    function __finishField() {
        __fieldCreated(_data.activefield);
        __finishDrawing();

        // fix for IE7, _draw layer height sizes to 0 only on first create. WTF
        if (Atalasoft.Utils.Browser.Explorer && parseInt(Atalasoft.Utils.Browser.Version, 10) < 8) {
            _data.activepage._draw.height('100%');
        }
    }

    function __cancelField() {
        _data.activefield.dispose();
        _data.activefield = null;

        if (_drawing) {
            __finishDrawing(true);
        }
    }

    /*
    function __cancelFieldDraw() {
        if (_drawReady) {
            if (_drawing) {
                // user has started drawing the field
                __cancelField();
            }
            else {
                if (_data.activefield) {
                    _data.activefield.dispose();
                    _data.activefield = null;
                }
                
                __cleanupDraw();
            }
            
            // call the callback, and set it back to empty
            __fieldCancelledCallback({
                field: null
            });
            
            __fieldCancelledCallback = function () { };
        }
    }
    */

    function __finishDrawing(cancelled) {
        _drawing = false;

        __cleanupDraw();

        _wdv.trigger({
            type: 'fielddrawend',
            field: cancelled ? null : _data.activefield.getClonedData(),
            cancelled: cancelled ? true : false
        });
    }

    function __onFieldFocusIn(e) {
        _lastFieldFocusInEvent = e;
        _wdv.bind('scroll', __forceUnfocus);
    }

    function __onFieldFocusOut(e) {
        _wdv.unbind('scroll', __forceUnfocus);
    }

    function __fieldCreated(field) {
        var page = _data.activepage;
        var pindex = page ? page._index : 0;

        if (_data.fields[pindex]) {
            _data.fields[pindex].push(field);
        } else {
            _data.fields[pindex] = [field];
        }

        // TODO: add drawing methods		
        _data.activefield.unbind({
            //			drawn: __finishField,
            //			cancelled: __cancelField
        });

        __bindFieldEvents(_data.activefield);

        // call the callback, and set it back to empty
        __fieldCreatedCallback({
            field: field
        });

        __fieldCreatedCallback = function __fieldCreatedCallback() {};

        _wdv.trigger({
            type: _publicEvents.fieldcreate,
            field: field.getClonedData()
        });
    }

    // #endregion

    // #region Field Events

    function __bindFieldEvents(field) {
        function __triggerPublicEvent(e) {
            _wdv.trigger({
                type: _publicEvents[e.type],
                field: field.getClonedData()
            });
        }

        field.bind({
            interactstart: function interactstart(e) {
                if (!_data.activepage || _data.activepage._form !== field.getObject().form) {
                    __setActivePage(field.getObject().form._page);
                }

                _data.activefield = field;
            },

            moved: __triggerPublicEvent,
            resized: __triggerPublicEvent,
            interactend: __triggerPublicEvent,
            touchstart: __triggerPublicEvent,
            touchmove: __triggerPublicEvent,
            pinchmove: __triggerPublicEvent,
            click: __triggerPublicEvent,
            dblclick: __triggerPublicEvent,
            rightclick: __triggerPublicEvent,
            mousedown: __triggerPublicEvent,
            mousedownleft: __triggerPublicEvent,
            mousedownright: __triggerPublicEvent,
            mousemove: __triggerPublicEvent,
            mouseout: __triggerPublicEvent,
            mouseup: __triggerPublicEvent,
            mouseover: __triggerPublicEvent,
            repaint: __triggerPublicEvent,
            fieldfocusin: __onFieldFocusIn,
            fieldfocusout: __onFieldFocusOut
        });
    }

    // #endregion

    // #region Ajax/Json Methods

    _self.stringifyChanges = __stringifyChanges;
    function __stringifyChanges(s) {
        var arr = {};
        var hasData = false;
        for (var key in _data.fields) {
            if (_data.fields.hasOwnProperty(key) && _data.fields[key].length > 0) {
                arr[key] = [];

                for (var z in _data.fields[key]) {
                    if (_data.fields[key].hasOwnProperty(z)) {
                        hasData = true;
                        arr[key][z] = _data.fields[key][z].get();
                    }
                }
            }
        }

        return hasData ? JSON.stringify({ forms: { fields: arr } }) : undefined;
    }

    // adds an unnamed field to the multiview set of its parent.
    function __applyMultiview(field) {
        var parentName = field.getParentName();
        var fieldName = field.getName();

        if (fieldName.indexOf("<~Atala_Unnamed_") >= 0) {
            if (_data.multiviewFields.hasOwnProperty(parentName)) {
                _data.multiviewFields[parentName].push(field);
            } else {
                _data.multiviewFields[parentName] = [field];
            }
        }
    }

    _self.createHandlerRequest = __createHandlerRequest;
    // formUrl should stay second parameter for generic document loading code in viewer
    function __createHandlerRequest(serverUrl, formUrl, docurl, offset, length) {
        docurl = docurl || _wdv.config.documenturl;
        var hRequest = {
            type: 'formdata',
            serverurl: serverUrl,
            query: '?atalaformdata=',
            method: 'GET',
            data: {
                atala_formurl: formUrl,
                atala_docurl: docurl,
                atala_a_ofs: offset,
                atala_a_len: length
            },
            cancel: false,
            info: {
                fields: [],
                length: length,
                error: undefined
            }
        };

        // workaround for IE that encodes null as string
        for (var key in hRequest.data) {
            if (hRequest.data.hasOwnProperty(key) && hRequest.data[key] === null) {
                hRequest.data[key] = undefined;
            }
        }

        return hRequest;
    }

    _self.makeHandlerRequest = __makeHandlerRequestAsync;
    function __makeHandlerRequestAsync(hRequest, preserveExisting, callback) {
        if (typeof preserveExisting === "function") {
            callback = preserveExisting;
            preserveExisting = false;
        }

        if (!preserveExisting) {
            __clearForms();
        }

        // defined inline so we have a closure reference to callback
        function __complete(info) {
            if (hRequest.info.docIndex !== undefined) {
                info.offset = hRequest.info.docIndex;
            }
            // we assume that all requests made through this method are for fields
            __onFieldsLoaded(info);

            // only execute the callback if it exists
            if (typeof callback === 'function') {
                callback.call();
            }
        }

        _wdvInternals.makeHandlerRequest(hRequest, __complete, __complete);
    }

    // contacts the server for form info, JSON is returned to __onFieldsLoaded
    _self.loadFormUrl = __loadFieldsAsync;
    function __loadFieldsAsync(serverUrl, formUrl, docUrl, offset, length, docIndex, callback) {
        var args = Array.prototype.slice.call(arguments);
        callback = args.pop();
        if (typeof callback !== 'function') {
            args.push(callback);
        }
        serverUrl = args.shift();
        formUrl = args.shift();
        docUrl = args.shift();
        offset = args.shift();
        length = args.shift();
        docIndex = args.shift();

        var hRequest = __createHandlerRequest(serverUrl, formUrl, docUrl, offset, length);
        if (docIndex !== undefined) {
            hRequest.info.docIndex = docIndex;
        }
        __makeHandlerRequestAsync(hRequest, offset >= 0 && length >= 1, callback);
    }

    _self.loadForms = __onFieldsLoaded;
    function __onFieldsLoaded(info) {
        if (info) {
            var fieldsLoadedEvt = {
                type: 'formsloaded'
            };

            if (info.dpi) {
                _data.dpi = info.dpi;
            }

            if (info.forms && info.forms.fields) {
                for (var i = 0; i < info.forms.fields.length; i++) {
                    info.offset = info.offset || 0;
                    var pIndex = info.offset + i;
                    if (_data.fields[pIndex] && _data.fields[pIndex].length > 0) {
                        _data.fields[pIndex].length = 0;
                    } else {
                        _data.fields[pIndex] = [];
                    }

                    var layer = info.forms.fields[i];
                    if (layer && layer.length > 0) {
                        for (var j = 0; j < layer.length; j++) {
                            _data.fields[pIndex][j] = new Atalasoft.Forms.Field(layer[j], _data, pIndex);
                            __applyMultiview(_data.fields[pIndex][j]);

                            _wdv.trigger({
                                type: _publicEvents.load,
                                field: _data.fields[pIndex][j].getClonedData()
                            });

                            __bindFieldEvents(_data.fields[pIndex][j]);
                        }
                    }
                }
            } else if (info.error) {
                fieldsLoadedEvt.error = info.error;
            }

            _wdv.trigger(fieldsLoadedEvt);
        }
    }

    // #endregion

    // #region Input Validation

    /*
    // fixes the font properties of a config
    function __validateFontConfig(cfg) {
        if (cfg && cfg.font && cfg.font.size) {
            // we don't support unit based fonts
            cfg.font.size = parseFloat(cfg.font.size); 
        }
        
        return cfg;
    }
    */

    // #endregion

    __extendWDV();
    __initForms();
};
'use strict';

//
//  Text Controller class. Responsible for editable text logic.
//
//  This source code is property of Atalasoft, Inc. (http://www.atalasoft.com/)
//  Permission for usage and modification of this code is only permitted 
//  with the purchase of a source code license.

// JSHint options and globals
/*jshint eqnull: true, undef: true, jquery: true, browser: true, es3:false */

// Atalasoft global constructors and functions
/*global Atalasoft */
/*global Clipboard */

// Local globals

// wdv: parent WebDocumentViewer object
/**
 * WebDocuemntViewer Text Layer operations API.
 * @class
 * @inner
 * @name TextController
 * @memberOf Atalasoft.Controls.WebDocumentViewer
 */
Atalasoft.Text.TextController = function (wdv, internals, settings) {
    var $ = Atalasoft.$;
    var _self = this;
    var _wdv = wdv;
    var _wdvInternals = internals;
    var _internalEvents = (internals ? internals._internalEvents : null) || $({});

    var _exposedApi = {
        /**
         * @lends Atalasoft.Controls.WebDocumentViewer~TextController
         */
        text: {
            events: {

                /**
                 * Triggers when page text loaded.
                 * @event Atalasoft.Controls.WebDocumentViewer#pagetextloaded
                 * @type {LoadPageTextCallback}
                 * @param {Object} event - The event object.
                 * @param {number} event.index - index of the page for which text data has been loaded.
                 */
                pagetextloaded: null,

                /**
                 * Triggers when UI text selection complete.
                 * @event Atalasoft.Controls.WebDocumentViewer#textselected
                 * @type {NotificationCallback}
                 */
                textselected: null
            },

            /**
             * Retrieves the selected text.
             * @return {string} Selected text. Line break is inserted after each line and region.
             * @instance
             * @function
             */
            getSelected: __getSelectedText,

            /**
             * Copies selected text to clipboard. This method don't depend on {@link TextMouseToolConfig| TextMouseToolConfig.hookcopy} config option, i.e. text will be copied if `ctrl+c` copying is disabled for user.
             * @instance
             * @function
             */
            copySelected: __copySelectedText,

            /** Selects all text on the page.
            * Any optional arguments could be omitted and callback could be passed instead of it.
            * This method is intended to select whole page text or to be used in conjunction with text search API when `region`, `line`, `word` indexes are passed to application using search iterator.
            *
            * @param {number} index - Index of the page to select page on.
            * @param {number} [region] - Index of the region to select.
            * @param {number} [line] - Index of the line to select.
            * @param {number} [word] - Index of the word to select.
            * @param {NotificationCallback} [success] - Function that that is called when page text is loaded and selected.
            * @param {NotificationCallback} [fail] - Function that that is called when page text load is failed.
            *
            * @instance
            * @function
            *
            * @tutorial search result match object could be used to retrieve region line and word indexes of the match starting object.
            * @example
            * <caption> Search text occurrence and automatically select it. Note, that `match.word` is the index of the first word in matched text. If search phrase contain multiple words, only firs will be selected in this example. </caption>
            *  _viewer.text.search('findme', 0, function (it, match) {
            *       if (it.isValid()) {
            *           _viewer.text.selectPageText(match.page, match.region, match.line, match.word);
            *       }
            *  });
            */
            selectPageText: __selectPageText,

            /**
             * @callback GetPageTextCallback
             * @param {string} text - The returned text.
             */

            /**
            * Returns all text for the specified page.
            * @param {number} index - Index of the page to retrieve text.
            * @param {GetPageTextCallback} [success] - function that that is called when page text is loaded and formatted.
            * @param {NotificationCallback} [fail] - Function that that is called when page text load is failed.
            *
            * @instance
            * @function
            */
            getPageText: __getPageText,

            /**
             * Clears all text selection for the document.
             * @instance
             * @function
             */
            clearSelection: __clearSelection,

            /**
            * Marks page text data for reload. After this call text data will be loaded next time page will be inserted into DOM on scrolling. I.e. this method won't triggered immediate text reload, even for visible pages.
            * @param {number} [index] - Index of the page to reset text data. If not specified whole document text data is reset.
            * @instance
            * @function
            */
            resetPageText: __resetPageText,

            /**
             * Callback signature for {@link Atalasoft.Controls.WebDocumentViewer~TextController#reloadPageText|reloadPageText} method.
             * @callback ReloadPageTextCallback
             * @param {number} index - Index of the page for which operation has been performed.
             */
            /**
            * Forcibly triggers page text load.
            * @param {number} index - Index of the page to reset text data.
            * @param {LoadPageTextCallback} [success] - Function that that is called when page text is loaded successfully.
            * @param {LoadPageTextCallback} [fail] - Function that that is called when page text load is failed.
            *
            * @instance
            * @function
            */
            reloadPageText: __reloadPageText,

            /**             
            * Indicates whether page text is loaded.             
            * @param {number} index - Index of the page to check text data state.
            * @instance
            * @function
            */
            isPageTextLoaded: __isPageTextLoaded,

            /**
             * Triggers text search. This method also triggers UI search behavior - highlight for matched text occurrences selection of current text result and scrolling during text results iteration.
             * @param {string} [text] - Text to search for. Is empty, previous search results are dropped.
             * @param {number} [startPage] - Index of the page to start search from. If not specified first page in document is assumed to be the first in search.
             * @param {TextSearchCallback} callback - Search callback that receives search results iterator.
             * @returns search results iterator that allows navigation over search results
             *
             * @instance
             * @function
             */
            search: __search
        }
    };

    Atalasoft.Text.TextController.__exposedApi = _exposedApi.text;

    // we call this function without params to establish intellisense API
    if (!wdv) {
        return null;
    }

    var Tolerance = 0.1; // we have floated coordinates rounded, there could be some fluctuations. need to compensate them.
    var _wdvReady = false;
    var _vp = null; // viewport object
    var _pages = internals._pages; // internal pageDiv array from the WDV
    var _data = { // data object for controller properties
        activepage: null, // active page
        origin: __makePoint(0, 0),
        originPage: -1,
        rectangular: false,
        selectionCache: [],
        searchQuery: null
    };

    var _config = {};

    $.extend(_config, settings || {});

    // #region Control LifeCycle

    function __initTextLayer() {
        _wdv.bind({
            pagerecycled: __recyclePage,
            pageshown: __pageShown,
            zoomchanged: __zoomChanged,
            documentchanged: __onDocumentChanged
        });

        _internalEvents.bind({
            textselectstart: __onSelectionStart,
            textselectmove: __onSelectionMove,
            textselectend: __onSelectionEnd,
            textselectcopy: __onSelectionCopy
        });

        // is WDV ready or still loading scripts?
        if (_wdvInternals._state.initialized) {
            __wdvInitialized();
        } else {
            _wdv.bind({
                initialized: __wdvInitialized
            });
        }
    }

    function __wdvInitialized() {
        _wdvReady = true;
    }

    _self.dispose = __dispose;
    function __dispose() {

        _wdv.unbind({
            pagerecycled: __recyclePage,
            pageshown: __pageShown,
            zoomchanged: __zoomChanged,
            documentchanged: __onDocumentChanged
        });

        _internalEvents.unbind({
            textselectstart: __onSelectionStart,
            textselectmove: __onSelectionMove,
            textselectend: __onSelectionEnd
        });

        _self = null;
        _wdv = null;
        _vp = null;
        _data.searchQuery = null;
        _data.selectionCache = [];
        _wdvReady = false;
        _data.activepage = null;
    }

    function __getPageData(index) {
        return _wdvInternals._controllers.document.getPageText(index);
    }

    // #endregion

    // #region Extend WDV

    // adds Text specific methods to WDV
    function __extendWDV() {
        if (_wdv.typeOf === 'Atalasoft.Controls.WebDocumentViewer') {
            $.extend(_wdv, _exposedApi);
        }
    }

    /**
    * jQuery trigger shortcut
    * @returns object, WebDocumentViewer
    */
    function __triggerEvent(args) {
        _wdv.trigger(args);
        return _self;
    }

    function __triggerInternalEvent() {
        _internalEvents.trigger.apply(_internalEvents, arguments);
        return _self;
    }

    function __throwError(name, msg) {
        _wdv.trigger({
            type: 'throwerror',
            name: name,
            msg: msg
        });
    }

    // event fires when the WDV has finished zooming
    function __zoomChanged(e) {}

    // removes the form layer
    // pg: jQuery dom object, reusable div container that represents the page
    _self.removeTextLayer = __disposeTextLayer;
    function __disposeTextLayer(pg) {
        if (pg instanceof jQuery) {
            if (pg._text) {
                pg._text._page = null;
                pg._text = null;
            }

            return true;
        }

        return false;
    }
    // #endregion

    // #region Page Methods

    // sets up a new layer to put form fields on
    // pg: jQuery dom object, reusable div container that represents the page
    _self.addTextLayer = __initText;
    function __initText(pg) {
        if (pg instanceof jQuery) {
            pg._text = _wdvInternals.createDOM('canvas', pg);

            pg._text.css({
                width: '100%',
                height: '100%',
                position: 'absolute',
                zIndex: 0
            });

            pg._text.attr('width', pg.width()).attr('height', pg.height());

            // need a reference to the 'parent' object
            pg._text._page = pg;

            pg.bind(Atalasoft.Utils.Browser.Features.Touch ? 'touchstart' : 'mousedown', function () {
                __setActivePage(pg);
            });

            pg.bind({
                pageresize: function pageresize(e) {
                    e.page = pg;
                    __resizeTextLayer(e);
                },
                pagezoom: function pagezoom(e) {
                    e.page = pg;
                    __zoomTextLayer(e);
                }
            });

            return true;
        }

        return false;
    }

    _self.showLayer = __showLayer;
    function __showLayer(index, page) {
        if (page._text) {
            __clearPage(page);
            var pageData = __getPageData(index);
            if (pageData) {
                var ctx = __getDrawContext(page, pageData);
                if (ctx && pageData.searchResult) {
                    __highlightPageSearchResults(ctx, pageData);
                }

                if (ctx && pageData.selection) {
                    var sel = pageData.selection;
                    for (var i = 0; i < sel.regions.length; i++) {
                        for (var j = 0; j < sel.regions[i].lines.length; j++) {
                            var line = sel.regions[i].lines[j];
                            for (var k = 0; line.words && k < line.words.length; k++) {
                                var word = line.words[k];
                                __highlighteRegion(ctx, word.bounds.x, word.bounds.y, word.bounds.width, word.bounds.height, _config.selection);
                            }
                        }
                    }
                }
            }
        }
    }

    // recycles form by clearing the page
    // e.page: jQuery dom object, reusable div container that represents the page
    function __recyclePage(e) {
        __clearPage(e.page);
    }

    // e.index: index of the shown page
    // e.page: jQuery dom object, reusable div container that represents the page
    function __pageShown(e) {
        __showLayer(e.index, e.page);
    }

    function __clearPage(page) {
        if (page._text) {
            // remove all fields
            __clearSelectionUI(page._index);
        }
    }

    function __resizeTextLayer(e) {
        e.page._text.attr('width', e.width).attr('height', e.height);
        e.page._text.width(e.width);
        e.page._text.height(e.height);
        __showLayer(e.index, e.page);
    }

    // sets the active page of the controller
    // pg: jQuery dom object, reusable div container that represents the page
    function __setActivePage(pg) {
        _data.activepage = pg;
    }

    function __zoomTextLayer(e) {
        __resizeTextLayer(e);
    }

    function __onDocumentChanged() {
        if (_data.searchQuery && _data.searchQuery.iterator) {
            _data.searchQuery.iterator.dispose();
            _data.searchQuery = null;
            __clearSearchResults();
            for (var i = 0; i < _pages.length; i++) {
                __showLayer(_pages[i]._index, _pages[i]);
            }
        }
    }

    // #endregion

    // #region Public API

    function __isPageTextLoaded(index) {
        var pageData = __getPageData(index);
        return !!(pageData && !pageData.loading);
    }

    function __selectPageText(index, region, line, word, success, fail) {
        var deferred = $.Deferred();
        var params = Array.prototype.slice.call(arguments, 1);
        if (params.length > 2 && typeof params[params.length - 2] === "function") {
            fail = params.pop();
            success = params.pop();
        } else if (params.length > 1 && typeof params[params.length - 1] === "function") {
            success = params.pop();
        }

        region = params[0];
        line = params[1];
        word = params[2];
        __ensurePageTextLoaded(index).done(function (index, pageData) {
            var bounds = pageData.bounds;
            if (region !== undefined && pageData.regions[region] && (line === undefined || !pageData.regions[region].lines[line])) {
                __selectSingleRegionText(index, region);
            } else {
                region = pageData.regions[region];
                if (line !== undefined && region.lines[line]) {
                    line = region.lines[line];
                    bounds = __getMinimalSelectingRectangle(line.bounds, region);
                    if (word !== undefined && line.words[word]) {
                        bounds = __getMinimalSelectingRectangle(line.words[word].bounds, region);
                    }
                }

                __select(index, __makePoint(bounds.x, bounds.y), index, __makePoint(bounds.right, bounds.bottom));
            }

            var callback = function callback() {
                if (_wdv.config.mousetool.text.hookcopy) {
                    _wdvInternals._dom.viewport.focus();
                }
                deferred.resolve();
                if (success && typeof success === "function") {
                    success();
                }
            };

            if (_wdvInternals.isPageInView(index)) {
                callback();
            } else {
                _wdv.showPage(index, callback);
            }
        }).fail(function () {
            deferred.reject();
            if (fail && typeof fail === "function") {
                fail();
            }
        });

        return deferred.promise();
    }

    function __getPageText(index, success, fail) {
        var deferred = $.Deferred();
        __ensurePageTextLoaded(index).done(function () {
            var text = '';
            var pageData = __getPageData(index);
            if (pageData) {
                for (var i = 0; i < pageData.regions.length; i++) {
                    var regionText = __getRegionText(pageData.regions[i]);
                    if (regionText) {
                        text += regionText;
                    }
                }
            }
            deferred.resolve(text);
            if (success && typeof success === "function") {
                success(text);
            }
        }).fail(function () {
            deferred.reject();
            if (fail && typeof fail === "function") {
                fail();
            }
        });
        return deferred.promise();
    }

    function __resetPageText(index) {
        if (index === undefined || index === null) {
            for (var i = 0; i < _wdvInternals._controllers.document.getPageCount(); i++) {
                __resetPageText(i);
            }
        }

        var data = __getPageData(index);
        if (data) {
            _wdvInternals._controllers.document.updatePageText(index, null);
            if (_data.selectionCache[index]) {
                _data.selectionCache[index] = null;
                if (_wdvInternals.findPageFromIndex(index)) {
                    __clearSelectionUI(index, null);
                }
            }
        }
    }

    function __reloadPageText(index, success, fail) {
        __resetPageText(index);
        return __ensurePageTextLoaded(index).done(function () {
            if (success && typeof success === "function") {
                success(index);
            }
        }).fail(function () {
            if (fail && typeof fail === "function") {
                fail(index);
            }
        });
    }

    // #endregion Public API

    // #region Controller Level Exposed Methods

    // owerwrite instance public API to point to same data as internal API. otherwise exception is not clear since data is captured from shared closure
    _self.__exposedApi = _exposedApi.text;
    _self.__getDebugInfo = __getDebugInfo;
    _self.__linkText = __linkText;
    _self.clear = __clearText;
    _self.setViewPort = __setViewPort;
    _self.search = __search;
    _self.clearSelection = __clearSelection;
    _self.ensurePageTextLoaded = __ensurePageTextLoaded;

    function __getDebugInfo() {
        var info = {};
        $.extend(true, info, {
            data: _data,
            pages: _pages,
            viewport: _vp
        });

        return info;
    }

    /* jshint unused: false */
    function __linkText(linker) {}

    function __clearText() {
        _data.searchQuery = null;
        _data.selectionCache = [];
        _wdvInternals._controllers.document.initDocumentText({ pages: [] });
        if (_pages) {
            for (var i = 0; i < _pages.length; i++) {
                __clearPage(_pages[i]);
            }
        }
    }

    function __setViewPort(obj) {
        if (obj) {
            if (!(obj instanceof jQuery)) {
                obj = $(obj);
            }
            _vp = obj;
        }
    }

    function __clearSelection() {
        for (var i = 0; i < _wdvInternals._controllers.document.getPageCount(); i++) {
            var pageData = __getPageData(i);
            if (pageData && pageData.selection) {
                __clearSelectionUI(i, pageData, true);
                pageData.selection = null;
            }
        }
        _data.selectionCache.length = 0;
    }

    /** Clears the text selection */
    function __clearSelectionUI(pageIndex, pageData, preserveSearch) {
        for (var i = 0; i < _pages.length; i++) {
            if (!isFinite(pageIndex) || _pages[i]._index === pageIndex) {
                pageData = isFinite(pageIndex) && i === pageIndex ? pageData : __getPageData(_pages[i]._index);
                var ctx = __getDrawContext(_pages[i], pageData);
                if (ctx) {
                    var size = _wdvInternals.getSourcePageSize(_pages[i]._index, pageData ? pageData.rotation : 0);
                    ctx.clearRect(0, 0, size.width, size.height);

                    if (preserveSearch) {
                        __highlightPageSearchResults(ctx, pageData);
                    }
                }
            }
        }
    }

    function __highlightPageSearchResults(ctx, pageData) {
        if (pageData && pageData.searchResult) {
            for (var s = 0; s < pageData.searchResult.length; s++) {
                var rect = pageData.searchResult[s].bounds;
                __highlighteRegion(ctx, rect.x, rect.y, rect.width, rect.height, _config.highlight);
            }
        }
    }

    // #endregion

    // #region Events

    function __onSelectionStart(e) {
        var args = e.eventData,
            pageIndex = args.page,
            point = args.point;

        __clearSelection();
        var pageData = __getPageData(pageIndex);
        if (pageData) {
            pageData.selection = __createEmptySelection(args.point, args.point);

            if (args.interval && _data.origin && _data.originPage >= 0) {
                __select(_data.originPage, _data.origin, pageIndex, point);
                args.complete = true;
            } else if ((args.line || args.word) && Math.abs(args.point.x - _data.origin.x) < 10 && Math.abs(args.point.y - _data.origin.y) < 10) {
                // clicks counter have rather significant delay so check that double/triple click happens around same area.
                __selectHitObject(pageIndex, point, args.line, args.word);
                args.complete = true;
            } else {
                // taking viewport point for rectangular selection because pages could have different sizes, and we won't be able to draw
                // single rectangle across multiple pages if points will be in first page coordinate space.
                _data.origin = !args.rectangular ? args.point : args.viewerPoint;
                _data.originPage = pageIndex;
                _data.rectangular = args.rectangular;
            }
        }

        args.handled = true;
    }

    var throttledSelect = __makeThrottleFunction(__select, _wdv.config.mousetool.text.throttlingtreshold);
    function __onSelectionMove(e) {
        var args = e.eventData,
            pageIndex = args.page,
            pt = !_data.rectangular ? args.point : args.viewerPoint;

        var pageData = __getPageData(pageIndex);
        if (pageData) {
            if (pageData.loading) {
                args.cursor = Atalasoft.Utils.MouseToolCursor.Wait;
            } else {
                if (pageData.regions.length === 0) {
                    args.handled = false;
                    return true;
                }

                var rotation = _wdvInternals.getPageRotation(pageIndex) + pageData.rotation;
                if (pageData.rotatedRegions) {
                    for (var i = 0; i < pageData.rotatedRegions.length; i++) {
                        if (isWithinRect(args.point, pageData.rotatedRegions[i].bounds)) {
                            rotation += pageData.rotatedRegions[i].rotation;
                            break;
                        }
                    }
                }
                args.cursor = rotation % 180 === 0 ? Atalasoft.Utils.MouseToolCursor.Text : Atalasoft.Utils.MouseToolCursor.VerticalText;
                if (args.selecting) {
                    throttledSelect(_data.originPage, $.extend({}, _data.origin), pageIndex, pt, _data.rectangular);
                }
            }
        }

        args.handled = true;
        return false;
    }

    function __onSelectionEnd(e) {
        var args = e ? e.eventData : {};
        //    pageIndex = args.page,
        //    point = args.point;
        var selected = false;
        for (var i in _data.selectionCache) {
            if (_data.selectionCache.hasOwnProperty(i) && _data.selectionCache[i].selection) {
                if (_data.selectionCache[i].selection.regions.length) {
                    selected = true;
                    break;
                }
            }
        }

        if (selected) {
            __triggerEvent({
                type: 'textselected'
            });
        }

        _data.rectangular = false;
        args.handled = true;
    }

    function __onSelectionCopy(e) {
        __copySelectedText();
    }

    // #endregion

    // #region copy selection

    function __copySelectedText() {
        var dummyEl = _wdvInternals.createDiv();
        if (dummyEl[0]) {
            var cb = new Clipboard('wdv-dummy-selection-trigger', {
                text: function text() {
                    return __getSelectedText();
                }
            });

            cb.on('success', function (e) {
                cb.destroy();
            });

            cb.on('error', function (e) {
                cb.destroy();
                __throwError('TextCopyError');
            });

            cb.onClick({ currentTarget: dummyEl[0] });
        }
    }

    function __getSelectedText() {
        var result = '';
        for (var s = 0; s < _data.selectionCache.length; s++) {
            if (_data.selectionCache[s]) {
                var sel = _data.selectionCache[s].selection;
                if (sel && sel.regions && sel.regions.length > 0) {
                    for (var i = 0; i < sel.regions.length; i++) {
                        var text = __getRegionText(sel.regions[i]);
                        if (text) {
                            result += text;
                        }
                    }
                }
            }
        }

        return result;
    }

    function __getLineText(line) {
        var lineText = '';
        for (var i = 0; line.words && i < line.words.length; i++) {
            if (__wordsSeparated(line.words[i], i >= 1 ? line.words[i - 1] : null)) {
                lineText += ' ';
            }

            if (line.words[i].text) {
                lineText += line.words[i].text;
            } else if (line.words[i].glyphs && line.words[i].glyphs.length) {
                for (var j = 0; j < line.words[i].glyphs.length; j++) {
                    lineText += line.words[i].glyphs[j].text;
                }
            }
        }

        return lineText;
    }

    function __getRegionText(region) {
        var result = '';
        for (var i = 0; i < region.lines.length; i++) {
            var line = __getLineText(region.lines[i]);
            if (line) {
                result += __appenNewLine(line);
            }
        }
        return result;
    }

    function __appenNewLine(text) {
        return text + '\n';
    }

    // #endregion copy selection

    // #region Selection Model

    function __selectHitObject(pageIndex, point, selectLine, selectWord) {
        var pageData = __getPageData(pageIndex);
        if (pageData && (selectLine || selectWord)) {
            for (var i = 0; i < pageData.regions.length; i++) {
                var region = pageData.regions[i];
                if (isWithinRect(point, region.bounds)) {
                    for (var j = 0; j < region.lines.length; j++) {
                        var line = region.lines[j];
                        if (isWithinRect(point, line.bounds)) {
                            var match = { region: i, line: j, bounds: line.bounds };
                            if (selectWord) {
                                for (var k = 0; k < line.words.length; k++) {
                                    if (isWithinRect(point, line.words[k].bounds)) {
                                        match.word = k;
                                        match.bounds = line.words[k].bounds;
                                        __selectExactMatch(pageIndex, match);
                                        return;
                                    }
                                }
                            } else if (selectLine) {
                                __selectExactMatch(pageIndex, match);
                                return;
                            }
                        }
                    }
                }
            }
        }
    }

    // match: region, line, word, glyph, endWord, endGlyph
    function __selectExactMatch(pageIndex, match) {
        var pageData = __getPageData(pageIndex);
        if (pageData && match) {
            if (pageData.regions[match.region]) {
                __clearSelection();
                var region = pageData.regions[match.region];
                var ctx = __getDrawContext(__findPage(pageIndex), pageData);
                if ($.isNumeric(match.line) && region.lines[match.line]) {
                    var line = region.lines[match.line];
                    var selectionLine = { words: [] };
                    var selectionRegion = {
                        lines: [selectionLine],
                        bounds: $.extend({}, region.bounds)
                    };
                    var start = $.isNumeric(match.word) && line.words[match.word] ? match.word : 0;
                    var end = $.isNumeric(match.endWord) && line.words[match.endWord] ? match.endWord : $.isNumeric(match.word) ? start : line.words.length - 1;
                    for (var i = start; i <= end; ++i) {
                        var word = line.words[i];
                        var hasGlyphs = !!word.glyphs.length;
                        if (hasGlyphs && i === start && $.isNumeric(match.glyph)) {
                            word = __makePartialWord(word, match.glyph, start === end && $.isNumeric(match.endGlyph) ? match.endGlyph : word.glyphs.length - 1);
                        } else if (hasGlyphs && i === end && $.isNumeric(match.endGlyph)) {
                            word = __makePartialWord(word, 0, match.endGlyph);
                        }

                        selectionLine.words.push($.extend({}, word));
                        if (ctx) {
                            __highlighteRegion(ctx, word.bounds.x, word.bounds.y, word.bounds.width, word.bounds.height);
                        }
                    }

                    pageData.selection = __createEmptySelection(__makePoint(match.bounds.x, match.bounds.y), __makePoint(match.bounds.right, match.bounds.bottom));
                    __insertSelectionRegion(pageData.selection.regions, selectionRegion);
                    _data.selectionCache[pageIndex] = pageData;
                } else {
                    __selectSingleRegionText(pageIndex, match.region);
                }
            }
        }
    }

    // regions could overlap and inner text is not a single line,
    // so it's not comfortable to select whole region since it's likely grab neighbor regions.
    // Creating a separate method to confidently select region inner objects.
    function __selectSingleRegionText(pageIndex, regionIndex) {
        __clearSelection();
        var pageData = __getPageData(pageIndex);
        if (pageData && pageData.regions[regionIndex]) {
            var region = pageData.regions[regionIndex];
            var ctx = __getDrawContext(__findPage(pageIndex), pageData);
            pageData.selection = __createEmptySelection(__makePoint(region.bounds.x, region.bounds.y), __makePoint(region.bounds.right, region.bounds.bottom), false);
            var sel = __selectRegionText(ctx, region, pageData.selection.origin, pageData.selection.point);
            if (sel && sel.lines.length > 0) {
                __insertSelectionRegion(pageData.selection.regions, sel);
                _data.selectionCache[pageIndex] = pageData;
            }
        }
    }

    function __select(startPage, startPoint, endPage, endPoint, rectangular) {
        var pageFrom = Math.min(startPage, endPage),
            pageTo = Math.max(startPage, endPage);

        for (var k in _data.selectionCache) {
            if (_data.selectionCache.hasOwnProperty(k)) {
                var idx = parseInt(k, 10);
                if (idx < pageFrom || idx > pageTo) {
                    __clearSelectionUI(idx, _data.selectionCache[idx], true);
                    _data.selectionCache[idx].selection = null;
                }
            }
        }

        var left = !rectangular ? 0 : Math.min(startPoint.x, endPoint.x);
        var toplLeft = __makePoint(left, 0);
        for (var i = pageFrom; i <= pageTo; i++) {
            var pageSize = _wdvInternals.getSourcePageSize(i);
            if (rectangular) {
                pageSize = $.extend({}, _wdvInternals.getPageSize(i));
                pageSize.width *= _wdvInternals.getPageScale(i);
                pageSize.height *= _wdvInternals.getPageScale(i);
            }

            var right = !rectangular ? pageSize.width : Math.max(startPoint.x, endPoint.x),
                bottomRight = __makePoint(right, pageSize.height),
                start,
                end;

            if (pageFrom === pageTo) {
                start = startPoint;
                end = endPoint;
            } else if (i === startPage) {
                start = startPoint;

                // ? selecting to subsequent pages : selecting to upper pages
                end = i === pageFrom ? bottomRight : toplLeft;
            } else if (i === pageTo || i === pageFrom) {
                // last page
                end = endPoint;
                start = i === pageFrom ? bottomRight : toplLeft;
            } else {
                start = toplLeft;
                end = bottomRight;
            }

            var pg = __findPage(i);
            if (!rectangular) {
                __selectSinglePageText(i, start, end, pg);
            } else {
                __selectPageRectangularArea(i, __makePoint(left, start.y), __makePoint(right, end.y), pg);
            }
        }
    }

    function __selectSinglePageText(pageIndex, start, end, page) {
        var pageData = __getPageData(pageIndex);
        if (pageData && __isSelectionChanged(pageData, start, end, false) && pageData.regions.length > 0) {

            if (page && page._text) {
                __clearSelectionUI(pageIndex, pageData, true);
            }

            pageData.selection = __createEmptySelection(start, end, false);
            var regionsSelection = __findSelectionRegions(pageData, start, end);

            if (regionsSelection && regionsSelection.start && regionsSelection.end) {
                var ctx = __getDrawContext(page, pageData);
                for (var j = 0; j < pageData.regions.length; j++) {
                    var region = pageData.regions[j];
                    var selectionRegion = null;
                    if (region === regionsSelection.start) {
                        if (region === regionsSelection.end) {
                            selectionRegion = __selectRegionText(ctx, region, regionsSelection.startPoint, regionsSelection.endPoint);
                        } else {
                            selectionRegion = __selectRegionText(ctx, region, regionsSelection.startPoint, __getRegionTextEnd(region));
                        }
                    } else if (region === regionsSelection.end) {
                        selectionRegion = __selectRegionText(ctx, region, __getRegionTextStart(region), regionsSelection.endPoint);
                    } else if (__isRegionWithinSelection(region, regionsSelection.start, regionsSelection.end)) {
                        selectionRegion = __selectRegionText(ctx, region, __getRegionTextStart(region), __getRegionTextEnd(region));
                    }

                    if (selectionRegion && selectionRegion.lines && selectionRegion.lines.length > 0) {
                        __insertSelectionRegion(pageData.selection.regions, selectionRegion);
                        _data.selectionCache[pageIndex] = pageData;
                    }
                }
            }
        }
    }

    function __findSelectionRegions(pageData, point1, point2) {
        // considering regions to have columns layout or at least behave like columns.
        // at first we need to identify regions to select between.
        // need to find  either regions that contain start and end point, or closest ones(since points could be outside all regions)
        var topLeft = __makePoint(Math.min(point1.x, point2.x), Math.min(point1.y, point2.y));
        var bottomRight = __makePoint(Math.max(point1.x, point2.x), Math.max(point1.y, point2.y));
        var rect = __ensureRect({
            x: topLeft.x,
            y: topLeft.y,
            width: bottomRight.x - topLeft.x,
            height: bottomRight.y - topLeft.y
        });

        var pageLine = __ensureRect({
            x: 0,
            y: topLeft.y,
            width: pageData.bounds.width,
            height: bottomRight.y - topLeft.y
        });

        var start = point1,
            end = point2,
            startRegion = null,
            endRegion = null,
            firstRegion = null,
            lastRegion = null;

        // the main problem here is the combination of the facts, that we are not guaranteed that points are ordered,
        // i.e. we don't know which of them start(to find first subsequent region) and which of them is end(to find last previous region).
        // we can't just compare points coordinates because of regions
        // matching rules(for example lower left point, could be near short region, while right one is near other long region that spans through whole page)
        for (var i = 0; i < pageData.regions.length && (!startRegion || !endRegion); i++) {
            var bounds = pageData.regions[i].bounds;
            if (isIntersects(pageLine, bounds)) {
                firstRegion = !firstRegion || __isRegionBefore(pageData.regions[i], firstRegion) ? pageData.regions[i] : firstRegion;
            }
            if (isIntersects(rect, bounds)) {
                startRegion = !startRegion && isWithinRect(start, pageData.regions[i].bounds) ? pageData.regions[i] : startRegion;
                endRegion = !endRegion && isWithinRect(end, pageData.regions[i].bounds) ? pageData.regions[i] : endRegion;

                lastRegion = !lastRegion || __isRegionAfter(pageData.regions[i], lastRegion) ? pageData.regions[i] : lastRegion;
            }
        }

        if (startRegion && endRegion) {
            if (__isRegionBefore(endRegion, startRegion)) {
                var tmp = endRegion;
                endRegion = startRegion;
                startRegion = tmp;
                start = point2;
                end = point1;
            }
        } else if (firstRegion && lastRegion) {
            var fakeRegion;
            if (startRegion) {
                fakeRegion = __makeFakeRegion(end);
                if (__isRegionBefore(startRegion, fakeRegion)) {
                    endRegion = lastRegion;
                    end = null;
                } else {
                    endRegion = startRegion;
                    end = start;
                    startRegion = firstRegion;
                    start = null;
                }
            } else if (endRegion) {
                fakeRegion = __makeFakeRegion(start);
                if (__isRegionAfter(endRegion, fakeRegion)) {
                    startRegion = firstRegion;
                    start = null;
                } else {
                    startRegion = endRegion;
                    start = end;
                    endRegion = lastRegion;
                    end = null;
                }
            } else {
                startRegion = firstRegion;
                endRegion = lastRegion;
                end = null;
                start = null;
            }

            start = start || __getRegionTextStart(startRegion);
            end = end || __getRegionTextEnd(endRegion);
        }

        return {
            start: startRegion,
            startPoint: start,
            end: endRegion,
            endPoint: end
        };
    }

    function __selectRegionText(ctx, region, start, end) {
        // start is expected to be the top point.
        var selectionRegion = { lines: [], bounds: $.extend({}, region.bounds) };
        var pageBounds = __getPageData(region.page).bounds;
        if (region.rotation !== 0) {
            // rotate all coordinates and make selection matching on 'virtual' region in normal orientation.
            // but store original objects with right coordinates in selection cache.
            start = Atalasoft.Utils.rotatePoint(start, pageBounds, 360 - region.rotation);
            end = Atalasoft.Utils.rotatePoint(end, pageBounds, 360 - region.rotation);
        }

        if (greater(start.y, end.y)) {
            var p = start;
            start = end;
            end = p;
        }

        for (var j = 0; j < region.lines.length; j++) {
            var line = region.lines[j];
            var selectionLine = { words: [] };
            var lineBounds = __getNormalizedBounds(line, pageBounds, region.rotation);
            var midLine = greater(lineBounds.y, start.y) && less(lineBounds.bottom, end.y);
            var topLine = !midLine && isBetween(start.y, lineBounds.y, lineBounds.bottom);
            var bottomLine = !midLine && isBetween(end.y, lineBounds.y, lineBounds.bottom);

            if (topLine && j > 1) {
                var prevLineNormalBounds = __getNormalizedBounds(region.lines[j - 1], pageBounds, region.rotation);
                topLine = !isBetween(start.y, prevLineNormalBounds.y, prevLineNormalBounds.bottom);
                midLine = !topLine && !bottomLine;
            }

            if (bottomLine && j < region.lines.length - 1) {
                var nextLineNormalBounds = __getNormalizedBounds(region.lines[j + 1], pageBounds, region.rotation);
                bottomLine = !isBetween(end.y, nextLineNormalBounds.y, nextLineNormalBounds.bottom);
                midLine = !topLine && !bottomLine;
            }

            if (midLine || topLine || bottomLine) {
                for (var k = 0; line.words && k < line.words.length; k++) {
                    var word = line.words[k];
                    var wordBounds = __getNormalizedBounds(word, pageBounds, region.rotation);
                    var hasGlyphs = word.glyphs && word.glyphs.length;
                    var included = midLine;
                    if (!included) {
                        if (topLine && bottomLine) {
                            // single line, getting words between points.
                            // if we are on the same line, no matter where is the upper point.
                            if (greater(start.x, end.x)) {
                                var tmp = start;
                                start = end;
                                end = tmp;
                            }

                            included = greater(hasGlyphs ? wordBounds.x : wordBounds.right, start.x) && less(hasGlyphs ? wordBounds.right : wordBounds.x, end.x);
                        } else if (topLine) {
                            //   if there is no glyphs - select whole word if we hit into it. otherwise will check glyphs later.
                            included = greater(hasGlyphs ? wordBounds.x : wordBounds.right, start.x);
                        } else if (bottomLine) {
                            included = less(hasGlyphs ? wordBounds.right : wordBounds.x, end.x);
                        }

                        if (!included && hasGlyphs) {
                            var part = null;
                            if (topLine && isBetween(start.x, wordBounds.x, wordBounds.right)) {
                                var selectionEnd = bottomLine ? Math.min(wordBounds.right, end.x) : wordBounds.right;
                                part = __selectPartialWord(word, start.x, selectionEnd);
                            }
                            if (bottomLine && isBetween(end.x, wordBounds.x, wordBounds.right)) {
                                var selectionStart = topLine ? Math.max(wordBounds.x, start.x) : wordBounds.x;
                                part = __selectPartialWord(word, selectionStart, end.x);
                            }
                            if (part) {
                                word = part;
                                included = true;
                            }
                        }
                    }

                    if (included) {
                        selectionLine.words.push($.extend({}, word));
                        if (ctx) {
                            __highlighteRegion(ctx, word.bounds.x, word.bounds.y, word.bounds.width, word.bounds.height);
                        }
                    }
                }

                if (selectionLine.words.length > 0) {
                    selectionRegion.lines.push(selectionLine);
                }
            }
        }

        return selectionRegion;
    }

    function __selectPartialWord(word, start, end) {
        var startGlyph = null,
            endGlyph = null;
        for (var i = 0; i < word.glyphs.length; ++i) {
            var glyphBounds = word.glyphs[i].normalizedBounds;
            if (startGlyph === null && greater(glyphBounds.right, start)) {
                startGlyph = i;
            }
            if (less(glyphBounds.x, end)) {
                endGlyph = i;
            } else {
                break;
            }
        }

        return startGlyph !== null && endGlyph !== null ? __makePartialWord(word, startGlyph, endGlyph) : null;
    }

    function __makePartialWord(word, startGlyph, endGlyph) {
        var result = {
            glyphs: [],
            text: '',
            omitSpace: word.omitSpace
        };
        if (startGlyph >= 0 && endGlyph >= startGlyph && word.glyphs[endGlyph]) {
            result.glyphs = word.glyphs.slice(startGlyph, endGlyph + 1);

            var first = word.glyphs[startGlyph].bounds,
                last = word.glyphs[endGlyph].bounds,
                x = Math.min(first.x, last.x),
                y = Math.min(first.y, last.y),
                right = Math.max(first.right, last.right),
                bottom = Math.max(first.bottom, last.bottom);

            result.bounds = {
                x: x,
                y: y,
                width: Math.abs(right - x),
                height: Math.abs(bottom - y)
            };
            __ensureRect(result.bounds);
            return result;
        }
        return null;
    }

    function __selectPageRectangularArea(pageIndex, start, end, page) {
        var pageData = __getPageData(pageIndex);
        if (pageData && __isSelectionChanged(pageData, start, end, true) && pageData.regions.length > 0) {
            if (page && page._text) {
                __clearSelectionUI(pageIndex, pageData, true);
            }

            var docSpaceStart = __getDocumentPoint(pageIndex, pageData, start);
            var docSpaceEnd = __getDocumentPoint(pageIndex, pageData, end);
            pageData.selection = __createEmptySelection(start, end, true);
            var rect = __ensureRect({
                x: Math.min(docSpaceStart.x, docSpaceEnd.x),
                y: Math.min(docSpaceStart.y, docSpaceEnd.y),
                width: Math.abs(docSpaceEnd.x - docSpaceStart.x),
                height: Math.abs(docSpaceEnd.y - docSpaceStart.y)
            });

            rect = __intersect(rect, pageData.bounds);
            if (rect) {
                var ctx;
                for (var i = 0; i < pageData.regions.length; i++) {
                    if (isIntersects(rect, pageData.regions[i].bounds)) {
                        ctx = ctx || __getDrawContext(page, pageData);
                        var selectionRegion = { lines: [], bounds: $.extend({}, pageData.regions[i].bounds) };
                        for (var j = 0; j < pageData.regions[i].lines.length; j++) {
                            var line = pageData.regions[i].lines[j];
                            var selectionLine = { words: [] };
                            for (var k = 0; line.words && k < line.words.length; k++) {
                                var word = line.words[k];
                                if (isIntersects(rect, word.bounds)) {
                                    var normalizedRect = __ensureRect(Atalasoft.Utils.rotateRect(rect, pageData.bounds, (360 - pageData.regions[i].rotation) % 360));
                                    var wordBounds = word.normalizedBounds;
                                    var startWithin = greater(wordBounds.x, normalizedRect.x);
                                    var endWithin = less(wordBounds.right, normalizedRect.right);
                                    if (!startWithin || !endWithin) {
                                        word = __selectPartialWord(word, Math.max(wordBounds.x, normalizedRect.x), Math.min(wordBounds.right, normalizedRect.right));
                                    }

                                    if (word) {
                                        selectionLine.words.push($.extend({}, word));
                                        if (ctx) {
                                            __highlighteRegion(ctx, word.bounds.x, word.bounds.y, word.bounds.width, word.bounds.height);
                                        }
                                    }
                                }
                            }

                            if (selectionLine.words.length > 0) {
                                selectionRegion.lines.push(selectionLine);
                            }
                        }

                        if (selectionRegion.lines.length) {
                            __insertSelectionRegion(pageData.selection.regions, selectionRegion);
                        }
                    }
                }

                if (pageData.selection.regions.length) {
                    pageData.selection.bounds = rect;
                    _data.selectionCache[pageIndex] = pageData;
                }
            }
        }
    }

    // if we want to select some region on the page,
    // it's easir to shrink it to the line -
    // thus won't grab intersecting lines/regions and won't go out of bounds.
    function __getMinimalSelectingRectangle(bounds, region) {
        if (region) {
            if (region.rotation % 180 === 0) {
                var verticalCenter = (bounds.bottom + bounds.y) / 2;
                return __ensureRect({
                    x: bounds.x,
                    y: verticalCenter,
                    width: bounds.width,
                    height: 0
                });
            } else {
                var horizontalCenter = (bounds.right + bounds.x) / 2;
                return __ensureRect({
                    x: horizontalCenter,
                    y: bounds.y,
                    width: 0,
                    height: bounds.height
                });
            }
        }
        return null;
    }

    function __highlighteRegion(ctx, x, y, width, height, colorSettings) {
        if (ctx) {
            ctx.clearRect(x, y, width, height);
            colorSettings = colorSettings || _config.selection;
            ctx.fillStyle = colorSettings.color;
            ctx.globalAlpha = colorSettings.alpha;
            ctx.fillRect(x, y, width, height);
        }
    }

    function __isSelectionChanged(pageData, start, end, rectangular) {
        rectangular = !!rectangular;
        return !pageData.selection || !__pointsEqual(pageData.selection.origin, start) || !__pointsEqual(pageData.selection.point, end) || rectangular !== pageData.selection.rectangular;
    }

    function __isRegionWithinSelection(region, startRegion, endRegion) {

        return __isRegionAfter(region, startRegion) && __isRegionBefore(region, endRegion);
    }

    function __isRegionAfter(region, testRegion) {
        if (greater(region.bounds.bottom, testRegion.bounds.y)) {
            if (isContained(region.bounds, testRegion.bounds)) {
                return region.bounds.x > testRegion.bounds.x;
            } else {
                var intersection = __intersect(region.bounds, testRegion.bounds);
                if (intersection) {
                    // this is mostly for small incorrect intersections caused by overlapping extraction data.
                    return intersection.width / intersection.height >= 1 ? greater(region.bounds.y, testRegion.bounds.y) : greater(region.bounds.x, testRegion.bounds.x);
                } else {
                    if (greater(region.bounds.y, testRegion.bounds.bottom)) {
                        return true;
                    } else if (less(region.bounds.bottom, testRegion.bounds.y)) {
                        return false;
                    }

                    if (greater(region.bounds.x, testRegion.bounds.x)) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    function __makeFakeRegion(point) {
        var bounds = __ensureRect({
            x: point.x,
            y: point.y,
            width: 0,
            height: 0
        });

        return {
            lines: [],
            bounds: bounds
        };
    }

    function __isRegionBefore(region, testRegion) {
        return !__isRegionAfter(region, testRegion);
    }

    function __insertSelectionRegion(list, region) {
        var i = 0;
        for (; i < list.length; i++) {
            if (__isRegionBefore(region, list[i])) {
                break;
            }
        }

        Array.prototype.splice.call(list, i, 0, region);
    }

    function __createEmptySelection(origin, point, rectangular) {
        return {
            origin: origin,
            point: point,
            rectangular: !!rectangular,
            regions: []
        };
    }

    // #endregion Selection Model

    // #region Search

    function __search(text, startPage, callback) {
        if (typeof startPage === 'function') {
            callback = startPage;
            startPage = 0;
        }

        __clearSearchResults();
        if (text && text.length > 2 && callback) {
            var searchQuery = {
                sourceQuery: text,
                text: text.toLocaleLowerCase(),

                start: startPage
            };
            _data.searchQuery = searchQuery;
            var iterator = new __CSearchIterator(searchQuery, callback);
            _data.searchQuery.iterator = iterator;
            return iterator;
        } else {
            for (var i = 0; i < _pages.length; i++) {
                __showLayer(_pages[i]._index, _pages[i]);
            }
        }
    }

    /**
     * Callback signature for {@link Atalasoft.Controls.WebDocumentViewer~TextController#search|text.search}, {@link Atalasoft.Controls.WebDocumentViewer~TextController~TextSearchIterator#next|next}, {@link Atalasoft.Controls.WebDocumentViewer~TextController~TextSearchIterator#prev|prev} methods.
     * @callback TextSearchCallback
     * @param {Atalasoft.Controls.WebDocumentViewer~TextController~TextSearchIterator} iterator - Current iterator instance.
     *
     * It's recommended to call {@link Atalasoft.Controls.WebDocumentViewer~TextController~TextSearchIterator#isValid|isValid} method when callback is called, to check whether iterator is still active. In case if search is cancelled(new search started), callback on the obsolete iterator will be called once to indicate that search is finished for particular query.
     *
     * @param {TextSearchResult} [match] - Current search query match descriptor. If match argument is null, no subsequent result are found.
     */

    /**
     * @typedef {Object} TextSearchResult - Represents single search result descriptor.
     * @property {number} page - Page index of the match.
     * @property {number} region - Index of the text region where match is occurred.
     * @property {number} line - Index of the text line within region where match is occurred.
     * @property {number} word - Index of the word within text line where match is occurred.
     */

    /**
     * WebDocuemntViewer Search Results Iterator.
     * @class
     * @inner
     * @name TextSearchIterator
     * @alias TextSearchIterator
     * @memberOf Atalasoft.Controls.WebDocumentViewer~TextController
     */
    function __CSearchIterator(query, callback) {
        var maxSearchAhead = 3;
        var start = query.start || 0;
        var currentPage = -1;
        var pageMatch = -1;
        var pageTotal = 0;
        var _this = this;
        var unloadedPagesCache = [];
        var awaitedPromise;
        var requestsQueue = [];
        var _current = __makeMatchInfo(-1);

        __init();
        function __init() {

            /**
             * Indicates whether search should be wrapped around when first or last document page is match is reached.
             * @name Atalasoft.Controls.WebDocumentViewer~TextController~TextSearchIterator#wrap
             * @type {boolean}
             */
            _this.wrap = true;

            _internalEvents.bind('pagetextloaded', __onNewPageLoaded);
            _wdv.bind({
                pageshown: __searchPageShown
            });

            setTimeout(function () {
                // highlight all occurrences on the visible pages.
                if (_pages.length && start >= _pages[0]._index && start <= _pages[_pages.length - 1]._index) {
                    for (var i = 0; i < _pages.length; i++) {
                        var pageData = __getPageData(_pages[i]._index);
                        if (pageData && !pageData.loading) {
                            pageData.searchResult = __searchPage(pageData, query.text);
                            if (pageData.searchResult.length) {
                                __showLayer(_pages[i]._index, _pages[i]);
                                if (_pages[i]._index === start) {
                                    pageTotal = pageData.searchResult.length;
                                    currentPage = start;
                                }
                            }
                        }
                    }
                }

                __next(callback);
            }, 0);
        }

        /**
         * Advances current item to the next query match or adds operation to the queue in case if next match is currently awaited.
         * @param {TextSearchCallback} callback - function that that is called when next match is found.
         * @function Atalasoft.Controls.WebDocumentViewer~TextController~TextSearchIterator#next
         */
        _this.next = __next;

        function __next(callback) {
            requestsQueue.push({
                action: __advancePosition,
                args: [true, __makeStateShiftCallback(callback)]
            });
            __executeNextRequest();
        }

        /**
         * Advances current item to the previous query match or adds operation to the queue in case if next match is currently awaited.
         * @param {TextSearchCallback} callback - Function that that is called when previous match is found.
         * @function Atalasoft.Controls.WebDocumentViewer~TextController~TextSearchIterator#prev
         */
        _this.prev = __prev;

        function __prev(callback) {
            requestsQueue.push({
                action: __advancePosition,
                args: [false, __makeStateShiftCallback(callback)]
            });
            __executeNextRequest();
        }

        function __executeNextRequest() {
            if (!awaitedPromise && requestsQueue.length) {
                var request = requestsQueue.shift();
                if (request && typeof request.action === "function") {
                    request.action.apply(_this, request.args);
                }
            }
        }

        function __advancePosition(forward, callback) {
            if (__isValid()) {
                var offset = forward ? 1 : -1;
                var pageData = __getPageData(currentPage);
                var hasResult = pageData && pageData.searchResult && pageData.searchResult.length;
                var hasNext = forward ? pageMatch >= -1 && pageMatch < pageTotal - 1 : pageMatch > 0 && pageMatch <= pageTotal;

                if (hasResult && hasNext) {
                    pageMatch += offset;
                    var match = pageData.searchResult[pageMatch];
                    _current = __makeMatchInfo(currentPage, match);
                    __selectExactMatch(currentPage, match);

                    var textRotation = pageData ? pageData.rotation : 0;
                    var m = _wdvInternals.getViewerTransform(currentPage, textRotation);
                    var rect = __getMinimalSelectingRectangle(match.bounds, pageData.regions[match.region]);
                    var pagePoint = __makePoint(m.x(rect.x, rect.y), m.y(rect.x, rect.y));
                    _wdvInternals.showPagePoint(currentPage, pagePoint, Atalasoft.Utils.PageSelection.Center, function () {
                        callback(_this, __makeMatchInfo(currentPage, match));
                    });
                } else {
                    // if already searchin - just wait for previous results.
                    awaitedPromise = awaitedPromise || __findNextMatchPage(query.text, currentPage >= 0 ? currentPage + offset : start, forward).done(function (index, pageData) {
                        if (__isValid()) {
                            if (index >= 0 && pageData) {
                                currentPage = index;
                                pageTotal = pageData.searchResult.length;
                                pageMatch = forward ? -1 : pageTotal;
                                __advancePosition(forward, callback);
                            }
                        } else {
                            callback(_this, null);
                        }
                    }).fail(function () {
                        callback(_this, null);
                    });
                }
            } else {
                callback(_this, null);
            }
        }

        /**
        * Gets the query text for this iterator.
        * @returns {string}
        * @function Atalasoft.Controls.WebDocumentViewer~TextController~TextSearchIterator#getQuery
        */
        _this.getQuery = __getQueryText;
        function __getQueryText() {
            return query.sourceQuery;
        }

        /**
         * Indicates whether this iterator corresponds to the active search.
         *
         * If `false`, next/prev methods are always returning `null` match.
         * @returns {boolean}
         *
         * @function Atalasoft.Controls.WebDocumentViewer~TextController~TextSearchIterator#isValid
         */
        _this.isValid = __isValid;

        function __isValid() {
            var isActive = _data.searchQuery === query;
            if (!isActive) {
                __disposeIterator();
            }

            return isActive;
        }

        /**
         * Indicates whether this is executing background search.
         * If `true`, subsequent next/prev calls are stored into the search queue.
         *
         * Method could be used, for example, to determine whether search will be continued after particular callback call, and thus to hide or preserve search loading mask.
         *
         * @returns {boolean}
         * @function Atalasoft.Controls.WebDocumentViewer~TextController~TextSearchIterator#isSearching
         */
        _this.isSearching = __isSearching;
        function __isSearching() {
            return __isValid() && (awaitedPromise || requestsQueue.length > 0);
        }

        /**
         * Returns the formatted text for the whole line containing current match.
         * @returns {string}
         *
         * @function Atalasoft.Controls.WebDocumentViewer~TextController~TextSearchIterator#getCurrentLineText
         */
        _this.getCurrentLineText = __getCurrentLineText;
        function __getCurrentLineText() {
            if (__isValid() && _current && _current.page >= 0) {
                var pageData = __getPageData(_current.page);
                if (pageData && pageData.regions[_current.region] && pageData.regions[_current.region].lines[_current.line]) {
                    return __getLineText(pageData.regions[_current.region].lines[_current.line]);
                }
            }

            return null;
        }

        function __findNextMatchPage(text, pageIndex, forward, deffered, wrapped) {
            deffered = deffered || $.Deferred();
            var haveUnloaded;
            if (__isValid()) {
                // let's do everything asynk to not block browser.
                setTimeout(function () {
                    for (; pageIndex >= 0 && pageIndex < _wdvInternals._controllers.document.getPageCount(); pageIndex += forward ? 1 : -1) {
                        var pageData = __getPageData(pageIndex);
                        if (pageData && !pageData.loading) {
                            pageData.searchResult = __searchPage(pageData, query.text);
                            if (pageData.searchResult.length > 0) {
                                deffered.resolve(pageIndex, pageData);
                                return;
                            }
                        } else if (pageData && pageData.loading && pageData.promise) {
                            __makeContinualtionForLoadingPage(text, pageIndex, forward, deffered, wrapped, pageData);
                            return;
                        } else if (!pageData) {
                            // it's 99% impossible that we'll get here while page is being loaded. but even if we do - let's just threat it with server search.
                            if (unloadedPagesCache[pageIndex]) {
                                continue;
                            }
                            haveUnloaded = true;
                            __searchUnloadedPage(text, pageIndex, forward, deffered);
                            return;
                        }
                    }

                    if (_this.wrap && !haveUnloaded && !wrapped) {
                        if (pageIndex < 0 && !forward) {
                            pageIndex = _wdvInternals._controllers.document.getPageCount() - 1;
                        } else if (pageIndex >= _wdvInternals._controllers.document.getPageCount() && forward) {
                            pageIndex = 0;
                        }
                        // pass wrapped = true, so we'll exit infinite loop if no matches found. 
                        __findNextMatchPage(text, pageIndex, forward, deffered, true);
                        return;
                    }

                    deffered.reject();
                }, 0);
            }

            return deffered.promise();
        }

        function __makeContinualtionForLoadingPage(text, index, forward, deffered, wrapped, pageData) {
            pageData.promise.then(function () {
                __findNextMatchPage(text, index, forward, deffered, wrapped);
            });
        }

        function __searchUnloadedPage(text, pageIndex, forward, deffered) {
            var searchInterval = __getServerSearchInterval(pageIndex, forward);
            if (!searchInterval.pages.length) {
                deffered.reject();
            } else {
                __serverSearchNextPage(text, searchInterval, maxSearchAhead).done(function (foundPage) {
                    if (foundPage === null) {
                        if (__isValid()) {
                            var pageRef = searchInterval.pages[searchInterval.pages.length - 1];
                            var docIndex = pageRef.hasOwnProperty('di') ? pageRef.di : pageRef.i;
                            __findNextMatchPage(text, docIndex, forward, deffered);
                        } else {
                            deffered.reject();
                        }
                    } else {
                        // todo: check if we came here with no results and stopped on nextLoadedPage
                        var foundPageData = __getPageData(foundPage);
                        deffered.resolve(foundPage, foundPageData);
                    }
                }).fail(function () {
                    deffered.reject();
                });
            }
        }

        function __searchPage(pageData, text) {
            var queryLength = text.length;
            var result = [];
            if (!pageData.searchResult) {
                for (var i = 0; i < pageData.regions.length; i++) {
                    for (var j = 0; j < pageData.regions[i].lines.length; j++) {
                        var line = pageData.regions[i].lines[j];
                        var charPosition = 0;
                        var rectangles = [];
                        var lineText = '';
                        for (var k = 0; k < line.words.length; k++) {
                            var word = line.words[k];
                            var hasGlyphs = word.glyphs && word.glyphs.length;
                            if (__wordsSeparated(word, k >= 1 ? line.words[k - 1] : null)) {
                                lineText += ' ';
                                ++charPosition;
                            }
                            for (var l = 0; l < (hasGlyphs ? word.glyphs.length : word.text.length); l++) {
                                rectangles[charPosition++] = {
                                    bounds: hasGlyphs ? word.glyphs[l].bounds : word.bounds,
                                    region: i,
                                    line: j,
                                    word: k,
                                    glyph: __selectSingleRegionText ? l : -1
                                };

                                lineText += (hasGlyphs ? word.glyphs[l].text : word.text[l]).toLocaleLowerCase();
                            }
                        }

                        var idx = 0;
                        do {
                            idx = lineText.indexOf(text, idx);
                            if (idx >= 0) {
                                var startRect = rectangles[idx];
                                var endIdx = Math.min(idx + queryLength - 1, rectangles.length);
                                while (!rectangles[endIdx] && endIdx > idx) {
                                    --endIdx;
                                }

                                var endRect = rectangles[endIdx];
                                var bounds = __ensureRect({
                                    x: startRect.bounds.x,
                                    y: startRect.bounds.y,
                                    width: Math.abs(endRect.bounds.right - startRect.bounds.x),
                                    height: Math.abs(endRect.bounds.bottom - startRect.bounds.y)
                                });

                                result.push({
                                    bounds: bounds,
                                    region: startRect.region,
                                    line: startRect.line,
                                    word: startRect.word,
                                    glyph: startRect.glyph,
                                    endWord: endRect.word,
                                    endGlyph: endRect.glyph
                                });
                            }
                        } while (idx++ >= 0);
                    }
                }
            } else {
                result = pageData.searchResult;
            }

            return result;
        }

        function __getServerSearchInterval(startPageindex, forward) {
            var pageIndex = startPageindex,
                docTextUrl = null,
                pages = [];

            for (; pageIndex >= 0 && pageIndex < _wdvInternals._controllers.document.getPageCount() && pages.length <= 20; pageIndex += forward ? 1 : -1) {

                var textUrl = null;
                var pageDef = _wdvInternals._controllers.document.getPageDefinition(pageIndex);
                var sourceIndex = pageDef.index;
                if (pageDef.uri) {
                    textUrl = pageDef.uri;
                }

                // we want to search through continuous set of pages of the same file.
                if (docTextUrl !== textUrl && pageIndex !== startPageindex) {
                    break;
                }

                docTextUrl = textUrl;
                var queryItem = {
                    //index int the source file
                    i: sourceIndex
                };

                if (sourceIndex !== pageIndex) {
                    // index in the current document state.
                    queryItem.di = pageIndex;
                }
                pages.push(queryItem);

                // found the page that either loaded or loading. breaking the interval.
                var pageData = __getPageData(pageIndex);
                if (pageData && !pageData.loading) {
                    break;
                }
            }

            var interval = {
                textUrl: docTextUrl || _wdv.config.documenturl,
                pages: pages
            };

            return interval;
        }

        function __serverSearchNextPage(text, searchInterval, searchLimit) {
            var deffered = $.Deferred();
            var hRequest = {
                type: 'pagetextsearch',
                serverurl: _wdv.config.serverurl,
                query: '?pagetextsearch=',
                method: 'POST',
                data: {
                    atala_query: text,
                    atala_docurl: searchInterval.textUrl,
                    atala_maxcount: searchLimit || maxSearchAhead,
                    atala_pages: JSON.stringify(searchInterval.pages)
                },
                cancel: false
            };

            var success = function success(searchResults) {
                if (__isValid()) {
                    var foundPage = -1;
                    if (searchResults && searchResults.length) {
                        // consume all preloaded text data. find matching page.
                        for (var i = 0; i < searchResults.length; i++) {
                            var page = searchResults[i];
                            var docIndex = page.hasOwnProperty('di') ? page.di : page.i;

                            var pageData = __getPageData(docIndex);
                            if (!pageData && page.text) {
                                _wdvInternals._controllers.document.updatePageText(docIndex, page.text);
                                __onPageTextLoaded(page.text, page.text, docIndex);
                            }

                            if (page.count <= 0 && foundPage < 0) {
                                if (pageData) {
                                    pageData.searchResult = [];
                                } else {
                                    unloadedPagesCache[docIndex] = [];
                                }
                            } else if (foundPage < 0 && page.count > 0) {
                                // requested pages order have sense, so we need to get exactly first match and not overwrite
                                foundPage = docIndex;
                            }
                        }
                    }
                    deffered.resolve(foundPage >= 0 ? foundPage : null);
                } else {
                    deffered.reject();
                }
            };

            var fail = function fail() {
                deffered.reject();
            };

            _wdvInternals.makeHandlerRequest(hRequest, success, fail);
            return deffered.promise();
        }

        /**
         * Disposes the current iterator. Calling this method is optional. Abandoned iterators will be disposed automatically.
         * @ignore
         *
         * @function Atalasoft.Controls.WebDocumentViewer~TextController~TextSearchIterator#dispose
         */
        _this.dispose = __disposeIterator;
        function __disposeIterator() {
            _internalEvents.unbind('pagetextloaded', __onNewPageLoaded);
            _wdv.unbind({
                pageshown: __searchPageShown
            });
            unloadedPagesCache = [];
        }

        function __onNewPageLoaded(evt) {
            var pageData = evt.text;
            var idx = evt.index;
            if (__isValid() && pageData) {
                pageData.searchResult = __searchPage(pageData, query.text);

                if (unloadedPagesCache[idx]) {
                    Array.prototype.splice.call(unloadedPagesCache, idx, 1);
                }

                if (pageData.searchResult.length) {
                    var page = _wdvInternals.findPageFromIndex(idx);
                    if (page) {
                        __showLayer(idx, page);
                    }
                }
            }
        }

        function __searchPageShown(e) {
            if (__isValid() && e.page && e.index >= 0) {
                var pageData = __getPageData(e.index);
                if (pageData && !pageData.loading && !pageData.searchResult) {
                    setTimeout(function () {
                        pageData.searchResult = __searchPage(pageData, query.text);
                        __showLayer(e.index, e.page);
                    }, 0);
                }
            }
        }

        function __makeStateShiftCallback(callback) {
            return function () {
                awaitedPromise = null;
                if (callback) {
                    callback.apply(this, arguments);
                }

                __executeNextRequest();
            };
        }

        function __makeMatchInfo(page, match) {
            return {
                page: page,
                region: match ? match.region : 0,
                line: match ? match.line : 0,
                word: match ? match.word : 0
            };
        }
    }

    function __clearSearchResults() {
        var matchPages = [];
        for (var i = 0; i < _wdvInternals._controllers.document.getPageCount(); i++) {
            var pageData = __getPageData(i);
            if (pageData && pageData.searchResult) {
                if (pageData.searchResult.length) {
                    matchPages[i] = true;
                }

                pageData.searchResult = null;
            }
        }

        for (var j = 0; j < _pages.length; ++j) {
            if (matchPages[j]) {
                __showLayer(j, _pages[j]);
            }
        }

        _data.searchQuery = null;
    }

    // #endregion Search

    // #region Ajax/Json Methods

    _self.createHandlerRequest = __createHandlerRequest;
    function __createHandlerRequest(serverUrl, textUrl) {
        var hRequest = {
            type: 'textdata',
            serverurl: serverUrl,
            query: '?atalatextdata=',
            method: 'GET',
            data: {
                atala_docurl: textUrl
            },
            cancel: false,
            info: {
                ocr: {},
                error: undefined
            }
        };

        return hRequest;
    }

    _self.makeHandlerRequest = __makeHandlerRequestAsync;
    function __makeHandlerRequestAsync(hRequest, callback) {
        __clearText();
        // this handler is not used right now - assuming that whole document text could be bigger than x86 browser could fint into memory. 
        // defined inline so we have a closure reference to callback
        function __complete(info) {
            // we assume that all requests made through this method are for fields
            __onTextLoaded(info);

            // only execute the callback if it exists
            if (typeof callback === 'function') {
                callback.call();
            }
        }

        _wdvInternals.makeHandlerRequest(hRequest, __complete, __complete);
    }

    _self.loadText = __onTextLoaded;
    function __onTextLoaded(info) {
        if (info) {
            if (info.error) {
                __throwError('TextLoadError', info.error);
                __clearText();
            }

            if (info.text.pages) {
                for (var i = 0; i < info.text.pages.length; ++i) {
                    __validateTextPage(info.text.pages[i], i);
                }
            }

            _wdvInternals._controllers.document.initDocumentText(info.text);
            __triggerEvent({
                type: 'textloaded'
            });
        }
    }

    function __ensurePageTextLoaded(pageIndex) {
        var deferred = $.Deferred();
        var pageData = __getPageData(pageIndex);
        var pageDef = _wdvInternals._controllers.document.getPageDefinition(pageIndex);
        if (!pageData && pageDef) {
            pageData = {
                loading: true,
                regions: [],
                promise: deferred
            };
            _wdvInternals._controllers.document.updatePageText(pageIndex, pageData);
            var texturl = pageDef.uri || _wdv.config.documenturl;
            var serverurl = _wdv.config.serverurl;
            setTimeout(function () {
                var hRequest = {
                    type: 'pagetextdata',
                    serverurl: serverurl,
                    query: '?atalapagetext=',
                    method: 'GET',
                    data: {
                        atala_docurl: texturl,
                        atala_index: pageDef.index
                    },
                    cancel: false,
                    info: {
                        page: pageData,
                        error: undefined
                    }
                };

                var handler = __makePageTextLoadedHandler(pageData, pageIndex, deferred);
                _wdvInternals.makeHandlerRequest(hRequest, handler, handler);
            }, 0);
        } else {
            deferred.resolve(pageIndex, pageData);
        }

        return deferred.promise();
    }

    _self.loadPageText = __loadPageTextAsync;
    function __loadPageTextAsync(serverUrl, formUrl, callback) {
        var hRequest = __createHandlerRequest(serverUrl, formUrl);
        __makeHandlerRequestAsync(hRequest, callback);
    }

    // #endregion

    // #region Helper Methods

    function __onPageTextLoaded(info, pageData, pageIndex, deferred) {
        if (info) {
            if (pageData.promise === deferred) {
                pageData.loading = false;
                pageData.promise = undefined;
            }
            if (info.error) {
                __throwError('TextLoadError', info.error);
                pageData.regions = [];
                if (deferred && deferred.reject) {
                    deferred.reject(pageIndex);
                }
            } else {
                __validateTextPage(info, pageIndex);
                pageData.regions = info.regions ? info.regions : [];
                $.extend(pageData, info);
                var args = {
                    type: 'pagetextloaded',
                    index: pageIndex,
                    text: pageData
                };

                __triggerInternalEvent(args);
                __triggerEvent(args);
                if (deferred && deferred.resolve) {
                    deferred.resolve(pageIndex, pageData);
                }
            }
        }
    }

    function __findPage(index) {
        for (var i = 0; i < _pages.length; i++) {
            if (_pages[i]._index === index) {
                return _pages[i];
            }
        }

        return null;
    }

    function __getDrawContext(page, pageData) {
        if (page && page._text) {
            var canvas = page._text[0];
            if (canvas.getContext) {
                var ctx = canvas.getContext("2d");
                var textRotation = pageData ? pageData.rotation : 0;
                var matrix = _wdvInternals.getViewerTransform(page._index, textRotation);
                ctx.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f);
                return ctx;
            }
        }

        return null;
    }

    function __makePageTextLoadedHandler(pageData, pageIndex, deferred) {
        return function (info) {
            __onPageTextLoaded(info, pageData, pageIndex, deferred);
        };
    }

    function __validateTextPage(page, pageIndex) {
        if (page) {
            __validateTextObject(page);
            page.regions = page.regions || [];
            // simple cache for rotated regions to quickly detect mouse cursor.
            page.rotatedRegions = [];
            page.rotation = page.rotation || 0;

            for (var i = page.regions.length - 1; i >= 0; --i) {
                page.regions[i].page = pageIndex;
                if (!__validateTextRegion(page.regions[i], page.bounds)) {
                    Array.prototype.splice.call(page.regions, i, 1);
                } else {
                    page.regions[i].index = i;
                    if (page.regions[i].rotation) {
                        page.rotatedRegions.push(page.regions[i]);
                    }
                }
            }

            page.regions.sort(function (r1, r2) {
                return __isRegionBefore(r1, r2) ? -1 : 1;
            });
        }
    }

    function __validateTextRegion(region, pageBounds) {
        if (!__validateTextObject(region)) {
            return false;
        }

        region.rotation = region.rotation || 0;
        region.lines = region.lines || [];
        var linesCount = region.lines.length;
        for (var i = region.lines.length - 1; i >= 0; --i) {
            if (!__validateLine(region.lines[i], pageBounds, region.rotation)) {
                Array.prototype.splice.call(region.lines, i, 1);
            }
        }

        if (linesCount > 0 && region.lines.length === 0) {
            // if something is horribly bad and we're eliminated whole region data, let's report it.
            __throwError('TextLoadError', "Invalid region data received.");
        }

        return linesCount > 0 ? region.lines.length > 0 : true;
    }

    function __validateLine(line, pageBounds, regionRotation) {
        if (!__validateTextObject(line, pageBounds, regionRotation)) {
            return false;
        }

        line.words = line.words || [];
        var count = line.words.length;
        for (var i = line.words.length - 1; i >= 0; --i) {
            if (!__validateWord(line.words[i], pageBounds, regionRotation)) {
                Array.prototype.splice.call(line.words, i, 1);
            }
        }

        return count > 0 ? line.words.length > 0 : true;
    }

    function __validateWord(word, pageBounds, regionRotation) {
        if (!__validateTextObject(word, pageBounds, regionRotation)) {
            return false;
        }

        word.glyphs = word.glyphs || [];
        word.text = word.text || '';
        if (word.os) {
            word.omitSpace = word.os;
            delete word.os;
        }

        for (var i = word.glyphs.length - 1; i >= 0; --i) {
            var g = word.glyphs[i];
            if (!__validateGlyph(g, pageBounds, regionRotation)) {
                Array.prototype.splice.call(word.glyphs, i, 1);
            }
        }

        return true;
    }

    function __validateGlyph(glyph, pageBounds, regionRotation) {
        if (!__validateTextObject(glyph, pageBounds, regionRotation)) {
            return false;
        }

        if (!glyph.text) {
            return false;
        }

        return true;
    }

    function __validateTextObject(obj, pageBounds, regionRotation) {
        var result = false;
        if (obj) {
            if (obj.b && typeof obj.b === "string") {
                var boundsData = obj.b.split(';');
                obj.bounds = {
                    x: parseFloat(boundsData[0]),
                    y: parseFloat(boundsData[1]),
                    width: parseFloat(boundsData[2]),
                    height: parseFloat(boundsData[3])
                };
                delete obj.b;
                result = true;
            } else if (obj.bounds && obj.bounds.hasOwnProperty('x') && obj.bounds.hasOwnProperty('y') && obj.bounds.hasOwnProperty('width') && obj.bounds.hasOwnProperty('height')) {
                __ensureRect(obj.bounds);
                result = true;
            }
        } else {
            obj = {};
        }

        if (!obj.bounds) {
            obj.bounds = { x: 0, y: 0, width: 0, height: 0 };
        }

        __ensureRect(obj.bounds);
        if (obj.bounds) {
            obj.normalizedBounds = __getNormalizedBounds(obj, pageBounds, regionRotation);
        }

        return result;
    }

    // get's the text object bounds counter-rotated to region rotation. This is used for selection matching:
    // to compare all coordinates in a single TtoR-TtoB direction
    function __getNormalizedBounds(pageObject, pageRect, rotation) {
        if (!pageObject.normalizedBounds) {
            if (rotation % 360 === 0) {
                pageObject.normalizedBounds = pageObject.bounds;
                return pageObject.normalizedBounds;
            } else {
                pageObject.normalizedBounds = __ensureRect(Atalasoft.Utils.rotateRect(pageObject.bounds, pageRect, 360 - rotation));
            }
        }

        return pageObject.normalizedBounds;
    }

    function __ensureRect(rect) {
        rect.right = rect.x + rect.width;
        rect.bottom = rect.y + rect.height;
        return rect;
    }

    function less(a, b) {
        return a < b + Tolerance;
    }

    function greater(a, b) {
        return a > b - Tolerance;
    }

    function __pointsEqual(p1, p2) {
        return p1 && p2 && p1.x === p2.x && p1.y === p2.y;
    }

    function isBetween(p, start, end) {
        return greater(p, start) && less(p, end);
    }

    function isWithinRect(point, rect) {
        if (!rect) {
            return false;
        }

        return isBetween(point.x, rect.x, rect.right) && isBetween(point.y, rect.y, rect.bottom);
    }

    function isIntersects(r1, r2) {
        if (!(r1 || r2)) {
            return false;
        }

        var intersects = greater(r1.right, r2.x) && greater(r2.right, r1.x) && greater(r1.bottom, r2.y) && greater(r2.bottom, r1.y) || isContained(r1, r2);
        return intersects;
    }

    function isContained(r1, r2) {
        if (!(r1 || r2)) {
            return false;
        }

        var container = r1.width > r2.width ? r1 : r2;
        r2 = container === r1 ? r2 : r1;
        return less(container.x, r2.x) && greater(container.right, r2.right) && less(container.y, r2.y) && greater(container.bottom, r2.bottom);
    }

    function __intersect(rect1, rect2) {
        if (!isIntersects(rect1, rect2)) {
            return null;
        }

        var result = {
            x: Math.max(rect1.x, rect2.x),
            y: Math.max(rect1.y, rect2.y),
            right: Math.min(rect1.right, rect2.right),
            bottom: Math.min(rect1.bottom, rect2.bottom)
        };

        if (result.x < result.right && result.y < result.bottom) {
            result.width = Math.abs(result.right - result.x);
            result.height = Math.abs(result.bottom - result.y);
            return result;
        }
        return null;
    }

    function __getDocumentPoint(pageIndex, pageData, point) {
        var matrix = _wdvInternals.getViewerTransform(pageIndex, pageData.rotation ? pageData.rotation : 0).invert();
        return __makePoint(matrix.x(point.x, point.y), matrix.y(point.x, point.y));
    }

    function __wordsSeparated(word, prev) {

        if (!word || !prev || prev.omitSpace) {
            return false;
        }

        return true;
    }

    // gets the bounds point where text semantically begins
    function __getRegionTextStart(region) {
        return __makePoint(region.bounds.x, region.bounds.y);
        //switch (( 360 + region.rotation) % 360) {
        //    case 90:
        //        return __makePoint(region.bounds.right, region.bounds.y);
        //    case 270:
        //        return __makePoint(region.bounds.x, region.bounds.bottom);
        //    case 180:
        //        return __makePoint(region.bounds.right, region.bounds.bottom);
        //    default:
        //        return __makePoint(region.bounds.x, region.bounds.y);
        //}
    }

    // gets the bounds point where text semantically ends
    function __getRegionTextEnd(region) {
        return __makePoint(region.bounds.right, region.bounds.bottom);
        //switch ((360 + region.rotation) % 360) {
        //    case 90:
        //        return __makePoint(region.bounds.x, region.bounds.bottom);
        //    case 270:
        //        return __makePoint(region.bounds.r, region.bounds.y);
        //    case 180:
        //        return __makePoint(region.bounds.x, region.bounds.y);
        //    default:
        //        return __makePoint(region.bounds.right, region.bounds.bottom);
        //}
    }

    function __makePoint(x, y) {
        return {
            x: x,
            y: y
        };
    }

    function __makeThrottleFunction(func, wait) {
        var context, args, result;
        var timeout;
        var lastExecuted = 0;
        var continuation = function continuation() {
            lastExecuted = new Date().getTime();
            timeout = null;
            result = func.apply(context, args);
            if (!timeout) {
                context = args = null;
            }
        };
        return function () {
            var now = new Date().getTime();
            if (!lastExecuted) {
                lastExecuted = now - wait;
            }
            var remaining = wait - (now - lastExecuted);
            context = this;
            args = arguments;
            if (remaining <= 0 || remaining > wait) {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
                lastExecuted = now;
                result = func.apply(context, args);
                if (!timeout) {
                    context = args = null;
                }
            } else if (!timeout) {
                timeout = setTimeout(continuation, remaining);
            }
            return result;
        };
    }

    // #endregion
    __extendWDV();
    __initTextLayer();
};
'use strict';

//
//  TextAnnotation UI class
//
//  This source code is property of Atalasoft, Inc. (http://www.atalasoft.com/)
//  Permission for usage and modification of this code is only permitted 
//  with the purchase of a source code license.
//
//  Change History:
//	02-09-12	D. Cilley		File Created.
//	03-04-12	D. Cilley		FB 12922: Fixed text editor showing when another anno selected.
//	09-18-12	D. Cilley		FB 13597: Handled new showeditor event.
//	11-21-12	D. Cilley		FB 13804: Added min text box size so mobile browsers can edit text.
//	12-20-12	D. Cilley		FB 13874: Added HTML text renderer for supported browsers.
//	01-08-13	D. Cilley		FB 13898: Added raphaelParent property to objects nested in SVG.
//	01-17-13	J. Burch		FB 13923: Fixing issues with text annos when upgrading to RaphaelJS 2.1.0
//	02-21-13	D. Cilley		FB 14065: Added JSHint options and fixes to comply with JSHint warnings.
//	02-22-13	D. Cilley		FB 13984: Fixed event obstruction with text annos in IE7/8 from RaphaelJS 2.1.0 change.
//	02-25-13	J. Burch		FB 13991: Fixing text anno repaint issues introduced by new version of raphael
//	03-01-13	D. Cilley		FB 14066: TextAnnotations now use HTML rendering for all browsers.
//	04-05-13	D. Cilley		FB 14073: Fixed a bug in textanno that allowed editing in IE at the wrong time.
//	05-08-13	D. Cilley		FB 14139: Removed focus call for IE7 to prevent auto scroll.
//	11-13-13	D. Cilley		FB 14475: Fixed text showing while annotation hidden.
//	12-03-13	D. Cilley		FB 14071: Removed jquery.browser dependency.
//	06-20-14	D. Cilley		Bug 293577: Fixed text anno editor font size on initial edit.
//	12-17-14	D. Cilley		Bug 550581: Added locally scoped non-conflict jQuery.
//	07-09-15	D. Cilley		Bug 607560: Fixed an offset bug related to pageborderwidth fix.
//-------------------------------------------------------------------------------------------------

// JSHint options and globals
/*jshint eqnull: true, undef: true, jquery: true, browser: true, es3:false */

// Atalasoft global constructors and functions
/*global Atalasoft */

// Local globals
/*global Raphael */

Atalasoft.Annotations.TextAnnotationUI = function (ann, paper, cdata) {
	var $ = Atalasoft.$;
	var _Tself = this;
	var _Cdata = cdata;
	var _Teve = ann.getEventObject(); // Event Helper
	var _Tarea = null; // jquery textarea editor object
	var _Ttext = null; // jquery textarea view object
	var _Tfont = null; // FontUI
	var _Thtml = null; // Atalasoft Raphael html object
	var _Tdata = ann.get('text'); // text data property of the annotation

	var _editMode = false;
	var _Tmargin = 3;
	var _TminBox = Atalasoft.Utils.Browser.Mobile.Any() ? {
		// mobile minimum text area size
		width: 200,
		height: 200
	} : { // desktop minimum text area size
		width: 1,
		height: 1
	};

	// page level events added by this UI
	var _TpageEvents = {};

	var _TAnnoEvents = {
		moving: __TannotationChanged,
		resized: __TannotationChanged,
		moved: __TannotationChanged,
		rotated: __TannotationChanged
	};

	// #region Control lifecycle

	__Tinit();
	function __Tinit() {
		__Tconstruct();
		__Trepaint();
		ann.bind(_TAnnoEvents);
	}

	function __Tconstruct() {
		if (_Tfont == null) {
			_Tfont = new Atalasoft.Annotations.FontUI(_Tdata.font);
		}

		if (_Thtml) {
			var obj = _Thtml.removed !== true ? _Thtml : null;
			_Teve.unbind(obj, {
				showeditor: __Tshoweditor,
				hideeditor: __Thide
			});
		}

		// appending _Tarea to new page or similar doc manipulations could cause 'blur' which removes editor.
		var isEdit = _editMode;

		// attempts to make an HTML object to embed in the SVG/VML, if it can't embed the
		// html, then it will return an image tag, which we send a base64 encoded image of the output
		var autoscale = _Tdata.autoscale;

		_Thtml = !autoscale ? paper.html() : paper.atalaImage();

		// need to render this with the canvas renderer if it doesn't accept HTML
		if (!_Thtml.isHtml || autoscale) {
			_Thtml.renderer = new Atalasoft.Annotations.AnnotationTextRenderer(ann.get(), _Tfont);
			__TrepaintHtml = __TrepaintHtmlImage;
		}

		// might need to move the text editor
		if (_Tarea != null) {
			if (paper._page) {
				paper._page.append(_Tarea);
				paper._page.bind(_TpageEvents);
			}
		}

		if (Raphael.vml) {
			// hides cursor that shows up on rect while dragging
			ann.getObject().node.style.overflow = 'hidden';
		}

		_Thtml.transform(__getResultTransform().toTransformString(true));

		_Teve.bind(_Thtml, {
			showeditor: __Tshoweditor,
			hideeditor: __Thide
		});

		if (isEdit) {
			__Tshoweditor();
		}
	}

	_Tself.dispose = __Tdispose;
	function __Tdispose() {
		if (_Tarea) {
			_Tarea.remove();
		}

		if (_Ttext) {
			_Ttext.remove();
		}

		if (_Tfont) {
			_Tfont.dispose();
		}

		if (_Thtml) {
			_Thtml.remove();
		}

		if (paper && paper._page) {
			paper._page.unbind(_TpageEvents);
		}

		ann.unbind(_TAnnoEvents);
		_Tself = null;
		_Teve = null;
		_Tarea = null;
		_Tfont = null;
		_Ttext = null;
		_Thtml = null;
		_Tdata = null;
	}

	// #endregion

	// #region Properties

	// map settings onto data
	_Tself.set = __TsetData;
	function __TsetData(cfg) {
		if (cfg) {
			$.extend(_Tdata, cfg);
		}
	}

	_Tself.get = __TgetData;
	function __TgetData(s) {
		if (s) {
			return _Tdata[s];
		} else {
			// TODO: we may want to return a copy here so people can't mess with
			// the internal variables while we're doing something with it
			return _Tdata;
		}
	}

	_Tself.getFont = __TgetFont;
	function __TgetFont() {
		return _Tfont;
	}

	// #endregion

	// #region Private methods

	function __Tshoweditor(e) {
		if (!_Tarea) {
			__TcreateEditor();
		}

		__Tshow();
	}

	function __ThtmlChanged(e) {
		e.stopPropagation();

		if (_Tdata.value !== _Tarea.val()) {
			_Tdata.value = _Tarea.val();
			ann.set({ text: _Tdata });
		}
	}

	function __TcreateEditor() {
		_Tarea = $('<textarea/>').hide();
		if (paper._page) {
			paper._page.append(_Tarea);
			paper._page.bind(_TpageEvents);
		}

		// bind to events to handle all methods of text entry
		// need mousedown to override page mousedown, or we won't be able to edit it
		_Tarea.bind('change keydown mouseup mousemove mousedown', __ThtmlChanged);
		_Tarea.bind({
			blur: __Thide
		});

		ann.bind({
			deselected: __Thide
		});

		var annObj = ann.getObject();

		_Tarea.css({
			'position': 'absolute',
			'overflow-x': 'auto',
			'overflow-y': 'auto',
			'z-index': 99999,
			'border': '0px solid',
			'padding': '0px',
			'background-color': 'transparent',
			'text-align': _Tdata.align
		});

		if (Atalasoft.Utils.Browser.Mobile.Any()) {
			var r = ann.get();
			var offset = Atalasoft.Utils.getSVGOffset(paper.canvas, paper._page);

			_Tarea.css({
				'left': r.x + offset.left + 'px',
				'top': r.y + offset.top + 'px',
				'width': r.width + 'px',
				'max-width': r.width + 'px',
				'height': r.height + 'px',
				'max-height': r.height + 'px',
				'border': annObj.attr('stroke') + ' ' + annObj.attr('strokewidth') + 'px',
				'background-color': annObj.attr('fill')
			});
		}

		_Tfont.setZoom(ann.getZoom());

		// hides the webkit native resizing
		if (Atalasoft.Utils.Browser.Chrome || Atalasoft.Utils.Browser.Safari) {
			_Tarea.css({ resize: 'none' });
		}

		if (_Tdata.value != null) {
			_Tarea.val(_Tdata.value);
		}

		if (_Tdata.readonly) {
			_Tarea.prop('readonly', 'readonly');
		}

		_Tfont.repaint(_Tarea);
	}

	// shows the editable text box and hides the html text
	function __Tshow() {
		var visible = ann ? ann.get('visible') : true;
		if (!visible) {
			return;
		}

		if (_Tarea.is(':hidden') || !_editMode) {
			_Thtml.hide();
			_Tarea.prop('readonly', _Tdata.readonly ? 'readonly' : '');
			_Tarea.show();
			__Trepaint();
		}

		if (Atalasoft.Utils.Browser.Touch) {
			_Tarea.focus(function () {
				_Tarea[0].setSelectionRange(0, 9999);
			});
		}

		// IE7 auto-scrolls out of view when focus is programmatically called
		if (!(Atalasoft.Utils.Browser.Explorer && parseInt(Atalasoft.Utils.Browser.Version, 10) === 7)) {
			// jquery focus doesn't actually call dom focus
			_Tarea[0].focus();
		}

		_editMode = true;
	}

	// hides the editable text box and shows the html text
	function __Thide() {
		if (_Tarea) {
			if (_Tarea.is(':visible') || _editMode) {
				_Tarea.hide();
				_Thtml.show();
				__Trepaint();
			}

			// tell the browser that we're done with the edit
			_Tarea[0].blur();
			_editMode = false;
		}
	}

	// #endregion

	// #region Exposed methods

	_Tself.updateView = __TupdateView;
	function __TupdateView() {
		var visible = ann ? ann.get('visible') : true;

		if (visible) {
			if (!_editMode) {
				_Thtml.show();
			} else {
				__Tshoweditor();
			}
		} else {
			_Thtml.hide();
		}

		// this is used to make sure that the Microsoft Matrix (ie 7/8) has a bgcolor to anti-alias to
		if (_Thtml.backgroundColor) {
			_Thtml.backgroundColor(ann.get('fill').color);
		}
	}

	_Tself.changepaper = __Tchangepaper;
	function __Tchangepaper(p) {
		if (p) {
			if (paper !== p || _Thtml.removed) {
				paper = p;

				if (_Ttext != null) {
					_Ttext.remove();
					_Ttext = null;
				}

				__Tconstruct();
				__TupdateView();
			}
		}
	}

	_Tself.repaint = __Trepaint;
	function __Trepaint(p) {
		__Tchangepaper(p);

		// repaints the HTML representation of the text annotation
		__TrepaintHtml();

		// repaints the editor textarea HTML object 
		if (_Tarea && (!_Tarea.is(':hidden') || _editMode)) {
			// outline width is actually half since it's placed on the midpoint 
			var ow = ann.get('outline').width / 2;

			var attrs = ann.get();
			var z = ann.getZoom();
			var box = ann.getBox();

			var m = __getResultTransform();
			var tl = __transformPoint(m, box.x, box.y),
			    br = __transformPoint(m, box.x + box.width, box.y + box.height);

			var width = box.width * z;
			var height = box.height * z;

			var loc = {
				x: (tl.x + br.x - width) / 2,
				y: (tl.y + br.y - height) / 2
			};

			var mz = _Tmargin * z;
			var owz = ow * z;
			var mzo = (mz + owz) * 2;
			var taw = Math.max(Math.ceil(width - mzo), _TminBox.width);
			var tah = Math.max(Math.ceil(height - mzo), _TminBox.height);
			var offset = Atalasoft.Utils.getSVGOffset(paper.canvas, paper._page);

			var angle = attrs.rotation + _Cdata.getPageRotation(ann._pageindex);
			var transform = angle !== 0 ? 'rotate(' + angle + 'deg)' : '';
			var css = {
				'left': Math.round(loc.x + offset.left + owz) + 'px',
				'top': Math.round(loc.y + offset.top + owz) + 'px',
				'width': taw + 'px',
				'height': tah + 'px',
				'max-width': taw + 'px',
				'max-height': tah + 'px',
				'padding': Math.ceil(mz) + 'px'
			};

			$.extend(css, Atalasoft.Utils.__htmlTransformStyle(transform));

			if (Atalasoft.Utils.Browser.Explorer8) {
				var annObj = ann.getObject();
				var sw = annObj.attr('strokewidth') || 1;
				_Tarea.css({
					'border': 'solid' + ' ' + sw + 'px' + ' ' + annObj.attr('stroke'),
					'background-color': annObj.attr('fill')
				});
			}

			_Tarea.css(css);
		}

		if (_Tfont) {
			_Tfont.set(_Tdata.font);
			_Tfont.setZoom(ann.getZoom());
			_Tfont.repaint(_Tarea);
		}
	}

	// #endregion

	// #region Custom repaints

	// repaints the custom Atalasoft Raphael HTML object
	function __TrepaintHtml() {
		var attrs = ann.get();

		if (!_Ttext) {
			_Ttext = $('<textarea selectable="false"/>');
			$(_Thtml.innerDom).append(_Ttext);

			_Ttext.css({
				'background-color': 'transparent',
				'border': '0px solid',
				'overflow-x': 'hidden',
				'overflow-y': 'hidden',
				'-moz-user-select': 'none',
				'-khtml-user-select': 'none',
				'-webkit-user-select': 'none',
				'user-select': 'none',
				'resize': 'none',
				'cursor': 'inherit'
			});

			// IE likes to put the cursor there even though we're catching mouse events
			_Ttext.attr('readonly', 'readonly');

			_Ttext.bind({
				focus: function focus() {
					this.blur();
					return false;
				}
			});

			_Ttext[0].raphaelParent = true;
		}

		_Ttext.val(_Tdata.value);

		// outline width is actually half since it's placed on the midpoint 
		var ow = ann.get('outline').width / 2;
		var taw = Math.max(Math.ceil(attrs.width - (ow + _Tmargin) * 2), 1);
		var tah = Math.max(Math.ceil(attrs.height - (ow + _Tmargin) * 2), 1);

		if (_Tfont) {
			_Tfont.set(_Tdata.font);
			_Tfont.repaint(_Ttext, 1, true);
		}

		_Ttext.css({
			'width': taw + 'px',
			'height': tah + 'px',
			'max-width': taw + 'px',
			'max-height': tah + 'px',
			'padding': _Tmargin + 'px',
			'text-align': _Tdata.align
		});

		_Thtml.attr({
			'x': Math.round(ow + attrs.x),
			'y': Math.round(ow + attrs.y),
			'width': attrs.width,
			'height': attrs.height
		});

		if (attrs.cornerradius >= 0) {
			var aobj = ann.getObject();
			$(aobj[0]).attr({
				'rx': attrs.cornerradius || 0,
				'ry': attrs.cornerradius || 0
			});
		}

		_Thtml.transform(__getResultTransform().toTransformString(true));
	}

	function __TrepaintHtmlImage() {
		// outline width is actually half since it's placed on the midpoint 
		var ow = ann.get('outline').width / 2;
		var attrs = ann.get();
		var taw = Math.max(Math.ceil(attrs.width - (ow + _Tmargin) * 2), 0);
		var tah = Math.max(Math.ceil(attrs.height - (ow + _Tmargin) * 2), 0);

		if (_Tfont) {
			_Tfont.set(_Tdata.font);
		}

		_Thtml.attr({
			'x': Math.round(ow + _Tmargin + attrs.x),
			'y': Math.round(ow + _Tmargin + attrs.y),
			'width': taw,
			'height': tah
		});

		if (attrs.cornerradius >= 0) {
			var aobj = ann.getObject();
			$(aobj[0]).attr({
				'rx': attrs.cornerradius || 0,
				'ry': attrs.cornerradius || 0
			});
		}

		// renders the text to the SVG image using a canvas
		if (_Thtml.renderer) {
			_Thtml.renderer.renderToSVGImage(_Thtml[0], { width: taw, height: tah });
		}

		_Thtml.transform(__getResultTransform().toTransformString(true));
	}

	function __getResultTransform() {
		var m = Raphael.matrix();
		var viewerTransform = _Cdata.getViewerTransform(ann._pageindex);
		var annoTransform = ann.getTransform();
		m.add(viewerTransform.a, viewerTransform.b, viewerTransform.c, viewerTransform.d, viewerTransform.e, viewerTransform.f);

		m.add(annoTransform.a, annoTransform.b, annoTransform.c, annoTransform.d, annoTransform.e, annoTransform.f);
		return m;
	}

	function __TannotationChanged() {
		if (_Thtml) {
			__Trepaint();
		}
	}

	function __transformPoint(matrix, x, y) {
		return {
			x: matrix.x(x, y),
			y: matrix.y(x, y)
		};
	}

	// #endregion
};
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

//
//  WebDocumentViewer Thumbnailer extension
//
//  This source code is property of Atalasoft, Inc. (http://www.atalasoft.com/)
//  Permission for usage and modification of this code is only permitted 
//  with the purchase of a source code license.
//
//  Change History:
//	03-19-13	*********		File Created.
//	08-30-13	D. Cilley		FB 14274: Added Thumbnailer functionality.
//	09-04-13	D. Cilley		FB 14274: Added touch support.
//	09-11-13	D. Cilley		FB 14303: Fixed size thumb divs too small after openurl.
//	09-11-13	D. Cilley		FB 14304: Fixed thumb div color staying on thumb recycle.
//	09-12-13	D. Cilley		FB 14305: Fixed overscroll and scrollbar size.
//	09-16-13	D. Cilley		FB 14333: Fixed annotation paper centering on thumbs.
//	09-17-13	D. Cilley		FB 14334: Exposed thumbnailer debug info.
//	10-03-13	D. Cilley		FB 14363: Fixed js error when documenturl is set in both viewer and thumbs. 
//	10-07-13	D. Cilley		FB 14415: Fixed thumbnail zoom on second openUrl call.
//	12-03-13	D. Cilley		FB 14071: Removed jquery.browser dependency.
//	01-14-14	D. Cilley		Bug 293828: Fixed openurl when not on first page.
//	01-16-14	D. Cilley		Bug 293573: Fixed thumbnail select while zooming.
//	01-17-14	D. Cilley		Bug 293575, 293574: Fixed scrollbar thumb tray sizing and overscroll.
//	02-06-14	D. Cilley		Bug 309834: Fixed openUrl hang, and added public empty function.
//	08-14-14	D. Cilley		Bug 345109: Added framework for horizontal scrolling and grid layout.
//	12-17-14	D. Cilley		Bug 550581: Added locally scoped non-conflict jQuery.
//	01-16-15	D. Cilley		Bug 556294: Added image dispose to help with mapsto exceptions.
//	02-19-15	D. Cilley		Bug 560725: Fixed multiple bugs that caused thumbnails not to be displayed.
//	02-25-15	D. Cilley		Bug 583364: Fixed another bugs that let the thumbnailer scroll past last page.
//	02-26-15	D. Cilley		Bug 560686: Fixed multiple problems with navigation when scrolling.
//	02-27-15	D. Cilley		Bug 560755: Re-scaled thumbs that were too big on multi-size documents.
//	03-02-15	D. Cilley		Bug 560407: Added some specific handling for the columns and rows options.
//	03-30-15	D. Cilley		Bug 592766: Fixed a bug that would cause thumbs to go off center.
//	04-10-15	D. Cilley		Bug 596029: Fixed a sizing bug related to showPage() usage in a callback.
//	04-27-15	D. Cilley		Bug 593012: Fixed a bug that would remove scroll thumb.
//	05-01-15	D. Cilley		Bug 608515: Added vector flag for enabling zoom past 1.
//	09-15-15	D. Cilley		Bug 627869: Added support for forcing all pages to be fit into the same size.
//	09-21-15	D. Cilley		Bug 635949: Fixed multiple scroll related issues, and page number label location.
//-------------------------------------------------------------------------------------------------

// JSHint options and globals
/*jshint eqnull: true, undef: true, jquery: true, browser: true, es3:false */

// Atalasoft global constructors and functions
/*global Atalasoft */

// Local globals

/**
 * Control that shows thumbnails of document pages and annotations.
 * @param {WebThumbnailerConfig} [settings] Object of key value pairs representing initial settings
 * @param {OpenUrlCallback} [openCallback] callback that is called when document load complete(if {@link WebDocumentViewerConfig.documenturl| documenturl} is specified).
 * @class
 * @augments Atalasoft.Controls.WebDocumentViewer
 * @returns {WebDocumentThumbnailer} A new control with the given settings.
 */
Atalasoft.Controls.WebDocumentThumbnailer = function (settings, openCallback) {
    var $ = Atalasoft.$;
    var _self = null;
    var _viewer = settings.viewer || null;
    var _cin = [];
    var _cinDragDropTemp = [];
    var _thumbEvents = null;
    var _viewerLink = null;
    var _thumbLink = null;
    var dragdataKey = 'atala_dragdata';
    var sortableWidgetFullName = 'ui-sortable';
    var sortableWidgetDeprecatedName = 'sortable';
    var draggableScrollParentWrapperKey = 'atala_scroll_parent';

    // Atalasoft Enums
    var _fitting = Atalasoft.Utils.Fitting;
    var _direction = Atalasoft.Utils.ScrollDirection;
    var _selectionMode = Atalasoft.Utils.SelectionMode;
    var _selectionOrder = Atalasoft.Utils.SelectedItemsOrder;

    // state manager for viewer communication.
    var _stateManager = null;

    // page values
    var _page = {
        size: { width: 0, height: 0 },
        sizes: [{ width: 0, height: 0 }],
        count: 0,
        number: -1,
        dpi: 96,
        vector: false
    };

    // state values
    var _state = {
        base: null,
        loading: false,
        initialized: false,
        scrolling: false,
        dragdropping: false,
        viewer: {
            zoom: 0,
            pagenumber: 0,
            // when controlling viewer, some api is redirected to viewer. when not controlling it's restored, need to set viewer api back.
            api: {}
        },
        // when controlling viewer, some api is redirected to viewer. when not controlling it's restored. this is for caching thumb api.
        selfapi: {}
    };

    var _touch = {
        moves: 0,
        start: {
            x: NaN,
            y: NaN
        }
    };

    var _thumb = {
        divsize: -1, // populated with thumb size + borders after the size is calculated
        scale: 1, // thumbs are actually scaled at a different rate than the viewer's zoom
        size: 0, // populated with calculated thumb size
        zoom: 1, // normalized zoom level with respect to zoomfull
        zoomfull: 1 // populated with the thumbs starting scale
    };

    // config object
    /**
     * Represents {@link Atalasoft.Controls.WebDocumentThumbnailer|WebDocumentThumbnailer} configuration.
     * @atalaconfig
     * @alias WebThumbnailerConfig
     * @example
     * <caption>It's recommended to increase this value on touch device. For example </caption>
     *  _thumbs = new Atalasoft.Controls.WebDocumentThumbnailer({
     *    parent: $(".atala-document-thumbs"),
     *    serverurl: _serverUrl, // server handler url to send image requests to
     *    documenturl: _docUrl, // + _docFile, 	// document url relative to the server handler url
     *    allowannotations: true,
     *    allowdragdrop: true,
     *    dragdelay: Atalasoft.Utils.Browser.Mobile.Any() ? 750 : 250,
     *    viewer: _viewer
     *  });
     */
    var _config = {
        direction: _direction.Vertical,
        /**
        *  @property {number} [maxwidth=300] - Specifies the maximum amount of pixel width allowed for zooming in.
        *
        *  This property is intended to limit size of the images data transferred over the wire on big zoom values.
        */
        maxwidth: 300,

        /**
         *  @property {number} [minwidth=80] - Specifies the minimum amount of pixel width allowed for zooming out.
         */
        minwidth: 80,

        pageborderwidth: 1,
        pagespacing: 2,
        parent: null,
        showpagenumber: false,
        toolbarparent: null,

        /**
         * @property {boolean} [showthumbcaption=false] - Specifies whether captions will be added to the each thumbnail page. */
        showthumbcaption: false,

        /**
         * @property {string} [thumbcaptionformat] - Specifies default thumbnail caption format.
         *
         * {0} - will be substituted with page number.
         * {1} - will be substituted with the document file name.
         * Could also be set on server using DocumentInfoRequestedEventArgs arguments of DocumentInfoRequested event.
         */
        thumbcaptionformat: '',

        // thumb specific properties that will be ignored by the base viewer
        /**
         * @property {boolean} [allowdragdrop=false] - Indicates whether drag&drop through UI is enabled.
         */
        allowdragdrop: false,

        /**
         * @property {number} [dragdelay=250] - Delay in milliseconds before drag&drop operation is started.
         *
         * This delay is intended to support "pan" behavior when UI drag&drop support is enabled.
         *
         */
        dragdelay: 250,

        /**
         * @property {number} [selectedindex=0] - Index of the initially selected page. This page will be selected after each new document will be loaded.
         */
        selectedindex: 0,

        /**
         * @property {number} [thumbpadding=8] - Padding of the thumbnail image.
         */
        thumbpadding: 8,

        /**
         * @property {string} [backcolor='#DCDCDC'] - Thumbnail background color.
         */
        backcolor: '#DCDCDC',

        /**
         * @property {string} [hovercolor='#667F9F'] - Thumbnail :hover color.
         */
        hovercolor: '#667F9F',

        /**
         * @property {string} [selectedcolor='#E0872D'] - Selected thumbnail background color.
         */
        selectedcolor: '#E0872D',

        /**
         * @property {string} [selectedhovercolor='#FFC060'] - Selected thumbnail :hover background color.
         */
        selectedhovercolor: '#FFC060',

        /**
         * @property {Atalasoft.Utils.SelectionMode} [selectionmode=SingleSelect] - Defines the WDT selection mode.
         */
        selectionmode: Atalasoft.Utils.SelectionMode.SingleSelect,

        /**
         * @property {Atalasoft.Utils.SelectedItemsOrder} [selecteditemsorder=ItemIndexOrder] - Defines the order in which selected pages are to be processed.
         */
        selecteditemsorder: Atalasoft.Utils.SelectedItemsOrder.ItemIndexOrder
    };

    // these properties are necessary
    var _thumbCfg = {
        type: 'Atalasoft.Controls.WebDocumentThumbnailer',
        debug: true, // used to get internal objects
        showpageborder: true,
        forcepagefit: true,
        toolbarparent: $('<div/>') // we don't use the toolbar
    };

    /**
     * @lends Atalasoft.Controls.WebDocumentThumbnailer
     */
    var _events = {
        /**
         * Triggers when thumbnail is selected.
         * @event Atalasoft.Controls.WebDocumentThumbnailer#thumbselected
         * @param {Object} event - The event object.
         * @param {number} event.index - Index of the page that was selected.
         */
        thumbselected: null,

        /**
         * Triggers when thumbnail is deselected.
         * @event Atalasoft.Controls.WebDocumentThumbnailer#thumbdeselected
         * @param {Object} event - The event object.
         * @param {number} event.index - Index of the page that was deselected.
         */
        thumbdeselected: null,

        /**
         *  Triggers when thumbnail drag & drop operation is started.
         *  @event Atalasoft.Controls.WebDocumentThumbnailer#thumbdragstart
         *  @param {Object} event - The event object.
         *  @param {number} event.dragindex - Index of the page being dragged.
         *  @param {number[]} event.dragindices - The indices of pages being dragged.
         */
        thumbdragstart: null,

        /**
         * Callback signature for {@link Atalasoft.Controls.WebDocumentThumbnailer#event:thumbdragend| WebDocumentThumbnailer.thumbdragend} event.
         * @callback ThumbDragEndCallback
         * @param {Object} event - The event object.
         * @param {ThumbDragEndEventArgs} args - The event data.
         */
        /**
         * @typedef {Object} ThumbDragEndEventArgs
         * @property {number} dragindex - The index of the page being dragged.
         * @property {number[]} dragindices - The indices of pages being dragged.
         * @property {number} dropindex - The index where the page was dropped in the target document.
         * @property {string} sourcedocument - The identifier of the source document. Corresponds to {@link WebDocumentViewerConfig.documenturl|config.documenturl}
         * @property {Atalasoft.Controls.WebDocumentThumbnailer} source - The source thumbnailer control.
         * @property {Atalasoft.Controls.WebDocumentThumbnailer} target - The target thumbnailer control.
         * @property {boolean} external - Indicates whether page is being dropped into external document(not the one dragged page originally belong to).
         *
         * @property {DocumentPageReference} pageref - Reference to the page in the source document. See {@link Atalasoft.Controls.WebDocumentViewer~DocumentController#insertPage| document.insertPage} for usage sample.
         * @property {DocumentPageReference[]} pagerefs - References to pages in the source document. See {@link Atalasoft.Controls.WebDocumentViewer~DocumentController#insertPage| document.insertPage} for usage sample.
         *
         * @property {boolean} [cancel=false] - Flag indicating whether default behavior should be cancelled. If set by the application, page want be moved to the new position by the  {@link Atalasoft.Controls.WebDocumentThumbnailer|WebDocumentThumbnailer}.
         *
         * @property {boolean} [copyannotations=true] - Flag indicating whether source page annotations should be copied to the inserted page.
         * This could be used by the application to inject additional logic, for example used confirmation dialog and move the page using API after that.
         */

        /** Triggers before thumbnail drag & drop operation is complete. This event could be triggered for either case when thumb was dropped within same document where it belongs or when thumb was dropped to the external document.
         * @event Atalasoft.Controls.WebDocumentThumbnailer#thumbdragend
         * @type {ThumbDragEndCallback}
         * @param {Object} event - The event object.
         * @param {ThumbDragEndEventArgs} args - The event data.
         *
         * Note that args.cancel flag allows to prevent default drop handler behavior.
         * If set by the application, page want be moved to the new position by the  {@link Atalasoft.Controls.WebDocumentThumbnailer|WebDocumentThumbnailer}.
         * This could be used by the application to inject additional logic, for example used confirmation dialog and move the page using API after that.
         **/
        thumbdragend: null,

        /**
         * Callback signature for {@link Atalasoft.Controls.WebDocumentThumbnailer#event:thumbdragcomplete| WebDocumentThumbnailer.thumbdragcomplete} event.
         * @param {Object} event - The event object.
         * @param {ThumbDragCompleteEventArgs} args - The event data.
         */

        /**
         * @typedef {Object} ThumbDragCompleteEventArgs
         * @property {number} dragindex - The index of the page being dragged.
         * @property {number[]} dragindices - The indices of pages being dragged.
         * @property {number} dropindex - The index where the page was dropped in the target document.
         * @property {Atalasoft.Controls.WebDocumentThumbnailer} source - The source thumbnailer control.
         * @property {Atalasoft.Controls.WebDocumentThumbnailer} target - The target thumbnailer control.
         */

        /** Triggers after thumbnail drag & drop operation is complete.
         * @event Atalasoft.Controls.WebDocumentThumbnailer#thumbdragcomplete
         * @type {ThumbDragCompleteEventArgs}
         *
         * @param {Object} event - The event object.
         * @param {ThumbDragCompleteEventArgs} args - The event data.
         */
        thumbdragcomplete: null
    };

    // #region variable functions

    var __reloadPageViewer = void 0,
        __reloadPageBase = void 0;

    // #endregion variable functions

    // map settings and thumb config onto main config
    if (settings) {
        // check if there is a defined thumb size
        if ('thumbsize' in settings) {
            if (isFinite(settings.thumbsize) && settings.thumbsize > 0) {
                __setThumbSize(settings.thumbsize);

                _thumbCfg.forcepagesize = {
                    width: settings.thumbsize,
                    height: settings.thumbsize
                };
            }
        }

        $.extend(_config, settings);
        $.extend(_config, _thumbCfg);

        // not show page numbers as captions will be either same in default case or more advanced.
        _config.showpagenumber = _config.showpagenumber && !_config.showthumbcaption;

        // if fitting wasn't set by user, set it automatically
        if (!('fitting' in settings)) {
            _config.fitting = _config.direction === _direction.Vertical ? _fitting.Width : _fitting.Height;
        }

        if (_viewer && _viewer.config) {
            _config.allowtext = _viewer.config.allowtext;
        }
    }

    // create base WDV
    _self = Atalasoft.Controls.WebDocumentViewer.call(this, _config, function (error) {
        __onThumbsLoaded(error, openCallback);
    });

    _thumbLink = _self.__getViewerLink(_self);
    _config = _thumbLink._config;

    __overrideInternal();
    __validateConfig();

    // #region Control Lifecycle

    function __getStateManagerApi() {
        return {
            get: function get() {
                return _self;
            },
            detachViewer: __detachViewer,
            activateViewer: __activateViewer
        };
    }

    function __init() {
        if (_viewer) {
            //TODO: move this to separate public api like LinkViewer. make sure we can link to WDV controlled by other thumbnailer
            _viewerLink = _viewer.__getViewerLink(_self, _thumbLink);
            _stateManager = _viewerLink.stateManager;
        }

        _self.bind({
            statusmessage: __onThumbsStatusMessage,
            pagerotated: __onViewerDocumentChanged,
            pageinserted: __onViewerDocumentChanged,
            pageremoved: __onViewerDocumentChanged,
            pagemoved: __onViewerDocumentChanged
        });

        // thumbnail WDV events
        _self.bind({
            annotationsloaded: __onThumbAnnosLoaded,
            formsloaded: __onThumbFormsLoaded,
            contextmenu: __onThumbContextMenu,
            documentloaded: __onDocumentLoaded,
            pageshown: __onThumbShown,
            pageresize: __onThumbResize,
            scroll: __onThumbScroll,
            zoomchanged: __onThumbZoomChanged,
            zoomstarted: __onThumbZoomStarted,
            zoomfinished: __onThumbZoomFinished,
            pagesizechanged: __onThumbPageSizeChanged
        });

        __overridePublic();

        // thumbnail div events
        _thumbEvents = {
            click: __onThumbClicked,
            touchstart: __onThumbTouchStart,
            touchmove: __onThumbTouchMove,
            touchend: __onThumbTouchEnd,
            mouseenter: __onThumbHoverIn,
            mouseleave: __onThumbHoverOut
        };

        __load();
    }

    function __load() {}

    function __bindViewer(viewer, bind) {
        if (viewer) {
            var action = bind ? viewer.bind : viewer.unbind;
            var reverseSelfAction = bind ? _self.unbind : _self.bind;
            action.call(viewer, {
                beforehandlerrequest: __onViewerRequest,
                documentloaded: __onViewerLoaded,
                scroll: __onViewerScroll,
                scrollFinished: __onViewerScrolled,
                pagerotated: __onViewerPageRotated,
                pageinserted: __onViewerPageInserted,
                pageremoved: __onViewerPageRemoved,
                pagemoved: __onViewerPageMoved
            });

            reverseSelfAction.call(_self, {
                pagerotated: __onViewerDocumentChanged,
                pageinserted: __onViewerDocumentChanged,
                pageremoved: __onViewerDocumentChanged,
                pagemoved: __onViewerDocumentChanged
            });

            __subscribeEventsRetrigger(viewer, viewer.document.events, action);
            if (_config.allowannotations) {
                action.call(viewer, {
                    annotationresized: __onViewerAnnotationUpdated,
                    annotationmoved: __onViewerAnnotationUpdated,
                    annotationrotated: __onViewerAnnotationUpdated,
                    annotationcreated: __onViewerAnnotationCreated,
                    annotationdeleted: __onViewerAnnotationDeleted
                });

                if (viewer.annotations) {
                    __subscribeEventsRetrigger(viewer, viewer.annotations.events, action);
                }
            }
        }
    }

    function __subscribeEventsRetrigger(viewer, events, action) {
        var bindConfig = {};
        for (var e in events) {
            if (events.hasOwnProperty(e)) {
                bindConfig[e] = __retriggerEvent;
            }
        }
        action.call(viewer, bindConfig);
    }

    function __retriggerEvent() {
        _self.trigger.apply(_self, arguments);
    }

    /**
     * Checks whether current thumbnailer is controlling referenced viewer.
     *
     * If viewer is linked only to the current thumbnailer, this method always return `true`.
     *
     * If thumbnailer is not linked to any viewer, this method always return `false`.
     * @function Atalasoft.Controls.WebDocumentThumbnailer#isActive
     * @returns {boolean} `true` if current thumbnailer instance is controlling referenced viewer; `false` otherwise.
     */
    function __isControllingViewer() {
        return _viewer && (!_stateManager || _stateManager && _stateManager.isThumbnailerActive(__getStateManagerApi()));
    }

    /**
     * Takes ownership over referenced viewer, i.e. if shared viewer is currently displaying other document, it's switched to display document from calling thumbnailer.
     * @function Atalasoft.Controls.WebDocumentThumbnailer#activate
     */
    function __activate() {
        __activateViewer(_viewer);
    }

    function __activateViewer(viewer, force) {
        if (!_viewer && viewer) {
            _viewer = viewer;
            _viewerLink = _viewer.__getViewerLink(_self, _thumbLink);
            _stateManager = _viewerLink.stateManager;
        }

        if (_viewer && _viewer.isReady() && (!__isControllingViewer() || force)) {
            var needRebindViewer = _viewer && !__isControllingViewer();
            _stateManager.activateThumbnailer(__getStateManagerApi(), __getDocumentStateInfo(), _thumbLink, _config, force);
            if (needRebindViewer) {
                __bindViewer(_viewer, true);
                __attachOverridedApi(_viewer);
            }
        }

        repaintSelectionState(true);
    }

    function __detachViewer() {
        if (_viewer && _viewer.isReady()) {
            _state.viewer.zoom = _viewer.getZoom();
            _state.viewer.pagenumber = _viewer.getCurrentPageIndex();
            // transfer the fields runtime state to thumbnailer since filed changes are not synchronized between wdv/wdt
            if (_config.allowforms && _state.base.controllers.forms && _viewerLink._fields) {
                var formsData = {
                    forms: {
                        fields: __copyJsonDataToArray(_viewerLink._fields)
                    }
                };

                _state.base.controllers.forms.loadForms(formsData);
            }
        }

        __bindViewer(_viewer, false);
        __detachOverridedApi(_viewer);
        repaintSelectionState(false);
    }

    function __getDocumentStateInfo() {
        var docInfo = {
            pagewidth: _page.size.width,
            pageheight: _page.size.height,
            pagecount: _page.count,
            dpi: _page.dpi,
            colordepth: _state.base.controllers.memory.colorDepth,
            vector: _page.vector,
            pagenumber: _state.viewer.pagenumber,
            zoom: _state.viewer.zoom
        };

        if (_config.allowannotations && _thumbLink._annos) {
            docInfo.layers = __copyJsonDataToArray(_thumbLink._annos, 'items');
        }

        if (_config.allowforms && _thumbLink._fields) {
            docInfo.forms = {
                fields: __copyJsonDataToArray(_thumbLink._fields)
            };
        }

        return docInfo;
    }

    // #endregion

    // #region Overrides

    // overrides internal defined functions with functions from the base control
    function __overrideInternal() {
        // functions from the base control
        __createDiv = _thumbLink.__createDiv;
        __createDOM = _thumbLink.__createDOM;
        __getSelectedPagesIndicesBase = _thumbLink.__getSelectedPagesIndices;

        _thumbLink.__getSelectedPagesIndices = __getSelectedPagesIndices;
    }

    function __getApiToOverride() {
        return {
            // functions that bypass the thumbnailer and talk to the WDV
            thumb: {
                'annotations': null,
                'document': null,
                'text': null,
                'getCurrentPageIndex': null,
                'getZoom': null,
                'zoom': null,
                'zoomIn': null,
                'zoomOut': null,
                'next': null,
                'previous': null,
                'save': null,
                'showPage': null,
                'setMouseTool': null
            },

            viewer: {
                reloadPage: function reloadPage(vdw, wdt) {
                    __reloadPageViewer = vdw.reloadPage;
                    return __reloadPageWrapper;
                }
            }
        };
    }

    function __attachOverridedApi(viewer) {
        var linkedApi = __getApiToOverride();
        __replaceApi(linkedApi.viewer, viewer, _self, _state.viewer.api);
        __replaceApi(linkedApi.thumb, _self, viewer, _state.selfapi);
    }

    function __detachOverridedApi(viewer) {
        var viewerapi = __extractObjectPropertyKeys(_state.viewer.api);
        __replaceApi(viewerapi, viewer, _state.viewer.api, {});

        var thumbapi = __extractObjectPropertyKeys(_state.selfapi);
        __replaceApi(thumbapi, _self, _state.selfapi, {});
    }

    function __replaceApi(linkDescription, target, source, targetApiCache) {
        for (var key in linkDescription) {
            if (linkDescription.hasOwnProperty(key)) {
                if (target.hasOwnProperty(key) && target[key]) {
                    targetApiCache[key] = target[key];
                }

                if (typeof linkDescription[key] === "function") {
                    target[key] = linkDescription[key](target, source);
                } else if (source.hasOwnProperty(key) && source[key]) {
                    target[key] = source[key];
                }
            }
        }
    }

    function __extractObjectPropertyKeys(obj) {
        var result = {};
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                result[key] = null;
            }
        }
        return result;
    }

    // overrides and removes public functions that are no longer useful
    function __overridePublic() {
        // save the original functions so we can use them
        __emptyBase = _self.empty;
        __disposeBase = _self.dispose;
        __openUrlBase = _self.openUrl;
        __getCurrentPageIndex = _self.getCurrentPageIndex;
        __getDebugInfoBase = _self.__getDebugInfo;
        __scrollNextThumb = _self.next;
        __scrollPreviousThumb = _self.previous;
        __scrollToThumb = _self.showPage;

        // overwrite the originals 
        _self.empty = __emptyAsync;
        _self.dispose = __dispose;
        _self.openUrl = _self.OpenUrl = __openUrlAsync;
        _self.__getDebugInfo = __getDebugInfo;

        // add a public function for scrolling to a thumbnail
        _self.scrollToThumb = __scrollToThumb;

        // pinch zoom uses the zoom function, so to disable it we use an empty function
        _self.zoom = _self.zoomIn = _self.zoomOut = function () {};
        __reloadPageBase = _self.reloadPage;
        _self.reloadPage = __reloadPageWrapper;

        // linking fit doesn't really make sense in this context, so we remove it		
        delete _self.fit;
        $.extend(_self.events, _events);
    }

    // tag: string representing the type of tag
    // p: jQuery parent object to append div to 
    // did: string representing the id of the div
    // ihtml: string representing the inner html
    function __createDOM(tag, p, did, ihtml) {}
    // intentionally left blank, this gets assigned by the base WDV __createDOM


    // p: jQuery parent object to append div to 
    // did: string representing the id of the div
    // ihtml: string representing the inner html
    function __createDiv(p, did, ihtml) {
        // intentionally left blank, this gets assigned by the base WDV __createDiv
    }

    function __getCurrentPageIndex() {
        // intentionally left blank, this gets assigned to the base WDV getCurrentPageIndex
    }

    function __getDebugInfoBase() {
        // intentionally left blank, this gets assigned to the base WDV __getDebugInfo
    }

    function __getDebugInfo() {
        if (_config.debug) {
            var info = __getDebugInfoBase();
            var cin = __getSelectedPagesIndices();
            $.extend(true, info, {
                thumbnailer: {
                    config: _config,
                    index: cin[0],
                    indices: cin,
                    links: {
                        viewer: _viewerLink,
                        self: _thumbLink
                    },
                    page: _page,
                    thumb: _thumb,
                    state: _state
                }
            });

            return info;
        }

        return null;
    }

    function __getSelectedPagesIndicesBase() {}
    // intentionally left blank, this gets assigned to the base WDV __rotateHandlerImplBase


    /**
    * Scrolls the viewer to the given page number and executes the callback when finished
    * @function Atalasoft.Controls.WebDocumentThumbnailer#scrollToThumb
    * @param {number} index - Index of the page to scroll to.
    * @param {NotificationCallback} [callback] - Function to execute after this operation is done.
    */
    function __scrollToThumb() {
        // intentionally left blank, this gets assigned to the base WDV showPage
    }

    function __scrollPreviousThumb() {
        // intentionally left blank, this gets assigned to the base WDV previous
    }

    function __scrollNextThumb() {}
    // intentionally left blank, this gets assigned to the base WDV next


    // #endregion

    // #region Public methods

    _self.getSelectedPageIndex = __getSelectedPageIndex;
    _self.getSelectedPagesIndices = __getSelectedPagesIndices;
    _self.selectThumb = __selectThumb;
    _self.deselectThumb = __deselectThumb;

    _self.isActive = __isControllingViewer;
    _self.activate = __activate;

    /**
     * @summary Gets the selected thumbnail index.
     * @description Gets the selected thumbnail index when Web Document Thumbnailer (WDT) setup to use singleselect. When WDT setup to use multiselect, then this method returns the first element of the selected page indices, with respect of {@link WebDocumentViewerConfig.selecteditemsorder| selecteditemsorder} parameter value.
     * @function Atalasoft.Controls.WebDocumentThumbnailer#getSelectedPageIndex
     * @returns {number}
     */
    function __getSelectedPageIndex() {
        return __getSelectedPagesIndices()[0];
    }

    /**
     * @summary Gets the selected thumbnails indices.
     * @description Gets the selected thumbnails indices with respect of {@link WebDocumentViewerConfig.selecteditemsorder| selecteditemsorder} parameter value.
     * @function Atalasoft.Controls.WebDocumentThumbnailer#getSelectedPagesIndices
     * @returns {number[]}
     */
    function __getSelectedPagesIndices() {
        var selectedPages = _cin.slice(0);

        if (_config.selecteditemsorder === _selectionOrder.ItemIndexOrder) selectedPages.sort(function (a, b) {
            return a - b;
        });

        return selectedPages;
    }

    function __emptyAsync(callback) {
        var requests = 1;

        // nested callback function so we don't have to store given callback
        var requestCompleted = function requestCompleted() {
            requests--;

            if (requests <= 0) {
                if (__isControllingViewer() && _stateManager && _viewer) {
                    __activateViewer(_viewer, true);
                }

                // only execute the callback if it exists
                if (typeof callback === 'function') {
                    callback.call();
                }
            }
        };

        // unloads the document in the attached viewer
        if (__isControllingViewer()) {
            if (_stateManager) _stateManager.closeDocument(__getStateManagerApi(), _thumbLink);else if (_viewer.isReady()) {
                requests++;
                _viewer.empty(requestCompleted);
            }
        }

        // unloads the document from the base control thumbs inherit from
        __emptyBase(requestCompleted);
    }

    function __emptyBase(callback) {
        // intentionally left blank, this function gets overridden
    }

    function __dispose() {
        if (__isControllingViewer()) {
            if (_stateManager) {
                _stateManager.closeDocument(__getStateManagerApi(), _thumbLink);
            } else {
                _viewer.empty();
            }

            __detachViewer();
        }

        __disposeBase();
        _viewer = null;
        _viewerLink = null;
    }

    function __disposeBase() {
        // intentionally left blank, this function gets overridden
    }

    function __openUrlAsync(surl, aurl, furl, callback) {
        // don't want events to fire on objects that are getting recycled
        __unbindPageEvents();

        if (callback == null) {
            if (typeof aurl === 'function') {
                callback = aurl;
                aurl = null;
            } else if (typeof furl === 'function') {
                callback = furl;
                furl = null;
            }
        }

        // nested callback function so we don't have to store given callback
        var requestCompleted = function requestCompleted(error) {
            __openUrlCallback();
            __onThumbsLoaded(error, callback);
        };

        if (typeof surl === 'string') {
            _stateManager.closeDocument(__getStateManagerApi(), _thumbLink);
            _state.viewer.pagenumber = 0;
        }
        // open in the thumbs first, and we'll skim the data for the viewer
        __openUrlBase(surl, aurl, furl, requestCompleted);
    }

    function __openUrlBase(surl, aurl, furl, callback) {
        // intentionally left blank, this function gets overridden
    }

    function __openUrlCallback() {
        _self.scrollTo(0, 0, false);
    }

    function repaintSelectionState(isControllingViewer) {
        if (_state.base) {
            if (_cin.length === 0) {
                _cin.push(0);
            }

            for (var i = 0; i < _state.base.dom.pageDivs.length; i++) {
                var jqoPrev = i > 0 ? _state.base.dom.pageDivs[i - 1] : null;
                var jqo = _state.base.dom.pageDivs[i];
                var select = false;
                if (_cin.indexOf(jqo._index) > -1 && isControllingViewer) {
                    jqo.removeClass('atala_groupped_selection');
                    jqo.addClass(_self.domclasses.atala_active_thumb);

                    if (jqoPrev !== null && _cin.indexOf(jqoPrev._index) > -1) {
                        jqo.addClass('atala_groupped_selection');
                        jqoPrev.addClass('atala_groupped_selection');
                    }

                    select = true;
                } else {
                    jqo.removeClass(_self.domclasses.atala_active_thumb);
                    jqo.removeClass('atala_groupped_selection');
                }

                __repaintThumbSelect(jqo, select);
            }
        }
    }

    /** 
     * Highlights the thumbnail at the given index, and scrolls to it in the linked viewer, if possible.
     * @param {number|string} index - Index of the page to select. Can be passed as string representation of a number
     * @param {boolean} [append] - Append index to the already selected thumbs or not. Its value ignores in single select mode.
     * @function Atalasoft.Controls.WebDocumentThumbnailer#selectThumb
     */
    function __selectThumb(index, append) {
        index = Atalasoft.Utils.ParseInt(index);
        if (index === null || index < 0 || index >= _self.getDocumentInfo().count) return;

        if (typeof append !== 'undefined' && typeof append !== 'boolean' && append !== null) return;

        append = !!append && _config.selectionmode !== _selectionMode.SingleSelect;

        if (append) {
            if (_cin.indexOf(index) > -1) return;

            _cin.push(index);
        } else {
            __getSelectedPagesIndices().forEach(function (pageIdx) {
                _self.trigger({
                    type: 'thumbdeselected',
                    index: pageIdx
                });
            });

            _cin.length = 0;
            _cin.push(index);
        }

        __updateUIOnSelectOrDeselectThumb();

        _self.trigger({
            type: 'thumbselected',
            index: index
        });
    }

    /** 
     * Resets the thumbnail highlight at the given index, and scrolls to the next selected thumbnail in the linked viewer, if possible.
     *
     * This function does't deselect the given index in the single select mode, and in multi select mode, if one page is selected.
     * @param {number|string} index - Index of the page to deselect. Can be passed as string representation of a number
     * @function Atalasoft.Controls.WebDocumentThumbnailer#deselectThumb
     */
    function __deselectThumb(index) {
        index = Atalasoft.Utils.ParseInt(index);
        if (index === null) return;

        var idx = _cin.indexOf(index);

        if (idx === -1 || _cin.length === 1) return;

        _cin.splice(idx, 1);

        __updateUIOnSelectOrDeselectThumb();

        _self.trigger({
            type: 'thumbdeselected',
            index: index
        });
    }

    function __updateUIOnSelectOrDeselectThumb() {

        var cin = __getSelectedPagesIndices();

        if (_stateManager) {
            _state.viewer.pagenumber = cin[0];
            __activateViewer(_viewer);
        } else {
            repaintSelectionState(true);
        }

        // TODO: scroll to the selected thumb
        // let scrollBy = __needsToScrollBy(_cin);
        // _self.scrollBy(null, scrollBy * (_thumb.divsize + _config.pagespacing), true);

        // Do not perform any viewer scrolling in case when several thumbnails selected.
        if (_cin.length > 1) return;

        //if (!_state.scrolling) {
        if (_viewer) {
            var vpin = _viewer.getCurrentPageIndex();
            var cpin = cin[0];
            if (vpin >= 0 && cpin !== vpin) {
                _state.scrolling = true;

                if (cpin === vpin - 1) {
                    _viewer.previous(1);
                } else if (cpin === vpin + 1) {
                    _viewer.next(1);
                } else {
                    _viewer.showPage(cpin);
                }
            }
        }
        //}
    }

    // #endregion

    // #region linked viewer override

    /**
     * Reloads the specified page. If the thumbnailer is linked with viewer, viewer page is reloaded and callback is called when both viewer and thumbnailer completely reloaded, including image data itself.
     *
     * Viewer page won't be reloaded if the viewer is currently controller by other thumbnailer and requested page was not loaded in viewer before. In such case page will be lazy-loaded as usual. If special parameters should be passed, {@link Atalasoft.Controls.WebDocumentViewer#event:beforehandlerrequest| beforehandlerrequest} event to modify request parameters.
     * @param {number} index - The index of the page to reload.
     * @param {string|boolean} [annotations=false] - Url of the annotation xmp file or flag indicating whether to reload annotations of boolean flag indicating whether to load annotations data.
     * @param {string|boolean} [forms] - Url of the form file or flag indicating whether to reload forms of boolean flag indicating whether to load forms data.
     * @param {object} [params] - A plain object containing optional reload parameters that will be passed to server.
     * @param {NotificationCallback} [callback] - function that is called when page have been loaded.
     *
     * This object will be available on the server side hander as an key-values collection. This allows to pass specific load options for individual pages.
     * @function Atalasoft.Controls.WebDocumentViewer#reloadPage
     */
    function __reloadPageWrapper(index, annotations, forms, params, callback) {
        if (__reloadPageBase) {
            var thumbargs = Array.prototype.slice.call(arguments);
            // if function is called with callback parameter, remove this callback from thumbnail reload and pass to call after viewer complete.
            if (_viewer && _viewer.isReady()) {
                if (__isControllingViewer()) {
                    var viewerArgs = Array.prototype.slice.call(thumbargs);
                    callback = thumbargs.pop();
                    if (typeof callback !== "function") {
                        thumbargs = Array.prototype.slice.call(viewerArgs);
                    }
                    __reloadPageBase.apply(this, thumbargs).then(function () {
                        if (__reloadPageViewer) {
                            __reloadPageViewer.apply(this, viewerArgs);
                        }
                    });
                } else {
                    __reloadPageBase.apply(this, arguments);
                    // document controller contains shared pages state, even thought viewer is not under our control.
                    //let viewerPageDefintion = _state.base.controllers.document.getPageDefinition(index, _viewerLink._id);
                    //_viewerLink.__silentReloadPage(viewerPageDefintion, params);
                }
            } else {
                __reloadPageBase.apply(this, arguments);
            }
        }
    }

    // #endregion

    // #region Thumb Drawing

    function __preparePageDivs() {
        if (_state.base) {
            if (_state.initialized && _state.base.dom.pageDivs.length > 0 && _state.base.dom.pageDivs[0]._img != null && !_state.base.dom.pageDivs[0]._img._size.isEmpty()) {
                var size = _state.base.dom.pageDivs[0]._img._size;
                if (size.width > size.height) {
                    //size to the width
                    _thumb.scale = _thumb.size / size.width;
                } else {
                    //size to the height
                    _thumb.scale = _thumb.size / size.height;
                }
            } else {
                var portrait = _state.base.page.size.width / _state.base.page.size.height < 1;
                var imgHeight = Math.ceil(_state.base.page.size.height * _state.base.config.zoom);
                var imgWidth = Math.ceil(_state.base.page.size.width * _state.base.config.zoom);
                var thumbsize = _thumb.size;

                if (_config.direction === _direction.Vertical) {
                    _thumb.divsize = Math.ceil(_state.base.page.size.width * _state.base.config.zoom);
                } else if (_config.direction === _direction.Horizontal) {
                    _thumb.divsize = Math.ceil(_state.base.page.size.height * _state.base.config.zoom);
                }

                thumbsize = thumbsize <= 0 ? _thumb.divsize - _config.thumbpadding * 2 : thumbsize;
                __setThumbSize(thumbsize);

                if (_config.tabular) {
                    if (_config.columns > 1 && _config.direction === _direction.Vertical) {
                        // size available area to allow for number of columns
                        __fitContentToGrid();
                    }
                }
                var imgSide = portrait ? imgHeight : imgWidth;
                _thumb.scale = imgSide ? _state.base.config.zoom * (_thumb.size / imgSide) : 1;
                _thumb.zoomfull = _thumb.scale;

                if (_config.minwidth > _state.base.page.size.width * _thumb.scale && _state.base.page.size.width) {
                    _config.minwidth = _state.base.page.size.width * _thumb.scale;
                }

                _state.initialized = true;
            }

            var bSize = _config.showpageborder ? _config.pageborderwidth * 2 : 0;
            var pagedivsize = _thumb.size + _config.thumbpadding * 2 - bSize;
            _self.trigger({
                type: 'pagedivsresized',
                height: pagedivsize,
                width: pagedivsize,
                fullzoom: _thumb.zoomfull,
                minwidth: _config.minwidth
            });

            if (_config.allowdragdrop) {
                _state.base.dom.content.addClass(_self.domclasses.atala_thumb_draggable);
                _state.base.dom.content.css({
                    minWidth: pagedivsize,
                    minHeight: pagedivsize
                });

                var halfSize = Math.round(_thumb.size / 2);
                _state.base.dom.content.sortable({
                    containment: 'window',
                    connectWith: '.' + _self.domclasses.atala_thumb_draggable,
                    appendTo: document.body,
                    placeholder: _self.domclasses.atala_drag_placeholder,
                    cursorAt: { left: halfSize, top: halfSize },
                    delay: _config.dragdelay,
                    distance: 4,
                    helper: __thumbDragHelperFactory,
                    opacity: 0.65,
                    scroll: true,
                    scrollSensitivity: halfSize,
                    scrollSpeed: 10,
                    start: __onThumbDragStart,
                    receive: __onThumbExternalReceive,
                    stop: __onThumbDragEnd,
                    over: __onThumbDragOver,
                    change: __onThumbDragChange,
                    tolerance: 'pointer',
                    update: __onThumbsReordered,
                    zIndex: 100
                });
            }

            $.each(_state.base.dom.pageDivs, function (i, jqo) {
                jqo.width(_thumb.size);
                jqo.height(_thumb.size); // thumbs are square

                if (!jqo.thumbInitialized) {
                    jqo.bind(_thumbEvents);
                    jqo.css({
                        'padding': _config.thumbpadding,
                        'background-color': _config.backcolor,
                        'cursor': 'pointer',
                        'margin-bottom': _config.pagespacing + 'px',
                        'text-align': 'center',
                        'position': 'relative' // added to stop child divs from expanding outside this one
                    });

                    if (_config.tabular) {
                        jqo.css({
                            'margin-right': _config.pagespacing + 'px'
                        });
                    } else if (_config.direction === _direction.Horizontal) {
                        jqo.css({
                            'margin-right': _config.pagespacing + 'px',
                            'margin-bottom': '0px'
                        });
                    }

                    // for some reason Raphael uses 0px in IE only
                    if (jqo._paper && Atalasoft.Utils.Browser.Explorer) {
                        jqo._paper.canvas.style.top = '';
                        jqo._paper.canvas.style.width = '';
                        jqo._paper.canvas.style.height = '';
                    }

                    if (jqo._grips) {
                        jqo._grips.push = function () {}; // disables grips by disallowing addition of annos
                    }

                    jqo.thumbInitialized = true;
                }

                __scaleThumb(jqo._img, jqo._paper);
            });

            if (_state.base.dom.pageDivs.length > 0) {
                _thumbLink.__adjustEdgeHeights(_state.base.dom.pageDivs[0]._index);
            }
        }
    }

    function __scaleThumb(img, paper, zoom, imgSize) {
        if (_state.base) {
            var sSize = imgSize || img && img.getScaledSize(zoom);
            if (!sSize) {
                return;
            }

            var sWidth = sSize.width;
            var sHeight = sSize.height;
            var thumbsize = _thumb.size * (_state.base.config.zoom / _thumb.zoomfull);

            if (sWidth > thumbsize || sHeight > thumbsize) {
                var portrait = sWidth / sHeight < 1;
                var nz = zoom * (thumbsize / (portrait ? sHeight : sWidth));
                sWidth = Math.round(img._size.width * nz);
                sHeight = Math.round(img._size.height * nz);
                zoom = nz;
            }

            img.width(sWidth);
            img.height(sHeight);
            var el = img.getDomElement();
            el[0].style.left = '50%';
            el[0].style.top = '50%';
            el[0].style.position = 'absolute';
            el[0].style.marginLeft = -Math.round(sWidth / 2) + 'px';
            el[0].style.marginTop = -Math.round(sHeight / 2) + 'px';

            // paper is a VML or SVG DOM object, and in some cases doesn't like to be centered
            if (paper) {
                paper.canvas.style.left = '50%';
                paper.canvas.style.top = '50%';
                paper.canvas.style.marginLeft = -Math.round(sWidth / 2) + 'px';
                paper.canvas.style.marginTop = -Math.round(sHeight / 2) + 'px';
                paper.canvas.style.zIndex = 1;
            }

            // need to tell the anno controller that the page dimensions changed
            img.trigger({
                type: 'pagezoom',
                index: img._page._index,
                height: Math.round(sHeight),
                width: Math.round(sWidth),
                prevzoom: _state.base.config.zoom,
                zoom: zoom
            });
        }
    }

    function __changeThumbColor(jqo, scolor, bcolor) {
        var col = jqo.data('selected') ? scolor : bcolor;

        jqo.css('background-color', col);
    }

    function __repaintThumbSelect(thumb, selected) {
        var col = selected ? _config.selectedcolor : _config.backcolor;

        thumb.data('selected', selected);
        thumb.css('background-color', col);
    }

    // #endregion

    // #region Drag Drop

    // thin wrapper on top of JQuery object instance to allow  
    // changing actual underlying instance while wrapper reference is the same
    function __JQueryObjectWrapper(initialParent) {
        var me = this;
        this._initial = initialParent;
        this._actual = initialParent;

        this.scrollTop = function () {
            me._actual.scrollTop();
        };

        this.scrollLeft = function () {
            me._actual.scrollTop();
        };

        this.setObject = function (parent) {
            me._actual = parent;
            this[0] = me._actual[0];
        };

        this.offset = function () {
            return me._actual.offset();
        };

        this.setObject(initialParent);
    }

    function __getDraggedPageDivs(ui) {
        var result = [];

        if (!ui.hasClass(_self.domclasses.atala_active_thumb) || !__isControllingViewer()) {
            result.push(ui);
        } else {
            __getSelectedPagesIndices().forEach(function (pageIdx) {
                for (var i = 0; i < _state.base.dom.pageDivs.length; i++) {
                    if (_state.base.dom.pageDivs[i]._index === pageIdx) {
                        result.push(_state.base.dom.pageDivs[i]);
                        break;
                    }
                }
            });
        }

        return result;
    }

    function __thumbDragHelperFactory(e, ui) {
        //Hack to append the element to the body (visible above others divs), 
        //but still belong to the scrollable container after method call complete, for correct widget initialization.
        _state.dragdropping = true;
        repaintSelectionState(__isControllingViewer());
        var clone = $('<div class="atala_drag_helper"></div>');
        var draggedItems = __getDraggedPageDivs(ui);

        //Prevent user's possibility to perform drop between sequentially selected pages
        if (draggedItems.length > 1) {
            $(this).sortable('option', 'items', '> *:not(.' + 'atala_groupped_selection' + ')');
            $(this).sortable('refresh');
        }

        var stackSize = ui.hasClass(_self.domclasses.atala_active_thumb) && __isControllingViewer() ? Math.min(3, __getSelectedPagesIndices().length) : 1;
        for (var i = 0; i < draggedItems.length || i < stackSize; i++) {
            var draggedItem = i < draggedItems.length ? draggedItems[i] : draggedItems[0];
            if (i < stackSize) {
                var imageAnchor = draggedItem.find('.' + _self.domclasses.atala_page_image_anchor).first().clone();
                imageAnchor.css({
                    "position": "absolute",
                    "left": 10 * i + 'px',
                    "top": -10 * i + 'px',
                    "right": "0px",
                    "bottom": "0px",
                    "margin": "",
                    "z-index": -i
                });

                clone.append(imageAnchor);
            }
        }

        _state.base.dom.content.append(clone);

        var initialParent = clone.scrollParent();
        // starting from jquery-ui 1.9 widget instance key formate was changed - http://jqueryui.com/upgrade-guide/1.9/#changed-naming-convention-for-data-keys 
        var widgetInstance = _state.base.dom.content.data(sortableWidgetFullName) || _state.base.dom.content.data(sortableWidgetDeprecatedName);
        clone.hide();
        setTimeout(function () {
            if (widgetInstance) {
                widgetInstance.scrollParent = new __JQueryObjectWrapper(initialParent);
                draggedItems.forEach(function (item) {
                    item.data(draggableScrollParentWrapperKey, widgetInstance.scrollParent);
                });
            }
            clone.appendTo('body');
            clone.show();
        }, 1);
        return clone;
    }

    function __onThumbDragStart(e, ui) {
        var pageIndices = __findPagesIndices(ui.item);
        if (pageIndices !== null) {

            var pageRefs = [];
            pageIndices.forEach(function (idx) {
                pageRefs.push(_self.document.getPageReference(idx));
            });

            var dragData = {
                start: pageIndices,
                end: pageIndices[0],
                updateHandled: false,
                pageRefs: pageRefs,
                documenturl: _typeof(pageRefs[0]) === "object" && pageRefs[0].uri ? pageRefs[0].uri : _state.base.config.documenturl,
                thumbLink: _thumbLink,
                thumb: _self,
                thumbId: _thumbLink._id,
                viewerId: _viewerLink._id,
                state: _state,
                externalDropIndex: null,
                insertAfterSelf: false
            };

            ui.item.data(dragdataKey, dragData);
            _state.base.controllers.mouseTool.pauseTool();

            ui.placeholder.width(ui.item.width());
            ui.placeholder.height(ui.item.height());
            ui.placeholder.css({
                'margin': ui.item.css('margin'),
                'display': _state.base.config.tabular || _state.base.config.direction === _direction.Horizontal ? 'inline-block' : 'block',
                padding: Math.max(0, _state.base.config.thumbpadding - 1)
            });

            _self.trigger({
                type: 'thumbdragstart',
                dragindex: dragData.start[0],
                dragindices: dragData.start
            });
        }
    }

    function __onThumbDragOver(e, ui) {
        // on mobile browsers we don't show scrollbars and not doing drag-scroll
        if (!Atalasoft.Utils.Browser.Mobile.Any()) {
            var content = ui.placeholder.parents('.' + _self.domclasses.atala_scroller);
            var scrollableWraper = ui.item.data(draggableScrollParentWrapperKey);
            if (content.length && scrollableWraper && scrollableWraper[0] !== content.first()[0]) {
                // change the jquery UI scrollable object, to make it scroll WDT that we are dragging over now
                scrollableWraper.setObject(content.first());
            }
        }
    }

    function __onThumbDragChange(e, ui) {
        var dragData = ui.item.data(dragdataKey);
        if (dragData) {
            var placeholderPredecessor = ui.placeholder.prev();
            // when we start drag and drop on the same document, ui.item is the reference to one of pageDivs, which could 
            // have unpredictable position and page content because of recycling divs on scroll.
            // when dropping jquery-ui sets ui.item before drop placeholder. but if we dropping right after div corresponding ui.item,
            // there will be no ui.item reposition - thus, user saw that he drop page after PageN, but since PageN was same div as jquery thought we drag,
            // our code can't distinguish whether user dropped after PageN or jquery already moved ui.item after PageN, i.e. we cant determine drop index
            dragData.insertAfterSelf = placeholderPredecessor.length && ui.item[0] === placeholderPredecessor.first()[0];
        }
    }

    function __onThumbDragEnd(e, ui) {
        var dragData = ui.item.data(dragdataKey);

        var dropZone = {
            left: _config.parent.offset().left,
            right: _config.parent.offset().left + _config.parent.width(),
            top: _config.parent.offset().top,
            bottom: _config.parent.offset().top + _config.parent.height()
        };
        var itemPositionCenter = {
            x: ui.position.left + ui.item.width() / 2,
            y: ui.position.top + ui.item.height() / 2
        };
        var droppedInside = dropZone.left < itemPositionCenter.x && dropZone.right > itemPositionCenter.x && dropZone.top < itemPositionCenter.y && dropZone.bottom > itemPositionCenter.y;

        if (dragData && droppedInside) {
            // no data, rollback operation? shouldn't happen
            _state.base.controllers.mouseTool.resumeTool();

            if (!dragData.updateHandled) {
                dragData.end = __getDropIndex(ui);
                dragData.updateHandled = true;
            }

            if (dragData.insertAfterSelf) {
                // see comment on __onThumbDragChange
                ++dragData.end;
            }

            // controllers.document.movePage will shift indexes down by removing page at sourceIndex first. need to adjust to that change.
            dragData.end = dragData.start[0] < dragData.end ? dragData.end - 1 : dragData.end;

            var eventArgs = {
                type: 'thumbdragend',
                dragindex: dragData.start[0],
                dragindices: dragData.start,
                dropindex: dragData.end,
                source: dragData.thumb,
                sourcedocument: dragData.documenturl,
                target: _self,
                external: false,
                pageref: dragData.pageRefs[0],
                pagerefs: dragData.pageRefs,
                cancel: false
            };

            _self.trigger(eventArgs, eventArgs);
            if (!eventArgs.cancel) {
                if (_viewerLink && __isControllingViewer() && _viewer.isReady()) {
                    _viewerLink._controllers.document.movePages(dragData.start, dragData.end);
                } else {
                    _state.base.controllers.document.movePages(dragData.start, dragData.end);
                }

                __ensureDragCompleteUI();
                _cin.length = 0;
                if (_cinDragDropTemp.length > 0) {
                    _cinDragDropTemp.sort(function (a, b) {
                        return a - b;
                    }).forEach(function (idx) {
                        __selectThumb(idx, true);
                    });
                    _cinDragDropTemp.length = 0;
                } else {
                    __selectThumb(dragData.end, false);
                }

                eventArgs = {
                    type: 'thumbdragcomplete',
                    dragindex: dragData.start[0],
                    dragindices: dragData.start,
                    dropindex: dragData.end,
                    source: dragData.thumb,
                    target: _self
                };
                _state.dragdropping = false;
                _self.trigger(eventArgs, eventArgs);
            } else {
                // cancel here conditionally only if drag data is set, since stop event is still triggered even if receive were cancelled.
                // if we cancel one more time, page placeholder will be restored once again in _state.base.dom.content, although all dom changes were already done explicitly
                $(this).sortable('cancel');
            }
        } else if (dragData && !droppedInside) {
            $(this).sortable('cancel');
        }

        //Reset filter for further D&D operations.
        $(this).sortable('option', 'items', '> *');
        $(this).sortable('refresh');

        ui.item.data(dragdataKey, null);
    }

    function __onThumbExternalReceive(e, ui) {
        $(ui.sender).sortable('cancel');
        var dragData = ui.item.data(dragdataKey);
        if (dragData) {
            dragData.thumbLink._controllers.mouseTool.resumeTool();

            var startDivIndex = _state.base.dom.pageDivs.length ? _state.base.dom.pageDivs[0]._index : 0;
            dragData.end = dragData.externalDropIndex + startDivIndex || 0;
            var eventArgs = {
                type: 'thumbdragend',
                dragindex: dragData.start[0],
                dragindices: dragData.start,
                dropindex: dragData.end,
                source: dragData.thumb,
                sourcedocument: dragData.documenturl,
                target: _self,
                pageref: dragData.pageRefs[0],
                pagerefs: dragData.pageRefs,
                external: true,
                cancel: false,
                copyannotations: true
            };

            _self.trigger(eventArgs.type, eventArgs);

            if (!eventArgs.cancel) {
                var annotations = [];
                if (eventArgs.copyannotations && dragData.thumb.config.allowannotations && _self.config.allowannotations) {
                    dragData.start.forEach(function (idx) {
                        annotations.push(dragData.thumb.annotations.getFromPage(idx));
                    });
                }

                dragData.thumb.selectThumb(dragData.thumb.getCurrentPageIndex(), false);

                if (_viewer) {
                    __activateViewer(_viewer, true); // need to forcibly reload viewer even if we own it.
                }

                _state.scrolling = true;
                dragData.thumb.document.removePages(dragData.start);
                _self.document.insertPages(null, dragData.pageRefs, dragData.end);

                __ensureDragCompleteUI();

                _cin.length = 0;
                __onViewerDocumentChanged(function () {
                    __onViewerScrolled();
                    dragData.start.forEach(function (startNum, idx) {
                        __selectThumb(dragData.end + idx, true);
                    });
                });

                annotations.forEach(function (annos, idx) {
                    if (annos) {
                        for (var i = 0; i < annos.length; i++) {
                            _self.annotations.createOnPage(annos[i], dragData.end + idx);
                        }
                    }
                });

                _self.trigger('thumbdragcomplete', {
                    type: 'thumbdragcomplete',
                    dragindex: dragData.start[0],
                    dragindices: dragData.start,
                    dropindex: dragData.end,
                    source: dragData.thumb,
                    target: _self
                });
                _state.dragdropping = false;
                dragData.state.dragdropping = false;
            }
        }

        ui.item.data(dragdataKey, null);
    }

    function __onThumbsReordered(e, ui) {
        var dragData = ui.item.data(dragdataKey);
        if (dragData) {
            // this event fires BEFORE thumbdragend, so we need to set this here. 
            if (_state.base.dom.content.has(ui.item).length) {
                // when we are dropped in the same document as drag started, pageDivs is available for us and we can exactly find out where we were dropped. 
                dragData.end = __getDropIndex(ui);
                if (dragData.thumbId === _thumbLink._id) {
                    _self.trigger({
                        type: 'thumbsreordered',
                        dragindex: dragData.start[0],
                        dragindices: dragData.start,
                        dropindex: dragData.end
                    });
                }
            } else {
                // only get insert index in the DOM, since we are called in the context of source WDT and don't have internal state.
                dragData.externalDropIndex = ui.item.index();
            }

            dragData.updateHandled = true;
        }
    }

    function __getDropIndex(dragState) {
        var preDropPage = -1;
        var divBeforeDrop = dragState.item.prev().length ? dragState.item.prev().first() : [null];
        for (var i = 0; i < _state.base.dom.pageDivs.length; ++i) {
            if (_state.base.dom.pageDivs[i][0] === divBeforeDrop[0]) {
                preDropPage = _state.base.dom.pageDivs[i]._index;
                break;
            }
        }

        return preDropPage + 1;
    }

    function __ensureDragCompleteUI() {
        var scroller = _state.base.dom.scroller[0];
        // if bottom edge is in viewport
        if (_thumbLink.__isObjectInRect(_state.base.dom.edges[1][0], scroller, scroller.scrollLeft, scroller.scrollTop, scroller.scrollLeft + scroller.clientWidth, scroller.scrollTop + scroller.clientHeight)) {
            // during drag-drop jquery UI inserts page placeholder into dom.content. When drag causes scroll, and original page div is recycled
            // because of additional div inserted, our code will incorrectly calculate recycling pages in virtual scrolling.
            // when drag ends, jquery UI will remove drag-placeholder and bottom edge will brought into view. so we'll need to adjust edges.
            var firstPage = _state.base.dom.pageDivs[0]._index;
            var firstVisiblePage = _thumbLink.__getIndexFromPos(scroller.scrollLeft, scroller.scrollTop);
            var delta = firstVisiblePage - firstPage;
            if (delta < _state.base.dom.pageDivs.length && delta > 0) {
                _thumbLink.__showNext(delta);
            } else {
                _thumbLink.__showPageAsync(firstVisiblePage, false);
                _thumbLink.__redrawVisiblePages();
            }
        }
    }

    // #endregion

    // #region Helper Functions

    // copy json data objects to new array
    function __copyJsonDataToArray(data, itemkey) {
        var mainArr = [];

        // makes a new array of direct object data references for easy updates
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                var arr = [];
                var obj = itemkey ? {} : arr;

                if (itemkey) {
                    obj[itemkey] = arr;
                }

                for (var z in data[key]) {
                    if (data[key].hasOwnProperty(z)) {
                        arr[z] = data[key][z].get();
                        arr[z].multiview = true;
                    }
                }

                mainArr[key] = obj;
            }
        }

        return mainArr;
    }

    // jqdiv: jquery object representing div tag match
    function __findPagesIndices(jqdiv) {
        if (jqdiv.hasClass(_self.domclasses.atala_active_thumb) && __isControllingViewer()) return __getSelectedPagesIndices();

        for (var n = 0; n < _state.base.dom.pageDivs.length; n++) {
            if (_state.base.dom.pageDivs[n][0] === jqdiv[0]) {
                return [_state.base.dom.pageDivs[n]._index];
            }
        }

        return null;
    }

    function __fitContentToGrid() {
        if (_config.tabular) {
            var width = void 0;

            if (_config.columns > 1) {
                width = (_thumb.size + _config.thumbpadding * 2 + _config.pagespacing) * Math.min(_state.base.controllers.document.getPageCount(), _config.columns);
            } else if (_config.rows > 1) {
                var cols = Math.ceil(__getThumbCount() / _config.rows);
                width = (_thumb.size + _config.thumbpadding * 2 + _config.pagespacing) * cols;
            }

            if (width) {
                _state.base.dom.content.width(width);
            }
        }
    }

    function __getThumbCount() {
        return _state.base.controllers.document.getPageCount();
    }

    // returns a bool indicating if the thumbnail at the given index is currently in the pagedivs array
    function __isThumbShown(i) {
        for (var n = 0; n < _state.base.dom.pageDivs.length; n++) {
            if (_state.base.dom.pageDivs[n]._index === i) {
                return true;
            }
        }

        return false;
    }

    // jshint ignore:start
    function __needsToScrollBy(i) {
        var start = __getCurrentPageIndex();
        var end = start + 0;

        if (i < start) {
            return i - start;
        } else if (i > end) {
            return i - end;
        }

        return 0;
    }
    // jshint ignore:end

    // orders the page divs array based on current dom position
    function __reorderPageIndexes() {
        var first = _state.base.dom.pageDivs[0]._index;

        _state.base.dom.pageDivs.sort(function (a, b) {
            return a.index() - b.index();
        });

        for (var n = 0; n < _state.base.dom.pageDivs.length; n++) {
            var pg = _state.base.dom.pageDivs[n];
            pg._index = first + n;
            if (pg._num != null) {
                pg._num.text(pg._index + 1);
            }
        }
    }

    // provides a function for setting the size, so we can update config vars on the base control
    function __setThumbSize(size) {
        if (size <= 0) {
            _self.trigger({
                type: 'throwerror',
                name: 'Invalid thumb size',
                msg: 'Thumb size cannot be ' + size + '. Check configuration parameters \'minwidth\', \'thumbpadding\' and \'thumbsize\'. If \'thumbsize\' is not specified, then \'minwidth\' should be at least (2 * thumbpadding + 1)'
            });
        }
        _thumb.size = size;

        if (_state.base && _state.base.config.forcepagesize) {
            _state.base.config.forcepagesize.width = size;
            _state.base.config.forcepagesize.height = size;
        }
    }

    // validates (and fixes) the config so we don't have to check the inputs every time we need them
    function __validateConfig() {
        _config.allowdragdrop = _config.allowdragdrop ? true : false;
        _config.selectedindex = __validateNumber(_config.selectedindex) ? parseInt(_config.selectedindex, 10) : 0;
        _config.thumbpadding = __validateNumber(_config.thumbpadding) ? parseInt(_config.thumbpadding, 10) : 8;
        _config.backcolor = __validateColor(_config.backcolor, '#DCDCDC');
        _config.hovercolor = __validateColor(_config.hovercolor, '#667F9F');
        _config.selectedcolor = __validateColor(_config.selectedcolor, '#E0872D');
        _config.selectedhovercolor = __validateColor(_config.selectedhovercolor, '#FFC060');
    }

    // validates a css color, sets it to validDefault if it's not valid
    // color: string, CSS color to validate
    // validDefault: string, CSS color to replace the invalid color with
    function __validateColor(color, validDefault) {
        // dummy color to test with
        var dColor = {
            hex: '#FFFFFF',
            hexs: '#FFF',
            name: 'white',
            rgb: 'rgb(255, 255, 255)'
        };

        var dummy = __createDiv(null, 'dummy');
        dummy.css('backgroundColor', dColor.name);
        dummy.css('backgroundColor', color);

        if (dummy.css('backgroundColor') === dColor.rgb) {
            // color didn't change, is it white?
            color = color.toLowerCase();

            if (color !== dColor.name && color !== dColor.hex && color !== dColor.hexs && color !== dColor.rgb) {
                // color isn't white, set it to valid one
                color = validDefault;
            }
        }

        return color;
    }

    // checks a number
    // n: value to check
    // f: bool, indicates whether to check float
    function __validateNumber(n, f) {
        if (f) {
            return isFinite(parseFloat(n));
        } else {
            return isFinite(parseInt(n, 10));
        }
    }

    // #endregion

    // #region Events

    function __unbindPageEvents() {
        if (_state.base) {
            $.each(_state.base.dom.pageDivs, function (i, jqo) {
                jqo.unbind(_thumbEvents);
                jqo.thumbInitialized = false;
            });
        }
    }

    function __onViewerLoaded(e) {}

    function __onViewerDocumentChanged(e, callback) {
        if (_state.base.state.batchoperation > 0) {
            return;
        }

        if (typeof e === "function") {
            callback = e;
        }

        __preparePageDivs();

        _thumbLink.__redrawVisiblePages(true);
        _thumbLink.__adjustVisiblePages();
        if (_state.base && _viewerLink && __isControllingViewer() && _viewer.isReady()) {
            _viewerLink.__redrawVisiblePages(true);
            _viewerLink.__adjustVisiblePages(false, callback);
        } else if (typeof callback === "function") {
            callback();
        }
    }

    function __onViewerPageInserted(e) {
        if (_state.base) {
            if (_state.base.controllers.annotations) {
                _state.base.controllers.annotations.insertLayer(null, null, e.destindex);
            }

            if (_state.base.controllers.forms) {
                _state.base.controllers.forms.insertForm(null, null, e.destindex);
            }

            if (_viewerLink._state.batchoperation <= 0) {
                __onViewerDocumentChanged();
            }
        }
    }

    function __onViewerPageRemoved(e) {
        if (_state.base) {
            if (_state.base.controllers.annotations) {
                _state.base.controllers.annotations.removeLayer(e.index);
            }

            if (_state.base.controllers.forms) {
                _state.base.controllers.forms.removeForm(e.index);
            }

            if (_viewerLink._state.batchoperation <= 0) {
                __onViewerDocumentChanged();
            }
        }
    }

    function __onViewerPageMoved(e) {
        if (_state.base) {
            if (_state.base.controllers.annotations) {
                _state.base.controllers.annotations.moveLayer(e.shiftedsrcindex, e.destindex);
            }

            if (_state.base.controllers.forms) {
                _state.base.controllers.forms.moveForm(e.shiftedsrcindex, e.destindex);
            }

            __reorderPageIndexes();

            if (_viewerLink._state.batchoperation <= 0) {
                __onViewerDocumentChanged();
            }

            if (_state.dragdropping) {
                var destIdx = e.destindex;
                _cinDragDropTemp.sort(function (a, b) {
                    return b - a;
                }).forEach(function (idx) {
                    if (idx === destIdx) {
                        destIdx--;
                    }
                });

                _cinDragDropTemp.push(destIdx);
            }
        }
    }

    function __onViewerScroll(e) {
        var vpin = _viewer.getCurrentPageIndex();
        var cin = __getSelectedPagesIndices();

        if (cin.length <= 1 && cin[0] !== vpin && !_state.scrolling) {
            __selectThumb(vpin);
        }
    }

    function __onViewerScrolled(e) {
        _state.scrolling = false;
    }

    function __onViewerAnnotationCreated(e) {
        if (_state.base) {
            var layer = _viewerLink._annos[e.page] || null;
            var annData = null;

            if (layer) {
                var ann = layer[layer.length - 1];
                annData = ann.get();
            }

            //TODO: should compare all properties just to make sure 
            if (annData && annData.type === e.anno.type) {
                annData.multiview = true;
                _state.base.controllers.annotations.createAnnotation(annData, e.page);
            }
        }
    }

    function __onViewerAnnotationDeleted(e) {
        if (_state.base) {
            _state.base.controllers.annotations.deleteAnnoOnPage(e.page, e.index);
        }
    }

    function __onViewerPageRotated(e) {
        if (_state.base) {
            if (_viewerLink._state.batchoperation <= 0) {
                __onViewerDocumentChanged();
            }
        }
    }

    function __onViewerAnnotationUpdated(e) {
        if (_state.base) {
            var currentPage = __getSelectedPageIndex();
            // only need to update thumb annotations if the thumb is shown 
            if (__isThumbShown(currentPage)) {
                var thumbAnns = _state.base.controllers.annotations.getAnnosFromPage(currentPage);

                for (var i = 0; i < thumbAnns.length; i++) {
                    if (thumbAnns[i].type === e.anno.type) {
                        thumbAnns[i].update(true);
                    }
                }
            }
        }
    }

    // we override viewer requests so we can save on requests
    function __onViewerRequest(e) {
        if (e.request.type === 'docinfo' || e.request.type === 'annodata' || e.request.type === 'formdata') {
            if (_state.base) {
                e.request.cancel = true;

                if (e.request.type === 'docinfo') {
                    e.request.info.pagewidth = _page.size.width;
                    e.request.info.pageheight = _page.size.height;
                    e.request.info.pagecount = _page.count;
                    e.request.info.dpi = _page.dpi;
                    e.request.info.colordepth = _state.base.controllers.memory.colorDepth;
                    e.request.info.vector = _page.vector;
                }

                var start = e.request.info.docIndex !== undefined ? e.request.info.docIndex : e.request.info.offset || 0;
                var end = e.request.info.length > -1 ? e.request.info.length + start : undefined;

                e.request.info.offset = e.request.info.offset || 0;
                if (_config.allowannotations && (e.request.type === 'annodata' || e.request.data.atala_annurl)) {
                    var adata = _state.base.controllers.annotations.__getDebugInfo().data;
                    e.request.info.layers = __copyJsonDataToArray(adata.annos.slice(start, end), 'items');
                }

                if (_config.allowforms && (e.request.type === 'formdata' || e.request.data.atala_formurl)) {
                    var fdata = _state.base.controllers.forms.__getDebugInfo().data;
                    e.request.info.forms = {
                        fields: __copyJsonDataToArray(fdata.fields.slice(start, end))
                    };
                }

                _viewer.trigger({ type: 'handlerreturned', request: e.request });
            }
        }
    }

    function __onThumbAnnosLoaded(e) {}

    function __onThumbFormsLoaded(e) {}

    function __onThumbContextMenu(e, annData, menuCfg) {
        // delete annotation context menu options
        for (var i in menuCfg) {
            if (menuCfg.hasOwnProperty(i)) {
                delete menuCfg[i];
            }
        }
    }

    function __onDocumentLoaded() {
        _state.base = {
            config: _thumbLink._config,
            controllers: _thumbLink._controllers,
            dom: _thumbLink._dom,
            page: _thumbLink._page,
            state: _thumbLink._state,
            stateManager: _thumbLink.stateManager
        };
    }

    // this callback will be called from underlying viewer, when it's loaded.
    function __onThumbsLoaded(error, viewerCallback) {

        // turn off panning unless we're using touch
        //		if (!Atalasoft.Utils.Browser.Features.Touch){
        //			_state.base.controllers.mouseTool.setTool(_toolTypes.PassThrough, _toolTypes.PassThrough);
        //		}

        _page.size.width = _state.base.page.size.width;
        _page.size.height = _state.base.page.size.height;
        _page.count = _state.base.page.count;
        _page.dpi = _state.base.page.dpi;
        _page.vector = _state.base.page.vector;

        __preparePageDivs();

        __adjustScrollbarVisibility(_state.base.dom.scrollH);
        __adjustScrollbarVisibility(_state.base.dom.scrollV);

        var callback = function callback() {
            if (__isControllingViewer()) {
                __selectThumb(_config.selectedindex);
            }

            if (viewerCallback && typeof viewerCallback === 'function') {
                viewerCallback(error);
            }
        };

        // reset the zoom so viewer will calculate it according initial fit settings.
        _state.viewer.zoom = 0;
        if (__isControllingViewer() || _stateManager && !_stateManager.isViewerActive()) {
            __activateViewer(_viewer, true);
            callback();
        } else {
            callback();
        }
    }

    function __onThumbHoverIn(e) {
        __changeThumbColor($(this), _config.selectedhovercolor, _config.hovercolor);
    }

    function __onThumbHoverOut(e) {
        __changeThumbColor($(this), _config.selectedcolor, _config.backcolor);
    }

    function __onThumbClicked(e) {
        if (e.button !== 0) // check that left button was clicked. Ignore all others buttons
            return;

        var clicked = e.currentTarget;
        var clickedIdx = -1;

        for (var i = 0; i < _state.base.dom.pageDivs.length; i++) {
            if (_state.base.dom.pageDivs[i][0] === clicked) {
                clickedIdx = _state.base.dom.pageDivs[i]._index;
                break;
            }
        }

        if (clickedIdx === -1) return;

        if (_config.selectionmode === _selectionMode.MultiSelect) {
            var shiftPressed = e.shiftKey;
            var ctrlPressed = e.ctrlKey;

            if (shiftPressed) {
                var lastClicked = _cin[_cin.length - 1];

                if (clickedIdx < lastClicked) for (var _i = lastClicked - 1; _i >= clickedIdx; _i--) {
                    __updateThumbnailSelection(_i, true);
                } else for (var _i2 = lastClicked + 1; _i2 <= clickedIdx; _i2++) {
                    __updateThumbnailSelection(_i2, true);
                }
            } else {
                __updateThumbnailSelection(clickedIdx, ctrlPressed);
            }
        } else {
            __selectThumb(clickedIdx);
        }
    }

    function __updateThumbnailSelection(index, append) {
        append = append && __isControllingViewer();
        if (_cin.indexOf(index) !== -1 && append) __deselectThumb(index);else __selectThumb(index, append);
    }

    function __fakeMouseEvent(e, eType, eButton) {
        // Ignore multi-touch events
        if (e.originalEvent.touches.length > 1) {
            return;
        }

        e.preventDefault();

        // grab touch event
        var touch = e.originalEvent.changedTouches[0];

        // create new mouse event
        var mouse = document.createEvent('MouseEvents');

        // copy properties from touch to new mouse event
        mouse.initMouseEvent(eType, true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, eButton, null);

        // send the fake event to the target
        e.target.dispatchEvent(mouse);
    }

    function __onThumbTouchStart(e) {
        _touch.moves = 0;
        _touch.start = {
            x: NaN,
            y: NaN
        };

        if (e.originalEvent.touches && e.originalEvent.touches.length === 1) {
            var touch = e.originalEvent.touches[0];
            _touch.start.x = touch.screenX;
            _touch.start.y = touch.screenY;
        }

        __fakeMouseEvent(e, 'mouseover', 0);
        __fakeMouseEvent(e, 'mousedown', 0);
    }

    function __onThumbTouchMove(e) {
        if (e.originalEvent.touches && e.originalEvent.touches.length) {
            var touch = e.originalEvent.touches[0];
            var moveTreshold = 5;
            if (e.originalEvent.touches.length > 1 || Math.abs(_touch.start.x - touch.screenX) > moveTreshold || Math.abs(_touch.start.y - touch.screenY) > moveTreshold) {
                _touch.moves++;
            }

            __fakeMouseEvent(e, 'mousemove', 0);
        }
    }

    function __onThumbTouchEnd(e) {
        __fakeMouseEvent(e, 'mouseup', 0);
        if (_touch.moves > 0) {
            _touch.moves = 0;
        } else {
            __fakeMouseEvent(e, 'click', 0);
        }

        __fakeMouseEvent(e, 'mouseout', 0);
    }

    function __onThumbScroll(e) {
        if (_state.dragdropping) {
            repaintSelectionState(__isControllingViewer());
            _state.base.dom.content.sortable('refresh');
        }
    }

    function __onThumbShown(e) {
        if (_config.showthumbcaption) {
            if (!e.page._caption) {
                var div = $('<div/>');
                div.css({
                    left: '3%',
                    bottom: '16px',
                    width: '94%',
                    position: 'absolute',
                    zIndex: 1,
                    textAlign: 'center',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                });

                div.addClass(_self.domclasses.atala_thumb_caption);
                e.page._caption = div;
                e.page.append(div);
            }

            var title = e.page._index + 1 + '';
            if (_thumbLink._page.caption) {
                title = _thumbLink._page.caption.replace('{0}', title);
                e.page.attr('title', title);
            }

            e.page._caption.text(title);
        }

        if (e.page && e.page._img && !e.page._img._loaded) {
            __scaleThumb(e.page._img, e.page._paper);
        }

        __repaintThumbSelect(e.page, _cin.indexOf(e.page._index) > -1 && __isControllingViewer());
    }

    function __onThumbResize(e) {
        if (e.image) {
            if (e.image._loaded) {
                if (e.page) {
                    __scaleThumb(e.image, e.page._paper, _thumb.scale, { width: e.width, height: e.height });
                }
            } else {
                e.image.css({
                    position: 'absolute'
                });
            }
        }
    }

    function __onThumbsStatusMessage(e) {
        if (_viewerLink && _viewerLink.__status) {
            _viewerLink.__status(e.message);
        }
    }

    function __onThumbZoomChanged(e) {
        if (_state.base) {
            var portrait = _state.base.page.size.width / _state.base.page.size.height < 1;
            var imgHeight = Math.ceil(_state.base.page.size.height * _state.base.config.zoom);
            var imgWidth = Math.ceil(_state.base.page.size.width * _state.base.config.zoom);

            var divsize = Math.max(imgHeight, imgWidth);

            var thumbscale = _state.base.config.zoom * (divsize / (portrait ? imgHeight : imgWidth));

            _thumb.zoom = _state.base.config.zoom / _thumb.zoomfull;
            _thumb.scale = thumbscale;

            $.each(_state.base.dom.pageDivs, function (i, jqo) {
                jqo.width(divsize);
                jqo.height(divsize); // thumbs are square
            });
        }
    }

    function __onThumbZoomStarted(e) {}

    function __onThumbZoomFinished(e) {}

    function __onThumbPageSizeChanged(e) {
        if (_viewerLink && _stateManager && _viewer && _viewer.isReady()) {
            _viewerLink.__updatePageSize(e, _state.base.controllers.document, _state.base.page.size, _stateManager.isThumbnailerActive(__getStateManagerApi()));
        }
    }

    function __adjustScrollbarVisibility(scrollbar) {
        if (!scrollbar) {
            return;
        }

        // calculated size is just a little too much for fit
        if (scrollbar._scrollSize <= 0) {
            // hide the scroll tray
            scrollbar._tray.hide();
        } else {
            scrollbar._tray.show();
        }
    }

    // #endregion

    __init();

    return _self;
};