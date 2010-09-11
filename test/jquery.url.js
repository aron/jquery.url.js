module('jQuery.url()');

test('jQuery.url()', function () {
	var url = jQuery.url('http://www.jquery.com');
	ok(url instanceof jQuery.url.URL);
});

test('jQuery(":local")', function () {
	var $anchor = $('<a href="/blog/index/"></a>');
	ok($anchor.is(':local'), '/blog/index/ should be local');
	$anchor.appendTo('#qunit-fixture');
	ok($('#qunit-fixture a:local').length === 1, '"a:local" should find an anchor');
});

test('jQuery(":remote")', function () {
	var $anchor = $('<a href="http://www.example.com"></a>');
	ok($anchor.is(':remote'), 'http://www.example.com should be remote');
	$anchor.appendTo('#qunit-fixture');
	ok($('#qunit-fixture a:remote').length === 1, 'http://www.example.com');
});

module('jQuery().url()');

test('jQuery().url()', function () {
	var url = $('<a href="http://www.example.com"></a>').url();
	ok(url instanceof jQuery.url.URL, 'url should be an instance of URL');
});
