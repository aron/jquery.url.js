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
		path: 'pathname',
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
		query: 'search',
		params: function (key, value) {
			var params = {},
			    query = this.search.replace(/^\?/, '').split('&'),
			    index = 0,
			    length = query.length,
			    param;

			for (; index < length; index += 1) {
				param = query[index].split('=');
				params[param[0]] = '';
				if (param[1]) {
					params[param[0]] = param[1];
				}
			}
			return params;
		},
		segments: function (key, value) {
			return this.pathname.replace(/^\/|\/$/g, '').split('/');
		},
		href: function (key, value) {
			this.source = this.toString();
			return this.source;
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
				if (map.hasOwnProperty(property)) {
					if (typeof map[property] === 'function') {
						this[property] = map[property].call(this, key, value);
					} else {
						this[property] = this._anchor[map[property]];
					}
				}
			}
		}
	};

	if ($ === undefined) {
		window.URL = URL;
	} else {

	}
})(this.jQuery, this);
