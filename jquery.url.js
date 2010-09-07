// jQuery URL Toolbox
// Written by Mark Perkins, mark@allmarkedup.com
// License: http://unlicense.org/ (i.e. do what you want with it!)

;(function($, window, undefined) {

	var anchor = document.createElement('a'),
	    setters, getters, aliases;

	// ! Utilities

	// Check whether or not a variable is a truthy value.
	//
	// value  - The value to check.
	//
	// Examples
	//
	//   truthy(6);
	//   //=> true
	//
	//   truthy(parseInt('Cat', 10));
	//   //=> false
	//
	// Returns true if the value is truthy

	function truthy(value) {
		return ! (value === undefined || value === null || (typeof value === 'number' && isNaN(value)));
	}

	// Replaces {tokens} within a string with values.
	//
	// Source: http://javascript.crockford.com/remedial.html
	//
	// string - A String containing tokens.
	// values - An Object containing key/value pairs.
	//
	// Examples
	//
	//   supplant('My name is {name}', {name: 'Bill'});
	//   //=> 'My name is Bill'
	//
	// Returns a String with tokens replaced.

	function supplant(string, values) {
		return string.replace(/{([^{}]*)}/g,
				function (match, tag) {
						var value = values[tag];
						return (typeof value === 'string' || typeof value === 'number') ? value : match;
				}
		);
	}

	// Iterates over any object or Array-like object and calls the
	// callback function passing in the key and value as parameters.
	//
	// object   - The Object to iterate over.
	// callback - A callback Function to call on each iteration, it
	//            recieves the value, key and object as parameters.
	// context  - The object that represents "this" within the callback.
	//            Defaults to the global object.
	//
	// Examples
	//
	//    foreach([1, 2, 3], function (v, k, a) {
	//      console.log('Index: ' + v + ' Value: ' + k + ', ');
	//    })
	//    // Outputs "Index: 1 Value: 1, Index: 2 Value: 2, Index: 3 Value: 3, "
	//
	// Returns nothing.

	function forEach(object, callback, context) {
		var index, length;
		if (object.length) {
			if (Array.prototype.forEach) {
				Array.prototype.forEach.call(object, callback, context);
			} else {
				for (index = 0, length = index.length; index < length; index += 1) {
					callback.call(context || this, object[index], index, object);
				}
			}
		} else {
			for (index in object) {
				if (object.hasOwnProperty(index)) {
					callback.call(context || this, object[index], index, object);
				}
			}
		}
	}

	// Extends an object with the properties of another.
	//
	// reciever - An object to extend.
	// object   - An object of properties.
	//
	// Examples
	//
	//    extend({name: 'Bill'}, {age: 20});
	//    //=> {name: 'Bill', age: 20}
	//
	// Returns the extended Object.

	function extend(reciever, object) {
		forEach(object, function (value, key) {
			reciever[key] = value;
		});
		return reciever;
	}

	// ! Private Functions

	// Accepts a URL and breaks it into individual properties.
	//
	// The returned object has the following properties.
	// :protocol => A String of the protocol eg. http
	// :host     => The URL domain String.
	// :port     => The port as an Integer if present in the URL
	//              else an empty string.
	// :segments => An Array of path segments.
	// :hash     => The hash String including #.
	// :params   => An Object of key/value query parameters.
	//
	// url - A URL String
	//
	// Examples
	//
	//   getURLData('http://www.example.com/stuff/?page=1');
	//   //=> {protocol: 'http', host: 'www.example.com',
	//          port: '', segments: ['stuff'], hash: '',
	//          params: {page: 1}}
	//
	// Returns an Object of metadata.


	function getURLData(url) {
		var data = {};
		anchor.href = url;

		forEach(['hash', 'host', 'port', 'protocol'], function (property) {
			setAttribute.call(data, property, anchor[property]);
		});

		setters.pathname.call(data, anchor.pathname);
		setters.search.call(data, anchor.search);
		if (/\:80\//.test(url)) { data.port = 80; }
		return data;
	}

	// Returns the URL attribute for the key supplied.
	//
	// Either returns the key directly from the data object (this)
	// or if there is a getter defined for the key call and
	// return the getter function.
	//
	// key - String for the attribute key eg. 'hash'.
	//
	// Examples
	//
	//   getAttribute('hash');
	//   //=> '#value'
	//
	// Returns the URL attribute for the key supplied.

	function getAttribute(key) {
		if (typeof getters[key] === 'function') {
			return getters[key].call(this);
		}
		return this[key];
	}

	// Sets the URL attribute for the key to the value supplied.
	//
	// Either sets the value directly on the context or if a
	// setter exists for the key calls it passing the value in
	// as a property.
	//
	// key   - String for the attribute key. eg. 'params'.
	// value - Any JavaScript data type suitable for the attribute.
	//
	// Examples
	//
	//   setAttribute('params', {param1: 'value1'});
	//   //=> The params property will be set to  {param1: 'value1'}.
	//
	// Returns nothing.

	function setAttribute(key, value) {
		if (typeof setters[key] === 'function') {
			setters[key].call(this, value);
		} else {
			this[key] = value;
		}
	}

	// Convenience function for making setting/getting object
	// based attributes such as "params" and "segments" easier.
	//
	// If no key is provided the function returns the entire Object.
	//
	// attr  - The attribute String to set or get. eg. 'params'
	// key   - The key String/index Integer of the attribute.
	// value - The value to set.
	//
	// Examples
	//
	//   getOrSetObjectBasedAttribute('segments', 1, 'edit');
	//   //=> Sets the second path segment to 'edit'.
	//
	// Returns either the key value or the entire Object.

	function getOrSetObjectBasedAttribute(attr, key, value) {
		var params = this.attr(attr);
		if (truthy(key) && truthy(value)) {
			params[key] = value;
			this.attr(attr, params);
			return this;
		}
		else if (truthy(key)) {
			return params[key];
		}
		return params;
	}

	// Provides an alias to a getter/setter function.
	//
	// Makes it easy to set up aliased methods to the data
	// attributes. For example aliasing a 'query' attribute
	// to return the 'search' string.
	//
	// key      - The attribute to alias.
	// function - Either the getAttribute or setAttribute
	//            Function
	// Examples
	//
	//   getters.query = alias('search', getAttribute);
	//   url.attr('query');
	//   //=> {param1: 'value1'}
	//
	// Returns the aliased Function.

	function alias(key, func) {
		return function () {
			return func.call(this, key);
		};
	}

	// Getters are used to pre-parse or format attributes.
	// Each attribute has access to the URL data object
	// and can return any value.

	getters = {

		// Compiles the full URL from the data object.
		//
		// Returns recompiled URL String.

		href: function () {
			var data = extend({}, this);
			data.search   = getters.search.call(this);
			data.pathname = getters.pathname.call(this);
			data.port     = this.port ? ':' + this.port : '';
			return supplant(URL.template, data);
		},

		// Returns the pathname string by joining the segments Array.

		pathname: function () {
			var path = this.segments.join('/');
			return path ? ('/' + path + '/') : '/';
		},

		// Returns the "search" query string by compiling the
		// parameters object.

		search: function () {
			var key, params = this.params, search = [];
			for (key in params) {
				search.push(key + ((params[key]) ? ('=' + params[key]) : ''));
			}
			return (search.length) ? '?' + search.join('&') : '';
		}
	};

	// Setters are used to preparse values before assigning
	// them to the properties on the context.

	setters = {

		// Parses a URL string and assigns it to the data object.
		//
		// value - A full or partial URL String.
		//
		// Returns nothing.

		href: function (value) {
			extend(this, getURLData(value));
		},

		// Sets the segments attribute by expanding the path String.
		//
		// value - A filepath String eg. "/users/bill"
		//
		// Returns nothing.

		pathname: function (value) {
			if (typeof value === 'object') {
				value = getters.pathname.call(this);
			}
			this.segments = value.replace(/^\/|\/$/g, '').split('/');
		},

		// Sets the port attribute, defaults to an empty String.
		//
		// port - An Integer for the port number.
		//
		// Returns nothing.

		port: function (port) {
			port = parseInt(port, 10);
			if ( ! truthy(port)) {
				port = '';
			}
			this.port = port;
		},

		// Sets the params attribute from the search String.
		//
		// search - A url-form-encoded query String.
		//
		// Returns nothing.

		search: function (search) {
			var params = {},
			    query;

			if (typeof search === 'object') {
				search = getters.search.call(this);
			}

			search = search.replace(/^\?/, '');
			if (search) {
				query = search.split('&');
				forEach(query, function (pair) {
					param = pair.split('=');
					params[param[0]] = '';
					if (param[1]) {
						params[param[0]] = param[1];
					}
				});
			}
			this.params = params;
		}
	};

	// Common aliases to the default attributes.
	aliases = {
		hostname: 'host',
		source:   'href',
		path:     'pathname',
		query:    'search',
		domain:   'hostname'
	};

	// Assign the aliages to the getter and setter objects.
	forEach(aliases, function (attr, key) {
		getters[key] = alias(attr, getAttribute);
		setters[key] = alias(attr, setAttribute);
	});

	// ! Public API

	// Constructor that assigns the private _data property.
	//
	// url - A full or partial URL String.
	//
	// Returns nothing.

	function URL(url) {
		this._data = getURLData(url);
	}

	// A template for a full URL String.

	URL.template = '{protocol}//{host}{port}{pathname}{search}{hash}';

	URL.prototype = {

		constructor: URL,

		// Gets and sets the path segments attribute.
		//
		// If no parameters are passed in the full segments Array will be
		// returned. If an index is provided that segment String will be
		// returned or undefined if not found.
		// To set a segment pass the index Integer and a String value. The
		// URL instance will be returned to enable method chaining.
		//
		// index - An Integer of the segment index (Optional).
		// value - A String for the segment value (Optional).
		//
		// Examples
		//
		//   url = new URL('/this/is/a/path/');
		//   url.segment(1);
		//   //=> 'is'
		//
		//   url.segment(3, 'cabbage').attr('path');
		//   //=> '/this/is/a/cabbage'
		//
		//   url.segment();
		//   //=> ['this', 'is', 'a', 'path']
		//
		// Returns either an Array a String or a URL instance.

		segment: function (index, value) {
			return getOrSetObjectBasedAttribute.call(this, 'segments', index, value);
		},

		// Gets and sets the query param attribute.
		//
		// If no parameters are passed in the full params Object will be
		// returned.
		// If a key String is provided that parameter String will be
		// returned or undefined if not found.
		// To set a parameter pass the key String and a value. The
		// URL instance will be returned to enable method chaining.
		//
		// key   - A String of the parameter key (Optional).
		// value - A String for the parameter value (Optional).
		//
		// Examples
		//
		//   url = new URL('/search/?q=bagels&page=1');
		//   url.param('q');
		//   //=> 'bagels'
		//
		//   url.param('page', '2').attr('search');
		//   //=> '?q=bagels&page=2'
		//
		//   url.param();
		//   //=> {q: 'bagels', page: 2}
		//
		// Returns either an Object a String or a URL instance.

		param: function (key, value) {
			return getOrSetObjectBasedAttribute.call(this, 'params', key, value);
		},

		// Gets or Sets a URL attribute.
		//
		// When only the key is provided the requested property is returned
		// or undefined if it does not exist. When a key and value are
		// passed in, the attribute is set and the instance is returned
		// to allow chaining.
		//
		// key   - String for the attribute key to get/set.
		// value - Value to set to the attribute.
		//
		// Examples
		//
		//   url = new URL('http://example.com/search/?q=bagels&page=1');
		//   url.attr('protocol');
		//   //=> 'http'
		//
		//   url.attr('path', 'index').attr('search', '').get();
		//   //=> 'http://example.com/index/'
		//
		// Returns either the attribute or the URL instance.

		attr: function (key, value) {
			if (value === undefined) {
				return getAttribute.call(this._data, key);
			}
			setAttribute.call(this._data, key, value);
			return this;
		},

		// Returns the full URL an alias of URL#toString().
		//
		// Example
		//
		//   url = new URL('http://example.com/search/?q=bagels&page=1');
		//   url.get();
		//   //=> 'http://example.com/search/?q=bagels&page=1'
		//
		// Returns the URL String.

		get: function () {
			return this.attr('href');
		},

		// Returns the full URL.
		//
		// Example
		//
		//   url = new URL('http://example.com/search/?q=bagels&page=1');
		//   url.toString();
		//   //=> 'http://example.com/search/?q=bagels&page=1'
		//
		// Returns the URL String.

		toString: function () {
			return this.attr('href');
		}
	};

	if ($ === undefined) {
		// Assigns the URL to the global object.
		window.URL = URL;
	} else {

		// Returns a URL instance.
		//
		// Accepts a simple URL string. An HTML element that has a URL
		// attribute such as an <a> or <form> or a jQuery collection in
		// which case only the first item will be used.
		//
		// url - An HTML Element, jQuery collection or String
		//
		// Examples
		//
		//   $.url($('a'));
		//   $.url(document.getElementById('my-form'));
		//   $.url('http://jquery.com');
		//
		// Returns a URL instance.

		$.url = function (url) {
			var map = {
				a: 'href', img: 'src', form: 'action', base: 'href',
				script: 'src', iframe: 'src', link: 'href'
			};

			if (url instanceof jQuery) { url = url.get(0); }
			if (url.tagName) { url = url[map[url.tagName]]; }

			return new URL(url);
		};

		// Returns a URL instance if the jQuery object contains an
		// HTML element from which a URL can be extracted.
		//
		// NOTE: Like jQuery#attr() this method acts only on the first
		// item in the collection returning one instance.
		//
		// Examples
		//
		//   $('<a href="http://jquery.com">').url().get();
		//   //=> 'http://jquery.com'
		//
		// Returns an instance of URL.

		$.fn.url = function () {
			return $.url(this);
		};

		// Export the URL consructor to the namespace.
		$.url.URL = URL;
	}
})(this.jQuery, this);
