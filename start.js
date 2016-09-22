var Class = require('class');

require('./bootstrap')(function () {
    var Router = require('./RestRoutingHandler'),
        HttpHandler = require('./handler/HttpHandler'),
        AuthenticationContext = require('./contexts/AuthenticationContext'),
        MinimalRequest = require('./MinimalRequest'),
        MoreAdvancedRequest = require('./request/moreadvancedrequest'),
        RateLimitMiddleware = require('./middleware/RateLimitMiddleware'),
        users = require('./users');

    var router = new Router;
    new (require('./controllers/AuthenticationController'))().registerRouter(router);
    new (require('./controllers/QuestController'))().registerRouter(router);
    new (require('./controllers/MetagameController'))().registerRouter(router);
    new (require('./controllers/AdminController'))().registerRouter(router);

    var webserver = new HttpHandler({
        requestclass: MoreAdvancedRequest,
        port: 8888,
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
