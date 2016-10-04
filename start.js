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

var Class = require('class');
require('./bootstrap')(function () {
    var Router = require('./RestRoutingHandler'),
        HttpHandler = require('./handler/HttpHandler'),
        AuthenticationContext = require('./contexts/AuthenticationContext'),
        MinimalRequest = require('./MinimalRequest'),
        MoreAdvancedRequest = require('./request/moreadvancedrequest'),
        RateLimitMiddleware = require('./middleware/RateLimitMiddleware');

    var router = new Router;
    new (require('./controllers/AuthenticationController'))().registerRouter(router);
    new (require('./controllers/QuestController'))().registerRouter(router);
    new (require('./controllers/MetagameController'))().registerRouter(router);
    new (require('./controllers/AdminController'))().registerRouter(router);

    var port = process.env['CCC_PORT'] || 8888;
    var webserver = new HttpHandler({
        requestclass: MoreAdvancedRequest,
        port: port
    });

/*    webserver.registerMiddleware(new RateLimitMiddleware({
        enabled: true,
        requests: 400,
        time: 'min',
    }));*/

    webserver.error(function (err) {
        console.log(err);
    });

    webserver.requestFinished(function (request) {
            request.req.on('abort', function () {
                log('Request abort');
                request.end();
            });

            request.req.on('aborted', function () {
                log('Request aborted');
                request.end();
            });

            // Add the routing handler
            request.context = new AuthenticationContext(request);
            request.handlers = [ router ];
            request.handle();
    });
});
