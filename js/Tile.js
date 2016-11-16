var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./Point2D"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Point2D_1 = require("./Point2D");
    var Tile = (function (_super) {
        __extends(Tile, _super);
        function Tile(position, value) {
            _super.call(this, position);
            this.value = value;
            this.value = value || 2;
            this.previousPosition = null;
            this.mergedFrom = null; // Tracks tiles that merged together
        }
        Tile.prototype.savePosition = function () {
            this.previousPosition = new Point2D_1.Point2D(this);
        };
        Tile.prototype.serialize = function () {
            return {
                position: this.position,
                value: this.value
            };
        };
        Object.defineProperty(Tile.prototype, "position", {
            get: function () {
                return {
                    x: this.x,
                    y: this.y
                };
            },
            enumerable: true,
            configurable: true
        });
        return Tile;
    }(Point2D_1.Point2D));
    exports.Tile = Tile;
});
//# sourceMappingURL=Tile.js.map