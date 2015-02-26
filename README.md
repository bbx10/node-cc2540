# cc2uart -- node-cc2540

node.js support for the TI CC2540 UART service. The device is programmable so
this may not work for all boards.

## Tested configurations

A USB to Bluetooth 4.0 gadget similar to
[this](http://www.adafruit.com/product/1327) is required to add BLE support to
systems without Bluetooth 4.0/BLE hardware.

### Laptop running Ubuntu Linux 14.04

```
Laptop running Ubuntu 14.04 <-> BLE <-> CC2540 <-> Arduino Uno
```

Ubuntu 14.04 includes bluez 4.101 which is sufficient for this module.
Install the following packages before installing cc2uart.

```sh
sudo apt-get install bluetooth bluez-utils libbluetooth-dev
```

### Raspberry Pi running Raspbian Linux

TODO

## Install this module

```sh
npm install cc2uart 
```

## Use this module

This program sends a test pattern and displays anything that comes back.

```javascript
var cc2uart = require('cc2uart');

cc2uart.discoverAll(function(ble_uart) {
    // enable disconnect notifications
    ble_uart.on('disconnect', function() {
        console.log('disconnected!');
    });

    // connect and setup
    ble_uart.connectAndSetup(function() {
        var writeCount = 0;

        console.log('connected!');

        ble_uart.readSystemId(function(sysID) {
            console.log('System ID:', sysID);
        });

        ble_uart.on('data', function(data) {
            console.log('received:', data.toString());
        });

        setInterval(function() {
            var TESTPATT = 'Hello world! ' + writeCount.toString();
            ble_uart.write(TESTPATT, function() {
                console.log('data sent:', TESTPATT);
                writeCount++;
            });
        }, 3000);
    });
});
```
