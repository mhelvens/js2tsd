'use strict';

// This script uses js2tsd to generate a rudimentary
// Typescript definition file for the Chroma.js library.

//////////////////// utility libraries ////////////////////

var js2tsd = require('./js2tsd');
var fs = require('fs');


//////////////////// variables ////////////////////

var MODULE_NAME = 'chroma-js';
var MODULE_VERSION = '0.5.7';
var MODULE_URL = "http://driven-by-data.net/about/chromajs";
var MODULE = require(MODULE_NAME);


//////////////////// Translate the module ////////////////////

var output = new js2tsd.TsDGenerator({
	libName:    MODULE_NAME + ' ' + MODULE_VERSION,
	projectURL: MODULE_URL,
	defAuthors: "Michiel Helvensteijn <https://github.com/mhelvens>",
	defURL:     "https://github.com/borisyankov/DefinitelyTyped"
})
		.addClass({
			name:          'Chroma',
			staticExpr:    MODULE,
			instanceExpr:  new MODULE().__proto__,
			anyEverything: true  // this makes the output directly usable by making everything of type 'any'
		})
		.addModule({
			name:         MODULE_NAME,
			singleExport: true
		})
		.output();


//////////////////// Output translation to file ////////////////////

fs.writeFile(MODULE_NAME + ".d.ts", output, function (err) {
	if (err) {
		console.error(err);
	} else {
		console.log("File '" + MODULE_NAME + ".d.ts' successfully generated!");
	}
});
