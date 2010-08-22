// jQuery URL Toolbox
// Written by Mark Perkins, mark@allmarkedup.com
// License: http://unlicense.org/ (i.e. do what you want with it!)

;(function($, window, undefined) {

	var properties,
	    map;

	properties = ['hash', 'href', 'host', 'hostname', 'pathname', 'port', 'protocol', 'search'];

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

			for (; index < length; index += 1) {
				property = properties[index];
				if (property === 'port') {
					if ((key === 'port' && value == 80) || (key === 'href' && (/\:80[^\d]/).test(value))) {
						this[property] = 80;
					}
					else if (this._anchor[property] === '0' || this._anchor[property] === '') {
						this[property] = '';
					} else {
						this[property] = parseInt(this._anchor[property], 10);
					}
				} else {
					this[property] = this._anchor[property];
				}
			}
			this['href'] = this.toString();
		}
	};

	if ($ === undefined) {
		window.URL = URL;
	} else {

	}
})(this.jQuery, this);
