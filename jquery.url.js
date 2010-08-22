// jQuery URL Toolbox
// Written by Mark Perkins, mark@allmarkedup.com
// License: http://unlicense.org/ (i.e. do what you want with it!)

;(function($, window, undefined) {

	var properties,
	    map;

	properties = ['hash', 'href', 'host', 'pathname', 'port', 'protocol', 'search'];

	map = {
		hash: 'hash',
		host: 'host',
		hostname: 'host',
		pathname: 'pathname',
		port: function (key, value) {
			var anchor_port = this._anchor['port'];
			if ((key === 'port' && value == 80) || (key === 'href' && (/\:80[^\d]/).test(value))) {
				value = 80;
			}
			else if (anchor_port === '0' || anchor_port === '') {
				value = '';
			} else {
				value = parseInt(anchor_port, 10);
			}
			return value;
		},
		protocol: 'protocol',
		search: 'search',
		params: function (key, value) {
			var params = {};
			return params;
		},
		href: function (key, value) {
			return this.toString();
		}
	};

	function isURLProperty(property) {
		return (properties.indexOf(property) !== -1);
	}

	function URL(url) {
		this._anchor = document.createElement('a');
		this.update('href', url);
	}

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
				return this[key];
			}
		},
		get: function () {
			return this.toString();
		},
		toString: function () {
			return [
				this.protocol,
				'//',
				this.host,
				(this.port ? ':' + this.port : ''),
				this.pathname,
				this.search,
				this.hash
			].join('');
		},
		update: function (key, value) {
			var index = 0,
			    length = properties.length,
			    property;

			if (isURLProperty(key)) {
				this._anchor[key] = value;
			}

			for (property in map) {
				if (typeof map[property] === 'function') {
					this[property] = map[property].call(this, key, value);
				} else {
					this[property] = this._anchor[property];
				}
			}
		}
	};

	if ($ === undefined) {
		window.URL = URL;
	} else {

	}
})(this.jQuery, this);
