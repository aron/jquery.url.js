module('URL()');

var url_string = 'http://api.jquery.com/jQuery.ajax/?key1=value1&key2=value2&key3#jQuery.ajax-settings';

test('new URL()', function () {
	var url = new URL('http://www.jquery.com');
	ok(url instanceof URL);
});

test('URL#attr()', function () {
	var url = new URL(url_string);

	equals(url.attr('hash'), '#jQuery.ajax-settings');
	equals(url.attr('host'), 'api.jquery.com');
	equals(url.attr('hostname'), 'api.jquery.com');
	equals(url.attr('href'), url_string, 'href');
	equals(url.attr('pathname'), 'jQuery.ajax');
	equals(url.attr('port'), '');
	equals(url.attr('protocol'), 'http:');
	equals(url.attr('search'), '?key1=value1&key2=value2&key3');
	equals(url.attr(), undefined);
});

test('URL#segment()', function () {
	var url = new URL(url_string);

	equals(url.segment(1), 'jQuery.ajax');
});

test('URL#param()', function () {
	var url = new URL(url_string);

	equals(url.param('key1'), 'value1');
	equals(url.param('key2'), 'value2');
	equals(url.param('key3'), '');
	equals(url.param('key4'), undefined);
});

test('URL#get()', function () {
	var url = new URL(url_string);
	equals(url.get(), url_string);
});

test('URL#toString()', function () {
	var url = new URL(url_string);
	equals(url.toString(), url_string);
});
