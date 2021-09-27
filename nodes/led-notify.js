module.exports = function(RED) {
    "use strict";
    const helper = require("../lib/helper.js");

    function GatewayLedNotifyNode(n) {
        RED.nodes.createNode(this, n);
        let node = this;

        node.config = RED.nodes.getNode(n.config);
        node.pattern = n.pattern;
        node.ttick = n.ttick;
        node.time = n.time * 1000;
        node.colors = n.colors;
        node.notify = false;
        node.timer = null;
        node.timeout = null;
        node.position = 0;

        node.config.events.on('beginNotify', (config) => {
            clearInterval(node.timer);
            clearTimeout(node.timeout);
            node.position = 0;
            node.status({});
        });

        node.config.events.on('endNotify', (config) => {
            // TODO
        });

        node.on("input", function(msg) {
            if (!msg.hasOwnProperty("payload")) { return; }
            if (!node.config) { return; }
            if (!node.pattern) { return; }

            let data = msg.payload;

            switch (data) {
                case "start": {
                    node.config.beginNotify();              
                    node.timer = setInterval(node.tick, node.ttick);
                    node.status({fill: "green", shape:"dot", text: "active"});
                    break;
                }

                case "stop": {
                    node.stop();
                    break;
                }

                default: {
                    node.config.beginNotify(); 
                    node.timeout = setTimeout(node.stop, node.time);
                    node.timer = setInterval(node.tick, node.ttick);
                    node.status({fill: "green", shape:"dot", text: "active"});
                    break;
                }
            }
        });

        node.tick = function() {
            let rgb = {r: 0, g: 0, b: 0};

            switch (node.pattern.charAt(node.position)) {
                case "1": rgb = helper.hex2rgb(node.colors[0]); break;
                case "2": rgb = helper.hex2rgb(node.colors[1]); break;
                case "3": rgb = helper.hex2rgb(node.colors[2]); break;
            }

            node.config.writeColor(rgb.r, rgb.g, rgb.b); 

            if (node.position >= node.pattern.length - 1) {
                node.position = 0;
            } else {
                node.position = node.position + 1;
            }
        }

        node.stop = function() {
            clearInterval(node.timer);
            clearTimeout(node.timeout);
            node.position = 0;
            node.status({});
            node.config.endNotify();
        }
    }

    RED.nodes.registerType("gateway-led-notify", GatewayLedNotifyNode);
}