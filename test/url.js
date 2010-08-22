module('URL()');

test('new URL()', function () {
	var url = new URL('http://www.jquery.com');
	ok(url instanceof URL, 'URL() returns a new instance');
});
