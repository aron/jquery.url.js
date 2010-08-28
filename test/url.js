module('URL()');

var url_string = 'http://api.jquery.com/jQuery.ajax/?key1=value1&key2=value2&key3#jQuery.ajax-settings';

test('new URL()', function () {
	var url = new URL('http://www.jquery.com');
	ok(url instanceof URL);
});

test('url.attr() -> getter', function () {
	var url = new URL(url_string);

	equals(url.attr('hash'), '#jQuery.ajax-settings', 'url.attr("hash")');
	equals(url.attr('host'), 'api.jquery.com', 'url.attr("host")');
	equals(url.attr('hostname'), 'api.jquery.com', 'url.attr("hostname")');
	equals(url.attr('href'), url_string, 'url.attr("href")');
	equals(url.attr('pathname'), '/jQuery.ajax/', 'url.attr("pathname")');
	equals(url.attr('port'), '', 'url.attr("port")');
	equals(url.attr('protocol'), 'http:', 'url.attr("protocol")');
	equals(url.attr('search'), '?key1=value1&key2=value2&key3', 'url.attr("search")');
	equals(url.attr(), undefined, 'url.attr()');

	equals(url.attr('source'), url_string, 'url.attr("source")');
	equals(url.attr('path'), '/jQuery.ajax/', 'url.attr("path")');
	equals(url.attr('query'), '?key1=value1&key2=value2&key3', 'url.attr("query")');
	same(url.attr('params'), {key1:'value1', key2:'value2', key3:''}, 'url.attr("params")');
	same(url.attr('segments'), ['jQuery.ajax'], 'url.attr("segments")');

	url = new URL('http://api.jquery.com:8080/');
	equals(url.attr('port'), 8080, 'url.attr("port")');

	url = new URL('http://api.jquery.com:80/');
	equals(url.attr('port'), 80, 'url.attr("port")');
});

test('url.attr() -> setter', function () {
	var url = new URL('');
	url.attr('hash', '#hash')
	   .attr('host', 'example.com')
	   .attr('pathname', '/part1/part2')
	   .attr('port', '8080')
	   .attr('protocol', 'https:')
	   .attr('search', '?param1=value1');

	equals(url.get(), 'https://example.com:8080/part1/part2/?param1=value1#hash', 'setter url.attr()');
	
	url.attr('href', 'http://www.example.com');
	equals(url.get(), 'http://www.example.com/');
});

test('url.segment() -> getter', function () {
	var url = new URL(url_string);
	equals(url.segment(0), 'jQuery.ajax');
	equals(url.segment(6), undefined);
	same(url.segment(), ['jQuery.ajax']);
});

test('url.segment() -> setter', function () {
	var url = new URL(url_string);
	url.segment(0, 'segment1').segment(6, 'segment5');

	equals(url.segment(0), 'segment1');
	equals(url.segment(6), 'segment5');
});

test('url.param() -> getter', function () {
	var url = new URL(url_string);

	equals(url.param('key1'), 'value1');
	equals(url.param('key2'), 'value2');
	equals(url.param('key3'), '');
	equals(url.param('key4'), undefined);
	same(url.param(), {key1:'value1',key2:'value2',key3:''});
});

test('url.param() -> setter', function () {
	var url = new URL(url_string);

	url.param('key4', 'value4').param('key1', 'updated1');

	equals(url.param('key1'), 'updated1');
	equals(url.param('key4'), 'value4');
});

test('url.get()', function () {
	var url = new URL(url_string);
	equals(url.get(), url_string);
});

test('url.toString()', function () {
	var url = new URL(url_string);
	equals(url.toString(), url_string);
});
