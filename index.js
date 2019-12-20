'use strict';

var define = require('define-properties');
var RequireObjectCoercible = require('es-abstract/2019/RequireObjectCoercible');
var callBound = require('es-abstract/helpers/callBound');

var implementation = require('./implementation');
var getPolyfill = require('./polyfill');
var polyfill = getPolyfill();
var shim = require('./shim');

var $slice = callBound('Array.prototype.slice');

// eslint-disable-next-line no-unused-vars
var boundReduceRightShim = function reduceRight(array, callbackfn) {
	RequireObjectCoercible(array);
	return polyfill.apply(array, $slice(arguments, 1));
};
define(boundReduceRightShim, {
	getPolyfill: getPolyfill,
	implementation: implementation,
	shim: shim
});

module.exports = boundReduceRightShim;
