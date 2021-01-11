module.exports = function(RED) {
    "use strict";
    const { spawn } = require('child_process');

    function GatewayButtonNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.device = config.device.toString();
        node.tclick = Number(config.tclick);
        node.thold = Number(config.thold);

        node.state = { action: "init", multiclick: 0 };

        node.timer = null;
        node.count = 0;
        node.tssec = 0;
        node.tsusec = 0;

        node.cat = spawn('cat', [node.device]);

        node.cat.stdout.on('data', function(data) {
            node.process(data);
        });

        node.event = function(key) {
            if (key.type == 1 && key.code == 256) {
                if (key.value == 1) {
                    clearTimeout(node.timer);
                    
                    node.tssec = key.tssec;
                    node.tsusec = key.tsusec;

                    node.count++;
                } else {
                    node.timer = setTimeout(function() {


                        if (node.count > 1) {
                            node.state.action = "multiclick";
                            node.state.multiclick = node.count;
                        } else {
                            if (((key.tssec - node.tssec) * 1000) + ((key.tsusec - node.tsusec) / 1000) > node.thold) {
                                node.state.action = "hold";
                                node.state.multiclick = 1;
                            } else {
                                node.state.action = "click";
                                node.state.multiclick = 1;
                            }
                        }

                        node.count = 0;

                        node.status({fill: "blue", shape: "dot", text: node.state.action });

                        setTimeout(function(){
                            node.status({});
                        }, 600);

                        node.send({payload: node.state});
                    }, node.tclick);
                }
            }
        }

        node.process = function(buf) {
            if (buf.length > 8) {
                var t = buf.readUInt32LE(0);
                var lastPos = 0;
                for (var i = 8, n = buf.length; i < n; i += 8) {
                    if (buf.readUInt32LE(i) === t) {
                        var part = buf.slice(lastPos, i);
                        var key = node.parse(part);
                        if (key) node.event(key);
                            lastPos = i;
                    }
                }

                var part = buf.slice(lastPos, i);
                var key = node.parse(part);
                if (key) node.event(key);
            } 
        }

        node.parse = function(buf) {
            if (buf.length >= 16) {
                return {
                    tssec: buf.readUInt32LE(0),
                    tsusec: buf.readUInt32LE(4),
                    type: buf.readUInt16LE(8),
                    code: buf.readUInt16LE(10),
                    value: buf.readInt32LE(12)
                };
            }
        }

        node.on('close', function() {
            node.cat.removeAllListeners();
            node.cat.kill();
        });
    }

    RED.nodes.registerType("gateway-button", GatewayButtonNode);
}