module('URL()');

var url_string = 'http://api.jquery.com/jQuery.ajax/?key1=value1&key2=value2&key3#jQuery.ajax-settings';

test('new URL()', function () {
	var url = new URL('http://www.jquery.com');
	ok(url instanceof URL);
});

test('url.attr()', function () {
	var url = new URL(url_string);

	equals(url.attr('hash'), '#jQuery.ajax-settings', 'url.attr("hash")');
	equals(url.attr('host'), 'api.jquery.com', 'url.attr("host")');
	equals(url.attr('hostname'), 'api.jquery.com', 'url.attr("hostname")');
	equals(url.attr('href'), url_string, 'url.attr("href")');
	equals(url.attr('pathname'), '/jQuery.ajax/', 'url.attr("pathname")');
	equals(url.attr('port'), '', 'url.attr("port")');
	equals(url.attr('protocol'), 'http:', 'url.attr("protocol")');
	equals(url.attr('search'), '?key1=value1&key2=value2&key3', 'url.attr("search")');
	equals(url.attr('params'), {key1:'value1', key2:'value2', key3:''}, 'url.attr("params")');
	equals(url.attr(), undefined, 'url.attr()');

	url = new URL('http://api.jquery.com:8080/');
	equals(url.attr('port'), 8080, 'url.attr("port")');

	url = new URL('http://api.jquery.com:80/');
	equals(url.attr('port'), 80, 'url.attr("port")');
});

test('url.segment()', function () {
	var url = new URL(url_string);

	equals(url.segment(1), 'jQuery.ajax');
});

test('url.param()', function () {
	var url = new URL(url_string);

	equals(url.param('key1'), 'value1');
	equals(url.param('key2'), 'value2');
	equals(url.param('key3'), '');
	equals(url.param('key4'), undefined);
});

test('url.get()', function () {
	var url = new URL(url_string);
	equals(url.get(), url_string);
});

test('url.toString()', function () {
	var url = new URL(url_string);
	equals(url.toString(), url_string);
});
