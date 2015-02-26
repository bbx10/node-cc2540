/****************************************************************************
  The MIT License (MIT)

  Copyright (c) 2015 bbx10node@gmail.com

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
 ****************************************************************************/

/*
 * TI CC2540 UART mode. The CC2540 is a programmable device so this may not
 * work for all devices using the CC2540. The device tested is the RFCC2540A1.
 */

var NobleDevice = require('noble-device');
var events = require('events');
var util = require('util');

// UART TX and RX have different service UUIDs
var TICUART_SERVICE_NOTIFY_UUID = 'ffe0';
var TICUART_SERVICE_WRITE_UUID  = 'ffe5';
var TICUART_NOTIFY_CHAR         = 'ffe4';
var TICUART_WRITE_CHAR          = 'ffe9';

var cc2uart = function(peripheral) {
    // call nobles super constructor
    NobleDevice.call(this, peripheral);

    // setup or do anything else your module needs here
};

util.inherits(cc2uart, events.EventEmitter);

// and/or specify method to check peripheral
cc2uart.is = function(peripheral) {
    'use strict';
    return ((peripheral.advertisement.serviceUuids.indexOf('fff0') !== -1) &&
            (peripheral.advertisement.serviceUuids.indexOf('ffb0') !== -1));
};

// inherit noble device
NobleDevice.Util.inherits(cc2uart, NobleDevice);

// Receive data using the 'data' event.
cc2uart.prototype.onData = function(data) {
    'use strict';
    this.emit("data", data);
};

// Send data like this
// cc2uart.write('Hello world!\r\n', function(){...});
// or this
// cc2uart.write([0x02, 0x12, 0x34, 0x03], function(){...});
cc2uart.prototype.write = function(data, done) {
    'use strict';
    if (typeof data === 'string') {
        this.writeDataCharacteristic(TICUART_SERVICE_WRITE_UUID,
                TICUART_WRITE_CHAR, new Buffer(data), done);
    }
    else {
        this.writeDataCharacteristic(TICUART_SERVICE_WRITE_UUID,
                TICUART_WRITE_CHAR, data, done);
    }
};

cc2uart.prototype.connectAndSetup = function(callback) {
    'use strict';
    var self = this;

    NobleDevice.prototype.connectAndSetup.call(self, function() {
        if (TICUART_SERVICE_NOTIFY_UUID in self._characteristics) {
          self.notifyCharacteristic(TICUART_SERVICE_NOTIFY_UUID,
            TICUART_NOTIFY_CHAR, true, self.onData.bind(self), callback);
        }
    });
};

NobleDevice.Util.mixin(cc2uart, NobleDevice.DeviceInformationService);

// export device
module.exports = cc2uart;
