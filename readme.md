## Package node-red-contrib-xiaomi-gateway
The package is only for use on xiaomi gateways running OpenWRT
### Nodes:
- gateway-button
- gateway-led
- gateway-led-notify
- gateway-illuminance

### gateway-button
![](https://user-images.githubusercontent.com/10141227/134972029-8ebc2259-937a-43f4-81b0-aa049e79af7c.PNG)

Receiving events from an embedded button. Returns an object:
<pre>
{"action": "click", "multiclick": 1}         // one click
{"action": "multiclick", "multiclick": 3}    // three clicks
{"action": "hold", "multiclick": 1}          // hold
</pre>

### gateway-led
Before using the backlight control node, you need to configure the control paths of the LED devices. You can change the paths at any time. Sometimes this is relevant when updating the operating system.
![](https://user-images.githubusercontent.com/10141227/134972033-586ccce4-0829-44d2-8d2f-92e9a2f67831.PNG)

![](https://user-images.githubusercontent.com/10141227/134972035-e281e706-5c9d-4c53-8948-2d59083514c3.PNG)

![](https://user-images.githubusercontent.com/10141227/134972037-8f688ae1-4194-406f-a30c-56e3946b9edb.PNG)

Controls the built-in backlight. Accepts data in the payload field, the data type is configured in the node.
<pre>
payload = "on";                     // state
payload = "off";
payload = "toggle";
payload = "ff00ff";                 // hex color
payload = {r: 0, g: 0, b: 100};     // object color
</pre>

### gateway-led-notify

![](https://user-images.githubusercontent.com/10141227/134972039-7ae98fdf-5f68-42d4-a6fe-5cbe50fe6d72.PNG)

The notification node allows you to create various light notifications using the built-in LEDs. Three colors with indices are available for customization (1, 2, 3, 0 - no light). You can also configure the duration of the notification and the duration of the pattern step.

<pre>
payload = "any type";                           // triggers an alert for a specific period
payload = "start";                              // triggers an alert before manual stop 
payload = "stop";                               // stop alert
</pre>

### gateway-illuminance
![](https://user-images.githubusercontent.com/10141227/134972032-52480bbe-f0e1-4958-8279-7d200e3400c6.PNG)

Receives data from the built-in light sensor. Returns data depending on the settings of the node:
<pre>
payload = 3059;                                 // raw data from sensor
payload = 36;                                   // converted value, in lux 
payload = "day";                                // day or night event
payload = "night";
payload = {raw: 3059, lux: 36, state: "day"};   // full data
</pre>