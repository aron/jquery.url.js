module('jQuery.url()');

test('jQuery.url()', function () {
	var url = jQuery.url('http://www.jquery.com');
	ok(url instanceof jQuery.url.URL);
});

test('jQuery(":local")', function () {
	var $anchor = $('<a href="/blog/index/">');
	ok($anchor.is(':local'));
	$anchor.appendTo('#qunit-fixture');
	ok($('#qunit-fixture a:local').length === 1);
});

test('jQuery(":remote")', function () {
	var $anchor = $('<a href="http://www.example.com">');
	ok($anchor.is(':remote'));
	$anchor.appendTo('#qunit-fixture');
	ok($('#qunit-fixture a:remote').length === 1);
});

module('jQuery().url()');

test('jQuery().url()', function () {
	var url = $('<a href="http://www.example.com">').url();
	ok(url instanceof jQuery.url.URL);
});
