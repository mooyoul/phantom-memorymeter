/**
 * Created by Prescott on 2014. 9. 3.
 */





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
        childProcess.execFile("tasklist", ['/FI', '"PID eq ' + pid + '"', '/FO', 'CSV', '/NH'], null, function (err, stdout, stderr) {
            if(err) {
                callback(new Error("Failed to fetch `tasklist` result!"));
                return;
            }
            if(stderr) {
                callback(new Error(stderr));
                return;
            }

            var csvRegex = /"([^"]+)"(?:$|,)/,
                matched = stdout.match(csvRegex);

            console.log(matched);

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
 * Get Used Memory Size in Human Read Size.
 * Expose 'getUsedMemoryHumanSize'
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