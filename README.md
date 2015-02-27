# cc2uart -- node-cc2540

node.js support for the TI CC2540 UART service. The CC2540 is programmable so
there is no guarantee this works with all boards.

This module is built on [noble](https://www.npmjs.com/package/noble) so it
should work where ever noble works.

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

The tested device is a Raspberry Pi Model B running a fresh installation of
Raspian release 2015-02-16. Be sure to do the usual post-installation steps
such as "sudo apt-get update", "sudo apt-get upgrade", and "sudo raspi-config".

The next step is to install node.js. The version of node.js in the Raspian repo
is too old so install a recent version.

```sh
wget http://node-arm.herokuapp.com/node_0.10.36_armhf.deb
sudo dpkg -i node_0.10.36_armhf.deb
```

The version of bluez in the Raspian rep is also old so install a recent
version.

```sh
# Reference: http://www.elinux.org/RPi_Bluetooth_LE
sudo apt-get install libdbus-1-dev libdbus-glib-1-dev libglib2.0-dev \
libical-dev libreadline-dev libudev-dev libusb-dev make
mkdir bluez
cd bluez
wget https://www.kernel.org/pub/linux/bluetooth/bluez-5.28.tar.xz
tar xf bluez-5.28.tar.xz
cd bluez-5.28
./configure --disable-systemd --enable-library
# The next step takes a long time.
make
sudo make install
sudo hciconfig hci0 up
```
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
