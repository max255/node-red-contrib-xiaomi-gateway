module.exports = function(RED) {
    "use strict";

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
                payload.color = rgb2hex(config.red, config.green, config.blue);
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

            if (node.input == "state") {
                switch (data) {
                    case "on": node.config.setPower(true); return;
                    case "off": node.config.setPower(false); return;
                    case "toggle": node.config.toggle(); return;    
                }
            }

            if (node.input == "hex") {
                var color = hex2rgb(data);
                node.config.setColor(color.r, color.g, color.b);
                return;
            }

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