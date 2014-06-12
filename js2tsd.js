'use strict';

var _ = require('lodash');


//////////////////// utility functions ////////////////////

function indent(str) {
	var IND = "    ";
	return IND + str.replace(/\n(?!$)/mg, '\n' + IND);
}

function functionParams(propVal) {
	if (propVal instanceof Function) {
		var result = propVal.toString().replace(/^\s*function\s*\((.*?)\)[\S\s]*$/, '$1').split(/\,\s/);
		if (result[0] === "") { result = []; }
		return result;
	} else {
		return null;
	}
}

function docOutput(propVal) {
	var result = "/**\n *\n";
	var params = functionParams(propVal);
	if (!_(params).isEmpty()) {
		result += " *\n";
		_(params).forEach(function (param) {
			result += " * @param " + param + " \n";
		});
	}
	result += " */\n";
	return result;
}

function propertyOutput(propVal, propName, anyEverything) {
	var result = propName;
	var params = functionParams(propVal);
	if (params) {
		result += '(' + _(params).map(function (param) {
			if (anyEverything) {
				return param + ": any";
			} else {
				return param;
			}
		}).join(', ') + ')';
	}
	if (anyEverything) {
		result += ": any";
	}
	result += ";\n";
	return result;
}


//////////////////// a typescript definition generator ////////////////////

function TsDGenerator(fileOptions) {

	////////// declared symbols //////////

	var _declaredSymbols = [];

	////////// the header //////////

	var _output =
			"// Type definitions for " + fileOptions.libName + "\n" +
			"// Project: " + fileOptions.projectURL + "\n" +
			"// Definitions by: " + fileOptions.defAuthors + "\n" +
			"// Definitions: " + fileOptions.defURL + "\n\n";


	////////// how to add a class; can be chained //////////

	this.addClass = function addClass(options) {

		_declaredSymbols.push(options.name);

		//// generate the class output
		//
		var classDef = "";
		_(options.staticExpr).forOwn(function (propVal, propName) {
			classDef += docOutput(propVal);
			classDef += "static " + propertyOutput(propVal, propName, options.anyEverything) + "\n";
		});
		_(options.instanceExpr).forOwn(function (propVal, propName) {
			classDef += docOutput(propVal);
			classDef += propertyOutput(propVal, propName, options.anyEverything) + "\n";
		});


		//// add the class output to the full output
		//
		_output += "declare class " + options.name + " {\n\n" + indent(classDef) + "}\n\n";


		//// return the generator to support chaining
		//
		return this;

	};


	////////// how to add an interface; can be chained //////////

	this.addInterface = function addInterface(options) {

		_declaredSymbols.push(options.name);

		//// generate the interface output
		//
		var ifaceDef = "";
		_(options.staticExpr).forOwn(function (propVal, propName) {
			ifaceDef += docOutput(propVal);
			ifaceDef += propertyOutput(propVal, propName, options.anyEverything) + "\n";
		});


		//// add the interface output to the full output
		//
		_output += "declare class " + options.name + " {\n\n" + indent(ifaceDef) + "}\n\n";


		//// return the generator to support chaining
		//
		return this;

	};


	////////// how to declare the module //////////

	this.addModule = function addModule(options) {

		//// generate the module output
		//
		var moduleOutput = "";
		if (options.singleExport) {
			moduleOutput += "export = " + _declaredSymbols[0] + ";\n";
		} else {
			_(options.symbols || _declaredSymbols).forEach(function (symbol) {
				moduleOutput += "export " + symbol + ";\n";
			});
		}


		//// add the module output to the full output
		//
		_output += "declare module \"" + options.name + "\" {\n\n" + indent(moduleOutput) + "\n}\n\n";


		//// return the generator to support chaining
		//
		return this;
	};


	////////// how to return the output //////////

	this.output = function output() { return _output; }

}

exports.TsDGenerator = TsDGenerator;
