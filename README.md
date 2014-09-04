phantom-memorymeter
===================

Memory Meter for [PhantomJS](http://phantomjs.org)/[CasperJS](http://casperjs.org)

### Installation
```
npm install phantom-memorymeter
```


### Running Example
```
git clone https://github.com/mooyoul/phantom-memorymeter.git
cd phantom-memorymeter
phantomjs example.js
```


### Usage
#### memoryMeter.getUsedMemoryByte (pid, callback)
Get Used Memory Size in Byte.

#### memoryMeter.getUsedMemoryHumanSize (pid, callback)
Get Used Memory Size in Human Read Size.

#### memoryMeter.toHumanReadSize (size)
Convert Size to Human-Read Size.

#### Meter.logUsedMemory (pid, message)
Log Used Memory Size in Human Read Size.


### Contributors
- Author: [Moo Yeol, Lee (Prescott)](http://github.com/mooyoul)




### License
The MIT License (MIT)

Copyright (c) 2014 Moo Yeol, Lee (Prescott)

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
