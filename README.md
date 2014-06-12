js2tsd
======

This project consists of a simple script that helps in the creation of Typescript
definition files for existing Javascript libraries. Files that might then be
submitted to [DefinitelyTyped](https://github.com/borisyankov/DefinitelyTyped),
for instance. It does this by importing the library itself, traversing its
enumerable properties, and generating the skeleton for a corresponding `.d.ts` file.

The script will be improved over time, but the process will never be perfect,
so you'll always need to do some manual work before the output becomes useful.
You need to manually specify most types, as well as double-check the output for
obvious mistakes. But the boring copy/pasting work will be taken care of.

No comprehensive documentation has been written yet, but it should be easy enough
to get started. Have a look at `example.js`, which uses the
[Chroma.js](http://driven-by-data.net/about/chromajs) library as an example. 

Have fun!
