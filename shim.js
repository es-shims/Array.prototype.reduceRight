'use strict';

var define = require('define-properties');
var getPolyfill = require('./polyfill');

module.exports = function shimArrayPrototypeReduce() {
	var polyfill = getPolyfill();
	define(
		Array.prototype,
		{ reduceRight: polyfill },
		{ reduceRight: function () { return Array.prototype.reduceRight !== polyfill; } }
	);
	return polyfill;
};
