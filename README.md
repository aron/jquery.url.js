jQuery URL Toolbox
=================

**NOT PRODUCTION READY YET -  USE WITH CAUTION PLEASE**

Provides a set of useful tools for working with URLs and DOM elements that take URL values for some attributes. 

License
-------

http://unlicense.org/ - i.e. do what you want with it :-)

Quick usage notes
-----------------

Use  `var myUrl = $(element).url()` to grab an element's  URL and return a special 'URL' object. (`a`, `form`, `img`, `base`, `link` and `iframe` elements are supported, and using 'document' (no quotes) as the selector will return a URL object based on the current page's URL)

Then use `myUrl.attr('theAttr')` to return any part of the URL, where 'theAttr' can be any one of: `source`, `protocol`, `host`, `port`, `query`, `file`, `hash` or `path`.

If you include a second argument to the attr() method – i.e. something like `myUrl.attr('path', '/myNewPath/')`, then it will **set** the value of that part of the URL to the value of the second argument. Whatever the URL of element the initial `url()` function was called on will be updated accordingly. If the document URL was used (via `$(document).url()`) then the location will be changed accordingly, normally resulting in a page refresh.

Doing a `.toString()` on the URL object at any time will return the current string representation of the URL.

The `.segment(i)` method (where 'i' is the segment number, starting from zero) will return the corresponding segment from the URL. Including a second parameter will set that segment.

The `.param('key')` method (where 'key' is the query string key) will return the corresponding value of the suppied key in the URL query (GET) string, if there is one. Including a second parameter will set that parameter.
