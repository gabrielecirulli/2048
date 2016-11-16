(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Point2D = (function () {
        function Point2D(x, y) {
            if (y === void 0) { y = NaN; }
            this.updatePosition(x, y);
        }
        Point2D.prototype.updatePosition = function (x, y) {
            if (y === void 0) { y = NaN; }
            if (typeof x != "number") {
                y = x.y;
                x = x.x;
            }
            this.x = x;
            this.y = y;
        };
        return Point2D;
    }());
    exports.Point2D = Point2D;
});
//# sourceMappingURL=Point2D.js.map