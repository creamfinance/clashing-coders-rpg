var Class = require('class');
var BaseContext = require('./BaseContext');
var AuthenticationContext = Class.bind(null, 'AuthenticationContext', BaseContext);

module.exports = AuthenticationContext({
    constructor: function (request) {
        this.__callParent('constructor', request);
    }
});
