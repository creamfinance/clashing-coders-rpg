var Class = require('class');
var BaseHandler = Class.bind(null, 'BaseHandler');

BaseHandler(Object, {
    handle: function (request) {
        request.next();
    }
});
