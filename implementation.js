'use strict';

var Call = require('es-abstract/2019/Call');
var Get = require('es-abstract/2019/Get');
var HasProperty = require('es-abstract/2019/HasProperty');
var IsCallable = require('es-abstract/2019/IsCallable');
var ToObject = require('es-abstract/2019/ToObject');
var ToString = require('es-abstract/2019/ToString');
var ToUint32 = require('es-abstract/2019/ToUint32');
var callBound = require('es-abstract/helpers/callBound');
var isString = require('is-string');

// Check failure of by-index access of string characters (IE < 9) and failure of `0 in boxedString` (Rhino)
var boxedString = Object('a');
var splitString = boxedString[0] !== 'a' || !(0 in boxedString);

var $split = callBound('String.prototype.split');
var $TypeError = TypeError;

module.exports = function reduceRight(callbackfn) {
	var O = ToObject(this);
	var self = splitString && isString(O) ? $split(O, '') : O;
	var len = ToUint32(Get(self, 'length'));

	// If no callback function or if callback is not a callable function
	if (!IsCallable(callbackfn)) {
		throw new $TypeError('Array.prototype.reduceRight callback must be a function');
	}

	if (len === 0 && arguments.length < 2) {
		throw new $TypeError('reduceRight of empty array with no initial value');
	}

	var k = len - 1;

	var accumulator;
	var Pk, kPresent;
	if (arguments.length > 1) {
		accumulator = arguments[1];
	} else {
		kPresent = false;
		while (!kPresent && k >= 0) {
			Pk = ToString(k);
			kPresent = HasProperty(O, Pk);
			if (kPresent) {
				accumulator = Get(O, Pk);
			}
			k -= 1;
		}
	}

	while (k >= 0) {
		Pk = ToString(k);
		kPresent = HasProperty(O, Pk);
		if (kPresent) {
			var kValue = Get(O, Pk);
			accumulator = Call(callbackfn, void undefined, [accumulator, kValue, k, O]);
		}
		k -= 1;
	}

	return accumulator;
};
