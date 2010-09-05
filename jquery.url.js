// jQuery URL Toolbox
// Written by Mark Perkins, mark@allmarkedup.com
// License: http://unlicense.org/ (i.e. do what you want with it!)

;(function($, window, undefined) {

	var anchor = document.createElement('a'),
	    setters, getters, aliases;

	function truthy(value) {
		return [undefined, null, NaN].indexOf(value) === -1;
	}

	// ! Utilities

	// http://javascript.crockford.com/remedial.html
	function supplant(string, values) {
		return string.replace(/{([^{}]*)}/g,
				function (match, tag) {
						var value = values[tag];
						return (typeof value === 'string' || typeof value === 'number') ? value : match;
				}
		);
	}

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

	function extend(reciever, object) {
		forEach(object, function (value, key) {
			reciever[key] = value;
		});
		return reciever;
	}

	// ! Private Functions

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

	function getAttribute(key) {
		if (typeof getters[key] === 'function') {
			return getters[key].call(this);
		}
		return this[key];
	}

	function setAttribute(key, value) {
		if (typeof setters[key] === 'function') {
			setters[key].call(this, value);
		} else {
			this[key] = value;
		}
	}

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

	function alias(key, func) {
		return function () {
			return func.call(this, key);
		};
	}

	getters = {
		href: function () {
			var data = extend({}, this);
			data.search   = getters.search.call(this);
			data.pathname = getters.pathname.call(this);
			data.port     = this.port ? ':' + this.port : '';
			return supplant(URL.template, data);
		},
		pathname: function () {
			var path = this.segments.join('/');
			return path ? ('/' + path + '/') : '/';
		},
		search: function () {
			var key, params = this.params, search = [];
			for (key in params) {
				search.push(key + ((params[key]) ? ('=' + params[key]) : ''));
			}
			return (search.length) ? '?' + search.join('&') : '';
		}
	};

	setters = {
		href: function (value) {
			extend(this, getURLData(value));
		},
		pathname: function (value) {
			if (typeof value === 'object') {
				value = getters.pathname.call(this);
			}
			this.segments = value.replace(/^\/|\/$/g, '').split('/');
		},
		port: function (value) {
			value = parseInt(value, 10);
			if ( ! value) {
				value = '';
			}
			this.port = value;
		},
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

	aliases = {
		hostname: 'host',
		source: 'href',
		path: 'pathname',
		query: 'search'
	};

	forEach(aliases, function (attr, key) {
		getters[key] = alias(attr, getAttribute);
		setters[key] = alias(attr, setAttribute);
	});

	// ! Public API

	function URL(url) {
		this._data = getURLData(url);
	}

	URL.template = '{protocol}//{host}{port}{pathname}{search}{hash}';

	URL.prototype = {
		constructor: URL,
		segment: function (index, value) {
			return getOrSetObjectBasedAttribute.call(this, 'segments', index, value);
		},
		param: function (key, value) {
			return getOrSetObjectBasedAttribute.call(this, 'params', key, value);
		},
		attr: function (key, value) {
			if (value === undefined) {
				return getAttribute.call(this._data, key);
			}
			setAttribute.call(this._data, key, value);
			return this;
		},
		get: function () {
			return this.attr('href');
		},
		toString: function () {
			return this.attr('href');
		}
	};

	if ($ === undefined) {
		window.URL = URL;
	} else {
		$.url = function (url) {
			var map = {
				a: 'href', img: 'src', form: 'action', base: 'href',
				script: 'src', iframe: 'src', link: 'href'
			};

			if (url instanceof jQuery) { url = url.get(0); }
			if (url.tagName) { url = url[map[url.tagName]]; }

			return new URL(url);
		};

		$.fn.url = function () {
			return $.url(this);
		};

		$.url.URL = URL;
	}
})(this.jQuery, this);
