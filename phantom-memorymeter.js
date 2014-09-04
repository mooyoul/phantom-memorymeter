//     Phantom-MemoryMeter v1.0.0
//     http://github.com/mooyoul/phantom-memorymeter
//     (c) 2014 Moo Yeol, Lee
//     Phantom-MemoryMeter may be freely distributed under the MIT license.


/**
 * Array.prototype.forEach Polyfill.
 */
// Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: http://es5.github.io/#x15.4.4.18
if (!Array.prototype.forEach) {
    console.log("Array.prototype.forEach is Not Found!");
    Array.prototype.forEach = function (callback, thisArg) {

        var T, k;

        if (this == null) {
            throw new TypeError(" this is null or not defined");
        }

        // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
        var O = Object(this);

        // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
        // 3. Let len be ToUint32(lenValue).
        var len = O.length >>> 0;

        // 4. If IsCallable(callback) is false, throw a TypeError exception.
        // See: http://es5.github.com/#x9.11
        if (typeof callback !== "function") {
            throw new TypeError(callback + " is not a function");
        }

        // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (arguments.length > 1) {
            T = thisArg;
        }

        // 6. Let k be 0
        k = 0;

        // 7. Repeat, while k < len
        while (k < len) {

            var kValue;

            // a. Let Pk be ToString(k).
            //   This is implicit for LHS operands of the in operator
            // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
            //   This step can be combined with c
            // c. If kPresent is true, then
            if (k in O) {

                // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
                kValue = O[k];

                // ii. Call the Call internal method of callback with T as the this value and
                // argument list containing kValue, k, and O.
                callback.call(T, kValue, k, O);
            }
            // d. Increase k by 1.
            k++;
        }
        // 8. return undefined
    };
}





/**
 * Module dependencies.
 */

var debug = function () { console.log.apply(console, arguments);},
/**
 *  var debug = require('debug')('Phantom-MemoryMeter'),
 *
 * Or you can use my 'debug' fork for PhantomJS/CasperJS.
 * Learn More: https://github.com/mooyoul/debug
 *
 */
    system = require('system'),
    childProcess = require('child_process');


if(! system ) throw new Error("This module only works on phantomjs/casperjs!");


/**
 * Expose `Meter`.
 */
var Meter = module.exports = exports = {};




/**
 * Get Used Memory Size in Byte.
 * Expose 'getUsedMemoryByte'
 *
 * @param {String|Number} pid       Process ID. If null, pid will set automatically.
 * @param {Function} callback       Callback. Please see below Callback signature.
 * @api public
 *
 * ===================
 * Callback Signature
 * ===================
 * {Error} err              Error
 * {Number} memorySize      Used Memory Size in Byte
 * {String|Number} pid      Target Process ID
 */

Meter.getUsedMemoryByte = function (pid, callback) {
    if(typeof pid === 'function') {
        callback = pid;
    }

    pid = pid || system.pid;


    var os = system.os.name || '';


    if ( (os === 'linux') || (os === 'unix') || (os === 'mac') ) {
        childProcess.execFile('ps', ['-o','rss=', '-p', pid], null, function (err, stdout, stderr) {
            if(err) {
                callback(new Error("Failed to fetch `ps` result!"));
                return;
            }
            if(stderr) {
                callback(new Error(stderr));
                return;
            }

            callback(null, parseInt(("" + stdout).replace(/\s+/g, ''), 10) * 1024, pid);
        });
    } else if( os === 'windows') {
        /** @todo Strange bug. WHY DOESN't WORK `/FI` FLAG??? I NEED MORE SIMPLE METHOD */
        childProcess.execFile('tasklist', ['/NH'], null, function (err, stdout, stderr) {
            if(err) {
                callback(new Error("Failed to fetch `tasklist` result!"));
                return;
            }
            if(stderr) {
                callback(new Error(stderr));
                return;
            }



            var columnDelimiter = /\s+/,
                fetchedMemSize = 0,
                units = {K: 1, M: 2, G: 3, T: 4}; // K = 1024 bytes, M = 1024^2 bytes, G = 1024^3 bytes, T = 1024^4 bytes.

            stdout.split("\r\n").forEach(function (item) {
                var row = item.split(columnDelimiter);

                if( row && row.length > 2) {
                    if ( row[1] === (pid + '') ) {
                        fetchedMemSize = parseInt(row[row.length - 2].replace(/[^0-9]/g, ''), 10) * Math.pow(1024, units[row[row.length - 1]] || 0);
                        return false;
                    }
                }
            });
            callback(null, fetchedMemSize, pid);
        });
    }

};





/**
 * Get Used Memory Size in Human Read Size.
 * Expose 'getUsedMemoryHumanSize'
 *
 * @param {String|Number} pid       Process ID. If null, pid will set automatically.
 * @param {Function} callback       Callback. Please see below Callback signature.
 * @api public
 *
 * ===================
 * Callback Signature
 * ===================
 * {Error} err              Error
 * {String} memorySize      Used Memory Size in Human-read Size
 * {String|Number} pid      Target Process ID
 */

Meter.getUsedMemoryHumanSize = function (pid, callback) {
    var __this = this;

    this.getUsedMemoryByte(pid, function (err, size, pid) {
        if(err) {
            callback(err);
            return;
        }

        callback(err, __this.toHumanReadSize(size), pid);
    });
};






/**
 * Convert Size to Human-Read Size.
 * Expose 'toHumanReadSize'
 *
 * @param {String|Number} size      Size to be converted to Human-Read Size.
 * @return {String} humanSize       Converted Human-Read Size.
 * @api public
 */

Meter.toHumanReadSize = function (size) {
    if(typeof size !== 'Number')
        size = parseInt(size, 10);

    if( isNaN(size) ) throw new Error("size is not correct Number.");

    var units = ['B', 'KB', 'MB', 'GB', 'TB'],
        unitPos = 0,
        currentSize = size;

    while (currentSize >= 1024) {
        currentSize /= 1024;
        unitPos += 1;
    }


    var humanSize = '' + currentSize.toFixed(3);
    while( (humanSize[humanSize.length - 1] === '0') ) {
        humanSize = humanSize.substr(0, humanSize.length - 1);

        if(humanSize[humanSize.length - 1] === '.') {
            humanSize = humanSize.substr(0, humanSize.length - 1);
            break;
        }
    }


    return humanSize + units[unitPos];
};






/**
 * Log Used Memory Size in Human Read Size.
 * Expose 'logUsedMemory'
 *
 * @param {String|Number} pid       Process ID. If null, pid will set automatically.
 * @param {String} message          Message
 * @api public
 */
Meter.logUsedMemory = function (pid, message) {
    message = message || 'logUsedMemory';
    this.getUsedMemoryHumanSize(pid, function (err, size, pid) {
        if(err) {
            debug('[logUsedMemory:Error] ' + err.toString());
            return;
        }

        debug(message + " [PID " + pid + '] ' + size);
    });
};