var Middleware = Class.bind(null, 'Middleware');

module.exports = Middleware(Object, {
    handle: function (request) {
        this.finishedHandle(request);
    },
    finishedHandle: function () {
        this.__event('finishedHandle', arguments);
    }
});
