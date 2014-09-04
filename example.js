/**
 * Created by Prescott on 2014. 9. 5..
 */


var page = require('webpage').create(),
    memoryMeter = require('./'),
    url = 'http://www.phantomjs.org/';



console.log( memoryMeter.toHumanReadSize(1024*1024) ); // equals 1MB
memoryMeter.logUsedMemory(null, "Phantom:Init");



memoryMeter.getUsedMemoryByte(null, function (err, size, pid) {
    if(err) {
        throw err;
    }
    console.log("PhantomJS Executed (size: " + size + ", pid: " + pid + ")");
});



page.open(url, function (status) {
    memoryMeter.getUsedMemoryHumanSize(null, function (err, size, pid) {
        console.log("Page is loaded! (status: " + status + ", memSize: " + size + ", pid: " + pid + ")");

    });

});