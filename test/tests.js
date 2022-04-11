var hasStrictMode = require('has-strict-mode')();

var global = Function('return this')(); // eslint-disable-line no-new-func
var identity = function (x) { return x; };

var canDistinguishSparseFromUndefined = 0 in [undefined]; // IE 6 - 8 have a bug where this returns false.
var undefinedIfNoSparseBug = canDistinguishSparseFromUndefined ? undefined : { valueOf: function () { return 0; } };

var createArrayLikeFromArray = function createArrayLike(arr) {
	var o = {};
	for (var i = 0; i < arr.length; i += 1) {
		if (i in arr) {
			o[i] = arr[i];
		}
	}
	o.length = arr.length;
	return o;
};

module.exports = function (reduceRight, t) {
	t.test('passes the correct values to the callback', function (st) {
		st.plan(7);

		var expectedValue = {};
		var initialValue = {};
		var expectedResult = {};
		var arr = [expectedValue];
		var result = reduceRight(
			arr,
			function (accumulator, value, key, list) {
				st.equal(arguments.length, 4);
				st.equal(accumulator, initialValue, 'first argument is the accumulator');
				st.equal(value, expectedValue, 'second argument is the value');
				st.equal(key, 0, 'third argument is the index');
				st.equal(list, arr, 'fourth argument is the array being iterated');
				st.equal(this, global, 'sloppy: receiver is the expected value');

				return expectedResult;
			},
			initialValue
		);
		st.equal(result, expectedResult, 'result is last return value of accumulator');

		st.end();
	});

	t.test('strict mode callback receiver', { skip: !hasStrictMode }, function (st) {
		reduceRight(
			[null],
			function () {
				'use strict';

				st.equal(this, undefined, 'strict: receiver is the expected value');
			}
		);

		st.end();
	});

	t.test('starts with the right initialValue', function (st) {
		var firstValue = { a: 1 };
		var secondValue = { a: 2 };
		var thirdValue = { a: 3 };

		reduceRight(
			[firstValue, secondValue],
			function (accumulator, value) {
				st.equal(accumulator, secondValue, 'accumulator starts out as the last value when initialValue is omitted');
				st.equal(value, firstValue, 'value starts out as the second to last value when initialValue is omitted');
			}
		);

		reduceRight(
			[firstValue],
			function (accumulator, value) {
				st.equal(accumulator, thirdValue, 'accumulator starts out as the initialValue when provided');
				st.equal(value, firstValue, 'value starts out as the last value when initialValue is provided');
			},
			thirdValue
		);

		st.end();
	});

	t.test('does not visit elements added to the array after it has begun', function (st) {
		st.plan(8);

		var arr = [1, 2, 3];
		var i = 0;
		reduceRight(arr, function (acc, v) {
			i += 1;
			arr.push(v + 3);
		});
		st.deepEqual(arr, [1, 2, 3, 5, 4], 'array has received 3 new elements. initialValue omitted');
		st.equal(i, 2, 'reduceRight callback only called twice');

		i = 0;
		arr = [1, 2, 3];
		reduceRight(
			arr,
			function (acc, v) {
				i += 1;
				arr.push(v + 3);
			},
			null
		);
		st.deepEqual(arr, [1, 2, 3, 6, 5, 4], 'array has received 3 new elements. initialValue provided');
		st.equal(i, 3, 'reduceRight callback only called thrice');

		var arrayLike = createArrayLikeFromArray([1, 2, 3]);
		i = 0;
		reduceRight(arrayLike, function (acc, v) {
			i += 1;
			arrayLike[arrayLike.length] = v + 3;
			arrayLike.length += 1;
		});
		st.deepEqual(Array.prototype.slice.call(arrayLike), [1, 2, 3, 5, 4], 'arrayLike has received 3 new elements. initialValue omitted');
		st.equal(i, 2, 'reduceRight callback only called twice');

		arrayLike = createArrayLikeFromArray([1, 2, 3]);
		i = 0;
		reduceRight(
			arrayLike,
			function (acc, v) {
				i += 1;
				arrayLike[arrayLike.length] = v + 3;
				arrayLike.length += 1;
			},
			null
		);
		st.deepEqual(Array.prototype.slice.call(arrayLike), [1, 2, 3, 6, 5, 4], 'arrayLike has received 3 new elements. initialValue provided');
		st.equal(i, 3, 'reduceRight callback only called thrice');

		st.end();
	});

	t.test('empty array', function (st) {
		var initialValue = {};
		var actual = reduceRight([], identity, initialValue);
		st.equal(actual, initialValue, 'empty array returns callback return');

		st['throws'](
			function () { reduceRight([], identity); },
			TypeError,
			'empty array with omitted initialValue throws'
		);

		var sparse = Array(10);
		st['throws'](
			function () { reduceRight(sparse, identity); },
			TypeError,
			'only-holes array with omitted initialValue throws'
		);

		st.end();
	});

	t.test('skips holes', function (st) {
		var arr = [1, undefinedIfNoSparseBug, 3];
		var visited = {};
		reduceRight(
			arr,
			function (a, b) {
				if (a) { visited[a] = true; }
				if (b) { visited[b] = true; }
				return 0;
			},
			null
		);
		st.deepEqual(visited, { 1: true, 3: true }, 'only non-holes are visited; initialValue provided');

		visited = {};
		reduceRight(
			arr,
			function (a, b) {
				if (a) { visited[a] = true; }
				if (b) { visited[b] = true; }
				return 0;
			}
		);
		st.deepEqual(visited, { 1: true, 3: true }, 'only non-holes are visited; initialValue omitted');

		st.end();
	});

	t.test('list arg boxing', function (st) {
		st.plan(4);

		reduceRight(
			'f',
			function (acc, item, index, list) {
				st.equal(acc, null, 'accumulator matches');
				st.equal(item, 'f', 'letter matches');
				st.equal(typeof list, 'object', 'primitive list arg is boxed');
				st.equal(Object.prototype.toString.call(list), '[object String]', 'boxed list arg is a String');
			},
			null
		);

		st.end();
	});

	t.test('test262: 15.4.4.22-3-12', function (st) {
		var testResult1 = true;
		var testResult2 = false;

		var obj = {
			0: 11,
			1: 12,
			2: 9,
			length: '-4294967294'
		};

		var cb = function callbackfn(prevVal, curVal, idx, object) {
			st.equal(object, obj, '4th argument is receiver');
			if (idx > 1) {
				testResult1 = false;
			}

			if (idx === 1) {
				testResult2 = true;
			}
			return false;
		};

		reduceRight(obj, cb, 1);

		st.ok(testResult1, 'testResult1 !== true');
		st.equal(testResult2, false, 'testResult2 is false');

		st.end();
	});

	t.test('test262: 15.4.4.22-3-25.js', function (st) {
		var testResult1 = true;
		var testResult2 = false;

		var obj = {
			0: 12,
			1: 11,
			2: 9,
			length: -4294967294.5
		};

		var cb = function callbackfn(prevVal, curVal, idx, object) {
			st.equal(object, obj, '4th argument is receiver');
			if (idx > 1) {
				testResult1 = false;
			}

			if (idx === 1) {
				testResult2 = true;
			}
			return false;
		};

		reduceRight(obj, cb, 1);

		st.ok(testResult1, 'testResult1 !== true');
		st.equal(testResult2, false, 'testResult2 is false');

		st.end();
	});
};
