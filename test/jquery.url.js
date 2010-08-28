module('jQuery.url()');

test('jQuery.url()', function () {
	var url = jQuery.url('http://www.jquery.com');
	ok(url instanceof jQuery.url.URL);
});

module('jQuery().url()');

test('jQuery().url()', function () {
	var url = $('<a href="http://www.example.com">').url();
	ok(url instanceof jQuery.url.URL);
});
