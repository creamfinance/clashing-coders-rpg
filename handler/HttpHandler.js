var url = require('url');
var http = require('http');
var fs = require('fs');
var path = require('path');

module.exports = Class('HttpHandler', Object, {
    init: function (settings) {
        this.settings = settings || { port: 8000 };

        if (!this.settings.requestclass) {
            this.settings.requestclass = Request;
        }

        this.middlewares = [];
        this.listen();
    },
    listen: function () {
        var n = this.settings.port;
        console.log('Listening on :', this.settings.port);
        this.server = http.createServer(this.onRequest.bind(this))
            .on('error', this.error.bind(this))
            .listen(this.settings.port, function (err, reply) {
                // we got a socket path
                if (!isNaN(parseFloat(n)) && isFinite(n)) {
                } else {    
                    fs.chmodSync(n, '775');
                }
            });
    },
    shutdown: function () {
        this.server.close();
    },
    registerMiddleware: function (middleware) {
        this.middlewares.push(middleware);

        middleware.finishedHandle(this.handleNext.bind(this, middleware, this.middlewares.indexOf(middleware)));
    },
    handleNext: function (middleware, idx, request) {
        idx++;

        if (idx >= this.middlewares.length) {
            this.requestFinished(request);

            return;
        }

        this.middlewares[idx].handle(request);
    },
    onRequest: function (req, res) {
        // first request, init with -1
        this.handleNext(null, -1, new this.settings.requestclass(req, res));
    },
    requestFinished: function (request) {
        this.__event('requestFinished', arguments);
    },
    error: function (err) {
        this.__event('error', arguments);
    }
});
