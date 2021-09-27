function hex2rgb(hex) {
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgb2hex(r, g, b) {
    const rgb = (r << 16) | (g << 8) | (b << 0);
    return (0x1000000 + rgb).toString(16).slice(1);
}

function map(value, low1, high1, low2, high2) {
    return Math.trunc(low2 + (high2 - low2) * (value - low1) / (high1 - low1));
}

module.exports =
{
    hex2rgb: hex2rgb,
    rgb2hex: rgb2hex,
    map: map
};