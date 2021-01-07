module.exports = function(RED) {
    "use strict";
    const fs = require("fs");

    function GatewayIlluminanceNode(config) {
        RED.nodes.createNode(this, config);

        this.sensor = config.sensor.toString();
        this.tupdate = Number(config.tupdate);
        this.night = Number(config.night);
        this.hysteresis = Number(config.hysteresis);
        this.mode = config.mode;
        this.timer = null;

        var status = {fill:"green", shape:"ring", text:"Initialization"};
        var msg = {payload: null, topic: false};
        var state = "day";
        var last = "";
        

        var node = this;

        this.update = function() {
            var data = fs.readFileSync(node.sensor, 'utf8');
            var raw = Number(data);
            var lux = Number((raw / 13.75).toFixed(2));
    
            if (state == "night" && lux > node.night + node.hysteresis) {
                state = "day";
            }
    
            if (state == "day" && lux < node.night - node.hysteresis) {
                state = "night";
            }
    
            if (node.mode == "raw") {
                msg.payload = raw;
                status.shape = "dot";
                status.text = "RAW: " + raw.toString();
                node.send(msg);
                node.status(status);
                return;
            }
    
            if (node.mode == "lux") {
                msg.payload = lux;
                status.shape = "dot";
                status.text = "Illuminance: " + lux.toString() + " lx";
                node.send(msg);
                node.status(status);
                return;
            }
    
            if (node.mode == "daynight") {
                if (last != state) {
                    last = state;
                    msg.payload = state;
                    status.shape = "dot";
                    status.text = "State: " + state + ", " + lux.toString() + " lx";
                    node.send(msg);
                    node.status(status);
                    return;
                }
            }
    
            if (node.mode == "full") {
                msg.payload = {raw: raw, lux: lux, state: state};
                status.text = "State: " + state + ", " + lux.toString() + " lx";
                status.shape = "dot";
                node.send(msg);
                node.status(status);
                return;
            }
        }

        if (node.tupdate > 0) {
            node.timer = setInterval(node.update, node.tupdate);
        }

        this.on("input", function() {
            if (node.tupdate == 0) {
                node.update();
            }
        });

        this.on('close', function() {
            clearInterval(node.timer);
        });
    }

    RED.nodes.registerType("gateway-illuminance", GatewayIlluminanceNode);
}