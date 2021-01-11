## Package node-red-contrib-xiaomi-gateway
The package is only for use on xiaomi gateways running OpenWRT
### Nodes:
- gateway-button
- gateway-led
- gateway-illuminance

### gateway-button

Receiving events from an embedded button. Returns an object:
<pre>
{"action": "click", "multiclick": 1}         // one click
{"action": "multiclick", "multiclick": 3}    // three clicks
{"action": "hold", "multiclick": 1}          // hold
</pre>

### gateway-led
Controls the built-in backlight. Accepts data in the payload field, the data type is configured in the node.
<pre>
payload = "on";                     // state
payload = "off";
payload = "toggle";
payload = "ff00ff";                 // hex color
payload = {r: 0, g: 0, b: 100};     // object color
</pre>

### gateway-illuminance
Receives data from the built-in light sensor. Returns data depending on the settings of the node:
<pre>
payload = 3059;                                 // raw data from sensor
payload = 36;                                   // converted value, in lux 
payload = "day";                                // day or night event
payload = "night";
payload = {raw: 3059, lux: 36, state: "day"};   // full data
</pre>