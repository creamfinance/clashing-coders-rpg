var MoreAdvancedRequest = require('../request/moreadvancedrequest'),
    Middleware = require('./middleware'),
    RateLimiter = require('limiter').RateLimiter;
var RateLimitMiddleware = Class.bind(null, 'RateLimitMiddleware', Middleware);

module.exports = RateLimitMiddleware({
    constructor: function (settings) {
        this.settings = settings;
        this.rateLimiters = {};

        this.cleanupInterval = setInterval(this.cleanup.bind(this), 1000);
    },
    cleanup: function () {
        for (var ip in this.rateLimiters) {
            var state = this.rateLimiters[ip];

            // timeout all rate limiters after an hour
            if ((state.lastRequest + 3600 * 1000) < Date.now()) {
                delete this.rateLimiters[ip];
            }
        }
    },
    handle: function (request) {
        var that = this;
        var ip = request.ipaddress;

        if (!(ip in this.rateLimiters)) {
            this.rateLimiters[ip] = {
                rateLimiter: new RateLimiter(this.settings.requests, this.settings.time, true)
            };
        }

        var rateLimit = this.rateLimiters[ip];
        rateLimit.lastRequest = Date.now();
        rateLimit.rateLimiter.removeTokens(1, function (err, remainingTokens) {

            if (err || remainingTokens == -1) {
                return request.sendTooManyRequests();
            }

            // Upgrade the request to something more useful ;)
            request = new MoreAdvancedRequest(request.req, request.res);

            that.__callParent('handle', request);
        });
    },
});
