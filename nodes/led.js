module.exports = function(RED) {
    "use strict";
    const helper = require("../lib/helper.js");

    function GatewayLedNode(n) {
        RED.nodes.createNode(this, n);

        this.config = RED.nodes.getNode(n.config);
        this.input = n.input;
        var node = this;

        node.config.events.on('update', (config) => {
            var status = {fill: null, shape:"dot", text: null};
            var payload = {power: null, color: null};
    
            if (config.power) {
                status.fill = "green";
                payload.power = "on";
            } else {
                status.fill = "red";
                payload.power = "off";
            }

            if (node.input == "hex") {
                payload.color = helper.rgb2hex(config.red, config.green, config.blue);
            }

            if (node.input == "rgb") {
                payload.color = {r: config.red, g: config.green, b: config.blue};
            }
    
            status.text = "{r:" + config.red.toString() + ", g:" + config.green.toString() + ", b:" + config.blue.toString() + "}";

            this.status(status);
            node.send({payload: payload, topic: false});
        });

        this.on("input", function(msg) {
            if (!msg.hasOwnProperty("payload")) { return; }
            if (!this.config) { return; }

            var data = msg.payload;

            // MODE STATE **************************************************
            if (node.input == "state") {
                switch (data) {
                    case "on": node.config.setPower(true); return;
                    case "off": node.config.setPower(false); return;
                    case "toggle": node.config.toggle(); return;
                    case true: node.config.setPower(true); return;
                    case false: node.config.setPower(false); return;
                    case "true": node.config.setPower(true); return;
                    case "false": node.config.setPower(false); return;
                }
            }

            // MODE COLOR HEX **********************************************
            if (node.input == "hex") {
                var color = helper.hex2rgb(data);
                node.config.setColor(color.r, color.g, color.b);
                return;
            }

            // MODE COLOR RGB **********************************************
            if (node.input == "rgb") {
                if (data.hasOwnProperty('r') && data.hasOwnProperty('g') && data.hasOwnProperty('b')) {
                    node.config.setColor(data.r, data.g, data.b);
                    return;
                }
            }
        });
    }

    RED.nodes.registerType("gateway-led", GatewayLedNode);
}