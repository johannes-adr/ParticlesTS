"use strict";
function getRandomNumber(max) {
    return (Math.random() * max);
}
function distanceOf2Points(x1, y1, x2, y2) {
    let x = x2 - x1;
    let y = y2 - y1;
    return Math.sqrt(x * x + y * y);
}
function getAngleFromTwoPoints(x1, y1, x2, y2) {
    let r = Math.atan2(y1 - y2, x1 - x2);
    if (r < 0)
        r += Math.PI * 2;
    return r;
}
