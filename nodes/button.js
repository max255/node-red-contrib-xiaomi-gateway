module.exports = function(RED) {
    "use strict";
    const InputEvent = require('input-event');

    function GatewayButtonNode(config) {
        RED.nodes.createNode(this, config);

        this.event = config.event.toString();
        this.tclick = Number(config.tclick);
        this.thold = Number(config.thold);
        var node = this;

        var input = new InputEvent(node.event);

        var data = { state: "init", multiclick: 0 };
        var msg = { payload: data, topic: false };

        var timer = null;
        var count = 0;
        var tssec = 0;
        var tsusec = 0;

        msg.payload = node.tclick;
        node.send(msg);

        msg.payload = node.thold;
        node.send(msg);

        input.on('data', function(buffer) {
            if (buffer.type == 1 && buffer.code == 256) {
                if (buffer.value == 1) {
                    clearTimeout(timer);
                    
                    tssec = buffer.tssec;
                    tsusec = buffer.tsusec;

                    count++;
                } else {
                    timer = setTimeout(function(){
                        if (count > 1) {
                            data.state = "multiclick";
                            data.multiclick = count;
                        } else {
                            if (((buffer.tssec - tssec) * 1000) + ((buffer.tsusec - tsusec) / 1000) > node.thold) {
                                data.state = "hold";
                                data.multiclick = 1;
                            } else {
                                data.state = "click";
                                data.multiclick = 1;
                            }
                        }

                        count = 0;

                        node.status({fill:"blue", shape:"dot", text:data.state});

                        setTimeout(function(){
                            node.status({});
                        }, 500);

                        msg.payload = data;
                        node.send(msg);
                    }, node.tclick);
                }
            }
        });
    }

    RED.nodes.registerType("gateway-button", GatewayButtonNode);
}