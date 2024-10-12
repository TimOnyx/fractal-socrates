var Coordinate = /** @class */ (function () {
    function Coordinate(x, y) {
        this.x = x;
        this.y = y;
    }
    Coordinate.prototype.hasExploded = function () {
        var _a = this, x = _a.x, y = _a.y;
        return Math.sqrt(x * x + y * y) > 2;
    };
    Coordinate.prototype.square = function () {
        var _a = this, x = _a.x, y = _a.y;
        var realPart = x * x - y * y;
        var imaginaryPart = 2 * x * y;
        return new Coordinate(realPart, imaginaryPart);
    };
    return Coordinate;
}());
var calculateWhenExploded = function (inputCoordinate) {
    var state = new Coordinate(0, 0);
    for (var index = 0; index < 100; index++) {
        var nextCoordinate = calculateNextPoint(state, inputCoordinate);
        state = nextCoordinate;
        var x = state.x, y = state.y;
        if (state.hasExploded()) {
            return index;
        }
    }
    return 101;
};
var calculateNextPoint = function (previousCoordinate, inputCoordinate) {
    var squaredCoordinate = previousCoordinate.square();
    return new Coordinate(squaredCoordinate.x + inputCoordinate.x, squaredCoordinate.y + inputCoordinate.y);
};
var Canvas = /** @class */ (function () {
    function Canvas() {
        this.width = 400;
        this.height = 400;
        this.xOffset = 300;
        this.yOffset = 100;
        var canvas = document.getElementById('canvas');
        this.ctx = (canvas === null || canvas === void 0 ? void 0 : canvas.getContext('2d')) || null;
    }
    Canvas.prototype.drawPixel = function (x, y, color) {
        if (!this.ctx) {
            console.log('Canvas context not found in drawPixel');
            return;
        }
        var mappedX = (x + 1) * this.width / 2 + this.xOffset;
        var mappedY = (y + 1) * this.height / 2 + this.yOffset;
        this.ctx.fillStyle = color;
        this.ctx.fillRect(mappedX, mappedY, 1, 1);
    };
    return Canvas;
}());
var interpolate = function (start, end, factor) {
    return Math.round(start + (end - start) * factor);
};
var interpolateColor = function (color1, color2, factor) {
    var r = interpolate(color1[0], color2[0], factor);
    var g = interpolate(color1[1], color2[1], factor);
    var b = interpolate(color1[2], color2[2], factor);
    return "rgb(".concat(r, ", ").concat(g, ", ").concat(b, ")");
};
var fill = 'black';
var redMethod = 'multiply';
var redFactor = 1;
var greenMethod = 'multiply';
var greenFactor = 1;
var blueMethod = 'multiply';
var blueFactor = 1;
var getFromInput = function () {
    var _a, _b, _c, _d, _e, _f, _g;
    var form = document.forms.namedItem('input');
    fill = ((_a = form === null || form === void 0 ? void 0 : form.elements.namedItem('fill')) === null || _a === void 0 ? void 0 : _a.value) || fill;
    redMethod = ((_b = form === null || form === void 0 ? void 0 : form.elements.namedItem('red-method')) === null || _b === void 0 ? void 0 : _b.value) || redMethod;
    redFactor = parseFloat(((_c = form === null || form === void 0 ? void 0 : form.elements.namedItem('red-factor')) === null || _c === void 0 ? void 0 : _c.value) || '1');
    greenMethod = ((_d = form === null || form === void 0 ? void 0 : form.elements.namedItem('green-method')) === null || _d === void 0 ? void 0 : _d.value) || greenMethod;
    greenFactor = parseFloat(((_e = form === null || form === void 0 ? void 0 : form.elements.namedItem('green-factor')) === null || _e === void 0 ? void 0 : _e.value) || '1');
    blueMethod = ((_f = form === null || form === void 0 ? void 0 : form.elements.namedItem('blue-method')) === null || _f === void 0 ? void 0 : _f.value) || blueMethod;
    blueFactor = parseFloat(((_g = form === null || form === void 0 ? void 0 : form.elements.namedItem('blue-factor')) === null || _g === void 0 ? void 0 : _g.value) || '1');
};
var calculateColor = function (explodedAt) {
    if (explodedAt === 101) {
        return fill;
    }
    var red = redMethod === 'pow' ? Math.pow(explodedAt, redFactor) : explodedAt * redFactor;
    var green = greenMethod === 'pow' ? Math.pow(explodedAt, greenFactor) : explodedAt * greenFactor;
    var blue = blueMethod === 'pow' ? Math.pow(explodedAt, blueFactor) : explodedAt * blueFactor;
    return "rgb(".concat(red, ", ").concat(green, ", ").concat(blue, ")");
};
var canvas;
var draw = function () {
    getFromInput();
    var stepSize = 0.005;
    for (var x = -2.5; x < 2; x += stepSize) {
        for (var y = -2; y < 2; y += stepSize) {
            var input = new Coordinate(x, y);
            var explodedAt = calculateWhenExploded(input);
            canvas.drawPixel(x, y, calculateColor(explodedAt));
        }
    }
};
var init = function () {
    var _a;
    canvas = new Canvas();
    draw();
    (_a = document.getElementById('apply')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', draw);
};
init();
