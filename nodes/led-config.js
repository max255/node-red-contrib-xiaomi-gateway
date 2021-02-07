module.exports = function(RED) {
    "use strict";
    const fs = require("fs");
    const Emitter = require("events");
    
    function mapRange(value, low1, high1, low2, high2) {
        return Math.trunc(low2 + (high2 - low2) * (value - low1) / (high1 - low1));
    }

    function writeColor(file, value) {
        const data = value.toString();
        fs.writeFile(file, data, { flag: 'a+' }, err => {});
    }

    function writeColorRange(file, value, range) {
        const data = mapRange(value, 0, 255, 0, range).toString();
        fs.writeFile(file, data, { flag: 'a+' }, err => {});
    }

    function GatewayLedConfigNode(n) {
        RED.nodes.createNode(this, n);

        this.name = n.name;
        this.redFile = n.redFile;
        this.greenFile = n.greenFile;
        this.blueFile = n.blueFile;
        this.range = n.range;
        this.power = false;
        this.red = 0;
        this.green = 0;
        this.blue = 0;
        this.events = new Emitter();

        var node = this;

        this.update = function() {
            if (node.power) {
                if (node.range = "r0100") {
                    writeColorRange(node.redFile, node.red, 100);
                    writeColorRange(node.greenFile, node.green, 100);
                    writeColorRange(node.blueFile, node.blue, 100);
                } else {
                    writeColor(node.redFile, node.red);
                    writeColor(node.greenFile, node.green);
                    writeColor(node.blueFile, node.blue);
                }
            } else {
                writeColor(node.redFile, 0);
                writeColor(node.greenFile, 0);
                writeColor(node.blueFile, 0);
            }

            node.events.emit('update', node);
        }

        this.setPower = function(value) {
            node.power = value;
            node.update();
        }

        this.setColor = function(r, g, b) {
            node.red = r;
            node.green = g;
            node.blue = b;
            node.update();
        }

        this.toggle = function() {
            node.power = !node.power;
            node.update();
        }
    }

    RED.nodes.registerType("gateway-led-config",GatewayLedConfigNode);
}