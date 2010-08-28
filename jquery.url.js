// jQuery URL Toolbox
// Written by Mark Perkins, mark@allmarkedup.com
// License: http://unlicense.org/ (i.e. do what you want with it!)

;(function($, window, undefined) {

	var anchor = document.createElement('a'),
	    properties, setters, getters, aliases;

	properties = ['hash', 'host', 'pathname', 'port', 'protocol', 'search'];

	// http://javascript.crockford.com/remedial.html
	function supplant(string, values) {
		return string.replace(/{([^{}]*)}/g,
				function (match, tag) {
						var value = values[tag];
						return (typeof value === 'string' || typeof value === 'number') ? value : match;
				}
		);
	}

	function extend(reciever, object) {
		var key;
		for (key in object) {
			if (object.hasOwnProperty(key)) {
				reciever[key] = object[key];
			}
		}
		return reciever;
	}

	function mapAttributes(key, value) {
		object = value === undefined ? getters : setters;
		if (typeof object[key] === 'function') {
			value = object[key].call(this, value);
		} else if (value === undefined) {
			value = this[key];
		} else {
			this[key] = value;
		}
		return value;
	}

	function alias(key, map) {
		return function () {
			return mapAttributes.call(this, key);
		};
	}

	aliases = {
		hostname: 'host',
		source: 'href',
		path: 'pathname',
		query: 'search'
	};

	getters = {
		href: function () {
			var data = extend({}, this);
			data.search   = getters.search.call(this);
			data.pathname = getters.pathname.call(this);
			data.port     = this.port ? ':' + this.port : '';
			return supplant(URL.template, data);
		},
		pathname: function () {
			return '/' + this.pathname.join('/') + '/';
		},
		search: function () {
			var key, params = this.search, search = [];
			for (key in params) {
				search.push(key + ((params[key]) ? ('=' + params[key]) : ''));
			}
			return '?' + search.join('&');
		},
		params: function () {
			return this.search;
		},
		segments: function () {
			return this.pathname;
		}
	};

	setters = {
		pathname: function (value) {
			if (typeof value === 'object') {
				value = getters.pathname.call(this);
			}
			this.pathname = value.replace(/^\/|\/$/g, '').split('/');
		},
		port: function (value) {
			value = parseInt(value, 10);
			if ( ! value) {
				value = '';
			}
			this.port = value;
		},
		search: function (value) {
			var params = {},
			    search = value,
			    query,
			    index = 0,
			    length,
			    param;

			if (typeof search === 'object') {
				search = getters.search.call(this);
			}

			query = search.replace(/^\?/, '').split('&');
			for (length = query.length; index < length; index += 1) {
				param = query[index].split('=');
				params[param[0]] = '';
				if (param[1]) {
					params[param[0]] = param[1];
				}
			}
			this.search = params;
		}
	};

	for (var key in aliases) {
		getters[key] = alias(aliases[key], getters);
		setters[key] = alias(aliases[key], setters);
	}

	function URL(url) {
		var data = {},
		    index, length = properties.length, property;

		anchor.href = url;
		for (index = 0; index < length; index += 1) {
			property = properties[index];
			mapAttributes.call(data, properties[index], anchor[property]);
		}
		if (/\:80\//.test(url)) {
			data.port = 80;
		}
		this._data = data;
	}

	URL.template = '{protocol}//{host}{port}{pathname}{search}{hash}';

	URL.prototype = {
		constructor: URL,
		attr: function () {

		},
		segment: function () {

		},
		param: function () {

		},
		attr: function (key, value) {
			if (value === undefined) {
				return mapAttributes.call(this._data, key);
			}
			mapAttributes.call(this._data, key, value);
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

	}
})(this.jQuery, this);
