/*
    Clashing Coders RPG Platform - The platform used for Creamfinance's first coding contest.
    Copyright (C) 2016 Florian Proksch

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

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
