# array.prototype.reduceRight <sup>[![Version Badge][npm-version-svg]][package-url]</sup>

[![github actions][actions-image]][actions-url]
[![coverage][codecov-image]][codecov-url]
[![dependency status][deps-svg]][deps-url]
[![dev dependency status][dev-deps-svg]][dev-deps-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

[![npm badge][npm-badge-png]][package-url]

An ES5 spec-compliant `Array.prototype.reduceRight` shim/polyfill/replacement that works as far down as ES3.

This package implements the [es-shim API](https://github.com/es-shims/api) interface. It works in an ES3-supported environment and complies with the [spec](https://www.ecma-international.org/ecma-262/5.1/).

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
[npm-version-svg]: https://versionbadg.es/es-shims/Array.prototype.reduceRight.svg
[deps-svg]: https://david-dm.org/es-shims/Array.prototype.reduceRight.svg
[deps-url]: https://david-dm.org/es-shims/Array.prototype.reduceRight
[dev-deps-svg]: https://david-dm.org/es-shims/Array.prototype.reduceRight/dev-status.svg
[dev-deps-url]: https://david-dm.org/es-shims/Array.prototype.reduceRight#info=devDependencies
[npm-badge-png]: https://nodei.co/npm/array.prototype.reduceright.png?downloads=true&stars=true
[license-image]: https://img.shields.io/npm/l/array.prototype.reduceright.svg
[license-url]: LICENSE
[downloads-image]: https://img.shields.io/npm/dm/array.prototype.reduceright.svg
[downloads-url]: https://npm-stat.com/charts.html?package=array.prototype.reduceright
[codecov-image]: https://codecov.io/gh/es-shims/Array.prototype.reduceRight/branch/main/graphs/badge.svg
[codecov-url]: https://app.codecov.io/gh/es-shims/Array.prototype.reduceRight/
[actions-image]: https://img.shields.io/endpoint?url=https://github-actions-badge-u3jn4tfpocch.runkit.sh/es-shims/Array.prototype.reduceRight
[actions-url]: https://github.com/es-shims/Array.prototype.reduceRight/actions
