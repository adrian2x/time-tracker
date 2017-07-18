var defaults = require('superagent-defaults');
var superagent = require('superagent');

const superagentPromise = require('superagent-promise-plugin');
// Patch superagent to use `es6-promise` shim.
superagentPromise.Promise = require('es6-promise').Promise;
superagent = superagentPromise.patch(superagent);

const request = defaults(superagent);
request.set('Accept', 'application/json');
request.set('Content-Type', 'application/json');
module.exports = request;
