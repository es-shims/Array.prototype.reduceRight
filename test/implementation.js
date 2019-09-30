var implementation = require('../implementation');
var bind = require('function-bind');
var test = require('tape');
var runTests = require('./tests');

test('as a function', function (t) {
	t.test('bad array/this value', function (st) {
		st['throws'](bind.call(implementation, null, undefined, 'a'), TypeError, 'undefined is not an object');
		st['throws'](bind.call(implementation, null, null, 'a'), TypeError, 'null is not an object');
		st.end();
	});

	runTests(bind.call(Function.call, implementation), t);

	t.end();
});
