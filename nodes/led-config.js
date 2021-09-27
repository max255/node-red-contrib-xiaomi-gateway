module.exports = function(RED) {
    "use strict";
    const fs = require("fs");
    const Emitter = require("events");
    const helper = require("../lib/helper.js");

    function GatewayLedConfigNode(n) {
        RED.nodes.createNode(this, n);
        var node = this;

        node.name = n.name;
        node.redFile = n.redFile;
        node.greenFile = n.greenFile;
        node.blueFile = n.blueFile;
        node.range = n.range;
        node.power = false;
        node.red = 0;
        node.green = 0;
        node.blue = 0;
        node.events = new Emitter();
        node.notify = false;

        node.update = function() {
            if (node.power == true && node.notify == false) {
                node.writeColor(node.red, node.green, node.blue);
            } else {
                node.writeColor(0, 0, 0);
            }

            node.events.emit('update', node);
        };

        node.setPower = function(value) {
            node.power = value;
            node.update();
        };

        node.setColor = function(r, g, b) {
            node.red = r;
            node.green = g;
            node.blue = b;
            node.update();
        };

        node.toggle = function() {
            node.power = !node.power;
            node.update();
        };

        node.writeColor = function(r, g, b) {
            if (node.range = "r0100") {
                r = helper.map(r, 0, 255, 0, 100);
                g = helper.map(g, 0, 255, 0, 100);
                b = helper.map(b, 0, 255, 0, 100);
            }

            fs.writeFile(node.redFile, r.toString(), { flag: 'a+' }, err => {});
            fs.writeFile(node.greenFile, g.toString(), { flag: 'a+' }, err => {});
            fs.writeFile(node.blueFile, b.toString(), { flag: 'a+' }, err => {});
        };

        node.beginNotify = function() {
            node.events.emit('beginNotify', node);
            node.notify = true;
            node.writeColor(0, 0, 0);
        };

        node.endNotify = function() {
            node.events.emit('endNotify', node);
            node.notify = false;

            if (node.power) {
                node.writeColor(node.red, node.green, node.blue);
            } else {
                node.writeColor(0, 0, 0);
            }
        };
    }

    RED.nodes.registerType("gateway-led-config", GatewayLedConfigNode);
}