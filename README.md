# array.prototype.reduceRight <sup>[![Version Badge][npm-version-svg]][package-url]</sup>

[![Build Status][travis-svg]][travis-url]
[![dependency status][deps-svg]][deps-url]
[![dev dependency status][dev-deps-svg]][dev-deps-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

[![npm badge][npm-badge-png]][package-url]

An ES5 spec-compliant `Array.prototype.reduceRight` shim/polyfill/replacement that works as far down as ES3.

This package implements the [es-shim API](https://github.com/es-shims/api) interface. It works in an ES3-supported environment and complies with the [spec](http://www.ecma-international.org/ecma-262/5.1/).

Because `Array.prototype.reduceRight` depends on a receiver (the “this” value), the main export takes the array to operate on as the first argument.

## Example

```js
var reduceRight = require('array.prototype.reduceright');
var assert = require('assert');

assert.equal(reduceRight([1, 2, 3], function (prev, x) { return prev + x; }), 6);
assert.equal(reduceRight([1, 2, 3], function (prev, x) { return prev + x; }, 1), 7);
```

```js
var reduceRight = require('array.prototype.reduceright');
var assert = require('assert');
/* when Array#reduceRight is not present */
delete Array.prototype.reduceRight;
var shimmed = reduceRight.shim();
assert.equal(shimmed, reduceRight.getPolyfill());
var arr = [1, 2, 3];
var sum = function (a, b) { return a + b; };
assert.equal(arr.reduceRight(sum), reduceRight(arr, sum));
assert.equal(arr.reduceRight(sum), 6);
assert.equal(arr.reduceRight(sum, 1), 7);
```

```js
var reduceRight = require('array.prototype.reduceright');
var assert = require('assert');
/* when Array#reduceRight is present */
var shimmed = reduceRight.shim();
assert.equal(shimmed, Array.prototype.reduceRight);
assert.equal(arr.reduceRight(sum), reduceRight(arr, sum));
```

## Tests
Simply clone the repo, `npm install`, and run `npm test`

[package-url]: https://npmjs.org/package/array.prototype.reduceright
[npm-version-svg]: http://versionbadg.es/es-shims/Array.prototype.reduceRight.svg
[travis-svg]: https://travis-ci.org/es-shims/Array.prototype.reduceRight.svg
[travis-url]: https://travis-ci.org/es-shims/Array.prototype.reduceRight
[deps-svg]: https://david-dm.org/es-shims/Array.prototype.reduceRight.svg
[deps-url]: https://david-dm.org/es-shims/Array.prototype.reduceRight
[dev-deps-svg]: https://david-dm.org/es-shims/Array.prototype.reduceRight/dev-status.svg
[dev-deps-url]: https://david-dm.org/es-shims/Array.prototype.reduceRight#info=devDependencies
[npm-badge-png]: https://nodei.co/npm/array.prototype.reduceright.png?downloads=true&stars=true
[license-image]: http://img.shields.io/npm/l/array.prototype.reduceright.svg
[license-url]: LICENSE
[downloads-image]: http://img.shields.io/npm/dm/array.prototype.reduceright.svg
[downloads-url]: http://npm-stat.com/charts.html?package=array.prototype.reduceright
